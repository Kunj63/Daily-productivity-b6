import { getSupabaseClient, isSupabaseAvailable } from "./supabase"
import type { Task, DayData } from "@/types/productivity"

// Generate a simple user ID based on browser fingerprint
function getUserId(): string {
  if (typeof window === "undefined") return "server-user"

  let userId = localStorage.getItem("productivity-user-id")
  if (!userId) {
    // Create a simple fingerprint based on screen, timezone, and random
    const fingerprint = [
      screen.width,
      screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.language,
      Math.random().toString(36).substr(2, 9),
    ].join("-")

    userId = btoa(fingerprint)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substr(0, 20)
    localStorage.setItem("productivity-user-id", userId)
  }

  return userId
}

export class DatabaseService {
  private static userId = getUserId()
  private static readonly STORAGE_KEY = "productivity-tracker-data"
  private static supabaseWorking = false
  private static supabaseChecked = false

  // Check if Supabase tables exist (only check once)
  private static async checkSupabaseTables(): Promise<boolean> {
    if (this.supabaseChecked) return this.supabaseWorking

    this.supabaseChecked = true

    if (!isSupabaseAvailable()) {
      this.supabaseWorking = false
      return false
    }

    const supabase = getSupabaseClient()
    if (!supabase) {
      this.supabaseWorking = false
      return false
    }

    try {
      // Try a simple query to check if tables exist
      const { error } = await supabase.from("productivity_sessions").select("id").limit(1)

      this.supabaseWorking = !error
      return this.supabaseWorking
    } catch (error) {
      this.supabaseWorking = false
      return false
    }
  }

  // Primary storage: localStorage
  private static getLocalStorageData(): Record<string, DayData> {
    if (typeof window === "undefined") return {}
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Error loading from localStorage:", error)
      return {}
    }
  }

  private static saveToLocalStorage(allData: Record<string, DayData>): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  // Optional cloud sync with Supabase (silent failures)
  private static async syncToSupabase(date: string, data: DayData): Promise<boolean> {
    const tablesExist = await this.checkSupabaseTables()
    if (!tablesExist) return false

    const supabase = getSupabaseClient()
    if (!supabase) return false

    try {
      // Save session
      const { data: session, error: sessionError } = await supabase
        .from("productivity_sessions")
        .upsert(
          {
            user_id: this.userId,
            date,
            check_in_time: data.checkInTime,
            check_out_time: data.checkOutTime,
            total_awake_time: data.totalAwakeTime,
            total_productive_time: data.totalProductiveTime,
            total_non_productive_time: data.totalNonProductiveTime,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,date",
          },
        )
        .select()
        .single()

      if (sessionError) return false

      // Save tasks if session was created successfully
      if (session?.id && data.tasks.length > 0) {
        // Delete existing tasks for this session
        await supabase.from("tasks").delete().eq("session_id", session.id)

        // Insert new tasks
        const tasksToInsert = data.tasks.map((task) => ({
          id: task.id,
          user_id: this.userId,
          session_id: session.id,
          title: task.title,
          description: task.description,
          duration: task.duration,
          is_running: task.isRunning,
          is_paused: task.isPaused,
          last_start_time: task.lastStartTime,
          updated_at: new Date().toISOString(),
        }))

        const { error: tasksError } = await supabase.from("tasks").insert(tasksToInsert)
        if (tasksError) return false
      }

      return true
    } catch (error) {
      // Silent failure - don't log errors
      return false
    }
  }

  private static async loadFromSupabase(date: string): Promise<DayData | null> {
    const tablesExist = await this.checkSupabaseTables()
    if (!tablesExist) return null

    const supabase = getSupabaseClient()
    if (!supabase) return null

    try {
      // Get session data
      const { data: session, error: sessionError } = await supabase
        .from("productivity_sessions")
        .select("*")
        .eq("user_id", this.userId)
        .eq("date", date)
        .maybeSingle()

      if (sessionError || !session) return null

      // Get tasks for this session
      let tasks: Task[] = []
      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("session_id", session.id)
        .order("created_at", { ascending: true })

      if (!tasksError && tasksData) {
        tasks = tasksData.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description || "",
          duration: task.duration || 0,
          isRunning: task.is_running || false,
          isPaused: task.is_paused || false,
          lastStartTime: task.last_start_time,
        }))
      }

      return {
        checkInTime: session.check_in_time,
        checkOutTime: session.check_out_time,
        tasks,
        totalProductiveTime: session.total_productive_time || 0,
        totalNonProductiveTime: session.total_non_productive_time || 0,
        totalAwakeTime: session.total_awake_time || 0,
      }
    } catch (error) {
      // Silent failure
      return null
    }
  }

  // Public API
  static async getSessionData(date: string): Promise<DayData | null> {
    // Always use localStorage as primary source
    const allData = this.getLocalStorageData()
    const localData = allData[date]

    // Try to load from Supabase and merge if available (silent)
    try {
      const supabaseData = await this.loadFromSupabase(date)
      if (supabaseData && (!localData || supabaseData.totalAwakeTime > (localData.totalAwakeTime || 0))) {
        // If Supabase has more recent data, use it and update localStorage
        allData[date] = supabaseData
        this.saveToLocalStorage(allData)
        return supabaseData
      }
    } catch (error) {
      // Silent failure - continue with localStorage
    }

    return localData || null
  }

  static async saveSessionData(date: string, data: DayData): Promise<{ localStorage: boolean; supabase: boolean }> {
    // Always save to localStorage (primary storage)
    const allData = this.getLocalStorageData()
    allData[date] = data
    this.saveToLocalStorage(allData)

    // Try to sync to Supabase (optional, silent)
    let supabaseSuccess = false
    try {
      supabaseSuccess = await this.syncToSupabase(date, data)
    } catch (error) {
      // Silent failure
    }

    return {
      localStorage: true,
      supabase: supabaseSuccess,
    }
  }

  static async updateTaskDuration(taskId: string, duration: number): Promise<boolean> {
    // Update in localStorage first
    const allData = this.getLocalStorageData()
    const today = new Date().toISOString().split("T")[0]
    const todayData = allData[today]

    if (todayData) {
      const taskIndex = todayData.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        todayData.tasks[taskIndex].duration = duration
        this.saveToLocalStorage(allData)
      }
    }

    // Try to update in Supabase (optional, silent)
    try {
      const tablesExist = await this.checkSupabaseTables()
      if (tablesExist) {
        const supabase = getSupabaseClient()
        if (supabase) {
          await supabase
            .from("tasks")
            .update({
              duration,
              updated_at: new Date().toISOString(),
            })
            .eq("id", taskId)
            .eq("user_id", this.userId)
        }
      }
    } catch (error) {
      // Silent failure
    }

    return true
  }

  // Get sync status
  static async getConnectionStatus(): Promise<"localStorage" | "supabase" | "offline"> {
    if (typeof navigator !== "undefined" && !navigator.onLine) return "offline"

    const tablesExist = await this.checkSupabaseTables()
    return tablesExist ? "supabase" : "localStorage"
  }

  // Export data for backup
  static exportData(): string {
    const allData = this.getLocalStorageData()
    return JSON.stringify(allData, null, 2)
  }

  // Import data from backup
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      this.saveToLocalStorage(data)
      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }
}

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { DatabaseService } from "@/lib/database"
import type { Task, DayData } from "@/types/productivity"

export function useProductivityTracker() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [totalAwakeTime, setTotalAwakeTime] = useState(0)
  const [totalProductiveTime, setTotalProductiveTime] = useState(0)
  const [totalNonProductiveTime, setTotalNonProductiveTime] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkInTimestamp, setCheckInTimestamp] = useState<number | null>(null)
  const [syncStatus, setSyncStatus] = useState<"localStorage" | "supabase" | "offline">("localStorage")

  const today = new Date().toISOString().split("T")[0]
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const lastSaveRef = useRef<string>("")

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await DatabaseService.getSessionData(today)

      if (data) {
        setCheckInTime(data.checkInTime)
        setCheckOutTime(data.checkOutTime)
        setTasks(data.tasks || [])
        setTotalProductiveTime(data.totalProductiveTime || 0)
        setTotalNonProductiveTime(data.totalNonProductiveTime || 0)
        setTotalAwakeTime(data.totalAwakeTime || 0)
        setIsCheckedIn(!!data.checkInTime && !data.checkOutTime)

        // Set check-in timestamp for accurate timer calculation
        if (data.checkInTime && !data.checkOutTime) {
          const [hours, minutes] = data.checkInTime.split(":").map(Number)
          const checkInDate = new Date()
          checkInDate.setHours(hours, minutes, 0, 0)
          setCheckInTimestamp(checkInDate.getTime())
        }

        // Find running task and update its start time for accurate tracking
        const runningTask = data.tasks?.find((task) => task.isRunning)
        if (runningTask) {
          setRunningTaskId(runningTask.id)
          const now = new Date().toISOString()
          setTasks((prev) => prev.map((task) => (task.id === runningTask.id ? { ...task, lastStartTime: now } : task)))
        }
      }

      // Update sync status
      const status = await DatabaseService.getConnectionStatus()
      setSyncStatus(status)
    } catch (error) {
      console.error("Error loading data:", error)
      setSyncStatus("offline")
    } finally {
      setIsLoading(false)
    }
  }, [today])

  // Save data
  const saveData = useCallback(async () => {
    if (isLoading) return

    const currentData: DayData = {
      checkInTime,
      checkOutTime,
      tasks,
      totalProductiveTime,
      totalNonProductiveTime,
      totalAwakeTime,
    }

    const dataString = JSON.stringify(currentData)
    if (dataString === lastSaveRef.current) return

    try {
      const result = await DatabaseService.saveSessionData(today, currentData)
      if (result.localStorage) {
        lastSaveRef.current = dataString
      }

      // Update sync status based on save result
      if (result.supabase) {
        setSyncStatus("supabase")
      } else if (result.localStorage) {
        setSyncStatus("localStorage")
      } else {
        setSyncStatus("offline")
      }
    } catch (error) {
      console.error("Error saving data:", error)
      setSyncStatus("offline")
    }
  }, [today, checkInTime, checkOutTime, tasks, totalProductiveTime, totalNonProductiveTime, totalAwakeTime, isLoading])

  const handleCheckInOut = () => {
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 5)

    if (!isCheckedIn) {
      // Check in - start fresh from 00:00:00
      setIsCheckedIn(true)
      setCheckInTime(timeString)
      setCheckOutTime(null)
      setTotalAwakeTime(0)
      setTotalProductiveTime(0)
      setTotalNonProductiveTime(0)
      setCheckInTimestamp(now.getTime())
      // Clear any existing tasks for the new day
      setTasks([])
      setRunningTaskId(null)
    } else {
      // Check out
      setIsCheckedIn(false)
      setCheckOutTime(timeString)
      setCheckInTimestamp(null)

      // Stop any running task
      if (runningTaskId) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === runningTaskId ? { ...task, isRunning: false, isPaused: false, lastStartTime: null } : task,
          ),
        )
        setRunningTaskId(null)
      }
    }
  }

  // Update timers and sync task durations
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isCheckedIn && checkInTimestamp) {
      interval = setInterval(async () => {
        const now = new Date()
        const elapsedMs = now.getTime() - checkInTimestamp
        const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000))

        setTotalAwakeTime(elapsedSeconds)

        // Update running task duration
        if (runningTaskId) {
          setTasks((prev) =>
            prev.map((task) => {
              if (task.id === runningTaskId && task.isRunning && task.lastStartTime) {
                const taskStartTime = new Date(task.lastStartTime)
                const taskElapsed = Math.floor((now.getTime() - taskStartTime.getTime()) / 1000)
                const newDuration = task.duration + taskElapsed

                // Update in database every 30 seconds to reduce API calls
                if (taskElapsed > 0 && taskElapsed % 30 === 0) {
                  DatabaseService.updateTaskDuration(task.id, newDuration).catch(() => {
                    // Silent failure
                  })
                }

                return { ...task, duration: newDuration, lastStartTime: now.toISOString() }
              }
              return task
            }),
          )
        }

        // Calculate productive time
        const productiveTime = tasks.reduce((sum, task) => sum + task.duration, 0)
        setTotalProductiveTime(productiveTime)
        setTotalNonProductiveTime(Math.max(0, elapsedSeconds - productiveTime))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCheckedIn, checkInTimestamp, runningTaskId, tasks])

  // Save data when it changes (debounced)
  useEffect(() => {
    if (!isLoading) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveData()
      }, 1000)

      return () => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }
      }
    }
  }, [saveData, isLoading])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Save data before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isLoading) {
        saveData()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [saveData, isLoading])

  // Monitor online status
  useEffect(() => {
    const updateStatus = async () => {
      const status = await DatabaseService.getConnectionStatus()
      setSyncStatus(status)
    }

    const handleOnline = () => updateStatus()
    const handleOffline = () => setSyncStatus("offline")

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const createTask = (title: string, description: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      duration: 0,
      isRunning: false,
      isPaused: false,
      lastStartTime: null,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (taskId: string, title: string, description: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, title, description } : task)))
  }

  const deleteTask = (taskId: string) => {
    if (runningTaskId === taskId) {
      setRunningTaskId(null)
    }
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const startTask = (taskId: string) => {
    const now = new Date().toISOString()

    // Stop current running task
    if (runningTaskId) {
      setTasks((prev) =>
        prev.map((task) => (task.id === runningTaskId ? { ...task, isRunning: false, lastStartTime: null } : task)),
      )
    }

    // Start new task
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isRunning: true, isPaused: false, lastStartTime: now } : task,
      ),
    )
    setRunningTaskId(taskId)
  }

  const pauseTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isRunning: false, isPaused: true, lastStartTime: null } : task,
      ),
    )
    setRunningTaskId(null)
  }

  const resumeTask = (taskId: string) => {
    const now = new Date().toISOString()

    // Stop current running task
    if (runningTaskId) {
      setTasks((prev) =>
        prev.map((task) => (task.id === runningTaskId ? { ...task, isRunning: false, lastStartTime: null } : task)),
      )
    }

    // Resume task
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isRunning: true, isPaused: false, lastStartTime: now } : task,
      ),
    )
    setRunningTaskId(taskId)
  }

  return {
    isCheckedIn,
    checkInTime,
    checkOutTime,
    totalAwakeTime,
    totalProductiveTime,
    totalNonProductiveTime,
    tasks,
    runningTaskId,
    isLoading,
    syncStatus,
    handleCheckInOut,
    createTask,
    updateTask,
    deleteTask,
    startTask,
    pauseTask,
    resumeTask,
  }
}

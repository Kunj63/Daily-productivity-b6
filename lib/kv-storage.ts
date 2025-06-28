export interface StorageData {
  [date: string]: {
    checkInTime: string | null
    checkOutTime: string | null
    tasks: any[]
    totalProductiveTime: number
    totalNonProductiveTime: number
    totalAwakeTime: number
  }
}

export class ProductivityStorage {
  private static readonly KV_KEY = "productivity-tracker"
  private static readonly STORAGE_KEY = "productivity-tracker"

  // Check if KV is available
  private static isKVAvailable(): boolean {
    return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  }

  static async getData(): Promise<StorageData> {
    // Always use localStorage for now since KV requires environment setup
    return this.getLocalStorageData()
  }

  static async saveData(data: StorageData): Promise<void> {
    // Always use localStorage for now since KV requires environment setup
    this.saveToLocalStorage(data)
  }

  private static getLocalStorageData(): StorageData {
    if (typeof window === "undefined") return {}
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Error loading from localStorage:", error)
      return {}
    }
  }

  private static saveToLocalStorage(data: StorageData): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }
}

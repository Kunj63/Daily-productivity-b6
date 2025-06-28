export interface Task {
  id: string
  title: string
  description: string
  duration: number
  isRunning: boolean
  isPaused: boolean
  lastStartTime: string | null
}

export interface DayData {
  checkInTime: string | null
  checkOutTime: string | null
  tasks: Task[]
  totalProductiveTime: number
  totalNonProductiveTime: number
  totalAwakeTime: number
}

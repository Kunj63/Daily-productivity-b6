"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MainTimerProps {
  totalAwakeTime: number
  totalProductiveTime: number
  totalNonProductiveTime: number
  isCheckedIn: boolean
  isLoading: boolean
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function MainTimer({
  totalAwakeTime,
  totalProductiveTime,
  totalNonProductiveTime,
  isCheckedIn,
  isLoading,
}: MainTimerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-[#1A1A1A] border-gray-800">
            <CardContent className="p-4 sm:p-6 text-center">
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <Skeleton className="h-16 w-40 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!isCheckedIn) {
    return (
      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardContent className="p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-400">Ready to start your productive day?</h2>
          <p className="text-gray-500 text-sm sm:text-base">Click "Check In" to begin tracking your time and tasks.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardContent className="p-4 sm:p-6 text-center">
          <h3 className="text-sm sm:text-base font-medium text-gray-400 mb-2 sm:mb-4">Total Awake Time</h3>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-white">
            {formatTime(totalAwakeTime)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardContent className="p-4 sm:p-6 text-center">
          <h3 className="text-sm sm:text-base font-medium text-gray-400 mb-2 sm:mb-4">Productive Time</h3>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-green-500">
            {formatTime(totalProductiveTime)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardContent className="p-4 sm:p-6 text-center">
          <h3 className="text-sm sm:text-base font-medium text-gray-400 mb-2 sm:mb-4">Non-Productive Time</h3>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-yellow-500">
            {formatTime(totalNonProductiveTime)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

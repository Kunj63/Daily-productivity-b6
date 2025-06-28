"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InstructionsModal } from "./instructions-modal"
import { HelpCircle, Database, HardDrive, WifiOff } from "lucide-react"

interface NavbarProps {
  isCheckedIn: boolean
  totalAwakeTime: number
  onCheckInOut: () => void
  syncStatus: "localStorage" | "supabase" | "offline"
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function Navbar({ isCheckedIn, totalAwakeTime, onCheckInOut, syncStatus }: NavbarProps) {
  const [showInstructions, setShowInstructions] = useState(false)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const getStatusInfo = () => {
    switch (syncStatus) {
      case "supabase":
        return {
          icon: Database,
          text: "Cloud Synced",
          color: "text-green-500",
          description: "Data synced to cloud database",
        }
      case "localStorage":
        return {
          icon: HardDrive,
          text: "Local Storage",
          color: "text-blue-500",
          description: "Data saved locally on this device",
        }
      case "offline":
        return {
          icon: WifiOff,
          text: "Offline",
          color: "text-yellow-500",
          description: "No internet connection",
        }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <>
      <nav className="bg-[#1A1A1A] border-b border-gray-800 px-3 sm:px-4 py-3 sm:py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isCheckedIn ? "bg-green-500" : "bg-gray-500"}`} />
              <span className="text-sm sm:text-base font-medium">{today}</span>
            </div>
            {isCheckedIn && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
                <span>Awake:</span>
                <span className="font-mono text-white">{formatTime(totalAwakeTime)}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-xs" title={statusInfo.description}>
              <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
              <span className={`hidden sm:inline ${statusInfo.color}`}>{statusInfo.text}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInstructions(true)}
              className="text-gray-400 hover:text-white"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Help</span>
            </Button>
            <Button
              onClick={onCheckInOut}
              className={`${
                isCheckedIn ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
              } font-medium px-3 sm:px-4 py-2`}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </Button>
          </div>
        </div>
      </nav>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
    </>
  )
}

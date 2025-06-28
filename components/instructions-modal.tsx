"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Play, FileText, Database, HardDrive } from "lucide-react"

interface InstructionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            How to Use Daily Productivity Tracker
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-[#0D0D0D] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">1. Check In/Out</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Start your day by clicking <strong>"Check In"</strong> when you wake up. This begins tracking your
                    total awake time. Click <strong>"Check Out"</strong> before going to sleep to end the session and
                    generate your daily report.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">2. Create Tasks</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Click <strong>"Create Task"</strong> to add activities you want to track. Give each task a clear
                    title and optional description. Tasks help you categorize and measure your productive time
                    throughout the day.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Play className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">3. Track Time</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Click <strong>"Start"</strong> on a task when you begin working on it. Only one task can run at a
                    time. Use <strong>"Pause"</strong> for breaks and <strong>"Resume"</strong> to continue. The app
                    automatically calculates productive vs non-productive time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <FileText className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">4. Daily Reports</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    After checking out, generate an HTML report of your day. The report includes your total awake time,
                    productive time, non-productive time, and a breakdown of all tasks with their durations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
              <HardDrive className="w-4 h-4 mr-2" />💾 Data Storage
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>
                • <strong>Primary:</strong> All data is saved locally on your device (always works)
              </li>
              <li>
                • <strong>Optional:</strong> Cloud sync with Supabase (if configured)
              </li>
              <li>
                • <strong>Reliable:</strong> Your data is safe even without internet
              </li>
              <li>
                • <strong>Private:</strong> No accounts required, data stays on your device
              </li>
            </ul>
          </div>

          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <h4 className="font-semibold text-green-400 mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Works completely offline - no internet required</li>
              <li>• Tasks continue tracking even if you close the browser</li>
              <li>• Use descriptive task names for better reports</li>
              <li>• Check your productive vs non-productive time ratio daily</li>
              <li>• Data is automatically saved every second</li>
            </ul>
          </div>

          <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
            <h4 className="font-semibold text-purple-400 mb-2 flex items-center">
              <Database className="w-4 h-4 mr-2" />🚀 Optional: Cloud Sync Setup
            </h4>
            <p className="text-sm text-gray-300 mb-2">To enable cloud synchronization across devices:</p>
            <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
              <li>Create a free Supabase account</li>
              <li>Run the SQL script in your Supabase dashboard</li>
              <li>Add your Supabase credentials to environment variables</li>
              <li>Your data will automatically sync across all devices!</li>
            </ol>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white px-8">
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

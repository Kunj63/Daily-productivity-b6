"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Play, Pause, Edit, Trash2 } from "lucide-react"
import type { Task } from "@/types/productivity"

interface TaskListProps {
  tasks: Task[]
  runningTaskId: string | null
  onCreateTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onStartTask: (taskId: string) => void
  onPauseTask: (taskId: string) => void
  onResumeTask: (taskId: string) => void
  isLoading: boolean
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function TaskList({
  tasks,
  runningTaskId,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onStartTask,
  onPauseTask,
  onResumeTask,
  isLoading,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="bg-[#1A1A1A] border-gray-800">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">Tasks</h2>
        <Button onClick={onCreateTask} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardContent className="p-6 sm:p-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              No tasks yet. Create your first task to start tracking your productivity!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="bg-[#1A1A1A] border-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{task.title}</h3>
                    {task.description && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{task.description}</p>}
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-400">
                        Duration: <span className="font-mono text-white">{formatDuration(task.duration)}</span>
                      </span>
                      {task.isRunning && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full animate-pulse">
                          Running
                        </span>
                      )}
                      {task.isPaused && (
                        <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">Paused</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {task.isRunning ? (
                      <Button
                        onClick={() => onPauseTask(task.id)}
                        variant="outline"
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600"
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        onClick={() => (task.isPaused ? onResumeTask(task.id) : onStartTask(task.id))}
                        variant="outline"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                        disabled={runningTaskId !== null && runningTaskId !== task.id}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        {task.isPaused ? "Resume" : "Start"}
                      </Button>
                    )}

                    <Button
                      onClick={() => onEditTask(task)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => onDeleteTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

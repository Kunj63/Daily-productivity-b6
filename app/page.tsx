"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { MainTimer } from "@/components/main-timer"
import { TaskList } from "@/components/task-list"
import { PDFReportGenerator } from "@/components/pdf-report-generator"
import { TaskFormModal } from "@/components/task-form-modal"
import { Footer } from "@/components/footer"
import { useProductivityTracker } from "@/hooks/use-productivity-tracker"
import type { Task } from "@/types/productivity"

export default function ProductivityTracker() {
  const {
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
  } = useProductivityTracker()

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleCreateTask = (taskData: { title: string; description: string }) => {
    createTask(taskData.title, taskData.description)
    setIsTaskModalOpen(false)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleUpdateTask = (taskData: { title: string; description: string }) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData.title, taskData.description)
      setEditingTask(null)
      setIsTaskModalOpen(false)
    }
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      <Navbar
        isCheckedIn={isCheckedIn}
        totalAwakeTime={totalAwakeTime}
        onCheckInOut={handleCheckInOut}
        syncStatus={syncStatus}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8 flex-1">
        <MainTimer
          totalAwakeTime={totalAwakeTime}
          totalProductiveTime={totalProductiveTime}
          totalNonProductiveTime={totalNonProductiveTime}
          isCheckedIn={isCheckedIn}
          isLoading={isLoading}
        />

        <TaskList
          tasks={tasks}
          runningTaskId={runningTaskId}
          onCreateTask={() => setIsTaskModalOpen(true)}
          onEditTask={handleEditTask}
          onDeleteTask={deleteTask}
          onStartTask={startTask}
          onPauseTask={pauseTask}
          onResumeTask={resumeTask}
          isLoading={isLoading}
        />

        {checkOutTime && !isLoading && (
          <PDFReportGenerator
            date={new Date().toISOString().split("T")[0]}
            checkInTime={checkInTime}
            checkOutTime={checkOutTime}
            totalAwakeTime={totalAwakeTime}
            totalProductiveTime={totalProductiveTime}
            totalNonProductiveTime={totalNonProductiveTime}
            tasks={tasks}
          />
        )}
      </main>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask ? { title: editingTask.title, description: editingTask.description } : undefined}
        title={editingTask ? "Edit Task" : "Create New Task"}
      />

      <Footer />
    </div>
  )
}

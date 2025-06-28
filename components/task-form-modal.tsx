"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { title: string; description: string }) => void
  initialData?: { title: string; description: string }
  title: string
}

export function TaskFormModal({ isOpen, onClose, onSubmit, initialData, title }: TaskFormModalProps) {
  const [taskTitle, setTaskTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (initialData) {
      setTaskTitle(initialData.title)
      setDescription(initialData.description)
    } else {
      setTaskTitle("")
      setDescription("")
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskTitle.trim()) {
      onSubmit({ title: taskTitle.trim(), description: description.trim() })
      setTaskTitle("")
      setDescription("")
    }
  }

  const handleClose = () => {
    setTaskTitle("")
    setDescription("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-sm font-medium text-gray-300">
              Task Title *
            </Label>
            <Input
              id="task-title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="bg-[#0D0D0D] border-gray-700 text-white placeholder-gray-500 focus:border-green-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description" className="text-sm font-medium text-gray-300">
              Description
            </Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)..."
              className="bg-[#0D0D0D] border-gray-700 text-white placeholder-gray-500 focus:border-green-500 min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              {initialData ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

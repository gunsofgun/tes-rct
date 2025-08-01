"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Book, CreateBookRequest } from "@/types/book"
import { Loader2 } from "lucide-react"

interface BookFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (book: CreateBookRequest) => Promise<void>
  editingBook?: Book | null
  isLoading?: boolean
}

export function BookForm({ isOpen, onClose, onSubmit, editingBook, isLoading = false }: BookFormProps) {
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: "",
    body: "",
    userId: 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        body: editingBook.body,
        userId: editingBook.userId,
      })
    } else {
      setFormData({
        title: "",
        body: "",
        userId: 1,
      })
    }
    setErrors({})
  }, [editingBook, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long"
    }

    if (!formData.body.trim()) {
      newErrors.body = "Description is required"
    } else if (formData.body.trim().length < 10) {
      newErrors.body = "Description must be at least 10 characters long"
    }

    if (formData.userId < 1) {
      newErrors.userId = "User ID must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleInputChange = (field: keyof CreateBookRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            {editingBook
              ? "Make changes to the book details below."
              : "Fill in the details to add a new book to your collection."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter book title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Description</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => handleInputChange("body", e.target.value)}
              placeholder="Enter book description"
              rows={4}
              className={errors.body ? "border-red-500" : ""}
            />
            {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">Author ID</Label>
            <Input
              id="userId"
              type="number"
              value={formData.userId}
              onChange={(e) => handleInputChange("userId", Number.parseInt(e.target.value) || 1)}
              placeholder="Enter author ID"
              min="1"
              className={errors.userId ? "border-red-500" : ""}
            />
            {errors.userId && <p className="text-sm text-red-500">{errors.userId}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingBook ? "Update Book" : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

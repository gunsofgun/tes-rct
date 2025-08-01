"use client"

import type { Book } from "@/types/book"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Loader2 } from "lucide-react"
import { useState } from "react"

interface BookListProps {
  books: Book[]
  onEdit: (book: Book) => void
  onDelete: (id: number) => Promise<void>
  isLoading?: boolean
  isDeleting?: number | null
}

export function BookList({ books, onEdit, onDelete, isLoading = false, isDeleting = null }: BookListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      await onDelete(bookToDelete.id)
      setDeleteDialogOpen(false)
      setBookToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading books...</span>
        </CardContent>
      </Card>
    )
  }

  if (books.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Books Found</CardTitle>
          <CardDescription>{'You haven\'t added any books yet. Click "Add New Book" to get started.'}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Books Collection</CardTitle>
          <CardDescription>Manage your book collection. You can edit or delete any book.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px]">Author ID</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.id}</TableCell>
                    <TableCell className="font-semibold">{book.title}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{book.body}</p>
                    </TableCell>
                    <TableCell>{book.userId}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(book)}
                          disabled={isDeleting === book.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(book)}
                          disabled={isDeleting === book.id}
                        >
                          {isDeleting === book.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book
              {bookToDelete && <span className="font-semibold"> "{bookToDelete.title}"</span>} from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

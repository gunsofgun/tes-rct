"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BookList } from "@/components/book-list"
import { BookForm } from "@/components/book-form"
import { booksApi } from "@/lib/api"
import type { Book, CreateBookRequest } from "@/types/book"
import { Plus, RefreshCw } from "lucide-react"

export default function BooksApp() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load books on component mount
  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedBooks = await booksApi.getBooks()
      // Limit to first 20 books for better performance
      setBooks(fetchedBooks.slice(0, 20))
    } catch (err) {
      setError("Failed to load books. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load books. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBook = () => {
    setEditingBook(null)
    setIsFormOpen(true)
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (bookData: CreateBookRequest) => {
    try {
      setIsSubmitting(true)

      if (editingBook) {
        // Update existing book
        const updatedBook = await booksApi.updateBook({
          ...bookData,
          id: editingBook.id,
        })

        setBooks((prev) => prev.map((book) => (book.id === editingBook.id ? updatedBook : book)))

        toast({
          title: "Success",
          description: "Book updated successfully!",
        })
      } else {
        // Create new book
        const newBook = await booksApi.createBook(bookData)
        // Add to the beginning of the list
        setBooks((prev) => [newBook, ...prev])

        toast({
          title: "Success",
          description: "Book added successfully!",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: editingBook ? "Failed to update book. Please try again." : "Failed to add book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBook = async (id: number) => {
    try {
      setIsDeleting(id)
      await booksApi.deleteBook(id)

      setBooks((prev) => prev.filter((book) => book.id !== id))

      toast({
        title: "Success",
        description: "Book deleted successfully!",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleRefresh = () => {
    loadBooks()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold">Books CRUD App</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Manage your book collection with full CRUD operations
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button onClick={handleAddBook}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Book
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" onClick={loadBooks} className="mt-2 bg-transparent" disabled={isLoading}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Books List */}
        <BookList
          books={books}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          isLoading={isLoading}
          isDeleting={isDeleting}
        />

        {/* Book Form Modal */}
        <BookForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          editingBook={editingBook}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
}

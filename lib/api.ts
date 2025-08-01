import axios from "axios"
import type { Book, CreateBookRequest, UpdateBookRequest } from "@/types/book"

const API_BASE_URL = "https://jsonplaceholder.typicode.com"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const booksApi = {
  // Get all books (using posts endpoint)
  getBooks: async (): Promise<Book[]> => {
    const response = await api.get("/posts")
    return response.data
  },

  // Get a single book by ID
  getBook: async (id: number): Promise<Book> => {
    const response = await api.get(`/posts/${id}`)
    return response.data
  },

  // Create a new book
  createBook: async (book: CreateBookRequest): Promise<Book> => {
    const response = await api.post("/posts", book)
    return response.data
  },

  // Update an existing book
  updateBook: async (book: UpdateBookRequest): Promise<Book> => {
    const response = await api.put(`/posts/${book.id}`, book)
    return response.data
  },

  // Delete a book
  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`)
  },
}

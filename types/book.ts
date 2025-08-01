export interface Book {
  id: number
  title: string
  body: string
  userId: number
}

export interface CreateBookRequest {
  title: string
  body: string
  userId: number
}

export interface UpdateBookRequest extends CreateBookRequest {
  id: number
}

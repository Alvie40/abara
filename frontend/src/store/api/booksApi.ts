import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Book } from '../../types'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }),
  tagTypes: ['Book'],
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], void>({
      query: () => 'books',
      providesTags: ['Book']
    }),
    getBook: builder.query<Book, number>({
      query: (id) => `books/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Book', id }]
    })
  })
})
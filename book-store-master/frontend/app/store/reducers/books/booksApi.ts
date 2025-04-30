import { createApi } from '@reduxjs/toolkit/query/react';
import { Book } from "@/app/types/book.type";
import DynamicBaseQuery from "@/app/store/dynamic-base-query";

const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery: DynamicBaseQuery,
    tagTypes: ['Book'],
    endpoints: (builder) => ({
        getBooks: builder.query<Book[], void>({
            query: (args) => {
                return {
                    url: '/books',
                    method: 'GET',
                }
            }
        }),
        getBook: builder.query<Book, number>({
            query: (id) => {
                return {
                    url: `/books/${id}`,
                    method: 'GET'
                }
            }
        }),
        addBook: builder.mutation<Book, Book>({
            query: (book) => ({
                url: '',
                method: 'POST',
                body: book
            })
        }),
        updateBook: builder.mutation<Book, Book>({
            query: (book) => ({
                url: '',
                method: 'PUT',
                body: book
            })
        }),
        deleteBook: builder.mutation<void, number>({
            query: (id) => ({
                url: id.toString(),
                method: 'DELETE'
            })
        })
    })
});

export const {
    useGetBooksQuery,
    useGetBookQuery,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation
} = booksApi;

export default booksApi;
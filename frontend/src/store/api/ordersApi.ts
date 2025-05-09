import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Order } from '../../types'
import { RootState } from '..'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getUserOrders: builder.query<Order[], void>({
      query: () => 'orders/user-orders',
      providesTags: ['Order']
    }),
    addOrder: builder.mutation<Order, Omit<Order, 'id' | 'created_at' | 'updated_at'>>({
      query: (order) => ({
        url: 'orders',
        method: 'POST',
        body: order
      }),
      invalidatesTags: ['Order']
    })
  })
})

export const {
  useGetUserOrdersQuery,
  useAddOrderMutation
} = ordersApi
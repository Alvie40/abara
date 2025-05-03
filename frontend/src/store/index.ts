import { configureStore } from '@reduxjs/toolkit'
import { booksApi } from './api/booksApi'
import { ordersApi } from './api/ordersApi'
import { authApi } from './api/authApi'
import cartReducer from './reducers/cartSlice'
import authReducer from './reducers/authSlice'

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      ordersApi.middleware,
      authApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
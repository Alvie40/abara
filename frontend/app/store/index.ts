import { configureStore } from '@reduxjs/toolkit'
import booksApi from "@/app/store/reducers/books/booksApi";
import cartReducer from "@/app/store/reducers/cart/cartSlice";
import ordersApi from "@/app/store/reducers/orders/ordersApi";


export const store = configureStore({
    reducer: {
        cart: cartReducer,
        [booksApi.reducerPath]: booksApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
    },
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({}).concat(
            booksApi.middleware, ordersApi.middleware
        ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
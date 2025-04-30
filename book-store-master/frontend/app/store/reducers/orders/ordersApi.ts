import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/app/store/dynamic-base-query";

const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: DynamicBaseQuery,
    tagTypes: ['order'],
    endpoints: (builder) => ({
        getUserOrders: builder.query<void, void>({
            query: () => {
                return {
                    url: '/user-orders',
                    method: 'GET',
                }
            }
        }),
        getOrder: builder.query<void, number>({
            query: (id) => {
                return {
                    url: `orders/${id}`,
                    method: 'GET'
                }
            }
        }),
        addOrder: builder.mutation<void, void>({
            query: (order) => ({
                url: '/orders',
                method: 'POST',
                body: order
            })
        }),
    })
});

export const {
    useGetUserOrdersQuery,
    useGetOrderQuery,
    useAddOrderMutation,
} = ordersApi;

export default ordersApi;

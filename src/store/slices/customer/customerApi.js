import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
    reducerPath: 'customerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        fetchCustomers: builder.query({
            query: ({id, mgmt_id, customer_name}) => {

                const params = new URLSearchParams();
                params.append('mgmt_id', mgmt_id)

                if (id) params.append('id', id)
                if (customer_name) params.append('customerName', customer_name)

                return ({
                    url: `customer?${params}`,
                    method: "GET",
                })
            }
        }),
        bookRoom: builder.mutation({
            query: (bookingData) => ({
                url: `onboard-room-selection/generate-booking`,
                method: "POST",
                body: bookingData,
            }),
        }),
    })
})

export const {
    useFetchCustomersQuery,
    useBookRoomMutation,
} = customerApi;
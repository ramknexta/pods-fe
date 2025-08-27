import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const onboardApi = createApi({
    reducerPath: 'onboardApi',
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
        onboardCustomer: builder.mutation({
            query: (data) => ({
                url: `/bulk-upload/addCustomers`,
                method: "POST",
                body: data,
            })
        })
    })
})

export const {
    useOnboardCustomerMutation,
} = onboardApi;
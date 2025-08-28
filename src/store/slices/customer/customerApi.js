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
        fetchCustomerById: builder.query({
            query: ({id, mgmt_id}) => ({
                url: `customer?id=${id}&mgmt_id=${mgmt_id}`,
                method: "GET",
            })
        })
    })
})

export const {
    useFetchCustomerByIdQuery,
} = customerApi;
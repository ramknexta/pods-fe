import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const allocationApi = createApi({
    reducerPath: 'allocationApi',
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
        fetchAllocationList: builder.query({
            query: () => ({ url: "/customer-room-allocation/customers", method: "GET" }),
        }),
        getAvailableRooms: builder.query({
            query: ({branchId, customerId}) => ({
                url: `/customer-room-allocation/available-rooms?branch_id=${branchId}&customerId=${customerId}`,
                method: "GET"
            }),
        }),
        allocateRoom: builder.mutation({
            query: (data, id) => ({
                url: `/customer-room-allocation/${id}/allocate`,
                method: "POST",
                body: data,
            }),
        }),
        removeRoomAllocation: builder.mutation({
            query: (id) => ({
                url: `/customer-room-allocation/${id}`,
                method: "DELETE",
            }),
        })
    })
})

export const {
    useFetchAllocationListQuery,
    useLazyGetAvailableRoomsQuery,
    useGetAvailableRoomsQuery,
    useAllocateRoomMutation,
    useRemoveRoomAllocationMutation,
} = allocationApi;
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const invoiceApi = createApi({
    reducerPath: 'invoiceApi',
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
        fetchInvoices: builder.query({
            query: (mgmt_id, page=1, limit=20) => ({
                url: `/invoice?mgmt_id=${mgmt_id}&page=${page}&limit=${limit}`,
                method: "GET"
            }),
        }),
        fetchInvoiceDetails: builder.query({
            query: (mgmt_id) => ({
                    url: `/invoice/detail?mgmt_id=${mgmt_id}`,
                    method: "GET"
                }),
        }),
        getInvoicePdf: builder.query({
            query: (id) => ({
                url: `/invoice/pdf?id=${id}`,
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
        }),
        createInvoice: builder.mutation({
            query: (data) => ({
                url: `/invoice/createInvoice?mgmt_id=${data.mgmt_id}&branch_id=${data.branch_id}`,
                method: "POST",
                body: data.data,
            }),
        }),
        getInvoiceByNo: builder.query({
            query: (invoice_no) => ({
                url: `/invoice/byInvoiceNo?invoiceNo=${invoice_no}`,
                method: "GET",
            }),
        })
    })
})

export const {
    useFetchInvoicesQuery,
    useFetchInvoiceDetailsQuery,
    useLazyGetInvoicePdfQuery,
    useCreateInvoiceMutation,
    useGetInvoiceByNoQuery,
} = invoiceApi;
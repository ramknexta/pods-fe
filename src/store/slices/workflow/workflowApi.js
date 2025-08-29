import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const workflowApi = createApi({
    reducerPath: 'workflowApi',
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
        fetchWorkflowByBranchId: builder.query({
            query: ({mgmt_id, branch_id}) => ({
                url: `/workflow?mgmt_id=${mgmt_id}&branch_id=${branch_id}`,
                method: "GET"
            }),
        }),
        fetchDefaultWorkflow: builder.query({
            query: ({id, mgmt_id, branch_id}) => ({
                url: `/workflow?id=${id}&mgmt_id=${mgmt_id}&branch_id=${branch_id}`,
                method: "GET"
            }),
        }),
        fetchEmailTemplate: builder.query({
            query: ({mgmt_id, getall}) => ({
                url: `/template/list?mgmt_id=${mgmt_id}&getall=${getall}`,
                method: "GET"
            }),
        }),
        fetchEmailTemplateByName: builder.query({
            query: ({tempName, temp_id, mgmt_id}) => ({
                url: `/template/by-name?templateName=${encodeURIComponent(tempName)}&temp_id=${temp_id}&mgmt_id=${mgmt_id}`,
                method: "GET"
            }),
        }),
        fetchWhatsappTemplate: builder.query({
            query: ({id}) => ({
                url: `/watemplate/list?mgmt_id=${id}`,
                method: "GET"
            }),
        }),
        fetchWhatsappTemplateByName: builder.query({
            query: ({tempName, temp_id, mgmt_id}) => ({
                url: `/watemplate/data?templateName=${encodeURIComponent(tempName)}&temp_id=${temp_id}&mgmt_id=${mgmt_id}`,
            })
        })
    })
})

export const {
    useFetchWorkflowByBranchIdQuery,
    useFetchDefaultWorkflowQuery,
    useLazyFetchDefaultWorkflowQuery,
    useFetchEmailTemplateQuery,
    useLazyFetchEmailTemplateByNameQuery,
    useFetchWhatsappTemplateQuery,
    useLazyFetchWhatsappTemplateByNameQuery,
} = workflowApi;
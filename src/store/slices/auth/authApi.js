import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: 'authApi',
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
        login: builder.mutation({
            query: (data) => {
                delete data['userType']
                return {
                    url: '/user/login',
                    method: 'POST',
                    body: data
                }
            },
        }),
        registerCustomer: builder.mutation({
            query: (data) => ({
                url: 'auth/customer/register',
                method: 'POST',
                body: data,
            }),
        }),
        registerAdmin: builder.mutation({
            query: (data) => ({
                url: 'auth/admin/register',
                method: 'POST',
                body: data,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: 'auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),
        verifyResetCode: builder.mutation({
            query: (data) => ({
                url: 'auth/verify-reset-code',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: 'auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: 'auth/change-password',
                method: 'POST',
                body: data,
            }),
        }),
        fetchUser: builder.query({
            query: () => '/auth/profile',
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `/auth/profile`,
                method: 'PUT',
                body: data
            })
        }),
        updateAdmin: builder.mutation({
            query: (data) => ({
                url: `/auth/admin-profile`,
                method: 'PUT',
                body: data
            })
        }),
        verifyNumber: builder.mutation({
            query: (data) => ({
                url: '/auth/verify-number',
                method: 'POST',
                body: data
            })
        }),
        sendOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/send-otp',
                method: 'POST',
                body: data
            }),
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: data
            }),
        }),
        checkMailAccess: builder.query({
            query: () => '/mail/get-mail-sync-status',
        }),
        fetchRedirectingToken: builder.query({
            query: () => '/user/redirecting-token',
        })
    })
})

export const {
    useLoginMutation,
    useSendOtpMutation,
    useVerifyNumberMutation,
    useForgotPasswordMutation,
    useVerifyResetCodeMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useVerifyOtpMutation,
    useRegisterCustomerMutation,
    useRegisterAdminMutation,
    useFetchUserQuery,
    useUpdateUserMutation,
    useUpdateAdminMutation,
    useLazyCheckMailAccessQuery,
    useLazyFetchRedirectingTokenQuery,
} = authApi;
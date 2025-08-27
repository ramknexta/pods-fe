// src/services/managementApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const managementApi = createApi({
    reducerPath: "managementApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        fetchManagement: builder.query({
            query: () => ({ url: "/management/all", method: "GET" }),
        }),

        fetchBranchByMgmtId: builder.query({
            query: (id) => ({
                url: `/management/branches?mgmt_id=${id}`,
                method: "GET",
            }),
        }),

        fetchAvailableRooms: builder.query({
            query: (id) => ({
                url: `/management/rooms/available/?branch_id=${id}`,
                method: "GET",
            }),
        }),
        fetchDashboardData: builder.query({
            async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                try {
                    // Step 1: Get all managements
                    const managementRes = await baseQuery({ url: "/management/all" });
                    if (managementRes.error) return { error: managementRes.error };

                    const managementData = managementRes.data?.data || [];
                    const managementsArray = Array.isArray(managementData)
                        ? managementData
                        : [managementData];

                    let totalBranches = 0;
                    let totalRooms = 0;
                    let totalCapacity = 0;
                    let totalCompanies = 0;
                    const branchesWithDetails = [];
                    const companiesWithDetails = [];

                    // Step 2: Loop through managements
                    for (const mgmt of managementsArray) {
                        const mgmtId = mgmt.mgmt_id || mgmt.id;
                        const mgmtName = mgmt.mgmt_name || mgmt.company_name;

                        // Fetch branches
                        const branchRes = await baseQuery({
                            url: `/management/branches?mgmt_id=${mgmtId}`,
                        });
                        const branches = branchRes.data?.data || [];
                        totalBranches += branches.length;

                        for (const branch of branches) {
                            // Fetch rooms
                            const roomRes = await baseQuery({
                                url: `/management/rooms/available/?branch_id=${branch.branch_id}`,
                            });
                            const rooms = roomRes.data?.data || [];
                            totalRooms += rooms.length;

                            const branchCapacity = rooms.reduce(
                                (sum, r) => sum + (r.seater_capacity || 0),
                                0
                            );
                            totalCapacity += branchCapacity;

                            branchesWithDetails.push({
                                ...branch,
                                room_count: rooms.length,
                                total_capacity: branchCapacity,
                                total_available: rooms.reduce(
                                    (sum, r) => sum + (r.available_quantity || 0),
                                    0
                                ),
                                total_booked: rooms.reduce(
                                    (sum, r) => sum + (r.booked_quantity || 0),
                                    0
                                ),
                                management_name: mgmtName || "Unknown Management",
                            });
                        }

                        // Fetch companies/customers
                        const companyRes = await baseQuery({ url: `/customer?mgmt_id=${mgmtId}` });

                        const companies = companyRes.data?.data || [];
                        totalCompanies += companies.length;

                        companies.forEach((company) => {
                            companiesWithDetails.push({
                                ...company,
                                management_name: mgmtName || "Unknown Management",
                                management_id: mgmtId,
                            });
                        });
                    }

                    return {
                        data: {
                            total_managements: managementsArray.length,
                            total_branches: totalBranches,
                            total_rooms: totalRooms,
                            total_capacity: totalCapacity,
                            total_customers: totalCompanies,
                            branches: branchesWithDetails,
                            companies: companiesWithDetails,
                        },
                    };
                } catch (error) {
                    return { error: { status: 500, data: error } };
                }
            },
        }),
        fetchRoomByBranchId: builder.query({
            query: (id) => ({
                url: `/management/rooms?branch_id=${id}`,
                method: "GET",
            }),
        }),
        addBranchRoom: builder.mutation({
            query: (data) => ({
                url: `/management/rooms/add`,
                method: "POST",
                body: data,
            }),
        }),
        editBranchRoom: builder.mutation({
            query: ({id, data}) => ({
                url: `/management/rooms/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteBranchRoom: builder.mutation({
            query: (id) => ({
                url: `/management/rooms/${id}`,
                method: "DELETE",
            }),
        }),
        addBranch: builder.mutation({
            query: (data) => ({
                url: `/management/branches/add`,
                method: "POST",
                body: data,
            }),
        }),
        editBranch: builder.mutation({
            query: (data) => ({
                url: `/management/branches/${data.id}`,
                method: "PUT",
            })
        }),
        deleteBranch: builder.mutation({
            query: (id) => ({
                url: `/management/branches/${id}`,
                method: "DELETE",
            })
        }),
    }),
});

export const {
    useFetchManagementQuery,
    useFetchBranchByMgmtIdQuery,
    useFetchAvailableRoomsQuery,
    useFetchDashboardDataQuery,
    useFetchRoomByBranchIdQuery,
    useAddBranchRoomMutation,
    useEditBranchRoomMutation,
    useDeleteBranchRoomMutation,
    useAddBranchMutation,
    useEditBranchMutation,
    useDeleteBranchMutation,
} = managementApi;

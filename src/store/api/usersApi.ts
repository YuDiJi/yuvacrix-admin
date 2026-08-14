import { baseApi } from "./baseApi";
import type { AdminUserDetails, AdminUserModerationRequest, AdminUsersQueryParams, AdminUsersResponse } from "@/types/admin/user";

function cleanParams(params: AdminUsersQueryParams) { return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")); }
export const usersApi = baseApi.injectEndpoints({ endpoints: (build) => ({
  getAdminUsers: build.query<AdminUsersResponse, AdminUsersQueryParams>({ query: (params) => ({ url: "/admin/users", params: cleanParams(params) }), providesTags: (result) => [{ type: "User", id: "LIST" }, ...(result?.items.map((user) => ({ type: "User" as const, id: user.id })) ?? [])] }),
  getAdminUser: build.query<AdminUserDetails, string>({ query: (userId) => `/admin/users/${userId}`, providesTags: (_result, _error, userId) => [{ type: "User", id: userId }] }),
  updateAdminUserStatus: build.mutation<AdminUserDetails, { userId: string; body: AdminUserModerationRequest }>({ query: ({ userId, body }) => ({ url: `/admin/users/${userId}/status`, method: "PATCH", body }), invalidatesTags: (_result, _error, { userId }) => [{ type: "User", id: userId }, { type: "User", id: "LIST" }] }),
}) });
export const { useGetAdminUsersQuery, useGetAdminUserQuery, useUpdateAdminUserStatusMutation } = usersApi;

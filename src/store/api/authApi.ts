import { baseApi } from "./baseApi";
import type { AdminAuthResponse, AdminLoginRequest, AdminMeResponse, SuccessResponse } from "@/types/admin/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginAdmin: build.mutation<AdminAuthResponse, AdminLoginRequest>({ query: (body) => ({ url: "/admin/auth/login", method: "POST", body }), invalidatesTags: ["AdminAuth"] }),
    getCurrentAdmin: build.query<AdminMeResponse, void>({ query: () => "/admin/auth/me", providesTags: ["AdminAuth"] }),
    logoutAdmin: build.mutation<SuccessResponse, void>({ query: () => ({ url: "/admin/auth/logout", method: "POST" }) }),
    logoutAllAdminSessions: build.mutation<SuccessResponse, void>({ query: () => ({ url: "/admin/auth/logout-all", method: "POST" }) }),
  }),
});
export const { useLoginAdminMutation, useGetCurrentAdminQuery, useLogoutAdminMutation, useLogoutAllAdminSessionsMutation } = authApi;

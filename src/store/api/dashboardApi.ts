import { baseApi } from "./baseApi";
import type { DashboardAnalyticsRange, DashboardAnalyticsResponse, DashboardResponse } from "@/types/admin/dashboard";

export const dashboardApi = baseApi.injectEndpoints({ endpoints: (build) => ({
  getDashboard: build.query<DashboardResponse, void>({ query: () => "/admin/dashboard", providesTags: ["Dashboard"] }),
  getDashboardAnalytics: build.query<DashboardAnalyticsResponse, DashboardAnalyticsRange>({ query: (range) => ({ url: "/admin/dashboard/analytics", params: { range } }), providesTags: ["Dashboard"] }),
}) });
export const { useGetDashboardQuery, useGetDashboardAnalyticsQuery } = dashboardApi;

import { baseApi } from "./baseApi";
import type { AdminReport, AdminReportsQueryParams, AdminReportsResponse, AdminReportUpdateRequest } from "@/types/admin/report";

function cleanParams(params: AdminReportsQueryParams) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && (typeof value !== "string" || value.length > 0)));
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminReports: build.query<AdminReportsResponse, AdminReportsQueryParams>({
      query: (params) => ({ url: "/admin/reports", params: cleanParams(params) }),
      providesTags: (result) => [{ type: "Report", id: "LIST" }, ...(result?.items.map((report) => ({ type: "Report" as const, id: report.id })) ?? [])],
    }),
    getAdminReport: build.query<AdminReport, string>({
      query: (reportId) => `/admin/reports/${reportId}`,
      providesTags: (_result, _error, reportId) => [{ type: "Report", id: reportId }],
    }),
    updateAdminReport: build.mutation<AdminReport, { reportId: string; body: AdminReportUpdateRequest }>({
      query: ({ reportId, body }) => ({ url: `/admin/reports/${reportId}`, method: "PATCH", body }),
      invalidatesTags: (result, _error, { reportId }) => result ? [{ type: "Report", id: reportId }, { type: "Report", id: "LIST" }] : [],
    }),
  }),
});

export const { useGetAdminReportsQuery, useGetAdminReportQuery, useUpdateAdminReportMutation } = reportsApi;

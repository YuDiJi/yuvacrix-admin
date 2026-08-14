import { baseApi } from "./baseApi";
import type { AdminAuditLogsQueryParams, AdminAuditLogsResponse } from "@/types/admin/auditLog";

function cleanParams(params: AdminAuditLogsQueryParams) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && (typeof value !== "string" || value.length > 0)));
}

export const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminAuditLogs: build.query<AdminAuditLogsResponse, AdminAuditLogsQueryParams>({
      query: (params) => ({ url: "/admin/audit-logs", params: cleanParams(params) }),
      providesTags: [{ type: "AuditLog", id: "LIST" }],
    }),
  }),
});

export const { useGetAdminAuditLogsQuery } = auditLogsApi;

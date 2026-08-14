import { Suspense } from "react";
import { AuditLogsTable } from "@/components/audit-logs/AuditLogsTable";

export default function AuditLogsPage() {
  return <Suspense fallback={<div className="h-100 animate-pulse rounded-2xl bg-white" />}><AuditLogsTable /></Suspense>;
}

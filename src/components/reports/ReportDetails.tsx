"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { AccessDenied } from "@/components/common/AccessDenied";
import { hasPermission } from "@/lib/adminPermissions";
import { getApiErrorMessage, getErrorStatus } from "@/lib/apiError";
import { formatDate } from "@/lib/format";
import { formatReportTargetType, getReportTargetHref } from "@/lib/reportTarget";
import { useGetCurrentAdminQuery } from "@/store/api/authApi";
import { useGetAdminReportQuery } from "@/store/api/reportsApi";
import type { ReportStatus } from "@/types/admin/report";
import { ReportStatusBadge } from "./ReportStatusBadge";
import { ReportWorkflowDialog } from "./ReportWorkflowDialog";

type WorkflowAction = Exclude<ReportStatus, "OPEN">;
const actionLabels: Record<WorkflowAction, string> = { UNDER_REVIEW: "Mark Under Review", RESOLVED: "Resolve", REJECTED: "Reject" };

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm text-navy">{value}</dd></div>;
}

function safeEvidenceHref(value: string) {
  try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:" ? url.href : null; } catch { return null; }
}

export function ReportDetails({ reportId }: { reportId: string }) {
  const auth = useGetCurrentAdminQuery(); const canRead = hasPermission(auth.data?.admin, "reports.read"); const canResolve = hasPermission(auth.data?.admin, "reports.resolve"); const report = useGetAdminReportQuery(reportId, { skip: !canRead }); const [action, setAction] = useState<WorkflowAction | null>(null); const [notice, setNotice] = useState<string | null>(null);
  if (!canRead) return <AccessDenied description="Your account does not include permission to view reports." />;
  if (report.isLoading) return <div className="space-y-6 animate-pulse"><div className="h-5 w-24 rounded bg-slate-200" /><div className="h-44 rounded-2xl bg-white" /><div className="grid gap-6 lg:grid-cols-2"><div className="h-64 rounded-2xl bg-white" /><div className="h-64 rounded-2xl bg-white" /></div></div>;
  if (report.isError) { const missing = getErrorStatus(report.error) === 404; return <section className="grid min-h-100 place-items-center rounded-2xl border border-line bg-white p-8 text-center shadow-sm"><div><h1 className="text-xl font-bold text-navy">{missing ? "Report not found" : "Unable to load report"}</h1><p className="mt-2 text-sm text-slate-500">{missing ? "The requested report could not be found." : getApiErrorMessage(report.error, "We couldn't load this report.")}</p><div className="mt-5 flex justify-center gap-3"><Link href="/reports" className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-slate-600">Back to Reports</Link>{!missing && <button type="button" onClick={() => report.refetch()} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Try Again</button>}</div></div></section>; }
  const data = report.data; if (!data) return null; const targetHref = data.targetType && data.targetId ? getReportTargetHref(data.targetType, data.targetId) : null; const actions: WorkflowAction[] = data.status === "OPEN" ? ["UNDER_REVIEW", "RESOLVED", "REJECTED"] : data.status === "UNDER_REVIEW" ? ["RESOLVED", "REJECTED"] : [];
  const targetTypeLabel = data.targetType ? formatReportTargetType(data.targetType) : "Feedback";
  const evidenceUrls = data.evidenceUrls ?? [];

  return <><Link href="/reports" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand"><ArrowLeft className="size-4" />Reports</Link>{notice && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}<section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold text-navy">Report</h1><ReportStatusBadge status={data.status} /></div><p className="mt-2 text-sm text-slate-500">{targetTypeLabel} · {data.category}</p></div>{canResolve && actions.length > 0 && <div className="flex flex-wrap gap-2">{actions.map((status) => <button key={status} type="button" onClick={() => setAction(status)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${status === "REJECTED" ? "border border-red-200 text-red-700" : "bg-brand text-white"}`}>{actionLabels[status]}</button>)}</div>}</div></section>

  <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Report Details</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Report ID" value={data.id} /><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</dt><dd className="mt-1"><ReportStatusBadge status={data.status} /></dd></div><Info label="Version" value={data.version.toString()} /><Info label="Created" value={formatDate(data.createdAt)} /><Info label="Updated" value={formatDate(data.updatedAt)} /></dl></section><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Target</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Type" value={targetTypeLabel} /><Info label="Target ID" value={data.targetId ?? "No target"} /></dl>{targetHref && <Link href={targetHref} className="mt-5 inline-block text-sm font-semibold text-brand hover:underline">View Target</Link>}</section></div>

  <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Reporter</h2><p className="mt-5 break-all text-sm text-slate-600">{data.reporterUserId}</p><Link href={`/users/${data.reporterUserId}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">View Reporter</Link></section><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Review Assignment</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Assigned Admin" value={data.assignedAdminId ?? "Unassigned"} /><Info label="Resolved By" value={data.resolvedBy ?? "—"} /><Info label="Resolved At" value={formatDate(data.resolvedAt)} /></dl></section></div>

  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Report Content</h2><div className="mt-5"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Category</p><p className="mt-1 text-sm text-navy">{data.category}</p></div><div className="mt-5"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Description</p><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{data.description}</p></div></section>

  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Evidence</h2>{evidenceUrls.length ? <div className="mt-4 flex flex-wrap gap-3">{evidenceUrls.map((evidence, index) => { const href = safeEvidenceHref(evidence); return href ? <a key={`${evidence}-${index}`} href={href} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-brand hover:underline">Evidence {index + 1}</a> : <span key={`${evidence}-${index}`} className="rounded-lg bg-surface px-3 py-2 text-sm text-slate-500">Evidence {index + 1} unavailable</span>; })}</div> : <p className="mt-4 rounded-xl bg-surface p-4 text-sm text-slate-500">No evidence URLs provided.</p>}</section>

  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Resolution</h2><dl className="mt-5 grid gap-5 lg:grid-cols-2"><Info label="Resolution" value={data.resolution ?? "—"} /><Info label="Internal Admin Notes" value={data.adminNotes ?? "—"} /></dl></section>{action && <ReportWorkflowDialog reportId={data.id} currentVersion={data.version} currentAssignedAdminId={data.assignedAdminId} currentAdminNotes={data.adminNotes} status={action} onClose={() => setAction(null)} onSuccess={(message) => { setNotice(message); setAction(null); }} onReloadLatest={async () => { await report.refetch(); }} />}</>;
}

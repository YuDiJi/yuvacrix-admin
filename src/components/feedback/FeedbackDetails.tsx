"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { AccessDenied } from "@/components/common/AccessDenied";
import { EvidenceGallery } from "@/components/feedback/EvidenceGallery";
import { FeedbackTypeBadge } from "@/components/feedback/FeedbackTypeBadge";
import { ReportStatusBadge } from "@/components/reports/ReportStatusBadge";
import { ReportWorkflowDialog } from "@/components/reports/ReportWorkflowDialog";
import { hasPermission } from "@/lib/adminPermissions";
import { getApiErrorMessage, getErrorStatus } from "@/lib/apiError";
import { getFeedbackSubject, getReportEvidenceUrls, getReporterLabel, getReporterUserId, isFeedbackReport } from "@/lib/feedback";
import { formatDate } from "@/lib/format";
import { formatReportTargetType, getReportTargetHref } from "@/lib/reportTarget";
import { useGetCurrentAdminQuery } from "@/store/api/authApi";
import { useGetAdminReportQuery } from "@/store/api/reportsApi";
import type { ReportStatus } from "@/types/admin/report";

type WorkflowAction = Exclude<ReportStatus, "OPEN">;
const actionLabels: Record<WorkflowAction, string> = { UNDER_REVIEW: "Mark Under Review", RESOLVED: "Resolve", REJECTED: "Reject" };

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-navy">{value}</dd></div>;
}

export function FeedbackDetails({ reportId }: { reportId: string }) {
  const auth = useGetCurrentAdminQuery();
  const canRead = hasPermission(auth.data?.admin, "reports.read");
  const canResolve = hasPermission(auth.data?.admin, "reports.resolve");
  const report = useGetAdminReportQuery(reportId, { skip: !canRead });
  const [action, setAction] = useState<WorkflowAction | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!canRead) return <AccessDenied description="Your account does not include permission to view feedback." />;
  if (report.isLoading) return <div className="space-y-6 animate-pulse"><div className="h-5 w-24 rounded bg-slate-200" /><div className="h-44 rounded-2xl bg-white" /><div className="grid gap-6 lg:grid-cols-2"><div className="h-64 rounded-2xl bg-white" /><div className="h-64 rounded-2xl bg-white" /></div></div>;
  if (report.isError) {
    const missing = getErrorStatus(report.error) === 404;
    return <section className="grid min-h-100 place-items-center rounded-2xl border border-line bg-white p-8 text-center shadow-sm"><div><h1 className="text-xl font-bold text-navy">{missing ? "Feedback not found" : "Unable to load feedback"}</h1><p className="mt-2 text-sm text-slate-500">{missing ? "The requested feedback could not be found." : getApiErrorMessage(report.error, "We couldn't load this feedback.")}</p><div className="mt-5 flex justify-center gap-3"><Link href="/feedback" className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-slate-600">Back to Feedback</Link>{!missing && <button type="button" onClick={() => report.refetch()} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Try Again</button>}</div></div></section>;
  }

  const data = report.data;
  if (!data) return null;
  if (!isFeedbackReport(data)) return <section className="grid min-h-100 place-items-center rounded-2xl border border-line bg-white p-8 text-center shadow-sm"><div><h1 className="text-xl font-bold text-navy">Feedback not found</h1><p className="mt-2 text-sm text-slate-500">This report is not consumer feedback. You can review it from the Reports module.</p><div className="mt-5 flex justify-center gap-3"><Link href="/feedback" className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-slate-600">Back to Feedback</Link><Link href={`/reports/${data.id}`} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Open Report</Link></div></div></section>;

  const actions: WorkflowAction[] = data.status === "OPEN" ? ["UNDER_REVIEW", "RESOLVED", "REJECTED"] : data.status === "UNDER_REVIEW" ? ["RESOLVED", "REJECTED"] : [];
  const reporterId = getReporterUserId(data);
  const targetHref = data.targetType && data.targetId ? getReportTargetHref(data.targetType, data.targetId) : null;

  return <>
    <Link href="/feedback" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand"><ArrowLeft className="size-4" />Feedback</Link>
    {notice && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3"><FeedbackTypeBadge type={data.type} /><h1 className="text-2xl font-bold text-navy">{getFeedbackSubject(data)}</h1><ReportStatusBadge status={data.status} /></div>
          <p className="mt-2 text-sm text-slate-500">Submitted by {getReporterLabel(data)} - {formatDate(data.createdAt)}</p>
        </div>
        {canResolve && actions.length > 0 && <div className="flex flex-wrap gap-2">{actions.map((status) => <button key={status} type="button" onClick={() => setAction(status)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${status === "REJECTED" ? "border border-red-200 text-red-700" : "bg-brand text-white"}`}>{actionLabels[status]}</button>)}</div>}
      </div>
    </section>

    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Feedback Details</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Feedback Type" value={data.type} /><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</dt><dd className="mt-1"><ReportStatusBadge status={data.status} /></dd></div><Info label="Submitted" value={formatDate(data.createdAt)} /><Info label="Last Updated" value={formatDate(data.updatedAt)} /></dl></section>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Reporter</h2><p className="mt-5 break-words text-sm text-slate-600">{getReporterLabel(data)}</p>{reporterId && <Link href={`/users/${reporterId}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">View Reporter</Link>}</section>
    </div>

    <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Description</h2><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{data.description}</p></section>
    <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Evidence</h2><EvidenceGallery urls={getReportEvidenceUrls(data)} /></section>
    <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Administration</h2><dl className="mt-5 grid gap-5 lg:grid-cols-2"><Info label="Assigned Admin" value={data.assignedAdminId ?? "Unassigned"} /><Info label="Resolution" value={data.resolution ?? "-"} /><Info label="Internal Admin Notes" value={data.adminNotes ?? "-"} /><Info label="Resolved By" value={data.resolvedBy ?? "-"} /><Info label="Resolved At" value={formatDate(data.resolvedAt)} /><Info label="Version" value={data.version.toString()} /></dl></section>
    <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Technical</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Report ID" value={data.id} />{data.targetType && <Info label="Legacy Target Type" value={formatReportTargetType(data.targetType)} />}{data.targetId && <Info label="Legacy Target ID" value={data.targetId} />}</dl>{targetHref && <Link href={targetHref} className="mt-5 inline-block text-sm font-semibold text-brand hover:underline">View Target</Link>}</section>
    {action && <ReportWorkflowDialog reportId={data.id} currentVersion={data.version} currentAssignedAdminId={data.assignedAdminId} currentAdminNotes={data.adminNotes} status={action} onClose={() => setAction(null)} onSuccess={(message) => { setNotice(message.replace("Report", "Feedback")); setAction(null); }} onReloadLatest={async () => { await report.refetch(); }} />}
  </>;
}

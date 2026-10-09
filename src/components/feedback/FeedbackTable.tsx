"use client";

import Link from "next/link";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AccessDenied } from "@/components/common/AccessDenied";
import { PageHeader } from "@/components/common/PageHeader";
import { ReportStatusBadge } from "@/components/reports/ReportStatusBadge";
import { feedbackTypes, formatEvidenceCount, formatFeedbackType, getFeedbackSubject, getReportEvidenceUrls, getReporterLabel, getReporterUserId, isFeedbackType } from "@/lib/feedback";
import { hasPermission } from "@/lib/adminPermissions";
import { getApiErrorMessage } from "@/lib/apiError";
import { formatDate } from "@/lib/format";
import { useGetCurrentAdminQuery } from "@/store/api/authApi";
import { useGetAdminReportsQuery } from "@/store/api/reportsApi";
import type { FeedbackType, ReportStatus } from "@/types/admin/report";
import { FeedbackTypeBadge } from "./FeedbackTypeBadge";

const limit = 20;
const typeTabs: { label: string; value?: FeedbackType }[] = [{ label: "All" }, { label: "Bugs", value: "BUG" }, { label: "Queries", value: "QUERY" }, { label: "Ideas", value: "IDEA" }];
const statusTabs: { label: string; value?: ReportStatus }[] = [{ label: "All" }, { label: "Open", value: "OPEN" }, { label: "Under Review", value: "UNDER_REVIEW" }, { label: "Resolved", value: "RESOLVED" }, { label: "Rejected", value: "REJECTED" }];

function descriptionPreview(description: string) {
  const trimmed = description.replace(/\s+/g, " ").trim();
  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
}

function parseTypesParam(value: string | null): FeedbackType[] {
  if (!value) return feedbackTypes;
  const values = value.split(",").map((item) => item.trim()).filter(isFeedbackType);
  return values.length ? values : feedbackTypes;
}

export function FeedbackTable() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const auth = useGetCurrentAdminQuery();
  const canRead = hasPermission(auth.data?.admin, "reports.read");
  const page = Math.max(1, Number(params.get("page")) || 1);
  const types = parseTypesParam(params.get("types"));
  const activeSingleType = types.length === 1 ? types[0] : undefined;
  const status = (params.get("status") as ReportStatus | null) ?? undefined;
  const feedback = useGetAdminReportsQuery({ types, status, skip: (page - 1) * limit, limit }, { skip: !canRead });
  const update = useCallback((values: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(values).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`);
  }, [params, pathname, router]);

  if (!canRead) return <AccessDenied description="Your account does not include permission to view feedback." />;

  const rows = feedback.data?.items ?? [];
  const pagination = feedback.data?.pagination;
  const start = pagination?.total ? pagination.skip + 1 : 0;
  const end = pagination ? Math.min(pagination.skip + pagination.limit, pagination.total) : 0;
  const hasActiveFilters = Boolean(activeSingleType || status);

  return <><PageHeader title="Feedback" description="Review bugs, questions, and ideas submitted by YuvaCrix users." /><div className="rounded-2xl border border-line bg-white shadow-sm"><div className="space-y-4 border-b border-line p-4"><div className="flex flex-wrap gap-2" aria-label="Feedback type filters">{typeTabs.map((tab) => <button key={tab.label} type="button" onClick={() => update({ types: tab.value, page: undefined })} className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeSingleType === tab.value || (!tab.value && !activeSingleType) ? "bg-brand text-white" : "bg-surface text-slate-600"}`}>{tab.label}</button>)}</div><div className="flex flex-wrap gap-2" aria-label="Feedback status filters">{statusTabs.map((tab) => <button key={tab.label} type="button" onClick={() => update({ status: tab.value, page: undefined })} className={`rounded-full px-3 py-1.5 text-sm font-medium ${status === tab.value ? "bg-brand text-white" : "bg-surface text-slate-600"}`}>{tab.label}</button>)}</div></div>{feedback.isError ? <div className="p-10 text-center"><h2 className="font-semibold text-navy">Unable to load feedback</h2><p className="mt-2 text-sm text-slate-500">{getApiErrorMessage(feedback.error, "We couldn't load the feedback list.")}</p><button type="button" onClick={() => feedback.refetch()} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Try Again</button></div> : <div className="overflow-x-auto"><table className="min-w-275 w-full text-left text-sm"><thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Type</th><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Submitted By</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Evidence</th><th className="px-5 py-3">Assigned To</th><th className="px-5 py-3">Submitted</th><th className="px-5 py-3">Action</th></tr></thead><tbody className={feedback.isFetching ? "opacity-60" : ""}>{feedback.isLoading ? Array.from({ length: 6 }, (_, index) => <tr key={index}><td colSpan={8} className="px-5 py-5"><div className="h-4 animate-pulse rounded bg-slate-100" /></td></tr>) : rows.map((report) => { const reporterId = getReporterUserId(report); const evidenceCount = getReportEvidenceUrls(report).length; return <tr key={report.id} className="border-b border-line last:border-0"><td className="px-5 py-4">{report.type && <FeedbackTypeBadge type={report.type} />}</td><td className="max-w-85 px-5 py-4"><p className="truncate font-medium text-navy">{getFeedbackSubject(report)}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{descriptionPreview(report.description)}</p></td><td className="px-5 py-4">{reporterId ? <Link href={`/users/${reporterId}`} className="block max-w-45 truncate text-brand hover:underline">{getReporterLabel(report)}</Link> : <span className="text-slate-500">{getReporterLabel(report)}</span>}</td><td className="px-5 py-4"><ReportStatusBadge status={report.status} /></td><td className="px-5 py-4 text-slate-600">{formatEvidenceCount(evidenceCount)}</td><td className="px-5 py-4 text-slate-600">{report.assignedAdminId ?? "Unassigned"}</td><td className="px-5 py-4 text-slate-600">{formatDate(report.createdAt)}</td><td className="px-5 py-4"><Link href={`/feedback/${report.id}`} className="font-semibold text-brand hover:underline">View</Link></td></tr>; })}{!feedback.isLoading && !rows.length && <tr><td colSpan={8} className="px-5 py-12 text-center"><p className="font-medium text-navy">{hasActiveFilters ? "No feedback matches the selected filters." : "No feedback has been submitted yet."}</p><p className="mt-1 text-sm text-slate-500">{hasActiveFilters ? "Try changing the selected type or status." : "There is currently no user feedback to review."}</p>{hasActiveFilters && <button type="button" onClick={() => update({ types: undefined, status: undefined, page: undefined })} className="mt-3 text-sm font-semibold text-brand">Clear filters</button>}</td></tr>}</tbody></table></div>}<div className="flex flex-col gap-3 border-t border-line p-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-slate-500">{pagination ? `Showing ${start}-${end} of ${pagination.total} ${activeSingleType ? formatFeedbackType(activeSingleType).toLowerCase() : "feedback"} records` : ""}</p><div className="flex items-center gap-2"><button type="button" disabled={page === 1} onClick={() => update({ page: String(page - 1) })} className="rounded-lg border border-line px-3 py-1.5 disabled:opacity-40">Previous</button><span className="px-3 py-1.5 text-slate-600">Page {page}</span><button type="button" disabled={!pagination?.hasMore} onClick={() => update({ page: String(page + 1) })} className="rounded-lg border border-line px-3 py-1.5 disabled:opacity-40">Next</button></div></div></div></>;
}

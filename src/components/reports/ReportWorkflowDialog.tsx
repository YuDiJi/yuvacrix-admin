"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getApiErrorMessage } from "@/lib/apiError";
import { useUpdateAdminReportMutation } from "@/store/api/reportsApi";
import type { AdminReportUpdateRequest, ReportStatus } from "@/types/admin/report";

const schema = z.object({
  status: z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"]),
  version: z.number().int().min(0),
  assignedAdminId: z.string().trim(),
  resolution: z.string().trim().max(2000, "Resolution must not exceed 2000 characters."),
  adminNotes: z.string().trim().max(4000, "Internal admin notes must not exceed 4000 characters."),
}).superRefine((values, context) => {
  if ((values.status === "RESOLVED" || values.status === "REJECTED") && !values.resolution) context.addIssue({ code: "custom", path: ["resolution"], message: "Resolution is required for this action." });
});

type FormValues = z.infer<typeof schema>;
const copy: Record<Exclude<ReportStatus, "OPEN">, { title: string; description: string; success: string; resolutionLabel: string }> = {
  UNDER_REVIEW: { title: "Mark under review", description: "Move this report into active review.", success: "Report marked under review.", resolutionLabel: "Resolution" },
  RESOLVED: { title: "Resolve report", description: "Complete this report with a documented resolution.", success: "Report resolved successfully.", resolutionLabel: "Resolution" },
  REJECTED: { title: "Reject report", description: "Complete this report as rejected and explain the outcome.", success: "Report rejected successfully.", resolutionLabel: "Rejection resolution" },
};

function isVersionConflict(error: unknown) {
  if (!error || typeof error !== "object" || !("status" in error) || error.status !== 409) return false;
  if (!("data" in error) || !error.data || typeof error.data !== "object") return true;
  const data = error.data as Record<string, unknown>;
  return [data.code, data.error, data.message].includes("REPORT_VERSION_CONFLICT") || error.status === 409;
}

export function ReportWorkflowDialog({ reportId, currentVersion, currentAssignedAdminId, currentAdminNotes, status, onClose, onSuccess, onReloadLatest }: { reportId: string; currentVersion: number; currentAssignedAdminId: string | null; currentAdminNotes: string | null; status: Exclude<ReportStatus, "OPEN">; onClose: () => void; onSuccess: (message: string) => void; onReloadLatest: () => Promise<void> }) {
  const [update, updateState] = useUpdateAdminReportMutation(); const [conflict, setConflict] = useState(false); const [reloading, setReloading] = useState(false); const content = copy[status];
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { status, version: currentVersion, assignedAdminId: currentAssignedAdminId ?? "", resolution: "", adminNotes: currentAdminNotes ?? "" } });
  async function submit(values: FormValues) {
    const body: AdminReportUpdateRequest = { status: values.status, version: values.version };
    if (values.assignedAdminId) body.assignedAdminId = values.assignedAdminId;
    if (values.resolution) body.resolution = values.resolution;
    if (values.adminNotes) body.adminNotes = values.adminNotes;
    try { await update({ reportId, body }).unwrap(); onSuccess(content.success); } catch (error) { if (isVersionConflict(error)) setConflict(true); }
  }
  async function reload() { setReloading(true); try { await onReloadLatest(); onClose(); } finally { setReloading(false); } }
  return <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4"><section role="dialog" aria-modal="true" aria-labelledby="report-workflow-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between"><div><h2 id="report-workflow-title" className="text-xl font-bold text-navy">{content.title}</h2><p className="mt-1 text-sm text-slate-500">{content.description}</p></div><button type="button" aria-label="Close dialog" onClick={onClose} className="rounded-lg p-2 text-slate-500"><X className="size-5" /></button></div>{conflict ? <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="font-semibold text-amber-900">This report was updated by another admin.</p><p className="mt-1 text-sm text-amber-800">Reload the latest report before making further changes.</p><button type="button" disabled={reloading} onClick={reload} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{reloading ? "Reloading…" : "Reload Report"}</button></div> : <form onSubmit={form.handleSubmit(submit)} className="mt-5 space-y-4">{status !== "UNDER_REVIEW" && <label className="block text-sm font-medium text-navy">{content.resolutionLabel}<textarea {...form.register("resolution")} rows={4} className="mt-2 w-full rounded-lg border border-line p-3 text-sm" />{form.formState.errors.resolution && <span className="mt-1 block text-xs text-red-600">{form.formState.errors.resolution.message}</span>}</label>}<label className="block text-sm font-medium text-navy">Internal admin notes <span className="font-normal text-slate-400">(optional)</span><textarea {...form.register("adminNotes")} rows={3} className="mt-2 w-full rounded-lg border border-line p-3 text-sm" />{form.formState.errors.adminNotes && <span className="mt-1 block text-xs text-red-600">{form.formState.errors.adminNotes.message}</span>}</label><label className="block text-sm font-medium text-navy">Assigned admin ID <span className="font-normal text-slate-400">(optional)</span><input {...form.register("assignedAdminId")} className="mt-2 h-10 w-full rounded-lg border border-line px-3 text-sm" /></label>{updateState.isError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{getApiErrorMessage(updateState.error)}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={updateState.isLoading} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{updateState.isLoading ? "Saving…" : "Confirm"}</button></div></form>}</section></div>;
}

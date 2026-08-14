"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getApiErrorMessage } from "@/lib/apiError";
import { useUpdateAdminTournamentStatusMutation } from "@/store/api/tournamentsApi";
import type { TournamentModerationStatus } from "@/types/admin/tournament";

const schema = z.object({ reason: z.string().trim().min(3, "Enter at least 3 characters.").max(1000, "Reason must not exceed 1000 characters.") });
const copy: Record<TournamentModerationStatus, { title: string; description: string; success: string }> = {
  ACTIVE: { title: "Activate tournament", description: "This restores the tournament's moderation status to Active.", success: "Tournament activated successfully." },
  SUSPENDED: { title: "Suspend tournament", description: "This restricts the tournament according to backend moderation rules.", success: "Tournament suspended successfully." },
  CANCELLED: { title: "Cancel tournament", description: "Cancelling is a strong moderation action. Confirm that this tournament should be marked as cancelled.", success: "Tournament cancelled successfully." },
};

export function TournamentModerationDialog({ tournamentId, name, status, onClose, onSuccess }: { tournamentId: string; name: string; status: TournamentModerationStatus; onClose: () => void; onSuccess: (message: string) => void }) {
  const [update, state] = useUpdateAdminTournamentStatusMutation(); const form = useForm<{ reason: string }>({ resolver: zodResolver(schema), defaultValues: { reason: "" } }); const content = copy[status];
  async function submit(values: { reason: string }) { try { await update({ tournamentId, body: { status, reason: values.reason } }).unwrap(); onSuccess(content.success); } catch {} }
  return <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4"><section role="dialog" aria-modal="true" aria-labelledby="tournament-moderation-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between"><div><h2 id="tournament-moderation-title" className="text-xl font-bold text-navy">{content.title}</h2><p className="mt-1 text-sm text-slate-500">{name}</p></div><button type="button" aria-label="Close dialog" onClick={onClose} className="rounded-lg p-2 text-slate-500"><X className="size-5" /></button></div><p className="mt-4 text-sm text-slate-600">{content.description}</p><form onSubmit={form.handleSubmit(submit)} className="mt-5 space-y-4"><label className="block text-sm font-medium text-navy">Reason<textarea {...form.register("reason")} rows={4} className="mt-2 w-full rounded-lg border border-line p-3 text-sm" />{form.formState.errors.reason && <span className="mt-1 block text-xs text-red-600">{form.formState.errors.reason.message}</span>}</label>{state.isError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{getApiErrorMessage(state.error)}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={state.isLoading} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{state.isLoading ? "Saving…" : "Confirm"}</button></div></form></section></div>;
}

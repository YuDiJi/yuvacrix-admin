"use client";

import Link from "next/link";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { AccessDenied } from "@/components/common/AccessDenied";
import { hasPermission } from "@/lib/adminPermissions";
import { getApiErrorMessage, getErrorStatus } from "@/lib/apiError";
import { formatDate, formatNumber } from "@/lib/format";
import { useGetCurrentAdminQuery } from "@/store/api/authApi";
import { useGetAdminTournamentQuery } from "@/store/api/tournamentsApi";
import type { TournamentModerationStatus } from "@/types/admin/tournament";
import { TournamentModerationDialog } from "./TournamentModerationDialog";
import { TournamentLifecycleBadge, TournamentModerationBadge } from "./TournamentStatusBadge";

const actionLabels: Record<TournamentModerationStatus, string> = { ACTIVE: "Activate", SUSPENDED: "Suspend", CANCELLED: "Cancel" };
const allowedActions: Record<TournamentModerationStatus, TournamentModerationStatus[]> = { ACTIVE: ["SUSPENDED", "CANCELLED"], SUSPENDED: ["ACTIVE", "CANCELLED"], CANCELLED: ["ACTIVE"] };

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm text-navy">{value}</dd></div>;
}

function stringField(value: unknown, keys: string[]) {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  for (const key of keys) if (typeof record[key] === "string" && record[key]) return record[key] as string;
  return undefined;
}

function RelatedRecords({ title, records, kind }: { title: string; records: unknown[]; kind: "team" | "round" | "fixture" | "match" }) {
  if (!records.length) return <section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">{title}</h2><p className="mt-4 rounded-xl bg-surface p-4 text-sm text-slate-500">No {title.toLowerCase()} to display.</p></section>;
  return <section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">{title}</h2><div className="mt-4 space-y-2">{records.map((record, index) => { const name = stringField(record, kind === "match" ? ["title", "name", "publicCode"] : ["name", "title", "label"]); const id = kind === "team" ? stringField(record, ["teamId"]) : kind === "match" ? stringField(record, ["matchId"]) : stringField(record, [`${kind}Id`, "id"]); const link = kind === "team" && id ? `/teams/${id}` : kind === "match" && id ? `/matches/${id}` : null; return <div key={id ?? `${kind}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface p-4"><div><p className="text-sm font-medium text-navy">{name ?? `${title} record ${index + 1}`}</p>{id && <p className="mt-1 break-all text-xs text-slate-500">{id}</p>}</div>{link && <Link href={link} className="text-sm font-semibold text-brand hover:underline">View {kind === "team" ? "Team" : "Match"}</Link>}</div>; })}</div></section>;
}

export function TournamentDetails({ tournamentId }: { tournamentId: string }) {
  const auth = useGetCurrentAdminQuery(); const canRead = hasPermission(auth.data?.admin, "tournaments.read"); const canModerate = hasPermission(auth.data?.admin, "tournaments.moderate"); const tournament = useGetAdminTournamentQuery(tournamentId, { skip: !canRead }); const [action, setAction] = useState<TournamentModerationStatus | null>(null); const [notice, setNotice] = useState<string | null>(null);
  if (!canRead) return <AccessDenied description="Your account does not include permission to view tournaments." />;
  if (tournament.isLoading) return <div className="space-y-6 animate-pulse"><div className="h-5 w-28 rounded bg-slate-200" /><div className="h-44 rounded-2xl bg-white" /><div className="grid gap-6 lg:grid-cols-2"><div className="h-64 rounded-2xl bg-white" /><div className="h-64 rounded-2xl bg-white" /></div></div>;
  if (tournament.isError) { const missing = getErrorStatus(tournament.error) === 404; return <section className="grid min-h-100 place-items-center rounded-2xl border border-line bg-white p-8 text-center shadow-sm"><div><h1 className="text-xl font-bold text-navy">{missing ? "Tournament not found" : "Unable to load tournament"}</h1><p className="mt-2 text-sm text-slate-500">{missing ? "The requested tournament could not be found." : getApiErrorMessage(tournament.error, "We couldn't load this tournament.")}</p>{missing ? <Link href="/tournaments" className="mt-5 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Back to Tournaments</Link> : <button type="button" onClick={() => tournament.refetch()} className="mt-5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Try Again</button>}</div></section>; }
  const data = tournament.data; if (!data) return null; const teams = data.teams ?? []; const rounds = data.rounds ?? []; const fixtures = data.fixtures ?? []; const matches = data.matches ?? []; const actions = allowedActions[data.moderationStatus] ?? [];

  return <><Link href="/tournaments" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand"><ArrowLeft className="size-4" />Tournaments</Link>{notice && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}<section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-2xl font-bold text-navy">{data.name}</h1><p className="mt-1 text-sm text-slate-500">{data.city ?? "City not available"}</p><div className="mt-3 flex flex-wrap gap-4"><div><p className="mb-1 text-xs text-slate-400">Lifecycle</p><TournamentLifecycleBadge status={data.status} /></div><div><p className="mb-1 text-xs text-slate-400">Moderation</p><TournamentModerationBadge status={data.moderationStatus} /></div></div></div>{canModerate && <div className="relative group"><button type="button" className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-slate-700"><MoreHorizontal className="size-4" />Moderate</button><div className="invisible absolute right-0 z-10 mt-1 w-40 rounded-xl border border-line bg-white p-1 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">{actions.map((status) => <button key={status} type="button" onClick={() => setAction(status)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface">{actionLabels[status]}</button>)}</div></div>}</div></section>

  <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Tournament Information</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Tournament ID" value={data.id} /><Info label="Name" value={data.name} /><Info label="City" value={data.city ?? "—"} /><Info label="Lifecycle Status" value={data.status} /><Info label="Created" value={formatDate(data.createdAt)} /><Info label="Updated" value={formatDate(data.updatedAt)} /></dl></section><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Organizer</h2><div className="mt-5 rounded-xl bg-surface p-4"><p className="font-medium text-navy">{data.organizer?.fullName ?? "Organizer name unavailable"}</p><p className="mt-1 break-all text-xs text-slate-500">Owner user ID: {data.ownerUserId}</p>{data.ownerUserId && <Link href={`/users/${data.ownerUserId}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">View User</Link>}</div></section></div>

  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Participation Overview</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Teams", teams.length], ["Rounds", rounds.length], ["Fixtures", fixtures.length], ["Matches", matches.length]].map(([label, count]) => <div key={label as string} className="rounded-xl bg-surface p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-navy">{formatNumber(count as number)}</p></div>)}</div></section>

  <div className="mt-6 grid gap-6 xl:grid-cols-2"><RelatedRecords title="Teams" records={teams} kind="team" /><RelatedRecords title="Rounds" records={rounds} kind="round" /><RelatedRecords title="Fixtures" records={fixtures} kind="fixture" /><RelatedRecords title="Matches" records={matches} kind="match" /></div>{action && <TournamentModerationDialog tournamentId={data.id} name={data.name} status={action} onClose={() => setAction(null)} onSuccess={(message) => { setNotice(message); setAction(null); }} />}</>;
}

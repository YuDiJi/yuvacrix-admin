"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AccessDenied } from "@/components/common/AccessDenied";
import { hasPermission } from "@/lib/adminPermissions";
import { getApiErrorMessage, getErrorStatus } from "@/lib/apiError";
import { formatDate, formatNumber } from "@/lib/format";
import { useGetCurrentAdminQuery } from "@/store/api/authApi";
import { useGetAdminMatchQuery } from "@/store/api/matchesApi";
import { MatchLifecycleBadge, MatchScoringBadge } from "./MatchStatusBadge";

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm text-navy">{value}</dd></div>;
}

function ChipList({ values, empty = "None listed" }: { values: string[]; empty?: string }) {
  return values.length ? <div className="flex flex-wrap gap-2">{values.map((value, index) => <span key={`${value}-${index}`} className="break-all rounded-full bg-surface px-2.5 py-1 text-xs text-slate-600">{value}</span>)}</div> : <p className="text-sm text-slate-500">{empty}</p>;
}

function UnknownSection({ title, value, empty }: { title: string; value: unknown | null; empty: string }) {
  return <section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">{title}</h2><p className="mt-4 rounded-xl bg-surface p-4 text-sm text-slate-600">{value === null ? empty : "Data is available in the Match response, but its structure is not documented for display."}</p></section>;
}

function RecordCount({ title, records }: { title: string; records: unknown[] }) {
  return <div className="rounded-xl bg-surface p-4"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-2xl font-bold text-navy">{formatNumber(records.length)}</p><p className="mt-1 text-xs text-slate-400">{records.length === 1 ? "record" : "records"} returned</p></div>;
}

export function MatchDetails({ matchId }: { matchId: string }) {
  const auth = useGetCurrentAdminQuery();
  const canRead = hasPermission(auth.data?.admin, "matches.read");
  const match = useGetAdminMatchQuery(matchId, { skip: !canRead });

  if (!canRead) return <AccessDenied description="Your account does not include permission to view matches." />;
  if (match.isLoading) return <div className="space-y-6 animate-pulse"><div className="h-5 w-24 rounded bg-slate-200" /><div className="h-48 rounded-2xl bg-white" /><div className="grid gap-6 lg:grid-cols-2"><div className="h-64 rounded-2xl bg-white" /><div className="h-64 rounded-2xl bg-white" /></div></div>;
  if (match.isError) {
    const missing = getErrorStatus(match.error) === 404;
    return <section className="grid min-h-100 place-items-center rounded-2xl border border-line bg-white p-8 text-center shadow-sm"><div><h1 className="text-xl font-bold text-navy">{missing ? "Match not found" : "Unable to load match"}</h1><p className="mt-2 text-sm text-slate-500">{missing ? "The requested match could not be found." : getApiErrorMessage(match.error, "We couldn't load this match.")}</p>{missing ? <Link href="/matches" className="mt-5 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Back to Matches</Link> : <button type="button" onClick={() => match.refetch()} className="mt-5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Try Again</button>}</div></section>;
  }

  const data = match.data;
  if (!data) return null;
  const creatorId = data.creator?.id;

  return <><Link href="/matches" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand"><ArrowLeft className="size-4" />Matches</Link><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-2xl font-bold text-navy">{data.title ?? "Match"}</h1>{data.publicCode && <p className="mt-1 text-sm text-slate-500">Public code: {data.publicCode}</p>}<p className="mt-1 break-all text-xs text-slate-400">{data.id}</p></div><div className="flex flex-wrap gap-2"><div><p className="mb-1 text-xs text-slate-400">Lifecycle</p><MatchLifecycleBadge status={data.status} /></div><div><p className="mb-1 text-xs text-slate-400">Scoring</p><MatchScoringBadge status={data.scoringStatus} /></div></div></div></section>

  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Operational Overview</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"><div className="rounded-xl bg-surface p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Lifecycle</p><div className="mt-2"><MatchLifecycleBadge status={data.status} /></div></div><div className="rounded-xl bg-surface p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Scoring</p><div className="mt-2"><MatchScoringBadge status={data.scoringStatus} /></div></div><div className="rounded-xl bg-surface p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Scheduled</p><p className="mt-2 text-sm font-medium text-navy">{formatDate(data.scheduledAt)}</p></div><div className="rounded-xl bg-surface p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Started</p><p className="mt-2 text-sm font-medium text-navy">{formatDate(data.startedAt)}</p></div><div className="rounded-xl bg-blue-50 p-4"><p className="text-xs uppercase tracking-wide text-brand">Ball Events</p><p className="mt-2 text-2xl font-bold text-navy">{formatNumber(data.scoring.ballEventCount)}</p></div><div className="rounded-xl bg-surface p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Last Updated</p><p className="mt-2 text-sm font-medium text-navy">{formatDate(data.updatedAt)}</p></div></div></section>

  <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Teams</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-surface p-4"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Team A</p><Link href={`/teams/${data.teamAId}`} className="mt-2 block break-all text-sm font-semibold text-brand hover:underline">{data.teamAId}</Link></div><div className="rounded-xl bg-surface p-4"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Team B</p><Link href={`/teams/${data.teamBId}`} className="mt-2 block break-all text-sm font-semibold text-brand hover:underline">{data.teamBId}</Link></div></div></section><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Rules</h2><dl className="mt-5 grid gap-5 sm:grid-cols-3"><Info label="Match Type" value={data.rules.matchType} /><Info label="Overs Per Innings" value={data.rules.oversPerInnings?.toString() ?? "—"} /><Info label="Players Per Team" value={data.rules.playersPerTeam?.toString() ?? "—"} /></dl></section></div>

  <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Venue</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Venue Name" value={data.environment.venueName ?? "—"} /><Info label="City" value={data.environment.city ?? "—"} /></dl></section><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Scoring Configuration</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Wagon Wheel" value={data.scoringSettings.wagonWheelEnabled ? "Enabled" : "Disabled"} /><Info label="Wagon Wheel Runs" value={data.scoringSettings.wagonWheelForRuns.length ? data.scoringSettings.wagonWheelForRuns.join(", ") : "—"} /></dl></section></div>

  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Officials</h2><div className="mt-5 grid gap-6 lg:grid-cols-2"><div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Creator</p>{data.creator ? <Link href={`/users/${data.creator.id}`} className="mt-2 inline-block font-medium text-brand hover:underline">{data.creator.fullName}</Link> : <p className="mt-2 text-sm text-slate-500">Not available</p>}</div><div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Scorers</p>{data.scorers.length ? <div className="mt-2 flex flex-wrap gap-2">{data.scorers.map((scorer) => <Link key={scorer.id} href={`/users/${scorer.id}`} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-brand hover:underline">{scorer.fullName}</Link>)}</div> : <div className="mt-2"><ChipList values={data.officials.scorerUserIds} empty="No scorers listed" /></div>}</div><div><p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Umpires</p><ChipList values={data.officials.umpireNames} /></div><div><p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Live Streamer User IDs</p><ChipList values={data.officials.liveStreamerUserIds} /></div><div className="lg:col-span-2"><p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Other Officials</p><ChipList values={data.officials.otherNames} /></div></div></section>

  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Competition</h2><dl className="mt-5 grid gap-5 sm:grid-cols-3"><Info label="Type" value={data.competitionContext.type.replaceAll("_", " ")} /><Info label="Tournament ID" value={data.competitionContext.tournamentId ?? "—"} /><Info label="Series ID" value={data.competitionContext.seriesId ?? data.seriesId ?? "—"} /></dl></section>

  <div className="mt-6 grid gap-6 lg:grid-cols-2"><UnknownSection title="Toss" value={data.toss} empty="Toss not available" /><UnknownSection title="Result" value={data.result} empty="Result not available" /></div>

  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Related Match Data</h2><div className="mt-5 grid gap-4 sm:grid-cols-3"><RecordCount title="Teams" records={data.teams} /><RecordCount title="Players" records={data.players} /><RecordCount title="Innings" records={data.innings} /></div></section>

  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Scorecard</h2><p className="mt-4 rounded-xl bg-surface p-4 text-sm text-slate-600">{data.scorecard === null ? "Scorecard not available" : "A scorecard was returned, but its structure is not documented for display."}</p></section>

  <details className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><summary className="cursor-pointer font-semibold text-navy">Technical Details</summary><dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Info label="Match ID" value={data.id} /><Info label="Team A ID" value={data.teamAId} /><Info label="Team B ID" value={data.teamBId} /><Info label="Series ID" value={data.seriesId ?? "—"} /><Info label="Creator ID" value={creatorId ?? "—"} /><Info label="Scorer IDs" value={data.officials.scorerUserIds.join(", ") || "—"} /><Info label="Created At" value={formatDate(data.createdAt)} /><Info label="Updated At" value={formatDate(data.updatedAt)} /></dl></details></>;
}

"use client";

import Link from "next/link";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { AccessDenied } from "@/components/common/AccessDenied";
import { getApiErrorMessage, getErrorStatus } from "@/lib/apiError";
import { hasPermission } from "@/lib/adminPermissions";
import { formatDate } from "@/lib/format";
import { useGetCurrentAdminQuery } from "@/store/api/authApi";
import { useGetAdminTeamQuery } from "@/store/api/teamsApi";
import type { AdminTeamPersonSummary, TeamModerationStatus } from "@/types/admin/team";
import { TeamModerationDialog } from "./TeamModerationDialog";
import { TeamStatusBadge } from "./TeamStatusBadge";

const actionLabels: Record<TeamModerationStatus, string> = { ACTIVE: "Activate", SUSPENDED: "Suspend", REMOVED: "Remove" };

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm text-navy">{value}</dd></div>;
}

function Leadership({ label, person }: { label: string; person: AdminTeamPersonSummary | null }) {
  return <div className="rounded-xl bg-surface p-4"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>{person ? <><Link href={`/players/${person.id}`} className="mt-2 block font-medium text-brand hover:underline">{person.fullName}</Link><p className="mt-1 break-all text-xs text-slate-500">{person.id}</p></> : <p className="mt-2 text-sm text-slate-500">Not assigned</p>}</div>;
}

function RelatedSummary({ title, count, empty }: { title: string; count: number; empty: string }) {
  return <section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">{title}</h2><p className="mt-4 rounded-xl bg-surface p-4 text-sm text-slate-600">{count ? `${count} related ${count === 1 ? "record" : "records"} returned with this team.` : empty}</p></section>;
}

export function TeamDetails({ teamId }: { teamId: string }) {
  const auth = useGetCurrentAdminQuery();
  const canRead = hasPermission(auth.data?.admin, "teams.read");
  const canModerate = hasPermission(auth.data?.admin, "teams.moderate");
  const team = useGetAdminTeamQuery(teamId, { skip: !canRead });
  const [action, setAction] = useState<TeamModerationStatus | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!canRead) return <AccessDenied description="Your account does not include permission to view teams." />;
  if (team.isLoading) return <div className="space-y-6 animate-pulse"><div className="h-5 w-24 rounded bg-slate-200" /><div className="h-44 rounded-2xl bg-white" /><div className="grid gap-6 lg:grid-cols-2"><div className="h-64 rounded-2xl bg-white" /><div className="h-64 rounded-2xl bg-white" /></div></div>;
  if (team.isError) {
    const missing = getErrorStatus(team.error) === 404;
    return <section className="grid min-h-100 place-items-center rounded-2xl border border-line bg-white p-8 text-center shadow-sm"><div><h1 className="text-xl font-bold text-navy">{missing ? "Team not found" : "Unable to load team"}</h1><p className="mt-2 text-sm text-slate-500">{missing ? "The requested team could not be found." : getApiErrorMessage(team.error, "We couldn't load this team.")}</p>{missing ? <Link href="/teams" className="mt-5 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Back to Teams</Link> : <button type="button" onClick={() => team.refetch()} className="mt-5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Try Again</button>}</div></section>;
  }

  const data = team.data;
  if (!data) return null;
  const actions = (["ACTIVE", "SUSPENDED", "REMOVED"] as TeamModerationStatus[]).filter((status) => status !== data.moderationStatus);

  return <><Link href="/teams" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand"><ArrowLeft className="size-4" />Teams</Link>{notice && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}<section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold text-navy">{data.name}</h1><TeamStatusBadge status={data.moderationStatus} /></div><p className="mt-1 text-sm text-slate-500">{data.city ?? "City not available"}</p><p className="mt-2 text-xs text-slate-500">Lifecycle: <span className="font-medium text-navy">{data.status}</span> · Moderation: <span className="font-medium text-navy">{data.moderationStatus}</span></p></div>{canModerate && <div className="relative group"><button type="button" className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-slate-700"><MoreHorizontal className="size-4" />Moderate</button><div className="invisible absolute right-0 z-10 mt-1 w-40 rounded-xl border border-line bg-white p-1 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">{actions.map((status) => <button key={status} type="button" onClick={() => setAction(status)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface">{actionLabels[status]}</button>)}</div></div>}</div></section>
  <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Team information</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Team ID" value={data.id} /><Info label="Team name" value={data.name} /><Info label="City" value={data.city ?? "—"} /><Info label="Lifecycle status" value={data.status} /><Info label="Created" value={formatDate(data.createdAt)} /><Info label="Updated" value={formatDate(data.updatedAt)} /></dl></section><section className="rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Owner / Creator</h2><div className="mt-5 rounded-xl bg-surface p-4"><p className="font-medium text-navy">{data.creator?.fullName ?? "Creator name unavailable"}</p><p className="mt-1 break-all text-xs text-slate-500">Owner user ID: {data.ownerUserId}</p>{data.ownerUserId && <Link href={`/users/${data.ownerUserId}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">View User</Link>}</div></section></div>
  <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm"><h2 className="font-semibold text-navy">Leadership</h2><div className="mt-5 grid gap-4 sm:grid-cols-3"><Leadership label="Captain" person={data.captain} /><Leadership label="Vice Captain" person={data.viceCaptain} /><Leadership label="Wicket Keeper" person={data.wicketKeeper} /></div></section>
  <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm"><div className="p-5"><h2 className="font-semibold text-navy">Members</h2><p className="mt-1 text-sm text-slate-500">Players returned with this team.</p></div>{data.members.length ? <div className="overflow-x-auto"><table className="w-full min-w-170 text-left text-sm"><thead className="border-y border-line bg-surface text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Player</th><th className="px-5 py-3">Roles</th><th className="px-5 py-3">Player ID</th><th className="px-5 py-3">Action</th></tr></thead><tbody>{data.members.map((member) => <tr key={member.id} className="border-b border-line last:border-0"><td className="px-5 py-4 font-medium text-navy">{member.player?.fullName ?? "Player name unavailable"}</td><td className="px-5 py-4"><div className="flex flex-wrap gap-1.5">{member.roles.length ? member.roles.map((role) => <span key={role} className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-brand">{role.replaceAll("_", " ")}</span>) : <span className="text-slate-500">No roles</span>}</div></td><td className="px-5 py-4 text-slate-600">{member.playerId}</td><td className="px-5 py-4">{member.playerId && <Link href={`/players/${member.playerId}`} className="font-semibold text-brand hover:underline">View Player</Link>}</td></tr>)}</tbody></table></div> : <p className="mx-5 mb-5 rounded-xl bg-surface p-4 text-sm text-slate-500">No members to display.</p>}</section>
  <div className="mt-6 grid gap-6 lg:grid-cols-2"><RelatedSummary title="Matches" count={data.matches.length} empty="No related matches to display." /><RelatedSummary title="Tournament Participation" count={data.tournamentParticipation.length} empty="No tournament participation to display." /></div>{action && <TeamModerationDialog teamId={data.id} name={data.name} status={action} onClose={() => setAction(null)} onSuccess={(message) => { setNotice(message); setAction(null); }} />}</>;
}

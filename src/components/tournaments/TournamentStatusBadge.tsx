import type { TournamentModerationStatus } from "@/types/admin/tournament";

export function TournamentModerationBadge({ status }: { status: TournamentModerationStatus | string | null | undefined }) {
  const styles: Record<string, string> = { ACTIVE: "bg-green-50 text-green-700", SUSPENDED: "bg-amber-50 text-amber-700", CANCELLED: "bg-red-50 text-red-700" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status ? (styles[status] ?? "bg-slate-100 text-slate-600") : "bg-slate-100 text-slate-500"}`}>{status?.replaceAll("_", " ") ?? "Unavailable"}</span>;
}

export function TournamentLifecycleBadge({ status }: { status: string | null | undefined }) {
  return <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-brand">{status?.replaceAll("_", " ") ?? "Unavailable"}</span>;
}

import type { MatchScoringStatus } from "@/types/admin/match";

const scoringLabels: Record<MatchScoringStatus, string> = {
  NOT_STARTED: "Not Started",
  FIRST_INNINGS_IN_PROGRESS: "1st Innings In Progress",
  FIRST_INNINGS_COMPLETED: "1st Innings Completed",
  SECOND_INNINGS_IN_PROGRESS: "2nd Innings In Progress",
  SECOND_INNINGS_COMPLETED: "2nd Innings Completed",
};

export function formatScoringStatus(status: MatchScoringStatus | string | null | undefined) {
  if (!status) return "Unavailable";
  return scoringLabels[status as MatchScoringStatus] ?? status.replaceAll("_", " ");
}

export function MatchLifecycleBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const style = normalized === "LIVE" ? "bg-red-50 text-red-700" : normalized === "COMPLETED" ? "bg-green-50 text-green-700" : normalized === "SCHEDULED" ? "bg-blue-50 text-brand" : "bg-slate-100 text-slate-600";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>{status.replaceAll("_", " ")}</span>;
}

export function MatchScoringBadge({ status }: { status: MatchScoringStatus | string | null | undefined }) {
  const inProgress = status?.endsWith("IN_PROGRESS") ?? false;
  const completed = status?.endsWith("COMPLETED") ?? false;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${inProgress ? "bg-amber-50 text-amber-700" : completed ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>{formatScoringStatus(status)}</span>;
}

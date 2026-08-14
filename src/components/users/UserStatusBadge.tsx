import type { UserModerationStatus } from "@/types/admin/user";
export function UserStatusBadge({ status }: { status: UserModerationStatus | string | null | undefined }) {
  const styles: Record<string, string> = { ACTIVE: "bg-green-50 text-green-700", SUSPENDED: "bg-amber-50 text-amber-700", BLOCKED: "bg-red-50 text-red-700", DEACTIVATED: "bg-slate-100 text-slate-600" };
  const label = status?.replaceAll("_", " ") ?? "Unavailable";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status ? (styles[status] ?? "bg-slate-100 text-slate-600") : "bg-slate-100 text-slate-500"}`}>{label}</span>;
}

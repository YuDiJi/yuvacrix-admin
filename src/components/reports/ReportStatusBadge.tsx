import type { ReportStatus } from "@/types/admin/report";

const labels: Record<ReportStatus, string> = { OPEN: "Open", UNDER_REVIEW: "Under Review", RESOLVED: "Resolved", REJECTED: "Rejected" };
const styles: Record<ReportStatus, string> = { OPEN: "bg-blue-50 text-brand", UNDER_REVIEW: "bg-amber-50 text-amber-700", RESOLVED: "bg-green-50 text-green-700", REJECTED: "bg-red-50 text-red-700" };

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
}

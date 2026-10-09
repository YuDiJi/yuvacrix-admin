import { formatFeedbackType } from "@/lib/feedback";
import type { FeedbackType } from "@/types/admin/report";

const styles: Record<FeedbackType, string> = {
  BUG: "bg-red-50 text-red-700",
  QUERY: "bg-blue-50 text-brand",
  IDEA: "bg-green-50 text-green-700",
};

export function FeedbackTypeBadge({ type }: { type: FeedbackType }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[type]}`}>{formatFeedbackType(type)}</span>;
}

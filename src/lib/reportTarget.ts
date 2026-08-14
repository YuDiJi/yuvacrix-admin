import type { ReportTargetType } from "@/types/admin/report";

const targetRoutes: Partial<Record<ReportTargetType, string>> = {
  USER: "/users",
  PLAYER: "/players",
  TEAM: "/teams",
  MATCH: "/matches",
  TOURNAMENT: "/tournaments",
};

export function getReportTargetHref(targetType: ReportTargetType, targetId: string) {
  const route = targetRoutes[targetType];
  return route && targetId ? `${route}/${encodeURIComponent(targetId)}` : null;
}

export function formatReportTargetType(targetType: ReportTargetType) {
  return targetType.split("_").map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(" ");
}

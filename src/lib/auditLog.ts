import type { AuditAction, AuditEntityType, KnownAuditAction } from "@/types/admin/auditLog";

export const knownAuditActions: readonly KnownAuditAction[] = [
  "ADMIN_LOGIN_REJECTED", "ADMIN_LOGIN_FAILED", "ADMIN_LOGIN_SUCCEEDED", "ADMIN_REFRESH_TOKEN_REUSE", "ADMIN_LOGOUT", "ADMIN_LOGOUT_ALL",
  "USER_ACTIVE", "USER_SUSPENDED", "USER_BLOCKED", "USER_DEACTIVATED",
  "PLAYER_ACTIVE", "PLAYER_SUSPENDED", "PLAYER_BLOCKED", "PLAYER_DEACTIVATED",
  "TEAM_ACTIVE", "TEAM_SUSPENDED", "TEAM_REMOVED",
  "TOURNAMENT_ACTIVE", "TOURNAMENT_SUSPENDED", "TOURNAMENT_CANCELLED", "REPORT_UPDATED",
];

const entityRoutes: Partial<Record<string, string>> = { USER: "/users", PLAYER: "/players", TEAM: "/teams", MATCH: "/matches", TOURNAMENT: "/tournaments", REPORT: "/reports" };

export function formatAuditAction(action: AuditAction | string) {
  return action.split("_").filter(Boolean).map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(" ") || "Unknown Action";
}

export function getAuditActionCategory(action: AuditAction | string) {
  return action.split("_")[0] || "OTHER";
}

export function getAuditEntityHref(entityType: AuditEntityType | string, entityId: string | null) {
  const route = entityRoutes[entityType];
  return route && entityId ? `${route}/${encodeURIComponent(entityId)}` : null;
}

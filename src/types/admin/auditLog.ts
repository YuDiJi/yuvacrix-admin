import type { PaginatedResponse } from "./common";

export type KnownAuditAction =
  | "ADMIN_LOGIN_REJECTED" | "ADMIN_LOGIN_FAILED" | "ADMIN_LOGIN_SUCCEEDED" | "ADMIN_REFRESH_TOKEN_REUSE" | "ADMIN_LOGOUT" | "ADMIN_LOGOUT_ALL"
  | "USER_ACTIVE" | "USER_SUSPENDED" | "USER_BLOCKED" | "USER_DEACTIVATED"
  | "PLAYER_ACTIVE" | "PLAYER_SUSPENDED" | "PLAYER_BLOCKED" | "PLAYER_DEACTIVATED"
  | "TEAM_ACTIVE" | "TEAM_SUSPENDED" | "TEAM_REMOVED"
  | "TOURNAMENT_ACTIVE" | "TOURNAMENT_SUSPENDED" | "TOURNAMENT_CANCELLED"
  | "REPORT_UPDATED";

type ExtensibleString = string & { readonly __extensibleString?: never };
export type AuditAction = KnownAuditAction | ExtensibleString;
export type AuditEntityType = "ADMIN" | "USER" | "PLAYER" | "TEAM" | "MATCH" | "TOURNAMENT" | "REPORT" | ExtensibleString;

export type AdminAuditLog = {
  _id: string;
  adminId: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string | null;
  reason: string | null;
  oldValue: unknown | null;
  newValue: unknown | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

export type AdminAuditLogsQueryParams = {
  adminId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  fromDate?: string;
  toDate?: string;
  skip?: number;
  limit?: number;
};

export type AdminAuditLogsResponse = PaginatedResponse<AdminAuditLog>;

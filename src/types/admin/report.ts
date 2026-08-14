import type { PaginatedResponse } from "./common";

export type ReportStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
export type ReportTargetType = "USER" | "PLAYER" | "TEAM" | "MATCH" | "TOURNAMENT" | "PROFILE_IMAGE" | "OTHER";

export type AdminReport = {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reporterUserId: string;
  category: string;
  description: string;
  evidenceUrls: string[];
  status: ReportStatus;
  assignedAdminId: string | null;
  resolution: string | null;
  adminNotes: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminReportsQueryParams = { status?: ReportStatus; skip?: number; limit?: number };
export type AdminReportUpdateRequest = { status: ReportStatus; version: number; assignedAdminId?: string; resolution?: string; adminNotes?: string };
export type AdminReportsResponse = PaginatedResponse<AdminReport>;

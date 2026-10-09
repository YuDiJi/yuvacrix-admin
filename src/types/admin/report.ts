import type { PaginatedResponse } from "./common";

export type ReportStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
export type ReportTargetType = "USER" | "PLAYER" | "TEAM" | "MATCH" | "TOURNAMENT" | "PROFILE_IMAGE" | "OTHER";
export type FeedbackType = "BUG" | "QUERY" | "IDEA";

export type ReportEvidence = {
  url?: string | null;
  signedUrl?: string | null;
  contentType?: string | null;
  fileName?: string | null;
};

export type ReportReporter = {
  id?: string | null;
  userId?: string | null;
  fullName?: string | null;
  username?: string | null;
  mobile?: string | null;
  email?: string | null;
};

export type AdminReport = {
  id: string;
  type?: FeedbackType | null;
  subject?: string | null;
  targetType?: ReportTargetType | null;
  targetId?: string | null;
  reporterUserId: string;
  reporter?: ReportReporter | null;
  category: string;
  description: string;
  evidenceUrls?: string[];
  evidence?: ReportEvidence[] | null;
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

export type AdminReportsQueryParams = { status?: ReportStatus; types?: FeedbackType[]; skip?: number; limit?: number };
export type AdminReportUpdateRequest = { status: ReportStatus; version: number; assignedAdminId?: string; resolution?: string; adminNotes?: string };
export type AdminReportsResponse = PaginatedResponse<AdminReport>;

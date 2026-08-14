import type { PaginatedResponse } from "./common";

export type PlayerModerationStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED" | "DEACTIVATED";
export type AdminPlayerListItem = { id: string; fullName: string; city: string | null; userId: string | null; moderationStatus: PlayerModerationStatus; createdAt: string; updatedAt: string };
export type PlayerOverallStats = { battingRuns: number; ballsFaced: number; boundaries: number; bowlingWickets: number };
export type AdminPlayerDetails = AdminPlayerListItem & { linkedUser: { id: string; fullName: string; mobile: string } | null; memberships: unknown[]; matchParticipation: unknown[]; tournamentParticipation: unknown[]; overallStats: PlayerOverallStats };
export type AdminPlayersQueryParams = { search?: string; city?: string; status?: string; moderationStatus?: PlayerModerationStatus; fromDate?: string; toDate?: string; skip?: number; limit?: number; sortBy?: "createdAt" | "updatedAt" | "fullName" | "name"; sortOrder?: "asc" | "desc" };
export type AdminPlayerModerationRequest = { status: PlayerModerationStatus; reason: string };
export type AdminPlayersResponse = PaginatedResponse<AdminPlayerListItem>;

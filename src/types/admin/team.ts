import type { PaginatedResponse } from "./common";

export type TeamModerationStatus = "ACTIVE" | "SUSPENDED" | "REMOVED";

export type AdminTeamPersonSummary = {
  id: string;
  fullName: string;
};

export type AdminTeamMember = {
  id: string;
  teamId: string;
  playerId: string;
  roles: string[];
  player: AdminTeamPersonSummary | null;
};

// These contracts are intentionally unknown until the Team endpoint documents them.
export type AdminTeamRelatedMatch = unknown;
export type AdminTeamTournamentParticipation = unknown;

export type AdminTeamListItem = {
  id: string;
  name: string;
  city: string | null;
  ownerUserId: string | null;
  status: string;
  moderationStatus: TeamModerationStatus;
  creator?: AdminTeamPersonSummary | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminTeamDetails = Omit<AdminTeamListItem, "ownerUserId" | "creator"> & {
  ownerUserId: string;
  creator: AdminTeamPersonSummary | null;
  captain: AdminTeamPersonSummary | null;
  viceCaptain: AdminTeamPersonSummary | null;
  wicketKeeper: AdminTeamPersonSummary | null;
  members: AdminTeamMember[];
  matches: AdminTeamRelatedMatch[];
  tournamentParticipation: AdminTeamTournamentParticipation[];
};

export type AdminTeamsQueryParams = {
  search?: string;
  city?: string;
  status?: string;
  moderationStatus?: TeamModerationStatus;
  ownerUserId?: string;
  fromDate?: string;
  toDate?: string;
  skip?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
};

export type AdminTeamModerationRequest = {
  status: TeamModerationStatus;
  reason: string;
};

export type AdminTeamsResponse = PaginatedResponse<AdminTeamListItem>;

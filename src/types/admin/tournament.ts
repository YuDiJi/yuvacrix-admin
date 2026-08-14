import type { PaginatedResponse } from "./common";

export type TournamentModerationStatus = "ACTIVE" | "SUSPENDED" | "CANCELLED";
export type AdminTournamentOrganizer = { id: string; fullName: string };
export type AdminTournamentTeamSummary = unknown;
export type AdminTournamentRoundSummary = unknown;
export type AdminTournamentFixtureSummary = unknown;
export type AdminTournamentMatchSummary = unknown;

export type AdminTournamentListItem = {
  id: string;
  name: string;
  publicCode?: string | null;
  city: string | null;
  ownerUserId: string | null;
  organizer?: AdminTournamentOrganizer | null;
  status: string;
  moderationStatus: TournamentModerationStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminTournamentDetails = Omit<AdminTournamentListItem, "ownerUserId" | "organizer"> & {
  ownerUserId: string;
  organizer: AdminTournamentOrganizer | null;
  teams: AdminTournamentTeamSummary[];
  rounds: AdminTournamentRoundSummary[];
  fixtures: AdminTournamentFixtureSummary[];
  matches: AdminTournamentMatchSummary[];
};

export type AdminTournamentsQueryParams = {
  search?: string;
  status?: string;
  moderationStatus?: TournamentModerationStatus;
  city?: string;
  organizerUserId?: string;
  fromDate?: string;
  toDate?: string;
  skip?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
};

export type AdminTournamentModerationRequest = { status: TournamentModerationStatus; reason: string };
export type AdminTournamentsResponse = PaginatedResponse<AdminTournamentListItem>;

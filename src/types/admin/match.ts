import type { PaginatedResponse } from "./common";

export type MatchScoringStatus =
  | "NOT_STARTED"
  | "FIRST_INNINGS_IN_PROGRESS"
  | "FIRST_INNINGS_COMPLETED"
  | "SECOND_INNINGS_IN_PROGRESS"
  | "SECOND_INNINGS_COMPLETED";

// The backend documentation does not currently define a closed lifecycle enum.
export type MatchStatus = string;
export type MatchSortField = "createdAt" | "updatedAt" | "scheduledAt";

export type AdminMatchPersonSummary = { id: string; fullName: string };
export type AdminMatchRules = { matchType: string; oversPerInnings?: number; playersPerTeam?: number };
export type AdminMatchEnvironment = { venueName?: string; city?: string };
export type AdminMatchOfficials = { scorerUserIds: string[]; umpireNames: string[]; liveStreamerUserIds: string[]; otherNames: string[] };
export type AdminMatchCompetitionContext = { type: string; tournamentId?: string; seriesId?: string; [key: string]: unknown };
export type AdminMatchScoringSummary = { ballEventCount: number };
export type AdminMatchScoringSettings = { wagonWheelEnabled: boolean; wagonWheelForRuns: number[] };

export type AdminMatchListItem = {
  id: string;
  title?: string | null;
  publicCode?: string | null;
  teamAId?: string;
  teamBId?: string;
  status: MatchStatus;
  scoringStatus?: MatchScoringStatus | null;
  competitionContext?: AdminMatchCompetitionContext | null;
  city?: string | null;
  environment?: AdminMatchEnvironment | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminMatchDetails = {
  id: string;
  title?: string | null;
  publicCode?: string | null;
  seriesId: string | null;
  teamAId: string;
  teamBId: string;
  rules: AdminMatchRules;
  environment: AdminMatchEnvironment;
  scoringSettings: AdminMatchScoringSettings;
  officials: AdminMatchOfficials;
  toss: unknown | null;
  result: unknown | null;
  status: MatchStatus;
  scheduledAt: string | null;
  startedAt: string | null;
  competitionContext: AdminMatchCompetitionContext;
  creator: AdminMatchPersonSummary | null;
  scorers: AdminMatchPersonSummary[];
  teams: unknown[];
  players: unknown[];
  innings: unknown[];
  scoringStatus: MatchScoringStatus;
  scoring: AdminMatchScoringSummary;
  scorecard: unknown | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminMatchesQueryParams = {
  search?: string;
  status?: string;
  scoringStatus?: MatchScoringStatus;
  teamId?: string;
  tournamentId?: string;
  seriesId?: string;
  createdBy?: string;
  city?: string;
  fromDate?: string;
  toDate?: string;
  skip?: number;
  limit?: number;
  sortBy?: MatchSortField;
  sortOrder?: "asc" | "desc";
};

export type AdminMatchesResponse = PaginatedResponse<AdminMatchListItem>;

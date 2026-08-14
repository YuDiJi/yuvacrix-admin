export type DashboardAnalyticsRange = "7D" | "30D" | "90D" | "1Y";
export type DashboardTrendPoint = { date: string; count: number };
export type RecentUser = { id: string; fullName: string; mobile: string; status: string; moderationStatus: string; createdAt: string };
export type DashboardRecentRecord = { id?: string; name?: string; title?: string; status?: string; createdAt?: string; [key: string]: unknown };
export type DashboardResponse = { totalUsers: number; totalPlayers: number; totalTeams: number; totalMatches: number; liveMatches: number; totalTournaments: number; activeTournaments: number; newUsersToday: number; newUsersThisWeek: number; matchesToday: number; recentUsers: RecentUser[]; recentMatches: DashboardRecentRecord[]; recentTournaments: DashboardRecentRecord[] };
export type DashboardAnalyticsResponse = { range: DashboardAnalyticsRange; timeZone: string; from: string; to: string; userRegistrations: DashboardTrendPoint[]; matchesCreated: DashboardTrendPoint[]; tournamentsCreated: DashboardTrendPoint[] };

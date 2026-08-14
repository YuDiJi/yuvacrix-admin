export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "SUPPORT" | "MODERATOR";
export type AdminStatus = "ACTIVE" | "SUSPENDED" | "DISABLED";
export type AdminPermission = "dashboard.read" | "users.read" | "users.moderate" | "players.read" | "players.moderate" | "teams.read" | "teams.moderate" | "matches.read" | "matches.moderate" | "tournaments.read" | "tournaments.moderate" | "reports.read" | "reports.resolve" | "audit.read" | "notifications.create" | "banners.manage" | "admins.manage";

export type Admin = { adminId: string; email: string; role: AdminRole; status: AdminStatus; permissions: AdminPermission[]; userId: string | null };
export type CurrentAdmin = Admin & { sessionId: string };
export type AdminLoginRequest = { email: string; password: string };
export type AdminAuthResponse = { success: true; admin: Admin };
export type AdminMeResponse = { success: true; admin: CurrentAdmin };
export type SuccessResponse = { success: true };

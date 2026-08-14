import type { PaginatedResponse } from "./common";

export type UserModerationStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED" | "DEACTIVATED";
export type AdminUserListItem = { id: string; mobile: string; fullName: string; username: string | null; roles: string[]; status: string; isMobileVerified: boolean; isProfileCompleted: boolean; hasPlayer: boolean; moderationStatus: UserModerationStatus; moderationReason: string | null; moderatedBy: string | null; moderatedAt: string | null; moderationExpiresAt: string | null; createdAt: string; updatedAt: string };
export type AdminUserDetails = Pick<AdminUserListItem, "id" | "mobile" | "fullName" | "username" | "roles" | "status" | "moderationStatus" | "createdAt" | "updatedAt"> & { linkedPlayer: { id: string; fullName: string; city: string | null } | null; teams: unknown[]; matches: unknown[]; tournaments: unknown[]; lastActiveAt: string | null; moderationReason?: string | null; moderatedAt?: string | null; moderationExpiresAt?: string | null; isMobileVerified?: boolean; isProfileCompleted?: boolean };
export type AdminUsersQueryParams = { search?: string; status?: string; moderationStatus?: UserModerationStatus; fromDate?: string; toDate?: string; skip?: number; limit?: number; sortBy?: "createdAt" | "updatedAt" | "fullName"; sortOrder?: "asc" | "desc" };
export type AdminUserModerationRequest = { status: UserModerationStatus; reason: string; expiresAt?: string };
export type AdminUsersResponse = PaginatedResponse<AdminUserListItem>;

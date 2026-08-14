import type { Admin, AdminPermission } from "@/types/admin/auth";

export function hasPermission(admin: Admin | null | undefined, permission: AdminPermission) { return admin?.permissions.includes(permission) ?? false; }
export function hasAnyPermission(admin: Admin | null | undefined, permissions: readonly AdminPermission[]) { return permissions.some((permission) => hasPermission(admin, permission)); }
export function formatAdminRole(role: Admin["role"]) { return role.split("_").map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(" "); }

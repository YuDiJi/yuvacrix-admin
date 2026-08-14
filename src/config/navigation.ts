import type { LucideIcon } from "lucide-react";
import { Award, Flag, History, LayoutDashboard, Shield, Trophy, UserRound, Users } from "lucide-react";
import type { AdminPermission } from "@/types/admin/auth";

export type NavigationItem = { label: string; href: string; icon: LucideIcon; permission: AdminPermission };
export const adminNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.read" }, { label: "Users", href: "/users", icon: Users, permission: "users.read" }, { label: "Players", href: "/players", icon: UserRound, permission: "players.read" }, { label: "Teams", href: "/teams", icon: Shield, permission: "teams.read" }, { label: "Matches", href: "/matches", icon: Trophy, permission: "matches.read" }, { label: "Tournaments", href: "/tournaments", icon: Award, permission: "tournaments.read" }, { label: "Reports", href: "/reports", icon: Flag, permission: "reports.read" }, { label: "Audit Logs", href: "/audit-logs", icon: History, permission: "audit.read" },
];

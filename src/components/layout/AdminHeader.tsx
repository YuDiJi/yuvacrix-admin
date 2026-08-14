"use client";

import { ChevronDown, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { adminNavigation } from "@/config/navigation";
import { formatAdminRole } from "@/lib/adminPermissions";
import { useAppDispatch } from "@/store/hooks";
import { baseApi } from "@/store/api/baseApi";
import { useGetCurrentAdminQuery, useLogoutAdminMutation } from "@/store/api/authApi";
import { getApiErrorMessage } from "@/lib/apiError";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false); const [logoutError, setLogoutError] = useState<string | null>(null);
  const { data } = useGetCurrentAdminQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutAdminMutation();
  const title = adminNavigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "Dashboard";
  async function handleLogout() { setLogoutError(null); try { await logout().unwrap(); dispatch(baseApi.util.resetApiState()); router.replace("/login"); } catch (error) { setLogoutError(getApiErrorMessage(error, "Unable to log out. Please try again.")); } }
  const admin = data?.admin;
  return <header className="flex h-18 shrink-0 items-center justify-between border-b border-line bg-white px-4 sm:px-7"><div className="flex items-center gap-3"><button type="button" aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 lg:hidden" onClick={onMenuClick}><Menu className="size-5" aria-hidden="true" /></button><h1 className="text-lg font-semibold text-navy sm:text-xl">{title}</h1></div><div className="relative"><button type="button" aria-expanded={menuOpen} aria-haspopup="menu" onClick={() => setMenuOpen((open) => !open)} className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-surface"><span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-sm font-semibold text-brand">{admin?.email.charAt(0).toUpperCase() ?? "A"}</span><span className="hidden sm:block"><span className="block max-w-55 truncate text-sm font-semibold text-navy">{admin?.email ?? "Admin"}</span><span className="block text-xs text-slate-400">{admin ? formatAdminRole(admin.role) : "Administrator"}</span></span><ChevronDown className="size-4 text-slate-400" aria-hidden="true" /></button>{menuOpen && <div role="menu" className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-line bg-white p-1 shadow-lg"><button type="button" role="menuitem" disabled={isLoggingOut} onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"><LogOut className="size-4" aria-hidden="true" />{isLoggingOut ? "Logging out…" : "Logout"}</button>{logoutError && <p role="alert" className="px-3 py-2 text-xs text-red-600">{logoutError}</p>}</div>}</div></header>;
}

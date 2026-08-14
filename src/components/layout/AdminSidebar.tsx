"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/config/navigation";
import { cn } from "@/lib/cn";
import { hasPermission } from "@/lib/adminPermissions";
import { useGetCurrentAdminQuery } from "@/store/api/authApi";

export function Brand() {
  return <Link href="/dashboard" className="flex items-center gap-3 font-bold text-navy"><span className="grid size-9 place-items-center rounded-xl bg-brand text-sm text-white">YC</span><span>YuvaCrix <span className="font-medium text-slate-400">Admin</span></span></Link>;
}

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { data } = useGetCurrentAdminQuery();
  return <>
    {open && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-30 bg-navy/30 lg:hidden" onClick={onClose} />}
    <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-line bg-white px-4 py-5 transition-transform lg:static lg:translate-x-0", open && "translate-x-0")}>
      <div className="flex items-center justify-between px-2"><Brand /><button type="button" aria-label="Close navigation" className="rounded-lg p-2 text-slate-500 lg:hidden" onClick={onClose}><X className="size-5" aria-hidden="true" /></button></div>
      <nav aria-label="Primary navigation" className="mt-10 space-y-1">
        {adminNavigation.filter((item) => hasPermission(data?.admin, item.permission)).map(({ label, href, icon: Icon }) => { const active = pathname === href || pathname.startsWith(`${href}/`); return <Link key={href} href={href} onClick={onClose} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-surface hover:text-brand", active && "bg-brand text-white shadow-sm hover:bg-brand hover:text-white")}><Icon className="size-5" aria-hidden="true" />{label}</Link>; })}
      </nav>
      <p className="mt-auto px-3 text-xs leading-5 text-slate-400">YuvaCrix administration portal<br />Version 0.1.0</p>
    </aside>
  </>;
}

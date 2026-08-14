"use client";

import { useState, type ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: ReactNode }) { const [open, setOpen] = useState(false); return <div className="flex min-h-screen bg-surface"><AdminSidebar open={open} onClose={() => setOpen(false)} /><div className="flex min-w-0 flex-1 flex-col"><AdminHeader onMenuClick={() => setOpen(true)} /><main className="flex-1 p-4 sm:p-7">{children}</main></div></div>; }

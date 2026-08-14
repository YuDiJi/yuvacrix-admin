"use client";

import { useEffect, type ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetCurrentAdminQuery } from "@/store/api/authApi";
import { getApiErrorMessage, getErrorStatus } from "@/lib/apiError";

function SessionLoading() { return <main className="grid min-h-screen place-items-center bg-surface p-6"><div className="w-full max-w-sm rounded-2xl border border-line bg-white p-7 shadow-sm"><div className="size-10 animate-pulse rounded-xl bg-blue-100" /><div className="mt-5 h-5 w-40 animate-pulse rounded bg-slate-100" /><div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" /></div></main>; }
export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const session = useGetCurrentAdminQuery();
  const unauthenticated = session.isError && getErrorStatus(session.error) === 401;
  useEffect(() => { if (unauthenticated) router.replace("/login"); }, [router, unauthenticated]);
  if (session.isLoading || unauthenticated) return <SessionLoading />;
  if (session.isError) return <main className="grid min-h-screen place-items-center bg-surface p-6"><section className="max-w-md rounded-2xl border border-line bg-white p-7 text-center shadow-sm"><ShieldAlert className="mx-auto size-9 text-amber-500" aria-hidden="true" /><h1 className="mt-4 text-xl font-bold text-navy">Unable to verify your session</h1><p className="mt-2 text-sm text-slate-500">{getApiErrorMessage(session.error, "Please check your connection and try again.")}</p><button type="button" onClick={() => session.refetch()} className="mt-5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Try Again</button></section></main>;
  return <>{children}</>;
}

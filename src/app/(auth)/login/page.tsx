"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { getApiErrorMessage } from "@/lib/apiError";
import { useGetCurrentAdminQuery, useLoginAdminMutation } from "@/store/api/authApi";
import type { AdminLoginRequest } from "@/types/admin/auth";

const loginSchema = z.object({ email: z.email("Enter a valid email address."), password: z.string().min(12, "Password must be at least 12 characters.") });
export default function LoginPage() {
  const router = useRouter(); const [showPassword, setShowPassword] = useState(false); const currentAdmin = useGetCurrentAdminQuery(); const [login, loginState] = useLoginAdminMutation();
  const form = useForm<AdminLoginRequest>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  useEffect(() => { if (currentAdmin.data?.admin) router.replace("/dashboard"); }, [currentAdmin.data, router]);
  async function onSubmit(values: AdminLoginRequest) { try { await login(values).unwrap(); await currentAdmin.refetch(); router.replace("/dashboard"); } catch { /* Shown below without exposing sensitive details. */ } }
  if (currentAdmin.isLoading || currentAdmin.data?.admin) return <main className="grid min-h-screen place-items-center bg-surface"><div className="size-12 animate-pulse rounded-2xl bg-blue-100" /></main>;
  return <main className="grid min-h-screen place-items-center bg-surface p-5"><section className="w-full max-w-md"><div className="mb-8 text-center"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand font-bold text-white">YC</div><p className="mt-3 text-lg font-bold text-navy">YuvaCrix <span className="font-medium text-slate-400">Admin</span></p></div><div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8"><div className="mb-6"><h1 className="text-2xl font-bold text-navy">Admin Login</h1><p className="mt-1 text-sm text-slate-500">Sign in to access the administration portal.</p></div><form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4"><label className="block text-sm font-medium text-navy">Email<input type="email" autoComplete="email" {...form.register("email")} placeholder="admin@yuvacrix.in" className="mt-2 h-11 w-full rounded-lg border border-line px-3 text-sm outline-none placeholder:text-slate-400 focus:border-accent" />{form.formState.errors.email && <span className="mt-1 block text-xs text-red-600">{form.formState.errors.email.message}</span>}</label><label className="block text-sm font-medium text-navy">Password<span className="relative mt-2 block"><input type={showPassword ? "text" : "password"} autoComplete="current-password" {...form.register("password")} placeholder="Enter your password" className="h-11 w-full rounded-lg border border-line px-3 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-accent" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((show) => !show)} className="absolute right-1 top-1 rounded p-2 text-slate-400">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span>{form.formState.errors.password && <span className="mt-1 block text-xs text-red-600">{form.formState.errors.password.message}</span>}</label>{loginState.isError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{getApiErrorMessage(loginState.error, "Unable to sign in. Please try again.")}</p>}<button type="submit" disabled={loginState.isLoading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"><LockKeyhole className="size-4" aria-hidden="true" />{loginState.isLoading ? "Signing in…" : "Login"}</button></form></div></section></main>;
}

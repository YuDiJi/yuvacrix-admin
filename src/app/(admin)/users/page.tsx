import { Suspense } from "react";
import { UsersTable } from "@/components/users/UsersTable";
export default function UsersPage() { return <Suspense fallback={<div className="h-100 animate-pulse rounded-2xl bg-white" />}><UsersTable /></Suspense>; }

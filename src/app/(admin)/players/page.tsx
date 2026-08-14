import { Suspense } from "react"; import { PlayersTable } from "@/components/players/PlayersTable";
export default function PlayersPage() { return <Suspense fallback={<div className="h-100 animate-pulse rounded-2xl bg-white" />}><PlayersTable /></Suspense>; }

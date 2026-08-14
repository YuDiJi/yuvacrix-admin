import { Suspense } from "react";
import { MatchesTable } from "@/components/matches/MatchesTable";

export default function MatchesPage() {
  return <Suspense fallback={<div className="h-100 animate-pulse rounded-2xl bg-white" />}><MatchesTable /></Suspense>;
}

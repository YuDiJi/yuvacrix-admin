import { Suspense } from "react";
import { TournamentsTable } from "@/components/tournaments/TournamentsTable";

export default function TournamentsPage() {
  return <Suspense fallback={<div className="h-100 animate-pulse rounded-2xl bg-white" />}><TournamentsTable /></Suspense>;
}

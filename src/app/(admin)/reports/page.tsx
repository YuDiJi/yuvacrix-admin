import { Suspense } from "react";
import { ReportsTable } from "@/components/reports/ReportsTable";

export default function ReportsPage() {
  return <Suspense fallback={<div className="h-100 animate-pulse rounded-2xl bg-white" />}><ReportsTable /></Suspense>;
}

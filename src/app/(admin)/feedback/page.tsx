import { Suspense } from "react";
import { FeedbackTable } from "@/components/feedback/FeedbackTable";

export default function FeedbackPage() {
  return <Suspense fallback={<div className="h-100 animate-pulse rounded-2xl bg-white" />}><FeedbackTable /></Suspense>;
}

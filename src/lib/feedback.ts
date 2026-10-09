import type { AdminReport, FeedbackType, ReportEvidence } from "@/types/admin/report";

export const feedbackTypes: FeedbackType[] = ["BUG", "QUERY", "IDEA"];

export function isFeedbackType(value: unknown): value is FeedbackType {
  return value === "BUG" || value === "QUERY" || value === "IDEA";
}

export function isFeedbackReport(report: AdminReport): report is AdminReport & { type: FeedbackType } {
  return isFeedbackType(report.type);
}

export function formatFeedbackType(type: FeedbackType) {
  return type === "BUG" ? "Bug" : type === "QUERY" ? "Query" : "Idea";
}

export function getFeedbackSubject(report: AdminReport) {
  return report.subject?.trim() || report.category || "Untitled feedback";
}

export function getReporterUserId(report: AdminReport) {
  return report.reporter?.userId || report.reporter?.id || report.reporterUserId || null;
}

export function getReporterLabel(report: AdminReport) {
  return report.reporter?.fullName || report.reporter?.username || report.reporter?.mobile || getReporterUserId(report) || "Unknown reporter";
}

function evidenceUrl(evidence: ReportEvidence) {
  return evidence.signedUrl || evidence.url || null;
}

export function getReportEvidenceUrls(report: AdminReport) {
  const urls = report.evidence?.map(evidenceUrl).filter((value): value is string => Boolean(value)) ?? [];
  return urls.length ? urls : report.evidenceUrls ?? [];
}

export function formatEvidenceCount(count: number) {
  return count === 0 ? "No evidence" : count === 1 ? "1 image" : `${count} images`;
}

export function safeEvidenceHref(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

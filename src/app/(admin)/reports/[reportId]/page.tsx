import { ReportDetails } from "@/components/reports/ReportDetails";

export default async function ReportDetailsPage({ params }: PageProps<"/reports/[reportId]">) {
  const { reportId } = await params;
  return <ReportDetails reportId={reportId} />;
}

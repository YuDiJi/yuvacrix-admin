import { FeedbackDetails } from "@/components/feedback/FeedbackDetails";

export default async function FeedbackDetailsPage({ params }: PageProps<"/feedback/[reportId]">) {
  const { reportId } = await params;
  return <FeedbackDetails reportId={reportId} />;
}

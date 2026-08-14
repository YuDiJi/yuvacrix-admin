import { TeamDetails } from "@/components/teams/TeamDetails";

export default async function TeamDetailsPage({ params }: PageProps<"/teams/[teamId]">) {
  const { teamId } = await params;
  return <TeamDetails teamId={teamId} />;
}

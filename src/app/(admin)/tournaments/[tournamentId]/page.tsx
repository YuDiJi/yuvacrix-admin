import { TournamentDetails } from "@/components/tournaments/TournamentDetails";

export default async function TournamentDetailsPage({ params }: PageProps<"/tournaments/[tournamentId]">) {
  const { tournamentId } = await params;
  return <TournamentDetails tournamentId={tournamentId} />;
}

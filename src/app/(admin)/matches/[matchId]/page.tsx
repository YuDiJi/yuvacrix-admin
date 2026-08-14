import { MatchDetails } from "@/components/matches/MatchDetails";

export default async function MatchDetailsPage({ params }: PageProps<"/matches/[matchId]">) {
  const { matchId } = await params;
  return <MatchDetails matchId={matchId} />;
}

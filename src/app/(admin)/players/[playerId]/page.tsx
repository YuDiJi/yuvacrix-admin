import { PlayerDetails } from "@/components/players/PlayerDetails";
export default async function PlayerDetailsPage({ params }: PageProps<"/players/[playerId]">) { const { playerId } = await params; return <PlayerDetails playerId={playerId} />; }

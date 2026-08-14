import { UserDetails } from "@/components/users/UserDetails";
export default async function UserDetailsPage({ params }: PageProps<"/users/[userId]">) { const { userId } = await params; return <UserDetails userId={userId} />; }

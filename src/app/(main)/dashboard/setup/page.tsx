import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import SetupForm from "./setupform";

export default async function SetupPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <SetupForm userId={session.user.id} />;
}
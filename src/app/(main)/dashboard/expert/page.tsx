import { redirect } from "next/navigation"

export default async function ExpertDashboard() {
  redirect("/dashboard/expert/profile")
}

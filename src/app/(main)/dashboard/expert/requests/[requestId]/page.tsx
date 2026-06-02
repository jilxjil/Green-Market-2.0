import { redirect } from "next/navigation";

export default async function ExpertRequestDetailRedirect({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;

  redirect(`/consultations/${requestId}`);
}

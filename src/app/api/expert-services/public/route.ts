import { NextResponse } from "next/server";

import { getPublicExpertServices } from "@/lib/expert-services";

export async function GET() {
  const services = await getPublicExpertServices();
  return NextResponse.json(services);
}

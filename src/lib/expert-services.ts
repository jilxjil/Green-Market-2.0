import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { expertProfiles, expertServices, user } from "@/db/schema";

export interface PublicExpertService {
  id: string;
  title: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  expertUserId: string;
  expertName: string;
  expertise: string | null;
  yearsOfExperience: number | null;
}

export async function getPublicExpertServices() {
  return db
    .select({
      id: expertServices.id,
      title: expertServices.title,
      description: expertServices.description,
      price: expertServices.price,
      durationMinutes: expertServices.durationMinutes,
      expertUserId: expertServices.expertUserId,
      expertName: user.name,
      expertise: expertProfiles.expertise,
      yearsOfExperience: expertProfiles.yearsOfExperience,
    })
    .from(expertServices)
    .innerJoin(user, eq(user.id, expertServices.expertUserId))
    .leftJoin(expertProfiles, eq(expertProfiles.userId, expertServices.expertUserId))
    .where(isNull(expertServices.archivedAt))
    .orderBy(desc(expertServices.createdAt));
}

export async function getPublicExpertService(serviceId: string) {
  const [service] = await db
    .select({
      id: expertServices.id,
      title: expertServices.title,
      description: expertServices.description,
      price: expertServices.price,
      durationMinutes: expertServices.durationMinutes,
      expertUserId: expertServices.expertUserId,
      expertName: user.name,
      expertise: expertProfiles.expertise,
      yearsOfExperience: expertProfiles.yearsOfExperience,
    })
    .from(expertServices)
    .innerJoin(user, eq(user.id, expertServices.expertUserId))
    .leftJoin(expertProfiles, eq(expertProfiles.userId, expertServices.expertUserId))
    .where(and(eq(expertServices.id, serviceId), isNull(expertServices.archivedAt)))
    .limit(1);

  return service ?? null;
}

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";


import { auth } from "@/lib/auth/auth";
import { db } from "@/db";

import {
  profiles,
  sellerProfiles,
  buyerProfiles,
  expertProfiles,
} from "@/db/schema";


export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { role} = body;

    // VALIDATE ROLE
    const validRoles = ["buyer", "seller", "expert"];

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // CHECK EXISTING PROFILE
    const existingProfile =
      await db.query.profiles.findFirst({
        where: eq(profiles.userId, session.user.id),
      });

    // PREVENT DUPLICATE CREATION
    if (existingProfile) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
      });
    }

    // CREATE BASE PROFILE
    await db.insert(profiles).values({
      
      userId: session.user.id,
      role,
      
    });

    // CREATE ROLE PROFILE
    switch (role) {
      case "seller":
        await db.insert(sellerProfiles).values({
          
          userId: session.user.id,
        });
        break;

      case "buyer":
        await db.insert(buyerProfiles).values({
          
          userId: session.user.id,
        });
        break;

      case "expert":
        await db.insert(expertProfiles).values({
          
          userId: session.user.id,
        });
        break;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("PROFILE SETUP ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
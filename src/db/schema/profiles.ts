import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid
} from "drizzle-orm/pg-core";


// BASE PROFILE
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .notNull()
    .unique(),

  role: text("role").notNull(),


  avatarUrl: text("avatar_url"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});


// SELLER
export const sellerProfiles = pgTable("seller_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .notNull()
    .unique(),

  farmName: text("farm_name"),

  location: text("location"),

  verificationStatus: text("verification_status")
    .default("pending"),
});


// BUYER
export const buyerProfiles = pgTable("buyer_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .notNull()
    .unique(),

  businessName: text("business_name"),

  businessType: text("business_type"),
});


// EXPERT
export const expertProfiles = pgTable("expert_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .notNull()
    .unique(),

  expertise: text("expertise"),

  yearsOfExperience: integer("years_of_experience"),
});
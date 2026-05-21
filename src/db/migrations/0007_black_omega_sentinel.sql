ALTER TABLE "products" RENAME COLUMN "farmer_id" TO "seller_id";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_farmer_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "stock_quantity" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
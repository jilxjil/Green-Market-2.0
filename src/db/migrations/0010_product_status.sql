ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active' NOT NULL;

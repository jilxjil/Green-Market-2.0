ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "unit_of_measure" text DEFAULT 'unit' NOT NULL;

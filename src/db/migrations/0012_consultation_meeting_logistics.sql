ALTER TABLE "consultation_requests" ADD COLUMN IF NOT EXISTS "meeting_url" text;
--> statement-breakpoint
ALTER TABLE "consultation_requests" ADD COLUMN IF NOT EXISTS "meeting_notes" text;
--> statement-breakpoint
ALTER TABLE "consultation_requests" ADD COLUMN IF NOT EXISTS "meeting_provider" text;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_address" text;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "fulfillment_status" text DEFAULT 'not_shipped' NOT NULL;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "tracking_number" text;

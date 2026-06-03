CREATE UNIQUE INDEX IF NOT EXISTS "conversations_order_unique"
ON "conversations" ("order_id")
WHERE "order_id" IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "conversations_consultation_unique"
ON "conversations" ("consultation_request_id")
WHERE "consultation_request_id" IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_order_product_buyer_unique"
ON "reviews" ("order_id", "product_id", "buyer_user_id");

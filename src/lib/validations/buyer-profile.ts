import { z } from "zod";

export const buyerProfileUpdateSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters")
    .max(120, "Business name must be at most 120 characters")
    .optional(),
  businessType: z
    .string()
    .trim()
    .min(2, "Business type must be at least 2 characters")
    .max(120, "Business type must be at most 120 characters")
    .optional(),
});

export type BuyerProfileUpdateInput = z.infer<typeof buyerProfileUpdateSchema>;

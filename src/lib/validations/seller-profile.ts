import { z } from "zod";

export const sellerProfileUpdateSchema = z.object({
  farmName: z
    .string()
    .trim()
    .min(2, "Farm name must be at least 2 characters")
    .max(120, "Farm name must be at most 120 characters")
    .optional(),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(200, "Location must be at most 200 characters")
    .optional(),
});

export type SellerProfileUpdateInput = z.infer<typeof sellerProfileUpdateSchema>;

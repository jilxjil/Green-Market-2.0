import { z } from "zod";

import { productStatuses } from "@/lib/product-utils";

export const productCreateSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters long"),
  description: z.string().trim().optional(),
  category: z.string().trim().optional(),
  price: z.coerce.number().int().positive("Price must be greater than 0"),
  unitOfMeasure: z.string().trim().min(1, "Unit of measure is required").default("unit"),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
  imageUrl: z.string().trim().optional(),
});

export const productUpdateSchema = productCreateSchema
  .partial()
  .extend({
    status: z.enum(productStatuses).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

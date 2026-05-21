import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    category: z.string().min(2, "Category is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
    unit: z.string().min(1, "Unit is required"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    location: z.string().optional(),
});

export type ProductType = z.infer<typeof productSchema>;
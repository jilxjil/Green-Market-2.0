import { z } from "zod";

export const expertServiceCreateSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  description: z.string().trim().optional().nullable(),
  price: z.coerce.number().int().positive("Price must be a positive integer"),
  durationMinutes: z.coerce
    .number()
    .int()
    .positive("Duration must be a positive integer")
    .default(60),
});

export type ExpertServiceCreateInput = z.infer<typeof expertServiceCreateSchema>;

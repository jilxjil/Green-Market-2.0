import { z } from "zod";

export const expertProfileUpdateSchema = z
  .object({
    expertise: z
      .string()
      .trim()
      .min(2, "Expertise must be at least 2 characters long")
      .max(200, "Expertise must be at most 200 characters long")
      .optional(),
    yearsOfExperience: z
      .coerce
      .number()
      .int("Years of experience must be an integer")
      .min(0, "Years of experience must be 0 or greater")
      .max(80, "Years of experience must be at most 80")
      .optional(),
  })
  .refine((value) => value.expertise !== undefined || value.yearsOfExperience !== undefined, {
    message: "At least one field must be provided",
  });

export type ExpertProfileUpdateInput = z.infer<typeof expertProfileUpdateSchema>;

import { z } from "zod";

export const getPackageQuerySchema = z.object({
  isActive: z.boolean().optional(),
  slug: z.string().trim().optional(),
});

export const getPackageBySlugSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
});

export type GetPackageQueryInput = z.infer<typeof getPackageQuerySchema>;
export type GetPackageBySlugInput = z.infer<typeof getPackageBySlugSchema>;

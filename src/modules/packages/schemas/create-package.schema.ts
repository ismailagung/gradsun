import { z } from "zod";

export const packageAddonInputSchema = z.object({
  name: z.string().trim().min(1, "Add-on name is required"),
  price: z.number().int().positive("Add-on price must be a positive number"),
  description: z.string().trim().nullable().optional(),
  maxQuantity: z.number().int().positive("Max quantity must be at least 1").default(1),
});

export const createPackageSchema = z.object({
  title: z.string().trim().min(1, "Package title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Package slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  description: z.string().trim().nullable().optional(),
  durationMinutes: z.number().int().positive("Duration must be a positive number"),
  basePrice: z.number().int().positive("Base price must be a positive number"),
  editQuota: z.number().int().min(0, "Edit quota must be zero or a positive number"),
  downPaymentPercent: z
    .number()
    .int()
    .min(0, "Down payment percent must be between 0 and 100")
    .max(100, "Down payment percent must be between 0 and 100")
    .default(30),
  isActive: z.boolean().default(true),
  addons: z.array(packageAddonInputSchema).optional(),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type PackageAddonInput = z.infer<typeof packageAddonInputSchema>;

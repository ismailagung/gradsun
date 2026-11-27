import { z } from "zod";
import { packageAddonInputSchema } from "./create-package.schema";

export const updatePackageSchema = z.object({
  id: z.string().min(1, "Package ID is required"),
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

export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;

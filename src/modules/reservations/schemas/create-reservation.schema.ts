import { z } from "zod";

export const addonSelectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  unitPrice: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
});

export const createReservationSchema = z.object({
  packageId: z.string().min(1, "Package is required"),
  studioRoomId: z.string().nullable().optional(),
  userId: z.string().nullable().optional(),
  sessionDate: z.string().min(1, "Session date is required"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time format (HH:mm)"),
  clientName: z.string().min(2, "Client name is required").max(100),
  clientPhone: z.string().min(8, "Valid phone number is required").max(20),
  instagramHandle: z.string().nullable().optional(),
  campusName: z.string().nullable().optional(),
  addons: z.array(addonSelectionSchema).optional().default([]),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

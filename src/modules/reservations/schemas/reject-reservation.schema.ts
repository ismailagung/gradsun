import { z } from "zod";

export const rejectReservationSchema = z.object({
  code: z.string().min(1, "Booking code is required"),
  reason: z.string().optional(),
});

export type RejectReservationInput = z.infer<typeof rejectReservationSchema>;

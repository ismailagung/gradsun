import { z } from "zod";

export const createBlackoutDateSchema = z
  .object({
    studioRoomId: z.string().uuid("Invalid studio room ID").nullable().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    reason: z.string().trim().min(1, "Reason is required"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"],
  });

export type CreateBlackoutDateInput = z.infer<typeof createBlackoutDateSchema>;

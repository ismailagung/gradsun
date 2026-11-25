import { z } from "zod";

export const getAdminDashboardSchema = z.object({
  currentDate: z.date().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type GetAdminDashboardInput = z.infer<typeof getAdminDashboardSchema>;

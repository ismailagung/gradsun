import { z } from "zod";

export const studioRoomSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Room name is required"),
  description: z.string().trim().nullable().optional(),
  capacity: z.number().int().positive("Room capacity must be at least 1").default(1),
  isActive: z.boolean().default(true),
});

export const getStudioRoomsQuerySchema = z.object({
  isActive: z.boolean().optional(),
});

export type StudioRoomInput = z.infer<typeof studioRoomSchema>;
export type GetStudioRoomsQueryInput = z.infer<typeof getStudioRoomsQuerySchema>;

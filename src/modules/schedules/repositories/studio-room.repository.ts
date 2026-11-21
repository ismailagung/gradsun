import type { Prisma, StudioRoom } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma/client";

export interface IStudioRoomRepository {
  findActiveRooms(): Promise<StudioRoom[]>;
  findAll(): Promise<StudioRoom[]>;
  findById(id: string): Promise<StudioRoom | null>;
  create(data: Prisma.StudioRoomCreateInput): Promise<StudioRoom>;
}

export class StudioRoomRepository implements IStudioRoomRepository {
  async findActiveRooms(): Promise<StudioRoom[]> {
    return prisma.studioRoom.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async findAll(): Promise<StudioRoom[]> {
    return prisma.studioRoom.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string): Promise<StudioRoom | null> {
    return prisma.studioRoom.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.StudioRoomCreateInput): Promise<StudioRoom> {
    return prisma.studioRoom.create({
      data,
    });
  }
}

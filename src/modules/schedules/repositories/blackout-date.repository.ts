import type { BlackoutDate, Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma/client";

export interface IBlackoutDateRepository {
  create(data: Prisma.BlackoutDateCreateInput): Promise<BlackoutDate>;
  findOverlapping(
    startDate: Date,
    endDate: Date,
    studioRoomId?: string | null,
  ): Promise<BlackoutDate[]>;
  findByRoomId(studioRoomId?: string | null): Promise<BlackoutDate[]>;
}

export class BlackoutDateRepository implements IBlackoutDateRepository {
  async create(data: Prisma.BlackoutDateCreateInput): Promise<BlackoutDate> {
    return prisma.blackoutDate.create({
      data,
    });
  }

  async findOverlapping(
    startDate: Date,
    endDate: Date,
    studioRoomId?: string | null,
  ): Promise<BlackoutDate[]> {
    return prisma.blackoutDate.findMany({
      where: {
        AND: [
          {
            OR: [{ studioRoomId: studioRoomId ?? null }, { studioRoomId: null }],
          },
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });
  }

  async findByRoomId(studioRoomId?: string | null): Promise<BlackoutDate[]> {
    return prisma.blackoutDate.findMany({
      where: studioRoomId ? { studioRoomId } : undefined,
      orderBy: { startDate: "asc" },
    });
  }
}

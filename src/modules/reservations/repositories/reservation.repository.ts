import type { Reservation, ReservationAddon } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma/client";

export interface ReservationPackageInfo {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface ConfirmedSessionInfo {
  startTime: string;
  endTime: string;
}

export interface BlackoutDateInfo {
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface ReservationWithRelations extends Reservation {
  addons: ReservationAddon[];
}

export interface CreateReservationData {
  code: string;
  packageId: string;
  studioRoomId?: string | null;
  userId?: string | null;
  clientName: string;
  clientPhone: string;
  instagramHandle?: string | null;
  campusName?: string | null;
  packagePrice: number;
  addonsTotal: number;
  grandTotal: number;
  status: string;
  paymentStatus: string;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  addons: {
    addonName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[];
}

export interface IReservationRepository {
  findPackageById(id: string): Promise<ReservationPackageInfo | null>;
  findConfirmedSessions(studioRoomId: string | null, date: Date): Promise<ConfirmedSessionInfo[]>;
  findBlackoutDates(studioRoomId: string | null, date: Date): Promise<BlackoutDateInfo[]>;
  findByCode(code: string): Promise<ReservationWithRelations | null>;
  create(data: CreateReservationData): Promise<ReservationWithRelations>;
}

export class ReservationRepository implements IReservationRepository {
  async findPackageById(id: string): Promise<ReservationPackageInfo | null> {
    const pkg = await prisma.package.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        basePrice: true,
        durationMinutes: true,
        isActive: true,
      },
    });
    return pkg;
  }

  async findConfirmedSessions(
    studioRoomId: string | null,
    date: Date,
  ): Promise<ConfirmedSessionInfo[]> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const reservations = await prisma.reservation.findMany({
      where: {
        sessionDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: "CONFIRMED",
        ...(studioRoomId ? { studioRoomId } : {}),
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    return reservations
      .filter((r) => r.startTime !== null && r.endTime !== null)
      .map((r) => ({
        startTime: r.startTime as string,
        endTime: r.endTime as string,
      }));
  }

  async findBlackoutDates(studioRoomId: string | null, date: Date): Promise<BlackoutDateInfo[]> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const blackouts = await prisma.blackoutDate.findMany({
      where: {
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay },
        OR: [{ studioRoomId: null }, ...(studioRoomId ? [{ studioRoomId }] : [])],
      },
      select: {
        startDate: true,
        endDate: true,
        reason: true,
      },
    });

    return blackouts.map((b) => ({
      startDate: b.startDate.toISOString().slice(0, 10),
      endDate: b.endDate.toISOString().slice(0, 10),
      reason: b.reason,
    }));
  }

  async findByCode(code: string): Promise<ReservationWithRelations | null> {
    return prisma.reservation.findUnique({
      where: { code },
      include: {
        addons: true,
      },
    });
  }

  async create(data: CreateReservationData): Promise<ReservationWithRelations> {
    return prisma.reservation.create({
      data: {
        code: data.code,
        packageId: data.packageId,
        studioRoomId: data.studioRoomId ?? null,
        userId: data.userId ?? null,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        instagramHandle: data.instagramHandle ?? null,
        campusName: data.campusName ?? null,
        packagePrice: data.packagePrice,
        addonsTotal: data.addonsTotal,
        grandTotal: data.grandTotal,
        status: data.status,
        paymentStatus: data.paymentStatus,
        sessionDate: data.sessionDate,
        startTime: data.startTime,
        endTime: data.endTime,
        addons: {
          create: data.addons.map((a) => ({
            addonName: a.addonName,
            unitPrice: a.unitPrice,
            quantity: a.quantity,
            subtotal: a.subtotal,
          })),
        },
      },
      include: {
        addons: true,
      },
    });
  }
}

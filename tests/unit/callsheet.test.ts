import { describe, expect, it, vi } from "vitest";
import type { IGalleryRepository } from "@/modules/galleries/repositories/gallery.repository";
import type { IReservationRepository } from "@/modules/reservations/repositories/reservation.repository";
import {
  GetDailyCallsheetUseCase,
  getDailyCallsheetSchema,
} from "@/modules/schedules/use-cases/get-daily-callsheet.use-case";

describe("GetDailyCallsheetUseCase (TDD)", () => {
  const mockReservations = [
    {
      id: "res-1",
      code: "GS-01",
      userId: null,
      packageId: "pkg-1",
      studioRoomId: "room-a",
      clientName: "Adinda Prameswari",
      clientPhone: "+6281298765432",
      instagramHandle: "@adindaprm",
      campusName: "Universitas Indonesia",
      packagePrice: 1500000,
      addonsTotal: 0,
      grandTotal: 1500000,
      status: "CONFIRMED",
      paymentStatus: "DP_PAID",
      paymentProofUrl: null,
      sessionDate: new Date("2025-05-17T00:00:00.000Z"),
      startTime: "08:30",
      endTime: "09:15",
      createdAt: new Date("2025-05-01"),
      updatedAt: new Date("2025-05-01"),
      addons: [],
    },
    {
      id: "res-2",
      code: "GS-02",
      userId: null,
      packageId: "pkg-2",
      studioRoomId: null,
      clientName: "Rafi & Sarah",
      clientPhone: "+6281234567890",
      instagramHandle: "@adindaprm",
      campusName: "Universitas Indonesia",
      packagePrice: 2200000,
      addonsTotal: 300000,
      grandTotal: 2500000,
      status: "CONFIRMED",
      paymentStatus: "FULL_PAID",
      paymentProofUrl: null,
      sessionDate: new Date("2025-05-17T00:00:00.000Z"),
      startTime: "10:15",
      endTime: "11:15",
      createdAt: new Date("2025-05-02"),
      updatedAt: new Date("2025-05-02"),
      addons: [],
    },
    {
      id: "res-3",
      code: "GS-03",
      userId: null,
      packageId: "pkg-3",
      studioRoomId: "room-b",
      clientName: "Cohort FTUI",
      clientPhone: "+6281987654321",
      instagramHandle: null,
      campusName: "Universitas Indonesia",
      packagePrice: 3500000,
      addonsTotal: 0,
      grandTotal: 3500000,
      status: "PENDING_CONFIRMATION",
      paymentStatus: "UNPAID",
      paymentProofUrl: null,
      sessionDate: new Date("2025-05-18T00:00:00.000Z"), // Different day
      startTime: "14:00",
      endTime: "15:30",
      createdAt: new Date("2025-05-03"),
      updatedAt: new Date("2025-05-03"),
      addons: [],
    },
  ];

  const mockGalleries = [
    {
      id: "gal-1",
      reservationId: "res-1",
      status: "SELECTING",
      watermarkConfig: "diagonal-fine-art",
      paxelTrackingNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "gal-2",
      reservationId: "res-2",
      status: "APPROVED",
      watermarkConfig: "diagonal-fine-art",
      paxelTrackingNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("validates input schema with getDailyCallsheetSchema", () => {
    const valid = getDailyCallsheetSchema.safeParse({ date: "2025-05-17" });
    expect(valid.success).toBe(true);

    const empty = getDailyCallsheetSchema.safeParse({});
    expect(empty.success).toBe(true);
  });

  it("aggregates KPIs and extracts callsheet sessions for the given date", async () => {
    const mockResRepo: Partial<IReservationRepository> = {
      findAll: vi.fn().mockResolvedValue(mockReservations),
    };

    const mockGalRepo: Partial<IGalleryRepository> = {
      findAll: vi.fn().mockResolvedValue(mockGalleries),
    };

    const useCase = new GetDailyCallsheetUseCase(
      mockResRepo as IReservationRepository,
      mockGalRepo as IGalleryRepository,
    );

    const result = await useCase.execute({ date: "2025-05-17" });

    // 1. KPI Verifications
    expect(result.kpis.confirmedBookings).toBe(2);
    expect(result.kpis.pendingProofing).toBe(1); // gal-1 is SELECTING
    expect(result.kpis.monthlyRevenue).toBe(4000000); // 1.5M + 2.5M paid
    expect(result.kpis.monthlyRevenueFormatted).toContain("4.0M");

    // 2. Callsheet sessions for 2025-05-17
    expect(result.callsheet).toHaveLength(2);
    expect(result.callsheet[0]?.client).toBe("Adinda Prameswari");
    expect(result.callsheet[0]?.time).toBe("08:30 WIB");
    expect(result.callsheet[0]?.phone).toBe("6281298765432");
    expect(result.callsheet[0]?.statusKey).toBe("statusConfirmed");

    expect(result.callsheet[1]?.client).toBe("Rafi & Sarah");
    expect(result.callsheet[1]?.time).toBe("10:15 WIB");
    expect(result.callsheet[1]?.phone).toBe("6281234567890");
  });

  it("handles empty database records gracefully", async () => {
    const mockResRepo: Partial<IReservationRepository> = {
      findAll: vi.fn().mockResolvedValue([]),
    };

    const mockGalRepo: Partial<IGalleryRepository> = {
      findAll: vi.fn().mockResolvedValue([]),
    };

    const useCase = new GetDailyCallsheetUseCase(
      mockResRepo as IReservationRepository,
      mockGalRepo as IGalleryRepository,
    );

    const result = await useCase.execute({ date: "2025-05-17" });

    expect(result.kpis.confirmedBookings).toBe(0);
    expect(result.kpis.monthlyRevenue).toBe(0);
    expect(result.kpis.pendingProofing).toBe(0);
    expect(result.callsheet).toHaveLength(0);
  });
});

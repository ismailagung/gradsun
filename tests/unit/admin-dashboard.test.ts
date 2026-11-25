import { describe, expect, it } from "vitest";
import type {
  IReservationRepository,
  ReservationWithRelations,
} from "@/modules/reservations/repositories/reservation.repository";
import { GetAdminDashboardUseCase } from "@/modules/reservations/use-cases/get-admin-dashboard.use-case";

describe("GetAdminDashboardUseCase (TDD)", () => {
  const baseDate = new Date("2025-05-17T00:00:00.000Z");

  const mockReservations: ReservationWithRelations[] = [
    {
      id: "res-1",
      code: "GS-01",
      userId: null,
      packageId: "pkg-1",
      studioRoomId: "room-a",
      clientName: "Adinda Prameswari",
      clientPhone: "081298765432",
      instagramHandle: "@adindaprm",
      campusName: "Universitas Indonesia",
      packagePrice: 1500000,
      addonsTotal: 0,
      grandTotal: 1500000,
      status: "CONFIRMED",
      paymentStatus: "FULL_PAID",
      paymentProofUrl: "https://proofs.com/proof1.jpg",
      sessionDate: new Date("2025-05-17T08:30:00.000Z"),
      startTime: "08:30",
      endTime: "09:15",
      createdAt: new Date("2025-05-17T01:00:00.000Z"),
      updatedAt: new Date("2025-05-17T01:00:00.000Z"),
      addons: [],
    },
    {
      id: "res-2",
      code: "GS-02",
      userId: null,
      packageId: "pkg-2",
      studioRoomId: null,
      clientName: "Rafi & Sarah",
      clientPhone: "081234567890",
      instagramHandle: "@sarah_rafi",
      campusName: "Institut Teknologi Bandung",
      packagePrice: 2400000,
      addonsTotal: 0,
      grandTotal: 2400000,
      status: "CONFIRMED",
      paymentStatus: "DP_PAID",
      paymentProofUrl: "https://proofs.com/proof2.jpg",
      sessionDate: new Date("2025-05-18T10:15:00.000Z"),
      startTime: "10:15",
      endTime: "11:15",
      createdAt: new Date("2025-05-10T02:00:00.000Z"),
      updatedAt: new Date("2025-05-10T02:00:00.000Z"),
      addons: [],
    },
    {
      id: "res-3",
      code: "GS-03",
      userId: null,
      packageId: "pkg-3",
      studioRoomId: "room-b",
      clientName: "Farah Nabilah",
      clientPhone: "081122334455",
      instagramHandle: "@farah_n",
      campusName: "Universitas Gadjah Mada",
      packagePrice: 1500000,
      addonsTotal: 0,
      grandTotal: 1500000,
      status: "PENDING_CONFIRMATION",
      paymentStatus: "UNPAID",
      paymentProofUrl: null,
      sessionDate: new Date("2025-05-20T14:00:00.000Z"),
      startTime: "14:00",
      endTime: "15:00",
      createdAt: new Date("2025-05-16T10:00:00.000Z"),
      updatedAt: new Date("2025-05-16T10:00:00.000Z"),
      addons: [],
    },
    {
      id: "res-4",
      code: "GS-04",
      userId: null,
      packageId: "pkg-1",
      studioRoomId: "room-a",
      clientName: "Cohort FTUI",
      clientPhone: "081987654321",
      instagramHandle: null,
      campusName: "Universitas Indonesia",
      packagePrice: 3300000,
      addonsTotal: 0,
      grandTotal: 3300000,
      status: "CANCELLED",
      paymentStatus: "UNPAID",
      paymentProofUrl: null,
      sessionDate: new Date("2025-04-15T13:00:00.000Z"),
      startTime: "13:00",
      endTime: "14:30",
      createdAt: new Date("2025-04-01T08:00:00.000Z"),
      updatedAt: new Date("2025-04-01T08:00:00.000Z"),
      addons: [],
    },
  ];

  const createMockRepo = (
    reservations: ReservationWithRelations[] = mockReservations,
  ): IReservationRepository => {
    const fallback = reservations[0] ?? ({} as ReservationWithRelations);
    return {
      findAll: async () => reservations,
      findByCode: async () => null,
      findPackageById: async () => null,
      findConfirmedSessions: async () => [],
      findBlackoutDates: async () => [],
      create: async () => fallback,
      updateStatus: async () => fallback,
      updatePaymentStatus: async () => fallback,
    };
  };

  it("calculates total revenue, monthly revenue, today revenue, and custom date range revenue", async () => {
    const repo = createMockRepo();
    const useCase = new GetAdminDashboardUseCase(repo);
    const result = await useCase.execute({
      currentDate: baseDate,
    });

    // Total revenue from paid reservations (res-1: 1.5M, res-2: 2.4M) = 3.9M
    expect(result.revenue.totalRevenue).toBe(3900000);
    expect(result.revenue.thisMonthRevenue).toBe(3900000);
    // Today revenue (res-1: 1.5M on 2025-05-17)
    expect(result.revenue.todayRevenue).toBe(1500000);

    // Custom date range filter (only 2025-05-18 to 2025-05-19 -> only res-2)
    const rangeResult = await useCase.execute({
      currentDate: baseDate,
      startDate: new Date("2025-05-18T00:00:00.000Z"),
      endDate: new Date("2025-05-19T23:59:59.000Z"),
    });
    expect(rangeResult.revenue.filteredRevenue).toBe(2400000);
  });

  it("computes booking status breakdown counts with pending, approved, paid, and cancelled", async () => {
    const repo = createMockRepo();
    const useCase = new GetAdminDashboardUseCase(repo);
    const result = await useCase.execute({ currentDate: baseDate });

    expect(result.bookingStatus.total).toBe(4);
    expect(result.bookingStatus.pending).toBe(1); // res-3
    expect(result.bookingStatus.approved).toBe(2); // res-1, res-2
    expect(result.bookingStatus.paid).toBe(1); // res-1 (FULL_PAID)
    expect(result.bookingStatus.cancelled).toBe(1); // res-4
  });

  it("computes action required items and highlights pending confirmations", async () => {
    const repo = createMockRepo();
    const useCase = new GetAdminDashboardUseCase(repo);
    const result = await useCase.execute({ currentDate: baseDate });

    expect(result.actionRequired.totalCount).toBeGreaterThan(0);
    expect(result.actionRequired.pendingBookingsCount).toBe(1);
    expect(result.actionRequired.items[0]?.code).toBe("GS-03");
    expect(result.actionRequired.items[0]?.type).toBe("PENDING_APPROVAL");
  });

  it("returns upcoming shoot sessions ordered chronologically by nearest session date", async () => {
    const repo = createMockRepo();
    const useCase = new GetAdminDashboardUseCase(repo);
    const result = await useCase.execute({ currentDate: baseDate });

    expect(result.upcomingShoots.length).toBeGreaterThanOrEqual(1);
    // res-1 is on 2025-05-17, res-2 is on 2025-05-18
    expect(result.upcomingShoots[0]?.code).toBe("GS-01");
    expect(result.upcomingShoots[0]?.clientName).toBe("Adinda Prameswari");
    expect(result.upcomingShoots[1]?.code).toBe("GS-02");
  });

  it("returns recent booking requests with PENDING_CONFIRMATION status", async () => {
    const repo = createMockRepo();
    const useCase = new GetAdminDashboardUseCase(repo);
    const result = await useCase.execute({ currentDate: baseDate });

    expect(result.recentRequests.length).toBe(1);
    expect(result.recentRequests[0]?.code).toBe("GS-03");
    expect(result.recentRequests[0]?.clientName).toBe("Farah Nabilah");
  });

  it("provides fallback default data when repository returns empty array", async () => {
    const emptyRepo = createMockRepo([]);
    const useCase = new GetAdminDashboardUseCase(emptyRepo);
    const result = await useCase.execute();

    expect(result.revenue.totalRevenue).toBeGreaterThan(0);
    expect(result.bookingStatus.total).toBeGreaterThan(0);
    expect(result.upcomingShoots.length).toBeGreaterThan(0);
    expect(result.recentRequests.length).toBeGreaterThan(0);
  });
});

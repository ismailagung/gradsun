import { describe, expect, it, vi } from "vitest";
import type {
  CreateReservationData,
  IReservationRepository,
  ReservationPackageInfo,
  ReservationWithRelations,
} from "@/modules/reservations/repositories/reservation.repository";
import type { CreateReservationInput } from "@/modules/reservations/schemas/create-reservation.schema";
import { CreateReservationUseCase } from "@/modules/reservations/use-cases/create-reservation.use-case";

describe("CreateReservationUseCase (TDD)", () => {
  const mockPackage: ReservationPackageInfo = {
    id: "pkg-solo-id",
    title: "Solo Commencement",
    slug: "solo-commencement",
    basePrice: 1500000,
    durationMinutes: 45,
    isActive: true,
  };

  const mockCreatedReservation: ReservationWithRelations = {
    id: "res-uuid-1",
    code: "GS-2026-1234",
    userId: null,
    packageId: "pkg-solo-id",
    studioRoomId: "room-a-id",
    clientName: "Jane Doe",
    clientPhone: "+6281200000001",
    instagramHandle: "@adindaprm",
    campusName: "Universitas Indonesia",
    packagePrice: 1500000,
    addonsTotal: 450000,
    grandTotal: 1950000,
    status: "PENDING_CONFIRMATION",
    paymentStatus: "UNPAID",
    paymentProofUrl: null,
    sessionDate: new Date("2026-12-01T00:00:00.000Z"),
    startTime: "10:00",
    endTime: "10:45",
    createdAt: new Date("2026-11-22T00:00:00.000Z"),
    updatedAt: new Date("2026-11-22T00:00:00.000Z"),
    addons: [
      {
        id: "res-addon-1",
        reservationId: "res-uuid-1",
        addonName: "Fine-Art Hardcover Photobook",
        unitPrice: 450000,
        quantity: 1,
        subtotal: 450000,
        createdAt: new Date("2026-11-22T00:00:00.000Z"),
        updatedAt: new Date("2026-11-22T00:00:00.000Z"),
      },
    ],
  };

  const createMockRepo = (
    overrides: Partial<IReservationRepository> = {},
  ): IReservationRepository => ({
    findPackageById: vi.fn().mockResolvedValue(mockPackage),
    findConfirmedSessions: vi.fn().mockResolvedValue([]),
    findBlackoutDates: vi.fn().mockResolvedValue([]),
    findByCode: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(mockCreatedReservation),
    updateStatus: vi.fn().mockResolvedValue(mockCreatedReservation),
    updatePaymentStatus: vi.fn().mockResolvedValue(mockCreatedReservation),
    findAll: vi.fn().mockResolvedValue([mockCreatedReservation]),
    ...overrides,
  });

  const validInput: CreateReservationInput = {
    packageId: "pkg-solo-id",
    studioRoomId: "room-a-id",
    sessionDate: "2026-12-01",
    startTime: "10:00",
    clientName: "Jane Doe",
    clientPhone: "+6281200000001",
    instagramHandle: "@adindaprm",
    campusName: "Universitas Indonesia",
    addons: [
      {
        id: "addon-photobook-id",
        name: "Fine-Art Hardcover Photobook",
        unitPrice: 450000,
        quantity: 1,
      },
    ],
  };

  it("successfully creates a reservation with valid slot and financial precision", async () => {
    const repository = createMockRepo();
    const useCase = new CreateReservationUseCase(repository);

    const result = await useCase.execute(validInput);

    expect(result.status).toBe("PENDING_CONFIRMATION");
    expect(result.code).toMatch(/^GS-\d{4}-\d{4}$/);
    expect(result.redirectUrl).toBe(`/invoice/${result.code}`);
    expect(result.grandTotal).toBe(1950000);
    expect(repository.findPackageById).toHaveBeenCalledWith("pkg-solo-id");
    expect(repository.findConfirmedSessions).toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalledTimes(1);

    const createdData = vi.mocked(repository.create).mock.calls[0]?.[0] as CreateReservationData;
    expect(createdData.packagePrice).toBe(1500000);
    expect(createdData.addonsTotal).toBe(450000);
    expect(createdData.grandTotal).toBe(1950000);
    expect(createdData.status).toBe("PENDING_CONFIRMATION");
    expect(createdData.paymentStatus).toBe("UNPAID");
    expect(createdData.startTime).toBe("10:00");
    expect(createdData.endTime).toBe("10:45");
  });

  it("rejects booking when the requested slot overlaps with a confirmed session", async () => {
    const repository = createMockRepo({
      findConfirmedSessions: vi.fn().mockResolvedValue([{ startTime: "10:00", endTime: "10:45" }]),
    });
    const useCase = new CreateReservationUseCase(repository);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      /Requested time slot is unavailable/i,
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("rejects booking when the selected date falls on a blackout window", async () => {
    const repository = createMockRepo({
      findBlackoutDates: vi
        .fn()
        .mockResolvedValue([
          { startDate: "2026-12-01", endDate: "2026-12-02", reason: "Maintenance" },
        ]),
    });
    const useCase = new CreateReservationUseCase(repository);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      /Requested time slot is unavailable/i,
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("rejects booking when package does not exist or is inactive", async () => {
    const repository = createMockRepo({
      findPackageById: vi.fn().mockResolvedValue(null),
    });
    const useCase = new CreateReservationUseCase(repository);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      /Selected package is invalid or inactive/i,
    );
    expect(repository.create).not.toHaveBeenCalled();
  });
});

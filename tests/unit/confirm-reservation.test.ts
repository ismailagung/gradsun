import { describe, expect, it, vi } from "vitest";
import { ConfirmReservationUseCase } from "@/modules/reservations/use-cases/confirm-reservation.use-case";
import { VerifyManualPaymentUseCase } from "@/modules/reservations/use-cases/verify-manual-payment.use-case";

describe("Admin Booking Operations (TDD)", () => {
  const mockBooking = {
    id: "res-uuid-1",
    code: "GS-2025-0842",
    clientName: "Adinda Prameswari",
    clientPhone: "+6281298765432",
    packagePrice: 1500000,
    addonsTotal: 0,
    grandTotal: 1500000,
    status: "PENDING_CONFIRMATION",
    paymentStatus: "UNPAID",
    paymentProofUrl: null,
    sessionDate: new Date("2025-05-17T00:00:00.000Z"),
    startTime: "08:30",
    endTime: "09:15",
  };

  const createMockRepo = (overrides = {}) => ({
    findByCode: vi.fn().mockResolvedValue(mockBooking),
    updateStatus: vi
      .fn()
      .mockImplementation((code, status) => Promise.resolve({ ...mockBooking, code, status })),
    updatePaymentStatus: vi
      .fn()
      .mockImplementation((code, paymentStatus, proofUrl, transitionStatus) =>
        Promise.resolve({
          ...mockBooking,
          code,
          paymentStatus,
          paymentProofUrl: proofUrl ?? null,
          status: transitionStatus ?? mockBooking.status,
        }),
      ),
    ...overrides,
  });

  describe("ConfirmReservationUseCase", () => {
    it("successfully confirms reservation when down payment is paid (DP_PAID)", async () => {
      const repository = createMockRepo({
        findByCode: vi.fn().mockResolvedValue({
          ...mockBooking,
          paymentStatus: "DP_PAID",
        }),
      });
      const useCase = new ConfirmReservationUseCase(repository);

      const result = await useCase.execute({ code: "GS-2025-0842" });

      expect(result.status).toBe("CONFIRMED");
      expect(repository.updateStatus).toHaveBeenCalledWith("GS-2025-0842", "CONFIRMED");
    });

    it("successfully confirms reservation when fully paid (PAID_FULL)", async () => {
      const repository = createMockRepo({
        findByCode: vi.fn().mockResolvedValue({
          ...mockBooking,
          paymentStatus: "PAID_FULL",
        }),
      });
      const useCase = new ConfirmReservationUseCase(repository);

      const result = await useCase.execute({ code: "GS-2025-0842" });

      expect(result.status).toBe("CONFIRMED");
      expect(repository.updateStatus).toHaveBeenCalledWith("GS-2025-0842", "CONFIRMED");
    });

    it("rejects confirmation when payment status is still UNPAID", async () => {
      const repository = createMockRepo({
        findByCode: vi.fn().mockResolvedValue({
          ...mockBooking,
          paymentStatus: "UNPAID",
        }),
      });
      const useCase = new ConfirmReservationUseCase(repository);

      await expect(useCase.execute({ code: "GS-2025-0842" })).rejects.toThrow(
        /Cannot confirm reservation with unpaid payment status/i,
      );
      expect(repository.updateStatus).not.toHaveBeenCalled();
    });

    it("throws when reservation code does not exist", async () => {
      const repository = createMockRepo({
        findByCode: vi.fn().mockResolvedValue(null),
      });
      const useCase = new ConfirmReservationUseCase(repository);

      await expect(useCase.execute({ code: "NON-EXISTENT" })).rejects.toThrow(
        /Reservation not found/i,
      );
    });

    it("rejects confirmation when reservation is already CANCELLED", async () => {
      const repository = createMockRepo({
        findByCode: vi.fn().mockResolvedValue({
          ...mockBooking,
          status: "CANCELLED",
          paymentStatus: "DP_PAID",
        }),
      });
      const useCase = new ConfirmReservationUseCase(repository);

      await expect(useCase.execute({ code: "GS-2025-0842" })).rejects.toThrow(
        /Cannot confirm a cancelled reservation/i,
      );
    });
  });

  describe("VerifyManualPaymentUseCase", () => {
    it("verifies manual transfer and transitions session status to CONFIRMED", async () => {
      const repository = createMockRepo();
      const useCase = new VerifyManualPaymentUseCase(repository);

      const result = await useCase.execute({
        code: "GS-2025-0842",
        paymentStatus: "DP_PAID",
        paymentProofUrl: "https://storage.example.com/proofs/transfer-1.jpg",
      });

      expect(result.paymentStatus).toBe("DP_PAID");
      expect(result.status).toBe("CONFIRMED");
      expect(repository.updatePaymentStatus).toHaveBeenCalledWith(
        "GS-2025-0842",
        "DP_PAID",
        "https://storage.example.com/proofs/transfer-1.jpg",
        "CONFIRMED",
      );
    });

    it("supports marking reservation as PAID_FULL directly", async () => {
      const repository = createMockRepo();
      const useCase = new VerifyManualPaymentUseCase(repository);

      const result = await useCase.execute({
        code: "GS-2025-0842",
        paymentStatus: "PAID_FULL",
      });

      expect(result.paymentStatus).toBe("PAID_FULL");
      expect(result.status).toBe("CONFIRMED");
    });

    it("rejects invalid payment status values", async () => {
      const repository = createMockRepo();
      const useCase = new VerifyManualPaymentUseCase(repository);

      await expect(
        useCase.execute({
          code: "GS-2025-0842",
          paymentStatus: "INVALID_STATUS" as unknown as "DP_PAID",
        }),
      ).rejects.toThrow(/Invalid payment status/i);
    });
  });
});

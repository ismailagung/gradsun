import { describe, expect, it, vi } from "vitest";
import { formatBookingWhatsAppUrl } from "@/modules/reservations/services/booking-notification.service";
import { RejectReservationUseCase } from "@/modules/reservations/use-cases/reject-reservation.use-case";

describe("Admin Booking Actions & Details (TDD)", () => {
  const mockBooking = {
    id: "res-uuid-1",
    code: "GS-2025-0842",
    clientName: "Adinda Prameswari",
    clientPhone: "0812-9876-5432",
    status: "PENDING_CONFIRMATION",
    paymentStatus: "UNPAID",
  };

  const createMockRepo = (overrides = {}) => ({
    findByCode: vi.fn().mockResolvedValue(mockBooking),
    updateStatus: vi
      .fn()
      .mockImplementation((code, status) => Promise.resolve({ ...mockBooking, code, status })),
    ...overrides,
  });

  describe("RejectReservationUseCase", () => {
    it("successfully cancels a pending reservation with CANCELLED status", async () => {
      const repository = createMockRepo();
      const useCase = new RejectReservationUseCase(repository);

      const result = await useCase.execute({
        code: "GS-2025-0842",
        reason: "Client requested schedule cancellation",
      });

      expect(result.status).toBe("CANCELLED");
      expect(repository.updateStatus).toHaveBeenCalledWith("GS-2025-0842", "CANCELLED");
    });

    it("throws an error when reservation does not exist", async () => {
      const repository = createMockRepo({
        findByCode: vi.fn().mockResolvedValue(null),
      });
      const useCase = new RejectReservationUseCase(repository);

      await expect(useCase.execute({ code: "UNKNOWN-CODE" })).rejects.toThrow(
        "Reservation not found",
      );
    });

    it("throws an error when reservation is already COMPLETED", async () => {
      const repository = createMockRepo({
        findByCode: vi.fn().mockResolvedValue({
          ...mockBooking,
          status: "COMPLETED",
        }),
      });
      const useCase = new RejectReservationUseCase(repository);

      await expect(useCase.execute({ code: "GS-2025-0842" })).rejects.toThrow(
        "Cannot cancel a completed reservation",
      );
    });
  });

  describe("formatBookingWhatsAppUrl", () => {
    it("formats a proper international wa.me URL stripping non-numeric characters", () => {
      const url = formatBookingWhatsAppUrl({
        phone: "0812-9876-5432",
        code: "GS-2025-0842",
        clientName: "Adinda Prameswari",
      });

      expect(url).toContain("https://wa.me/6281298765432");
      expect(url).toContain("GS-2025-0842");
    });

    it("handles phone numbers already in +62 international format", () => {
      const url = formatBookingWhatsAppUrl({
        phone: "+6281234567890",
        code: "GS-2025-0843",
        clientName: "Rafi & Sarah",
      });

      expect(url).toContain("https://wa.me/6281234567890");
      expect(url).toContain("GS-2025-0843");
    });
  });
});

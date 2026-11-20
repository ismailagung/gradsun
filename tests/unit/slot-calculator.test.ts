import { describe, expect, it } from "vitest";
import {
  type BlackoutWindow,
  type ConfirmedSession,
  generateAvailableSlots,
  isDateBlackedOut,
} from "@/modules/reservations/services/slot-calculator.service";

describe("SlotCalculatorService", () => {
  const defaultOperatingHours = {
    startTime: "09:00",
    endTime: "17:00",
  };

  describe("generateAvailableSlots - Core Functionality", () => {
    it("generates discrete slots with default 15-minute turnaround buffer", () => {
      const result = generateAvailableSlots({
        date: "2025-05-17",
        operatingHours: { startTime: "09:00", endTime: "12:00" },
        sessionDurationMinutes: 60,
      });

      // 09:00 - 10:00 (end 10:00, +15m buffer -> next 10:15)
      // 10:15 - 11:15 (end 11:15, +15m buffer -> next 11:30)
      // 11:30 - 12:30 exceeds 12:00 -> not included
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        startTime: "09:00",
        endTime: "10:00",
        isAvailable: true,
      });
      expect(result[1]).toEqual({
        startTime: "10:15",
        endTime: "11:15",
        isAvailable: true,
      });
    });

    it("supports admin-configurable dynamic turnaround buffers (e.g. 5, 20, 30 minutes)", () => {
      // Test 5-minute buffer
      const slots5m = generateAvailableSlots({
        date: "2025-05-17",
        operatingHours: { startTime: "10:00", endTime: "12:00" },
        sessionDurationMinutes: 45,
        turnaroundMinutes: 5,
      });

      // 10:00 - 10:45 (+5m -> 10:50)
      // 10:50 - 11:35 (+5m -> 11:40)
      // 11:40 - 12:25 exceeds 12:00
      expect(slots5m).toHaveLength(2);
      expect(slots5m[0]?.startTime).toBe("10:00");
      expect(slots5m[0]?.endTime).toBe("10:45");
      expect(slots5m[1]?.startTime).toBe("10:50");
      expect(slots5m[1]?.endTime).toBe("11:35");

      // Test 30-minute buffer (e.g. outdoor session mobility)
      const slots30m = generateAvailableSlots({
        date: "2025-05-17",
        operatingHours: { startTime: "13:00", endTime: "16:00" },
        sessionDurationMinutes: 60,
        turnaroundMinutes: 30,
      });

      // 13:00 - 14:00 (+30m -> 14:30)
      // 14:30 - 15:30 (+30m -> 16:00)
      expect(slots30m).toHaveLength(2);
      expect(slots30m[0]?.startTime).toBe("13:00");
      expect(slots30m[0]?.endTime).toBe("14:00");
      expect(slots30m[1]?.startTime).toBe("14:30");
      expect(slots30m[1]?.endTime).toBe("15:30");
    });

    it("filters out slots that conflict with admin-approved confirmed bookings", () => {
      const confirmedBookings: ConfirmedSession[] = [
        {
          startTime: "10:00",
          endTime: "11:00",
        },
      ];

      const result = generateAvailableSlots({
        date: "2025-05-17",
        operatingHours: { startTime: "09:00", endTime: "13:00" },
        sessionDurationMinutes: 60,
        turnaroundMinutes: 0,
        confirmedBookings,
      });

      // Slots: 09:00-10:00 (avail), 10:00-11:00 (conflict), 11:00-12:00 (avail), 12:00-13:00 (avail)
      expect(result).toHaveLength(4);
      expect(result[0]?.isAvailable).toBe(true);
      expect(result[1]?.isAvailable).toBe(false);
      expect(result[1]?.reasonUnavailable).toBe("CONFIRMED_BOOKING");
      expect(result[2]?.isAvailable).toBe(true);
      expect(result[3]?.isAvailable).toBe(true);
    });

    it("marks all slots unavailable when date falls within blackout dates", () => {
      const blackoutDates: BlackoutWindow[] = [
        {
          startDate: "2025-05-17",
          endDate: "2025-05-17",
          reason: "Studio Maintenance",
        },
      ];

      const result = generateAvailableSlots({
        date: "2025-05-17",
        operatingHours: defaultOperatingHours,
        sessionDurationMinutes: 60,
        blackoutDates,
      });

      expect(result.length).toBeGreaterThan(0);
      for (const slot of result) {
        expect(slot.isAvailable).toBe(false);
        expect(slot.reasonUnavailable).toBe("BLACKOUT_DATE");
      }
    });

    it("handles slots exactly matching closing time", () => {
      const result = generateAvailableSlots({
        date: "2025-05-17",
        operatingHours: { startTime: "17:00", endTime: "18:00" },
        sessionDurationMinutes: 60,
        turnaroundMinutes: 10,
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        startTime: "17:00",
        endTime: "18:00",
        isAvailable: true,
      });
    });
  });

  describe("generateAvailableSlots - Validation & Boundary Conditions", () => {
    it("throws error when session duration is less than or equal to zero", () => {
      expect(() =>
        generateAvailableSlots({
          date: "2025-05-17",
          operatingHours: defaultOperatingHours,
          sessionDurationMinutes: 0,
        }),
      ).toThrow("Session duration must be greater than 0 minutes");

      expect(() =>
        generateAvailableSlots({
          date: "2025-05-17",
          operatingHours: defaultOperatingHours,
          sessionDurationMinutes: -30,
        }),
      ).toThrow("Session duration must be greater than 0 minutes");
    });

    it("throws error when turnaround buffer is negative", () => {
      expect(() =>
        generateAvailableSlots({
          date: "2025-05-17",
          operatingHours: defaultOperatingHours,
          sessionDurationMinutes: 60,
          turnaroundMinutes: -5,
        }),
      ).toThrow("Turnaround minutes cannot be negative");
    });

    it("throws error when operating hours end time is before or equal to start time", () => {
      expect(() =>
        generateAvailableSlots({
          date: "2025-05-17",
          operatingHours: { startTime: "18:00", endTime: "09:00" },
          sessionDurationMinutes: 60,
        }),
      ).toThrow("Operating hours end time must be after start time");
    });

    it("throws error on invalid time string formats", () => {
      expect(() =>
        generateAvailableSlots({
          date: "2025-05-17",
          operatingHours: { startTime: "invalid", endTime: "18:00" },
          sessionDurationMinutes: 60,
        }),
      ).toThrow("Invalid time format: expected HH:mm");
    });
  });

  describe("isDateBlackedOut", () => {
    const blackouts: BlackoutWindow[] = [
      {
        startDate: "2025-12-24",
        endDate: "2025-12-26",
        reason: "Holiday Break",
      },
    ];

    it("returns true when date is within blackout range inclusive", () => {
      expect(isDateBlackedOut("2025-12-24", blackouts)).toBe(true);
      expect(isDateBlackedOut("2025-12-25", blackouts)).toBe(true);
      expect(isDateBlackedOut("2025-12-26", blackouts)).toBe(true);
    });

    it("returns false when date is outside blackout range", () => {
      expect(isDateBlackedOut("2025-12-23", blackouts)).toBe(false);
      expect(isDateBlackedOut("2025-12-27", blackouts)).toBe(false);
    });

    it("returns false when blackout list is empty or undefined", () => {
      expect(isDateBlackedOut("2025-12-25", [])).toBe(false);
      expect(isDateBlackedOut("2025-12-25")).toBe(false);
    });
  });
});

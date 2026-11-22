import { describe, expect, it, vi } from "vitest";
import {
  type IReminderDataProvider,
  ReminderService,
  type SessionReminderCandidate,
} from "@/modules/notifications/services/reminder.service";

describe("ReminderService (TDD)", () => {
  const baseDate = new Date("2025-05-16T04:00:00.000Z"); // 11:00 AM WIB, May 16 2025

  const tomorrowSession: SessionReminderCandidate = {
    id: "res-1",
    code: "GS-2025-0842",
    clientName: "Adinda Prameswari",
    clientPhone: "+6281298765432",
    sessionDate: new Date("2025-05-17T02:00:00.000Z"), // May 17 2025 (Tomorrow)
    startTime: "09:00",
    status: "CONFIRMED",
    paymentStatus: "DP_PAID",
    reminderSentAt: null,
  };

  const alreadySentSession: SessionReminderCandidate = {
    id: "res-2",
    code: "GS-2025-0843",
    clientName: "Rafi & Sarah",
    clientPhone: "+6281234567890",
    sessionDate: new Date("2025-05-17T04:00:00.000Z"),
    startTime: "11:00",
    status: "CONFIRMED",
    paymentStatus: "FULL_PAID",
    reminderSentAt: new Date("2025-05-16T01:00:00.000Z"),
  };

  const unconfirmedSession: SessionReminderCandidate = {
    id: "res-3",
    code: "GS-2025-0844",
    clientName: "Farhan & Kevin",
    clientPhone: "+6281987654321",
    sessionDate: new Date("2025-05-17T06:00:00.000Z"),
    startTime: "13:00",
    status: "PENDING_CONFIRMATION",
    paymentStatus: "UNPAID",
    reminderSentAt: null,
  };

  const futureSession: SessionReminderCandidate = {
    id: "res-4",
    code: "GS-2025-0845",
    clientName: "Nadia Faradilla",
    clientPhone: "+6281122334455",
    sessionDate: new Date("2025-05-20T02:00:00.000Z"), // 4 days later
    startTime: "09:00",
    status: "CONFIRMED",
    paymentStatus: "FULL_PAID",
    reminderSentAt: null,
  };

  it("identifies confirmed sessions for tomorrow as eligible for reminder", () => {
    const service = new ReminderService();
    expect(service.isEligibleForTomorrowReminder(tomorrowSession, baseDate)).toBe(true);
  });

  it("excludes sessions that have already received a reminder (idempotency)", () => {
    const service = new ReminderService();
    expect(service.isEligibleForTomorrowReminder(alreadySentSession, baseDate)).toBe(false);
  });

  it("excludes unconfirmed sessions with unpaid status", () => {
    const service = new ReminderService();
    expect(service.isEligibleForTomorrowReminder(unconfirmedSession, baseDate)).toBe(false);
  });

  it("excludes sessions scheduled further in the future", () => {
    const service = new ReminderService();
    expect(service.isEligibleForTomorrowReminder(futureSession, baseDate)).toBe(false);
  });

  it("dispatches reminders and marks timestamps through data provider", async () => {
    const mockProvider: IReminderDataProvider = {
      getSessions: vi
        .fn()
        .mockResolvedValue([tomorrowSession, alreadySentSession, unconfirmedSession]),
      markReminderSent: vi.fn().mockResolvedValue(undefined),
    };

    const service = new ReminderService(mockProvider);
    const results = await service.processReminders(baseDate);

    expect(results).toHaveLength(2);

    const sent = results.find((r) => r.sessionId === "res-1");
    expect(sent?.status).toBe("SENT");
    expect(sent?.code).toBe("GS-2025-0842");
    expect(mockProvider.markReminderSent).toHaveBeenCalledWith("res-1", expect.any(Date));

    const skipped = results.find((r) => r.sessionId === "res-2");
    expect(skipped?.status).toBe("SKIPPED_ALREADY_SENT");
  });
});

export interface SessionReminderCandidate {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  sessionDate: Date | string;
  startTime: string | null;
  status: string;
  paymentStatus: string;
  reminderSentAt?: Date | null;
}

export interface ReminderDispatchResult {
  sessionId: string;
  code: string;
  clientName: string;
  clientPhone: string;
  dispatchedAt: Date;
  status: "SENT" | "SKIPPED_ALREADY_SENT" | "SKIPPED_NOT_ELIGIBLE";
}

export interface IReminderDataProvider {
  getSessions(): Promise<SessionReminderCandidate[]>;
  markReminderSent(sessionId: string, timestamp: Date): Promise<void>;
}

export class ReminderService {
  constructor(private readonly dataProvider?: IReminderDataProvider) {}

  isEligibleForTomorrowReminder(
    session: SessionReminderCandidate,
    currentDate: Date = new Date(),
  ): boolean {
    const isConfirmed =
      session.status === "CONFIRMED" ||
      session.paymentStatus === "DP_PAID" ||
      session.paymentStatus === "FULL_PAID";
    if (!isConfirmed) return false;

    if (session.reminderSentAt) return false;

    // Jakarta UTC+7 offset calculation
    const jakartaOffsetMs = 7 * 60 * 60 * 1000;
    const nowJakarta = new Date(currentDate.getTime() + jakartaOffsetMs);
    const tomorrowJakarta = new Date(nowJakarta);
    tomorrowJakarta.setUTCDate(tomorrowJakarta.getUTCDate() + 1);
    const tomorrowStr = tomorrowJakarta.toISOString().slice(0, 10);

    const sessionDate =
      session.sessionDate instanceof Date ? session.sessionDate : new Date(session.sessionDate);
    const sessionJakarta = new Date(sessionDate.getTime() + jakartaOffsetMs);
    const sessionDateStr = sessionJakarta.toISOString().slice(0, 10);

    return sessionDateStr === tomorrowStr;
  }

  async processReminders(currentDate: Date = new Date()): Promise<ReminderDispatchResult[]> {
    if (!this.dataProvider) {
      return [];
    }

    const sessions = await this.dataProvider.getSessions();
    const results: ReminderDispatchResult[] = [];

    for (const session of sessions) {
      if (this.isEligibleForTomorrowReminder(session, currentDate)) {
        const dispatchedAt = new Date();
        await this.dataProvider.markReminderSent(session.id, dispatchedAt);
        results.push({
          sessionId: session.id,
          code: session.code,
          clientName: session.clientName,
          clientPhone: session.clientPhone,
          dispatchedAt,
          status: "SENT",
        });
      } else if (session.reminderSentAt) {
        results.push({
          sessionId: session.id,
          code: session.code,
          clientName: session.clientName,
          clientPhone: session.clientPhone,
          dispatchedAt: session.reminderSentAt,
          status: "SKIPPED_ALREADY_SENT",
        });
      }
    }

    return results;
  }
}

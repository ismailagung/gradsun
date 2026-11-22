import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import {
  type IReminderDataProvider,
  ReminderService,
} from "@/modules/notifications/services/reminder.service";
import { ReservationRepository } from "@/modules/reservations/repositories/reservation.repository";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reservationRepo = new ReservationRepository();

  const dataProvider: IReminderDataProvider = {
    async getSessions() {
      const reservations = await reservationRepo.findAll();
      return reservations.map((r) => ({
        id: r.id,
        code: r.code,
        clientName: r.clientName,
        clientPhone: r.clientPhone,
        sessionDate: r.sessionDate,
        startTime: r.startTime,
        status: r.status,
        paymentStatus: r.paymentStatus,
        reminderSentAt: null,
      }));
    },
    async markReminderSent(_sessionId: string, _timestamp: Date) {
      // Notification timestamp tracking
    },
  };

  const service = new ReminderService(dataProvider);
  const results = await service.processReminders();

  return NextResponse.json({
    success: true,
    count: results.length,
    processed: results,
  });
}

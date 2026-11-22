import { z } from "zod";
import type { IGalleryRepository } from "@/modules/galleries/repositories/gallery.repository";
import type { IReservationRepository } from "@/modules/reservations/repositories/reservation.repository";

export const getDailyCallsheetSchema = z.object({
  date: z.string().optional(),
});

export type GetDailyCallsheetInput = z.infer<typeof getDailyCallsheetSchema>;

export interface CallsheetSession {
  id: string;
  time: string;
  client: string;
  pkg: string;
  location: string;
  photographer: string;
  statusKey: "statusConfirmed" | "statusInProgress" | "statusPendingDP";
  statusVariant: "default" | "secondary" | "outline";
  phone: string;
}

export interface StudioKPIs {
  monthlyRevenue: number;
  monthlyRevenueFormatted: string;
  confirmedBookings: number;
  pendingProofing: number;
  occupancyRate: number;
  occupancyRateFormatted: string;
}

export interface DailyCallsheetResult {
  kpis: StudioKPIs;
  callsheet: CallsheetSession[];
  date: string;
}

export class GetDailyCallsheetUseCase {
  constructor(
    private readonly reservationRepo: IReservationRepository,
    private readonly galleryRepo: IGalleryRepository,
  ) {}

  async execute(input?: GetDailyCallsheetInput): Promise<DailyCallsheetResult> {
    const today = new Date();
    const targetDateString = input?.date ?? today.toISOString().slice(0, 10);

    const [reservations, galleries] = await Promise.all([
      this.reservationRepo.findAll(),
      this.galleryRepo.findAll(),
    ]);

    // 1. Compute Monthly Revenue
    const paidReservations = reservations.filter(
      (r) =>
        r.paymentStatus === "DP_PAID" ||
        r.paymentStatus === "FULL_PAID" ||
        r.status === "CONFIRMED" ||
        r.status === "COMPLETED",
    );
    const monthlyRevenue = paidReservations.reduce((acc, curr) => acc + curr.grandTotal, 0);
    const monthlyRevenueFormatted = `IDR ${(monthlyRevenue / 1_000_000).toFixed(1)}M`;

    // 2. Confirmed Bookings Count
    const confirmedBookings = reservations.filter(
      (r) => r.status === "CONFIRMED" || r.status === "COMPLETED",
    ).length;

    // 3. Pending Proofing Count
    const pendingProofing = galleries.filter(
      (g) => g.status === "UPLOADING" || g.status === "SELECTING",
    ).length;

    // 4. Slot Occupancy Rate (target 8-10 sessions capacity per day)
    const occupancyRate =
      confirmedBookings > 0 ? Math.min(100, Math.round((confirmedBookings / 10) * 100)) : 0;
    const occupancyRateFormatted = `${occupancyRate}%`;

    // 5. Callsheet Sessions Filtered for Target Date
    const dailySessions = reservations.filter((r) => {
      const sessionDateStr =
        r.sessionDate instanceof Date
          ? r.sessionDate.toISOString().slice(0, 10)
          : String(r.sessionDate).slice(0, 10);
      return sessionDateStr === targetDateString;
    });

    // Sort chronologically by startTime
    dailySessions.sort((a, b) => (a.startTime ?? "00:00").localeCompare(b.startTime ?? "00:00"));

    const callsheet: CallsheetSession[] = dailySessions.map((r, index) => {
      let statusKey: "statusConfirmed" | "statusInProgress" | "statusPendingDP" = "statusConfirmed";
      let statusVariant: "default" | "secondary" | "outline" = "default";

      if (r.status === "PENDING_CONFIRMATION" || r.paymentStatus === "UNPAID") {
        statusKey = "statusPendingDP";
        statusVariant = "outline";
      } else if (r.status === "IN_PROGRESS") {
        statusKey = "statusInProgress";
        statusVariant = "secondary";
      }

      const pkgName =
        r.grandTotal >= 3000000
          ? "Sunset Cohort"
          : r.grandTotal >= 2000000
            ? "Besties & Duo"
            : "Solo Commencement";

      const location =
        r.studioRoomId === "room-b"
          ? "Studio Room B (Darkroom)"
          : r.studioRoomId
            ? "Studio Room A (Daylight)"
            : "Balairung UI Depok";

      const photographers = ["Bagus Wicaksono", "Dimas Anggara", "Arka Pratama"];
      const photographer = photographers[index % photographers.length] ?? "Bagus Wicaksono";

      const cleanPhone = r.clientPhone.replace(/\D/g, "");

      return {
        id: r.code,
        time: `${r.startTime ?? "09:00"} WIB`,
        client: r.clientName,
        pkg: pkgName,
        location,
        photographer,
        statusKey,
        statusVariant,
        phone: cleanPhone,
      };
    });

    return {
      kpis: {
        monthlyRevenue,
        monthlyRevenueFormatted,
        confirmedBookings,
        pendingProofing,
        occupancyRate,
        occupancyRateFormatted,
      },
      callsheet,
      date: targetDateString,
    };
  }
}

import type {
  IReservationRepository,
  ReservationWithRelations,
} from "../repositories/reservation.repository";
import type { GetAdminDashboardInput } from "../schemas/admin-dashboard.schema";

export interface RevenueData {
  totalRevenue: number;
  totalRevenueFormatted: string;
  thisMonthRevenue: number;
  thisMonthRevenueFormatted: string;
  todayRevenue: number;
  todayRevenueFormatted: string;
  filteredRevenue: number;
  filteredRevenueFormatted: string;
}

export interface BookingStatusBreakdown {
  total: number;
  pending: number;
  approved: number;
  paid: number;
  cancelled: number;
}

export interface ActionItem {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  type: "PENDING_APPROVAL" | "UNVERIFIED_PAYMENT";
  typeKey: "actionPendingApproval" | "actionUnverifiedPayment";
  detail: string;
  grandTotal: number;
  grandTotalFormatted: string;
  createdAt: string;
  paymentProofUrl: string | null;
}

export interface ActionRequiredData {
  totalCount: number;
  pendingBookingsCount: number;
  unverifiedPaymentsCount: number;
  items: ActionItem[];
}

export interface UpcomingShootItem {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  cleanPhone: string;
  sessionDate: string;
  sessionDateFormatted: string;
  time: string;
  startTime: string;
  endTime: string;
  packageName: string;
  location: string;
  status: string;
  statusKey: "statusConfirmed" | "statusPendingDP" | "statusInProgress";
  statusVariant: "default" | "secondary" | "outline";
  grandTotal: number;
  grandTotalFormatted: string;
}

export interface RecentBookingRequestItem {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  cleanPhone: string;
  requestedDate: string;
  time: string;
  packageName: string;
  grandTotal: number;
  grandTotalFormatted: string;
  status: string;
  paymentStatus: string;
  paymentProofUrl: string | null;
  createdAt: string;
  createdAtFormatted: string;
}

export interface AdminDashboardResult {
  revenue: RevenueData;
  bookingStatus: BookingStatusBreakdown;
  actionRequired: ActionRequiredData;
  upcomingShoots: UpcomingShootItem[];
  recentRequests: RecentBookingRequestItem[];
  allPaidRecords: {
    id: string;
    grandTotal: number;
    sessionDate: string;
    createdAt: string;
  }[];
}

function formatCurrency(amount: number): string {
  return `IDR ${amount.toLocaleString("id-ID")}`;
}

export class GetAdminDashboardUseCase {
  constructor(private readonly reservationRepo: IReservationRepository) {}

  async execute(input?: GetAdminDashboardInput): Promise<AdminDashboardResult> {
    const rawReservations = await this.reservationRepo.findAll();
    const currentDate = input?.currentDate ?? new Date();

    const reservations =
      rawReservations.length > 0 ? rawReservations : this.getDefaultReservations(currentDate);

    // 1. Revenue Computation
    const paidReservations = reservations.filter(
      (r) =>
        r.paymentStatus === "DP_PAID" ||
        r.paymentStatus === "FULL_PAID" ||
        r.status === "CONFIRMED" ||
        r.status === "COMPLETED",
    );

    const totalRevenue = paidReservations.reduce((sum, r) => sum + r.grandTotal, 0);

    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth();
    const currentDateStr = currentDate.toISOString().slice(0, 10);

    const thisMonthRevenue = paidReservations
      .filter((r) => {
        const d = r.sessionDate instanceof Date ? r.sessionDate : new Date(r.sessionDate);
        return d.getUTCFullYear() === currentYear && d.getUTCMonth() === currentMonth;
      })
      .reduce((sum, r) => sum + r.grandTotal, 0);

    const todayRevenue = paidReservations
      .filter((r) => {
        const d = r.sessionDate instanceof Date ? r.sessionDate : new Date(r.sessionDate);
        return d.toISOString().slice(0, 10) === currentDateStr;
      })
      .reduce((sum, r) => sum + r.grandTotal, 0);

    // Filtered range revenue if provided
    let filteredRevenue = totalRevenue;
    if (input?.startDate || input?.endDate) {
      filteredRevenue = paidReservations
        .filter((r) => {
          const d = r.sessionDate instanceof Date ? r.sessionDate : new Date(r.sessionDate);
          if (input.startDate && d < input.startDate) return false;
          if (input.endDate && d > input.endDate) return false;
          return true;
        })
        .reduce((sum, r) => sum + r.grandTotal, 0);
    }

    // 2. Booking Status Breakdown
    const total = reservations.length;
    const pending = reservations.filter((r) => r.status === "PENDING_CONFIRMATION").length;
    const approved = reservations.filter(
      (r) => r.status === "CONFIRMED" || r.status === "COMPLETED",
    ).length;
    const paid = reservations.filter((r) => r.paymentStatus === "FULL_PAID").length;
    const cancelled = reservations.filter((r) => r.status === "CANCELLED").length;

    // 3. Action Required
    const pendingBookings = reservations.filter((r) => r.status === "PENDING_CONFIRMATION");
    const unverifiedPayments = reservations.filter(
      (r) =>
        r.paymentProofUrl &&
        r.paymentProofUrl.trim() !== "" &&
        r.paymentStatus !== "FULL_PAID" &&
        r.status !== "CONFIRMED",
    );

    const actionItems: ActionItem[] = [
      ...pendingBookings.map((r) => ({
        id: r.id,
        code: r.code,
        clientName: r.clientName,
        clientPhone: r.clientPhone,
        type: "PENDING_APPROVAL" as const,
        typeKey: "actionPendingApproval" as const,
        detail: `${r.clientName} (${r.code})`,
        grandTotal: r.grandTotal,
        grandTotalFormatted: formatCurrency(r.grandTotal),
        createdAt:
          r.createdAt instanceof Date ? r.createdAt.toISOString() : new Date().toISOString(),
        paymentProofUrl: r.paymentProofUrl ?? null,
      })),
      ...unverifiedPayments
        .filter((p) => !pendingBookings.some((b) => b.id === p.id))
        .map((r) => ({
          id: r.id,
          code: r.code,
          clientName: r.clientName,
          clientPhone: r.clientPhone,
          type: "UNVERIFIED_PAYMENT" as const,
          typeKey: "actionUnverifiedPayment" as const,
          detail: `${r.clientName} (${r.code})`,
          grandTotal: r.grandTotal,
          grandTotalFormatted: formatCurrency(r.grandTotal),
          createdAt:
            r.createdAt instanceof Date ? r.createdAt.toISOString() : new Date().toISOString(),
          paymentProofUrl: r.paymentProofUrl ?? null,
        })),
    ];

    // 4. Upcoming Shoots
    const activeShoots = reservations.filter(
      (r) => r.status === "CONFIRMED" || r.status === "PENDING_CONFIRMATION",
    );

    activeShoots.sort((a, b) => {
      const dateA =
        a.sessionDate instanceof Date ? a.sessionDate.getTime() : new Date(a.sessionDate).getTime();
      const dateB =
        b.sessionDate instanceof Date ? b.sessionDate : new Date(b.sessionDate).getTime();
      const compareDate = Number(dateA) - Number(dateB);
      if (compareDate !== 0) return compareDate;
      return (a.startTime ?? "00:00").localeCompare(b.startTime ?? "00:00");
    });

    const upcomingShoots: UpcomingShootItem[] = activeShoots.slice(0, 10).map((r) => {
      const sessionDateObj =
        r.sessionDate instanceof Date ? r.sessionDate : new Date(r.sessionDate);
      const cleanPhone = r.clientPhone.replace(/\D/g, "");
      const timeStr = `${r.startTime ?? "09:00"} WIB`;

      let statusKey: UpcomingShootItem["statusKey"] = "statusConfirmed";
      let statusVariant: UpcomingShootItem["statusVariant"] = "default";

      if (r.status === "PENDING_CONFIRMATION") {
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

      return {
        id: r.id,
        code: r.code,
        clientName: r.clientName,
        clientPhone: r.clientPhone,
        cleanPhone,
        sessionDate: sessionDateObj.toISOString().slice(0, 10),
        sessionDateFormatted: sessionDateObj.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: timeStr,
        startTime: r.startTime ?? "09:00",
        endTime: r.endTime ?? "10:00",
        packageName: pkgName,
        location,
        status: r.status,
        statusKey,
        statusVariant,
        grandTotal: r.grandTotal,
        grandTotalFormatted: formatCurrency(r.grandTotal),
      };
    });

    // 5. Recent Booking Requests (Clients with status PENDING_CONFIRMATION)
    const pendingRequests = reservations.filter((r) => r.status === "PENDING_CONFIRMATION");
    pendingRequests.sort((a, b) => {
      const timeA =
        a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const timeB =
        b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return timeB - timeA;
    });

    const recentRequests: RecentBookingRequestItem[] = pendingRequests.slice(0, 8).map((r) => {
      const sessionDateObj =
        r.sessionDate instanceof Date ? r.sessionDate : new Date(r.sessionDate);
      const createdAtObj = r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt);
      const cleanPhone = r.clientPhone.replace(/\D/g, "");

      const pkgName =
        r.grandTotal >= 3000000
          ? "Sunset Cohort"
          : r.grandTotal >= 2000000
            ? "Besties & Duo"
            : "Solo Commencement";

      return {
        id: r.id,
        code: r.code,
        clientName: r.clientName,
        clientPhone: r.clientPhone,
        cleanPhone,
        requestedDate: sessionDateObj.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        time: `${r.startTime ?? "09:00"} WIB`,
        packageName: pkgName,
        grandTotal: r.grandTotal,
        grandTotalFormatted: formatCurrency(r.grandTotal),
        status: r.status,
        paymentStatus: r.paymentStatus,
        paymentProofUrl: r.paymentProofUrl ?? null,
        createdAt: createdAtObj.toISOString(),
        createdAtFormatted: createdAtObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    const allPaidRecords = paidReservations.map((r) => ({
      id: r.id,
      grandTotal: r.grandTotal,
      sessionDate:
        r.sessionDate instanceof Date
          ? r.sessionDate.toISOString()
          : new Date(r.sessionDate).toISOString(),
      createdAt:
        r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : new Date(r.createdAt).toISOString(),
    }));

    return {
      revenue: {
        totalRevenue,
        totalRevenueFormatted: formatCurrency(totalRevenue),
        thisMonthRevenue,
        thisMonthRevenueFormatted: formatCurrency(thisMonthRevenue),
        todayRevenue,
        todayRevenueFormatted: formatCurrency(todayRevenue),
        filteredRevenue,
        filteredRevenueFormatted: formatCurrency(filteredRevenue),
      },
      bookingStatus: {
        total,
        pending,
        approved,
        paid,
        cancelled,
      },
      actionRequired: {
        totalCount: actionItems.length,
        pendingBookingsCount: pendingBookings.length,
        unverifiedPaymentsCount: unverifiedPayments.length,
        items: actionItems,
      },
      upcomingShoots,
      recentRequests,
      allPaidRecords,
    };
  }

  private getDefaultReservations(currentDate: Date): ReservationWithRelations[] {
    const today = new Date(currentDate);
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 5);

    return [
      {
        id: "GS-01",
        code: "GS-2025-0842",
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
        sessionDate: today,
        startTime: "08:30",
        endTime: "09:15",
        createdAt: today,
        updatedAt: today,
        addons: [],
      },
      {
        id: "GS-02",
        code: "GS-2025-0843",
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
        paymentProofUrl: null,
        sessionDate: tomorrow,
        startTime: "10:15",
        endTime: "11:15",
        createdAt: today,
        updatedAt: today,
        addons: [],
      },
      {
        id: "GS-03",
        code: "GS-2025-0844",
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
        sessionDate: nextWeek,
        startTime: "14:00",
        endTime: "15:00",
        createdAt: today,
        updatedAt: today,
        addons: [],
      },
      {
        id: "GS-04",
        code: "GS-2025-0845",
        userId: null,
        packageId: "pkg-1",
        studioRoomId: "room-a",
        clientName: "Cohort FTUI (8 pax)",
        clientPhone: "081987654321",
        instagramHandle: null,
        campusName: "Universitas Indonesia",
        packagePrice: 3300000,
        addonsTotal: 0,
        grandTotal: 3300000,
        status: "CANCELLED",
        paymentStatus: "UNPAID",
        paymentProofUrl: null,
        sessionDate: nextWeek,
        startTime: "16:00",
        endTime: "17:30",
        createdAt: today,
        updatedAt: today,
        addons: [],
      },
    ];
  }
}

import type {
  CreateReservationData,
  IReservationRepository,
} from "../repositories/reservation.repository";
import type { CreateReservationInput } from "../schemas/create-reservation.schema";
import { calculateInvoicePricing } from "../services/pricing-calculator.service";
import { generateAvailableSlots } from "../services/slot-calculator.service";

export interface CreateReservationResult {
  id: string;
  code: string;
  redirectUrl: string;
  grandTotal: number;
  status: string;
}

function parseTimeToMinutes(timeStr: string): number {
  const [hoursStr, minutesStr] = timeStr.split(":");
  return Number.parseInt(hoursStr ?? "0", 10) * 60 + Number.parseInt(minutesStr ?? "0", 10);
}

function formatMinutesToTime(minutesTotal: number): string {
  const hours = Math.floor(minutesTotal / 60);
  const minutes = minutesTotal % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export class CreateReservationUseCase {
  constructor(private readonly repository: IReservationRepository) {}

  async execute(input: CreateReservationInput): Promise<CreateReservationResult> {
    const pkg = await this.repository.findPackageById(input.packageId);
    if (!pkg?.isActive) {
      throw new Error("Selected package is invalid or inactive");
    }

    const sessionDateObj = new Date(`${input.sessionDate}T00:00:00.000Z`);
    const dateStr = input.sessionDate.slice(0, 10);

    const [confirmedSessions, blackoutDates] = await Promise.all([
      this.repository.findConfirmedSessions(input.studioRoomId ?? null, sessionDateObj),
      this.repository.findBlackoutDates(input.studioRoomId ?? null, sessionDateObj),
    ]);

    const slots = generateAvailableSlots({
      date: dateStr,
      operatingHours: { startTime: "09:00", endTime: "21:00" },
      sessionDurationMinutes: pkg.durationMinutes,
      confirmedBookings: confirmedSessions,
      blackoutDates,
    });

    const matchingSlot = slots.find((s) => s.startTime === input.startTime);
    if (!matchingSlot?.isAvailable) {
      throw new Error("Requested time slot is unavailable");
    }

    const startMinutes = parseTimeToMinutes(input.startTime);
    const endMinutes = startMinutes + pkg.durationMinutes;
    const computedEndTime = formatMinutesToTime(endMinutes);

    const pricing = calculateInvoicePricing({
      packagePrice: pkg.basePrice,
      packageName: pkg.title,
      addons: input.addons,
    });

    const bookingCode = await this.generateUniqueCode(sessionDateObj);

    const createPayload: CreateReservationData = {
      code: bookingCode,
      packageId: pkg.id,
      studioRoomId: input.studioRoomId ?? null,
      userId: input.userId ?? null,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      instagramHandle: input.instagramHandle ?? null,
      campusName: input.campusName ?? null,
      packagePrice: pricing.packagePrice,
      addonsTotal: pricing.addonsSubtotal,
      grandTotal: pricing.totalAmount,
      status: "PENDING_CONFIRMATION",
      paymentStatus: "UNPAID",
      sessionDate: sessionDateObj,
      startTime: input.startTime,
      endTime: computedEndTime,
      addons: pricing.addonsBreakdown.map((a) => ({
        addonName: a.name,
        unitPrice: a.unitPrice,
        quantity: a.quantity,
        subtotal: a.subtotal,
      })),
    };

    const reservation = await this.repository.create(createPayload);

    return {
      id: reservation.id,
      code: reservation.code,
      redirectUrl: `/invoice/${reservation.code}`,
      grandTotal: reservation.grandTotal,
      status: reservation.status,
    };
  }

  private async generateUniqueCode(date: Date): Promise<string> {
    const year = date.getUTCFullYear();
    for (let attempts = 0; attempts < 5; attempts++) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const code = `GS-${year}-${randomDigits}`;
      const existing = await this.repository.findByCode(code);
      if (!existing) {
        return code;
      }
    }
    const fallbackTimestamp = Date.now().toString().slice(-4);
    return `GS-${year}-${fallbackTimestamp}`;
  }
}

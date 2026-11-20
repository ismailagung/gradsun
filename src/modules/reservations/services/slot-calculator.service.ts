export interface TimeWindow {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface ConfirmedSession {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface BlackoutWindow {
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  reason?: string;
}

export interface GenerateSlotsOptions {
  date: string; // "YYYY-MM-DD"
  operatingHours: TimeWindow;
  sessionDurationMinutes: number;
  turnaroundMinutes?: number; // Configurable by admin (e.g. 5, 10, 15, 20, 25, 30)
  confirmedBookings?: ConfirmedSession[];
  blackoutDates?: BlackoutWindow[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reasonUnavailable?: "CONFIRMED_BOOKING" | "BLACKOUT_DATE" | "EXCEEDS_OPERATING_HOURS";
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseTimeToMinutes(timeStr: string): number {
  const match = TIME_REGEX.exec(timeStr);
  if (!match || match[1] === undefined || match[2] === undefined) {
    throw new Error(`Invalid time format: expected HH:mm, got "${timeStr}"`);
  }
  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  return hours * 60 + minutes;
}

function formatMinutesToTime(minutesTotal: number): string {
  const hours = Math.floor(minutesTotal / 60);
  const minutes = minutesTotal % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function isDateBlackedOut(dateStr: string, blackoutDates?: BlackoutWindow[]): boolean {
  if (!blackoutDates || blackoutDates.length === 0) return false;
  return blackoutDates.some((b) => b.startDate <= dateStr && dateStr <= b.endDate);
}

export function generateAvailableSlots(options: GenerateSlotsOptions): TimeSlot[] {
  const {
    date,
    operatingHours,
    sessionDurationMinutes,
    turnaroundMinutes = 15,
    confirmedBookings = [],
    blackoutDates = [],
  } = options;

  if (sessionDurationMinutes <= 0) {
    throw new Error("Session duration must be greater than 0 minutes");
  }

  if (turnaroundMinutes < 0) {
    throw new Error("Turnaround minutes cannot be negative");
  }

  const openMinutes = parseTimeToMinutes(operatingHours.startTime);
  const closeMinutes = parseTimeToMinutes(operatingHours.endTime);

  if (closeMinutes <= openMinutes) {
    throw new Error("Operating hours end time must be after start time");
  }

  const isBlackedOut = isDateBlackedOut(date, blackoutDates);

  const parsedBookings = confirmedBookings.map((b) => ({
    start: parseTimeToMinutes(b.startTime),
    end: parseTimeToMinutes(b.endTime),
  }));

  const slots: TimeSlot[] = [];
  let currentStartMinutes = openMinutes;

  while (currentStartMinutes + sessionDurationMinutes <= closeMinutes) {
    const currentEndMinutes = currentStartMinutes + sessionDurationMinutes;
    const startTime = formatMinutesToTime(currentStartMinutes);
    const endTime = formatMinutesToTime(currentEndMinutes);

    if (isBlackedOut) {
      slots.push({
        startTime,
        endTime,
        isAvailable: false,
        reasonUnavailable: "BLACKOUT_DATE",
      });
    } else {
      const hasConflict = parsedBookings.some((b) => {
        return Math.max(currentStartMinutes, b.start) < Math.min(currentEndMinutes, b.end);
      });

      if (hasConflict) {
        slots.push({
          startTime,
          endTime,
          isAvailable: false,
          reasonUnavailable: "CONFIRMED_BOOKING",
        });
      } else {
        slots.push({
          startTime,
          endTime,
          isAvailable: true,
        });
      }
    }

    currentStartMinutes = currentEndMinutes + turnaroundMinutes;
  }

  return slots;
}

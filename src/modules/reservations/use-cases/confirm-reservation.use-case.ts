import { z } from "zod";

export const confirmReservationSchema = z.object({
  code: z.string().min(1, "Booking code is required"),
});

export type ConfirmReservationInput = z.infer<typeof confirmReservationSchema>;

export interface IConfirmReservationRepository {
  findByCode(code: string): Promise<{
    id: string;
    code: string;
    status: string;
    paymentStatus: string;
  } | null>;
  updateStatus(
    code: string,
    status: string,
  ): Promise<{
    id: string;
    code: string;
    status: string;
    paymentStatus: string;
  }>;
}

export class ConfirmReservationUseCase {
  constructor(private readonly repository: IConfirmReservationRepository) {}

  async execute(input: ConfirmReservationInput) {
    const booking = await this.repository.findByCode(input.code);
    if (!booking) {
      throw new Error("Reservation not found");
    }

    if (booking.status === "CANCELLED") {
      throw new Error("Cannot confirm a cancelled reservation");
    }

    if (booking.paymentStatus !== "DP_PAID" && booking.paymentStatus !== "PAID_FULL") {
      throw new Error("Cannot confirm reservation with unpaid payment status");
    }

    return this.repository.updateStatus(input.code, "CONFIRMED");
  }
}

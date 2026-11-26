import type { RejectReservationInput } from "../schemas/reject-reservation.schema";

export interface IRejectReservationRepository {
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

export class RejectReservationUseCase {
  constructor(private readonly repository: IRejectReservationRepository) {}

  async execute(input: RejectReservationInput) {
    const booking = await this.repository.findByCode(input.code);
    if (!booking) {
      throw new Error("Reservation not found");
    }

    if (booking.status === "COMPLETED") {
      throw new Error("Cannot cancel a completed reservation");
    }

    return this.repository.updateStatus(input.code, "CANCELLED");
  }
}

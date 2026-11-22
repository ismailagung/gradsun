import { z } from "zod";

export const verifyPaymentSchema = z.object({
  code: z.string().min(1, "Booking code is required"),
  paymentStatus: z.enum(["DP_PAID", "PAID_FULL"]),
  paymentProofUrl: z.string().url().optional().nullable(),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

export interface IVerifyPaymentRepository {
  findByCode(code: string): Promise<{
    id: string;
    code: string;
    status: string;
    paymentStatus: string;
  } | null>;
  updatePaymentStatus(
    code: string,
    paymentStatus: string,
    proofUrl?: string | null,
    transitionStatus?: string,
  ): Promise<{
    id: string;
    code: string;
    status: string;
    paymentStatus: string;
  }>;
}

export class VerifyManualPaymentUseCase {
  constructor(private readonly repository: IVerifyPaymentRepository) {}

  async execute(input: VerifyPaymentInput) {
    const booking = await this.repository.findByCode(input.code);
    if (!booking) {
      throw new Error("Reservation not found");
    }

    if (input.paymentStatus !== "DP_PAID" && input.paymentStatus !== "PAID_FULL") {
      throw new Error("Invalid payment status");
    }

    return this.repository.updatePaymentStatus(
      input.code,
      input.paymentStatus,
      input.paymentProofUrl ?? null,
      "CONFIRMED",
    );
  }
}

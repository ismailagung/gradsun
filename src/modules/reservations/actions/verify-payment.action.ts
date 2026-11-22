"use server";

import { createSafeActionClient } from "next-safe-action";
import { ReservationRepository } from "../repositories/reservation.repository";
import {
  VerifyManualPaymentUseCase,
  verifyPaymentSchema,
} from "../use-cases/verify-manual-payment.use-case";

const actionClient = createSafeActionClient();

export const verifyPaymentAction = actionClient
  .schema(verifyPaymentSchema)
  .action(async ({ parsedInput }) => {
    const repository = new ReservationRepository();
    const useCase = new VerifyManualPaymentUseCase(repository);
    return await useCase.execute(parsedInput);
  });

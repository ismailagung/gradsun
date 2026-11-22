"use server";

import { createSafeActionClient } from "next-safe-action";
import { ReservationRepository } from "../repositories/reservation.repository";
import {
  ConfirmReservationUseCase,
  confirmReservationSchema,
} from "../use-cases/confirm-reservation.use-case";

const actionClient = createSafeActionClient();

export const confirmReservationAction = actionClient
  .schema(confirmReservationSchema)
  .action(async ({ parsedInput }) => {
    const repository = new ReservationRepository();
    const useCase = new ConfirmReservationUseCase(repository);
    return await useCase.execute(parsedInput);
  });

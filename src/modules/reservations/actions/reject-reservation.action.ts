"use server";

import { createSafeActionClient } from "next-safe-action";
import { ReservationRepository } from "../repositories/reservation.repository";
import { rejectReservationSchema } from "../schemas/reject-reservation.schema";
import { RejectReservationUseCase } from "../use-cases/reject-reservation.use-case";

const actionClient = createSafeActionClient();

export const rejectReservationAction = actionClient
  .schema(rejectReservationSchema)
  .action(async ({ parsedInput }) => {
    const repository = new ReservationRepository();
    const useCase = new RejectReservationUseCase(repository);
    return await useCase.execute(parsedInput);
  });

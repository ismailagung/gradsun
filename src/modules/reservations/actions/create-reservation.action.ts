"use server";

import { createSafeActionClient } from "next-safe-action";
import { ReservationRepository } from "../repositories/reservation.repository";
import { createReservationSchema } from "../schemas/create-reservation.schema";
import { CreateReservationUseCase } from "../use-cases/create-reservation.use-case";

const actionClient = createSafeActionClient();

export const createReservationAction = actionClient
  .schema(createReservationSchema)
  .action(async ({ parsedInput }) => {
    const repository = new ReservationRepository();
    const useCase = new CreateReservationUseCase(repository);
    return await useCase.execute(parsedInput);
  });

"use server";

import { createSafeActionClient } from "next-safe-action";
import { BlackoutDateRepository } from "../repositories/blackout-date.repository";
import { createBlackoutDateSchema } from "../schemas/blackout-date.schema";
import { CreateBlackoutDateUseCase } from "../use-cases/create-blackout-date.use-case";

const actionClient = createSafeActionClient();

export const createBlackoutDateAction = actionClient
  .schema(createBlackoutDateSchema)
  .action(async ({ parsedInput }) => {
    const repository = new BlackoutDateRepository();
    const useCase = new CreateBlackoutDateUseCase(repository);
    return await useCase.execute(parsedInput);
  });

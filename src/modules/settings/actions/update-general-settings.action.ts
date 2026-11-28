"use server";

import { createSafeActionClient } from "next-safe-action";
import { GeneralSettingsRepository } from "../repositories/general-settings.repository";
import { generalSettingsSchema } from "../schemas/general-settings.schema";
import { UpdateGeneralSettingsUseCase } from "../use-cases/update-general-settings.use-case";

const actionClient = createSafeActionClient();

export const updateGeneralSettingsAction = actionClient
  .schema(generalSettingsSchema)
  .action(async ({ parsedInput }) => {
    const repository = new GeneralSettingsRepository();
    const useCase = new UpdateGeneralSettingsUseCase(repository);
    return await useCase.execute(parsedInput);
  });

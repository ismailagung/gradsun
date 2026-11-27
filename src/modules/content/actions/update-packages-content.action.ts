"use server";

import { createSafeActionClient } from "next-safe-action";
import { ContentRepository } from "../repositories/content.repository";
import { packagesCmsSchema } from "../schemas/content-settings.schema";
import { UpdatePackagesContentUseCase } from "../use-cases/update-packages-content.use-case";

const actionClient = createSafeActionClient();

export const updatePackagesContentAction = actionClient
  .schema(packagesCmsSchema)
  .action(async ({ parsedInput }) => {
    const repository = new ContentRepository();
    const useCase = new UpdatePackagesContentUseCase(repository);
    return await useCase.execute(parsedInput);
  });

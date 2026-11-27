"use server";

import { createSafeActionClient } from "next-safe-action";
import { PackageRepository } from "../repositories/package.repository";
import { updatePackageSchema } from "../schemas/update-package.schema";
import { UpdatePackageUseCase } from "../use-cases/update-package.use-case";

const actionClient = createSafeActionClient();

export const updatePackageAction = actionClient
  .schema(updatePackageSchema)
  .action(async ({ parsedInput }) => {
    const repository = new PackageRepository();
    const useCase = new UpdatePackageUseCase(repository);
    return await useCase.execute(parsedInput);
  });

"use server";

import { createSafeActionClient } from "next-safe-action";
import { PackageRepository } from "../repositories/package.repository";
import { deletePackageSchema } from "../schemas/delete-package.schema";
import { DeletePackageUseCase } from "../use-cases/delete-package.use-case";

const actionClient = createSafeActionClient();

export const deletePackageAction = actionClient
  .schema(deletePackageSchema)
  .action(async ({ parsedInput }) => {
    const repository = new PackageRepository();
    const useCase = new DeletePackageUseCase(repository);
    await useCase.execute(parsedInput);
    return { success: true };
  });

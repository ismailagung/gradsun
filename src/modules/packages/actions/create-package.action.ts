"use server";

import { createSafeActionClient } from "next-safe-action";
import { PackageRepository } from "../repositories/package.repository";
import { createPackageSchema } from "../schemas/create-package.schema";
import { CreatePackageUseCase } from "../use-cases/create-package.use-case";

const actionClient = createSafeActionClient();

export const createPackageAction = actionClient
  .schema(createPackageSchema)
  .action(async ({ parsedInput }) => {
    const repository = new PackageRepository();
    const useCase = new CreatePackageUseCase(repository);
    return await useCase.execute(parsedInput);
  });

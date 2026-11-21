"use server";

import { createSafeActionClient } from "next-safe-action";
import { PackageRepository } from "../repositories/package.repository";
import { GetActivePackagesUseCase } from "../use-cases/get-active-packages.use-case";

const actionClient = createSafeActionClient();

export const getActivePackagesAction = actionClient.action(async () => {
  const repository = new PackageRepository();
  const useCase = new GetActivePackagesUseCase(repository);
  return await useCase.execute();
});

"use server";

import { createSafeActionClient } from "next-safe-action";
import { PackageRepository } from "../repositories/package.repository";
import { GetAllPackagesUseCase } from "../use-cases/get-all-packages.use-case";

const actionClient = createSafeActionClient();

export const getAllPackagesAction = actionClient.action(async () => {
  const repository = new PackageRepository();
  const useCase = new GetAllPackagesUseCase(repository);
  return await useCase.execute();
});

"use server";

import { createSafeActionClient } from "next-safe-action";
import { CustomerRepository } from "../repositories/customer.repository";
import {
  GetCustomersDirectoryUseCase,
  getCustomersDirectorySchema,
} from "../use-cases/get-customers-directory.use-case";

const actionClient = createSafeActionClient();

export const getCustomersAction = actionClient
  .schema(getCustomersDirectorySchema)
  .action(async ({ parsedInput }) => {
    const repository = new CustomerRepository();
    const useCase = new GetCustomersDirectoryUseCase(repository);
    return await useCase.execute(parsedInput);
  });

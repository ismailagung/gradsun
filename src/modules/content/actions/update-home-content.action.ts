"use server";

import { revalidatePath } from "next/cache";
import { createSafeActionClient } from "next-safe-action";
import { ContentRepository } from "../repositories/content.repository";
import { homeCmsSchema } from "../schemas/content-settings.schema";
import { UpdateHomeContentUseCase } from "../use-cases/update-home-content.use-case";

const actionClient = createSafeActionClient();

export const updateHomeContentAction = actionClient
  .schema(homeCmsSchema)
  .action(async ({ parsedInput }) => {
    const repository = new ContentRepository();
    const useCase = new UpdateHomeContentUseCase(repository);
    const result = await useCase.execute(parsedInput);
    revalidatePath("/");
    revalidatePath("/admin/content");
    return result;
  });

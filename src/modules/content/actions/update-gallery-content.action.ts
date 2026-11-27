"use server";

import { createSafeActionClient } from "next-safe-action";
import { ContentRepository } from "../repositories/content.repository";
import { galleryCmsSchema } from "../schemas/content-settings.schema";
import { UpdateGalleryContentUseCase } from "../use-cases/update-gallery-content.use-case";

const actionClient = createSafeActionClient();

export const updateGalleryContentAction = actionClient
  .schema(galleryCmsSchema)
  .action(async ({ parsedInput }) => {
    const repository = new ContentRepository();
    const useCase = new UpdateGalleryContentUseCase(repository);
    return await useCase.execute(parsedInput);
  });

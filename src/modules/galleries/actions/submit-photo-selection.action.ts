"use server";

import { createSafeActionClient } from "next-safe-action";
import { GalleryRepository } from "../repositories/gallery.repository";
import {
  SubmitPhotoSelectionUseCase,
  submitPhotoSelectionSchema,
} from "../use-cases/submit-photo-selection.use-case";

const actionClient = createSafeActionClient();

export const submitPhotoSelectionAction = actionClient
  .schema(submitPhotoSelectionSchema)
  .action(async ({ parsedInput }) => {
    const repository = new GalleryRepository();
    const useCase = new SubmitPhotoSelectionUseCase(repository);
    return await useCase.execute(parsedInput);
  });

"use server";

import { createSafeActionClient } from "next-safe-action";
import { GalleryRepository } from "../repositories/gallery.repository";
import {
  UploadSessionPhotosUseCase,
  uploadPhotosSchema,
} from "../use-cases/upload-session-photos.use-case";

const actionClient = createSafeActionClient();

export const uploadPhotosAction = actionClient
  .schema(uploadPhotosSchema)
  .action(async ({ parsedInput }) => {
    const repository = new GalleryRepository();
    const useCase = new UploadSessionPhotosUseCase(repository);
    return await useCase.execute(parsedInput);
  });

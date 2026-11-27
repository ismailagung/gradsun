"use server";

import { createSafeActionClient } from "next-safe-action";
import { uploadCmsAssetSchema } from "../schemas/upload-cms-asset.schema";
import { UploadCmsAssetUseCase } from "../use-cases/upload-cms-asset.use-case";

const actionClient = createSafeActionClient();

export const uploadCmsAssetAction = actionClient
  .schema(uploadCmsAssetSchema)
  .action(async ({ parsedInput }) => {
    const useCase = new UploadCmsAssetUseCase();
    return await useCase.execute(parsedInput);
  });

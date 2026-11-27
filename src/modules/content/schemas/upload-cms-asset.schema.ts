import { z } from "zod";

export const uploadCmsAssetSchema = z.object({
  folder: z.enum(["hero", "manifesto", "general"]).default("hero"),
  fileName: z.string().min(1, "File name is required"),
  contentType: z.string().min(1, "Content type is required"),
  base64Data: z.string().min(1, "Base64 data is required"),
});

export type UploadCmsAssetInput = z.infer<typeof uploadCmsAssetSchema>;

export interface UploadCmsAssetResult {
  publicUrl: string;
  key: string;
}

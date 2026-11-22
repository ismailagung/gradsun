import { z } from "zod";
import type { IGalleryRepository } from "../repositories/gallery.repository";

export const submitPhotoSelectionSchema = z.object({
  galleryId: z.string().min(1, "Gallery ID is required"),
  selectedPhotoIds: z.array(z.string().min(1)).min(1, "Select at least one photo"),
  notes: z.string().max(500).optional(),
});

export type SubmitPhotoSelectionInput = z.infer<typeof submitPhotoSelectionSchema>;

export interface SubmitPhotoSelectionResult {
  success: boolean;
  galleryId: string;
  selectedCount: number;
  status: string;
}

export class SubmitPhotoSelectionUseCase {
  constructor(private readonly galleryRepository: IGalleryRepository) {}

  async execute(input: SubmitPhotoSelectionInput): Promise<SubmitPhotoSelectionResult> {
    const gallery = await this.galleryRepository.findById(input.galleryId);
    if (!gallery) {
      throw new Error("Gallery not found");
    }

    const galleryPhotoIds = new Set(gallery.photos.map((p) => p.id));
    const hasInvalidPhoto = input.selectedPhotoIds.some((id) => !galleryPhotoIds.has(id));
    if (hasInvalidPhoto) {
      throw new Error("One or more selected photos do not belong to this gallery");
    }

    const selections = input.selectedPhotoIds.map((photoId) => ({
      photoId,
      notes: input.notes,
    }));

    await this.galleryRepository.saveSelections(input.galleryId, selections);
    await this.galleryRepository.updateStatus(input.galleryId, "APPROVED");

    return {
      success: true,
      galleryId: input.galleryId,
      selectedCount: input.selectedPhotoIds.length,
      status: "APPROVED",
    };
  }
}

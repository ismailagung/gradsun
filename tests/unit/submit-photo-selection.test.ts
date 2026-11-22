import { describe, expect, it, vi } from "vitest";
import type {
  GalleryWithDetails,
  IGalleryRepository,
} from "@/modules/galleries/repositories/gallery.repository";
import {
  SubmitPhotoSelectionUseCase,
  submitPhotoSelectionSchema,
} from "@/modules/galleries/use-cases/submit-photo-selection.use-case";

function createMockGalleryRepository(): IGalleryRepository {
  return {
    findById: vi.fn(),
    findByReservationId: vi.fn(),
    findByBookingCode: vi.fn(),
    findAll: vi.fn(),
    createGallery: vi.fn(),
    addPhotos: vi.fn(),
    updateStatus: vi.fn(),
    saveSelections: vi.fn(),
  };
}

describe("SubmitPhotoSelectionUseCase (TDD)", () => {
  const mockGallery: GalleryWithDetails = {
    id: "gal-uuid-1",
    reservationId: "res-uuid-1",
    status: "SELECTING",
    watermarkConfig: "diagonal-fine-art",
    paxelTrackingNumber: "PXL-GRADSUN-992104",
    createdAt: new Date(),
    updatedAt: new Date(),
    reservation: {
      id: "res-uuid-1",
      code: "GS-2025-0842",
      clientName: "Adinda Prameswari",
      clientPhone: "+6281298765432",
      status: "CONFIRMED",
    },
    photos: [
      {
        id: "photo-1",
        galleryId: "gal-uuid-1",
        originalKey: "galleries/gal-uuid-1/originals/1.jpg",
        previewKey: "galleries/gal-uuid-1/previews/1.webp",
        thumbnailKey: "galleries/gal-uuid-1/thumbnails/1.webp",
        dimensions: "1200x800",
        sequenceNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "photo-2",
        galleryId: "gal-uuid-1",
        originalKey: "galleries/gal-uuid-1/originals/2.jpg",
        previewKey: "galleries/gal-uuid-1/previews/2.webp",
        thumbnailKey: "galleries/gal-uuid-1/thumbnails/2.webp",
        dimensions: "1200x800",
        sequenceNumber: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    selections: [],
  };

  it("validates input schema with submitPhotoSelectionSchema", () => {
    const valid = submitPhotoSelectionSchema.safeParse({
      galleryId: "gal-uuid-1",
      selectedPhotoIds: ["photo-1", "photo-2"],
      notes: "Please remove blemish on photo 1",
    });
    expect(valid.success).toBe(true);

    const empty = submitPhotoSelectionSchema.safeParse({
      galleryId: "gal-uuid-1",
      selectedPhotoIds: [],
    });
    expect(empty.success).toBe(false);
  });

  it("successfully persists selected photo IDs and transitions status to APPROVED", async () => {
    const mockRepo = createMockGalleryRepository();
    vi.mocked(mockRepo.findById).mockResolvedValue(mockGallery);
    vi.mocked(mockRepo.saveSelections).mockResolvedValue(2);
    vi.mocked(mockRepo.updateStatus).mockResolvedValue({
      ...mockGallery,
      status: "APPROVED",
    });

    const useCase = new SubmitPhotoSelectionUseCase(mockRepo);
    const result = await useCase.execute({
      galleryId: "gal-uuid-1",
      selectedPhotoIds: ["photo-1", "photo-2"],
      notes: "Fine art skin tone retouching",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("APPROVED");
    expect(result.selectedCount).toBe(2);
    expect(mockRepo.saveSelections).toHaveBeenCalledWith("gal-uuid-1", [
      { photoId: "photo-1", notes: "Fine art skin tone retouching" },
      { photoId: "photo-2", notes: "Fine art skin tone retouching" },
    ]);
    expect(mockRepo.updateStatus).toHaveBeenCalledWith("gal-uuid-1", "APPROVED");
  });

  it("rejects photo IDs that do not belong to the gallery", async () => {
    const mockRepo = createMockGalleryRepository();
    vi.mocked(mockRepo.findById).mockResolvedValue(mockGallery);

    const useCase = new SubmitPhotoSelectionUseCase(mockRepo);
    await expect(
      useCase.execute({
        galleryId: "gal-uuid-1",
        selectedPhotoIds: ["photo-1", "foreign-photo-999"],
      }),
    ).rejects.toThrow("One or more selected photos do not belong to this gallery");
  });

  it("throws error when gallery does not exist", async () => {
    const mockRepo = createMockGalleryRepository();
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    const useCase = new SubmitPhotoSelectionUseCase(mockRepo);
    await expect(
      useCase.execute({
        galleryId: "non-existent-gallery",
        selectedPhotoIds: ["photo-1"],
      }),
    ).rejects.toThrow("Gallery not found");
  });
});

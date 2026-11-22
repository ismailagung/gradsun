import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import type {
  GalleryWithDetails,
  IGalleryRepository,
} from "@/modules/galleries/repositories/gallery.repository";
import {
  UploadSessionPhotosUseCase,
  uploadPhotosSchema,
} from "@/modules/galleries/use-cases/upload-session-photos.use-case";

vi.mock("@/infrastructure/storage/s3-client", () => ({
  getPresignedUploadUrl: vi
    .fn()
    .mockImplementation(async ({ key }) => `https://s3.example.com/${key}?signed=true`),
  s3Client: {
    send: vi.fn().mockResolvedValue({}),
  },
}));

// Helper to create synthetic JPEG buffers
async function createSyntheticJpeg(width = 800, height = 600): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 217, g: 155, b: 38 },
    },
  })
    .jpeg()
    .toBuffer();
}

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

describe("UploadSessionPhotosUseCase", () => {
  it("validates input against uploadPhotosSchema correctly", () => {
    const validData = {
      galleryId: "gal-123",
      reservationId: "res-123",
      action: "generate-urls" as const,
      fileNames: ["photo1.jpg", "photo2.jpg"],
    };

    const parsed = uploadPhotosSchema.safeParse(validData);
    expect(parsed.success).toBe(true);

    const invalid = uploadPhotosSchema.safeParse({ action: "invalid-action" });
    expect(invalid.success).toBe(false);
  });

  it("generates presigned upload URLs for session photos when action is generate-urls", async () => {
    const mockRepo = createMockGalleryRepository();
    const existingGallery: GalleryWithDetails = {
      id: "gal-123",
      reservationId: "res-123",
      status: "UPLOADING",
      watermarkConfig: "diagonal-fine-art",
      paxelTrackingNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      reservation: {
        id: "res-123",
        code: "GS-2025-0842",
        clientName: "Adinda Prameswari",
        clientPhone: "+6281298765432",
        status: "CONFIRMED",
      },
      photos: [],
      selections: [],
    };

    vi.mocked(mockRepo.findById).mockResolvedValue(existingGallery);

    const useCase = new UploadSessionPhotosUseCase(mockRepo);
    const result = await useCase.execute({
      galleryId: "gal-123",
      reservationId: "res-123",
      action: "generate-urls",
      fileNames: ["session-01.jpg", "session-02.jpg"],
    });

    expect(result.success).toBe(true);
    expect(result.uploadUrls).toHaveLength(2);
    expect(result.uploadUrls?.[0]?.key).toContain("session-01.jpg");
    expect(result.uploadUrls?.[0]?.presignedUrl).toBeDefined();
    expect(result.galleryId).toBe("gal-123");
  });

  it("processes photo buffers, creates webp thumbnails and watermarked previews, and records them in the repository", async () => {
    const mockRepo = createMockGalleryRepository();
    const sampleGallery: GalleryWithDetails = {
      id: "gal-456",
      reservationId: "res-456",
      status: "UPLOADING",
      watermarkConfig: "diagonal-fine-art",
      paxelTrackingNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      reservation: {
        id: "res-456",
        code: "GS-2025-0843",
        clientName: "Rafi & Sarah",
        clientPhone: "+6281298765433",
        status: "CONFIRMED",
      },
      photos: [],
      selections: [],
    };

    vi.mocked(mockRepo.findById).mockResolvedValue(sampleGallery);
    vi.mocked(mockRepo.addPhotos).mockResolvedValue(1);
    vi.mocked(mockRepo.updateStatus).mockResolvedValue({
      ...sampleGallery,
      status: "SELECTING",
    });

    const testBuffer = await createSyntheticJpeg(1200, 800);
    const base64Data = testBuffer.toString("base64");

    const useCase = new UploadSessionPhotosUseCase(mockRepo);
    const result = await useCase.execute({
      galleryId: "gal-456",
      reservationId: "res-456",
      action: "process-and-save",
      photos: [
        {
          fileName: "photo-01.jpg",
          base64Data,
          sequenceNumber: 1,
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(mockRepo.addPhotos).toHaveBeenCalledTimes(1);
    expect(mockRepo.updateStatus).toHaveBeenCalledWith("gal-456", "SELECTING");

    const addedPhotos = vi.mocked(mockRepo.addPhotos).mock.calls[0]?.[1];
    expect(addedPhotos).toHaveLength(1);
    expect(addedPhotos?.[0]?.originalKey).toContain("photo-01.jpg");
    expect(addedPhotos?.[0]?.previewKey).toContain(".webp");
    expect(addedPhotos?.[0]?.thumbnailKey).toContain(".webp");
  });

  it("throws an error when the gallery record is not found", async () => {
    const mockRepo = createMockGalleryRepository();
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    const useCase = new UploadSessionPhotosUseCase(mockRepo);
    await expect(
      useCase.execute({
        galleryId: "non-existent",
        reservationId: "res-000",
        action: "generate-urls",
        fileNames: ["photo.jpg"],
      }),
    ).rejects.toThrow("Gallery not found");
  });
});

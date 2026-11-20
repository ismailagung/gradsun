import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  extractPhotoMetadata,
  generateWatermarkSvg,
  processPhotoForProofing,
  transcodeToWebp,
} from "@/infrastructure/storage/photo-processor.service";

describe("PhotoProcessorService", () => {
  // Helper to generate synthetic test image buffers in-memory
  async function createSyntheticImage(width = 2400, height = 1600): Promise<Buffer> {
    return sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 217, g: 155, b: 38 }, // Gradsun amber
      },
    })
      .jpeg()
      .toBuffer();
  }

  describe("processPhotoForProofing", () => {
    it("generates 400px thumbnail, 1600px preview, and preserves aspect ratio in WebP format", async () => {
      const inputBuffer = await createSyntheticImage(2400, 1600); // 3:2 aspect ratio

      const result = await processPhotoForProofing({
        buffer: inputBuffer,
        watermarkText: "GRADSUN PROOF",
      });

      // Original metadata
      expect(result.originalMetadata.width).toBe(2400);
      expect(result.originalMetadata.height).toBe(1600);
      expect(result.originalMetadata.format).toBe("jpeg");

      // Thumbnail checks (max width 400px, 3:2 -> 400x267)
      expect(result.thumbnail.format).toBe("webp");
      expect(result.thumbnail.width).toBe(400);
      expect(result.thumbnail.height).toBe(267);
      expect(result.thumbnail.sizeBytes).toBeGreaterThan(0);

      // Verify thumbnail is valid WebP via sharp
      const thumbMeta = await sharp(result.thumbnail.buffer).metadata();
      expect(thumbMeta.format).toBe("webp");
      expect(thumbMeta.width).toBe(400);

      // Preview checks (max width 1600px, 3:2 -> 1600x1067)
      expect(result.previewWatermarked.format).toBe("webp");
      expect(result.previewWatermarked.width).toBe(1600);
      expect(result.previewWatermarked.height).toBe(1067);
      expect(result.previewWatermarked.sizeBytes).toBeGreaterThan(0);

      // Verify preview is valid WebP with watermark composite
      const previewMeta = await sharp(result.previewWatermarked.buffer).metadata();
      expect(previewMeta.format).toBe("webp");
      expect(previewMeta.width).toBe(1600);
    });

    it("does not enlarge images smaller than target bounds (withoutEnlargement: true)", async () => {
      const smallBuffer = await createSyntheticImage(300, 200);

      const result = await processPhotoForProofing({
        buffer: smallBuffer,
      });

      // Thumbnail should stay 300x200 (not stretched to 400px)
      expect(result.thumbnail.width).toBe(300);
      expect(result.thumbnail.height).toBe(200);

      // Preview should stay 300x200 (not stretched to 1600px)
      expect(result.previewWatermarked.width).toBe(300);
      expect(result.previewWatermarked.height).toBe(200);
    });

    it("throws a descriptive error when provided with an invalid or corrupt buffer", async () => {
      const invalidBuffer = Buffer.from("this is not an image file");

      await expect(
        processPhotoForProofing({
          buffer: invalidBuffer,
        }),
      ).rejects.toThrow("Invalid or unsupported image buffer");
    });
  });

  describe("transcodeToWebp", () => {
    it("converts PNG or JPEG to optimized WebP format", async () => {
      const pngBuffer = await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 4,
          background: { r: 50, g: 50, b: 50, alpha: 1 },
        },
      })
        .png()
        .toBuffer();

      const webpBuffer = await transcodeToWebp(pngBuffer, 85);
      const meta = await sharp(webpBuffer).metadata();

      expect(meta.format).toBe("webp");
      expect(meta.width).toBe(200);
      expect(meta.height).toBe(200);
    });
  });

  describe("extractPhotoMetadata", () => {
    it("extracts width, height, format, and color space correctly", async () => {
      const inputBuffer = await createSyntheticImage(1200, 800);
      const meta = await extractPhotoMetadata(inputBuffer);

      expect(meta.width).toBe(1200);
      expect(meta.height).toBe(800);
      expect(meta.format).toBe("jpeg");
      expect(meta.space).toBe("srgb");
    });
  });

  describe("generateWatermarkSvg", () => {
    it("generates a non-empty SVG buffer with configured dimensions and watermark text", () => {
      const svgBuffer = generateWatermarkSvg(1600, 1067, "GRADSUN PROOF");
      const svgString = svgBuffer.toString("utf-8");

      expect(svgString).toContain("<svg");
      expect(svgString).toContain('width="1600"');
      expect(svgString).toContain('height="1067"');
      expect(svgString).toContain("GRADSUN PROOF");
    });
  });
});

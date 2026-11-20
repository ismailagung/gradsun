import sharp, { type Metadata } from "sharp";

export interface ProcessedPhotoOutput {
  buffer: Buffer;
  width: number;
  height: number;
  format: "webp";
  sizeBytes: number;
}

export interface ProcessPhotoForProofingOptions {
  buffer: Buffer;
  watermarkText?: string;
}

export interface ProcessPhotoForProofingResult {
  thumbnail: ProcessedPhotoOutput;
  previewWatermarked: ProcessedPhotoOutput;
  originalMetadata: {
    width?: number;
    height?: number;
    format?: string;
    space?: string;
  };
}

export async function extractPhotoMetadata(buffer: Buffer): Promise<Metadata> {
  try {
    return await sharp(buffer).metadata();
  } catch (error) {
    throw new Error(
      `Invalid or unsupported image buffer: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function transcodeToWebp(buffer: Buffer, quality = 85): Promise<Buffer> {
  try {
    return await sharp(buffer).webp({ quality }).toBuffer();
  } catch (error) {
    throw new Error(
      `Failed to transcode image to WebP: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function generateWatermarkSvg(
  width: number,
  height: number,
  text = "GRADSUN PROOF • DO NOT DUPLICATE",
): Buffer {
  const sanitizedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="diagonal-watermark" width="450" height="260" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
      <text
        x="60"
        y="120"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="24"
        font-weight="700"
        letter-spacing="2"
        fill="rgba(255, 255, 255, 0.45)"
        stroke="rgba(0, 0, 0, 0.25)"
        stroke-width="0.8"
      >${sanitizedText}</text>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#diagonal-watermark)" />
</svg>`;

  return Buffer.from(svg, "utf-8");
}

export async function processPhotoForProofing(
  options: ProcessPhotoForProofingOptions,
): Promise<ProcessPhotoForProofingResult> {
  const { buffer, watermarkText = "GRADSUN PROOF" } = options;

  const originalMetadata = await extractPhotoMetadata(buffer);

  // 1. Generate 400px thumbnail
  const thumbResult = await sharp(buffer)
    .resize({
      width: 400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  const thumbnail: ProcessedPhotoOutput = {
    buffer: thumbResult.data,
    width: thumbResult.info.width,
    height: thumbResult.info.height,
    format: "webp",
    sizeBytes: thumbResult.data.length,
  };

  // 2. Generate 1600px preview with watermark overlay
  const resizedPreview = await sharp(buffer)
    .resize({
      width: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer({ resolveWithObject: true });

  const watermarkSvg = generateWatermarkSvg(
    resizedPreview.info.width,
    resizedPreview.info.height,
    watermarkText,
  );

  const previewResult = await sharp(resizedPreview.data)
    .composite([
      {
        input: watermarkSvg,
        blend: "over",
      },
    ])
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  const previewWatermarked: ProcessedPhotoOutput = {
    buffer: previewResult.data,
    width: previewResult.info.width,
    height: previewResult.info.height,
    format: "webp",
    sizeBytes: previewResult.data.length,
  };

  return {
    thumbnail,
    previewWatermarked,
    originalMetadata: {
      width: originalMetadata.width,
      height: originalMetadata.height,
      format: originalMetadata.format,
      space: originalMetadata.space,
    },
  };
}

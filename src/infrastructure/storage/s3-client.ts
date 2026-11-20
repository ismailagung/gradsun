import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

export interface PresignedUploadOptions {
  key: string;
  contentType?: string;
  expiresInSeconds?: number;
}

export interface PresignedDownloadOptions {
  key: string;
  expiresInSeconds?: number;
}

function createS3Client(): S3Client {
  const credentials =
    env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
      ? {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        }
      : undefined;

  return new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    credentials,
    forcePathStyle: true,
  });
}

export const s3Client = createS3Client();

export async function getPresignedUploadUrl(options: PresignedUploadOptions): Promise<string> {
  const { key, contentType = "application/octet-stream", expiresInSeconds = 3600 } = options;

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds,
  });
}

export async function getPresignedDownloadUrl(options: PresignedDownloadOptions): Promise<string> {
  const { key, expiresInSeconds = 3600 } = options;

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds,
  });
}

export async function deleteStorageObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}

export function getPublicStorageUrl(key: string): string {
  const baseUrl = env.NEXT_PUBLIC_STORAGE_BASE_URL.replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${baseUrl}/${cleanKey}`;
}

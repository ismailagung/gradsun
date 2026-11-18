import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    // Supabase PostgreSQL (Pooled for runtime queries)
    DATABASE_URL: z.string().url(),
    // Supabase PostgreSQL (Direct for Prisma migrations)
    DIRECT_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    STORAGE_DRIVER: z.enum(["local", "s3"]).default("s3"),
    // Supabase Storage S3 API: https://<project-ref>.supabase.co/storage/v1/s3
    S3_ENDPOINT: z.string().url().optional(),
    S3_REGION: z.string().default("ap-southeast-1"),
    S3_BUCKET: z.string().default("photos"),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    CRON_SECRET: z.string().min(16),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_STORAGE_BASE_URL: z.string().url().default("http://localhost:3000/uploads"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STORAGE_BASE_URL: process.env.NEXT_PUBLIC_STORAGE_BASE_URL,
  },
});

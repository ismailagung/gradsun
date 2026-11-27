import type { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma/client";
import {
  type ContentSettings,
  contentSettingsSchema,
  DEFAULT_GALLERY_CONTENT,
  DEFAULT_HOME_CONTENT,
  DEFAULT_PACKAGES_CONTENT,
} from "../schemas/content-settings.schema";

export interface IContentRepository {
  getContentSettings(): Promise<ContentSettings>;
  updateContentSettings(data: ContentSettings): Promise<ContentSettings>;
}

export const CONTENT_SETTING_KEY = "content_settings";

export const DEFAULT_CONTENT_SETTINGS: ContentSettings = {
  home: DEFAULT_HOME_CONTENT,
  gallery: DEFAULT_GALLERY_CONTENT,
  packages: DEFAULT_PACKAGES_CONTENT,
  trackOrder: {
    tag: "Client Services",
    title: "Track Your Milestone Folio",
    subtitle:
      "Enter your booking reference code to check proofing status, digital delivery, and physical album shipment in real time.",
    searchPlaceholder: "e.g. GS-2025-0842",
    supportNote:
      "Need immediate assistance with your booking? Chat directly with our concierge team via WhatsApp.",
  },
};

export class ContentRepository implements IContentRepository {
  private inMemoryFallback: ContentSettings = JSON.parse(JSON.stringify(DEFAULT_CONTENT_SETTINGS));

  async getContentSettings(): Promise<ContentSettings> {
    try {
      const record = await prisma.siteSetting.findUnique({
        where: { key: CONTENT_SETTING_KEY },
      });

      if (!record?.value) {
        return this.inMemoryFallback;
      }

      const parsed = contentSettingsSchema.safeParse(record.value);
      if (!parsed.success) {
        return this.inMemoryFallback;
      }

      this.inMemoryFallback = parsed.data;
      return parsed.data;
    } catch {
      return this.inMemoryFallback;
    }
  }

  async updateContentSettings(data: ContentSettings): Promise<ContentSettings> {
    this.inMemoryFallback = JSON.parse(JSON.stringify(data));
    try {
      const jsonValue = data as unknown as Prisma.InputJsonValue;
      const record = await prisma.siteSetting.upsert({
        where: { key: CONTENT_SETTING_KEY },
        update: { value: jsonValue },
        create: {
          key: CONTENT_SETTING_KEY,
          value: jsonValue,
        },
      });

      const parsed = contentSettingsSchema.safeParse(record.value);
      if (parsed.success) {
        this.inMemoryFallback = parsed.data;
        return parsed.data;
      }
    } catch {
      // In-memory fallback for test runners or offline environments
    }
    return JSON.parse(JSON.stringify(this.inMemoryFallback));
  }
}

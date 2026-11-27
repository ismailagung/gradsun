import type { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma/client";
import { type ContentSettings, contentSettingsSchema } from "../schemas/content-settings.schema";

export interface IContentRepository {
  getContentSettings(): Promise<ContentSettings>;
  updateContentSettings(data: ContentSettings): Promise<ContentSettings>;
}

export const CONTENT_SETTING_KEY = "content_settings";

export const DEFAULT_CONTENT_SETTINGS: ContentSettings = {
  home: {
    hero: {
      titlePart1: "Graduation Milestones,",
      titleHighlight: "Preserved in Amber",
      titlePart2: "Light.",
      subtitle:
        "Fine-art academic portraiture celebrating triumph, dedication, and lifelong bonds across Indonesia's prestigious universities.",
      primaryCta: "Reserve Your Session",
      secondaryCta: "Explore Gallery",
      badgeTitle: "Class of 2025",
      heroImageUrl: "/logo-bg.jpg",
      polaroidImageUrl: "/logo-bg.jpg",
    },
    gallerySection: {
      tag: "Recent Gallery Showcase",
      title: "Milestones Captured in Light",
      subtitle: "A glimpse of recent graduation portraits celebrated across prestigious campuses.",
    },
    packagesSection: {
      tag: "Curated Commemorative Tiers",
      title: "Reserve Your Golden Hour Chapter",
      subtitle:
        "Tailored lighting, tactile memory folios, and seamless coordination for every milestone.",
    },
    testimonialsSection: {
      tag: "Wall of Love",
      title: "Words of Joy From Graduates",
      subtitle:
        "Heartfelt reflections from alumni and families who entrusted us with their milestone day.",
    },
    manifesto: {
      title: "Ready to Capture Your Graduation Milestone?",
      subtitle:
        "Reserve your photo session early to commemorate this special milestone together with family and close friends.",
      primaryCta: "Check Open Dates",
      secondaryCta: "Packages & Booking",
    },
  },
  gallery: {
    tag: "Fine-Art Archives",
    title: "The Gradsun Gallery",
    subtitle:
      "A curated visual anthology of commencement portraiture, intimate academic celebrations, and timeless collegiate milestones.",
    filterNote:
      "All portrait files and photo proofing galleries are dynamically synchronized from client sessions via Gallery Proofs.",
  },
  packages: {
    seasonTag: "Commencement Season 2025",
    title: "Reserve Your Golden Hour Chapter",
    subtitle:
      "Secure your commencement date with our stress-free reservation flow. Tailored lighting, tactile memory folios, and seamless coordination.",
    vowTitle: "100% Golden Weather Vow",
    vowSubtitle: "Free reschedule for rainy days",
  },
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

import type { ContentSettings } from "../schemas/content-settings.schema";

export interface IContentRepository {
  getContentSettings(): Promise<ContentSettings>;
  updateContentSettings(data: ContentSettings): Promise<ContentSettings>;
}

const DEFAULT_CONTENT_SETTINGS: ContentSettings = {
  home: {
    hero: {
      badge: "Commencement Season 2025",
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

let inMemoryContentSettings: ContentSettings = JSON.parse(JSON.stringify(DEFAULT_CONTENT_SETTINGS));

export class ContentRepository implements IContentRepository {
  async getContentSettings(): Promise<ContentSettings> {
    return JSON.parse(JSON.stringify(inMemoryContentSettings));
  }

  async updateContentSettings(data: ContentSettings): Promise<ContentSettings> {
    inMemoryContentSettings = JSON.parse(JSON.stringify(data));
    return JSON.parse(JSON.stringify(inMemoryContentSettings));
  }
}

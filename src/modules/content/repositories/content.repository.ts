import type { ContentSettings } from "../schemas/content-settings.schema";

export interface IContentRepository {
  getContentSettings(): Promise<ContentSettings>;
  updateContentSettings(data: ContentSettings): Promise<ContentSettings>;
}

const DEFAULT_CONTENT_SETTINGS: ContentSettings = {
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
  },
  manifesto: {
    title: "Ready to Capture Your Graduation Milestone?",
    subtitle:
      "Reserve your photo session early to commemorate this special milestone together with family and close friends.",
    primaryCta: "Check Open Dates",
    secondaryCta: "Packages & Booking",
  },
  portfolioShowcase: [
    {
      id: "item-1",
      title: "Solo Commencement",
      desc: "Editorial fine-art portraits with university regalia and timeless academic lighting.",
      alt: "Solo commencement portrait session",
      image: "/logo-bg.jpg",
    },
    {
      id: "item-2",
      title: "Besties & Duo",
      desc: "Intimate and spirited duo captures celebrating enduring collegiate bonds.",
      alt: "Besties duo commencement graduation shoot",
      image: "/logo-bg.jpg",
    },
    {
      id: "item-3",
      title: "Family Milestone Folio",
      desc: "Formal generational family portraits honoring parents, mentors, and graduates.",
      alt: "Family celebration portrait session",
      image: "/logo-bg.jpg",
    },
    {
      id: "item-4",
      title: "Sunset Cohort",
      desc: "Lively group and cohort sessions during golden hour across campus landmarks.",
      alt: "Sunset cohort group commencement session",
      image: "/logo-bg.jpg",
    },
  ],
  testimonials: [
    {
      id: "testi-1",
      quote:
        "The photos turned out stunning and truly aesthetic! The atmosphere was so relaxed, the photographer patiently guided every pose, and the final results look editorial.",
      author: "Adinda Prameswari",
      role: "Universitas Indonesia",
      year: "Verified Graduate",
      initials: "AP",
    },
    {
      id: "testi-2",
      quote:
        "We initially felt awkward posing with the whole family, but the Gradsun team made everything feel effortless and fun. Fast file turnaround and crystal clear resolution!",
      author: "Rayhan Dimas",
      role: "Institut Teknologi Bandung",
      year: "Verified Graduate",
      initials: "RD",
    },
    {
      id: "testi-3",
      quote:
        "Incredible value and service. From initial communication to digital file delivery via Google Drive, everything was prompt and seamless. Our graduation milestone was preserved beautifully.",
      author: "Farah Nabilah",
      role: "Universitas Gadjah Mada",
      year: "Verified Graduate",
      initials: "FN",
    },
  ],
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

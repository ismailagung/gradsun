import { z } from "zod";

export const homeHeroSchema = z.object({
  titlePart1: z.string().min(1),
  titleHighlight: z.string().min(1),
  titlePart2: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
  badgeTitle: z.string().min(1),
  heroImageUrl: z.string().min(1),
  polaroidImageUrl: z.string().min(1),
});

export const homeSectionIntroSchema = z.object({
  tag: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

export const homeManifestoSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
});

export const homeCmsSchema = z.object({
  hero: homeHeroSchema,
  gallerySection: homeSectionIntroSchema,
  packagesSection: homeSectionIntroSchema,
  testimonialsSection: homeSectionIntroSchema,
  manifesto: homeManifestoSchema,
});

export const galleryCmsSchema = z.object({
  tag: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  filterNote: z.string().min(1),
});

export const packagesCmsSchema = z.object({
  seasonTag: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  vowTitle: z.string().min(1),
  vowSubtitle: z.string().min(1),
});

export const trackOrderCmsSchema = z.object({
  tag: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  searchPlaceholder: z.string().min(1),
  supportNote: z.string().min(1),
});

export const contentSettingsSchema = z.object({
  home: homeCmsSchema,
  gallery: galleryCmsSchema,
  packages: packagesCmsSchema,
  trackOrder: trackOrderCmsSchema,
});

export type HomeCms = z.infer<typeof homeCmsSchema>;
export type GalleryCms = z.infer<typeof galleryCmsSchema>;
export type PackagesCms = z.infer<typeof packagesCmsSchema>;
export type TrackOrderCms = z.infer<typeof trackOrderCmsSchema>;
export type ContentSettings = z.infer<typeof contentSettingsSchema>;

export const DEFAULT_HOME_CONTENT: HomeCms = {
  hero: {
    titlePart1: "Every",
    titleHighlight: "Milestone",
    titlePart2: "Deserves to Be Remembered.",
    subtitle:
      "Congratulations to all graduates! Hard work, determination, and perseverance have brought you to this point. An extraordinary achievement that marks the beginning of a new journey. Let us celebrate, remember, and immortalize every precious moment with Gradsun Studio.",
    primaryCta: "Book Your Session",
    secondaryCta: "Explore Gallery",
    badgeTitle: "Besties & Milestones",
    heroImageUrl: "/logo-bg.jpg",
    polaroidImageUrl: "/logo-bg.jpg",
  },
  gallerySection: {
    tag: "Selected Gallery",
    title: "Recent Graduation Highlights",
    subtitle:
      "A curated gallery of authentic milestones captured by Gradsun Studio, framed for a lifetime.",
  },
  packagesSection: {
    tag: "Curated Package Tiers",
    title: "Graduation Photo Packages",
    subtitle:
      "Choose the perfect package for your commencement milestone, from solo portrait sessions to group celebrations.",
  },
  testimonialsSection: {
    tag: "Client Reviews",
    title: "What Our Clients Say",
    subtitle:
      "Genuine reviews from graduates and families who trusted their milestone celebrations to Gradsun Studio.",
  },
  manifesto: {
    title: "Ready to Capture Your Graduation Milestone?",
    subtitle:
      "Reserve your photo session early to commemorate this special milestone together with family and close friends.",
    primaryCta: "Check Open Dates",
    secondaryCta: "Packages & Booking",
  },
};

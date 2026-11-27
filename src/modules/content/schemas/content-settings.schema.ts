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

export const galleryPortfolioItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  aspectRatio: z.enum(["portrait", "square", "landscape"]).default("portrait"),
  order: z.number().default(0),
});

export const galleryCmsSchema = z.object({
  tag: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  filterNote: z.string().default(""),
  items: z.array(galleryPortfolioItemSchema).default([]),
});

export const packageCardPresentationSchema = z.object({
  id: z.string(),
  packageId: z.string().min(1),
  thumbnailUrl: z.string().min(1),
  badge: z.string().default(""),
  customFeatures: z.array(z.string()).default([]),
  order: z.number().default(0),
});

export const packagesCmsSchema = z.object({
  seasonTag: z.string().optional(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  vowTitle: z.string().optional(),
  vowSubtitle: z.string().optional(),
  cards: z.array(packageCardPresentationSchema).default([]),
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
export type GalleryPortfolioItem = z.infer<typeof galleryPortfolioItemSchema>;
export type GalleryCms = z.infer<typeof galleryCmsSchema>;
export type PackageCardPresentation = z.infer<typeof packageCardPresentationSchema>;
export type PackagesCms = z.infer<typeof packagesCmsSchema>;
export type TrackOrderCms = z.infer<typeof trackOrderCmsSchema>;
export type ContentSettings = z.infer<typeof contentSettingsSchema>;

export const DEFAULT_GALLERY_ITEMS: GalleryPortfolioItem[] = [
  {
    id: "gallery-item-1",
    title: "Adinda Prameswari",
    category: "Solo Graduation",
    description: "Faculty of Medicine, Universitas Indonesia • Solo Commencement Editorial",
    imageUrl: "/logo-bg.jpg",
    aspectRatio: "portrait",
    order: 1,
  },
  {
    id: "gallery-item-2",
    title: "Rayhan Dimas",
    category: "Golden Hour Outdoor",
    description: "Faculty of Engineering, Institut Teknologi Bandung • Outdoor Golden Hour Session",
    imageUrl: "/logo-bg.jpg",
    aspectRatio: "portrait",
    order: 2,
  },
  {
    id: "gallery-item-3",
    title: "Farah Nabilah",
    category: "Studio Monochrome",
    description: "Faculty of Economics, Universitas Padjadjaran • Fine-Art Studio Portrait",
    imageUrl: "/logo-bg.jpg",
    aspectRatio: "portrait",
    order: 3,
  },
  {
    id: "gallery-item-4",
    title: "Arka Wicaksono",
    category: "Besties & Cohort",
    description: "Faculty of Law, Universitas Indonesia • Cohort & Peer Celebration",
    imageUrl: "/logo-bg.jpg",
    aspectRatio: "portrait",
    order: 4,
  },
  {
    id: "gallery-item-5",
    title: "Farhan Pratama",
    category: "Golden Hour Outdoor",
    description: "Faculty of Computer Science, Universitas Indonesia • Sunset Campus Vistas",
    imageUrl: "/logo-bg.jpg",
    aspectRatio: "portrait",
    order: 5,
  },
  {
    id: "gallery-item-6",
    title: "Dimas Anggara",
    category: "Studio Monochrome",
    description: "Faculty of Engineering, Universitas Indonesia • Studio Monochrome",
    imageUrl: "/logo-bg.jpg",
    aspectRatio: "portrait",
    order: 6,
  },
  {
    id: "gallery-item-7",
    title: "Nabilah Prameswari",
    category: "Solo Graduation",
    description: "Faculty of Dentistry, Universitas Indonesia • Graduation Stories",
    imageUrl: "/logo-bg.jpg",
    aspectRatio: "portrait",
    order: 7,
  },
  {
    id: "gallery-item-8",
    title: "Rafi Pratama",
    category: "Solo Graduation",
    description: "School of Business and Management, ITB • Fine-Art Graduation Studio",
    imageUrl: "/logo-bg.jpg",
    aspectRatio: "portrait",
    order: 8,
  },
];

export const DEFAULT_GALLERY_CONTENT: GalleryCms = {
  tag: "Fine-Art Archives",
  title: "The Gradsun Gallery",
  subtitle:
    "A curated visual anthology of commencement portraiture, intimate academic celebrations, and timeless collegiate milestones.",
  filterNote: "",
  items: DEFAULT_GALLERY_ITEMS,
};

export const DEFAULT_PACKAGES_CARDS: PackageCardPresentation[] = [
  {
    id: "pkg-card-1",
    packageId: "single-package-1",
    thumbnailUrl: "/logo-bg.jpg",
    badge: "Classic Solo",
    customFeatures: [
      "All unedited high-resolution photos + 25 edited photos",
      "Digital files delivered via Google Drive",
      "1-hour photo session duration",
    ],
    order: 1,
  },
  {
    id: "pkg-card-2",
    packageId: "single-package-2",
    thumbnailUrl: "/logo-bg.jpg",
    badge: "Most Popular",
    customFeatures: [
      "All unedited high-resolution photos + 35 edited photos",
      "Digital files delivered via Google Drive",
      "1.5-hour photo session duration",
    ],
    order: 2,
  },
  {
    id: "pkg-card-3",
    packageId: "group-package-1",
    thumbnailUrl: "/logo-bg.jpg",
    badge: "Best Value",
    customFeatures: [
      "All unedited high-resolution photos",
      "40 professionally edited photos, all files via Google Drive",
      "1-hour photo session duration",
    ],
    order: 3,
  },
  {
    id: "pkg-card-4",
    packageId: "group-package-2",
    thumbnailUrl: "/logo-bg.jpg",
    badge: "Group Milestone",
    customFeatures: [
      "All unedited high-resolution photos",
      "60 professionally edited photos, all files via Google Drive",
      "2-hour photo session duration",
    ],
    order: 4,
  },
];

export const DEFAULT_PACKAGES_CONTENT: PackagesCms = {
  title: "Reserve Your Golden Hour Chapter",
  subtitle:
    "Secure your commencement date with our stress-free reservation flow. Tailored lighting, tactile memory folios, and seamless coordination.",
  cards: DEFAULT_PACKAGES_CARDS,
};

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

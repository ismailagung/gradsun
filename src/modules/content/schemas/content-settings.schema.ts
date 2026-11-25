import { z } from "zod";

export const homeHeroSchema = z.object({
  badge: z.string().min(1),
  titlePart1: z.string().min(1),
  titleHighlight: z.string().min(1),
  titlePart2: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
  badgeTitle: z.string().min(1),
});

export const homeManifestoSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
});

export const homeCmsSchema = z.object({
  hero: homeHeroSchema,
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

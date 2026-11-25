import { z } from "zod";

export const heroContentSchema = z.object({
  badge: z.string().min(1),
  titlePart1: z.string().min(1),
  titleHighlight: z.string().min(1),
  titlePart2: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
  badgeTitle: z.string().min(1),
});

export const portfolioItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  desc: z.string().min(1),
  alt: z.string().min(1),
  image: z.string().min(1),
});

export const testimonialItemSchema = z.object({
  id: z.string(),
  quote: z.string().min(1),
  author: z.string().min(1),
  role: z.string().min(1),
  year: z.string().min(1),
  initials: z.string().min(1),
});

export const manifestoContentSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
});

export const contentSettingsSchema = z.object({
  hero: heroContentSchema,
  manifesto: manifestoContentSchema,
  portfolioShowcase: z.array(portfolioItemSchema),
  testimonials: z.array(testimonialItemSchema),
});

export type HeroContent = z.infer<typeof heroContentSchema>;
export type PortfolioItem = z.infer<typeof portfolioItemSchema>;
export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type ManifestoContent = z.infer<typeof manifestoContentSchema>;
export type ContentSettings = z.infer<typeof contentSettingsSchema>;

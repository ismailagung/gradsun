import { z } from "zod";

export const brandingSettingsSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  brandTagline: z.string().default("Graduation & Portraiture"),
  logoUrl: z.string().default("/gradsun-no-bg.png"),
  showBrandText: z.boolean().default(true),
});

export const footerSettingsSchema = z.object({
  description: z
    .string()
    .default(
      "Timeless editorial graduation portraiture celebrating personal achievement and academic milestones.",
    ),
  ownerName: z.string().default("Ismail Agung"),
  whatsappUrl: z.string().default("https://wa.me/6281234567890"),
  whatsappNumber: z.string().default("6281234567890"),
  instagramUrl: z.string().default("https://instagram.com/gradsun.studio"),
  instagramHandle: z.string().default("@gradsun.studio"),
  email: z.string().email().or(z.literal("")).default("concierge@gradsun.studio"),
  basecampAddress: z.string().default("Depok, Jawa Barat"),
  copyrightText: z.string().default("All rights reserved."),
});

export const orderSettingsSchema = z.object({
  downPaymentPercent: z.number().int().min(10).max(100).default(50),
  trackingCodePrefix: z.string().min(1).max(10).default("GS-"),
  paymentDueHours: z.number().int().positive().default(24),
  operatingHoursStart: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Format must be HH:MM")
    .default("08:00"),
  operatingHoursEnd: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Format must be HH:MM")
    .default("18:00"),
});

export const generalSettingsSchema = z.object({
  branding: brandingSettingsSchema,
  footer: footerSettingsSchema,
  orders: orderSettingsSchema,
});

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type BrandingSettings = z.infer<typeof brandingSettingsSchema>;
export type FooterSettings = z.infer<typeof footerSettingsSchema>;
export type OrderSettings = z.infer<typeof orderSettingsSchema>;

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  branding: {
    brandName: "Gradsun Studio",
    brandTagline: "Graduation & Portraiture",
    logoUrl: "/gradsun-no-bg.png",
    showBrandText: true,
  },
  footer: {
    description:
      "Timeless editorial graduation portraiture celebrating personal achievement and academic milestones.",
    ownerName: "Ismail Agung",
    whatsappUrl: "https://wa.me/6281234567890",
    whatsappNumber: "6281234567890",
    instagramUrl: "https://instagram.com/gradsun.studio",
    instagramHandle: "@gradsun.studio",
    email: "concierge@gradsun.studio",
    basecampAddress: "Depok, Jawa Barat",
    copyrightText: "All rights reserved.",
  },
  orders: {
    downPaymentPercent: 50,
    trackingCodePrefix: "GS-",
    paymentDueHours: 24,
    operatingHoursStart: "08:00",
    operatingHoursEnd: "18:00",
  },
};

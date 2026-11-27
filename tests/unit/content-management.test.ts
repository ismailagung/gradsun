import { describe, expect, it, vi } from "vitest";

vi.mock("@/infrastructure/prisma/client", () => ({
  prisma: {
    siteSetting: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/infrastructure/storage/s3-client", () => ({
  getPublicStorageUrl: vi
    .fn()
    .mockImplementation((key: string) => `https://storage.supabase.co/${key}`),
  s3Client: {
    send: vi.fn().mockResolvedValue({}),
  },
}));

import {
  ContentRepository,
  type IContentRepository,
} from "@/modules/content/repositories/content.repository";
import { GetContentSettingsUseCase } from "@/modules/content/use-cases/get-content-settings.use-case";
import { UpdateContentSettingsUseCase } from "@/modules/content/use-cases/update-content-settings.use-case";
import { UpdateHomeContentUseCase } from "@/modules/content/use-cases/update-home-content.use-case";

describe("Content Management System (TDD)", () => {
  it("returns default content settings covering all 4 public portal pages", async () => {
    const repo: IContentRepository = new ContentRepository();
    const getUseCase = new GetContentSettingsUseCase(repo);
    const settings = await getUseCase.execute();

    // Home Page CMS
    expect(settings.home.hero.titleHighlight).toBe("Milestone");
    expect(settings.home.hero.titlePart1).toBe("Every");
    expect(settings.home.hero.badgeTitle).toBe("Besties & Milestones");
    expect(settings.home.hero.heroImageUrl).toBe("/logo-bg.jpg");
    expect(settings.home.hero.polaroidImageUrl).toBe("/logo-bg.jpg");
    expect(settings.home.gallerySection.title).toBe("Recent Graduation Highlights");
    expect(settings.home.packagesSection.title).toBe("Graduation Photo Packages");
    expect(settings.home.testimonialsSection.title).toBe("What Our Clients Say");
    expect(settings.home.manifesto.primaryCta).toBe("Check Open Dates");

    // Gallery Page CMS
    expect(settings.gallery.title).toBe("The Gradsun Gallery");
    expect(settings.gallery.subtitle).toBeDefined();

    // Packages Page CMS
    expect(settings.packages.seasonTag).toBe("Commencement Season 2025");
    expect(settings.packages.vowTitle).toBe("100% Golden Weather Vow");

    // Track Order Page CMS
    expect(settings.trackOrder.title).toBe("Track Your Milestone Folio");
    expect(settings.trackOrder.searchPlaceholder).toBeDefined();
  });

  it("updates Home page hero and persists settings in repository", async () => {
    const repo: IContentRepository = new ContentRepository();
    const getUseCase = new GetContentSettingsUseCase(repo);
    const updateUseCase = new UpdateContentSettingsUseCase(repo);

    const initial = await getUseCase.execute();
    const updated = await updateUseCase.execute({
      ...initial,
      home: {
        ...initial.home,
        hero: {
          ...initial.home.hero,
          titleHighlight: "Timeless Sunlight",
          badgeTitle: "Class of 2026",
          heroImageUrl: "/images/hero-custom.jpg",
          polaroidImageUrl: "/images/polaroid-custom.jpg",
        },
      },
    });

    expect(updated.home.hero.titleHighlight).toBe("Timeless Sunlight");
    expect(updated.home.hero.badgeTitle).toBe("Class of 2026");
    expect(updated.home.hero.heroImageUrl).toBe("/images/hero-custom.jpg");
    expect(updated.home.hero.polaroidImageUrl).toBe("/images/polaroid-custom.jpg");

    const reFetched = await getUseCase.execute();
    expect(reFetched.home.hero.titleHighlight).toBe("Timeless Sunlight");
    expect(reFetched.home.hero.badgeTitle).toBe("Class of 2026");
    expect(reFetched.home.hero.heroImageUrl).toBe("/images/hero-custom.jpg");
  });

  it("updates Gallery, Packages, and Track Order settings cleanly", async () => {
    const repo: IContentRepository = new ContentRepository();
    const updateUseCase = new UpdateContentSettingsUseCase(repo);
    const getUseCase = new GetContentSettingsUseCase(repo);

    const current = await getUseCase.execute();
    const updated = await updateUseCase.execute({
      ...current,
      gallery: {
        ...current.gallery,
        title: "Exclusive Graduation Archives",
      },
      packages: {
        ...current.packages,
        vowTitle: "Flexible Weather Assurance Guarantee",
      },
      trackOrder: {
        ...current.trackOrder,
        title: "Check Your Delivery Status",
      },
    });

    expect(updated.gallery.title).toBe("Exclusive Graduation Archives");
    expect(updated.packages.vowTitle).toBe("Flexible Weather Assurance Guarantee");
    expect(updated.trackOrder.title).toBe("Check Your Delivery Status");
  });

  it("updates Home CMS directly using UpdateHomeContentUseCase", async () => {
    const repo: IContentRepository = new ContentRepository();
    const useCase = new UpdateHomeContentUseCase(repo);
    const getUseCase = new GetContentSettingsUseCase(repo);

    const beforeUpdate = await getUseCase.execute();
    const updated = await useCase.execute({
      hero: {
        titlePart1: "Unforgettable",
        titleHighlight: "Memories",
        titlePart2: "Forever.",
        subtitle: "A wonderful celebration.",
        primaryCta: "Book Now",
        secondaryCta: "View Works",
        badgeTitle: "Honors Class",
        heroImageUrl: "/images/hero-tdd.jpg",
        polaroidImageUrl: "/images/polaroid-tdd.jpg",
      },
      gallerySection: {
        tag: "TDD Gallery Tag",
        title: "TDD Gallery Title",
        subtitle: "TDD Gallery Subtitle",
      },
      packagesSection: {
        tag: "TDD Packages Tag",
        title: "TDD Packages Title",
        subtitle: "TDD Packages Subtitle",
      },
      testimonialsSection: {
        tag: "TDD Testimonials Tag",
        title: "TDD Testimonials Title",
        subtitle: "TDD Testimonials Subtitle",
      },
      manifesto: {
        title: "TDD Manifesto Title",
        subtitle: "TDD Manifesto Subtitle",
        primaryCta: "Start",
        secondaryCta: "Learn More",
      },
    });

    expect(updated.hero.badgeTitle).toBe("Honors Class");
    expect(updated.hero.heroImageUrl).toBe("/images/hero-tdd.jpg");
    expect(updated.gallerySection.title).toBe("TDD Gallery Title");
    expect(updated.packagesSection.title).toBe("TDD Packages Title");
    expect(updated.testimonialsSection.title).toBe("TDD Testimonials Title");

    const settings = await getUseCase.execute();
    expect(settings.home.hero.badgeTitle).toBe("Honors Class");
    expect(settings.home.hero.heroImageUrl).toBe("/images/hero-tdd.jpg");
    expect(settings.home.gallerySection.title).toBe("TDD Gallery Title");
    expect(settings.home.packagesSection.title).toBe("TDD Packages Title");
    expect(settings.home.testimonialsSection.title).toBe("TDD Testimonials Title");
    expect(settings.gallery.title).toBe(beforeUpdate.gallery.title);
  });

  it("verifies CmsHomeEditor renders faithful arched showcase and dark manifesto banner structure", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const editorSource = fs.readFileSync(
      path.join(process.cwd(), "src/modules/content/components/cms-home-editor.tsx"),
      "utf-8",
    );

    // Verify arched portrait frame and floating rotated polaroid styling in live preview
    expect(editorSource).toContain("aspect-[3/4]");
    expect(editorSource).toContain("rotate-[-3deg]");
    // Verify dark manifesto banner styling in live preview
    expect(editorSource).toContain("bg-foreground text-background");
  });

  it("validates and uploads CMS asset buffer to Supabase storage key structure", async () => {
    const { uploadCmsAssetSchema } = await import(
      "@/modules/content/schemas/upload-cms-asset.schema"
    );
    const { UploadCmsAssetUseCase } = await import(
      "@/modules/content/use-cases/upload-cms-asset.use-case"
    );

    const valid = uploadCmsAssetSchema.safeParse({
      folder: "hero",
      fileName: "commencement-sample.webp",
      contentType: "image/webp",
      base64Data: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=",
    });
    expect(valid.success).toBe(true);
    if (!valid.success) {
      throw new Error("Validation failed");
    }

    const useCase = new UploadCmsAssetUseCase();
    const result = await useCase.execute(valid.data);
    expect(result.publicUrl).toContain("cms/hero/");
    expect(result.publicUrl).toContain("commencement-sample.webp");
    expect(result.key).toMatch(/^cms\/hero\/\d+-commencement-sample\.webp$/);
  });

  it("automatically transcodes raw PNG input into compressed WebP and normalizes extension", async () => {
    const sharp = (await import("sharp")).default;
    const { UploadCmsAssetUseCase } = await import(
      "@/modules/content/use-cases/upload-cms-asset.use-case"
    );

    // Create a 100x100 solid PNG image
    const rawPngBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 217, g: 119, b: 6, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const base64Data = `data:image/png;base64,${rawPngBuffer.toString("base64")}`;

    const useCase = new UploadCmsAssetUseCase();
    const result = await useCase.execute({
      folder: "hero",
      fileName: "editorial-original-portrait.png",
      contentType: "image/png",
      base64Data,
    });

    expect(result.key).toMatch(/^cms\/hero\/\d+-editorial-original-portrait\.webp$/);
    expect(result.publicUrl).toContain(".webp");
  });
});

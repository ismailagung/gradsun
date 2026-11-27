import { describe, expect, it } from "vitest";
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
    expect(settings.home.hero.titleHighlight).toBe("Preserved in Amber");
    expect(settings.home.hero.badge).toBe("Commencement Season 2025");
    expect(settings.home.hero.heroImageUrl).toBe("/logo-bg.jpg");
    expect(settings.home.hero.polaroidImageUrl).toBe("/logo-bg.jpg");
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
          badge: "Special Season 2026",
          titleHighlight: "Timeless Sunlight",
          heroImageUrl: "/images/hero-custom.jpg",
          polaroidImageUrl: "/images/polaroid-custom.jpg",
        },
      },
    });

    expect(updated.home.hero.badge).toBe("Special Season 2026");
    expect(updated.home.hero.titleHighlight).toBe("Timeless Sunlight");
    expect(updated.home.hero.heroImageUrl).toBe("/images/hero-custom.jpg");
    expect(updated.home.hero.polaroidImageUrl).toBe("/images/polaroid-custom.jpg");

    const reFetched = await getUseCase.execute();
    expect(reFetched.home.hero.badge).toBe("Special Season 2026");
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
        badge: "TDD Commencement 2026",
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
      manifesto: {
        title: "TDD Manifesto Title",
        subtitle: "TDD Manifesto Subtitle",
        primaryCta: "Start",
        secondaryCta: "Learn More",
      },
    });

    expect(updated.hero.badge).toBe("TDD Commencement 2026");
    expect(updated.hero.heroImageUrl).toBe("/images/hero-tdd.jpg");

    const settings = await getUseCase.execute();
    expect(settings.home.hero.badge).toBe("TDD Commencement 2026");
    expect(settings.home.hero.heroImageUrl).toBe("/images/hero-tdd.jpg");
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
});

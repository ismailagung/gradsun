import { describe, expect, it } from "vitest";
import {
  ContentRepository,
  type IContentRepository,
} from "@/modules/content/repositories/content.repository";
import { GetContentSettingsUseCase } from "@/modules/content/use-cases/get-content-settings.use-case";
import { UpdateContentSettingsUseCase } from "@/modules/content/use-cases/update-content-settings.use-case";

describe("Content Management System (TDD)", () => {
  it("returns default content settings covering all 4 public portal pages", async () => {
    const repo: IContentRepository = new ContentRepository();
    const getUseCase = new GetContentSettingsUseCase(repo);
    const settings = await getUseCase.execute();

    // Home Page CMS
    expect(settings.home.hero.titleHighlight).toBe("Preserved in Amber");
    expect(settings.home.hero.badge).toBe("Commencement Season 2025");
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
        },
      },
    });

    expect(updated.home.hero.badge).toBe("Special Season 2026");
    expect(updated.home.hero.titleHighlight).toBe("Timeless Sunlight");

    const reFetched = await getUseCase.execute();
    expect(reFetched.home.hero.badge).toBe("Special Season 2026");
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
});

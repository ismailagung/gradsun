import { describe, expect, it } from "vitest";
import {
  ContentRepository,
  type IContentRepository,
} from "@/modules/content/repositories/content.repository";
import { GetContentSettingsUseCase } from "@/modules/content/use-cases/get-content-settings.use-case";
import { UpdateContentSettingsUseCase } from "@/modules/content/use-cases/update-content-settings.use-case";

describe("Content Management System (TDD)", () => {
  it("returns default content settings covering hero, showcase, and testimonials", async () => {
    const repo: IContentRepository = new ContentRepository();
    const getUseCase = new GetContentSettingsUseCase(repo);
    const settings = await getUseCase.execute();

    expect(settings.hero.titleHighlight).toBe("Preserved in Amber");
    expect(settings.hero.badge).toBe("Commencement Season 2025");
    expect(settings.portfolioShowcase.length).toBeGreaterThanOrEqual(4);
    expect(settings.testimonials.length).toBeGreaterThanOrEqual(3);
    expect(settings.manifesto.primaryCta).toBe("Check Open Dates");
  });

  it("updates hero section and persists settings in repository", async () => {
    const repo: IContentRepository = new ContentRepository();
    const getUseCase = new GetContentSettingsUseCase(repo);
    const updateUseCase = new UpdateContentSettingsUseCase(repo);

    const initial = await getUseCase.execute();
    const updated = await updateUseCase.execute({
      ...initial,
      hero: {
        ...initial.hero,
        badge: "Special Season 2026",
        titleHighlight: "Timeless Sunlight",
      },
    });

    expect(updated.hero.badge).toBe("Special Season 2026");
    expect(updated.hero.titleHighlight).toBe("Timeless Sunlight");

    const reFetched = await getUseCase.execute();
    expect(reFetched.hero.badge).toBe("Special Season 2026");
  });

  it("updates testimonials and portfolio items cleanly", async () => {
    const repo: IContentRepository = new ContentRepository();
    const updateUseCase = new UpdateContentSettingsUseCase(repo);
    const getUseCase = new GetContentSettingsUseCase(repo);

    const current = await getUseCase.execute();
    const updated = await updateUseCase.execute({
      ...current,
      testimonials: [
        {
          id: "testi-custom-1",
          author: "David Miller",
          role: "Universitas Indonesia",
          year: "Verified Graduate",
          quote: "The photo session was extraordinary and super aesthetic!",
          initials: "DM",
        },
      ],
    });

    expect(updated.testimonials).toHaveLength(1);
    expect(updated.testimonials[0]?.author).toBe("David Miller");
  });
});

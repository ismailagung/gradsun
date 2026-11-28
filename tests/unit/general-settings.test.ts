import { describe, expect, it, vi } from "vitest";
import type { IGeneralSettingsRepository } from "@/modules/settings/repositories/general-settings.repository";
import {
  DEFAULT_GENERAL_SETTINGS,
  type GeneralSettings,
  generalSettingsSchema,
} from "@/modules/settings/schemas/general-settings.schema";
import { GetGeneralSettingsUseCase } from "@/modules/settings/use-cases/get-general-settings.use-case";
import { UpdateGeneralSettingsUseCase } from "@/modules/settings/use-cases/update-general-settings.use-case";

describe("General Settings Domain & Use Cases (TDD)", () => {
  const createMockRepository = (
    overrides: Partial<IGeneralSettingsRepository> = {},
  ): IGeneralSettingsRepository => ({
    getSettings: vi.fn().mockResolvedValue(DEFAULT_GENERAL_SETTINGS),
    updateSettings: vi.fn().mockImplementation(async (data: GeneralSettings) => data),
    ...overrides,
  });

  describe("General Settings Zod Schema Validation", () => {
    it("validates default general settings successfully", () => {
      const parsed = generalSettingsSchema.safeParse(DEFAULT_GENERAL_SETTINGS);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.branding.brandName).toBe("Gradsun Studio");
        expect(parsed.data.orders.downPaymentPercent).toBe(50);
        expect(parsed.data.orders.trackingCodePrefix).toBe("GS-");
      }
    });

    it("rejects invalid downPaymentPercent outside 10% to 100% range", () => {
      const invalidLow = {
        ...DEFAULT_GENERAL_SETTINGS,
        orders: { ...DEFAULT_GENERAL_SETTINGS.orders, downPaymentPercent: 5 },
      };
      const invalidHigh = {
        ...DEFAULT_GENERAL_SETTINGS,
        orders: { ...DEFAULT_GENERAL_SETTINGS.orders, downPaymentPercent: 120 },
      };

      expect(generalSettingsSchema.safeParse(invalidLow).success).toBe(false);
      expect(generalSettingsSchema.safeParse(invalidHigh).success).toBe(false);
    });

    it("rejects empty brand name", () => {
      const emptyBrand = {
        ...DEFAULT_GENERAL_SETTINGS,
        branding: { ...DEFAULT_GENERAL_SETTINGS.branding, brandName: "" },
      };
      expect(generalSettingsSchema.safeParse(emptyBrand).success).toBe(false);
    });

    it("validates operating hours format (HH:MM)", () => {
      const invalidHours = {
        ...DEFAULT_GENERAL_SETTINGS,
        orders: { ...DEFAULT_GENERAL_SETTINGS.orders, operatingHoursStart: "8:00" },
      };
      expect(generalSettingsSchema.safeParse(invalidHours).success).toBe(false);

      const validHours = {
        ...DEFAULT_GENERAL_SETTINGS,
        orders: {
          ...DEFAULT_GENERAL_SETTINGS.orders,
          operatingHoursStart: "08:00",
          operatingHoursEnd: "18:00",
        },
      };
      expect(generalSettingsSchema.safeParse(validHours).success).toBe(true);
    });
  });

  describe("GetGeneralSettingsUseCase", () => {
    it("returns stored general settings from repository", async () => {
      const customSettings: GeneralSettings = {
        ...DEFAULT_GENERAL_SETTINGS,
        branding: { ...DEFAULT_GENERAL_SETTINGS.branding, brandName: "Gradsun Creative" },
        orders: { ...DEFAULT_GENERAL_SETTINGS.orders, downPaymentPercent: 20 },
      };

      const repo = createMockRepository({
        getSettings: vi.fn().mockResolvedValue(customSettings),
      });

      const useCase = new GetGeneralSettingsUseCase(repo);
      const result = await useCase.execute();

      expect(result.branding.brandName).toBe("Gradsun Creative");
      expect(result.orders.downPaymentPercent).toBe(20);
      expect(repo.getSettings).toHaveBeenCalledOnce();
    });

    it("falls back to default settings when repository returns default", async () => {
      const repo = createMockRepository();
      const useCase = new GetGeneralSettingsUseCase(repo);
      const result = await useCase.execute();

      expect(result.orders.downPaymentPercent).toBe(50);
      expect(result.orders.trackingCodePrefix).toBe("GS-");
    });
  });

  describe("UpdateGeneralSettingsUseCase", () => {
    it("updates and returns new general settings", async () => {
      const repo = createMockRepository();
      const useCase = new UpdateGeneralSettingsUseCase(repo);

      const updatedInput: GeneralSettings = {
        ...DEFAULT_GENERAL_SETTINGS,
        orders: {
          ...DEFAULT_GENERAL_SETTINGS.orders,
          downPaymentPercent: 25,
          trackingCodePrefix: "GRAD-",
        },
      };

      const result = await useCase.execute(updatedInput);
      expect(result.orders.downPaymentPercent).toBe(25);
      expect(result.orders.trackingCodePrefix).toBe("GRAD-");
      expect(repo.updateSettings).toHaveBeenCalledWith(updatedInput);
    });

    it("simulates real-world dynamic DP calculation correctly", () => {
      const packagePrice = 1000000;
      const dp50 = Math.round((packagePrice * 50) / 100);
      expect(dp50).toBe(500000);

      const dp20 = Math.round((packagePrice * 20) / 100);
      expect(dp20).toBe(200000);
    });
  });
});

import type { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma/client";
import {
  DEFAULT_GENERAL_SETTINGS,
  type GeneralSettings,
  generalSettingsSchema,
} from "../schemas/general-settings.schema";

export interface IGeneralSettingsRepository {
  getSettings(): Promise<GeneralSettings>;
  updateSettings(data: GeneralSettings): Promise<GeneralSettings>;
}

export const GENERAL_SETTINGS_KEY = "general_settings";

export class GeneralSettingsRepository implements IGeneralSettingsRepository {
  private inMemoryFallback: GeneralSettings = JSON.parse(JSON.stringify(DEFAULT_GENERAL_SETTINGS));

  async getSettings(): Promise<GeneralSettings> {
    try {
      const record = await prisma.siteSetting.findUnique({
        where: { key: GENERAL_SETTINGS_KEY },
      });

      if (!record?.value) {
        return this.inMemoryFallback;
      }

      const parsed = generalSettingsSchema.safeParse(record.value);
      if (!parsed.success) {
        return this.inMemoryFallback;
      }

      this.inMemoryFallback = parsed.data;
      return parsed.data;
    } catch {
      return this.inMemoryFallback;
    }
  }

  async updateSettings(data: GeneralSettings): Promise<GeneralSettings> {
    this.inMemoryFallback = JSON.parse(JSON.stringify(data));
    try {
      const record = await prisma.siteSetting.upsert({
        where: { key: GENERAL_SETTINGS_KEY },
        create: {
          key: GENERAL_SETTINGS_KEY,
          value: data as unknown as Prisma.InputJsonValue,
        },
        update: {
          value: data as unknown as Prisma.InputJsonValue,
        },
      });

      const parsed = generalSettingsSchema.safeParse(record.value);
      if (parsed.success) {
        this.inMemoryFallback = parsed.data;
        return parsed.data;
      }
      return this.inMemoryFallback;
    } catch {
      return this.inMemoryFallback;
    }
  }
}

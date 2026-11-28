import type { IGeneralSettingsRepository } from "../repositories/general-settings.repository";
import { type GeneralSettings, generalSettingsSchema } from "../schemas/general-settings.schema";

export class UpdateGeneralSettingsUseCase {
  constructor(private readonly repository: IGeneralSettingsRepository) {}

  async execute(input: GeneralSettings): Promise<GeneralSettings> {
    const validated = generalSettingsSchema.parse(input);
    return this.repository.updateSettings(validated);
  }
}

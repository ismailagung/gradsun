import type { IGeneralSettingsRepository } from "../repositories/general-settings.repository";
import type { GeneralSettings } from "../schemas/general-settings.schema";

export class GetGeneralSettingsUseCase {
  constructor(private readonly repository: IGeneralSettingsRepository) {}

  async execute(): Promise<GeneralSettings> {
    return this.repository.getSettings();
  }
}

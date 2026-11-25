import type { IContentRepository } from "../repositories/content.repository";
import type { ContentSettings } from "../schemas/content-settings.schema";

export class GetContentSettingsUseCase {
  constructor(private readonly repository: IContentRepository) {}

  async execute(): Promise<ContentSettings> {
    return this.repository.getContentSettings();
  }
}

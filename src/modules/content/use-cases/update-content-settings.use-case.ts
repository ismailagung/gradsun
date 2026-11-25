import type { IContentRepository } from "../repositories/content.repository";
import { type ContentSettings, contentSettingsSchema } from "../schemas/content-settings.schema";

export class UpdateContentSettingsUseCase {
  constructor(private readonly repository: IContentRepository) {}

  async execute(input: ContentSettings): Promise<ContentSettings> {
    const validated = contentSettingsSchema.parse(input);
    return this.repository.updateContentSettings(validated);
  }
}

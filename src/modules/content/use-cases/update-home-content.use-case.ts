import type { IContentRepository } from "../repositories/content.repository";
import { type HomeCms, homeCmsSchema } from "../schemas/content-settings.schema";

export class UpdateHomeContentUseCase {
  constructor(private readonly repository: IContentRepository) {}

  async execute(input: HomeCms): Promise<HomeCms> {
    const validated = homeCmsSchema.parse(input);
    const current = await this.repository.getContentSettings();
    const updated = await this.repository.updateContentSettings({
      ...current,
      home: validated,
    });
    return updated.home;
  }
}

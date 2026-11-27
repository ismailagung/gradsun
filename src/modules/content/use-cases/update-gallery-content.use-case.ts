import type { IContentRepository } from "../repositories/content.repository";
import type { GalleryCms } from "../schemas/content-settings.schema";

export class UpdateGalleryContentUseCase {
  constructor(private readonly repository: IContentRepository) {}

  async execute(input: GalleryCms): Promise<GalleryCms> {
    const current = await this.repository.getContentSettings();
    const updated = await this.repository.updateContentSettings({
      ...current,
      gallery: input,
    });
    return updated.gallery;
  }
}

import type { IContentRepository } from "../repositories/content.repository";
import type { PackagesCms } from "../schemas/content-settings.schema";

export class UpdatePackagesContentUseCase {
  constructor(private readonly repository: IContentRepository) {}

  async execute(input: PackagesCms): Promise<PackagesCms> {
    const current = await this.repository.getContentSettings();
    const updated = await this.repository.updateContentSettings({
      ...current,
      packages: input,
    });
    return updated.packages;
  }
}

import type { IPackageRepository, PackageWithAddons } from "../repositories/package.repository";
import type { UpdatePackageInput } from "../schemas/update-package.schema";

export class UpdatePackageUseCase {
  constructor(private readonly repository: IPackageRepository) {}

  async execute(input: UpdatePackageInput): Promise<PackageWithAddons> {
    const existing = await this.repository.findById(input.id);
    if (!existing) {
      throw new Error("Package not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const slugConflict = await this.repository.findBySlug(input.slug);
      if (slugConflict && slugConflict.id !== input.id) {
        throw new Error(`Package with slug '${input.slug}' already exists`);
      }
    }

    const { id, ...data } = input;
    return await this.repository.update(id, data);
  }
}

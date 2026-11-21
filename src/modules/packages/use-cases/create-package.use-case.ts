import type { IPackageRepository, PackageWithAddons } from "../repositories/package.repository";
import type { CreatePackageInput } from "../schemas/create-package.schema";

export class CreatePackageUseCase {
  constructor(private readonly repository: IPackageRepository) {}

  async execute(input: CreatePackageInput): Promise<PackageWithAddons> {
    if (input.basePrice <= 0) {
      throw new Error("Base price must be a positive number");
    }

    if (input.addons && input.addons.length > 0) {
      for (const addon of input.addons) {
        if (addon.price <= 0) {
          throw new Error(`Add-on "${addon.name}" price must be a positive number`);
        }
      }
    }

    const existing = await this.repository.findBySlug(input.slug);
    if (existing) {
      throw new Error(`Package with slug "${input.slug}" already exists`);
    }

    return this.repository.create(input);
  }
}

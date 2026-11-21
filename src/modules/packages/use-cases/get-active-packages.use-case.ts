import type { IPackageRepository, PackageWithAddons } from "../repositories/package.repository";

export class GetActivePackagesUseCase {
  constructor(private readonly repository: IPackageRepository) {}

  async execute(): Promise<PackageWithAddons[]> {
    return this.repository.findActivePackages();
  }
}

import type { IPackageRepository, PackageWithAddons } from "../repositories/package.repository";

export class GetAllPackagesUseCase {
  constructor(private readonly repository: IPackageRepository) {}

  async execute(): Promise<PackageWithAddons[]> {
    return await this.repository.findAll();
  }
}

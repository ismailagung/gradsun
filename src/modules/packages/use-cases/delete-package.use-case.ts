import type { IPackageRepository } from "../repositories/package.repository";
import type { DeletePackageInput } from "../schemas/delete-package.schema";

export class DeletePackageUseCase {
  constructor(private readonly repository: IPackageRepository) {}

  async execute(input: DeletePackageInput): Promise<void> {
    const existing = await this.repository.findById(input.id);
    if (!existing) {
      throw new Error("Package not found");
    }

    await this.repository.delete(input.id);
  }
}

import { describe, expect, it, vi } from "vitest";
import type {
  IPackageRepository,
  PackageWithAddons,
} from "@/modules/packages/repositories/package.repository";
import type { CreatePackageInput } from "@/modules/packages/schemas/create-package.schema";
import { CreatePackageUseCase } from "@/modules/packages/use-cases/create-package.use-case";
import { GetActivePackagesUseCase } from "@/modules/packages/use-cases/get-active-packages.use-case";

describe("Packages Domain Use Cases", () => {
  const mockPackage: PackageWithAddons = {
    id: "pkg-1",
    title: "Solo Commencement",
    slug: "solo-commencement",
    description: "Individual studio photography session for graduates.",
    durationMinutes: 45,
    basePrice: 1500000,
    editQuota: 5,
    downPaymentPercent: 30,
    isActive: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
    addons: [
      {
        id: "addon-1",
        packageId: "pkg-1",
        name: "Fine-Art Hardcover Photobook",
        price: 450000,
        description: "Hardcover 20x20cm photobook",
        maxQuantity: 2,
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
      },
    ],
  };

  const createMockRepository = (
    overrides: Partial<IPackageRepository> = {},
  ): IPackageRepository => ({
    findActivePackages: vi.fn().mockResolvedValue([mockPackage]),
    findBySlug: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(mockPackage),
    ...overrides,
  });

  describe("GetActivePackagesUseCase", () => {
    it("returns active packages with their add-ons", async () => {
      const repository = createMockRepository();
      const useCase = new GetActivePackagesUseCase(repository);

      const result = await useCase.execute();

      expect(result).toEqual([mockPackage]);
      expect(repository.findActivePackages).toHaveBeenCalledTimes(1);
    });

    it("returns an empty array when no active packages are available", async () => {
      const repository = createMockRepository({
        findActivePackages: vi.fn().mockResolvedValue([]),
      });
      const useCase = new GetActivePackagesUseCase(repository);

      const result = await useCase.execute();

      expect(result).toEqual([]);
    });
  });

  describe("CreatePackageUseCase", () => {
    const validInput: CreatePackageInput = {
      title: "Solo Commencement",
      slug: "solo-commencement",
      description: "Individual studio photography session.",
      durationMinutes: 45,
      basePrice: 1500000,
      editQuota: 5,
      downPaymentPercent: 30,
      isActive: true,
      addons: [
        {
          name: "Fine-Art Hardcover Photobook",
          price: 450000,
          description: "Hardcover 20x20cm photobook",
          maxQuantity: 2,
        },
      ],
    };

    it("creates a new package when invariants are satisfied and slug is unique", async () => {
      const repository = createMockRepository({
        findBySlug: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(mockPackage),
      });
      const useCase = new CreatePackageUseCase(repository);

      const result = await useCase.execute(validInput);

      expect(result).toEqual(mockPackage);
      expect(repository.findBySlug).toHaveBeenCalledWith("solo-commencement");
      expect(repository.create).toHaveBeenCalledWith(validInput);
    });

    it("rejects creation when package slug already exists", async () => {
      const repository = createMockRepository({
        findBySlug: vi.fn().mockResolvedValue(mockPackage),
      });
      const useCase = new CreatePackageUseCase(repository);

      await expect(useCase.execute(validInput)).rejects.toThrow(
        'Package with slug "solo-commencement" already exists',
      );
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("rejects creation when basePrice is zero or negative", async () => {
      const repository = createMockRepository();
      const useCase = new CreatePackageUseCase(repository);

      const zeroPriceInput: CreatePackageInput = {
        ...validInput,
        basePrice: 0,
      };

      await expect(useCase.execute(zeroPriceInput)).rejects.toThrow(
        "Base price must be a positive number",
      );

      const negativePriceInput: CreatePackageInput = {
        ...validInput,
        basePrice: -50000,
      };

      await expect(useCase.execute(negativePriceInput)).rejects.toThrow(
        "Base price must be a positive number",
      );

      expect(repository.create).not.toHaveBeenCalled();
    });

    it("rejects creation when any add-on price is zero or negative", async () => {
      const repository = createMockRepository();
      const useCase = new CreatePackageUseCase(repository);

      const invalidAddonInput: CreatePackageInput = {
        ...validInput,
        addons: [
          {
            name: "Free Item",
            price: 0,
            maxQuantity: 1,
          },
        ],
      };

      await expect(useCase.execute(invalidAddonInput)).rejects.toThrow(
        'Add-on "Free Item" price must be a positive number',
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });
});

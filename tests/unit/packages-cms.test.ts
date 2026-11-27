import { describe, expect, it, vi } from "vitest";

vi.mock("@/infrastructure/prisma/client", () => ({
  prisma: {
    package: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    siteSetting: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import {
  DEFAULT_CONTENT_SETTINGS,
  type IContentRepository,
} from "@/modules/content/repositories/content.repository";
import type { PackagesCms } from "@/modules/content/schemas/content-settings.schema";
import { UpdatePackagesContentUseCase } from "@/modules/content/use-cases/update-packages-content.use-case";
import type {
  IPackageRepository,
  PackageWithAddons,
} from "@/modules/packages/repositories/package.repository";
import type { UpdatePackageInput } from "@/modules/packages/schemas/update-package.schema";
import { DeletePackageUseCase } from "@/modules/packages/use-cases/delete-package.use-case";
import { GetAllPackagesUseCase } from "@/modules/packages/use-cases/get-all-packages.use-case";
import { UpdatePackageUseCase } from "@/modules/packages/use-cases/update-package.use-case";

describe("Packages CMS & Master Data Use Cases", () => {
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

  const createMockPackageRepository = (
    overrides: Partial<IPackageRepository> = {},
  ): IPackageRepository => ({
    findActivePackages: vi.fn().mockResolvedValue([mockPackage]),
    findAll: vi.fn().mockResolvedValue([mockPackage]),
    findBySlug: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue(mockPackage),
    create: vi.fn().mockResolvedValue(mockPackage),
    update: vi.fn().mockResolvedValue(mockPackage),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  const createMockContentRepository = (
    overrides: Partial<IContentRepository> = {},
  ): IContentRepository => ({
    getContentSettings: vi.fn().mockResolvedValue(DEFAULT_CONTENT_SETTINGS),
    updateContentSettings: vi.fn().mockImplementation(async (data) => data),
    ...overrides,
  });

  describe("GetAllPackagesUseCase", () => {
    it("returns all packages including active and inactive ones", async () => {
      const repo = createMockPackageRepository();
      const useCase = new GetAllPackagesUseCase(repo);

      const result = await useCase.execute();

      expect(result).toEqual([mockPackage]);
      expect(repo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("UpdatePackageUseCase", () => {
    const updateInput: UpdatePackageInput = {
      id: "pkg-1",
      title: "Solo Commencement VIP",
      slug: "solo-commencement-vip",
      description: "Updated VIP session",
      durationMinutes: 60,
      basePrice: 1800000,
      editQuota: 8,
      downPaymentPercent: 30,
      isActive: true,
      addons: [],
    };

    it("updates package data when package exists", async () => {
      const updatedPackage: PackageWithAddons = {
        ...mockPackage,
        title: "Solo Commencement VIP",
        slug: "solo-commencement-vip",
        durationMinutes: 60,
        basePrice: 1800000,
        editQuota: 8,
      };

      const repo = createMockPackageRepository({
        findById: vi.fn().mockResolvedValue(mockPackage),
        update: vi.fn().mockResolvedValue(updatedPackage),
      });

      const useCase = new UpdatePackageUseCase(repo);
      const result = await useCase.execute(updateInput);

      const { id, ...expectedData } = updateInput;
      expect(result).toEqual(updatedPackage);
      expect(repo.findById).toHaveBeenCalledWith("pkg-1");
      expect(repo.update).toHaveBeenCalledWith("pkg-1", expectedData);
    });

    it("throws error when package to update does not exist", async () => {
      const repo = createMockPackageRepository({
        findById: vi.fn().mockResolvedValue(null),
      });

      const useCase = new UpdatePackageUseCase(repo);
      await expect(useCase.execute(updateInput)).rejects.toThrow("Package not found");
    });
  });

  describe("DeletePackageUseCase", () => {
    it("deletes package when package exists", async () => {
      const repo = createMockPackageRepository({
        findById: vi.fn().mockResolvedValue(mockPackage),
      });

      const useCase = new DeletePackageUseCase(repo);
      await useCase.execute({ id: "pkg-1" });

      expect(repo.findById).toHaveBeenCalledWith("pkg-1");
      expect(repo.delete).toHaveBeenCalledWith("pkg-1");
    });

    it("throws error when deleting non-existent package", async () => {
      const repo = createMockPackageRepository({
        findById: vi.fn().mockResolvedValue(null),
      });

      const useCase = new DeletePackageUseCase(repo);
      await expect(useCase.execute({ id: "pkg-not-found" })).rejects.toThrow("Package not found");
    });
  });

  describe("UpdatePackagesContentUseCase", () => {
    const validPackagesCms: PackagesCms = {
      seasonTag: "Commencement Season 2026",
      title: "Capture The Moment",
      subtitle: "New editorial collections.",
      vowTitle: "Weather Guarantee Vow",
      vowSubtitle: "Reschedule anytime within 1 year",
      cards: [
        {
          id: "card-1",
          packageId: "pkg-1",
          thumbnailUrl: "/photos/cms/packages/solo.webp",
          badge: "Most Popular",
          customFeatures: ["Feature 1", "Feature 2"],
          order: 1,
        },
      ],
    };

    it("persists updated packages content with cards to settings", async () => {
      const repo = createMockContentRepository();
      const useCase = new UpdatePackagesContentUseCase(repo);

      const result = await useCase.execute(validPackagesCms);

      expect(result).toEqual(validPackagesCms);
      expect(repo.updateContentSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          packages: validPackagesCms,
        }),
      );
    });
  });
});

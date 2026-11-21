import type { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma/client";
import type { CreatePackageInput } from "../schemas/create-package.schema";

export type PackageWithAddons = Prisma.PackageGetPayload<{
  include: { addons: true };
}>;

export interface IPackageRepository {
  findActivePackages(): Promise<PackageWithAddons[]>;
  findBySlug(slug: string): Promise<PackageWithAddons | null>;
  create(data: CreatePackageInput): Promise<PackageWithAddons>;
}

export class PackageRepository implements IPackageRepository {
  async findActivePackages(): Promise<PackageWithAddons[]> {
    return prisma.package.findMany({
      where: { isActive: true },
      include: {
        addons: {
          orderBy: { price: "asc" },
        },
      },
      orderBy: { basePrice: "asc" },
    });
  }

  async findBySlug(slug: string): Promise<PackageWithAddons | null> {
    return prisma.package.findUnique({
      where: { slug },
      include: {
        addons: true,
      },
    });
  }

  async create(data: CreatePackageInput): Promise<PackageWithAddons> {
    const { addons, ...packageData } = data;

    return prisma.package.create({
      data: {
        ...packageData,
        addons:
          addons && addons.length > 0
            ? {
                create: addons.map((addon) => ({
                  name: addon.name,
                  price: addon.price,
                  description: addon.description ?? null,
                  maxQuantity: addon.maxQuantity ?? 1,
                })),
              }
            : undefined,
      },
      include: {
        addons: true,
      },
    });
  }
}

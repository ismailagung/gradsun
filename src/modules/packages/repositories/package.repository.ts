import type { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma/client";
import type { CreatePackageInput } from "../schemas/create-package.schema";

export type PackageWithAddons = Prisma.PackageGetPayload<{
  include: { addons: true };
}>;

export interface IPackageRepository {
  findActivePackages(): Promise<PackageWithAddons[]>;
  findAll(): Promise<PackageWithAddons[]>;
  findById(id: string): Promise<PackageWithAddons | null>;
  findBySlug(slug: string): Promise<PackageWithAddons | null>;
  create(data: CreatePackageInput): Promise<PackageWithAddons>;
  update(id: string, data: Partial<CreatePackageInput>): Promise<PackageWithAddons>;
  delete(id: string): Promise<void>;
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

  async findAll(): Promise<PackageWithAddons[]> {
    return prisma.package.findMany({
      include: {
        addons: {
          orderBy: { price: "asc" },
        },
      },
      orderBy: { basePrice: "asc" },
    });
  }

  async findById(id: string): Promise<PackageWithAddons | null> {
    return prisma.package.findUnique({
      where: { id },
      include: {
        addons: {
          orderBy: { price: "asc" },
        },
      },
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

  async update(id: string, data: Partial<CreatePackageInput>): Promise<PackageWithAddons> {
    const { addons, ...packageData } = data;

    return prisma.package.update({
      where: { id },
      data: {
        ...packageData,
        addons:
          addons !== undefined
            ? {
                deleteMany: {},
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
        addons: {
          orderBy: { price: "asc" },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.package.delete({
      where: { id },
    });
  }
}

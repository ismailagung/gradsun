import type { PrismaClient } from "@prisma/client";

export interface SeedAddonData {
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
}

export interface SeedPackageData {
  title: string;
  slug: string;
  description: string;
  durationMinutes: number;
  basePrice: number;
  editQuota: number;
  downPaymentPercent: number;
  isActive: boolean;
  addons: SeedAddonData[];
}

export const COMMENCEMENT_PACKAGES: SeedPackageData[] = [
  {
    title: "Single Package 1",
    slug: "single-package-1",
    description: "1 Graduate (family & friends included)",
    durationMinutes: 60,
    basePrice: 450000,
    editQuota: 25,
    downPaymentPercent: 50,
    isActive: true,
    addons: [],
  },
  {
    title: "Single Package 2",
    slug: "single-package-2",
    description: "1 Graduate (friends & family included)",
    durationMinutes: 90,
    basePrice: 550000,
    editQuota: 35,
    downPaymentPercent: 50,
    isActive: true,
    addons: [],
  },
  {
    title: "Group Package 1",
    slug: "group-package-1",
    description: "Up to 5 Graduates",
    durationMinutes: 60,
    basePrice: 750000,
    editQuota: 40,
    downPaymentPercent: 50,
    isActive: true,
    addons: [],
  },
  {
    title: "Group Package 2",
    slug: "group-package-2",
    description: "Up to 10 Graduates",
    durationMinutes: 120,
    basePrice: 950000,
    editQuota: 60,
    downPaymentPercent: 50,
    isActive: true,
    addons: [],
  },
];

export async function seedPackages(prisma: PrismaClient) {
  const seededPackages = [];

  for (const pkgData of COMMENCEMENT_PACKAGES) {
    const pkg = await prisma.package.upsert({
      where: { slug: pkgData.slug },
      update: {
        title: pkgData.title,
        description: pkgData.description,
        durationMinutes: pkgData.durationMinutes,
        basePrice: pkgData.basePrice,
        editQuota: pkgData.editQuota,
        downPaymentPercent: pkgData.downPaymentPercent,
        isActive: pkgData.isActive,
      },
      create: {
        title: pkgData.title,
        slug: pkgData.slug,
        description: pkgData.description,
        durationMinutes: pkgData.durationMinutes,
        basePrice: pkgData.basePrice,
        editQuota: pkgData.editQuota,
        downPaymentPercent: pkgData.downPaymentPercent,
        isActive: pkgData.isActive,
      },
    });

    for (const addonData of pkgData.addons) {
      const existingAddon = await prisma.packageAddon.findFirst({
        where: {
          packageId: pkg.id,
          name: addonData.name,
        },
      });

      if (existingAddon) {
        await prisma.packageAddon.update({
          where: { id: existingAddon.id },
          data: {
            price: addonData.price,
            description: addonData.description,
            maxQuantity: addonData.maxQuantity,
          },
        });
      } else {
        await prisma.packageAddon.create({
          data: {
            packageId: pkg.id,
            name: addonData.name,
            price: addonData.price,
            description: addonData.description,
            maxQuantity: addonData.maxQuantity,
          },
        });
      }
    }

    seededPackages.push(pkg);
  }

  return seededPackages;
}

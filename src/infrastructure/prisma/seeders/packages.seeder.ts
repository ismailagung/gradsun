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
    title: "Solo Commencement",
    slug: "solo-commencement",
    description:
      "Individual commencement portrait session for graduates with dedicated lighting and portrait direction.",
    durationMinutes: 45,
    basePrice: 1500000,
    editQuota: 5,
    downPaymentPercent: 30,
    isActive: true,
    addons: [],
  },
  {
    title: "Besties & Duo",
    slug: "besties-and-duo",
    description:
      "Shared commencement portrait session for 2 graduates celebrating milestones together.",
    durationMinutes: 60,
    basePrice: 1950000,
    editQuota: 10,
    downPaymentPercent: 30,
    isActive: true,
    addons: [],
  },
  {
    title: "Sunset Cohort",
    slug: "sunset-cohort",
    description:
      "Group commencement session for cohort circles up to 8 graduates with indoor and golden hour scenes.",
    durationMinutes: 90,
    basePrice: 2850000,
    editQuota: 20,
    downPaymentPercent: 30,
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

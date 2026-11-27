import type { PrismaClient } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import {
  COMMENCEMENT_PACKAGES,
  seedPackages,
} from "@/infrastructure/prisma/seeders/packages.seeder";
import { STUDIO_ROOMS, seedStudios } from "@/infrastructure/prisma/seeders/studios.seeder";

describe("Database Seeders (Idempotent & Realistic Synthetic Data)", () => {
  describe("Packages & Addons Seeder", () => {
    it("defines correct master catalog pricing, edit quotas, and add-ons", () => {
      expect(COMMENCEMENT_PACKAGES).toHaveLength(4);

      const pkg1 = COMMENCEMENT_PACKAGES.find((p) => p.slug === "single-package-1");
      expect(pkg1).toBeDefined();
      expect(pkg1?.basePrice).toBe(450000);
      expect(pkg1?.editQuota).toBe(25);
      expect(pkg1?.durationMinutes).toBe(60);
      expect(pkg1?.downPaymentPercent).toBe(50);
      expect(pkg1?.addons).toEqual([]);

      const pkg2 = COMMENCEMENT_PACKAGES.find((p) => p.slug === "single-package-2");
      expect(pkg2).toBeDefined();
      expect(pkg2?.basePrice).toBe(550000);
      expect(pkg2?.editQuota).toBe(35);
      expect(pkg2?.durationMinutes).toBe(90);
      expect(pkg2?.downPaymentPercent).toBe(50);

      const pkg3 = COMMENCEMENT_PACKAGES.find((p) => p.slug === "group-package-1");
      expect(pkg3).toBeDefined();
      expect(pkg3?.basePrice).toBe(750000);
      expect(pkg3?.editQuota).toBe(40);
      expect(pkg3?.durationMinutes).toBe(60);
      expect(pkg3?.downPaymentPercent).toBe(50);

      const pkg4 = COMMENCEMENT_PACKAGES.find((p) => p.slug === "group-package-2");
      expect(pkg4).toBeDefined();
      expect(pkg4?.basePrice).toBe(950000);
      expect(pkg4?.editQuota).toBe(60);
      expect(pkg4?.durationMinutes).toBe(120);
      expect(pkg4?.downPaymentPercent).toBe(50);
    });

    it("seeds packages idempotently using upsert", async () => {
      const mockUpsert = vi.fn().mockImplementation(({ create }) => ({
        id: `mock-pkg-${create.slug}`,
        ...create,
      }));
      const mockFindFirstAddon = vi.fn().mockResolvedValue(null);
      const mockCreateAddon = vi.fn().mockImplementation(({ data }) => ({
        id: `mock-addon-${data.name}`,
        ...data,
      }));
      const mockUpdateAddon = vi.fn().mockImplementation(({ data }) => data);

      const mockPrisma = {
        package: {
          upsert: mockUpsert,
        },
        packageAddon: {
          findFirst: mockFindFirstAddon,
          create: mockCreateAddon,
          update: mockUpdateAddon,
        },
      } as unknown as PrismaClient;

      const result = await seedPackages(mockPrisma);

      expect(result).toHaveLength(4);
      expect(mockUpsert).toHaveBeenCalledTimes(4);
    });

    it("handles packages without add-ons cleanly during seed run", async () => {
      const mockUpsert = vi.fn().mockResolvedValue({ id: "pkg-id", slug: "single-package-1" });
      const mockFindFirstAddon = vi.fn();
      const mockCreateAddon = vi.fn();
      const mockUpdateAddon = vi.fn();

      const mockPrisma = {
        package: {
          upsert: mockUpsert,
        },
        packageAddon: {
          findFirst: mockFindFirstAddon,
          create: mockCreateAddon,
          update: mockUpdateAddon,
        },
      } as unknown as PrismaClient;

      await seedPackages(mockPrisma);

      expect(mockCreateAddon).not.toHaveBeenCalled();
      expect(mockUpdateAddon).not.toHaveBeenCalled();
    });
  });

  describe("Studios Seeder", () => {
    it("defines the standard 3 graduation studio rooms", () => {
      expect(STUDIO_ROOMS).toHaveLength(3);
      const names = STUDIO_ROOMS.map((r) => r.name);
      expect(names).toContain("Studio Room A");
      expect(names).toContain("Studio Room B");
      expect(names).toContain("Campus Grounds");
    });

    it("seeds studio rooms idempotently by checking existing records", async () => {
      const mockFindFirst = vi.fn().mockResolvedValue(null);
      const mockCreate = vi.fn().mockImplementation(({ data }) => ({
        id: `mock-room-${data.name}`,
        ...data,
      }));
      const mockUpdate = vi.fn();

      const mockPrisma = {
        studioRoom: {
          findFirst: mockFindFirst,
          create: mockCreate,
          update: mockUpdate,
        },
      } as unknown as PrismaClient;

      const result = await seedStudios(mockPrisma);

      expect(result).toHaveLength(3);
      expect(mockFindFirst).toHaveBeenCalledTimes(3);
      expect(mockCreate).toHaveBeenCalledTimes(3);
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("updates existing studio rooms on re-seeding without duplicate creation", async () => {
      const existingRoom = {
        id: "existing-room-id",
        name: "Studio Room A",
        description: "Outdated description",
        capacity: 2,
        isActive: true,
      };

      const mockFindFirst = vi.fn().mockResolvedValue(existingRoom);
      const mockCreate = vi.fn();
      const mockUpdate = vi.fn().mockImplementation(({ data }) => ({ ...existingRoom, ...data }));

      const mockPrisma = {
        studioRoom: {
          findFirst: mockFindFirst,
          create: mockCreate,
          update: mockUpdate,
        },
      } as unknown as PrismaClient;

      const result = await seedStudios(mockPrisma);

      expect(result).toHaveLength(3);
      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledTimes(3);
    });
  });

  describe("Synthetic Data Hygiene", () => {
    it("contains no real personal customer data or phone numbers", () => {
      const allText = JSON.stringify({ COMMENCEMENT_PACKAGES, STUDIO_ROOMS });
      // Verify no real phone numbers or emails
      expect(allText).not.toMatch(/\+628\d{8,11}/);
      expect(allText).not.toMatch(/08\d{8,11}/);
      expect(allText).not.toMatch(/[a-zA-Z0-9._%+-]+@(?!example\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    });
  });
});

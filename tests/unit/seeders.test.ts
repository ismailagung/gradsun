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
      expect(COMMENCEMENT_PACKAGES).toHaveLength(3);

      const solo = COMMENCEMENT_PACKAGES.find((p) => p.slug === "solo-commencement");
      expect(solo).toBeDefined();
      expect(solo?.basePrice).toBe(1500000);
      expect(solo?.editQuota).toBe(5);
      expect(solo?.durationMinutes).toBe(45);
      expect(solo?.addons).toEqual([]);

      const besties = COMMENCEMENT_PACKAGES.find((p) => p.slug === "besties-and-duo");
      expect(besties).toBeDefined();
      expect(besties?.basePrice).toBe(1950000);
      expect(besties?.editQuota).toBe(10);
      expect(besties?.durationMinutes).toBe(60);

      const cohort = COMMENCEMENT_PACKAGES.find((p) => p.slug === "sunset-cohort");
      expect(cohort).toBeDefined();
      expect(cohort?.basePrice).toBe(2850000);
      expect(cohort?.editQuota).toBe(20);
      expect(cohort?.durationMinutes).toBe(90);
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

      expect(result).toHaveLength(3);
      expect(mockUpsert).toHaveBeenCalledTimes(3);
    });

    it("handles packages without add-ons cleanly during seed run", async () => {
      const mockUpsert = vi.fn().mockResolvedValue({ id: "pkg-id", slug: "solo-commencement" });
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

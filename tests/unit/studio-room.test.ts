import type { BlackoutDate, StudioRoom } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import type { IBlackoutDateRepository } from "@/modules/schedules/repositories/blackout-date.repository";
import type { IStudioRoomRepository } from "@/modules/schedules/repositories/studio-room.repository";
import type { CreateBlackoutDateInput } from "@/modules/schedules/schemas/blackout-date.schema";
import { CreateBlackoutDateUseCase } from "@/modules/schedules/use-cases/create-blackout-date.use-case";
import { GetStudioRoomsUseCase } from "@/modules/schedules/use-cases/get-studio-rooms.use-case";

describe("Schedules & Studios Domain Use Cases", () => {
  const mockStudioRoom: StudioRoom = {
    id: "room-uuid-1",
    name: "Studio Room A (Fine-Art)",
    description: "Equipped with vintage props and studio lighting.",
    capacity: 6,
    isActive: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
  };

  const mockBlackoutDate: BlackoutDate = {
    id: "blackout-uuid-1",
    studioRoomId: "room-uuid-1",
    startDate: new Date("2025-06-01T00:00:00Z"),
    endDate: new Date("2025-06-02T23:59:59Z"),
    reason: "Scheduled studio renovation and lighting maintenance.",
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
  };

  const createMockStudioRoomRepository = (
    overrides: Partial<IStudioRoomRepository> = {},
  ): IStudioRoomRepository => ({
    findActiveRooms: vi.fn().mockResolvedValue([mockStudioRoom]),
    findAll: vi.fn().mockResolvedValue([mockStudioRoom]),
    findById: vi.fn().mockResolvedValue(mockStudioRoom),
    create: vi.fn().mockResolvedValue(mockStudioRoom),
    ...overrides,
  });

  const createMockBlackoutDateRepository = (
    overrides: Partial<IBlackoutDateRepository> = {},
  ): IBlackoutDateRepository => ({
    create: vi.fn().mockResolvedValue(mockBlackoutDate),
    findOverlapping: vi.fn().mockResolvedValue([]),
    findByRoomId: vi.fn().mockResolvedValue([mockBlackoutDate]),
    ...overrides,
  });

  describe("GetStudioRoomsUseCase", () => {
    it("returns active studio rooms with capacity and details", async () => {
      const repository = createMockStudioRoomRepository();
      const useCase = new GetStudioRoomsUseCase(repository);

      const result = await useCase.execute();

      expect(result).toEqual([mockStudioRoom]);
      expect(repository.findActiveRooms).toHaveBeenCalledTimes(1);
    });

    it("returns empty array when no studio rooms are active", async () => {
      const repository = createMockStudioRoomRepository({
        findActiveRooms: vi.fn().mockResolvedValue([]),
      });
      const useCase = new GetStudioRoomsUseCase(repository);

      const result = await useCase.execute();

      expect(result).toEqual([]);
    });
  });

  describe("CreateBlackoutDateUseCase", () => {
    const validInput: CreateBlackoutDateInput = {
      studioRoomId: "room-uuid-1",
      startDate: new Date("2025-06-01T00:00:00Z"),
      endDate: new Date("2025-06-02T23:59:59Z"),
      reason: "Scheduled studio renovation and lighting maintenance.",
    };

    it("successfully creates a blackout date with valid room and date range", async () => {
      const repository = createMockBlackoutDateRepository();
      const useCase = new CreateBlackoutDateUseCase(repository);

      const result = await useCase.execute(validInput);

      expect(result).toEqual(mockBlackoutDate);
      expect(repository.create).toHaveBeenCalledWith({
        reason: validInput.reason,
        startDate: validInput.startDate,
        endDate: validInput.endDate,
        studioRoom: {
          connect: { id: "room-uuid-1" },
        },
      });
    });

    it("supports studio-wide blackout date without room id", async () => {
      const studioWideInput: CreateBlackoutDateInput = {
        studioRoomId: null,
        startDate: new Date("2025-12-25T00:00:00Z"),
        endDate: new Date("2025-12-25T23:59:59Z"),
        reason: "Studio closed for public holiday.",
      };

      const studioWideBlackout: BlackoutDate = {
        ...mockBlackoutDate,
        studioRoomId: null,
        reason: "Studio closed for public holiday.",
      };

      const repository = createMockBlackoutDateRepository({
        create: vi.fn().mockResolvedValue(studioWideBlackout),
      });
      const useCase = new CreateBlackoutDateUseCase(repository);

      const result = await useCase.execute(studioWideInput);

      expect(result.studioRoomId).toBeNull();
      expect(repository.create).toHaveBeenCalledWith({
        reason: studioWideInput.reason,
        startDate: studioWideInput.startDate,
        endDate: studioWideInput.endDate,
        studioRoom: undefined,
      });
    });

    it("rejects blackout date creation when endDate is before startDate", async () => {
      const repository = createMockBlackoutDateRepository();
      const useCase = new CreateBlackoutDateUseCase(repository);

      const invalidInput: CreateBlackoutDateInput = {
        studioRoomId: "room-uuid-1",
        startDate: new Date("2025-06-10T00:00:00Z"),
        endDate: new Date("2025-06-05T00:00:00Z"),
        reason: "Invalid date range.",
      };

      await expect(useCase.execute(invalidInput)).rejects.toThrow(
        "End date cannot be earlier than start date",
      );
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("rejects blackout date creation when reason is empty", async () => {
      const repository = createMockBlackoutDateRepository();
      const useCase = new CreateBlackoutDateUseCase(repository);

      const emptyReasonInput: CreateBlackoutDateInput = {
        ...validInput,
        reason: "   ",
      };

      await expect(useCase.execute(emptyReasonInput)).rejects.toThrow(
        "Reason is required for blackout dates",
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });
});

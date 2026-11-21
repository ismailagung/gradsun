import type { BlackoutDate } from "@prisma/client";
import type { IBlackoutDateRepository } from "../repositories/blackout-date.repository";
import type { CreateBlackoutDateInput } from "../schemas/blackout-date.schema";

export class CreateBlackoutDateUseCase {
  constructor(private readonly repository: IBlackoutDateRepository) {}

  async execute(input: CreateBlackoutDateInput): Promise<BlackoutDate> {
    if (new Date(input.endDate) < new Date(input.startDate)) {
      throw new Error("End date cannot be earlier than start date");
    }

    if (!input.reason || input.reason.trim().length === 0) {
      throw new Error("Reason is required for blackout dates");
    }

    return this.repository.create({
      reason: input.reason.trim(),
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      studioRoom: input.studioRoomId
        ? {
            connect: { id: input.studioRoomId },
          }
        : undefined,
    });
  }
}

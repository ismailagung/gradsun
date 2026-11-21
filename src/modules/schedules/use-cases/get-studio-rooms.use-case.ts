import type { StudioRoom } from "@prisma/client";
import type { IStudioRoomRepository } from "../repositories/studio-room.repository";

export class GetStudioRoomsUseCase {
  constructor(private readonly repository: IStudioRoomRepository) {}

  async execute(): Promise<StudioRoom[]> {
    return this.repository.findActiveRooms();
  }
}

"use server";

import { createSafeActionClient } from "next-safe-action";
import { StudioRoomRepository } from "../repositories/studio-room.repository";
import { GetStudioRoomsUseCase } from "../use-cases/get-studio-rooms.use-case";

const actionClient = createSafeActionClient();

export const getStudioRoomsAction = actionClient.action(async () => {
  const repository = new StudioRoomRepository();
  const useCase = new GetStudioRoomsUseCase(repository);
  return await useCase.execute();
});

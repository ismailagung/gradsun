"use server";

import { createSafeActionClient } from "next-safe-action";
import { GalleryRepository } from "@/modules/galleries/repositories/gallery.repository";
import { ReservationRepository } from "@/modules/reservations/repositories/reservation.repository";
import {
  GetDailyCallsheetUseCase,
  getDailyCallsheetSchema,
} from "../use-cases/get-daily-callsheet.use-case";

const actionClient = createSafeActionClient();

export const getDailyCallsheetAction = actionClient
  .schema(getDailyCallsheetSchema)
  .action(async ({ parsedInput }) => {
    const reservationRepo = new ReservationRepository();
    const galleryRepo = new GalleryRepository();
    const useCase = new GetDailyCallsheetUseCase(reservationRepo, galleryRepo);
    return await useCase.execute(parsedInput);
  });

import type { Gallery, Photo, PhotoSelection } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma/client";

export interface GalleryWithDetails extends Gallery {
  reservation: {
    id: string;
    code: string;
    clientName: string;
    clientPhone: string;
    status: string;
  };
  photos: Photo[];
  selections: PhotoSelection[];
}

export interface CreateGalleryData {
  reservationId: string;
  watermarkConfig?: string;
  status?: string;
}

export interface AddPhotoData {
  originalKey: string;
  previewKey: string;
  thumbnailKey: string;
  dimensions?: string;
  sequenceNumber: number;
}

export interface IGalleryRepository {
  findById(id: string): Promise<GalleryWithDetails | null>;
  findByReservationId(reservationId: string): Promise<GalleryWithDetails | null>;
  findByBookingCode(bookingCode: string): Promise<GalleryWithDetails | null>;
  findAll(filter?: { status?: string; search?: string }): Promise<GalleryWithDetails[]>;
  createGallery(data: CreateGalleryData): Promise<GalleryWithDetails>;
  addPhotos(galleryId: string, photos: AddPhotoData[]): Promise<number>;
  updateStatus(galleryId: string, status: string): Promise<GalleryWithDetails>;
  saveSelections(
    galleryId: string,
    selections: Array<{ photoId: string; notes?: string }>,
  ): Promise<number>;
}

export class GalleryRepository implements IGalleryRepository {
  async findById(id: string): Promise<GalleryWithDetails | null> {
    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: {
        reservation: {
          select: {
            id: true,
            code: true,
            clientName: true,
            clientPhone: true,
            status: true,
          },
        },
        photos: {
          orderBy: { sequenceNumber: "asc" },
        },
        selections: true,
      },
    });

    return gallery as GalleryWithDetails | null;
  }

  async findByReservationId(reservationId: string): Promise<GalleryWithDetails | null> {
    const gallery = await prisma.gallery.findUnique({
      where: { reservationId },
      include: {
        reservation: {
          select: {
            id: true,
            code: true,
            clientName: true,
            clientPhone: true,
            status: true,
          },
        },
        photos: {
          orderBy: { sequenceNumber: "asc" },
        },
        selections: true,
      },
    });

    return gallery as GalleryWithDetails | null;
  }

  async findByBookingCode(bookingCode: string): Promise<GalleryWithDetails | null> {
    const reservation = await prisma.reservation.findUnique({
      where: { code: bookingCode },
      select: { id: true },
    });

    if (!reservation) {
      return null;
    }

    return this.findByReservationId(reservation.id);
  }

  async findAll(filter?: { status?: string; search?: string }): Promise<GalleryWithDetails[]> {
    const where: Record<string, unknown> = {};

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.search) {
      where.reservation = {
        OR: [
          { code: { contains: filter.search, mode: "insensitive" } },
          { clientName: { contains: filter.search, mode: "insensitive" } },
        ],
      };
    }

    const galleries = await prisma.gallery.findMany({
      where,
      include: {
        reservation: {
          select: {
            id: true,
            code: true,
            clientName: true,
            clientPhone: true,
            status: true,
          },
        },
        photos: {
          orderBy: { sequenceNumber: "asc" },
        },
        selections: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return galleries as GalleryWithDetails[];
  }

  async createGallery(data: CreateGalleryData): Promise<GalleryWithDetails> {
    const gallery = await prisma.gallery.create({
      data: {
        reservationId: data.reservationId,
        watermarkConfig: data.watermarkConfig ?? "diagonal-fine-art",
        status: data.status ?? "UPLOADING",
      },
      include: {
        reservation: {
          select: {
            id: true,
            code: true,
            clientName: true,
            clientPhone: true,
            status: true,
          },
        },
        photos: true,
        selections: true,
      },
    });

    return gallery as GalleryWithDetails;
  }

  async addPhotos(galleryId: string, photos: AddPhotoData[]): Promise<number> {
    const records = photos.map((photo) => ({
      galleryId,
      originalKey: photo.originalKey,
      previewKey: photo.previewKey,
      thumbnailKey: photo.thumbnailKey,
      dimensions: photo.dimensions ?? null,
      sequenceNumber: photo.sequenceNumber,
    }));

    const result = await prisma.photo.createMany({
      data: records,
    });

    return result.count;
  }

  async updateStatus(galleryId: string, status: string): Promise<GalleryWithDetails> {
    const gallery = await prisma.gallery.update({
      where: { id: galleryId },
      data: { status },
      include: {
        reservation: {
          select: {
            id: true,
            code: true,
            clientName: true,
            clientPhone: true,
            status: true,
          },
        },
        photos: {
          orderBy: { sequenceNumber: "asc" },
        },
        selections: true,
      },
    });

    return gallery as GalleryWithDetails;
  }

  async saveSelections(
    galleryId: string,
    selections: Array<{ photoId: string; notes?: string }>,
  ): Promise<number> {
    await prisma.photoSelection.deleteMany({
      where: { galleryId },
    });

    if (selections.length === 0) {
      return 0;
    }

    const result = await prisma.photoSelection.createMany({
      data: selections.map((s) => ({
        galleryId,
        photoId: s.photoId,
        notes: s.notes ?? null,
        retouchingStatus: "PENDING",
      })),
    });

    return result.count;
  }
}

import type { PrismaClient } from "@prisma/client";

export interface SeedStudioRoomData {
  name: string;
  description: string;
  capacity: number;
  isActive: boolean;
}

export const STUDIO_ROOMS: SeedStudioRoomData[] = [
  {
    name: "Studio Room A",
    description:
      "Classic fine-art studio equipped with vintage backdrop textures and portrait softboxes.",
    capacity: 4,
    isActive: true,
  },
  {
    name: "Studio Room B",
    description:
      "Contemporary minimalist studio with seamless white cyclorama and dynamic lighting rigs.",
    capacity: 6,
    isActive: true,
  },
  {
    name: "Campus Grounds",
    description:
      "Natural outdoor university campus setting capturing architecture landmarks and golden hour lighting.",
    capacity: 12,
    isActive: true,
  },
];

export async function seedStudios(prisma: PrismaClient) {
  const seededRooms = [];

  for (const roomData of STUDIO_ROOMS) {
    const existingRoom = await prisma.studioRoom.findFirst({
      where: { name: roomData.name },
    });

    if (existingRoom) {
      const updated = await prisma.studioRoom.update({
        where: { id: existingRoom.id },
        data: {
          description: roomData.description,
          capacity: roomData.capacity,
          isActive: roomData.isActive,
        },
      });
      seededRooms.push(updated);
    } else {
      const created = await prisma.studioRoom.create({
        data: {
          name: roomData.name,
          description: roomData.description,
          capacity: roomData.capacity,
          isActive: roomData.isActive,
        },
      });
      seededRooms.push(created);
    }
  }

  return seededRooms;
}

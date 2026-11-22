import { prisma } from "./client";
import { seedPackages } from "./seeders/packages.seeder";
import { seedStudios } from "./seeders/studios.seeder";

async function main() {
  console.log("Seeding commencement packages and add-ons...");
  const packages = await seedPackages(prisma);
  console.log(`Seeded ${packages.length} packages successfully.`);

  console.log("Seeding studio rooms...");
  const rooms = await seedStudios(prisma);
  console.log(`Seeded ${rooms.length} studio rooms successfully.`);

  console.log("Database seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

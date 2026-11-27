import { AdminPackagesManager } from "@/modules/packages/components/admin-packages-manager";
import { PackageRepository } from "@/modules/packages/repositories/package.repository";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const repository = new PackageRepository();
  const packages = await repository.findAll();

  return <AdminPackagesManager initialPackages={packages} />;
}

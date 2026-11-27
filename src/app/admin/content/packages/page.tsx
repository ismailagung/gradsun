import { CmsPackagesEditor } from "@/modules/content/components/cms-packages-editor";
import { ContentRepository } from "@/modules/content/repositories/content.repository";
import { GetContentSettingsUseCase } from "@/modules/content/use-cases/get-content-settings.use-case";
import { PackageRepository } from "@/modules/packages/repositories/package.repository";

export const dynamic = "force-dynamic";

export default async function AdminContentPackagesPage() {
  const contentRepository = new ContentRepository();
  const getContentUseCase = new GetContentSettingsUseCase(contentRepository);
  const content = await getContentUseCase.execute();

  const packageRepository = new PackageRepository();
  const packages = await packageRepository.findAll();

  return <CmsPackagesEditor initialContent={content.packages} availablePackages={packages} />;
}

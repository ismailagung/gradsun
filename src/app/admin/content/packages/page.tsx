import { CmsPackagesEditor } from "@/modules/content/components/cms-packages-editor";
import { ContentRepository } from "@/modules/content/repositories/content.repository";
import { GetContentSettingsUseCase } from "@/modules/content/use-cases/get-content-settings.use-case";

export default async function AdminContentPackagesPage() {
  const repository = new ContentRepository();
  const useCase = new GetContentSettingsUseCase(repository);
  const content = await useCase.execute();

  return <CmsPackagesEditor initialContent={content.packages} />;
}

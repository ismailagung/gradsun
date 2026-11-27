import { CmsHomeEditor } from "@/modules/content/components/cms-home-editor";
import { ContentRepository } from "@/modules/content/repositories/content.repository";
import { GetContentSettingsUseCase } from "@/modules/content/use-cases/get-content-settings.use-case";

export const dynamic = "force-dynamic";

export default async function AdminContentHomePage() {
  const repository = new ContentRepository();
  const useCase = new GetContentSettingsUseCase(repository);
  const content = await useCase.execute();

  return <CmsHomeEditor initialContent={content.home} />;
}

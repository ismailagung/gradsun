import { CmsEditorView } from "@/modules/content/components/cms-editor-view";
import { ContentRepository } from "@/modules/content/repositories/content.repository";
import { GetContentSettingsUseCase } from "@/modules/content/use-cases/get-content-settings.use-case";

export default async function AdminContentShowcasePage() {
  const repository = new ContentRepository();
  const useCase = new GetContentSettingsUseCase(repository);
  const content = await useCase.execute();

  return <CmsEditorView initialContent={content} defaultTab="showcase" />;
}

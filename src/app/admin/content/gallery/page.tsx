import { CmsGalleryEditor } from "@/modules/content/components/cms-gallery-editor";
import { ContentRepository } from "@/modules/content/repositories/content.repository";
import { GetContentSettingsUseCase } from "@/modules/content/use-cases/get-content-settings.use-case";

export const dynamic = "force-dynamic";

export default async function AdminContentGalleryPage() {
  const repository = new ContentRepository();
  const useCase = new GetContentSettingsUseCase(repository);
  const content = await useCase.execute();

  return <CmsGalleryEditor initialContent={content.gallery} />;
}

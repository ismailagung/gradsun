import { CmsTrackEditor } from "@/modules/content/components/cms-track-editor";
import { ContentRepository } from "@/modules/content/repositories/content.repository";
import { GetContentSettingsUseCase } from "@/modules/content/use-cases/get-content-settings.use-case";

export default async function AdminContentTrackOrderPage() {
  const repository = new ContentRepository();
  const useCase = new GetContentSettingsUseCase(repository);
  const content = await useCase.execute();

  return <CmsTrackEditor initialContent={content.trackOrder} />;
}

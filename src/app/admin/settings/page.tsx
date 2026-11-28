import { GeneralSettingsManager } from "@/modules/settings/components/general-settings-manager";
import { GeneralSettingsRepository } from "@/modules/settings/repositories/general-settings.repository";
import { GetGeneralSettingsUseCase } from "@/modules/settings/use-cases/get-general-settings.use-case";

export default async function AdminGeneralSettingsPage() {
  const repository = new GeneralSettingsRepository();
  const useCase = new GetGeneralSettingsUseCase(repository);
  const settings = await useCase.execute();

  return <GeneralSettingsManager initialSettings={settings} />;
}

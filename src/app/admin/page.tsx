import { AdminDashboardView } from "@/modules/reservations/components/admin-dashboard-view";
import { ReservationRepository } from "@/modules/reservations/repositories/reservation.repository";
import { GetAdminDashboardUseCase } from "@/modules/reservations/use-cases/get-admin-dashboard.use-case";

export default async function AdminDashboardPage() {
  const reservationRepo = new ReservationRepository();
  const useCase = new GetAdminDashboardUseCase(reservationRepo);
  const data = await useCase.execute();

  return <AdminDashboardView initialData={data} />;
}

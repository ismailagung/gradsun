import { getTranslations } from "next-intl/server";
import { Badge } from "@/common/components/ui/badge";
import { GalleryRepository } from "@/modules/galleries/repositories/gallery.repository";
import {
  OrderTrackerView,
  type TrackedOrder,
} from "@/modules/reservations/components/order-tracker-view";

interface TrackOrderPageProps {
  searchParams?: Promise<{ ref?: string }>;
}

export default async function TrackOrderPage(props: TrackOrderPageProps) {
  const searchParams = await props.searchParams;
  const bookingCode = searchParams?.ref ?? "GS-2025-0517";

  const tTrack = await getTranslations("trackOrderPage");

  const galleryRepo = new GalleryRepository();
  const gallery = await galleryRepo.findByBookingCode(bookingCode);

  let serverOrder: TrackedOrder | null = null;
  if (gallery?.reservation) {
    serverOrder = {
      bookingCode: gallery.reservation.code,
      clientName: gallery.reservation.clientName,
      clientPhone: gallery.reservation.clientPhone,
      clientEmail: "client@example.com",
      instagramHandle: "@gradsun.studio",
      packageName: "Gradsun Graduation Package",
      packagePrice: 450000,
      sessionDate: "17 Mei 2025",
      sessionTime: "16:30 WIB",
      durationMinutes: 90,
      location: "Balairung, Depok",
      notes: "",
      status:
        gallery.status === "SELECTING"
          ? "SELECTING"
          : gallery.status === "DELIVERED"
            ? "DELIVERED"
            : "SCHEDULED",
      paymentStatus: "FULLY_PAID",
      dpAmount: 225000,
      balanceAmount: 225000,
      createdAt: "17 Mei 2025, 09:30 WIB",
      currentStepIndex: gallery.status === "DELIVERED" ? 5 : gallery.status === "SELECTING" ? 4 : 3,
      shippingAwb: gallery.paxelTrackingNumber ?? undefined,
      galleryId: gallery.id,
      photos:
        gallery.photos.length > 0
          ? gallery.photos.map((p) => ({
              id: p.id,
              previewKey: p.previewKey,
              thumbnailKey: p.thumbnailKey,
              dimensions: p.dimensions,
              sequenceNumber: p.sequenceNumber,
            }))
          : undefined,
      initialSelections: gallery.selections.map((s) => s.photoId),
    };
  }

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Main Track Order Flow */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-10">
        {/* Page Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <Badge
            variant="secondary"
            className="gap-2 px-3.5 py-1 text-xs font-normal border border-border"
          >
            <span>{tTrack("headerBadge")}</span>
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
            {tTrack("headerTitle")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            {tTrack("headerSubtitle")}
          </p>
        </div>

        {/* Order Tracker View (Interactive) */}
        <OrderTrackerView initialCode={bookingCode} serverOrder={serverOrder} />
      </main>
    </div>
  );
}

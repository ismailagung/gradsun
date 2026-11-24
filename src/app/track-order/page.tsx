import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
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

  const tNav = await getTranslations("nav");
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
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative size-9 overflow-hidden rounded-full border border-border bg-card p-0.5 shadow-xs">
              <Image
                src="/gradsun-no-bg.png"
                alt={tNav("logoAlt")}
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg leading-none font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {tNav("brand")}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground mt-0.5">
                {tNav("tagline")}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-secondary/50 p-1">
            <Button variant="ghost" size="default" asChild className="rounded-full px-4 text-xs">
              <Link href="/">{tNav("home")}</Link>
            </Button>
            <Button variant="ghost" size="default" asChild className="rounded-full px-4 text-xs">
              <Link href="/gallery">{tNav("portfolio")}</Link>
            </Button>
            <Button variant="ghost" size="default" asChild className="rounded-full px-4 text-xs">
              <Link href="/packages">{tNav("packages")}</Link>
            </Button>
            <Button
              variant="ghost"
              size="default"
              asChild
              className="rounded-full px-4 text-xs text-primary font-medium"
            >
              <Link href="/track-order">{tNav("trackOrder")}</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button size="default" asChild className="rounded-full shadow-xs">
              <Link href="/packages">{tNav("bookSession")}</Link>
            </Button>
          </div>
        </div>
      </header>

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

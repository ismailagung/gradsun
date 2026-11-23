import { ArrowRight, Check, Clock, Package, Search, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { ProofingGrid, type ProofingPhoto } from "@/modules/galleries/components/proofing-grid";
import { GalleryRepository } from "@/modules/galleries/repositories/gallery.repository";

interface TrackOrderPageProps {
  searchParams?: Promise<{ ref?: string }>;
}

const DEFAULT_SAMPLE_PHOTOS: ProofingPhoto[] = [
  {
    id: "sample-photo-1",
    previewKey: "galleries/demo/previews/1.webp",
    thumbnailKey: "galleries/demo/thumbnails/1.webp",
    dimensions: "1200x800",
    sequenceNumber: 1,
  },
  {
    id: "sample-photo-2",
    previewKey: "galleries/demo/previews/2.webp",
    thumbnailKey: "galleries/demo/thumbnails/2.webp",
    dimensions: "1200x800",
    sequenceNumber: 2,
  },
  {
    id: "sample-photo-3",
    previewKey: "galleries/demo/previews/3.webp",
    thumbnailKey: "galleries/demo/thumbnails/3.webp",
    dimensions: "1200x800",
    sequenceNumber: 3,
  },
  {
    id: "sample-photo-4",
    previewKey: "galleries/demo/previews/4.webp",
    thumbnailKey: "galleries/demo/thumbnails/4.webp",
    dimensions: "1200x800",
    sequenceNumber: 4,
  },
];

export default async function TrackOrderPage(props: TrackOrderPageProps) {
  const searchParams = await props.searchParams;
  const bookingCode = searchParams?.ref ?? "GS-2025-0842";

  const tNav = await getTranslations("nav");
  const tTrack = await getTranslations("trackOrderPage");

  const galleryRepo = new GalleryRepository();
  const gallery = await galleryRepo.findByBookingCode(bookingCode);

  const galleryId = gallery?.id ?? "demo-gallery-id";
  const galleryStatus = gallery?.status ?? "SELECTING";
  const clientName = gallery?.reservation?.clientName
    ? `${gallery.reservation.clientName} (${bookingCode})`
    : tTrack("orderClientName");

  const photos: ProofingPhoto[] =
    gallery && gallery.photos.length > 0
      ? gallery.photos.map((p) => ({
          id: p.id,
          previewKey: p.previewKey,
          thumbnailKey: p.thumbnailKey,
          dimensions: p.dimensions,
          sequenceNumber: p.sequenceNumber,
        }))
      : DEFAULT_SAMPLE_PHOTOS;

  const initialSelections = gallery?.selections.map((s) => s.photoId) ?? [];
  const trackingNumber = gallery?.paxelTrackingNumber ?? "PXL-GRADSUN-992104";

  const isStep2Completed = true;
  const isStep3Active = galleryStatus === "SELECTING";
  const isStep3Completed = galleryStatus === "APPROVED" || galleryStatus === "DELIVERED";
  const isStep4Active = galleryStatus === "APPROVED";
  const isStep4Completed = galleryStatus === "DELIVERED";
  const isStep5Active = galleryStatus === "DELIVERED";

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
              <Link href="/portfolio">{tNav("portfolio")}</Link>
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
            <Button
              variant="ghost"
              size="default"
              asChild
              className="rounded-full px-4 text-xs text-primary font-medium"
            >
              <Link href="/admin">{tNav("admin")}</Link>
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
            <Package className="size-3.5 text-primary" />
            <span>{tTrack("headerBadge")}</span>
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
            {tTrack("headerTitle")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            {tTrack("headerSubtitle")}
          </p>
        </div>

        {/* Order Search Box Card */}
        <Card className="border-border bg-card p-6 rounded-3xl shadow-sm">
          <CardContent className="p-0 flex flex-col gap-4">
            <label
              htmlFor="orderRefInput"
              className="text-xs font-semibold text-foreground uppercase tracking-wider font-serif"
            >
              {tTrack("searchBoxTitle")}
            </label>
            <form
              action="/track-order"
              method="GET"
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="relative flex-1 w-full">
                <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="orderRefInput"
                  name="ref"
                  placeholder={tTrack("searchBoxPlaceholder")}
                  defaultValue={bookingCode}
                  className="pl-9 font-mono"
                />
              </div>
              <Button
                type="submit"
                size="default"
                className="w-full sm:w-auto px-6 rounded-lg gap-2 shadow-xs"
              >
                <span>{tTrack("searchCta")}</span>
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Order Progress Timeline */}
        <Card className="border-border bg-card p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs font-mono">
                  {bookingCode}
                </Badge>
                <span className="size-2 rounded-full bg-primary animate-pulse" />
              </div>
              <span className="text-sm font-semibold text-foreground font-serif mt-1">
                {clientName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-xl border border-border">
              <Truck className="size-4 text-primary" />
              <span>{trackingNumber}</span>
            </div>
          </div>

          {/* 5-Stage Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {/* Stage 1: Completed */}
            <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-secondary/40 border border-border">
              <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                <Check className="size-4" />
              </div>
              <span className="text-xs font-semibold text-foreground font-serif">
                {tTrack("step1")}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {tTrack("step1Date")}
              </span>
            </div>

            {/* Stage 2: Completed */}
            <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-secondary/40 border border-border">
              <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                {isStep2Completed ? <Check className="size-4" /> : <Clock className="size-4" />}
              </div>
              <span className="text-xs font-semibold text-foreground font-serif">
                {tTrack("step2")}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {tTrack("step2Date")}
              </span>
            </div>

            {/* Stage 3: Client Selection */}
            <div
              className={`flex flex-col items-center text-center gap-2 p-3 rounded-2xl border transition-colors ${
                isStep3Active
                  ? "bg-primary/10 border-primary/40 shadow-xs"
                  : isStep3Completed
                    ? "bg-secondary/40 border-border"
                    : "bg-card border-border/60 opacity-60"
              }`}
            >
              <div
                className={`size-9 rounded-full flex items-center justify-center shadow-xs ${
                  isStep3Active || isStep3Completed
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-secondary text-muted-foreground"
                }`}
              >
                {isStep3Completed ? (
                  <Check className="size-4" />
                ) : isStep3Active ? (
                  <Sparkles className="size-4" />
                ) : (
                  <Clock className="size-4" />
                )}
              </div>
              <span
                className={`text-xs font-serif ${
                  isStep3Active ? "font-bold text-primary" : "font-semibold text-foreground"
                }`}
              >
                {tTrack("step3")}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  isStep3Active ? "font-semibold text-primary" : "text-muted-foreground"
                }`}
              >
                {tTrack("step3Date")}
              </span>
            </div>

            {/* Stage 4: Darkroom Retouching */}
            <div
              className={`flex flex-col items-center text-center gap-2 p-3 rounded-2xl border transition-colors ${
                isStep4Active
                  ? "bg-primary/10 border-primary/40 shadow-xs"
                  : isStep4Completed
                    ? "bg-secondary/40 border-border"
                    : "bg-card border-border/60 opacity-60"
              }`}
            >
              <div
                className={`size-9 rounded-full flex items-center justify-center ${
                  isStep4Active || isStep4Completed
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-secondary text-muted-foreground"
                }`}
              >
                {isStep4Completed ? (
                  <Check className="size-4" />
                ) : isStep4Active ? (
                  <Sparkles className="size-4" />
                ) : (
                  <Clock className="size-4" />
                )}
              </div>
              <span
                className={`text-xs font-serif ${
                  isStep4Active ? "font-bold text-primary" : "font-medium text-foreground"
                }`}
              >
                {tTrack("step4")}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  isStep4Active ? "font-semibold text-primary" : "text-muted-foreground"
                }`}
              >
                {tTrack("step4Date")}
              </span>
            </div>

            {/* Stage 5: Folio Dispatched */}
            <div
              className={`flex flex-col items-center text-center gap-2 p-3 rounded-2xl border transition-colors ${
                isStep5Active
                  ? "bg-primary/10 border-primary/40 shadow-xs"
                  : "bg-card border-border/60 opacity-60"
              }`}
            >
              <div
                className={`size-9 rounded-full flex items-center justify-center ${
                  isStep5Active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-secondary text-muted-foreground"
                }`}
              >
                <Truck className="size-4" />
              </div>
              <span
                className={`text-xs font-serif ${
                  isStep5Active ? "font-bold text-primary" : "font-medium text-foreground"
                }`}
              >
                {tTrack("step5")}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  isStep5Active ? "font-semibold text-primary" : "text-muted-foreground"
                }`}
              >
                {tTrack("step5Date")}
              </span>
            </div>
          </div>

          {/* Interactive Client Proofing Grid */}
          <div className="pt-6 border-t border-border flex flex-col gap-6">
            <ProofingGrid
              galleryId={galleryId}
              bookingCode={bookingCode}
              photos={photos}
              initialSelections={initialSelections}
              galleryStatus={galleryStatus}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}

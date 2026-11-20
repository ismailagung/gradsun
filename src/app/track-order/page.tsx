import { ArrowRight, Check, Clock, Download, Package, Search, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";

export default async function TrackOrderPage() {
  const tNav = await getTranslations("nav");
  const tTrack = await getTranslations("trackOrderPage");
  const tFoot = await getTranslations("footer");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="orderRefInput"
                  placeholder={tTrack("searchBoxPlaceholder")}
                  defaultValue="GS-2025-0842"
                  className="pl-9 font-mono"
                />
              </div>
              <Button size="default" className="w-full sm:w-auto px-6 rounded-lg gap-2 shadow-xs">
                <span>{tTrack("searchCta")}</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Order Progress Timeline */}
        <Card className="border-border bg-card p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs font-mono">
                  {tTrack("activeOrderRef")}
                </Badge>
                <span className="size-2 rounded-full bg-primary animate-pulse" />
              </div>
              <span className="text-sm font-semibold text-foreground font-serif mt-1">
                {tTrack("orderClientName")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-xl border border-border">
              <Truck className="size-4 text-primary" />
              <span>{tTrack("courierTrackingDetail")}</span>
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
                <Check className="size-4" />
              </div>
              <span className="text-xs font-semibold text-foreground font-serif">
                {tTrack("step2")}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {tTrack("step2Date")}
              </span>
            </div>

            {/* Stage 3: Active Stage */}
            <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-primary/10 border border-primary/40 shadow-xs">
              <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                <Sparkles className="size-4" />
              </div>
              <span className="text-xs font-bold text-primary font-serif">{tTrack("step3")}</span>
              <span className="text-[10px] font-semibold text-primary font-mono">
                {tTrack("step3Date")}
              </span>
            </div>

            {/* Stage 4: Pending */}
            <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-card border border-border/60 opacity-60">
              <div className="size-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground">
                <Clock className="size-4" />
              </div>
              <span className="text-xs font-medium text-foreground font-serif">
                {tTrack("step4")}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {tTrack("step4Date")}
              </span>
            </div>

            {/* Stage 5: Pending */}
            <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-card border border-border/60 opacity-60">
              <div className="size-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground">
                <Truck className="size-4" />
              </div>
              <span className="text-xs font-medium text-foreground font-serif">
                {tTrack("step5")}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {tTrack("step5Date")}
              </span>
            </div>
          </div>

          {/* Client Digital Proofing Gallery Preview */}
          <div className="pt-6 border-t border-border flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-serif text-base font-semibold text-foreground">
                  {tTrack("proofSectionTitle")}
                </h3>
                <p className="text-xs text-muted-foreground">{tTrack("proofSectionSubtitle")}</p>
              </div>
              <Button
                size="default"
                variant="outline"
                className="gap-2 border-border text-xs rounded-xl self-start sm:self-auto"
              >
                <Download className="size-3.5" />
                <span>{tTrack("downloadProofCta")}</span>
              </Button>
            </div>

            {/* 4 Watermarked Photo Proof Plates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-muted group">
                <Image
                  src="/logo-bg.jpg"
                  alt={tTrack("proofSectionTitle")}
                  fill
                  className="object-cover"
                />
                {/* Diagonal Watermark Overlay */}
                <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
                  <span className="text-background/80 font-mono text-[10px] uppercase font-bold tracking-widest -rotate-45 select-none">
                    {tTrack("watermarkStamp")}
                  </span>
                </div>
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-muted group">
                <Image
                  src="/logo-bg.jpg"
                  alt={tTrack("proofSectionTitle")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
                  <span className="text-background/80 font-mono text-[10px] uppercase font-bold tracking-widest -rotate-45 select-none">
                    {tTrack("watermarkStamp")}
                  </span>
                </div>
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-muted group">
                <Image
                  src="/logo-bg.jpg"
                  alt={tTrack("proofSectionTitle")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
                  <span className="text-background/80 font-mono text-[10px] uppercase font-bold tracking-widest -rotate-45 select-none">
                    {tTrack("watermarkStamp")}
                  </span>
                </div>
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-muted group">
                <Image
                  src="/logo-bg.jpg"
                  alt={tTrack("proofSectionTitle")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
                  <span className="text-background/80 font-mono text-[10px] uppercase font-bold tracking-widest -rotate-45 select-none">
                    {tTrack("watermarkStamp")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>{tFoot("copyright")}</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              {tNav("home")}
            </Link>
            <Link href="/packages" className="hover:text-foreground transition-colors">
              {tNav("packages")}
            </Link>
            <Link href="/admin" className="hover:text-primary transition-colors font-medium">
              {tNav("admin")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

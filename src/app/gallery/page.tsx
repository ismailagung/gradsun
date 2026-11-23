import { ArrowRight, Camera, Eye, Filter, Sparkles, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";

export default async function GalleryPage() {
  const tNav = await getTranslations("nav");
  const tPort = await getTranslations("portfolioPage");
  const tCat = await getTranslations("categories");

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
            <Button
              variant="ghost"
              size="default"
              asChild
              className="rounded-full px-4 text-xs text-primary font-medium"
            >
              <Link href="/gallery">{tNav("portfolio")}</Link>
            </Button>
            <Button variant="ghost" size="default" asChild className="rounded-full px-4 text-xs">
              <Link href="/packages">{tNav("packages")}</Link>
            </Button>
            <Button variant="ghost" size="default" asChild className="rounded-full px-4 text-xs">
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

      {/* Main Gallery Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
          <div className="flex flex-col gap-2 max-w-2xl">
            <Badge
              variant="secondary"
              className="gap-2 px-3 py-1 text-xs font-normal border border-border self-start"
            >
              <Camera className="size-3.5 text-primary" />
              <span>{tPort("headerBadge")}</span>
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
              {tPort("headerTitle")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {tPort("headerSubtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="default" asChild className="rounded-full shadow-xs">
              <Link href="/packages">
                <Sparkles className="size-3.5" />
                <span>{tNav("bookSession")}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter Navigation Chips */}
        <div className="py-8 flex flex-wrap items-center gap-2">
          <Button variant="default" size="default" className="rounded-full px-4 text-xs shadow-xs">
            <Filter className="size-3" />
            <span>{tPort("filterAll")}</span>
          </Button>
          <Button
            variant="outline"
            size="default"
            className="rounded-full px-4 text-xs border-border"
          >
            <span>{tPort("filterSolo")}</span>
          </Button>
          <Button
            variant="outline"
            size="default"
            className="rounded-full px-4 text-xs border-border"
          >
            <span>{tPort("filterCohort")}</span>
          </Button>
          <Button
            variant="outline"
            size="default"
            className="rounded-full px-4 text-xs border-border"
          >
            <span>{tPort("filterGolden")}</span>
          </Button>
          <Button
            variant="outline"
            size="default"
            className="rounded-full px-4 text-xs border-border"
          >
            <span>{tPort("filterStudio")}</span>
          </Button>
        </div>

        {/* Masonry / Grid Gallery Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Gallery Card 1 */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="group border-border bg-card p-3 rounded-3xl shadow-xs hover:shadow-lg transition-all cursor-pointer">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted mb-3">
                  <Image
                    src="/logo-bg.jpg"
                    alt={tCat("gradImageAlt")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {tPort("cameraMetaStamp")}
                  </div>
                  <div className="absolute top-3 right-3 size-8 rounded-full bg-card/90 backdrop-blur-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="size-4" />
                  </div>
                </div>
                <CardContent className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tCat("gradTitle")}
                    </h3>
                    <Badge variant="secondary" className="text-[10px]">
                      {tCat("gradBadge")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCat("gradDesc")}
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">{tPort("proofModalTitle")}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {tPort("proofModalDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted mt-2">
                <Image
                  src="/logo-bg.jpg"
                  alt={tCat("gradImageAlt")}
                  fill
                  className="object-cover"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Gallery Card 2 */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="group border-border bg-card p-3 rounded-3xl shadow-xs hover:shadow-lg transition-all cursor-pointer">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted mb-3">
                  <Image
                    src="/logo-bg.jpg"
                    alt={tCat("outdoorImageAlt")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {tPort("cameraMetaStamp")}
                  </div>
                  <div className="absolute top-3 right-3 size-8 rounded-full bg-card/90 backdrop-blur-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sun className="size-4 text-primary" />
                  </div>
                </div>
                <CardContent className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tCat("outdoorTitle")}
                    </h3>
                    <Badge variant="secondary" className="text-[10px]">
                      {tCat("outdoorBadge")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCat("outdoorDesc")}
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">{tPort("proofModalTitle")}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {tPort("proofModalDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted mt-2">
                <Image
                  src="/logo-bg.jpg"
                  alt={tCat("outdoorImageAlt")}
                  fill
                  className="object-cover"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Gallery Card 3 */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="group border-border bg-card p-3 rounded-3xl shadow-xs hover:shadow-lg transition-all cursor-pointer">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted mb-3">
                  <Image
                    src="/logo-bg.jpg"
                    alt={tCat("studioImageAlt")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {tPort("cameraMetaStamp")}
                  </div>
                  <div className="absolute top-3 right-3 size-8 rounded-full bg-card/90 backdrop-blur-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="size-4" />
                  </div>
                </div>
                <CardContent className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tCat("studioTitle")}
                    </h3>
                    <Badge variant="secondary" className="text-[10px]">
                      {tCat("studioBadge")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCat("studioDesc")}
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">{tPort("proofModalTitle")}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {tPort("proofModalDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted mt-2">
                <Image
                  src="/logo-bg.jpg"
                  alt={tCat("studioImageAlt")}
                  fill
                  className="object-cover"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Gallery Card 4 */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="group border-border bg-card p-3 rounded-3xl shadow-xs hover:shadow-lg transition-all cursor-pointer">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted mb-3">
                  <Image
                    src="/logo-bg.jpg"
                    alt={tCat("cohortImageAlt")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {tPort("cameraMetaStamp")}
                  </div>
                  <div className="absolute top-3 right-3 size-8 rounded-full bg-card/90 backdrop-blur-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="size-4 text-primary" />
                  </div>
                </div>
                <CardContent className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tCat("cohortTitle")}
                    </h3>
                    <Badge variant="secondary" className="text-[10px]">
                      {tCat("cohortBadge")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCat("cohortDesc")}
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">{tPort("proofModalTitle")}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {tPort("proofModalDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted mt-2">
                <Image
                  src="/logo-bg.jpg"
                  alt={tCat("cohortImageAlt")}
                  fill
                  className="object-cover"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 p-8 rounded-3xl border border-border bg-secondary/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-serif text-xl font-semibold text-foreground">
              {tPort("headerTitle")}
            </h3>
            <p className="text-xs text-muted-foreground">{tPort("headerSubtitle")}</p>
          </div>
          <Button size="lg" asChild className="gap-2 rounded-xl text-sm shrink-0">
            <Link href="/packages">
              <span>{tNav("bookSession")}</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

import { Filter, Sparkles } from "lucide-react";
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
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";
import { ContentRepository } from "@/modules/content/repositories/content.repository";
import { DEFAULT_GALLERY_ITEMS } from "@/modules/content/schemas/content-settings.schema";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const tNav = await getTranslations("nav");
  const tPort = await getTranslations("portfolioPage");

  const contentRepo = new ContentRepository();
  const settings = await contentRepo.getContentSettings();

  const galleryTitle = settings.gallery?.title || tPort("headerTitle");
  const gallerySubtitle = settings.gallery?.subtitle || tPort("headerSubtitle");
  const galleryItems =
    settings.gallery?.items && settings.gallery.items.length > 0
      ? settings.gallery.items
      : DEFAULT_GALLERY_ITEMS;

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Main Gallery Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
          <div className="flex flex-col gap-2 max-w-2xl">
            {settings.gallery?.tag && (
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {settings.gallery.tag}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
              {galleryTitle}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{gallerySubtitle}</p>
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

        {/* Gallery Grid Showcase (Arched Card Aesthetic) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card className="group border-border bg-card p-3 rounded-t-[2.5rem] rounded-b-2xl shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between">
                  <div className="relative aspect-[3/4] w-full rounded-t-[2.2rem] rounded-b-xl overflow-hidden bg-muted mb-3">
                    <Image
                      src={item.imageUrl || "/logo-bg.jpg"}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Badge
                      variant="secondary"
                      className="absolute top-3 left-3 text-[10px] py-0.5 px-2 bg-background/80 backdrop-blur-xs font-mono"
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <CardContent className="p-2 pt-0 flex flex-col gap-1">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden">
                <div className="relative aspect-[4/3] w-full bg-black">
                  <Image
                    src={item.imageUrl || "/logo-bg.jpg"}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="font-serif text-xl font-bold">{item.title}</DialogTitle>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </DialogDescription>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </main>
    </div>
  );
}

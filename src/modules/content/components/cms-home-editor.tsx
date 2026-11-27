"use client";

import {
  ArrowRight,
  Check,
  Eye,
  Heart,
  Laptop,
  Loader2,
  Quote,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { updateHomeContentAction } from "../actions/update-home-content.action";
import { DEFAULT_HOME_CONTENT, type HomeCms } from "../schemas/content-settings.schema";
import { ImageUploaderField } from "./image-uploader-field";

interface CmsHomeEditorProps {
  initialContent: HomeCms;
}

export function CmsHomeEditor({ initialContent }: CmsHomeEditorProps) {
  const tCms = useTranslations("adminCms");

  const [content, setContent] = useState<HomeCms>(initialContent);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isMobile = device === "mobile";

  const handleHeroChange = (field: keyof HomeCms["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
    setIsSaved(false);
    setErrorMessage(null);
  };

  const handleSectionChange = (
    section: "gallerySection" | "packagesSection" | "testimonialsSection",
    field: "tag" | "title" | "subtitle",
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setIsSaved(false);
    setErrorMessage(null);
  };

  const handleManifestoChange = (field: keyof HomeCms["manifesto"], value: string) => {
    setContent((prev) => ({
      ...prev,
      manifesto: {
        ...prev.manifesto,
        [field]: value,
      },
    }));
    setIsSaved(false);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const res = await updateHomeContentAction(content);
      if (res?.data) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else if (res?.serverError) {
        setErrorMessage(res.serverError);
      }
    } catch {
      setErrorMessage(tCms("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setContent(JSON.parse(JSON.stringify(DEFAULT_HOME_CONTENT)));
    setIsSaved(false);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* CMS Header & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
            {tCms("homeTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">{tCms("homeDesc")}</p>
        </div>

        <div className="flex items-center gap-2">
          {errorMessage && (
            <Badge
              variant="outline"
              className="border-destructive/50 bg-destructive/10 text-destructive font-mono text-xs"
            >
              <span>{errorMessage}</span>
            </Badge>
          )}

          {isSaved && (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs"
            >
              <Check className="size-3" />
              <span>{tCms("savedSuccess")}</span>
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleReset}
            disabled={isSaving}
          >
            <RotateCcw className="size-3.5" />
            <span>{tCms("btnReset")}</span>
          </Button>

          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>{isSaving ? tCms("btnSaving") : tCms("btnSave")}</span>
          </Button>
        </div>
      </div>

      {/* Main Split Grid: Editor (Left 5 cols) & Live Preview (Right 7 cols) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. HERO SECTION & MEDIA */}
          <Card className="bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{tCms("sectionHero")}</CardTitle>
              <CardDescription className="text-xs">{tCms("homeDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    {tCms("labelTitlePart1")}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    value={content.hero.titlePart1}
                    onChange={(e) => handleHeroChange("titlePart1", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground text-primary">
                    {tCms("labelTitleHighlight")}
                  </Label>
                  <Input
                    className="h-8 text-xs border-primary/50"
                    value={content.hero.titleHighlight}
                    onChange={(e) => handleHeroChange("titleHighlight", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    {tCms("labelTitlePart2")}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    value={content.hero.titlePart2}
                    onChange={(e) => handleHeroChange("titlePart2", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSubtitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.hero.subtitle}
                  onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    {tCms("labelPrimaryCta")}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    value={content.hero.primaryCta}
                    onChange={(e) => handleHeroChange("primaryCta", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    {tCms("labelSecondaryCta")}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    value={content.hero.secondaryCta}
                    onChange={(e) => handleHeroChange("secondaryCta", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelPolaroidNote")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.hero.badgeTitle}
                  onChange={(e) => handleHeroChange("badgeTitle", e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <ImageUploaderField
                  label={tCms("labelHeroImage")}
                  value={content.hero.heroImageUrl}
                  onChange={(url) => handleHeroChange("heroImageUrl", url)}
                  folder="hero"
                />
                <ImageUploaderField
                  label={tCms("labelPolaroidImage")}
                  value={content.hero.polaroidImageUrl}
                  onChange={(url) => handleHeroChange("polaroidImageUrl", url)}
                  folder="hero"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. RECENT GALLERY SECTION COPY */}
          <Card className="bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{tCms("sectionGallery")}</CardTitle>
              <CardDescription className="text-xs">
                {tCms("noticeGalleryPlaceholder")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionTag")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.gallerySection.tag}
                  onChange={(e) => handleSectionChange("gallerySection", "tag", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionTitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.gallerySection.title}
                  onChange={(e) => handleSectionChange("gallerySection", "title", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionSubtitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.gallerySection.subtitle}
                  onChange={(e) =>
                    handleSectionChange("gallerySection", "subtitle", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. CURATED PACKAGES SECTION COPY */}
          <Card className="bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{tCms("sectionPackages")}</CardTitle>
              <CardDescription className="text-xs">
                {tCms("noticePackagesPlaceholder")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionTag")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.packagesSection.tag}
                  onChange={(e) => handleSectionChange("packagesSection", "tag", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionTitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.packagesSection.title}
                  onChange={(e) => handleSectionChange("packagesSection", "title", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionSubtitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.packagesSection.subtitle}
                  onChange={(e) =>
                    handleSectionChange("packagesSection", "subtitle", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. TESTIMONIALS SECTION COPY */}
          <Card className="bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{tCms("sectionTestimonials")}</CardTitle>
              <CardDescription className="text-xs">
                {tCms("noticeTestimonialsPlaceholder")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionTag")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.testimonialsSection.tag}
                  onChange={(e) =>
                    handleSectionChange("testimonialsSection", "tag", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionTitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.testimonialsSection.title}
                  onChange={(e) =>
                    handleSectionChange("testimonialsSection", "title", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionSubtitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.testimonialsSection.subtitle}
                  onChange={(e) =>
                    handleSectionChange("testimonialsSection", "subtitle", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 5. MANIFESTO BANNER COPY */}
          <Card className="bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{tCms("sectionManifesto")}</CardTitle>
              <CardDescription className="text-xs">
                {tCms("labelManifestoSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelManifestoTitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.manifesto.title}
                  onChange={(e) => handleManifestoChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelManifestoSubtitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.manifesto.subtitle}
                  onChange={(e) => handleManifestoChange("subtitle", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    {tCms("labelPrimaryCta")}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    value={content.manifesto.primaryCta}
                    onChange={(e) => handleManifestoChange("primaryCta", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    {tCms("labelSecondaryCta")}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    value={content.manifesto.secondaryCta}
                    onChange={(e) => handleManifestoChange("secondaryCta", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Full 1-Page Live Preview */}
        <div className="lg:col-span-7 sticky top-6 space-y-3">
          <div className="flex items-center justify-between p-2 rounded-xl border bg-card shadow-xs">
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="gap-1 border-primary/40 text-primary font-mono text-[10px] uppercase tracking-wider"
              >
                <Eye className="size-3 text-primary animate-pulse" />
                <span>{tCms("previewBadge")}</span>
              </Badge>
              <span className="hidden sm:inline text-[11px] text-muted-foreground">
                {tCms("liveSyncActive")}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant={device === "desktop" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 gap-1 text-xs"
                onClick={() => setDevice("desktop")}
              >
                <Laptop className="size-3.5" />
                <span>{tCms("previewDesktop")}</span>
              </Button>
              <Button
                variant={device === "mobile" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 gap-1 text-xs"
                onClick={() => setDevice("mobile")}
              >
                <Smartphone className="size-3.5" />
                <span>{tCms("previewMobile")}</span>
              </Button>
            </div>
          </div>

          {/* Interactive Live View Container */}
          <div
            className={`mx-auto transition-all duration-300 rounded-2xl border-2 border-border shadow-lg bg-background overflow-hidden ${
              isMobile ? "max-w-[340px]" : "w-full"
            }`}
          >
            {/* Device Browser Chrome Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/60 text-[11px] text-muted-foreground select-none">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-rose-400" />
                <div className="size-2 rounded-full bg-amber-400" />
                <div className="size-2 rounded-full bg-emerald-400" />
              </div>
              <div className="font-mono text-[10px] px-2 py-0.5 rounded bg-background/80 border text-muted-foreground truncate max-w-[200px]">
                {isMobile ? "gradsun.studio/ (mobile)" : "gradsun.studio/ (desktop viewport)"}
              </div>
              <div className="size-2" />
            </div>

            {/* Live Body Scrollable Container (FULL 1-PAGE HOMEPAGE) */}
            <div className="max-h-[700px] overflow-y-auto divide-y divide-border/60">
              {/* 0. MINI STOREFRONT NAVIGATION BAR */}
              <div className="px-4 py-2.5 flex items-center justify-between bg-background/95 backdrop-blur-xs sticky top-0 z-20 border-b border-border/40">
                <div className="flex items-center gap-1.5">
                  <Sun className="size-4 text-primary fill-primary" />
                  <span className="font-serif font-bold text-xs tracking-tight text-foreground">
                    {tCms("previewNavBrand")}
                  </span>
                </div>

                {!isMobile && (
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                    <span className="text-foreground font-semibold">{tCms("previewNavHome")}</span>
                    <span>{tCms("previewNavGallery")}</span>
                    <span>{tCms("previewNavPackages")}</span>
                  </div>
                )}

                <Button size="sm" className="h-6 px-2 text-[10px] rounded-lg">
                  <span>{tCms("previewNavBook")}</span>
                </Button>
              </div>

              {/* 1. HERO SECTION LIVE PREVIEW */}
              <div className="p-4 sm:p-6 space-y-6">
                <div
                  className={`grid gap-6 items-center ${
                    isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-12"
                  }`}
                >
                  {/* Left Column / Mobile Top: Copy and CTAs */}
                  <div
                    className={`flex flex-col items-start gap-3 ${
                      isMobile ? "w-full" : "sm:col-span-7"
                    }`}
                  >
                    <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-tight leading-tight text-foreground">
                      <span>{content.hero.titlePart1}</span>{" "}
                      <span className="italic text-primary">{content.hero.titleHighlight}</span>{" "}
                      <span>{content.hero.titlePart2}</span>
                    </h1>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {content.hero.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 w-full">
                      <Button size="sm" className="gap-1.5 text-xs h-7 shadow-xs">
                        <Sparkles className="size-3" />
                        <span>{content.hero.primaryCta}</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-xs h-7">
                        <span>{content.hero.secondaryCta}</span>
                        <ArrowRight className="size-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Right Column / Mobile Bottom: Iconic Arched Showcase & Offset Polaroid */}
                  <div
                    className={`relative flex justify-center items-center ${
                      isMobile ? "w-full pt-2" : "sm:col-span-5"
                    }`}
                  >
                    <div className="relative w-full max-w-[190px] sm:max-w-[210px]">
                      {/* Main Arched Frame */}
                      <div className="relative rounded-t-[5rem] sm:rounded-t-[6rem] rounded-b-2xl overflow-hidden border border-border bg-card shadow-lg aspect-[3/4]">
                        <Image
                          src={content.hero.heroImageUrl || "/logo-bg.jpg"}
                          alt={content.hero.titleHighlight}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Floating Polaroid Offset Card */}
                      <div className="absolute -bottom-3 -left-3 sm:-left-4 w-28 sm:w-36 p-1.5 rounded-xl bg-white border-2 border-border shadow-xl rotate-[-3deg] transition-transform duration-300 hover:rotate-0">
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border/40">
                          <Image
                            src={content.hero.polaroidImageUrl || "/logo-bg.jpg"}
                            alt={content.hero.badgeTitle}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="pt-1.5 px-0.5 flex items-center justify-between text-black">
                          <span className="text-[9px] font-medium italic truncate max-w-[80px] sm:max-w-[100px] text-zinc-700">
                            {content.hero.badgeTitle}
                          </span>
                          <Heart className="size-2.5 text-zinc-500 stroke-[1.5]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. RECENT GALLERY SHOWCASE (Dynamic Section Header + 4 Placeholder Cards) */}
              <div className="p-4 sm:p-6 space-y-4 bg-secondary/15">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {content.gallerySection.tag}
                  </span>
                  <h2 className="font-serif text-base sm:text-lg font-bold tracking-tight text-foreground">
                    {content.gallerySection.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">{content.gallerySection.subtitle}</p>
                </div>

                <div
                  className={`grid gap-3 ${
                    isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
                  }`}
                >
                  <Card className="border bg-card p-1.5 rounded-xl shadow-2xs">
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted mb-1.5">
                      <Image
                        src="/logo-bg.jpg"
                        alt={tCms("sampleGal1Title")}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="p-1">
                      <h4 className="font-serif text-[11px] font-bold truncate">
                        {tCms("sampleGal1Title")}
                      </h4>
                      <p className="text-[9px] text-muted-foreground">{tCms("sampleGalDesc")}</p>
                    </div>
                  </Card>

                  <Card className="border bg-card p-1.5 rounded-xl shadow-2xs">
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted mb-1.5">
                      <Image
                        src="/logo-bg.jpg"
                        alt={tCms("sampleGal2Title")}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="p-1">
                      <h4 className="font-serif text-[11px] font-bold truncate">
                        {tCms("sampleGal2Title")}
                      </h4>
                      <p className="text-[9px] text-muted-foreground">{tCms("sampleGalDesc")}</p>
                    </div>
                  </Card>

                  <Card className="border bg-card p-1.5 rounded-xl shadow-2xs">
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted mb-1.5">
                      <Image
                        src="/logo-bg.jpg"
                        alt={tCms("sampleGal3Title")}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="p-1">
                      <h4 className="font-serif text-[11px] font-bold truncate">
                        {tCms("sampleGal3Title")}
                      </h4>
                      <p className="text-[9px] text-muted-foreground">{tCms("sampleGalDesc")}</p>
                    </div>
                  </Card>

                  <Card className="border bg-card p-1.5 rounded-xl shadow-2xs">
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted mb-1.5">
                      <Image
                        src="/logo-bg.jpg"
                        alt={tCms("sampleGal4Title")}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="p-1">
                      <h4 className="font-serif text-[11px] font-bold truncate">
                        {tCms("sampleGal4Title")}
                      </h4>
                      <p className="text-[9px] text-muted-foreground">{tCms("sampleGalDesc")}</p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* 3. CURATED PACKAGES SECTION (Dynamic Section Header + 4 Placeholder Arched Cards) */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {content.packagesSection.tag}
                  </span>
                  <h2 className="font-serif text-base sm:text-lg font-bold tracking-tight text-foreground">
                    {content.packagesSection.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {content.packagesSection.subtitle}
                  </p>
                </div>

                <div
                  className={`grid gap-3 ${
                    isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
                  }`}
                >
                  <Card className="rounded-t-[3rem] rounded-b-xl border bg-card p-2 shadow-2xs flex flex-col justify-between">
                    <div className="relative aspect-[3/4] rounded-t-[2.7rem] rounded-b-lg overflow-hidden bg-muted mb-2">
                      <Image
                        src="/logo-bg.jpg"
                        alt={tCms("samplePkg1Title")}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-xs font-bold truncate">
                          {tCms("samplePkg1Title")}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 border-primary/40 text-primary"
                        >
                          {tCms("samplePkg1Price")}
                        </Badge>
                      </div>
                      <span className="text-[9px] text-muted-foreground block">
                        {tCms("samplePkgDuration")}
                      </span>
                    </div>
                  </Card>

                  <Card className="rounded-t-[3rem] rounded-b-xl border bg-card p-2 shadow-2xs flex flex-col justify-between">
                    <div className="relative aspect-[3/4] rounded-t-[2.7rem] rounded-b-lg overflow-hidden bg-muted mb-2">
                      <Image
                        src="/logo-bg.jpg"
                        alt={tCms("samplePkg2Title")}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-xs font-bold truncate">
                          {tCms("samplePkg2Title")}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 border-primary/40 text-primary"
                        >
                          {tCms("samplePkg2Price")}
                        </Badge>
                      </div>
                      <span className="text-[9px] text-muted-foreground block">
                        {tCms("samplePkgDuration")}
                      </span>
                    </div>
                  </Card>

                  <Card className="rounded-t-[3rem] rounded-b-xl border bg-card p-2 shadow-2xs flex flex-col justify-between">
                    <div className="relative aspect-[3/4] rounded-t-[2.7rem] rounded-b-lg overflow-hidden bg-muted mb-2">
                      <Image
                        src="/logo-bg.jpg"
                        alt={tCms("samplePkg3Title")}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-xs font-bold truncate">
                          {tCms("samplePkg3Title")}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 border-primary/40 text-primary"
                        >
                          {tCms("samplePkg3Price")}
                        </Badge>
                      </div>
                      <span className="text-[9px] text-muted-foreground block">
                        {tCms("samplePkgDuration")}
                      </span>
                    </div>
                  </Card>

                  <Card className="rounded-t-[3rem] rounded-b-xl border bg-card p-2 shadow-2xs flex flex-col justify-between">
                    <div className="relative aspect-[3/4] rounded-t-[2.7rem] rounded-b-lg overflow-hidden bg-muted mb-2">
                      <Image
                        src="/logo-bg.jpg"
                        alt={tCms("samplePkg4Title")}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-xs font-bold truncate">
                          {tCms("samplePkg4Title")}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 border-primary/40 text-primary"
                        >
                          {tCms("samplePkg4Price")}
                        </Badge>
                      </div>
                      <span className="text-[9px] text-muted-foreground block">
                        {tCms("samplePkgDuration")}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* 4. WALL OF LOVE / TESTIMONIALS (Dynamic Section Header + 3 Placeholder Reviews) */}
              <div className="p-4 sm:p-6 space-y-4 bg-secondary/15">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {content.testimonialsSection.tag}
                  </span>
                  <h2 className="font-serif text-base sm:text-lg font-bold tracking-tight text-foreground">
                    {content.testimonialsSection.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {content.testimonialsSection.subtitle}
                  </p>
                </div>

                <div
                  className={`grid gap-3 ${
                    isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"
                  }`}
                >
                  <Card className="border bg-card p-3 rounded-xl shadow-2xs space-y-2 relative">
                    <Quote className="size-5 text-primary/20 absolute top-2 right-2" />
                    <div className="flex items-center gap-0.5 text-primary">
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                    </div>
                    <p className="text-[10px] text-foreground/90 italic leading-relaxed">
                      {`"${tCms("sampleTesti1Quote")}"`}
                    </p>
                    <div className="pt-1.5 border-t border-border flex items-center justify-between text-[10px]">
                      <span className="font-serif font-semibold">{tCms("sampleTesti1Author")}</span>
                      <Badge variant="secondary" className="text-[9px] py-0 px-1">
                        {tCms("sampleYear")}
                      </Badge>
                    </div>
                  </Card>

                  <Card className="border bg-card p-3 rounded-xl shadow-2xs space-y-2 relative">
                    <Quote className="size-5 text-primary/20 absolute top-2 right-2" />
                    <div className="flex items-center gap-0.5 text-primary">
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                    </div>
                    <p className="text-[10px] text-foreground/90 italic leading-relaxed">
                      {`"${tCms("sampleTesti2Quote")}"`}
                    </p>
                    <div className="pt-1.5 border-t border-border flex items-center justify-between text-[10px]">
                      <span className="font-serif font-semibold">{tCms("sampleTesti2Author")}</span>
                      <Badge variant="secondary" className="text-[9px] py-0 px-1">
                        {tCms("sampleYear")}
                      </Badge>
                    </div>
                  </Card>

                  <Card className="border bg-card p-3 rounded-xl shadow-2xs space-y-2 relative">
                    <Quote className="size-5 text-primary/20 absolute top-2 right-2" />
                    <div className="flex items-center gap-0.5 text-primary">
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                      <Star className="size-3 fill-primary" />
                    </div>
                    <p className="text-[10px] text-foreground/90 italic leading-relaxed">
                      {`"${tCms("sampleTesti3Quote")}"`}
                    </p>
                    <div className="pt-1.5 border-t border-border flex items-center justify-between text-[10px]">
                      <span className="font-serif font-semibold">{tCms("sampleTesti3Author")}</span>
                      <Badge variant="secondary" className="text-[9px] py-0 px-1">
                        {tCms("sampleYear")}
                      </Badge>
                    </div>
                  </Card>
                </div>
              </div>

              {/* 5. MANIFESTO BANNER LIVE PREVIEW (Authentic Dark Theme) */}
              <div className="p-4 sm:p-6">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-foreground text-background p-5 sm:p-7 shadow-xl">
                  <div className="relative z-10 space-y-3">
                    <h2 className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-background leading-snug">
                      {content.manifesto.title}
                    </h2>
                    <p className="text-xs text-background/80 leading-relaxed max-w-md">
                      {content.manifesto.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        className="text-xs h-7 gap-1 shadow-xs bg-background text-foreground hover:bg-background/90 font-medium"
                      >
                        <span>{content.manifesto.primaryCta}</span>
                        <ArrowRight className="size-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"
                      >
                        <span>{content.manifesto.secondaryCta}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. STOREFRONT FOOTER PREVIEW */}
              <div className="px-4 py-3 bg-muted/40 text-center text-[10px] text-muted-foreground">
                <span>{tCms("previewFooter")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

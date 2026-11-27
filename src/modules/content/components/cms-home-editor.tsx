"use client";

import {
  ArrowRight,
  Check,
  Eye,
  Heart,
  Laptop,
  Loader2,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
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
import type { HomeCms } from "../schemas/content-settings.schema";

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
    setContent(initialContent);
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

      {/* Main Split Grid: Editor (Left) & Live Preview (Right) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* HERO SETTINGS */}
          <Card className="bg-card shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{tCms("homeTitle")}</CardTitle>
              <CardDescription className="text-xs">{tCms("homeDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">{tCms("labelBadge")}</Label>
                <Input
                  className="h-8 text-xs"
                  value={content.hero.badge}
                  onChange={(e) => handleHeroChange("badge", e.target.value)}
                />
              </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    {tCms("labelHeroImage")}
                  </Label>
                  <Input
                    className="h-8 text-xs font-mono"
                    value={content.hero.heroImageUrl}
                    onChange={(e) => handleHeroChange("heroImageUrl", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    {tCms("labelPolaroidImage")}
                  </Label>
                  <Input
                    className="h-8 text-xs font-mono"
                    value={content.hero.polaroidImageUrl}
                    onChange={(e) => handleHeroChange("polaroidImageUrl", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MANIFESTO SECTION */}
          <Card className="bg-card shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {tCms("labelManifestoTitle")}
              </CardTitle>
              <CardDescription className="text-xs">
                {tCms("labelManifestoSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

        {/* Right Column: Live Preview */}
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

            {/* Live Body Scrollable Container */}
            <div className="max-h-[640px] overflow-y-auto divide-y divide-border/60">
              {/* Mini Storefront Navigation Bar */}
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

              {/* HERO SECTION LIVE PREVIEW */}
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
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-2.5 py-0.5 text-[10px] font-normal border border-border"
                    >
                      <Sun className="size-3 text-primary animate-pulse" />
                      <span>{content.hero.badge}</span>
                    </Badge>

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

              {/* CURATED MILESTONES DIVIDER TEASER */}
              <div className="px-4 py-3 bg-secondary/10 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider text-primary">
                  {tCms("previewSectionTag")}
                </span>
                <span className="italic">{tCms("previewSubBrand")}</span>
              </div>

              {/* MANIFESTO BANNER LIVE PREVIEW (Authentic Dark Theme) */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

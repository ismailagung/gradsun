"use client";

import {
  ArrowRight,
  Check,
  Eye,
  Heart,
  Laptop,
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
import type { HomeCms } from "../schemas/content-settings.schema";

interface CmsHomeEditorProps {
  initialContent: HomeCms;
}

export function CmsHomeEditor({ initialContent }: CmsHomeEditorProps) {
  const tCms = useTranslations("adminCms");

  const [content, setContent] = useState<HomeCms>(initialContent);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSaved, setIsSaved] = useState(false);

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
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setContent(initialContent);
    setIsSaved(false);
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
          {isSaved && (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs"
            >
              <Check className="size-3" />
              <span>{tCms("savedSuccess")}</span>
            </Badge>
          )}

          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleReset}>
            <RotateCcw className="size-3.5" />
            <span>{tCms("btnReset")}</span>
          </Button>

          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleSave}>
            <Save className="size-3.5" />
            <span>{tCms("btnSave")}</span>
          </Button>
        </div>
      </div>

      {/* Main Split Grid: Editor (Left) & Live Preview (Right) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-4">
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
        <div className="lg:col-span-6 sticky top-20 space-y-3">
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

          {/* Interactive Live View */}
          <div
            className={`mx-auto transition-all duration-300 rounded-2xl border-2 border-border shadow-lg bg-background overflow-hidden ${
              isMobile ? "max-w-[340px]" : "w-full"
            }`}
          >
            {/* Device Browser Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/60 text-[11px] text-muted-foreground select-none">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-rose-400" />
                <div className="size-2 rounded-full bg-amber-400" />
                <div className="size-2 rounded-full bg-emerald-400" />
              </div>
              <div className="font-mono text-[10px] px-2 py-0.5 rounded bg-background/80 border text-muted-foreground">
                {isMobile ? "gradsun.studio (mobile)" : "gradsun.studio"}
              </div>
              <div className="size-2" />
            </div>

            {/* Live Body */}
            <div className="p-4 sm:p-6 space-y-6 max-h-[640px] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex flex-col items-start gap-3">
                  <Badge
                    variant="secondary"
                    className="gap-1.5 px-2.5 py-0.5 text-[10px] font-normal border border-border"
                  >
                    <Sun className="size-3 text-primary animate-pulse" />
                    <span>{content.hero.badge}</span>
                  </Badge>

                  <h1 className="font-serif text-2xl sm:text-3xl tracking-tight leading-snug text-foreground">
                    <span>{content.hero.titlePart1}</span>{" "}
                    <span className="italic text-primary">{content.hero.titleHighlight}</span>{" "}
                    <span>{content.hero.titlePart2}</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {content.hero.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 w-full">
                    <Button size="sm" className="gap-1.5 text-xs h-7">
                      <Sparkles className="size-3" />
                      <span>{content.hero.primaryCta}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-xs h-7">
                      <span>{content.hero.secondaryCta}</span>
                      <ArrowRight className="size-3" />
                    </Button>
                  </div>
                </div>

                {/* Arched Hero Graphic Frame */}
                <div className="relative pt-2">
                  <div className="relative rounded-t-3xl rounded-b-xl overflow-hidden border bg-card aspect-[16/9] w-full">
                    <Image
                      src="/logo-bg.jpg"
                      alt={content.hero.titleHighlight}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-card border shadow-md flex items-center justify-between gap-2">
                    <span className="text-[10px] font-medium text-muted-foreground italic">
                      {content.hero.badgeTitle}
                    </span>
                    <Heart className="size-2.5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Manifesto CTA */}
              <div className="rounded-xl border bg-card p-4 space-y-3 shadow-xs">
                <h2 className="font-serif text-base font-semibold tracking-tight text-foreground">
                  {content.manifesto.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {content.manifesto.subtitle}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button size="sm" className="text-xs h-7">
                    {content.manifesto.primaryCta}
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    {content.manifesto.secondaryCta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

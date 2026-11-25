"use client";

import { Check, Eye, Laptop, RotateCcw, Save, Smartphone } from "lucide-react";
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
import type { ContentSettings } from "../schemas/content-settings.schema";
import { CmsPreviewFrame } from "./cms-preview-frame";

interface CmsEditorViewProps {
  initialContent: ContentSettings;
  defaultTab?: "hero" | "manifesto" | "showcase" | "testimonials";
}

export function CmsEditorView({ initialContent, defaultTab = "hero" }: CmsEditorViewProps) {
  const tCms = useTranslations("adminCms");

  const [content, setContent] = useState<ContentSettings>(initialContent);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"hero" | "manifesto" | "showcase" | "testimonials">(
    defaultTab,
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleHeroChange = (field: keyof ContentSettings["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
    setIsSaved(false);
  };

  const handleManifestoChange = (field: keyof ContentSettings["manifesto"], value: string) => {
    setContent((prev) => ({
      ...prev,
      manifesto: {
        ...prev.manifesto,
        [field]: value,
      },
    }));
    setIsSaved(false);
  };

  const handleShowcaseChange = (index: number, field: "title" | "desc", value: string) => {
    setContent((prev) => {
      const updated = [...prev.portfolioShowcase];
      const item = updated[index];
      if (item) {
        updated[index] = { ...item, [field]: value };
      }
      return { ...prev, portfolioShowcase: updated };
    });
    setIsSaved(false);
  };

  const handleTestimonialChange = (
    index: number,
    field: "author" | "role" | "quote" | "year",
    value: string,
  ) => {
    setContent((prev) => {
      const updated = [...prev.testimonials];
      const item = updated[index];
      if (item) {
        updated[index] = { ...item, [field]: value };
      }
      return { ...prev, testimonials: updated };
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
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
            {tCms("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">{tCms("subtitle")}</p>
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

      {/* Tabs navigation for Sections */}
      <div className="flex flex-wrap items-center gap-1.5 border-b pb-2">
        <Button
          variant={activeTab === "hero" ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs font-medium"
          onClick={() => setActiveTab("hero")}
        >
          {tCms("tabHome")}
        </Button>
        <Button
          variant={activeTab === "manifesto" ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs font-medium"
          onClick={() => setActiveTab("manifesto")}
        >
          {tCms("tabManifesto")}
        </Button>
        <Button
          variant={activeTab === "showcase" ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs font-medium"
          onClick={() => setActiveTab("showcase")}
        >
          {tCms("tabShowcase")}
        </Button>
        <Button
          variant={activeTab === "testimonials" ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs font-medium"
          onClick={() => setActiveTab("testimonials")}
        >
          {tCms("tabTestimonials")}
        </Button>
      </div>

      {/* Main Split Grid: Editor (Left) & Live Preview (Right) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* HERO SECTION FORM */}
          {activeTab === "hero" && (
            <Card className="bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {tCms("sectionHeroTitle")}
                </CardTitle>
                <CardDescription className="text-xs">{tCms("sectionHeroDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    {tCms("labelBadge")}
                  </Label>
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
          )}

          {/* MANIFESTO FORM */}
          {activeTab === "manifesto" && (
            <Card className="bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {tCms("sectionManifestoTitle")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {tCms("sectionManifestoDesc")}
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
          )}

          {/* SHOWCASE FORM */}
          {activeTab === "showcase" && (
            <Card className="bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {tCms("sectionShowcaseTitle")}
                </CardTitle>
                <CardDescription className="text-xs">{tCms("sectionShowcaseDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.portfolioShowcase.map((item, index) => (
                  <div key={item.id} className="p-3 border rounded-lg bg-muted/20 space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-foreground">
                        {tCms("labelItemTitle")}
                      </Label>
                      <Input
                        className="h-8 text-xs"
                        value={item.title}
                        onChange={(e) => handleShowcaseChange(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-foreground">
                        {tCms("labelItemDesc")}
                      </Label>
                      <Input
                        className="h-8 text-xs"
                        value={item.desc}
                        onChange={(e) => handleShowcaseChange(index, "desc", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* TESTIMONIALS FORM */}
          {activeTab === "testimonials" && (
            <Card className="bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {tCms("sectionTestimonialsTitle")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {tCms("sectionTestimonialsDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.testimonials.map((testi, index) => (
                  <div key={testi.id} className="p-3 border rounded-lg bg-muted/20 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-foreground">
                          {tCms("labelAuthor")}
                        </Label>
                        <Input
                          className="h-8 text-xs"
                          value={testi.author}
                          onChange={(e) => handleTestimonialChange(index, "author", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-foreground">
                          {tCms("labelRole")}
                        </Label>
                        <Input
                          className="h-8 text-xs"
                          value={testi.role}
                          onChange={(e) => handleTestimonialChange(index, "role", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-foreground">
                        {tCms("labelQuote")}
                      </Label>
                      <Input
                        className="h-8 text-xs"
                        value={testi.quote}
                        onChange={(e) => handleTestimonialChange(index, "quote", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Live Preview Pane */}
        <div className="lg:col-span-6 sticky top-20 space-y-3">
          {/* Preview Toolbar */}
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

          {/* Interactive Live Device View */}
          <CmsPreviewFrame content={content} device={device} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}

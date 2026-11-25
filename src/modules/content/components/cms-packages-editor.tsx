"use client";

import {
  Check,
  CloudSun,
  Eye,
  Info,
  Laptop,
  RotateCcw,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
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
import type { PackagesCms } from "../schemas/content-settings.schema";

interface CmsPackagesEditorProps {
  initialContent: PackagesCms;
}

export function CmsPackagesEditor({ initialContent }: CmsPackagesEditorProps) {
  const tCms = useTranslations("adminCms");

  const [content, setContent] = useState<PackagesCms>(initialContent);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSaved, setIsSaved] = useState(false);

  const isMobile = device === "mobile";

  const handleChange = (field: keyof PackagesCms, value: string) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
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
            {tCms("packagesTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">{tCms("packagesDesc")}</p>
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
          {/* Operational Separation Notice Card */}
          <Card className="border-primary/30 bg-primary/5 shadow-xs">
            <CardContent className="p-3.5 flex items-start gap-3">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-foreground">{tCms("dataNoticeOperational")}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {tCms("packagesDataNotice")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{tCms("packagesTitle")}</CardTitle>
              <CardDescription className="text-xs">{tCms("packagesDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSeasonTag")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.seasonTag}
                  onChange={(e) => handleChange("seasonTag", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelPackagesHeading")}
                </Label>
                <Input
                  className="h-8 text-xs font-serif font-medium text-base"
                  value={content.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelPackagesSubtitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelVowTitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.vowTitle}
                  onChange={(e) => handleChange("vowTitle", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelVowSubtitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.vowSubtitle}
                  onChange={(e) => handleChange("vowSubtitle", e.target.value)}
                />
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
                {isMobile ? "gradsun.studio/packages (mobile)" : "gradsun.studio/packages"}
              </div>
              <div className="size-2" />
            </div>

            {/* Live Packages Header & Weather Vow */}
            <div className="p-4 sm:p-6 space-y-6 max-h-[640px] overflow-y-auto">
              <div className="space-y-3">
                <Badge
                  variant="outline"
                  className="gap-1.5 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider border-border"
                >
                  <Sparkles className="size-3 text-primary" />
                  <span>{content.seasonTag}</span>
                </Badge>

                <h1 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground">
                  {content.title}
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {content.subtitle}
                </p>
              </div>

              {/* Weather Vow Guarantee Banner */}
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                <div className="flex items-center gap-2">
                  <CloudSun className="size-4 text-amber-500" />
                  <span className="text-xs font-semibold text-foreground">{content.vowTitle}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-6">
                  {content.vowSubtitle}
                </p>
              </div>

              {/* Sample Package Preview Card */}
              <div className="p-3.5 rounded-xl border bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {tCms("samplePackageTitle")}
                  </span>
                  <span className="text-xs font-semibold text-primary font-mono">
                    {tCms("samplePackagePrice")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  <span>{tCms("samplePackageDetails")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

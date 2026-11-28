"use client";

import {
  AlertCircle,
  Calendar,
  Camera,
  Check,
  Clock,
  ExternalLink,
  Globe,
  Laptop,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Percent,
  Receipt,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { ImageUploaderField } from "@/modules/content/components/image-uploader-field";
import { updateGeneralSettingsAction } from "../actions/update-general-settings.action";
import { DEFAULT_GENERAL_SETTINGS, type GeneralSettings } from "../schemas/general-settings.schema";

interface GeneralSettingsManagerProps {
  initialSettings: GeneralSettings;
}

const AUTHENTIC_PACKAGES = [
  { name: "Single Package 1", price: 450000 },
  { name: "Single Package 2", price: 550000 },
  { name: "Group Package 1", price: 750000 },
  { name: "Group Package 2", price: 950000 },
];

export function GeneralSettingsManager({ initialSettings }: GeneralSettingsManagerProps) {
  const t = useTranslations("adminSettings");
  const [settings, setSettings] = useState<GeneralSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleBrandingChange = <K extends keyof GeneralSettings["branding"]>(
    field: K,
    value: GeneralSettings["branding"][K],
  ) => {
    setSettings((prev) => ({
      ...prev,
      branding: { ...prev.branding, [field]: value },
    }));
    setSaveSuccess(false);
  };

  const handleFooterChange = <K extends keyof GeneralSettings["footer"]>(
    field: K,
    value: GeneralSettings["footer"][K],
  ) => {
    setSettings((prev) => ({
      ...prev,
      footer: { ...prev.footer, [field]: value },
    }));
    setSaveSuccess(false);
  };

  const handleOrdersChange = <K extends keyof GeneralSettings["orders"]>(
    field: K,
    value: GeneralSettings["orders"][K],
  ) => {
    setSettings((prev) => ({
      ...prev,
      orders: { ...prev.orders, [field]: value },
    }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const result = await updateGeneralSettingsAction(settings);
      if (result?.data) {
        setSettings(result.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(t("saveError"));
      }
    } catch {
      setSaveError(t("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmReset = () => {
    setSettings(JSON.parse(JSON.stringify(DEFAULT_GENERAL_SETTINGS)));
    setIsResetDialogOpen(false);
    setSaveSuccess(false);
  };

  const currentDp = settings.orders.downPaymentPercent;
  const samplePrice = 1000000;
  const sampleDp = Math.round((samplePrice * currentDp) / 100);
  const sampleRem = samplePrice - sampleDp;

  return (
    <div className="space-y-6">
      {/* Top Header Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">{t("subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setIsResetDialogOpen(true)}
            disabled={isSaving}
          >
            <RotateCcw className="size-3.5" />
            <span>{t("btnReset")}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-8 gap-1.5 text-xs shadow-xs"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>{isSaving ? t("btnSaving") : t("btnSave")}</span>
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <Check className="size-4 shrink-0 text-emerald-500" />
          <span>{t("saveSuccess")}</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Grouped Tabs */}
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="branding" className="gap-1.5 text-xs">
            <Palette className="size-3.5" />
            <span>{t("tabBranding")}</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-1.5 text-xs">
            <Globe className="size-3.5" />
            <span>{t("tabFooter")}</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-1.5 text-xs">
            <Receipt className="size-3.5" />
            <span>{t("tabOrders")}</span>
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* TAB 1: BRANDING & IDENTITY */}
        {/* ============================================================== */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Form Controls */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="bg-card shadow-xs">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {t("sectionBrandingTitle")}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {t("sectionBrandingDesc")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {/* Logo Uploader */}
                  <ImageUploaderField
                    label={t("labelLogo")}
                    value={settings.branding.logoUrl}
                    onChange={(url) => handleBrandingChange("logoUrl", url)}
                    folder="general"
                    aspectRatio="square"
                  />

                  {/* Brand Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="brand-name" className="text-xs font-medium">
                      {t("labelBrandName")}
                    </Label>
                    <Input
                      id="brand-name"
                      className="h-8 text-xs font-sans"
                      value={settings.branding.brandName}
                      onChange={(e) => handleBrandingChange("brandName", e.target.value)}
                      placeholder={t("placeholderBrandName")}
                    />
                  </div>

                  {/* Brand Tagline */}
                  <div className="space-y-1.5">
                    <Label htmlFor="brand-tagline" className="text-xs font-medium">
                      {t("labelBrandTagline")}
                    </Label>
                    <Input
                      id="brand-tagline"
                      className="h-8 text-xs font-sans"
                      value={settings.branding.brandTagline}
                      onChange={(e) => handleBrandingChange("brandTagline", e.target.value)}
                      placeholder={t("placeholderBrandTagline")}
                    />
                  </div>

                  {/* Show Brand Text Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                    <div>
                      <Label className="text-xs font-medium">{t("labelShowBrandText")}</Label>
                    </div>
                    <Button
                      type="button"
                      variant={settings.branding.showBrandText ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs px-3"
                      onClick={() =>
                        handleBrandingChange("showBrandText", !settings.branding.showBrandText)
                      }
                    >
                      {settings.branding.showBrandText ? <Check className="size-3 mr-1" /> : null}
                      <span>
                        {settings.branding.showBrandText ? t("statusActive") : t("statusHidden")}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Header Preview */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-card shadow-xs border-border">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <Laptop className="size-4 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {t("previewNavbarTitle")}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {t("previewNavbarDesc")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Mock Navbar Container */}
                  <div className="rounded-xl border border-border bg-background p-4 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative size-8 shrink-0 overflow-hidden rounded-md border border-border bg-muted/40 p-1">
                          {settings.branding.logoUrl ? (
                            <Image
                              src={settings.branding.logoUrl}
                              alt={t("altBrandLogo")}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          ) : (
                            <Sparkles className="size-4 text-primary m-auto" />
                          )}
                        </div>
                        {settings.branding.showBrandText ? (
                          <div>
                            <span className="font-serif text-sm font-semibold text-foreground tracking-tight block">
                              {settings.branding.brandName ||
                                DEFAULT_GENERAL_SETTINGS.branding.brandName}
                            </span>
                            <span className="text-[10px] text-muted-foreground block -mt-0.5">
                              {settings.branding.brandTagline ||
                                DEFAULT_GENERAL_SETTINGS.branding.brandTagline}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span>{t("previewNavGallery")}</span>
                        <span className="text-foreground font-medium">
                          {t("previewNavPackages")}
                        </span>
                        <span>{t("previewNavTrack")}</span>
                      </div>

                      <Button size="sm" className="h-7 text-[11px] px-3 rounded-full">
                        {t("previewNavBook")}
                      </Button>
                    </div>

                    <div className="p-3 rounded-md bg-muted/30 text-center text-xs text-muted-foreground">
                      <span>{t("previewNavSilhouette")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 2: FOOTER & SOCIALS */}
        {/* ============================================================== */}
        <TabsContent value="footer" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Form Controls */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="bg-card shadow-xs">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-primary" />
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {t("sectionFooterTitle")}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {t("sectionFooterDesc")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3.5 pt-4">
                  {/* WhatsApp Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="wa-number"
                        className="text-xs font-medium flex items-center gap-1.5"
                      >
                        <MessageCircle className="size-3 text-emerald-500" />
                        <span>{t("labelWhatsappNumber")}</span>
                      </Label>
                      <Input
                        id="wa-number"
                        className="h-8 text-xs font-mono"
                        value={settings.footer.whatsappNumber}
                        onChange={(e) => {
                          const num = e.target.value.replace(/\D/g, "");
                          handleFooterChange("whatsappNumber", num);
                          handleFooterChange("whatsappUrl", `https://wa.me/${num}`);
                        }}
                        placeholder={t("placeholderWhatsappNumber")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="wa-url" className="text-xs font-medium">
                        {t("labelWhatsappUrl")}
                      </Label>
                      <Input
                        id="wa-url"
                        className="h-8 text-xs font-mono"
                        value={settings.footer.whatsappUrl}
                        onChange={(e) => handleFooterChange("whatsappUrl", e.target.value)}
                        placeholder={t("placeholderWhatsappUrl")}
                      />
                    </div>
                  </div>

                  {/* Instagram Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="ig-handle"
                        className="text-xs font-medium flex items-center gap-1.5"
                      >
                        <Camera className="size-3 text-pink-500" />
                        <span>{t("labelInstagramHandle")}</span>
                      </Label>
                      <Input
                        id="ig-handle"
                        className="h-8 text-xs font-mono"
                        value={settings.footer.instagramHandle}
                        onChange={(e) => handleFooterChange("instagramHandle", e.target.value)}
                        placeholder={t("placeholderInstagramHandle")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ig-url" className="text-xs font-medium">
                        {t("labelInstagramUrl")}
                      </Label>
                      <Input
                        id="ig-url"
                        className="h-8 text-xs font-mono"
                        value={settings.footer.instagramUrl}
                        onChange={(e) => handleFooterChange("instagramUrl", e.target.value)}
                        placeholder={t("placeholderInstagramUrl")}
                      />
                    </div>
                  </div>

                  {/* Official Email & Basecamp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="studio-email"
                        className="text-xs font-medium flex items-center gap-1.5"
                      >
                        <Mail className="size-3 text-primary" />
                        <span>{t("labelEmail")}</span>
                      </Label>
                      <Input
                        id="studio-email"
                        type="email"
                        className="h-8 text-xs font-sans"
                        value={settings.footer.email}
                        onChange={(e) => handleFooterChange("email", e.target.value)}
                        placeholder={t("placeholderEmail")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="basecamp-addr"
                        className="text-xs font-medium flex items-center gap-1.5"
                      >
                        <MapPin className="size-3 text-amber-500" />
                        <span>{t("labelBasecamp")}</span>
                      </Label>
                      <Input
                        id="basecamp-addr"
                        className="h-8 text-xs font-sans"
                        value={settings.footer.basecampAddress}
                        onChange={(e) => handleFooterChange("basecampAddress", e.target.value)}
                        placeholder={t("placeholderBasecamp")}
                      />
                    </div>
                  </div>

                  {/* Studio Owner & Copyright */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="owner-name" className="text-xs font-medium">
                        {t("labelOwnerName")}
                      </Label>
                      <Input
                        id="owner-name"
                        className="h-8 text-xs font-sans"
                        value={settings.footer.ownerName}
                        onChange={(e) => handleFooterChange("ownerName", e.target.value)}
                        placeholder={t("placeholderOwnerName")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="copyright-text" className="text-xs font-medium">
                        {t("labelCopyright")}
                      </Label>
                      <Input
                        id="copyright-text"
                        className="h-8 text-xs font-sans"
                        value={settings.footer.copyrightText}
                        onChange={(e) => handleFooterChange("copyrightText", e.target.value)}
                        placeholder={t("placeholderCopyright")}
                      />
                    </div>
                  </div>

                  {/* Editorial Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="footer-desc" className="text-xs font-medium">
                      {t("labelFooterDesc")}
                    </Label>
                    <Input
                      id="footer-desc"
                      className="h-8 text-xs font-sans"
                      value={settings.footer.description}
                      onChange={(e) => handleFooterChange("description", e.target.value)}
                      placeholder={t("placeholderFooterDesc")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Footer Preview */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-card shadow-xs border-border">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {t("previewFooterTitle")}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {t("previewFooterDesc")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4 text-xs">
                    <div className="flex items-center gap-2.5 pb-2 border-b">
                      <span className="font-serif font-bold text-sm text-foreground">
                        {settings.branding.brandName}
                      </span>
                      <Badge variant="outline" className="text-[10px] py-0">
                        {settings.footer.basecampAddress ||
                          DEFAULT_GENERAL_SETTINGS.footer.basecampAddress}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                      {settings.footer.description}
                    </p>

                    <div className="space-y-2 pt-1 border-t">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <MessageCircle className="size-3 text-emerald-500" />
                          <span>{t("previewLabelWhatsapp")}</span>
                        </span>
                        <a
                          href={settings.footer.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-primary hover:underline flex items-center gap-1"
                        >
                          <span>{settings.footer.whatsappNumber || "-"}</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Camera className="size-3 text-pink-500" />
                          <span>{t("previewLabelInstagram")}</span>
                        </span>
                        <a
                          href={settings.footer.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-primary hover:underline flex items-center gap-1"
                        >
                          <span>{settings.footer.instagramHandle || "-"}</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Mail className="size-3 text-primary" />
                          <span>{t("previewLabelEmail")}</span>
                        </span>
                        <span className="font-mono text-muted-foreground">
                          {settings.footer.email || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t text-[10px] text-muted-foreground flex items-center justify-between">
                      <span>
                        {t("previewLabelOwner")} {settings.footer.ownerName}
                      </span>
                      <span>
                        {t("previewCopyrightSymbol")} {new Date().getFullYear()}{" "}
                        {settings.footer.copyrightText}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 3: ORDERS & POLICY */}
        {/* ============================================================== */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Form Controls */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="bg-card shadow-xs">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <Receipt className="size-4 text-primary" />
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {t("sectionOrdersTitle")}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {t("sectionOrdersDesc")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {/* Down Payment % Setting */}
                  <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="dp-percent"
                        className="text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Percent className="size-3.5 text-primary" />
                        <span>{t("labelDownPayment")}</span>
                      </Label>
                      <Badge className="font-mono text-xs px-2.5 py-0.5">
                        {settings.orders.downPaymentPercent}
                        {t("percentSymbol")}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-muted-foreground">{t("hintDownPayment")}</p>

                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        id="dp-percent"
                        type="number"
                        min={10}
                        max={100}
                        className="h-8 text-xs font-mono w-24"
                        value={settings.orders.downPaymentPercent}
                        onChange={(e) => {
                          const val = Number.parseInt(e.target.value, 10);
                          if (!Number.isNaN(val)) {
                            handleOrdersChange(
                              "downPaymentPercent",
                              Math.min(100, Math.max(10, val)),
                            );
                          }
                        }}
                      />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[20, 30, 50, 100].map((preset) => (
                          <Button
                            key={preset}
                            type="button"
                            variant={
                              settings.orders.downPaymentPercent === preset ? "default" : "outline"
                            }
                            size="sm"
                            className="h-7 text-xs px-2.5 rounded-full"
                            onClick={() => handleOrdersChange("downPaymentPercent", preset)}
                          >
                            {preset}
                            {t("percentSymbol")}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tracking Code Prefix */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tracking-prefix" className="text-xs font-medium">
                        {t("labelPrefix")}
                      </Label>
                      <Badge variant="outline" className="text-[10px] font-mono py-0">
                        {t("previewPrefixLabel")} {settings.orders.trackingCodePrefix}
                        {t("previewSampleNumber")}
                      </Badge>
                    </div>
                    <Input
                      id="tracking-prefix"
                      className="h-8 text-xs font-mono"
                      value={settings.orders.trackingCodePrefix}
                      onChange={(e) =>
                        handleOrdersChange("trackingCodePrefix", e.target.value.toUpperCase())
                      }
                      placeholder={t("placeholderPrefix")}
                    />
                    <p className="text-[11px] text-muted-foreground">{t("hintPrefix")}</p>
                  </div>

                  {/* Payment Due Window */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="payment-due"
                      className="text-xs font-medium flex items-center gap-1.5"
                    >
                      <Clock className="size-3 text-muted-foreground" />
                      <span>{t("labelPaymentDue")}</span>
                    </Label>
                    <Input
                      id="payment-due"
                      type="number"
                      min={1}
                      max={168}
                      className="h-8 text-xs font-mono w-32"
                      value={settings.orders.paymentDueHours}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value, 10);
                        if (!Number.isNaN(val)) {
                          handleOrdersChange("paymentDueHours", Math.max(1, val));
                        }
                      }}
                    />
                    <p className="text-[11px] text-muted-foreground">{t("hintPaymentDue")}</p>
                  </div>

                  {/* Operating Hours for On-Call Photographers */}
                  <div className="space-y-1.5 pt-2 border-t">
                    <Label className="text-xs font-medium flex items-center gap-1.5">
                      <Calendar className="size-3 text-primary" />
                      <span>{t("labelOperatingHours")}</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="start-hour" className="text-[11px] text-muted-foreground">
                          {t("labelStartHour")}
                        </Label>
                        <Input
                          id="start-hour"
                          className="h-8 text-xs font-mono"
                          value={settings.orders.operatingHoursStart}
                          onChange={(e) =>
                            handleOrdersChange("operatingHoursStart", e.target.value)
                          }
                          placeholder={t("placeholderTimeStart")}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="end-hour" className="text-[11px] text-muted-foreground">
                          {t("labelEndHour")}
                        </Label>
                        <Input
                          id="end-hour"
                          className="h-8 text-xs font-mono"
                          value={settings.orders.operatingHoursEnd}
                          onChange={(e) => handleOrdersChange("operatingHoursEnd", e.target.value)}
                          placeholder={t("placeholderTimeEnd")}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-Time Deposit Simulation Card */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="bg-card shadow-xs border-border">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {t("simulationTitle")}
                      </CardTitle>
                      <CardDescription className="text-xs">{t("simulationDesc")}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Dynamic Simulation Table */}
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="text-[11px]">{t("colPackage")}</TableHead>
                          <TableHead className="text-[11px] text-right">
                            {t("colBasePrice")}
                          </TableHead>
                          <TableHead className="text-[11px] text-right font-semibold text-primary">
                            {t("colDeposit", { percent: currentDp })}
                          </TableHead>
                          <TableHead className="text-[11px] text-right">
                            {t("colRemaining")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {AUTHENTIC_PACKAGES.map((pkg) => {
                          const dp = Math.round((pkg.price * currentDp) / 100);
                          const rem = pkg.price - dp;
                          return (
                            <TableRow key={pkg.name}>
                              <TableCell className="text-xs font-medium font-serif">
                                {pkg.name}
                              </TableCell>
                              <TableCell className="text-xs font-mono text-right text-muted-foreground">
                                {formatPrice(pkg.price)}
                              </TableCell>
                              <TableCell className="text-xs font-mono text-right font-bold text-primary">
                                {formatPrice(dp)}
                              </TableCell>
                              <TableCell className="text-xs font-mono text-right text-muted-foreground">
                                {formatPrice(rem)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Benchmark note */}
                  <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground flex items-start gap-2">
                    <Sparkles className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>
                      {t("simExampleNote", {
                        dpSim: formatPrice(sampleDp),
                        remSim: formatPrice(sampleRem),
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Reset Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{t("dialogResetTitle")}</DialogTitle>
            <DialogDescription className="text-xs font-sans">
              {t("dialogResetDesc")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsResetDialogOpen(false)}
            >
              {t("btnCancelReset")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 text-xs"
              onClick={handleConfirmReset}
            >
              {t("btnConfirmReset")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

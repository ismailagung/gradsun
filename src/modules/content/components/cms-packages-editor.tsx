"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  Laptop,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Trash2,
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
  CardFooter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import type { PackageWithAddons } from "@/modules/packages/repositories/package.repository";
import { updatePackagesContentAction } from "../actions/update-packages-content.action";
import {
  DEFAULT_PACKAGES_CONTENT,
  type PackageCardPresentation,
  type PackagesCms,
} from "../schemas/content-settings.schema";
import { ImageUploaderField } from "./image-uploader-field";

interface CmsPackagesEditorProps {
  initialContent: PackagesCms;
  availablePackages: PackageWithAddons[];
}

export function CmsPackagesEditor({ initialContent, availablePackages }: CmsPackagesEditorProps) {
  const tCms = useTranslations("adminCms");
  const tPackages = useTranslations("adminPackages");

  const [content, setContent] = useState<PackagesCms>(initialContent);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  // Section 1: Intro & Vow state
  const [savingIntro, setSavingIntro] = useState(false);
  const [savedIntro, setSavedIntro] = useState(false);
  const [isResetIntroDialogOpen, setIsResetIntroDialogOpen] = useState(false);

  // Section 2: Presentation Cards state
  const [savingCards, setSavingCards] = useState(false);
  const [savedCards, setSavedCards] = useState(false);
  const [isResetCardsDialogOpen, setIsResetCardsDialogOpen] = useState(false);

  // Card Modal Dialogs
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [isDeleteCardDialogOpen, setIsDeleteCardDialogOpen] = useState(false);
  const [deletingCard, setDeletingCard] = useState<PackageCardPresentation | null>(null);

  // Card Form State
  const [cardPackageId, setCardPackageId] = useState("");
  const [cardThumbnailUrl, setCardThumbnailUrl] = useState("/logo-bg.jpg");
  const [cardBadge, setCardBadge] = useState("");
  const [cardFeatures, setCardFeatures] = useState<string[]>([]);
  const [cardOrder, setCardOrder] = useState(0);

  const isMobile = device === "mobile";

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Section 1 Handlers
  const handleIntroChange = (field: keyof Omit<PackagesCms, "cards">, value: string) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSavedIntro(false);
  };

  const handleSaveIntro = async () => {
    setSavingIntro(true);
    try {
      const res = await updatePackagesContentAction(content);
      if (res?.data) {
        setContent(res.data);
        setSavedIntro(true);
        setTimeout(() => setSavedIntro(false), 3000);
      }
    } catch {
      // Fallback
    } finally {
      setSavingIntro(false);
    }
  };

  const handleResetIntro = () => {
    setContent((prev) => ({
      ...prev,
      seasonTag: DEFAULT_PACKAGES_CONTENT.seasonTag,
      title: DEFAULT_PACKAGES_CONTENT.title,
      subtitle: DEFAULT_PACKAGES_CONTENT.subtitle,
    }));
    setIsResetIntroDialogOpen(false);
    setSavedIntro(false);
  };

  // Section 2 Handlers
  const handleSaveCards = async () => {
    setSavingCards(true);
    try {
      const res = await updatePackagesContentAction(content);
      if (res?.data) {
        setContent(res.data);
        setSavedCards(true);
        setTimeout(() => setSavedCards(false), 3000);
      }
    } catch {
      // Fallback
    } finally {
      setSavingCards(false);
    }
  };

  const handleResetCards = () => {
    setContent((prev) => ({
      ...prev,
      cards: DEFAULT_PACKAGES_CONTENT.cards,
    }));
    setIsResetCardsDialogOpen(false);
    setSavedCards(false);
  };

  // Card CRUD Handlers
  const openAddCardDialog = () => {
    setEditingCardId(null);
    setCardPackageId(availablePackages[0]?.id || "");
    setCardThumbnailUrl("/logo-bg.jpg");
    setCardBadge("");
    setCardFeatures(["", ""]);
    setCardOrder((content.cards.length ?? 0) + 1);
    setIsCardDialogOpen(true);
  };

  const openEditCardDialog = (card: PackageCardPresentation) => {
    setEditingCardId(card.id);
    setCardPackageId(card.packageId);
    setCardThumbnailUrl(card.thumbnailUrl);
    setCardBadge(card.badge || "");
    setCardFeatures(
      card.customFeatures && card.customFeatures.length > 0 ? card.customFeatures : [""],
    );
    setCardOrder(card.order);
    setIsCardDialogOpen(true);
  };

  const openDeleteCardDialog = (card: PackageCardPresentation) => {
    setDeletingCard(card);
    setIsDeleteCardDialogOpen(true);
  };

  const handleAddFeatureBullet = () => {
    setCardFeatures((prev) => [...prev, ""]);
  };

  const handleFeatureChange = (index: number, val: string) => {
    setCardFeatures((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveFeature = (index: number) => {
    setCardFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCardModal = () => {
    if (!cardPackageId) return;

    const cleanFeatures = cardFeatures.filter((f) => f.trim().length > 0);

    if (editingCardId) {
      setContent((prev) => ({
        ...prev,
        cards: prev.cards.map((c) =>
          c.id === editingCardId
            ? {
                ...c,
                packageId: cardPackageId,
                thumbnailUrl: cardThumbnailUrl,
                badge: cardBadge.trim(),
                customFeatures: cleanFeatures,
                order: cardOrder,
              }
            : c,
        ),
      }));
    } else {
      const newCard: PackageCardPresentation = {
        id: `card-${Date.now()}`,
        packageId: cardPackageId,
        thumbnailUrl: cardThumbnailUrl,
        badge: cardBadge.trim(),
        customFeatures: cleanFeatures,
        order: cardOrder,
      };
      setContent((prev) => ({
        ...prev,
        cards: [...prev.cards, newCard],
      }));
    }

    setIsCardDialogOpen(false);
  };

  const handleDeleteCardConfirm = () => {
    if (!deletingCard) return;
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.filter((c) => c.id !== deletingCard.id),
    }));
    setIsDeleteCardDialogOpen(false);
    setDeletingCard(null);
  };

  const handleMoveCard = (index: number, direction: "up" | "down") => {
    setContent((prev) => {
      const newCards = [...prev.cards];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newCards.length) return prev;

      const temp = newCards[index];
      newCards[index] = newCards[targetIndex];
      newCards[targetIndex] = temp;

      return {
        ...prev,
        cards: newCards.map((c, i) => ({ ...c, order: i + 1 })),
      };
    });
  };

  const findLinkedPackage = (pkgId: string) => {
    return availablePackages.find((p) => p.id === pkgId || p.slug === pkgId);
  };

  const getFeaturePlaceholder = (index: number) => {
    if (index === 0) return tCms("placeholderFeature1");
    if (index === 1) return tCms("placeholderFeature2");
    if (index === 2) return tCms("placeholderFeature3");
    return tCms("placeholderFeature");
  };

  const selectedPkgDetails = availablePackages.find(
    (p) => p.id === cardPackageId || p.slug === cardPackageId,
  );

  return (
    <div className="space-y-6">
      {/* CMS Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
            {tCms("packagesTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">{tCms("packagesDesc")}</p>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 border-primary/40 bg-primary/5 text-primary font-sans text-xs"
          >
            <Eye className="size-3" />
            <span>{tCms("previewBadge")}</span>
          </Badge>

          <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
            <Button
              variant={!isMobile ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs gap-1.5"
              onClick={() => setDevice("desktop")}
            >
              <Laptop className="size-3.5" />
              <span>{tCms("previewDesktop")}</span>
            </Button>
            <Button
              variant={isMobile ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs gap-1.5"
              onClick={() => setDevice("mobile")}
            >
              <Smartphone className="size-3.5" />
              <span>{tCms("previewMobile")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Editor (Left) & Live Preview (Right) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* SECTION 1: Headline, Narrative & Weather Guarantee Vow */}
          <Card className="bg-card shadow-xs">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-base font-semibold">
                    {tCms("sectionPackagesIntro")}
                  </CardTitle>
                  <CardDescription className="text-xs">{tCms("packagesDesc")}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="intro-title" className="text-xs font-medium">
                  {tCms("labelPackagesHeading")}
                </Label>
                <Input
                  id="intro-title"
                  value={content.title}
                  onChange={(e) => handleIntroChange("title", e.target.value)}
                  className="h-8 text-xs font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="intro-subtitle" className="text-xs font-medium">
                  {tCms("labelPackagesSubtitle")}
                </Label>
                <Input
                  id="intro-subtitle"
                  value={content.subtitle}
                  onChange={(e) => handleIntroChange("subtitle", e.target.value)}
                  className="h-8 text-xs font-sans"
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-3 bg-muted/10">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => setIsResetIntroDialogOpen(true)}
              >
                <RotateCcw className="size-3" />
                <span>{tCms("btnResetPackagesIntro")}</span>
              </Button>

              <div className="flex items-center gap-2">
                {savedIntro && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs"
                  >
                    <Check className="size-3" />
                    <span>{tCms("sectionSavedSuccess")}</span>
                  </Badge>
                )}
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={handleSaveIntro}
                  disabled={savingIntro}
                >
                  {savingIntro ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  <span>{savingIntro ? tCms("btnSaving") : tCms("btnSavePackagesIntro")}</span>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* SECTION 2: Storefront Showcase Cards (Visual Presentation) */}
          <Card className="bg-card shadow-xs">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="font-serif text-base font-semibold">
                    {tCms("sectionPackagesCards")}
                  </CardTitle>
                  <CardDescription className="text-xs">{tCms("dialogCardDesc")}</CardDescription>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5 shrink-0"
                  onClick={openAddCardDialog}
                >
                  <Plus className="size-3.5" />
                  <span>{tCms("btnAddPackageCard")}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {content.cards.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  {tCms("noPackageCards")}
                </div>
              ) : (
                <div className="space-y-2">
                  {content.cards.map((card, index) => {
                    const linkedPkg = findLinkedPackage(card.packageId);
                    return (
                      <div
                        key={card.id}
                        className="flex items-center justify-between gap-3 p-3 border rounded-xl bg-card hover:bg-muted/20 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Card order badge */}
                          <span className="text-[11px] font-mono font-medium text-muted-foreground w-5 text-center shrink-0">
                            {tCms("cardOrderNumber", { order: index + 1 })}
                          </span>

                          {/* Arched Thumbnail Preview */}
                          <div className="relative w-10 h-14 rounded-t-xl rounded-b-xs overflow-hidden bg-muted border shrink-0">
                            <Image
                              src={card.thumbnailUrl}
                              alt={linkedPkg?.title || card.packageId}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>

                          {/* Card Details */}
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-xs text-foreground truncate">
                                {linkedPkg ? linkedPkg.title : tCms("unlinkedPackageWarning")}
                              </span>
                              {card.badge && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 font-medium"
                                >
                                  {card.badge}
                                </Badge>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {`${linkedPkg ? formatPrice(linkedPkg.basePrice) : "-"} • ${tCms("cardHighlightsCount", { count: card.customFeatures.length })}`}
                            </span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleMoveCard(index, "up")}
                            disabled={index === 0}
                            aria-label={tCms("btnMoveUp")}
                          >
                            <ArrowUp className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleMoveCard(index, "down")}
                            disabled={index === content.cards.length - 1}
                            aria-label={tCms("btnMoveDown")}
                          >
                            <ArrowDown className="size-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2 gap-1"
                            onClick={() => openEditCardDialog(card)}
                          >
                            <span>{tCms("btnEditCard")}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => openDeleteCardDialog(card)}
                            aria-label={tCms("btnDeleteCard")}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-3 bg-muted/10">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => setIsResetCardsDialogOpen(true)}
              >
                <RotateCcw className="size-3" />
                <span>{tCms("btnResetPackagesCards")}</span>
              </Button>

              <div className="flex items-center gap-2">
                {savedCards && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs"
                  >
                    <Check className="size-3" />
                    <span>{tCms("sectionSavedSuccess")}</span>
                  </Badge>
                )}
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={handleSaveCards}
                  disabled={savingCards}
                >
                  {savingCards ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  <span>{savingCards ? tCms("btnSaving") : tCms("btnSavePackagesCards")}</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Live Storefront Preview */}
        <div className="lg:col-span-6 sticky top-20">
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="py-2.5 px-4 border-b bg-muted/40">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">
                  {"gradsun.studio/packages"}
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  {`${device} view`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-background max-h-[80vh] overflow-y-auto">
              <div
                className={`mx-auto transition-all duration-300 p-4 sm:p-6 ${
                  isMobile ? "max-w-[360px]" : "w-full"
                }`}
              >
                {/* Header Intro */}
                <div className="space-y-2 pb-6 border-b">
                  <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {content.title}
                  </h1>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {content.subtitle}
                  </p>
                </div>

                {/* Arched Showcase Cards Grid */}
                <div className="pt-6">
                  <div
                    className={`grid gap-4 ${
                      isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {content.cards.map((card) => {
                      const linkedPkg = findLinkedPackage(card.packageId);
                      return (
                        <div
                          key={card.id}
                          className="rounded-t-[2.5rem] rounded-b-xl border bg-card p-3 shadow-2xs flex flex-col justify-between"
                        >
                          <div>
                            {/* Arched Top Image */}
                            <div className="relative aspect-[3/4] rounded-t-[2.2rem] rounded-b-lg overflow-hidden bg-muted mb-3">
                              <Image
                                src={card.thumbnailUrl}
                                alt={linkedPkg?.title || "Package thumbnail"}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                              {card.badge && (
                                <Badge className="absolute top-2.5 left-2.5 bg-background/90 text-foreground backdrop-blur-xs text-[10px] font-medium shadow-xs border">
                                  {card.badge}
                                </Badge>
                              )}
                            </div>

                            {/* Title & Price */}
                            <div className="space-y-1 mb-3">
                              <h3 className="font-serif text-sm font-bold text-foreground">
                                {linkedPkg ? linkedPkg.title : tCms("unlinkedPackageWarning")}
                              </h3>
                              <p className="font-mono text-xs font-semibold text-primary">
                                {linkedPkg ? formatPrice(linkedPkg.basePrice) : "-"}
                              </p>
                              {linkedPkg && (
                                <p className="text-[10px] text-muted-foreground">
                                  {`${linkedPkg.durationMinutes} ${tPackages("minutesSuffix")} • ${linkedPkg.editQuota} ${tPackages("photosSuffix")}`}
                                </p>
                              )}
                            </div>

                            {/* Features list */}
                            {card.customFeatures.length > 0 && (
                              <ul className="space-y-1 mb-4">
                                {card.customFeatures.map((feat) => (
                                  <li
                                    key={`${card.id}-${feat}`}
                                    className="flex items-start gap-1.5 text-[10px] text-muted-foreground"
                                  >
                                    <Check className="size-3 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <Button size="sm" className="w-full h-7 text-[11px] mt-2">
                            {tCms("btnBookTier")}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add / Edit Presentation Card Dialog */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-x-hidden overflow-y-auto">
          <DialogHeader className="pb-3 border-b">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="font-serif text-lg font-semibold text-foreground">
                  {editingCardId ? tCms("dialogEditCardTitle") : tCms("dialogAddCardTitle")}
                </DialogTitle>
                <DialogDescription className="text-xs font-sans text-muted-foreground mt-0.5">
                  {tCms("dialogCardDesc")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Select Master Package */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{tCms("labelSelectPackage")}</Label>
              <Select value={cardPackageId} onValueChange={setCardPackageId}>
                <SelectTrigger className="h-8 text-xs w-full">
                  <SelectValue placeholder={tCms("labelSelectPackage")} />
                </SelectTrigger>
                <SelectContent>
                  {availablePackages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id} className="text-xs">
                      {`${pkg.title} (${formatPrice(pkg.basePrice)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPkgDetails ? (
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-2 font-normal text-muted-foreground border-border bg-muted/40"
                  >
                    {`${selectedPkgDetails.durationMinutes} ${tPackages("minutesSuffix")}`}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-2 font-normal text-muted-foreground border-border bg-muted/40"
                  >
                    {`${selectedPkgDetails.editQuota} ${tPackages("photosSuffix")}`}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-2 font-normal text-muted-foreground border-border bg-muted/40"
                  >
                    {tCms("dpPill", { percent: selectedPkgDetails.downPaymentPercent })}
                  </Badge>
                </div>
              ) : null}
            </div>

            {/* Arched Thumbnail Photo via ImageUploaderField */}
            <ImageUploaderField
              label={tCms("labelCardThumbnail")}
              value={cardThumbnailUrl}
              onChange={setCardThumbnailUrl}
              folder="packages"
              aspectRatio="arch"
            />

            {/* Marketing Ribbon Badge */}
            <div className="space-y-1.5">
              <Label htmlFor="card-badge" className="text-xs font-medium">
                {tCms("labelCardBadge")}
              </Label>
              <Input
                id="card-badge"
                value={cardBadge}
                onChange={(e) => setCardBadge(e.target.value)}
                placeholder={tCms("placeholderCardBadge")}
                className="h-8 text-xs font-sans"
              />
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] text-muted-foreground">
                  {tCms("labelQuickSuggestions")}
                </span>
                {[
                  tCms("tagMostPopular"),
                  tCms("tagBestValue"),
                  tCms("tagClassicSolo"),
                  tCms("tagLimitedEdition"),
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-5 text-[10px] px-2 py-0 rounded-full border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => setCardBadge(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Features Bullets */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">{tCms("labelCardFeatures")}</Label>
                  <p className="text-[11px] text-muted-foreground">{tCms("hintCardFeatures")}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={handleAddFeatureBullet}
                >
                  <Plus className="size-3" />
                  <span>{tCms("btnAddFeatureBullet")}</span>
                </Button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {cardFeatures.map((feat, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: form inputs
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground w-4 text-right">
                      {tCms("bulletNumber", { num: idx + 1 })}
                    </span>
                    <Input
                      value={feat}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      placeholder={getFeaturePlaceholder(idx)}
                      className="h-8 text-xs font-sans flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveFeature(idx)}
                      aria-label={tCms("btnRemoveBullet")}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsCardDialogOpen(false)}
            >
              {tPackages("btnCancel")}
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleSaveCardModal}>
              <Check className="size-3.5" />
              <span>{tPackages("btnSave")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Card Confirmation Dialog */}
      <Dialog open={isDeleteCardDialogOpen} onOpenChange={setIsDeleteCardDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{tCms("dialogDeleteCardTitle")}</DialogTitle>
            <DialogDescription className="text-xs font-sans">
              {tCms("dialogDeleteCardDesc")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsDeleteCardDialogOpen(false)}
            >
              {tPackages("btnCancel")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 text-xs"
              onClick={handleDeleteCardConfirm}
            >
              {tCms("btnDeleteCard")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Section 1 Confirmation Dialog */}
      <Dialog open={isResetIntroDialogOpen} onOpenChange={setIsResetIntroDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {tCms("dialogResetPackagesIntroTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs font-sans">
              {tCms("dialogResetPackagesIntroDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsResetIntroDialogOpen(false)}
            >
              {tCms("btnCancel")}
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={handleResetIntro}>
              {tCms("btnConfirmReset")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Section 2 Confirmation Dialog */}
      <Dialog open={isResetCardsDialogOpen} onOpenChange={setIsResetCardsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {tCms("dialogResetPackagesCardsTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs font-sans">
              {tCms("dialogResetPackagesCardsDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsResetCardsDialogOpen(false)}
            >
              {tCms("btnCancel")}
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={handleResetCards}>
              {tCms("btnConfirmReset")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

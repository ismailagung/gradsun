"use client";

import {
  Check,
  Edit2,
  Eye,
  Laptop,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Sun,
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
import { updateGalleryContentAction } from "../actions/update-gallery-content.action";
import {
  DEFAULT_GALLERY_CONTENT,
  DEFAULT_GALLERY_ITEMS,
  type GalleryCms,
  type GalleryPortfolioItem,
} from "../schemas/content-settings.schema";
import { ImageUploaderField } from "./image-uploader-field";

interface CmsGalleryEditorProps {
  initialContent: GalleryCms;
}

type SectionKey = "header" | "portfolio";

export function CmsGalleryEditor({ initialContent }: CmsGalleryEditorProps) {
  const tCms = useTranslations("adminCms");

  const [content, setContent] = useState<GalleryCms>(initialContent);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const [savingSection, setSavingSection] = useState<SectionKey | null>(null);
  const [savedSection, setSavedSection] = useState<SectionKey | null>(null);
  const [resetConfirmSection, setResetConfirmSection] = useState<SectionKey | null>(null);

  // Item Add / Edit Modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemFormData, setItemFormData] = useState<Omit<GalleryPortfolioItem, "id" | "order">>({
    title: "",
    category: "Solo Graduation",
    description: "",
    imageUrl: "/logo-bg.jpg",
    aspectRatio: "portrait",
  });

  // Item Delete Confirmation state
  const [itemToDelete, setItemToDelete] = useState<GalleryPortfolioItem | null>(null);

  // Lightbox Preview in Live Preview
  const [lightboxItem, setLightboxItem] = useState<GalleryPortfolioItem | null>(null);

  const isMobile = device === "mobile";

  const handleHeaderChange = (field: "tag" | "title" | "subtitle", value: string) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSection = async (section: SectionKey) => {
    setSavingSection(section);
    try {
      const res = await updateGalleryContentAction(content);
      if (res?.data) {
        setSavedSection(section);
        setTimeout(() => setSavedSection((prev) => (prev === section ? null : prev)), 3000);
      }
    } catch {
      // offline fallback
    } finally {
      setSavingSection(null);
    }
  };

  const handleConfirmReset = async () => {
    if (!resetConfirmSection) return;
    const targetSection = resetConfirmSection;
    setResetConfirmSection(null);

    let updatedContent: GalleryCms = { ...content };
    if (targetSection === "header") {
      updatedContent = {
        ...content,
        tag: DEFAULT_GALLERY_CONTENT.tag,
        title: DEFAULT_GALLERY_CONTENT.title,
        subtitle: DEFAULT_GALLERY_CONTENT.subtitle,
      };
    } else if (targetSection === "portfolio") {
      updatedContent = {
        ...content,
        items: JSON.parse(JSON.stringify(DEFAULT_GALLERY_ITEMS)),
      };
    }

    setContent(updatedContent);

    try {
      setSavingSection(targetSection);
      const res = await updateGalleryContentAction(updatedContent);
      if (res?.data) {
        setSavedSection(targetSection);
        setTimeout(() => setSavedSection((prev) => (prev === targetSection ? null : prev)), 3000);
      }
    } catch {
      // offline fallback
    } finally {
      setSavingSection(null);
    }
  };

  const openAddItemModal = () => {
    setEditingItemId(null);
    setItemFormData({
      title: "",
      category: "Solo Graduation",
      description: "",
      imageUrl: "/logo-bg.jpg",
      aspectRatio: "portrait",
    });
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: GalleryPortfolioItem) => {
    setEditingItemId(item.id);
    setItemFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      aspectRatio: item.aspectRatio,
    });
    setIsItemModalOpen(true);
  };

  const handleSaveItemForm = () => {
    if (!itemFormData.title.trim() || !itemFormData.description.trim()) return;

    if (editingItemId) {
      // Update existing item
      setContent((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === editingItemId
            ? {
                ...it,
                ...itemFormData,
              }
            : it,
        ),
      }));
    } else {
      // Add new item
      const newItem: GalleryPortfolioItem = {
        id: `gallery-item-${Date.now()}`,
        ...itemFormData,
        order: content.items.length + 1,
      };
      setContent((prev) => ({
        ...prev,
        items: [newItem, ...prev.items],
      }));
    }
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    setContent((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== itemToDelete.id),
    }));
    setItemToDelete(null);
  };

  // Filter items for Live Preview
  const filteredPreviewItems = content.items.filter((it) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "solo") return it.category.toLowerCase().includes("solo");
    if (activeFilter === "cohort")
      return (
        it.category.toLowerCase().includes("cohort") ||
        it.category.toLowerCase().includes("besties") ||
        it.category.toLowerCase().includes("group")
      );
    if (activeFilter === "golden") return it.category.toLowerCase().includes("golden");
    if (activeFilter === "studio") return it.category.toLowerCase().includes("studio");
    return true;
  });

  return (
    <div className="space-y-6">
      {/* CMS Header & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
            {tCms("galleryTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">{tCms("galleryDesc")}</p>
        </div>

        <div className="flex items-center gap-2">
          {savedSection && (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs"
            >
              <Check className="size-3" />
              <span>{tCms("sectionSavedSuccess")}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Main Split Grid: Editor (Left 5 cols) & Live Preview (Right 7 cols) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. GALLERY HEADER COPY CARD */}
          <Card className="bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                {tCms("sectionGalleryHeader")}
              </CardTitle>
              <CardDescription className="text-xs">{tCms("galleryDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionTag")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.tag}
                  onChange={(e) => handleHeaderChange("tag", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionTitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.title}
                  onChange={(e) => handleHeaderChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {tCms("labelSectionSubtitle")}
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={content.subtitle}
                  onChange={(e) => handleHeaderChange("subtitle", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-3 bg-muted/20">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setResetConfirmSection("header")}
              >
                <RotateCcw className="size-3" />
                <span>{tCms("btnResetGalleryCopy")}</span>
              </Button>
              <div className="flex items-center gap-2">
                {savedSection === "header" && (
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {tCms("sectionSavedSuccess")}
                  </span>
                )}
                <Button
                  type="button"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  disabled={savingSection === "header"}
                  onClick={() => handleSaveSection("header")}
                >
                  {savingSection === "header" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Save className="size-3" />
                  )}
                  <span>
                    {savingSection === "header" ? tCms("btnSaving") : tCms("btnSaveGalleryCopy")}
                  </span>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* 2. PORTFOLIO SHOWCASE COLLECTION CARD */}
          <Card className="bg-card shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-semibold">
                  {tCms("sectionGalleryPortfolio")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {`${content.items.length} exhibition items`}
                </CardDescription>
              </div>
              <Button
                type="button"
                size="sm"
                className="h-7 text-xs gap-1 shadow-xs"
                onClick={openAddItemModal}
              >
                <Plus className="size-3.5" />
                <span>{tCms("btnAddPortfolioItem")}</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {content.items.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                  {tCms("noPortfolioItems")}
                </div>
              ) : (
                <div className="divide-y divide-border/60 max-h-[380px] overflow-y-auto pr-1">
                  {content.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative size-11 rounded-lg overflow-hidden bg-muted border shrink-0">
                          <Image
                            src={item.imageUrl || "/logo-bg.jpg"}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="font-serif text-xs font-semibold truncate leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-muted-foreground truncate leading-tight">
                            {item.description}
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 h-4 border-border font-normal"
                          >
                            {item.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="size-7 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => openEditItemModal(item)}
                        >
                          <Edit2 className="size-3" />
                          <span className="sr-only">{tCms("btnEditPortfolioItem")}</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="size-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => setItemToDelete(item)}
                        >
                          <Trash2 className="size-3" />
                          <span className="sr-only">{tCms("btnDeletePortfolioItem")}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-3 bg-muted/20">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setResetConfirmSection("portfolio")}
              >
                <RotateCcw className="size-3" />
                <span>{tCms("btnResetPortfolioCollection")}</span>
              </Button>
              <div className="flex items-center gap-2">
                {savedSection === "portfolio" && (
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {tCms("sectionSavedSuccess")}
                  </span>
                )}
                <Button
                  type="button"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  disabled={savingSection === "portfolio"}
                  onClick={() => handleSaveSection("portfolio")}
                >
                  {savingSection === "portfolio" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Save className="size-3" />
                  )}
                  <span>
                    {savingSection === "portfolio"
                      ? tCms("btnSaving")
                      : tCms("btnSavePortfolioCollection")}
                  </span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Full 1-Page Gallery Live Preview */}
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
                {isMobile ? "gradsun.studio/gallery (mobile)" : "gradsun.studio/gallery (desktop)"}
              </div>
              <div className="size-2" />
            </div>

            {/* Scrollable Gallery Content */}
            <div className="max-h-[680px] overflow-y-auto divide-y divide-border/60">
              {/* Mini Navigation */}
              <div className="px-4 py-2.5 flex items-center justify-between bg-background/95 backdrop-blur-xs sticky top-0 z-20 border-b border-border/40">
                <div className="flex items-center gap-1.5">
                  <Sun className="size-4 text-primary fill-primary" />
                  <span className="font-serif font-bold text-xs tracking-tight text-foreground">
                    {tCms("previewNavBrand")}
                  </span>
                </div>
                {!isMobile && (
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                    <span>{tCms("previewNavHome")}</span>
                    <span className="text-foreground font-semibold">
                      {tCms("previewNavGallery")}
                    </span>
                    <span>{tCms("previewNavPackages")}</span>
                  </div>
                )}
                <Button size="sm" className="h-6 px-2 text-[10px] rounded-lg">
                  <span>{tCms("previewNavBook")}</span>
                </Button>
              </div>

              {/* Gallery Header */}
              <div className="p-4 sm:p-6 space-y-2 text-center bg-card/40">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {content.tag}
                </span>
                <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-foreground">
                  {content.title}
                </h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">{content.subtitle}</p>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
                  {[
                    { key: "all", label: tCms("previewFilterAll") },
                    { key: "solo", label: tCms("previewFilterSolo") },
                    { key: "cohort", label: tCms("previewFilterCohort") },
                    { key: "golden", label: tCms("previewFilterGolden") },
                    { key: "studio", label: tCms("previewFilterStudio") },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      type="button"
                      variant={activeFilter === filter.key ? "secondary" : "outline"}
                      size="sm"
                      className="h-6 px-2.5 text-[10px] rounded-full"
                      onClick={() => setActiveFilter(filter.key)}
                    >
                      <span>{filter.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Dynamic Gallery Showcase Grid */}
              <div className="p-4 sm:p-6">
                {filteredPreviewItems.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    {tCms("noPortfolioItems")}
                  </div>
                ) : (
                  <div
                    className={`grid gap-3.5 ${
                      isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"
                    }`}
                  >
                    {filteredPreviewItems.map((item) => (
                      <Card
                        key={item.id}
                        className="group overflow-hidden border bg-card/60 shadow-2xs hover:shadow-md transition-all cursor-pointer rounded-t-[2rem] rounded-b-xl flex flex-col justify-between"
                        onClick={() => setLightboxItem(item)}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-t-[1.8rem] rounded-b-lg m-1.5 mb-2">
                          <Image
                            src={item.imageUrl || "/logo-bg.jpg"}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Badge
                            variant="secondary"
                            className="absolute top-2 left-2 text-[8px] py-0 px-1.5 bg-background/80 backdrop-blur-xs font-mono"
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <div className="p-2.5 pt-0 space-y-0.5">
                          <h4 className="font-serif text-[11px] font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-[9px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Storefront Footer Preview */}
              <div className="px-4 py-3 bg-muted/40 text-center text-[10px] text-muted-foreground">
                <span>{tCms("previewFooter")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD / EDIT PORTFOLIO ITEM DIALOG */}
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {editingItemId ? tCms("dialogEditPortfolioTitle") : tCms("dialogAddPortfolioTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {tCms("dialogPortfolioDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <ImageUploaderField
              label={tCms("labelPhotoUpload")}
              value={itemFormData.imageUrl}
              onChange={(url) => setItemFormData((prev) => ({ ...prev, imageUrl: url }))}
              folder="gallery"
            />

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{tCms("labelPhotoTitle")}</Label>
              <Input
                className="h-8 text-xs"
                placeholder={tCms("placeholderPhotoTitle")}
                value={itemFormData.title}
                onChange={(e) => setItemFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{tCms("labelPhotoCategory")}</Label>
              <Input
                className="h-8 text-xs"
                placeholder={tCms("placeholderPhotoCategory")}
                value={itemFormData.category}
                onChange={(e) => setItemFormData((prev) => ({ ...prev, category: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{tCms("labelPhotoDescription")}</Label>
              <Input
                className="h-8 text-xs"
                placeholder={tCms("placeholderPhotoDescription")}
                value={itemFormData.description}
                onChange={(e) =>
                  setItemFormData((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsItemModalOpen(false)}
            >
              <span>{tCms("btnCancel")}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs"
              onClick={handleSaveItemForm}
              disabled={!itemFormData.title.trim() || !itemFormData.description.trim()}
            >
              <Check className="size-3 mr-1" />
              <span>{tCms("btnSave")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: RESET CONFIRMATION DIALOG */}
      <Dialog
        open={resetConfirmSection !== null}
        onOpenChange={(open) => !open && setResetConfirmSection(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {resetConfirmSection === "header"
                ? tCms("dialogResetGalleryCopyTitle")
                : tCms("dialogResetPortfolioTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {resetConfirmSection === "header"
                ? tCms("dialogResetGalleryCopyDesc")
                : tCms("dialogResetPortfolioDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setResetConfirmSection(null)}
            >
              <span>{tCms("btnCancel")}</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-8 text-xs"
              onClick={handleConfirmReset}
            >
              <RotateCcw className="size-3 mr-1" />
              <span>{tCms("btnConfirmReset")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: DELETE CONFIRMATION DIALOG */}
      <Dialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {tCms("dialogDeletePhotoTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {tCms("dialogDeletePhotoDesc")}
            </DialogDescription>
          </DialogHeader>
          {itemToDelete && (
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 border">
              <div className="relative size-10 rounded overflow-hidden shrink-0">
                <Image
                  src={itemToDelete.imageUrl || "/logo-bg.jpg"}
                  alt={itemToDelete.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="font-serif text-xs font-semibold truncate">
                  {itemToDelete.title}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {itemToDelete.description}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setItemToDelete(null)}
            >
              <span>{tCms("btnCancel")}</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-8 text-xs"
              onClick={handleDeleteItem}
            >
              <Trash2 className="size-3 mr-1" />
              <span>{tCms("btnDeletePortfolioItem")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: LIGHTBOX EXHIBITION PREVIEW DIALOG */}
      <Dialog open={lightboxItem !== null} onOpenChange={(open) => !open && setLightboxItem(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card border">
          {lightboxItem && (
            <div>
              <div className="relative aspect-[4/5] w-full bg-black">
                <Image
                  src={lightboxItem.imageUrl || "/logo-bg.jpg"}
                  alt={lightboxItem.title}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-foreground">
                    {lightboxItem.title}
                  </h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {lightboxItem.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{lightboxItem.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

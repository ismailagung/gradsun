"use client";

import { Edit, Layers, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
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
import { createPackageAction } from "../actions/create-package.action";
import { deletePackageAction } from "../actions/delete-package.action";
import { updatePackageAction } from "../actions/update-package.action";
import type { PackageWithAddons } from "../repositories/package.repository";
import type { PackageAddonInput } from "../schemas/create-package.schema";

interface AdminPackagesManagerProps {
  initialPackages: PackageWithAddons[];
}

export function AdminPackagesManager({ initialPackages }: AdminPackagesManagerProps) {
  const tPackages = useTranslations("adminPackages");

  const [packages, setPackages] = useState<PackageWithAddons[]>(initialPackages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<PackageWithAddons | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [basePrice, setBasePrice] = useState(1500000);
  const [editQuota, setEditQuota] = useState(5);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [addons, setAddons] = useState<PackageAddonInput[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setDurationMinutes(45);
    setBasePrice(1500000);
    setEditQuota(5);
    setDownPaymentPercent(30);
    setIsActive(true);
    setAddons([]);
    setEditingPackageId(null);
    setErrorMessage(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (pkg: PackageWithAddons) => {
    setEditingPackageId(pkg.id);
    setTitle(pkg.title);
    setSlug(pkg.slug);
    setDescription(pkg.description ?? "");
    setDurationMinutes(pkg.durationMinutes);
    setBasePrice(pkg.basePrice);
    setEditQuota(pkg.editQuota);
    setDownPaymentPercent(pkg.downPaymentPercent);
    setIsActive(pkg.isActive);
    setAddons(
      pkg.addons.map((a) => ({
        name: a.name,
        price: a.price,
        description: a.description,
        maxQuantity: a.maxQuantity,
      })),
    );
    setErrorMessage(null);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (pkg: PackageWithAddons) => {
    setDeletingPackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPackageId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      );
    }
  };

  const handleAddAddon = () => {
    setAddons((prev) => [
      ...prev,
      {
        name: "",
        price: 250000,
        description: "",
        maxQuantity: 1,
      },
    ]);
  };

  const handleRemoveAddon = (index: number) => {
    setAddons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAddon = (
    index: number,
    field: keyof PackageAddonInput,
    value: string | number,
  ) => {
    setAddons((prev) =>
      prev.map((addon, i) => {
        if (i !== index) return addon;
        return {
          ...addon,
          [field]: value,
        };
      }),
    );
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const validAddons = addons.filter((a) => a.name.trim().length > 0);

      if (editingPackageId) {
        const res = await updatePackageAction({
          id: editingPackageId,
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          durationMinutes,
          basePrice,
          editQuota,
          downPaymentPercent,
          isActive,
          addons: validAddons,
        });

        if (res?.data) {
          setPackages((prev) => prev.map((p) => (p.id === editingPackageId ? res.data : p)));
          setIsDialogOpen(false);
        } else if (res?.serverError) {
          setErrorMessage(res.serverError);
        }
      } else {
        const res = await createPackageAction({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          durationMinutes,
          basePrice,
          editQuota,
          downPaymentPercent,
          isActive,
          addons: validAddons,
        });

        if (res?.data) {
          setPackages((prev) => [...prev, res.data]);
          setIsDialogOpen(false);
        } else if (res?.serverError) {
          setErrorMessage(res.serverError);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPackage) return;
    setIsDeleting(true);

    try {
      const res = await deletePackageAction({ id: deletingPackage.id });
      if (res?.data?.success) {
        setPackages((prev) => prev.filter((p) => p.id !== deletingPackage.id));
        setIsDeleteDialogOpen(false);
        setDeletingPackage(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
            {tPackages("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">{tPackages("subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={openCreateDialog}>
            <Plus className="size-3.5" />
            <span>{tPackages("btnCreatePackage")}</span>
          </Button>
        </div>
      </div>

      {/* Service Packages Table */}
      <Card className="bg-card shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <CardTitle className="font-serif text-lg font-medium">
              {tPackages("packagesCatalogTitle")}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {packages.length}{" "}
            {packages.length === 1
              ? "package tier configured."
              : "package tiers configured in PostgreSQL database."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {tPackages("emptyPackages")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tPackages("thName")}</TableHead>
                  <TableHead>{tPackages("thDuration")}</TableHead>
                  <TableHead>{tPackages("thPrice")}</TableHead>
                  <TableHead>{tPackages("thQuota")}</TableHead>
                  <TableHead>{tPackages("thDeposit")}</TableHead>
                  <TableHead>{tPackages("thIsActive")}</TableHead>
                  <TableHead className="text-right">{tPackages("thActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{pkg.title}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {pkg.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {pkg.durationMinutes} {tPackages("minutesSuffix")}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold">
                      {formatPrice(pkg.basePrice)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {pkg.editQuota} {tPackages("photosSuffix")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{`${pkg.downPaymentPercent}%`}</TableCell>
                    <TableCell>
                      {pkg.isActive ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs"
                        >
                          {tPackages("statusActive")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {tPackages("statusArchived")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEditDialog(pkg)}
                          aria-label={tPackages("btnEdit")}
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(pkg)}
                          aria-label={tPackages("btnDelete")}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add-ons Overview Card */}
      <Card className="bg-card shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <CardTitle className="font-serif text-lg font-medium">
              {tPackages("addonsCatalogTitle")}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {"Add-ons configured directly per package tier."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tPackages("thAddonName")}</TableHead>
                <TableHead>{tPackages("thName")}</TableHead>
                <TableHead>{tPackages("thAddonPrice")}</TableHead>
                <TableHead className="text-right">{tPackages("thAddonMax")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.flatMap((pkg) =>
                pkg.addons.map((addon) => (
                  <TableRow key={addon.id}>
                    <TableCell className="font-medium text-foreground">{addon.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{pkg.title}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold">
                      {formatPrice(addon.price)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {addon.maxQuantity}
                    </TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-x-hidden overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingPackageId ? tPackages("dialogEditTitle") : tPackages("dialogCreateTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs font-sans">
              {tPackages("dialogDesc")}
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pkg-title" className="text-xs font-medium">
                  {tPackages("fieldTitle")}
                </Label>
                <Input
                  id="pkg-title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="h-8 text-xs font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkg-slug" className="text-xs font-medium">
                  {tPackages("fieldSlug")}
                </Label>
                <Input
                  id="pkg-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pkg-desc" className="text-xs font-medium">
                {tPackages("fieldDescription")}
              </Label>
              <Input
                id="pkg-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-8 text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pkg-price" className="text-xs font-medium">
                  {tPackages("fieldPrice")}
                </Label>
                <Input
                  id="pkg-price"
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkg-duration" className="text-xs font-medium">
                  {tPackages("fieldDuration")}
                </Label>
                <Input
                  id="pkg-duration"
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkg-quota" className="text-xs font-medium">
                  {tPackages("fieldQuota")}
                </Label>
                <Input
                  id="pkg-quota"
                  type="number"
                  value={editQuota}
                  onChange={(e) => setEditQuota(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkg-deposit" className="text-xs font-medium">
                  {tPackages("fieldDeposit")}
                </Label>
                <Input
                  id="pkg-deposit"
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Included Add-ons Section */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">{tPackages("sectionAddons")}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={handleAddAddon}
                >
                  <Plus className="size-3" />
                  <span>{tPackages("btnAddAddonItem")}</span>
                </Button>
              </div>

              {addons.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">{tPackages("emptyAddons")}</p>
              ) : (
                <div className="space-y-2">
                  {addons.map((addon, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: form items dynamically added
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                      <Input
                        value={addon.name}
                        onChange={(e) => handleUpdateAddon(index, "name", e.target.value)}
                        placeholder={tPackages("addonNamePlaceholder")}
                        className="h-8 text-xs flex-1"
                      />
                      <Input
                        type="number"
                        value={addon.price}
                        onChange={(e) => handleUpdateAddon(index, "price", Number(e.target.value))}
                        placeholder={tPackages("addonPricePlaceholder")}
                        className="h-8 text-xs font-mono w-28"
                      />
                      <Input
                        type="number"
                        value={addon.maxQuantity}
                        onChange={(e) =>
                          handleUpdateAddon(index, "maxQuantity", Number(e.target.value))
                        }
                        placeholder={tPackages("addonMaxPlaceholder")}
                        className="h-8 text-xs font-mono w-16"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => handleRemoveAddon(index)}
                        aria-label={tPackages("btnDeleteAddon")}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsDialogOpen(false)}
            >
              {tPackages("btnCancel")}
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isSaving ? tPackages("saving") : tPackages("btnSave")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{tPackages("dialogDeleteTitle")}</DialogTitle>
            <DialogDescription className="text-xs font-sans">
              {tPackages("dialogDeleteDesc")}
            </DialogDescription>
          </DialogHeader>

          {deletingPackage && (
            <div className="p-3 border rounded-md bg-muted/30 text-xs">
              <span className="font-semibold text-foreground">{deletingPackage.title}</span>
              <p className="text-muted-foreground mt-0.5">{deletingPackage.slug}</p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {tPackages("btnCancel")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
              <span>{tPackages("btnDelete")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

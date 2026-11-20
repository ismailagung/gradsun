"use client";

import { Layers, Plus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";

interface PackageRow {
  id: string;
  name: string;
  slug: string;
  duration: string;
  price: string;
  quota: string;
  deposit: string;
  isActive: boolean;
}

interface AddonRow {
  id: string;
  name: string;
  price: string;
  maxQty: string;
  isActive: boolean;
}

const PACKAGES_LIST: PackageRow[] = [
  {
    id: "pkg-1",
    name: "Solo Commencement",
    slug: "solo-commencement",
    duration: "45 Minutes",
    price: "IDR 1,500,000",
    quota: "15 Edited Photos",
    deposit: "50%",
    isActive: true,
  },
  {
    id: "pkg-2",
    name: "Besties & Duo",
    slug: "besties-duo",
    duration: "60 Minutes",
    price: "IDR 1,950,000",
    quota: "25 Edited Photos",
    deposit: "50%",
    isActive: true,
  },
  {
    id: "pkg-3",
    name: "Sunset Cohort (Group)",
    slug: "sunset-cohort",
    duration: "90 Minutes",
    price: "IDR 2,850,000",
    quota: "40 Edited Photos",
    deposit: "50%",
    isActive: true,
  },
];

const ADDONS_LIST: AddonRow[] = [
  {
    id: "add-1",
    name: "Fine-Art Hardcover Photobook (20 pages)",
    price: "IDR 450,000",
    maxQty: "5 Copies",
    isActive: true,
  },
  {
    id: "add-2",
    name: "24-Hour Express Proofing Turnaround",
    price: "IDR 300,000",
    maxQty: "1 Service",
    isActive: true,
  },
  {
    id: "add-3",
    name: "Set of 5 Archival Cotton Prints (A4 Matted)",
    price: "IDR 250,000",
    maxQty: "10 Sets",
    isActive: true,
  },
];

export default function AdminPackagesPage() {
  const tPackages = useTranslations("adminPackages");

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
          <Button size="sm" className="gap-1.5 h-8">
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
            {"Current tier configurations available on client booking engine."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tPackages("thName")}</TableHead>
                <TableHead>{tPackages("thDuration")}</TableHead>
                <TableHead>{tPackages("thPrice")}</TableHead>
                <TableHead>{tPackages("thQuota")}</TableHead>
                <TableHead>{tPackages("thDeposit")}</TableHead>
                <TableHead className="text-right">{tPackages("thIsActive")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PACKAGES_LIST.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{pkg.name}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {pkg.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{pkg.duration}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{pkg.price}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{pkg.quota}</TableCell>
                  <TableCell className="font-mono text-xs">{pkg.deposit}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default" className="text-xs">
                      {tPackages("statusActive")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add-ons Catalog Table */}
      <Card className="bg-card shadow-xs">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <CardTitle className="font-serif text-lg font-medium">
                {tPackages("addonsCatalogTitle")}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {"A la carte service upgrades available during client checkout."}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 h-8">
            <Plus className="size-3.5" />
            <span>{tPackages("btnAddAddon")}</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tPackages("thAddonName")}</TableHead>
                <TableHead>{tPackages("thAddonPrice")}</TableHead>
                <TableHead>{tPackages("thAddonMax")}</TableHead>
                <TableHead className="text-right">{tPackages("thIsActive")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ADDONS_LIST.map((addon) => (
                <TableRow key={addon.id}>
                  <TableCell className="font-medium text-foreground">{addon.name}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{addon.price}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{addon.maxQty}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default" className="text-xs">
                      {tPackages("statusActive")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

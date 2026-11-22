"use client";

import { Copy, ExternalLink, Images, Plus, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { uploadPhotosAction } from "@/modules/galleries/actions/upload-photos.action";

interface GalleryRecord {
  id: string;
  bookingCode: string;
  client: string;
  photos: string;
  statusKey: "statusApproved" | "statusSelecting";
  statusVariant: "default" | "secondary";
  watermarkKey: "watermarkActive";
  refUrl: string;
}

const GALLERIES_DATA: GalleryRecord[] = [
  {
    id: "gal-1",
    bookingCode: "GS-2025-0842",
    client: "Adinda Prameswari",
    photos: "84 Plates",
    statusKey: "statusApproved",
    statusVariant: "default",
    watermarkKey: "watermarkActive",
    refUrl: "/track-order?ref=GS-2025-0842",
  },
  {
    id: "gal-2",
    bookingCode: "GS-2025-0843",
    client: "Rafi & Sarah",
    photos: "112 Plates",
    statusKey: "statusSelecting",
    statusVariant: "secondary",
    watermarkKey: "watermarkActive",
    refUrl: "/track-order?ref=GS-2025-0843",
  },
  {
    id: "gal-3",
    bookingCode: "GS-2025-0839",
    client: "Farhan & Kevin",
    photos: "96 Plates",
    statusKey: "statusApproved",
    statusVariant: "default",
    watermarkKey: "watermarkActive",
    refUrl: "/track-order?ref=GS-2025-0839",
  },
  {
    id: "gal-4",
    bookingCode: "GS-2025-0840",
    client: "Cohort FTUI",
    photos: "142 Plates",
    statusKey: "statusSelecting",
    statusVariant: "secondary",
    watermarkKey: "watermarkActive",
    refUrl: "/track-order?ref=GS-2025-0840",
  },
];

export default function AdminGalleriesPage() {
  const tGalleries = useTranslations("adminGalleries");
  const tCommon = useTranslations("common");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleCopy = (id: string, code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/track-order?ref=${code}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleTriggerUpload = async () => {
    setIsProcessing(true);
    try {
      await uploadPhotosAction({
        galleryId: "gal-1",
        reservationId: "res-demo",
        action: "generate-urls",
        fileNames: ["sample-proof.jpg"],
      });
    } catch {
      // Handled silently
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
            {tGalleries("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">{tGalleries("subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-1.5 h-8"
            disabled={isProcessing}
            onClick={handleTriggerUpload}
          >
            <Plus className="size-3.5" />
            <span>{isProcessing ? tCommon("loading") : tGalleries("btnNewGallery")}</span>
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <Card className="bg-card shadow-xs">
        <CardContent className="p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="gallerySearch" className="sr-only">
              {tGalleries("searchPlaceholder")}
            </label>
            <Input
              id="gallerySearch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tGalleries("searchPlaceholder")}
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Galleries Table */}
      <Card className="bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Images className="size-4 text-primary" />
            <CardTitle className="font-serif text-base font-medium">
              {tGalleries("title")}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">{tGalleries("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tGalleries("thBookingCode")}</TableHead>
                <TableHead>{tGalleries("thClient")}</TableHead>
                <TableHead>{tGalleries("thPhotoCount")}</TableHead>
                <TableHead>{tGalleries("thProofStatus")}</TableHead>
                <TableHead>{tGalleries("thWatermark")}</TableHead>
                <TableHead className="text-right">{tGalleries("thLink")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GALLERIES_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    <Link href={item.refUrl} className="hover:underline flex items-center gap-1">
                      <span>{item.bookingCode}</span>
                      <ExternalLink className="size-2.5 opacity-60" />
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{item.client}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.photos}</TableCell>
                  <TableCell>
                    <Badge variant={item.statusVariant} className="text-xs">
                      {tGalleries(item.statusKey)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ShieldCheck className="size-3.5 text-emerald-600" />
                      <span>{tGalleries(item.watermarkKey)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => handleCopy(item.id, item.bookingCode)}
                    >
                      <Copy className="size-3" />
                      <span>
                        {copiedId === item.id ? tCommon("completed") : tGalleries("btnCopyLink")}
                      </span>
                    </Button>
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

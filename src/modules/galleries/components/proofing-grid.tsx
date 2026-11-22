"use client";

import { Check, Heart, Send, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
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
import { Input } from "@/common/components/ui/input";
import { submitPhotoSelectionAction } from "../actions/submit-photo-selection.action";

export interface ProofingPhoto {
  id: string;
  previewKey: string;
  thumbnailKey: string;
  dimensions?: string | null;
  sequenceNumber: number;
}

export interface ProofingGridProps {
  galleryId: string;
  bookingCode: string;
  quota?: number;
  photos: ProofingPhoto[];
  initialSelections?: string[];
  galleryStatus: string;
}

export function ProofingGrid({
  galleryId,
  quota = 15,
  photos,
  initialSelections = [],
  galleryStatus,
}: ProofingGridProps) {
  const tGallery = useTranslations("gallery");
  const tCommon = useTranslations("common");
  const tTrack = useTranslations("trackOrderPage");

  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelections);
  const [notes, setNotes] = useState<string>("");
  const [status, setStatus] = useState<string>(galleryStatus);
  const [isPending, startTransition] = useTransition();

  const isApproved = status === "APPROVED" || status === "DELIVERED";

  const handleToggle = (photoId: string) => {
    if (isApproved) return;

    setSelectedIds((prev) => {
      if (prev.includes(photoId)) {
        return prev.filter((id) => id !== photoId);
      }
      if (prev.length >= quota) {
        return prev;
      }
      return [...prev, photoId];
    });
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0 || isApproved) return;

    startTransition(async () => {
      try {
        const result = await submitPhotoSelectionAction({
          galleryId,
          selectedPhotoIds: selectedIds,
          notes: notes.trim() || undefined,
        });

        if (result?.data?.success) {
          setStatus("APPROVED");
        }
      } catch {
        // Handled gracefully
      }
    });
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <CardTitle className="font-serif text-lg font-medium text-foreground">
              {tGallery("title")}
            </CardTitle>
          </div>
          <CardDescription className="text-xs mt-1">{tGallery("description")}</CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={selectedIds.length >= quota ? "default" : "secondary"}
            className="text-xs font-mono font-medium"
          >
            {tGallery("selectionCounter", {
              count: selectedIds.length,
              quota,
            })}
          </Badge>
          {isApproved && (
            <Badge variant="outline" className="text-xs text-primary border-primary gap-1">
              <ShieldCheck className="size-3" />
              <span>{tGallery("selectionSubmitted")}</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => {
            const isSelected = selectedIds.includes(photo.id);
            return (
              <Button
                key={photo.id}
                type="button"
                variant="outline"
                onClick={() => handleToggle(photo.id)}
                className={`relative aspect-[3/4] h-auto w-full p-0 rounded-2xl overflow-hidden border transition-all duration-200 group font-normal ${
                  isSelected
                    ? "ring-2 ring-primary border-primary shadow-sm"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Image src="/logo-bg.jpg" alt={tGallery("title")} fill className="object-cover" />

                {/* Diagonal Watermark Overlay */}
                <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
                  <span className="text-background/80 font-mono text-[10px] uppercase font-bold tracking-widest -rotate-45 select-none">
                    {tTrack("watermarkStamp")}
                  </span>
                </div>

                {/* Selection Overlay Indicator */}
                <div className="absolute top-2 right-2 z-10">
                  <div
                    className={`size-7 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-background/80 text-muted-foreground group-hover:bg-background"
                    }`}
                  >
                    {isSelected ? <Check className="size-3.5" /> : <Heart className="size-3.5" />}
                  </div>
                </div>

                {/* Sequence Badge */}
                <div className="absolute bottom-2 left-2 z-10">
                  <span className="bg-background/80 backdrop-blur-xs text-[10px] font-mono px-1.5 py-0.5 rounded-md text-foreground">
                    {`#${photo.sequenceNumber}`}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Retouching Notes Input */}
        {!isApproved && (
          <div className="pt-2">
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={tGallery("retouchNotesPlaceholder")}
              className="text-xs h-9 bg-background"
              maxLength={500}
            />
          </div>
        )}
      </CardContent>

      {!isApproved && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 gap-3">
          <span className="text-xs text-muted-foreground">
            {tGallery("selectionCounter", {
              count: selectedIds.length,
              quota,
            })}
          </span>
          <Button
            size="default"
            disabled={selectedIds.length === 0 || isPending}
            onClick={handleSubmit}
            className="w-full sm:w-auto h-8 text-xs gap-1.5"
          >
            <Send className="size-3.5" />
            <span>{isPending ? tCommon("loading") : tGallery("submitSelection")}</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

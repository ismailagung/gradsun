"use client";

import { Check, Image as ImageIcon, Loader2, RefreshCw, Upload } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { uploadCmsAssetAction } from "../actions/upload-cms-asset.action";

interface ImageUploaderFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: "hero" | "manifesto" | "general";
  description?: string;
}

export function ImageUploaderField({
  label,
  value,
  onChange,
  folder = "hero",
  description,
}: ImageUploaderFieldProps) {
  const tCms = useTranslations("adminCms");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [showDirectUrl, setShowDirectUrl] = React.useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError(tCms("msgInvalidFileType"));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(tCms("msgFileTooLarge"));
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        if (!base64Data) {
          setUploadError(tCms("msgUploadError"));
          setIsUploading(false);
          return;
        }

        const res = await uploadCmsAssetAction({
          folder,
          fileName: file.name,
          contentType: file.type,
          base64Data,
        });

        if (res?.data?.publicUrl) {
          onChange(res.data.publicUrl);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        } else {
          setUploadError(tCms("msgUploadError"));
        }
        setIsUploading(false);
      };

      reader.onerror = () => {
        setUploadError(tCms("msgUploadError"));
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch {
      setUploadError(tCms("msgUploadError"));
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isSupabaseStorage = value.includes("supabase.co") || value.includes("storage");

  return (
    <div className="space-y-2 rounded-lg border border-border p-3 bg-muted/20">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-foreground">{label}</Label>
        {isSupabaseStorage ? (
          <Badge
            variant="outline"
            className="text-[10px] py-0 px-1.5 text-primary border-primary/30"
          >
            {tCms("hintStorageUpload")}
          </Badge>
        ) : null}
      </div>

      {description ? <p className="text-[11px] text-muted-foreground">{description}</p> : null}

      <div className="flex items-center gap-3">
        {/* Thumbnail Preview */}
        <div className="relative size-16 shrink-0 rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center">
          {value ? (
            <Image src={value} alt={label} fill unoptimized className="object-cover" />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" />
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-1.5">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{tCms("btnUploading")}</span>
                </>
              ) : value ? (
                <>
                  <RefreshCw className="size-3.5" />
                  <span>{tCms("btnChangeImage")}</span>
                </>
              ) : (
                <>
                  <Upload className="size-3.5" />
                  <span>{tCms("btnUploadImage")}</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => setShowDirectUrl(!showDirectUrl)}
            >
              <span>{tCms("labelOrPasteUrl")}</span>
            </Button>
          </div>

          {uploadSuccess ? (
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <Check className="size-3" />
              <span>{tCms("msgUploadSuccess")}</span>
            </div>
          ) : null}

          {uploadError ? (
            <p className="text-[11px] text-destructive font-medium">{uploadError}</p>
          ) : null}
        </div>
      </div>

      {showDirectUrl ? (
        <div className="pt-2 border-t border-border/50">
          <Input
            className="h-8 text-xs font-mono"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { CheckCircle2, Download, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";

export interface BookingConfirmationLabels {
  bookNowCta: string;
  orderSentTitle: string;
  orderSentSubtitle: string;
  orderSentDesc: string;
  orderRecapPackage: string;
  orderRecapSchedule: string;
  orderRecapClient: string;
  preliminaryInvoiceTitle: string;
  preliminaryInvoiceDesc: string;
  downloadInvoiceCta: string;
  finishCta: string;
  packageName: string;
  packagePrice: string;
  dpPrice: string;
  scheduleText: string;
  clientName: string;
  clientContact: string;
}

interface BookingConfirmationDialogProps {
  labels: BookingConfirmationLabels;
}

export function BookingConfirmationDialog({ labels }: BookingConfirmationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDownloadInvoice = () => {
    // Simulated PDF invoice download trigger without forbidden alert()
    const link = document.createElement("a");
    link.href = "#";
    link.setAttribute("download", "Invoice-Gradsun-Preliminary.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 rounded-xl text-sm font-semibold shadow-md w-full">
          <Sparkles className="size-4" />
          <span>{labels.bookNowCta}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-card border border-border shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center gap-2">
          <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="size-6" />
          </div>
          <DialogTitle className="font-serif text-xl font-bold text-foreground">
            {labels.orderSentTitle}
          </DialogTitle>
          <Badge
            variant="outline"
            className="text-[10px] text-amber-600 border-amber-500/40 bg-amber-500/10"
          >
            {labels.orderSentSubtitle}
          </Badge>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
            {labels.orderSentDesc}
          </DialogDescription>
        </DialogHeader>

        {/* Order Recap Box */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4 flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{labels.orderRecapPackage}</span>
            <span className="font-semibold text-foreground font-serif">{labels.packageName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{labels.orderRecapSchedule}</span>
            <span className="font-mono font-medium text-foreground">{labels.scheduleText}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{labels.orderRecapClient}</span>
            <span className="font-medium text-foreground">{labels.clientName}</span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between items-center">
            <span className="text-muted-foreground font-medium">
              {labels.preliminaryInvoiceTitle}
            </span>
            <span className="font-mono font-bold text-primary text-sm">{labels.dpPrice}</span>
          </div>
        </div>

        {/* Down Payment Instruction Box */}
        <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex flex-col gap-1 text-[11px]">
          <span className="font-semibold text-primary">{labels.preliminaryInvoiceTitle}</span>
          <p className="text-muted-foreground leading-relaxed">{labels.preliminaryInvoiceDesc}</p>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 text-xs font-semibold h-9 rounded-lg"
            onClick={handleDownloadInvoice}
          >
            <Download className="size-3.5" />
            <span>{labels.downloadInvoiceCta}</span>
          </Button>

          <Button asChild className="w-full gap-2 text-xs font-semibold h-9 rounded-lg">
            <Link href="/">
              <Home className="size-3.5" />
              <span>{labels.finishCta}</span>
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

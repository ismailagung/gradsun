"use client";

import { Check, Copy, Printer, QrCode } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { WhatsAppDispatchButton } from "./whatsapp-dispatch-button";

export interface InvoiceAddon {
  id: string;
  addonName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface InvoiceData {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  instagramHandle?: string | null;
  campusName?: string | null;
  packagePrice: number;
  addonsTotal: number;
  grandTotal: number;
  status: string;
  paymentStatus: string;
  sessionDate: Date | string;
  startTime?: string | null;
  endTime?: string | null;
  createdAt: Date | string;
  addons: InvoiceAddon[];
}

interface InvoiceCardProps {
  invoice: InvoiceData;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const t = useTranslations("invoice");
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(t("accountNumber"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formattedDate = new Date(invoice.sessionDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedIssueDate = new Date(invoice.createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="border border-border/80 shadow-xs bg-card print:border-none print:shadow-none print:bg-white text-card-foreground">
      {/* Invoice Header */}
      <CardHeader className="border-b border-border/60 pb-6 print:pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                {t("brand")}
              </span>
              <Badge variant="outline" className="text-[10px] h-5 font-mono">
                {invoice.code}
              </Badge>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-serif tracking-tight">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-xs">{t("subtitle")}</CardDescription>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <Badge
              variant={
                invoice.paymentStatus === "PAID_FULL"
                  ? "default"
                  : invoice.paymentStatus === "DP_PAID"
                    ? "outline"
                    : "secondary"
              }
              className="text-xs font-medium"
            >
              {invoice.paymentStatus === "PAID_FULL"
                ? t("paidFull")
                : invoice.paymentStatus === "DP_PAID"
                  ? t("dpPaid")
                  : t("unpaid")}
            </Badge>
            <span className="text-[11px] text-muted-foreground font-mono">
              {t("issueDateLabel", { date: formattedIssueDate })}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Client & Session Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg border border-border/50 bg-muted/10 space-y-1.5">
            <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] block text-muted-foreground">
              {t("billTo")}
            </span>
            <div className="font-medium text-foreground text-sm">{invoice.clientName}</div>
            <div className="text-muted-foreground">{invoice.clientPhone}</div>
            {invoice.campusName && (
              <div className="text-muted-foreground">{invoice.campusName}</div>
            )}
            {invoice.instagramHandle && (
              <div className="text-muted-foreground">{invoice.instagramHandle}</div>
            )}
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-muted/10 space-y-1.5">
            <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] block text-muted-foreground">
              {t("sessionDetails")}
            </span>
            <div className="text-muted-foreground">
              {t("sessionDateLabel", { date: formattedDate })}
            </div>
            <div className="text-muted-foreground">
              {t("sessionTimeLabel", {
                start: invoice.startTime ?? "",
                end: invoice.endTime ?? "",
              })}
            </div>
            <div className="text-muted-foreground">
              {t("studioRoomLabel", { room: t("generalStudio") })}
            </div>
          </div>
        </div>

        {/* Order Breakdown Table */}
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8 text-xs font-semibold">{t("item")}</TableHead>
                <TableHead className="h-8 text-xs font-semibold text-center w-16">
                  {t("qty")}
                </TableHead>
                <TableHead className="h-8 text-xs font-semibold text-right w-28">
                  {t("unitPrice")}
                </TableHead>
                <TableHead className="h-8 text-xs font-semibold text-right w-32">
                  {t("subtotal")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              <TableRow className="hover:bg-muted/10">
                <TableCell className="font-medium">{t("packageItem")}</TableCell>
                <TableCell className="text-center font-mono">{t("defaultQty")}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(invoice.packagePrice)}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {formatCurrency(invoice.packagePrice)}
                </TableCell>
              </TableRow>
              {invoice.addons.map((addon) => (
                <TableRow key={addon.id} className="hover:bg-muted/10">
                  <TableCell className="text-muted-foreground">{addon.addonName}</TableCell>
                  <TableCell className="text-center font-mono">{addon.quantity}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(addon.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(addon.subtotal)}
                  </TableCell>
                </TableRow>
              ))}
              {invoice.addons.length > 0 && (
                <TableRow className="border-t border-border/40 hover:bg-transparent font-medium">
                  <TableCell colSpan={3} className="text-right text-muted-foreground">
                    {t("addonsSubtotal")}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(invoice.addonsTotal)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="border-t-2 border-border bg-muted/20 hover:bg-muted/20 font-semibold text-sm">
                <TableCell colSpan={3} className="text-right text-foreground">
                  {t("grandTotal")}
                </TableCell>
                <TableCell className="text-right font-mono text-foreground font-bold">
                  {formatCurrency(invoice.grandTotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Bank Transfer Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg border border-border/60 bg-muted/15 space-y-2.5 text-xs">
            <span className="font-semibold text-foreground tracking-wide text-xs block">
              {t("paymentInstructions")}
            </span>
            <div className="space-y-1 text-muted-foreground">
              <div className="font-medium text-foreground">{t("bankName")}</div>
              <div className="font-mono text-sm tracking-wider font-semibold text-foreground">
                {t("accountNumber")}
              </div>
              <div>{t("accountHolder")}</div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyAccount}
              className="h-8 gap-1.5 text-xs font-normal print:hidden"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span>{t("copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3 text-muted-foreground" />
                  <span>{t("copyAccount")}</span>
                </>
              )}
            </Button>
          </div>

          <div className="p-4 rounded-lg border border-border/60 bg-muted/15 space-y-2.5 text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs mb-1">
                <QrCode className="size-3.5 text-muted-foreground" />
                <span>{t("qrisTitle")}</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {t("qrisSubtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="outline" className="text-[10px] uppercase font-mono">
                {t("bankBca")}
              </Badge>
              <Badge variant="outline" className="text-[10px] uppercase font-mono">
                {t("qrisTag")}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Action Footer */}
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-border/60 pt-4 print:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="w-full sm:w-auto h-8 gap-2 text-xs"
        >
          <Printer className="size-3.5" />
          <span>{t("printInvoice")}</span>
        </Button>
        <WhatsAppDispatchButton
          bookingCode={invoice.code}
          clientName={invoice.clientName}
          grandTotal={invoice.grandTotal}
        />
      </CardFooter>
    </Card>
  );
}

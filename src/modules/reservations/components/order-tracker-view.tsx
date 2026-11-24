"use client";

import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Printer,
  Search,
  Sparkles,
  Truck,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { Input } from "@/common/components/ui/input";
import { ProofingGrid, type ProofingPhoto } from "@/modules/galleries/components/proofing-grid";

export interface TrackedOrder {
  bookingCode: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  instagramHandle: string;
  packageName: string;
  packagePrice: number;
  sessionDate: string;
  sessionTime: string;
  durationMinutes: number;
  location: string;
  notes: string;
  status: "PENDING_APPROVAL" | "AWAITING_DP" | "SCHEDULED" | "SELECTING" | "DELIVERED";
  paymentStatus: "UNPAID" | "PENDING_VERIFICATION" | "DP_PAID" | "FULLY_PAID";
  dpAmount: number;
  balanceAmount: number;
  createdAt: string;
  currentStepIndex: number;
  shippingAwb?: string;
  galleryId?: string;
  photos?: ProofingPhoto[];
  initialSelections?: string[];
}

const DEFAULT_SAMPLE_PHOTOS: ProofingPhoto[] = [
  {
    id: "sample-photo-1",
    previewKey: "galleries/demo/previews/1.webp",
    thumbnailKey: "galleries/demo/thumbnails/1.webp",
    dimensions: "1200x800",
    sequenceNumber: 1,
  },
  {
    id: "sample-photo-2",
    previewKey: "galleries/demo/previews/2.webp",
    thumbnailKey: "galleries/demo/thumbnails/2.webp",
    dimensions: "1200x800",
    sequenceNumber: 2,
  },
  {
    id: "sample-photo-3",
    previewKey: "galleries/demo/previews/3.webp",
    thumbnailKey: "galleries/demo/thumbnails/3.webp",
    dimensions: "1200x800",
    sequenceNumber: 3,
  },
  {
    id: "sample-photo-4",
    previewKey: "galleries/demo/previews/4.webp",
    thumbnailKey: "galleries/demo/thumbnails/4.webp",
    dimensions: "1200x800",
    sequenceNumber: 4,
  },
];

const PRESET_ORDERS: TrackedOrder[] = [
  {
    bookingCode: "GS-2025-0517",
    clientName: "Najmi Al-Azhar",
    clientPhone: "+62 812-9876-5432",
    clientEmail: "najmi@example.com",
    instagramHandle: "@gradsun.studio",
    packageName: "Single Package 1",
    packagePrice: 450000,
    sessionDate: "17 May 2025",
    sessionTime: "16:30 WIB",
    durationMinutes: 90,
    location: "Balairung, Depok",
    notes: "Please arrive 30 minutes before session.",
    status: "PENDING_APPROVAL",
    paymentStatus: "UNPAID",
    dpAmount: 225000,
    balanceAmount: 225000,
    createdAt: "17 May 2025, 09:30 WIB",
    currentStepIndex: 1,
  },
  {
    bookingCode: "GS-2025-0518",
    clientName: "Adinda Prameswari",
    clientPhone: "+62 813-1122-3344",
    clientEmail: "adinda@example.com",
    instagramHandle: "@adinda.prameswari",
    packageName: "Group Package 1",
    packagePrice: 750000,
    sessionDate: "18 May 2025",
    sessionTime: "09:00 WIB",
    durationMinutes: 120,
    location: "Rotunda, Depok",
    notes: "Group graduation session with five classmates.",
    status: "AWAITING_DP",
    paymentStatus: "PENDING_VERIFICATION",
    dpAmount: 375000,
    balanceAmount: 375000,
    createdAt: "16 May 2025, 14:15 WIB",
    currentStepIndex: 2,
  },
  {
    bookingCode: "GS-2025-0402",
    clientName: "Rayhan Wicaksono",
    clientPhone: "+62 811-5566-7788",
    clientEmail: "rayhan@example.com",
    instagramHandle: "@rayhan.w",
    packageName: "Single Package 2",
    packagePrice: 600000,
    sessionDate: "2 May 2025",
    sessionTime: "14:00 WIB",
    durationMinutes: 90,
    location: "Central Library, Depok",
    notes: "Formal portrait and outdoor portraits.",
    status: "SELECTING",
    paymentStatus: "FULLY_PAID",
    dpAmount: 300000,
    balanceAmount: 300000,
    createdAt: "28 April 2025, 10:00 WIB",
    currentStepIndex: 4,
    galleryId: "demo-gallery-rayhan",
    photos: DEFAULT_SAMPLE_PHOTOS,
    initialSelections: ["sample-photo-1", "sample-photo-3"],
  },
  {
    bookingCode: "GS-2025-0311",
    clientName: "Farhan Pratama",
    clientPhone: "+62 818-4455-6677",
    clientEmail: "farhan@example.com",
    instagramHandle: "@farhan.pratama",
    packageName: "Group Package 2",
    packagePrice: 1050000,
    sessionDate: "11 March 2025",
    sessionTime: "10:00 WIB",
    durationMinutes: 120,
    location: "Rektorat, Depok",
    notes: "Group graduation session with ten alumni.",
    status: "DELIVERED",
    paymentStatus: "FULLY_PAID",
    dpAmount: 525000,
    balanceAmount: 525000,
    createdAt: "1 March 2025, 11:20 WIB",
    currentStepIndex: 5,
    shippingAwb: "PXL-GRADSUN-992104",
  },
];

interface OrderTrackerViewProps {
  initialCode?: string;
  serverOrder?: TrackedOrder | null;
}

export function OrderTrackerView({ initialCode, serverOrder }: OrderTrackerViewProps) {
  const t = useTranslations("trackOrderPage");

  const [searchInput, setSearchInput] = useState<string>(initialCode ?? "GS-2025-0517");
  const [activeCode, setActiveCode] = useState<string>(initialCode ?? "GS-2025-0517");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);

  // Find matching order from server or presets
  const activeOrder: TrackedOrder | undefined = (() => {
    if (serverOrder && serverOrder.bookingCode.toLowerCase() === activeCode.toLowerCase()) {
      return serverOrder;
    }
    const cleanQuery = activeCode.trim().toLowerCase();
    const found = PRESET_ORDERS.find(
      (o) =>
        o.bookingCode.toLowerCase() === cleanQuery ||
        o.clientEmail.toLowerCase() === cleanQuery ||
        o.clientPhone.replace(/\D/g, "") === cleanQuery.replace(/\D/g, ""),
    );
    return found;
  })();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveCode(searchInput.trim());
    }
  };

  const handleSelectPreset = (code: string) => {
    setSearchInput(code);
    setActiveCode(code);
  };

  const handleCopyCode = async () => {
    if (!activeOrder) return;
    try {
      await navigator.clipboard.writeText(activeOrder.bookingCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStatusBadge = (order: TrackedOrder) => {
    switch (order.status) {
      case "PENDING_APPROVAL":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <Clock className="size-3.5 animate-pulse" />
            <span>{t("statusPendingApproval")}</span>
          </Badge>
        );
      case "AWAITING_DP":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400 gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <AlertCircle className="size-3.5" />
            <span>{t("statusAwaitingDp")}</span>
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <Calendar className="size-3.5" />
            <span>{t("statusScheduled")}</span>
          </Badge>
        );
      case "SELECTING":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <Sparkles className="size-3.5 animate-spin" />
            <span>{t("statusProofing")}</span>
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge
            variant="outline"
            className="border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <CheckCircle2 className="size-3.5" />
            <span>{t("statusCompleted")}</span>
          </Badge>
        );
    }
  };

  const renderStatusDescription = (order: TrackedOrder) => {
    switch (order.status) {
      case "PENDING_APPROVAL":
        return t("statusPendingApprovalDesc");
      case "AWAITING_DP":
        return t("statusAwaitingDpDesc");
      case "SCHEDULED":
        return t("statusScheduledDesc");
      case "SELECTING":
        return t("statusProofingDesc");
      case "DELIVERED":
        return t("statusCompletedDesc");
    }
  };

  const getTimelineSteps = (order: TrackedOrder) => [
    {
      title: t("step1"),
      date: order.createdAt,
      desc: t("step1Desc"),
      isDone: order.currentStepIndex >= 1,
      isActive: order.currentStepIndex === 0,
    },
    {
      title: t("step2"),
      date: t("step2Date"),
      desc: t("step2Desc"),
      isDone: order.currentStepIndex >= 2,
      isActive: order.currentStepIndex === 1,
    },
    {
      title: t("step3"),
      date: t("step3Date"),
      desc: t("step3Desc"),
      isDone: order.currentStepIndex >= 3,
      isActive: order.currentStepIndex === 2,
    },
    {
      title: t("step4"),
      date: `${order.sessionDate} • ${order.sessionTime}`,
      desc: t("step4Desc"),
      isDone: order.currentStepIndex >= 4,
      isActive: order.currentStepIndex === 3,
    },
    {
      title: t("step5"),
      date: t("step5Date"),
      desc: t("step5Desc"),
      isDone: order.currentStepIndex >= 5,
      isActive: order.currentStepIndex === 4,
    },
    {
      title: t("step6"),
      date: t("step6Date"),
      desc: t("step6Desc"),
      isDone: order.currentStepIndex >= 5 && order.status === "DELIVERED",
      isActive: order.currentStepIndex === 5 && order.status !== "DELIVERED",
    },
  ];

  const whatsappMessage = activeOrder
    ? encodeURIComponent(`${t("chatAdminMessage")}${activeOrder.bookingCode}`)
    : "";

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Search & Sample Presets Card */}
      <Card className="border-border bg-card p-6 rounded-3xl shadow-xs">
        <CardContent className="p-0 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="orderTrackerSearchInput"
              className="text-xs font-semibold text-foreground uppercase tracking-wider font-serif"
            >
              {t("searchBoxTitle")}
            </label>
            <p className="text-xs text-muted-foreground">{t("headerSubtitle")}</p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="orderTrackerSearchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("searchBoxPlaceholder")}
                className="pl-9 h-10 font-mono text-xs sm:text-sm"
              />
            </div>
            <Button
              type="submit"
              size="default"
              className="w-full sm:w-auto px-6 h-10 rounded-lg gap-2 shadow-xs"
            >
              <span>{t("searchCta")}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Quick Preset Selector Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-border/60">
            <span className="text-[11px] font-medium text-muted-foreground shrink-0 font-serif">
              {t("quickPresetsTitle")}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                type="button"
                variant={activeCode === "GS-2025-0517" ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleSelectPreset("GS-2025-0517")}
                className="h-7 text-[11px] px-2.5 rounded-full"
              >
                <span>{t("presetPending")}</span>
              </Button>
              <Button
                type="button"
                variant={activeCode === "GS-2025-0518" ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleSelectPreset("GS-2025-0518")}
                className="h-7 text-[11px] px-2.5 rounded-full"
              >
                <span>{t("presetAwaitingDp")}</span>
              </Button>
              <Button
                type="button"
                variant={activeCode === "GS-2025-0402" ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleSelectPreset("GS-2025-0402")}
                className="h-7 text-[11px] px-2.5 rounded-full"
              >
                <span>{t("presetProofing")}</span>
              </Button>
              <Button
                type="button"
                variant={activeCode === "GS-2025-0311" ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleSelectPreset("GS-2025-0311")}
                className="h-7 text-[11px] px-2.5 rounded-full"
              >
                <span>{t("presetCompleted")}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Order Details & Tracking Section */}
      {activeOrder ? (
        <div className="flex flex-col gap-8">
          {/* Active Order Overview Header Card */}
          <Card className="border-border bg-card p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif uppercase tracking-wider text-muted-foreground">
                    {t("orderRefBadge")}
                  </span>
                  <Badge variant="default" className="text-xs font-mono px-2.5 py-0.5">
                    {activeOrder.bookingCode}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCode}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground rounded-md gap-1"
                  >
                    {isCopied ? (
                      <Check className="size-3 text-primary" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    <span>{isCopied ? t("copied") : t("copyCode")}</span>
                  </Button>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  {activeOrder.clientName}
                </h2>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                {renderStatusBadge(activeOrder)}
                {activeOrder.shippingAwb && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border">
                    <Truck className="size-3.5 text-primary" />
                    <span className="font-mono">{activeOrder.shippingAwb}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Informative Notice Callout */}
            <div className="rounded-2xl p-4 bg-secondary/40 border border-border/80 flex items-start gap-3">
              <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs sm:text-sm text-foreground/90">
                <span className="font-medium">{renderStatusDescription(activeOrder)}</span>
              </div>
            </div>

            {/* Timeline Stepper */}
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="text-xs font-serif uppercase tracking-wider text-muted-foreground font-semibold">
                {t("timelineTitle")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                {getTimelineSteps(activeOrder).map((step, idx) => (
                  <div
                    key={step.title}
                    className={`flex flex-col gap-2 p-3.5 rounded-2xl border transition-colors ${
                      step.isActive
                        ? "bg-primary/10 border-primary/50 shadow-xs"
                        : step.isDone
                          ? "bg-secondary/40 border-border"
                          : "bg-card/50 border-border/60 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground font-bold">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div
                        className={`size-6 rounded-full flex items-center justify-center text-[10px] ${
                          step.isDone
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : step.isActive
                              ? "bg-primary/20 text-primary border border-primary/40 animate-pulse"
                              : "bg-secondary text-muted-foreground border border-border"
                        }`}
                      >
                        {step.isDone ? (
                          <Check className="size-3" />
                        ) : step.isActive ? (
                          <Sparkles className="size-3" />
                        ) : (
                          <Clock className="size-3" />
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-serif leading-snug line-clamp-2 ${
                        step.isActive ? "font-bold text-primary" : "font-semibold text-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground line-clamp-1">
                      {step.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Two-Column Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Reservation & Client Details */}
            <Card className="border-border bg-card p-6 rounded-3xl shadow-xs flex flex-col gap-5">
              <CardHeader className="p-0 pb-3 border-b border-border/60">
                <CardTitle className="font-serif text-base font-semibold flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  <span>{t("reservationDetailsTitle")}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-4 text-xs sm:text-sm">
                {/* Package */}
                <div className="flex items-start justify-between py-1.5 border-b border-border/40 gap-3">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Package className="size-3.5 text-primary" />
                    <span>{t("packageLabel")}</span>
                  </span>
                  <span className="font-serif font-bold text-foreground text-right">
                    {activeOrder.packageName}
                  </span>
                </div>

                {/* Schedule */}
                <div className="flex items-start justify-between py-1.5 border-b border-border/40 gap-3">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-primary" />
                    <span>{t("scheduleLabel")}</span>
                  </span>
                  <span className="font-mono font-medium text-foreground text-right">
                    {activeOrder.sessionDate}
                    {" • "}
                    {activeOrder.sessionTime}
                    {" ("}
                    {String(activeOrder.durationMinutes)} {t("minutesUnit")}
                    {")"}
                  </span>
                </div>

                {/* Client Name */}
                <div className="flex items-start justify-between py-1.5 border-b border-border/40 gap-3">
                  <span className="text-muted-foreground">{t("clientLabel")}</span>
                  <span className="font-medium text-foreground text-right">
                    {activeOrder.clientName}
                  </span>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start justify-between py-1.5 border-b border-border/40 gap-3">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3.5 text-primary" />
                    <span>{t("whatsappLabel")}</span>
                  </span>
                  <span className="font-mono text-foreground text-right">
                    {activeOrder.clientPhone}
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-start justify-between py-1.5 border-b border-border/40 gap-3">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" />
                    <span>{t("emailLabel")}</span>
                  </span>
                  <span className="font-mono text-foreground text-right">
                    {activeOrder.clientEmail}
                  </span>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1 py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    <span>{t("locationLabel")}</span>
                  </span>
                  <span className="font-medium text-foreground text-xs leading-relaxed pl-5">
                    {activeOrder.location}
                  </span>
                </div>

                {/* Photographer Notes */}
                <div className="flex flex-col gap-1 py-1.5">
                  <span className="text-muted-foreground text-xs">{t("notesLabel")}</span>
                  <span className="text-xs text-foreground italic bg-secondary/30 p-2.5 rounded-xl border border-border/60">
                    {activeOrder.notes || t("noNotes")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Column 2: Payment Summary & Action Hub */}
            <Card className="border-border bg-card p-6 rounded-3xl shadow-xs flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-5">
                <CardHeader className="p-0 pb-3 border-b border-border/60">
                  <CardTitle className="font-serif text-base font-semibold flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <span>{t("paymentDetailsTitle")}</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0 flex flex-col gap-3.5 text-xs sm:text-sm">
                  {/* Total Price */}
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{t("totalPackagePrice")}</span>
                    <span className="font-mono font-bold text-foreground">
                      {formatCurrency(activeOrder.packagePrice)}
                    </span>
                  </div>

                  {/* DP 50% */}
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{t("dpAmount")}</span>
                    <span className="font-mono font-bold text-primary">
                      {formatCurrency(activeOrder.dpAmount)}
                    </span>
                  </div>

                  {/* Remaining Balance */}
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{t("remainingBalance")}</span>
                    <span className="font-mono font-medium text-muted-foreground">
                      {formatCurrency(activeOrder.balanceAmount)}
                    </span>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">{t("paymentStatusLabel")}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        activeOrder.paymentStatus === "FULLY_PAID"
                          ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                          : activeOrder.paymentStatus === "DP_PAID"
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {activeOrder.paymentStatus === "FULLY_PAID"
                        ? t("paymentStatusFullyPaid")
                        : activeOrder.paymentStatus === "DP_PAID"
                          ? t("paymentStatusDpPaid")
                          : t("paymentStatusUnpaid")}
                    </Badge>
                  </div>
                </CardContent>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="w-full h-9 rounded-xl gap-2 font-serif text-xs font-semibold shadow-xs"
                >
                  <Download className="size-3.5 text-primary" />
                  <span>{t("downloadInvoiceCta")}</span>
                </Button>

                <Button
                  type="button"
                  size="default"
                  asChild
                  className="w-full h-9 rounded-xl gap-2 font-serif text-xs font-semibold shadow-xs"
                >
                  <a
                    href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-3.5" />
                    <span>{t("chatAdminCta")}</span>
                  </a>
                </Button>
              </div>
            </Card>
          </div>

          {/* Photo Proofing Gallery Section (Active if status is SELECTING or photos present) */}
          {activeOrder.status === "SELECTING" || activeOrder.status === "DELIVERED" ? (
            <Card className="border-border bg-card p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <div className="flex flex-col gap-1 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Camera className="size-4 text-primary" />
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {t("proofingSectionTitle")}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">{t("proofingSectionSubtitle")}</p>
              </div>

              <ProofingGrid
                galleryId={activeOrder.galleryId ?? "demo-gallery-id"}
                bookingCode={activeOrder.bookingCode}
                photos={activeOrder.photos ?? DEFAULT_SAMPLE_PHOTOS}
                initialSelections={activeOrder.initialSelections ?? []}
                galleryStatus={activeOrder.status}
              />
            </Card>
          ) : (
            <Card className="border-border bg-card/60 p-6 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
              <div className="size-10 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground">
                <Camera className="size-5" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h4 className="font-serif text-sm font-semibold text-foreground">
                  {t("proofingNotReadyTitle")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("proofingNotReadyDesc")}
                </p>
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* Empty State when order not found */
        <Card className="border-border bg-card p-10 rounded-3xl text-center flex flex-col items-center justify-center gap-4">
          <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="size-6" />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="font-serif text-lg font-bold text-foreground">
              {t("orderNotFoundTitle")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("orderNotFoundDesc")}
            </p>
          </div>
          <Button
            type="button"
            size="default"
            onClick={() => handleSelectPreset("GS-2025-0517")}
            className="rounded-full px-6 h-9 text-xs shadow-xs"
          >
            {t("trySampleCta")}
          </Button>
        </Card>
      )}

      {/* Invoice Modal Dialog */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-8">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <span>{t("invoiceModalTitle")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t("invoiceModalSubtitle")}
            </DialogDescription>
          </DialogHeader>

          {activeOrder && (
            <div className="flex flex-col gap-5 py-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between bg-secondary/40 p-3 rounded-2xl border border-border">
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted-foreground">{t("orderRefBadge")}</span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {activeOrder.bookingCode}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[11px] text-muted-foreground">{t("scheduleLabel")}</span>
                  <span className="font-medium text-foreground text-xs">
                    {activeOrder.sessionDate}
                    {" • "}
                    {activeOrder.sessionTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-b border-border/60 pb-3">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">{activeOrder.packageName}</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatCurrency(activeOrder.packagePrice)}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-primary font-bold">
                  <span>{t("dpAmount")}</span>
                  <span className="font-mono">{formatCurrency(activeOrder.dpAmount)}</span>
                </div>
                <div className="flex justify-between py-1 text-muted-foreground text-xs">
                  <span>{t("remainingBalance")}</span>
                  <span className="font-mono">{formatCurrency(activeOrder.balanceAmount)}</span>
                </div>
              </div>

              <div className="rounded-2xl p-3.5 bg-primary/5 border border-primary/20 flex flex-col gap-1.5 text-xs">
                <span className="font-serif font-bold text-foreground">{t("bankName")}</span>
                <span className="font-mono text-muted-foreground">{t("bankAccount")}</span>
                <span className="text-[11px] text-muted-foreground italic">
                  {"* "}
                  {t("transferNote")}
                  {" ("}
                  {activeOrder.bookingCode}
                  {")"}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => window.print()}
              className="h-9 rounded-xl gap-2 text-xs"
            >
              <Printer className="size-3.5" />
              <span>{t("printInvoice")}</span>
            </Button>
            <Button
              type="button"
              size="default"
              onClick={() => setIsInvoiceOpen(false)}
              className="h-9 rounded-xl text-xs"
            >
              <span>{t("closeInvoice")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

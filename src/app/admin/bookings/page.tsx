"use client";

import {
  Ban,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Eye,
  FileText,
  GraduationCap,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Input } from "@/common/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { confirmReservationAction } from "@/modules/reservations/actions/confirm-reservation.action";
import { rejectReservationAction } from "@/modules/reservations/actions/reject-reservation.action";
import { verifyPaymentAction } from "@/modules/reservations/actions/verify-payment.action";
import { formatBookingWhatsAppUrl } from "@/modules/reservations/services/booking-notification.service";

interface BookingRecord {
  id: string;
  client: string;
  email: string;
  phone: string;
  university: string;
  date: string;
  pkg: string;
  studioRoom: string;
  total: string;
  dpAmount: string;
  remainingBalance: string;
  notes: string;
  createdAt: string;
  paymentStatusKey: "paidFull" | "dpPaid" | "unpaid";
  paymentVariant: "default" | "secondary" | "outline";
  sessionStatusKey: "filterConfirmed" | "filterPendingDP" | "filterCompleted" | "filterCancelled";
  sessionVariant: "default" | "secondary" | "outline" | "destructive";
}

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "GS-2025-0842",
    client: "Adinda Prameswari",
    email: "adinda.prameswari@example.com",
    phone: "0812-9876-5432",
    university: "University of Indonesia • Faculty of Law",
    date: "17 May 2025 • 08:30 WIB",
    pkg: "Solo Commencement",
    studioRoom: "Studio Room A (Daylight Loft)",
    total: "IDR 1,500,000",
    dpAmount: "IDR 750,000",
    remainingBalance: "IDR 0",
    notes: "Client requested soft warm lighting and graduation gown portrait setup.",
    createdAt: "15 May 2025, 14:20 WIB",
    paymentStatusKey: "paidFull",
    paymentVariant: "default",
    sessionStatusKey: "filterConfirmed",
    sessionVariant: "default",
  },
  {
    id: "GS-2025-0843",
    client: "Rafi & Sarah",
    email: "rafi.sarah@example.com",
    phone: "0812-3456-7890",
    university: "Bandung Institute of Technology • School of Business",
    date: "17 May 2025 • 10:15 WIB",
    pkg: "Besties & Duo",
    studioRoom: "Studio Room B (Classic Editorial)",
    total: "IDR 2,400,000",
    dpAmount: "IDR 1,200,000",
    remainingBalance: "IDR 1,200,000",
    notes: "Two graduates with dual degree sash and cap throwing sequence.",
    createdAt: "15 May 2025, 16:45 WIB",
    paymentStatusKey: "dpPaid",
    paymentVariant: "secondary",
    sessionStatusKey: "filterConfirmed",
    sessionVariant: "default",
  },
  {
    id: "GS-2025-0844",
    client: "Cohort FTUI (8 pax)",
    email: "cohort.ftui@example.com",
    phone: "0819-8765-4321",
    university: "University of Indonesia • Faculty of Engineering",
    date: "17 May 2025 • 14:00 WIB",
    pkg: "Sunset Cohort",
    studioRoom: "Grand Hall Studio",
    total: "IDR 3,300,000",
    dpAmount: "IDR 1,650,000",
    remainingBalance: "IDR 1,650,000",
    notes: "Large group photography with wide angle prime lens setup.",
    createdAt: "16 May 2025, 09:10 WIB",
    paymentStatusKey: "dpPaid",
    paymentVariant: "secondary",
    sessionStatusKey: "filterConfirmed",
    sessionVariant: "default",
  },
  {
    id: "GS-2025-0845",
    client: "Nadia Faradilla",
    email: "nadia.faradilla@example.com",
    phone: "0811-2233-4455",
    university: "Gadjah Mada University • Faculty of Psychology",
    date: "17 May 2025 • 16:30 WIB",
    pkg: "Solo Commencement",
    studioRoom: "Studio Room A (Daylight Loft)",
    total: "IDR 1,500,000",
    dpAmount: "IDR 750,000",
    remainingBalance: "IDR 750,000",
    notes: "Awaiting bank transfer verification for down payment.",
    createdAt: "16 May 2025, 18:30 WIB",
    paymentStatusKey: "unpaid",
    paymentVariant: "outline",
    sessionStatusKey: "filterPendingDP",
    sessionVariant: "outline",
  },
  {
    id: "GS-2025-0839",
    client: "Farhan & Kevin",
    email: "farhan.kevin@example.com",
    phone: "0813-5566-7788",
    university: "Padjadjaran University • Faculty of Economics",
    date: "10 May 2025 • 15:30 WIB",
    pkg: "Besties & Duo",
    studioRoom: "Studio Room B (Classic Editorial)",
    total: "IDR 1,950,000",
    dpAmount: "IDR 975,000",
    remainingBalance: "IDR 0",
    notes: "Completed session, high-resolution digital proofs delivered.",
    createdAt: "08 May 2025, 11:00 WIB",
    paymentStatusKey: "paidFull",
    paymentVariant: "default",
    sessionStatusKey: "filterCompleted",
    sessionVariant: "secondary",
  },
];

export default function AdminBookingsPage() {
  const tBookings = useTranslations("adminBookings");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleVerifyDP = (code: string) => {
    startTransition(async () => {
      try {
        await verifyPaymentAction({ code, paymentStatus: "DP_PAID" });
      } catch {
        // optimistically update view for staff
      }
      setBookings((prev) =>
        prev.map((b) =>
          b.id === code
            ? {
                ...b,
                paymentStatusKey: "dpPaid",
                paymentVariant: "secondary",
                sessionStatusKey: "filterConfirmed",
                sessionVariant: "default",
              }
            : b,
        ),
      );
      if (selectedBooking?.id === code) {
        setSelectedBooking((prev) =>
          prev
            ? {
                ...prev,
                paymentStatusKey: "dpPaid",
                paymentVariant: "secondary",
                sessionStatusKey: "filterConfirmed",
                sessionVariant: "default",
              }
            : null,
        );
      }
    });
  };

  const handleConfirmReservation = (code: string) => {
    startTransition(async () => {
      try {
        await confirmReservationAction({ code });
      } catch {
        // optimistically update view for staff
      }
      setBookings((prev) =>
        prev.map((b) =>
          b.id === code
            ? {
                ...b,
                sessionStatusKey: "filterConfirmed",
                sessionVariant: "default",
              }
            : b,
        ),
      );
      if (selectedBooking?.id === code) {
        setSelectedBooking((prev) =>
          prev
            ? {
                ...prev,
                sessionStatusKey: "filterConfirmed",
                sessionVariant: "default",
              }
            : null,
        );
      }
    });
  };

  const handleRejectBooking = (code: string) => {
    startTransition(async () => {
      try {
        await rejectReservationAction({ code, reason: "Cancelled by studio admin" });
      } catch {
        // optimistically update view for staff
      }
      setBookings((prev) =>
        prev.map((b) =>
          b.id === code
            ? {
                ...b,
                sessionStatusKey: "filterCancelled",
                sessionVariant: "destructive",
              }
            : b,
        ),
      );
      if (selectedBooking?.id === code) {
        setSelectedBooking((prev) =>
          prev
            ? {
                ...prev,
                sessionStatusKey: "filterCancelled",
                sessionVariant: "destructive",
              }
            : null,
        );
      }
    });
  };

  const filters = [
    { key: "all", label: tBookings("filterAll") },
    { key: "confirmed", label: tBookings("filterConfirmed") },
    { key: "pending", label: tBookings("filterPendingDP") },
    { key: "completed", label: tBookings("filterCompleted") },
    { key: "cancelled", label: tBookings("filterCancelled") },
  ];

  const filteredBookings = bookings.filter((item) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "confirmed" && item.sessionStatusKey === "filterConfirmed") ||
      (activeFilter === "pending" && item.sessionStatusKey === "filterPendingDP") ||
      (activeFilter === "completed" && item.sessionStatusKey === "filterCompleted") ||
      (activeFilter === "cancelled" && item.sessionStatusKey === "filterCancelled");

    const matchesSearch =
      searchQuery === "" ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
          {tBookings("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-sans">{tBookings("subtitle")}</p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-card shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {filters.map((f) => (
                <Button
                  key={f.key}
                  variant={activeFilter === f.key ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 text-xs font-medium"
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <label htmlFor="bookingSearch" className="sr-only">
                {tBookings("searchPlaceholder")}
              </label>
              <Input
                id="bookingSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tBookings("searchPlaceholder")}
                className="h-8 pl-8 text-xs bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="bg-card shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base font-medium">{tBookings("title")}</CardTitle>
          <CardDescription className="text-xs">
            {tBookings("totalRecorded", { count: filteredBookings.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tBookings("thBookingId")}</TableHead>
                <TableHead>{tBookings("thClientName")}</TableHead>
                <TableHead>{tBookings("thPhone")}</TableHead>
                <TableHead>{tBookings("thDate")}</TableHead>
                <TableHead>{tBookings("thPackage")}</TableHead>
                <TableHead>{tBookings("thTotal")}</TableHead>
                <TableHead>{tBookings("thPayment")}</TableHead>
                <TableHead>{tBookings("thSession")}</TableHead>
                <TableHead className="text-right">{tBookings("thAction")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    <Link
                      href={`/invoice/${item.id}`}
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{item.id}</span>
                      <ExternalLink className="size-2.5 opacity-60" />
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{item.client}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="size-3 text-muted-foreground" />
                      <span>{item.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3 text-muted-foreground" />
                      <span>{item.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{item.pkg}</TableCell>
                  <TableCell className="font-mono text-xs font-medium">{item.total}</TableCell>
                  <TableCell>
                    <Badge variant={item.paymentVariant} className="text-[11px]">
                      {tBookings(item.paymentStatusKey)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.sessionVariant} className="text-[11px]">
                      {tBookings(item.sessionStatusKey)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          aria-label={tBookings("actionsMenu")}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem
                          onClick={() => setSelectedBooking(item)}
                          className="cursor-pointer gap-2"
                        >
                          <Eye className="size-3.5 text-muted-foreground" />
                          <span>{tBookings("btnShowDetails")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link
                            href={formatBookingWhatsAppUrl({
                              phone: item.phone,
                              code: item.id,
                              clientName: item.client,
                            })}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2"
                          >
                            <MessageCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{tBookings("btnWhatsApp")}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {item.paymentStatusKey === "unpaid" && (
                          <DropdownMenuItem
                            onClick={() => handleVerifyDP(item.id)}
                            disabled={isPending}
                            className="cursor-pointer gap-2"
                          >
                            <ShieldCheck className="size-3.5 text-primary" />
                            <span>{tBookings("btnVerifyPayment")}</span>
                          </DropdownMenuItem>
                        )}
                        {item.sessionStatusKey !== "filterConfirmed" &&
                          item.sessionStatusKey !== "filterCancelled" && (
                            <DropdownMenuItem
                              onClick={() => handleConfirmReservation(item.id)}
                              disabled={isPending}
                              className="cursor-pointer gap-2 text-emerald-600 dark:text-emerald-400"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>{tBookings("btnApprove")}</span>
                            </DropdownMenuItem>
                          )}
                        {item.sessionStatusKey !== "filterCancelled" && (
                          <DropdownMenuItem
                            onClick={() => handleRejectBooking(item.id)}
                            disabled={isPending}
                            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                          >
                            <Ban className="size-3.5" />
                            <span>{tBookings("btnReject")}</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Booking Information Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3 pr-6">
              <DialogTitle className="font-serif text-lg font-semibold flex items-center gap-2">
                <span>{selectedBooking?.id}</span>
                {selectedBooking && (
                  <>
                    <Badge variant={selectedBooking.sessionVariant} className="text-xs">
                      {tBookings(selectedBooking.sessionStatusKey)}
                    </Badge>
                    <Badge variant={selectedBooking.paymentVariant} className="text-xs">
                      {tBookings(selectedBooking.paymentStatusKey)}
                    </Badge>
                  </>
                )}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              {selectedBooking ? tBookings("dialogDetailsDesc", { code: selectedBooking.id }) : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-2 text-xs">
              {/* Client & Contact Information */}
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="font-medium text-foreground text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <User className="size-3.5 text-primary" />
                  <span>{tBookings("sectionClientInfo")}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {tBookings("thClientName")}
                    </span>
                    <span className="font-medium text-foreground">{selectedBooking.client}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {tBookings("thPhone")}
                    </span>
                    <div className="flex items-center gap-1">
                      <Phone className="size-3 text-muted-foreground" />
                      <span className="font-mono">{selectedBooking.phone}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {tBookings("labelEmail")}
                    </span>
                    <div className="flex items-center gap-1">
                      <Mail className="size-3 text-muted-foreground" />
                      <span>{selectedBooking.email}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {tBookings("labelCampus")}
                    </span>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="size-3 text-muted-foreground" />
                      <span>{selectedBooking.university}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session & Schedule Details */}
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="font-medium text-foreground text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <Calendar className="size-3.5 text-primary" />
                  <span>{tBookings("sectionSessionInfo")}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {tBookings("labelPackage")}
                    </span>
                    <span className="font-medium text-foreground">{selectedBooking.pkg}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {tBookings("labelSchedule")}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3 text-muted-foreground" />
                      <span>{selectedBooking.date}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {tBookings("labelLocation")}
                    </span>
                    <div className="flex items-center gap-1">
                      <Building className="size-3 text-muted-foreground" />
                      <span>{selectedBooking.studioRoom}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {tBookings("labelCreatedAt")}
                    </span>
                    <span>{selectedBooking.createdAt}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground block text-[11px]">
                      {tBookings("labelNotes")}
                    </span>
                    <div className="flex items-start gap-1 text-muted-foreground italic mt-0.5">
                      <FileText className="size-3 shrink-0 mt-0.5 text-muted-foreground" />
                      <span>{selectedBooking.notes || tBookings("noSpecialNotes")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Financial Summary */}
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="font-medium text-foreground text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <CreditCard className="size-3.5 text-primary" />
                  <span>{tBookings("sectionFinancialInfo")}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                  <div className="p-2 rounded bg-background border">
                    <span className="text-[10px] text-muted-foreground font-sans block">
                      {tBookings("labelTotal")}
                    </span>
                    <span className="font-semibold text-foreground">{selectedBooking.total}</span>
                  </div>
                  <div className="p-2 rounded bg-background border">
                    <span className="text-[10px] text-muted-foreground font-sans block">
                      {tBookings("labelDp")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {selectedBooking.dpAmount}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-background border">
                    <span className="text-[10px] text-muted-foreground font-sans block">
                      {tBookings("labelRemaining")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {selectedBooking.remainingBalance}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between pt-2 border-t">
            {selectedBooking && (
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" asChild>
                <Link href={`/invoice/${selectedBooking.id}`} target="_blank">
                  <ExternalLink className="size-3.5" />
                  <span>{tBookings("btnOpenInvoice")}</span>
                </Link>
              </Button>
            )}

            <div className="flex items-center gap-2 justify-end">
              {selectedBooking && (
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" asChild>
                  <Link
                    href={formatBookingWhatsAppUrl({
                      phone: selectedBooking.phone,
                      code: selectedBooking.id,
                      clientName: selectedBooking.client,
                    })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{tBookings("btnWhatsApp")}</span>
                  </Link>
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setSelectedBooking(null)}
              >
                {tBookings("btnClose")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { Calendar, ExternalLink, MessageCircle, Phone, Search } from "lucide-react";
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

interface BookingRecord {
  id: string;
  client: string;
  phone: string;
  date: string;
  pkg: string;
  total: string;
  paymentStatusKey: "paidFull" | "dpPaid" | "unpaid";
  paymentVariant: "default" | "secondary" | "outline";
  sessionStatusKey: "filterConfirmed" | "filterPendingDP" | "filterCompleted" | "filterCancelled";
  sessionVariant: "default" | "secondary" | "outline" | "destructive";
}

const BOOKINGS_DATA: BookingRecord[] = [
  {
    id: "GS-2025-0842",
    client: "Adinda Prameswari",
    phone: "0812-9876-5432",
    date: "17 May 2025 • 08:30 WIB",
    pkg: "Solo Commencement",
    total: "IDR 1,500,000",
    paymentStatusKey: "paidFull",
    paymentVariant: "default",
    sessionStatusKey: "filterConfirmed",
    sessionVariant: "default",
  },
  {
    id: "GS-2025-0843",
    client: "Rafi & Sarah",
    phone: "0812-3456-7890",
    date: "17 May 2025 • 10:15 WIB",
    pkg: "Besties & Duo",
    total: "IDR 2,400,000",
    paymentStatusKey: "dpPaid",
    paymentVariant: "secondary",
    sessionStatusKey: "filterConfirmed",
    sessionVariant: "default",
  },
  {
    id: "GS-2025-0844",
    client: "Cohort FTUI (8 pax)",
    phone: "0819-8765-4321",
    date: "17 May 2025 • 14:00 WIB",
    pkg: "Sunset Cohort",
    total: "IDR 3,300,000",
    paymentStatusKey: "dpPaid",
    paymentVariant: "secondary",
    sessionStatusKey: "filterConfirmed",
    sessionVariant: "default",
  },
  {
    id: "GS-2025-0845",
    client: "Nadia Faradilla",
    phone: "0811-2233-4455",
    date: "17 May 2025 • 16:30 WIB",
    pkg: "Solo Commencement",
    total: "IDR 1,500,000",
    paymentStatusKey: "unpaid",
    paymentVariant: "outline",
    sessionStatusKey: "filterPendingDP",
    sessionVariant: "outline",
  },
  {
    id: "GS-2025-0839",
    client: "Farhan & Kevin",
    phone: "0813-5566-7788",
    date: "10 May 2025 • 15:30 WIB",
    pkg: "Besties & Duo",
    total: "IDR 1,950,000",
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

  const filters = [
    { key: "all", label: tBookings("filterAll") },
    { key: "confirmed", label: tBookings("filterConfirmed") },
    { key: "pending", label: tBookings("filterPendingDP") },
    { key: "completed", label: tBookings("filterCompleted") },
    { key: "cancelled", label: tBookings("filterCancelled") },
  ];

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
            {"5 Total Bookings Recorded in Database"}
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
                <TableHead className="text-right">{"Action"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BOOKINGS_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    <Link
                      href={`/track-order?ref=${item.id}`}
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
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" asChild>
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="size-3" />
                        <span>{tBookings("btnWhatsApp")}</span>
                      </a>
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

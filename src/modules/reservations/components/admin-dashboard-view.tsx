"use client";

import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CalendarCheck,
  Filter,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import type { AdminDashboardResult } from "../use-cases/get-admin-dashboard.use-case";

interface AdminDashboardViewProps {
  initialData: AdminDashboardResult;
}

export function AdminDashboardView({ initialData }: AdminDashboardViewProps) {
  const tDash = useTranslations("adminDashboard");

  // Revenue Range Filter State
  const [rangePreset, setRangePreset] = useState<string>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [appliedCustom, setAppliedCustom] = useState<{ start: string; end: string } | null>(null);

  // Compute filtered revenue
  const displayedRevenue = useMemo(() => {
    if (rangePreset === "all") {
      return initialData.revenue.totalRevenue;
    }
    if (rangePreset === "month") {
      return initialData.revenue.thisMonthRevenue;
    }
    if (rangePreset === "today") {
      return initialData.revenue.todayRevenue;
    }
    if (rangePreset === "30days") {
      const now = new Date();
      const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return initialData.allPaidRecords
        .filter((r) => {
          const d = new Date(r.sessionDate);
          return d >= past30 && d <= now;
        })
        .reduce((sum, r) => sum + r.grandTotal, 0);
    }
    if (rangePreset === "custom" && appliedCustom) {
      const startDate = appliedCustom.start ? new Date(appliedCustom.start) : null;
      const endDate = appliedCustom.end ? new Date(`${appliedCustom.end}T23:59:59.999Z`) : null;
      return initialData.allPaidRecords
        .filter((r) => {
          const d = new Date(r.sessionDate);
          if (startDate && d < startDate) return false;
          if (endDate && d > endDate) return false;
          return true;
        })
        .reduce((sum, r) => sum + r.grandTotal, 0);
    }
    return initialData.revenue.totalRevenue;
  }, [rangePreset, appliedCustom, initialData]);

  const displayedRevenueFormatted = useMemo(() => {
    return `IDR ${displayedRevenue.toLocaleString("id-ID")}`;
  }, [displayedRevenue]);

  const handleApplyCustom = () => {
    if (customStart || customEnd) {
      setAppliedCustom({ start: customStart, end: customEnd });
    }
  };

  const handleResetCustom = () => {
    setCustomStart("");
    setCustomEnd("");
    setAppliedCustom(null);
    setRangePreset("all");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
          {tDash("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-sans">{tDash("subtitle")}</p>
      </div>

      {/* Top 3 Metric Cards Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Revenue with Range Filter */}
        <Card className="bg-card shadow-xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {tDash("cardRevenueTitle")}
            </CardTitle>
            <Select value={rangePreset} onValueChange={setRangePreset}>
              <SelectTrigger
                size="sm"
                className="h-7 text-xs font-medium gap-1"
                aria-label={tDash("filterRangeLabel")}
              >
                <Filter className="size-3 text-muted-foreground" />
                <SelectValue placeholder={tDash("filterRangeLabel")} />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">{tDash("rangeAllTime")}</SelectItem>
                <SelectItem value="month">{tDash("rangeThisMonth")}</SelectItem>
                <SelectItem value="30days">{tDash("rangeLast30Days")}</SelectItem>
                <SelectItem value="today">{tDash("rangeToday")}</SelectItem>
                <SelectItem value="custom">{tDash("rangeCustom")}</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-semibold tracking-tight font-sans">
                {displayedRevenueFormatted}
              </div>
            </div>

            {/* Custom Range Inputs */}
            {rangePreset === "custom" && (
              <div className="rounded-md border p-2 space-y-2 bg-muted/40">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    className="h-8 text-xs font-mono"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    aria-label={tDash("startDateLabel")}
                  />
                  <Input
                    type="date"
                    className="h-8 text-xs font-mono"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    aria-label={tDash("endDateLabel")}
                  />
                </div>
                <div className="flex justify-end gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleResetCustom}
                  >
                    {tDash("btnResetRange")}
                  </Button>
                  <Button size="sm" className="h-7 text-xs" onClick={handleApplyCustom}>
                    {tDash("btnApplyRange")}
                  </Button>
                </div>
              </div>
            )}

            {/* Sub-Metrics: This Month & Today */}
            <div className="grid grid-cols-2 gap-2 border-t pt-3">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {tDash("revenueThisMonth")}
                </p>
                <p className="text-sm font-semibold tracking-tight text-foreground font-sans">
                  {initialData.revenue.thisMonthRevenueFormatted}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {tDash("revenueToday")}
                </p>
                <p className="text-sm font-semibold tracking-tight text-foreground font-sans">
                  {initialData.revenue.todayRevenueFormatted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Status Booking */}
        <Card className="bg-card shadow-xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {tDash("cardBookingStatusTitle")}
            </CardTitle>
            <div className="flex size-7 items-center justify-center rounded-sm bg-muted text-muted-foreground">
              <CalendarCheck className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-semibold tracking-tight font-sans">
                {initialData.bookingStatus.total}
              </div>
              <p className="text-xs text-muted-foreground">{tDash("totalBookingsLabel")}</p>
            </div>

            {/* Breakdown with specific required colors */}
            <div className="grid grid-cols-4 gap-2 border-t pt-3">
              {/* Pending: Yellow (amber) */}
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {tDash("statusPending")}
                </span>
                <span className="text-base font-bold text-amber-500 dark:text-amber-400 font-sans">
                  {initialData.bookingStatus.pending}
                </span>
              </div>
              {/* Approved: Green (emerald) */}
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {tDash("statusApproved")}
                </span>
                <span className="text-base font-bold text-emerald-500 dark:text-emerald-400 font-sans">
                  {initialData.bookingStatus.approved}
                </span>
              </div>
              {/* Paid: Blue (sky) */}
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {tDash("statusPaid")}
                </span>
                <span className="text-base font-bold text-sky-500 dark:text-sky-400 font-sans">
                  {initialData.bookingStatus.paid}
                </span>
              </div>
              {/* Canceled: Red (rose) */}
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {tDash("statusCancelled")}
                </span>
                <span className="text-base font-bold text-rose-500 dark:text-rose-400 font-sans">
                  {initialData.bookingStatus.cancelled}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Action Required (Highlighted Distinct Card) */}
        <Card className="relative overflow-hidden border-2 border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                {tDash("cardActionRequiredTitle")}
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/15 text-[10px] uppercase font-mono tracking-wider font-semibold"
            >
              {tDash("actionRequiredBadge")}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground font-sans">
                {initialData.actionRequired.totalCount}
              </div>
            </div>

            {/* Badges / Items Breakdown */}
            <div className="space-y-1.5 border-t border-amber-500/20 pt-3">
              {initialData.actionRequired.totalCount === 0 ? (
                <p className="text-xs text-muted-foreground font-sans">
                  {tDash("actionRequiredEmpty")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {initialData.actionRequired.pendingBookingsCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-amber-500/20 text-amber-800 dark:text-amber-200"
                    >
                      {tDash("actionPendingCount", {
                        count: initialData.actionRequired.pendingBookingsCount,
                      })}
                    </Badge>
                  )}
                  {initialData.actionRequired.unverifiedPaymentsCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-amber-500/20 text-amber-800 dark:text-amber-200"
                    >
                      {tDash("actionPaymentCount", {
                        count: initialData.actionRequired.unverifiedPaymentsCount,
                      })}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* CTA directly to Bookings management */}
            <Button
              size="sm"
              className="w-full h-8 text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 font-medium"
              asChild
            >
              <Link href="/admin/bookings">
                <span>{tDash("btnReviewBookings")}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Section: Upcoming Shoots (Left) & Recent Requests (Right) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Upcoming Shoot Schedule */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Card className="bg-card shadow-xs h-full">
            <CardHeader>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="font-serif text-lg font-medium">
                    {tDash("upcomingShootsTitle")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {tDash("upcomingShootsSubtitle")}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit text-xs font-mono">
                  {initialData.upcomingShoots.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {initialData.upcomingShoots.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {tDash("upcomingShootsEmpty")}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{tDash("thSchedule")}</TableHead>
                      <TableHead>{tDash("thClientName")}</TableHead>
                      <TableHead>{tDash("thPackageLocation")}</TableHead>
                      <TableHead>{tDash("thStatus")}</TableHead>
                      <TableHead className="text-right">{tDash("thAction")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialData.upcomingShoots.map((shoot) => (
                      <TableRow key={shoot.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-foreground">
                              {shoot.sessionDateFormatted}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {shoot.time}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-foreground">
                              {shoot.clientName}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {shoot.code}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-foreground">{shoot.packageName}</span>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <MapPin className="size-2.5 text-muted-foreground shrink-0" />
                              <span>{shoot.location}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={shoot.statusVariant} className="text-[10px]">
                            {tDash(shoot.statusKey)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" asChild>
                            <a
                              href={`https://wa.me/${shoot.cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <MessageCircle className="size-3" />
                              <span>{tDash("btnWhatsApp")}</span>
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Booking Requests */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="bg-card shadow-xs h-full flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-lg font-medium">
                    {tDash("recentRequestsTitle")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {tDash("recentRequestsSubtitle")}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="w-fit text-xs font-mono border-amber-500/40 text-amber-600 dark:text-amber-400"
                >
                  {initialData.recentRequests.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {initialData.recentRequests.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {tDash("recentRequestsEmpty")}
                </div>
              ) : (
                initialData.recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{req.clientName}</p>
                        <p className="text-[11px] text-muted-foreground">{req.packageName}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-amber-500/40 text-amber-600 dark:text-amber-400 shrink-0"
                      >
                        {tDash("statusPending")}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="size-3" />
                        <span>{`${req.requestedDate} • ${req.time}`}</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {req.grandTotalFormatted}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2" asChild>
                        <a
                          href={`https://wa.me/${req.cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="size-3 mr-1" />
                          <span>{tDash("btnWhatsApp")}</span>
                        </a>
                      </Button>
                      <Button size="sm" className="h-6 text-[11px] px-2.5" asChild>
                        <Link href="/admin/bookings">
                          <span>{tDash("btnApprove")}</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

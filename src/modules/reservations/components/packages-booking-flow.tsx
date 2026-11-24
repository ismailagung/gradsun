"use client";

import { cn } from "cn";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  MapPin,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { BookingConfirmationDialog } from "@/modules/reservations/components/booking-confirmation-dialog";
import {
  TimePickerControl,
  type TimePickerControlLabels,
} from "@/modules/reservations/components/time-picker-control";

export interface PackageTierItem {
  id: string;
  title: string;
  price: string;
  dpPrice: string;
  duration: string;
  scope: string;
  feats: string[];
  iconType: "single" | "sparkles" | "group";
}

export interface PackagesBookingFlowLabels {
  step1Title: string;
  step2Title: string;
  step3Title: string;
  viewDetails: string;
  monthYearSelector: string;
  dayMo: string;
  dayTu: string;
  dayWe: string;
  dayTh: string;
  dayFr: string;
  daySa: string;
  daySu: string;
  selectedDateTitle: string;
  selectedDateSubtitle: string;
  operatingHoursBadge: string;
  timePickerTitle: string;
  timePickerSubtitle: string;
  bookedSlotsTitle: string;
  bookedSlotsCount: string;
  bookedClient1Name: string;
  bookedClient1Time: string;
  bookedClient2Name: string;
  bookedClient2Time: string;
  bookedBadge: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  instagramLabel: string;
  instagramPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  trackingNotice: string;
  orderSummaryTitle: string;
  summarySlotBadge: string;
  basePriceLabel: string;
  totalLabel: string;
  dpAmountLabel: string;
  dpNotice: string;
  summaryClientTitle: string;
  summaryClientEmpty: string;
  summaryNameLabel: string;
  summaryContactLabel: string;
  summaryIgLabel: string;
  summaryLocationLabel: string;
  summaryNotesLabel: string;
  timePickerLabels: TimePickerControlLabels;
  dialogLabels: {
    bookNowCta: string;
    orderSentTitle: string;
    orderSentSubtitle: string;
    orderSentDesc: string;
    orderRecapPackage: string;
    orderRecapSchedule: string;
    orderRecapClient: string;
    orderRecapLocation: string;
    orderRecapNotes: string;
    preliminaryInvoiceTitle: string;
    preliminaryInvoiceDesc: string;
    downloadInvoiceCta: string;
    finishCta: string;
  };
}

interface PackagesBookingFlowProps {
  packages: PackageTierItem[];
  labels: PackagesBookingFlowLabels;
}

export function PackagesBookingFlow({ packages, labels }: PackagesBookingFlowProps) {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[0]?.id || "pkg-single-1");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const selectedPackage = packages.find((p) => p.id === selectedPkgId) || packages[0];

  const hasAnyClientInfo = Boolean(fullName || phone || instagram || email || location || notes);

  const confirmationDialogLabels = {
    bookNowCta: labels.dialogLabels.bookNowCta,
    orderSentTitle: labels.dialogLabels.orderSentTitle,
    orderSentSubtitle: labels.dialogLabels.orderSentSubtitle,
    orderSentDesc: labels.dialogLabels.orderSentDesc,
    orderRecapPackage: labels.dialogLabels.orderRecapPackage,
    orderRecapSchedule: labels.dialogLabels.orderRecapSchedule,
    orderRecapClient: labels.dialogLabels.orderRecapClient,
    orderRecapLocation: labels.dialogLabels.orderRecapLocation,
    orderRecapNotes: labels.dialogLabels.orderRecapNotes,
    preliminaryInvoiceTitle: labels.dialogLabels.preliminaryInvoiceTitle,
    preliminaryInvoiceDesc: labels.dialogLabels.preliminaryInvoiceDesc,
    downloadInvoiceCta: labels.dialogLabels.downloadInvoiceCta,
    finishCta: labels.dialogLabels.finishCta,
    packageName: selectedPackage?.title || "",
    packagePrice: selectedPackage?.price || "",
    dpPrice: selectedPackage?.dpPrice || "",
    scheduleText: labels.summarySlotBadge,
    clientName: fullName.trim() || "-",
    clientContact: `${phone.trim() || "-"} • ${email.trim() || "-"}`,
    clientLocation: location.trim() || "-",
    clientNotes: notes.trim() || "-",
  };

  const getPackageIcon = (type: "single" | "sparkles" | "group") => {
    switch (type) {
      case "single":
        return GraduationCap;
      case "sparkles":
        return Sparkles;
      case "group":
        return Users;
      default:
        return Users;
    }
  };

  return (
    <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Main Wizard Form (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        {/* STEP 1: PACKAGE SELECTION */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold font-serif">
              {"1"}
            </span>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {labels.step1Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => {
              const Icon = getPackageIcon(pkg.iconType);
              const isSelected = pkg.id === selectedPkgId;

              return (
                <Card
                  key={pkg.id}
                  onClick={() => setSelectedPkgId(pkg.id)}
                  className={cn(
                    "relative p-4 rounded-2xl shadow-xs cursor-pointer transition-all flex flex-col justify-between",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="size-3" />
                    </div>
                  )}
                  <CardContent className="p-0 flex flex-col justify-between h-full gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between pr-7">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Icon className="size-4" />
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-medium border-border",
                            isSelected && "border-primary/40 text-primary",
                          )}
                        >
                          {pkg.duration}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-foreground">
                          {pkg.title}
                        </h3>
                        <p className="text-xs font-medium text-foreground/80 mt-0.5">{pkg.scope}</p>
                      </div>
                      <ul className="space-y-1.5 pt-2 text-xs text-muted-foreground border-t border-border/50">
                        {pkg.feats.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{labels.viewDetails}</span>
                      <span className="font-serif text-sm font-bold text-primary">{pkg.price}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* STEP 2: DATE & TIME SLOT PICKER */}
        <section className="flex flex-col gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold font-serif">
              {"2"}
            </span>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {labels.step2Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-card border border-border rounded-2xl p-6 shadow-xs">
            {/* Left (5 cols): Interactive Calendar Month & Year */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-4 text-primary" />
                  <span className="font-serif font-bold text-sm text-foreground">
                    {labels.monthYearSelector}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-7 rounded-lg">
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7 rounded-lg">
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                <span className="font-semibold text-muted-foreground py-1">{labels.dayMo}</span>
                <span className="font-semibold text-muted-foreground py-1">{labels.dayTu}</span>
                <span className="font-semibold text-muted-foreground py-1">{labels.dayWe}</span>
                <span className="font-semibold text-muted-foreground py-1">{labels.dayTh}</span>
                <span className="font-semibold text-muted-foreground py-1">{labels.dayFr}</span>
                <span className="font-semibold text-primary py-1">{labels.daySa}</span>
                <span className="font-semibold text-primary py-1">{labels.daySu}</span>

                {/* Week 1 */}
                <span className="py-2 text-[11px] text-muted-foreground/30">{"28"}</span>
                <span className="py-2 text-[11px] text-muted-foreground/30">{"29"}</span>
                <span className="py-2 text-[11px] text-muted-foreground/30">{"30"}</span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"1"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"2"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"3"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"4"}
                </span>

                {/* Week 2 */}
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"5"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"6"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"7"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"8"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"9"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer relative">
                  {"10"}
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary/60" />
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"11"}
                </span>

                {/* Week 3 */}
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"12"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"13"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"14"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"15"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"16"}
                </span>
                {/* Selected Day: 17 May */}
                <span className="py-2 text-[11px] font-bold rounded-lg bg-primary text-primary-foreground shadow-xs cursor-pointer">
                  {"17"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"18"}
                </span>

                {/* Week 4 */}
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"19"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"20"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"21"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"22"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"23"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer relative">
                  {"24"}
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary/60" />
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"25"}
                </span>

                {/* Week 5 */}
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"26"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"27"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"28"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"29"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"30"}
                </span>
                <span className="py-2 text-[11px] rounded-lg hover:bg-secondary cursor-pointer">
                  {"31"}
                </span>
                <span className="py-2 text-[11px] text-muted-foreground/30">{"1"}</span>
              </div>
            </div>

            {/* Right (7 cols): Selected Date Schedule Details & Slots */}
            <div className="lg:col-span-7 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
              {/* Selected Date Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-sm text-foreground">
                    {labels.selectedDateTitle}
                  </span>
                  <span className="text-xs text-primary font-medium">
                    {labels.selectedDateSubtitle}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="self-start sm:self-auto text-[10px] flex items-center gap-1.5"
                >
                  <Clock className="size-3 text-primary" />
                  <span>{labels.operatingHoursBadge}</span>
                </Badge>
              </div>

              {/* Section A: Time Picker (Free-to-choose Start Time as requested) */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider font-serif text-foreground">
                    {labels.timePickerTitle}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {labels.timePickerSubtitle}
                  </span>
                </div>

                <TimePickerControl
                  initialHour="16"
                  initialMinute="30"
                  initialHasSelected={false}
                  labels={labels.timePickerLabels}
                />
              </div>

              {/* Section B: Booked Sessions on This Date */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider font-serif text-foreground">
                      {labels.bookedSlotsTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {labels.bookedSlotsCount}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Booked Client 1 */}
                  <div className="p-3 rounded-xl border border-border/80 bg-secondary/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
                        <User className="size-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {labels.bookedClient1Name}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {labels.bookedClient1Time}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 border-border bg-card">
                      {labels.bookedBadge}
                    </Badge>
                  </div>

                  {/* Booked Client 2 */}
                  <div className="p-3 rounded-xl border border-border/80 bg-secondary/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
                        <User className="size-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {labels.bookedClient2Name}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {labels.bookedClient2Time}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 border-border bg-card">
                      {labels.bookedBadge}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3: CLIENT DETAILS & LOCATION */}
        <section className="flex flex-col gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold font-serif">
              {"3"}
            </span>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {labels.step3Title}
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="fullName"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <span>{labels.fullNameLabel}</span>
                  <span className="text-destructive font-bold text-sm leading-none">{"*"}</span>
                </label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={labels.fullNamePlaceholder}
                />
              </div>

              {/* WhatsApp Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <span>{labels.phoneLabel}</span>
                  <span className="text-destructive font-bold text-sm leading-none">{"*"}</span>
                </label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={labels.phonePlaceholder}
                />
              </div>

              {/* Instagram Handle */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="instagram"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <span>{labels.instagramLabel}</span>
                  <span className="text-destructive font-bold text-sm leading-none">{"*"}</span>
                </label>
                <Input
                  id="instagram"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder={labels.instagramPlaceholder}
                />
              </div>

              {/* Active Email Address */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <span>{labels.emailLabel}</span>
                  <span className="text-destructive font-bold text-sm leading-none">{"*"}</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={labels.emailPlaceholder}
                />
              </div>
            </div>

            {/* Shooting Location / Full Address */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="location"
                className="text-xs font-medium text-foreground flex items-center gap-1"
              >
                <MapPin className="size-3.5 text-primary" />
                <span>{labels.locationLabel}</span>
                <span className="text-destructive font-bold text-sm leading-none">{"*"}</span>
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={labels.locationPlaceholder}
              />
            </div>

            {/* Special Notes for Photographer */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="notes"
                className="text-xs font-medium text-foreground flex items-center gap-1"
              >
                <FileText className="size-3.5 text-muted-foreground" />
                <span>{labels.notesLabel}</span>
              </label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={labels.notesPlaceholder}
              />
            </div>

            {/* Tracking & Data Notice */}
            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 flex items-center gap-2.5 text-xs text-muted-foreground">
              <Clock className="size-4 text-primary shrink-0" />
              <p className="text-[11px] leading-relaxed">{labels.trackingNotice}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Order Summary & Checkout Card (4 cols) */}
      <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
        <Card className="border-border bg-card p-6 rounded-2xl shadow-md flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="font-serif text-lg font-semibold text-foreground">
              {labels.orderSummaryTitle}
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {labels.summarySlotBadge}
            </Badge>
          </div>

          {/* Pricing Breakdown */}
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>
                {labels.basePriceLabel} {`(${selectedPackage?.title})`}
              </span>
              <span className="text-foreground font-mono font-medium">
                {selectedPackage?.price}
              </span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between font-serif text-sm font-semibold text-foreground">
              <span>{labels.totalLabel}</span>
              <span className="text-primary font-mono text-base">{selectedPackage?.price}</span>
            </div>
          </div>

          {/* 50% DP Alert Box */}
          <div className="p-3.5 rounded-xl border border-primary/40 bg-primary/10 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
              {labels.dpAmountLabel}
            </span>
            <span className="font-serif text-xl font-bold text-foreground font-mono">
              {selectedPackage?.dpPrice}
            </span>
            <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
              {labels.dpNotice}
            </p>
          </div>

          {/* Client Details Recap from Form (Requested by User) */}
          <div className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 pb-2 border-b border-border/60">
              <User className="size-3.5 text-primary" />
              <span className="font-semibold text-foreground font-serif text-[11px] uppercase tracking-wider">
                {labels.summaryClientTitle}
              </span>
            </div>

            {hasAnyClientInfo ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-muted-foreground shrink-0">{labels.summaryNameLabel}</span>
                  <span className="font-medium text-foreground text-right truncate">
                    {fullName || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-muted-foreground shrink-0">
                    {labels.summaryContactLabel}
                  </span>
                  <span className="font-mono text-foreground text-right truncate">
                    {phone || email ? `${phone || "-"} • ${email || "-"}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-muted-foreground shrink-0">{labels.summaryIgLabel}</span>
                  <span className="font-medium text-foreground text-right truncate">
                    {instagram || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-muted-foreground shrink-0">
                    {labels.summaryLocationLabel}
                  </span>
                  <span className="font-medium text-foreground text-right line-clamp-2">
                    {location || "-"}
                  </span>
                </div>
                {notes && (
                  <div className="flex justify-between items-start gap-2 pt-1 border-t border-border/40">
                    <span className="text-muted-foreground shrink-0">
                      {labels.summaryNotesLabel}
                    </span>
                    <span className="font-normal text-muted-foreground text-right italic line-clamp-2">
                      {notes}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-[11px] text-muted-foreground italic">
                {labels.summaryClientEmpty}
              </span>
            )}
          </div>

          {/* Book Now Button Triggering Modal Dialog */}
          <BookingConfirmationDialog labels={confirmationDialogLabels} />
        </Card>
      </div>
    </div>
  );
}

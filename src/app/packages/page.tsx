import {
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  Clock,
  GraduationCap,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";

export default async function PackagesBookingPage() {
  const tNav = await getTranslations("nav");
  const tPkg = await getTranslations("packagesPage");

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative size-9 overflow-hidden rounded-full border border-border bg-card p-0.5 shadow-xs">
              <Image
                src="/gradsun-no-bg.png"
                alt={tNav("logoAlt")}
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg leading-none font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {tNav("brand")}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground mt-0.5">
                {tNav("tagline")}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-secondary/50 p-1">
            <Button variant="ghost" size="default" asChild className="rounded-full px-4 text-xs">
              <Link href="/">{tNav("home")}</Link>
            </Button>
            <Button variant="ghost" size="default" asChild className="rounded-full px-4 text-xs">
              <Link href="/portfolio">{tNav("portfolio")}</Link>
            </Button>
            <Button
              variant="ghost"
              size="default"
              asChild
              className="rounded-full px-4 text-xs text-primary font-medium"
            >
              <Link href="/packages">{tNav("packages")}</Link>
            </Button>
            <Button variant="ghost" size="default" asChild className="rounded-full px-4 text-xs">
              <Link href="/track-order">{tNav("trackOrder")}</Link>
            </Button>
            <Button
              variant="ghost"
              size="default"
              asChild
              className="rounded-full px-4 text-xs text-primary font-medium"
            >
              <Link href="/admin">{tNav("admin")}</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button size="default" asChild className="rounded-full shadow-xs">
              <Link href="/packages">{tNav("bookSession")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Reservation Flow */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border">
          <div className="flex flex-col gap-2 max-w-2xl">
            <Badge
              variant="secondary"
              className="gap-2 px-3 py-1 text-xs font-normal border border-border self-start"
            >
              <Sparkles className="size-3.5 text-primary" />
              <span>{tPkg("headerBadge")}</span>
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
              {tPkg("headerTitle")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {tPkg("headerSubtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-xs self-start md:self-auto">
            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground font-serif">
                {tPkg("weatherGuarantee")}
              </span>
            </div>
          </div>
        </div>

        {/* STEPPER WIZARD CONTAINER */}
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
                  {tPkg("step1Title")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Package 1 */}
                <Card className="border-border bg-card p-4 rounded-2xl shadow-xs cursor-pointer hover:border-primary transition-all">
                  <CardContent className="p-0 flex flex-col justify-between h-full gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <GraduationCap className="size-5 text-primary" />
                        <Badge variant="outline" className="text-[10px] border-border font-mono">
                          {tPkg("pkgSoloDuration")}
                        </Badge>
                      </div>
                      <h3 className="font-serif text-base font-semibold text-foreground mt-1">
                        {tPkg("pkgSoloTitle")}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tPkg("pkgSoloDesc")}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{tPkg("pkgSoloQuota")}</span>
                      <span className="font-serif text-sm font-semibold text-primary">
                        {tPkg("pkgSoloPrice")}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Package 2 (Selected) */}
                <Card className="border-primary bg-primary/5 p-4 rounded-2xl shadow-xs cursor-pointer relative">
                  <div className="absolute top-3 right-3 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="size-3" />
                  </div>
                  <CardContent className="p-0 flex flex-col justify-between h-full gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between pr-6">
                        <Heart className="size-5 text-primary" />
                        <Badge
                          variant="outline"
                          className="text-[10px] border-primary/30 font-mono"
                        >
                          {tPkg("pkgBestiesDuration")}
                        </Badge>
                      </div>
                      <h3 className="font-serif text-base font-semibold text-foreground mt-1">
                        {tPkg("pkgBestiesTitle")}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tPkg("pkgBestiesDesc")}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-primary/20 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {tPkg("pkgBestiesQuota")}
                      </span>
                      <span className="font-serif text-sm font-semibold text-primary">
                        {tPkg("pkgBestiesPrice")}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Package 3 */}
                <Card className="border-border bg-card p-4 rounded-2xl shadow-xs cursor-pointer hover:border-primary transition-all">
                  <CardContent className="p-0 flex flex-col justify-between h-full gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <Users className="size-5 text-primary" />
                        <Badge variant="outline" className="text-[10px] border-border font-mono">
                          {tPkg("pkgCohortDuration")}
                        </Badge>
                      </div>
                      <h3 className="font-serif text-base font-semibold text-foreground mt-1">
                        {tPkg("pkgCohortTitle")}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tPkg("pkgCohortDesc")}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {tPkg("pkgCohortQuota")}
                      </span>
                      <span className="font-serif text-sm font-semibold text-primary">
                        {tPkg("pkgCohortPrice")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* STEP 2: DATE & TIME SLOT PICKER */}
            <section className="flex flex-col gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold font-serif">
                  {"2"}
                </span>
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {tPkg("step2Title")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border border-border rounded-2xl p-6 shadow-xs">
                {/* Left: Schedule Details */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-foreground font-serif">
                    <CalendarIcon className="size-4 text-primary" />
                    <span className="font-semibold text-sm">{tPkg("monthHeader")}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                    <span className="font-semibold text-muted-foreground py-1">
                      {tPkg("dayMo")}
                    </span>
                    <span className="font-semibold text-muted-foreground py-1">
                      {tPkg("dayTu")}
                    </span>
                    <span className="font-semibold text-muted-foreground py-1">
                      {tPkg("dayWe")}
                    </span>
                    <span className="font-semibold text-muted-foreground py-1">
                      {tPkg("dayTh")}
                    </span>
                    <span className="font-semibold text-muted-foreground py-1">
                      {tPkg("dayFr")}
                    </span>
                    <span className="font-semibold text-primary py-1">{tPkg("daySa")}</span>
                    <span className="font-semibold text-primary py-1">{tPkg("daySu")}</span>

                    <span className="py-1.5 rounded-lg text-muted-foreground/40">{"12"}</span>
                    <span className="py-1.5 rounded-lg text-muted-foreground/40">{"13"}</span>
                    <span className="py-1.5 rounded-lg text-muted-foreground/40">{"14"}</span>
                    <span className="py-1.5 rounded-lg text-muted-foreground/40">{"15"}</span>
                    <span className="py-1.5 rounded-lg text-foreground hover:bg-secondary">
                      {"16"}
                    </span>
                    <span className="py-1.5 rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
                      {"17"}
                    </span>
                    <span className="py-1.5 rounded-lg text-foreground hover:bg-secondary">
                      {"18"}
                    </span>
                  </div>
                </div>

                {/* Right: Available Slot Pills */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-serif">
                    {tPkg("slotsTitle")}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl border border-border bg-secondary/30 flex flex-col gap-1 cursor-pointer hover:border-primary">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold">{"06:30"}</span>
                        <Sun className="size-3 text-muted-foreground" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {tPkg("morningSlotBadge")}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-border bg-secondary/30 flex flex-col gap-1 cursor-pointer hover:border-primary">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold">{"08:00"}</span>
                        <Sun className="size-3 text-muted-foreground" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {tPkg("morningSlotBadge")}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-border bg-secondary/30 flex flex-col gap-1 cursor-pointer hover:border-primary">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold">{"15:30"}</span>
                        <Clock className="size-3 text-primary" />
                      </div>
                      <span className="text-[10px] text-primary">
                        {tPkg("goldenHourSlotBadge")}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-primary bg-primary/10 flex flex-col gap-1 cursor-pointer shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">{"16:30"}</span>
                        <Sparkles className="size-3 text-primary" />
                      </div>
                      <span className="text-[10px] font-semibold text-primary">
                        {tPkg("goldenHourSlotBadge")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* STEP 3: CLIENT DETAILS & ADDONS */}
            <section className="flex flex-col gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold font-serif">
                  {"3"}
                </span>
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {tPkg("step3Title")}
                </h2>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fullName" className="text-xs font-medium text-foreground">
                      {tPkg("fullNameLabel")}
                    </label>
                    <Input
                      id="fullName"
                      placeholder={tPkg("fullNamePlaceholder")}
                      defaultValue="Adinda Prameswari"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-medium text-foreground">
                      {tPkg("phoneLabel")}
                    </label>
                    <Input
                      id="phone"
                      placeholder={tPkg("phonePlaceholder")}
                      defaultValue="081298765432"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="instagram" className="text-xs font-medium text-foreground">
                      {tPkg("instagramLabel")}
                    </label>
                    <Input
                      id="instagram"
                      placeholder={tPkg("instagramPlaceholder")}
                      defaultValue="@adindaprm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-foreground">
                      {tPkg("campusLabel")}
                    </span>
                    <Select defaultValue="ui">
                      <SelectTrigger>
                        <SelectValue placeholder={tPkg("campusPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ui">{tPkg("campusUI")}</SelectItem>
                        <SelectItem value="itb">{tPkg("campusITB")}</SelectItem>
                        <SelectItem value="ugm">{tPkg("campusUGM")}</SelectItem>
                        <SelectItem value="unpad">{tPkg("campusUNPAD")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Add-on Enhancement Checklist */}
                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-serif">
                    {tPkg("addonsTitle")}
                  </span>

                  <div className="flex flex-col gap-2">
                    <div className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="size-4 rounded-md border border-primary bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="size-3" />
                        </div>
                        <span className="text-xs text-foreground font-medium">
                          {tPkg("addonPhotobookTitle")}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        {tPkg("addonPhotobookPrice")}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="size-4 rounded-md border border-border bg-card" />
                        <span className="text-xs text-foreground font-medium">
                          {tPkg("addonFastTitle")}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {tPkg("addonFastPrice")}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="size-4 rounded-md border border-border bg-card" />
                        <span className="text-xs text-foreground font-medium">
                          {tPkg("addonPrintsTitle")}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {tPkg("addonPrintsPrice")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Order Summary & Checkout Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
            <Card className="border-border bg-card p-6 rounded-2xl shadow-md flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-serif text-lg font-semibold text-foreground">
                  {tPkg("orderSummaryTitle")}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {tPkg("summarySlotBadge")}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {tPkg("basePriceLabel")} {tPkg("summaryPkgName")}
                  </span>
                  <span className="text-foreground font-mono">{tPkg("summaryPkgPrice")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {tPkg("addonsSubtotalLabel")} {tPkg("summaryAddonName")}
                  </span>
                  <span className="text-foreground font-mono">{tPkg("summaryAddonPrice")}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-serif text-sm font-semibold text-foreground">
                  <span>{tPkg("totalLabel")}</span>
                  <span className="text-primary font-mono text-base">
                    {tPkg("summaryTotalPrice")}
                  </span>
                </div>
              </div>

              {/* 50% DP Alert Box */}
              <div className="p-3.5 rounded-xl border border-primary/40 bg-primary/10 flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
                  {tPkg("dpAmountLabel")}
                </span>
                <span className="font-serif text-xl font-bold text-foreground font-mono">
                  {tPkg("summaryDpPrice")}
                </span>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                  {tPkg("dpNotice")}
                </p>
              </div>

              {/* Payment Details */}
              <div className="flex flex-col gap-1 text-xs bg-secondary/50 p-3 rounded-xl border border-border">
                <span className="font-semibold text-foreground font-serif">
                  {tPkg("paymentDetailsTitle")}
                </span>
                <span className="font-mono text-muted-foreground">{tPkg("bcaAccount")}</span>
              </div>

              {/* WhatsApp Dispatch Button */}
              <Button size="lg" asChild className="gap-2 rounded-xl text-sm shadow-md w-full">
                <Link href="https://wa.me/6281234567890">
                  <MessageCircle className="size-4" />
                  <span>{tPkg("dispatchCta")}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

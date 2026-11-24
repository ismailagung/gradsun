import { cn } from "cn";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Sun,
  User,
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
  const tPkgSummary = await getTranslations("packagesSummary");

  const packageTiers = [
    {
      id: "pkg-single-1",
      title: tPkgSummary("pkg1Title"),
      price: tPkgSummary("pkg1Price"),
      duration: tPkgSummary("pkg1Duration"),
      scope: tPkgSummary("pkg1Scope"),
      feats: [tPkgSummary("pkg1Feat1"), tPkgSummary("pkg1Feat2"), tPkgSummary("pkg1Feat3")],
      icon: GraduationCap,
      selected: true,
    },
    {
      id: "pkg-single-2",
      title: tPkgSummary("pkg2Title"),
      price: tPkgSummary("pkg2Price"),
      duration: tPkgSummary("pkg2Duration"),
      scope: tPkgSummary("pkg2Scope"),
      feats: [tPkgSummary("pkg2Feat1"), tPkgSummary("pkg2Feat2"), tPkgSummary("pkg2Feat3")],
      icon: Sparkles,
      selected: false,
    },
    {
      id: "pkg-group-1",
      title: tPkgSummary("pkg3Title"),
      price: tPkgSummary("pkg3Price"),
      duration: tPkgSummary("pkg3Duration"),
      scope: tPkgSummary("pkg3Scope"),
      feats: [tPkgSummary("pkg3Feat1"), tPkgSummary("pkg3Feat2"), tPkgSummary("pkg3Feat3")],
      icon: Users,
      selected: false,
    },
    {
      id: "pkg-group-2",
      title: tPkgSummary("pkg4Title"),
      price: tPkgSummary("pkg4Price"),
      duration: tPkgSummary("pkg4Duration"),
      scope: tPkgSummary("pkg4Scope"),
      feats: [tPkgSummary("pkg4Feat1"), tPkgSummary("pkg4Feat2"), tPkgSummary("pkg4Feat3")],
      icon: Users,
      selected: false,
    },
  ];

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
              <Link href="/gallery">{tNav("portfolio")}</Link>
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
        <div className="pb-10 border-b border-border">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
              {tPkg("headerTitle")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {tPkg("headerSubtitle")}
            </p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageTiers.map((pkg) => {
                  const Icon = pkg.icon;
                  return (
                    <Card
                      key={pkg.id}
                      className={cn(
                        "relative p-4 rounded-2xl shadow-xs cursor-pointer transition-all flex flex-col justify-between",
                        pkg.selected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                          : "border-border bg-card hover:border-primary/50",
                      )}
                    >
                      {pkg.selected && (
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
                                pkg.selected && "border-primary/40 text-primary",
                              )}
                            >
                              {pkg.duration}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="font-serif text-base font-bold text-foreground">
                              {pkg.title}
                            </h3>
                            <p className="text-xs font-medium text-foreground/80 mt-0.5">
                              {pkg.scope}
                            </p>
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
                          <span className="text-xs text-muted-foreground">
                            {tPkgSummary("viewDetails")}
                          </span>
                          <span className="font-serif text-sm font-bold text-primary">
                            {pkg.price}
                          </span>
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
                  {tPkg("step2Title")}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-card border border-border rounded-2xl p-6 shadow-xs">
                {/* Left (5 cols): Interactive Calendar Month & Year */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Month & Year Navigation */}
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="size-4 text-primary" />
                      <span className="font-serif font-bold text-sm text-foreground">
                        {tPkg("monthYearSelector")}
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

                    {/* Week 1 (May 2025 starts Thursday) */}
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
                        {tPkg("selectedDateTitle")}
                      </span>
                      <span className="text-xs text-primary font-medium">
                        {tPkg("selectedDateSubtitle")}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="self-start sm:self-auto text-[10px] flex items-center gap-1.5"
                    >
                      <span>{tPkg("morningSlotBadge")}</span>
                      <span className="size-1 rounded-full bg-muted-foreground/60" />
                      <span>{tPkg("goldenHourSlotBadge")}</span>
                    </Badge>
                  </div>

                  {/* Section A: Booked Sessions on This Date */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-wider font-serif text-foreground">
                        {tPkg("bookedSlotsTitle")}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Booked Client 1 */}
                      <div className="p-3 rounded-xl border border-border/80 bg-secondary/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="size-7 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
                            <User className="size-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {tPkg("bookedClient1")}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0 border-border bg-card"
                        >
                          {tPkg("bookedBadge")}
                        </Badge>
                      </div>

                      {/* Booked Client 2 */}
                      <div className="p-3 rounded-xl border border-border/80 bg-secondary/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="size-7 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
                            <User className="size-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {tPkg("bookedClient2")}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0 border-border bg-card"
                        >
                          {tPkg("bookedBadge")}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Section B: Available Slots to Reserve */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider font-serif text-foreground">
                      {tPkg("availableSlotsTitle")}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Slot 1: Available */}
                      <div className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col justify-between gap-2 cursor-pointer shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {tPkg("slot1Time")}
                          </span>
                          <Sun className="size-3 text-muted-foreground" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {tPkg("slot1Name")}
                        </span>
                        <div className="pt-2 border-t border-border flex items-center justify-between">
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                            {tPkg("availableBadge")}
                          </Badge>
                        </div>
                      </div>

                      {/* Slot 2: Available */}
                      <div className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col justify-between gap-2 cursor-pointer shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {tPkg("slot2Time")}
                          </span>
                          <Sun className="size-3 text-primary" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {tPkg("slot2Name")}
                        </span>
                        <div className="pt-2 border-t border-border flex items-center justify-between">
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                            {tPkg("availableBadge")}
                          </Badge>
                        </div>
                      </div>

                      {/* Slot 3: Selected */}
                      <div className="p-3 rounded-xl border-2 border-primary bg-primary/10 transition-all flex flex-col justify-between gap-2 cursor-pointer shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-primary">
                            {tPkg("slot3Time")}
                          </span>
                          <Sparkles className="size-3 text-primary" />
                        </div>
                        <span className="text-[10px] font-semibold text-primary">
                          {tPkg("slot3Name")}
                        </span>
                        <div className="pt-2 border-t border-primary/20 flex items-center justify-between">
                          <Badge className="text-[9px] px-1.5 py-0 bg-primary text-primary-foreground font-semibold">
                            {tPkg("selectedBadge")}
                          </Badge>
                          <Check className="size-3 text-primary" />
                        </div>
                      </div>
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

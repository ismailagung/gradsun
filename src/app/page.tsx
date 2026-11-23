import {
  ArrowRight,
  Award,
  Camera,
  Clock,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  Quote,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";

export default async function HomePage() {
  const tNav = await getTranslations("nav");
  const tHero = await getTranslations("hero");
  const tRibbon = await getTranslations("ribbon");
  const tCat = await getTranslations("categories");
  const tCampus = await getTranslations("campus");
  const tTesti = await getTranslations("testimonials");
  const tCraft = await getTranslations("craft");
  const tMani = await getTranslations("manifesto");
  const tFoot = await getTranslations("footer");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* 1. STICKY TOPBAR */}
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
            <Button variant="ghost" size="default" asChild className="rounded-full px-4 text-xs">
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

      {/* 2. MAIN CONTENT BODY */}
      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:py-20 overflow-hidden bg-background">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <Badge
                variant="secondary"
                className="gap-2 px-3.5 py-1 text-xs font-normal border border-border"
              >
                <Sun className="size-3.5 text-primary animate-pulse" />
                <span>{tHero("badge")}</span>
              </Badge>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-foreground">
                <span>{tHero("titlePart1")}</span>{" "}
                <span className="italic text-primary">{tHero("titleHighlight")}</span>{" "}
                <span>{tHero("titlePart2")}</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {tHero("subtitle")}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
                <Button size="lg" asChild className="gap-2 rounded-xl shadow-sm text-sm">
                  <Link href="/packages">
                    <Sparkles className="size-4" />
                    <span>{tHero("primaryCta")}</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="gap-2 rounded-xl text-sm border-border"
                >
                  <Link href="/portfolio">
                    <span>{tHero("secondaryCta")}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column (5 cols) — Arched Hero Showcase */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Main Arched Frame */}
                <div className="relative rounded-t-[10rem] rounded-b-3xl overflow-hidden border border-border bg-card shadow-xl aspect-[3/4]">
                  <Image
                    src="/logo-bg.jpg"
                    alt={tHero("imageAlt")}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Polaroid Offset Card */}
                <div className="absolute -bottom-6 -left-6 sm:-left-8 w-44 sm:w-52 p-2.5 rounded-2xl bg-card border-2 border-border shadow-2xl rotate-[-3deg] transition-transform duration-300 hover:rotate-0">
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border/40">
                    <Image
                      src="/logo-bg.jpg"
                      alt={tHero("imageAlt")}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="pt-2 px-1 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground italic">
                      {tHero("badgeTitle")}
                    </span>
                    <Heart className="size-3 text-primary fill-primary" />
                  </div>
                </div>

                {/* Sunflower Seal Mark */}
                <div className="absolute -top-4 -right-4 size-16 rounded-full bg-primary text-primary-foreground p-2 shadow-lg flex flex-col items-center justify-center text-center rotate-12">
                  <Sun className="size-6 leading-none" />
                  <span className="text-[8px] font-bold uppercase tracking-tight leading-none mt-0.5">
                    {tNav("brand")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE RIBBON */}
        <div className="w-full py-3.5 border-y border-border bg-secondary/50 overflow-hidden">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-around gap-4 text-xs font-medium uppercase tracking-widest text-muted-foreground px-4">
            <span>{tRibbon("item1")}</span>
            <span>{tRibbon("item2")}</span>
            <span>{tRibbon("item3")}</span>
            <span>{tRibbon("item4")}</span>
            <span className="hidden sm:inline">{tRibbon("item5")}</span>
          </div>
        </div>

        {/* CURATED SESSION STYLES (4 ARCHED CARDS) */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {tCat("tag")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
                {tCat("title")}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">{tCat("subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Graduation Stories */}
            <Card className="group flex flex-col rounded-t-[5rem] rounded-b-2xl border-border bg-card p-3 shadow-xs hover:shadow-md transition-all">
              <div className="relative w-full aspect-[3/4] rounded-t-[4.5rem] rounded-b-xl overflow-hidden bg-muted mb-4">
                <Image
                  src="/logo-bg.jpg"
                  alt={tCat("gradImageAlt")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 size-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground border border-border/60">
                  <GraduationCap className="size-4" />
                </div>
              </div>
              <CardContent className="p-2 flex flex-col flex-1 justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tCat("gradTitle")}
                    </h3>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCat("gradDesc")}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <Badge variant="outline" className="text-[11px] font-normal border-border">
                    {tCat("gradBadge")}
                  </Badge>
                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                    <Link href="/packages">{tCat("viewSeries")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Outdoor Golden Hour */}
            <Card className="group flex flex-col rounded-t-[5rem] rounded-b-2xl border-border bg-card p-3 shadow-xs hover:shadow-md transition-all lg:translate-y-4">
              <div className="relative w-full aspect-[3/4] rounded-t-[4.5rem] rounded-b-xl overflow-hidden bg-muted mb-4">
                <Image
                  src="/logo-bg.jpg"
                  alt={tCat("outdoorImageAlt")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 size-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground border border-border/60">
                  <Sun className="size-4 text-primary" />
                </div>
              </div>
              <CardContent className="p-2 flex flex-col flex-1 justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tCat("outdoorTitle")}
                    </h3>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCat("outdoorDesc")}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <Badge variant="outline" className="text-[11px] font-normal border-border">
                    {tCat("outdoorBadge")}
                  </Badge>
                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                    <Link href="/packages">{tCat("viewSeries")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Fine-Art Studio */}
            <Card className="group flex flex-col rounded-t-[5rem] rounded-b-2xl border-border bg-card p-3 shadow-xs hover:shadow-md transition-all">
              <div className="relative w-full aspect-[3/4] rounded-t-[4.5rem] rounded-b-xl overflow-hidden bg-muted mb-4">
                <Image
                  src="/logo-bg.jpg"
                  alt={tCat("studioImageAlt")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 size-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground border border-border/60">
                  <Camera className="size-4" />
                </div>
              </div>
              <CardContent className="p-2 flex flex-col flex-1 justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tCat("studioTitle")}
                    </h3>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCat("studioDesc")}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <Badge variant="outline" className="text-[11px] font-normal border-border">
                    {tCat("studioBadge")}
                  </Badge>
                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                    <Link href="/packages">{tCat("viewSeries")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Cohort & Group */}
            <Card className="group flex flex-col rounded-t-[5rem] rounded-b-2xl border-border bg-card p-3 shadow-xs hover:shadow-md transition-all lg:translate-y-4">
              <div className="relative w-full aspect-[3/4] rounded-t-[4.5rem] rounded-b-xl overflow-hidden bg-muted mb-4">
                <Image
                  src="/logo-bg.jpg"
                  alt={tCat("cohortImageAlt")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 size-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground border border-border/60">
                  <Sparkles className="size-4 text-primary" />
                </div>
              </div>
              <CardContent className="p-2 flex flex-col flex-1 justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tCat("cohortTitle")}
                    </h3>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCat("cohortDesc")}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <Badge variant="outline" className="text-[11px] font-normal border-border">
                    {tCat("cohortBadge")}
                  </Badge>
                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                    <Link href="/packages">{tCat("viewSeries")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. CAMPUS LANDMARKS SANCTUARIES */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-secondary/30 w-full">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div className="flex flex-col gap-2 max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {tCampus("tag")}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
                  {tCampus("title")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">{tCampus("subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Landmark 1 */}
              <Card className="border-border bg-card p-4 rounded-2xl shadow-xs">
                <CardContent className="p-0 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {tCampus("loc1City")}
                    </span>
                    <Badge variant="secondary" className="text-[10px] gap-1 px-2 py-0.5">
                      <Sun className="size-3 text-primary" />
                      <span>{tCampus("loc1Light")}</span>
                    </Badge>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    {tCampus("loc1Name")}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCampus("loc1Desc")}
                  </p>
                </CardContent>
              </Card>

              {/* Landmark 2 */}
              <Card className="border-border bg-card p-4 rounded-2xl shadow-xs">
                <CardContent className="p-0 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {tCampus("loc2City")}
                    </span>
                    <Badge variant="secondary" className="text-[10px] gap-1 px-2 py-0.5">
                      <Sun className="size-3 text-primary" />
                      <span>{tCampus("loc2Light")}</span>
                    </Badge>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    {tCampus("loc2Name")}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCampus("loc2Desc")}
                  </p>
                </CardContent>
              </Card>

              {/* Landmark 3 */}
              <Card className="border-border bg-card p-4 rounded-2xl shadow-xs">
                <CardContent className="p-0 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {tCampus("loc3City")}
                    </span>
                    <Badge variant="secondary" className="text-[10px] gap-1 px-2 py-0.5">
                      <Sun className="size-3 text-primary" />
                      <span>{tCampus("loc3Light")}</span>
                    </Badge>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    {tCampus("loc3Name")}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCampus("loc3Desc")}
                  </p>
                </CardContent>
              </Card>

              {/* Landmark 4 */}
              <Card className="border-border bg-card p-4 rounded-2xl shadow-xs">
                <CardContent className="p-0 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {tCampus("loc4City")}
                    </span>
                    <Badge variant="secondary" className="text-[10px] gap-1 px-2 py-0.5">
                      <Sun className="size-3 text-primary" />
                      <span>{tCampus("loc4Light")}</span>
                    </Badge>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    {tCampus("loc4Name")}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tCampus("loc4Desc")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. WALL OF LOVE / TESTIMONIALS */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {tTesti("tag")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
                {tTesti("title")}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">{tTesti("subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <Card className="border-border bg-card p-6 rounded-2xl shadow-xs flex flex-col justify-between gap-6 relative">
              <Quote className="size-8 text-primary/20 absolute top-6 right-6" />
              <CardContent className="p-0 flex flex-col gap-4">
                <div className="flex items-center gap-1 text-primary">
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  {tTesti("t1Quote")}
                </p>
              </CardContent>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-serif text-sm font-semibold text-primary">
                  {tTesti("t1Initials")}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground font-serif">
                    {tTesti("t1Author")}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{tTesti("t1Role")}</span>
                    <span className="size-1 rounded-full bg-muted-foreground/60" />
                    <span>{tTesti("t1Year")}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-border bg-card p-6 rounded-2xl shadow-xs flex flex-col justify-between gap-6 relative">
              <Quote className="size-8 text-primary/20 absolute top-6 right-6" />
              <CardContent className="p-0 flex flex-col gap-4">
                <div className="flex items-center gap-1 text-primary">
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  {tTesti("t2Quote")}
                </p>
              </CardContent>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-serif text-sm font-semibold text-primary">
                  {tTesti("t2Initials")}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground font-serif">
                    {tTesti("t2Author")}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{tTesti("t2Role")}</span>
                    <span className="size-1 rounded-full bg-muted-foreground/60" />
                    <span>{tTesti("t2Year")}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-border bg-card p-6 rounded-2xl shadow-xs flex flex-col justify-between gap-6 relative">
              <Quote className="size-8 text-primary/20 absolute top-6 right-6" />
              <CardContent className="p-0 flex flex-col gap-4">
                <div className="flex items-center gap-1 text-primary">
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                  <Star className="size-4 fill-primary" />
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  {tTesti("t3Quote")}
                </p>
              </CardContent>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-serif text-sm font-semibold text-primary">
                  {tTesti("t3Initials")}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground font-serif">
                    {tTesti("t3Author")}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{tTesti("t3Role")}</span>
                    <span className="size-1 rounded-full bg-muted-foreground/60" />
                    <span>{tTesti("t3Year")}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 5. CRAFT SPECS */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Camera className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-base font-semibold text-foreground">
                  {tCraft("f1Title")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tCraft("f1Desc")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Award className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-base font-semibold text-foreground">
                  {tCraft("f2Title")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tCraft("f2Desc")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Sun className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-base font-semibold text-foreground">
                  {tCraft("f3Title")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tCraft("f3Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. MASTER BOOKING MANIFESTO BANNER */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="relative rounded-3xl overflow-hidden border border-border bg-foreground text-background p-8 sm:p-14 shadow-xl">
            <div className="relative z-10 max-w-2xl flex flex-col gap-4">
              <Badge
                variant="outline"
                className="text-primary border-primary/40 self-start px-3 py-1 text-xs"
              >
                {tMani("badge")}
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                {tMani("title")}
              </h2>
              <p className="text-sm sm:text-base text-background/80 leading-relaxed max-w-xl">
                {tMani("subtitle")}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button size="lg" asChild className="gap-2 rounded-xl text-sm shadow-md">
                  <Link href="/packages">
                    <span>{tMani("primaryCta")}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="gap-2 rounded-xl text-sm border-background/20 text-background hover:bg-background/10"
                >
                  <Link href="https://wa.me/6281234567890">
                    <MessageCircle className="size-4" />
                    <span>{tMani("secondaryCta")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. EXTENDED MEGA FOOTER */}
      <footer className="border-t border-border bg-card pt-14 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border">
          {/* Col 1: Brand & Atelier */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative size-8 overflow-hidden rounded-full border border-border bg-card p-0.5">
                <Image
                  src="/gradsun-no-bg.png"
                  alt={tNav("logoAlt")}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
                {tNav("brand")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{tFoot("description")}</p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider block font-serif">
                {tFoot("locationTitle")}
              </span>
              <span className="text-xs text-muted-foreground">{tFoot("locationValue")}</span>
            </div>
          </div>

          {/* Col 2: Studio Hours */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-serif">
              {tFoot("hoursTitle")}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">{tFoot("hoursValue")}</p>
            <div className="flex items-center gap-2 pt-3 text-xs text-primary">
              <Clock className="size-4" />
              <span className="font-medium">{tFoot("onlineDispatch")}</span>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-serif">
              {tFoot("navTitle")}
            </span>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <Link href="/portfolio" className="hover:text-foreground transition-colors">
                {tNav("portfolio")}
              </Link>
              <Link href="/packages" className="hover:text-foreground transition-colors">
                {tNav("packages")}
              </Link>
              <Link href="/track-order" className="hover:text-foreground transition-colors">
                {tNav("trackOrder")}
              </Link>
              <Link href="/admin" className="hover:text-primary transition-colors font-medium">
                {tNav("admin")}
              </Link>
            </div>
          </div>

          {/* Col 4: Featured Campus Quads */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-serif">
              {tFoot("campusesTitle")}
            </span>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3 text-primary" />
                <span>{tFoot("uiCampuses")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3 text-primary" />
                <span>{tFoot("itbCampuses")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3 text-primary" />
                <span>{tFoot("ugmCampuses")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3 text-primary" />
                <span>{tFoot("unpadCampuses")}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>{tFoot("copyright")}</p>
          <div className="flex items-center gap-4">
            <Link href="/packages" className="hover:text-foreground transition-colors">
              {tFoot("terms")}
            </Link>
            <Link href="/admin" className="hover:text-primary transition-colors">
              {tFoot("staffPortal")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

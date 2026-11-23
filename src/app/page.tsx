import { ArrowRight, Check, Heart, Quote, Sparkles, Star, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";

export default async function HomePage() {
  const tNav = await getTranslations("nav");
  const tHero = await getTranslations("hero");
  const tPortfolio = await getTranslations("landingPortfolio");
  const tPkg = await getTranslations("packagesSummary");
  const tTesti = await getTranslations("testimonials");
  const tMani = await getTranslations("manifesto");

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
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
              <Link href="/gallery">{tNav("portfolio")}</Link>
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
                  <Link href="/gallery">
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
              </div>
            </div>
          </div>
        </section>

        {/* RECENT PORTFOLIO SHOWCASE */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-secondary/20 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div className="flex flex-col gap-2 max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {tPortfolio("tag")}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
                  {tPortfolio("title")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">{tPortfolio("subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Portfolio Card 1 */}
              <Card className="group border-border bg-card p-3 rounded-3xl shadow-xs hover:shadow-lg transition-all">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted mb-3">
                  <Image
                    src="/logo-bg.jpg"
                    alt={tPortfolio("item1Alt")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-2 flex flex-col gap-1.5">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {tPortfolio("item1Title")}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tPortfolio("item1Desc")}
                  </p>
                </CardContent>
              </Card>

              {/* Portfolio Card 2 */}
              <Card className="group border-border bg-card p-3 rounded-3xl shadow-xs hover:shadow-lg transition-all lg:translate-y-4">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted mb-3">
                  <Image
                    src="/logo-bg.jpg"
                    alt={tPortfolio("item2Alt")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-2 flex flex-col gap-1.5">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {tPortfolio("item2Title")}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tPortfolio("item2Desc")}
                  </p>
                </CardContent>
              </Card>

              {/* Portfolio Card 3 */}
              <Card className="group border-border bg-card p-3 rounded-3xl shadow-xs hover:shadow-lg transition-all">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted mb-3">
                  <Image
                    src="/logo-bg.jpg"
                    alt={tPortfolio("item3Alt")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-2 flex flex-col gap-1.5">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {tPortfolio("item3Title")}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tPortfolio("item3Desc")}
                  </p>
                </CardContent>
              </Card>

              {/* Portfolio Card 4 */}
              <Card className="group border-border bg-card p-3 rounded-3xl shadow-xs hover:shadow-lg transition-all lg:translate-y-4">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted mb-3">
                  <Image
                    src="/logo-bg.jpg"
                    alt={tPortfolio("item4Alt")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-2 flex flex-col gap-1.5">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {tPortfolio("item4Title")}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tPortfolio("item4Desc")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CURATED PACKAGE TIERS (4 ARCHED CARDS) */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {tPkg("tag")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
                {tPkg("title")}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">{tPkg("subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Single Package 1 */}
            <Card className="group flex flex-col rounded-t-[5rem] rounded-b-2xl border-border bg-card p-3 shadow-xs hover:shadow-md transition-all">
              <div className="relative w-full aspect-[3/4] rounded-t-[4.5rem] rounded-b-xl overflow-hidden bg-muted mb-4">
                <Image
                  src="/logo-bg.jpg"
                  alt={tPkg("pkg1ImageAlt")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-2 flex flex-col flex-1 justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {tPkg("pkg1Title")}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold border-primary/40 text-primary shrink-0"
                    >
                      {tPkg("pkg1Price")}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-foreground/80">{tPkg("pkg1Scope")}</p>
                  <ul className="space-y-1.5 pt-2 text-xs text-muted-foreground border-t border-border/50">
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg1Feat1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg1Feat2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg1Feat3")}</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <Badge variant="secondary" className="text-[11px] font-normal">
                    {tPkg("pkg1Duration")}
                  </Badge>
                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                    <Link href="/packages">{tPkg("viewDetails")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Single Package 2 */}
            <Card className="group flex flex-col rounded-t-[5rem] rounded-b-2xl border-border bg-card p-3 shadow-xs hover:shadow-md transition-all lg:translate-y-4">
              <div className="relative w-full aspect-[3/4] rounded-t-[4.5rem] rounded-b-xl overflow-hidden bg-muted mb-4">
                <Image
                  src="/logo-bg.jpg"
                  alt={tPkg("pkg2ImageAlt")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-2 flex flex-col flex-1 justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {tPkg("pkg2Title")}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold border-primary/40 text-primary shrink-0"
                    >
                      {tPkg("pkg2Price")}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-foreground/80">{tPkg("pkg2Scope")}</p>
                  <ul className="space-y-1.5 pt-2 text-xs text-muted-foreground border-t border-border/50">
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg2Feat1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg2Feat2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg2Feat3")}</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <Badge variant="secondary" className="text-[11px] font-normal">
                    {tPkg("pkg2Duration")}
                  </Badge>
                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                    <Link href="/packages">{tPkg("viewDetails")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Group Package 1 */}
            <Card className="group flex flex-col rounded-t-[5rem] rounded-b-2xl border-border bg-card p-3 shadow-xs hover:shadow-md transition-all">
              <div className="relative w-full aspect-[3/4] rounded-t-[4.5rem] rounded-b-xl overflow-hidden bg-muted mb-4">
                <Image
                  src="/logo-bg.jpg"
                  alt={tPkg("pkg3ImageAlt")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-2 flex flex-col flex-1 justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {tPkg("pkg3Title")}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold border-primary/40 text-primary shrink-0"
                    >
                      {tPkg("pkg3Price")}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-foreground/80">{tPkg("pkg3Scope")}</p>
                  <ul className="space-y-1.5 pt-2 text-xs text-muted-foreground border-t border-border/50">
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg3Feat1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg3Feat2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg3Feat3")}</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <Badge variant="secondary" className="text-[11px] font-normal">
                    {tPkg("pkg3Duration")}
                  </Badge>
                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                    <Link href="/packages">{tPkg("viewDetails")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Group Package 2 */}
            <Card className="group flex flex-col rounded-t-[5rem] rounded-b-2xl border-border bg-card p-3 shadow-xs hover:shadow-md transition-all lg:translate-y-4">
              <div className="relative w-full aspect-[3/4] rounded-t-[4.5rem] rounded-b-xl overflow-hidden bg-muted mb-4">
                <Image
                  src="/logo-bg.jpg"
                  alt={tPkg("pkg4ImageAlt")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-2 flex flex-col flex-1 justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {tPkg("pkg4Title")}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold border-primary/40 text-primary shrink-0"
                    >
                      {tPkg("pkg4Price")}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-foreground/80">{tPkg("pkg4Scope")}</p>
                  <ul className="space-y-1.5 pt-2 text-xs text-muted-foreground border-t border-border/50">
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg4Feat1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg4Feat2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tPkg("pkg4Feat3")}</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <Badge variant="secondary" className="text-[11px] font-normal">
                    {tPkg("pkg4Duration")}
                  </Badge>
                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                    <Link href="/packages">{tPkg("viewDetails")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
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

        {/* 6. MASTER BOOKING MANIFESTO BANNER */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="relative rounded-3xl overflow-hidden border border-border bg-foreground text-background p-8 sm:p-14 shadow-xl">
            <div className="relative z-10 max-w-2xl flex flex-col gap-4">
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
                  <Link href="/packages">
                    <span>{tMani("secondaryCta")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

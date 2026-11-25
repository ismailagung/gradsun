"use client";

import { ArrowRight, Heart, Sparkles, Star, Sun } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import type { ContentSettings } from "../schemas/content-settings.schema";

interface CmsPreviewFrameProps {
  content: ContentSettings;
  device: "desktop" | "mobile";
  activeTab: "hero" | "manifesto" | "showcase" | "testimonials";
}

export function CmsPreviewFrame({ content, device, activeTab }: CmsPreviewFrameProps) {
  const isMobile = device === "mobile";

  return (
    <div
      className={`mx-auto transition-all duration-300 rounded-2xl border-2 border-border shadow-lg bg-background overflow-hidden ${
        isMobile ? "max-w-[340px]" : "w-full"
      }`}
    >
      {/* Device Top Bar / Browser Chrome */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/60 text-[11px] text-muted-foreground select-none">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-rose-400" />
          <div className="size-2 rounded-full bg-amber-400" />
          <div className="size-2 rounded-full bg-emerald-400" />
        </div>
        <div className="font-mono text-[10px] px-2 py-0.5 rounded bg-background/80 border text-muted-foreground">
          {isMobile ? "gradsun.studio (mobile)" : "gradsun.studio (public viewport)"}
        </div>
        <div className="size-2" />
      </div>

      {/* Frame Scrollable Body */}
      <div className="p-4 sm:p-6 space-y-8 max-h-[640px] overflow-y-auto">
        {/* HERO SECTION PREVIEW */}
        {(activeTab === "hero" || activeTab === "manifesto") && (
          <div className="space-y-4">
            <div className="flex flex-col items-start gap-3">
              <Badge
                variant="secondary"
                className="gap-1.5 px-2.5 py-0.5 text-[10px] font-normal border border-border"
              >
                <Sun className="size-3 text-primary animate-pulse" />
                <span>{content.hero.badge}</span>
              </Badge>

              <h1 className="font-serif text-2xl sm:text-3xl tracking-tight leading-snug text-foreground">
                <span>{content.hero.titlePart1}</span>{" "}
                <span className="italic text-primary">{content.hero.titleHighlight}</span>{" "}
                <span>{content.hero.titlePart2}</span>
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {content.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 w-full">
                <Button size="sm" className="gap-1.5 text-xs h-7">
                  <Sparkles className="size-3" />
                  <span>{content.hero.primaryCta}</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-xs h-7">
                  <span>{content.hero.secondaryCta}</span>
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </div>

            {/* Arched Hero Graphic Frame */}
            <div className="relative pt-2">
              <div className="relative rounded-t-3xl rounded-b-xl overflow-hidden border bg-card aspect-[16/9] w-full">
                <Image
                  src="/logo-bg.jpg"
                  alt={content.hero.titleHighlight}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating note */}
              <div className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-card border shadow-md flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium text-muted-foreground italic">
                  {content.hero.badgeTitle}
                </span>
                <Heart className="size-2.5 text-primary" />
              </div>
            </div>
          </div>
        )}

        {/* MANIFESTO SECTION PREVIEW */}
        {activeTab === "manifesto" && (
          <div className="rounded-xl border bg-card p-4 space-y-3 shadow-xs">
            <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground">
              {content.manifesto.title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {content.manifesto.subtitle}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" className="text-xs h-7">
                {content.manifesto.primaryCta}
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7">
                {content.manifesto.secondaryCta}
              </Button>
            </div>
          </div>
        )}

        {/* SHOWCASE SECTION PREVIEW */}
        {activeTab === "showcase" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.portfolioShowcase.map((item) => (
                <Card key={item.id} className="p-2 border bg-card shadow-xs">
                  <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-muted mb-2">
                    <Image
                      src={item.image || "/logo-bg.jpg"}
                      alt={item.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-1 space-y-1">
                    <h3 className="font-serif text-xs font-bold text-foreground">{item.title}</h3>
                    <p className="text-[10px] text-muted-foreground leading-normal">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS SECTION PREVIEW */}
        {activeTab === "testimonials" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2.5">
              {content.testimonials.map((testi) => (
                <Card key={testi.id} className="p-3 border bg-card shadow-xs space-y-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-foreground italic leading-relaxed">
                    {`"${testi.quote}"`}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t text-[10px]">
                    <div>
                      <span className="font-semibold text-foreground">{testi.author}</span>
                      <span className="text-muted-foreground ml-1">{`(${testi.role})`}</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] py-0 px-1">
                      {testi.year}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/common/components/ui/button";
import { MainNav, shouldRenderSiteHeader } from "./main-nav";

export function SiteHeader() {
  const pathname = usePathname();
  const tNav = useTranslations("nav");

  if (!shouldRenderSiteHeader(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative size-9 overflow-hidden rounded-full border border-border bg-card p-0.5 shadow-xs">
            <Image
              src="/gradsun-no-bg.png"
              alt={tNav("logoAlt")}
              width={36}
              height={36}
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold tracking-tight text-foreground leading-tight group-hover:text-primary/80 transition-colors">
              {tNav("brand")}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground mt-0.5">
              {tNav("tagline")}
            </span>
          </div>
        </Link>

        <MainNav />

        <div className="flex items-center gap-2">
          <Button size="default" asChild className="rounded-full shadow-xs">
            <Link href="/packages">{tNav("bookSession")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

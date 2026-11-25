"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/common/components/ui/button";

export interface NavItem {
  href: string;
  translationKey: "home" | "portfolio" | "packages" | "trackOrder";
}

export function getNavItems(): NavItem[] {
  return [
    { href: "/", translationKey: "home" },
    { href: "/gallery", translationKey: "portfolio" },
    { href: "/packages", translationKey: "packages" },
    { href: "/track-order", translationKey: "trackOrder" },
  ];
}

export function isNavActive(pathname: string | null | undefined, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") {
    return pathname === "/";
  }
  if (href === "/gallery") {
    return (
      pathname === "/gallery" ||
      pathname.startsWith("/gallery/") ||
      pathname === "/portfolio" ||
      pathname.startsWith("/portfolio/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function shouldRenderSiteHeader(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  if (pathname.startsWith("/admin") || pathname.startsWith("/invoice") || pathname === "/login") {
    return false;
  }
  return true;
}

export function MainNav() {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const items = getNavItems();

  return (
    <nav
      aria-label={tNav("mainNav")}
      className="hidden md:flex items-center gap-1 rounded-full border border-border bg-secondary/50 p-1"
    >
      {items.map((item) => {
        const active = isNavActive(pathname, item.href);
        return (
          <Button
            key={item.href}
            variant={active ? "default" : "ghost"}
            size="default"
            asChild
            className={cn(
              "rounded-full px-4 text-xs transition-colors",
              active
                ? "bg-primary text-primary-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground font-medium",
            )}
          >
            <Link href={item.href} aria-current={active ? "page" : undefined}>
              {tNav(item.translationKey)}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

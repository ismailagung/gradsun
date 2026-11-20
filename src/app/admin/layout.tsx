"use client";

import {
  Building2,
  CalendarCheck,
  ChevronRight,
  ExternalLink,
  Images,
  Layers,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const tNav = useTranslations("adminNav");
  const tBrand = useTranslations("nav");
  const pathname = usePathname();

  const navItems = [
    { label: tNav("dashboard"), href: "/admin", icon: LayoutDashboard },
    { label: tNav("bookings"), href: "/admin/bookings", icon: CalendarCheck },
    { label: tNav("packages"), href: "/admin/packages", icon: Layers },
    { label: tNav("studios"), href: "/admin/studios", icon: Building2 },
    { label: tNav("galleries"), href: "/admin/galleries", icon: Images },
    { label: tNav("customers"), href: "/admin/customers", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        {/* Brand & Studio Title */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-sm bg-primary text-primary-foreground font-serif text-sm font-semibold">
              {"G"}
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base font-medium tracking-tight">
                {tBrand("brand")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans">
                {tNav("title")}
              </span>
            </div>
          </Link>
          <Badge variant="outline" className="text-[10px] uppercase font-mono">
            {tNav("badgeStaff")}
          </Badge>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={`w-full justify-start gap-3 font-normal h-9 ${
                  isActive
                    ? "font-medium text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Studio Status & Storefront Return */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted-foreground text-[11px] font-medium">
              {tNav("studioStatus")}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between text-xs h-8"
            asChild
          >
            <Link href="/">
              <span>{tNav("backToStorefront")}</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-medium lg:hidden">{tBrand("brand")}</span>
            <span className="text-xs text-muted-foreground lg:hidden">{"•"}</span>
            <span className="text-xs text-muted-foreground">{tNav("title")}</span>
            <ChevronRight className="size-3 text-muted-foreground" />
            <span className="text-xs font-medium">
              {navItems.find((item) =>
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href),
              )?.label ?? tNav("dashboard")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" asChild className="gap-1.5 h-8">
              <Link href="/packages">
                <Sparkles className="size-3.5" />
                <span>{tNav("newBookingCta")}</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

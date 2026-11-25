"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type * as React from "react";
import { AppSidebar } from "@/common/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/common/components/ui/breadcrumb";
import { Button } from "@/common/components/ui/button";
import { Separator } from "@/common/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/common/components/ui/sidebar";
import { TooltipProvider } from "@/common/components/ui/tooltip";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const tNav = useTranslations("adminNav");
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/admin") return tNav("dashboard");
    if (pathname.startsWith("/admin/bookings")) return tNav("bookings");
    if (pathname.startsWith("/admin/packages")) return tNav("packages");
    if (pathname.startsWith("/admin/studios")) return tNav("studios");
    if (pathname.startsWith("/admin/galleries")) return tNav("galleries");
    if (pathname.startsWith("/admin/customers")) return tNav("customers");
    return tNav("dashboard");
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden sm:block">
                    <BreadcrumbLink href="/admin">{tNav("title")}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden sm:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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

          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

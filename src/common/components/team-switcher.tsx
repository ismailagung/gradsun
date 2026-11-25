"use client";

import { ChevronsUpDown, ExternalLink, Images, Layers, Search } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/common/components/ui/sidebar";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const tBrand = useTranslations("nav");
  const tNav = useTranslations("adminNav");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif text-sm font-semibold">
                {"G"}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-serif font-medium">{tBrand("brand")}</span>
                <span className="truncate text-[10px] uppercase tracking-wider text-muted-foreground font-sans">
                  {tNav("title")}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {tNav("sectionStorefront")}
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/" className="gap-2 p-2 cursor-pointer">
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </div>
                <span>{tNav("viewStorefront")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/gallery" className="gap-2 p-2 cursor-pointer">
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                  <Images className="size-3.5 text-muted-foreground" />
                </div>
                <span>{tNav("viewGallery")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/packages" className="gap-2 p-2 cursor-pointer">
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                  <Layers className="size-3.5 text-muted-foreground" />
                </div>
                <span>{tNav("viewPackages")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/track-order" className="gap-2 p-2 cursor-pointer">
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                  <Search className="size-3.5 text-muted-foreground" />
                </div>
                <span>{tNav("viewTracking")}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

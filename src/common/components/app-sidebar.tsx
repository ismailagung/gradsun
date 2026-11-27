"use client";

import {
  Building2,
  CalendarCheck,
  FileText,
  Images,
  Layers,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type * as React from "react";
import { type AdminNavGroup, NavMain } from "@/common/components/nav-main";
import { NavUser } from "@/common/components/nav-user";
import { TeamSwitcher } from "@/common/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/common/components/ui/sidebar";

export function getAdminNavGroups(tNav: (key: string) => string): AdminNavGroup[] {
  return [
    {
      label: tNav("sectionOperations"),
      labelKey: "sectionOperations",
      items: [
        { title: tNav("dashboard"), url: "/admin", icon: LayoutDashboard },
        { title: tNav("bookings"), url: "/admin/bookings", icon: CalendarCheck },
        { title: tNav("packages"), url: "/admin/packages", icon: Layers },
        { title: tNav("studios"), url: "/admin/studios", icon: Building2 },
        { title: tNav("customers"), url: "/admin/customers", icon: Users },
      ],
    },
    {
      label: tNav("sectionContent"),
      labelKey: "sectionContent",
      items: [
        { title: tNav("contentHome"), url: "/admin/content", icon: FileText },
        { title: tNav("contentGallery"), url: "/admin/content/gallery", icon: Images },
        { title: tNav("contentPackages"), url: "/admin/content/packages", icon: Sparkles },
      ],
    },
  ];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const tNav = useTranslations("adminNav");
  const navGroups = getAdminNavGroups(tNav);

  const user = {
    name: tNav("staffName"),
    email: tNav("staffEmail"),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navGroups} />
        <SidebarGroup className="mt-auto group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2.5 text-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {tNav("studioStatus")}
              </span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

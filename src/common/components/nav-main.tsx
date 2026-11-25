"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type * as React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/common/components/ui/sidebar";

export interface NavMainItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface AdminNavGroup {
  label: string;
  labelKey: string;
  items: NavMainItem[];
}

export function NavMain({ items, groups }: { items?: NavMainItem[]; groups?: AdminNavGroup[] }) {
  const tNav = useTranslations("adminNav");
  const pathname = usePathname();

  const renderedGroups: AdminNavGroup[] = groups ?? [
    {
      label: tNav("sectionOperations"),
      labelKey: "sectionOperations",
      items: items ?? [],
    },
  ];

  return (
    <>
      {renderedGroups.map((group) => (
        <SidebarGroup key={group.labelKey}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.url === "/admin"
                  ? pathname === "/admin"
                  : item.url === "/admin/content"
                    ? pathname === "/admin/content"
                    : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={isActive ? "font-medium text-sidebar-accent-foreground" : ""}
                  >
                    <Link href={item.url}>
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

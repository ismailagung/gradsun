"use client";

import { Building2, CalendarOff, CheckCircle2, Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";

interface StudioRoom {
  id: string;
  name: string;
  tag: string;
  capacity: string;
  description: string;
  status: string;
}

interface BlackoutItem {
  id: string;
  room: string;
  dates: string;
  reason: string;
}

const ROOMS_DATA: StudioRoom[] = [
  {
    id: "room-a",
    name: "Studio Room A",
    tag: "Natural Daylight & Floor-to-Ceiling Windows",
    capacity: "Up to 10 Guests",
    description:
      "South-facing diffused archival paper backdrops with natural morning and midday light.",
    status: "Operational",
  },
  {
    id: "room-b",
    name: "Studio Room B",
    tag: "Darkroom Monochrome & Strobe Rig",
    capacity: "Up to 6 Guests",
    description:
      "Full blackout chamber equipped with Profoto softboxes and silver gelatin film textures.",
    status: "Operational",
  },
  {
    id: "room-campus",
    name: "Campus Outdoor Grounds",
    tag: "UI Depok, ITB Ganesha, UGM & Unpad Quads",
    capacity: "Up to 25 Guests (Group)",
    description: "On-site university architectural sanctuaries and golden hour quad lawns.",
    status: "Operational",
  },
];

const BLACKOUTS_DATA: BlackoutItem[] = [
  {
    id: "blk-1",
    room: "Studio Room A & B",
    dates: "24 Dec 2025 — 02 Jan 2026",
    reason: "Year-End Studio Deep Clean & Recalibration",
  },
  {
    id: "blk-2",
    room: "Campus Outdoor Grounds",
    dates: "17 Aug 2025",
    reason: "National Independence Holiday Campus Quad Security Closure",
  },
  {
    id: "blk-3",
    room: "Studio Room B",
    dates: "01 Jun 2025",
    reason: "Analog Darkroom Chemical Replenishment & Bulb Testing",
  },
];

export default function AdminStudiosPage() {
  const tStudios = useTranslations("adminStudios");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
          {tStudios("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-sans">{tStudios("subtitle")}</p>
      </div>

      {/* Studio Rooms Cards */}
      <div>
        <h2 className="mb-4 font-serif text-lg font-medium">{tStudios("roomsTitle")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {ROOMS_DATA.map((room) => (
            <Card key={room.id} className="bg-card shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-primary" />
                    <CardTitle className="font-serif text-base font-medium">{room.name}</CardTitle>
                  </div>
                  <Badge variant="default" className="text-[10px]">
                    <CheckCircle2 className="mr-1 size-3" />
                    <span>{tStudios("roomStatusActive")}</span>
                  </Badge>
                </div>
                <CardDescription className="text-xs">{room.tag}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground font-sans">{room.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-foreground font-medium pt-2 border-t border-border">
                  <Users className="size-3.5 text-muted-foreground" />
                  <span>{room.capacity}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Blackout Dates Schedule */}
      <Card className="bg-card shadow-xs">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarOff className="size-4 text-destructive" />
              <CardTitle className="font-serif text-lg font-medium">
                {tStudios("blackoutsTitle")}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {"Restricted booking dates blocked across client calendar."}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 h-8">
            <Plus className="size-3.5" />
            <span>{tStudios("btnNewBlackout")}</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tStudios("thBlackoutRoom")}</TableHead>
                <TableHead>{tStudios("thBlackoutDates")}</TableHead>
                <TableHead>{tStudios("thBlackoutReason")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BLACKOUTS_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-foreground">{item.room}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {item.dates}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

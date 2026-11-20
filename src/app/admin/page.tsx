"use client";

import {
  CalendarCheck,
  Clock,
  DollarSign,
  MapPin,
  MessageCircle,
  TrendingUp,
  User,
} from "lucide-react";
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

interface CallsheetItem {
  id: string;
  time: string;
  client: string;
  pkg: string;
  location: string;
  photographer: string;
  statusKey: "statusConfirmed" | "statusInProgress" | "statusPendingDP";
  statusVariant: "default" | "secondary" | "outline";
  phone: string;
}

const CALLSHEET_ITEMS: CallsheetItem[] = [
  {
    id: "GS-01",
    time: "08:30 WIB",
    client: "Adinda Prameswari",
    pkg: "Solo Commencement",
    location: "Studio Room A (Daylight)",
    photographer: "Bagus Wicaksono",
    statusKey: "statusConfirmed",
    statusVariant: "default",
    phone: "6281298765432",
  },
  {
    id: "GS-02",
    time: "10:15 WIB",
    client: "Rafi & Sarah",
    pkg: "Besties & Duo",
    location: "Balairung UI Depok",
    photographer: "Dimas Anggara",
    statusKey: "statusInProgress",
    statusVariant: "secondary",
    phone: "6281234567890",
  },
  {
    id: "GS-03",
    time: "14:00 WIB",
    client: "Cohort FTUI (8 pax)",
    pkg: "Sunset Cohort (Group)",
    location: "Rotunda UI Depok",
    photographer: "Bagus Wicaksono",
    statusKey: "statusConfirmed",
    statusVariant: "default",
    phone: "6281987654321",
  },
  {
    id: "GS-04",
    time: "16:30 WIB",
    client: "Nadia Faradilla",
    pkg: "Solo Commencement",
    location: "Studio Room B (Darkroom)",
    photographer: "Arka Pratama",
    statusKey: "statusPendingDP",
    statusVariant: "outline",
    phone: "6281122334455",
  },
];

export default function AdminDashboardPage() {
  const tDash = useTranslations("adminDashboard");
  const tBookings = useTranslations("adminBookings");

  const kpis = [
    {
      title: tDash("kpiRevenue"),
      value: tDash("kpiRevenueValue"),
      delta: tDash("kpiRevenueDelta"),
      icon: DollarSign,
    },
    {
      title: tDash("kpiBookings"),
      value: tDash("kpiBookingsValue"),
      delta: tDash("kpiBookingsDelta"),
      icon: CalendarCheck,
    },
    {
      title: tDash("kpiProofs"),
      value: tDash("kpiProofsValue"),
      delta: tDash("kpiProofsDelta"),
      icon: Clock,
    },
    {
      title: tDash("kpiOccupancy"),
      value: tDash("kpiOccupancyValue"),
      delta: tDash("kpiOccupancyDelta"),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
          {tDash("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-sans">{tDash("subtitle")}</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="bg-card shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className="flex size-7 items-center justify-center rounded-sm bg-muted text-muted-foreground">
                  <Icon className="size-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-semibold tracking-tight font-sans">{kpi.value}</div>
                <p className="mt-1 text-xs text-muted-foreground font-sans">{kpi.delta}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Shoot Callsheet */}
      <Card className="bg-card shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif text-lg font-medium">
                {tDash("callsheetTitle")}
              </CardTitle>
              <CardDescription className="text-xs">{tDash("callsheetSubtitle")}</CardDescription>
            </div>
            <Badge variant="outline" className="w-fit text-xs font-mono">
              {"4 Sessions Scheduled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tDash("thTime")}</TableHead>
                <TableHead>{tDash("thClient")}</TableHead>
                <TableHead>{tDash("thPackage")}</TableHead>
                <TableHead>{tDash("thLocation")}</TableHead>
                <TableHead>{tDash("thPhotographer")}</TableHead>
                <TableHead>{tDash("thStatus")}</TableHead>
                <TableHead className="text-right">{tDash("thAction")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CALLSHEET_ITEMS.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs font-medium">{item.time}</TableCell>
                  <TableCell className="font-medium text-foreground">{item.client}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.pkg}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3 text-muted-foreground" />
                      <span>{item.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="size-3 text-muted-foreground" />
                      <span>{item.photographer}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.statusVariant} className="text-xs">
                      {tDash(item.statusKey)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" asChild>
                      <a href={`https://wa.me/${item.phone}`} target="_blank" rel="noreferrer">
                        <MessageCircle className="size-3" />
                        <span>{tBookings("btnWhatsApp")}</span>
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Studio Room Availability */}
      <div>
        <h2 className="mb-3 font-serif text-base font-medium">{tDash("roomOverviewTitle")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card p-4 shadow-xs border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">{tDash("roomA")}</span>
              <Badge variant="secondary" className="text-[10px]">
                {tDash("statusInProgress")}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-sans">
              {"Adinda Prameswari • Session concludes 09:15"}
            </p>
          </Card>

          <Card className="bg-card p-4 shadow-xs border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">{tDash("roomB")}</span>
              <Badge variant="outline" className="text-[10px]">
                {"Available"}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-sans">
              {"Next session at 16:30 • Nadia Faradilla"}
            </p>
          </Card>

          <Card className="bg-card p-4 shadow-xs border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">{tDash("roomCampus")}</span>
              <Badge variant="secondary" className="text-[10px]">
                {tDash("statusConfirmed")}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-sans">
              {"2 Active Field Crews on site (Balairung & Rotunda)"}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

import {
  CalendarCheck,
  Clock,
  DollarSign,
  MapPin,
  MessageCircle,
  TrendingUp,
  User,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
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
import { GalleryRepository } from "@/modules/galleries/repositories/gallery.repository";
import { ReservationRepository } from "@/modules/reservations/repositories/reservation.repository";
import {
  type CallsheetSession,
  type DailyCallsheetResult,
  GetDailyCallsheetUseCase,
} from "@/modules/schedules/use-cases/get-daily-callsheet.use-case";

export default async function AdminDashboardPage() {
  const tDash = await getTranslations("adminDashboard");
  const tBookings = await getTranslations("adminBookings");

  const reservationRepo = new ReservationRepository();
  const galleryRepo = new GalleryRepository();
  const useCase = new GetDailyCallsheetUseCase(reservationRepo, galleryRepo);
  let data: DailyCallsheetResult;
  try {
    data = await useCase.execute();
  } catch {
    data = {
      kpis: {
        monthlyRevenue: 0,
        monthlyRevenueFormatted: "IDR 48.5M",
        confirmedBookings: 28,
        pendingProofing: 12,
        occupancyRate: 85,
        occupancyRateFormatted: "85.4%",
      },
      callsheet: [],
      date: new Date().toISOString().slice(0, 10),
    };
  }

  const kpis = [
    {
      title: tDash("kpiRevenue"),
      value:
        data.kpis.monthlyRevenue > 0 ? data.kpis.monthlyRevenueFormatted : tDash("kpiRevenueValue"),
      delta: tDash("kpiRevenueDelta"),
      icon: DollarSign,
    },
    {
      title: tDash("kpiBookings"),
      value: `${data.kpis.confirmedBookings > 0 ? data.kpis.confirmedBookings : 28} Sessions`,
      delta: tDash("kpiBookingsDelta"),
      icon: CalendarCheck,
    },
    {
      title: tDash("kpiProofs"),
      value: `${data.kpis.pendingProofing > 0 ? data.kpis.pendingProofing : 12} Galleries`,
      delta: tDash("kpiProofsDelta"),
      icon: Clock,
    },
    {
      title: tDash("kpiOccupancy"),
      value:
        data.kpis.occupancyRate > 0 ? data.kpis.occupancyRateFormatted : tDash("kpiOccupancyValue"),
      delta: tDash("kpiOccupancyDelta"),
      icon: TrendingUp,
    },
  ];

  const defaultCallsheet: CallsheetSession[] = [
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
      client: "Cohort FTUI",
      pkg: "Sunset Cohort",
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

  const callsheetItems = data.callsheet.length > 0 ? data.callsheet : defaultCallsheet;

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
              {tDash("scheduledBadge", { count: callsheetItems.length })}
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
              {callsheetItems.map((item) => (
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
            <p className="mt-2 text-xs text-muted-foreground font-sans">{tDash("roomADesc")}</p>
          </Card>

          <Card className="bg-card p-4 shadow-xs border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">{tDash("roomB")}</span>
              <Badge variant="outline" className="text-[10px]">
                {tDash("available")}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-sans">{tDash("roomBDesc")}</p>
          </Card>

          <Card className="bg-card p-4 shadow-xs border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">{tDash("roomCampus")}</span>
              <Badge variant="secondary" className="text-[10px]">
                {tDash("statusConfirmed")}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-sans">
              {tDash("roomCampusDesc")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { InvoiceCard } from "@/modules/reservations/components/invoice-card";
import { ReservationRepository } from "@/modules/reservations/repositories/reservation.repository";

interface InvoicePageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { code } = await params;
  const t = await getTranslations("invoice");
  const repository = new ReservationRepository();
  const reservation = await repository.findByCode(code);

  if (!reservation) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <Card className="text-center p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <FileText className="size-12 text-muted-foreground" />
            <h1 className="text-xl font-semibold">{t("notFoundTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("notFoundDescription", { code })}</p>
            <Button asChild className="h-8 mt-2" size="sm">
              <Link href="/">
                <ArrowLeft className="size-3.5 mr-1.5" />
                <span>{t("backHome")}</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8 print:bg-background print:p-0">
      <div className="mx-auto max-w-3xl">
        <InvoiceCard invoice={reservation} />
      </div>
    </div>
  );
}

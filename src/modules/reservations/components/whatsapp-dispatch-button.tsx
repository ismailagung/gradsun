"use client";

import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/common/components/ui/button";

interface WhatsAppDispatchButtonProps {
  bookingCode: string;
  clientName: string;
  grandTotal: number;
}

export function WhatsAppDispatchButton({
  bookingCode,
  clientName,
  grandTotal,
}: WhatsAppDispatchButtonProps) {
  const t = useTranslations("invoice");

  const formattedTotal = new Intl.NumberFormat("id-ID").format(grandTotal);
  const message = t("whatsAppTemplate", {
    code: bookingCode,
    name: clientName,
    total: formattedTotal,
  });

  const handleDispatch = () => {
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      type="button"
      onClick={handleDispatch}
      className="w-full sm:w-auto h-8 gap-2 text-xs font-medium"
      size="default"
    >
      <MessageSquare className="size-3.5" />
      <span>{t("confirmViaWhatsApp")}</span>
    </Button>
  );
}

export interface FormatBookingWhatsAppUrlParams {
  phone: string;
  code: string;
  clientName: string;
}

export function formatBookingWhatsAppUrl({
  phone,
  code,
  clientName,
}: FormatBookingWhatsAppUrlParams): string {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  } else if (!digits.startsWith("62")) {
    digits = `62${digits}`;
  }

  const message = `Hello ${clientName}, regarding your graduation photography reservation at Gradsun Studio (Code: ${code}): `;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

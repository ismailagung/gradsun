import { env } from "@/env";

export interface PhotographyStudioSchema {
  "@context": "https://schema.org";
  "@type": "PhotographyStudio";
  name: string;
  description: string;
  url: string;
  telephone: string;
  priceRange: string;
  image: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHoursSpecification: Array<{
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
}

export function getPhotographyStudioSchema(): PhotographyStudioSchema {
  const baseUrl = (env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "PhotographyStudio",
    name: "Gradsun Studio — Fine-Art Graduation Photography",
    description:
      "Archival graduation portraits, intimate golden hour memoirs, and studio documentation across Indonesian university commencement ceremonies.",
    url: baseUrl,
    telephone: "+62 812-3456-7890",
    priceRange: "Rp 350.000 - Rp 2.500.000",
    image: `${baseUrl}/images/gradsun-og.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Boulevard No. 45",
      addressLocality: "Jakarta",
      addressRegion: "DKI Jakarta",
      postalCode: "12340",
      addressCountry: "ID",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "21:00",
      },
    ],
  };
}

export function JsonLd() {
  const schema = getPhotographyStudioSchema();

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Structured data schema markup
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

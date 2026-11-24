"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tFoot = useTranslations("footer");

  // Omit marketing footer on admin portal and print invoice pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/invoice")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-card pt-14 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-border">
        {/* Col 1: Brand & Owner */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative size-8 overflow-hidden rounded-full border border-border bg-card p-0.5">
              <Image
                src="/gradsun-no-bg.png"
                alt={tNav("logoAlt")}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
              {tNav("brand")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{tFoot("description")}</p>
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider block font-serif">
              {tFoot("ownerTitle")}
            </span>
            <span className="text-xs text-muted-foreground">{tFoot("ownerValue")}</span>
          </div>
        </div>

        {/* Col 2: Studio Navigation */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-serif">
            {tFoot("navTitle")}
          </span>
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <Link href="/gallery" className="hover:text-foreground transition-colors">
              {tNav("portfolio")}
            </Link>
            <Link href="/packages" className="hover:text-foreground transition-colors">
              {tNav("packages")}
            </Link>
            <Link href="/track-order" className="hover:text-foreground transition-colors">
              {tNav("trackOrder")}
            </Link>
          </div>
        </div>

        {/* Col 3: Contact & Socials */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-serif">
            {tFoot("contactTitle")}
          </span>
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {tFoot("instagram")}
            </a>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {tFoot("whatsapp")}
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {tFoot("tiktok")}
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {tFoot("youtube")}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>{tFoot("copyright")}</p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            {tFoot("terms")}
          </Link>
          <Link href="/login" className="hover:text-primary transition-colors">
            {tFoot("staffPortal")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

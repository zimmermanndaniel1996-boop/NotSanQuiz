"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PalLink() {
  const pathname = usePathname();
  if (pathname?.startsWith("/pal")) return null;

  return (
    <div className="pal-link-wrap">
      <Link href="/pal" className="pal-link">
        PAL-Bereich
      </Link>
    </div>
  );
}

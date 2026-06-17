"use client";

import { usePathname } from "next/navigation";

export default function SiteHorns() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";

  if (!isHome) {
    return null;
  }

  return (
    <div className="site-horns-layer" aria-hidden>
      <div className="horns-container">
        <div className="horn horn-left" />
        <div className="horn horn-right" />
      </div>
    </div>
  );
}

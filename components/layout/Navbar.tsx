"use client";

import { usePathname } from "next/navigation";

import { PublicNavDesktopPill } from "@/components/layout/PublicNavDesktopPill";
import { PublicNavMobile } from "@/components/layout/PublicNavMobile";
import { useSavedProperties } from "@/hooks/useSavedProperties";

export function Navbar() {
  const pathname = usePathname();
  const { savedIds } = useSavedProperties();

  if (pathname === "/" || pathname.startsWith("/agent")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white shadow-sm">
      <div className="md:hidden">
        <PublicNavMobile variant="site" savedCount={savedIds.length} />
      </div>
      <div className="mx-auto hidden max-w-7xl px-4 sm:px-6 lg:px-10 md:block">
        <PublicNavDesktopPill variant="site" savedCount={savedIds.length} />
      </div>
    </header>
  );
}

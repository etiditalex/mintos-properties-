"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn, Menu, Search } from "lucide-react";
import clsx from "clsx";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { FindHomeSearchDrawer } from "@/components/layout/FindHomeSearchDrawer";
import { MobileMenuDrawer } from "@/components/layout/MobileMenuDrawer";
import { BodyPortal } from "@/components/ui/BodyPortal";
import { useProfileRole } from "@/hooks/useProfileRole";
import { useSavedProperties } from "@/hooks/useSavedProperties";

const NAV_MENU_MOBILE_ID = "nav-menu-mobile";

type PublicNavMobileProps = {
  variant?: "home" | "site";
};

/** Three-zone header (menu · logo · actions). Home uses glass bar over hero; site uses white bar. */
export function PublicNavMobile({ variant = "site" }: PublicNavMobileProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [findHomeOpen, setFindHomeOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const { savedIds } = useSavedProperties();
  const showMenuExtras = !pathname.startsWith("/agent");
  const isHome = variant === "home";
  const { user, ready, isStaff, authUnavailable } = useProfileRole();

  useEffect(() => {
    setMenuOpen(false);
    setFindHomeOpen(false);
  }, [pathname]);

  const shell = isHome
    ? "absolute inset-x-0 top-0 z-30 border-b border-white/20 bg-black/35 text-white backdrop-blur-md"
    : "sticky top-0 z-50 border-b border-zinc-200 bg-white text-zinc-900";

  const menuBtn = isHome
    ? "flex items-center gap-2 rounded-lg px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:text-brand sm:text-[11px]"
    : "flex items-center gap-2 rounded-lg px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-900 hover:text-brand sm:text-[11px]";

  const actionClass = isHome
    ? "text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:text-brand sm:text-[11px]"
    : "text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-900 transition-colors hover:text-brand sm:text-[11px]";

  const iconClass = isHome ? "shrink-0 text-white" : "shrink-0 text-zinc-900";

  return (
    <>
      <BodyPortal>
        <FindHomeSearchDrawer open={findHomeOpen} onClose={() => setFindHomeOpen(false)} />

        <MobileMenuDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          showExtras={showMenuExtras}
          savedCount={savedIds.length}
          menuId={NAV_MENU_MOBILE_ID}
        />
      </BodyPortal>

      <header
        className={clsx(
          "w-full pt-[env(safe-area-inset-top,0px)]",
          shell,
        )}
      >
        <div
          className={clsx(
            "mx-auto grid w-full max-w-[100vw] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 px-3 sm:gap-2 sm:px-4",
            "min-h-[100px]",
          )}
        >
          <div className="flex min-w-0 items-center justify-start">
            <button
              type="button"
              className={menuBtn}
              aria-expanded={menuOpen}
              aria-controls={NAV_MENU_MOBILE_ID}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />
              <span>Menu</span>
            </button>
          </div>

          <Link href="/" className="flex min-w-0 justify-center py-1" aria-label="Mintos Properties home">
            <BrandLogo
              priority={isHome}
              height={52}
              className={isHome ? "drop-shadow-md" : undefined}
            />
          </Link>

          <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-2.5 md:gap-3">
            <button
              type="button"
              className={clsx("inline-flex min-h-10 min-w-10 items-center justify-center", actionClass)}
              aria-label="Open search"
              onClick={() => setFindHomeOpen(true)}
            >
              <Search className={clsx("h-5 w-5", iconClass)} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              className={clsx("hidden min-h-10 items-center sm:inline-flex", actionClass)}
              onClick={() => setFindHomeOpen(true)}
            >
              Find your home
            </button>
            {authUnavailable || !ready ? null : user ? (
              <Link
                href={isStaff ? "/agent/properties" : "/saved"}
                className={clsx("inline-flex min-h-10 max-w-[7rem] items-center truncate sm:max-w-none", actionClass)}
              >
                Account
              </Link>
            ) : (
              <Link
                href="/login"
                className={clsx("inline-flex min-h-10 items-center gap-1", actionClass)}
              >
                <LogIn className={clsx("h-4 w-4", iconClass)} strokeWidth={2} aria-hidden />
                <span className="hidden min-[360px]:inline">Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

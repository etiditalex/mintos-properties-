"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn, Menu, Search } from "lucide-react";
import clsx from "clsx";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { FindHomeSearchDrawer } from "@/components/layout/FindHomeSearchDrawer";
import { MobileMenuDrawer } from "@/components/layout/MobileMenuDrawer";
import { useProfileRole } from "@/hooks/useProfileRole";
import { useSavedProperties } from "@/hooks/useSavedProperties";

const NAV_MENU_DESKTOP_ID = "nav-menu-desktop";

type PublicNavDesktopPillProps = {
  /** Prefer logo priority on first paint for the home hero. */
  variant?: "hero" | "site";
};

const action =
  "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-900 transition-colors hover:text-brand lg:text-xs";

/** Same three-zone header everywhere (menu · logo · search / find your home / account). */
export function PublicNavDesktopPill({ variant = "site" }: PublicNavDesktopPillProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [findHomeOpen, setFindHomeOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const isHero = variant === "hero";
  const { savedIds } = useSavedProperties();
  const { user, ready, isStaff, authUnavailable } = useProfileRole();

  const showMenuExtras = !pathname.startsWith("/agent");

  useEffect(() => {
    setMenuOpen(false);
    setFindHomeOpen(false);
  }, [pathname]);

  return (
    <>
      <FindHomeSearchDrawer open={findHomeOpen} onClose={() => setFindHomeOpen(false)} />

      <MobileMenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        showExtras={showMenuExtras}
        savedCount={savedIds.length}
        menuId={NAV_MENU_DESKTOP_ID}
      />

      <div className="grid h-[100px] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 lg:gap-6">
      <div className="flex justify-start">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:text-brand lg:text-xs"
          aria-expanded={menuOpen}
          aria-controls={NAV_MENU_DESKTOP_ID}
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          <span>Menu</span>
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      <Link href="/" className="flex justify-center justify-self-center py-1">
        <BrandLogo priority={isHero} height={80} />
      </Link>

      <div className="flex flex-wrap items-center justify-end gap-3 lg:gap-5 xl:gap-6">
        <button
          type="button"
          className={clsx(action, "min-h-10 min-w-10 justify-center")}
          aria-label="Open search"
          onClick={() => setFindHomeOpen(true)}
        >
          <Search className="h-5 w-5 shrink-0 text-zinc-900" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className={clsx(action, "hidden md:inline-flex")}
          onClick={() => setFindHomeOpen(true)}
        >
          Find your home
        </button>
        {authUnavailable || !ready ? null : user ? (
          <Link
            href={isStaff ? "/agent/properties" : "/saved"}
            className={clsx(action, "max-w-[9rem] truncate lg:max-w-none")}
          >
            Account
          </Link>
        ) : (
          <Link href="/login" className={clsx(action, "gap-1.5")}>
            <LogIn className="h-5 w-5 shrink-0 text-zinc-900" strokeWidth={2} aria-hidden />
            Sign in
          </Link>
        )}
      </div>
    </div>
    </>
  );
}

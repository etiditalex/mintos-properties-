"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

import { AuthButtons } from "@/components/auth/AuthButtons";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { locationNavLinks } from "@/lib/locations";
import { navLinksBeforeLand } from "@/lib/navConfig";

type PublicNavMobileProps = {
  /** Saved count + auth in menu (site-wide pages). Home omits these. */
  variant?: "home" | "site";
  savedCount?: number;
};

const rowHover = "px-4 py-3 text-zinc-800 hover:bg-zinc-50";

export function PublicNavMobile({ variant = "site", savedCount = 0 }: PublicNavMobileProps) {
  const showExtras = variant === "site";

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top,0px))] sm:px-4">
      <Link href="/" className="flex min-w-0 shrink items-center py-1">
        <BrandLogo priority={variant === "home"} height={44} />
      </Link>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-sm bg-brand px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand/90 sm:px-4 sm:text-sm"
        >
          Contact Us
        </Link>
        <details className="relative z-[60]">
        <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center text-zinc-900 [&::-webkit-details-marker]:hidden">
          <span className="sr-only">Open menu</span>
          <Menu className="h-6 w-6" strokeWidth={2} />
        </summary>
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-zinc-200 bg-white py-2 text-zinc-800 shadow-xl">
          <nav className="flex flex-col gap-0.5 text-sm font-medium" aria-label="Mobile menu">
            {navLinksBeforeLand.map((link) => (
              <Link key={link.href} href={link.href} className={rowHover}>
                {link.label}
              </Link>
            ))}
            <details className="border-t border-zinc-100 [&[open]_summary_svg]:rotate-180">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 hover:bg-zinc-50 [&::-webkit-details-marker]:hidden">
                Locations
                <ChevronDown size={16} className="shrink-0 transition-transform duration-200" />
              </summary>
              <div className="flex max-h-[50vh] flex-col gap-1 overflow-y-auto border-t border-zinc-100 px-4 pb-3 pt-1">
                <Link
                  href="/locations"
                  className="rounded-lg py-2 text-sm font-medium text-zinc-800 hover:text-brand"
                >
                  All locations
                </Link>
                {locationNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg py-2 text-sm text-zinc-700 hover:text-brand"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </details>
            {showExtras && (
              <>
                <Link href="/saved" className="border-t border-zinc-100 px-4 py-3 hover:bg-zinc-50">
                  Saved ({savedCount})
                </Link>
                <div className="border-t border-zinc-100 px-4 py-3">
                  <AuthButtons />
                </div>
              </>
            )}
          </nav>
        </div>
      </details>
      </div>
    </header>
  );
}

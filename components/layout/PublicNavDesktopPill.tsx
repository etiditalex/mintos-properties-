"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Phone } from "lucide-react";
import clsx from "clsx";

import { AuthButtons } from "@/components/auth/AuthButtons";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { locationNavLinks } from "@/lib/locations";
import { navLinksBeforeLand } from "@/lib/navConfig";

const PHONE_DISPLAY = "+254 789 579720";
const PHONE_TEL = "+254789579720";

type PublicNavDesktopPillProps = {
  variant: "hero" | "site";
  savedCount?: number;
};

function isRouteActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function LocationsNav({ pathname }: { pathname: string }) {
  const locationsActive =
    pathname === "/locations" || pathname.startsWith("/locations/");
  return (
    <div className="group relative shrink-0">
      <Link
        href="/locations"
        className={clsx(
          "inline-flex items-center gap-1 border-b-2 pb-1 text-sm font-medium transition-colors",
          locationsActive
            ? "border-brand text-brand"
            : "border-transparent text-zinc-800 hover:text-brand",
        )}
      >
        Locations
        <ChevronDown size={15} strokeWidth={2} className="opacity-80" aria-hidden />
      </Link>
      <div className="invisible absolute left-1/2 top-full z-30 mt-0 max-h-[min(70vh,24rem)] w-60 -translate-x-1/2 overflow-y-auto rounded-lg border border-zinc-200 bg-white py-1 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <Link
          href="/locations"
          className="block px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          All locations
        </Link>
        {locationNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-2.5 text-sm text-zinc-800 hover:bg-zinc-50"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PublicNavDesktopPill({ variant, savedCount = 0 }: PublicNavDesktopPillProps) {
  const pathname = usePathname() ?? "";
  const isHero = variant === "hero";

  const linkClass =
    "inline-block shrink-0 border-b-2 pb-1 text-sm font-medium transition-colors";

  return (
    <div className="flex h-[4.25rem] w-full items-center gap-3 lg:h-[5rem] lg:gap-6">
      {/* Logo — fixed column */}
      <div className="flex shrink-0 items-center">
        <Link href="/" className="flex items-center">
          <BrandLogo priority={isHero} height={60} />
        </Link>
      </div>

      {/* Main nav — fills space between logo and actions; centered within that strip (no overlap) */}
      <nav
        className="hidden min-w-0 flex-1 items-center justify-center gap-x-3 gap-y-1 md:flex md:gap-x-4 lg:gap-x-6 xl:gap-x-8"
        aria-label="Main"
      >
        {navLinksBeforeLand.map((link) => {
          const active = isRouteActive(link.href, pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                linkClass,
                active
                  ? "border-brand text-brand"
                  : "border-transparent text-zinc-800 hover:text-brand",
              )}
            >
              {link.label}
            </Link>
          );
        })}
        <LocationsNav pathname={pathname} />
      </nav>

      {/* Phone + account + CTA — separate column, never stacks over nav */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
        <a
          href={`tel:${PHONE_TEL}`}
          className="hidden items-center gap-2 text-sm font-medium leading-none text-zinc-800 transition-colors hover:text-brand md:inline-flex"
        >
          <Phone className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} aria-hidden />
          <span className="whitespace-nowrap tabular-nums tracking-normal">{PHONE_DISPLAY}</span>
        </a>

        {!isHero && (
          <>
            <Link
              href="/saved"
              className="hidden shrink-0 text-sm font-medium leading-none text-zinc-800 transition-colors hover:text-brand md:inline"
            >
              Saved ({savedCount})
            </Link>
            <div className="hidden shrink-0 md:flex md:items-center">
              <AuthButtons />
            </div>
          </>
        )}

        <Link
          href="/contact"
          className={clsx(
            "inline-flex h-10 shrink-0 items-center justify-center rounded-sm px-4 text-sm font-semibold leading-none text-white transition-colors lg:h-11 lg:px-5",
            pathname.startsWith("/contact")
              ? "bg-brand shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
              : "bg-brand hover:bg-brand/90",
          )}
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}

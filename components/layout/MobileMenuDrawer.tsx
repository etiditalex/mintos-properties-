"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";

import { AuthButtons } from "@/components/auth/AuthButtons";
import { locationNavLinks } from "@/lib/locations";
import { contactNavLink, navLinksBeforeLand } from "@/lib/navConfig";

type Props = {
  open: boolean;
  onClose: () => void;
  showExtras: boolean;
  savedCount: number;
  /** Unique id for a11y (mobile + desktop each mount a drawer in the DOM). */
  menuId?: string;
};

const itemRow =
  "flex w-full items-center justify-between border-b border-white/10 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/5 hover:text-brand active:bg-white/10";

const subLink =
  "block rounded-md px-3 py-2.5 text-sm font-medium normal-case tracking-normal text-zinc-300 hover:text-brand";

export function MobileMenuDrawer({
  open,
  onClose,
  showExtras,
  savedCount,
  menuId = "site-nav-menu",
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm transition-opacity"
        aria-label="Close menu"
        onClick={onClose}
      />

      <aside
        id={menuId}
        className="fixed left-0 top-0 z-[210] flex h-[100dvh] w-[min(22rem,calc(100vw-2.5rem))] max-w-[85vw] flex-col bg-zinc-950 shadow-2xl ring-1 ring-white/10 md:max-w-none md:w-[min(32rem,33vw)] md:min-w-[20rem]"
        aria-modal="true"
        aria-label="Site menu"
        role="dialog"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top,0px))]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 hover:text-brand"
            aria-label="Close menu"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2} aria-hidden />
          </button>
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white">Menu</span>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1">
          {navLinksBeforeLand.map((link) => (
            <Link key={link.href} href={link.href} className={itemRow} onClick={onClose}>
              {link.label}
            </Link>
          ))}
          <Link href={contactNavLink.href} className={itemRow} onClick={onClose}>
            {contactNavLink.label}
          </Link>

          <details className="group border-b border-white/10 [&[open]_summary_svg]:rotate-180">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white/5 [&::-webkit-details-marker]:hidden">
              Locations
              <ChevronDown size={18} className="shrink-0 text-white/80 transition-transform duration-200" />
            </summary>
            <div className="space-y-0.5 border-t border-white/5 bg-black/20 px-3 py-2">
              <Link href="/locations" className={subLink} onClick={onClose}>
                All locations
              </Link>
              {locationNavLinks.map((link) => (
                <Link key={link.href} href={link.href} className={subLink} onClick={onClose}>
                  {link.label}
                </Link>
              ))}
            </div>
          </details>

          {showExtras && (
            <>
              <Link href="/saved" className={itemRow} onClick={onClose}>
                Saved ({savedCount})
              </Link>
              <div className="border-b border-white/10 px-4 py-4">
                <AuthButtons linkClassName="text-sm font-medium text-zinc-300 hover:text-brand" />
              </div>
            </>
          )}
        </nav>

        <p className="shrink-0 border-t border-white/10 px-4 py-3 text-[11px] text-zinc-500">
          © {new Date().getFullYear()} Mintos Properties
        </p>
      </aside>
    </>
  );
}

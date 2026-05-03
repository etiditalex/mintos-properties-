"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Star, Mail } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "For Sale", icon: LayoutGrid },
  { href: "/about", label: "About Us", icon: Star },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/agent")) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden"
      aria-label="Mobile primary"
    >
      <div className="mx-auto flex max-w-lg items-end justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex min-h-[44px] min-w-[3.5rem] touch-manipulation flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium",
                active ? "text-brand" : "text-zinc-400",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

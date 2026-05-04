"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Linkedin, Music2, Youtube } from "lucide-react";

import { BrandLogo } from "@/components/layout/BrandLogo";

const quickLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/agent") ||
    pathname === "/terms-of-service" ||
    pathname === "/faq"
  ) {
    return null;
  }

  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-600">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
        <div className="pb-8">
          <BrandLogo height={56} />
        </div>

        <div className="grid w-full gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-black sm:text-2xl lg:text-3xl">About</h2>
          <p className="max-w-sm text-base leading-7 sm:text-lg sm:leading-9">
            Mintos Properties is a dedicated real estate company serving property
            investors, first-home buyers, land buyers, and individuals seeking
            long-term value in Kenya and global markets.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xl font-semibold text-black sm:mb-4 sm:text-2xl lg:text-3xl">
            Our Services
          </h3>
          <ul className="space-y-2 text-base sm:space-y-3 sm:text-lg">
            <li>Land buyers</li>
            <li>Kilifi real estate investors</li>
            <li>Mombasa Real estate investors</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xl font-semibold text-black sm:mb-4 sm:text-2xl lg:text-3xl">
            Quick Links
          </h3>
          <ul className="space-y-2 text-base sm:space-y-3 sm:text-lg">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link className="transition-colors hover:text-brand" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black sm:text-2xl lg:text-3xl">
            Free Consultation
          </h3>
          <p className="text-base sm:text-lg">
            <span className="font-semibold text-black">Call Us: </span>
            +254 789 579720
          </p>
          <p className="text-base leading-7 sm:text-lg sm:leading-8">Kilifi, Bofa Road</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { href: "#", icon: Facebook, label: "Facebook" },
              { href: "#", icon: Instagram, label: "Instagram" },
              { href: "#", icon: Linkedin, label: "LinkedIn" },
              { href: "#", icon: Music2, label: "TikTok" },
              { href: "#", icon: Youtube, label: "YouTube" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-brand/35 bg-white text-brand transition hover:bg-brand/10 sm:h-10 sm:w-10"
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            ))}
          </div>
        </div>
        </div>
      </div>
      <div className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Mintos Properties. All rights reserved.
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Coins,
  FileSearch,
  HardHat,
  Home,
  KeyRound,
  Star,
  Wrench,
} from "lucide-react";

type ServiceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const services: ServiceItem[] = [
  {
    icon: Home,
    title: "Property Management",
    description:
      "End-to-end care for high-end residential and mixed-use assets in Nairobi and the coast—leases, maintenance coordination, and reporting that protect value for owners and residents.",
  },
  {
    icon: Coins,
    title: "Investment Management",
    description:
      "Strategy and execution for investors targeting Kenya's premium segment: pipeline sourcing, underwriting discipline, and alignment with your risk and return profile.",
  },
  {
    icon: HardHat,
    title: "Construction & Development",
    description:
      "From concept to delivery, we support land assembly, design coordination, and project oversight so coastal and urban developments meet quality, timeline, and compliance expectations.",
  },
  {
    icon: Banknote,
    title: "Sales & Transactions",
    description:
      "Discreet marketing, negotiation, and closing for luxury homes, land, and commercial assets—backed by market insight across Nairobi, Mombasa, Diani, and surrounding corridors.",
  },
  {
    icon: Wrench,
    title: "Occupier Services",
    description:
      "Shape how space works for your brand or household: fit-out planning, renewals, and operational support so every square metre supports productivity and experience.",
  },
  {
    icon: KeyRound,
    title: "Landlord Representation",
    description:
      "Position your asset competitively—pricing, tenant mix, and lease structures that unlock yield while maintaining the standards expected in the high-end market.",
  },
  {
    icon: Star,
    title: "Tenant Representation",
    description:
      "Advocacy for occupiers seeking flagship residences or premises—site selection, comparables, and lease terms tailored to coastal and Nairobi opportunities.",
  },
  {
    icon: FileSearch,
    title: "Valuation & Advisory",
    description:
      "Credible, evidence-led opinions of value and strategic guidance for financing, board reporting, and negotiation—grounded in local transactions, not generic benchmarks.",
  },
];

function isDarkCell(index: number, cols: number) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  return (row + col) % 2 === 0;
}

function gridColumnCount(): 1 | 2 | 4 {
  if (typeof window === "undefined") return 1;
  if (window.matchMedia("(min-width: 1024px)").matches) return 4;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

export function MintosServicesGrid() {
  /** Match Tailwind mobile-first grid (`grid-cols-1 sm:2 lg:4`) so SSR + first paint avoid wrong checkerboard. */
  const [cols, setCols] = useState<1 | 2 | 4>(1);

  useLayoutEffect(() => {
    const update = () => setCols(gridColumnCount());
    update();
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    mqSm.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  return (
    <section className="w-full border-y border-zinc-200/80 bg-zinc-300" aria-label="Mintos Real Estate services">
      <div className="grid w-full max-w-none grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {services.map((item, i) => {
          const dark = isDarkCell(i, cols);
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={
                dark
                  ? "flex min-h-[17.5rem] flex-col items-center bg-black px-4 py-8 text-center text-white sm:min-h-[20rem] sm:px-6 sm:py-10 md:min-h-[22rem] md:px-8 md:py-12"
                  : "flex min-h-[17.5rem] flex-col items-center bg-white px-4 py-8 text-center text-black sm:min-h-[20rem] sm:px-6 sm:py-10 md:min-h-[22rem] md:px-8 md:py-12"
              }
            >
              <Icon
                className={`h-10 w-10 shrink-0 sm:h-11 sm:w-11 ${dark ? "text-white" : "text-brand"}`}
                strokeWidth={1.25}
                aria-hidden
              />
              <h3 className="mt-5 text-pretty text-base font-bold leading-snug sm:mt-6 sm:text-lg md:text-xl">
                {item.title}
              </h3>
              <p
                className={`mt-3 w-full max-w-prose flex-1 text-pretty text-[0.8125rem] leading-relaxed sm:mt-4 sm:max-w-sm sm:text-sm md:text-base ${
                  dark ? "text-zinc-300" : "text-zinc-600"
                } mx-auto`}
              >
                {item.description}
              </p>
              <Link
                href="/services"
                className={`mt-8 inline-flex min-h-[44px] min-w-[10rem] items-center justify-center rounded-none border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                  dark
                    ? "border-white text-white hover:bg-white/10"
                    : "border-black text-black hover:bg-zinc-100"
                }`}
              >
                Learn more
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
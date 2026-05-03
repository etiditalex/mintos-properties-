import Link from "next/link";
import type { Metadata } from "next";

import { LOCATIONS } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Explore Mintos Properties across Kenya — coastal and Nairobi areas we serve.",
};

export default function LocationsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-10">
      <p className="text-sm uppercase tracking-[0.25em] text-brand">Areas we serve</p>
      <h1 className="mt-3 text-4xl font-semibold text-black">Locations</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        Browse properties and local insight by area.
      </p>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {LOCATIONS.map(({ slug, label }) => (
          <li key={slug}>
            <Link
              href={`/locations/${slug}`}
              className="flex rounded-lg border border-zinc-200 bg-white px-5 py-4 text-base font-medium text-zinc-900 shadow-sm transition hover:border-brand/40 hover:text-brand"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

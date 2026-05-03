import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LOCATIONS, getLocationBySlug } from "@/lib/locations";

interface LocationPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return LOCATIONS.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: LocationPageProps): Metadata {
  const loc = getLocationBySlug(params.slug);
  if (!loc) return { title: "Location" };
  return {
    title: loc.label,
    description: `Mintos Properties in ${loc.label}, Kenya.`,
  };
}

export default function LocationPage({ params }: LocationPageProps) {
  const loc = getLocationBySlug(params.slug);
  if (!loc) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
      <Link
        href="/locations"
        className="text-sm font-medium text-brand hover:underline"
      >
        ← All locations
      </Link>
      <p className="mt-8 text-sm uppercase tracking-[0.25em] text-brand">Location</p>
      <h1 className="mt-3 text-4xl font-semibold text-black">{loc.label}</h1>
      <p className="mt-6 leading-8 text-zinc-600">
        Discover listings and advisory support in {loc.label}. Contact us for curated
        opportunities and local market guidance.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/properties"
          className="inline-flex rounded-sm bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
        >
          View properties
        </Link>
        <Link
          href="/contact"
          className="inline-flex rounded-sm border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-brand hover:text-brand"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}

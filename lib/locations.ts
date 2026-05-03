/** Areas served — slugs map to `/locations/[slug]`. */
export const LOCATIONS = [
  { slug: "mombasa", label: "Mombasa" },
  { slug: "nyali", label: "Nyali" },
  { slug: "mtwapa", label: "Mtwapa" },
  { slug: "malindi", label: "Malindi" },
  { slug: "diani", label: "Diani" },
  { slug: "lamu", label: "Lamu" },
  { slug: "nairobi", label: "Nairobi" },
  { slug: "kilimani", label: "Kilimani" },
  { slug: "lavington", label: "Lavington" },
  { slug: "donholm", label: "Donholm" },
] as const;

export const locationNavLinks = LOCATIONS.map(({ slug, label }) => ({
  href: `/locations/${slug}` as const,
  label,
}));

export function getLocationBySlug(slug: string) {
  return LOCATIONS.find((l) => l.slug === slug);
}

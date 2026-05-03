"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

import { defaultFilters } from "@/lib/properties";
import { serializePropertyFilters } from "@/lib/propertySearchParams";
import type { ListingIntent, PropertyFilterState, PropertySearchModeFilter } from "@/types/property";

type Facets = {
  locations: string[];
  propertyTypes: string[];
  featureTags: string[];
  priceMin: number;
  priceMax: number;
  bedOptions: number[];
  bathOptions: number[];
};

// Mintos palette: black surfaces + gold accent (brand).
const panel = "bg-zinc-950 text-white";
const sectionTitle = "text-[11px] font-medium uppercase tracking-[0.2em] text-white/90";
const divider = "border-t border-white/10";
const segmentWrap = "flex overflow-hidden rounded border border-white/20 bg-white/[0.03]";
const segmentBtn =
  "flex-1 px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors sm:text-[11px]";
const segmentInactive = "text-white/85 hover:bg-white/5";
const segmentActive = "bg-brand/20 text-white";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function FindHomeSearchDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const [filters, setFilters] = useState<PropertyFilterState>(defaultFilters);
  const [facets, setFacets] = useState<Facets | null>(null);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshMeta = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/property-search-meta?${serializePropertyFilters(filters)}`);
      if (!res.ok) throw new Error("meta");
      const data = (await res.json()) as {
        facets: Facets;
        matchCount: number;
      };
      setFacets(data.facets);
      setMatchCount(data.matchCount);
    } catch {
      setMatchCount(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => {
      void refreshMeta();
    }, 200);
    return () => window.clearTimeout(t);
  }, [open, refreshMeta]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const toggleType = (type: string) => {
    setFilters((prev) => {
      const has = prev.selectedTypes.includes(type);
      const selectedTypes = has ?
        prev.selectedTypes.filter((t) => t !== type)
      : [...prev.selectedTypes, type];
      return {
        ...prev,
        selectedTypes,
        type: selectedTypes.length === 1 ? selectedTypes[0]! : "All",
      };
    });
  };

  const toggleFeature = (tag: string) => {
    setFilters((prev) => {
      const has = prev.selectedFeatures.includes(tag);
      const selectedFeatures = has ?
        prev.selectedFeatures.filter((t) => t !== tag)
      : [...prev.selectedFeatures, tag];
      return { ...prev, selectedFeatures };
    });
  };

  const setIntent = (listingIntent: ListingIntent) =>
    setFilters((prev) => ({ ...prev, listingIntent }));

  const setMode = (searchMode: PropertySearchModeFilter) =>
    setFilters((prev) => ({ ...prev, searchMode }));

  const setBed = (bedMin: number) => setFilters((prev) => ({ ...prev, bedMin }));
  const setBath = (bathMin: number) => setFilters((prev) => ({ ...prev, bathMin }));

  const bedSegments = [0, 1, 2, 3, 4, 5];
  const bathSegments = [0, 1, 2, 3, 4, 5];

  const onClear = () => {
    setFilters({
      ...defaultFilters,
      maxPrice: facets?.priceMax ?? defaultFilters.maxPrice,
      minPrice: facets?.priceMin ?? defaultFilters.minPrice,
    });
  };

  const onShowResults = () => {
    const query = serializePropertyFilters(filters);
    router.push(`/properties${query ? `?${query}` : ""}`);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[240] bg-black/50 backdrop-blur-[2px]"
        aria-label="Close search"
        onClick={onClose}
      />

      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-[250] flex w-full max-w-lg flex-col shadow-2xl ring-1 ring-black/20",
          panel,
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Find your home"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top,0px))]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2} aria-hidden />
          </button>
          <span className="text-sm font-semibold uppercase tracking-[0.22em]">Search</span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-28 pt-2">
          <section className={clsx("space-y-3 py-5", divider)}>
            <p className={sectionTitle}>Looking to</p>
            <div className={segmentWrap}>
              {(
                [
                  ["buy", "Buy"],
                  ["rent", "Rent"],
                  ["sold_let", "Sold / Let"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={clsx(
                    segmentBtn,
                    filters.listingIntent === value ? segmentActive : segmentInactive,
                  )}
                  onClick={() => setIntent(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className={clsx("space-y-3 py-5", divider)}>
            <p className={sectionTitle}>Looking for</p>
            <div className={segmentWrap}>
              {(
                [
                  ["properties", "Properties"],
                  ["developments", "Developments"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={clsx(
                    segmentBtn,
                    filters.searchMode === value ? segmentActive : segmentInactive,
                  )}
                  onClick={() => setMode(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-white/55">
              Developments lists land and plot listings; Properties lists homes and buildings.
            </p>
          </section>

          <section className={clsx("space-y-3 py-5", divider)}>
            <p className={sectionTitle}>Location</p>
            <label className="sr-only" htmlFor="find-home-location">
              Location
            </label>
            <select
              id="find-home-location"
              className="h-12 w-full rounded border border-white/25 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            >
              <option value="All">All locations</option>
              {(facets?.locations ?? []).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="find-home-q">
              Keywords
            </label>
            <input
              id="find-home-q"
              type="search"
              placeholder="Suburb, city, title keywords…"
              className="h-12 w-full rounded border border-white/25 bg-transparent px-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </section>

          <section className={clsx("space-y-3 py-5", divider)}>
            <p className={sectionTitle}>Property type</p>
            <div className="flex flex-col gap-2">
              {(facets?.propertyTypes ?? []).map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-3 rounded border border-white/10 bg-white/[0.02] px-3 py-3 text-sm hover:bg-white/[0.06]"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 rounded border-white/40 bg-transparent text-brand focus:ring-brand"
                    checked={filters.selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
              {(facets?.propertyTypes?.length ?? 0) === 0 && (
                <p className="text-sm text-white/60">No listing types yet — add properties in admin.</p>
              )}
            </div>
          </section>

          <section className={clsx("space-y-3 py-5", divider)}>
            <p className={sectionTitle}>Price range (KES)</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs text-white/70">
                Min
                <input
                  type="number"
                  min={0}
                  className="h-11 rounded border border-white/25 bg-transparent px-2 text-sm text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: Number(e.target.value || 0),
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-xs text-white/70">
                Max
                <input
                  type="number"
                  min={0}
                  className="h-11 rounded border border-white/25 bg-transparent px-2 text-sm text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: Number(e.target.value || 0),
                    }))
                  }
                />
              </label>
            </div>
          </section>

          <section className={clsx("space-y-3 py-5", divider)}>
            <p className={sectionTitle}>Bedrooms</p>
            <div className={clsx(segmentWrap, "flex-wrap")}>
              {bedSegments.map((n) => (
                <button
                  key={`bed-${n}`}
                  type="button"
                  className={clsx(
                    segmentBtn,
                    filters.bedMin === n ? segmentActive : segmentInactive,
                  )}
                  onClick={() => setBed(n)}
                >
                  {n === 0 ? "Any" : `${n}+`}
                </button>
              ))}
            </div>
          </section>

          <section className={clsx("space-y-3 py-5", divider)}>
            <p className={sectionTitle}>Bathrooms</p>
            <div className={clsx(segmentWrap, "flex-wrap")}>
              {bathSegments.map((n) => (
                <button
                  key={`bath-${n}`}
                  type="button"
                  className={clsx(
                    segmentBtn,
                    filters.bathMin === n ? segmentActive : segmentInactive,
                  )}
                  onClick={() => setBath(n)}
                >
                  {n === 0 ? "Any" : `${n}+`}
                </button>
              ))}
            </div>
          </section>

          <section className={clsx("space-y-3 py-5", divider)}>
            <p className={sectionTitle}>Features</p>
            <div className="flex flex-col gap-2">
              {(facets?.featureTags ?? []).map((tag) => (
                <label
                  key={tag}
                  className="flex cursor-pointer items-center gap-3 py-2 text-sm hover:text-brand"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 rounded border-white/40 bg-transparent text-brand focus:ring-brand"
                    checked={filters.selectedFeatures.includes(tag)}
                    onChange={() => toggleFeature(tag)}
                  />
                  {tag}
                </label>
              ))}
              {(facets?.featureTags?.length ?? 0) === 0 && (
                <p className="text-sm text-white/60">
                  Tags appear when agents add feature labels on listings.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-zinc-950/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded border border-white/25 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              onClick={onClear}
            >
              Clear all filters
            </button>
            <button
              type="button"
              disabled={loading}
              className="flex-1 rounded bg-brand py-3 text-xs font-semibold uppercase tracking-[0.14em] text-black transition hover:opacity-90 disabled:opacity-60"
              onClick={onShowResults}
            >
              {loading ? "…" : `Show ${matchCount ?? "—"} results`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

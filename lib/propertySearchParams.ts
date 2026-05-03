import { defaultFilters } from "@/lib/properties";
import type {
  ListingIntent,
  PropertyFilterState,
  PropertySearchModeFilter,
} from "@/types/property";

const INTENTS: ListingIntent[] = ["buy", "rent", "sold_let"];
const MODES: PropertySearchModeFilter[] = ["properties", "developments"];

function first(value: string | string[] | undefined): string {
  if (value == null) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

function parseNum(raw: string, fallback: number): number {
  if (raw.trim() === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Next.js `searchParams` prop → `URLSearchParams` for shared parsers. */
export function recordToURLSearchParams(
  raw: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => p.append(key, v));
    } else {
      p.set(key, value);
    }
  }
  return p;
}

export function parsePropertyFiltersFromSearchParams(
  raw: URLSearchParams | Record<string, string | string[] | undefined>,
): PropertyFilterState {
  const get = (key: string): string => {
    if (raw instanceof URLSearchParams) return raw.get(key) ?? "";
    return first(raw[key]);
  };

  const intentRaw = get("intent").toLowerCase();
  const listingIntent: ListingIntent =
    INTENTS.includes(intentRaw as ListingIntent) ? (intentRaw as ListingIntent) : defaultFilters.listingIntent;

  const modeRaw = get("mode").toLowerCase();
  const searchMode: PropertySearchModeFilter =
    MODES.includes(modeRaw as PropertySearchModeFilter) ?
      (modeRaw as PropertySearchModeFilter)
    : defaultFilters.searchMode;

  const typesCsv = get("types");
  const selectedTypes =
    typesCsv.trim().length > 0 ?
      typesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const featuresCsv = get("features");
  const selectedFeatures =
    featuresCsv.trim().length > 0 ?
      featuresCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const singleType = get("type");
  const type =
    singleType && singleType !== "All" ? singleType
    : selectedTypes.length === 1 ? selectedTypes[0]!
    : "All";

  return {
    ...defaultFilters,
    search: get("q").trim() || defaultFilters.search,
    location: (() => {
      const loc = get("loc").trim();
      return loc.length > 0 ? loc : defaultFilters.location;
    })(),
    type,
    minPrice: parseNum(get("min"), defaultFilters.minPrice),
    maxPrice: parseNum(get("max"), defaultFilters.maxPrice),
    listingIntent,
    searchMode,
    bedMin: parseNum(get("bed"), defaultFilters.bedMin),
    bathMin: parseNum(get("bath"), defaultFilters.bathMin),
    selectedTypes,
    selectedFeatures,
  };
}

export function serializePropertyFilters(filters: PropertyFilterState): string {
  const p = new URLSearchParams();

  if (filters.search.trim()) p.set("q", filters.search.trim());
  if (filters.location !== "All") p.set("loc", filters.location);

  if (filters.selectedTypes.length > 0) {
    p.set("types", filters.selectedTypes.join(","));
  } else if (filters.type !== "All") {
    p.set("type", filters.type);
  }

  if (filters.minPrice !== defaultFilters.minPrice) p.set("min", String(filters.minPrice));
  if (filters.maxPrice !== defaultFilters.maxPrice) p.set("max", String(filters.maxPrice));

  if (filters.listingIntent !== defaultFilters.listingIntent) {
    p.set("intent", filters.listingIntent);
  }
  if (filters.searchMode !== defaultFilters.searchMode) {
    p.set("mode", filters.searchMode);
  }
  if (filters.bedMin !== defaultFilters.bedMin) p.set("bed", String(filters.bedMin));
  if (filters.bathMin !== defaultFilters.bathMin) p.set("bath", String(filters.bathMin));
  if (filters.selectedFeatures.length > 0) {
    p.set("features", filters.selectedFeatures.join(","));
  }

  return p.toString();
}

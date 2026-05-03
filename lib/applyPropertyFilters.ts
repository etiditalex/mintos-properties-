import { isLandType } from "@/lib/land";
import { Property, PropertyFilterState } from "@/types/property";

/** Lowercase tokens used for feature matching. */
export function getPropertySearchTags(property: Property): string[] {
  const fromDb = property.featureTags ?? [];
  const fromLegacy = [
    ...property.features,
    ...property.amenities.map((a) => a.label),
  ];
  const merged = [...fromDb, ...fromLegacy];
  return merged.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
}

export function applyPropertyFilters(
  collection: Property[],
  filters: PropertyFilterState,
): Property[] {
  return collection.filter((property) => {
    const listingMode = property.listingMode ?? "sale";
    const status = property.status ?? "available";

    if (filters.listingIntent === "buy") {
      if (status !== "available" || listingMode !== "sale") return false;
    } else if (filters.listingIntent === "rent") {
      if (status !== "available" || listingMode !== "rent") return false;
    } else if (filters.listingIntent === "sold_let") {
      if (status !== "sold" && status !== "rented") return false;
    }

    if (filters.searchMode === "developments") {
      if (!isLandType(property.type)) return false;
    } else if (filters.searchMode === "properties") {
      if (isLandType(property.type)) return false;
    }

    const q = filters.search.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 ||
      property.title.toLowerCase().includes(q) ||
      property.location.toLowerCase().includes(q) ||
      property.slug.toLowerCase().includes(q);

    const matchesLocation =
      filters.location === "All" || property.location === filters.location;

    const matchesTypeMulti =
      filters.selectedTypes.length === 0 ||
      filters.selectedTypes.includes(property.type);

    const matchesTypeSingle =
      filters.type === "All" || property.type === filters.type;

    const matchesType =
      filters.selectedTypes.length > 0 ? matchesTypeMulti : matchesTypeSingle;

    const matchesPrice =
      property.price >= filters.minPrice && property.price <= filters.maxPrice;

    const matchesBeds = filters.bedMin === 0 || property.beds >= filters.bedMin;
    const matchesBaths = filters.bathMin === 0 || property.baths >= filters.bathMin;

    const tags = getPropertySearchTags(property);
    const wanted = filters.selectedFeatures.map((f) => f.trim().toLowerCase()).filter(Boolean);
    const matchesFeatures =
      wanted.length === 0 || wanted.some((w) => tags.some((t) => t.includes(w) || w.includes(t)));

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesPrice &&
      matchesBeds &&
      matchesBaths &&
      matchesFeatures
    );
  });
}

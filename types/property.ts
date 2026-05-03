export type PropertyType = "Apartment" | "Villa" | "Penthouse" | "Townhouse";

/** Mirrors DB `listing_mode`: sale = buy, rent = rental listings. */
export type ListingMode = "sale" | "rent";

export interface PropertyAmenity {
  label: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  type: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  areaSqFt: number;
  description: string;
  features: string[];
  amenities: PropertyAmenity[];
  coverImage: string;
  gallery: string[];
  featured?: boolean;
  status?: "available" | "sold" | "rented";
  agentId?: string;
  listingMode?: ListingMode;
  /** From DB `feature_tags`; also merged with legacy `features` / amenity labels for filtering. */
  featureTags?: string[];
}

export type ListingIntent = "buy" | "rent" | "sold_let";

export type PropertySearchModeFilter = "properties" | "developments";

export interface PropertyFilterState {
  search: string;
  location: string;
  /** Legacy single-type filter; use `selectedTypes` when set from the search drawer. */
  type: string;
  minPrice: number;
  maxPrice: number;
  listingIntent: ListingIntent;
  /** Residential/buildings vs land-focused listings. */
  searchMode: PropertySearchModeFilter;
  /** Minimum bedrooms (0 = any). */
  bedMin: number;
  /** Minimum bathrooms (0 = any). */
  bathMin: number;
  /** Empty = any property type. */
  selectedTypes: string[];
  /** Feature/tag labels — match if any selected tag matches listing tags or legacy features. */
  selectedFeatures: string[];
}

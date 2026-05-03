import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { applyPropertyFilters } from "@/lib/applyPropertyFilters";
import { defaultFilters } from "@/lib/properties";
import { parsePropertyFiltersFromSearchParams } from "@/lib/propertySearchParams";
import type { Property } from "@/types/property";
import { getAllProperties } from "@/services/propertyService";

function collectFeatureFacetLabels(properties: Property[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const property of properties) {
    const add = (label: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      out.push(trimmed);
    };

    for (const t of property.featureTags ?? []) add(t);
    for (const f of property.features) add(f);
    for (const a of property.amenities) add(a.label);
  }

  return out.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export async function GET(request: NextRequest) {
  try {
    const properties = await getAllProperties();
    const { searchParams } = request.nextUrl;
    const filters = parsePropertyFiltersFromSearchParams(searchParams);

    const locations = [...new Set(properties.map((p) => p.location))].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
    const propertyTypes = [...new Set(properties.map((p) => p.type))].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
    const featureTags = collectFeatureFacetLabels(properties);

    let priceMin = defaultFilters.minPrice;
    let priceMax = defaultFilters.maxPrice;
    if (properties.length > 0) {
      const prices = properties.map((p) => p.price);
      priceMin = Math.min(...prices);
      priceMax = Math.max(...prices);
    }

    const matchCount = applyPropertyFilters(properties, filters).length;

    const bedOptions = [0, ...new Set(properties.map((p) => p.beds))].sort((a, b) => a - b);
    const bathOptions = [0, ...new Set(properties.map((p) => p.baths))].sort((a, b) => a - b);

    return NextResponse.json({
      facets: {
        locations,
        propertyTypes,
        featureTags,
        priceMin,
        priceMax,
        bedOptions,
        bathOptions,
      },
      matchCount,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to load search metadata." }, { status: 500 });
  }
}

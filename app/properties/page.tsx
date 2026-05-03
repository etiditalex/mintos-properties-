import { Metadata } from "next";

import { PropertiesClient } from "./PropertiesClient";
import {
  parsePropertyFiltersFromSearchParams,
  recordToURLSearchParams,
  serializePropertyFilters,
} from "@/lib/propertySearchParams";
import { getAllProperties } from "@/services/propertyService";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse curated premium homes and investment-ready residences.",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const properties = await getAllProperties();
  const initialFilters = parsePropertyFiltersFromSearchParams(
    recordToURLSearchParams(searchParams),
  );
  const filterKey = serializePropertyFilters(initialFilters);

  return (
    <section>
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-zinc-200 text-black">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dyfnobo9r/image/upload/v1777786000/property_tjvkk1.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/45 to-white/5" />

        <div className="relative mx-auto flex min-h-[20rem] w-full max-w-[88rem] items-end px-4 pb-10 sm:min-h-[28rem] sm:px-8 sm:pb-12 md:min-h-[32rem] md:px-10 lg:min-h-[38rem] lg:px-14 lg:pb-16">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl md:text-5xl">
              Properties
            </h1>
            <div className="h-[3px] w-12 bg-brand" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mb-8 space-y-2 sm:mb-10 sm:space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-brand sm:text-sm sm:tracking-[0.25em]">
            Portfolio
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl md:text-4xl">
            Available Properties
          </h2>
        </div>
        <PropertiesClient key={filterKey} properties={properties} initialFilters={initialFilters} />
      </div>
    </section>
  );
}

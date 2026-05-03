import Link from "next/link";
import Image from "next/image";

import { ClientTestimonials } from "@/components/home/ClientTestimonials";
import { FutureRealEstateCta } from "@/components/home/FutureRealEstateCta";
import { MintosCoastalIntro } from "@/components/home/MintosCoastalIntro";
import { MintosServicesGrid } from "@/components/home/MintosServicesGrid";
import { PremierServicesIntro } from "@/components/home/PremierServicesIntro";
import { PortfolioServicesBand } from "@/components/home/PortfolioServicesBand";
import { PublicNavDesktopPill } from "@/components/layout/PublicNavDesktopPill";
import { PublicNavMobile } from "@/components/layout/PublicNavMobile";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { getAllProperties } from "@/services/propertyService";
import { getPublishedTestimonials } from "@/services/testimonialService";

/** Home hero — Cloudinary (mintos_2). */
const HERO_IMAGE =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1777709410/mintos_2_pw1jze.jpg";

export default async function Home() {
  const allProperties = await getAllProperties();
  const featuredProperties = allProperties.slice(0, 3);
  const testimonials = await getPublishedTestimonials();

  return (
    <div className="min-w-0 overflow-x-hidden">
      <section className="relative md:hidden">
        <PublicNavMobile variant="home" />

        <div className="relative isolate min-h-[100svh] w-full">
          <Image
            src={HERO_IMAGE}
            alt="Luxury apartment buildings at dusk"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/50" />
        </div>
      </section>

      {/* Tablet & desktop: nav over hero image only */}
      <section className="relative z-0 hidden min-h-[100vh] w-full overflow-hidden md:block">
        <Image
          src={HERO_IMAGE}
          alt="Luxury apartment buildings at dusk"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        <div className="relative z-10 flex min-h-[100vh] w-full flex-col">
          <header className="w-full border-b border-zinc-200/60 bg-white/95 shadow-sm backdrop-blur-md">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
              <PublicNavDesktopPill variant="hero" />
            </div>
          </header>
        </div>
      </section>

      <PremierServicesIntro />

      <MintosServicesGrid />

      <MintosCoastalIntro />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <FadeIn>
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.22em] text-brand sm:text-sm sm:tracking-[0.25em]">
                Featured
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black sm:mt-3 sm:text-3xl">
                Signature Properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="shrink-0 self-start text-sm font-medium text-zinc-700 underline-offset-4 hover:text-brand hover:underline sm:self-auto sm:no-underline sm:hover:underline"
            >
              View all listings
            </Link>
          </div>
        </FadeIn>
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <FadeIn key={property.id}>
              <PropertyCard property={property} />
            </FadeIn>
          ))}
        </div>
      </section>

      <PortfolioServicesBand />

      <FutureRealEstateCta />

      <section className="border-t border-zinc-100 bg-[#faf8f5] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-brand sm:text-sm sm:tracking-[0.25em]">
              Next Step
            </p>
            <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              Let&apos;s Find Your Signature Property
            </h2>
          </div>
          <Link href="/contact" className="w-full shrink-0 sm:w-auto">
            <Button className="w-full sm:w-auto">Book Consultation</Button>
          </Link>
        </div>
      </section>

      <ClientTestimonials items={testimonials} />

    </div>
  );
}

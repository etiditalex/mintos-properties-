import Link from "next/link";
import Image from "next/image";

import { HomeHeroMessaging } from "@/components/home/HomeHeroMessaging";
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

/** Home hero — Cloudinary (hero2_gcsuva). */
const HERO_IMAGE =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1777885366/hero3_t1rcb0.jpg";

export default async function Home() {
  const allProperties = await getAllProperties();
  const featuredProperties = allProperties.slice(0, 3);
  const testimonials = await getPublishedTestimonials();

  return (
    <div className="min-w-0 overflow-x-hidden">
      <section className="relative md:hidden">
        <div className="relative isolate flex min-h-[100svh] w-full flex-col">
          <Image
            src={HERO_IMAGE}
            alt="High-rise apartment buildings in a ring, low angle view toward an overcast sky"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Minimal blur + darkening for depth and readable type */}
          <div
            className="absolute inset-0 z-[1] backdrop-blur-[0.5px] sm:backdrop-blur-[1px]"
            aria-hidden
          />
          <div
            className="absolute inset-0 z-[2] bg-gradient-to-b from-black/45 via-black/38 to-black/52"
            aria-hidden
          />
          <PublicNavMobile variant="home" />
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-28 pt-[max(7rem,calc(env(safe-area-inset-top,0px)+100px))] sm:px-6 lg:px-10">
            <HomeHeroMessaging />
          </div>
        </div>
      </section>

      {/* Tablet & desktop: nav over hero image only */}
      <section className="relative z-0 hidden min-h-[100vh] w-full overflow-hidden md:block">
        <Image
          src={HERO_IMAGE}
          alt="High-rise apartment buildings in a ring, low angle view toward an overcast sky"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 z-[1] backdrop-blur-[0.5px] md:backdrop-blur-[1px]"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[2] bg-gradient-to-r from-black/52 via-black/38 to-black/30"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[2] bg-gradient-to-t from-black/52 via-black/32 to-black/22"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[100vh] w-full flex-col">
          <header className="w-full border-b border-zinc-200/60 bg-white/95 shadow-sm backdrop-blur-md">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
              <PublicNavDesktopPill variant="hero" />
            </div>
          </header>
          <div className="flex w-full flex-1 flex-col items-center justify-center px-4 pb-16 pt-8 sm:px-6 lg:px-10 md:pb-20">
            <HomeHeroMessaging />
          </div>
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

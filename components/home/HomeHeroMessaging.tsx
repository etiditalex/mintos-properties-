import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Centered headline, full-width supporting copy, and CTA for the home hero (image provided by parent). */
export function HomeHeroMessaging() {
  return (
    <div className="w-full max-w-7xl text-center">
      <div className="w-full max-w-none rounded-xl bg-black/60 px-5 py-6 backdrop-blur-[3px] sm:px-7 sm:py-8 md:bg-black/50">
        <h1 className="text-balance text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.08]">
          <span className="text-white">Kenya&apos;s Gate to </span>
          <span className="text-brand">Real Estate</span>
        </h1>
        <p className="mt-5 w-full max-w-none text-pretty text-sm font-normal leading-relaxed text-white sm:mt-6 sm:text-base sm:leading-relaxed md:text-lg md:leading-[1.65] lg:text-xl lg:leading-relaxed">
          We connect global investors and Kenyan buyers to the country&apos;s property market through
          trust, innovation, and dedicated partnerships—curating luxury homes, prime land, and
          income-ready assets with clarity and long-term value at every step.
        </p>
      </div>
      <Link
        href="/properties"
        className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-brand px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-black shadow-md transition hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-10 sm:px-8 sm:tracking-[0.16em] md:text-sm"
      >
        Discover More
        <ArrowRight className="h-4 w-4 shrink-0 md:h-[1.125rem] md:w-[1.125rem]" strokeWidth={2.25} aria-hidden />
      </Link>
    </div>
  );
}

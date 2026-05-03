import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

/** Intro band below the home hero — headline, body, primary CTA (Mintos palette). */
export function PremierServicesIntro() {
  return (
    <section
      className="border-t border-zinc-100 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
      aria-labelledby="mintos-real-estate-heading"
    >
      <div className="w-full max-w-none">
        <FadeIn>
          <h2
            id="mintos-real-estate-heading"
            className="text-balance text-xl font-bold uppercase tracking-[0.05em] text-black sm:text-2xl sm:tracking-[0.06em] md:text-3xl lg:text-[2.125rem] lg:leading-tight"
          >
            Mintos Real Estate — Nairobi &amp; the coast
          </h2>
          <div className="mt-5 w-full max-w-none space-y-3.5 text-[0.9375rem] leading-[1.6] text-zinc-600 sm:mt-6 sm:space-y-4 sm:text-base sm:leading-[1.65] md:text-lg md:leading-relaxed">
            <p>
              Mintos Real Estate is a leading provider of high-end properties across Kenya&apos;s
              coastal region and Nairobi at large. From ocean-facing residences and hospitality-led
              corridors to exclusive urban addresses, we curate opportunities that match how you
              live, invest, and build long-term value.
            </p>
            <p>
              We specialize in luxury residential and commercial opportunities—apartments, villas,
              land with clear title, and income-oriented assets—supported by market intelligence,
              transparent documentation, and a disciplined process from first viewing through
              negotiation and handover.
            </p>
            <p>
              Whether you are acquiring a primary home, diversifying with coastal or Nairobi
              holdings, or divesting a legacy property, our advisors combine on-the-ground presence
              with a premium service standard so every decision reflects the segment you expect—not a
              generic template from elsewhere.
            </p>
          </div>
          <div className="mt-7 w-full sm:mt-10 sm:w-auto">
            <Link href="/contact" className="block w-full sm:inline-block sm:w-auto">
              <Button className="w-full min-h-12 rounded-sm px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] sm:min-h-0 sm:w-auto sm:px-8 sm:tracking-[0.2em]">
                Get started
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

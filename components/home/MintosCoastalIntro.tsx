import Image from "next/image";

/** Luxury coastal high-rise — Cloudinary. */
const COASTAL_APARTMENT =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1777712579/apartment_vpzfn3.jpg";

export function MintosCoastalIntro() {
  return (
    <section
      className="relative z-40 w-full border-t border-zinc-100 bg-white"
      aria-labelledby="mintos-coastal-heading"
    >
      <div
        className="flex w-full flex-col px-4 pb-8 pt-0 sm:px-6 sm:pb-10 md:min-h-[min(40rem,85vh)] md:flex-row md:items-stretch md:px-0 md:pb-0 md:pl-8 lg:pl-10 xl:pl-12 md:pr-0"
      >
        <div className="relative z-10 w-full shrink-0 bg-white md:w-[42%] md:max-w-none lg:w-[40%]">
          <div className="p-2 sm:p-4 md:p-4 md:pr-4 md:pt-5 md:pb-5 lg:pr-6 lg:py-6">
            <div className="relative">
              <div className="relative aspect-[4/5] min-h-[14rem] w-full overflow-hidden sm:aspect-[3/4] sm:min-h-[16rem] md:aspect-auto md:min-h-[min(70vh,38rem)]">
                <Image
                  src={COASTAL_APARTMENT}
                  alt="Aerial view of luxury apartment towers near the coast with pool and ocean"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 768px) 42vw, 100vw"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative z-20 flex w-full min-w-0 flex-1 flex-col justify-center border-t border-brand/25 bg-white px-4 py-9 text-black sm:px-6 sm:py-12 md:min-h-0 md:border-l md:border-t-0 md:px-0 md:py-16 md:pl-8 md:pr-8 lg:pl-10 lg:py-20 lg:pr-10 xl:pl-12 xl:pr-12 2xl:pr-16"
        >
          <p className="text-[11px] font-bold uppercase leading-relaxed tracking-[0.2em] text-brand sm:text-xs">
            Whether you&apos;re buying, selling, or investing.
          </p>
          <h2
            id="mintos-coastal-heading"
            className="mt-4 text-balance text-xl font-black uppercase leading-[1.08] tracking-[0.04em] text-black sm:mt-5 sm:text-2xl sm:leading-[1.06] md:text-3xl lg:text-[2rem] lg:leading-[1.08] xl:text-[2.35rem]"
          >
            Mintos Properties is your trusted coastal Kenya partner.
          </h2>
          <div className="mt-6 w-full max-w-none space-y-3.5 text-sm leading-[1.65] text-zinc-600 sm:mt-7 sm:space-y-4 sm:leading-7 md:text-base md:leading-8">
            <p>
              Mintos Properties is rooted in Kenya&apos;s coastal region-Mombasa, Diani, Kilifi, and
              surrounding corridors-where oceanfront land, hospitality-driven growth, and
              residential demand come together. We help you evaluate shoreline plots, titled
              acreage, and homes with documentation you can trust.
            </p>
            <p>
              Whether you are buying a first home, selling a legacy asset, or building an investment
              portfolio, our advisors combine on-the-ground knowledge with a disciplined process so
              every decision reflects the realities of the coast-not generic templates from elsewhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

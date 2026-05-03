import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";

const CTA_BACKGROUND =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1777711829/about_us_sk1ws0.jpg";

export function FutureRealEstateCta() {
  return (
    <section className="relative flex min-h-[min(26rem,80svh)] w-full flex-col overflow-hidden border-y border-zinc-800/40 sm:min-h-[min(30rem,88svh)] md:min-h-[min(32rem,90svh)]">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={CTA_BACKGROUND}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/78 to-black/68"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/55" aria-hidden />
      </div>

      <div className="relative z-10 flex flex-1 items-center px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24 xl:px-16">
        <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-8 sm:gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
          <div className="min-w-0 max-w-3xl">
            <Send className="h-6 w-6 text-brand sm:h-7 sm:w-7" strokeWidth={1.75} aria-hidden />
            <p className="mt-5 text-xs font-semibold tracking-wide text-brand sm:mt-6 sm:text-sm">
              Client-Centric Approach
            </p>
            <h2 className="mt-3 text-balance text-2xl font-bold leading-[1.15] tracking-tight text-white sm:mt-4 sm:text-3xl sm:leading-tight md:text-4xl lg:text-5xl lg:leading-[1.1]">
              Let&apos;s Build the Future of Real Estate Together.
            </h2>
            <p className="mt-5 max-w-2xl text-pretty text-sm leading-7 text-zinc-200 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
              Whether you&apos;re looking to invest in premium properties or develop your own real
              estate portfolio, Mintos Properties Portfolio is here to guide you. With offices in
              Australia and the UAE, we offer localized support with a global perspective.
            </p>
          </div>

          <div className="w-full shrink-0 sm:w-auto lg:pb-1">
            <Link
              href="/contact"
              className="flex w-full min-h-12 items-center justify-center rounded-md border border-brand bg-brand px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[0.16em] text-white shadow-md transition hover:bg-brand/90 sm:inline-flex sm:min-h-0 sm:w-auto sm:px-8 sm:py-4 sm:tracking-[0.2em] md:text-sm"
            >
              Free consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

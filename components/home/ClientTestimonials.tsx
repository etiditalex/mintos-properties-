"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import type { PublicTestimonial } from "@/services/testimonialService";

const TESTIMONIAL_BG =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1777777958/testimonial_b6wemt.jpg";

/** Shown only when the database has no published testimonials yet */
const FALLBACK_TESTIMONIALS: PublicTestimonial[] = [
  {
    id: "fallback-1",
    name: "Kats Stafford",
    quote:
      "Everything about the selling process with Mintos Properties was professional and well executed. They took the stress out of selling my home. Their professionalism and guidance made it effortless — I would gladly recommend them to anyone looking for real estate services along the coast.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&q=80",
  },
  {
    id: "fallback-2",
    name: "James Omondi",
    quote:
      "From the first viewing to closing, the team understood what we needed for our family. Clear communication, sharp market insight, and genuine care for Diani and Kilifi buyers. Mintos made a complex decision feel straightforward.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&q=80",
  },
  {
    id: "fallback-3",
    name: "Sarah Mwangi",
    quote:
      "We invested in land with confidence because Mintos walked us through every step — title checks, pricing, and long-term growth along the corridor. I trust them for any future deal.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&q=80",
  },
];

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function AuthorPhoto({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-brand/50 ring-offset-2 ring-offset-transparent">
        {/* Dynamic URLs from admin — avoid next/image domain allowlist */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand/35 text-sm font-bold uppercase tracking-tight text-white ring-2 ring-brand/50 ring-offset-2 ring-offset-transparent"
      aria-hidden
    >
      {initialsFromName(name)}
    </div>
  );
}

type Props = {
  /** Published testimonials from Supabase; if empty, built-in samples are used */
  items?: PublicTestimonial[];
};

export function ClientTestimonials({ items = [] }: Props) {
  const list = useMemo(
    () => (items.length > 0 ? items : FALLBACK_TESTIMONIALS),
    [items],
  );

  const [index, setIndex] = useState(0);
  const total = list.length;

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((i) => (i === total - 1 ? 0 : i + 1));
  }, [total]);

  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, total - 1)));
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const id = window.setInterval(goNext, 9000);
    return () => window.clearInterval(id);
  }, [goNext, total]);

  const active = list[index] ?? list[0];

  if (!active) return null;

  return (
    <section className="relative isolate w-full overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0">
        <Image
          src={TESTIMONIAL_BG}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        {/* Light blur + softer tint so the photo stays visible while text stays readable */}
        <div className="absolute inset-0 backdrop-blur-md backdrop-saturate-110 sm:backdrop-blur-lg" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-[#0f172a]/55 to-black/60"
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand/[0.05]" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <h2 className="text-center text-xs font-bold uppercase tracking-[0.28em] text-white sm:text-sm">
          Client testimonials
        </h2>

        <div className="relative mt-10 sm:mt-12">
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/25 bg-black/30 p-2.5 text-white backdrop-blur-sm transition hover:border-brand/60 hover:bg-black/45 hover:text-brand md:flex md:items-center md:justify-center"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/25 bg-black/30 p-2.5 text-white backdrop-blur-sm transition hover:border-brand/60 hover:bg-black/45 hover:text-brand md:flex md:items-center md:justify-center"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.75} />
          </button>

          <div className="mx-auto w-full max-w-4xl px-0 text-center md:px-12">
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`star-${i}`}
                  className="h-6 w-6 fill-brand text-brand sm:h-7 sm:w-7"
                  aria-hidden
                />
              ))}
            </div>

            <blockquote className="mt-8 w-full text-pretty text-center text-base font-normal leading-relaxed tracking-normal text-white break-words sm:text-lg sm:leading-relaxed">
              &ldquo;{active.quote}&rdquo;
            </blockquote>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <AuthorPhoto name={active.name} image={active.image} />
              <p className="text-lg font-semibold tracking-tight text-white">{active.name}</p>
            </div>

            <div className="mt-8 flex justify-center gap-3 md:hidden">
              <button
                type="button"
                onClick={goPrev}
                className="rounded-full border border-white/25 bg-black/25 p-2.5 text-white backdrop-blur-sm transition hover:border-brand/60 hover:text-brand"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-full border border-white/25 bg-black/25 p-2.5 text-white backdrop-blur-sm transition hover:border-brand/60 hover:text-brand"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={1.75} />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {list.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-8 bg-brand" : "w-2 bg-white/35 hover:bg-white/55"
                  }`}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

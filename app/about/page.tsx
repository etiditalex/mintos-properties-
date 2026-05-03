import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Mintos Properties and our vision for premium real estate.",
};

const TONY_MINTOS_PORTRAIT =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1776763528/mandela_2_xvktej.jpg";

export default function AboutPage() {
  return (
    <section className="space-y-16 pb-8">
      <div className="relative">
        <div className="relative w-full overflow-hidden border-b border-zinc-100 bg-gradient-to-b from-white to-[#faf8f5] pb-10 text-black sm:pb-14 lg:pb-36">
          <div className="relative mx-auto flex min-h-[28rem] w-full max-w-7xl items-end px-4 pt-12 sm:min-h-[30rem] sm:px-6 sm:pt-16 lg:min-h-[34rem] lg:px-10 lg:pt-20">
            <div className="relative z-20 mx-auto max-w-2xl px-2 pb-6 text-center sm:pb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand sm:text-sm">
                Aiming To Be The Best
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-black sm:text-5xl lg:text-6xl">
                Making Better
                <br />
                Real Estate
                <br />
                Decisions
              </h1>
              <div className="mx-auto mt-6 h-[2px] w-14 bg-brand" />
              <p className="mx-auto mt-6 max-w-xl text-base font-semibold text-zinc-800 sm:text-xl lg:text-2xl">
                Introducing Mintos Properties Portfolio.
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
                We guide buyers, sellers, and investors across Mombasa, Diani, Kilifi, and nearby growth corridors with trusted local insight.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-30 mt-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:translate-y-[calc(100%-40px)]">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid overflow-hidden border border-zinc-200 bg-white shadow-xl lg:grid-cols-5">
              <article className="border-b border-zinc-200 bg-[#faf8f5] p-6 lg:col-span-2 lg:border-b-0 lg:border-r">
                <p className="text-xl font-medium leading-none text-zinc-900 lg:text-2xl">Build Your Dream</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight text-zinc-950 lg:text-5xl">
                  10 Years Of Undefeated Success
                </h2>
                <p className="mt-5 max-w-md text-lg leading-8 text-zinc-800">
                  Founded by Mintos Properties industry veterans, we bring decades of
                  expertise in residential and commercial properties across Kenya&apos;s
                  most promising growth corridors.
                </p>
                <button
                  type="button"
                  className="mt-6 bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Work With Us
                </button>
              </article>

              <div className="grid sm:grid-cols-2 lg:col-span-3 lg:grid-cols-2">
                <article className="border-b border-zinc-200 p-6 lg:border-r">
                  <p className="text-4xl font-semibold leading-none text-zinc-950 lg:text-5xl">512+</p>
                  <p className="mt-3 max-w-[12rem] text-xl leading-7 text-zinc-800 lg:text-2xl">
                    Successfully Project Finished.
                  </p>
                </article>
                <article className="border-b border-zinc-200 p-6">
                  <p className="text-4xl font-semibold leading-none text-zinc-950 lg:text-5xl">10+</p>
                  <p className="mt-3 max-w-[12rem] text-xl leading-7 text-zinc-800 lg:text-2xl">
                    Years of experience with proud.
                  </p>
                </article>
                <article className="border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r">
                  <p className="text-4xl font-semibold leading-none text-zinc-950 lg:text-5xl">1120+</p>
                  <p className="mt-3 max-w-[12rem] text-xl leading-7 text-zinc-800 lg:text-2xl">
                    Revenue in 2017 investment
                  </p>
                </article>
                <article className="p-6">
                  <p className="text-4xl font-semibold leading-none text-zinc-950 lg:text-5xl">1520+</p>
                  <p className="mt-3 max-w-[12rem] text-xl leading-7 text-zinc-800 lg:text-2xl">
                    Colleagues &amp; counting more daily
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-16 px-4 pt-10 sm:px-6 sm:pt-12 lg:px-10 lg:pt-32">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-brand">About Us</p>
          <h2 className="text-4xl font-semibold">A Real Estate Advisory Built on Trust</h2>
          <p className="max-w-3xl text-zinc-700">
            Mintos Properties is a premium real estate practice focused on curation,
            market intelligence, and transaction excellence for private clients and
            institutional investors.
          </p>
        </div>

        <div className="h-[50px]" aria-hidden />
      </div>

      {/* Same horizontal alignment as header / services — no w-screen breakout */}
      <section className="w-full overflow-hidden border-y border-zinc-100 bg-[#faf8f5] text-zinc-900">
        <div className="mx-auto grid min-h-[22rem] max-w-7xl lg:min-h-[28rem] lg:grid-cols-[1.6fr_1fr]">
          <div className="flex items-center px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-semibold leading-tight text-black sm:text-3xl lg:text-4xl">
                I&apos;m Tony Mintos,
                <br />
                Real Estate Consultant
              </h3>
              <div className="mt-4 h-[2px] w-full max-w-xl bg-brand" />
              <p className="mt-6 text-base leading-7 text-zinc-600 sm:mt-8 sm:text-lg sm:leading-8">
                Meet Tony Mintos, your trusted real estate partner. Whether you&apos;re buying,
                selling, or investing, Tony Mintos is here to ensure a seamless and rewarding
                experience for you. With extensive industry knowledge and a proven track
                record of satisfied clients, rest assured your property goals are in
                capable hands.
              </p>
              <p className="mt-6 text-lg font-semibold text-black sm:text-xl">Tony Mintos</p>
              <p className="text-base text-zinc-600 sm:text-lg">CEO and Founder of Mintos Properties</p>
            </div>
          </div>

          <div className="relative min-h-[18rem] sm:min-h-[22rem] lg:min-h-full">
            <Image
              src={TONY_MINTOS_PORTRAIT}
              alt="Tony Mintos standing in office"
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <section className="rounded-2xl bg-zinc-100 px-6 py-10 sm:px-10 sm:py-12 lg:px-16">
          <div className="mx-auto max-w-5xl space-y-6">
            <p className="text-2xl font-medium leading-tight text-zinc-900 sm:text-3xl">
              As a seasoned professional with a diverse background in property
              management, real estate, facility coordination, and sales, Tony Mintos has
              cultivated a deep passion for the real estate industry.
            </p>
            <p className="text-lg leading-8 text-zinc-700 sm:text-2xl sm:leading-10">
              In addition to his expertise in property management, Tony Mintos brings over
              10 years of sales experience across various industries. This background
              has granted him invaluable insights into customer behavior, effective
              communication strategies, and the art of building lasting client
              relationships.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}

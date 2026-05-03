import { Building2, Eye, LayoutGrid, LineChart } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Real Estate Due Diligence",
    description:
      "Structured reviews of title, compliance, and physical condition so you can transact with clarity.",
  },
  {
    icon: LayoutGrid,
    title: "Portfolio Services",
    description:
      "Acquisition, disposition, and balance-sheet planning aligned to your growth and risk targets.",
  },
  {
    icon: LineChart,
    title: "Real Estate Market Studies",
    description:
      "Demand drivers, pricing trends, and submarket benchmarks tailored to institutional and private clients.",
  },
  {
    icon: Eye,
    title: "Real Estate Valuation Services",
    description:
      "Independent, evidence-backed opinions of value for financing, reporting, and negotiation support.",
  },
] as const;

export function PortfolioServicesBand() {
  return (
    <section className="w-full border-y border-zinc-100 bg-[#faf8f5] px-4 py-9 sm:px-6 sm:py-12 lg:px-10 lg:py-14 xl:px-12">
      <div className="grid w-full gap-6 sm:gap-8 lg:min-h-[min(100vh,40rem)] lg:grid-cols-[minmax(0,38%)_minmax(0,1fr)] lg:gap-10 lg:gap-x-12">
        <div className="flex flex-col justify-center border border-zinc-100 bg-white px-5 py-10 shadow-sm sm:px-8 sm:py-14 lg:px-12 lg:py-20 xl:px-14">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-muted sm:text-xs sm:tracking-[0.28em]">
            Advisory
          </p>
          <h2 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight text-black sm:mt-4 sm:text-3xl md:text-4xl lg:text-[2.35rem] lg:leading-[1.12]">
            Mintos Properties Portfolio
          </h2>
          <p className="mt-5 max-w-md text-pretty text-sm leading-7 text-zinc-600 sm:mt-6 sm:text-base sm:leading-8">
            We pair on-the-ground execution in Kenya with institutional-grade research and
            documentation—so every mandate is supported from first conversation through closing.
          </p>
        </div>

        <div className="px-0 pb-0 pt-2 text-zinc-800 sm:px-2 sm:pt-4 lg:flex lg:items-center lg:px-2 lg:py-6 xl:px-4">
          <div className="grid w-full gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:gap-x-12 lg:gap-y-14">
            {services.map(({ icon: Icon, title, description }) => (
              <div key={title} className="min-w-0 max-w-sm">
                <Icon className="h-6 w-6 text-brand sm:h-7 sm:w-7" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-4 text-base font-semibold leading-snug text-black sm:mt-5 sm:text-lg">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm leading-7 text-zinc-600 sm:mt-3">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

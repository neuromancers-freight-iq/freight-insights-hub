import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Anchor,
  ArrowRight,
  BarChart3,
  Compass,
  Database,
  LineChart,
  Radar,
  Ship,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { AppShell } from "@/components/freightiq/AppShell";
import { ChartLegend, ForecastChart } from "@/components/freightiq/ForecastChart";
import {
  Delta,
  Meter,
  Panel,
  StatCard,
  Tag,
  formatInr,
  formatInrRate,
} from "@/components/freightiq/primitives";
import { getMarketData } from "@/lib/freightiq/services";
import { INR_RATE } from "@/lib/freightiq/mock-data";
import { cn } from "@/lib/utils";

const Globe = lazy(() => import("@/components/freightiq/Globe"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreightIQ — Maritime Freight Intelligence Dashboard" },
      {
        name: "description",
        content:
          "AI-powered freight forecasting, voyage economics and vessel recommendations for bulk cargo chartering to East Coast India.",
      },
      { property: "og:title", content: "FreightIQ — Maritime Freight Intelligence" },
      {
        property: "og:description",
        content:
          "Predict freight rates, choose the right vessel, and charter smarter with FreightIQ.",
      },
    ],
  }),
  component: Homepage,
});

/* ── Route options for the forecast preview ── */
const PREVIEW_ROUTES = [
  { label: "Newcastle → Paradip", origin: "Newcastle", destination: "Paradip" },
  { label: "Newcastle → Visakhapatnam", origin: "Newcastle", destination: "Visakhapatnam" },
  { label: "Newcastle → Haldia", origin: "Newcastle", destination: "Haldia" },
  { label: "Newcastle → Chennai", origin: "Newcastle", destination: "Chennai" },
] as const;

/* ── Vessel class data for the feasibility preview ── */
const VESSEL_CLASSES_PREVIEW = [
  { name: "Handysize", dwt: "25–40K", icon: "▪" },
  { name: "Supramax", dwt: "45–60K", icon: "◆" },
  { name: "Panamax", dwt: "75–85K", icon: "●" },
  { name: "Capesize", dwt: "140–180K", icon: "⬟" },
] as const;

/* ── Intelligence suite cards ── */
const SUITE_CARDS = [
  {
    to: "/market-intelligence",
    icon: Radar,
    title: "Market Intelligence",
    body: "Monitor freight rates, fuel prices, port congestion, tonnage supply and cargo demand across Australia / South Africa to India trades.",
    cta: "Explore Market Intelligence",
  },
  {
    to: "/recommendations",
    icon: Sparkles,
    title: "AI Recommendations",
    body: "Compare chartering scenarios across cargo, route, vessel class and risk — with ranked recommendations and explainable reasoning.",
    cta: "View Recommendations",
  },
  {
    to: "/data-analytics",
    icon: Database,
    title: "Data & Analytics",
    body: "Explore the underlying freight data, port infrastructure, vessel benchmarks and market signals powering every FreightIQ analysis.",
    cta: "Explore Data",
  },
] as const;

/* ════════════════════════════════════════════════════════
   HOMEPAGE
   ════════════════════════════════════════════════════════ */
function Homepage() {
  const [selectedRoute, setSelectedRoute] = useState(0);
  const { data } = useQuery({
    queryKey: ["market-data", 30],
    queryFn: () => getMarketData(30),
  });

  const route = PREVIEW_ROUTES[selectedRoute]!;

  return (
    <AppShell>
      {/* ── A. HERO ── */}
      <section className="relative mb-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Left: Copy */}
          <div className="relative z-10 max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Anchor className="size-3.5" /> Maritime Intelligence Platform
            </p>
            <h1 className="font-display text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.12] tracking-tight">
              Predict Freight Rates.{" "}
              <span className="text-primary">Choose the Right Vessel.</span>{" "}
              Charter Smarter.
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              FreightIQ combines freight-market signals, historical data, vessel
              constraints and voyage economics into a single intelligence platform —
              so you can make faster, smarter chartering decisions for bulk cargo to
              India's East Coast.
            </p>
            <div className="mt-12 flex flex-nowrap items-center gap-3">
              <Link
                to="/forecast"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
              >
                <LineChart className="size-5" />
                Explore Freight Forecast
              </Link>

              <Link
                to="/voyage-planner"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised"
              >
                <Compass className="size-4" />
                Plan a Voyage
              </Link>

              <Link
                to="/vessel-feasibility"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised"
              >
                <Compass className="size-4" />
                Vessel Feasibility
              </Link>
            </div>
          </div>

          {/* Right: Globe */}
          <div className="relative flex items-center justify-center">
            <Suspense
              fallback={
                <div className="aspect-square w-full max-w-[460px] rounded-full bg-gradient-to-br from-primary/10 via-surface to-background" />
              }
            >
              <Globe className="w-full max-w-[460px]" />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ── B. FREIGHT FORECAST — DOMINANT ── */}
      <section className="mb-16">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Primary Feature
            </p>
            <h2 className="font-display text-2xl font-semibold md:text-[30px] md:leading-tight">
              Freight Rate Forecast
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Historical rates with AI-projected continuation and confidence interval
              for bulk cargo routes to India.
            </p>
          </div>
          <Link
            to="/forecast"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View Detailed Forecast <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Route selector */}
        <div className="mb-4 flex flex-wrap items-center gap-1 rounded-lg border border-border bg-surface/70 p-1">
          {PREVIEW_ROUTES.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setSelectedRoute(i)}
              className={cn(
                "rounded-md px-3 py-2 text-xs font-medium transition-colors",
                selectedRoute === i
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          {/* Chart */}
          <Panel
            title={`${route.origin} → ${route.destination}`}
            description="30-day historical with AI forecast and confidence band"
            action={<Tag tone="info">₹ / MT</Tag>}
          >
            <ForecastChart data={data?.trend ?? []} height={380} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <ChartLegend />
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Simulated forecast
              </span>
            </div>
          </Panel>

          {/* Key metrics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <StatCard
              label="Forecasted Route Rate"
              value={data ? `₹${Math.round(data.routeRate.rate * INR_RATE).toLocaleString("en-IN")}` : "—"}
              unit="/ MT"
              caption={`${route.origin} → ${route.destination} · next period`}
              icon={<TrendingUp className="size-4" />}
              accent
            />
            <StatCard
              label="Forecast Confidence"
              value={data ? `${data.confidence}%` : "—"}
              caption={data && data.confidence >= 85 ? "High confidence · 30-day horizon" : "Moderate confidence · 30-day horizon"}
              footer={<Meter value={data?.confidence ?? 0} tone="success" />}
            />
            <StatCard
              label="Market Direction"
              value={data && data.index.changePct > 3 ? "Bullish" : data && data.index.changePct > 0 ? "Moderate" : "Neutral"}
              caption={data ? `${data.index.changePct >= 0 ? "+" : ""}${data.index.changePct}% change` : "—"}
              footer={data ? <Delta value={data.index.changePct} /> : null}
            />
            <div className="flex items-end">
              <Link
                to="/forecast"
                className="group flex w-full items-center justify-between rounded-xl border border-primary/30 bg-primary/[0.06] px-5 py-4 transition-all hover:border-primary/50 hover:bg-primary/10"
              >
                <span>
                  <span className="block text-sm font-semibold">View Detailed Forecast</span>
                  <span className="block text-xs text-muted-foreground">
                    Configure cargo, route, vessel & horizon
                  </span>
                </span>
                <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── C. VOYAGE PLANNER + VESSEL FEASIBILITY ── */}
      <section className="mb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Voyage Planner */}
          <div className="panel group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong lg:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-chart-2/8 blur-3xl" />
            <div className="relative">
              <span className="mb-4 grid size-11 place-items-center rounded-xl border border-chart-2/30 bg-chart-2/10 text-chart-2">
                <Compass className="size-5" strokeWidth={1.8} />
              </span>
              <h3 className="font-display text-xl font-semibold">Voyage Intelligence</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Analyze the economics of a voyage before you charter — distance, duration,
                bunker consumption and total cost in ₹.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  "Cargo & Quantity",
                  "Origin → Destination",
                  "Vessel Type & Speed",
                  "Fuel Cost & Laytime",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-border bg-surface/50 px-3 py-2.5 text-xs text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-surface/60 px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">Sample output</p>
                  <p className="num mt-0.5 text-lg font-semibold">₹1.53 Cr</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Freight cost</p>
                  <p className="num mt-0.5 text-sm font-semibold">₹2,041 / MT</p>
                </div>
              </div>

              <Link
                to="/voyage-planner"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Open Voyage Planner <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Vessel Feasibility */}
          <div className="panel group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong lg:p-8">
            <div className="pointer-events-none absolute -left-20 -top-20 size-48 rounded-full bg-chart-3/8 blur-3xl" />
            <div className="relative">
              <span className="mb-4 grid size-11 place-items-center rounded-xl border border-chart-3/30 bg-chart-3/10 text-chart-3">
                <Ship className="size-5" strokeWidth={1.8} />
              </span>
              <h3 className="font-display text-xl font-semibold">Vessel Recommendation</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Find the vessel class that actually fits the cargo and route —
                scored by capacity, draft, port constraints and operational feasibility.
              </p>

              <div className="mt-6 space-y-2.5">
                {VESSEL_CLASSES_PREVIEW.map((v) => (
                  <div
                    key={v.name}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-2.5 transition-colors hover:border-border-strong"
                  >
                    <span className="flex items-center gap-3">
                      <Ship className="size-4 text-primary/70" />
                      <span className="text-sm font-medium">{v.name}</span>
                    </span>
                    <span className="num text-xs text-muted-foreground">{v.dwt} DWT</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Evaluated on cargo capacity, port compatibility, draft clearance,
                voyage economics and availability.
              </p>

              <Link
                to="/vessel-feasibility"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Evaluate Vessel <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── D. INTELLIGENCE SUITE ── */}
      <section className="mb-16">
        <div className="mb-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
            Advanced Capabilities
          </p>
          <h2 className="font-display text-xl font-semibold md:text-2xl">
            FreightIQ Intelligence Suite
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {SUITE_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="panel group flex flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30"
            >
              <span className="mb-4 grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <card.icon className="size-5" strokeWidth={1.8} />
              </span>
              <h3 className="font-display text-[15px] font-semibold">{card.title}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                {card.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                {card.cta} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── E. CLOSING CTA + PROTOTYPE DISCLAIMER ── */}
      <section className="mb-4">
        <div className="panel relative overflow-hidden px-6 py-10 text-center md:px-12 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-chart-2/[0.04]" />
          <div className="relative">
            <h2 className="font-display text-xl font-semibold md:text-2xl">
              Make smarter chartering decisions with{" "}
              <span className="text-primary">FreightIQ</span>.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              From freight rate prediction to vessel recommendation — one platform
              for every chartering decision.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/forecast"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
              >
                <LineChart className="size-4" />
                Start Forecasting
              </Link>
              <Link
                to="/voyage-planner"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised"
              >
                <Compass className="size-4" />
                Plan a Voyage
              </Link>
              
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground/60">
          Prototype — figures shown use simulated demo data and are intended to
          demonstrate the FreightIQ decision workflow.
        </p>
      </section>
    </AppShell>
  );
}

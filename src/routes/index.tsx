import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Fuel,
  Gauge,
  Ship,
  TrendingUp,
  Waves,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/freightiq/AppShell";
import { ChartLegend, ForecastChart } from "@/components/freightiq/ForecastChart";
import {
  AiInsight,
  Delta,
  DemoTag,
  Meter,
  Panel,
  StatCard,
  Tag,
} from "@/components/freightiq/primitives";
import { getMarketData } from "@/lib/freightiq/services";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreightIQ — Maritime Freight Intelligence Dashboard" },
      {
        name: "description",
        content:
          "Monitor bulk freight market conditions, forecast rates and evaluate voyage economics for East Coast India chartering decisions.",
      },
      { property: "og:title", content: "FreightIQ — Maritime Freight Intelligence" },
      {
        property: "og:description",
        content:
          "AI-powered freight forecasting, voyage feasibility and chartering recommendations for bulk cargo.",
      },
    ],
  }),
  component: Dashboard,
});

const RANGES = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
  { label: "1 Year", days: 180 },
];

const SIGNAL_ICONS = [TrendingUp, Waves, Fuel, Ship];

function Dashboard() {
  const [range, setRange] = useState(30);
  const { data } = useQuery({
    queryKey: ["market-data", range],
    queryFn: () => getMarketData(range),
  });

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Good Evening, Chartering Desk</p>
        <h1 className="mt-2 text-2xl font-semibold md:text-[36px] md:leading-tight">
          Maritime Freight Intelligence
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-[15px]">
          Monitor market conditions, analyze voyage economics, and make smarter chartering
          decisions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Freight Market Index"
          value={data?.index.value.toLocaleString() ?? "—"}
          caption="Baltic Freight Indicator"
          icon={<Activity className="size-4" />}
          footer={data ? <Delta value={data.index.changePct} /> : null}
        />
        <StatCard
          label="Forecasted Route Rate"
          value={data ? `$${data.routeRate.rate.toFixed(1)}` : "—"}
          unit="/ MT"
          caption="Australia → India · next period"
          icon={<TrendingUp className="size-4" />}
          accent
        />
        <StatCard
          label="Market Volatility"
          value={data?.volatility.label ?? "—"}
          caption="Composite of rate, fuel and congestion variance"
          icon={<Gauge className="size-4" />}
          footer={<Meter value={data?.volatility.score ?? 0} tone="warning" />}
        />
        <StatCard
          label="Recommendation Confidence"
          value={data ? `${data.confidence}%` : "—"}
          caption="High confidence · 30-day horizon"
          icon={<Ship className="size-4" />}
          footer={<Meter value={data?.confidence ?? 0} tone="success" />}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Panel
          title="Freight Market Trend & Forecast"
          description="Historical rates with AI-projected continuation and confidence interval"
          action={
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-surface/70 p-1">
              {RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setRange(r.days)}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                    range === r.days
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          }
        >
          <ForecastChart data={data?.trend ?? []} height={330} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <ChartLegend />
            <DemoTag label="Simulated Forecast" />
          </div>
        </Panel>

        <div className="space-y-6">
          <AiInsight
            footer={
              <Link
                to="/forecast"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                Open freight forecasting <ArrowRight className="size-3.5" />
              </Link>
            }
          >
            {data?.insight}
          </AiInsight>

          <Panel title="Active Market Signals" description="Live indicators feeding the models">
            <ul className="space-y-3">
              {data?.signals.map((s, i) => {
                const Icon = SIGNAL_ICONS[i % SIGNAL_ICONS.length];
                const tone =
                  s.tone === "positive"
                    ? "positive"
                    : s.tone === "warning"
                      ? "warning"
                      : s.tone === "critical"
                        ? "critical"
                        : "neutral";
                return (
                  <li
                    key={s.id}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface/50 p-3 transition-colors hover:border-border-strong"
                  >
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary/70 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{s.title}</p>
                        <Tag tone={tone as never}>{s.level}</Tag>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {s.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Top Routes" description="Rate movement across monitored lanes">
          <ul className="space-y-3">
            {data?.heatmap.slice(0, 4).map((r) => (
              <li key={r.route} className="flex items-center justify-between gap-3">
                <span className="truncate text-sm text-muted-foreground">{r.route}</span>
                <span className="flex items-center gap-3">
                  <span className="num text-sm font-semibold">${r.rate.toFixed(1)}</span>
                  <Delta value={r.change7d} />
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Discharge Port Watch" description="Average waiting time, East Coast India">
          <ul className="space-y-4">
            {data?.congestion.slice(0, 4).map((c) => (
              <li key={c.port}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{c.port}</span>
                  <span className="num font-semibold">{c.waitingDays.toFixed(1)} d</span>
                </div>
                <Meter
                  value={(c.waitingDays / 6) * 100}
                  tone={c.waitingDays > 4 ? "destructive" : c.waitingDays > 2.5 ? "warning" : "success"}
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Decision Shortcuts"
          description="Jump straight into an analysis workflow"
          bodyClassName="p-4"
        >
          <div className="grid gap-2">
            {[
              { to: "/voyage-planner", label: "Analyze a voyage", hint: "Cost, duration, fuel" },
              { to: "/vessel-feasibility", label: "Evaluate a vessel", hint: "Draft & capacity fit" },
              { to: "/recommendations", label: "Compare charter options", hint: "Ranked scenarios" },
            ].map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group flex items-center justify-between rounded-xl border border-border bg-surface/50 px-4 py-3 transition-all hover:border-primary/35 hover:bg-primary/[0.06]"
              >
                <span>
                  <span className="block text-sm font-medium">{s.label}</span>
                  <span className="block text-xs text-muted-foreground">{s.hint}</span>
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <AlertTriangle className="size-3.5 text-warning" />
        Prototype analysis — all figures shown are simulated demo data pending live market feeds.
      </p>
    </AppShell>
  );
}

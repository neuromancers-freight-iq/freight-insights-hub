import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Anchor, Flame, Ship } from "lucide-react";
import { AppShell } from "@/components/freightiq/AppShell";
import {
  DemoTag,
  Delta,
  PageHeader,
  Panel,
  StatCard,
  Tag,
} from "@/components/freightiq/primitives";
import { getMarketData } from "@/lib/freightiq/services";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/market-intelligence")({
  head: () => ({
    meta: [
      { title: "Market Intelligence — FreightIQ" },
      {
        name: "description",
        content:
          "Freight rates, bunker prices, port congestion, vessel availability and cargo demand across Australia–India bulk routes.",
      },
      { property: "og:title", content: "Market Intelligence — FreightIQ" },
      {
        property: "og:description",
        content: "Live-style market heatmap and signals for dry bulk chartering decisions.",
      },
    ],
  }),
  component: MarketIntelligencePage,
});

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

function ChartBox({ children, height = 240 }: { children: React.ReactElement; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function tooltipStyle() {
  return {
    contentStyle: {
      background: "var(--color-card)",
      border: "1px solid var(--color-border)",
      borderRadius: 12,
      fontSize: 12,
    },
    labelStyle: { color: "var(--color-muted-foreground)" },
  } as const;
}

function MarketIntelligencePage() {
  const { data } = useQuery({ queryKey: ["market-data", 30], queryFn: () => getMarketData(30) });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Market Intelligence"
        title="Dry Bulk Market Overview"
        subtitle="Freight rates, fuel, congestion, tonnage supply and cargo demand across the Australia / South Africa to East Coast India trades."
        actions={<DemoTag />}
      />

      {!data ? (
        <div className="panel h-64 animate-pulse" />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label={data.index.name}
              value={data.index.value.toLocaleString()}
              caption="Composite dry bulk index"
              footer={<Delta value={data.index.changePct} />}
              icon={<Activity className="size-4" />}
              accent
            />
            <StatCard
              label="Benchmark Route"
              value={`$${data.routeRate.rate}`}
              unit="/ MT"
              caption={data.routeRate.route}
              icon={<Ship className="size-4" />}
            />
            <StatCard
              label="VLSFO Singapore"
              value={`$${data.fuel[data.fuel.length - 1]?.vlsfo ?? 0}`}
              unit="/ MT"
              caption="Bunker benchmark, last 6 weeks"
              icon={<Flame className="size-4" />}
            />
            <StatCard
              label="Avg. Port Waiting"
              value={(
                data.congestion.reduce((a, c) => a + c.waitingDays, 0) / data.congestion.length
              ).toFixed(1)}
              unit="days"
              caption="Across tracked load & discharge ports"
              icon={<Anchor className="size-4" />}
            />
          </div>

          <Panel
            title="Market Heatmap"
            description="Route-level rate, momentum and directional signal"
            action={<DemoTag label="Simulated" />}
            bodyClassName="p-0"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Route</th>
                    <th className="px-4 py-3 font-medium">Current Rate</th>
                    <th className="px-4 py-3 font-medium">7-Day Change</th>
                    <th className="px-4 py-3 font-medium">30-Day Trend</th>
                    <th className="px-4 py-3 font-medium">Volatility</th>
                    <th className="px-5 py-3 font-medium">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {data.heatmap.map((r) => (
                    <tr key={r.route} className="border-b border-border/70 transition-colors hover:bg-secondary/40">
                      <td className="px-5 py-4 font-medium">{r.route}</td>
                      <td className="num px-4 py-4">${r.rate.toFixed(2)} / MT</td>
                      <td className="px-4 py-4"><Delta value={r.change7d} /></td>
                      <td className="px-4 py-4"><Spark values={r.trend30d} up={r.change7d >= 0} /></td>
                      <td className="px-4 py-4">
                        <Tag tone={r.volatility === "High" ? "critical" : r.volatility === "Medium" ? "warning" : "positive"}>
                          {r.volatility}
                        </Tag>
                      </td>
                      <td className="px-5 py-4">
                        <Tag tone={r.signal === "Bullish" ? "positive" : r.signal === "Bearish" ? "critical" : "neutral"}>
                          {r.signal}
                        </Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Fuel Prices" description="VLSFO vs MGO, $ / MT">
              <ChartBox>
                <LineChart data={data.fuel} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" {...axis} />
                  <YAxis {...axis} domain={["dataMin - 30", "dataMax + 20"]} />
                  <Tooltip {...tooltipStyle()} />
                  <Line type="monotone" dataKey="vlsfo" name="VLSFO" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="mgo" name="MGO" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartBox>
            </Panel>

            <Panel title="Port Congestion" description="Average waiting time in days">
              <ChartBox>
                <BarChart data={data.congestion} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="port" {...axis} />
                  <YAxis {...axis} />
                  <Tooltip {...tooltipStyle()} cursor={{ fill: "var(--color-secondary)", opacity: 0.4 }} />
                  <Bar dataKey="waitingDays" name="Waiting days" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartBox>
            </Panel>

            <Panel title="Vessel Availability" description="Open tonnage vs demand index by class">
              <ul className="space-y-4">
                {data.availability.map((a) => (
                  <li key={a.class}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span>{a.class}</span>
                      <span className="num text-xs text-muted-foreground">
                        {a.openVessels} open · demand {a.demandIndex}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${a.openVessels}%` }} />
                      </div>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-chart-3" style={{ width: `${a.demandIndex}%` }} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Left bar: open vessels · right bar: demand index
              </p>
            </Panel>

            <Panel title="Cargo Demand" description="Enquiry volume index by commodity">
              <ChartBox>
                <BarChart data={data.demand} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" {...axis} />
                  <YAxis {...axis} />
                  <Tooltip {...tooltipStyle()} cursor={{ fill: "var(--color-secondary)", opacity: 0.4 }} />
                  <Bar dataKey="coal" name="Coal" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ironOre" name="Iron Ore" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="steel" name="Steel" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartBox>
            </Panel>
          </div>

          <Panel title="Latest Market Signals" description="Automated reads from the demo dataset">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {data.signals.map((s) => (
                <div key={s.id} className="rounded-xl border border-border bg-surface/60 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{s.title}</p>
                    <Tag tone={s.tone === "positive" ? "positive" : s.tone === "warning" ? "warning" : s.tone === "critical" ? "critical" : "neutral"}>
                      {s.level}
                    </Tag>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </AppShell>
  );
}

function Spark({ values, up }: { values: number[]; up: boolean }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 96 + 2},${26 - ((v - min) / span) * 22}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-7 w-24">
      <polyline
        points={pts}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className={cn(up ? "stroke-success" : "stroke-destructive")}
      />
    </svg>
  );
}

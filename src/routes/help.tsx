import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Compass, Database, LineChart, Radar, Ship, Sparkles } from "lucide-react";
import { AppShell } from "@/components/freightiq/AppShell";
import { DemoTag, PageHeader, Panel } from "@/components/freightiq/primitives";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Documentation — FreightIQ" },
      {
        name: "description",
        content: "How FreightIQ forecasts freight, scores vessels and builds chartering recommendations.",
      },
      { property: "og:title", content: "Help & Documentation — FreightIQ" },
      {
        property: "og:description",
        content: "Guide to forecasting, voyage planning, vessel recommendation and market intelligence.",
      },
    ],
  }),
  component: HelpPage,
});

const GUIDE = [
  {
    to: "/forecast",
    icon: LineChart,
    title: "Freight Forecast",
    body: "Project rate direction for a cargo, route and horizon, with a confidence range and the drivers behind the move.",
  },
  {
    to: "/voyage-planner",
    icon: Compass,
    title: "Voyage Planner",
    body: "Estimate distance, duration, bunker burn and total voyage cost, broken down per tonne.",
  },
  {
    to: "/vessel-feasibility",
    icon: Ship,
    title: "Vessel Recommendation",
    body: "Give the route, cargo, quantity and laycan — every vessel class is scored and the best one is recommended for you.",
  },
  {
    to: "/market-intelligence",
    icon: Radar,
    title: "Market Intelligence",
    body: "Rates, bunkers, congestion, tonnage supply and demand, plus a route-level heatmap and signals.",
  },
  {
    to: "/recommendations",
    icon: Sparkles,
    title: "Recommendations",
    body: "Compare complete chartering scenarios and read the reasoning behind the recommended strategy.",
  },
  {
    to: "/data-analytics",
    icon: Database,
    title: "Data & Analytics",
    body: "Browse and export the freight, port, vessel and signal datasets used across the platform.",
  },
] as const;

function HelpPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Documentation"
        title="Help & Documentation"
        subtitle="A short guide to each workspace and how the scoring works."
        actions={<DemoTag label="Prototype" />}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GUIDE.map((g) => (
          <Link
            key={g.to}
            to={g.to}
            className="panel group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35"
          >
            <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <g.icon className="size-5" strokeWidth={1.9} />
            </span>
            <p className="font-display mt-4 text-base font-semibold">{g.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.body}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="How scoring works" description="Vessel recommendation weighting">
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Cargo capacity fit — how closely the parcel matches the class (30%).</li>
            <li>Port compatibility — laden arrival draft against the discharge berth limit (25%).</li>
            <li>Voyage economics — indicative freight per tonne for the route (22%).</li>
            <li>Availability and waiting — congestion at both ends plus tonnage scarcity (13%).</li>
            <li>Contract duration fit — suitability for single voyage vs period business (10%).</li>
          </ul>
        </Panel>

        <Panel title="About the data" description="Prototype disclosure">
          <div className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              All figures shown across FreightIQ are simulated for demonstration. Ports, distances and
              vessel benchmarks are realistic, but rates, congestion and forecasts are generated. The
              service layer mirrors the future API contract, so live data can be connected without any
              change to the screens.
            </p>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

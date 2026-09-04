import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LineChart, Sparkles } from "lucide-react";
import { AppShell } from "@/components/freightiq/AppShell";
import { ChartLegend, ForecastChart } from "@/components/freightiq/ForecastChart";
import {
  AiInsight,
  AiLoading,
  DemoTag,
  EmptyState,
  Field,
  Meter,
  PageHeader,
  Panel,
  StatCard,
  Tag,
} from "@/components/freightiq/primitives";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CARGO_TYPES,
  DESTINATION_PORTS,
  ORIGIN_PORTS,
  VESSEL_CLASSES,
} from "@/lib/freightiq/mock-data";
import { postForecast } from "@/lib/freightiq/services";
import type { CargoType, ForecastResult, Horizon, VesselClass } from "@/lib/freightiq/types";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Freight Rate Forecasting — FreightIQ" },
      {
        name: "description",
        content:
          "AI-generated bulk freight rate projections with confidence bands, key drivers and model explanations.",
      },
      { property: "og:title", content: "Freight Rate Forecasting — FreightIQ" },
      {
        property: "og:description",
        content: "Forecast bulk freight rates by cargo, route, vessel class and horizon.",
      },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const [cargo, setCargo] = useState<CargoType>("Coal");
  const [origin, setOrigin] = useState("Newcastle");
  const [destination, setDestination] = useState("Paradip");
  const [vessel, setVessel] = useState<VesselClass>("Panamax");
  const [horizon, setHorizon] = useState<Horizon>("30D");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForecastResult | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    const res = await postForecast({ cargo, origin, destination, vessel, horizon });
    setResult(res);
    setLoading(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Predictive Engine"
        title="Freight Rate Forecasting"
        subtitle="Analyze historical trends and AI-generated freight rate projections across monitored bulk lanes."
        actions={<DemoTag label="Simulated Forecast" />}
      />

      <Panel
        title="Forecast Configuration"
        description="Select the trade parameters to model"
        className="mb-6"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Cargo Type">
            <Select value={cargo} onValueChange={(v) => setCargo(v as CargoType)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CARGO_TYPES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Origin Port">
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ORIGIN_PORTS.map((p) => (
                  <SelectItem key={p.code} value={p.name}>{p.name}, {p.country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Destination Port" hint="East Coast India">
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DESTINATION_PORTS.map((p) => (
                  <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Vessel Category">
            <Select value={vessel} onValueChange={(v) => setVessel(v as VesselClass)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {VESSEL_CLASSES.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Forecast Horizon">
            <div className="flex gap-2">
              {(["7D", "30D", "90D"] as Horizon[]).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors " +
                    (horizon === h
                      ? "border-primary/45 bg-primary/12 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground")
                  }
                >
                  {h === "7D" ? "7 Days" : h === "30D" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>
          </Field>
          <div className="flex items-end">
            <Button size="lg" className="w-full" onClick={run} disabled={loading}>
              <Sparkles className="size-4" /> Generate AI Forecast
            </Button>
          </div>
        </div>
      </Panel>

      {loading ? (
        <AiLoading
          steps={[
            "Analyzing market signals…",
            "Processing historical freight data…",
            "Modelling fuel and congestion effects…",
            "Generating forecast distribution…",
          ]}
        />
      ) : !result ? (
        <EmptyState
          icon={<LineChart className="size-8" />}
          title="No forecast generated yet"
          description="Configure the cargo, route, vessel class and horizon above, then run the AI forecast to see projected rates and drivers."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Predicted Freight Rate"
              value={`$${result.rate.toFixed(2)}`}
              unit="/ MT"
              caption={`${origin} → ${destination} · ${vessel}`}
              accent
            />
            <StatCard
              label="Expected Range"
              value={`$${result.low.toFixed(2)} – $${result.high.toFixed(2)}`}
              caption="80% confidence interval"
            />
            <StatCard
              label="Prediction Confidence"
              value={`${result.confidence}%`}
              caption={result.confidence >= 85 ? "High confidence" : "Moderate confidence"}
              footer={<Meter value={result.confidence} tone="success" />}
            />
            <StatCard
              label="Market Direction"
              value={result.direction}
              caption={`Expected change ${result.changePct >= 0 ? "+" : ""}${result.changePct}%`}
              footer={
                <Tag tone={result.changePct >= 0 ? "positive" : "critical"}>
                  {result.changePct >= 0 ? "Upward pressure" : "Downward pressure"}
                </Tag>
              }
            />
          </div>

          <Panel
            title="Rate Projection & Confidence Bands"
            description={`${cargo} · ${origin} → ${destination} · ${vessel}`}
            action={<DemoTag />}
          >
            <ForecastChart data={result.series} height={360} />
            <div className="mt-4"><ChartLegend /></div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Panel title="Key Forecast Drivers" description="Feature attribution from the pricing model">
              <div className="grid gap-4 sm:grid-cols-2">
                {result.drivers.map((d) => (
                  <div
                    key={d.name}
                    className="rounded-xl border border-border bg-surface/50 p-4 transition-colors hover:border-border-strong"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{d.name}</p>
                      <Tag tone={d.impact === "High" ? "warning" : "neutral"}>{d.impact} Impact</Tag>
                    </div>
                    <div className="mt-3">
                      <Meter value={d.weight} tone={d.impact === "High" ? "warning" : "primary"} />
                    </div>
                    <p className="num mt-2 text-xs text-muted-foreground">
                      Contribution weight {d.weight}%
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <AiInsight title="AI Explanation">{result.explanation}</AiInsight>
          </div>
        </div>
      )}
    </AppShell>
  );
}

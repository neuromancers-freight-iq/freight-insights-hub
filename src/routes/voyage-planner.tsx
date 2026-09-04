import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Anchor, Compass, MapPin, Navigation, Ship } from "lucide-react";
import { AppShell } from "@/components/freightiq/AppShell";
import {
  AiLoading,
  DemoTag,
  EmptyState,
  Field,
  Meter,
  PageHeader,
  Panel,
  StatCard,
  formatUsd,
} from "@/components/freightiq/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { postVoyageAnalysis } from "@/lib/freightiq/services";
import type { CargoType, VesselClass, VoyageResult } from "@/lib/freightiq/types";

export const Route = createFileRoute("/voyage-planner")({
  head: () => ({
    meta: [
      { title: "Voyage Intelligence — FreightIQ" },
      {
        name: "description",
        content:
          "Evaluate distance, duration, bunker consumption and total voyage cost for bulk cargo shipments to East Coast India.",
      },
      { property: "og:title", content: "Voyage Intelligence — FreightIQ" },
      {
        property: "og:description",
        content: "Operational and economic feasibility analysis for a proposed maritime voyage.",
      },
    ],
  }),
  component: VoyagePlanner,
});

function VoyagePlanner() {
  const [cargo, setCargo] = useState<CargoType>("Coal");
  const [quantity, setQuantity] = useState(75000);
  const [origin, setOrigin] = useState("Newcastle");
  const [destination, setDestination] = useState("Paradip");
  const [vessel, setVessel] = useState<VesselClass>("Panamax");
  const [speed, setSpeed] = useState(12.5);
  const [fuelCost, setFuelCost] = useState(596);
  const [portDays, setPortDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoyageResult | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    const res = await postVoyageAnalysis({
      cargo,
      quantityMt: quantity,
      origin,
      destination,
      vessel,
      speedKnots: speed,
      fuelCostPerMt: fuelCost,
      portDays,
    });
    setResult(res);
    setLoading(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Voyage Economics"
        title="Voyage Intelligence"
        subtitle="Evaluate the operational and economic feasibility of a proposed maritime voyage."
        actions={<DemoTag label="Prototype Analysis" />}
      />

      <Panel title="Voyage Configuration" className="mb-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Cargo Type">
            <Select value={cargo} onValueChange={(v) => setCargo(v as CargoType)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CARGO_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Cargo Quantity" hint="MT">
            <Input type="number" value={quantity} onChange={(e) => setQuantity(+e.target.value)} />
          </Field>
          <Field label="Origin Port">
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ORIGIN_PORTS.map((p) => <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Destination Port">
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DESTINATION_PORTS.map((p) => <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Vessel Type">
            <Select value={vessel} onValueChange={(v) => setVessel(v as VesselClass)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {VESSEL_CLASSES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Vessel Speed" hint="knots">
            <Input type="number" step="0.1" value={speed} onChange={(e) => setSpeed(+e.target.value)} />
          </Field>
          <Field label="Fuel Cost" hint="$ / MT VLSFO">
            <Input type="number" value={fuelCost} onChange={(e) => setFuelCost(+e.target.value)} />
          </Field>
          <Field label="Laytime / Port Time" hint="days">
            <Input type="number" step="0.5" value={portDays} onChange={(e) => setPortDays(+e.target.value)} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button size="lg" onClick={run} disabled={loading}>
            <Compass className="size-4" /> Analyze Voyage
          </Button>
        </div>
      </Panel>

      {loading ? (
        <AiLoading
          steps={[
            "Resolving great-circle routing…",
            "Estimating bunker consumption at speed…",
            "Applying port and cargo charges…",
            "Compiling voyage economics…",
          ]}
        />
      ) : !result ? (
        <EmptyState
          icon={<Ship className="size-8" />}
          title="Voyage not analyzed yet"
          description="Set the cargo, route and vessel parameters above and run the analysis to see distance, duration, fuel and cost estimates."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Estimated Distance" value={result.distanceNm.toLocaleString()} unit="NM" />
            <StatCard label="Voyage Duration" value={result.durationDays.toFixed(1)} unit="days" caption={`${result.seaDays} days at sea`} />
            <StatCard label="Fuel Consumption" value={result.fuelMt.toLocaleString()} unit="MT" />
            <StatCard label="Estimated Voyage Cost" value={formatUsd(result.totalCost)} accent />
            <StatCard label="Freight Cost / MT" value={`$${result.costPerMt.toFixed(2)}`} caption={`${quantity.toLocaleString()} MT ${cargo.toLowerCase()}`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Panel title="Voyage Route Visualization" description="Stylized great-circle representation">
              <div className="relative overflow-hidden rounded-xl border border-border bg-surface/60 p-6 grid-lines">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-primary/[0.06] blur-2xl" />
                <div className="relative flex items-center justify-between gap-4">
                  <RoutePoint name={origin} label="Load Port" icon={<Anchor className="size-4" />} />
                  <div className="relative mx-2 flex-1">
                    <svg viewBox="0 0 400 90" className="h-20 w-full overflow-visible">
                      <path
                        d="M4 70 C 110 4, 290 4, 396 70"
                        fill="none"
                        stroke="var(--color-border-strong)"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                      />
                      <path
                        d="M4 70 C 110 4, 290 4, 396 70"
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="240 640"
                        className="animate-[dash_4s_linear_infinite]"
                        style={{ filter: "drop-shadow(0 0 6px var(--color-primary))" }}
                      />
                    </svg>
                    <div className="mt-1 text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Ocean transit · {result.distanceNm.toLocaleString()} NM
                    </div>
                  </div>
                  <RoutePoint name={destination} label="Discharge Port" icon={<MapPin className="size-4" />} />
                </div>
              </div>
              <style>{`@keyframes dash { to { stroke-dashoffset: -880; } }`}</style>

              <div className="mt-6 space-y-4">
                {result.legs.map((leg, i) => (
                  <div key={leg.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="grid size-8 place-items-center rounded-full border border-primary/35 bg-primary/10 text-primary">
                        <Navigation className="size-3.5" />
                      </span>
                      {i < result.legs.length - 1 ? (
                        <span className="my-1 w-px flex-1 bg-border" />
                      ) : null}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-medium">{leg.label}</p>
                      <p className="text-xs text-muted-foreground">{leg.detail}</p>
                      <p className="num mt-1 text-xs text-primary">{leg.days} days</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Cost Breakdown" description="Estimated components of total voyage cost">
              <ul className="space-y-5">
                {result.breakdown.map((b) => {
                  const pct = (b.value / result.totalCost) * 100;
                  return (
                    <li key={b.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{b.name}</span>
                        <span className="num font-semibold">{formatUsd(b.value)}</span>
                      </div>
                      <Meter value={pct} />
                      <p className="num mt-1 text-[11px] text-muted-foreground">{pct.toFixed(1)}% of total</p>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 rounded-xl border border-border bg-surface/60 p-4">
                <p className="text-xs text-muted-foreground">Total estimated voyage cost</p>
                <p className="num mt-1 text-2xl font-semibold">{formatUsd(result.totalCost)}</p>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function RoutePoint({ name, label, icon }: { name: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="w-28 text-center">
      <span className="mx-auto grid size-10 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
        {icon}
      </span>
      <p className="mt-2 truncate text-sm font-medium">{name}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

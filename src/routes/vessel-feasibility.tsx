import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Ship } from "lucide-react";
import { AppShell } from "@/components/freightiq/AppShell";
import {
  AiInsight,
  AiLoading,
  DemoTag,
  EmptyState,
  Field,
  Meter,
  PageHeader,
  Panel,
  Tag,
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
  DESTINATION_PORTS,
  ORIGIN_PORTS,
  VESSEL_CLASSES,
  VESSEL_SPECS,
} from "@/lib/freightiq/mock-data";
import { postVesselFeasibility } from "@/lib/freightiq/services";
import type { FeasibilityResult, VesselClass } from "@/lib/freightiq/types";

export const Route = createFileRoute("/vessel-feasibility")({
  head: () => ({
    meta: [
      { title: "Vessel Feasibility Analysis — FreightIQ" },
      {
        name: "description",
        content:
          "Score vessel suitability against cargo capacity, draft limits, port compatibility and voyage economics.",
      },
      { property: "og:title", content: "Vessel Feasibility Analysis — FreightIQ" },
      {
        property: "og:description",
        content: "Check whether a vessel is operationally and economically suitable for a voyage.",
      },
    ],
  }),
  component: FeasibilityPage,
});

function FeasibilityPage() {
  const [vessel, setVessel] = useState<VesselClass>("Panamax");
  const spec = VESSEL_SPECS[vessel];
  const [dwt, setDwt] = useState(spec.dwt);
  const [draft, setDraft] = useState(spec.draft);
  const [capacity, setCapacity] = useState(spec.capacity);
  const [origin, setOrigin] = useState("Newcastle");
  const [destination, setDestination] = useState("Paradip");
  const [quantity, setQuantity] = useState(72000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FeasibilityResult | null>(null);

  function pickVessel(v: VesselClass) {
    setVessel(v);
    setDwt(VESSEL_SPECS[v].dwt);
    setDraft(VESSEL_SPECS[v].draft);
    setCapacity(VESSEL_SPECS[v].capacity);
  }

  async function run() {
    setLoading(true);
    setResult(null);
    const res = await postVesselFeasibility({
      vessel, dwt, draft, capacity, origin, destination, quantityMt: quantity,
    });
    setResult(res);
    setLoading(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Fleet Suitability"
        title="Vessel Feasibility Analysis"
        subtitle="Evaluate whether a vessel is operationally and economically suitable for the selected cargo and voyage."
        actions={<DemoTag label="Prototype Analysis" />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
        <Panel title="Vessel & Voyage Inputs" description="Defaults follow class benchmarks">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Vessel Type">
              <Select value={vessel} onValueChange={(v) => pickVessel(v as VesselClass)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VESSEL_CLASSES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Deadweight" hint="MT">
              <Input type="number" value={dwt} onChange={(e) => setDwt(+e.target.value)} />
            </Field>
            <Field label="Draft" hint="metres">
              <Input type="number" step="0.1" value={draft} onChange={(e) => setDraft(+e.target.value)} />
            </Field>
            <Field label="Cargo Capacity" hint="MT">
              <Input type="number" value={capacity} onChange={(e) => setCapacity(+e.target.value)} />
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
                  {DESTINATION_PORTS.map((p) => (
                    <SelectItem key={p.code} value={p.name}>
                      {p.name} · {p.maxDraft} m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Cargo Quantity" hint="MT">
              <Input type="number" value={quantity} onChange={(e) => setQuantity(+e.target.value)} />
            </Field>
          </div>
          <Button size="lg" className="mt-6 w-full" onClick={run} disabled={loading}>
            <Ship className="size-4" /> Evaluate Vessel
          </Button>
        </Panel>

        <div className="space-y-6">
          {loading ? (
            <AiLoading
              steps={[
                "Evaluating vessel constraints…",
                "Checking berth draft and port limits…",
                "Scoring voyage economics…",
                "Compiling feasibility verdict…",
              ]}
            />
          ) : !result ? (
            <EmptyState
              icon={<Ship className="size-8" />}
              title="Awaiting evaluation"
              description="Enter the vessel particulars and route, then run the evaluation to see a full feasibility score breakdown."
            />
          ) : (
            <>
              <Panel title="Feasibility Score" description={`${vessel} · ${origin} → ${destination}`}>
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                  <ScoreDial score={result.score} />
                  <div className="min-w-0 flex-1">
                    <Tag tone={result.score >= 85 ? "positive" : result.score >= 65 ? "warning" : "critical"}>
                      {result.label}
                    </Tag>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Composite score across capacity fit, draft margin, port compatibility,
                      economics and operational risk for the configured voyage.
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {result.checks.map((c) => (
                    <li key={c.name}>
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm">{c.name}</span>
                        <Tag
                          tone={
                            c.status === "PASS" || c.status === "GOOD"
                              ? "positive"
                              : c.status === "WATCH"
                                ? "warning"
                                : "critical"
                          }
                        >
                          {c.status}
                        </Tag>
                      </div>
                      <Meter
                        value={c.score}
                        tone={c.score >= 80 ? "success" : c.score >= 60 ? "warning" : "destructive"}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Potential Constraints">
                <ul className="space-y-3">
                  {result.constraints.map((c) => (
                    <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                      {c.startsWith("No blocking") ? (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                      ) : (
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                      )}
                      {c}
                    </li>
                  ))}
                </ul>
              </Panel>

              <AiInsight title="AI Recommendation">{result.recommendation}</AiInsight>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ScoreDial({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone = score >= 85 ? "var(--color-success)" : score >= 65 ? "var(--color-warning)" : "var(--color-destructive)";
  return (
    <div className="relative size-36 shrink-0">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-secondary)" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={r} fill="none" stroke={tone} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * score) / 100}
          style={{ transition: "stroke-dashoffset 900ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <p className="num text-3xl font-semibold leading-none">{score}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">/ 100</p>
      </div>
    </div>
  );
}

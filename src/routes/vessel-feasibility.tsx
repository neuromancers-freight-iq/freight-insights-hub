import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Ship, Sparkles, XCircle } from "lucide-react";
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
import { CARGO_TYPES, DESTINATION_PORTS, ORIGIN_PORTS } from "@/lib/freightiq/mock-data";
import { postVesselMatch } from "@/lib/freightiq/services";
import type { CargoType, VesselMatch, VesselMatchResult } from "@/lib/freightiq/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vessel-feasibility")({
  head: () => ({
    meta: [
      { title: "Vessel Recommendation — FreightIQ" },
      {
        name: "description",
        content:
          "Enter route, cargo and laycan — FreightIQ scores Handysize to Capesize tonnage and recommends the best vessel class.",
      },
      { property: "og:title", content: "Vessel Recommendation — FreightIQ" },
      {
        property: "og:description",
        content: "System-recommended vessel class based on capacity, draft, freight and waiting time.",
      },
    ],
  }),
  component: FeasibilityPage,
});

const CONTRACT_OPTIONS = [
  { value: 1, label: "Single voyage (1 month)" },
  { value: 3, label: "Short period — 3 months" },
  { value: 6, label: "Period — 6 months" },
  { value: 12, label: "Period — 12 months" },
];

function FeasibilityPage() {
  const [origin, setOrigin] = useState("Newcastle");
  const [destination, setDestination] = useState("Paradip");
  const [cargo, setCargo] = useState<CargoType>("Coal");
  const [quantity, setQuantity] = useState(75000);
  const [requiredDate, setRequiredDate] = useState("2026-10-12");
  const [contractMonths, setContractMonths] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VesselMatchResult | null>(null);
  const [openVessel, setOpenVessel] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    setOpenVessel(null);
    const res = await postVesselMatch({
      origin,
      destination,
      cargo,
      quantityMt: quantity,
      requiredDate,
      contractMonths,
    });
    setResult(res);
    setOpenVessel(res.matches[0]?.vessel ?? null);
    setLoading(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Fleet Suitability"
        title="Vessel Recommendation"
        subtitle="Describe the cargo and the route — FreightIQ evaluates every vessel class and recommends the best fit. No vessel selection required."
        actions={<DemoTag label="Prototype Analysis" />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <Panel title="Requirement" description="What needs to move, and when">
          <div className="grid gap-5 sm:grid-cols-2">
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
                    <SelectItem key={p.code} value={p.name}>{p.name} · {p.maxDraft} m</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
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
            <Field label="Required Date" hint="laycan">
              <Input type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} />
            </Field>
            <Field label="Contract Duration">
              <Select value={String(contractMonths)} onValueChange={(v) => setContractMonths(+v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTRACT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Button size="lg" className="mt-6 w-full" onClick={run} disabled={loading}>
            <Sparkles className="size-4" /> Recommend Vessel
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            All four classes — Handysize, Supramax, Panamax and Capesize — are scored automatically.
          </p>
        </Panel>

        <div className="space-y-6">
          {loading ? (
            <AiLoading
              steps={[
                "Analysing market signals…",
                "Matching parcel size to vessel classes…",
                "Checking berth draft and port limits…",
                "Estimating freight and waiting time…",
                "Ranking the best vessel…",
              ]}
            />
          ) : !result ? (
            <EmptyState
              icon={<Ship className="size-8" />}
              title="Awaiting requirement"
              description="Enter the route, cargo and laycan, then run the analysis to see every vessel class scored and ranked."
            />
          ) : (
            <>
              {result.matches
                .filter((m) => m.recommended)
                .map((m) => <RecommendedCard key={m.vessel} match={m} />)}

              <Panel
                title="Vessel Class Comparison"
                description="Ranked by optimisation score · click a row for detail"
                action={<DemoTag label="Simulated" />}
                bodyClassName="p-0"
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Vessel Type</th>
                        <th className="px-4 py-3 font-medium">Approx. Capacity</th>
                        <th className="px-4 py-3 font-medium">Port Compat.</th>
                        <th className="px-4 py-3 font-medium">Est. Freight</th>
                        <th className="px-4 py-3 font-medium">Waiting</th>
                        <th className="px-4 py-3 font-medium">Score</th>
                        <th className="px-5 py-3 font-medium">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.matches.map((m) => (
                        <VesselRow
                          key={m.vessel}
                          match={m}
                          open={openVessel === m.vessel}
                          onToggle={() => setOpenVessel(openVessel === m.vessel ? null : m.vessel)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <AiInsight title="Why this vessel">{result.rationale}</AiInsight>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function scoreTone(score: number) {
  return score >= 80 ? "success" : score >= 60 ? "warning" : "destructive";
}

function RecommendedCard({ match }: { match: VesselMatch }) {
  return (
    <Panel className="border-primary/30 bg-primary/[0.05]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Tag tone="info">★ Recommended</Tag>
          <h2 className="font-display mt-3 text-2xl font-semibold">{match.vessel}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{match.summary}</p>
        </div>
        <div className="text-right">
          <p className="num text-4xl font-semibold leading-none">{match.score}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Score / 100</p>
        </div>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Capacity" value={`${(match.capacityRange[0] / 1000).toFixed(0)}–${(match.capacityRange[1] / 1000).toFixed(0)}k t`} />
        <Stat
          label="Port compatibility"
          value={match.portCompatible ? "Compatible" : "Restricted"}
          tone={match.portCompatible ? "positive" : "critical"}
        />
        <Stat label="Estimated freight" value={`$${match.freightLow}–${match.freightHigh}/t`} />
        <Stat label="Expected waiting" value={`${match.waitingDays} days`} />
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        Indicative voyage value {formatUsd(match.totalCost)} · laden draft {match.laden} m
      </p>
    </Panel>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "critical";
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-4">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "num mt-2 text-base font-semibold",
          tone === "positive" && "text-success",
          tone === "critical" && "text-destructive",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function VesselRow({
  match,
  open,
  onToggle,
}: {
  match: VesselMatch;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={cn(
          "cursor-pointer border-b border-border/70 transition-colors hover:bg-secondary/40",
          match.recommended && "bg-primary/[0.05]",
        )}
      >
        <td className="px-5 py-4">
          <span className="flex items-center gap-2 font-medium">
            {match.recommended ? <span className="text-primary">★</span> : null}
            {match.vessel}
          </span>
        </td>
        <td className="num px-4 py-4 text-muted-foreground">
          {match.capacityRange[0].toLocaleString()}–{match.capacityRange[1].toLocaleString()} t
        </td>
        <td className="px-4 py-4">
          {match.portCompatible ? (
            <CheckCircle2 className="size-4 text-success" />
          ) : (
            <XCircle className="size-4 text-destructive" />
          )}
        </td>
        <td className="num px-4 py-4">${match.freightLow}–{match.freightHigh}/t</td>
        <td className="num px-4 py-4 text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {match.waitingDays} d
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="num w-7 font-semibold">{match.score}</span>
            <div className="w-16">
              <Meter value={match.score} tone={scoreTone(match.score)} />
            </div>
          </div>
        </td>
        <td className="px-5 py-4">
          {match.recommended ? (
            <Tag tone="positive">Recommended</Tag>
          ) : match.score >= 70 ? (
            <Tag tone="neutral">Viable alternative</Tag>
          ) : match.portCompatible ? (
            <Tag tone="warning">Sub-optimal</Tag>
          ) : (
            <Tag tone="critical">Not suitable</Tag>
          )}
        </td>
      </tr>
      {open ? (
        <tr className="border-b border-border/70 bg-surface/40">
          <td colSpan={7} className="px-5 py-5">
            <p className="text-sm text-muted-foreground">{match.summary}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {match.factors.map((f) => (
                <div key={f.name} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">{f.name}</span>
                    <span className="num text-xs font-semibold">{f.score}</span>
                  </div>
                  <div className="mt-2">
                    <Meter value={f.score} tone={scoreTone(f.score)} />
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">{f.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              {match.portCompatible ? (
                <CheckCircle2 className="size-3.5 text-success" />
              ) : (
                <AlertTriangle className="size-3.5 text-warning" />
              )}
              {match.portNote}
            </p>
          </td>
        </tr>
      ) : null}
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/freightiq/AppShell";
import {
  AiInsight,
  AiLoading,
  DemoTag,
  Meter,
  PageHeader,
  Panel,
  Tag,
  formatUsd,
} from "@/components/freightiq/primitives";
import { Button } from "@/components/ui/button";
import { postRecommendations } from "@/lib/freightiq/services";
import type { RecommendationOption, RecommendationResult } from "@/lib/freightiq/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "AI Decision Recommendations — FreightIQ" },
      {
        name: "description",
        content:
          "Compare chartering scenarios side by side with cost, risk, confidence and an explainable recommended strategy.",
      },
      { property: "og:title", content: "AI Decision Recommendations — FreightIQ" },
      {
        property: "og:description",
        content: "Explainable chartering scenarios ranked by cost, risk and confidence.",
      },
    ],
  }),
  component: RecommendationsPage,
});

function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RecommendationResult | null>(null);

  async function run() {
    setLoading(true);
    setData(null);
    setData(await postRecommendations());
    setLoading(false);
  }

  useEffect(() => {
    void run();
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Decision Support"
        title="AI Decision Recommendations"
        subtitle="Scenario comparison across cargo, route, vessel class and risk — with the reasoning behind the recommended strategy."
        actions={
          <>
            <DemoTag label="Simulated" />
            <Button variant="outline" onClick={run} disabled={loading}>
              <RefreshCw className={cn("size-4", loading && "animate-spin")} /> Re-run analysis
            </Button>
          </>
        }
      />

      {loading || !data ? (
        <AiLoading
          steps={[
            "Analysing market signals…",
            "Processing historical freight data…",
            "Evaluating vessel constraints…",
            "Scoring scenarios…",
            "Generating recommendation…",
          ]}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.options.map((o) => <OptionCard key={o.id} option={o} />)}
          </div>

          <Panel
            title="Scenario Comparison"
            description="All options side by side"
            bodyClassName="p-0"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Option</th>
                    <th className="px-4 py-3 font-medium">Cargo</th>
                    <th className="px-4 py-3 font-medium">Route</th>
                    <th className="px-4 py-3 font-medium">Vessel</th>
                    <th className="px-4 py-3 font-medium">Total Cost</th>
                    <th className="px-4 py-3 font-medium">Freight</th>
                    <th className="px-4 py-3 font-medium">Risk</th>
                    <th className="px-4 py-3 font-medium">Confidence</th>
                    <th className="px-5 py-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.options.map((o) => (
                    <tr
                      key={o.id}
                      className={cn(
                        "border-b border-border/70 transition-colors hover:bg-secondary/40",
                        o.recommended && "bg-primary/[0.05]",
                      )}
                    >
                      <td className="px-5 py-4 font-medium">
                        <span className="flex items-center gap-2">
                          {o.recommended ? <span className="text-primary">★</span> : null}
                          Option {o.letter}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{o.cargo}</td>
                      <td className="px-4 py-4">{o.origin} → {o.destination}</td>
                      <td className="px-4 py-4 text-muted-foreground">{o.vessel}</td>
                      <td className="num px-4 py-4">{formatUsd(o.cost)}</td>
                      <td className="num px-4 py-4">${o.freightRate.toFixed(1)} / MT</td>
                      <td className="px-4 py-4">
                        <Tag tone={o.risk === "Low" ? "positive" : o.risk === "Medium" ? "warning" : "critical"}>
                          {o.risk}
                        </Tag>
                      </td>
                      <td className="num px-4 py-4 text-muted-foreground">{o.confidence}%</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="num w-7 font-semibold">{o.score}</span>
                          <div className="w-16">
                            <Meter value={o.score} tone={o.score >= 85 ? "success" : o.score >= 70 ? "warning" : "destructive"} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <AiInsight title="Recommended Strategy">
              {data.strategy}
              <ul className="mt-4 space-y-2.5">
                {data.reasons.map((r) => (
                  <li key={r} className="flex gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    {r}
                  </li>
                ))}
              </ul>
            </AiInsight>

            <Panel title="Decision Weighting" description="How the score was composed">
              <ul className="space-y-4">
                {[
                  { name: "Freight cost per MT", weight: 32 },
                  { name: "Vessel & port compatibility", weight: 26 },
                  { name: "Operational risk", weight: 20 },
                  { name: "Prediction confidence", weight: 14 },
                  { name: "Schedule flexibility", weight: 8 },
                ].map((w) => (
                  <li key={w.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span>{w.name}</span>
                      <span className="num text-xs text-muted-foreground">{w.weight}%</span>
                    </div>
                    <Meter value={w.weight * 2.6} />
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function OptionCard({ option: o }: { option: RecommendationOption }) {
  return (
    <div
      className={cn(
        "panel flex flex-col p-5 transition-all duration-300 hover:-translate-y-0.5",
        o.recommended && "border-primary/35 bg-primary/[0.06]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Option {o.letter}</p>
          <p className="font-display mt-1 text-lg font-semibold">{o.vessel}</p>
          <p className="text-xs text-muted-foreground">{o.origin} → {o.destination}</p>
        </div>
        {o.recommended ? (
          <Tag tone="info">
            <Sparkles className="size-3" /> Best
          </Tag>
        ) : null}
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Cargo" value={o.cargo} />
        <Row label="Total cost" value={formatUsd(o.cost)} />
        <Row label="Freight" value={`$${o.freightRate.toFixed(1)} / MT`} />
        <Row label="Risk" value={o.risk} />
        <Row label="Confidence" value={`${o.confidence}%`} />
      </dl>
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>Optimisation score</span>
          <span className="num font-semibold text-foreground">{o.score}/100</span>
        </div>
        <Meter value={o.score} tone={o.score >= 85 ? "success" : o.score >= 70 ? "warning" : "destructive"} />
      </div>
      <ul className="mt-4 space-y-1.5 text-[11px] leading-relaxed text-muted-foreground">
        {o.notes.map((n) => (
          <li key={n} className="flex gap-2">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70" />
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="num text-sm">{value}</dd>
    </div>
  );
}

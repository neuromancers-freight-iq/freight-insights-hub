import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { AppShell } from "@/components/freightiq/AppShell";
import { DemoTag, PageHeader, Panel, Tag } from "@/components/freightiq/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ALL_PORTS,
  CARGO_TYPES,
  FREIGHT_ROWS,
  MARKET_DATA,
  VESSEL_CAPACITY_RANGE,
  VESSEL_CLASSES,
  VESSEL_SPECS,
} from "@/lib/freightiq/mock-data";

export const Route = createFileRoute("/data-analytics")({
  head: () => ({
    meta: [
      { title: "Data & Analytics — FreightIQ" },
      {
        name: "description",
        content:
          "Browse freight, port, vessel and market signal datasets behind FreightIQ with search, filters and export.",
      },
      { property: "og:title", content: "Data & Analytics — FreightIQ" },
      {
        property: "og:description",
        content: "Freight, port, vessel and market signal datasets with search, filters and export.",
      },
    ],
  }),
  component: DataAnalyticsPage,
});

const TH = "px-4 py-3 font-medium first:pl-5 last:pr-5";
const TD = "px-4 py-3.5 first:pl-5 last:pr-5";

function DataAnalyticsPage() {
  const [query, setQuery] = useState("");
  const [cargo, setCargo] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FREIGHT_ROWS.filter((r) => {
      if (cargo !== "all" && r.cargo !== cargo) return false;
      if (from && r.date < from) return false;
      if (to && r.date > to) return false;
      if (!q) return true;
      return `${r.route} ${r.cargo} ${r.vessel} ${r.condition}`.toLowerCase().includes(q);
    });
  }, [query, cargo, from, to]);

  function exportCsv() {
    const header = "Date,Route,Cargo,Vessel Type,Freight Rate,Fuel Price,Port Condition";
    const body = rows
      .map((r) => [r.date, r.route, r.cargo, r.vessel, r.rate, r.fuel, r.condition].join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([`${header}\n${body}`], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "freightiq-freight-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Datasets"
        title="Data & Analytics"
        subtitle="The underlying demo datasets powering forecasts, feasibility scoring and recommendations."
        actions={
          <>
            <DemoTag />
            <Button variant="outline" onClick={exportCsv}>
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />

      <Tabs defaultValue="freight" className="space-y-6">
        <TabsList>
          <TabsTrigger value="freight">Freight Data</TabsTrigger>
          <TabsTrigger value="ports">Port Data</TabsTrigger>
          <TabsTrigger value="vessels">Vessel Data</TabsTrigger>
          <TabsTrigger value="signals">Market Signals</TabsTrigger>
        </TabsList>

        <TabsContent value="freight" className="space-y-6">
          <Panel title="Filters" description="Search, commodity and date range">
            <div className="grid gap-4 md:grid-cols-4">
              <label className="relative flex items-center md:col-span-2">
                <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search route, vessel, condition…"
                  className="pl-9"
                />
              </label>
              <Select value={cargo} onValueChange={setCargo}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cargo types</SelectItem>
                  {CARGO_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                <span className="text-xs text-muted-foreground">to</span>
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
          </Panel>

          <Panel
            title="Freight Records"
            description={`${rows.length} of ${FREIGHT_ROWS.length} records`}
            bodyClassName="p-0"
          >
            <div className="max-h-[560px] overflow-auto">
              <table className="w-full min-w-[880px] text-sm">
                <thead className="sticky top-0 z-10 bg-card">
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className={TH}>Date</th>
                    <th className={TH}>Route</th>
                    <th className={TH}>Cargo</th>
                    <th className={TH}>Vessel Type</th>
                    <th className={TH}>Freight Rate</th>
                    <th className={TH}>Fuel Price</th>
                    <th className={TH}>Port Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={`${r.date}${r.route}`} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                      <td className={`num ${TD} text-muted-foreground`}>{r.date}</td>
                      <td className={`${TD} font-medium`}>{r.route}</td>
                      <td className={`${TD} text-muted-foreground`}>{r.cargo}</td>
                      <td className={`${TD} text-muted-foreground`}>{r.vessel}</td>
                      <td className={`num ${TD}`}>${r.rate.toFixed(2)} / MT</td>
                      <td className={`num ${TD} text-muted-foreground`}>${r.fuel}</td>
                      <td className={TD}>
                        <Tag tone={r.condition === "Clear" ? "positive" : r.condition === "Moderate" ? "warning" : "critical"}>
                          {r.condition}
                        </Tag>
                      </td>
                    </tr>
                  ))}
                  {!rows.length ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                        No records match the current filters.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="ports">
          <Panel title="Port Data" description="Berth limits and congestion profile" bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className={TH}>Code</th>
                    <th className={TH}>Port</th>
                    <th className={TH}>Country</th>
                    <th className={TH}>Max Draft</th>
                    <th className={TH}>Congestion</th>
                    <th className={TH}>Avg. Waiting</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_PORTS.map((p) => (
                    <tr key={p.code} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                      <td className={`num ${TD} text-muted-foreground`}>{p.code}</td>
                      <td className={`${TD} font-medium`}>{p.name}</td>
                      <td className={`${TD} text-muted-foreground`}>{p.country}</td>
                      <td className={`num ${TD}`}>{p.maxDraft} m</td>
                      <td className={TD}>
                        <Tag tone={p.congestion === "Low" ? "positive" : p.congestion === "Moderate" ? "warning" : "critical"}>
                          {p.congestion}
                        </Tag>
                      </td>
                      <td className={`num ${TD} text-muted-foreground`}>
                        {MARKET_DATA.congestion.find((c) => c.port === p.name)?.waitingDays ?? "—"} d
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="vessels">
          <Panel title="Vessel Data" description="Class benchmarks used by the recommendation engine" bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className={TH}>Vessel Type</th>
                    <th className={TH}>Approx. Capacity</th>
                    <th className={TH}>Deadweight</th>
                    <th className={TH}>Design Draft</th>
                    <th className={TH}>Consumption</th>
                    <th className={TH}>Open Tonnage</th>
                  </tr>
                </thead>
                <tbody>
                  {VESSEL_CLASSES.map((v) => {
                    const s = VESSEL_SPECS[v];
                    const r = VESSEL_CAPACITY_RANGE[v];
                    return (
                      <tr key={v} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                        <td className={`${TD} font-medium`}>{v}</td>
                        <td className={`num ${TD}`}>{r[0].toLocaleString()}–{r[1].toLocaleString()} t</td>
                        <td className={`num ${TD} text-muted-foreground`}>{s.dwt.toLocaleString()} MT</td>
                        <td className={`num ${TD} text-muted-foreground`}>{s.draft} m</td>
                        <td className={`num ${TD} text-muted-foreground`}>{s.consumptionPerDay} MT / day</td>
                        <td className={`num ${TD}`}>
                          {MARKET_DATA.availability.find((a) => a.class === v)?.openVessels ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="signals">
          <Panel title="Market Signals" description="Latest automated reads">
            <div className="grid gap-4 sm:grid-cols-2">
              {MARKET_DATA.signals.map((s) => (
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
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

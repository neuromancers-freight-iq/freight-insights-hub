import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/freightiq/AppShell";
import { DemoTag, Field, PageHeader, Panel, Tag } from "@/components/freightiq/primitives";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_ENDPOINTS } from "@/lib/freightiq/services";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FreightIQ" },
      {
        name: "description",
        content: "Configure default route, currency, units and data source for the FreightIQ workspace.",
      },
      { property: "og:title", content: "Settings — FreightIQ" },
      { property: "og:description", content: "Workspace defaults and data source configuration." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [currency, setCurrency] = useState("USD");
  const [units, setUnits] = useState("Metric tonnes");
  const [alerts, setAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        subtitle="Preferences for the chartering desk. In this prototype nothing is persisted."
        actions={<DemoTag label="Prototype" />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Defaults" description="Applied to new analyses">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Currency">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["USD", "EUR", "SGD", "INR"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Cargo Units">
              <Select value={units} onValueChange={setUnits}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Metric tonnes", "Long tons"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Default Origin">
              <Input defaultValue="Newcastle" />
            </Field>
            <Field label="Default Destination">
              <Input defaultValue="Paradip" />
            </Field>
          </div>
        </Panel>

        <Panel title="Notifications" description="Alerting behaviour">
          <ul className="space-y-5">
            <ToggleRow
              label="Market signal alerts"
              hint="Notify when a tracked route flips signal"
              checked={alerts}
              onChange={setAlerts}
            />
            <ToggleRow
              label="Auto-refresh market data"
              hint="Refresh the dashboard every 5 minutes"
              checked={autoRefresh}
              onChange={setAutoRefresh}
            />
          </ul>
        </Panel>

        <Panel title="Data Source" description="Where analysis results come from" className="lg:col-span-2">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Tag tone="warning">Demo dataset</Tag>
            <p className="text-sm text-muted-foreground">
              Every result is generated locally from simulated data. Connecting a live backend swaps
              these endpoints without any UI change.
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {Object.entries(API_ENDPOINTS).map(([key, path]) => (
              <li
                key={key}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/60 px-4 py-3"
              >
                <span className="text-xs text-muted-foreground">{key}</span>
                <code className="num text-xs text-primary">{path}</code>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </li>
  );
}

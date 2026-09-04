import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesPoint } from "@/lib/freightiq/types";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload as SeriesPoint;
  return (
    <div className="panel min-w-[172px] p-3 text-xs">
      <p className="mb-2 font-semibold">{label}</p>
      {p.historical != null ? (
        <Row name="Historical" value={`$${p.historical.toFixed(2)}`} color="var(--color-primary)" />
      ) : null}
      {p.forecast != null ? (
        <Row name="Forecast" value={`$${p.forecast.toFixed(2)}`} color="var(--color-chart-2)" />
      ) : null}
      {p.band ? (
        <Row
          name="Confidence"
          value={`$${p.band[0].toFixed(2)} – $${p.band[1].toFixed(2)}`}
          color="var(--color-muted-foreground)"
        />
      ) : null}
    </div>
  );
}

function Row({ name, value, color }: { name: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <span className="size-1.5 rounded-full" style={{ background: color }} />
        {name}
      </span>
      <span className="num text-foreground">{value}</span>
    </div>
  );
}

export function ForecastChart({ data, height = 320 }: { data: SeriesPoint[]; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="fq-band" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.32} />
              <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            minTickGap={26}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={58}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border-strong)" }} />
          <Area
            type="monotone"
            dataKey="band"
            stroke="none"
            fill="url(#fq-band)"
            isAnimationActive={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="historical"
            stroke="var(--color-primary)"
            strokeWidth={2.2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="var(--color-chart-2)"
            strokeWidth={2.2}
            strokeDasharray="5 4"
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartLegend() {
  const items = [
    { label: "Historical", color: "var(--color-primary)" },
    { label: "Forecast", color: "var(--color-chart-2)" },
    { label: "Confidence Range", color: "var(--color-chart-2)", faded: true },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="h-1.5 w-5 rounded-full"
            style={{ background: i.color, opacity: i.faded ? 0.28 : 1 }}
          />
          {i.label}
        </span>
      ))}
    </div>
  );
}

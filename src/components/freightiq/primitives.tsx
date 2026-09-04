import { ArrowDownRight, ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold md:text-[34px] md:leading-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-[15px]">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel flex flex-col", className)}>
      {title ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold">{title}</h2>
            {description ? (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={cn("flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "positive" | "warning" | "critical" | "info";
  className?: string;
}) {
  const tones = {
    neutral: "border-border-strong bg-secondary/60 text-muted-foreground",
    positive: "border-success/30 bg-success/12 text-success",
    warning: "border-warning/30 bg-warning/12 text-warning",
    critical: "border-destructive/35 bg-destructive/12 text-destructive",
    info: "border-primary/30 bg-primary/12 text-primary",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DemoTag({ label = "Demo Data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      <span className="size-1.5 rounded-full bg-warning/80" />
      {label}
    </span>
  );
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "num inline-flex items-center gap-0.5 text-xs font-semibold",
        up ? "text-success" : "text-destructive",
      )}
    >
      <Icon className="size-3.5" />
      {up ? "+" : ""}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}

export function StatCard({
  label,
  value,
  unit,
  caption,
  footer,
  accent,
  icon,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  caption?: string;
  footer?: ReactNode;
  accent?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "panel group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong",
        accent && "border-primary/25 bg-primary/[0.06]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        {icon ? <span className="text-primary/80">{icon}</span> : null}
      </div>
      <p className="num mt-4 text-[30px] font-semibold leading-none">
        {value}
        {unit ? <span className="ml-1 text-sm text-muted-foreground">{unit}</span> : null}
      </p>
      {caption ? <p className="mt-2 text-xs text-muted-foreground">{caption}</p> : null}
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  );
}

export function Meter({ value, tone = "primary" }: { value: number; tone?: "primary" | "success" | "warning" | "destructive" }) {
  const bar = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  } as const;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={cn("h-full rounded-full transition-[width] duration-700", bar[tone])}
        style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function AiInsight({
  title = "AI Market Insight",
  children,
  footer,
}: {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="panel relative overflow-hidden border-primary/25 p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">{title}</h3>
          <DemoTag label="Simulated" />
        </div>
        <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
        {footer ? <div className="mt-4">{footer}</div> : null}
      </div>
    </div>
  );
}

/** Premium multi-step "AI is thinking" state used by every analysis action. */
export function AiLoading({ steps }: { steps: string[] }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 550);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="panel grid place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mx-auto mb-6 grid size-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
        <ul className="space-y-3">
          {steps.map((s, i) => (
            <li
              key={s}
              className={cn(
                "flex items-center gap-3 text-sm transition-opacity duration-500",
                i <= step ? "opacity-100" : "opacity-35",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  i < step ? "bg-success" : i === step ? "animate-pulse bg-primary" : "bg-muted-foreground/40",
                )}
              />
              <span className={i === step ? "text-foreground" : "text-muted-foreground"}>{s}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, description, icon }: { title: string; description: string; icon?: ReactNode }) {
  return (
    <div className="panel grid place-items-center px-6 py-16 text-center">
      <div className="max-w-sm">
        {icon ? <div className="mx-auto mb-4 text-primary/70">{icon}</div> : null}
        <p className="font-display text-base font-semibold">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {label}
        {hint ? <span className="text-[10px] normal-case tracking-normal">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

export function formatUsd(value: number) {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

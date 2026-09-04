import { Link, useRouterState } from "@tanstack/react-router";
import {
  Anchor,
  Bell,
  BookOpen,
  Compass,
  Database,
  Gauge,
  LayoutDashboard,
  LineChart,
  Menu,
  Radar,
  Search,
  Settings,
  Ship,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/forecast", label: "Freight Forecast", icon: LineChart },
  { to: "/voyage-planner", label: "Voyage Planner", icon: Compass },
  { to: "/vessel-feasibility", label: "Vessel Feasibility", icon: Ship },
  { to: "/market-intelligence", label: "Market Intelligence", icon: Radar },
  { to: "/recommendations", label: "Recommendations", icon: Sparkles },
  { to: "/data-analytics", label: "Data & Analytics", icon: Database },
] as const;

const FOOTER_NAV = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help / Documentation", icon: BookOpen },
] as const;

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 place-items-center rounded-xl border border-primary/30 bg-primary/12 text-primary",
        className,
      )}
    >
      <Anchor className="size-5" strokeWidth={2.2} />
    </span>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const item = (to: string, label: string, Icon: typeof Ship) => {
    const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
    return (
      <Link
        key={to}
        to={to}
        onClick={onNavigate}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
        )}
      >
        <span
          className={cn(
            "absolute left-0 h-5 w-0.5 rounded-full bg-primary transition-opacity",
            active ? "opacity-100" : "opacity-0",
          )}
        />
        <Icon className={cn("size-[18px]", active && "text-primary")} strokeWidth={1.9} />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col gap-1 px-3 pb-4">
      <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
        Intelligence
      </p>
      {NAV.map((n) => item(n.to, n.label, n.icon))}
      <div className="mt-auto space-y-1 pt-6">
        <div className="mx-1 mb-3 rounded-xl border border-border bg-surface/70 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-success/70" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            AI Engine: Online
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Forecast models synced · demo dataset
          </p>
        </div>
        {FOOTER_NAV.map((n) => item(n.to, n.label, n.icon))}
      </div>
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
      <BrandMark />
      <div className="leading-tight">
        <p className="font-display text-[17px] font-semibold tracking-tight">FreightIQ</p>
        <p className="text-[11px] text-muted-foreground">Maritime Intelligence</p>
      </div>
    </div>
  );
}

function TopBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden">
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarHeader />
          <NavList onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <label className="relative hidden max-w-md flex-1 items-center sm:flex">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search routes, ports, vessels…"
          className="h-10 w-full rounded-lg border border-border bg-surface/70 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/40"
        />
      </label>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-warning sm:flex">
          <Gauge className="size-3.5" /> Demo Mode
        </span>
        <button
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface/70 py-1.5 pl-1.5 pr-3">
          <span className="grid size-7 place-items-center rounded-md bg-primary/15 text-xs font-semibold text-primary">
            VK
          </span>
          <div className="hidden leading-tight md:block">
            <p className="text-xs font-semibold">Chartering Desk</p>
            <p className="text-[10px] text-muted-foreground">Analyst</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarHeader />
        <NavList />
      </aside>
      <div className="flex min-w-0 flex-col">
        <TopBar />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-8 md:py-10">
          {children}
        </main>
        <footer className="border-t border-border px-4 py-5 text-xs text-muted-foreground md:px-8">
          FreightIQ · Intelligence for Smarter Maritime Decisions · Prototype build with simulated
          data
        </footer>
      </div>
    </div>
  );
}

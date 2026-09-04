import type {
  CargoType,
  FreightRow,
  MarketData,
  Port,
  VesselClass,
} from "./types";

export const CARGO_TYPES: CargoType[] = ["Coal", "Iron Ore", "Steel Products"];

export const VESSEL_CLASSES: VesselClass[] = [
  "Handysize",
  "Supramax",
  "Panamax",
  "Capesize",
];

export const VESSEL_SPECS: Record<
  VesselClass,
  { dwt: number; draft: number; capacity: number; consumptionPerDay: number }
> = {
  Handysize: { dwt: 32000, draft: 10.2, capacity: 30000, consumptionPerDay: 21 },
  Supramax: { dwt: 58000, draft: 12.6, capacity: 55000, consumptionPerDay: 28 },
  Panamax: { dwt: 82000, draft: 14.2, capacity: 78000, consumptionPerDay: 34 },
  Capesize: { dwt: 180000, draft: 18.1, capacity: 172000, consumptionPerDay: 48 },
};

export const ORIGIN_PORTS: Port[] = [
  { code: "AUNTL", name: "Newcastle", country: "Australia", maxDraft: 16.5, congestion: "Moderate" },
  { code: "ZARIB", name: "Richards Bay", country: "South Africa", maxDraft: 17.5, congestion: "High" },
  { code: "AUPHE", name: "Port Hedland", country: "Australia", maxDraft: 19.0, congestion: "Low" },
];

export const DESTINATION_PORTS: Port[] = [
  { code: "INPRT", name: "Paradip", country: "India", maxDraft: 17.1, congestion: "Moderate" },
  { code: "INVTZ", name: "Visakhapatnam", country: "India", maxDraft: 16.5, congestion: "Moderate" },
  { code: "INHAL", name: "Haldia", country: "India", maxDraft: 8.5, congestion: "High" },
  { code: "INMAA", name: "Chennai", country: "India", maxDraft: 15.5, congestion: "Low" },
];

export const ALL_PORTS = [...ORIGIN_PORTS, ...DESTINATION_PORTS];

export const DISTANCES: Record<string, number> = {
  "Newcastle→Paradip": 5420,
  "Newcastle→Visakhapatnam": 5310,
  "Newcastle→Haldia": 5615,
  "Newcastle→Chennai": 5085,
  "Richards Bay→Paradip": 4740,
  "Richards Bay→Visakhapatnam": 4650,
  "Richards Bay→Haldia": 4920,
  "Richards Bay→Chennai": 4380,
  "Port Hedland→Paradip": 3980,
  "Port Hedland→Visakhapatnam": 3890,
  "Port Hedland→Haldia": 4160,
  "Port Hedland→Chennai": 3620,
};

const CARGO_FACTOR: Record<CargoType, number> = {
  Coal: 1,
  "Iron Ore": 1.08,
  "Steel Products": 1.22,
};

const VESSEL_FACTOR: Record<VesselClass, number> = {
  Handysize: 1.24,
  Supramax: 1.1,
  Panamax: 1,
  Capesize: 0.88,
};

export function baseRate(cargo: CargoType, vessel: VesselClass, distanceNm: number) {
  return Number((11 + distanceNm / 420) * CARGO_FACTOR[cargo] * VESSEL_FACTOR[vessel]);
}

export function distanceFor(origin: string, destination: string) {
  return DISTANCES[`${origin}→${destination}`] ?? 4800;
}

/** Deterministic pseudo-random so demo output is stable between renders. */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function buildTrend(points: number, start: number, seed: string) {
  const rnd = seeded(seed);
  const series = [];
  let value = start;
  for (let i = 0; i < points; i++) {
    value += (rnd() - 0.45) * (start * 0.03);
    series.push(Number(value.toFixed(2)));
  }
  return series;
}

export function marketTrend(days: number) {
  const historyPoints = Math.max(8, Math.round(days * 0.7));
  const forecastPoints = Math.max(4, Math.round(days * 0.3));
  const hist = buildTrend(historyPoints, 23.4, `market-${days}`);
  const out = hist.map((v, i) => ({
    label: `D-${historyPoints - i}`,
    historical: v,
  })) as MarketData["trend"];

  let last = hist[hist.length - 1];
  out[out.length - 1] = { ...out[out.length - 1], forecast: last, band: [last, last] };
  const rnd = seeded(`fc-${days}`);
  for (let i = 1; i <= forecastPoints; i++) {
    last += 0.12 + (rnd() - 0.4) * 0.35;
    const spread = 0.35 + i * 0.22;
    out.push({
      label: `D+${i}`,
      forecast: Number(last.toFixed(2)),
      band: [Number((last - spread).toFixed(2)), Number((last + spread).toFixed(2))],
    });
  }
  return out;
}

export const MARKET_DATA: MarketData = {
  index: { name: "Baltic Freight Indicator", value: 2184, changePct: 4.8 },
  routeRate: { route: "Australia → India", rate: 24.6, unit: "$ / MT" },
  volatility: { label: "Moderate", score: 54 },
  confidence: 87,
  trend: marketTrend(30),
  insight:
    "Freight rates are showing moderate upward momentum. Based on current market signals, delaying chartering may increase expected voyage cost.",
  signals: [
    { id: "s1", title: "Cargo Demand", level: "Rising", tone: "positive", detail: "East-coast India coal enquiries up 9% week-on-week." },
    { id: "s2", title: "Port Congestion", level: "Moderate", tone: "warning", detail: "Average waiting time at Paradip is 2.8 days." },
    { id: "s3", title: "Fuel Cost", level: "Increasing", tone: "warning", detail: "VLSFO Singapore up $18/MT over 14 days." },
    { id: "s4", title: "Vessel Availability", level: "Stable", tone: "neutral", detail: "Panamax open tonnage steady in the Pacific basin." },
  ],
  fuel: [
    { label: "Wk 1", vlsfo: 578, mgo: 742 },
    { label: "Wk 2", vlsfo: 584, mgo: 749 },
    { label: "Wk 3", vlsfo: 591, mgo: 754 },
    { label: "Wk 4", vlsfo: 588, mgo: 751 },
    { label: "Wk 5", vlsfo: 596, mgo: 766 },
    { label: "Wk 6", vlsfo: 604, mgo: 773 },
  ],
  congestion: [
    { port: "Paradip", waitingDays: 2.8 },
    { port: "Visakhapatnam", waitingDays: 2.1 },
    { port: "Haldia", waitingDays: 4.4 },
    { port: "Chennai", waitingDays: 1.3 },
    { port: "Richards Bay", waitingDays: 5.2 },
  ],
  availability: [
    { class: "Handysize", openVessels: 42, demandIndex: 58 },
    { class: "Supramax", openVessels: 65, demandIndex: 71 },
    { class: "Panamax", openVessels: 51, demandIndex: 78 },
    { class: "Capesize", openVessels: 23, demandIndex: 64 },
  ],
  demand: [
    { label: "Apr", coal: 62, ironOre: 48, steel: 31 },
    { label: "May", coal: 68, ironOre: 51, steel: 33 },
    { label: "Jun", coal: 71, ironOre: 49, steel: 36 },
    { label: "Jul", coal: 74, ironOre: 55, steel: 34 },
    { label: "Aug", coal: 79, ironOre: 58, steel: 38 },
    { label: "Sep", coal: 83, ironOre: 57, steel: 41 },
  ],
  heatmap: [
    { route: "Newcastle → Paradip", rate: 24.6, change7d: 3.1, trend30d: buildTrend(14, 24, "h1"), volatility: "Medium", signal: "Bullish" },
    { route: "Richards Bay → Visakhapatnam", rate: 21.9, change7d: -1.4, trend30d: buildTrend(14, 22, "h2"), volatility: "Low", signal: "Neutral" },
    { route: "Newcastle → Haldia", rate: 26.4, change7d: 4.6, trend30d: buildTrend(14, 26, "h3"), volatility: "High", signal: "Bullish" },
    { route: "Port Hedland → Visakhapatnam", rate: 18.7, change7d: -2.7, trend30d: buildTrend(14, 19, "h4"), volatility: "Medium", signal: "Bearish" },
    { route: "Richards Bay → Chennai", rate: 20.3, change7d: 0.4, trend30d: buildTrend(14, 20, "h5"), volatility: "Low", signal: "Neutral" },
  ],
};

const ROUTES = [
  "Newcastle → Paradip",
  "Richards Bay → Visakhapatnam",
  "Port Hedland → Haldia",
  "Newcastle → Chennai",
  "Richards Bay → Paradip",
];

export const FREIGHT_ROWS: FreightRow[] = Array.from({ length: 48 }, (_, i) => {
  const rnd = seeded(`row-${i}`);
  const d = new Date(Date.UTC(2026, 7, 1 + i));
  const cargo = CARGO_TYPES[i % 3];
  const vessel = VESSEL_CLASSES[i % 4];
  return {
    date: d.toISOString().slice(0, 10),
    route: ROUTES[i % ROUTES.length],
    cargo,
    vessel,
    rate: Number((17 + rnd() * 11).toFixed(2)),
    fuel: Math.round(560 + rnd() * 70),
    condition: (["Clear", "Moderate", "Congested"] as const)[Math.floor(rnd() * 3)],
  };
});

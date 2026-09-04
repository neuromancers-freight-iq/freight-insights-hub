/**
 * FreightIQ service layer.
 *
 * Every function here mirrors a future backend endpoint:
 *   GET  /market-data        -> getMarketData()
 *   POST /forecast           -> postForecast()
 *   POST /voyage-analysis    -> postVoyageAnalysis()
 *   POST /vessel-feasibility -> postVesselFeasibility()
 *   POST /recommendations    -> postRecommendations()
 *
 * Swap the mock bodies for `fetch(API_BASE + path, ...)` calls — the return
 * shapes are the contract the UI depends on.
 */
import {
  MARKET_DATA,
  VESSEL_SPECS,
  baseRate,
  distanceFor,
  marketTrend,
  seeded,
  ALL_PORTS,
} from "./mock-data";
import type {
  FeasibilityRequest,
  FeasibilityResult,
  ForecastRequest,
  ForecastResult,
  MarketData,
  RecommendationResult,
  SeriesPoint,
  VoyageRequest,
  VoyageResult,
} from "./types";

export const API_ENDPOINTS = {
  marketData: "GET /market-data",
  forecast: "POST /forecast",
  voyageAnalysis: "POST /voyage-analysis",
  vesselFeasibility: "POST /vessel-feasibility",
  recommendations: "POST /recommendations",
} as const;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getMarketData(rangeDays = 30): Promise<MarketData> {
  await delay(220);
  return { ...MARKET_DATA, trend: marketTrend(rangeDays) };
}

const HORIZON_DAYS = { "7D": 7, "30D": 30, "90D": 90 } as const;

export async function postForecast(req: ForecastRequest): Promise<ForecastResult> {
  await delay(2100);
  const distance = distanceFor(req.origin, req.destination);
  const rnd = seeded(`${req.cargo}${req.origin}${req.destination}${req.vessel}${req.horizon}`);
  const base = baseRate(req.cargo, req.vessel, distance);
  const changePct = Number(((rnd() - 0.32) * 12).toFixed(1));
  const rate = Number((base * (1 + changePct / 100)).toFixed(2));
  const spread = 0.06 + HORIZON_DAYS[req.horizon] / 900;
  const confidence = Math.round(92 - HORIZON_DAYS[req.horizon] / 12 - rnd() * 6);

  const points = HORIZON_DAYS[req.horizon] <= 7 ? 10 : HORIZON_DAYS[req.horizon] <= 30 ? 18 : 26;
  const series: SeriesPoint[] = [];
  let v = base * 0.94;
  for (let i = points; i > 0; i--) {
    v += (rnd() - 0.42) * base * 0.02;
    series.push({ label: `D-${i}`, historical: Number(v.toFixed(2)) });
  }
  series[series.length - 1] = {
    ...series[series.length - 1],
    forecast: Number(v.toFixed(2)),
    band: [Number(v.toFixed(2)), Number(v.toFixed(2))],
  };
  const steps = Math.round(points * 0.6);
  for (let i = 1; i <= steps; i++) {
    v += ((rate - v) / (steps - i + 1)) + (rnd() - 0.5) * 0.1;
    const s = v * spread * (i / steps + 0.35);
    series.push({
      label: `D+${i}`,
      forecast: Number(v.toFixed(2)),
      band: [Number((v - s).toFixed(2)), Number((v + s).toFixed(2))],
    });
  }

  const direction =
    changePct > 3.5 ? "Bullish" : changePct > 1 ? "Moderately Bullish" : changePct < -3 ? "Bearish" : "Neutral";

  return {
    rate,
    low: Number((rate * (1 - spread)).toFixed(2)),
    high: Number((rate * (1 + spread * 1.2)).toFixed(2)),
    confidence,
    direction,
    changePct,
    series,
    drivers: [
      { name: "Fuel Prices", impact: "High", weight: 82 },
      { name: "Seasonal Demand", impact: "High", weight: 76 },
      { name: "Port Congestion", impact: "Medium", weight: 54 },
      { name: "Vessel Availability", impact: "Medium", weight: 48 },
    ],
    explanation: `The ${req.horizon} outlook for ${req.cargo.toLowerCase()} on ${req.origin} → ${req.destination} indicates ${direction.toLowerCase()} pressure on ${req.vessel} freight, driven primarily by ${changePct >= 0 ? "increasing bulk cargo demand and firm bunker prices" : "softening enquiry volumes and improved open tonnage"}. The projected confidence range reflects uncertainty associated with fuel price fluctuations and discharge-port congestion on the East Coast of India.`,
  };
}

export async function postVoyageAnalysis(req: VoyageRequest): Promise<VoyageResult> {
  await delay(1900);
  const distanceNm = distanceFor(req.origin, req.destination);
  const seaDays = distanceNm / (req.speedKnots * 24);
  const durationDays = seaDays + req.portDays;
  const spec = VESSEL_SPECS[req.vessel];
  const speedAdj = Math.pow(req.speedKnots / 13, 3);
  const fuelMt = seaDays * spec.consumptionPerDay * speedAdj + req.portDays * 4;
  const fuelCost = fuelMt * req.fuelCostPerMt;
  const hire = durationDays * (spec.dwt / 4.2);
  const portCharges = 145000 + req.quantityMt * 0.42;
  const canalAndMisc = 96000;
  const totalCost = fuelCost + hire + portCharges + canalAndMisc;

  return {
    distanceNm,
    durationDays: Number(durationDays.toFixed(1)),
    seaDays: Number(seaDays.toFixed(1)),
    fuelMt: Math.round(fuelMt),
    totalCost,
    costPerMt: Number((totalCost / Math.max(1, req.quantityMt)).toFixed(2)),
    breakdown: [
      { name: "Bunkers", value: Math.round(fuelCost) },
      { name: "Vessel Hire", value: Math.round(hire) },
      { name: "Port & Cargo", value: Math.round(portCharges) },
      { name: "Other / Buffer", value: canalAndMisc },
    ],
    legs: [
      { label: "Port Departure", detail: `${req.origin} — loading & clearance`, days: Number((req.portDays / 2).toFixed(1)) },
      { label: "Ocean Transit", detail: `${distanceNm.toLocaleString()} NM at ${req.speedKnots} kn`, days: Number(seaDays.toFixed(1)) },
      { label: "Port Arrival", detail: `${req.destination} — berthing & discharge`, days: Number((req.portDays / 2).toFixed(1)) },
    ],
  };
}

export async function postVesselFeasibility(req: FeasibilityRequest): Promise<FeasibilityResult> {
  await delay(1800);
  const destPort = ALL_PORTS.find((p) => p.name === req.destination);
  const maxDraft = destPort?.maxDraft ?? 15;
  const capacityRatio = req.quantityMt / Math.max(1, req.capacity);
  const draftMargin = maxDraft - req.draft;

  const capacityScore = capacityRatio > 1 ? 35 : Math.round(60 + capacityRatio * 38);
  const draftScore = draftMargin < 0 ? 28 : Math.min(98, Math.round(62 + draftMargin * 12));
  const portScore = destPort?.congestion === "High" ? 68 : destPort?.congestion === "Moderate" ? 84 : 94;
  const economicsScore = Math.round(72 + (req.dwt / 180000) * 22);
  const riskScore = Math.round((draftScore + portScore) / 2);
  const score = Math.round((capacityScore + draftScore + portScore + economicsScore + riskScore) / 5);

  const status = (s: number, good: "PASS" | "GOOD" = "PASS") =>
    s >= 80 ? good : s >= 60 ? "WATCH" : "FAIL";

  const constraints: string[] = [];
  if (draftMargin < 2) constraints.push(`Destination berth draft at ${req.destination} (${maxDraft} m) should be verified against arrival draft.`);
  if (destPort?.congestion !== "Low") constraints.push("Seasonal port congestion may affect arrival time and laytime exposure.");
  if (capacityRatio > 0.97) constraints.push("Cargo intake is close to stated capacity; confirm stowage factor and constants.");
  if (!constraints.length) constraints.push("No blocking constraints identified for the selected configuration.");

  return {
    score,
    label: score >= 88 ? "Highly Suitable" : score >= 72 ? "Suitable" : score >= 55 ? "Conditionally Suitable" : "Not Recommended",
    checks: [
      { name: "Cargo Capacity", status: status(capacityScore), score: capacityScore, note: `${req.quantityMt.toLocaleString()} MT vs ${req.capacity.toLocaleString()} MT capacity` },
      { name: "Draft Compatibility", status: status(draftScore), score: draftScore, note: `${draftMargin.toFixed(1)} m margin at ${req.destination}` },
      { name: "Port Compatibility", status: status(portScore), score: portScore, note: `${destPort?.congestion ?? "Moderate"} congestion profile` },
      { name: "Voyage Economics", status: status(economicsScore, "GOOD"), score: economicsScore, note: "Cost per MT within route benchmark" },
      { name: "Operational Risk", status: status(riskScore, "GOOD"), score: riskScore, note: riskScore >= 80 ? "LOW exposure" : "MEDIUM exposure" },
    ],
    constraints,
    recommendation: `${req.vessel}-class vessels provide the strongest balance between cargo capacity, port accessibility, and projected voyage economics for ${req.origin} → ${req.destination}.`,
  };
}

export async function postRecommendations(): Promise<RecommendationResult> {
  await delay(2200);
  return {
    strategy:
      "Proceed with Option A. Current analysis indicates the strongest balance between projected freight cost, vessel feasibility, and market risk.",
    reasons: [
      "Lower projected freight cost per metric tonne",
      "High vessel-to-port compatibility on discharge draft",
      "Low operational and weather-window risk",
      "Strong prediction confidence across the 30-day horizon",
    ],
    options: [
      {
        id: "a", letter: "A", cargo: "Coal", origin: "Newcastle", destination: "Paradip", vessel: "Panamax",
        cost: 1_840_000, freightRate: 24.6, risk: "Low", confidence: 87, score: 92, recommended: true,
        notes: ["Best cost-to-risk balance", "Draft margin 2.9 m", "Open tonnage available in Pacific basin"],
      },
      {
        id: "b", letter: "B", cargo: "Coal", origin: "Richards Bay", destination: "Paradip", vessel: "Supramax",
        cost: 1_910_000, freightRate: 25.9, risk: "Medium", confidence: 81, score: 84, recommended: false,
        notes: ["Shorter distance offset by load-port queues", "Higher $/MT on smaller parcel"],
      },
      {
        id: "c", letter: "C", cargo: "Iron Ore", origin: "Port Hedland", destination: "Visakhapatnam", vessel: "Capesize",
        cost: 2_260_000, freightRate: 19.4, risk: "Medium", confidence: 78, score: 79, recommended: false,
        notes: ["Lowest $/MT but larger parcel commitment", "Berth availability window is tight"],
      },
      {
        id: "d", letter: "D", cargo: "Coal", origin: "Newcastle", destination: "Haldia", vessel: "Handysize",
        cost: 1_720_000, freightRate: 28.7, risk: "High", confidence: 72, score: 68, recommended: false,
        notes: ["Draft-restricted discharge port", "Highest freight rate per MT"],
      },
    ],
  };
}

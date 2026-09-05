// Domain types for FreightIQ. Shared by the mock service layer and the UI so a
// real backend can be swapped in without touching components.

export type CargoType = "Coal" | "Iron Ore" | "Steel Products";
export type VesselClass = "Handysize" | "Supramax" | "Panamax" | "Capesize";
export type Signal = "Bullish" | "Neutral" | "Bearish";
export type RiskLevel = "Low" | "Medium" | "High";
export type Horizon = "7D" | "30D" | "90D";

export interface Port {
  code: string;
  name: string;
  country: string;
  maxDraft: number;
  congestion: "Low" | "Moderate" | "High";
}

export interface SeriesPoint {
  label: string;
  historical?: number;
  forecast?: number;
  lower?: number;
  upper?: number;
  band?: [number, number];
}

export interface MarketSignal {
  id: string;
  title: string;
  level: string;
  tone: "positive" | "neutral" | "warning" | "critical";
  detail: string;
}

export interface MarketData {
  index: { name: string; value: number; changePct: number };
  routeRate: { route: string; rate: number; unit: string };
  volatility: { label: string; score: number };
  confidence: number;
  trend: SeriesPoint[];
  insight: string;
  signals: MarketSignal[];
  fuel: { label: string; vlsfo: number; mgo: number }[];
  congestion: { port: string; waitingDays: number }[];
  availability: { class: VesselClass; openVessels: number; demandIndex: number }[];
  demand: { label: string; coal: number; ironOre: number; steel: number }[];
  heatmap: {
    route: string;
    rate: number;
    change7d: number;
    trend30d: number[];
    volatility: RiskLevel;
    signal: Signal;
  }[];
}

export interface ForecastRequest {
  cargo: CargoType;
  origin: string;
  destination: string;
  vessel: VesselClass;
  horizon: Horizon;
}

export interface ForecastResult {
  rate: number;
  low: number;
  high: number;
  confidence: number;
  direction: string;
  changePct: number;
  series: SeriesPoint[];
  drivers: { name: string; impact: "High" | "Medium" | "Low"; weight: number }[];
  explanation: string;
}

export interface VoyageRequest {
  cargo: CargoType;
  quantityMt: number;
  origin: string;
  destination: string;
  vessel: VesselClass;
  speedKnots: number;
  fuelCostPerMt: number;
  portDays: number;
}

export interface VoyageResult {
  distanceNm: number;
  durationDays: number;
  seaDays: number;
  fuelMt: number;
  totalCost: number;
  costPerMt: number;
  breakdown: { name: string; value: number }[];
  legs: { label: string; detail: string; days: number }[];
}

export interface FeasibilityRequest {
  vessel: VesselClass;
  dwt: number;
  draft: number;
  capacity: number;
  origin: string;
  destination: string;
  quantityMt: number;
}

export interface FeasibilityResult {
  score: number;
  label: string;
  checks: { name: string; status: "PASS" | "GOOD" | "WATCH" | "FAIL"; score: number; note: string }[];
  constraints: string[];
  recommendation: string;
}

export interface RecommendationOption {
  id: string;
  letter: string;
  cargo: CargoType;
  origin: string;
  destination: string;
  vessel: VesselClass;
  cost: number;
  freightRate: number;
  risk: RiskLevel;
  confidence: number;
  score: number;
  recommended: boolean;
  notes: string[];
}

export interface RecommendationResult {
  strategy: string;
  options: RecommendationOption[];
  reasons: string[];
}

export interface FreightRow {
  date: string;
  route: string;
  cargo: CargoType;
  vessel: VesselClass;
  rate: number;
  fuel: number;
  condition: "Clear" | "Moderate" | "Congested";
}

export interface VesselMatchRequest {
  origin: string;
  destination: string;
  cargo: CargoType;
  quantityMt: number;
  requiredDate: string;
  contractMonths: number;
}

export interface VesselMatch {
  vessel: VesselClass;
  capacityRange: [number, number];
  portCompatible: boolean;
  portNote: string;
  freightLow: number;
  freightHigh: number;
  waitingDays: number;
  score: number;
  recommended: boolean;
  totalCost: number;
  laden: number;
  factors: { name: string; score: number; note: string }[];
  summary: string;
}

export interface VesselMatchResult {
  matches: VesselMatch[];
  rationale: string;
}

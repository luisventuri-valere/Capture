// ─────────────────────────────────────────────────────────────────────────────
// Pricing module — rich types (GovHub Capture › Pricing tab)
// Frontend-only demo. Data in src/data/capture/pricing-data.ts. ROM math is REAL
// (src/app/components/capture/pricing/romMath.ts). DHS Enterprise Cloud Migration —
// consistent with the Staffing & Past Performance demos (incumbent: Peraton).
// ─────────────────────────────────────────────────────────────────────────────

export type ScenarioKey = 'primary' | 'aggressive' | 'conservative';
export type LaborSource = 'ai-recommended' | 'gsa-calc' | 'staffing-import' | 'user-input';
export type OdcCategory = 'travel' | 'materials' | 'licenses' | 'equipment' | 'facilities' | 'other';
export type OdcFrequency = 'one-time' | 'monthly' | 'annual';
export type DataPointSource = 'FPDS' | 'USAspending' | 'GSA CALC' | 'User input';
export type DataConfidence = 'verified' | 'estimated' | 'inferred';
export type BudgetTrend = 'increasing' | 'stable' | 'decreasing';
export type Severity = 'high' | 'medium' | 'low';
export type MarketPosition = 'at-market' | 'above-market' | 'below-market' | 'extreme';
export type TaStatus = 'signed' | 'verbal' | 'term-sheet' | 'unsigned';

// ─── ROM inputs ──────────────────────────────────────────────────────────────
export interface LaborLine {
  id: string;
  lcat: string;
  qty: number;
  hoursPerYear: number;
  years: number;
  directRate: number;       // $/hr (Base Year)
  escalation: number;       // decimal per year, e.g. 0.03
  source: LaborSource;
}
export interface OdcLine {
  id: string;
  category: OdcCategory;
  description: string;
  qty: number;
  unitCost: number;
  frequency: OdcFrequency;
  years: number;
}
export interface SubLine {
  id: string;
  name: string;
  scope: string;
  workshare: number;        // 0–100 (%)
  totalCost: number;        // 5-year fully-burdened-by-sub cost ($)
  taStatus: TaStatus;
}
export interface IndirectRates {
  fringe: number;           // decimals
  overhead: number;
  ga: number;
  fee: number;
}
export interface ScenarioData {
  key: ScenarioKey;
  label: string;
  description: string;
  years: number;
  labor: LaborLine[];
  odc: OdcLine[];
  subs: SubLine[];
  indirect: IndirectRates;
  basisOfEstimate: string;
  assumptions: string[];
}

// ─── Competitive ─────────────────────────────────────────────────────────────
export interface GsaBenchmark {
  lcat: string;             // matches a LaborLine.lcat
  min: number;              // GSA CALC loaded-rate band ($/hr)
  p25: number;
  median: number;
  p75: number;
  max: number;
  recommendation: string;
}
export interface IncumbentPricing {
  name: string;
  currentValue: number;     // total prior contract
  years: number;
  annualized: number;
  inflationAdjusted: number; // annualized × inflation over our PoP
  analysis: string;
}

// ─── Strategy ────────────────────────────────────────────────────────────────
export interface PriceDataPoint {
  id: string;
  source: DataPointSource;
  dataType: string;
  value: number;
  date: string;
  confidence: DataConfidence;
}
export interface PricingStrategy {
  approach: string;
  positioning: string;
  rationale: string;
  ptw: { low: number; target: number; high: number; confidence: 'high' | 'medium' | 'low' };
  budget: {
    postedEstimate: number;
    igceEstimate: number;
    historicalSpending: number;
    trend: BudgetTrend;
    trendRationale: string;
  };
  risks: { text: string; severity: Severity }[];
  opportunities: { text: string; severity: Severity }[];
  recommendations: string[];
  dataPoints: PriceDataPoint[];
}

// ─── Opportunity + root ──────────────────────────────────────────────────────
export interface PricingOpportunity {
  title: string;
  agency: string;
  subAgency: string;
  naics: string;
  contractType: string;
  setAside: string;
  period: string;
  postedCeiling: number;
}
export interface PricingData {
  opportunity: PricingOpportunity;
  strategy: PricingStrategy;
  scenarios: ScenarioData[];      // primary, aggressive, conservative
  benchmarks: GsaBenchmark[];
  incumbent: IncumbentPricing;
  suggestedOdcs: OdcLine[];       // for "Suggest ODCs"
  scenarioWinNotes: Record<ScenarioKey, string>; // win-probability overlay text
  pricePosition: { quadrant: string; note: string }; // price/risk quadrant
}

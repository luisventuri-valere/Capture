// ─────────────────────────────────────────────────────────────────────────────
// Past Performance module — rich types (GovHub Capture › Past Performance tab)
// Frontend-only demo. Data hardcoded in src/data/capture/pp-data.ts.
// DHS Enterprise Cloud Migration opportunity (consistent with the Staffing demo).
// ─────────────────────────────────────────────────────────────────────────────

export type ContractType = 'CPFF' | 'FFP' | 'T&M' | 'IDIQ' | 'BPA';
export type RolePerformed = 'prime' | 'sub' | 'key_personnel';
export type CparsRating = 'Exceptional' | 'Very Good' | 'Satisfactory' | 'Marginal' | 'Unsatisfactory' | 'Not Rated';
export type RefSource = 'company' | 'teammate';
export type SelectionRecommendation = 'Strongly recommended' | 'Recommended' | 'Alternative' | 'Not recommended';
export type CoverageStrength = 'strong' | 'moderate' | 'partial' | 'none';
export type CoverageLevel = 'Strong' | 'Moderate' | 'GAP';

// ─── View 1 · PP Library entry ───────────────────────────────────────────────
export interface PPLibraryEntry {
  id: string;
  projectTitle: string;
  clientAgency: string;
  clientOffice: string;
  contractNumber: string;
  contractType: ContractType;
  contractValue: number;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
  durationMonths: number;
  projectDescription: string;
  rolePerformed: RolePerformed;
  workPerformed: string;
  cparsRating: CparsRating;
  cparsScore: number; // 1–5
  deliveryPerformance: string;
  budgetPerformance: string;
  customerSatisfaction: number; // 0–100
  technicalSimilarityTags: string[];
  scopeSimilarityTags: string[];
  naicsCodes: string[];
  clientContactName: string;
  clientContactTitle: string;
  clientContactEmail: string;
  clientContactPhone: string;
  source: RefSource;
  sourceCompanyName: string;
}

// ─── View 2 · scored relevance + coverage ────────────────────────────────────
export interface ScoredReference {
  referenceId: string;
  overallRelevanceScore: number; // 0–100
  scopeRelevance: number;
  sizeRelevance: number;
  complexityRelevance: number;
  agencyRelevance: number;
  recencyScore: number;
  performanceScore: number;
  requirementsCovered: string[]; // requirement ids
  relevanceRationale: string;
  selectionRecommendation: SelectionRecommendation;
  concerns: string[];
}

export interface RequirementCoverage {
  requirementId: string;
  requirement: string;
  perReference: Record<string, CoverageStrength>; // refId → strength
  coverage: CoverageLevel;
  evidence: Record<string, string>; // refId → evidence text
}

// ─── View 3 · narratives ─────────────────────────────────────────────────────
// quality checklist keys (the 6 items)
export type QualityKey =
  | 'contractInfo' | 'contactInfo' | 'relevance3plus'
  | 'metrics3plus' | 'cparsReferenced' | 'howLanguage';

// editable narrative section keys (used by "Strengthen")
export type NarrativeSection = 'relevanceNarrative' | 'performanceNarrative' | 'lessonsLearnedNarrative';

export interface PPNarrative {
  referenceId: string;
  contractInfoBlock: string;
  contactInfoBlock: string;
  relevanceNarrative: string;
  performanceNarrative: string;
  lessonsLearnedNarrative: string;
  qualityScore: number; // 0–100
  requirementsAddressed: string[]; // requirement ids
  metricsIncluded: string[];
  qualityChecklist: Record<QualityKey, boolean>;
  improvedVersions: Record<NarrativeSection, string>;
  // section quality tone for highlighting: green / yellow / red
  sectionQuality: Record<NarrativeSection, 'strong' | 'moderate' | 'weak'>;
}

// ─── Opportunity + RFP rules + requirements ──────────────────────────────────
export interface PPRequirement { id: string; label: string }
export interface RfpPpRules { maxReferences: number; recency: string; sizeThreshold: string }
export interface OptimizeResult { selectedIds: string[]; note: string }

export interface PPOpportunity {
  title: string;
  agency: string;
  subAgency: string;
  value: number;
  role: string;
  phase: string;
  naics: string;
}

// ─── Root ────────────────────────────────────────────────────────────────────
export interface PPData {
  opportunity: PPOpportunity;
  rfpRules: RfpPpRules;
  cparsDisclaimer: string;
  requirements: PPRequirement[];
  library: PPLibraryEntry[];
  scored: ScoredReference[];
  coverage: RequirementCoverage[];
  narratives: PPNarrative[];
  optimize: OptimizeResult;
  // mock data used by "AI: Populate from contract number" in the Add Reference form
  aiPrefill: Partial<PPLibraryEntry>;
}

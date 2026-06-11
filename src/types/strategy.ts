// ─── Shared ───────────────────────────────────────────────────────────────────

export type SectionStatus = 'CONFIRMED' | 'NEEDS_REVIEW' | 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING' | 'MONITORING' | 'ACTIVE' | 'NEGOTIATING' | 'CONTACTED' | 'IDENTIFIED' | 'SOURCING' | 'PARTNER' | 'LOI_SIGNED' | 'ON_TRACK';

export interface COR {
  name: string;
  phone: string;
  email: string;
}

// ─── §1 Strategic Positioning ─────────────────────────────────────────────────

export interface PwinPoint {
  date: string;
  pwin: number;
  trigger: string;
}

export interface Positioning {
  primeOrSub: string;
  vehicle: string;
  setAsideCategory: string;
  sbTarget: number;
  sbTargetBasis: string;
  naics: string;
  pscCode: string;
  competitionType: string;
  pwin: number;
  pwinHistory: PwinPoint[];
  targetAwardDate: string;
  contractType: string;
  estimatedValue: number;
  baseYearValue: number;
  optionYearValue: number;
  periodOfPerformance: string;
}

export interface StrategicPositioningSection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  positioning: Positioning;
}

// ─── §2 Win Strategy ──────────────────────────────────────────────────────────

export interface WinTheme {
  id: string;
  theme: string;
  narrative: string;
  evidenceAnchors: string[];
  evaluationFactorTarget: string;
  strengthRating: string;
}

export interface Discriminator {
  id: string;
  discriminator: string;
  category: string;
  impact: string;
  proof: string;
  competitorGap: string;
}

export interface WinStrategySection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  winThemes: WinTheme[];
  discriminators: Discriminator[];
}

// ─── §3 Team Strategy ─────────────────────────────────────────────────────────

export interface CapabilityGap {
  id: string;
  gap: string;
  severity: string;
  description: string;
  recommendation: string;
  status: SectionStatus;
  targetPartner: string;
}

export interface RecommendedPartner {
  name: string;
  role: string;
  workshare: number;
  rationale: string;
  status: SectionStatus;
  riskLevel: string;
  riskNotes: string;
}

export interface TeamStrategySection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  nextReviewDate?: string;
  capabilityGaps: CapabilityGap[];
  recommendedPartners: RecommendedPartner[];
}

// ─── §4 Customer Engagement ───────────────────────────────────────────────────

export interface KeyRelationship {
  name: string;
  title: string;
  organization: string;
  relationshipStrength: string;
  lastContact: string | null;
  contactMethod: string | null;
  notes: string;
  nextAction: string;
  nextActionDate: string | null;
  owner: string;
}

export interface CustomerEngagementSection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  nextReviewDate?: string;
  keyRelationships: KeyRelationship[];
}

// ─── §5 Staffing Strategy ─────────────────────────────────────────────────────

export interface CriticalPosition {
  lcat: string;
  designation: string;
  clearance: string;
  status: SectionStatus;
  candidate: string | null;
  source: string;
  startDate: string;
  notes: string;
}

export interface ClearancePipeline {
  tsScicurrent: number;
  secretCurrent: number;
  inProcess: number;
  averageTimeToFill: string;
  recruitingPartners: string[];
}

export interface StaffingStrategySection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  nextReviewDate?: string;
  criticalPositions: CriticalPosition[];
  clearancePipeline: ClearancePipeline;
}

// ─── §6 Past Performance ──────────────────────────────────────────────────────

export interface LeadReference {
  contractName: string;
  contractNumber: string;
  agency: string;
  component: string;
  contractValue: number;
  contractType: string;
  periodOfPerformance: string;
  cparsRating: string;
  relevance: string;
  relevanceFactors: string[];
  cor: COR;
  highlights: string[];
}

export interface PartnerReference {
  partner: string;
  contractName: string;
  contractNumber: string;
  agency: string;
  contractValue: number;
  cparsRating: string;
  relevance: string;
  highlights: string[];
}

export interface PastPerformanceSection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  leadReferences: LeadReference[];
  partnerReferences: PartnerReference[];
}

// ─── §7 Pricing Strategy ──────────────────────────────────────────────────────

export interface CompetitorRateEstimate {
  competitor: string;
  estimatedRate: number;
  basis: string;
}

export interface MarginTargets {
  overall: number;
  keyPersonnel: number;
  commodityLabor: number;
  odcs: number;
  subcontractors: number;
}

export interface PricingStrategySection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  nextReviewDate?: string;
  priceToWin: number;
  ptw_basis: string;
  philosophy: string;
  blendedRate: number;
  competitorRateEstimates: CompetitorRateEstimate[];
  marginTargets: MarginTargets;
  pricingRisks: string[];
}

// ─── §8 Timeline ──────────────────────────────────────────────────────────────

export interface Milestone {
  id: string;
  milestone: string;
  date: string;
  status: SectionStatus;
  owner: string;
  notes: string;
  deliverables: string[];
}

export interface TimelineSection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  milestones: Milestone[];
}

// ─── §9 Risk Register ─────────────────────────────────────────────────────────

export interface Risk {
  id: string;
  risk: string;
  category: string;
  likelihood: string;
  likelihoodScore: number;
  impact: string;
  impactScore: number;
  riskScore: number;
  mitigation: string;
  contingency: string;
  owner: string;
  status: SectionStatus;
  lastUpdated: string;
}

export interface RiskRegisterSection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  nextReviewDate?: string;
  risks: Risk[];
}

// ─── §10 Resource Plan ────────────────────────────────────────────────────────

export interface BpCategory {
  category: string;
  budget: number;
  spent: number;
}

export interface TeamMember {
  name: string;
  role: string;
  allocation: number;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface ResourcePlanSection {
  status: SectionStatus;
  lastReviewed: string;
  reviewedBy: string;
  bpBudget: number;
  bpSpentToDate: number;
  bpBurnRate: number;
  bpProjectedTotal: number;
  bpCategories: BpCategory[];
  teamMembers: TeamMember[];
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface StrategyData {
  id: string;
  noticeId: string;
  title: string;
  lastUpdated: string;
  captureManager: string;
  capturePhase: string;
  overallStatus: SectionStatus;
  sections: {
    strategicPositioning: StrategicPositioningSection;
    winStrategy: WinStrategySection;
    teamStrategy: TeamStrategySection;
    customerEngagement: CustomerEngagementSection;
    staffingStrategy: StaffingStrategySection;
    pastPerformance: PastPerformanceSection;
    pricingStrategy: PricingStrategySection;
    timeline: TimelineSection;
    riskRegister: RiskRegisterSection;
    resourcePlan: ResourcePlanSection;
  };
}

// ─── Sidebar meta (display labels not in JSON) ────────────────────────────────

export const SECTION_META: Array<{ key: keyof StrategyData['sections']; number: number; title: string; feeds: string[] }> = [
  { key: 'strategicPositioning', number: 1,  title: 'Strategic Positioning', feeds: ['Teaming', 'Pricing'] },
  { key: 'winStrategy',          number: 2,  title: 'Win Strategy',          feeds: ['Solutioning'] },
  { key: 'teamStrategy',         number: 3,  title: 'Team Strategy',         feeds: ['Teaming'] },
  { key: 'customerEngagement',   number: 4,  title: 'Customer Engagement',   feeds: ['Teaming'] },
  { key: 'staffingStrategy',     number: 5,  title: 'Staffing Strategy',     feeds: ['Staffing'] },
  { key: 'pastPerformance',      number: 6,  title: 'Past Performance',      feeds: ['PP'] },
  { key: 'pricingStrategy',      number: 7,  title: 'Pricing Strategy',      feeds: ['Pricing'] },
  { key: 'timeline',             number: 8,  title: 'Timeline & Milestones', feeds: ['Solutioning'] },
  { key: 'riskRegister',         number: 9,  title: 'Risk Register',         feeds: ['Solutioning'] },
  { key: 'resourcePlan',         number: 10, title: 'Resource Plan & B&P',   feeds: ['Pricing'] },
];

// UI-normalised status (for sidebar dot / badge)
export type UiStatus = 'confirmed' | 'needs_review' | 'draft';

export function toUiStatus(raw: SectionStatus | undefined): UiStatus {
  if (!raw) return 'draft';
  const s = raw.toUpperCase();
  if (s === 'CONFIRMED') return 'confirmed';
  if (s === 'NEEDS_REVIEW' || s === 'MONITORING' || s === 'ACTIVE') return 'needs_review';
  return 'draft';
}

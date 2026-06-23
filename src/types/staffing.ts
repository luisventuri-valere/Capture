// ─────────────────────────────────────────────────────────────────────────────
// Staffing module — rich types (GovHub Capture › Staffing tab)
// Frontend-only demo. All data hardcoded in src/data/capture/staffing-data.ts.
// ─────────────────────────────────────────────────────────────────────────────

export type LcatClassification = 'discriminator' | 'critical' | 'commodity';

// Derived per LCAT from its candidates + quantity (see lib/staffing-helpers)
export type LcatStatus = 'ready' | 'partial' | 'reviewing' | 'sourcing' | 'gap';

export type DocStatus = 'complete' | 'draft' | 'not_started';

export type CandidateSource = 'internal' | 'external' | 'incumbent' | 'referral' | 'partner';

export type CandidateStatus = 'committed' | 'submitted' | 'reviewing' | 'sourcing' | 'rejected';

export type ClearanceStatus = 'active' | 'upgrade_needed' | 'pending';

export type UserRole = 'BD' | 'Recruiting' | 'Capture' | 'HR';

export type Recommendation = 'STRONG RECOMMEND' | 'RECOMMEND' | 'CONDITIONAL' | 'BACKUP ONLY';

export type LoiStatus = 'signed' | 'sent' | 'not_sent';

export type FlightRisk = 'high' | 'medium' | 'low';

export type IncumbentStatus = 'not_contacted' | 'contacted' | 'interested' | 'in_pipeline' | 'not_pursued';

// ─── Candidate ───────────────────────────────────────────────────────────────

export interface CandidateNote {
  id: string;
  userName: string;
  userRole: UserRole;
  text: string;
  date: string; // ISO yyyy-mm-dd
}

export interface AiAnalysis {
  recommendation: Recommendation;
  recommendationDetail: string;
  competitiveAdvantage: string;
  strengths: string[];
  concerns: string[];
  interviewQuestions: string[];
  resumeClarifications: string[];
}

export interface Candidate {
  id: string;
  lcatId: string;
  name: string;
  rank: number;
  source: CandidateSource;
  status: CandidateStatus;
  education: string;
  yearsExp: number;
  certifications: string[];
  clearance: string;
  clearanceStatus: ClearanceStatus;
  salaryExpectation: number;
  matchScore: number; // 0–100
  aiAnalysis: AiAnalysis;
  loiStatus: LoiStatus;
  notes: CandidateNote[];
  // Set when this candidate was moved in from the incumbent sub-list (Change 2).
  // Lets the move be reversed — returning the person to their LCAT's incumbent list.
  incumbentPersonId?: string;
}

// ─── LCAT (labor category) ───────────────────────────────────────────────────

export interface LcatRequirements {
  education: string;
  yearsExp: number;
  certifications: string[];
  clearance: string;
  location: string;
}

export interface LcatDocuments {
  jobReq: DocStatus;
  interviewQs: DocStatus;
  evalCriteria: DocStatus;
  handoffPackage: DocStatus;
}

export interface SalaryRange {
  min: number;
  max: number;
}

export interface LCAT {
  id: string;
  title: string;
  isKeyPersonnel: boolean;
  classification: LcatClassification;
  quantity: number;
  requirements: LcatRequirements;
  salaryRange: SalaryRange;
  status: LcatStatus; // seed value; UI recomputes from candidates
  filledCount: number; // seed value; UI recomputes from candidates
  documents: LcatDocuments;
  candidates: Candidate[];
}

// ─── Salary intelligence ─────────────────────────────────────────────────────

export interface SalaryBenchmark {
  lcatId: string;
  gsaCalc: { low: number; mid: number; high: number };
  glassdoor: { low: number; mid: number; high: number; region: string };
  competitors: Record<string, number>;
  recommendation: string;
}

// ─── Incumbent intelligence ──────────────────────────────────────────────────

export interface IncumbentPerson {
  id: string;
  name: string;
  role: string;
  tenure: string;
  flightRisk: FlightRisk;
  status: IncumbentStatus;
  estimatedSalary: number;
  note?: string;
  // The LCAT this incumbent matches — recruiting is always scoped to that position
  // (Change 2). People with no matching open LCAT are omitted from the UI.
  lcatId?: string;
}

export interface FlightRiskIndicator {
  type: 'negative' | 'neutral' | 'positive';
  text: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Incumbent {
  contractor: string;
  contractValue: number;
  period: string;
  staffCount: number;
  flightRiskIndicators: FlightRiskIndicator[];
  people: IncumbentPerson[];
}

// ─── Opportunity + timeline ──────────────────────────────────────────────────

export interface Opportunity {
  title: string;
  agency: string;
  subAgency: string;
  value: number;
  role: string;
  phase: string;
  naics: string;
  daysToProposal: number;
}

export interface ClearanceLeadTime {
  label: string;
  minMonths: number;
  maxMonths: number;
}

export interface TimelineData {
  currentDate: string;
  rfpRelease: string;
  proposalDue: string;
  award: string;
  clearanceLeadTimes: ClearanceLeadTime[];
}

// ─── Root ────────────────────────────────────────────────────────────────────

export interface StaffingData {
  opportunity: Opportunity;
  incumbent: Incumbent;
  lcats: LCAT[];
  salaryBenchmarks: SalaryBenchmark[];
  timeline: TimelineData;
}

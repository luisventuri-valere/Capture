// ─────────────────────────────────────────────────────────────────────────────
// Data Calls module — types (GovHub Capture › Data Calls tab)
// Frontend-only demo. A "data call" is a structured request a prime sends a teaming
// partner (resumes, past performance, rate cards, certs). The signature concept is
// the TWO-PHASE split (Pre-TA vs Post-TA) with trust-tier enforcement.
// Data in src/data/capture/datacalls-data.ts. VA Healthcare Analytics Platform.
// ─────────────────────────────────────────────────────────────────────────────

export type Phase = 'pre-ta' | 'post-ta';
export type TrustTier = 'NDA' | 'TA' | 'PREFERRED';
export type Format = 'PDF' | 'Word' | 'Excel' | 'Form' | 'Visio' | 'Any';
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type DataCallType =
  | 'PAST_PERFORMANCE' | 'RESUME' | 'PRICING' | 'TECHNICAL' | 'COMPLIANCE' | 'EVALUATION' | 'CUSTOM';
export type DataCallStatus = 'DRAFT' | 'SENT' | 'ACKNOWLEDGED' | 'PARTIAL' | 'COMPLETE';
export type ItemStatus =
  | 'PENDING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'REVISION_REQUESTED';

export type RecType = 'gap' | 'clarification' | 'comparison' | 'risk' | 'quality' | 'timing';
export type RecScope = 'single' | 'cross-team';
export type ActionType = 'create_dc' | 'send_reminder' | 'escalate' | 'modify_dc' | 'dismiss';
export type RecStatus = 'active' | 'dismissed' | 'acted_on';
export type AIScope = 'all' | 'partner' | 'call' | 'item';

// ─── Partners ────────────────────────────────────────────────────────────────
export interface PartnerContact { name: string; email: string; phone: string; }
export interface Partner {
  id: string;
  name: string;
  specialty: string;
  sbStatus: string;            // e.g. "SDVOSB", "8(a) small business"
  trustTier: TrustTier;
  agreementStatus: string;     // e.g. "NDA + TA signed", "NDA only — no TA"
  primaryContact: PartnerContact;
  phase: Phase;
}

// ─── Templates ───────────────────────────────────────────────────────────────
export interface TemplateItem {
  id: string;
  description: string;
  format: Format;
  required: boolean;
  guidanceNotes?: string;
}
export interface DataCallTemplate {
  id: string;
  name: string;
  phase: Phase;
  category: 'EVALUATION' | 'PROPOSAL';
  description: string;
  purpose: string;
  matchScore: number;          // 0–100 AI match
  suggestedDurationDays: number;
  items: TemplateItem[];
  rfpReferences?: string[];     // Post-TA: Section L/M refs
  trustTierMinimum: 'NDA' | 'TA';
}

// ─── Data calls + items ──────────────────────────────────────────────────────
export interface DataCallItem {
  id: string;                   // "DC-001-A"
  dataCallId: string;
  description: string;
  format: Format;
  required: boolean;
  status: ItemStatus;
  submittedDate?: string;
  qualityScore?: number;        // 0–100
  qualityNotes?: string;
}
export interface DataCall {
  id: string;                   // "DC-001"
  partnerId: string;
  title: string;
  phase: Phase;
  type: DataCallType;
  status: DataCallStatus;
  priority: Priority;
  templateId?: string;
  instructions: string;
  items: DataCallItem[];
  sentDate: string;
  dueDate: string;
  deliveryMethod: string;
  notes: string;
}

// ─── AI recommendations engine ───────────────────────────────────────────────
export interface AIRecommendation {
  id: string;
  type: RecType;
  severity: Severity;
  scope: RecScope;
  partnerIds: string[];
  dataCallIds: string[];
  title: string;
  detail: string;
  recommendation: string;
  suggestedAction: string;      // button label
  actionType: ActionType;
  status: RecStatus;
}

// ─── Contextual AI (4 scope levels) ──────────────────────────────────────────
export interface ContextAIAnswer {
  scope: AIScope;
  scopeId: string;              // id of the all/partner/call/item the answer is about
  prompt: string;
  answer: string;
}

// ─── Actions queue + activity log ────────────────────────────────────────────
export interface QueuedAction {
  id: string;
  label: string;
  priority: Priority;
  source: 'manual' | 'ai_rec';
  sourceRecId?: string;
  done: boolean;
}
export interface ActivityEvent {
  id: string;
  timestamp: string;            // ISO around the Feb 14 "today"
  type: string;                 // e.g. "submission", "reminder", "quality_review", "accept", "override"
  description: string;
}

// ─── Collection strategy (Section 1) ─────────────────────────────────────────
export interface StrategyPriority {
  id: string;
  label: string;
  phase: Phase;
  deadline: string;
  blocks: string;               // downstream work this blocks
}
export interface CollectionStrategy {
  provenance: 'AI Generated' | 'User Confirmed';
  summary: string;
  priorities: StrategyPriority[];
  phaseGuidance: { preTa: string; postTa: string };
}

// ─── Opportunity + root ──────────────────────────────────────────────────────
export interface DataCallsOpportunity {
  title: string;
  agency: string;
  subAgency: string;
  value: string;               // "$22.5M"
  role: string;                // "Prime"
  naics: string;
  today: string;               // "2026-02-14"
  timeline: { pinkTeam: string; redTeam: string; goldTeam: string; proposalDue: string };
}
export interface DataCallsData {
  opportunity: DataCallsOpportunity;
  strategy: CollectionStrategy;
  partners: Partner[];
  templates: DataCallTemplate[];
  dataCalls: DataCall[];
  recommendations: AIRecommendation[];
  contextAnswers: ContextAIAnswer[];
  activityLog: ActivityEvent[];
  queuedActions: QueuedAction[];
}

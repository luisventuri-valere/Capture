// Verbatim from CAPTURE_PROMPT_02_TEAMING_v2.md — do not alter values
export interface EnvSource  { label: string }
export interface EnvVH      { version: number; changed_at: string; changed_by: string; change_summary: string }
export interface EnvRec     { id: string; text: string; status: 'accepted' | 'proposed' | 'rejected' }
export interface EnvConflict { type?: string; message: string }

export interface SectionEnv {
  confidence: number;
  ai_reasoning: string;
  sources: EnvSource[];
  version_history: EnvVH[];
  recommendations: EnvRec[];
  conflicts: EnvConflict[];
}

export interface TeamingEnvelope {
  overall_confidence: number;
  generated_by: string;
  sections: {
    teamingStrategy: SectionEnv;
    capabilityGaps: SectionEnv;
    partnerPipeline: SectionEnv;
    workshareSmallBusiness: SectionEnv;
  };
}

export const TEAMING_ENVELOPE: TeamingEnvelope = {
  overall_confidence: 71,
  generated_by: "Teaming Intelligence Agent · v3 · 2026-02-10",
  sections: {
    teamingStrategy: {
      confidence: 80,
      ai_reasoning: "Prime is the correct posture: TechForward's active 8(a), FedRAMP High ATO, and DHS Exceptional CPARS clear the largest barriers, and the three subcontractors close discrete gaps without touching the SSE/cloud discriminators TechForward owns. The 55/20/15/10 split keeps the prime majority while the 35% SB target clears the 33% DHS OSDBU floor with margin.",
      sources: [
        { label: "CSA-001 Strategy — Section 3 cascade" },
        { label: "SAM.gov — entity registrations & set-aside" },
        { label: "DHS OSDBU subcontracting guidance" },
      ],
      version_history: [{ version: 1, changed_at: "2026-02-10", changed_by: "agent", change_summary: "Generated from CSA-001 team strategy cascade" }],
      recommendations: [
        { id: "TS-R1", text: "Confirm Prime Contractor approach — 8(a) + FedRAMP High ATO + DHS past performance", status: "accepted" },
        { id: "TS-R2", text: "Confirm 35% SB subcontracting target — exceeds the 33% DHS OSDBU floor", status: "accepted" },
        { id: "TS-R3", text: "Confirm the 3-subcontractor structure: DataBridge 20% / GovFlow 15% / MainframeNext 10%", status: "proposed" },
      ],
      conflicts: [],
    },
    capabilityGaps: {
      confidence: 72,
      ai_reasoning: "The three gaps map cleanly to the 340+ application inventory: data migration at ~2x TechForward's prior scale (CG-01, HIGH), DHS-specific ServiceNow workflows (CG-02), and 12 z/OS mainframe apps TechForward has no past performance for (CG-03). CG-01 and CG-02 are filling; CG-03 is still identifying because MainframeNext's NDA is unsigned, which holds section confidence below the strategy section.",
      sources: [
        { label: "Draft PWS / RFP analysis" },
        { label: "CPB-001 — own-capability baseline" },
        { label: "USAspending — subaward history" },
      ],
      version_history: [{ version: 1, changed_at: "2026-02-10", changed_by: "agent", change_summary: "Gap analysis from PWS task areas" }],
      recommendations: [
        { id: "CG-R1", text: "Fill CG-01 (Data Migration & ETL) with DataBridge — incumbent sub knowledge of all legacy schemas", status: "proposed" },
        { id: "CG-R2", text: "Fill CG-02 (ServiceNow) with GovFlow — Very Good DHS CPARS on the exact platform", status: "proposed" },
        { id: "CG-R3", text: "Source CG-03 (Mainframe) with MainframeNext; hold Astadia Federal as alternate", status: "proposed" },
      ],
      conflicts: [],
    },
    partnerPipeline: {
      confidence: 58,
      ai_reasoning: "One of five partners is Committed (DataBridge, verbal — TA in legal review), two are mid-pipeline (GovFlow evaluating, MainframeNext contacted), one is on OCI hold (Coalfire), and one is newly identified (Nightwing). No teaming agreement is signed yet and CACI/Vertex is competing for DataBridge and GovFlow, which is why this section needs attention despite a strong target structure.",
      sources: [
        { label: "ENT-001 — partner profiles" },
        { label: "USAspending — partner contract history" },
        { label: "SAM.gov — UEI / CAGE / certifications" },
        { label: "DHS OSDBU matchmaking event" },
        { label: "Competitive intel — CMP-001" },
      ],
      version_history: [{ version: 1, changed_at: "2026-02-10", changed_by: "agent", change_summary: "Pipeline seeded from strategy + entity recommendations" }],
      recommendations: [
        { id: "PP-R1", text: "Accelerate DataBridge TA to signature before CACI/Vertex — verbal commit, TA in legal review (est. 2026-02-15)", status: "proposed" },
        { id: "PP-R2", text: "Advance GovFlow from term sheet to TA (est. 2026-02-20); lock before competitor approach", status: "proposed" },
        { id: "PP-R3", text: "Resolve Coalfire OCI review before any commitment — if confirmed as Peraton's 3PAO, decline", status: "accepted" },
        { id: "PP-R4", text: "Defer Nightwing (FinOps) unless capture review flags FinOps as a gap — TechForward has internal FinOps capability", status: "proposed" },
      ],
      conflicts: [
        { type: "oci_risk", message: "Coalfire Federal may be Peraton's current FedRAMP 3PAO — a potential Organizational Conflict of Interest. OCI review is in progress; if confirmed, Coalfire cannot participate. Leidos has already approached Coalfire for its NexGen team." },
      ],
    },
    workshareSmallBusiness: {
      confidence: 85,
      ai_reasoning: "The allocation sums to 100% / $45.0M across prime and three subs, and the entire team is small business, so 100% of workshare counts toward DHS goals against a 35% target. Dual-credit categories (TechForward counts toward both 8(a) and SDVOSB) maximize socioeconomic goal achievement — a clean, evaluator-friendly story.",
      sources: [
        { label: "Workshare allocation engine" },
        { label: "SAM.gov — socioeconomic certifications" },
      ],
      version_history: [{ version: 1, changed_at: "2026-02-10", changed_by: "agent", change_summary: "Computed from committed + proposed workshare" }],
      recommendations: [
        { id: "WS-R1", text: "Confirm 55/20/15/10 workshare allocation ($24.75M / $9.0M / $6.75M / $4.5M)", status: "proposed" },
        { id: "WS-R2", text: "Confirm 100% SB team strategy; document dual-credit categories for DHS socioeconomic goals", status: "accepted" },
      ],
      conflicts: [],
    },
  },
};

// Stage ordering for the kanban
export const KANBAN_STAGES = [
  'Identified',
  'Contacted',
  'Negotiating',
  'NDA_Signed',
  'TA_Signed',
  'Committed',
  'Declined',
] as const;

export type KanbanStage = typeof KANBAN_STAGES[number];

export const STAGE_LABELS: Record<KanbanStage, string> = {
  Identified:   'Identified',
  Contacted:    'Contacted',
  Negotiating:  'Negotiating',
  NDA_Signed:   'NDA Signed',
  TA_Signed:    'TA Signed',
  Committed:    'Committed',
  Declined:     'Declined',
};

// Section metadata for the sidebar index
export const TEAMING_SECTION_META = [
  { key: 'teamingStrategy'       as const, number: 1, title: 'Teaming Strategy',         feeds: ['Solutioning', 'Pricing'] },
  { key: 'capabilityGaps'        as const, number: 2, title: 'Capability Gaps',           feeds: ['Solutioning', 'Staffing'] },
  { key: 'partnerPipeline'       as const, number: 3, title: 'Partner Pipeline',          feeds: ['Staffing', 'Data Calls'] },
  { key: 'workshareSmallBusiness' as const, number: 4, title: 'Workshare & Small Business', feeds: ['Pricing', 'Proposal'] },
] as const;

export type TeamingSectionKey = typeof TEAMING_SECTION_META[number]['key'];

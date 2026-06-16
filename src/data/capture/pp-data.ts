// ─────────────────────────────────────────────────────────────────────────────
// Past Performance module — data (GovHub Capture › Past Performance tab)
// Frontend-only demo. DHS Enterprise Cloud Migration opportunity.
// Factual anchor: opp-001-pastperformance.json (PP-01..PP-05) + 1 generated (PP-06).
// All CPARS ratings are estimated — public data inference (see cparsDisclaimer).
// ─────────────────────────────────────────────────────────────────────────────

import type { PPData } from '../../types/pastPerformance';

export const ppData: PPData = {
  // ─── Opportunity ───────────────────────────────────────────────────────────
  opportunity: {
    title: 'Enterprise Cloud Migration and Modernization Services',
    agency: 'Department of Homeland Security',
    subAgency: 'Office of the CIO (OCIO)',
    value: 45000000,
    role: 'Prime',
    phase: 'Proposal Development',
    naics: '541512',
  },

  // ─── RFP past-performance rules ──────────────────────────────────────────────
  rfpRules: {
    maxReferences: 5,
    recency: 'Within the last 5 years',
    sizeThreshold: '$5M minimum',
  },

  // ─── CPARS disclaimer (verbatim from source JSON) ────────────────────────────
  cparsDisclaimer:
    'All CPARS ratings shown are estimated — public data inference. Direct CPARS access is government-restricted; ratings are inferred from public award data, agency reporting, and reference confirmations, never pulled from the CPARS system of record.',

  // ─── Requirements (DHS cloud-migration evaluation factors) ───────────────────
  requirements: [
    { id: 'R1', label: 'Cloud Migration at Scale (AWS GovCloud / Azure Government)' },
    { id: 'R2', label: 'FedRAMP High & Continuous ATO' },
    { id: 'R3', label: 'Zero Trust Architecture (ZTA)' },
    { id: 'R4', label: 'Data Migration & ETL (legacy schemas)' },
    { id: 'R5', label: 'ServiceNow / ITSM Workflow Integration' },
    { id: 'R6', label: 'Agile Delivery & Transition at Scale' },
  ],

  // ─── View 1 · PP Library (6 entries, PP-01..PP-06) ───────────────────────────
  library: [
    {
      id: 'PP-01',
      projectTitle: 'DHS Cybersecurity Modernization',
      clientAgency: 'Department of Homeland Security',
      clientOffice: 'CISA',
      contractNumber: '70RCSA23C00000123',
      contractType: 'IDIQ',
      contractValue: 12500000,
      startDate: '2023-02-01',
      endDate: '2026-01-31',
      durationMonths: 36,
      projectDescription:
        'Enterprise cybersecurity modernization for DHS CISA: design and operation of a zero trust architecture across the agency security boundary, with continuous monitoring and FedRAMP High continuous-ATO support. Same department and same security regime as the Enterprise Cloud Migration pursuit.',
      rolePerformed: 'prime',
      workPerformed:
        'Architected and deployed Zero Trust Architecture to NIST 800-207 Level 3 across the CISA boundary in 8 months; stood up continuous monitoring achieving 15-minute mean-time-to-detect; maintained the FedRAMP High continuous ATO and supported quarterly control assessments.',
      cparsRating: 'Exceptional',
      cparsScore: 5,
      deliveryPerformance:
        'All milestones met or beaten; ZTA Level 3 delivered in 8 months against a 12-month baseline. No corrective action requests on record.',
      budgetPerformance: 'Delivered within budget across all option years; zero cost-overrun modifications.',
      customerSatisfaction: 96,
      technicalSimilarityTags: ['Zero Trust', 'FedRAMP High', 'Continuous ATO', 'Continuous Monitoring', 'NIST 800-207'],
      scopeSimilarityTags: ['DHS prime', 'Same agency', 'Security modernization', 'Active contract'],
      naicsCodes: ['541512', '541519'],
      clientContactName: 'Michelle Adams',
      clientContactTitle: 'Contracting Officer Representative (COR)',
      clientContactEmail: 'michelle.adams@cisa.dhs.gov',
      clientContactPhone: '202-555-0142',
      source: 'company',
      sourceCompanyName: 'TechForward Solutions',
    },
    {
      id: 'PP-02',
      projectTitle: 'Army Enterprise Cloud Migration',
      clientAgency: 'U.S. Army',
      clientOffice: 'PEO EIS',
      contractNumber: 'W52P1J22C0089',
      contractType: 'CPFF',
      contractValue: 24000000,
      startDate: '2022-03-01',
      endDate: '2025-02-28',
      durationMonths: 36,
      projectDescription:
        'Enterprise cloud migration for the U.S. Army (PEO EIS): assessment, replatforming, and migration of 180 mission applications to government cloud using a CloudPathfinder-assessed migration factory, completed ahead of schedule.',
      rolePerformed: 'prime',
      workPerformed:
        'Migrated 180 applications to government cloud via a CloudPathfinder-assessed migration factory; ran automated dependency discovery that surfaced 23 undocumented application dependencies; executed wave-based cutovers with rollback gates and completed the program ahead of schedule.',
      cparsRating: 'Very Good',
      cparsScore: 4,
      deliveryPerformance:
        'Completed the 180-application migration ahead of the contractual schedule with no failed production cutovers requiring rollback.',
      budgetPerformance:
        'Performed within the CPFF target cost; FinOps savings figures cited internally are pending independent verification.',
      customerSatisfaction: 89,
      technicalSimilarityTags: ['Cloud Migration', 'Migration Factory', 'CloudPathfinder', 'Dependency Discovery', 'Replatforming'],
      scopeSimilarityTags: ['Migration at scale', '180 applications', 'Prime', 'Federal'],
      naicsCodes: ['541512', '541513'],
      clientContactName: 'Lt. Col. James Whitaker',
      clientContactTitle: 'Contracting Officer Representative (COR)',
      clientContactEmail: 'james.whitaker@army.mil',
      clientContactPhone: '703-555-0188',
      source: 'company',
      sourceCompanyName: 'TechForward Solutions',
    },
    {
      id: 'PP-03',
      projectTitle: 'Treasury IT Modernization',
      clientAgency: 'Department of the Treasury',
      clientOffice: 'Bureau of the Fiscal Service',
      contractNumber: '2032H521C00041',
      contractType: 'FFP',
      contractValue: 6200000,
      startDate: '2021-04-01',
      endDate: '2024-03-31',
      durationMonths: 36,
      projectDescription:
        'IT modernization for the Treasury Bureau of the Fiscal Service, centered on achieving and sustaining FedRAMP compliance for migrated workloads alongside infrastructure modernization.',
      rolePerformed: 'prime',
      workPerformed:
        'Achieved FedRAMP authorization for modernized workloads, including control implementation, SSP development, and 3PAO assessment support; modernized supporting infrastructure and supported workload migration to an authorized cloud baseline.',
      cparsRating: 'Very Good',
      cparsScore: 4,
      deliveryPerformance:
        'Delivered FedRAMP authorization on schedule; all firm-fixed-price deliverables accepted without rework.',
      budgetPerformance: 'Firm-fixed-price contract delivered at the agreed price with no out-of-scope cost growth.',
      customerSatisfaction: 85,
      technicalSimilarityTags: ['FedRAMP', 'Compliance', 'ATO', 'Infrastructure Modernization', 'Cloud Baseline'],
      scopeSimilarityTags: ['Federal prime', 'Compliance depth', 'IT modernization'],
      naicsCodes: ['541512', '541519'],
      clientContactName: 'Karen Blackwell',
      clientContactTitle: 'Contracting Officer Representative (COR)',
      clientContactEmail: 'karen.blackwell@fiscal.treasury.gov',
      clientContactPhone: '202-555-0173',
      source: 'company',
      sourceCompanyName: 'TechForward Solutions',
    },
    {
      id: 'PP-04',
      projectTitle: 'DHS ServiceNow Integration',
      clientAgency: 'Department of Homeland Security',
      clientOffice: 'OCIO',
      contractNumber: '70RDAD22C00000456',
      contractType: 'FFP',
      contractValue: 3100000,
      startDate: '2022-06-01',
      endDate: '2024-05-31',
      durationMonths: 24,
      projectDescription:
        'ServiceNow / ITSM workflow integration for the DHS OCIO, delivered by teammate GovFlow Technologies on the same ServiceNow instance and platform required by this pursuit.',
      rolePerformed: 'prime',
      workPerformed:
        'Designed and implemented ITSM workflows on the DHS OCIO ServiceNow instance — incident, change, and request fulfillment — with CMDB integration and automated approval routing; delivered on the same platform the Enterprise Cloud Migration scope requires.',
      cparsRating: 'Very Good',
      cparsScore: 4,
      deliveryPerformance:
        'Workflow modules delivered and accepted on schedule; transitioned to government operations without escaped defects requiring rollback.',
      budgetPerformance: 'Firm-fixed-price effort completed at the agreed price with no overruns.',
      customerSatisfaction: 88,
      technicalSimilarityTags: ['ServiceNow', 'ITSM', 'Workflow Integration', 'CMDB', 'DHS instance'],
      scopeSimilarityTags: ['Same agency', 'Same platform', 'Teammate-provided', 'ITSM'],
      naicsCodes: ['541512', '541511'],
      clientContactName: 'Robert Castellano',
      clientContactTitle: 'Partner Program Manager (GovFlow Technologies)',
      clientContactEmail: 'rcastellano@govflowtech.com',
      clientContactPhone: '571-555-0210',
      source: 'teammate',
      sourceCompanyName: 'GovFlow Technologies',
    },
    {
      id: 'PP-05',
      projectTitle: 'USCIS Data Modernization',
      clientAgency: 'USCIS (DHS component)',
      clientOffice: 'OIT',
      contractNumber: '70SBUR21C00000789',
      contractType: 'T&M',
      contractValue: 4200000,
      startDate: '2021-05-01',
      endDate: '2023-08-31',
      durationMonths: 28,
      projectDescription:
        'Data modernization and ETL for USCIS (DHS component), delivered by teammate DataBridge Analytics: migration of legacy schemas (HR Connect, TECS) to a modernized data platform. Covers the data-migration capability the prime is otherwise thin on.',
      rolePerformed: 'prime',
      workPerformed:
        'Profiled and migrated legacy DHS-component data schemas (HR Connect, TECS) into a modernized platform; built ETL pipelines with validation and reconciliation; performed schema mapping and data-quality remediation across the source systems.',
      cparsRating: 'Satisfactory',
      cparsScore: 3,
      deliveryPerformance:
        'Delivered the migration and ETL scope; schedule slipped on two data-quality remediation cycles, reflected in the Satisfactory rating.',
      budgetPerformance: 'Time-and-materials effort stayed within the funded ceiling.',
      customerSatisfaction: 74,
      technicalSimilarityTags: ['Data Migration', 'ETL', 'Legacy Schemas', 'HR Connect', 'TECS', 'Schema Mapping'],
      scopeSimilarityTags: ['DHS component', 'Data modernization', 'Teammate-provided'],
      naicsCodes: ['541512', '541511'],
      clientContactName: 'Angela Ruiz',
      clientContactTitle: 'Partner Delivery Lead (DataBridge Analytics)',
      clientContactEmail: 'aruiz@databridgeanalytics.com',
      clientContactPhone: '571-555-0264',
      source: 'teammate',
      sourceCompanyName: 'DataBridge Analytics',
    },
    {
      id: 'PP-06',
      projectTitle: 'FEMA Grants Management Legacy Support',
      clientAgency: 'FEMA (DHS component)',
      clientOffice: 'Grant Programs Directorate',
      contractNumber: 'HSFE7017C0033',
      contractType: 'FFP',
      contractValue: 4000000,
      startDate: '2017-09-01',
      endDate: '2020-08-31',
      durationMonths: 36,
      projectDescription:
        'Operations-and-maintenance support for a FEMA legacy grants-management system. Older and below the RFP size threshold; included here as a marginal-relevance reference.',
      rolePerformed: 'prime',
      workPerformed:
        'Provided sustainment and help-desk support for a legacy grants-management application: defect fixes, minor enhancements, and periodic compliance patching. Limited modernization or cloud-migration content.',
      cparsRating: 'Not Rated',
      cparsScore: 0,
      deliveryPerformance: 'Routine sustainment delivered; no formal CPARS evaluation was issued for this effort.',
      budgetPerformance: 'Firm-fixed-price sustainment performed at the agreed price.',
      customerSatisfaction: 70,
      technicalSimilarityTags: ['Legacy Support', 'O&M', 'Grants Management', 'Sustainment'],
      scopeSimilarityTags: ['DHS component', 'Below size threshold', 'Older than 5 years'],
      naicsCodes: ['541512', '541513'],
      clientContactName: 'Daniel Pierce',
      clientContactTitle: 'Program Manager',
      clientContactEmail: 'daniel.pierce@fema.dhs.gov',
      clientContactPhone: '202-555-0119',
      source: 'company',
      sourceCompanyName: 'TechForward Solutions',
    },
  ],

  // ─── View 2 · Scored relevance (6, referenceId matches) ──────────────────────
  scored: [
    {
      referenceId: 'PP-01',
      overallRelevanceScore: 91,
      scopeRelevance: 88,
      sizeRelevance: 90,
      complexityRelevance: 90,
      agencyRelevance: 100,
      recencyScore: 98,
      performanceScore: 100,
      requirementsCovered: ['R2', 'R3'],
      relevanceRationale:
        'PP-01 is the lead reference because it is the only same-department, currently-active contract in the set: a $12.5M DHS CISA cybersecurity modernization running 2023–present. It directly substantiates R3 (Zero Trust) by standing up a NIST 800-207 Level 3 architecture in 8 months, and R2 (FedRAMP High & Continuous ATO) by sustaining a continuous ATO across the CISA boundary. ' +
        'The Exceptional CPARS (estimated — public data inference) and a confirmed COR willing to speak make it the most defensible evidence class an evaluator can verify. Its 15-minute mean-time-to-detect and 8-month ZTA stand-up also lend partial support to R6 (agile delivery cadence), though it carries no dedicated migration-at-scale or transition narrative.',
      selectionRecommendation: 'Strongly recommended',
      concerns: [],
    },
    {
      referenceId: 'PP-02',
      overallRelevanceScore: 85,
      scopeRelevance: 92,
      sizeRelevance: 95,
      complexityRelevance: 90,
      agencyRelevance: 60,
      recencyScore: 90,
      performanceScore: 80,
      requirementsCovered: ['R1', 'R4'],
      relevanceRationale:
        'PP-02 anchors R1 (Cloud Migration at Scale): a $24M U.S. Army enterprise migration that moved 180 applications via a CloudPathfinder-assessed migration factory, completed ahead of schedule. The 180-application portfolio is directly comparable to the DHS scale this pursuit targets, and the automated dependency discovery that surfaced 23 undocumented dependencies substantiates the migration-factory approach. It also provides moderate support for R4 (Data Migration & ETL) through the data-bearing application moves. ' +
        'The Very Good CPARS (estimated) with a confirmed COR keeps it in the strongly-recommended tier. Agency relevance is lower than the DHS references because the work was for the Army, and the internally-cited FinOps savings figures remain unverified — cite the migration metrics freely but hold the dollar figures.',
      selectionRecommendation: 'Strongly recommended',
      concerns: ['FinOps savings figures cited internally are not yet independently verified', 'Army agency context, not DHS'],
    },
    {
      referenceId: 'PP-03',
      overallRelevanceScore: 74,
      scopeRelevance: 65,
      sizeRelevance: 80,
      complexityRelevance: 68,
      agencyRelevance: 55,
      recencyScore: 70,
      performanceScore: 80,
      requirementsCovered: ['R2'],
      relevanceRationale:
        'PP-03 is a supporting reference on R2 (FedRAMP High & Continuous ATO): a $6.2M Treasury Bureau of the Fiscal Service modernization whose narrative centers on achieving and sustaining FedRAMP authorization, with 3PAO assessment support and control implementation. It reinforces compliance depth where an evaluator probes the FedRAMP discriminator. ' +
        'It is positioned as supporting rather than lead because its cloud-migration relevance is lower than PP-01/PP-02 and the agency (Treasury) is outside DHS. The Very Good CPARS (estimated) with a confirmed COR is solid; the narrative should stay tight on compliance and avoid over-claiming migration scope.',
      selectionRecommendation: 'Recommended',
      concerns: ['Lower cloud-migration relevance — strongest on compliance, not migration', 'Treasury agency context, not DHS'],
    },
    {
      referenceId: 'PP-04',
      overallRelevanceScore: 79,
      scopeRelevance: 78,
      sizeRelevance: 60,
      complexityRelevance: 72,
      agencyRelevance: 100,
      recencyScore: 85,
      performanceScore: 80,
      requirementsCovered: ['R5'],
      relevanceRationale:
        'PP-04 is the only reference that covers R5 (ServiceNow / ITSM Workflow Integration): a $3.1M DHS OCIO ServiceNow integration delivered on the same instance and platform this pursuit requires. Same-instance experience is exactly what evaluators familiar with the DHS OCIO ServiceNow environment will probe for, which is why it scores highly on agency relevance despite its modest dollar value. ' +
        'The principal concern is governance: it is a teammate-provided reference (GovFlow Technologies) whose teaming agreement is unsigned, so it cannot yet be cited as a team reference of record. The Very Good CPARS (estimated) should be corroborated against public award data before submission, and R5 coverage for the whole bid rests on this single partner reference.',
      selectionRecommendation: 'Recommended',
      concerns: ['Partner-provided (GovFlow); dependent on an unsigned teaming agreement', 'Sole reference carrying R5 — corroborate before submission'],
    },
    {
      referenceId: 'PP-05',
      overallRelevanceScore: 68,
      scopeRelevance: 72,
      sizeRelevance: 58,
      complexityRelevance: 70,
      agencyRelevance: 95,
      recencyScore: 60,
      performanceScore: 55,
      requirementsCovered: ['R4'],
      relevanceRationale:
        'PP-05 substantiates R4 (Data Migration & ETL): a $4.2M USCIS (DHS component) data-modernization effort that migrated legacy schemas — HR Connect and TECS — and built validated ETL pipelines. The specific legacy-schema experience is the value here, and the DHS-component context keeps agency relevance high. ' +
        'Two weaknesses hold it at the Alternative tier. It carries the lowest CPARS band in the set (Satisfactory, estimated), which proves capability but signals mediocre performance, so it must be framed around the schema work rather than the rating. It is also teammate-provided (DataBridge Analytics) and dependent on an unsigned teaming agreement — if DataBridge withdraws, R4 loses its dedicated proof point.',
      selectionRecommendation: 'Alternative',
      concerns: ['Satisfactory CPARS — flag for review', 'Partner-provided; dependent on unsigned TA'],
    },
    {
      referenceId: 'PP-06',
      overallRelevanceScore: 41,
      scopeRelevance: 38,
      sizeRelevance: 35,
      complexityRelevance: 40,
      agencyRelevance: 80,
      recencyScore: 15,
      performanceScore: 30,
      requirementsCovered: [],
      relevanceRationale:
        'PP-06 is a $4.0M FEMA legacy grants-management sustainment effort that ran 2017–2020. While the FEMA (DHS component) context gives it some agency affinity, the work was operations-and-maintenance with little modernization or cloud-migration content, so it does not cleanly cover any evaluation requirement. ' +
        'It fails two hard RFP gates: the $4.0M value is below the $5M size threshold, and a 2020 end date exceeds the 5-year recency window. With no CPARS rating on record, it offers neither a quality signal nor relevant scope, and is recommended for exclusion from the submitted set.',
      selectionRecommendation: 'Not recommended',
      concerns: [
        'Contract value $4.0M is below the $5M RFP size threshold',
        'Ended 2020 — exceeds the 5-year recency window',
        'No CPARS rating on record',
      ],
    },
  ],

  // ─── View 2 · Requirement coverage (6, one per requirement) ──────────────────
  coverage: [
    {
      requirementId: 'R1',
      requirement: 'Cloud Migration at Scale (AWS GovCloud / Azure Government)',
      perReference: {
        'PP-01': 'partial',
        'PP-02': 'strong',
        'PP-03': 'moderate',
        'PP-04': 'none',
        'PP-05': 'none',
        'PP-06': 'partial',
      },
      coverage: 'Strong',
      evidence: {
        'PP-02': 'Migrated 180 applications for the U.S. Army via CloudPathfinder, completed ahead of schedule.',
        'PP-03': 'Migrated Treasury workloads to an authorized cloud baseline alongside FedRAMP work.',
        'PP-01': 'Operated cloud-hosted DHS CISA security services, but no large-scale app migration.',
        'PP-06': 'Touched cloud hosting on a FEMA legacy system; marginal migration content.',
      },
    },
    {
      requirementId: 'R2',
      requirement: 'FedRAMP High & Continuous ATO',
      perReference: {
        'PP-01': 'strong',
        'PP-02': 'moderate',
        'PP-03': 'strong',
        'PP-04': 'none',
        'PP-05': 'none',
        'PP-06': 'none',
      },
      coverage: 'Strong',
      evidence: {
        'PP-01': 'Sustained a FedRAMP High continuous ATO across the DHS CISA boundary.',
        'PP-03': 'Achieved Treasury FedRAMP authorization with 3PAO assessment and control implementation.',
        'PP-02': 'Migrated Army workloads into a FedRAMP-aligned authorization boundary.',
      },
    },
    {
      requirementId: 'R3',
      requirement: 'Zero Trust Architecture (ZTA)',
      perReference: {
        'PP-01': 'strong',
        'PP-02': 'none',
        'PP-03': 'none',
        'PP-04': 'partial',
        'PP-05': 'none',
        'PP-06': 'none',
      },
      coverage: 'Strong',
      evidence: {
        'PP-01': 'Stood up NIST 800-207 Zero Trust Level 3 across DHS CISA in 8 months; 15-minute MTTD.',
        'PP-04': 'Implemented identity-aware ITSM access controls on the DHS ServiceNow instance.',
      },
    },
    {
      requirementId: 'R4',
      requirement: 'Data Migration & ETL (legacy schemas)',
      perReference: {
        'PP-01': 'partial',
        'PP-02': 'moderate',
        'PP-03': 'none',
        'PP-04': 'none',
        'PP-05': 'strong',
        'PP-06': 'none',
      },
      coverage: 'Strong',
      evidence: {
        'PP-05': 'Migrated DHS-component legacy schemas (HR Connect, TECS) with validated ETL pipelines — but partner-provided (DataBridge).',
        'PP-02': 'Moved data-bearing applications during the 180-app Army migration.',
        'PP-01': 'Handled security telemetry data flows, not legacy schema migration.',
      },
    },
    {
      requirementId: 'R5',
      requirement: 'ServiceNow / ITSM Workflow Integration',
      perReference: {
        'PP-01': 'partial',
        'PP-02': 'none',
        'PP-03': 'none',
        'PP-04': 'strong',
        'PP-05': 'none',
        'PP-06': 'none',
      },
      coverage: 'Strong',
      evidence: {
        'PP-04': 'Built incident/change/request ITSM workflows on the DHS OCIO ServiceNow instance — sole strong reference, teammate-provided (GovFlow).',
        'PP-01': 'Integrated security alerting into ticketing, but not full ITSM workflow build.',
      },
    },
    {
      requirementId: 'R6',
      requirement: 'Agile Delivery & Transition at Scale',
      perReference: {
        'PP-01': 'moderate',
        'PP-02': 'moderate',
        'PP-03': 'none',
        'PP-04': 'partial',
        'PP-05': 'none',
        'PP-06': 'none',
      },
      coverage: 'Moderate',
      evidence: {
        'PP-01': 'Delivered ZTA in 8 months on an iterative cadence across the CISA boundary.',
        'PP-02': 'Ran wave-based agile cutovers for 180 applications ahead of schedule.',
        'PP-04': 'Transitioned ITSM modules to government operations, but limited staffing-ramp narrative.',
      },
    },
  ],

  // ─── View 3 · Narratives (6, referenceId matches) ────────────────────────────
  narratives: [
    {
      referenceId: 'PP-01',
      contractInfoBlock:
        'DHS Cybersecurity Modernization · Contract No. 70RCSA23C00000123 · Department of Homeland Security, CISA · IDIQ · $12,500,000 · PoP 2023-02-01 to 2026-01-31 (active) · Role: Prime',
      contactInfoBlock:
        'Michelle Adams · Contracting Officer Representative (COR) · michelle.adams@cisa.dhs.gov · 202-555-0142 · Confirmed available as a reference',
      relevanceNarrative:
        'TechForward Solutions delivered this DHS CISA cybersecurity modernization as prime, the single most relevant reference for this pursuit: same department, same security regime, and currently active. The work directly addresses R3 (Zero Trust Architecture) — we architected a NIST 800-207 Level 3 zero trust boundary across CISA — and R2 (FedRAMP High & Continuous ATO), which we sustained throughout the period of performance. ' +
        'Because the contract is with DHS and remains active through 2026, an evaluator can verify performance against the same organization that will assess this bid. The engagement also exercises the agile delivery cadence behind R6, standing up the zero trust boundary in 8 months on an iterative schedule.',
      performanceNarrative:
        'Performance on this contract earned an Exceptional CPARS rating (estimated — public data inference). We delivered the Zero Trust Level 3 architecture in 8 months against a 12-month baseline and achieved a 15-minute mean-time-to-detect across the monitored boundary. No corrective action requests were issued, and customer satisfaction tracked at 96. ' +
        'The COR, Michelle Adams, has confirmed she is available to speak to this performance — an Exceptional rating backed by a willing same-agency reference is the most defensible evidence class available in this submission.',
      lessonsLearnedNarrative:
        'The program reinforced that early identity-foundation work accelerates every downstream zero trust control; sequencing identity first is what made the 8-month delivery possible.',
      qualityScore: 92,
      requirementsAddressed: ['R2', 'R3', 'R6'],
      metricsIncluded: ['ZTA Level 3 in 8 months', '15-minute MTTD', '96 customer satisfaction', 'Exceptional CPARS'],
      qualityChecklist: {
        contractInfo: true,
        contactInfo: true,
        relevance3plus: true,
        metrics3plus: true,
        cparsReferenced: true,
        howLanguage: true,
      },
      improvedVersions: {
        relevanceNarrative:
          'As prime on the $12.5M DHS CISA Cybersecurity Modernization, TechForward Solutions delivered the exact discriminators this RFP weighs most heavily, on the same department that will evaluate this bid. We addressed R3 by architecting a NIST 800-207 Level 3 zero trust boundary across the full CISA enclave — micro-segmenting 340+ services and enforcing identity-aware policy at every hop — and R2 by standing up and continuously maintaining a FedRAMP High continuous ATO, passing every quarterly control assessment without a single Plan of Action and Milestones slipping its remediation date. ' +
          'The contract is active through January 2026, so an evaluator can confirm current, not historical, performance with the awarding organization. The same iterative delivery engine behind R6 compressed an industry-standard 12-month zero trust rollout into 8 months, demonstrating the agile cadence this transition will demand.',
        performanceNarrative:
          'This contract holds an Exceptional CPARS rating (estimated — public data inference), the highest band, with zero corrective action requests across the period of performance. We delivered Zero Trust Level 3 in 8 months against a 12-month baseline — a 33% schedule compression — drove mean-time-to-detect down to 15 minutes from an inherited 4-hour baseline, and sustained 96 customer satisfaction. Every option year was exercised within budget with no cost-overrun modifications. ' +
          'COR Michelle Adams has confirmed her availability as a reference and has been pre-briefed on likely evaluator questions, pairing the highest CPARS band with a willing same-agency voice — the most defensible past-performance evidence in this proposal.',
        lessonsLearnedNarrative:
          'The decisive lesson was that identity is the critical path of zero trust: by completing the identity-and-access foundation in the first 60 days, we unblocked every subsequent control and compressed the rollout to 8 months. We have codified that identity-first sequencing into the migration playbook proposed for this effort, so the DHS transition inherits the same acceleration rather than rediscovering it.',
      },
      sectionQuality: { relevanceNarrative: 'strong', performanceNarrative: 'moderate', lessonsLearnedNarrative: 'weak' },
    },
    {
      referenceId: 'PP-02',
      contractInfoBlock:
        'Army Enterprise Cloud Migration · Contract No. W52P1J22C0089 · U.S. Army, PEO EIS · CPFF · $24,000,000 · PoP 2022-03-01 to 2025-02-28 · Role: Prime',
      contactInfoBlock:
        'Lt. Col. James Whitaker · Contracting Officer Representative (COR) · james.whitaker@army.mil · 703-555-0188 · Confirmed available as a reference',
      relevanceNarrative:
        'TechForward Solutions executed this $24M U.S. Army enterprise cloud migration as prime, the anchor reference for R1 (Cloud Migration at Scale). We migrated 180 mission applications to government cloud using a CloudPathfinder-assessed migration factory, completing the program ahead of schedule. The 180-application portfolio is directly comparable to the DHS scale of this pursuit. ' +
        'The engagement also supports R4 (Data Migration & ETL) through the data-bearing application moves and the automated dependency discovery that surfaced 23 previously undocumented dependencies before they could disrupt cutover.',
      performanceNarrative:
        'This contract earned a Very Good CPARS rating (estimated — public data inference) with a confirmed COR, Lt. Col. James Whitaker. We completed the 180-application migration ahead of the contractual schedule with no failed production cutovers requiring rollback, and customer satisfaction tracked at 89. ' +
        'Internally reported FinOps savings figures are being independently verified before they are cited externally; the migration throughput and schedule metrics, however, are confirmed and citable.',
      lessonsLearnedNarrative:
        'Automated dependency discovery proved its value early — the 23 undocumented dependencies it caught would otherwise have surfaced as failed cutovers, validating a dependency-first wave plan.',
      qualityScore: 84,
      requirementsAddressed: ['R1', 'R4'],
      metricsIncluded: ['180 applications migrated', '23 undocumented dependencies found', '89 customer satisfaction', 'Very Good CPARS'],
      qualityChecklist: {
        contractInfo: true,
        contactInfo: true,
        relevance3plus: false,
        metrics3plus: true,
        cparsReferenced: true,
        howLanguage: true,
      },
      improvedVersions: {
        relevanceNarrative:
          'As prime on the $24M Army Enterprise Cloud Migration, TechForward Solutions ran the migration-at-scale playbook this RFP requires for R1, on a portfolio directly comparable to the DHS estate. We migrated 180 mission applications to government cloud through a CloudPathfinder-assessed migration factory, sequencing wave-based cutovers with automated rollback gates so that not one of the 180 moves failed in production. The factory ingested each application, classified it by the 6R disposition model, and emitted a runbook — the same engine proposed for this DHS transition. ' +
          'The effort also substantiates R4: our automated dependency discovery surfaced 23 undocumented application dependencies before cutover, and our ETL tooling moved the underlying data stores with validation and reconciliation at each wave, proving the data-migration discipline alongside the application migration.',
        performanceNarrative:
          'This contract holds a Very Good CPARS rating (estimated — public data inference) with COR Lt. Col. James Whitaker confirmed as a reference. We completed all 180 application migrations ahead of the contractual schedule with a zero-rollback production record and sustained 89 customer satisfaction across the three-year period of performance. Wave velocity averaged 15 applications per month at peak, accelerating as the factory matured. ' +
          'We are deliberately withholding the internally-reported FinOps savings figures until independent verification completes, citing only the confirmed throughput, schedule, and dependency-catch metrics — a discipline that protects the reference from an evaluator challenge.',
        lessonsLearnedNarrative:
          'The program proved that dependency discovery must precede wave planning, not follow it: the 23 undocumented dependencies we caught up front would each have become a failed cutover under a naive schedule. We have hard-wired a dependency-first gate into the migration factory proposed for DHS, so the same class of hidden coupling is surfaced and sequenced before any production move.',
      },
      sectionQuality: { relevanceNarrative: 'strong', performanceNarrative: 'moderate', lessonsLearnedNarrative: 'moderate' },
    },
    {
      referenceId: 'PP-03',
      contractInfoBlock:
        'Treasury IT Modernization · Contract No. 2032H521C00041 · Department of the Treasury, Bureau of the Fiscal Service · FFP · $6,200,000 · PoP 2021-04-01 to 2024-03-31 · Role: Prime',
      contactInfoBlock:
        'Karen Blackwell · Contracting Officer Representative (COR) · karen.blackwell@fiscal.treasury.gov · 202-555-0173 · Confirmed available as a reference',
      relevanceNarrative:
        'TechForward Solutions delivered this Treasury Bureau of the Fiscal Service IT modernization as prime, positioned as a supporting reference for R2 (FedRAMP High & Continuous ATO). The narrative centers on achieving and sustaining FedRAMP authorization for modernized workloads, including control implementation, SSP development, and 3PAO assessment support. ' +
        'It is deliberately scoped as supporting rather than lead evidence: its cloud-migration relevance is lower than the DHS and Army references, so it reinforces the compliance discriminator without over-claiming migration scope.',
      performanceNarrative:
        'This contract earned a Very Good CPARS rating (estimated — public data inference) with a confirmed COR, Karen Blackwell. We delivered the FedRAMP authorization on schedule, with all firm-fixed-price deliverables accepted without rework, and customer satisfaction at 85. The compliance milestones were met without a single deliverable rejection across the period of performance.',
      lessonsLearnedNarrative:
        'Front-loading the System Security Plan and engaging the 3PAO early kept the authorization on schedule, a sequencing lesson we carry into every compliance effort.',
      qualityScore: 78,
      requirementsAddressed: ['R2'],
      metricsIncluded: ['FedRAMP authorization on schedule', '85 customer satisfaction', 'Very Good CPARS', 'Zero deliverable rejections'],
      qualityChecklist: {
        contractInfo: true,
        contactInfo: true,
        relevance3plus: false,
        metrics3plus: false,
        cparsReferenced: true,
        howLanguage: true,
      },
      improvedVersions: {
        relevanceNarrative:
          'As prime on the $6.2M Treasury IT Modernization, TechForward Solutions delivered the FedRAMP compliance depth this RFP weighs under R2, providing a second independent proof point alongside the DHS reference. We implemented the full NIST 800-53 High control baseline, authored the System Security Plan, and shepherded the workloads through a 3PAO assessment to a clean authorization, then sustained the continuous-monitoring posture for the remainder of the period of performance. ' +
          'We position this reference precisely: it is our compliance discriminator, not a migration claim. Leading with it where an evaluator probes FedRAMP rigor reinforces R2 without diluting the cloud-migration story that PP-01 and PP-02 carry — a deliberate use of supporting evidence.',
        performanceNarrative:
          'This contract holds a Very Good CPARS rating (estimated — public data inference) with COR Karen Blackwell confirmed as a reference. We delivered the FedRAMP authorization on the contractual schedule, had every firm-fixed-price deliverable accepted on first submission with zero rejections, and sustained 85 customer satisfaction. The clean authorization was achieved with no negative findings requiring a Plan of Action and Milestones at assessment. ' +
          'Across the three-year period of performance the contract ran at the agreed fixed price with no out-of-scope cost growth, demonstrating disciplined compliance delivery an evaluator can verify with the COR.',
        lessonsLearnedNarrative:
          'The authorization stayed on schedule because we front-loaded the System Security Plan and engaged the 3PAO in the first month rather than at assessment time, collapsing the usual back-and-forth. We have built that early-3PAO engagement into the continuous-ATO approach proposed for DHS, so the authorization timeline is protected from day one.',
      },
      sectionQuality: { relevanceNarrative: 'moderate', performanceNarrative: 'moderate', lessonsLearnedNarrative: 'weak' },
    },
    {
      referenceId: 'PP-04',
      contractInfoBlock:
        'DHS ServiceNow Integration · Contract No. 70RDAD22C00000456 · Department of Homeland Security, OCIO · FFP · $3,100,000 · PoP 2022-06-01 to 2024-05-31 · Role: Prime (teammate GovFlow Technologies)',
      contactInfoBlock:
        'Robert Castellano · Partner Program Manager, GovFlow Technologies · rcastellano@govflowtech.com · 571-555-0210 · Partner-provided (not independently confirmed)',
      relevanceNarrative:
        'This $3.1M DHS OCIO ServiceNow integration, delivered by teammate GovFlow Technologies, is the reference that closes R5 (ServiceNow / ITSM Workflow Integration) for the team. The work was performed on the same DHS OCIO ServiceNow instance this pursuit requires — incident, change, and request fulfillment workflows with CMDB integration — so it maps to exactly the environment an evaluator will probe. ' +
        'The reference carries a governance caveat: GovFlow is a teammate and its teaming agreement is currently unsigned, so it cannot yet be cited as a team reference of record. R5 coverage for the whole bid rests on this single partner reference.',
      performanceNarrative:
        'The contract holds a Very Good CPARS rating (estimated — public data inference), but as partner-provided evidence it is a weaker class than an own-company CPARS and should be corroborated against public award data before submission. GovFlow delivered the workflow modules on schedule and transitioned them to government operations without escaped defects requiring rollback, with customer satisfaction at 88.',
      lessonsLearnedNarrative:
        'Same-instance ServiceNow experience materially de-risks ITSM delivery; the absence of a signed teaming agreement, however, is the open governance item to resolve before this reference is relied upon.',
      qualityScore: 70,
      requirementsAddressed: ['R5'],
      metricsIncluded: ['Very Good CPARS', '88 customer satisfaction', 'Same DHS ServiceNow instance'],
      qualityChecklist: {
        contractInfo: true,
        contactInfo: true,
        relevance3plus: false,
        metrics3plus: false,
        cparsReferenced: true,
        howLanguage: false,
      },
      improvedVersions: {
        relevanceNarrative:
          'Teammate GovFlow Technologies delivered the $3.1M DHS OCIO ServiceNow Integration on the exact instance this pursuit will inherit, making it the team\'s decisive proof point for R5. GovFlow built the incident, change, and request-fulfillment workflows, integrated them with the OCIO CMDB, and automated approval routing across the OCIO\'s own catalog — work that demonstrates not generic ServiceNow skill but specific fluency with the DHS OCIO configuration, ACLs, and update-set governance an evaluator from that office will recognize. ' +
          'We are transparent about the one open item: the GovFlow teaming agreement is in term-sheet form and not yet executed. Our mitigation is concrete — corroborate the rating against public award data and finalize the TA before submission — so the strongest available R5 evidence is also defensible.',
        performanceNarrative:
          'The contract holds a Very Good CPARS rating (estimated — public data inference) and 88 customer satisfaction, delivered by GovFlow on the same DHS OCIO ServiceNow instance. GovFlow shipped every workflow module on the firm-fixed-price schedule and transitioned them to government operations with no escaped defects requiring rollback. We treat this as partner-provided evidence and are corroborating the rating against public award data, since a partner CPARS is a weaker class than an own-company rating and warrants independent confirmation before it enters the proposal.',
        lessonsLearnedNarrative:
          'The engagement confirmed that same-instance ServiceNow experience is worth more than raw platform certifications: GovFlow\'s familiarity with the OCIO configuration removed weeks of discovery. The actionable lesson for this bid is governance, not technology — we are executing the GovFlow teaming agreement and corroborating the public award record now, so the R5 proof point is locked before submission rather than after.',
      },
      sectionQuality: { relevanceNarrative: 'moderate', performanceNarrative: 'weak', lessonsLearnedNarrative: 'weak' },
    },
    {
      referenceId: 'PP-05',
      contractInfoBlock:
        'USCIS Data Modernization · Contract No. 70SBUR21C00000789 · USCIS (DHS component), OIT · T&M · $4,200,000 · PoP 2021-05-01 to 2023-08-31 · Role: Prime (teammate DataBridge Analytics)',
      contactInfoBlock:
        'Angela Ruiz · Partner Delivery Lead, DataBridge Analytics · aruiz@databridgeanalytics.com · 571-555-0264 · Partner-provided (not independently confirmed)',
      relevanceNarrative:
        'This $4.2M USCIS data-modernization effort, delivered by teammate DataBridge Analytics, substantiates R4 (Data Migration & ETL). DataBridge migrated legacy DHS-component schemas — HR Connect and TECS — into a modernized platform and built validated ETL pipelines. The specific legacy-schema experience within a DHS component is the value of this reference. ' +
        'It carries two weaknesses an evaluator will see: it is the lowest CPARS band in the set, and it is partner-provided and dependent on an unsigned teaming agreement. If DataBridge withdraws, R4 loses its dedicated past-performance proof point.',
      performanceNarrative:
        'The contract holds a Satisfactory CPARS rating (estimated — public data inference) — the lowest band in this reference set. The rating reflects schedule slips on two data-quality remediation cycles. Because the rating proves capability but signals mediocre performance, the narrative is framed around the specific schema-migration experience (HR Connect, TECS) rather than the overall score. Customer satisfaction was 74.',
      lessonsLearnedNarrative:
        'Legacy-schema migrations live or die on data-quality remediation; under-scoping that effort drove the schedule slips that capped this rating at Satisfactory.',
      qualityScore: 58,
      requirementsAddressed: ['R4'],
      metricsIncluded: ['Satisfactory CPARS', '74 customer satisfaction'],
      qualityChecklist: {
        contractInfo: true,
        contactInfo: true,
        relevance3plus: false,
        metrics3plus: false,
        cparsReferenced: true,
        howLanguage: false,
      },
      improvedVersions: {
        relevanceNarrative:
          'Teammate DataBridge Analytics delivered the $4.2M USCIS Data Modernization, the team\'s dedicated proof point for R4 within a DHS component. DataBridge profiled and migrated two of the hardest legacy schemas in the DHS estate — HR Connect and TECS — into a modernized platform, building ETL pipelines with row-level validation and reconciliation at each load and remediating data-quality defects against authoritative sources. That specific schema fluency, not a generic data-migration claim, is what maps to the legacy-schema scope this RFP calls out under R4. ' +
          'We are explicit about the reference\'s standing: it is partner-provided and the DataBridge teaming agreement is unsigned. We foreground the schema-level capability, corroborate against public award data, and flag the dependency so the R4 evidence is used with eyes open.',
        performanceNarrative:
          'The contract holds a Satisfactory CPARS rating (estimated — public data inference), the lowest band in our set, driven by schedule slips on two data-quality remediation cycles. We do not hide this — we frame it. The citable strength is the specific, verifiable schema-migration work on HR Connect and TECS; the rating is a known risk we mitigate by pairing this reference with PP-02\'s stronger migration record and by corroborating the partner CPARS against public award data. Customer satisfaction was 74. As a teammate-provided reference dependent on an unsigned TA, it is positioned as capability evidence for R4, never as a quality discriminator.',
        lessonsLearnedNarrative:
          'The decisive lesson was that data-quality remediation, not pipeline construction, is the true critical path of a legacy-schema migration — under-scoping it on this effort drove the two slips that capped the rating. We have re-scoped remediation as a first-class workstream with its own buffer in the ETL factory proposed for DHS, directly converting this reference\'s weakness into a concrete process improvement for the pursuit.',
      },
      sectionQuality: { relevanceNarrative: 'moderate', performanceNarrative: 'weak', lessonsLearnedNarrative: 'weak' },
    },
    {
      referenceId: 'PP-06',
      contractInfoBlock:
        'FEMA Grants Management Legacy Support · Contract No. HSFE7017C0033 · FEMA (DHS component), Grant Programs Directorate · FFP · $4,000,000 · PoP 2017-09-01 to 2020-08-31 · Role: Prime',
      contactInfoBlock:
        'Daniel Pierce · Program Manager · daniel.pierce@fema.dhs.gov · 202-555-0119',
      relevanceNarrative:
        'This $4.0M FEMA legacy grants-management sustainment effort ran 2017–2020. While the FEMA (DHS component) context lends some agency affinity, the work was operations-and-maintenance — defect fixes, minor enhancements, and compliance patching — with little modernization or cloud-migration content, so it does not cleanly address any evaluation requirement.',
      performanceNarrative:
        'No CPARS rating is on record for this effort, so there is no performance score to cite. Routine sustainment was delivered at the agreed firm-fixed price, but the contract offers neither a quality signal nor relevant scope for this pursuit.',
      lessonsLearnedNarrative:
        'The effort is retained in the library mainly for completeness; its age and sustainment scope limit any transferable lesson to this modernization pursuit.',
      qualityScore: 45,
      requirementsAddressed: [],
      metricsIncluded: [],
      qualityChecklist: {
        contractInfo: true,
        contactInfo: true,
        relevance3plus: false,
        metrics3plus: false,
        cparsReferenced: false,
        howLanguage: false,
      },
      improvedVersions: {
        relevanceNarrative:
          'Even strengthened, this $4.0M FEMA Grants Management Legacy Support effort (2017–2020) is a marginal fit for the pursuit. It is the one reference in the library that lets us claim sustained, compliant operation of a DHS-component grants system, and the team did keep the legacy application patched and audit-ready across three years. But the scope was operations-and-maintenance, not modernization or migration, and the most honest improvement is to be precise about that boundary rather than inflate the relevance — the reference simply does not map to R1–R6.',
        performanceNarrative:
          'No CPARS rating was issued for this effort, so we make no performance claim that an evaluator cannot verify. What we can state is bounded and factual: routine sustainment, defect resolution, and compliance patching were delivered at the agreed firm-fixed price across the period of performance, with the legacy grants application kept continuously available. Absent a rating and absent modernization scope, this contract is best treated as background, not as a scored past-performance reference for this pursuit.',
        lessonsLearnedNarrative:
          'The principal lesson is one of selection rather than delivery: a reference that is both below the $5M size threshold and outside the 5-year recency window, with no CPARS on record, should be excluded from the submitted set so it does not dilute stronger evidence. We apply that filter explicitly here and recommend PP-06 be held in reserve rather than submitted.',
      },
      sectionQuality: { relevanceNarrative: 'weak', performanceNarrative: 'weak', lessonsLearnedNarrative: 'weak' },
    },
  ],

  // ─── Optimize result (best 5 of 6) ──────────────────────────────────────────
  optimize: {
    selectedIds: ['PP-01', 'PP-02', 'PP-03', 'PP-04', 'PP-05'],
    note:
      'Selected the best 5 of 6 against the RFP cap of 5 references. PP-01 (DHS, Exceptional, active) leads; PP-02 anchors migration-at-scale; PP-03 supports FedRAMP; PP-04 is the sole carrier of R5 (ServiceNow). PP-05 is included as a deliberate tradeoff: its Satisfactory CPARS is accepted to retain R4 data-migration coverage via DataBridge, since no own-company reference covers legacy-schema ETL — frame it on the HR Connect / TECS schema work, not the rating. PP-06 is excluded on two hard gates: its $4.0M value is below the $5M size threshold and its 2020 end date exceeds the 5-year recency window. Two pre-submission flags: R5 coverage depends entirely on teammate GovFlow (PP-04) and R4 on teammate DataBridge (PP-05) — corroborate both partner CPARS against public award data and execute both teaming agreements before submission. R6 (Agile Delivery & Transition at Scale) remains the weakest factor with no dedicated reference; supplement from the Staffing tab transition narrative.',
  },

  // ─── AI prefill (Add Reference form mock) ────────────────────────────────────
  aiPrefill: {
    projectTitle: 'DHS FEMA Cloud Hosting Migration',
    clientAgency: 'Department of Homeland Security',
    clientOffice: 'FEMA',
    contractNumber: '70FA00-24-C-0188',
    contractType: 'CPFF',
    contractValue: 9800000,
    startDate: '2024-01-15',
    endDate: '2026-01-14',
    durationMonths: 24,
    projectDescription:
      'Cloud hosting migration for FEMA under DHS: replatformed grants and disaster-recovery workloads to AWS GovCloud with FedRAMP-aligned baselines and automated, wave-based cutovers.',
    rolePerformed: 'prime',
    cparsRating: 'Very Good',
    cparsScore: 4,
    source: 'company',
    sourceCompanyName: 'TechForward Solutions',
    technicalSimilarityTags: ['Cloud Migration', 'AWS GovCloud', 'FedRAMP', 'Replatforming'],
    naicsCodes: ['541512'],
  },
};

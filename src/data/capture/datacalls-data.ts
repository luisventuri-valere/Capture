// ─────────────────────────────────────────────────────────────────────────────
// Data Calls module — seed data (GovHub Capture › Data Calls tab)
// Frontend-only demo. VA Healthcare Analytics Platform (Department of Veterans Affairs).
// Two-phase model: Pre-TA (NDA, lightweight evaluation) → Post-TA (TA, RFP artifacts).
// ─────────────────────────────────────────────────────────────────────────────

import type { DataCallsData } from '../../types/dataCalls';

const opportunity: DataCallsData['opportunity'] = {
  title: 'VA Healthcare Analytics Platform',
  agency: 'Department of Veterans Affairs',
  subAgency: 'Veterans Health Administration (VHA)',
  value: '$22.5M',
  role: 'Prime',
  naics: '541519',
  today: '2026-02-14',
  timeline: {
    pinkTeam: '2026-02-12',
    redTeam: '2026-02-18',
    goldTeam: '2026-02-25',
    proposalDue: '2026-03-04',
  },
};

const strategy: DataCallsData['strategy'] = {
  provenance: 'AI Generated',
  summary:
    'Collection is phased to mirror the Pink (Feb 12) → Red (Feb 18) → Gold (Feb 25) review gates. ' +
    'In the Pre-TA window we evaluate partner fit under NDA with deliberately lightweight requests — capability statements, past-performance summaries, and rate ranges only. ' +
    'Once a Teaming Agreement is signed we shift to Post-TA collection of RFP-formatted artifacts, each item mapped to a Section L requirement and a Section M evaluation criterion. ' +
    'Every submission is quality-scored and the queue is reminder-driven so nothing stalls silently before its gate. ' +
    'The two long poles before Red Team are detailed labor rates (the cost model cannot run without them) and FHIR interoperability test evidence (the Section M.3 differentiator).',
  priorities: [
    {
      id: 'pr-1',
      label: 'Lock FHIR interoperability test evidence (team-wide)',
      phase: 'post-ta',
      deadline: '2026-02-18',
      blocks: 'Technical volume — Section M.3 differentiator',
    },
    {
      id: 'pr-2',
      label: 'Collect all detailed labor rates',
      phase: 'post-ta',
      deadline: '2026-02-18',
      blocks: 'Cost model / Red Team pricing run',
    },
    {
      id: 'pr-3',
      label: 'Key Personnel resumes + Letters of Commitment',
      phase: 'post-ta',
      deadline: '2026-02-19',
      blocks: 'Staffing volume — Section L.4.2',
    },
    {
      id: 'pr-4',
      label: 'ClearSky capability + FedRAMP screen',
      phase: 'pre-ta',
      deadline: '2026-02-15',
      blocks: 'ClearSky teaming go/no-go',
    },
    {
      id: 'pr-5',
      label: 'Finalize past-performance references',
      phase: 'post-ta',
      deadline: '2026-02-20',
      blocks: 'PP volume — Gold Team',
    },
  ],
  phaseGuidance: {
    preTa:
      'Pre-TA, under NDA: keep requests lightweight. Request capabilities, past-performance summaries, and rate RANGES only — never detailed rate cards or named personnel before a TA is in place.',
    postTa:
      'Post-TA, under signed Teaming Agreement: collect RFP-formatted artifacts. Each item maps to a Section L requirement and a Section M evaluation criterion.',
  },
};

const partners: DataCallsData['partners'] = [
  {
    id: 'p-meridian',
    name: 'Meridian Health IT',
    specialty: 'FHIR / interoperability specialist',
    sbStatus: 'SDVOSB',
    trustTier: 'TA',
    agreementStatus: 'NDA + TA signed',
    primaryContact: {
      name: 'Dana Whitfield',
      email: 'dana.whitfield@meridianhealthit.com',
      phone: '(703) 555-0142',
    },
    phase: 'post-ta',
  },
  {
    id: 'p-databridge',
    name: 'DataBridge Analytics',
    specialty: 'Healthcare data analytics',
    sbStatus: '8(a) small business',
    trustTier: 'TA',
    agreementStatus: 'NDA + TA signed',
    primaryContact: {
      name: 'Raj Patel',
      email: 'raj.patel@databridge-analytics.com',
      phone: '(571) 555-0198',
    },
    phase: 'post-ta',
  },
  {
    id: 'p-clearsky',
    name: 'ClearSky Cloud',
    specialty: 'AWS GovCloud / DevOps',
    sbStatus: 'Small business',
    trustTier: 'NDA',
    agreementStatus: 'NDA only — no TA',
    primaryContact: {
      name: 'Morgan Lee',
      email: 'morgan.lee@clearskycloud.io',
      phone: '(202) 555-0177',
    },
    phase: 'pre-ta',
  },
];

const templates: DataCallsData['templates'] = [
  // ─── Pre-TA (EVALUATION, NDA, no rfpReferences) ───────────────────────────
  {
    id: 'tpl-cap-fit',
    name: 'Capability Fit Assessment',
    phase: 'pre-ta',
    category: 'EVALUATION',
    description: 'NDA-level technical fit screen before committing to a teaming agreement.',
    purpose: 'Evaluate a partner’s technical fit under NDA before any TA is in place.',
    matchScore: 86,
    suggestedDurationDays: 5,
    trustTierMinimum: 'NDA',
    items: [
      {
        id: 'tpl-cap-fit-1',
        description: 'Capability statement',
        format: 'PDF',
        required: true,
      },
      {
        id: 'tpl-cap-fit-2',
        description: 'Relevant contract list (last 5 years)',
        format: 'Excel',
        required: true,
      },
      {
        id: 'tpl-cap-fit-3',
        description: 'Differentiators narrative',
        format: 'Word',
        required: false,
      },
    ],
  },
  {
    id: 'tpl-pp-screen',
    name: 'PP Relevance Screen',
    phase: 'pre-ta',
    category: 'EVALUATION',
    description: 'Lightweight past-performance relevance check, NDA-appropriate.',
    purpose: 'Gauge whether a partner’s past performance is relevant enough to pursue a TA.',
    matchScore: 82,
    suggestedDurationDays: 4,
    trustTierMinimum: 'NDA',
    items: [
      {
        id: 'tpl-pp-screen-1',
        description: 'Summary of 2–3 relevant projects',
        format: 'Form',
        required: true,
      },
      {
        id: 'tpl-pp-screen-2',
        description: 'Rough relevance self-rating',
        format: 'Form',
        required: false,
      },
    ],
  },
  {
    id: 'tpl-rate-range',
    name: 'Rate Range & Availability',
    phase: 'pre-ta',
    category: 'EVALUATION',
    description: 'Order-of-magnitude rate ranges and staff availability — no detailed rate cards.',
    purpose: 'Confirm a partner’s rates are in a viable range and key staff are available, without exchanging detailed pricing pre-TA.',
    matchScore: 78,
    suggestedDurationDays: 3,
    trustTierMinimum: 'NDA',
    items: [
      {
        id: 'tpl-rate-range-1',
        description: 'Labor-rate ranges by category',
        format: 'Form',
        required: true,
        guidanceNotes: 'Ranges only — no detailed rate cards before a TA.',
      },
      {
        id: 'tpl-rate-range-2',
        description: 'Key-staff availability window',
        format: 'Form',
        required: true,
      },
    ],
  },
  {
    id: 'tpl-teaming-hist',
    name: 'Teaming History & References',
    phase: 'pre-ta',
    category: 'EVALUATION',
    description: 'Prior teaming track record and conflict disclosures.',
    purpose: 'Assess a partner’s prior prime/sub teaming track record and surface any OCI concerns early.',
    matchScore: 74,
    suggestedDurationDays: 5,
    trustTierMinimum: 'NDA',
    items: [
      {
        id: 'tpl-teaming-hist-1',
        description: 'Prior prime/sub references',
        format: 'Form',
        required: true,
      },
      {
        id: 'tpl-teaming-hist-2',
        description: 'Conflicts / OCI disclosure',
        format: 'Word',
        required: false,
      },
    ],
  },
  // ─── Post-TA (PROPOSAL, TA, with rfpReferences) ───────────────────────────
  {
    id: 'tpl-resumes',
    name: 'Key Personnel Resumes',
    phase: 'post-ta',
    category: 'PROPOSAL',
    description: 'Named key-personnel resumes and commitment letters for the staffing volume.',
    purpose: 'Collect proposal-ready resumes and signed commitments for named key personnel.',
    matchScore: 91,
    suggestedDurationDays: 6,
    trustTierMinimum: 'TA',
    rfpReferences: ['Section L.4.2'],
    items: [
      {
        id: 'tpl-resumes-1',
        description: 'Named key-personnel resume',
        format: 'Word',
        required: true,
        guidanceNotes: 'GovHub resume format, 2pg max',
      },
      {
        id: 'tpl-resumes-2',
        description: 'Signed Letter of Commitment',
        format: 'PDF',
        required: true,
      },
      {
        id: 'tpl-resumes-3',
        description: 'Labor-category mapping',
        format: 'Excel',
        required: false,
      },
    ],
  },
  {
    id: 'tpl-pp-full',
    name: 'Past Performance References (Full)',
    phase: 'post-ta',
    category: 'PROPOSAL',
    description: 'Full RFP-formatted past-performance write-ups with verifiable references.',
    purpose: 'Collect complete, PWS-mapped past-performance references for the past-performance volume.',
    matchScore: 94,
    suggestedDurationDays: 7,
    trustTierMinimum: 'TA',
    rfpReferences: ['Section L.4.3', 'Section M.3'],
    items: [
      {
        id: 'tpl-pp-full-1',
        description: 'Full past-performance reference write-up',
        format: 'Word',
        required: true,
      },
      {
        id: 'tpl-pp-full-2',
        description: 'COR/CO contact for verification',
        format: 'Form',
        required: true,
      },
      {
        id: 'tpl-pp-full-3',
        description: 'Relevance statement mapped to PWS',
        format: 'Word',
        required: true,
        guidanceNotes: 'Cite quantitative outcomes.',
      },
    ],
  },
  {
    id: 'tpl-pricing',
    name: 'Detailed Labor Rates & Pricing',
    phase: 'post-ta',
    category: 'PROPOSAL',
    description: 'Fully-burdened rates and indirect schedules for the cost model.',
    purpose: 'Collect detailed, fully-burdened pricing inputs to build and defend the cost volume.',
    matchScore: 88,
    suggestedDurationDays: 8,
    trustTierMinimum: 'TA',
    rfpReferences: ['Section L.4.4'],
    items: [
      {
        id: 'tpl-pricing-1',
        description: 'Fully-burdened labor rates',
        format: 'Excel',
        required: true,
      },
      {
        id: 'tpl-pricing-2',
        description: 'Indirect rate schedule',
        format: 'Excel',
        required: true,
      },
      {
        id: 'tpl-pricing-3',
        description: 'Basis-of-estimate notes',
        format: 'Word',
        required: false,
      },
    ],
  },
  {
    id: 'tpl-tech',
    name: 'Technical Approach Inputs',
    phase: 'post-ta',
    category: 'PROPOSAL',
    description: 'Partner inputs to the technical narrative and architecture.',
    purpose: 'Gather partner contributions to the technical approach and supporting diagrams.',
    matchScore: 85,
    suggestedDurationDays: 7,
    trustTierMinimum: 'TA',
    rfpReferences: ['Section L.4.1'],
    items: [
      {
        id: 'tpl-tech-1',
        description: 'Technical narrative inputs',
        format: 'Word',
        required: true,
      },
      {
        id: 'tpl-tech-2',
        description: 'Architecture diagram',
        format: 'Visio',
        required: false,
      },
      {
        id: 'tpl-tech-3',
        description: 'Assumptions / constraints',
        format: 'Word',
        required: false,
      },
    ],
  },
  {
    id: 'tpl-compliance',
    name: 'Compliance & Certification',
    phase: 'post-ta',
    category: 'PROPOSAL',
    description: 'Certifications, reps & certs, and security attestations.',
    purpose: 'Collect compliance artifacts and certifications required by the solicitation.',
    matchScore: 80,
    suggestedDurationDays: 5,
    trustTierMinimum: 'TA',
    rfpReferences: ['Section L.5'],
    items: [
      {
        id: 'tpl-compliance-1',
        description: 'Certifications (FedRAMP / SOC 2 / etc.)',
        format: 'PDF',
        required: true,
      },
      {
        id: 'tpl-compliance-2',
        description: 'Reps & certs',
        format: 'Form',
        required: true,
      },
      {
        id: 'tpl-compliance-3',
        description: 'Security / clearance attestations',
        format: 'Form',
        required: false,
      },
    ],
  },
];

const dataCalls: DataCallsData['dataCalls'] = [
  {
    id: 'DC-001',
    partnerId: 'p-meridian',
    title: 'Past Performance References (Full)',
    phase: 'post-ta',
    type: 'PAST_PERFORMANCE',
    status: 'PARTIAL',
    priority: 'HIGH',
    templateId: 'tpl-pp-full',
    instructions:
      'Provide a full, RFP-formatted past-performance reference for the VA FHIR interoperability program, including a verifiable COR/CO contact and a relevance statement mapped to the PWS. Cite quantitative outcomes throughout.',
    sentDate: '2026-02-08',
    dueDate: '2026-02-20',
    deliveryMethod: 'GovHub secure upload',
    notes: '',
    items: [
      {
        id: 'DC-001-A',
        dataCallId: 'DC-001',
        description: 'Full past performance reference write-up (VA FHIR interoperability program)',
        format: 'Word',
        required: true,
        status: 'ACCEPTED',
        submittedDate: '2026-02-10',
        qualityScore: 91,
        qualityNotes: 'Proposal-ready — quantitative outcomes (records exchanged, uptime) cited.',
      },
      {
        id: 'DC-001-B',
        dataCallId: 'DC-001',
        description: 'COR/CO contact for reference verification',
        format: 'Form',
        required: true,
        status: 'ACCEPTED',
        submittedDate: '2026-02-10',
        qualityScore: 88,
        qualityNotes: 'Complete and verifiable.',
      },
      {
        id: 'DC-001-C',
        dataCallId: 'DC-001',
        description: 'Relevance statement mapped to PWS requirements',
        format: 'Word',
        required: true,
        status: 'UNDER_REVIEW',
        submittedDate: '2026-02-13',
        qualityScore: 76,
        qualityNotes: "Lacks quantitative metrics — says 'improved interoperability' without numbers.",
      },
    ],
  },
  {
    id: 'DC-002',
    partnerId: 'p-meridian',
    title: 'Key Personnel Resumes',
    phase: 'post-ta',
    type: 'RESUME',
    status: 'SENT',
    priority: 'CRITICAL',
    templateId: 'tpl-resumes',
    instructions:
      'Submit the named FHIR Solutions Architect resume in GovHub format (2pg max) along with a signed Letter of Commitment. These inputs gate the staffing volume under Section L.4.2.',
    sentDate: '2026-02-11',
    dueDate: '2026-02-19',
    deliveryMethod: 'GovHub secure upload',
    notes: '',
    items: [
      {
        id: 'DC-002-A',
        dataCallId: 'DC-002',
        description: 'FHIR Solutions Architect resume (Key Personnel)',
        format: 'Word',
        required: true,
        status: 'SUBMITTED',
        submittedDate: '2026-02-14',
      },
      {
        id: 'DC-002-B',
        dataCallId: 'DC-002',
        description: 'Signed Letter of Commitment — FHIR Architect',
        format: 'PDF',
        required: true,
        status: 'PENDING',
      },
    ],
  },
  {
    id: 'DC-003',
    partnerId: 'p-databridge',
    title: 'Detailed Labor Rates & Pricing',
    phase: 'post-ta',
    type: 'PRICING',
    status: 'SENT',
    priority: 'CRITICAL',
    templateId: 'tpl-pricing',
    instructions:
      'Provide fully-burdened labor rates by category and a complete indirect rate schedule (fringe, overhead, G&A) in the supplied Excel workbooks. These feed directly into the cost model.',
    sentDate: '2026-02-11',
    dueDate: '2026-02-22',
    deliveryMethod: 'GovHub secure upload',
    notes: 'Due AFTER Red Team (Feb 18) — timing risk for the cost model.',
    items: [
      {
        id: 'DC-003-A',
        dataCallId: 'DC-003',
        description: 'Fully-burdened labor rates by category',
        format: 'Excel',
        required: true,
        status: 'PENDING',
      },
      {
        id: 'DC-003-B',
        dataCallId: 'DC-003',
        description: 'Indirect rate schedule (fringe/OH/G&A)',
        format: 'Excel',
        required: true,
        status: 'PENDING',
      },
    ],
  },
  {
    id: 'DC-004',
    partnerId: 'p-databridge',
    title: 'Past Performance References (Full)',
    phase: 'post-ta',
    type: 'PAST_PERFORMANCE',
    status: 'PARTIAL',
    priority: 'MEDIUM',
    templateId: 'tpl-pp-full',
    instructions:
      'Provide a full past-performance reference write-up for a comparable analytics program, with a verifiable COR/CO contact and a PWS-mapped relevance statement. Substantiate any AI/ML claims with contract evidence.',
    sentDate: '2026-02-08',
    dueDate: '2026-02-21',
    deliveryMethod: 'GovHub secure upload',
    notes: '',
    items: [
      {
        id: 'DC-004-A',
        dataCallId: 'DC-004',
        description: 'Full past performance reference write-up (analytics program)',
        format: 'Word',
        required: true,
        status: 'SUBMITTED',
        submittedDate: '2026-02-13',
        qualityScore: 72,
        qualityNotes:
          'DataBridge claims AI/ML analytics but contract evidence shows traditional reporting only — verify before relying on it.',
      },
    ],
  },
  {
    id: 'DC-005',
    partnerId: 'p-clearsky',
    title: 'Capability Fit Assessment',
    phase: 'pre-ta',
    type: 'EVALUATION',
    status: 'PARTIAL',
    priority: 'MEDIUM',
    templateId: 'tpl-cap-fit',
    instructions:
      'Under NDA, provide a capability statement, a summary of relevant contracts, and current FedRAMP / clearance status so we can make a teaming go/no-go decision. Keep this lightweight — no detailed pricing or named personnel.',
    sentDate: '2026-02-07',
    dueDate: '2026-02-15',
    deliveryMethod: 'GovHub secure upload',
    notes: 'NDA-appropriate Pre-TA evaluation.',
    items: [
      {
        id: 'DC-005-A',
        dataCallId: 'DC-005',
        description: 'Capability statement',
        format: 'PDF',
        required: true,
        status: 'ACCEPTED',
        submittedDate: '2026-02-09',
        qualityScore: 84,
        qualityNotes: 'Solid, proposal-ready.',
      },
      {
        id: 'DC-005-B',
        dataCallId: 'DC-005',
        description: 'Relevant contracts summary',
        format: 'Excel',
        required: true,
        status: 'ACCEPTED',
        submittedDate: '2026-02-09',
        qualityScore: 80,
        qualityNotes: 'Minor refinement — add contract values.',
      },
      {
        id: 'DC-005-C',
        dataCallId: 'DC-005',
        description: 'FedRAMP / clearance status',
        format: 'Form',
        required: true,
        status: 'UNDER_REVIEW',
        submittedDate: '2026-02-13',
        qualityScore: 68,
        qualityNotes: 'No FedRAMP authorization evidence attached — gap.',
      },
    ],
  },
];

const recommendations: DataCallsData['recommendations'] = [
  {
    id: 'rec-gap',
    type: 'gap',
    severity: 'HIGH',
    scope: 'single',
    partnerIds: ['p-clearsky'],
    dataCallIds: ['DC-005'],
    title: 'ClearSky missing FedRAMP authorization evidence',
    detail:
      'PWS R5 requires FedRAMP authorization; ClearSky’s DC-005 FedRAMP/clearance item (DC-005-C) is under review with no authorization evidence attached.',
    recommendation:
      'Issue a targeted Pre-TA data call (or follow-up item) requesting FedRAMP authorization evidence before the ClearSky go/no-go.',
    suggestedAction: 'Create Data Call',
    actionType: 'create_dc',
    status: 'active',
  },
  {
    id: 'rec-clarification',
    type: 'clarification',
    severity: 'MEDIUM',
    scope: 'single',
    partnerIds: ['p-databridge'],
    dataCallIds: ['DC-004'],
    title: 'DataBridge AI/ML claim unsubstantiated',
    detail:
      'DataBridge claims AI/ML capability but the submitted past performance (DC-004-A) shows traditional analytics/reporting only.',
    recommendation:
      'Request clarification before relying on DataBridge for the technical volume AI/ML differentiator.',
    suggestedAction: 'Request Clarification',
    actionType: 'modify_dc',
    status: 'active',
  },
  {
    id: 'rec-comparison',
    type: 'comparison',
    severity: 'MEDIUM',
    scope: 'cross-team',
    partnerIds: ['p-meridian', 'p-databridge'],
    dataCallIds: ['DC-001', 'DC-004'],
    title: 'Meridian outperforming DataBridge on PP quality',
    detail: 'Meridian past-performance quality averages ~89 vs DataBridge ~72.',
    recommendation: 'Consider Meridian as lead for the past-performance volume.',
    suggestedAction: 'Make Meridian PP Lead',
    actionType: 'escalate',
    status: 'active',
  },
  {
    id: 'rec-risk',
    type: 'risk',
    severity: 'CRITICAL',
    scope: 'cross-team',
    partnerIds: ['p-meridian', 'p-databridge', 'p-clearsky'],
    dataCallIds: [],
    title: 'Team-wide gap: FHIR interoperability test evidence',
    detail:
      'No partner has provided FHIR interoperability test evidence at the depth Section M.3 expects — the differentiating requirement.',
    recommendation: 'Issue a team-wide data call for FHIR interoperability test artifacts.',
    suggestedAction: 'Create Team-Wide Data Call',
    actionType: 'create_dc',
    status: 'active',
  },
  {
    id: 'rec-quality',
    type: 'quality',
    severity: 'MEDIUM',
    scope: 'single',
    partnerIds: ['p-meridian'],
    dataCallIds: ['DC-001'],
    title: 'Relevance statement uses qualitative language',
    detail: 'DC-001-C uses qualitative language and scores 76.',
    recommendation:
      'Request revision adding specific interoperability metrics (records exchanged, uptime) to reach proposal-ready quality.',
    suggestedAction: 'Request Revision',
    actionType: 'modify_dc',
    status: 'active',
  },
  {
    id: 'rec-timing',
    type: 'timing',
    severity: 'CRITICAL',
    scope: 'cross-team',
    partnerIds: ['p-databridge'],
    dataCallIds: ['DC-003'],
    title: 'DataBridge pricing due after Red Team',
    detail:
      'DC-003 pricing is due Feb 22 but the cost model needs all rates by Feb 18 for Red Team.',
    recommendation: 'Escalate to pull the DataBridge pricing date in to Feb 17.',
    suggestedAction: 'Escalate Deadline',
    actionType: 'escalate',
    status: 'active',
  },
];

const contextAnswers: DataCallsData['contextAnswers'] = [
  {
    scope: 'all',
    scopeId: 'portfolio',
    prompt: 'Give me a portfolio status — what needs attention before Red Team?',
    answer:
      'There are 5 active data calls across 3 partners, and two CRITICAL items gate Red Team on Feb 18: DC-002 (Meridian key-personnel resumes) and DC-003 (DataBridge detailed pricing). ' +
      'DataBridge pricing is the long pole — it is still PENDING and currently due Feb 22, after the gate, so the cost model cannot run on time unless we pull it in. ' +
      'The other watch item is ClearSky’s FedRAMP gap on DC-005-C, which is the go/no-go risk for keeping them on the team. ' +
      'Meridian is otherwise tracking well; its only soft spot is the qualitative relevance statement on DC-001-C.',
  },
  {
    scope: 'partner',
    scopeId: 'p-meridian',
    prompt: 'How is Meridian Health IT tracking?',
    answer:
      'Meridian is the strongest partner on the team, with past-performance quality averaging ~89 (DC-001-A at 91, DC-001-B at 88). ' +
      'Two things still need attention: the relevance statement DC-001-C is under review at 76 because it uses qualitative language and needs hard metrics, ' +
      'and on the resume side DC-002-A (FHIR architect) was just submitted and is awaiting review while the signed Letter of Commitment (DC-002-B) is still pending. ' +
      'Together those gate the staffing volume (Section L.4.2) and the past-performance volume.',
  },
  {
    scope: 'call',
    scopeId: 'DC-001',
    prompt: 'What is the status of this Past Performance data call?',
    answer:
      'DC-001 is PARTIAL: 2 of 3 items are accepted — the reference write-up (91) and the COR/CO contact (88) are both proposal-ready. ' +
      'The blocker is the third item, the PWS-mapped relevance statement (DC-001-C), which is under review at 76 because it reads qualitatively. ' +
      'Request a revision adding concrete interoperability metrics (records exchanged, uptime) and this call clears.',
  },
  {
    scope: 'item',
    scopeId: 'DC-001-C',
    prompt: 'Does this CPARS narrative meet Section M criteria? What is missing?',
    answer:
      'Not yet — it scores 76 and is not proposal-ready. The narrative leans on qualitative language like “improved interoperability” without supporting numbers. ' +
      'Section M.3 expects quantitative interoperability outcomes, so to meet the criteria it needs specifics: records exchanged, transaction volume, uptime %, and error-rate reduction. ' +
      'Add those metrics and map each claim back to the PWS requirement it satisfies.',
  },
];

const activityLog: DataCallsData['activityLog'] = [
  {
    id: 'evt-1',
    timestamp: '2026-02-14T14:22:00Z',
    type: 'submission',
    description: 'Meridian submitted the FHIR Solutions Architect resume (DC-002-A) — awaiting review.',
  },
  {
    id: 'evt-2',
    timestamp: '2026-02-13T16:40:00Z',
    type: 'quality_review',
    description: 'Reviewed Meridian relevance statement (DC-001-C) → quality score 76; flagged as qualitative.',
  },
  {
    id: 'evt-3',
    timestamp: '2026-02-13T11:15:00Z',
    type: 'submission',
    description: 'DataBridge submitted the analytics past-performance write-up (DC-004-A) → scored 72; AI/ML claim flagged.',
  },
  {
    id: 'evt-4',
    timestamp: '2026-02-13T09:05:00Z',
    type: 'submission',
    description: 'ClearSky submitted FedRAMP / clearance status (DC-005-C) — under review.',
  },
  {
    id: 'evt-5',
    timestamp: '2026-02-12T15:30:00Z',
    type: 'reminder',
    description: 'Reminder sent to DataBridge regarding detailed pricing (DC-003).',
  },
  {
    id: 'evt-6',
    timestamp: '2026-02-11T13:48:00Z',
    type: 'send',
    description: 'Sent Key Personnel Resumes data call (DC-002) to Meridian.',
  },
  {
    id: 'evt-7',
    timestamp: '2026-02-11T13:42:00Z',
    type: 'send',
    description: 'Sent Detailed Labor Rates & Pricing data call (DC-003) to DataBridge.',
  },
  {
    id: 'evt-8',
    timestamp: '2026-02-11T10:12:00Z',
    type: 'accept',
    description: 'Accepted Meridian past-performance reference write-up (DC-001-A) at quality score 91.',
  },
];

const queuedActions: DataCallsData['queuedActions'] = [
  {
    id: 'qa-1',
    label: 'Assign Meridian as past-performance volume lead',
    priority: 'HIGH',
    source: 'manual',
    done: false,
  },
  {
    id: 'qa-2',
    label: 'Confirm ClearSky go/no-go before Pink Team',
    priority: 'MEDIUM',
    source: 'manual',
    done: false,
  },
];

export const dataCallsData: DataCallsData = {
  opportunity,
  strategy,
  partners,
  templates,
  dataCalls,
  recommendations,
  contextAnswers,
  activityLog,
  queuedActions,
};

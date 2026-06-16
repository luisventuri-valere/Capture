import type { StaffingData } from '../../types/staffing';

// ─────────────────────────────────────────────────────────────────────────────
// Staffing module — hardcoded demo data (GovHub Capture › Staffing tab)
// Source: opp-001-staffing.json (DHS Enterprise Cloud Migration). Frontend-only.
// ─────────────────────────────────────────────────────────────────────────────

const opportunity = {
  title: 'Enterprise Cloud Migration and Modernization Services',
  agency: 'Department of Homeland Security',
  subAgency: 'Office of the CIO (OCIO)',
  value: 45000000,
  role: 'Prime',
  phase: 'Proposal Development',
  naics: '541512',
  daysToProposal: 47,
};

const incumbent = {
  contractor: 'Peraton',
  contractValue: 38000000,
  period: '2020–2026',
  staffCount: 40,
  flightRiskIndicators: [
    {
      type: 'negative' as const,
      impact: 'high' as const,
      text: 'Agency ATO expires before the 2026-07-15 award window — incumbent staff facing displacement uncertainty',
    },
    {
      type: 'negative' as const,
      impact: 'medium' as const,
      text: 'Multiple Peraton key personnel have already approached the market — two are in our candidate pipeline',
    },
    {
      type: 'neutral' as const,
      impact: 'medium' as const,
      text: 'Contract up for recompete under EAGLE II SB 8(a) set-aside — incumbent exploring teaming/sub options',
    },
  ],
  people: [
    {
      id: 'INC-01',
      name: 'Rachel Foster',
      role: 'Security Operations Lead — DHS Cloud Migration',
      tenure: '3 years',
      flightRisk: 'high' as const,
      status: 'in_pipeline' as const,
      estimatedSalary: 185000,
      note: 'Approached our recruiter independently; now committed under LCAT-04 (Security Engineer). Frustrated with Peraton management. Ethical wall protocols in place.',
    },
    {
      id: 'INC-02',
      name: 'Brian Caldwell',
      role: 'Cloud Infrastructure Architect — DHS OCIO',
      tenure: '5 years',
      flightRisk: 'high' as const,
      status: 'contacted' as const,
      estimatedSalary: 205000,
      note: 'Senior architect with deep DHS environment knowledge. Has signaled openness to a move; preliminary recruiter contact made.',
    },
    {
      id: 'INC-03',
      name: 'Denise Park',
      role: 'Program Manager — DHS Cloud Migration',
      tenure: '4 years',
      flightRisk: 'medium' as const,
      status: 'not_contacted' as const,
      estimatedSalary: 198000,
    },
    {
      id: 'INC-04',
      name: 'Victor Nguyen',
      role: 'Lead Systems Administrator — DHS Cloud Operations',
      tenure: '6 years',
      flightRisk: 'low' as const,
      status: 'not_pursued' as const,
      estimatedSalary: 152000,
      note: 'Long-tenured operational lead; appears committed to Peraton. Not currently a recruiting target.',
    },
  ],
};

const lcats = [
  // ─── LCAT-01 · Program Manager ─────────────────────────────────────────────
  {
    id: 'LCAT-01',
    title: 'Program Manager',
    isKeyPersonnel: true,
    classification: 'discriminator' as const,
    quantity: 1,
    requirements: {
      education:
        "Bachelor's degree in IT, Computer Science, Business Administration, or related field",
      yearsExp: 12,
      certifications: ['PMP', 'ITIL v4 Foundation'],
      clearance: 'TS/SCI',
      location: 'Washington, DC (on-site 4 days/week)',
    },
    salaryRange: { min: 165000, max: 190000 },
    status: 'ready' as const,
    filledCount: 1,
    documents: {
      jobReq: 'complete' as const,
      interviewQs: 'complete' as const,
      evalCriteria: 'complete' as const,
      handoffPackage: 'draft' as const,
    },
    candidates: [
      {
        id: 'C-01-01',
        lcatId: 'LCAT-01',
        name: 'Angela Rodriguez',
        rank: 1,
        source: 'internal' as const,
        status: 'committed' as const,
        education:
          'MS Information Systems, George Washington University; BS Computer Science, Virginia Tech',
        yearsExp: 18,
        certifications: ['PMP', 'ITIL v4 Managing Professional', 'CSM', 'AWS Cloud Practitioner'],
        clearance: 'TS/SCI (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 210000,
        matchScore: 96,
        aiAnalysis: {
          recommendation: 'STRONG RECOMMEND' as const,
          recommendationDetail:
            'Currently manages TechForward\'s DHS CISA contract ($12.5M, Exceptional CPARS) with 15 years of federal PM experience. Her active DHS delivery record is directly on point for this pursuit.',
          competitiveAdvantage:
            'Exceptional CPARS as PM on an active DHS contract — the strongest possible past-performance reference an evaluator can see.',
          strengths: [
            'Exceptional CPARS as PM on active DHS contract — strongest possible reference',
            'Deep understanding of DHS OCIO governance, reporting, and culture',
            'Proven track record delivering ahead of schedule (ZTA Level 3 in 8 months)',
            'Established relationships with DHS OCIO leadership including Deputy CIO',
            'Bilingual (English/Spanish) — asset for diverse workforce management',
          ],
          concerns: [
            'Currently managing active DHS contract — transition plan needed to backfill',
            'Would need to complete CISA contract transition by award date (Jul 2026)',
          ],
          interviewQuestions: [
            'Walk us through your transition plan for handing off the DHS CISA contract so PM coverage there is not disrupted before our award.',
            'On the ZTA Level 3 delivery, what specifically let you finish in 8 months, and how would you apply that to a 340+ application migration?',
            'How do you structure OCIO governance reporting to keep a Deputy CIO confident on a $45M modernization program?',
          ],
          resumeClarifications: [
            'Confirm the exact CPARS rating period and contract value for the DHS CISA engagement for inclusion in the past-performance volume.',
            'Clarify the planned backfill (Marcus Williams) start date relative to your 2026-08-01 availability.',
          ],
        },
        loiStatus: 'signed' as const,
        notes: [
          {
            id: 'N-C-01-01-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Strongest possible PM candidate. Her Exceptional CPARS on DHS work is a proposal discriminator. Backfill plan: promote Marcus Williams to DHS CISA PM role.',
            date: '2026-02-08',
          },
          {
            id: 'N-C-01-01-2',
            userName: 'M. Davis',
            userRole: 'Recruiting' as const,
            text: 'LOI countersigned and filed. Retention check-in scheduled ahead of the award window.',
            date: '2026-02-09',
          },
        ],
      },
      {
        id: 'C-01-02',
        lcatId: 'LCAT-01',
        name: 'Steven Mitchell',
        rank: 2,
        source: 'incumbent' as const,
        status: 'submitted' as const,
        education:
          'MBA, University of Maryland; BS Information Technology, Old Dominion University',
        yearsExp: 14,
        certifications: ['PMP', 'ITIL v4 Foundation', 'SAFe 5 Agilist'],
        clearance: 'TS/SCI (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 195000,
        matchScore: 82,
        aiAnalysis: {
          recommendation: 'RECOMMEND' as const,
          recommendationDetail:
            'Deputy PM on a $50M DHS infrastructure contract with 12 years of federal PM experience, bringing OCIO exposure at larger scale. Has not yet led as prime PM on a contract of this size.',
          competitiveAdvantage:
            'Hands-on DHS OCIO infrastructure experience at $50M scale — a credible bridge between operations and the migration mission.',
          strengths: [
            'DHS infrastructure operations experience at larger scale ($50M)',
            'Understands DHS OCIO from infrastructure perspective',
            'SAFe Agilist certification supports agile delivery approach',
          ],
          concerns: [
            'Deputy PM — has not served as lead PM on contract of this size',
            'Current employer is Peraton — potential non-compete issues',
            'No cloud migration-specific PM experience',
          ],
          interviewQuestions: [
            'You have served as Deputy PM at $50M scale — describe how you would step into the lead PM seat on this program and where you would lean on senior staff.',
            'What is your read on the Peraton non-compete, and how would you sequence your departure to keep us clear of any restriction?',
            'How would you close your gap in cloud-migration-specific delivery before the technical evaluation?',
          ],
          resumeClarifications: [
            'Specify your scope of authority as Deputy PM on the $50M DHS infrastructure contract (budget, staff, customer interface).',
          ],
        },
        loiStatus: 'sent' as const,
        notes: [
          {
            id: 'N-C-01-02-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Strong backup candidate. Non-compete review with legal in progress. His DHS infrastructure knowledge would complement the team even if not PM.',
            date: '2026-02-08',
          },
        ],
      },
    ],
  },

  // ─── LCAT-02 · Technical Lead / Cloud Architect ────────────────────────────
  {
    id: 'LCAT-02',
    title: 'Technical Lead / Cloud Architect',
    isKeyPersonnel: true,
    classification: 'critical' as const,
    quantity: 1,
    requirements: {
      education:
        "Bachelor's degree in Computer Science, Engineering, or related technical field",
      yearsExp: 10,
      certifications: ['AWS Solutions Architect Professional', 'AWS Security Specialty'],
      clearance: 'TS/SCI',
      location: 'Washington, DC (on-site 3 days/week)',
    },
    salaryRange: { min: 185000, max: 235000 },
    status: 'ready' as const,
    filledCount: 1,
    documents: {
      jobReq: 'complete' as const,
      interviewQs: 'complete' as const,
      evalCriteria: 'complete' as const,
      handoffPackage: 'complete' as const,
    },
    candidates: [
      {
        id: 'C-02-01',
        lcatId: 'LCAT-02',
        name: 'David Kim',
        rank: 1,
        source: 'external' as const,
        status: 'committed' as const,
        education: 'MS Computer Science, Carnegie Mellon University; BS Electrical Engineering, MIT',
        yearsExp: 16,
        certifications: [
          'AWS Solutions Architect Professional',
          'AWS Security Specialty',
          'Azure Solutions Architect Expert',
          'CISSP',
          'CCSP',
        ],
        clearance: 'TS/SCI (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 235000,
        matchScore: 94,
        aiAnalysis: {
          recommendation: 'STRONG RECOMMEND' as const,
          recommendationDetail:
            'Former DHS OCIO cloud architect (2019–2023) who designed the agency\'s original multi-cloud strategy and architected solutions across a 250+ application portfolio. His name and work are already known to OCIO evaluators.',
          competitiveAdvantage:
            'Authored DHS\'s original multi-cloud strategy as an OCIO insider — evaluators will recognize him on sight, an outsized discriminator.',
          strengths: [
            'Former DHS OCIO cloud architect — intimate knowledge of the environment and application portfolio',
            'Holds all required AND preferred certifications',
            'Designed DHS\'s original multi-cloud strategy — evaluators will recognize his name',
            '16 years experience with 250+ application migration portfolio — exceeds scope',
            'Articulate presenter — ideal for oral presentation evaluation',
          ],
          concerns: [
            'High-demand candidate — Booz Allen will likely counteroffer aggressively',
            'Compensation expectations are at top of range ($225K+)',
            '18-month non-solicitation clause with Booz Allen — legal review needed',
          ],
          interviewQuestions: [
            'As the architect of DHS\'s original multi-cloud strategy, where would you evolve that strategy for a 340+ application migration today?',
            'Booz Allen is likely to counteroffer — what would keep you committed to us through award and start?',
            'How would you structure the oral presentation to demonstrate FedRAMP High architecture depth to OCIO evaluators?',
          ],
          resumeClarifications: [
            'Confirm the date range and named role for your DHS OCIO tenure so we can position it accurately without conflict.',
            'Clarify the scope of the Booz Allen non-solicitation clause that legal flagged.',
          ],
        },
        loiStatus: 'signed' as const,
        notes: [
          {
            id: 'N-C-02-01-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Platinum candidate. His DHS OCIO background is an enormous discriminator. LOI includes retention bonus and equity. Non-solicitation review: legal advises clause applies to Booz Allen clients, not competitors for new contracts — we are clear.',
            date: '2026-02-08',
          },
          {
            id: 'N-C-02-01-2',
            userName: 'M. Davis',
            userRole: 'Recruiting' as const,
            text: 'Counteroffer-proofing in place: retention bonus and equity confirmed in signed LOI. Will stay close through the award window.',
            date: '2026-02-09',
          },
        ],
      },
      {
        id: 'C-02-02',
        lcatId: 'LCAT-02',
        name: 'Jason Patel',
        rank: 2,
        source: 'external' as const,
        status: 'submitted' as const,
        education: 'MS Cloud Computing, University of Maryland; BS Computer Science, Georgia Tech',
        yearsExp: 11,
        certifications: [
          'AWS Solutions Architect Professional',
          'Azure Solutions Architect Expert',
          'CCSP',
        ],
        clearance: 'TS/SCI (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 200000,
        matchScore: 78,
        aiAnalysis: {
          recommendation: 'RECOMMEND' as const,
          recommendationDetail:
            'Eight years of DHS cloud architecture on EAGLE II contracts, designing multi-cloud environments for FEMA and TSA. Dual AWS/Azure certified but currently missing the required AWS Security Specialty.',
          competitiveAdvantage:
            'Active DHS EAGLE II multi-cloud delivery across FEMA and TSA — current agency context that maps cleanly to the requirement.',
          strengths: [
            'Active DHS EAGLE II experience across FEMA and TSA',
            'Dual AWS/Azure certification matches multi-cloud requirement',
            'Younger talent — long-term growth potential',
          ],
          concerns: [
            'Missing AWS Security Specialty certification (required) — could obtain before proposal',
            'Has not led migrations at 340+ application scale',
            'Less well-known to DHS OCIO evaluators than David Kim',
          ],
          interviewQuestions: [
            'You are missing the required AWS Security Specialty — what is your concrete plan and timeline to sit the exam before proposal submission?',
            'Compare the FEMA and TSA multi-cloud environments you designed; how would those lessons scale to a 340+ application portfolio?',
            'If David Kim is secured as Technical Lead, would you accept a Deputy Technical Lead role, and how would you split responsibilities?',
          ],
          resumeClarifications: [
            'Provide the application counts for the FEMA and TSA environments you architected to substantiate scale.',
          ],
        },
        loiStatus: 'sent' as const,
        notes: [
          {
            id: 'N-C-02-02-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: "Strong backup for David Kim. If LOI'd, should immediately schedule AWS Security Specialty exam. Could serve as Deputy Technical Lead if David Kim is secured.",
            date: '2026-02-08',
          },
        ],
      },
      {
        id: 'C-02-03',
        lcatId: 'LCAT-02',
        name: 'Maria Santos',
        rank: 3,
        source: 'external' as const,
        status: 'sourcing' as const,
        education: 'BS Computer Engineering, University of Texas at Austin',
        yearsExp: 13,
        certifications: [
          'AWS Solutions Architect Professional',
          'AWS Security Specialty',
          'AWS DevOps Engineer Professional',
        ],
        clearance: 'Secret (TS/SCI eligible — previously held)',
        clearanceStatus: 'upgrade_needed' as const,
        salaryExpectation: 260000,
        matchScore: 72,
        aiAnalysis: {
          recommendation: 'CONDITIONAL' as const,
          recommendationDetail:
            'Ten years of AWS professional services with 50+ federal migrations and authored AWS migration whitepapers, but no Azure experience and a lapsed TS/SCI requiring 3–6 months to reinstate.',
          competitiveAdvantage:
            'Deepest AWS expertise in the pool — authored published AWS migration whitepapers backed by 50+ reference implementations.',
          strengths: [
            'Deepest possible AWS expertise — wrote several AWS migration whitepapers',
            '50+ federal migration reference implementations',
            'Previously held TS/SCI — reinstatement timeline shorter than new clearance',
          ],
          concerns: [
            'TS/SCI clearance lapsed — reinstatement takes 3-6 months',
            'No Azure experience — DHS requires multi-cloud capability',
            'Significant compensation premium to leave AWS ($250K+ total comp)',
            'Non-compete with AWS may restrict DHS work for 12 months',
          ],
          interviewQuestions: [
            'DHS requires multi-cloud capability and you have no Azure depth — how would you close that gap, and on what timeline?',
            'Your TS/SCI lapsed — when did it expire, and what is your realistic reinstatement window relative to our 2026-08-01 start?',
            'How would the AWS non-compete affect your ability to support DHS work in the first 12 months?',
          ],
          resumeClarifications: [
            'Confirm the date your TS/SCI lapsed to let us estimate reinstatement lead time.',
            'Clarify the terms and duration of the AWS non-compete that may restrict federal work.',
          ],
        },
        loiStatus: 'not_sent' as const,
        notes: [
          {
            id: 'N-C-02-03-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Aspirational candidate. Only pursue if David Kim and Jason Patel both fall through. Clearance and non-compete issues make her a high-risk option.',
            date: '2026-02-08',
          },
        ],
      },
    ],
  },

  // ─── LCAT-03 · Cloud Architect (Migration) ─────────────────────────────────
  {
    id: 'LCAT-03',
    title: 'Cloud Architect (Migration)',
    isKeyPersonnel: true,
    classification: 'critical' as const,
    quantity: 2,
    requirements: {
      education: "Bachelor's degree in Computer Science, Engineering, or related field",
      yearsExp: 8,
      certifications: [
        'AWS Solutions Architect Associate (minimum)',
        'AWS Migration Specialty (or equivalent experience)',
      ],
      clearance: 'TS/SCI',
      location: 'Washington, DC / Remote hybrid',
    },
    salaryRange: { min: 160000, max: 195000 },
    status: 'partial' as const,
    filledCount: 1,
    documents: {
      jobReq: 'complete' as const,
      interviewQs: 'complete' as const,
      evalCriteria: 'draft' as const,
      handoffPackage: 'draft' as const,
    },
    candidates: [
      {
        id: 'C-03-01',
        lcatId: 'LCAT-03',
        name: 'Chris Morgan',
        rank: 1,
        source: 'internal' as const,
        status: 'committed' as const,
        education: 'MS Information Systems, Johns Hopkins University; BS Computer Science, Penn State',
        yearsExp: 10,
        certifications: [
          'AWS Solutions Architect Professional',
          'AWS Migration Specialty',
          'Azure Administrator Associate',
        ],
        clearance: 'TS/SCI (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 185000,
        matchScore: 88,
        aiAnalysis: {
          recommendation: 'RECOMMEND' as const,
          recommendationDetail:
            'Lead migration architect on TechForward\'s Army cloud program who designed and deployed CloudPathfinder for a 180-application assessment. Directly transferable migration execution, just below the 340+ application scale.',
          competitiveAdvantage:
            'CloudPathfinder subject-matter expert who built the tool underpinning our key migration discriminator.',
          strengths: [
            'CloudPathfinder subject matter expert — designed and deployed the tool',
            'Migrated 180 applications on Army program — directly transferable experience',
            'Internal candidate — no recruiting risk, immediate availability',
            'Holds rare AWS Migration Specialty certification',
          ],
          concerns: [
            'Pulling from active Army program requires backfill plan',
            'Has not worked at 340+ application scale (only 180)',
          ],
          interviewQuestions: [
            'Walk us through how CloudPathfinder handled dependency mapping on the 180-application Army assessment, and how it scales to 340+.',
            'What backfill plan protects the Army program when you transition, and who would step up?',
            'How would you sequence migration waves differently at 340+ applications than you did at 180?',
          ],
          resumeClarifications: [
            'Confirm whether the 180-application figure is fully migrated or assessed-and-in-progress for accurate past-performance language.',
          ],
        },
        loiStatus: 'signed' as const,
        notes: [
          {
            id: 'N-C-03-01-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Ideal migration architect. His CloudPathfinder expertise directly supports our key discriminator. Army program backfill: promote junior architect + recruit replacement.',
            date: '2026-02-08',
          },
        ],
      },
      {
        id: 'C-03-02',
        lcatId: 'LCAT-03',
        name: 'Natasha Volkov',
        rank: 2,
        source: 'external' as const,
        status: 'submitted' as const,
        education: 'BS Computer Engineering, Virginia Tech; AWS Certified (multiple)',
        yearsExp: 9,
        certifications: [
          'AWS Solutions Architect Professional',
          'AWS Migration Specialty',
          'Terraform Associate',
        ],
        clearance: 'Secret (TS eligible)',
        clearanceStatus: 'upgrade_needed' as const,
        salaryExpectation: 190000,
        matchScore: 82,
        aiAnalysis: {
          recommendation: 'RECOMMEND' as const,
          recommendationDetail:
            'Led migration of 220 applications for the VA Enterprise Cloud program — the closest scale match in the pool — with strong multi-cloud and automation skills. Holds only a Secret clearance and needs a TS/SCI upgrade.',
          competitiveAdvantage:
            '220-application VA enterprise migration is the nearest scale match to the DHS 340+ requirement of any candidate.',
          strengths: [
            '220-application migration portfolio — closest scale match to DHS requirement',
            'VA migration experience at enterprise scale',
            'Strong Infrastructure-as-Code and automation skills',
          ],
          concerns: [
            'Only Secret clearance — TS/SCI upgrade needed (90-120 days)',
            'Accenture non-compete clause requires legal review',
            'No DHS-specific experience',
          ],
          interviewQuestions: [
            'Your TS/SCI upgrade runs 90–120 days — how would we start that immediately on hire to protect the start date?',
            'Compare your 220-application VA migration to a DHS 340+ portfolio; what scales and what breaks?',
            'How have you used Infrastructure-as-Code to de-risk large migration waves?',
          ],
          resumeClarifications: [
            'Clarify the terms of the Accenture non-compete so legal can confirm we are clear.',
          ],
        },
        loiStatus: 'sent' as const,
        notes: [
          {
            id: 'N-C-03-02-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Strong second migration architect to pair with Chris Morgan. Her 220-app VA experience complements his 180-app Army experience. Clearance timeline is manageable if we start upgrade immediately upon hiring.',
            date: '2026-02-08',
          },
          {
            id: 'N-C-03-02-2',
            userName: 'M. Davis',
            userRole: 'Recruiting' as const,
            text: 'Flagged for an immediate TS/SCI upgrade kickoff at offer acceptance so the 90–120 day clock does not threaten the start date.',
            date: '2026-02-09',
          },
        ],
      },
    ],
  },

  // ─── LCAT-04 · Security Engineer ───────────────────────────────────────────
  {
    id: 'LCAT-04',
    title: 'Security Engineer',
    isKeyPersonnel: false,
    classification: 'critical' as const,
    quantity: 3,
    requirements: {
      education: "Bachelor's degree in Cybersecurity, Computer Science, or related field",
      yearsExp: 6,
      certifications: ['CISSP or CCSP', 'AWS Security Specialty'],
      clearance: 'TS/SCI',
      location: 'Washington, DC (on-site for classified work)',
    },
    salaryRange: { min: 145000, max: 195000 },
    status: 'partial' as const,
    filledCount: 2,
    documents: {
      jobReq: 'complete' as const,
      interviewQs: 'draft' as const,
      evalCriteria: 'draft' as const,
      handoffPackage: 'not_started' as const,
    },
    candidates: [
      {
        id: 'C-04-01',
        lcatId: 'LCAT-04',
        name: 'Rachel Foster',
        rank: 1,
        source: 'incumbent' as const,
        status: 'committed' as const,
        education: 'MS Cybersecurity, Georgetown University; BS Computer Science, Howard University',
        yearsExp: 11,
        certifications: ['CISSP', 'CCSP', 'AWS Security Specialty', 'CISM'],
        clearance: 'TS/SCI (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 195000,
        matchScore: 92,
        aiAnalysis: {
          recommendation: 'STRONG RECOMMEND' as const,
          recommendationDetail:
            'Has been the security lead on this exact DHS cloud migration contract for 3 years and led the DHS OCIO zero trust pilot — unmatched environment knowledge for the win themes. Recruiting from the incumbent must be handled with ethical-wall care.',
          competitiveAdvantage:
            'Current security lead on this very contract and the OCIO zero-trust pilot lead — incumbent-level knowledge of the environment evaluators already associate with her.',
          strengths: [
            'Currently the security lead on this exact contract — unmatched environment knowledge',
            'Led DHS OCIO zero trust pilot — evaluators know her work',
            'Holds all required AND preferred certifications',
            "Frustrated with Peraton's management — genuinely motivated to move",
          ],
          concerns: [
            'Recruiting from incumbent raises ethical concerns — must be handled carefully',
            'Peraton may invoke non-compete if they learn of our interest',
            'Evaluators may view this as predatory recruiting if not handled delicately',
          ],
          interviewQuestions: [
            'How would you describe your zero-trust pilot work for our proposal without disclosing anything proprietary to the current contract?',
            'What is your read on any Peraton non-compete, and how do we keep this transition clean and defensible?',
            'How would you stand up FedRAMP High continuous monitoring on day one given what you know about the environment?',
          ],
          resumeClarifications: [
            'Confirm the sanitized phrasing for your current role so the resume references no contract by name.',
            'Verify there is no contractual barrier (non-compete, NDA) that legal has not already cleared.',
          ],
        },
        loiStatus: 'signed' as const,
        notes: [
          {
            id: 'N-C-04-01-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'She approached our recruiter independently — we did not solicit. Ethical wall protocols established. Her resume will not reference current contract by name — uses sanitized description. Legal reviewed and approved.',
            date: '2026-02-08',
          },
        ],
      },
      {
        id: 'C-04-02',
        lcatId: 'LCAT-04',
        name: 'Derek Washington',
        rank: 2,
        source: 'internal' as const,
        status: 'committed' as const,
        education: 'BS Cybersecurity, University of Maryland Baltimore County',
        yearsExp: 7,
        certifications: ['CISSP', 'AWS Security Specialty', 'CompTIA Security+'],
        clearance: 'TS/SCI (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 165000,
        matchScore: 78,
        aiAnalysis: {
          recommendation: 'RECOMMEND' as const,
          recommendationDetail:
            'Five years on TechForward\'s DHS CISA modernization contract implementing microsegmentation and zero trust controls. Solid hands-on engineer who has not yet held a lead security role.',
          competitiveAdvantage:
            'Hands-on zero-trust implementation experience earned on our own Exceptional-CPARS DHS CISA contract.',
          strengths: [
            'Internal candidate with DHS experience on our Exceptional CPARS contract',
            'Hands-on zero trust implementation experience at CISA',
            'No recruiting risk — committed TechForward employee',
          ],
          concerns: [
            'Less senior than Rachel Foster — 7 years vs 11 years experience',
            'Has not served as lead security engineer on a program',
            'Pulling from CISA contract requires backfill',
          ],
          interviewQuestions: [
            'Describe the microsegmentation and zero-trust controls you implemented at CISA and the outcomes they produced.',
            'You have not led a security team before — how would you grow into the lead role behind Rachel Foster?',
            'What backfill is needed on the CISA contract when you transition, and how soon?',
          ],
          resumeClarifications: [
            'Confirm the CISA contract CPARS period to align with the past-performance volume.',
          ],
        },
        loiStatus: 'signed' as const,
        notes: [
          {
            id: 'N-C-04-02-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Excellent second security engineer to support Rachel Foster. Can grow into lead role over contract period. CISA backfill: recruit external replacement.',
            date: '2026-02-08',
          },
        ],
      },
    ],
  },

  // ─── LCAT-05 · DevOps Engineer ─────────────────────────────────────────────
  {
    id: 'LCAT-05',
    title: 'DevOps Engineer',
    isKeyPersonnel: false,
    classification: 'commodity' as const,
    quantity: 4,
    requirements: {
      education: "Bachelor's degree in Computer Science or related field",
      yearsExp: 4,
      certifications: ['AWS DevOps Engineer Associate (minimum)'],
      clearance: 'Secret (minimum)',
      location: 'Washington, DC / Remote hybrid',
    },
    salaryRange: { min: 115000, max: 155000 },
    status: 'partial' as const,
    filledCount: 1,
    documents: {
      jobReq: 'draft' as const,
      interviewQs: 'draft' as const,
      evalCriteria: 'not_started' as const,
      handoffPackage: 'not_started' as const,
    },
    candidates: [
      {
        id: 'C-05-01',
        lcatId: 'LCAT-05',
        name: 'Marcus Williams',
        rank: 1,
        source: 'internal' as const,
        status: 'committed' as const,
        education: 'BS Computer Science, NC State University',
        yearsExp: 8,
        certifications: [
          'AWS DevOps Engineer Professional',
          'HashiCorp Terraform Associate',
          'CKA',
        ],
        clearance: 'Secret (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 155000,
        matchScore: 85,
        aiAnalysis: {
          recommendation: 'RECOMMEND' as const,
          recommendationDetail:
            'Lead DevOps on the Army cloud migration who built CI/CD pipelines for 180 migrated applications and authored TechForward\'s IaC standards. Holds only a Secret clearance, which may need upgrading for some DHS work.',
          competitiveAdvantage:
            'Built the DevSecOps pipeline for our most relevant past performance and authored the firm\'s Terraform/IaC standards.',
          strengths: [
            'Built DevSecOps pipeline for our most relevant past performance',
            "Terraform expert — authored TechForward's IaC standards",
            'Internal candidate — no risk',
          ],
          concerns: [
            'Only Secret clearance — may need TS/SCI upgrade for certain DHS work',
            'Pulling from Army program impacts that delivery',
          ],
          interviewQuestions: [
            'How would you adapt the Army CI/CD pipeline you built to a FedRAMP High environment at DHS?',
            'As DevOps Lead, how would you structure and mentor the three additional engineers we still need to hire?',
            'Which DHS tasks would require a TS/SCI upgrade for you, and how should we sequence that?',
          ],
          resumeClarifications: [
            'Confirm the toolchain (Jenkins/GitLab/GitHub Actions) used on the 180-application pipeline for the technical volume.',
          ],
        },
        loiStatus: 'signed' as const,
        notes: [
          {
            id: 'N-C-05-01-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Will serve as DevOps Lead. Other 3 DevOps positions to be filled from recruiting pipeline and partner staff.',
            date: '2026-02-08',
          },
        ],
      },
      {
        id: 'C-05-02',
        lcatId: 'LCAT-05',
        name: 'Sarah Abrams',
        rank: 2,
        source: 'external' as const,
        status: 'sourcing' as const,
        education: 'BS Information Technology, James Madison University',
        yearsExp: 5,
        certifications: ['AWS DevOps Engineer Associate', 'CKA'],
        clearance: 'TS/SCI (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 135000,
        matchScore: 72,
        aiAnalysis: {
          recommendation: 'CONDITIONAL' as const,
          recommendationDetail:
            'Three years of DevOps on DHS EAGLE II task orders with an active TS/SCI and Kubernetes experience. Relatively junior at 5 years total and self-taught on Terraform without certification.',
          competitiveAdvantage:
            'Active TS/SCI plus DHS EAGLE II familiarity — a cleared DevOps body that can deploy to classified work immediately.',
          strengths: [
            'Active TS/SCI clearance — valuable for cleared DevOps work',
            'DHS EAGLE II experience adds familiarity with environment',
            'Available within 30 days of offer',
          ],
          concerns: [
            'Less experienced — 5 years total',
            'No Terraform certification (self-taught)',
            'May need mentoring for enterprise-scale pipelines',
          ],
          interviewQuestions: [
            'Walk us through a CI/CD pipeline you built on EAGLE II and where it stretched your experience.',
            'You are self-taught on Terraform — how do you keep your IaC maintainable, and would you pursue certification?',
            'How do you see yourself ramping to enterprise-scale pipelines under a DevOps Lead like Marcus Williams?',
          ],
          resumeClarifications: [
            'Specify which EAGLE II task orders you supported and your role on each.',
          ],
        },
        loiStatus: 'sent' as const,
        notes: [
          {
            id: 'N-C-05-02-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Good complement to Marcus Williams. Her TS/SCI clearance fills the gap in the DevOps team. Interview scheduled.',
            date: '2026-02-08',
          },
        ],
      },
    ],
  },

  // ─── LCAT-06 · Systems Administrator ───────────────────────────────────────
  {
    id: 'LCAT-06',
    title: 'Systems Administrator',
    isKeyPersonnel: false,
    classification: 'commodity' as const,
    quantity: 4,
    requirements: {
      education: "Associate's degree in IT or related field",
      yearsExp: 3,
      certifications: ['AWS SysOps Administrator Associate OR Azure Administrator Associate'],
      clearance: 'Secret (minimum)',
      location: 'Washington, DC / Remote (after initial 90-day on-site period)',
    },
    salaryRange: { min: 95000, max: 130000 },
    status: 'reviewing' as const,
    filledCount: 0,
    documents: {
      jobReq: 'draft' as const,
      interviewQs: 'not_started' as const,
      evalCriteria: 'not_started' as const,
      handoffPackage: 'not_started' as const,
    },
    candidates: [
      {
        id: 'C-06-01',
        lcatId: 'LCAT-06',
        name: 'Tyler Jackson',
        rank: 1,
        source: 'internal' as const,
        status: 'submitted' as const,
        education: 'BS Information Technology, Western Governors University',
        yearsExp: 6,
        certifications: ['AWS SysOps Administrator Associate', 'CompTIA Security+', 'RHCSA'],
        clearance: 'Secret (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 115000,
        matchScore: 80,
        aiAnalysis: {
          recommendation: 'RECOMMEND' as const,
          recommendationDetail:
            'Four years of federal cloud systems administration, currently managing the AWS environment for a Treasury contract with strong Linux (RHCSA) skills. No DHS-specific environment experience yet.',
          competitiveAdvantage:
            'Internal candidate with hands-on AWS GovCloud SysOps and RHCSA-level Linux depth ready to lead the SysAdmin function.',
          strengths: [
            'Internal candidate with federal cloud administration experience',
            'AWS SysOps certified with hands-on GovCloud experience',
            'Strong Linux skills — RHCSA certified',
          ],
          concerns: [
            'Treasury contract may need him through FY2026 — timing coordination needed',
            'No DHS-specific environment experience',
          ],
          interviewQuestions: [
            'How would you set up monitoring and patch management for a migrated DHS cloud environment in the first 90 days?',
            'Your Treasury contract may need you through FY2026 — how would we coordinate your transition timing?',
            'How quickly could you ramp on the DHS operational environment given your Treasury and GovCloud background?',
          ],
          resumeClarifications: [
            'Confirm your earliest realistic release date from the Treasury contract.',
          ],
        },
        loiStatus: 'not_sent' as const,
        notes: [
          {
            id: 'N-C-06-01-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Solid SysAdmin candidate. Remaining 3 SysAdmin positions will be filled from recruiting pipeline — commodity skill set with strong market availability.',
            date: '2026-02-08',
          },
        ],
      },
      {
        id: 'C-06-02',
        lcatId: 'LCAT-06',
        name: 'Emma Rodriguez',
        rank: 2,
        source: 'external' as const,
        status: 'sourcing' as const,
        education: 'AS Network Administration, Northern Virginia Community College; pursuing BS',
        yearsExp: 4,
        certifications: [
          'AWS SysOps Administrator Associate',
          'Azure Administrator Associate',
          'CompTIA Security+',
        ],
        clearance: 'Secret (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 100000,
        matchScore: 68,
        aiAnalysis: {
          recommendation: 'CONDITIONAL' as const,
          recommendationDetail:
            'Three years of DoD cloud administration with dual AWS/Azure certification and fast availability. Junior at 4 years, with no federal civilian agency experience and a bachelor\'s still in progress.',
          competitiveAdvantage:
            'Dual AWS + Azure SysOps certification at a competitive commodity salary, available within two weeks.',
          strengths: [
            'Dual AWS + Azure certification matches multi-cloud requirement',
            'Available within 2 weeks of offer',
            'Competitive salary expectations for commodity role',
          ],
          concerns: [
            'Relatively junior — 4 years experience',
            'No federal civilian agency experience (DoD only)',
            "Still completing bachelor's degree",
          ],
          interviewQuestions: [
            'Describe a multi-cloud monitoring setup you configured and how you handled alerting across AWS and Azure.',
            'You have DoD-only experience — how would you adapt to a federal civilian (DHS) operational environment?',
            'How are you balancing your bachelor\'s completion with a full-time on-site commitment for the first 90 days?',
          ],
          resumeClarifications: [
            'Confirm expected graduation date for the in-progress bachelor\'s degree.',
          ],
        },
        loiStatus: 'sent' as const,
        notes: [
          {
            id: 'N-C-06-02-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Pipeline candidate for one of 4 SysAdmin positions. Dual certification is a plus. Junior level is acceptable for commodity role with senior oversight.',
            date: '2026-02-08',
          },
        ],
      },
      {
        id: 'C-06-03',
        lcatId: 'LCAT-06',
        name: 'Ahmad Khalil',
        rank: 3,
        source: 'external' as const,
        status: 'sourcing' as const,
        education: 'BS Computer Science, George Mason University',
        yearsExp: 5,
        certifications: [
          'AWS SysOps Administrator Associate',
          'CompTIA Security+',
          'Splunk Core Certified User',
        ],
        clearance: 'TS/SCI (active)',
        clearanceStatus: 'active' as const,
        salaryExpectation: 120000,
        matchScore: 75,
        aiAnalysis: {
          recommendation: 'RECOMMEND' as const,
          recommendationDetail:
            'Three years of DHS CBP cloud and on-prem systems administration with AWS GovCloud and Splunk experience, plus an active TS/SCI. Extraction from Leidos is gated by a 6-month non-compete under legal review.',
          competitiveAdvantage:
            'DHS CBP experience plus active TS/SCI and Splunk certification — immediately deployable to classified work on the agency\'s SIEM toolset.',
          strengths: [
            'DHS experience (CBP) — understands DHS operational environment',
            'TS/SCI cleared — immediately deployable to classified environments',
            'Splunk certification aligns with DHS SIEM toolset',
          ],
          concerns: [
            'Leidos non-compete clause — 6-month restriction for DHS work',
            'May be difficult to extract from current Leidos contract',
          ],
          interviewQuestions: [
            'How did you use Splunk for monitoring and alerting on the CBP environment, and how would that transfer here?',
            'The Leidos non-compete poses a 6-month DHS restriction — how do you read its enforceability and your availability?',
            'What did your DHS CBP work teach you about the operational environment that would accelerate our standup?',
          ],
          resumeClarifications: [
            'Provide the specific terms and start date of the Leidos non-compete for legal review.',
          ],
        },
        loiStatus: 'not_sent' as const,
        notes: [
          {
            id: 'N-C-06-03-1',
            userName: 'S. Chen',
            userRole: 'BD' as const,
            text: 'Attractive due to DHS experience and TS/SCI clearance. Legal reviewing Leidos non-compete. If cleared, would be strong addition for classified work.',
            date: '2026-02-08',
          },
        ],
      },
    ],
  },
];

const salaryBenchmarks = [
  {
    lcatId: 'LCAT-01',
    // LCAT mid = (165000+190000)/2 = 177500. gsaCalc.mid 188000 → Above (+5.9%).
    gsaCalc: { low: 168000, mid: 188000, high: 212000 },
    glassdoor: { low: 172000, mid: 195000, high: 224000, region: 'Washington, DC Metro' },
    competitors: { 'Booz Allen': 205000, Leidos: 192000 },
    recommendation:
      'Market for cleared federal program managers runs above our current band. Our $190K cap sits below Steven Mitchell\'s $195K expectation — hold the line for backups but be prepared to flex toward the GSA mid for a discriminator-grade PM.',
  },
  {
    lcatId: 'LCAT-02',
    // LCAT mid = (185000+235000)/2 = 210000. gsaCalc.mid 208000 → At Market (-1.0%).
    gsaCalc: { low: 192000, mid: 208000, high: 236000 },
    glassdoor: { low: 198000, mid: 215000, high: 245000, region: 'Washington, DC Metro' },
    competitors: { 'Booz Allen': 228000, Leidos: 214000 },
    recommendation:
      'Our band is competitive at market for a TS/SCI cloud architect lead. David Kim sits at the $235K ceiling and Booz Allen will counter aggressively — the retention bonus and equity in his LOI are the right lever, not base alone.',
  },
  {
    lcatId: 'LCAT-03',
    // LCAT mid = (160000+195000)/2 = 177500. gsaCalc.mid 176000 → At Market (-0.8%).
    gsaCalc: { low: 158000, mid: 176000, high: 196000 },
    glassdoor: { low: 162000, mid: 181000, high: 202000, region: 'Washington, DC Metro' },
    competitors: { 'Booz Allen': 186000, Leidos: 178000 },
    recommendation:
      'Migration architect comp is well-aligned to market. Both candidates fall inside the band; budget the TS/SCI upgrade lead time for Natasha Volkov rather than a base premium.',
  },
  {
    lcatId: 'LCAT-04',
    // LCAT mid = (145000+195000)/2 = 170000. gsaCalc.mid 172000 → At Market (+1.2%).
    gsaCalc: { low: 152000, mid: 172000, high: 196000 },
    glassdoor: { low: 156000, mid: 178000, high: 204000, region: 'Washington, DC Metro' },
    competitors: { 'Booz Allen': 184000, Leidos: 175000 },
    recommendation:
      'Security engineer comp is on market. Rachel Foster at $195K is at the ceiling but justified by exact-contract experience; Derek Washington gives margin at the lower end to balance the blended rate.',
  },
  {
    lcatId: 'LCAT-05',
    // LCAT mid = (115000+155000)/2 = 135000. gsaCalc.mid 128000 → Below (-5.2%).
    gsaCalc: { low: 116000, mid: 128000, high: 144000 },
    glassdoor: { low: 118000, mid: 132000, high: 150000, region: 'Washington, DC Metro' },
    competitors: { 'Booz Allen': 138000, Leidos: 130000 },
    recommendation:
      'Our DevOps band sits modestly above the GSA mid, giving room to attract cleared talent for the three open seats. A TS/SCI premium (as with Sarah Abrams) is reasonable without breaching the ceiling.',
  },
  {
    lcatId: 'LCAT-06',
    // LCAT mid = (95000+130000)/2 = 112500. gsaCalc.mid 119000 → Above (+5.8%).
    gsaCalc: { low: 102000, mid: 119000, high: 134000 },
    glassdoor: { low: 104000, mid: 122000, high: 138000, region: 'Washington, DC Metro' },
    competitors: { 'Booz Allen': 124000, Leidos: 116000 },
    recommendation:
      'GSA and Glassdoor mids run above our band midpoint for SysAdmins, so price the three pipeline hires toward the top of our range — a cleared candidate like Ahmad Khalil will command the upper end.',
  },
];

const timeline = {
  currentDate: '2026-06-16',
  rfpRelease: '2026-06-01',
  proposalDue: '2026-08-02',
  award: '2026-10-15',
  clearanceLeadTimes: [
    { label: 'TS/SCI', minMonths: 6, maxMonths: 12 },
    { label: 'Secret', minMonths: 3, maxMonths: 6 },
  ],
};

export const staffingData: StaffingData = {
  opportunity,
  incumbent,
  lcats,
  salaryBenchmarks,
  timeline,
};

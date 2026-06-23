import type { PricingData } from '../../types/pricing';

// ─────────────────────────────────────────────────────────────────────────────
// GovHub Capture › Pricing tab — frontend-only demo data.
// DHS Enterprise Cloud Migration & Modernization (opp-001). Incumbent: Peraton.
// Consistent with the Staffing & Past Performance demos.
//
// ROM math is REAL (computed by src/app/components/capture/pricing/romMath.ts).
// The inputs below are tuned so each scenario's computed totalPrice lands on its
// strategic target. Hand-verified rollups (see math notes per scenario):
//   • primary      → totalPrice ≈ $42.46M  (target ~$42.5M; PTW $42.0M / proposed $42.8M)
//   • aggressive   → totalPrice ≈ $39.95M  (target ~$40.0M)
//   • conservative → totalPrice ≈ $45.98M  (target ~$46.0M)
//
// Escalation Σ(1+e)^y for y=0..4:  e=0.030 → 5.30913581 ;
//   e=0.025 → 5.25632852 ; e=0.035 → 5.36246588.
// Burden chain: fringeAmount = TDL×fringe ; overheadAmount = (TDL+fringe)×overhead ;
//   subtotalBeforeGA = TDL+fringe+OH+ODC+subs ; GA = subtotal×ga ;
//   totalCost = subtotal+GA ; fee = totalCost×fee ; totalPrice = totalCost+fee.
// Rates stored as decimals; dates yyyy-mm-dd.
// ─────────────────────────────────────────────────────────────────────────────

const opportunity: PricingData['opportunity'] = {
  title: 'Enterprise Cloud Migration and Modernization Services',
  agency: 'Department of Homeland Security',
  subAgency: 'Office of the CIO (OCIO)',
  naics: '541512',
  contractType: 'FFP (Base Year) / T&M (Option Years)',
  setAside: 'EAGLE II SB — 8(a) Set-Aside',
  period: '1 Base Year + 4 Option Years',
  postedCeiling: 45000000,
};

const strategy: PricingData['strategy'] = {
  approach: 'competitive',
  positioning: 'competitive',
  rationale:
    "Win on best-value, not lowest price. We undercut the incumbent's visible senior-labor band ($185/hr vs. Peraton's public $195/hr) while leading on the two discriminators evaluators can verify: an active FedRAMP High environment and same-agency DHS OCIO past performance. The bid is positioned ~6.7% under the $45M ceiling to signal price discipline without bidding into LPTA territory.",
  ptw: { low: 40000000, target: 42000000, high: 43500000, confidence: 'medium' },
  budget: {
    postedEstimate: 45000000,
    igceEstimate: 42000000,
    historicalSpending: 38500000,
    trend: 'stable',
    trendRationale:
      '8 comparable DHS OCIO cloud awards FY23–25 show stable spend in the $38–42M band.',
  },
  risks: [
    {
      text: 'LPTA conversion risk — the draft solicitation has not confirmed best-value vs. LPTA; a conversion would strip the bid toward the $38M floor and erase the margin posture.',
      severity: 'high',
    },
    {
      text: 'Subcontractor cost unlocked — $11M+ of subcontractor value sits behind unsigned teaming agreements (GovFlow term-sheet, MainframeNext unsigned), so the build-up carries a ±$1M band until the TAs execute.',
      severity: 'high',
    },
    {
      text: 'Escalation assumption across the four option years — a 3% annual escalation that runs hot against federal labor-market data would compress margin in the out-years.',
      severity: 'medium',
    },
  ],
  opportunities: [
    {
      text: "Incumbent ATO re-authorization cost we do not carry — Peraton's expiring agency ATO forces a re-authorization that competitors must price in; our active FedRAMP High posture is a structural ~4–6 week ramp advantage.",
      severity: 'high',
    },
    {
      text: 'FedRAMP-environment overhead efficiency — reuse of the existing accredited environment lets us hold overhead near 22% rather than carrying stand-up cost, directly funding the PTW gap.',
      severity: 'medium',
    },
    {
      text: '8(a) set-aside narrows the competitive field — the EAGLE II SB 8(a) restriction limits the pool of technically-credible offerors, raising our best-value win odds.',
      severity: 'medium',
    },
  ],
  recommendations: [
    'Set the Price-to-Win target at $42.0M — ~6.7% under ceiling, above the LPTA floor, credible as the lowest technically-superior offer.',
    'Hold the senior-labor rate at $185/hr to undercut the incumbent on the publicly visible band without signaling a distressed price.',
    'Do not bid below the $38M LPTA floor unless the solicitation formally converts to LPTA; treat $38M as the absolute floor and escalate any pressure to go lower.',
  ],
  dataPoints: [
    {
      id: 'dp-incumbent-value',
      source: 'FPDS',
      dataType: 'Incumbent contract value',
      value: 38000000,
      date: '2025-09-01',
      confidence: 'verified',
    },
    {
      id: 'dp-historical-avg',
      source: 'USAspending',
      dataType: 'Historical comparable-award average',
      value: 38500000,
      date: '2026-01-15',
      confidence: 'estimated',
    },
    {
      id: 'dp-gsa-senior-median',
      source: 'GSA CALC',
      dataType: 'Senior labor loaded rate',
      value: 200,
      date: '2026-01-20',
      confidence: 'verified',
    },
    {
      id: 'dp-incumbent-rate',
      source: 'User input',
      dataType: 'Incumbent public billing rate (industry day)',
      value: 195,
      date: '2026-01-15',
      confidence: 'inferred',
    },
    {
      id: 'dp-lpta-floor',
      source: 'User input',
      dataType: 'LPTA contingency floor',
      value: 38000000,
      date: '2026-02-05',
      confidence: 'estimated',
    },
  ],
};

// ─── Scenarios ───────────────────────────────────────────────────────────────
// PRIMARY — worked baseline. labor base Σ(qty×1880×rate) = 2,329,320 ;
//   TDL = ×5.30913581 ≈ 12,366,677 ; fringe 3,710,003 ; OH 3,536,870 ;
//   ODC 1,480,000 ; subs 16,000,000 → subtotalBeforeGA ≈ 37,093,550 ;
//   GA 2,967,484 → cost 40,061,034 ; fee 2,403,662 → totalPrice ≈ $42.46M. ✓
const primary: PricingData['scenarios'][number] = {
  key: 'primary',
  label: 'Primary (recommended)',
  description:
    'Best-value baseline at the $42.0M Price-to-Win posture — disciplined senior rates, FedRAMP-efficiency overhead, and subcontractor costs negotiated down from full workshare.',
  years: 5,
  labor: [
    { id: 'lab-pm', lcat: 'Program Manager', qty: 1, hoursPerYear: 1880, years: 5, directRate: 105, escalation: 0.03, source: 'staffing-import' },
    { id: 'lab-techlead', lcat: 'Technical Lead / Cloud Architect', qty: 1, hoursPerYear: 1880, years: 5, directRate: 118, escalation: 0.03, source: 'staffing-import' },
    { id: 'lab-cloudarch', lcat: 'Cloud Architect (Migration)', qty: 2, hoursPerYear: 1880, years: 5, directRate: 93, escalation: 0.03, source: 'staffing-import' },
    { id: 'lab-security', lcat: 'Security Engineer', qty: 3, hoursPerYear: 1880, years: 5, directRate: 98, escalation: 0.03, source: 'staffing-import' },
    { id: 'lab-devops', lcat: 'DevOps Engineer', qty: 4, hoursPerYear: 1880, years: 5, directRate: 78, escalation: 0.03, source: 'staffing-import' },
    { id: 'lab-sysadmin', lcat: 'Systems Administrator', qty: 4, hoursPerYear: 1880, years: 5, directRate: 56, escalation: 0.03, source: 'staffing-import' },
  ],
  odc: [
    { id: 'odc-travel', category: 'travel', description: 'Quarterly on-site at DHS facilities', qty: 1, unitCost: 60000, frequency: 'annual', years: 5 },
    { id: 'odc-licenses', category: 'licenses', description: 'AWS GovCloud + analytics tooling', qty: 1, unitCost: 220000, frequency: 'annual', years: 5 },
    { id: 'odc-materials', category: 'materials', description: 'Secure workstations / peripherals', qty: 1, unitCost: 80000, frequency: 'one-time', years: 5 },
  ],
  subs: [
    { id: 'sub-databridge', name: 'DataBridge Analytics', scope: 'Data Migration & ETL', workshare: 20, totalCost: 8000000, taStatus: 'verbal' },
    { id: 'sub-govflow', name: 'GovFlow Technologies', scope: 'ServiceNow & ITSM', workshare: 15, totalCost: 5250000, taStatus: 'term-sheet' },
    { id: 'sub-mainframenext', name: 'MainframeNext Inc.', scope: 'Mainframe Modernization', workshare: 10, totalCost: 2750000, taStatus: 'unsigned' },
  ],
  indirect: { fringe: 0.3, overhead: 0.22, ga: 0.08, fee: 0.06 },
  basisOfEstimate:
    'Bottom-up build-up on the Staffing LCAT basis (15 prime FTE / 6 categories, 1,880 productive hours/yr, 3% annual escalation across the base + four option years), fully burdened with fringe (30%), FedRAMP-efficiency overhead (22%), G&A (8%), and fee (6%). Subcontractor costs are carried at the teaming workshare negotiated down ~$4M from the $20.25M full allocation; ODCs cover travel, GovCloud/tooling, and one-time secure materials.',
  assumptions: [
    '3% annual labor escalation applied uniformly across the base and all four option years.',
    'Direct labor rates taken at the midpoints of the Staffing compensation ranges (senior Key Personnel held near top-of-band as proposal discriminators).',
    'Subcontractor costs negotiated from the $20.25M full workshare to $16.0M via the gap-closing lever, with two of three TAs still unsigned.',
    'Overhead held at 22% by reusing the existing FedRAMP High environment rather than carrying stand-up cost.',
  ],
};

// AGGRESSIVE — leaner. base Σ(qty×1800×rate)=2,129,400 ; TDL ×5.25632852 ≈ 11,192,826 ;
//   fringe 3,357,848 ; OH 3,201,148 ; ODC 1,480,000 ; subs 16,000,000 →
//   subtotalBeforeGA ≈ 35,231,822 ; GA 2,818,546 → cost 38,050,368 ;
//   fee(5%) 1,902,518 → totalPrice ≈ $39.95M. ✓  (SysAdmin dropped to 3 FTE,
//   1,800 hrs, escalation 2.5%, fee 5%; subs negotiated off full workshare.)
const aggressive: PricingData['scenarios'][number] = {
  key: 'aggressive',
  label: 'Aggressive (price-to-win minus)',
  description:
    'Leaner staffing and a thinner fee to drive maximum price competitiveness — fewer productive hours, one fewer commodity FTE, and the deepest subcontractor negotiation, at the cost of margin and delivery cushion.',
  years: 5,
  labor: [
    { id: 'lab-pm', lcat: 'Program Manager', qty: 1, hoursPerYear: 1800, years: 5, directRate: 105, escalation: 0.025, source: 'staffing-import' },
    { id: 'lab-techlead', lcat: 'Technical Lead / Cloud Architect', qty: 1, hoursPerYear: 1800, years: 5, directRate: 118, escalation: 0.025, source: 'staffing-import' },
    { id: 'lab-cloudarch', lcat: 'Cloud Architect (Migration)', qty: 2, hoursPerYear: 1800, years: 5, directRate: 93, escalation: 0.025, source: 'staffing-import' },
    { id: 'lab-security', lcat: 'Security Engineer', qty: 3, hoursPerYear: 1800, years: 5, directRate: 98, escalation: 0.025, source: 'staffing-import' },
    { id: 'lab-devops', lcat: 'DevOps Engineer', qty: 4, hoursPerYear: 1800, years: 5, directRate: 78, escalation: 0.025, source: 'staffing-import' },
    { id: 'lab-sysadmin', lcat: 'Systems Administrator', qty: 3, hoursPerYear: 1800, years: 5, directRate: 56, escalation: 0.025, source: 'staffing-import' },
  ],
  odc: [
    { id: 'odc-travel', category: 'travel', description: 'Quarterly on-site at DHS facilities', qty: 1, unitCost: 60000, frequency: 'annual', years: 5 },
    { id: 'odc-licenses', category: 'licenses', description: 'AWS GovCloud + analytics tooling', qty: 1, unitCost: 220000, frequency: 'annual', years: 5 },
    { id: 'odc-materials', category: 'materials', description: 'Secure workstations / peripherals', qty: 1, unitCost: 80000, frequency: 'one-time', years: 5 },
  ],
  subs: [
    { id: 'sub-databridge', name: 'DataBridge Analytics', scope: 'Data Migration & ETL', workshare: 20, totalCost: 8000000, taStatus: 'verbal' },
    { id: 'sub-govflow', name: 'GovFlow Technologies', scope: 'ServiceNow & ITSM', workshare: 15, totalCost: 5400000, taStatus: 'term-sheet' },
    { id: 'sub-mainframenext', name: 'MainframeNext Inc.', scope: 'Mainframe Modernization', workshare: 10, totalCost: 2600000, taStatus: 'unsigned' },
  ],
  indirect: { fringe: 0.3, overhead: 0.22, ga: 0.08, fee: 0.05 },
  basisOfEstimate:
    'Aggressive variant of the build-up: productive hours trimmed to 1,800/yr, one commodity Systems Administrator removed, escalation held to 2.5%, and fee thinned to 5%. Subcontractor costs are pressed to ~$16.0M against the $20.25M full workshare. The result maximizes price competitiveness but leaves little delivery or margin cushion.',
  assumptions: [
    'Leaner staffing — 1,800 productive hours/yr and one fewer Systems Administrator (3 vs. 4 FTE).',
    'Aggressive subcontractor negotiation pressing the workshare allocation down toward $16.0M.',
    'Thinner 5% fee accepted to win on price, reducing margin protection.',
    'Lower 2.5% escalation assumed, betting on a softer out-year labor market.',
  ],
};

// CONSERVATIVE — risk buffer. base Σ(qty×1920×rate)=2,528,640 (DevOps 5 FTE) ;
//   TDL ×5.36246588 ≈ 13,559,746 ; fringe 4,067,924 ; OH 3,878,087 ;
//   ODC 1,480,000 ; subs 16,800,000 → subtotalBeforeGA ≈ 39,785,757 ;
//   GA 3,182,861 → cost 42,968,618 ; fee(7%) 3,007,803 → totalPrice ≈ $45.98M. ✓
//   (1,920 hrs, +1 DevOps, escalation 3.5%, fee 7%; subs carried above the
//   primary case as a risk buffer but below full workshare pending TA execution.)
const conservative: PricingData['scenarios'][number] = {
  key: 'conservative',
  label: 'Conservative (margin-protected)',
  description:
    'Risk-buffered posture above the PTW — fuller productive hours, an added DevOps engineer, the highest escalation and fee, and subcontractor costs carried near full workshare to absorb the unsigned-TA exposure.',
  years: 5,
  labor: [
    { id: 'lab-pm', lcat: 'Program Manager', qty: 1, hoursPerYear: 1920, years: 5, directRate: 105, escalation: 0.035, source: 'staffing-import' },
    { id: 'lab-techlead', lcat: 'Technical Lead / Cloud Architect', qty: 1, hoursPerYear: 1920, years: 5, directRate: 118, escalation: 0.035, source: 'staffing-import' },
    { id: 'lab-cloudarch', lcat: 'Cloud Architect (Migration)', qty: 2, hoursPerYear: 1920, years: 5, directRate: 93, escalation: 0.035, source: 'staffing-import' },
    { id: 'lab-security', lcat: 'Security Engineer', qty: 3, hoursPerYear: 1920, years: 5, directRate: 98, escalation: 0.035, source: 'staffing-import' },
    { id: 'lab-devops', lcat: 'DevOps Engineer', qty: 5, hoursPerYear: 1920, years: 5, directRate: 78, escalation: 0.035, source: 'staffing-import' },
    { id: 'lab-sysadmin', lcat: 'Systems Administrator', qty: 4, hoursPerYear: 1920, years: 5, directRate: 56, escalation: 0.035, source: 'staffing-import' },
  ],
  odc: [
    { id: 'odc-travel', category: 'travel', description: 'Quarterly on-site at DHS facilities', qty: 1, unitCost: 60000, frequency: 'annual', years: 5 },
    { id: 'odc-licenses', category: 'licenses', description: 'AWS GovCloud + analytics tooling', qty: 1, unitCost: 220000, frequency: 'annual', years: 5 },
    { id: 'odc-materials', category: 'materials', description: 'Secure workstations / peripherals', qty: 1, unitCost: 80000, frequency: 'one-time', years: 5 },
  ],
  subs: [
    { id: 'sub-databridge', name: 'DataBridge Analytics', scope: 'Data Migration & ETL', workshare: 20, totalCost: 8500000, taStatus: 'verbal' },
    { id: 'sub-govflow', name: 'GovFlow Technologies', scope: 'ServiceNow & ITSM', workshare: 15, totalCost: 5400000, taStatus: 'term-sheet' },
    { id: 'sub-mainframenext', name: 'MainframeNext Inc.', scope: 'Mainframe Modernization', workshare: 10, totalCost: 2900000, taStatus: 'unsigned' },
  ],
  indirect: { fringe: 0.3, overhead: 0.22, ga: 0.08, fee: 0.07 },
  basisOfEstimate:
    'Risk-buffered build-up: productive hours raised to 1,920/yr, one additional DevOps engineer added for surge coverage, escalation set to 3.5% to hedge the out-year labor market, and fee held at 7% to protect margin. Subcontractor costs are carried above the negotiated primary case (~$16.8M) as a buffer against the unsigned-TA exposure, while still sitting below the $20.25M full workshare pending execution.',
  assumptions: [
    'Fuller staffing — 1,920 productive hours/yr and one added DevOps engineer (5 vs. 4 FTE) for surge and risk coverage.',
    'Subcontractor costs carried above the primary negotiated case as a buffer against the unsigned GovFlow and MainframeNext TAs.',
    'Higher 3.5% escalation assumed to absorb a hot federal labor market across the option years.',
    'Fee held at 7% to protect the 22% margin target under delivery risk.',
  ],
};

const scenarios: PricingData['scenarios'] = [primary, aggressive, conservative];

// ─── Benchmarks ──────────────────────────────────────────────────────────────
// Our fully-burdened loaded rate = directRate × 1.30×1.22×1.08×1.06 = ×1.8156528.
//   PM 190.64 · TechLead 214.25 · CloudArch 168.86 · Security 177.93 ·
//   DevOps 141.62 · SysAdmin 101.68. GSA CALC bands set so most land p25–p75;
//   Security Engineer is the single above-p75 (p75 168 < our 177.93) → "adjust".
const benchmarks: PricingData['benchmarks'] = [
  {
    lcat: 'Program Manager',
    min: 150,
    p25: 178,
    median: 192,
    p75: 210,
    max: 245,
    recommendation: 'At ~$191 loaded our Program Manager sits just under the GSA median — competitively priced, hold as is.',
  },
  {
    lcat: 'Technical Lead / Cloud Architect',
    min: 170,
    p25: 200,
    median: 215,
    p75: 235,
    max: 270,
    recommendation: 'Our ~$214 loaded rate lands on the GSA median band — well-positioned for a Key Personnel discriminator, no change needed.',
  },
  {
    lcat: 'Cloud Architect (Migration)',
    min: 135,
    p25: 158,
    median: 172,
    p75: 190,
    max: 220,
    recommendation: 'At ~$169 loaded the migration architects fall mid-band between p25 and median — at-market and defensible.',
  },
  {
    lcat: 'Security Engineer',
    min: 130,
    p25: 150,
    median: 160,
    p75: 168,
    max: 185,
    recommendation: 'Our ~$178 loaded rate is above the GSA p75 of $168 — adjust the Security Engineer direct rate down or document the FedRAMP High premium to defend it.',
  },
  {
    lcat: 'DevOps Engineer',
    min: 115,
    p25: 132,
    median: 145,
    p75: 160,
    max: 185,
    recommendation: 'At ~$142 loaded the DevOps engineers sit below the GSA median — strong price competitiveness, hold.',
  },
  {
    lcat: 'Systems Administrator',
    min: 85,
    p25: 96,
    median: 106,
    p75: 118,
    max: 140,
    recommendation: 'Our ~$102 loaded rate is between p25 and median — competitive for a commodity role, no change needed.',
  },
];

// ─── Incumbent ───────────────────────────────────────────────────────────────
// inflationAdjusted = annualized 7,600,000 escalated over the 5-yr PoP
//   (≈ ×6.05 cumulative) ≈ $46.0M run-rate-equivalent.
const incumbent: PricingData['incumbent'] = {
  name: 'Peraton',
  currentValue: 38000000,
  years: 5,
  annualized: 7600000,
  inflationAdjusted: 46000000,
  analysis:
    "Our 5-year ~$42.5M Primary bid is modestly below Peraton's inflation-adjusted ~$46M run-rate-equivalent, while undercutting their visible $195/hr senior rate. That places us within the acceptable best-value range given FedRAMP High and same-agency past performance.",
};

// ─── Suggested ODCs ("Suggest ODCs") ─────────────────────────────────────────
const suggestedOdcs: PricingData['suggestedOdcs'] = [
  { id: 'sodc-ri-prepay', category: 'equipment', description: 'GovCloud reserved-instance prepay', qty: 1, unitCost: 250000, frequency: 'one-time', years: 5 },
  { id: 'sodc-3pao', category: 'other', description: 'Independent FedRAMP 3PAO assessment', qty: 1, unitCost: 90000, frequency: 'annual', years: 5 },
  { id: 'sodc-secure-space', category: 'facilities', description: 'Secure program space (DC metro)', qty: 1, unitCost: 72000, frequency: 'annual', years: 5 },
];

// ─── Win-probability overlay notes ───────────────────────────────────────────
const scenarioWinNotes: PricingData['scenarioWinNotes'] = {
  primary: 'At ~$42.5M, estimated ~62% price competitiveness — disciplined, best-value-credible.',
  aggressive: 'At ~$40.0M, ~74% price competitiveness but thinner margin and higher delivery risk.',
  conservative: 'At ~$46.0M, ~41% price competitiveness — above PTW, margin-protected.',
};

// ─── Price / risk quadrant ───────────────────────────────────────────────────
const pricePosition: PricingData['pricePosition'] = {
  quadrant: 'low-price / low-risk (competitive)',
  note: 'The Primary bid sits in the low-price / low-risk quadrant: ~$42.5M is competitively below the incumbent run-rate yet above the LPTA floor, signaling discipline without distress. Delivery risk stays manageable because the FedRAMP High environment and same-agency past performance remove the ramp and re-authorization exposure competitors must carry.',
};

export const pricingData: PricingData = {
  opportunity,
  strategy,
  scenarios,
  benchmarks,
  incumbent,
  suggestedOdcs,
  scenarioWinNotes,
  pricePosition,
};

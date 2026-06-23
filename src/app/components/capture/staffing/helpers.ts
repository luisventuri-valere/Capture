import type {
  Candidate, CandidateStatus, LcatStatus, LCAT, Recommendation, SalaryBenchmark, LcatClassification,
  IncumbentPerson, IncumbentStatus,
} from '../../../../types/staffing';

export const F = 'var(--gh-font)';

// ─── Derived logic (pure) ────────────────────────────────────────────────────

export function committedCount(cands: Candidate[]) {
  return cands.filter(c => c.status === 'committed').length;
}

export function calculateLcatStatus(cands: Candidate[], quantity: number): LcatStatus {
  const committed = committedCount(cands);
  if (committed >= quantity && quantity > 0) return 'ready';
  if (committed > 0) return 'partial';
  if (cands.some(c => c.status === 'submitted')) return 'reviewing';
  if (cands.length === 0) return 'gap';
  return 'sourcing';
}

export function recommendationFromScore(score: number): Recommendation {
  if (score >= 90) return 'STRONG RECOMMEND';
  if (score >= 75) return 'RECOMMEND';
  if (score >= 60) return 'CONDITIONAL';
  return 'BACKUP ONLY';
}

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral';

export interface Market { label: 'Below Market' | 'At Market' | 'Above Market'; tone: Tone; dir: 'down' | 'up' | 'flat' }
export function marketPosition(lcat: LCAT, b?: SalaryBenchmark): Market {
  if (!b) return { label: 'At Market', tone: 'accent', dir: 'flat' };
  const ourMid = (lcat.salaryRange.min + lcat.salaryRange.max) / 2;
  const diff = ((ourMid - b.gsaCalc.mid) / b.gsaCalc.mid) * 100;
  if (diff < -5) return { label: 'Below Market', tone: 'danger', dir: 'down' };
  if (diff > 5) return { label: 'Above Market', tone: 'success', dir: 'up' };
  return { label: 'At Market', tone: 'accent', dir: 'flat' };
}

export interface PriorityAction { lcatId: string; lcatTitle: string; priority: 'P1' | 'P2' | 'P3'; text: string; tone: Tone }
export function priorityActions(lcats: LCAT[]): PriorityAction[] {
  const out: PriorityAction[] = [];
  for (const l of lcats) {
    const st = calculateLcatStatus(l.candidates, l.quantity);
    if (st === 'gap') {
      out.push({ lcatId: l.id, lcatTitle: l.title, priority: 'P1', text: 'No candidates — escalate immediately', tone: 'danger' });
    } else if (st === 'reviewing') {
      const n = l.candidates.filter(c => c.status === 'submitted').length;
      out.push({ lcatId: l.id, lcatTitle: l.title, priority: 'P2', text: `${n} candidate${n === 1 ? '' : 's'} need BD review`, tone: 'warning' });
    } else if (st === 'partial') {
      const filled = committedCount(l.candidates);
      const need = l.quantity - filled;
      out.push({ lcatId: l.id, lcatTitle: l.title, priority: 'P3', text: `${filled}/${l.quantity} filled — need ${need} more`, tone: 'neutral' });
    }
  }
  const ord: Record<string, number> = { P1: 0, P2: 1, P3: 2 };
  return out.sort((a, b) => ord[a.priority] - ord[b.priority]);
}

// ─── Tone → GovHub tokens ────────────────────────────────────────────────────

export function tone(t: Tone) {
  switch (t) {
    case 'success': return { bg: 'var(--gh-success-bg)', fg: 'var(--gh-success-fg)', bd: 'var(--gh-success-border)' };
    case 'warning': return { bg: 'var(--gh-warning-bg)', fg: 'var(--gh-warning-fg)', bd: 'var(--gh-warning-border)' };
    case 'danger':  return { bg: 'var(--gh-danger-bg)',  fg: 'var(--gh-danger-fg-strong)',  bd: 'var(--gh-danger-border)' };
    case 'info':    return { bg: 'var(--gh-info-bg)',    fg: 'var(--gh-info-fg)',    bd: 'var(--gh-info-border)' };
    case 'accent':  return { bg: 'rgba(37,99,235,0.16)', fg: 'var(--gh-accent-tint)', bd: 'var(--gh-accent)' };
    default:        return { bg: 'var(--gh-bg-surface-muted)', fg: 'var(--gh-text-tertiary)', bd: 'var(--gh-border)' };
  }
}

export const lcatStatusTone: Record<LcatStatus, Tone> = {
  ready: 'success', partial: 'accent', reviewing: 'warning', sourcing: 'neutral', gap: 'danger',
};
export const candStatusTone = (s: string): Tone =>
  s === 'committed' ? 'success' : s === 'submitted' ? 'info' : s === 'reviewing' ? 'warning' : s === 'rejected' ? 'danger' : 'neutral';

// ─── Candidate lifecycle (Requirements Matrix row action) ─────────────────────
// sourcing → submitted (NOMINATE) → committed (COMMIT). Each forward step is
// reversible by exactly one step; nothing skips a state in either direction.
export const candidateNext: Partial<Record<CandidateStatus, { to: CandidateStatus; label: string }>> = {
  sourcing: { to: 'submitted', label: 'Nominate' },
  submitted: { to: 'committed', label: 'Commit' },
};
export const candidatePrev: Partial<Record<CandidateStatus, CandidateStatus>> = {
  committed: 'submitted',
  submitted: 'sourcing',
};
export const recTone = (r: Recommendation): Tone =>
  r === 'STRONG RECOMMEND' ? 'success' : r === 'RECOMMEND' ? 'accent' : r === 'CONDITIONAL' ? 'warning' : 'danger';
export const docTone = (s: string): Tone => (s === 'complete' ? 'success' : s === 'draft' ? 'warning' : 'neutral');
export const flightTone = (r: string): Tone => (r === 'high' ? 'danger' : r === 'medium' ? 'warning' : 'success');
export const classTone = (c: LcatClassification): Tone => (c === 'discriminator' ? 'accent' : c === 'critical' ? 'warning' : 'neutral');

// ─── Incumbent courtship state machine (Change 2) ─────────────────────────────
// not_contacted → contacted → interested  (exit at any point: not_pursued)
// 'in_pipeline' means the person has been moved into the candidate pipeline.

export const incStatusTone = (s: IncumbentStatus): Tone =>
  s === 'in_pipeline' ? 'success' : s === 'interested' ? 'info' : s === 'contacted' ? 'warning' : s === 'not_pursued' ? 'danger' : 'neutral';

// The forward step in the courtship, plus its button label. null → no advance available.
export const courtshipAdvance: Partial<Record<IncumbentStatus, { next: IncumbentStatus; label: string }>> = {
  not_contacted: { next: 'contacted', label: 'Mark contacted' },
  contacted: { next: 'interested', label: 'Mark interested' },
};

// Build a pipeline Candidate from an incumbent person, scoped to the LCAT they match.
// The destination LCAT IS the position — no picker. Tagged so the move can be reversed.
export function personToCandidate(p: IncumbentPerson, lcat: LCAT): Candidate {
  const yrs = parseInt(p.tenure, 10) || lcat.requirements.yearsExp;
  const matchScore = p.flightRisk === 'high' ? 80 : p.flightRisk === 'medium' ? 72 : 65;
  return {
    id: `C-INC-${p.id}`,
    lcatId: lcat.id,
    name: p.name,
    rank: lcat.candidates.length + 1,
    source: 'incumbent',
    status: 'sourcing',
    education: `Incumbent (${lcat.requirements.education.split(',')[0]})`,
    yearsExp: yrs,
    certifications: [],
    clearance: 'TS/SCI (active)',
    clearanceStatus: 'active',
    salaryExpectation: p.estimatedSalary,
    matchScore,
    aiAnalysis: {
      recommendation: recommendationFromScore(matchScore),
      recommendationDetail: `Sourced from the incumbent (${p.role}, ${p.tenure}). Brings working knowledge of the current environment; pending full evaluation against the ${lcat.title} requirement.`,
      competitiveAdvantage: 'Incumbent-level familiarity with the live program — evaluators recognize current performers on the contract.',
      strengths: ['Direct knowledge of the incumbent environment and stakeholders', `Flight risk: ${p.flightRisk.toUpperCase()} — genuinely recruitable`],
      concerns: ['Recruiting from the incumbent requires ethical-wall handling', 'Full resume, certifications, and references still to be verified'],
      interviewQuestions: [],
      resumeClarifications: [],
    },
    loiStatus: 'not_sent',
    notes: [],
    incumbentPersonId: p.id,
  };
}

// ─── Misc ────────────────────────────────────────────────────────────────────

export function money(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}
export function moneyFull(n: number) { return `$${n.toLocaleString('en-US')}`; }
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const titleCase = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

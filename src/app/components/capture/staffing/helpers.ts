import type {
  Candidate, LcatStatus, LCAT, Recommendation, SalaryBenchmark, LcatClassification,
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
    case 'danger':  return { bg: 'var(--gh-danger-bg)',  fg: 'var(--gh-danger-fg)',  bd: 'var(--gh-danger-border)' };
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
export const recTone = (r: Recommendation): Tone =>
  r === 'STRONG RECOMMEND' ? 'success' : r === 'RECOMMEND' ? 'accent' : r === 'CONDITIONAL' ? 'warning' : 'danger';
export const docTone = (s: string): Tone => (s === 'complete' ? 'success' : s === 'draft' ? 'warning' : 'neutral');
export const flightTone = (r: string): Tone => (r === 'high' ? 'danger' : r === 'medium' ? 'warning' : 'success');
export const classTone = (c: LcatClassification): Tone => (c === 'discriminator' ? 'accent' : c === 'critical' ? 'warning' : 'neutral');

// ─── Misc ────────────────────────────────────────────────────────────────────

export function money(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}
export function moneyFull(n: number) { return `$${n.toLocaleString('en-US')}`; }
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const titleCase = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

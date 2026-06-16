import type {
  Phase, TrustTier, Priority, Severity, ItemStatus, DataCallStatus, RecType, DataCall, DataCallItem,
} from '../../../../types/dataCalls';
import { tone, type Tone } from '../staffing/helpers';

export { F } from '../staffing/helpers';
export { tone };
export type { Tone };

// ─── Signature ORANGE accent (Data Calls differentiator) ─────────────────────
export const ORANGE = '#f97316';
export const ORANGE_TINT = '#fdba74';
export const orangeTone = { bg: 'rgba(249,115,22,0.16)', fg: ORANGE_TINT, bd: 'rgba(249,115,22,0.55)' };

// ─── Demo clock (everything is relative to this) ─────────────────────────────
export const TODAY = '2026-02-14';
const MS_DAY = 86_400_000;
export const daysUntil = (date: string): number => Math.round((new Date(date).getTime() - new Date(TODAY).getTime()) / MS_DAY);
export const isOverdue = (dueDate: string): number => daysUntil(dueDate) < 0 ? 1 : 0;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function fmtDate(date: string): string {
  const d = new Date(date);
  return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}`;
}
export function dueLabel(dueDate: string): { text: string; tone: Tone } {
  const d = daysUntil(dueDate);
  if (d < 0) return { text: `${-d}d overdue`, tone: 'danger' };
  if (d === 0) return { text: 'due today', tone: 'warning' };
  if (d <= 3) return { text: `due in ${d}d`, tone: 'warning' };
  return { text: `due ${fmtDate(dueDate)}`, tone: 'neutral' };
}

// ─── Phase coding (semantic: Pre-TA amber/gold · Post-TA blue) ───────────────
export const phaseLabel = (p: Phase) => (p === 'pre-ta' ? 'Pre-TA' : 'Post-TA');
export const phaseTone = (p: Phase): Tone => (p === 'pre-ta' ? 'warning' : 'info');
export const phaseSub = (p: Phase) => (p === 'pre-ta' ? 'Under NDA · Before commitment' : 'Under TA · RFP-formatted');

// ─── Status tones ────────────────────────────────────────────────────────────
export const itemStatusTone = (s: ItemStatus): Tone =>
  s === 'ACCEPTED' ? 'success' : s === 'UNDER_REVIEW' ? 'warning' : s === 'REJECTED' ? 'danger' :
  s === 'SUBMITTED' ? 'info' : 'neutral'; // REVISION_REQUESTED handled with orange inline
export const isRevision = (s: ItemStatus) => s === 'REVISION_REQUESTED';
export const itemStatusLabel = (s: ItemStatus) => s.replace(/_/g, ' ').toLowerCase();

export const callStatusTone = (s: DataCallStatus): Tone =>
  s === 'COMPLETE' ? 'success' : s === 'PARTIAL' ? 'warning' : s === 'SENT' ? 'info' : s === 'ACKNOWLEDGED' ? 'accent' : 'neutral';

export const priorityTone = (p: Priority): Tone =>
  p === 'CRITICAL' ? 'danger' : p === 'HIGH' ? 'warning' : p === 'MEDIUM' ? 'info' : 'neutral';
export const severityTone = (s: Severity): Tone =>
  s === 'CRITICAL' ? 'danger' : s === 'HIGH' ? 'warning' : s === 'MEDIUM' ? 'info' : 'neutral';

export const trustTone = (t: TrustTier): Tone => (t === 'PREFERRED' ? 'success' : t === 'TA' ? 'accent' : 'neutral');

// ─── Quality bands (90+ emerald · 80–89 cyan · 70–79 amber · <70 red) ────────
export function qualityBand(score?: number): { tone: Tone; label: string } {
  if (score === undefined) return { tone: 'neutral', label: 'unscored' };
  if (score >= 90) return { tone: 'success', label: 'proposal-ready' };
  if (score >= 80) return { tone: 'info', label: 'minor refinement' };
  if (score >= 70) return { tone: 'warning', label: 'has gaps' };
  return { tone: 'danger', label: 'needs revision' };
}

// ─── Recommendation type → label ─────────────────────────────────────────────
export const recTypeLabel: Record<RecType, string> = {
  gap: 'Gap', clarification: 'Clarification', comparison: 'Comparison', risk: 'Risk', quality: 'Quality', timing: 'Timing',
};

// ─── Aggregates ──────────────────────────────────────────────────────────────
export const itemAccepted = (i: DataCallItem) => i.status === 'ACCEPTED';
export const awaitingReview = (i: DataCallItem) => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW';
export function callProgress(c: DataCall): { accepted: number; total: number } {
  return { accepted: c.items.filter(itemAccepted).length, total: c.items.length };
}
export function partnerAgg(calls: DataCall[]): { accepted: number; total: number; awaiting: number; overdue: number } {
  let accepted = 0, total = 0, awaiting = 0, overdue = 0;
  for (const c of calls) {
    accepted += c.items.filter(itemAccepted).length;
    total += c.items.length;
    awaiting += c.items.filter(awaitingReview).length;
    if (isOverdue(c.dueDate) && c.status !== 'COMPLETE') overdue += c.items.filter(i => !itemAccepted(i)).length;
  }
  return { accepted, total, awaiting, overdue };
}
export const avgQuality = (calls: DataCall[]): number => {
  const scored = calls.flatMap(c => c.items).map(i => i.qualityScore).filter((s): s is number => s !== undefined);
  return scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : 0;
};

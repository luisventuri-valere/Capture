import type { Severity, BudgetTrend, MarketPosition, DataConfidence, TaStatus } from '../../../../types/pricing';
import type { Tone } from '../staffing/helpers';

export const sevTone = (s: Severity): Tone => (s === 'high' ? 'danger' : s === 'medium' ? 'warning' : 'neutral');
export const confTone = (c: string): Tone => (c === 'high' ? 'success' : c === 'medium' ? 'warning' : 'danger');
export const trendTone = (t: BudgetTrend): Tone => (t === 'increasing' ? 'success' : t === 'stable' ? 'accent' : 'warning');
export const dataConfTone = (c: DataConfidence): Tone => (c === 'verified' ? 'success' : c === 'estimated' ? 'warning' : 'neutral');
export const taTone = (s: TaStatus): Tone => (s === 'signed' ? 'success' : s === 'verbal' ? 'warning' : 'neutral');

// live market position from our loaded rate vs the GSA band
export function marketPosition(ourRate: number, b: { min: number; p25: number; p75: number; max: number }): { pos: MarketPosition; tone: Tone; percentile: number } {
  let pos: MarketPosition;
  if (ourRate < b.min || ourRate > b.max) pos = 'extreme';
  else if (ourRate < b.p25) pos = 'below-market';
  else if (ourRate > b.p75) pos = 'above-market';
  else pos = 'at-market';
  const tone: Tone = pos === 'at-market' ? 'success' : pos === 'extreme' ? 'danger' : 'warning';
  const span = Math.max(b.max - b.min, 1);
  const percentile = Math.round(Math.min(100, Math.max(0, ((ourRate - b.min) / span) * 100)));
  return { pos, tone, percentile };
}
export const positionLabel = (p: MarketPosition) =>
  p === 'at-market' ? 'At market' : p === 'above-market' ? 'Above market' : p === 'below-market' ? 'Below market' : 'Out of band';

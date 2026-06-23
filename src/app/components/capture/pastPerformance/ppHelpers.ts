import type {
  CparsRating, CoverageStrength, CoverageLevel, SelectionRecommendation, QualityKey,
} from '../../../../types/pastPerformance';
import type { Tone } from '../staffing/helpers';

export const NOW = '2026-06-16';

// CPARS rating → tone (Exceptional=emerald, Very Good=blue, Satisfactory=amber,
// Marginal=orange→danger, Unsatisfactory=red, Not Rated=slate)
export const cparsTone = (r: CparsRating): Tone =>
  r === 'Exceptional' ? 'success' : r === 'Very Good' ? 'info' :
  r === 'Satisfactory' ? 'warning' : r === 'Marginal' ? 'danger' :
  r === 'Unsatisfactory' ? 'danger' : 'neutral';

export const recTone = (r: SelectionRecommendation): Tone =>
  r === 'Strongly recommended' ? 'success' : r === 'Recommended' ? 'accent' :
  r === 'Alternative' ? 'warning' : 'neutral';

export const relevanceTone = (score: number): Tone =>
  score >= 85 ? 'success' : score >= 70 ? 'accent' : score >= 50 ? 'warning' : 'neutral';

export const coverageStrengthDots = (s: CoverageStrength): number =>
  s === 'strong' ? 3 : s === 'moderate' ? 2 : s === 'partial' ? 1 : 0;

export const coverageLevelTone = (c: CoverageLevel): Tone =>
  c === 'Strong' ? 'success' : c === 'Moderate' ? 'warning' : 'danger';

export const sectionQualityTone = (q: string): Tone =>
  q === 'strong' ? 'success' : q === 'moderate' ? 'warning' : 'danger';

// recency context per the recency business rule
export function recencyContext(endDate: string): { label: string; tone: Tone } {
  const yrs = (new Date(NOW + 'T00:00:00').getTime() - new Date(endDate + 'T00:00:00').getTime()) / (365.25 * 24 * 3600 * 1000);
  if (yrs <= 3) return { label: 'Within 3 yrs · full weight', tone: 'success' };
  if (yrs <= 5) return { label: '3–5 yrs · reduced weight', tone: 'warning' };
  return { label: '5+ yrs · significantly reduced', tone: 'danger' };
}

// CPARS business-rule flag
export function cparsFlag(r: CparsRating): { text: string; tone: Tone } | null {
  if (r === 'Satisfactory') return { text: 'Include but flag for review', tone: 'warning' };
  if (r === 'Marginal') return { text: 'Risk — flag with warning', tone: 'danger' };
  if (r === 'Unsatisfactory') return { text: 'Default-exclude — manual override required', tone: 'danger' };
  return null;
}

export const QUALITY_LABELS: Record<QualityKey, string> = {
  contractInfo: 'Contract information complete',
  contactInfo: 'Contact information complete',
  relevance3plus: 'Relevance addresses 3+ requirements',
  metrics3plus: 'Contains 3+ specific metrics',
  cparsReferenced: 'CPARS rating referenced',
  howLanguage: 'HOW-language (not just WHAT)',
};

export const yr = (iso: string) => iso.slice(0, 4);

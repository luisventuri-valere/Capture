import type { LaborLine, OdcLine, SubLine, IndirectRates } from '../../../../types/pricing';

// ─── per-line ────────────────────────────────────────────────────────────────
export function burdenMultiplier(r: IndirectRates): number {
  return (1 + r.fringe) * (1 + r.overhead) * (1 + r.ga) * (1 + r.fee);
}
// Display-only fully-burdened rate (the authoritative total comes from romRollup).
export function fullyBurdenedRate(line: LaborLine, r: IndirectRates): number {
  return line.directRate * burdenMultiplier(r);
}
export function laborTotalHours(line: LaborLine): number {
  return line.qty * line.hoursPerYear * line.years;
}
// Sum over years with compounding escalation.
export function laborTotalDirect(line: LaborLine): number {
  let t = 0;
  for (let y = 0; y < line.years; y++) {
    t += line.qty * line.hoursPerYear * line.directRate * Math.pow(1 + line.escalation, y);
  }
  return t;
}
export function odcTotal(o: OdcLine): number {
  if (o.frequency === 'one-time') return o.qty * o.unitCost;
  const perYear = o.frequency === 'monthly' ? o.unitCost * 12 : o.unitCost;
  return o.qty * perYear * o.years;
}

// ─── rollup ──────────────────────────────────────────────────────────────────
export interface Rollup {
  totalDirectLabor: number;
  fringeAmount: number;
  overheadAmount: number;
  totalIndirect: number;   // fringe + overhead + ga
  totalODC: number;
  totalSubCost: number;
  subtotalBeforeGA: number;
  gaAmount: number;
  totalCost: number;
  feeAmount: number;
  totalPrice: number;
  totalHours: number;
  blendedBurdenedRate: number;
}
// Subs are burdened by the sub (no prime fringe/overhead); the prime applies G&A
// (and fee) to total sub cost via the subtotal-before-G&A stage.
export function romRollup(labor: LaborLine[], odc: OdcLine[], subs: SubLine[], r: IndirectRates): Rollup {
  const totalDirectLabor = labor.reduce((s, l) => s + laborTotalDirect(l), 0);
  const totalHours = labor.reduce((s, l) => s + laborTotalHours(l), 0);
  const fringeAmount = totalDirectLabor * r.fringe;
  const overheadAmount = (totalDirectLabor + fringeAmount) * r.overhead;
  const totalODC = odc.reduce((s, o) => s + odcTotal(o), 0);
  const totalSubCost = subs.reduce((s, x) => s + x.totalCost, 0);
  const subtotalBeforeGA = totalDirectLabor + fringeAmount + overheadAmount + totalODC + totalSubCost;
  const gaAmount = subtotalBeforeGA * r.ga;
  const totalCost = subtotalBeforeGA + gaAmount;
  const feeAmount = totalCost * r.fee;
  const totalPrice = totalCost + feeAmount;
  const totalIndirect = fringeAmount + overheadAmount + gaAmount;
  const burdenedLabor = totalDirectLabor + fringeAmount + overheadAmount;
  const blendedBurdenedRate = totalHours ? burdenedLabor / totalHours : 0;
  return { totalDirectLabor, fringeAmount, overheadAmount, totalIndirect, totalODC, totalSubCost, subtotalBeforeGA, gaAmount, totalCost, feeAmount, totalPrice, totalHours, blendedBurdenedRate };
}

// ─── annual breakdown (Base + option years) — sums to romRollup.totalPrice ────
export interface AnnualRow {
  year: number; label: string; labor: number; odc: number; sub: number; indirect: number; fee: number; total: number;
}
export function annualBreakdown(labor: LaborLine[], odc: OdcLine[], subs: SubLine[], r: IndirectRates, years: number): AnnualRow[] {
  const subTotalAll = subs.reduce((s, x) => s + x.totalCost, 0);
  const rows: AnnualRow[] = [];
  for (let y = 0; y < years; y++) {
    const laborY = labor.reduce((s, l) => s + l.qty * l.hoursPerYear * l.directRate * Math.pow(1 + l.escalation, y), 0);
    const fringeY = laborY * r.fringe;
    const ohY = (laborY + fringeY) * r.overhead;
    const odcY = odc.reduce((s, o) => {
      if (o.frequency === 'one-time') return s + (y === 0 ? o.qty * o.unitCost : 0);
      const perYear = o.frequency === 'monthly' ? o.unitCost * 12 : o.unitCost;
      return s + o.qty * perYear;
    }, 0);
    const subY = subTotalAll / years;
    const subBeforeGA = laborY + fringeY + ohY + odcY + subY;
    const gaY = subBeforeGA * r.ga;
    const costY = subBeforeGA + gaY;
    const feeY = costY * r.fee;
    rows.push({ year: y, label: y === 0 ? 'Base Year' : `Option Year ${y}`, labor: laborY, odc: odcY, sub: subY, indirect: fringeY + ohY + gaY, fee: feeY, total: costY + feeY });
  }
  return rows;
}

// ─── business-rule helpers ───────────────────────────────────────────────────
export const feeFlag = (feeRate: number, contractType: string): string | null => {
  const ffp = /FFP/i.test(contractType);
  if (ffp && feeRate > 0.15) return `Fee ${(feeRate * 100).toFixed(0)}% exceeds the ~15% FFP norm`;
  if (!ffp && feeRate > 0.10) return `Fee ${(feeRate * 100).toFixed(0)}% exceeds the ~10% cost-type norm`;
  return null;
};
export const overBudget = (totalPrice: number, postedCeiling: number): boolean => totalPrice > postedCeiling * 1.2;

export const fmtUSD = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(2)}M`;
export const fmtRate = (n: number) => `$${n.toFixed(0)}/hr`;

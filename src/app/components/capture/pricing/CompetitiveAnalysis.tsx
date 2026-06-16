import React from 'react';
import { Building, BarChart3, Crosshair, TrendingDown, Sparkles } from 'lucide-react';
import type { GsaBenchmark, ScenarioData, IncumbentPricing } from '../../../../types/pricing';
import { F, tone } from '../staffing/helpers';
import { Pill, Btn, Panel } from '../staffing/ui';
import { RangeBar, KV } from './pricingUi';
import { marketPosition, positionLabel } from './pricingHelpers';
import { fullyBurdenedRate, burdenMultiplier, fmtM, fmtRate, type Rollup } from './romMath';

export function CompetitiveAnalysis({ benchmarks, scenario, incumbent, rollup, winNote, pricePosition, onAdjustRate }: {
  benchmarks: GsaBenchmark[]; scenario: ScenarioData; incumbent: IncumbentPricing; rollup: Rollup;
  winNote: string; pricePosition: { quadrant: string; note: string };
  onAdjustRate: (lcat: string, newDirect: number) => void;
}) {
  const ind = scenario.indirect;
  const mult = burdenMultiplier(ind);
  const ourTotal = rollup.totalPrice;
  const maxBar = Math.max(ourTotal, incumbent.inflationAdjusted, incumbent.currentValue) * 1.04;
  const bar = (v: number) => `${Math.min(100, (v / maxBar) * 100)}%`;
  const aboveMarket = benchmarks.filter(b => {
    const line = scenario.labor.find(l => l.lcat === b.lcat);
    if (!line) return false;
    return marketPosition(fullyBurdenedRate(line, ind), b).pos !== 'at-market' && fullyBurdenedRate(line, ind) > b.p75;
  }).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: F }}>
      {/* win-probability overlay */}
      <div style={{ borderRadius: 'var(--gh-radius-xl)', padding: '16px 20px', background: 'linear-gradient(135deg, rgba(37,99,235,0.14), rgba(14,165,233,0.06))', border: '1px solid var(--gh-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Sparkles size={15} style={{ color: 'var(--gh-accent-tint)' }} />
          <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-accent-tint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Win-Probability Overlay · {scenario.label.split(' ')[0]}</span>
        </div>
        <p style={{ margin: 0, fontSize: 'var(--gh-font-size-md)', color: 'var(--gh-text)', lineHeight: 1.5, fontWeight: 'var(--gh-font-weight-medium)' }}>{winNote}</p>
      </div>

      {/* incumbent comparison */}
      <Panel title={`Incumbent Analysis — ${incumbent.name}`} icon={<Building size={15} />} right={<Pill tone={ourTotal < incumbent.inflationAdjusted ? 'success' : 'warning'}>{ourTotal < incumbent.inflationAdjusted ? 'Below incumbent run-rate' : 'Above incumbent run-rate'}</Pill>}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
          <KV label="Prior Contract" value={fmtM(incumbent.currentValue)} />
          <KV label="Annualized" value={fmtM(incumbent.annualized)} />
          <KV label="Inflation-Adjusted (our PoP)" value={fmtM(incumbent.inflationAdjusted)} />
          <div style={{ width: 1, background: 'var(--gh-border)' }} />
          <KV label="Our Primary ROM" value={fmtM(ourTotal)} tone={ourTotal < incumbent.inflationAdjusted ? 'success' : 'warning'} />
        </div>
        {/* mini bar chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { label: `${incumbent.name} — inflation-adjusted`, v: incumbent.inflationAdjusted, t: 'neutral' as const },
            { label: `${incumbent.name} — prior award`, v: incumbent.currentValue, t: 'neutral' as const },
            { label: `Our bid (${scenario.label.split(' ')[0]})`, v: ourTotal, t: (ourTotal < incumbent.inflationAdjusted ? 'success' : 'warning') as const },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 200, fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)', flexShrink: 0 }}>{row.label}</span>
              <div style={{ flex: 1, height: 22, background: 'var(--gh-bg-surface-muted)', borderRadius: 'var(--gh-radius-md)', overflow: 'hidden' }}>
                <div style={{ width: bar(row.v), height: '100%', background: tone(row.t).fg, borderRadius: 'var(--gh-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, transition: 'width .4s' }}>
                  <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-bold)', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{fmtM(row.v)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: '14px 0 0', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)', lineHeight: 1.55 }}>{incumbent.analysis}</p>
      </Panel>

      {/* GSA rate benchmarking */}
      <Panel title="GSA CALC Rate Benchmarking" icon={<BarChart3 size={15} />} right={<Pill tone={aboveMarket ? 'warning' : 'success'}>{aboveMarket ? `${aboveMarket} above market` : 'all at-market'}</Pill>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {benchmarks.map(b => {
            const line = scenario.labor.find(l => l.lcat === b.lcat);
            const our = line ? fullyBurdenedRate(line, ind) : 0;
            const mp = marketPosition(our, b);
            const targetDirect = +(b.median / mult).toFixed(2);
            return (
              <div key={b.lcat} style={{ padding: '12px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ flex: 1, fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{b.lcat}</span>
                  <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-accent-tint)', fontVariantNumeric: 'tabular-nums' }}>{fmtRate(our)}</span>
                  <Pill tone={mp.tone}>{positionLabel(mp.pos)}</Pill>
                  {mp.pos === 'above-market' && line && (
                    <Btn size="sm" icon={<TrendingDown size={12} />} onClick={() => onAdjustRate(b.lcat, targetDirect)} title={`Set direct rate to ${fmtRate(targetDirect)} so the loaded rate meets the GSA median`}>Adjust to median</Btn>
                  )}
                </div>
                <RangeBar min={b.min} p25={b.p25} median={b.median} p75={b.p75} max={b.max} our={our} ourTone={mp.tone} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontSize: 10, color: 'var(--gh-text-disabled)', fontVariantNumeric: 'tabular-nums' }}>
                  <span>{fmtRate(b.min)}</span><span>p25 {fmtRate(b.p25)}</span><span>med {fmtRate(b.median)}</span><span>p75 {fmtRate(b.p75)}</span><span>{fmtRate(b.max)}</span>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)', lineHeight: 1.5 }}>{b.recommendation}</p>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* price/risk quadrant */}
      <Panel title="Price / Risk Position" icon={<Crosshair size={15} />} right={<Pill tone="accent">{pricePosition.quadrant}</Pill>}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <Quadrant />
          <p style={{ flex: 1, margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.6 }}>{pricePosition.note}</p>
        </div>
      </Panel>
    </div>
  );
}

function Quadrant() {
  // simple 2×2 with our position in the low-price / low-risk cell
  return (
    <div style={{ flexShrink: 0, width: 160, height: 160, position: 'relative', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--gh-border)' }} />
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--gh-border)' }} />
      {/* our dot: low price (left), low risk (bottom) → bottom-left */}
      <div style={{ position: 'absolute', left: '26%', top: '72%', transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: '50%', background: 'var(--gh-success-fg)', border: '3px solid var(--gh-bg-elevated)', boxShadow: '0 0 0 1px var(--gh-success-fg)' }} title="Our bid" />
      <span style={{ position: 'absolute', top: 4, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: 'var(--gh-text-disabled)' }}>HIGH RISK</span>
      <span style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: 'var(--gh-text-disabled)' }}>LOW RISK</span>
      <span style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: 9, color: 'var(--gh-text-disabled)' }}>LOW $</span>
      <span style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontSize: 9, color: 'var(--gh-text-disabled)' }}>HIGH $</span>
    </div>
  );
}

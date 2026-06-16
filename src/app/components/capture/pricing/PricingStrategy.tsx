import React from 'react';
import { Sparkles, Target, TrendingUp, TrendingDown, Minus, ShieldAlert, Lightbulb, CheckCircle2, Database, Plus, Gauge } from 'lucide-react';
import type { PricingStrategy as TStrategy, PricingOpportunity, PriceDataPoint, IncumbentPricing } from '../../../../types/pricing';
import { F, tone } from '../staffing/helpers';
import { Pill, Btn, Panel } from '../staffing/ui';
import { KV } from './pricingUi';
import { sevTone, trendTone, dataConfTone } from './pricingHelpers';
import { fmtUSD, fmtM } from './romMath';

export function PricingStrategy({ strategy, opportunity, incumbent, romTotal, revealed, analyzing, onAnalyze, dataPoints, onAddDataPoint }: {
  strategy: TStrategy; opportunity: PricingOpportunity; incumbent: IncumbentPricing; romTotal: number;
  revealed: boolean; analyzing: boolean; onAnalyze: () => void;
  dataPoints: PriceDataPoint[]; onAddDataPoint: () => void;
}) {
  if (!revealed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: F }}>
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 'var(--gh-radius-xl)', padding: '28px 26px',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.10))', border: '1px solid var(--gh-accent)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', display: 'grid', placeItems: 'center' }}><Sparkles size={18} /></span>
            <div style={{ fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>AI Pricing Strategy</div>
          </div>
          <p style={{ margin: '0 0 18px', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', maxWidth: 620, lineHeight: 1.6 }}>
            Synthesize a Price-to-Win from {dataPoints.length} market signals — incumbent contract value, IGCE, historical agency spend,
            and GSA CALC labor rates — then position the bid against the {opportunity.postedCeiling ? fmtM(opportunity.postedCeiling) : ''} ceiling.
          </p>
          <Btn kind="primary" icon={analyzing ? <Sparkles size={15} className="gh-spin" /> : <Sparkles size={15} />} onClick={onAnalyze} disabled={analyzing}>
            {analyzing ? 'Analyzing market signals…' : 'Analyze Pricing Strategy'}
          </Btn>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[['Posted Ceiling', fmtM(opportunity.postedCeiling)], ['IGCE Estimate', fmtM(strategy.budget.igceEstimate)], ['Incumbent', `${incumbent.name} · ${fmtM(incumbent.currentValue)}`], ['Data Points', String(dataPoints.length)]].map(([l, v]) => (
            <div key={l} style={{ flex: '1 1 0', minWidth: 150, padding: '12px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
              <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{l}</div>
              <div style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)', marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const TrendIcon = strategy.budget.trend === 'increasing' ? TrendingUp : strategy.budget.trend === 'decreasing' ? TrendingDown : Minus;
  const inWindow = romTotal >= strategy.ptw.low && romTotal <= strategy.ptw.high;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: F }}>
      {/* approach / positioning / rationale */}
      <div style={{ borderRadius: 'var(--gh-radius-xl)', padding: '18px 20px', background: 'linear-gradient(135deg, rgba(37,99,235,0.14), rgba(14,165,233,0.06))', border: '1px solid var(--gh-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Sparkles size={15} style={{ color: 'var(--gh-accent-tint)' }} />
          <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-accent-tint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recommended Approach</span>
          <Pill tone="accent">{strategy.approach}</Pill>
          <Pill tone="neutral" soft>{strategy.positioning}</Pill>
        </div>
        <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.6 }}>{strategy.rationale}</p>
      </div>

      {/* PTW gauge */}
      <Panel title="Price-to-Win" icon={<Target size={15} />} right={<Pill tone={strategy.ptw.confidence === 'high' ? 'success' : strategy.ptw.confidence === 'medium' ? 'warning' : 'danger'}>{strategy.ptw.confidence} confidence</Pill>}>
        <PtwGauge low={strategy.ptw.low} target={strategy.ptw.target} high={strategy.ptw.high} our={romTotal} ceiling={opportunity.postedCeiling} />
        <div style={{ display: 'flex', gap: 18, marginTop: 16, flexWrap: 'wrap' }}>
          <KV label="PTW Low" value={fmtM(strategy.ptw.low)} />
          <KV label="PTW Target" value={fmtM(strategy.ptw.target)} tone="accent" />
          <KV label="PTW High" value={fmtM(strategy.ptw.high)} />
          <div style={{ width: 1, background: 'var(--gh-border)' }} />
          <KV label="Our ROM (active)" value={fmtM(romTotal)} tone={inWindow ? 'success' : 'warning'} />
          <div style={{ marginLeft: 'auto', alignSelf: 'center' }}>
            <Pill tone={inWindow ? 'success' : 'warning'}>{inWindow ? 'Within PTW window' : romTotal > strategy.ptw.high ? `${fmtM(romTotal - strategy.ptw.target)} above target` : `${fmtM(strategy.ptw.target - romTotal)} below target`}</Pill>
          </div>
        </div>
      </Panel>

      {/* budget intelligence */}
      <Panel title="Budget Intelligence" icon={<Gauge size={15} />} right={<Pill tone={trendTone(strategy.budget.trend)}><TrendIcon size={12} /> {strategy.budget.trend}</Pill>}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 12 }}>
          <KV label="Posted / Ceiling" value={fmtM(strategy.budget.postedEstimate)} />
          <KV label="IGCE Estimate" value={fmtM(strategy.budget.igceEstimate)} />
          <KV label="Historical Avg Spend" value={fmtM(strategy.budget.historicalSpending)} />
        </div>
        <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)', lineHeight: 1.55 }}>{strategy.budget.trendRationale}</p>
      </Panel>

      {/* risks + opportunities */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px', minWidth: 280 }}>
          <Panel title="Pricing Risks" icon={<ShieldAlert size={15} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {strategy.risks.map((r, i) => <SignalRow key={i} text={r.text} sev={r.severity} kind="risk" />)}
            </div>
          </Panel>
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 280 }}>
          <Panel title="Opportunities" icon={<Lightbulb size={15} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {strategy.opportunities.map((o, i) => <SignalRow key={i} text={o.text} sev={o.severity} kind="opp" />)}
            </div>
          </Panel>
        </div>
      </div>

      {/* recommendations */}
      <Panel title="Recommendations" icon={<CheckCircle2 size={15} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {strategy.recommendations.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', fontSize: 11, fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center', marginTop: 1 }}>{i + 1}</span>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* data points */}
      <Panel title="Market Data Points" icon={<Database size={15} />} right={<Btn size="sm" icon={<Plus size={13} />} onClick={onAddDataPoint}>Add Data Point</Btn>}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F }}>
            <thead>
              <tr>{['Source', 'Data Type', 'Value', 'Date', 'Confidence'].map(h => (
                <th key={h} style={{ textAlign: h === 'Value' ? 'right' : 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gh-text-disabled)', fontWeight: 'var(--gh-font-weight-semibold)', padding: '0 10px 8px' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {dataPoints.map(dp => (
                <tr key={dp.id} style={{ borderTop: '1px solid var(--gh-border)' }}>
                  <td style={{ padding: '9px 10px' }}><Pill tone="info" soft>{dp.source}</Pill></td>
                  <td style={{ padding: '9px 10px', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)' }}>{dp.dataType}</td>
                  <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', fontVariantNumeric: 'tabular-nums' }}>{dp.value >= 1000 ? fmtUSD(dp.value) : `$${dp.value}/hr`}</td>
                  <td style={{ padding: '9px 10px', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>{dp.date}</td>
                  <td style={{ padding: '9px 10px' }}><Pill tone={dataConfTone(dp.confidence)}>{dp.confidence}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function SignalRow({ text, sev, kind }: { text: string; sev: 'high' | 'medium' | 'low'; kind: 'risk' | 'opp' }) {
  const t = kind === 'opp' ? (sev === 'high' ? 'success' : sev === 'medium' ? 'accent' : 'neutral') : sevTone(sev);
  const c = tone(t);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 11px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
      <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: c.fg, marginTop: 5 }} />
      <span style={{ flex: 1, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>{text}</span>
      <Pill tone={t}>{sev}</Pill>
    </div>
  );
}

function PtwGauge({ low, target, high, our, ceiling }: { low: number; target: number; high: number; our: number; ceiling: number }) {
  const lo = Math.min(low, our) * 0.97;
  const hi = Math.max(high, our, ceiling) * 1.01;
  const span = Math.max(hi - lo, 1);
  const pos = (v: number) => Math.min(100, Math.max(0, ((v - lo) / span) * 100));
  return (
    <div style={{ position: 'relative', height: 46, width: '100%', marginTop: 6 }}>
      <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 6, borderRadius: 3, background: 'var(--gh-bg-surface-muted)' }} />
      {/* PTW window */}
      <div style={{ position: 'absolute', top: 18, left: `${pos(low)}%`, width: `${pos(high) - pos(low)}%`, height: 10, borderRadius: 5, background: 'rgba(37,99,235,0.22)', border: '1px solid var(--gh-accent)' }} />
      {/* target */}
      <div style={{ position: 'absolute', top: 12, left: `${pos(target)}%`, transform: 'translateX(-50%)', width: 2, height: 22, background: 'var(--gh-accent-tint)' }} />
      <div style={{ position: 'absolute', top: 0, left: `${pos(target)}%`, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--gh-accent-tint)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap' }}>TARGET</div>
      {/* ceiling */}
      <div style={{ position: 'absolute', top: 16, left: `${pos(ceiling)}%`, transform: 'translateX(-50%)', width: 2, height: 14, background: 'var(--gh-danger-fg)' }} title="Posted ceiling" />
      {/* our marker */}
      <div style={{ position: 'absolute', top: 14, left: `${pos(our)}%`, transform: 'translateX(-50%) rotate(45deg)', width: 16, height: 16, background: our >= low && our <= high ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)', border: '2px solid var(--gh-bg-elevated)', borderRadius: 3 }} title="Our ROM" />
      <div style={{ position: 'absolute', bottom: 0, left: `${pos(our)}%`, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--gh-text-tertiary)', whiteSpace: 'nowrap', fontWeight: 'var(--gh-font-weight-semibold)' }}>OUR ROM</div>
    </div>
  );
}

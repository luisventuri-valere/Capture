import React, { useState } from 'react';
import { Users, Package, Building2, Calculator, Plus, Trash2, Download, Sparkles, AlertTriangle, Layers, Copy } from 'lucide-react';
import type { ScenarioData, LaborLine, OdcLine, SubLine, IndirectRates, OdcFrequency } from '../../../../types/pricing';
import { F } from '../staffing/helpers';
import { Pill, Btn } from '../staffing/ui';
import { Segmented, NumCell, WaterRow, KV } from './pricingUi';
import { taTone } from './pricingHelpers';
import {
  romRollup, annualBreakdown, fullyBurdenedRate, laborTotalDirect, laborTotalHours, odcTotal,
  feeFlag, overBudget, fmtUSD, fmtM, fmtRate, type Rollup,
} from './romMath';

type Sub = 'labor' | 'odc' | 'subs' | 'summary';
const SUBS: { key: Sub; label: string; icon: React.ReactNode }[] = [
  { key: 'labor', label: 'Labor', icon: <Users size={14} /> },
  { key: 'odc', label: 'ODCs', icon: <Package size={14} /> },
  { key: 'subs', label: 'Subcontractors', icon: <Building2 size={14} /> },
  { key: 'summary', label: 'Summary', icon: <Calculator size={14} /> },
];

const th: React.CSSProperties = { textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gh-text-tertiary)', fontWeight: 600, padding: '0 10px 9px', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '8px 10px', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)', verticalAlign: 'middle' };

export function RomBuilder({
  scenarios, activeIdx, onSelectScenario, onClone,
  scenario, rollup, opportunity, ptw,
  onLaborChange, onOdcChange, onSubChange, onIndirectChange, onAddOdc, onRemoveOdc,
  onImportStaffing, onSuggestOdcs, onAiRecommend,
}: {
  scenarios: ScenarioData[]; activeIdx: number; onSelectScenario: (i: number) => void; onClone: () => void;
  scenario: ScenarioData; rollup: Rollup; opportunity: { postedCeiling: number; contractType: string };
  ptw: { low: number; target: number; high: number };
  onLaborChange: (id: string, field: keyof LaborLine, v: number) => void;
  onOdcChange: (id: string, field: keyof OdcLine, v: number | string) => void;
  onSubChange: (id: string, field: keyof SubLine, v: number) => void;
  onIndirectChange: (field: keyof IndirectRates, v: number) => void;
  onAddOdc: () => void; onRemoveOdc: (id: string) => void;
  onImportStaffing: () => void; onSuggestOdcs: () => void; onAiRecommend: () => void;
}) {
  const [sub, setSub] = useState<Sub>('labor');
  const ind = scenario.indirect;
  const totalFte = scenario.labor.reduce((s, l) => s + l.qty, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: F }}>
      {/* scenario selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Segmented<string>
          options={scenarios.map((s, i) => ({ value: String(i), label: s.label.split(' ')[0], hint: fmtM(romRollup(s.labor, s.odc, s.subs, s.indirect).totalPrice) }))}
          value={String(activeIdx)} onChange={v => onSelectScenario(Number(v))}
        />
        <Btn size="sm" icon={<Copy size={13} />} onClick={onClone}>Clone Scenario</Btn>
        <span style={{ marginLeft: 'auto', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>{scenario.description}</span>
      </div>

      {/* sub-tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--gh-border)' }}>
        {SUBS.map(s => {
          const on = s.key === sub;
          return (
            <button key={s.key} onClick={() => setSub(s.key)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', cursor: 'pointer', fontFamily: F,
              background: 'transparent', border: 'none', borderBottom: `2px solid ${on ? 'var(--gh-accent)' : 'transparent'}`,
              color: on ? 'var(--gh-text)' : 'var(--gh-text-tertiary)', fontWeight: on ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-medium)',
              fontSize: 'var(--gh-font-size-sm)', marginBottom: -1,
            }}>{s.icon}{s.label}</button>
          );
        })}
      </div>

      {/* ── LABOR ── */}
      {sub === 'labor' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <Pill tone="neutral" soft>{totalFte} prime FTE · {scenario.labor.length} LCATs</Pill>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <Btn size="sm" icon={<Download size={13} />} onClick={onImportStaffing}>Import from Staffing</Btn>
              <Btn size="sm" kind="primary" icon={<Sparkles size={13} />} onClick={onAiRecommend}>AI Recommend Rates</Btn>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={th}>Labor Category</th>
                <th style={{ ...th, textAlign: 'center' }}>Qty</th>
                <th style={{ ...th, textAlign: 'center' }}>Hrs/Yr</th>
                <th style={{ ...th, textAlign: 'right' }}>Direct $/hr</th>
                <th style={{ ...th, textAlign: 'center' }}>Esc.</th>
                <th style={{ ...th, textAlign: 'right' }}>Loaded $/hr</th>
                <th style={{ ...th, textAlign: 'right' }}>5-Yr Direct</th>
              </tr></thead>
              <tbody>
                {scenario.labor.map(l => (
                  <tr key={l.id} style={{ borderTop: '1px solid var(--gh-border)' }}>
                    <td style={td}>
                      <div style={{ fontWeight: 'var(--gh-font-weight-semibold)' }}>{l.lcat}</div>
                      <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{laborTotalHours(l).toLocaleString()} hrs total</div>
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}><NumCell value={l.qty} onChange={v => onLaborChange(l.id, 'qty', v)} width={36} align="left" /></td>
                    <td style={{ ...td, textAlign: 'center' }}><NumCell value={l.hoursPerYear} onChange={v => onLaborChange(l.id, 'hoursPerYear', v)} width={52} step={20} align="left" /></td>
                    <td style={{ ...td, textAlign: 'right' }}><NumCell value={l.directRate} onChange={v => onLaborChange(l.id, 'directRate', v)} prefix="$" width={48} align="left" /></td>
                    <td style={{ ...td, textAlign: 'center' }}><NumCell value={l.escalation} onChange={v => onLaborChange(l.id, 'escalation', v)} pct width={40} step={0.5} align="left" /></td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-accent-tint)', fontVariantNumeric: 'tabular-nums' }}>{fmtRate(fullyBurdenedRate(l, ind))}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 'var(--gh-font-weight-semibold)', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(laborTotalDirect(l))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--gh-border-strong)' }}>
                  <td style={{ ...td, fontWeight: 'var(--gh-font-weight-bold)' }} colSpan={6}>Total Direct Labor ({rollup.totalHours.toLocaleString()} hrs · blended {fmtRate(rollup.blendedBurdenedRate)} loaded)</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 'var(--gh-font-weight-bold)', fontSize: 'var(--gh-font-size-md)', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(rollup.totalDirectLabor)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── ODCs ── */}
      {sub === 'odc' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Pill tone="neutral" soft>{scenario.odc.length} line items</Pill>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <Btn size="sm" icon={<Plus size={13} />} onClick={onAddOdc}>Add ODC</Btn>
              <Btn size="sm" kind="primary" icon={<Sparkles size={13} />} onClick={onSuggestOdcs}>Suggest ODCs</Btn>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={th}>Category</th>
                <th style={th}>Description</th>
                <th style={{ ...th, textAlign: 'center' }}>Qty</th>
                <th style={{ ...th, textAlign: 'right' }}>Unit Cost</th>
                <th style={{ ...th, textAlign: 'center' }}>Frequency</th>
                <th style={{ ...th, textAlign: 'right' }}>5-Yr Total</th>
                <th style={th}></th>
              </tr></thead>
              <tbody>
                {scenario.odc.map(o => (
                  <tr key={o.id} style={{ borderTop: '1px solid var(--gh-border)' }}>
                    <td style={td}><Pill tone="info" soft>{o.category}</Pill></td>
                    <td style={{ ...td, color: 'var(--gh-text-secondary)' }}>{o.description}</td>
                    <td style={{ ...td, textAlign: 'center' }}><NumCell value={o.qty} onChange={v => onOdcChange(o.id, 'qty', v)} width={36} align="left" /></td>
                    <td style={{ ...td, textAlign: 'right' }}><NumCell value={o.unitCost} onChange={v => onOdcChange(o.id, 'unitCost', v)} prefix="$" width={78} step={1000} align="left" /></td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <select value={o.frequency} onChange={e => onOdcChange(o.id, 'frequency', e.target.value as OdcFrequency)} style={selStyle}>
                        <option value="one-time">one-time</option>
                        <option value="monthly">monthly</option>
                        <option value="annual">annual</option>
                      </select>
                    </td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 'var(--gh-font-weight-semibold)', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(odcTotal(o))}</td>
                    <td style={{ ...td, textAlign: 'right' }}><button onClick={() => onRemoveOdc(o.id)} title="Remove" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', padding: 3 }}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--gh-border-strong)' }}>
                  <td style={{ ...td, fontWeight: 'var(--gh-font-weight-bold)' }} colSpan={5}>Total Other Direct Costs</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 'var(--gh-font-weight-bold)', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(rollup.totalODC)}</td>
                  <td style={td}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── SUBS ── */}
      {sub === 'subs' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Pill tone="neutral" soft>{scenario.subs.length} subcontractors · {scenario.subs.reduce((s, x) => s + x.workshare, 0)}% workshare</Pill>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gh-text-tertiary)' }}>Subs are burdened by the sub; the prime applies G&A (and fee) only.</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={th}>Subcontractor</th>
                <th style={th}>Scope</th>
                <th style={{ ...th, textAlign: 'center' }}>Workshare</th>
                <th style={{ ...th, textAlign: 'center' }}>TA Status</th>
                <th style={{ ...th, textAlign: 'right' }}>5-Yr Cost</th>
              </tr></thead>
              <tbody>
                {scenario.subs.map(x => (
                  <tr key={x.id} style={{ borderTop: '1px solid var(--gh-border)' }}>
                    <td style={{ ...td, fontWeight: 'var(--gh-font-weight-semibold)' }}>{x.name}</td>
                    <td style={{ ...td, color: 'var(--gh-text-secondary)' }}>{x.scope}</td>
                    <td style={{ ...td, textAlign: 'center' }}>{x.workshare}%</td>
                    <td style={{ ...td, textAlign: 'center' }}><Pill tone={taTone(x.taStatus)}>{x.taStatus}</Pill></td>
                    <td style={{ ...td, textAlign: 'right' }}><NumCell value={x.totalCost} onChange={v => onSubChange(x.id, 'totalCost', v)} prefix="$" width={96} step={50000} align="left" /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--gh-border-strong)' }}>
                  <td style={{ ...td, fontWeight: 'var(--gh-font-weight-bold)' }} colSpan={4}>Total Subcontractor Cost</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 'var(--gh-font-weight-bold)', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(rollup.totalSubCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── SUMMARY ── */}
      {sub === 'summary' && <Summary scenario={scenario} rollup={rollup} ind={ind} opportunity={opportunity} ptw={ptw} onIndirectChange={onIndirectChange} />}
    </div>
  );
}

function Summary({ scenario, rollup, ind, opportunity, ptw, onIndirectChange }: {
  scenario: ScenarioData; rollup: Rollup; ind: IndirectRates;
  opportunity: { postedCeiling: number; contractType: string }; ptw: { low: number; target: number; high: number };
  onIndirectChange: (field: keyof IndirectRates, v: number) => void;
}) {
  const annual = annualBreakdown(scenario.labor, scenario.odc, scenario.subs, ind, scenario.years);
  const flag = feeFlag(ind.fee, opportunity.contractType);
  const over = overBudget(rollup.totalPrice, opportunity.postedCeiling);
  const vsCeiling = rollup.totalPrice - opportunity.postedCeiling;
  const vsPtw = rollup.totalPrice - ptw.target;
  const ratePill = (label: string, field: keyof IndirectRates, step = 0.5) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{label}</span>
      <NumCell value={ind[field]} onChange={v => onIndirectChange(field, v)} pct width={38} step={step} align="left" />
    </span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* status banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--gh-radius-lg)',
        background: over ? 'var(--gh-danger-bg)' : 'var(--gh-bg-surface-muted)',
        border: `1px solid ${over ? 'var(--gh-danger-border)' : 'var(--gh-border)'}`,
      }}>
        <span style={{ width: 34, height: 34, borderRadius: 'var(--gh-radius-lg)', background: over ? 'var(--gh-danger-fg)' : 'var(--gh-accent)', color: over ? 'var(--gh-bg-canvas)' : 'var(--gh-white)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          {over ? <AlertTriangle size={17} /> : <Calculator size={17} />}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{scenario.label} · Total Evaluated Price</div>
          <div style={{ fontSize: 30, fontWeight: 'var(--gh-font-weight-bold)', color: over ? 'var(--gh-danger-fg-strong)' : 'var(--gh-text)', lineHeight: 1.05, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(rollup.totalPrice)}</div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <KV label="vs PTW Target" value={`${vsPtw >= 0 ? '+' : ''}${fmtM(vsPtw)}`} tone={Math.abs(vsPtw) <= 1_000_000 ? 'success' : vsPtw > 0 ? 'warning' : 'accent'} />
          <KV label="vs Ceiling" value={`${vsCeiling >= 0 ? '+' : ''}${fmtM(vsCeiling)}`} tone={vsCeiling > 0 ? 'danger' : 'success'} />
        </div>
      </div>

      {flag && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)', color: 'var(--gh-warning-fg)', fontSize: 'var(--gh-font-size-sm)' }}>
          <AlertTriangle size={14} /> {flag}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {/* waterfall */}
        <div style={{ flex: '1 1 380px', minWidth: 320, background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 10px' }}>
            <Layers size={14} style={{ color: 'var(--gh-accent-tint)' }} />
            <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>Cost Build-Up</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>{ratePill('Fringe', 'fringe')}{ratePill('OH', 'overhead')}{ratePill('G&A', 'ga')}{ratePill('Fee', 'fee')}</div>
          </div>
          <WaterRow label="Direct Labor" amount={fmtUSD(rollup.totalDirectLabor)} />
          <WaterRow label={`+ Fringe (${(ind.fringe * 100).toFixed(0)}%)`} amount={fmtUSD(rollup.fringeAmount)} sub />
          <WaterRow label={`+ Overhead (${(ind.overhead * 100).toFixed(0)}%)`} amount={fmtUSD(rollup.overheadAmount)} sub />
          <WaterRow label="+ Other Direct Costs" amount={fmtUSD(rollup.totalODC)} sub />
          <WaterRow label="+ Subcontractors" amount={fmtUSD(rollup.totalSubCost)} sub />
          <WaterRow label="Subtotal before G&A" amount={fmtUSD(rollup.subtotalBeforeGA)} accent />
          <WaterRow label={`+ G&A (${(ind.ga * 100).toFixed(0)}%)`} amount={fmtUSD(rollup.gaAmount)} sub />
          <WaterRow label="Total Cost" amount={fmtUSD(rollup.totalCost)} accent />
          <WaterRow label={`+ Fee (${(ind.fee * 100).toFixed(0)}%)`} amount={fmtUSD(rollup.feeAmount)} sub />
          <div style={{ marginTop: 6 }}><WaterRow label="Total Evaluated Price" amount={fmtUSD(rollup.totalPrice)} strong /></div>
        </div>

        {/* annual breakdown */}
        <div style={{ flex: '1 1 380px', minWidth: 320, background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 10px' }}>
            <Calculator size={14} style={{ color: 'var(--gh-accent-tint)' }} />
            <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>Annual Breakdown</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={th}>Period</th>
                <th style={{ ...th, textAlign: 'right' }}>Labor+Ind.</th>
                <th style={{ ...th, textAlign: 'right' }}>ODC</th>
                <th style={{ ...th, textAlign: 'right' }}>Subs</th>
                <th style={{ ...th, textAlign: 'right' }}>Total</th>
              </tr></thead>
              <tbody>
                {annual.map(r => (
                  <tr key={r.year} style={{ borderTop: '1px solid var(--gh-border)' }}>
                    <td style={{ ...td, fontWeight: 'var(--gh-font-weight-medium)' }}>{r.label}</td>
                    <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--gh-text-secondary)' }}>{fmtM(r.labor + r.indirect)}</td>
                    <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--gh-text-secondary)' }}>{fmtM(r.odc)}</td>
                    <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--gh-text-secondary)' }}>{fmtM(r.sub)}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 'var(--gh-font-weight-semibold)', fontVariantNumeric: 'tabular-nums' }}>{fmtM(r.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--gh-border-strong)' }}>
                  <td style={{ ...td, fontWeight: 'var(--gh-font-weight-bold)' }} colSpan={4}>5-Year Total</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 'var(--gh-font-weight-bold)', fontVariantNumeric: 'tabular-nums' }}>{fmtM(rollup.totalPrice)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div style={{ marginTop: 10, padding: '8px 11px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface-muted)', fontSize: 11, color: 'var(--gh-text-tertiary)', lineHeight: 1.5 }}>
            {scenario.basisOfEstimate}
          </div>
        </div>
      </div>
    </div>
  );
}

const selStyle: React.CSSProperties = {
  padding: '4px 8px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)',
  border: '1px solid var(--gh-border)', color: 'var(--gh-text)', fontFamily: F, fontSize: 'var(--gh-font-size-xs)', cursor: 'pointer',
};

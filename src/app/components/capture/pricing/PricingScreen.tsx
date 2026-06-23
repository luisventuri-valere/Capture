import React, { useMemo, useRef, useState } from 'react';
import { Calculator, AlertTriangle, Check, Sparkles, BarChart3, FileText, Info } from 'lucide-react';
import { pricingData } from '../../../../data/capture/pricing-data';
import type { ScenarioData, LaborLine, OdcLine, SubLine, IndirectRates, PriceDataPoint } from '../../../../types/pricing';
import { F, type Tone } from '../staffing/helpers';
import { Pill } from '../staffing/ui';
import { DetailPanel } from '../DetailPanel';
import { PricingStrategy } from './PricingStrategy';
import { RomBuilder } from './RomBuilder';
import { CompetitiveAnalysis } from './CompetitiveAnalysis';
import { romRollup, burdenMultiplier, fmtM } from './romMath';

type SectionKey = 'strategy' | 'rom' | 'competitive';
const SECTIONS: { key: SectionKey; n: number; title: string; icon: React.ReactNode }[] = [
  { key: 'strategy', n: 1, title: 'Pricing Strategy', icon: <Sparkles size={15} /> },
  { key: 'rom', n: 2, title: 'ROM Builder', icon: <Calculator size={15} /> },
  { key: 'competitive', n: 3, title: 'Competitive Analysis', icon: <BarChart3 size={15} /> },
];

export function PricingScreen() {
  const { opportunity, strategy, benchmarks, incumbent, suggestedOdcs, scenarioWinNotes, pricePosition } = pricingData;
  const [scenarios, setScenarios] = useState<ScenarioData[]>(() => pricingData.scenarios.map(s => ({ ...s })));
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedNav, setSelectedNav] = useState<SectionKey>('strategy');
  const [revealed, setRevealed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dataPoints, setDataPoints] = useState<PriceDataPoint[]>(strategy.dataPoints);
  const [toast, setToastState] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const idc = useRef(0);
  const setToast = (m: string) => { setToastState(m); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToastState(null), 2800); };

  const active = scenarios[activeIdx];
  const rollup = useMemo(() => romRollup(active.labor, active.odc, active.subs, active.indirect), [active]);
  const ceiling = opportunity.postedCeiling;
  const within = rollup.totalPrice >= strategy.ptw.low && rollup.totalPrice <= strategy.ptw.high;
  const over = rollup.totalPrice > ceiling;
  const romTone: Tone = over ? 'danger' : within ? 'success' : 'warning';
  const fmtGap = (v: number) => v < 1_000_000 ? `$${Math.round(v / 1_000)}K` : fmtM(v);

  // ── mutate active scenario ──
  const patchActive = (fn: (s: ScenarioData) => ScenarioData) => setScenarios(prev => prev.map((s, i) => (i === activeIdx ? fn(s) : s)));
  const onLaborChange = (id: string, field: keyof LaborLine, v: number) => patchActive(s => ({ ...s, labor: s.labor.map(l => (l.id === id ? { ...l, [field]: v } : l)) }));
  const onOdcChange = (id: string, field: keyof OdcLine, v: number | string) => patchActive(s => ({ ...s, odc: s.odc.map(o => (o.id === id ? { ...o, [field]: v } : o)) }));
  const onSubChange = (id: string, field: keyof SubLine, v: number) => patchActive(s => ({ ...s, subs: s.subs.map(x => (x.id === id ? { ...x, [field]: v } : x)) }));
  const onIndirectChange = (field: keyof IndirectRates, v: number) => patchActive(s => ({ ...s, indirect: { ...s.indirect, [field]: v } }));
  const onAddOdc = () => patchActive(s => ({ ...s, odc: [...s.odc, { id: `odc-new-${++idc.current}`, category: 'other', description: 'New direct cost', qty: 1, unitCost: 25000, frequency: 'one-time', years: s.years }] }));
  const onRemoveOdc = (id: string) => patchActive(s => ({ ...s, odc: s.odc.filter(o => o.id !== id) }));

  const onImportStaffing = () => { patchActive(s => ({ ...s, labor: s.labor.map(l => ({ ...l, source: 'staffing-import' })) })); setToast(`Synced ${active.labor.length} LCATs and base rates from the Staffing module`); };
  const onSuggestOdcs = () => {
    const have = new Set(active.odc.map(o => o.id));
    const add = suggestedOdcs.filter(o => !have.has(o.id));
    if (!add.length) { setToast('All suggested ODCs are already added'); return; }
    patchActive(s => ({ ...s, odc: [...s.odc, ...add] }));
    setToast(`Added ${add.length} AI-suggested ODC${add.length === 1 ? '' : 's'}`);
  };
  const onAiRecommend = () => {
    const mult = burdenMultiplier(active.indirect);
    patchActive(s => ({
      ...s,
      labor: s.labor.map(l => {
        const b = benchmarks.find(x => x.lcat === l.lcat);
        return b ? { ...l, directRate: Math.round(b.median / mult), source: 'ai-recommended' } : l;
      }),
    }));
    setToast('AI aligned every labor category to the GSA median loaded rate');
  };
  const onAdjustRate = (lcat: string, newDirect: number) => {
    patchActive(s => ({ ...s, labor: s.labor.map(l => (l.lcat === lcat ? { ...l, directRate: newDirect, source: 'gsa-calc' } : l)) }));
    setToast(`${lcat} direct rate adjusted to meet the GSA median`);
  };
  const onClone = () => {
    const copy: ScenarioData = { ...active, label: `${active.label.split(' ')[0]} — copy`, description: `Editable copy of ${active.label}.`, labor: active.labor.map(l => ({ ...l })), odc: active.odc.map(o => ({ ...o })), subs: active.subs.map(x => ({ ...x })), indirect: { ...active.indirect } };
    setScenarios(prev => [...prev, copy]);
    setActiveIdx(scenarios.length);
    setToast('Scenario cloned — edits apply to the copy');
  };
  const onAnalyze = () => { setAnalyzing(true); window.setTimeout(() => { setAnalyzing(false); setRevealed(true); }, 1000); };
  const onAddDataPoint = () => {
    setDataPoints(prev => [...prev, { id: `dp-new-${++idc.current}`, source: 'User input', dataType: 'Analyst-entered comparable', value: 41000000, date: '2026-06-16', confidence: 'inferred' }]);
    setToast('Data point added — refine source and value as needed');
  };

  const winKey = (active.key in scenarioWinNotes ? active.key : 'primary') as keyof typeof scenarioWinNotes;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gh-bg-canvas)', fontFamily: F, padding: 'var(--gh-space-8) 0', boxSizing: 'border-box' }}>
      <style>{`@keyframes gh-spin{to{transform:rotate(360deg)}}.gh-spin{animation:gh-spin .8s linear infinite}`}</style>

      {/* ── Pricing equation header ── */}
      <div style={{ padding: '24px var(--gh-space-12)', flexShrink: 0 }}>
        {over && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-danger-bg)', border: '1px solid var(--gh-danger-fg)', marginBottom: 10 }}>
            <AlertTriangle size={15} style={{ color: 'var(--gh-danger-fg)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-danger-fg)' }}>
              ROM exceeds ceiling — over by {fmtGap(rollup.totalPrice - ceiling)}. Reduce cost before submission.
            </span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'nowrap' }}>
          {/* YOUR ROM */}
          <div style={{ padding: '24px 16px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: `1px solid ${romTone === 'danger' ? 'var(--gh-danger-fg)' : romTone === 'success' ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)'}`, minWidth: 148, flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 2 }}>Your ROM</div>
            <div style={{ fontSize: 'var(--gh-font-size-xl)', fontWeight: 'var(--gh-font-weight-bold)', color: romTone === 'danger' ? 'var(--gh-danger-fg)' : romTone === 'success' ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)', fontVariantNumeric: 'tabular-nums' }}>{fmtM(rollup.totalPrice)}</div>
            <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 2 }}>{active.label.split(' ')[0]} scenario</div>
          </div>
          {/* Gap: ROM → PTW */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 10px', minWidth: 96, flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: within ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', marginBottom: 3 }}>
              {fmtGap(Math.abs(rollup.totalPrice - strategy.ptw.target))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--gh-border-strong)' }} />
              <span style={{ fontSize: 9, color: 'var(--gh-text-tertiary)', padding: '0 3px' }}>◆</span>
              <div style={{ flex: 1, height: 1, background: 'var(--gh-border-strong)' }} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: within ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)', whiteSpace: 'nowrap', marginTop: 3 }}>
              {rollup.totalPrice > strategy.ptw.target ? 'Above target' : rollup.totalPrice < strategy.ptw.target ? 'Below target' : 'On target'}
            </div>
          </div>
          {/* PRICE-TO-WIN */}
          <div style={{ padding: '24px 16px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-accent)', minWidth: 148, flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 2 }}>Price-to-Win</div>
            <div style={{ fontSize: 'var(--gh-font-size-xl)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-accent-tint)', fontVariantNumeric: 'tabular-nums' }}>{fmtM(strategy.ptw.target)}</div>
            <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 2 }}>{fmtM(strategy.ptw.low)}–{fmtM(strategy.ptw.high)} window</div>
          </div>
          {/* Gap: ROM vs Ceiling */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 10px', minWidth: 96, flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: over ? 'var(--gh-danger-fg)' : 'var(--gh-text-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', marginBottom: 3 }}>
              {fmtGap(Math.abs(rollup.totalPrice - ceiling))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--gh-border-strong)' }} />
              <span style={{ fontSize: 9, color: 'var(--gh-text-tertiary)', padding: '0 3px' }}>◆</span>
              <div style={{ flex: 1, height: 1, background: 'var(--gh-border-strong)' }} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: over ? 'var(--gh-danger-fg)' : 'var(--gh-text-tertiary)', whiteSpace: 'nowrap', marginTop: 3 }}>
              {over ? 'Over ceiling' : 'Under ceiling'}
            </div>
          </div>
          {/* GOV. CEILING */}
          <div style={{ padding: '24px 16px', borderRadius: 'var(--gh-radius-lg)', background: over ? 'var(--gh-danger-bg)' : 'var(--gh-bg-surface)', border: `1px solid ${over ? 'var(--gh-danger-fg)' : 'var(--gh-border)'}`, minWidth: 148, flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 2 }}>Gov. Ceiling</div>
            <div style={{ fontSize: 'var(--gh-font-size-xl)', fontWeight: 'var(--gh-font-weight-bold)', color: over ? 'var(--gh-danger-fg)' : 'var(--gh-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{fmtM(ceiling)}</div>
            <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 2 }}>hard wall · do not exceed</div>
          </div>
          {/* contract badge + live ROM note */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 'auto', flexShrink: 0, paddingLeft: 16 }}>
            <span
              title="Base year is firm fixed price (your cost is locked — estimate it precisely, you absorb any overrun). Option years are time & materials (billed at hourly rates — keep your rates competitive, that's what gets evaluated)."
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-secondary)', fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap', border: '1px solid var(--gh-border)', cursor: 'help' }}>
              {opportunity.contractType} • {opportunity.period}
              <Info size={11} style={{ opacity: 0.55, flexShrink: 0 }} />
            </span>
            <span title="ROM recalculates live from labor, ODC, subcontractor and indirect-rate inputs." style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gh-text-tertiary)', cursor: 'help', whiteSpace: 'nowrap' }}>
              <FileText size={12} /> Live ROM
            </span>
          </div>
        </div>
      </div>

      {/* ── Section tabs ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid var(--gh-border)', flexShrink: 0, padding: '0 var(--gh-space-12)', gap: 0 }}>
        {SECTIONS.map(s => {
          const on = selectedNav === s.key;
          return (
            <button key={s.key} onClick={() => setSelectedNav(s.key)} style={{
              display: 'inline-flex', alignItems: 'center', padding: '10px 16px', cursor: 'pointer', fontFamily: F,
              background: 'transparent', border: 'none', borderBottom: `2px solid ${on ? 'var(--gh-accent)' : 'transparent'}`,
              fontSize: 'var(--gh-font-size-sm)', fontWeight: on ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-medium)',
              color: on ? 'var(--gh-text)' : 'var(--gh-text-tertiary)', whiteSpace: 'nowrap', marginBottom: -1,
            }}>{s.title}</button>
          );
        })}
        <div style={{ marginLeft: 'auto', paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>Scenario:</span>
          <Pill tone="accent">{active.label.split(' ')[0]}</Pill>
        </div>
      </div>

      {/* ── Content ── */}
      <div key={selectedNav} style={{ flex: 1, minHeight: 0, background: 'var(--gh-bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DetailPanel scrollKey={selectedNav} background="var(--gh-bg-canvas)" progressBar={false}>
          <div style={{ padding: '16px 20px' }}>
            {selectedNav === 'strategy' && (
              <PricingStrategy strategy={strategy} opportunity={opportunity} incumbent={incumbent} romTotal={rollup.totalPrice} revealed={revealed} analyzing={analyzing} onAnalyze={onAnalyze} dataPoints={dataPoints} onAddDataPoint={onAddDataPoint} />
            )}
            {selectedNav === 'rom' && (
              <RomBuilder
                scenarios={scenarios} activeIdx={activeIdx} onSelectScenario={setActiveIdx} onClone={onClone}
                scenario={active} rollup={rollup} opportunity={opportunity} ptw={strategy.ptw}
                onLaborChange={onLaborChange} onOdcChange={onOdcChange} onSubChange={onSubChange} onIndirectChange={onIndirectChange}
                onAddOdc={onAddOdc} onRemoveOdc={onRemoveOdc}
                onImportStaffing={onImportStaffing} onSuggestOdcs={onSuggestOdcs} onAiRecommend={onAiRecommend}
              />
            )}
            {selectedNav === 'competitive' && (
              <CompetitiveAnalysis benchmarks={benchmarks} scenario={active} incumbent={incumbent} rollup={rollup} winNote={scenarioWinNotes[winKey]} pricePosition={pricePosition} onAdjustRate={onAdjustRate} />
            )}
          </div>
        </DetailPanel>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 95, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border-strong)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-sm)', fontFamily: F }}>
          <Check size={15} style={{ color: 'var(--gh-success-fg)' }} /> {toast}
        </div>
      )}
    </div>
  );
}


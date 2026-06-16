import React, { useMemo, useRef, useState } from 'react';
import { Calculator, Target, Percent, ChevronRight, Check, Sparkles, BarChart3, Building2, FileText } from 'lucide-react';
import { pricingData } from '../../../../data/capture/pricing-data';
import type { ScenarioData, LaborLine, OdcLine, SubLine, IndirectRates, PriceDataPoint } from '../../../../types/pricing';
import { F, tone, type Tone } from '../staffing/helpers';
import { Stat, Pill } from '../staffing/ui';
import { PricingStrategy } from './PricingStrategy';
import { RomBuilder } from './RomBuilder';
import { CompetitiveAnalysis } from './CompetitiveAnalysis';
import { romRollup, fullyBurdenedRate, burdenMultiplier, fmtM } from './romMath';

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

  const aboveMarket = useMemo(() => benchmarks.filter(b => {
    const line = active.labor.find(l => l.lcat === b.lcat);
    return line ? fullyBurdenedRate(line, active.indirect) > b.p75 : false;
  }).length, [active, benchmarks]);

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

  const nav: Record<SectionKey, { hint: string; dot: Tone }> = {
    strategy: { hint: revealed ? `PTW ${fmtM(strategy.ptw.target)} · ${strategy.ptw.confidence}` : 'not analyzed yet', dot: revealed ? 'success' : 'warning' },
    rom: { hint: `${active.label.split(' ')[0]} · ${fmtM(rollup.totalPrice)}`, dot: romTone },
    competitive: { hint: aboveMarket ? `${aboveMarket} rate${aboveMarket === 1 ? '' : 's'} above market` : 'all rates at-market', dot: aboveMarket ? 'warning' : 'success' },
  };
  const meta = SECTIONS.find(s => s.key === selectedNav)!;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gh-bg-canvas)', fontFamily: F, padding: 'var(--gh-space-8) var(--gh-space-12)', boxSizing: 'border-box' }}>
      <style>{`@keyframes gh-spin{to{transform:rotate(360deg)}}.gh-spin{animation:gh-spin .8s linear infinite}`}</style>

      {/* context header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12, flexShrink: 0 }}>
        <Stat label={`ROM Total · ${active.label.split(' ')[0]}`} value={fmtM(rollup.totalPrice)} tone={romTone} icon={<Calculator size={15} />} />
        <Stat label="Price-to-Win Target" value={fmtM(strategy.ptw.target)} tone="accent" icon={<Target size={15} />} />
        <Stat label="Fee / Margin" value={`${(active.indirect.fee * 100).toFixed(0)}%`} icon={<Percent size={15} />} />
        <Stat label="vs Ceiling" value={`${rollup.totalPrice - ceiling >= 0 ? '+' : ''}${fmtM(rollup.totalPrice - ceiling)}`} tone={rollup.totalPrice > ceiling ? 'danger' : 'success'} icon={<Building2 size={15} />} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, marginLeft: 'auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-secondary)', fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap', border: '1px solid var(--gh-border)' }}>
            {opportunity.contractType} • Ceiling {fmtM(ceiling)} • {opportunity.period}
          </span>
          <span title="ROM math is computed live from the labor, ODC, subcontractor and indirect-rate inputs." style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gh-text-tertiary)', cursor: 'help' }}>
            <FileText size={12} /> Live ROM · {within ? 'within PTW window' : over ? 'over ceiling' : 'outside PTW window'}
          </span>
        </div>
      </div>

      {/* master / detail */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', overflow: 'hidden' }}>
        <div style={{ width: 256, flexShrink: 0, overflowY: 'auto', background: 'var(--gh-bg-canvas)', borderRight: '1px solid var(--gh-border)' }}>
          <div style={{ margin: '10px 8px 4px', padding: '6px 8px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)' }}>
            <span style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pricing</span>
          </div>
          <div style={{ padding: '4px 8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SECTIONS.map(s => <NavItem key={s.key} n={s.n} title={s.title} icon={s.icon} hint={nav[s.key].hint} dot={nav[s.key].dot} selected={selectedNav === s.key} onSelect={() => setSelectedNav(s.key)} />)}
          </div>
          <div style={{ margin: '6px 8px 12px', padding: '10px 11px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)' }}>
            <div style={{ fontSize: 10, color: 'var(--gh-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>Active Scenario</div>
            <Pill tone="accent">{active.label.split(' ')[0]}</Pill>
            <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 8, lineHeight: 1.4 }}>{scenarioWinNotes[winKey]}</div>
          </div>
        </div>

        <div key={selectedNav} style={{ flex: 1, minWidth: 0, background: 'var(--gh-bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: '1px solid var(--gh-border)', flexShrink: 0 }}>
            <span style={{ width: 28, height: 28, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{meta.n}</span>
            <h2 style={{ margin: 0, fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', flex: 1 }}>{meta.title}</h2>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
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
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 95, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border-strong)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-sm)', fontFamily: F }}>
          <Check size={15} style={{ color: 'var(--gh-success-fg)' }} /> {toast}
        </div>
      )}
    </div>
  );
}

function NavItem({ n, title, icon, hint, dot, selected, onSelect }: {
  n: number; title: string; icon: React.ReactNode; hint: string; dot: Tone; selected: boolean; onSelect: () => void;
}) {
  return (
    <button onClick={onSelect} style={{
      display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 10px', textAlign: 'left', cursor: 'pointer',
      borderRadius: 'var(--gh-radius-lg)', background: selected ? 'var(--gh-bg-surface-muted)' : 'transparent',
      borderTop: '1px solid', borderBottom: '1px solid', borderRight: '1px solid',
      borderTopColor: selected ? 'var(--gh-border)' : 'transparent', borderBottomColor: selected ? 'var(--gh-border)' : 'transparent', borderRightColor: selected ? 'var(--gh-border)' : 'transparent',
      borderLeft: `3px solid ${selected ? 'var(--gh-accent)' : 'transparent'}`, fontFamily: F,
    }}>
      <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 'var(--gh-radius-full)', background: selected ? 'var(--gh-accent)' : 'var(--gh-bg-surface)', color: selected ? 'var(--gh-accent-fg)' : 'var(--gh-text-tertiary)', fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', display: 'grid', placeItems: 'center' }}>{n}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ color: selected ? 'var(--gh-accent-tint)' : 'var(--gh-text-tertiary)', display: 'flex', flexShrink: 0 }}>{icon}</span>
          <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: selected ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-medium)', color: selected ? 'var(--gh-text)' : 'var(--gh-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gh-text-disabled)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone(dot).fg, flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hint}</span>
        </span>
      </span>
      {selected && <ChevronRight size={13} style={{ flexShrink: 0, color: 'var(--gh-accent)' }} />}
    </button>
  );
}

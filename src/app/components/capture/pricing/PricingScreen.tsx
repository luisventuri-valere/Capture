import React, { useMemo, useRef, useState } from 'react';
import { Calculator, Target, Percent, Check, Sparkles, BarChart3, Building2, FileText } from 'lucide-react';
import { pricingData } from '../../../../data/capture/pricing-data';
import type { ScenarioData, LaborLine, OdcLine, SubLine, IndirectRates, PriceDataPoint } from '../../../../types/pricing';
import { F, tone, type Tone } from '../staffing/helpers';
import { Stat, Pill } from '../staffing/ui';
import { SectionIndex, SectionIndexItem } from '../SectionIndex';
import { DetailPanel } from '../DetailPanel';
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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gh-bg-canvas)', fontFamily: F, padding: 'var(--gh-space-8) 0', boxSizing: 'border-box' }}>
      <style>{`@keyframes gh-spin{to{transform:rotate(360deg)}}.gh-spin{animation:gh-spin .8s linear infinite}`}</style>

      {/* context header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12, flexShrink: 0, padding: '0 var(--gh-space-12)' }}>
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

      {/* master / detail — shared shell */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <SectionIndex
          title="Pricing"
          renderItems={(narrow) => [
            ...SECTIONS.map(s => (
              <SectionIndexItem
                key={s.key}
                title={s.title}
                subtitle={nav[s.key].hint}
                subtitleDot={tone(nav[s.key].dot).fg}
                selected={selectedNav === s.key}
                narrow={narrow}
                onSelect={() => setSelectedNav(s.key)}
              />
            )),
            !narrow && (
              <div key="active-scenario" style={{ margin: '6px 8px 12px', padding: '10px 11px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)' }}>
                <div style={{ fontSize: 10, color: 'var(--gh-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>Active Scenario</div>
                <Pill tone="accent">{active.label.split(' ')[0]}</Pill>
                <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 8, lineHeight: 1.4 }}>{scenarioWinNotes[winKey]}</div>
              </div>
            ),
          ]}
        />

        <div key={selectedNav} style={{ flex: 1, minWidth: 0, background: 'var(--gh-bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 95, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border-strong)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-sm)', fontFamily: F }}>
          <Check size={15} style={{ color: 'var(--gh-success-fg)' }} /> {toast}
        </div>
      )}
    </div>
  );
}


import React, { useMemo, useState } from 'react';
import { BookMarked, Target, FileText, Check, ShieldAlert, Layers, Library } from 'lucide-react';
import { ppData } from '../../../../data/capture/pp-data';
import type { PPLibraryEntry } from '../../../../types/pastPerformance';
import { F, tone, type Tone } from '../staffing/helpers';
import { Stat } from '../staffing/ui';
import { SectionIndex, SectionIndexItem } from '../SectionIndex';
import { PPLibrary } from './PPLibrary';
import { OpportunityMatch } from './OpportunityMatch';
import { Narratives } from './Narratives';
import { DetailPanel } from '../DetailPanel';

type SectionKey = 'library' | 'match' | 'narratives';
const SECTIONS: { key: SectionKey; n: number; title: string; icon: React.ReactNode }[] = [
  { key: 'library', n: 1, title: 'PP Library', icon: <Library size={15} /> },
  { key: 'match', n: 2, title: 'Opportunity Match', icon: <Target size={15} /> },
  { key: 'narratives', n: 3, title: 'Narrative Workspace', icon: <FileText size={15} /> },
];

export function PastPerformanceScreen() {
  const { opportunity, rfpRules, cparsDisclaimer, requirements, scored, coverage, narratives, optimize, aiPrefill } = ppData;
  const [library, setLibrary] = useState<PPLibraryEntry[]>(ppData.library);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedNav, setSelectedNav] = useState<SectionKey>('library');
  const [scoredRevealed, setScoredRevealed] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeNote, setOptimizeNote] = useState<string | null>(null);
  const [toast, setToastState] = useState<string | null>(null);
  const toastTimer = React.useRef<number | undefined>(undefined);
  const setToast = (m: string) => { setToastState(m); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToastState(null), 2800); };

  const maxRefs = rfpRules.maxReferences;

  const coveragePct = useMemo(() => {
    const covered = requirements.filter(req => {
      const row = coverage.find(c => c.requirementId === req.id);
      return row ? [...selected].some(id => { const s = row.perReference[id]; return s === 'strong' || s === 'moderate'; }) : false;
    });
    return Math.round((covered.length / Math.max(requirements.length, 1)) * 100);
  }, [selected, requirements, coverage]);

  const toggleSelect = (id: string) => {
    if (selected.has(id)) { setSelected(p => { const n = new Set(p); n.delete(id); return n; }); return; }
    if (selected.size >= maxRefs) { setToast(`RFP limit: max ${maxRefs} references. Deselect one first.`); return; }
    setSelected(p => new Set(p).add(id));
  };
  const onScore = () => { setScoring(true); window.setTimeout(() => { setScoring(false); setScoredRevealed(true); }, 950); };
  const onOptimize = () => {
    setOptimizing(true);
    window.setTimeout(() => { setSelected(new Set(optimize.selectedIds)); setOptimizeNote(optimize.note); setOptimizing(false); setToast('Selection optimized to the recommended set'); }, 900);
  };
  const onAdd = (e: PPLibraryEntry) => { setLibrary(prev => [e, ...prev]); setToast('Reference added to library'); };

  const nav: Record<SectionKey, { hint: string; dot: Tone }> = {
    library: { hint: `${library.length} references`, dot: 'neutral' },
    match: { hint: scoredRevealed ? `${selected.size}/${maxRefs} selected` : 'not scored yet', dot: scoredRevealed ? (selected.size > maxRefs ? 'danger' : selected.size ? 'success' : 'warning') : 'neutral' },
    narratives: { hint: `${selected.size} selected`, dot: selected.size ? 'success' : 'neutral' },
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gh-bg-canvas)', fontFamily: F, padding: 'var(--gh-space-8) 0', boxSizing: 'border-box' }}>
      <style>{`@keyframes gh-spin{to{transform:rotate(360deg)}}.gh-spin{animation:gh-spin .8s linear infinite}`}</style>

      {/* ── Context header (compact) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12, flexShrink: 0, padding: '0 var(--gh-space-12)' }}>
        <Stat label="Library References" value={library.length} icon={<BookMarked size={15} />} />
        <Stat label="Selected for Proposal" value={`${selected.size}/${maxRefs}`} tone={selected.size > maxRefs ? 'danger' : 'accent'} icon={<Check size={15} />} />
        <Stat label="Requirement Coverage" value={`${coveragePct}%`} tone={coveragePct >= 80 ? 'success' : coveragePct >= 50 ? 'warning' : 'neutral'} icon={<Layers size={15} />} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, marginLeft: 'auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-secondary)', fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap', border: '1px solid var(--gh-border)' }}>
            RFP: Max {rfpRules.maxReferences} refs • {rfpRules.recency} • {rfpRules.sizeThreshold}
          </span>
          <span title={cparsDisclaimer} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gh-warning-fg)', cursor: 'help' }}>
            <ShieldAlert size={12} /> CPARS ratings estimated — public data inference
          </span>
        </div>
      </div>

      {/* ── Master / detail — shared shell ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        {/* Shared collapsible/resizable section index */}
        <SectionIndex
          title="Past Performance"
          renderItems={(narrow) => SECTIONS.map(s => (
            <SectionIndexItem
              key={s.key}
              title={s.title}
              subtitle={nav[s.key].hint}
              subtitleDot={tone(nav[s.key].dot).fg}
              selected={selectedNav === s.key}
              narrow={narrow}
              onSelect={() => setSelectedNav(s.key)}
            />
          ))}
        />

        {/* detail */}
        <div key={selectedNav} style={{ flex: 1, minWidth: 0, background: 'var(--gh-bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DetailPanel scrollKey={selectedNav} background="var(--gh-bg-canvas)" progressBar={false}>
            <div style={{ padding: '16px 20px' }}>
              {selectedNav === 'library' && <PPLibrary library={library} aiPrefill={aiPrefill} onAdd={onAdd} />}
              {selectedNav === 'match' && <OpportunityMatch scored={scored} coverage={coverage} requirements={requirements} library={library} selected={selected} maxRefs={maxRefs} scoredRevealed={scoredRevealed} scoring={scoring} optimizing={optimizing} optimizeNote={optimizeNote} onScore={onScore} onToggleSelect={toggleSelect} onOptimize={onOptimize} onSuggestPartner={() => setToast('Links to Teaming tab — suggest a teammate reference')} />}
              {selectedNav === 'narratives' && <Narratives selectedIds={[...selected]} narratives={narratives} library={library} requirements={requirements} onToast={setToast} />}
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


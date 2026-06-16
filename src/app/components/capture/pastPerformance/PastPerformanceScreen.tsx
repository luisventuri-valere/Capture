import React, { useMemo, useState } from 'react';
import { BookMarked, Target, FileText, ChevronRight, Check, ShieldAlert, Layers, Library } from 'lucide-react';
import { ppData } from '../../../../data/capture/pp-data';
import type { PPLibraryEntry } from '../../../../types/pastPerformance';
import { F, tone, type Tone } from '../staffing/helpers';
import { Stat } from '../staffing/ui';
import { PPLibrary } from './PPLibrary';
import { OpportunityMatch } from './OpportunityMatch';
import { Narratives } from './Narratives';

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
  const meta = SECTIONS.find(s => s.key === selectedNav)!;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gh-bg-canvas)', fontFamily: F, padding: 'var(--gh-space-8) var(--gh-space-12)', boxSizing: 'border-box' }}>
      <style>{`@keyframes gh-spin{to{transform:rotate(360deg)}}.gh-spin{animation:gh-spin .8s linear infinite}`}</style>

      {/* ── Context header (compact) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12, flexShrink: 0 }}>
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

      {/* ── Master / detail ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', overflow: 'hidden' }}>
        {/* nav */}
        <div style={{ width: 256, flexShrink: 0, overflowY: 'auto', background: 'var(--gh-bg-canvas)', borderRight: '1px solid var(--gh-border)' }}>
          <div style={{ margin: '10px 8px 4px', padding: '6px 8px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)' }}>
            <span style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Past Performance</span>
          </div>
          <div style={{ padding: '4px 8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SECTIONS.map(s => <NavItem key={s.key} n={s.n} title={s.title} icon={s.icon} hint={nav[s.key].hint} dot={nav[s.key].dot} selected={selectedNav === s.key} onSelect={() => setSelectedNav(s.key)} />)}
          </div>
        </div>

        {/* detail */}
        <div key={selectedNav} style={{ flex: 1, minWidth: 0, background: 'var(--gh-bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: '1px solid var(--gh-border)', flexShrink: 0 }}>
            <span style={{ width: 28, height: 28, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{meta.n}</span>
            <h2 style={{ margin: 0, fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', flex: 1 }}>{meta.title}</h2>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {selectedNav === 'library' && <PPLibrary library={library} aiPrefill={aiPrefill} onAdd={onAdd} />}
            {selectedNav === 'match' && <OpportunityMatch scored={scored} coverage={coverage} requirements={requirements} library={library} selected={selected} maxRefs={maxRefs} scoredRevealed={scoredRevealed} scoring={scoring} optimizing={optimizing} optimizeNote={optimizeNote} onScore={onScore} onToggleSelect={toggleSelect} onOptimize={onOptimize} onSuggestPartner={() => setToast('Links to Teaming tab — suggest a teammate reference')} />}
            {selectedNav === 'narratives' && <Narratives selectedIds={[...selected]} narratives={narratives} library={library} requirements={requirements} onToast={setToast} />}
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

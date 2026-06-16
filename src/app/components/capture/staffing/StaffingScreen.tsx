import React, { useMemo, useRef, useState } from 'react';
import {
  Users, DollarSign, Building2, CalendarClock, Pencil, Check, Sparkles,
  FileText, Loader2, ListChecks, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { staffingData } from '../../../../data/capture/staffing-data';
import type { LCAT, IncumbentPerson } from '../../../../types/staffing';
import {
  F, calculateLcatStatus, committedCount, marketPosition, priorityActions, tone, type Tone,
} from './helpers';
import { Stat, Btn } from './ui';
import { LcatMatrix, type MatrixCallbacks } from './LcatMatrix';
import { AiAnalysisModal, NotesModal, DocumentsModal, LoiModal } from './modals';
import { SalaryIntelligence, IncumbentIntelligence, TimelinePriority } from './sections';
import { DocumentGeneration } from './DocumentGeneration';

type ModalState = { kind: 'ai' | 'notes' | 'docs' | 'loi' | null; lcatId?: string; candId?: string };
type SectionKey = 'matrix' | 'docs' | 'salary' | 'incumbent' | 'timeline';

const SECTIONS: { key: SectionKey; n: number; title: string; icon: React.ReactNode }[] = [
  { key: 'matrix', n: 1, title: 'Requirements Matrix', icon: <ListChecks size={15} /> },
  { key: 'docs', n: 2, title: 'Document Generation', icon: <FileText size={15} /> },
  { key: 'salary', n: 3, title: 'Salary Intelligence', icon: <DollarSign size={15} /> },
  { key: 'incumbent', n: 4, title: 'Incumbent Intelligence', icon: <Building2 size={15} /> },
  { key: 'timeline', n: 5, title: 'Timeline & Priority', icon: <CalendarClock size={15} /> },
];

export function StaffingScreen() {
  const { opportunity, incumbent, salaryBenchmarks, timeline } = staffingData;
  const [lcats, setLcats] = useState<LCAT[]>(staffingData.lcats);
  const [people, setPeople] = useState<IncumbentPerson[]>(incumbent.people);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<SectionKey>('matrix');
  const [modal, setModal] = useState<ModalState>({ kind: null });
  const [toast, setToastState] = useState<string | null>(null);
  const [genAll, setGenAll] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    staffingData.lcats.forEach(l => { const st = calculateLcatStatus(l.candidates, l.quantity); if (st === 'gap' || st === 'reviewing') s.add(l.id); });
    return s;
  });
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const toastTimer = useRef<number | undefined>(undefined);
  const setToast = (m: string) => { setToastState(m); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToastState(null), 2600); };

  const stats = useMemo(() => {
    let filled = 0, gaps = 0, pipeline = 0;
    lcats.forEach(l => { filled += committedCount(l.candidates); pipeline += l.candidates.length; if (calculateLcatStatus(l.candidates, l.quantity) === 'gap') gaps++; });
    return { total: lcats.length, filled, gaps, pipeline };
  }, [lcats]);

  const nav = useMemo(() => {
    const reviewing = lcats.filter(l => calculateLcatStatus(l.candidates, l.quantity) === 'reviewing').length;
    const docTotal = lcats.length * 4;
    const docComplete = lcats.reduce((s, l) => s + Object.values(l.documents).filter(d => d === 'complete').length, 0);
    const off = lcats.reduce((n, l) => n + (marketPosition(l, salaryBenchmarks.find(x => x.lcatId === l.id)).label !== 'At Market' ? 1 : 0), 0);
    const highRisk = people.filter(p => p.flightRisk === 'high').length;
    const pact = priorityActions(lcats);
    const out: Record<SectionKey, { hint: string; dot: Tone }> = {
      matrix: { hint: `${lcats.length} LCATs · ${stats.gaps ? `${stats.gaps} gap${stats.gaps === 1 ? '' : 's'}` : reviewing ? `${reviewing} reviewing` : 'on track'}`, dot: stats.gaps ? 'danger' : reviewing ? 'warning' : 'success' },
      docs: { hint: `${docComplete}/${docTotal} docs ready`, dot: docComplete === docTotal ? 'success' : docComplete > 0 ? 'warning' : 'neutral' },
      salary: { hint: off ? `${off} off-market` : 'all at market', dot: off ? 'warning' : 'success' },
      incumbent: { hint: `${incumbent.contractor} · ${highRisk} high-risk`, dot: highRisk ? 'danger' : 'warning' },
      timeline: { hint: `${pact.length} priority action${pact.length === 1 ? '' : 's'}`, dot: pact.some(a => a.priority === 'P1') ? 'danger' : pact.length ? 'warning' : 'success' },
    };
    return out;
  }, [lcats, people, salaryBenchmarks, incumbent.contractor, stats.gaps]);

  // ── mutators ──
  const patchLcat = (lcatId: string, patch: Partial<LCAT>) => setLcats(prev => prev.map(l => l.id === lcatId ? { ...l, ...patch } : l));
  const patchCandidate = (lcatId: string, candId: string, fn: (c: LCAT['candidates'][number]) => LCAT['candidates'][number]) =>
    setLcats(prev => prev.map(l => l.id !== lcatId ? l : { ...l, candidates: l.candidates.map(c => c.id === candId ? fn(c) : c) }));

  const cb: MatrixCallbacks = {
    openAi: (lcatId, candId) => setModal({ kind: 'ai', lcatId, candId }),
    openNotes: (lcatId, candId) => setModal({ kind: 'notes', lcatId, candId }),
    openDocs: (lcatId) => setModal({ kind: 'docs', lcatId }),
    openLoi: (lcatId, candId) => setModal({ kind: 'loi', lcatId, candId }),
    onEditLcat: patchLcat,
    onDeleteLcat: (lcatId) => { setLcats(prev => prev.filter(l => l.id !== lcatId)); setToast('LCAT removed'); },
    onAddLcat: () => {
      const id = `LCAT-${Math.floor(Math.random() * 9000 + 1000)}`;
      setLcats(prev => [...prev, {
        id, title: 'New Labor Category', isKeyPersonnel: false, classification: 'commodity', quantity: 1,
        requirements: { education: "Bachelor's", yearsExp: 3, certifications: [], clearance: 'TS/SCI', location: 'Washington, DC' },
        salaryRange: { min: 100000, max: 130000 }, status: 'gap', filledCount: 0,
        documents: { jobReq: 'not_started', interviewQs: 'not_started', evalCriteria: 'not_started', handoffPackage: 'not_started' },
        candidates: [],
      }]);
      setExpanded(p => new Set(p).add(id));
    },
    onToast: setToast,
  };

  const toggleExpand = (id: string) => setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const generateDoc = (lcatId: string, key: keyof LCAT['documents']) =>
    setLcats(prev => prev.map(l => l.id === lcatId ? { ...l, documents: { ...l.documents, [key]: 'complete' } } : l));
  const generateAllDocs = () => {
    setGenAll(true);
    window.setTimeout(() => {
      setLcats(prev => prev.map(l => ({ ...l, documents: { jobReq: 'complete', interviewQs: 'complete', evalCriteria: 'complete', handoffPackage: 'complete' } })));
      setGenAll(false); setToast('All documents generated');
    }, 850);
  };
  const generateLoi = (lcatId: string, candId: string) => patchCandidate(lcatId, candId, c => ({ ...c, loiStatus: c.loiStatus === 'sent' ? 'signed' : 'sent' }));
  const postNote = (lcatId: string, candId: string, text: string) =>
    patchCandidate(lcatId, candId, c => ({ ...c, notes: [...c.notes, { id: `n-${Date.now()}`, userName: 'You', userRole: 'BD', text, date: new Date().toISOString().slice(0, 10) }] }));
  const addToPipeline = (id: string) => { setPeople(prev => prev.map(p => p.id === id ? { ...p, status: 'in_pipeline' } : p)); setToast('Added to candidate pipeline'); };

  const scrollToLcat = (id: string) => {
    setSelected('matrix');
    setExpanded(p => new Set(p).add(id));
    window.setTimeout(() => rowRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 90);
  };

  const closeModal = () => setModal({ kind: null });
  const activeLcat = modal.lcatId ? lcats.find(l => l.id === modal.lcatId) : undefined;
  const activeCand = activeLcat && modal.candId ? activeLcat.candidates.find(c => c.id === modal.candId) : undefined;
  const meta = SECTIONS.find(s => s.key === selected)!;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gh-bg-canvas)', fontFamily: F, padding: 'var(--gh-space-8) var(--gh-space-12)', boxSizing: 'border-box' }}>
      <style>{`@keyframes gh-spin{to{transform:rotate(360deg)}}.gh-spin{animation:gh-spin .8s linear infinite}@keyframes gh-pulse{0%,100%{opacity:1}50%{opacity:.25}}.gh-pulse{animation:gh-pulse 1.4s ease-in-out infinite}`}</style>

      {/* ── Context header (compact) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12, flexShrink: 0 }}>
        <Stat label="Total LCATs" value={stats.total} icon={<Users size={15} />} />
        <Stat label="Positions Filled" value={stats.filled} tone="success" icon={<Check size={15} />} />
        <Stat label="Open Gaps" value={stats.gaps} tone={stats.gaps > 0 ? 'danger' : 'success'} icon={<AlertTriangle size={15} />} />
        <Stat label="Candidates in Pipeline" value={stats.pipeline} tone="accent" icon={<Sparkles size={15} />} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, marginLeft: 'auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-warning-bg)', color: 'var(--gh-warning-fg)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap' }}>
            <CalendarClock size={14} /> Days to Proposal: {opportunity.daysToProposal}
          </span>
          <button onClick={() => setEditMode(e => !e)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 'var(--gh-radius-lg)',
            background: editMode ? 'var(--gh-accent)' : 'transparent', color: editMode ? 'var(--gh-accent-fg)' : 'var(--gh-text-secondary)',
            border: `1px solid ${editMode ? 'var(--gh-accent)' : 'var(--gh-border)'}`, fontSize: 'var(--gh-font-size-sm)',
            fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer', fontFamily: F,
          }}>
            {editMode ? <span className="gh-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gh-accent-fg)' }} /> : <Pencil size={13} />}
            {editMode ? 'Done Editing' : 'Edit'}
          </button>
        </div>
      </div>

      {/* ── Master / detail ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', overflow: 'hidden' }}>
        {/* nav */}
        <div style={{ width: 256, flexShrink: 0, overflowY: 'auto', background: 'var(--gh-bg-canvas)', borderRight: '1px solid var(--gh-border)' }}>
          <div style={{ margin: '10px 8px 4px', padding: '6px 8px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)' }}>
            <span style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sections</span>
          </div>
          <div style={{ padding: '4px 8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SECTIONS.map(s => (
              <NavItem key={s.key} n={s.n} title={s.title} icon={s.icon} hint={nav[s.key].hint} dot={nav[s.key].dot} selected={selected === s.key} onSelect={() => setSelected(s.key)} />
            ))}
          </div>
        </div>

        {/* detail */}
        <div key={selected} style={{ flex: 1, minWidth: 0, background: 'var(--gh-bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: '1px solid var(--gh-border)', flexShrink: 0 }}>
            <span style={{ width: 28, height: 28, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{meta.n}</span>
            <h2 style={{ margin: 0, fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', flex: 1 }}>{meta.title}</h2>
            {selected === 'docs' && (
              <Btn kind="secondary" size="sm" icon={genAll ? <Loader2 size={13} className="gh-spin" /> : <FileText size={13} />} onClick={generateAllDocs} disabled={genAll}>{genAll ? 'Generating…' : 'Generate All Docs'}</Btn>
            )}
            {selected === 'incumbent' && (
              <span style={{ padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)', fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)' }}>{incumbent.contractor}</span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {selected === 'matrix' && <LcatMatrix lcats={lcats} editMode={editMode} expanded={expanded} onToggle={toggleExpand} cb={cb} rowRefs={rowRefs} />}
            {selected === 'docs' && <DocumentGeneration lcats={lcats} onGenerate={generateDoc} onOpenDocs={(id) => setModal({ kind: 'docs', lcatId: id })} />}
            {selected === 'salary' && <SalaryIntelligence lcats={lcats} benchmarks={salaryBenchmarks} />}
            {selected === 'incumbent' && <IncumbentIntelligence incumbent={incumbent} people={people} onAddToPipeline={addToPipeline} />}
            {selected === 'timeline' && <TimelinePriority timeline={timeline} lcats={lcats} onScrollToLcat={scrollToLcat} />}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal.kind === 'ai' && activeCand && activeLcat && <AiAnalysisModal candidate={activeCand} totalInLcat={activeLcat.candidates.length} onClose={closeModal} onToast={setToast} />}
      {modal.kind === 'notes' && activeCand && <NotesModal candidate={activeCand} onClose={closeModal} onPost={(text) => postNote(modal.lcatId!, modal.candId!, text)} />}
      {modal.kind === 'docs' && activeLcat && <DocumentsModal lcat={activeLcat} onClose={closeModal} onGenerate={(key) => generateDoc(modal.lcatId!, key)} />}
      {modal.kind === 'loi' && activeCand && <LoiModal candidate={activeCand} onClose={closeModal} onGenerate={() => generateLoi(modal.lcatId!, modal.candId!)} />}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 95, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border-strong)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-sm)', fontFamily: F }}>
          <Check size={15} style={{ color: 'var(--gh-success-fg)' }} /> {toast}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar nav item (Strategy & Plan pattern) ──────────────────────────────
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

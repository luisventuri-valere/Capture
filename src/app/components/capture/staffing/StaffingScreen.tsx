import React, { useMemo, useRef, useState } from 'react';
import {
  DollarSign, CalendarClock, Check,
  FileText, Loader2, ListChecks,
} from 'lucide-react';
import { staffingData } from '../../../../data/capture/staffing-data';
import type { LCAT, IncumbentPerson, IncumbentStatus, CandidateStatus } from '../../../../types/staffing';
import {
  F, calculateLcatStatus, committedCount, marketPosition, priorityActions, tone, type Tone,
  courtshipAdvance, personToCandidate,
} from './helpers';
import { Btn, SectionHeader } from './ui';
import { SectionIndex, SectionIndexItem } from '../SectionIndex';
import { DetailPanel } from '../DetailPanel';
import { LcatMatrix, type MatrixCallbacks } from './LcatMatrix';
import { AiAnalysisModal, NotesModal, DocumentsModal, LoiModal, AddLcatModal, type NewLcatFields } from './modals';
import { SalaryIntelligence, TimelinePriority, IncumbentContextCard } from './sections';
import { DocumentGeneration } from './DocumentGeneration';

type ModalState = { kind: 'ai' | 'notes' | 'docs' | 'loi' | null; lcatId?: string; candId?: string };
type SectionKey = 'matrix' | 'docs' | 'salary' | 'timeline';

// The hub (Requirements Matrix) anchors the nav; the rest are support tools that
// serve it (Change 1). Each section carries a one-line self-description (Change 4).
const SECTION_META: Record<SectionKey, { title: string; subtitle: string; icon: React.ReactNode }> = {
  matrix: {
    title: 'Requirements Matrix',
    subtitle: "The positions the RFP requires and the candidates you've aligned to each one.",
    icon: <ListChecks size={15} />,
  },
  docs: {
    title: 'Document Generation',
    subtitle: "Status of each position's staffing documents: requisition, interview guide, evaluation criteria, and handoff package.",
    icon: <FileText size={15} />,
  },
  salary: {
    title: 'Salary Intelligence',
    subtitle: "How your salary offers compare to the market, so you're neither overpaying nor underbidding.",
    icon: <DollarSign size={15} />,
  },
  timeline: {
    title: 'Timeline & Priority',
    subtitle: 'Which positions to work first, based on proposal deadlines and clearance lead times.',
    icon: <CalendarClock size={15} />,
  },
};
const SUPPORT_KEYS: SectionKey[] = ['docs', 'salary', 'timeline'];

export function StaffingScreen() {
  const { opportunity, incumbent, salaryBenchmarks, timeline } = staffingData;
  const [lcats, setLcats] = useState<LCAT[]>(staffingData.lcats);
  const [people, setPeople] = useState<IncumbentPerson[]>(incumbent.people);
  const [selected, setSelected] = useState<SectionKey>('matrix');
  const [modal, setModal] = useState<ModalState>({ kind: null });
  const [addLcatOpen, setAddLcatOpen] = useState(false);
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
    let covered = 0, gaps = 0;
    lcats.forEach(l => {
      const st = calculateLcatStatus(l.candidates, l.quantity);
      if (st === 'ready') covered++;
      if (st === 'gap') gaps++;
    });
    return { total: lcats.length, covered, gaps };
  }, [lcats]);

  const nav = useMemo(() => {
    const reviewing = lcats.filter(l => calculateLcatStatus(l.candidates, l.quantity) === 'reviewing').length;
    const docTotal = lcats.length * 4;
    const docComplete = lcats.reduce((s, l) => s + Object.values(l.documents).filter(d => d === 'complete').length, 0);
    const off = lcats.reduce((n, l) => n + (marketPosition(l, salaryBenchmarks.find(x => x.lcatId === l.id)).label !== 'At Market' ? 1 : 0), 0);
    const pact = priorityActions(lcats);
    const out: Record<SectionKey, { hint: string; dot: Tone }> = {
      matrix: { hint: `${lcats.length} LCATs · ${stats.gaps ? `${stats.gaps} gap${stats.gaps === 1 ? '' : 's'}` : reviewing ? `${reviewing} reviewing` : 'on track'}`, dot: stats.gaps ? 'danger' : reviewing ? 'warning' : 'success' },
      docs: { hint: `${docComplete}/${docTotal} docs ready`, dot: docComplete === docTotal ? 'success' : docComplete > 0 ? 'warning' : 'neutral' },
      salary: { hint: off ? `${off} off-market` : 'all at market', dot: off ? 'warning' : 'success' },
      timeline: { hint: `${pact.length} priority action${pact.length === 1 ? '' : 's'}`, dot: pact.some(a => a.priority === 'P1') ? 'danger' : pact.length ? 'warning' : 'success' },
    };
    return out;
  }, [lcats, salaryBenchmarks, stats.gaps]);

  // ── mutators ──
  const patchLcat = (lcatId: string, patch: Partial<LCAT>) => setLcats(prev => prev.map(l => l.id === lcatId ? { ...l, ...patch } : l));
  const patchCandidate = (lcatId: string, candId: string, fn: (c: LCAT['candidates'][number]) => LCAT['candidates'][number]) =>
    setLcats(prev => prev.map(l => l.id !== lcatId ? l : { ...l, candidates: l.candidates.map(c => c.id === candId ? fn(c) : c) }));

  // Candidate lifecycle transition — LCAT status + header stats are derived from
  // `lcats`, so they recompute automatically (forward and on Undo).
  const setCandidateStatus = (lcatId: string, candId: string, status: CandidateStatus) =>
    patchCandidate(lcatId, candId, c => ({ ...c, status }));

  // ── incumbent courtship + reversible move (Change 2) ──
  const setCourtship = (personId: string, status: IncumbentStatus) =>
    setPeople(prev => prev.map(p => p.id === personId ? { ...p, status } : p));
  const advanceCourtship = (personId: string) =>
    setPeople(prev => prev.map(p => {
      const next = courtshipAdvance[p.status]?.next;
      return p.id === personId && next ? { ...p, status: next } : p;
    }));
  const addIncumbentToPipeline = (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (!person || person.status !== 'interested' || !person.lcatId) return;
    const lcat = lcats.find(l => l.id === person.lcatId);
    if (!lcat) return;
    const cand = personToCandidate(person, lcat);
    setLcats(prev => prev.map(l => l.id === lcat.id ? { ...l, candidates: [...l.candidates, cand] } : l));
    setPeople(prev => prev.map(p => p.id === personId ? { ...p, status: 'in_pipeline' } : p));
    setExpanded(s => new Set(s).add(lcat.id));
    setToast(`${person.name} → ${lcat.title} pipeline`);
  };
  const returnCandidateToIncumbent = (lcatId: string, candId: string) => {
    const cand = lcats.find(l => l.id === lcatId)?.candidates.find(c => c.id === candId);
    if (!cand?.incumbentPersonId) return;
    setLcats(prev => prev.map(l => l.id === lcatId ? { ...l, candidates: l.candidates.filter(c => c.id !== candId) } : l));
    setPeople(prev => prev.map(p => p.id === cand.incumbentPersonId ? { ...p, status: 'interested' } : p));
    setToast(`${cand.name} returned to incumbent list`);
  };

  const cb: MatrixCallbacks = {
    openAi: (lcatId, candId) => setModal({ kind: 'ai', lcatId, candId }),
    openNotes: (lcatId, candId) => setModal({ kind: 'notes', lcatId, candId }),
    openDocs: (lcatId) => setModal({ kind: 'docs', lcatId }),
    openLoi: (lcatId, candId) => setModal({ kind: 'loi', lcatId, candId }),
    onEditLcat: patchLcat,
    onDeleteLcat: (lcatId) => { setLcats(prev => prev.filter(l => l.id !== lcatId)); setToast('LCAT removed'); },
    onAddLcat: () => setAddLcatOpen(true),
    onToast: setToast,
    onSetCandidateStatus: setCandidateStatus,
    onAdvanceCourtship: advanceCourtship,
    onSetCourtship: setCourtship,
    onAddIncumbentToPipeline: addIncumbentToPipeline,
    onReturnCandidate: returnCandidateToIncumbent,
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

  const scrollToLcat = (id: string) => {
    setSelected('matrix');
    setExpanded(p => new Set(p).add(id));
    window.setTimeout(() => rowRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 90);
  };

  const closeModal = () => setModal({ kind: null });

  const handleAddLcat = (fields: NewLcatFields) => {
    const id = `LCAT-${Math.floor(Math.random() * 9000 + 1000)}`;
    setLcats(prev => [...prev, {
      id, ...fields, status: 'gap', filledCount: 0,
      documents: { jobReq: 'not_started', interviewQs: 'not_started', evalCriteria: 'not_started', handoffPackage: 'not_started' },
      candidates: [],
    }]);
    setExpanded(p => new Set(p).add(id));
    setToast(`${fields.title} added`);
  };
  const activeLcat = modal.lcatId ? lcats.find(l => l.id === modal.lcatId) : undefined;
  const activeCand = activeLcat && modal.candId ? activeLcat.candidates.find(c => c.id === modal.candId) : undefined;

  const meta = SECTION_META[selected];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gh-bg-canvas)', fontFamily: F, padding: 'var(--gh-space-8) 0', boxSizing: 'border-box' }}>
      <style>{`@keyframes gh-spin{to{transform:rotate(360deg)}}.gh-spin{animation:gh-spin .8s linear infinite}@keyframes gh-pulse{0%,100%{opacity:1}50%{opacity:.25}}.gh-pulse{animation:gh-pulse 1.4s ease-in-out infinite}`}</style>

      {/* ── Context header (Strategy-style compact bar) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 var(--gh-space-12) 12px', flexShrink: 0 }}>
        <span style={{ fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>
          {stats.covered} of {stats.total} covered · {stats.gaps} {stats.gaps === 1 ? 'gap' : 'gaps'}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', background: 'var(--gh-warning-bg)', color: 'var(--gh-warning-fg)', whiteSpace: 'nowrap' }}>
          <CalendarClock size={13} /> Days to Proposal: {opportunity.daysToProposal}
        </span>
      </div>

      {/* ── Master / detail — shared shell ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        {/* Shared collapsible/resizable section index — hub + Support tools group */}
        <SectionIndex
          title="Sections"
          renderItems={(narrow) => (
            <>
              <SectionIndexItem
                title={SECTION_META.matrix.title}
                subtitle={nav.matrix.hint}
                subtitleDot={tone(nav.matrix.dot).fg}
                selected={selected === 'matrix'}
                narrow={narrow}
                emphasis
                onSelect={() => setSelected('matrix')}
              />
              {!narrow && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 10px 6px' }}>
                  <span style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-semibold)', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gh-text-tertiary)' }}>Support tools</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--gh-border)' }} />
                </div>
              )}
              {SUPPORT_KEYS.map(k => (
                <SectionIndexItem
                  key={k}
                  title={SECTION_META[k].title}
                  subtitle={nav[k].hint}
                  subtitleDot={tone(nav[k].dot).fg}
                  selected={selected === k}
                  narrow={narrow}
                  onSelect={() => setSelected(k)}
                />
              ))}
            </>
          )}
        />

        {/* detail */}
        <div key={selected} style={{ flex: 1, minWidth: 0, background: 'var(--gh-bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DetailPanel
            scrollKey={selected}
            background="var(--gh-bg-canvas)"
            progressBar={false}
            actions={selected === 'docs' ? () => (
              <Btn kind="secondary" size="sm" icon={genAll ? <Loader2 size={13} className="gh-spin" /> : <FileText size={13} />} onClick={generateAllDocs} disabled={genAll}>{genAll ? 'Generating…' : 'Generate All Docs'}</Btn>
            ) : undefined}
          >
            <div style={{ padding: '16px 20px' }}>
              <SectionHeader title={meta.title} subtitle={meta.subtitle} />
              {selected === 'matrix' && <>
                <IncumbentContextCard incumbent={incumbent} people={people} />
                <LcatMatrix lcats={lcats} people={people} expanded={expanded} onToggle={toggleExpand} cb={cb} rowRefs={rowRefs} />
              </>}
              {selected === 'docs' && <DocumentGeneration lcats={lcats} onGenerate={generateDoc} onOpenDocs={(id) => setModal({ kind: 'docs', lcatId: id })} />}
              {selected === 'salary' && <SalaryIntelligence lcats={lcats} benchmarks={salaryBenchmarks} />}
              {selected === 'timeline' && <TimelinePriority timeline={timeline} lcats={lcats} onScrollToLcat={scrollToLcat} />}
            </div>
          </DetailPanel>
        </div>
      </div>

      {/* ── Modals ── */}
      {addLcatOpen && <AddLcatModal onClose={() => setAddLcatOpen(false)} onConfirm={handleAddLcat} />}
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

import React, { useMemo, useRef, useState } from 'react';
import {
  Compass, LayoutTemplate, FilePlus2, Inbox, Sparkles, ListTodo, Eye, AlertTriangle,
  Crown, Check, Send, Lock, FileCheck2,
} from 'lucide-react';
import { dataCallsData } from '../../../../data/capture/datacalls-data';
import type {
  DataCall, DataCallItem, AIRecommendation, QueuedAction, ActivityEvent, Partner, Priority, ItemStatus, DataCallStatus, AIScope,
} from '../../../../types/dataCalls';
import { F, ORANGE, ORANGE_TINT, orangeTone, TODAY, fmtDate, isOverdue, awaitingReview, itemAccepted, partnerAgg, callProgress, phaseLabel, phaseSub } from './helpers';
import { Stat } from '../staffing/ui';
import { SectionIndex, SectionIndexItem } from '../SectionIndex';
import { Pill, Btn, PhaseBadge, StatusPill, QualityBadge } from './ui';
import { CollectionStrategy } from './CollectionStrategy';
import { Templates } from './Templates';
import { CreateDataCall, type NewCallPayload } from './CreateDataCall';
import { ActiveDataCalls } from './ActiveDataCalls';
import { Recommendations } from './Recommendations';
import { ActionsLog } from './ActionsLog';
import { AskAiPanel, type AskAiData } from './AskAiPanel';
import { DetailPanel } from '../DetailPanel';

type DCSectionKey = 'strategy' | 'templates' | 'create' | 'active' | 'recs' | 'actions';
const DC_SECTIONS: { key: DCSectionKey; n: number; title: string; subtitle: string; icon: React.ReactNode }[] = [
  { key: 'strategy',  n: 1, title: 'Collection Strategy',                subtitle: 'Set-and-forget — phased, priority-ordered',           icon: <Compass size={15} /> },
  { key: 'templates', n: 2, title: 'Phase-Aware Templates',             subtitle: 'Pre-TA evaluation · Post-TA proposal collection',     icon: <LayoutTemplate size={15} /> },
  { key: 'create',    n: 3, title: 'Create New Data Call',              subtitle: 'Template → recipient → trust-tier check → send',      icon: <FilePlus2 size={15} /> },
  { key: 'active',    n: 4, title: 'Active Data Calls',                 subtitle: 'By teammate or by data call — review, remind',        icon: <Inbox size={15} /> },
  { key: 'recs',      n: 5, title: 'AI Recommendations',                subtitle: 'Gaps, clarifications, comparisons, risks, quality',  icon: <Sparkles size={15} /> },
  { key: 'actions',   n: 6, title: 'Actions & Escalation + Log',        subtitle: 'Queued actions · auto-logged events',                 icon: <ListTodo size={15} /> },
];

const PRI_NEXT: Record<Priority, Priority> = { LOW: 'MEDIUM', MEDIUM: 'HIGH', HIGH: 'CRITICAL', CRITICAL: 'CRITICAL' };
const recomputeStatus = (items: DataCallItem[]): DataCallStatus => {
  const acc = items.filter(itemAccepted).length;
  if (acc === items.length && items.length) return 'COMPLETE';
  if (acc > 0 || items.some(i => i.status !== 'PENDING')) return 'PARTIAL';
  return 'SENT';
};

export function DataCallsScreen() {
  const { opportunity, strategy, templates, partners, contextAnswers } = dataCallsData;
  const [mode, setMode] = useState<'prime' | 'sub'>('prime');
  const [dataCalls, setDataCalls] = useState<DataCall[]>(() => dataCallsData.dataCalls.map(c => ({ ...c, items: c.items.map(i => ({ ...i })) })));
  const [recs, setRecs] = useState<AIRecommendation[]>(() => dataCallsData.recommendations.map(r => ({ ...r })));
  const [actions, setActions] = useState<QueuedAction[]>(() => dataCallsData.queuedActions.map(a => ({ ...a })));
  const [log, setLog] = useState<ActivityEvent[]>(() => dataCallsData.activityLog.map(e => ({ ...e })));
  const [provenance, setProvenance] = useState(strategy.provenance);
  const [viewMode, setViewMode] = useState<'teammate' | 'call'>('teammate');
  const [expP, setExpP] = useState<Set<string>>(() => new Set([partners[0].id]));
  const [expC, setExpC] = useState<Set<string>>(new Set());
  const [expI] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<DCSectionKey>('strategy');
  const [preset, setPreset] = useState<{ tpl: string | null; partner: string | null }>({ tpl: null, partner: null });
  const [analyzing, setAnalyzing] = useState(false);
  const [askAi, setAskAi] = useState<AskAiData | null>(null);
  const [toast, setToastState] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const evtSeq = useRef(0);
  const setToast = (m: string) => { setToastState(m); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToastState(null), 2800); };
  const addLog = (type: string, description: string) =>
    setLog(prev => [{ id: `evt-live-${++evtSeq.current}`, timestamp: `${TODAY}T15:0${Math.min(evtSeq.current, 9)}:00Z`, type, description }, ...prev]);

  const partnerName = (id: string) => partners.find(p => p.id === id)?.name ?? id;

  // ── dashboard stats ──
  const stats = useMemo(() => {
    const items = dataCalls.flatMap(c => c.items);
    const overdue = dataCalls.reduce((n, c) => n + (isOverdue(c.dueDate) && c.status !== 'COMPLETE' ? c.items.filter(i => !itemAccepted(i)).length : 0), 0);
    const scored = items.map(i => i.qualityScore).filter((s): s is number => s !== undefined);
    return {
      active: dataCalls.filter(c => c.status !== 'COMPLETE').length,
      awaiting: items.filter(awaitingReview).length,
      overdue,
      partners: new Set(dataCalls.map(c => c.partnerId)).size,
      avgQuality: scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : 0,
    };
  }, [dataCalls]);

  // ── item state machine ──
  const patchItem = (itemId: string, patch: Partial<DataCallItem>) =>
    setDataCalls(prev => prev.map(c => {
      if (!c.items.some(i => i.id === itemId)) return c;
      const items = c.items.map(i => (i.id === itemId ? { ...i, ...patch } : i));
      return { ...c, items, status: recomputeStatus(items) };
    }));
  const onAccept = (i: DataCallItem) => { const score = i.qualityScore ?? 88; patchItem(i.id, { status: 'ACCEPTED', qualityScore: score, qualityNotes: i.qualityNotes ?? 'Reviewed — meets proposal standards.' }); addLog('accept', `Accepted ${i.id} at quality score ${score}.`); setToast(`${i.id} accepted (${score})`); };
  const onReject = (i: DataCallItem) => { patchItem(i.id, { status: 'PENDING', qualityScore: undefined, qualityNotes: undefined }); addLog('quality_review', `Rejected ${i.id} — returned to pending.`); setToast(`${i.id} rejected → pending`); };
  const onRevise = (i: DataCallItem) => { patchItem(i.id, { status: 'REVISION_REQUESTED' }); addLog('quality_review', `Requested revision on ${i.id}.`); setToast(`Revision requested for ${i.id}`); };

  const onChangeDue = (c: DataCall) => {
    const pulled = new Date(new Date(c.dueDate).getTime() - 3 * 86_400_000).toISOString().slice(0, 10);
    setDataCalls(prev => prev.map(x => (x.id === c.id ? { ...x, dueDate: pulled } : x)));
    addLog('reminder', `Pulled ${c.id} due date in to ${fmtDate(pulled)}.`); setToast(`${c.id} due date → ${fmtDate(pulled)}`);
  };
  const onChangePriority = (c: DataCall) => {
    const next = PRI_NEXT[c.priority];
    setDataCalls(prev => prev.map(x => (x.id === c.id ? { ...x, priority: next } : x)));
    setToast(`${c.id} priority → ${next}`);
  };

  // ── create ──
  const onUseTemplate = (tplId: string) => { setPreset({ tpl: tplId, partner: null }); setCreateOpen(true); setSelectedSection('create'); setToast('Template loaded into the create form'); };
  const onNewDataCall = (partnerId: string) => { setPreset({ tpl: null, partner: partnerId }); setCreateOpen(true); setSelectedSection('create'); setToast(`New data call for ${partnerName(partnerId)}`); };
  const onSend = (p: NewCallPayload) => {
    const n = dataCalls.length + 1;
    const id = `DC-${String(n).padStart(3, '0')}`;
    const call: DataCall = {
      id, partnerId: p.partnerId, title: p.title, phase: p.phase, type: p.type, status: 'SENT', priority: p.priority,
      templateId: p.templateId, instructions: p.instructions, sentDate: TODAY, dueDate: p.dueDate, deliveryMethod: 'GovHub secure upload', notes: '',
      items: p.items.map((it, i) => ({ id: `${id}-${String.fromCharCode(65 + i)}`, dataCallId: id, description: it.description, format: it.format, required: it.required, status: 'PENDING' as ItemStatus })),
    };
    setDataCalls(prev => [...prev, call]);
    addLog('send', `Sent ${call.title} (${id}) to ${partnerName(p.partnerId)}.`);
    if (p.overridden) addLog('override', `Trust-tier override: sent Post-TA template "${call.title}" to NDA-only ${partnerName(p.partnerId)}.`);
    setExpP(s => new Set(s).add(p.partnerId));
    setCreateOpen(false); setPreset({ tpl: null, partner: null });
  };
  const onLogOverride = (_partner: string, _template: string) => { /* logged in onSend via overridden flag */ };

  // ── recommendations ──
  const onReAnalyze = () => { setAnalyzing(true); window.setTimeout(() => setAnalyzing(false), 1100); };
  const onRecAction = (r: AIRecommendation) => {
    setActions(prev => [{ id: `qa-rec-${r.id}`, label: r.suggestedAction + ` — ${r.title}`, priority: r.severity as Priority, source: 'ai_rec', sourceRecId: r.id, done: false }, ...prev]);
    setRecs(prev => prev.map(x => (x.id === r.id ? { ...x, status: 'acted_on' } : x)));
    addLog('submission', `Created action from AI recommendation: ${r.suggestedAction}.`);
    setToast(`Action queued from AI rec · ${r.suggestedAction}`);
  };
  const onDismissRec = (r: AIRecommendation) => { setRecs(prev => prev.map(x => (x.id === r.id ? { ...x, status: 'dismissed' } : x))); setToast('Recommendation dismissed'); };
  const onToggleDone = (id: string) => setActions(prev => prev.map(a => (a.id === id ? { ...a, done: !a.done } : a)));

  // ── Ask AI (contextual, 4 scopes) ──
  const openAskAi = (scope: AIScope, scopeId: string, label: string) => {
    const seeded = contextAnswers.find(a => a.scope === scope && a.scopeId === scopeId);
    if (seeded) { setAskAi({ scope, scopeId, contextLabel: label, prompt: seeded.prompt, answer: seeded.answer }); return; }
    let prompt = 'What should I know here?', answer = 'No additional context for this scope in the demo.';
    if (scope === 'partner') {
      const p = partners.find(x => x.id === scopeId); const calls = dataCalls.filter(c => c.partnerId === scopeId); const agg = partnerAgg(calls);
      prompt = `How is ${p?.name} tracking?`;
      answer = `${p?.name} (${p?.trustTier}) has ${calls.length} active data call${calls.length === 1 ? '' : 's'}: ${agg.accepted}/${agg.total} items accepted, ${agg.awaiting} awaiting review${agg.overdue ? `, and ${agg.overdue} overdue` : ''}. Focus on the awaiting-review items before the next gate.`;
    } else if (scope === 'call') {
      const c = dataCalls.find(x => x.id === scopeId); const prog = c ? callProgress(c) : { accepted: 0, total: 0 };
      prompt = `What is the status of ${scopeId}?`;
      answer = `${scopeId} (${c?.title}) is ${c?.status} — ${prog.accepted}/${prog.total} items accepted, due ${c ? fmtDate(c.dueDate) : ''}. ${c?.notes || 'Send a reminder if items are still pending close to the gate.'}`;
    } else if (scope === 'item') {
      const it = dataCalls.flatMap(c => c.items).find(i => i.id === scopeId);
      prompt = `Assess ${scopeId} — is it proposal-ready?`;
      answer = it ? `${scopeId} is ${it.status.replace(/_/g, ' ').toLowerCase()}${it.qualityScore !== undefined ? ` at quality ${it.qualityScore}` : ' (unscored)'}. ${it.qualityNotes || 'Awaiting partner submission — no content to assess yet.'}` : answer;
    }
    setAskAi({ scope, scopeId, contextLabel: label, prompt, answer });
  };

  const activeHandlers = { onAccept, onReject, onRevise, onChangeDue, onChangePriority, onNewDataCall, onAskAi: openAskAi, onToast: setToast };
  const viewState = {
    viewMode, setViewMode, expP, expC, expI,
    toggleP: (id: string) => setExpP(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }),
    toggleC: (id: string) => setExpC(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }),
    toggleI: (_id: string) => {},
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--gh-bg-canvas)', fontFamily: F, padding: 'var(--gh-space-8) 0', boxSizing: 'border-box' }}>
      <style>{`@keyframes gh-spin{to{transform:rotate(360deg)}}.gh-spin{animation:gh-spin .8s linear infinite}`}</style>

      {/* ── Context header ── */}
      <div style={{ marginBottom: 12, flexShrink: 0, padding: '0 var(--gh-space-12)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>{opportunity.title}</h1>
        <div style={{ marginTop: 6, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>
          {opportunity.agency} / {opportunity.subAgency} • {opportunity.value} • {opportunity.role} • NAICS {opportunity.naics}
        </div>
      </div>

      {/* ── Dashboard stats ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8, flexShrink: 0, padding: '0 var(--gh-space-12)' }}>
        <Stat label="Items Awaiting Review" value={stats.awaiting} tone={stats.awaiting ? 'warning' : 'neutral'} icon={<Eye size={15} />} />
        <Stat label="Overdue Items" value={stats.overdue} tone={stats.overdue ? 'danger' : 'success'} icon={<AlertTriangle size={15} />} />
      </div>

      {/* ── Mode toggle ── */}
      <div style={{ margin: '24px 0', flexShrink: 0, padding: '0 var(--gh-space-12)' }}>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      {/* ── Pre-TA / Post-TA phase indicator (prime mode) ── */}
      {mode === 'prime' && <PhaseIndicator dataCalls={dataCalls} />}

      {mode === 'sub' ? (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--gh-space-12)' }}>
          <SubMode dataCalls={dataCalls} partnerName={partnerName} onToast={setToast} />
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          {/* Shared collapsible/resizable section index */}
          <SectionIndex
            title="Data Calls"
            renderItems={(narrow) => DC_SECTIONS.map(s => (
              <SectionIndexItem
                key={s.key}
                title={s.title}
                subtitle={s.subtitle}
                selected={selectedSection === s.key}
                narrow={narrow}
                onSelect={() => setSelectedSection(s.key)}
              />
            ))}
          />

          {/* Detail — the selected section */}
          <div key={selectedSection} style={{ flex: 1, minWidth: 0, background: 'var(--gh-bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <DetailPanel
              scrollKey={selectedSection}
              background="var(--gh-bg-canvas)"
              progressBar={false}
              leftActions={selectedSection === 'strategy' ? (<Pill tone={provenance === 'User Confirmed' ? 'success' : 'accent'} soft><Sparkles size={11} /> {provenance}</Pill>) : undefined}
            >
              <div style={{ padding: '16px 20px' }}>
                {selectedSection === 'strategy' && <CollectionStrategy strategy={{ ...strategy, provenance }} onConfirm={() => { setProvenance('User Confirmed'); setToast('Strategy confirmed'); }} />}
                {selectedSection === 'templates' && <Templates templates={templates} onUseTemplate={t => onUseTemplate(t.id)} />}
                {selectedSection === 'create' && <CreateDataCall templates={templates} partners={partners} presetTemplateId={preset.tpl} presetPartnerId={preset.partner} onSend={onSend} onLogOverride={onLogOverride} onToast={setToast} />}
                {selectedSection === 'active' && <ActiveDataCalls dataCalls={dataCalls} partners={partners} h={activeHandlers} v={viewState} />}
                {selectedSection === 'recs' && <Recommendations recommendations={recs} analyzing={analyzing} onReAnalyze={onReAnalyze} onAction={onRecAction} onDismiss={onDismissRec} partnerName={partnerName} />}
                {selectedSection === 'actions' && <ActionsLog queuedActions={actions} recommendations={recs} onToggleDone={onToggleDone} activityLog={log} />}
              </div>
            </DetailPanel>
          </div>
        </div>
      )}

      <AskAiPanel data={askAi} onClose={() => setAskAi(null)} />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 95, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border-strong)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-sm)', fontFamily: F }}>
          <Check size={15} style={{ color: ORANGE }} /> {toast}
        </div>
      )}
    </div>
  );
}

function PhaseIndicator({ dataCalls }: { dataCalls: DataCall[] }) {
  const preActive = dataCalls.filter(c => c.phase === 'pre-ta' && c.status !== 'COMPLETE').length;
  const postActive = dataCalls.filter(c => c.phase === 'post-ta' && c.status !== 'COMPLETE').length;
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexShrink: 0, padding: '0 var(--gh-space-12)', alignSelf: 'flex-start' }}>
      <PhasePanel phase="pre-ta" activeCount={preActive}
        rule="Evaluate partner fit with lightweight requests. Never request detailed rates, named personnel, or proprietary approach before a Teaming Agreement is signed." />
      <PhasePanel phase="post-ta" activeCount={postActive}
        rule="Collect RFP-formatted material — full resumes, complete rate cards — each mapped to Section L/M." />
    </div>
  );
}

function PhasePanel({ phase, activeCount, rule }: { phase: 'pre-ta' | 'post-ta'; activeCount: number; rule: string }) {
  const isPre = phase === 'pre-ta';
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)',
      background: isPre ? 'var(--gh-warning-bg)' : 'var(--gh-info-bg)',
      border: `1px solid ${isPre ? 'var(--gh-warning-border)' : 'var(--gh-info-border)'}`,
      display: 'flex', flexDirection: 'column', gap: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
        {isPre
          ? <Lock size={12} style={{ color: 'var(--gh-warning-fg)', flexShrink: 0 }} />
          : <FileCheck2 size={12} style={{ color: 'var(--gh-info-fg)', flexShrink: 0 }} />}
        <span style={{ fontSize: 11, fontWeight: 700, color: isPre ? 'var(--gh-warning-fg)' : 'var(--gh-info-fg)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{phaseLabel(phase)}</span>
        <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{phaseSub(phase)}</span>
        {activeCount > 0 && <Pill tone={isPre ? 'warning' : 'info'} soft>{activeCount} active</Pill>}
      </div>
      <p style={{ margin: 0, fontSize: 11, color: 'var(--gh-text-secondary)', lineHeight: 1.5, minWidth: 0 }}>{rule}</p>
    </div>
  );
}

function ModeToggle({ mode, setMode }: { mode: 'prime' | 'sub'; setMode: (m: 'prime' | 'sub') => void }) {
  return (
    <div style={{ display: 'inline-flex', gap: 3, padding: 3, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)' }}>
      {([['prime', 'Prime', <Crown size={14} />], ['sub', 'Sub', <Inbox size={14} />]] as const).map(([k, lab, ic]) => {
        const on = mode === k;
        return (
          <button key={k} onClick={() => setMode(k)} title={k === 'prime' ? 'You send data calls' : 'You receive data calls'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 15px', borderRadius: 'var(--gh-radius-md)', background: on ? ORANGE : 'transparent', color: on ? 'var(--gh-bg-canvas)' : 'var(--gh-text-secondary)', border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 'var(--gh-font-size-sm)', fontWeight: on ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-medium)' }}>{ic}{lab} mode</button>
        );
      })}
    </div>
  );
}

// ── Sub mode (lighter "incoming requests" variant) ──
function SubMode({ dataCalls, partnerName, onToast }: { dataCalls: DataCall[]; partnerName: (id: string) => string; onToast: (m: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', borderRadius: 'var(--gh-radius-lg)', background: orangeTone.bg, border: `1px solid ${orangeTone.bd}`, whiteSpace: 'nowrap' }}>
        <Inbox size={16} style={{ color: ORANGE_TINT }} />
        <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)' }}>
          <strong style={{ color: 'var(--gh-text)' }}>Sub mode</strong> — incoming requests from the prime. Respond by submitting each requested item.
        </span>
      </div>
      {dataCalls.map(c => {
        const prog = callProgress(c);
        return (
          <div key={c.id} style={{ borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)', padding: '13px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-bold)', color: ORANGE }}>{c.id}</span>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{c.title}</span>
              <PhaseBadge phase={c.phase} />
              <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>from {partnerName(c.partnerId)} · due {fmtDate(c.dueDate)}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{prog.accepted}/{prog.total} accepted</span>
            </div>
            <p style={{ margin: '4px 0 10px', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)', lineHeight: 1.5 }}>{c.instructions}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {c.items.map(it => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
                  <span style={{ flex: 1, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)' }}>{it.description}</span>
                  {it.qualityScore !== undefined && <QualityBadge score={it.qualityScore} />}
                  <StatusPill status={it.status} />
                  {(it.status === 'PENDING' || it.status === 'REVISION_REQUESTED') && <Btn size="sm" kind="orange" icon={<Send size={12} />} onClick={() => onToast(`Submitted ${it.id} to the prime`)}>Submit</Btn>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

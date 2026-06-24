import React, { useState } from 'react';
import {
  ChevronRight, ChevronDown, Brain, MessageCircle, Eye, Trash2, Plus, Lock,
  FileSignature, Users, Building2, UserPlus, Undo2, Ban, Phone, Check, CheckCircle2, ArrowRight, RotateCcw, Pencil,
} from 'lucide-react';
import type { LCAT, Candidate, IncumbentPerson, IncumbentStatus, CandidateStatus } from '../../../../types/staffing';
import {
  F, calculateLcatStatus, committedCount, lcatStatusTone, classTone,
  tone, money, cap, titleCase, flightTone, incStatusTone, courtshipAdvance,
  candidateNext, candidatePrev,
} from './helpers';
import { Pill, Dot, IconBtn, Btn } from './ui';

const sourceTone = (s: string) => s === 'internal' ? 'success' : s === 'incumbent' ? 'warning' : s === 'referral' ? 'info' : s === 'partner' ? 'accent' : 'neutral';
const clearTone = (s: string) => s === 'active' ? 'success' : s === 'upgrade_needed' ? 'warning' : 'info';
const certsShort = (c: string[]) => c.length === 0 ? '—' : c.length === 1 ? c[0] : `${c[0]} +${c.length - 1}`;

function EditCell({ value, onChange, width, type = 'text' }: { value: string | number; onChange: (v: string) => void; width?: number; type?: string }) {
  return (
    <input value={value} type={type} onChange={e => onChange(e.target.value)} style={{
      width: width ?? '100%', boxSizing: 'border-box', background: 'var(--gh-bg-surface-muted)',
      border: '1px solid var(--gh-accent)', borderRadius: 'var(--gh-radius-sm)', padding: '3px 6px',
      color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-xs)', fontFamily: F,
    }} />
  );
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '8px 10px', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
  color: 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--gh-border)', background: 'var(--gh-bg-surface)',
};
const TD: React.CSSProperties = { padding: '9px 10px', fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-secondary)', verticalAlign: 'middle', borderBottom: '1px solid var(--gh-border)' };

export interface MatrixCallbacks {
  openAi: (lcatId: string, candId: string) => void;
  openNotes: (lcatId: string, candId: string) => void;
  openDocs: (lcatId: string) => void;
  openLoi: (lcatId: string, candId: string) => void;
  onEditLcat: (lcatId: string, patch: Partial<LCAT>) => void;
  onDeleteLcat: (lcatId: string) => void;
  onAddLcat: () => void;
  onToast: (m: string) => void;
  // Candidate lifecycle transition (Nominate / Commit / Undo)
  onSetCandidateStatus: (lcatId: string, candId: string, status: CandidateStatus) => void;
  // Incumbent courtship + reversible move (Change 2)
  onAdvanceCourtship: (personId: string) => void;
  onSetCourtship: (personId: string, status: IncumbentStatus) => void;
  onAddIncumbentToPipeline: (personId: string) => void;
  onReturnCandidate: (lcatId: string, candId: string) => void;
}

export function LcatMatrix({ lcats, people, expanded, onToggle, cb, rowRefs }: {
  lcats: LCAT[]; people: IncumbentPerson[]; expanded: Set<string>; onToggle: (id: string) => void;
  cb: MatrixCallbacks; rowRefs: React.MutableRefObject<Record<string, HTMLTableRowElement | null>>;
}) {
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const toggleRowEdit = (id: string) => setEditingRows(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const COLSPAN = 11;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F, minWidth: 940 }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: 28 }} />
            <th style={TH}>Labor Category</th>
            <th style={TH}>Qty</th>
            <th style={TH}>Education</th>
            <th style={TH}>Yrs</th>
            <th style={TH}>Certs</th>
            <th style={TH}>Clearance</th>
            <th style={TH}>Salary Range</th>
            <th style={TH}>Docs</th>
            <th style={TH}>Status</th>
            <th style={TH} />
          </tr>
        </thead>
        <tbody>
          {lcats.map(lcat => {
            const st = calculateLcatStatus(lcat.candidates, lcat.quantity);
            const isOpen = expanded.has(lcat.id);
            const isEditing = editingRows.has(lcat.id);
            const filled = committedCount(lcat.candidates);
            const docVals = Object.values(lcat.documents);
            const docComplete = docVals.filter(d => d === 'complete').length;
            const stt = tone(lcatStatusTone[st]);
            const cls = tone(classTone(lcat.classification));
            return (
              <React.Fragment key={lcat.id}>
                <tr ref={el => { rowRefs.current[lcat.id] = el; }} style={{ background: isOpen ? 'var(--gh-bg-surface)' : 'transparent' }}>
                  <td style={{ ...TD, cursor: 'pointer', textAlign: 'center' }} onClick={() => onToggle(lcat.id)}>
                    {isOpen ? <ChevronDown size={15} style={{ color: 'var(--gh-text-tertiary)' }} /> : <ChevronRight size={15} style={{ color: 'var(--gh-text-tertiary)' }} />}
                  </td>
                  <td style={TD}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{lcat.title}</span>
                      {lcat.isKeyPersonnel && <Pill tone="accent" style={{ fontSize: 9 }}>KEY PERSONNEL</Pill>}
                      <span style={{ padding: '1px 7px', borderRadius: 'var(--gh-radius-full)', fontSize: 9, fontWeight: 'var(--gh-font-weight-semibold)', textTransform: 'capitalize', background: cls.bg, color: cls.fg }}>{lcat.classification}</span>
                    </div>
                  </td>
                  <td style={TD}>{isEditing
                    ? <EditCell width={42} type="number" value={lcat.quantity} onChange={v => cb.onEditLcat(lcat.id, { quantity: Math.max(0, parseInt(v) || 0) })} />
                    : <span style={{ color: 'var(--gh-text)' }}>{lcat.quantity}</span>}</td>
                  <td style={{ ...TD, maxWidth: 150 }}>{isEditing
                    ? <EditCell value={lcat.requirements.education} onChange={v => cb.onEditLcat(lcat.id, { requirements: { ...lcat.requirements, education: v } })} />
                    : lcat.requirements.education}</td>
                  <td style={TD}>{isEditing
                    ? <EditCell width={42} type="number" value={lcat.requirements.yearsExp} onChange={v => cb.onEditLcat(lcat.id, { requirements: { ...lcat.requirements, yearsExp: parseInt(v) || 0 } })} />
                    : `${lcat.requirements.yearsExp}+`}</td>
                  <td style={{ ...TD, maxWidth: 130 }} title={lcat.requirements.certifications.join(', ')}>{isEditing
                    ? <EditCell value={lcat.requirements.certifications.join(', ')} onChange={v => cb.onEditLcat(lcat.id, { requirements: { ...lcat.requirements, certifications: v.split(',').map(s => s.trim()).filter(Boolean) } })} />
                    : certsShort(lcat.requirements.certifications)}</td>
                  <td style={TD}>{isEditing
                    ? <EditCell width={90} value={lcat.requirements.clearance} onChange={v => cb.onEditLcat(lcat.id, { requirements: { ...lcat.requirements, clearance: v } })} />
                    : lcat.requirements.clearance}</td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{isEditing
                    ? <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                        <EditCell width={56} type="number" value={lcat.salaryRange.min} onChange={v => cb.onEditLcat(lcat.id, { salaryRange: { ...lcat.salaryRange, min: parseInt(v) || 0 } })} />–
                        <EditCell width={56} type="number" value={lcat.salaryRange.max} onChange={v => cb.onEditLcat(lcat.id, { salaryRange: { ...lcat.salaryRange, max: parseInt(v) || 0 } })} />
                      </span>
                    : <span style={{ color: 'var(--gh-text)' }}>{money(lcat.salaryRange.min)} – {money(lcat.salaryRange.max)}</span>}</td>
                  <td style={TD}>
                    <button onClick={() => cb.openDocs(lcat.id)} title="Documents" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: F }}>
                      <span style={{ display: 'inline-flex', gap: 3 }}>
                        {docVals.map((d, i) => <Dot key={i} tone={d === 'complete' ? 'success' : d === 'draft' ? 'warning' : 'neutral'} size={7} />)}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{docComplete}/4</span>
                    </button>
                  </td>
                  <td style={TD}><span style={{ padding: '2px 9px', borderRadius: 'var(--gh-radius-full)', fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', background: stt.bg, color: stt.fg }}>{cap(st)}</span></td>
                  <td style={{ ...TD, textAlign: 'center' }}>
                    {isEditing ? (
                      <span style={{ display: 'inline-flex', gap: 4 }}>
                        <IconBtn icon={<Check size={14} />} tone="success" title="Done editing" onClick={() => toggleRowEdit(lcat.id)} />
                        <IconBtn icon={<Trash2 size={14} />} tone="danger" title="Delete LCAT" onClick={() => cb.onDeleteLcat(lcat.id)} />
                      </span>
                    ) : (
                      <IconBtn icon={<Pencil size={14} />} title="Edit LCAT" onClick={() => toggleRowEdit(lcat.id)} />
                    )}
                  </td>
                </tr>

                {isOpen && (
                  <tr>
                    <td colSpan={COLSPAN} style={{ padding: 0, borderBottom: '1px solid var(--gh-border)', background: 'var(--gh-bg-canvas)' }}>
                      <CandidateTable lcat={lcat} cb={cb} />
                      <IncumbentSubList
                        lcat={lcat}
                        people={people.filter(p => p.lcatId === lcat.id && p.status !== 'in_pipeline')}
                        cb={cb}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div style={{ padding: '12px 4px 0' }}>
        <Btn kind="secondary" icon={<Plus size={14} />} onClick={cb.onAddLcat}>Add LCAT</Btn>
      </div>
    </div>
  );
}

const CTH: React.CSSProperties = { textAlign: 'left', padding: '6px 10px', fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap', background: 'var(--gh-bg-surface)' };
const CTD: React.CSSProperties = { padding: '8px 10px', fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-secondary)', verticalAlign: 'middle', borderTop: '1px solid var(--gh-border)' };

function CandidateTable({ lcat, cb }: { lcat: LCAT; cb: MatrixCallbacks }) {
  const cands = [...lcat.candidates].sort((a, b) => b.matchScore - a.matchScore);
  if (cands.length === 0) {
    return <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gh-danger-fg)', fontSize: 'var(--gh-font-size-sm)' }}>
      <Users size={15} /> No candidates sourced yet — open gap.
    </div>;
  }
  return (
    <div style={{ padding: '6px 18px 12px 38px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F }}>
        <thead><tr>
          <th style={{ ...CTH, width: 26 }}>#</th><th style={CTH}>Candidate</th><th style={CTH}>Education</th>
          <th style={CTH}>Yrs</th><th style={CTH}>Certs</th><th style={CTH}>Clearance</th><th style={CTH}>Salary Exp</th>
          <th style={CTH}>LOI</th><th style={{ ...CTH, textAlign: 'right' }}>Actions</th>
        </tr></thead>
        <tbody>
          {cands.map(c => <CandidateRow key={c.id} c={c} lcat={lcat} cb={cb} />)}
        </tbody>
      </table>
    </div>
  );
}

function CandidateRow({ c, lcat, cb }: { c: Candidate; lcat: LCAT; cb: MatrixCallbacks }) {
  const yrsOk = c.yearsExp >= lcat.requirements.yearsExp;
  const overBudget = c.salaryExpectation > lcat.salaryRange.max;
  return (
    <tr>
      <td style={CTD}><span style={{ width: 18, height: 18, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)', fontSize: 10, fontWeight: 'var(--gh-font-weight-bold)', display: 'inline-grid', placeItems: 'center' }}>{c.rank}</span></td>
      <td style={CTD}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-medium)', color: 'var(--gh-text)' }}>{c.name}</span>
          <Pill tone={sourceTone(c.source)} style={{ fontSize: 9 }}>{c.source === 'incumbent' && <Lock size={8} />}{c.source}</Pill>
        </div>
      </td>
      <td style={{ ...CTD, maxWidth: 140 }}>{c.education}</td>
      <td style={CTD}><span style={{ color: yrsOk ? 'var(--gh-success-fg)' : 'var(--gh-danger-fg)', fontWeight: 'var(--gh-font-weight-semibold)' }}>{c.yearsExp}</span></td>
      <td style={{ ...CTD, maxWidth: 120 }} title={c.certifications.join(', ')}>{certsShort(c.certifications)}</td>
      <td style={CTD}><Pill tone={clearTone(c.clearanceStatus)} soft style={{ fontSize: 9 }}>{titleCase(c.clearanceStatus)}</Pill></td>
      <td style={CTD}><span style={{ color: overBudget ? 'var(--gh-danger-fg)' : 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-medium)' }}>{money(c.salaryExpectation)}{overBudget && ' ▲'}</span></td>
      <td style={CTD}>
        <button onClick={() => cb.openLoi(lcat.id, c.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: c.loiStatus === 'signed' ? 'var(--gh-success-fg)' : 'var(--gh-accent-tint)', fontSize: 11, fontFamily: F, textDecoration: 'underline', textUnderlineOffset: 2 }}>
          <FileSignature size={11} />{c.loiStatus === 'not_sent' ? 'LOI' : titleCase(c.loiStatus)}
        </button>
      </td>
      <td style={{ ...CTD, textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <LifecycleAction c={c} lcatId={lcat.id} cb={cb} />
          <span style={{ width: 1, height: 18, background: 'var(--gh-border)', flexShrink: 0 }} />
          {c.incumbentPersonId && (
            <IconBtn icon={<Undo2 size={14} />} tone="warning" title="Return to incumbent list" onClick={() => cb.onReturnCandidate(lcat.id, c.id)} />
          )}
          <IconBtn icon={<Brain size={14} />} tone="accent" title="AI Analysis" onClick={() => cb.openAi(lcat.id, c.id)} />
          <IconBtn icon={<MessageCircle size={14} />} title="Notes" count={c.notes.length} onClick={() => cb.openNotes(lcat.id, c.id)} />
          <IconBtn icon={<Eye size={14} />} title="View resume" onClick={() => cb.onToast(`Opening ${c.name}'s resume…`)} />
        </div>
      </td>
    </tr>
  );
}

// State-dependent primary action — the SOLE carrier of candidate status now that
// the Status column is gone. Label + color together encode state unambiguously:
//   sourcing  → slate "Nominate" button   (advance to submitted)
//   submitted → blue/cyan "Commit" button (advance to committed) + Undo
//   committed → emerald "Committed" chip — reads as secured, not disabled — + Undo
// Each forward step reverses by exactly one via the subtle Undo link.
function LifecycleAction({ c, lcatId, cb }: { c: Candidate; lcatId: string; cb: MatrixCallbacks }) {
  const next = candidateNext[c.status];
  const prev = candidatePrev[c.status];
  const undo = prev && (
    <button
      onClick={() => cb.onSetCandidateStatus(lcatId, c.id, prev)}
      title={`Step back to ${prev}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', fontSize: 11, fontFamily: F, padding: '2px 4px', whiteSpace: 'nowrap' }}
    >
      <RotateCcw size={11} /> Undo
    </button>
  );
  // sourcing → slate (neutral); submitted → blue/cyan (info). Filled so the action
  // still reads as the row's primary affordance while its tint carries the state.
  const btnStyle: React.CSSProperties = c.status === 'sourcing'
    ? { background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text)', border: '1px solid var(--gh-border-strong)' }
    : { background: 'var(--gh-info-bg)', color: 'var(--gh-info-fg)', border: '1px solid var(--gh-info-border)' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {c.status === 'committed' ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-success-bg)', color: 'var(--gh-success-fg)', border: '1px solid var(--gh-success-border)', fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap' }}>
          <CheckCircle2 size={14} /> Committed
        </span>
      ) : next ? (
        <Btn
          size="sm"
          style={btnStyle}
          icon={next.to === 'committed' ? <Check size={13} /> : <ArrowRight size={13} />}
          onClick={() => cb.onSetCandidateStatus(lcatId, c.id, next.to)}
        >
          {next.label}
        </Btn>
      ) : null}
      {undo}
    </span>
  );
}

// ─── Incumbent sourcing — scoped to THIS LCAT (Change 2) ──────────────────────
// Recruiting always happens in the context of one position, so the destination is
// implicit. A subtle accented band lists incumbents matching this LCAT; each runs
// a courtship state machine and can be moved into the pipeline once 'interested'.
function IncumbentSubList({ lcat, people, cb }: { lcat: LCAT; people: IncumbentPerson[]; cb: MatrixCallbacks }) {
  const [open, setOpen] = useState(false);
  if (people.length === 0) return null;
  const n = people.length;
  return (
    <div style={{ padding: '0 18px 14px 38px' }}>
      <div style={{ borderRadius: 'var(--gh-radius-lg)', border: '1px solid var(--gh-warning-border)', borderLeft: '3px solid var(--gh-warning-fg)', background: 'var(--gh-warning-subtle)', overflow: 'hidden' }}>
        <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: F, textAlign: 'left' }}>
          {open ? <ChevronDown size={14} style={{ color: 'var(--gh-warning-fg)', flexShrink: 0 }} /> : <ChevronRight size={14} style={{ color: 'var(--gh-warning-fg)', flexShrink: 0 }} />}
          <Building2 size={14} style={{ color: 'var(--gh-warning-fg)', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>
            {n} incumbent{n === 1 ? '' : 's'} from Peraton match this position
          </span>
          <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>potential recruits</span>
        </button>
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--gh-warning-border)' }}>
            {people.map((p, i) => <IncumbentRow key={p.id} p={p} lcat={lcat} cb={cb} first={i === 0} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function IncumbentRow({ p, lcat, cb, first }: { p: IncumbentPerson; lcat: LCAT; cb: MatrixCallbacks; first: boolean }) {
  const interested = p.status === 'interested';
  const notPursued = p.status === 'not_pursued';
  const advance = courtshipAdvance[p.status];
  const st = tone(incStatusTone(p.status));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px 9px 14px', borderTop: first ? 'none' : '1px solid var(--gh-warning-border)', flexWrap: 'wrap' }}>
      <Dot tone={flightTone(p.flightRisk)} />
      <div style={{ minWidth: 130 }}>
        <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-medium)', color: 'var(--gh-text)' }}>{p.name}</div>
        <div style={{ fontSize: 10, color: 'var(--gh-text-tertiary)' }}>{p.flightRisk.toUpperCase()} flight risk</div>
      </div>
      <span style={{ flex: 1, minWidth: 150, fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)' }}>{p.role}</span>
      <span style={{ fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)', whiteSpace: 'nowrap' }}>{p.tenure}</span>
      <span style={{ padding: '2px 9px', borderRadius: 'var(--gh-radius-full)', fontSize: 9, fontWeight: 'var(--gh-font-weight-semibold)', background: st.bg, color: st.fg, whiteSpace: 'nowrap' }}>{titleCase(p.status)}</span>

      {/* courtship controls */}
      <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        {advance && (
          <Btn size="sm" icon={<Phone size={12} />} onClick={() => cb.onAdvanceCourtship(p.id)}>{advance.label}</Btn>
        )}
        {notPursued ? (
          <Btn size="sm" kind="ghost" onClick={() => cb.onSetCourtship(p.id, 'not_contacted')}>Reconsider</Btn>
        ) : (
          <IconBtn icon={<Ban size={13} />} tone="danger" title="Not pursued" onClick={() => cb.onSetCourtship(p.id, 'not_pursued')} />
        )}
        <Btn
          size="sm"
          kind="primary"
          icon={<UserPlus size={12} />}
          disabled={!interested}
          title={interested ? `Add ${p.name} to the ${lcat.title} pipeline` : 'Available once the candidate is interested'}
          onClick={() => cb.onAddIncumbentToPipeline(p.id)}
        >
          Add to Pipeline
        </Btn>
      </div>
    </div>
  );
}

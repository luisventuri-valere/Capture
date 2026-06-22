import React from 'react';
import {
  ChevronRight, ChevronDown, Brain, MessageCircle, Eye, Trash2, Plus, Lock,
  FileSignature, Users,
} from 'lucide-react';
import type { LCAT, Candidate } from '../../../../types/staffing';
import {
  F, calculateLcatStatus, committedCount, lcatStatusTone, classTone, candStatusTone,
  tone, money, cap, titleCase,
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
  color: '#f8fafc', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap',
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
}

export function LcatMatrix({ lcats, editMode, expanded, onToggle, cb, rowRefs }: {
  lcats: LCAT[]; editMode: boolean; expanded: Set<string>; onToggle: (id: string) => void;
  cb: MatrixCallbacks; rowRefs: React.MutableRefObject<Record<string, HTMLTableRowElement | null>>;
}) {
  const COLSPAN = editMode ? 11 : 10;
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
            {editMode && <th style={TH} />}
          </tr>
        </thead>
        <tbody>
          {lcats.map(lcat => {
            const st = calculateLcatStatus(lcat.candidates, lcat.quantity);
            const isOpen = expanded.has(lcat.id);
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
                  <td style={TD}>{editMode
                    ? <EditCell width={42} type="number" value={lcat.quantity} onChange={v => cb.onEditLcat(lcat.id, { quantity: Math.max(0, parseInt(v) || 0) })} />
                    : <span style={{ color: 'var(--gh-text)' }}>{lcat.quantity}</span>}</td>
                  <td style={{ ...TD, maxWidth: 150 }}>{editMode
                    ? <EditCell value={lcat.requirements.education} onChange={v => cb.onEditLcat(lcat.id, { requirements: { ...lcat.requirements, education: v } })} />
                    : lcat.requirements.education}</td>
                  <td style={TD}>{editMode
                    ? <EditCell width={42} type="number" value={lcat.requirements.yearsExp} onChange={v => cb.onEditLcat(lcat.id, { requirements: { ...lcat.requirements, yearsExp: parseInt(v) || 0 } })} />
                    : `${lcat.requirements.yearsExp}+`}</td>
                  <td style={{ ...TD, maxWidth: 130 }} title={lcat.requirements.certifications.join(', ')}>{editMode
                    ? <EditCell value={lcat.requirements.certifications.join(', ')} onChange={v => cb.onEditLcat(lcat.id, { requirements: { ...lcat.requirements, certifications: v.split(',').map(s => s.trim()).filter(Boolean) } })} />
                    : certsShort(lcat.requirements.certifications)}</td>
                  <td style={TD}>{editMode
                    ? <EditCell width={90} value={lcat.requirements.clearance} onChange={v => cb.onEditLcat(lcat.id, { requirements: { ...lcat.requirements, clearance: v } })} />
                    : lcat.requirements.clearance}</td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{editMode
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
                  {editMode && <td style={TD}><IconBtn icon={<Trash2 size={14} />} tone="danger" title="Delete LCAT" onClick={() => cb.onDeleteLcat(lcat.id)} /></td>}
                </tr>

                {isOpen && (
                  <tr>
                    <td colSpan={COLSPAN} style={{ padding: 0, borderBottom: '1px solid var(--gh-border)', background: 'var(--gh-bg-canvas)' }}>
                      <CandidateTable lcat={lcat} cb={cb} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {editMode && (
        <div style={{ padding: '12px 4px 0' }}>
          <Btn kind="secondary" icon={<Plus size={14} />} onClick={cb.onAddLcat}>Add LCAT</Btn>
        </div>
      )}
    </div>
  );
}

const CTH: React.CSSProperties = { textAlign: 'left', padding: '6px 10px', fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#f8fafc', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap', background: 'var(--gh-bg-surface)' };
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
          <th style={CTH}>LOI</th><th style={CTH}>Status</th><th style={{ ...CTH, textAlign: 'right' }}>Actions</th>
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
  const cst = tone(candStatusTone(c.status));
  const clr = tone(clearTone(c.clearanceStatus));
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
      <td style={CTD}><span style={{ padding: '2px 8px', borderRadius: 'var(--gh-radius-full)', fontSize: 9, fontWeight: 'var(--gh-font-weight-semibold)', background: cst.bg, color: cst.fg, textTransform: 'capitalize' }}>{c.status}</span></td>
      <td style={{ ...CTD, textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <IconBtn icon={<Brain size={14} />} tone="accent" title="AI Analysis" onClick={() => cb.openAi(lcat.id, c.id)} />
          <IconBtn icon={<MessageCircle size={14} />} title="Notes" count={c.notes.length} onClick={() => cb.openNotes(lcat.id, c.id)} />
          <IconBtn icon={<Eye size={14} />} title="View resume" onClick={() => cb.onToast(`Opening ${c.name}'s resume…`)} />
        </div>
      </td>
    </tr>
  );
}

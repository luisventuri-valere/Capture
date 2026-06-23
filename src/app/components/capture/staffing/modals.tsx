import React, { useState } from 'react';
import {
  Brain, MessageCircle, CheckCircle2, AlertTriangle, Pencil, FileText, Printer,
  CalendarPlus, RefreshCw, Loader2, FileSignature, Check, Sparkles, Lock,
} from 'lucide-react';
import type { Candidate, LCAT, DocStatus } from '../../../../types/staffing';
import { F, recommendationFromScore, recTone, tone, moneyFull, titleCase, docTone, candStatusTone } from './helpers';
import { Modal, ModalHeader, ModalBody, ModalFooter, Btn, Pill, Dot, FieldLabel } from './ui';

// ─── Section 2 · AI Analysis ─────────────────────────────────────────────────
export function AiAnalysisModal({ candidate, totalInLcat, onClose, onToast }: {
  candidate: Candidate; totalInLcat: number; onClose: () => void; onToast: (m: string) => void;
}) {
  const [regen, setRegen] = useState(false);
  const a = candidate.aiAnalysis;
  const rec = recommendationFromScore(candidate.matchScore);
  const rc = tone(recTone(rec));
  const doRegen = () => { setRegen(true); setTimeout(() => setRegen(false), 950); };

  return (
    <Modal open onClose={onClose} width={780}>
      <ModalHeader
        tone="accent"
        icon={<Brain size={18} />}
        title={`AI Analysis: ${candidate.name}`}
        subtitle={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Sparkles size={11} /> Staffing Intelligence Agent · SFI-001</span>}
        onClose={onClose}
      />
      <div style={{ position: 'relative' }}>
        {regen && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'var(--gh-backdrop-canvas)', display: 'grid', placeItems: 'center', backdropFilter: 'blur(1px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gh-accent-tint)', fontSize: 'var(--gh-font-size-sm)', fontFamily: F }}>
              <Loader2 size={16} className="gh-spin" /> Regenerating analysis…
            </div>
          </div>
        )}
        <ModalBody>
          {/* score + recommendation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)', lineHeight: 1, letterSpacing: '-0.03em' }}>{candidate.matchScore}</span>
              <span style={{ fontSize: 'var(--gh-font-size-lg)', color: 'var(--gh-text-tertiary)' }}>% match</span>
            </div>
            <span style={{ padding: '5px 12px', borderRadius: 'var(--gh-radius-full)', background: rc.bg, color: rc.fg, fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-bold)', letterSpacing: '0.04em' }}>{rec}</span>
            <span style={{ marginLeft: 'auto', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>Rank #{candidate.rank} of {totalInLcat}</span>
          </div>

          {/* recommendation block */}
          <div style={{ background: 'var(--gh-info-bg)', border: '1px solid var(--gh-info-border)', borderRadius: 'var(--gh-radius-lg)', padding: '14px 16px' }}>
            <FieldLabel>AI Recommendation</FieldLabel>
            <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.6 }}>{a.recommendationDetail}</p>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--gh-info-border)' }}>
              <FieldLabel>Competitive Advantage</FieldLabel>
              <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.6 }}>{a.competitiveAdvantage}</p>
            </div>
          </div>

          {/* strengths / concerns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <FieldLabel>Strengths</FieldLabel>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {a.strengths.map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--gh-success-fg)', flexShrink: 0, marginTop: 1 }} />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <FieldLabel>Concerns</FieldLabel>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {a.concerns.map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>
                    <AlertTriangle size={15} style={{ color: 'var(--gh-warning-fg)', flexShrink: 0, marginTop: 1 }} />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* interview questions */}
          <div>
            <FieldLabel>Recommended Interview Questions</FieldLabel>
            <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, counterReset: 'q' }}>
              {a.interviewQuestions.map((q, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text)', fontSize: 11, fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center' }}>{i + 1}</span>
                  {q}
                </li>
              ))}
            </ol>
          </div>

          {/* resume clarifications */}
          <div>
            <FieldLabel>Resume Clarifications Needed</FieldLabel>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {a.resumeClarifications.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>
                  <Pencil size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0, marginTop: 2 }} />{s}
                </li>
              ))}
            </ul>
          </div>
        </ModalBody>
      </div>
      <ModalFooter>
        <Btn kind="ghost" icon={<FileText size={13} />} onClick={() => onToast('Opening resume…')}>View Resume</Btn>
        <Btn kind="ghost" icon={<Printer size={13} />} onClick={() => onToast('Sent analysis to print')}>Print Analysis</Btn>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Btn kind="secondary" icon={<CalendarPlus size={13} />} onClick={() => onToast(`${candidate.name} added to interview list`)}>Add to Interview</Btn>
          <Btn kind="primary" icon={regen ? <Loader2 size={13} className="gh-spin" /> : <RefreshCw size={13} />} onClick={doRegen} disabled={regen}>Regenerate Analysis</Btn>
        </div>
      </ModalFooter>
    </Modal>
  );
}

// ─── Section 3 · Notes ───────────────────────────────────────────────────────
export function NotesModal({ candidate, onClose, onPost }: {
  candidate: Candidate; onClose: () => void; onPost: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const post = () => { if (!text.trim()) return; onPost(text.trim()); setText(''); };
  return (
    <Modal open onClose={onClose} width={560} human>
      <ModalHeader tone="neutral" icon={<MessageCircle size={18} />} title={`Review Notes: ${candidate.name}`} subtitle="Team review thread" onClose={onClose} />
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 360, overflowY: 'auto' }}>
        {candidate.notes.length === 0 && (
          <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)', textAlign: 'center', padding: '16px 0' }}>No notes yet. Start the thread below.</div>
        )}
        {candidate.notes.map(n => (
          <div key={n.id} style={{ background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)', padding: '11px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ width: 24, height: 24, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-secondary)', fontSize: 10, fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center' }}>
                {n.userName.split(' ').map(p => p[0]).join('').slice(0, 2)}
              </span>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{n.userName}</span>
              <Pill tone="neutral" style={{ fontSize: 10 }}>{n.userRole}</Pill>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{n.date}</span>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.55 }}>{n.text}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--gh-border)' }}>
        <textarea
          value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Add a note for the team…"
          style={{ width: '100%', resize: 'vertical', boxSizing: 'border-box', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', padding: '9px 11px', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-sm)', fontFamily: F }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 9 }}>
          <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>Notes visible to BD and Recruiting teams</span>
          <Btn kind="primary" size="sm" style={{ marginLeft: 'auto' }} onClick={post}>Post Note</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Section 4 · Documents ───────────────────────────────────────────────────
const DOC_DEFS: { key: keyof LCAT['documents']; label: string }[] = [
  { key: 'jobReq', label: 'Job Requisition' },
  { key: 'interviewQs', label: 'Interview Questions' },
  { key: 'evalCriteria', label: 'Evaluation Criteria' },
  { key: 'handoffPackage', label: 'Handoff Package' },
];
export function DocumentsModal({ lcat, onClose, onGenerate }: {
  lcat: LCAT; onClose: () => void; onGenerate: (key: keyof LCAT['documents']) => void;
}) {
  return (
    <Modal open onClose={onClose} width={560}>
      <ModalHeader tone="accent" icon={<FileText size={18} />} title={`Documents: ${lcat.title}`} subtitle="Recruiting & evaluation package" onClose={onClose} />
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DOC_DEFS.map(d => {
          const st: DocStatus = lcat.documents[d.key];
          const dt = tone(docTone(st));
          return (
            <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)', padding: '12px 14px' }}>
              <Dot tone={docTone(st)} />
              <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-medium)', color: 'var(--gh-text)', flex: 1 }}>{d.label}</span>
              <span style={{ fontSize: 'var(--gh-font-size-xs)', color: dt.fg, fontWeight: 'var(--gh-font-weight-semibold)' }}>{titleCase(st)}</span>
              {st !== 'complete'
                ? <Btn kind="secondary" size="sm" onClick={() => onGenerate(d.key)}>Generate</Btn>
                : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--gh-success-fg)', fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)' }}><Check size={13} /> Ready</span>}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

// ─── Section 4 · Letter of Intent ────────────────────────────────────────────
export function LoiModal({ candidate, onClose, onGenerate }: {
  candidate: Candidate; onClose: () => void; onGenerate: () => void;
}) {
  const signed = candidate.loiStatus === 'signed';
  const sent = candidate.loiStatus === 'sent';
  const st = tone(signed ? 'success' : sent ? 'warning' : 'neutral');
  return (
    <Modal open onClose={onClose} width={520}>
      <ModalHeader tone="accent" icon={<FileSignature size={18} />} title={`Letter of Intent: ${candidate.name}`} onClose={onClose} />
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FieldLabel>Status</FieldLabel>
          <span style={{ padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', background: st.bg, color: st.fg, fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)' }}>{titleCase(candidate.loiStatus)}</span>
        </div>
        <div style={{ background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)', padding: '14px 16px', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>Letter of Intent for <strong style={{ color: 'var(--gh-text)' }}>{candidate.name}</strong> — {candidate.education}, targeting the proposed labor category at an expected base of <strong style={{ color: 'var(--gh-text)' }}>{moneyFull(candidate.salaryExpectation)}</strong>. Confirms availability and commitment contingent on award.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {signed
            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--gh-success-fg)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)' }}><Check size={14} /> LOI signed</span>
            : <Btn kind="primary" icon={<FileSignature size={13} />} onClick={onGenerate}>{sent ? 'Mark as Signed' : 'Generate LOI'}</Btn>}
        </div>
      </div>
    </Modal>
  );
}

// re-export Lock for matrix use (single import site)
export { Lock };

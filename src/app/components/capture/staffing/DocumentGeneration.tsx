import React from 'react';
import { Check, FileText } from 'lucide-react';
import type { LCAT, DocStatus } from '../../../../types/staffing';
import { F, docTone, tone, titleCase } from './helpers';
import { Dot, Btn } from './ui';

const DOCS: { key: keyof LCAT['documents']; label: string }[] = [
  { key: 'jobReq', label: 'Job Requisition' },
  { key: 'interviewQs', label: 'Interview Questions' },
  { key: 'evalCriteria', label: 'Eval Criteria' },
  { key: 'handoffPackage', label: 'Handoff Package' },
];

const TH: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#f8fafc', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--gh-border)', background: 'var(--gh-bg-surface)' };
const TD: React.CSSProperties = { padding: '9px 10px', fontSize: 'var(--gh-font-size-xs)', verticalAlign: 'middle', borderBottom: '1px solid var(--gh-border)' };

export function DocumentGeneration({ lcats, onGenerate, onOpenDocs }: {
  lcats: LCAT[]; onGenerate: (lcatId: string, key: keyof LCAT['documents']) => void; onOpenDocs: (lcatId: string) => void;
}) {
  const allTotal = lcats.length * DOCS.length;
  const allComplete = lcats.reduce((s, l) => s + Object.values(l.documents).filter(d => d === 'complete').length, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
        <FileText size={16} style={{ color: 'var(--gh-accent-tint)' }} />
        <span style={{ flex: 1, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)' }}>
          Recruiting & evaluation package readiness across all labor categories.
        </span>
        <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-bold)', color: allComplete === allTotal ? 'var(--gh-success-fg)' : 'var(--gh-text)' }}>{allComplete}/{allTotal} ready</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F, minWidth: 720 }}>
          <thead>
            <tr><th style={TH}>Labor Category</th>{DOCS.map(d => <th key={d.key} style={TH}>{d.label}</th>)}<th style={TH}>Ready</th></tr>
          </thead>
          <tbody>
            {lcats.map(l => {
              const complete = Object.values(l.documents).filter(d => d === 'complete').length;
              return (
                <tr key={l.id}>
                  <td style={{ ...TD, color: 'var(--gh-text)' }}>
                    <button onClick={() => onOpenDocs(l.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', fontFamily: F, padding: 0, textAlign: 'left' }}>{l.title}</button>
                  </td>
                  {DOCS.map(d => {
                    const st: DocStatus = l.documents[d.key];
                    const dt = tone(docTone(st));
                    return (
                      <td key={d.key} style={TD}>
                        {st === 'complete'
                          ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--gh-success-fg)', fontWeight: 'var(--gh-font-weight-semibold)' }}><Check size={12} /> Ready</span>
                          : <button onClick={() => onGenerate(l.id, d.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: `1px solid ${dt.bd}`, color: dt.fg, borderRadius: 'var(--gh-radius-sm)', padding: '3px 8px', fontSize: 10, fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer', fontFamily: F }}>
                              <Dot tone={docTone(st)} size={6} /> {titleCase(st)} · Generate
                            </button>}
                      </td>
                    );
                  })}
                  <td style={{ ...TD, color: complete === DOCS.length ? 'var(--gh-success-fg)' : 'var(--gh-text-tertiary)', fontWeight: 'var(--gh-font-weight-semibold)' }}>{complete}/{DOCS.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

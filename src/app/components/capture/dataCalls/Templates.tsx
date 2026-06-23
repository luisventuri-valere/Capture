import React, { useState } from 'react';
import { Lock, FileCheck2, ChevronDown, ChevronRight, Clock, Sparkles, ArrowRightCircle, AlertCircle } from 'lucide-react';
import type { DataCallTemplate, Phase } from '../../../../types/dataCalls';
import { F, ORANGE } from './helpers';
import { Pill, Btn, FormatChip } from './ui';

const GUIDANCE: Record<Phase, string> = {
  'pre-ta': 'Keep requests lightweight. Never request detailed rate cards or named personnel before a TA is in place.',
  'post-ta': 'These templates reference Section L requirements. Each item maps to a Section M evaluation criterion.',
};

export function Templates({ templates, onUseTemplate }: { templates: DataCallTemplate[]; onUseTemplate: (t: DataCallTemplate) => void }) {
  const [phase, setPhase] = useState<Phase>('pre-ta');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const list = templates.filter(t => t.phase === phase);
  const amber = phase === 'pre-ta';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: F }}>
      {/* phase toggle */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <PhaseToggleBtn active={phase === 'pre-ta'} phase="pre-ta" onClick={() => setPhase('pre-ta')} title="Pre-TA: Evaluate Fit" sub="Under NDA · Before commitment" count={templates.filter(t => t.phase === 'pre-ta').length} />
        <PhaseToggleBtn active={phase === 'post-ta'} phase="post-ta" onClick={() => setPhase('post-ta')} title="Post-TA: Collect for Proposal" sub="Under TA · RFP-formatted" count={templates.filter(t => t.phase === 'post-ta').length} />
      </div>

      {/* guidance callout */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 13px', borderRadius: 'var(--gh-radius-md)', background: amber ? 'var(--gh-warning-bg)' : 'var(--gh-info-bg)', border: `1px solid ${amber ? 'var(--gh-warning-border)' : 'var(--gh-info-border)'}` }}>
        <AlertCircle size={15} style={{ color: amber ? 'var(--gh-warning-fg)' : 'var(--gh-info-fg)', flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>{GUIDANCE[phase]}</span>
      </div>

      {/* template cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {list.map(t => {
          const open = expanded.has(t.id);
          return (
            <div key={t.id} style={{ borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 3, lineHeight: 1.45 }}>{t.purpose}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 'var(--gh-font-weight-bold)', color: ORANGE }}><Sparkles size={11} /> {t.matchScore}</span>
                    <span style={{ fontSize: 10, color: 'var(--gh-text-tertiary)' }}>match</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <Pill tone="neutral" soft><Clock size={10} /> {t.suggestedDurationDays}d</Pill>
                  <Pill tone={t.trustTierMinimum === 'TA' ? 'accent' : 'neutral'}>min: {t.trustTierMinimum}</Pill>
                  {t.rfpReferences?.map(r => <Pill key={r} tone="info" soft>{r}</Pill>)}
                </div>
                {open && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2, paddingTop: 8, borderTop: '1px solid var(--gh-border)' }}>
                    {t.items.map(it => (
                      <div key={it.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: '50%', background: it.required ? ORANGE : 'var(--gh-text-tertiary)', marginTop: 6 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)' }}>{it.description}</span>
                            <FormatChip format={it.format} />
                            {it.required && <span style={{ fontSize: 9, color: ORANGE, fontWeight: 'var(--gh-font-weight-bold)' }}>REQ</span>}
                          </div>
                          {it.guidanceNotes && <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 2, fontStyle: 'italic' }}>{it.guidanceNotes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderTop: '1px solid var(--gh-border)', background: 'var(--gh-bg-surface-muted)' }}>
                <button onClick={() => setExpanded(p => { const n = new Set(p); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n; })} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', fontFamily: F, fontSize: 11 }}>
                  {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}{t.items.length} items
                </button>
                <div style={{ marginLeft: 'auto' }}><Btn size="sm" kind="orange" icon={<ArrowRightCircle size={13} />} onClick={() => onUseTemplate(t)}>Use Template</Btn></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhaseToggleBtn({ active, phase, onClick, title, sub, count }: { active: boolean; phase: Phase; onClick: () => void; title: string; sub: string; count: number }) {
  const amber = phase === 'pre-ta';
  const accent = amber ? 'var(--gh-warning-fg)' : 'var(--gh-info-fg)';
  const bg = amber ? 'var(--gh-warning-bg)' : 'var(--gh-info-bg)';
  const bd = amber ? 'var(--gh-warning-border)' : 'var(--gh-info-border)';
  return (
    <button onClick={onClick} style={{
      flex: '1 1 280px', minWidth: 260, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11,
      padding: '13px 16px', borderRadius: 'var(--gh-radius-lg)', fontFamily: F,
      background: active ? bg : 'var(--gh-bg-surface)', border: `1.5px solid ${active ? bd : 'var(--gh-border)'}`,
      opacity: active ? 1 : 0.7,
    }}>
      <span style={{ width: 36, height: 36, borderRadius: 'var(--gh-radius-md)', background: active ? 'transparent' : bg, color: accent, display: 'grid', placeItems: 'center', flexShrink: 0, border: active ? `1px solid ${bd}` : 'none' }}>
        {amber ? <Lock size={18} /> : <FileCheck2 size={18} />}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-bold)', color: active ? 'var(--gh-text)' : 'var(--gh-text-secondary)' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 2 }}>{sub}</div>
      </div>
      <span style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-bold)', color: accent }}>{count}</span>
    </button>
  );
}

import React, { useState } from 'react';
import { Lock, FileCheck2, ArrowRight, ChevronDown } from 'lucide-react';
import type { CollectionStrategy as TStrategy } from '../../../../types/dataCalls';
import { F, fmtDate, dueLabel, phaseLabel } from './helpers';
import { Pill, PhaseBadge } from './ui';

export function CollectionStrategy({ strategy, onConfirm }: { strategy: TStrategy; onConfirm: () => void }) {
  const confirmed = strategy.provenance === 'User Confirmed';
  const [summaryOpen, setSummaryOpen] = useState(false);
  const shortSummary = strategy.summary.split('. ')[0] + '.';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: F }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.6 }}>
          {summaryOpen ? strategy.summary : shortSummary}
        </p>
        <button
          onClick={() => setSummaryOpen(o => !o)}
          style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 4, fontSize: 11, color: 'var(--gh-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, padding: 0 }}
        >
          <ChevronDown size={12} style={{ transform: summaryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          {summaryOpen ? 'Collapse' : 'Show full rationale'}
        </button>
      </div>

      {/* priorities */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Collection Priorities</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {strategy.priorities.map((p, i) => {
            const due = dueLabel(p.deadline);
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)', fontSize: 11, fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center' }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{p.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11, color: 'var(--gh-text-tertiary)' }}>
                    <ArrowRight size={11} /> blocks {p.blocks}
                  </div>
                </div>
                <PhaseBadge phase={p.phase} />
                <Pill tone={due.tone} soft>{fmtDate(p.deadline)}</Pill>
              </div>
            );
          })}
        </div>
      </div>

      {/* phase guidance */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Callout phase="pre-ta" text={strategy.phaseGuidance.preTa} />
        <Callout phase="post-ta" text={strategy.phaseGuidance.postTa} />
      </div>

      {!confirmed && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          margin: '0 -24px -24px',
          padding: '16px 24px',
          background: '#0f172a',
        }}>
          <button
            onClick={onConfirm}
            style={{
              background: 'var(--gh-accent)', color: '#fff',
              padding: '12px 20px', borderRadius: 'var(--gh-radius-lg)',
              minHeight: 44, border: 'none', cursor: 'pointer',
              fontFamily: F, fontSize: 16, fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Confirm Strategy
          </button>
        </div>
      )}
    </div>
  );
}

function Callout({ phase, text }: { phase: 'pre-ta' | 'post-ta'; text: string }) {
  const amber = phase === 'pre-ta';
  return (
    <div style={{
      flex: '1 1 280px', minWidth: 260, padding: '12px 14px', borderRadius: 'var(--gh-radius-lg)',
      background: amber ? 'var(--gh-warning-bg)' : 'var(--gh-info-bg)', border: `1px solid ${amber ? 'var(--gh-warning-border)' : 'var(--gh-info-border)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <span style={{ color: amber ? 'var(--gh-warning-fg)' : 'var(--gh-info-fg)', display: 'flex' }}>{amber ? <Lock size={13} /> : <FileCheck2 size={13} />}</span>
        <span style={{ fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-bold)', color: amber ? 'var(--gh-warning-fg)' : 'var(--gh-info-fg)' }}>{phaseLabel(phase)} guidance</span>
      </div>
      <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.55 }}>{text}</p>
    </div>
  );
}

import React, { useState } from 'react';
import { Lock, FileCheck2, ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import type { CollectionStrategy as TStrategy } from '../../../../types/dataCalls';
import { F, fmtDate, dueLabel, phaseLabel, phaseSub } from './helpers';
import { Pill, PhaseBadge } from './ui';

export function CollectionStrategy({ strategy, preActive, postActive, onConfirm }: {
  strategy: TStrategy;
  preActive: number;
  postActive: number;
  onConfirm: () => void;
}) {
  const confirmed = strategy.provenance === 'User Confirmed';
  const [summaryOpen, setSummaryOpen] = useState(false);
  const shortSummary = strategy.summary.split('. ')[0] + '.';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: F }}>

      {/* summary */}
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

      {/* ── Phase guidance — active counts + rules, one merged block ── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {([
          { phase: 'pre-ta' as const, activeCount: preActive, text: strategy.phaseGuidance.preTa },
          { phase: 'post-ta' as const, activeCount: postActive, text: strategy.phaseGuidance.postTa },
        ]).map(({ phase, activeCount, text }) => {
          const isPre = phase === 'pre-ta';
          return (
            <div key={phase} style={{
              flex: '1 1 280px', minWidth: 260, padding: '12px 14px', borderRadius: 'var(--gh-radius-lg)',
              background: isPre ? 'var(--gh-warning-subtle)' : 'var(--gh-info-bg)',
              border: `1px solid ${isPre ? 'var(--gh-warning-border)' : 'var(--gh-info-border)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ color: isPre ? 'var(--gh-warning-fg)' : 'var(--gh-info-fg)', display: 'flex', flexShrink: 0 }}>
                  {isPre ? <Lock size={13} /> : <FileCheck2 size={13} />}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: isPre ? 'var(--gh-warning-fg)' : 'var(--gh-info-fg)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                  {phaseLabel(phase)}
                </span>
                <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', whiteSpace: 'nowrap' }}>· {phaseSub(phase)}</span>
                {activeCount > 0 && (
                  <span style={{ marginLeft: 'auto', flexShrink: 0 }}>
                    <Pill tone={isPre ? 'warning' : 'info'} soft>{activeCount} active</Pill>
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.55 }}>{text}</p>
            </div>
          );
        })}
      </div>

      {/* ── Collection Priorities ── */}
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

      {!confirmed && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          margin: '0 -24px -24px',
          padding: '16px 24px',
          background: '#0f172a',
        }}>
          <Pill tone="accent" soft>
            <Sparkles size={11} style={{ marginRight: 4 }} />{strategy.provenance}
          </Pill>
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

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, Lock, FileCheck2 } from 'lucide-react';
import { F, tone, type Tone, orangeTone, ORANGE, phaseLabel, phaseSub, itemStatusTone, isRevision, itemStatusLabel, qualityBand, severityTone } from './helpers';
import type { Phase, ItemStatus, Severity } from '../../../../types/dataCalls';

// low-level styled chip
export function Chip({ colors, children, soft, style }: { colors: { bg: string; fg: string; bd: string }; children: React.ReactNode; soft?: boolean; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 'var(--gh-radius-full)',
      fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap',
      background: soft ? 'transparent' : colors.bg, color: colors.fg, border: `1px solid ${soft ? colors.bd : 'transparent'}`,
      fontFamily: F, lineHeight: 1.5, ...style,
    }}>{children}</span>
  );
}

export const Pill = ({ tone: t = 'neutral', soft, children, style }: { tone?: Tone; soft?: boolean; children: React.ReactNode; style?: React.CSSProperties }) =>
  <Chip colors={tone(t)} soft={soft} style={style}>{children}</Chip>;

// ─── Phase badge (amber Pre-TA · blue Post-TA) ───────────────────────────────
export function PhaseBadge({ phase, withSub }: { phase: Phase; withSub?: boolean }) {
  const c = phase === 'pre-ta' ? tone('warning') : tone('info');
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Chip colors={c}>{phase === 'pre-ta' ? <Lock size={11} /> : <FileCheck2 size={11} />}{phaseLabel(phase)}</Chip>
      {withSub && <span style={{ fontSize: 11, color: 'var(--gh-text-disabled)' }}>{phaseSub(phase)}</span>}
    </span>
  );
}

export function StatusPill({ status }: { status: ItemStatus }) {
  const c = isRevision(status) ? orangeTone : tone(itemStatusTone(status));
  return <Chip colors={c}>{itemStatusLabel(status)}</Chip>;
}

export function QualityBadge({ score }: { score?: number }) {
  const q = qualityBand(score);
  return <Chip colors={tone(q.tone)} style={{ fontVariantNumeric: 'tabular-nums' }}>{score === undefined ? '—' : score} · {q.label}</Chip>;
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Chip colors={tone(severityTone(severity))} style={{ letterSpacing: '0.04em' }}>{severity}</Chip>;
}

// ─── Buttons ─────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, kind = 'secondary', size = 'md', icon, disabled, title, style }: {
  children?: React.ReactNode; onClick?: () => void; kind?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'orange';
  size?: 'sm' | 'md'; icon?: React.ReactNode; disabled?: boolean; title?: string; style?: React.CSSProperties;
}) {
  const pad = size === 'sm' ? '5px 10px' : '7px 13px';
  const fs = size === 'sm' ? 'var(--gh-font-size-xs)' : 'var(--gh-font-size-sm)';
  let bg = 'transparent', fg = 'var(--gh-text-secondary)', bd = '1px solid var(--gh-border)';
  if (kind === 'primary') { bg = 'var(--gh-accent)'; fg = 'var(--gh-accent-fg)'; bd = '1px solid var(--gh-accent)'; }
  else if (kind === 'orange') { bg = ORANGE; fg = '#fff'; bd = `1px solid ${ORANGE}`; }
  else if (kind === 'ghost') { bd = '1px solid transparent'; fg = 'var(--gh-text-tertiary)'; }
  else if (kind === 'danger') { fg = 'var(--gh-danger-fg)'; bd = '1px solid var(--gh-danger-border)'; }
  return (
    <button onClick={onClick} disabled={disabled} title={title} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: pad, borderRadius: 'var(--gh-radius-md)',
      background: bg, color: fg, border: bd, fontSize: fs, fontWeight: 'var(--gh-font-weight-medium)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontFamily: F, whiteSpace: 'nowrap', ...style,
    }}>{icon}{children}</button>
  );
}

// ─── Ask-AI button (orange, contextual) ──────────────────────────────────────
export function AskAi({ onClick, size = 'sm' }: { onClick: () => void; size?: 'sm' | 'md' }) {
  return (
    <button onClick={onClick} title="Ask AI about this (context-aware)" style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: size === 'sm' ? '5px 10px' : '7px 12px',
      borderRadius: 'var(--gh-radius-md)', background: orangeTone.bg, color: ORANGE, border: `1px solid ${orangeTone.bd}`,
      fontSize: size === 'sm' ? 'var(--gh-font-size-xs)' : 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)',
      cursor: 'pointer', fontFamily: F, whiteSpace: 'nowrap',
    }}><Sparkles size={13} /> Ask AI</button>
  );
}

// ─── Contextual action bar (4 levels) ────────────────────────────────────────
export type BarAction = { label: string; icon?: React.ReactNode; onClick: () => void; kind?: 'secondary' | 'danger' | 'primary' | 'orange'; disabled?: boolean };
export function ActionBar({ actions, onAskAi, label }: { actions: BarAction[]; onAskAi: () => void; label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', padding: '8px 10px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)' }}>
      {label && <span style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 }}>{label}</span>}
      {actions.map((a, i) => <Btn key={i} size="sm" kind={a.kind ?? 'secondary'} icon={a.icon} onClick={a.onClick} disabled={a.disabled}>{a.label}</Btn>)}
      <div style={{ marginLeft: 'auto' }}><AskAi onClick={onAskAi} /></div>
    </div>
  );
}

// ─── Collapsible section shell (orange-accented header) ───────────────────────
export function SectionShell({ n, title, subtitle, icon, right, collapsible, defaultOpen = true, open: openProp, onToggle, children }: {
  n: number; title: string; subtitle?: string; icon?: React.ReactNode; right?: React.ReactNode;
  collapsible?: boolean; defaultOpen?: boolean; open?: boolean; onToggle?: () => void; children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp! : internalOpen;
  const toggle = () => { if (controlled) onToggle?.(); else setInternalOpen(o => !o); };
  const showBody = !collapsible || open;
  return (
    <section style={{ background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', overflow: 'hidden', fontFamily: F }}>
      <div
        onClick={collapsible ? toggle : undefined}
        style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 18px', borderBottom: showBody ? '1px solid var(--gh-border)' : 'none', background: 'var(--gh-bg-surface-muted)', cursor: collapsible ? 'pointer' : 'default' }}
      >
        <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 'var(--gh-radius-md)', background: orangeTone.bg, color: ORANGE, fontSize: 12, fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center', border: `1px solid ${orangeTone.bd}` }}>{n}</span>
        {icon && <span style={{ color: ORANGE, display: 'flex', flexShrink: 0 }}>{icon}</span>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{title}</h3>
          {subtitle && <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 2 }}>{subtitle}</div>}
        </div>
        {right}
        {collapsible && <span style={{ color: 'var(--gh-text-tertiary)', display: 'flex' }}>{open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>}
      </div>
      {showBody && <div style={{ padding: '16px 18px' }}>{children}</div>}
    </section>
  );
}

// ─── Generic expander row ────────────────────────────────────────────────────
export function Expander({ open, onToggle, children }: { open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 'var(--gh-radius-md)', background: 'transparent', border: '1px solid var(--gh-border)', color: 'var(--gh-text-tertiary)', cursor: 'pointer', flexShrink: 0 }}>
      {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      {children}
    </button>
  );
}

// format chip
export const FormatChip = ({ format }: { format: string }) =>
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 6px', borderRadius: 'var(--gh-radius-sm)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', fontSize: 10, color: 'var(--gh-text-tertiary)', fontFamily: F, fontWeight: 'var(--gh-font-weight-medium)' }}>{format}</span>;

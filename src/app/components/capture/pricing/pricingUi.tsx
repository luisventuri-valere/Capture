import React from 'react';
import { F, tone, type Tone } from '../staffing/helpers';

// ─── Segmented control (scenario selector / sub-tabs) ────────────────────────
export function Segmented<T extends string>({ options, value, onChange, size = 'md' }: {
  options: { value: T; label: string; hint?: string }[];
  value: T; onChange: (v: T) => void; size?: 'sm' | 'md';
}) {
  const pad = size === 'sm' ? '5px 11px' : '7px 14px';
  return (
    <div style={{ display: 'inline-flex', gap: 3, padding: 3, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)' }}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} title={o.hint} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: pad, borderRadius: 'var(--gh-radius-md)',
            background: on ? 'var(--gh-accent)' : 'transparent', color: on ? 'var(--gh-accent-fg)' : 'var(--gh-text-secondary)',
            border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 'var(--gh-font-size-sm)',
            fontWeight: on ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-medium)', whiteSpace: 'nowrap',
          }}>
            {o.label}
            {o.hint && <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 'var(--gh-font-weight-medium)' }}>{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ─── Inline editable number cell ─────────────────────────────────────────────
export function NumCell({ value, onChange, prefix, suffix, width = 78, step = 1, pct = false, title, align = 'right' }: {
  value: number; onChange: (v: number) => void; prefix?: string; suffix?: string;
  width?: number; step?: number; pct?: boolean; title?: string; align?: 'left' | 'right';
}) {
  const display = pct ? +(value * 100).toFixed(2) : value;
  return (
    <span title={title} style={{
      display: 'inline-flex', alignItems: 'center', gap: 2, padding: '3px 7px', borderRadius: 'var(--gh-radius-md)',
      background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', fontFamily: F,
    }}>
      {prefix && <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{prefix}</span>}
      <input
        type="number" value={display} step={step}
        onChange={e => { const v = e.target.value === '' ? 0 : parseFloat(e.target.value); onChange(pct ? v / 100 : v); }}
        style={{
          width, textAlign: align, background: 'transparent', border: 'none', outline: 'none',
          color: 'var(--gh-text)', fontFamily: F, fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-medium)',
        }}
      />
      {(suffix || pct) && <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{suffix ?? '%'}</span>}
    </span>
  );
}

// ─── GSA range bar (min · p25–p75 band · median · our marker) ─────────────────
export function RangeBar({ min, p25, median, p75, max, our, ourTone = 'accent' }: {
  min: number; p25: number; median: number; p75: number; max: number; our: number; ourTone?: Tone;
}) {
  const lo = Math.min(min, our), hi = Math.max(max, our);
  const span = Math.max(hi - lo, 1);
  const pos = (v: number) => Math.min(100, Math.max(0, ((v - lo) / span) * 100));
  const c = tone(ourTone);
  return (
    <div style={{ position: 'relative', height: 30, width: '100%' }}>
      <div style={{ position: 'absolute', top: 14, left: 0, right: 0, height: 4, borderRadius: 2, background: 'var(--gh-bg-surface-muted)' }} />
      <div style={{ position: 'absolute', top: 12, left: `${pos(p25)}%`, width: `${pos(p75) - pos(p25)}%`, height: 8, borderRadius: 4, background: 'var(--gh-accent-glass)', border: '1px solid var(--gh-accent)' }} />
      <div style={{ position: 'absolute', top: 8, left: `${pos(median)}%`, width: 2, height: 16, background: 'var(--gh-text-tertiary)', transform: 'translateX(-50%)' }} title="GSA median" />
      <div style={{ position: 'absolute', top: 5, left: `${pos(our)}%`, transform: 'translateX(-50%) rotate(45deg)', width: 12, height: 12, background: c.fg, border: '1.5px solid var(--gh-bg-elevated)', borderRadius: 2 }} title="Our loaded rate" />
    </div>
  );
}

// ─── Waterfall row (ROM rollup) ──────────────────────────────────────────────
export function WaterRow({ label, amount, sub, strong, accent, note }: {
  label: string; amount: string; sub?: boolean; strong?: boolean; accent?: boolean; note?: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: strong ? '12px 14px' : '7px 14px',
      paddingLeft: sub ? 30 : 14, borderRadius: 'var(--gh-radius-md)',
      background: strong ? 'var(--gh-accent)' : accent ? 'var(--gh-bg-surface-muted)' : 'transparent',
    }}>
      <span style={{
        flex: 1, fontSize: strong ? 'var(--gh-font-size-md)' : 'var(--gh-font-size-sm)',
        fontWeight: strong ? 'var(--gh-font-weight-bold)' : sub ? 'var(--gh-font-weight-medium)' : 'var(--gh-font-weight-semibold)',
        color: strong ? 'var(--gh-accent-fg)' : sub ? 'var(--gh-text-tertiary)' : 'var(--gh-text)',
      }}>{label}</span>
      {note}
      <span style={{
        fontSize: strong ? 'var(--gh-font-size-lg)' : 'var(--gh-font-size-sm)', fontFamily: F,
        fontWeight: strong ? 'var(--gh-font-weight-bold)' : 'var(--gh-font-weight-semibold)',
        color: strong ? 'var(--gh-accent-fg)' : sub ? 'var(--gh-text-secondary)' : 'var(--gh-text)',
        fontVariantNumeric: 'tabular-nums',
      }}>{amount}</span>
    </div>
  );
}

// ─── Tiny stacked label/value (used in headers & cards) ──────────────────────
export function KV({ label, value, tone: t }: { label: string; value: React.ReactNode; tone?: Tone }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--gh-font-weight-semibold)' }}>{label}</div>
      <div style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-bold)', color: t ? tone(t).fg : 'var(--gh-text)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{value}</div>
    </div>
  );
}

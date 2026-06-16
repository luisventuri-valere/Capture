import React from 'react';
import { X } from 'lucide-react';
import { tone, F, type Tone } from './helpers';

// ─── Pill / badge ────────────────────────────────────────────────────────────
export function Pill({ tone: t = 'neutral', children, soft, style }: {
  tone?: Tone; children: React.ReactNode; soft?: boolean; style?: React.CSSProperties;
}) {
  const c = tone(t);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
      borderRadius: 'var(--gh-radius-full)', fontSize: 'var(--gh-font-size-xs)',
      fontWeight: 'var(--gh-font-weight-semibold)', background: soft ? 'transparent' : c.bg,
      color: c.fg, border: soft ? `1px solid ${c.bd}` : '1px solid transparent',
      whiteSpace: 'nowrap', fontFamily: F, lineHeight: 1.5, ...style,
    }}>{children}</span>
  );
}

export function Dot({ tone: t, size = 8 }: { tone: Tone; size?: number }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: tone(t).fg, display: 'inline-block', flexShrink: 0 }} />;
}

// ─── Button ──────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, kind = 'secondary', size = 'md', icon, disabled, title, style }: {
  children?: React.ReactNode; onClick?: () => void; kind?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md'; icon?: React.ReactNode; disabled?: boolean; title?: string; style?: React.CSSProperties;
}) {
  const pad = size === 'sm' ? '5px 10px' : '7px 14px';
  const fs = size === 'sm' ? 'var(--gh-font-size-xs)' : 'var(--gh-font-size-sm)';
  let bg = 'transparent', fg = 'var(--gh-text-secondary)', bd = '1px solid var(--gh-border)';
  if (kind === 'primary') { bg = 'var(--gh-accent)'; fg = 'var(--gh-accent-fg)'; bd = '1px solid var(--gh-accent)'; }
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

// Icon-only action button with optional count badge
export function IconBtn({ icon, onClick, title, tone: t, count }: {
  icon: React.ReactNode; onClick?: () => void; title?: string; tone?: Tone; count?: number;
}) {
  const fg = t ? tone(t).fg : 'var(--gh-text-tertiary)';
  return (
    <button onClick={onClick} title={title} style={{
      position: 'relative', width: 30, height: 30, display: 'grid', placeItems: 'center',
      borderRadius: 'var(--gh-radius-md)', background: 'transparent', border: '1px solid var(--gh-border)',
      color: fg, cursor: 'pointer',
    }}>
      {icon}
      {count !== undefined && count > 0 && (
        <span style={{
          position: 'absolute', top: -6, right: -6, minWidth: 15, height: 15, padding: '0 3px',
          borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-accent)', color: '#fff',
          fontSize: 9, fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center', fontFamily: F,
        }}>{count}</span>
      )}
    </button>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
export function Stat({ label, value, tone: t, icon }: { label: string; value: React.ReactNode; tone?: Tone; icon?: React.ReactNode }) {
  const fg = t ? tone(t).fg : 'var(--gh-text)';
  return (
    <div style={{ flex: '1 1 0', minWidth: 130, background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)', padding: '12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {icon && <span style={{ color: fg, display: 'flex' }}>{icon}</span>}
        <div style={{ fontSize: 26, fontWeight: 'var(--gh-font-weight-bold)', color: fg, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      </div>
      <div style={{ fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)', marginTop: 6, fontFamily: F }}>{label}</div>
    </div>
  );
}

// ─── Panel (section wrapper) ─────────────────────────────────────────────────
export const Panel = React.forwardRef<HTMLDivElement, { title: string; icon?: React.ReactNode; right?: React.ReactNode; children: React.ReactNode }>(
  function Panel({ title, icon, right, children }, ref) {
    return (
      <section ref={ref} style={{ background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', overflow: 'hidden', fontFamily: F }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', borderBottom: '1px solid var(--gh-border)', background: 'var(--gh-bg-surface-muted)' }}>
          {icon && <span style={{ color: 'var(--gh-accent-tint)', display: 'flex', flexShrink: 0 }}>{icon}</span>}
          <h3 style={{ margin: 0, fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', flex: 1 }}>{title}</h3>
          {right}
        </div>
        <div style={{ padding: '16px 18px' }}>{children}</div>
      </section>
    );
  }
);

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, children, width = 760, human }: {
  open: boolean; onClose: () => void; children: React.ReactNode; width?: number; human?: boolean;
}) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(2,6,23,0.62)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: width, background: 'var(--gh-bg-elevated)',
        border: `1px solid ${human ? 'var(--gh-border-strong)' : 'var(--gh-border)'}`,
        borderRadius: 'var(--gh-radius-xl)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', fontFamily: F, overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

export function ModalHeader({ icon, title, subtitle, onClose, tone: t = 'accent' }: {
  icon?: React.ReactNode; title: React.ReactNode; subtitle?: React.ReactNode; onClose: () => void; tone?: Tone;
}) {
  const c = tone(t);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '18px 20px', borderBottom: '1px solid var(--gh-border)' }}>
      {icon && <span style={{ width: 34, height: 34, borderRadius: 'var(--gh-radius-lg)', background: c.bg, color: c.fg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', padding: 4, flexShrink: 0 }}><X size={18} /></button>
    </div>
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div>;
}
export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '14px 20px', borderTop: '1px solid var(--gh-border)', background: 'var(--gh-bg-surface-muted)' }}>{children}</div>;
}

// Small labeled field block used in modals
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>{children}</div>;
}

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';

const F = 'var(--gh-font)';

export interface DetailScrollState { atEnd: boolean; scrolled: boolean; scrollPct: number }

// Shared bottom-bar action button — mirrors Strategy's bottom action bar buttons.
export function ActionButton({ variant = 'ghost', icon, children, onClick, disabled, title }: {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode; children: ReactNode; onClick?: () => void; disabled?: boolean; title?: string;
}) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '12px 20px',
    borderRadius: 'var(--gh-radius-lg)', fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)',
    fontFamily: F, cursor: disabled ? 'not-allowed' : 'pointer',
  };
  const v: React.CSSProperties =
    variant === 'primary'
      ? { border: 'none', background: disabled ? 'var(--gh-bg-surface-muted)' : 'var(--gh-accent)', color: disabled ? 'var(--gh-text-disabled)' : 'var(--gh-accent-fg)' }
      : variant === 'secondary'
      ? { border: '1px solid var(--gh-border-strong)', background: 'var(--gh-bg-surface)', color: 'var(--gh-text-secondary)' }
      : { border: 'none', background: 'transparent', color: 'var(--gh-text-tertiary)' };
  return <button onClick={onClick} disabled={disabled} title={title} style={{ ...base, ...v }}>{icon}{children}</button>;
}

interface DetailPanelProps {
  scrollKey: string;                                 // remount/scroll-reset trigger on selection change
  children: ReactNode;                               // body content — NO title header
  actions?: (s: DetailScrollState) => ReactNode;     // bottom-right buttons (gets scroll state for gating)
  leftActions?: ReactNode;                           // bottom-left content (e.g. a status badge)
  onAskAI?: () => void;                              // floating Ask AI (omit → no button)
  askAiLabel?: string;
  background?: string;                               // body bg (default canvas)
  progressBar?: boolean;                             // show read-progress bar (default true)
}

// Strategy's detail chrome, reusable: thin top progress bar (tracks read progress) +
// scrollable body (no title) + bottom action bar + floating Ask AI that reveals on scroll.
export function DetailPanel({ scrollKey, children, actions, leftActions, onAskAI, askAiLabel = 'Ask AI', background = 'var(--gh-bg-canvas)', progressBar = true }: DetailPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Reset scroll/progress when the selected item changes; reveal the (universal) chrome.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) { setScrollPct(0); setAtEnd(false); setScrolled(false); return; }
    el.scrollTop = 0;
    el.dispatchEvent(new Event('scroll'));   // nudge the capture-phase chrome listener to reveal
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 1) { setScrollPct(100); setAtEnd(true); setScrolled(true); }   // nothing to scroll → fully read
    else { setScrollPct(0); setAtEnd(false); setScrolled(false); }
  }, [scrollKey]);

  const onScroll = (e: { currentTarget: HTMLDivElement }) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    const pct = max > 1 ? Math.min(100, (el.scrollTop / max) * 100) : 100;
    setScrollPct(pct);
    if (el.scrollTop > 8) setScrolled(true);   // reveal the floating Ask AI
    if (pct >= 99) setAtEnd(true);             // latches once the end is reached
  };

  const state: DetailScrollState = { atEnd, scrolled, scrollPct };
  const hasBar = !!actions || !!leftActions || !!onAskAI;

  return (
    <div style={{ flex: 1, minWidth: 0, background, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {progressBar && (
        <div style={{ height: 4, background: 'var(--gh-bg-surface-muted)', flexShrink: 0 }}>
          <div style={{ height: 4, width: `${scrollPct}%`, background: 'var(--gh-accent)', borderRadius: '0 2px 2px 0', transition: 'width 0.08s linear' }} />
        </div>
      )}

      {/* Scrollable body — no title header */}
      <div ref={scrollRef} onScroll={onScroll} style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>

      {/* Bottom action bar + floating Ask AI */}
      {hasBar && (
        <div style={{ flexShrink: 0, position: 'relative', background: 'var(--gh-bg-elevated)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          {onAskAI && (
            <button
              onClick={onAskAI}
              aria-hidden={!scrolled}
              style={{ position: 'absolute', right: 24, top: -62, display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, padding: '12px 20px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-border-strong)', color: 'var(--gh-text-tertiary)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)', fontFamily: F, boxShadow: '0 12px 28px rgba(0,0,0,0.4)', opacity: scrolled ? 1 : 0, transform: scrolled ? 'translateY(0)' : 'translateY(8px)', pointerEvents: scrolled ? 'auto' : 'none', transition: 'opacity 0.2s ease, transform 0.2s ease' }}
            >
              <MessageCircle size={16} /> {askAiLabel}
            </button>
          )}
          {leftActions}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            {actions?.(state)}
          </div>
        </div>
      )}
    </div>
  );
}

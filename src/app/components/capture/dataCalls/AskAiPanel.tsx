import React, { useEffect, useState } from 'react';
import { Sparkles, X, User } from 'lucide-react';
import { F, ORANGE, orangeTone } from './helpers';
import type { AIScope } from '../../../../types/dataCalls';

export interface AskAiData { scope: AIScope; scopeId: string; contextLabel: string; prompt: string; answer: string; }
const SCOPE_LABEL: Record<AIScope, string> = { all: 'Portfolio', partner: 'Partner', call: 'Data Call', item: 'Item' };

export function AskAiPanel({ data, onClose }: { data: AskAiData | null; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!data) return;
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 850);
    return () => window.clearTimeout(t);
  }, [data?.scope, data?.scopeId, data?.prompt]);
  if (!data) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'var(--gh-backdrop-canvas)' }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(440px, 92vw)', zIndex: 81, display: 'flex', flexDirection: 'column',
        background: 'var(--gh-bg-elevated)', borderLeft: `1px solid ${orangeTone.bd}`, boxShadow: '-12px 0 48px rgba(0,0,0,0.5)', fontFamily: F,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px', borderBottom: '1px solid var(--gh-border)' }}>
          <span style={{ width: 32, height: 32, borderRadius: 'var(--gh-radius-lg)', background: orangeTone.bg, color: ORANGE, display: 'grid', placeItems: 'center', border: `1px solid ${orangeTone.bd}` }}><Sparkles size={17} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>Ask AI</div>
            <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: ORANGE, fontWeight: 'var(--gh-font-weight-semibold)' }}>{SCOPE_LABEL[data.scope]}</span> scope · {data.contextLabel}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* user prompt bubble */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <div style={{ maxWidth: '85%', padding: '10px 13px', borderRadius: '12px 12px 2px 12px', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', fontSize: 'var(--gh-font-size-sm)', lineHeight: 1.5 }}>{data.prompt}</div>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><User size={14} /></span>
          </div>
          {/* AI answer bubble */}
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: orangeTone.bg, color: ORANGE, display: 'grid', placeItems: 'center', flexShrink: 0, border: `1px solid ${orangeTone.bd}` }}><Sparkles size={14} /></span>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: '12px 12px 12px 2px', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
                <Sparkles size={14} className="gh-spin" style={{ color: ORANGE }} />
                <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>Analyzing this {SCOPE_LABEL[data.scope].toLowerCase()}…</span>
              </div>
            ) : (
              <div style={{ maxWidth: '88%', padding: '11px 14px', borderRadius: '12px 12px 12px 2px', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', color: 'var(--gh-text-secondary)', fontSize: 'var(--gh-font-size-sm)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{data.answer}</div>
            )}
          </div>
        </div>

        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--gh-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input disabled placeholder="Ask a follow-up… (demo)" style={{ flex: 1, padding: '9px 12px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', color: 'var(--gh-text-disabled)', fontFamily: F, fontSize: 'var(--gh-font-size-sm)' }} />
          <span style={{ fontSize: 10, color: 'var(--gh-text-tertiary)' }}>scope-aware</span>
        </div>
      </aside>
    </>
  );
}

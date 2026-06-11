import { useState, useRef, useEffect } from 'react';
import { Paperclip } from 'lucide-react';
import type { Source } from '../../../types/strategy';

export function SourceChip({ source }: { source: Source }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          borderRadius: 'var(--gh-radius-full)',
          border: `1px solid var(--gh-border)`,
          background: 'var(--gh-bg-surface-muted)',
          color: 'var(--gh-text-secondary)',
          fontSize: 'var(--gh-font-size-xs)',
          cursor: 'pointer',
          fontFamily: 'var(--gh-font)',
        }}
      >
        <Paperclip size={11} /> {source.label}
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            zIndex: 50,
            bottom: 28,
            left: 0,
            width: 288,
            borderRadius: 'var(--gh-radius-lg)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            padding: 12,
            background: 'var(--gh-bg-surface)',
            border: `1px solid var(--gh-border)`,
            fontSize: 'var(--gh-font-size-sm)',
            fontFamily: 'var(--gh-font)',
          }}
        >
          <div style={{ fontWeight: 'var(--gh-font-weight-semibold)', marginBottom: 4, color: 'var(--gh-text)' }}>{source.label}</div>
          <div style={{ color: 'var(--gh-text-tertiary)', marginBottom: 2 }}>Ref: {source.ref}</div>
          <div style={{ color: 'var(--gh-text-tertiary)', marginBottom: 4 }}>Retrieved: {source.retrievedAt}</div>
          <div style={{ fontStyle: 'italic', color: 'var(--gh-text-muted)' }}>"{source.excerpt}"</div>
        </div>
      )}
    </div>
  );
}

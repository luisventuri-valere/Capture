import { useState, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

const F = 'var(--gh-font)';

// Section Index sizing: drag 117–252px; below the break it renders the narrow rail
// (title-only, Figma 2185:17230); the collapse button → 44px icon-only (2197:17848).
export const INDEX_W_DEFAULT = 252;
export const INDEX_W_MIN = 117;     // narrow rail width
export const INDEX_W_BREAK = 180;   // below this → break down to title-only rail
export const INDEX_W_RAIL = 44;     // fully collapsed (icon only)

// Section-index collapse glyph (Figma 2320:17804 — grid_layout_side / side panel)
export function PanelToggleIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.125 13.125C2.78125 13.125 2.48698 13.0026 2.24219 12.7578C1.9974 12.513 1.875 12.2188 1.875 11.875V3.125C1.875 2.78125 1.9974 2.48698 2.24219 2.24219C2.48698 1.9974 2.78125 1.875 3.125 1.875H11.875C12.2188 1.875 12.513 1.9974 12.7578 2.24219C13.0026 2.48698 13.125 2.78125 13.125 3.125V11.875C13.125 12.2188 13.0026 12.513 12.7578 12.7578C12.513 13.0026 12.2188 13.125 11.875 13.125H3.125ZM3.125 11.875H8.125V3.125H3.125V11.875ZM11.875 11.875V3.125H9.375V11.875H11.875Z" fill="currentColor" />
    </svg>
  );
}

// ─── Shared section-index nav item (mirrors Strategy's SidebarItem) ───────────

interface SectionIndexItemProps {
  title: string;
  subtitle?: string;     // feeds / hint line
  subtitleDot?: string;  // status-tone dot shown before the subtitle (when no confidence score)
  confidence?: number;   // drives the score pill; omit → no pill
  confirmed?: boolean;
  selected: boolean;
  flagged?: boolean;     // amber "update" dot
  narrow?: boolean;      // title-only rail rendering
  emphasis?: boolean;    // hub/anchor item — taller, bolder, accent rail when selected
  onSelect: () => void;
}

export function SectionIndexItem({ title, subtitle, subtitleDot, confidence, confirmed, selected, flagged, narrow, emphasis, onSelect }: SectionIndexItemProps) {
  // Narrow rail: title only (wrapped), selected highlighted (Figma 2185:17230)
  if (narrow) {
    return (
      <button onClick={onSelect} style={{ display: 'flex', alignItems: 'flex-start', width: '100%', minHeight: 58, boxSizing: 'border-box', padding: '12px 10px', textAlign: 'left', cursor: 'pointer', border: 'none', background: selected ? 'var(--gh-blue-900)' : 'transparent', fontFamily: F }}>
        <span style={{ fontSize: 12, fontWeight: 'var(--gh-font-weight-semibold)', lineHeight: 1.4, color: selected ? 'var(--gh-text)' : 'var(--gh-slate-400)' }}>{title}</span>
      </button>
    );
  }

  // Score pill (Figma StrategyRow/Score Pill): ≥80 teal · 50–79 amber · <50 red
  const [pillBg, pillColor] =
    (confidence ?? 0) >= 80 ? ['var(--gh-score-high-bg)', 'var(--gh-score-high-fg)'] :
    (confidence ?? 0) >= 50 ? ['var(--gh-score-mid-bg)',  'var(--gh-score-mid-fg)']  :
    ['var(--gh-red-950)', 'var(--gh-score-low-fg)'];

  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 9, width: '100%', height: emphasis ? 66 : 60, boxSizing: 'border-box',
        padding: emphasis ? '12px 10px 12px 13px' : '12px 10px', textAlign: 'left', cursor: 'pointer', border: 'none',
        borderLeft: emphasis ? `3px solid ${selected ? 'var(--gh-accent)' : 'transparent'}` : undefined,
        background: selected ? 'var(--gh-blue-900)' : emphasis ? 'var(--gh-bg-surface)' : 'transparent', fontFamily: F,
      }}
    >
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
            {flagged && <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: 'var(--gh-warning-fg)' }} />}
            <span style={{ fontSize: emphasis ? 13 : 12, fontWeight: emphasis ? 'var(--gh-font-weight-bold)' : 'var(--gh-font-weight-semibold)', lineHeight: 1.4, color: 'var(--gh-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </span>
          </span>
          {confidence != null && (
            <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', lineHeight: 1.4, background: pillBg, color: pillColor }}>
              {confidence}%
            </span>
          )}
        </span>
        {subtitle && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 'var(--gh-font-weight-normal)', lineHeight: 1.4, color: 'var(--gh-slate-400)', minWidth: 0 }}>
            {subtitleDot && <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: subtitleDot }} />}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</span>
          </span>
        )}
      </span>
      {confirmed && <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-success-fg)' }} />}
    </button>
  );
}

// ─── Shared collapsible / resizable section index ─────────────────────────────
// Renders the index column + its drag handle as siblings (place as the first
// children of a horizontal master/detail flex container).

interface SectionIndexProps {
  title: string;
  filter?: ReactNode;                          // shown only when expanded (hidden in narrow/collapsed)
  renderItems: (narrow: boolean) => ReactNode; // the nav items
}

export function SectionIndex({ title, filter, renderItems }: SectionIndexProps) {
  const [indexWidth, setIndexWidth] = useState(INDEX_W_DEFAULT);
  const [resizingIdx, setResizingIdx] = useState(false);
  const [idxHover, setIdxHover] = useState(false);
  const [indexCollapsed, setIndexCollapsed] = useState(false);

  // Narrow rail (title-only) once dragged below the breakdown width.
  const narrow = !indexCollapsed && indexWidth < INDEX_W_BREAK;

  // Drag the divider to resize the section index (clamped 252px → 117px, ~40% less).
  const onIndexResizeStart = (e: { clientX: number; preventDefault: () => void }) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = indexWidth;
    setResizingIdx(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    const onMove = (ev: PointerEvent) => {
      setIndexWidth(Math.max(INDEX_W_MIN, Math.min(INDEX_W_DEFAULT, startW + (ev.clientX - startX))));
    };
    const onUp = () => {
      setResizingIdx(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <>
      {/* Section Index — expanded (2185:17111) · narrow rail (2185:17230) · collapsed (2197:17848) */}
      <div style={{ width: indexCollapsed ? INDEX_W_RAIL : indexWidth, flexShrink: 0, overflowX: 'hidden', overflowY: 'auto', background: 'var(--gh-bg-canvas)' }}>
        {/* Header: title + collapse toggle — frozen/sticky (Figma 2185:17088) */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--gh-bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: indexCollapsed || narrow ? 'flex-end' : 'space-between', padding: '8px 12px' }}>
          {!indexCollapsed && !narrow && <span style={{ fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', fontFamily: F }}>{title}</span>}
          <button onClick={() => setIndexCollapsed(c => !c)} title={indexCollapsed ? 'Expandir panel' : 'Colapsar panel'} style={{ display: 'grid', placeItems: 'center', width: 20, height: 20, borderRadius: 'var(--gh-radius-md)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)' }}>
            <PanelToggleIcon size={15} />
          </button>
        </div>
        {/* Filter — only when expanded (hidden in the narrow rail / collapsed) */}
        {!indexCollapsed && !narrow && filter}
        {/* Items — hidden when collapsed; title-only in the narrow rail */}
        {!indexCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {renderItems(narrow)}
          </div>
        )}
      </div>

      {/* Resize handle — drag to shrink (hidden when collapsed) */}
      {!indexCollapsed && (
        <div
          onPointerDown={onIndexResizeStart}
          onMouseEnter={() => setIdxHover(true)}
          onMouseLeave={() => setIdxHover(false)}
          title="Arrastra para ajustar el ancho de la lista"
          style={{ width: 6, flexShrink: 0, cursor: 'col-resize', display: 'flex', justifyContent: 'center', alignItems: 'stretch', background: 'transparent' }}
        >
          <div style={{ width: resizingIdx || idxHover ? 2 : 1, background: resizingIdx || idxHover ? 'var(--gh-accent)' : 'var(--gh-border)', transition: 'background 0.15s, width 0.15s' }} />
        </div>
      )}
    </>
  );
}

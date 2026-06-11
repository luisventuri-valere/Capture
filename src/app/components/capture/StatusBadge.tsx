import { CheckCircle, AlertTriangle, Circle } from 'lucide-react';
import type { SectionStatus } from '../../../types/strategy';

const STATUS_CONFIG: Record<SectionStatus, { label: string; bg: string; color: string; Icon: typeof CheckCircle }> = {
  confirmed:    { label: 'Confirmed',    bg: 'var(--gh-success-bg)',     color: 'var(--gh-success-fg)',   Icon: CheckCircle   },
  needs_review: { label: 'Needs Review', bg: 'var(--gh-warning-bg)',     color: 'var(--gh-warning-fg)',   Icon: AlertTriangle },
  draft:        { label: 'Draft',        bg: 'var(--gh-bg-surface)',     color: 'var(--gh-text-tertiary)', Icon: Circle        },
};

export function StatusBadge({ status }: { status: SectionStatus }) {
  const cfg = STATUS_CONFIG[status];
  const { Icon } = cfg;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        borderRadius: 'var(--gh-radius-full)',
        fontSize: 'var(--gh-font-size-xs)',
        fontWeight: 'var(--gh-font-weight-semibold)',
        padding: '2px 8px 2px 6px',
        background: cfg.bg,
        color: cfg.color,
        fontFamily: 'var(--gh-font)',
      }}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

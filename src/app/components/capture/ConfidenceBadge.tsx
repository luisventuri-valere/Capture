interface ConfidenceBadgeProps {
  confidence: number;
  size?: 'sm' | 'md';
}

export function ConfidenceBadge({ confidence, size = 'md' }: ConfidenceBadgeProps) {
  const high = confidence >= 75;
  const mid  = confidence >= 50;
  const bg    = high ? 'var(--gh-success-bg)'  : mid ? 'var(--gh-warning-bg)'  : 'var(--gh-danger-bg)';
  const color = high ? 'var(--gh-success-fg)' : mid ? 'var(--gh-warning-fg)' : 'var(--gh-danger-fg-strong)';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'var(--gh-radius-full)',
        fontSize: size === 'sm' ? 'var(--gh-font-size-xs)' : 'var(--gh-font-size-sm)',
        fontWeight: 'var(--gh-font-weight-semibold)',
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        background: bg,
        color,
        fontFamily: 'var(--gh-font)',
      }}
    >
      {confidence}% confidence
    </span>
  );
}

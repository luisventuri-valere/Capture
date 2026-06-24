import React from 'react';
import { AlertTriangle, HelpCircle, Scale, ShieldCheck, BarChart3, Timer, RefreshCw, X, CheckCircle2, ArrowRight, Sparkles, Users, User } from 'lucide-react';
import type { AIRecommendation, RecType, Severity } from '../../../../types/dataCalls';
import { F, tone, ORANGE, orangeTone, severityTone, recTypeLabel } from './helpers';
import { Pill, Btn, SeverityBadge } from './ui';

const ICON: Record<RecType, React.ReactNode> = {
  gap: <AlertTriangle size={16} />, clarification: <HelpCircle size={16} />, comparison: <Scale size={16} />,
  risk: <ShieldCheck size={16} />, quality: <BarChart3 size={16} />, timing: <Timer size={16} />,
};
const SEV_ORDER: Record<Severity, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export function Recommendations({ recommendations, analyzing, onReAnalyze, onAction, onDismiss, partnerName }: {
  recommendations: AIRecommendation[]; analyzing: boolean;
  onReAnalyze: () => void; onAction: (r: AIRecommendation) => void; onDismiss: (r: AIRecommendation) => void;
  partnerName: (id: string) => string;
}) {
  const visible = recommendations.filter(r => r.status !== 'dismissed').sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);
  const dismissed = recommendations.filter(r => r.status === 'dismissed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: F }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>
          {visible.filter(r => r.status === 'active').length} active · {visible.filter(r => r.status === 'acted_on').length} acted on{dismissed ? ` · ${dismissed} dismissed` : ''}
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <Btn size="sm" icon={analyzing ? <RefreshCw size={13} className="gh-spin" /> : <RefreshCw size={13} />} onClick={onReAnalyze} disabled={analyzing}>
            {analyzing ? 'Re-analyzing…' : 'Re-Analyze'}
          </Btn>
        </div>
      </div>

      {analyzing ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '40px', color: 'var(--gh-text-tertiary)' }}>
          <Sparkles size={18} className="gh-spin" style={{ color: ORANGE }} /> Scanning submissions, gaps, and deadlines across the team…
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
          {visible.map(r => {
            const acted = r.status === 'acted_on';
            const sevC = tone(severityTone(r.severity));
            return (
              <div key={r.id} style={{ borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: `1px solid ${acted ? 'var(--gh-success-border)' : 'var(--gh-border)'}`, padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 9, opacity: acted ? 0.82 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 'var(--gh-radius-md)', background: sevC.bg, color: sevC.fg, display: 'grid', placeItems: 'center' }}>{ICON[r.type]}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{recTypeLabel[r.type]}</span>
                      <SeverityBadge severity={r.severity} />
                      <Pill tone={r.scope === 'cross-team' ? 'accent' : 'neutral'} soft>{r.scope === 'cross-team' ? <Users size={10} /> : <User size={10} />}{r.scope}</Pill>
                    </div>
                    <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', lineHeight: 1.4 }}>{r.title}</div>
                  </div>
                  {!acted && <button onClick={() => onDismiss(r)} title="Dismiss" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', padding: 2, flexShrink: 0 }}><X size={14} /></button>}
                </div>
                <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)', lineHeight: 1.5 }}>{r.detail}</p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '8px 10px', borderRadius: 'var(--gh-radius-md)', background: orangeTone.bg, border: `1px solid ${orangeTone.bd}` }}>
                  <ArrowRight size={13} style={{ color: ORANGE, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>{r.recommendation}</span>
                </div>
                {r.partnerIds.length > 0 && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {r.partnerIds.map(id => <Pill key={id} tone="neutral" soft>{partnerName(id)}</Pill>)}
                    {r.dataCallIds.map(id => <Pill key={id} tone="neutral" soft>{id}</Pill>)}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  {acted ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-success-fg)', fontWeight: 'var(--gh-font-weight-semibold)' }}><CheckCircle2 size={14} /> Added to Actions queue</span>
                  ) : (
                    <Btn kind="primary" size="sm" icon={<ArrowRight size={13} />} onClick={() => onAction(r)}>{r.suggestedAction}</Btn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

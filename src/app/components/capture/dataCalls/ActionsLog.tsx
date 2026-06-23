import React, { useState } from 'react';
import { ListTodo, Activity, Upload, BarChart3, CheckCircle2, Bell, Send, ShieldAlert, Circle, Sparkles, Link2 } from 'lucide-react';
import type { QueuedAction, ActivityEvent, AIRecommendation, Priority } from '../../../../types/dataCalls';
import { F, ORANGE, orangeTone, priorityTone } from './helpers';
import { Pill } from './ui';

const PRI_ORDER: Record<Priority, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
const EVT_ICON: Record<string, React.ReactNode> = {
  submission: <Upload size={13} />, quality_review: <BarChart3 size={13} />, accept: <CheckCircle2 size={13} />,
  reminder: <Bell size={13} />, send: <Send size={13} />, override: <ShieldAlert size={13} />,
};
const EVT_TONE: Record<string, string> = { accept: 'var(--gh-success-fg)', quality_review: 'var(--gh-warning-fg)', reminder: ORANGE, override: 'var(--gh-danger-fg)', submission: 'var(--gh-info-fg)', send: 'var(--gh-text-tertiary)' };

function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let h = d.getUTCHours(); const m = d.getUTCMinutes().toString().padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}, ${h}:${m} ${ap}`;
}

export function ActionsLog({ queuedActions, recommendations, onToggleDone, activityLog }: {
  queuedActions: QueuedAction[]; recommendations: AIRecommendation[]; onToggleDone: (id: string) => void; activityLog: ActivityEvent[];
}) {
  const [showAll, setShowAll] = useState(false);
  const recTitle = (id?: string) => recommendations.find(r => r.id === id)?.title;
  const open = queuedActions.filter(a => !a.done).sort((a, b) => PRI_ORDER[a.priority] - PRI_ORDER[b.priority]);
  const done = queuedActions.filter(a => a.done);
  const events = showAll ? activityLog : activityLog.slice(0, 5);

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontFamily: F }}>
      {/* actions queue */}
      <div style={{ flex: '1 1 360px', minWidth: 300 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <ListTodo size={15} style={{ color: ORANGE }} />
          <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>Actions & Escalation</span>
          <Pill tone="neutral" soft>{open.length} open</Pill>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[...open, ...done].map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', opacity: a.done ? 0.55 : 1 }}>
              <button onClick={() => onToggleDone(a.id)} title={a.done ? 'Mark open' : 'Mark complete'} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: a.done ? 'var(--gh-success-fg)' : 'var(--gh-text-tertiary)', padding: 0, marginTop: 1, flexShrink: 0 }}>
                {a.done ? <CheckCircle2 size={17} /> : <Circle size={17} />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)', textDecoration: a.done ? 'line-through' : 'none', lineHeight: 1.4 }}>{a.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                  <Pill tone={priorityTone(a.priority)} soft>{a.priority}</Pill>
                  {a.source === 'ai_rec' ? (
                    <span title={recTitle(a.sourceRecId)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-orange-300)', background: orangeTone.bg, border: `1px solid ${orangeTone.bd}`, padding: '1px 7px', borderRadius: 'var(--gh-radius-full)' }}>
                      <Sparkles size={9} /> from AI rec <Link2 size={9} />
                    </span>
                  ) : (
                    <Pill tone="neutral" soft>manual</Pill>
                  )}
                </div>
              </div>
            </div>
          ))}
          {queuedActions.length === 0 && <div style={{ padding: '16px', textAlign: 'center', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>No actions queued.</div>}
        </div>
      </div>

      {/* activity log */}
      <div style={{ flex: '1 1 360px', minWidth: 300 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Activity size={15} style={{ color: ORANGE }} />
          <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>Activity Log</span>
        </div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {events.map((e, i) => (
            <div key={e.id} style={{ display: 'flex', gap: 11, paddingBottom: i === events.length - 1 ? 0 : 14, position: 'relative' }}>
              {i !== events.length - 1 && <span style={{ position: 'absolute', left: 12, top: 24, bottom: 0, width: 1, background: 'var(--gh-border)' }} />}
              <span style={{ flexShrink: 0, width: 25, height: 25, borderRadius: '50%', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', color: EVT_TONE[e.type] ?? 'var(--gh-text-tertiary)', display: 'grid', placeItems: 'center', zIndex: 1 }}>{EVT_ICON[e.type] ?? <Circle size={12} />}</span>
              <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.45 }}>{e.description}</div>
                <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 2 }}>{fmtDateTime(e.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
        {activityLog.length > 5 && (
          <button onClick={() => setShowAll(s => !s)} style={{ marginTop: 12, background: 'transparent', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', padding: '6px 12px', cursor: 'pointer', color: 'var(--gh-text-tertiary)', fontFamily: F, fontSize: 'var(--gh-font-size-xs)' }}>
            {showAll ? 'Show less' : `Show all ${activityLog.length} events`}
          </button>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Check, RefreshCw, AlertTriangle, X, ChevronRight, MessageCircle, ArrowRight, Edit2, History, ListChecks, Bot, Paperclip } from 'lucide-react';
import { SectionFairContent } from './SectionFairContent';
import { AskAIDrawer } from './AskAIDrawer';
import type { StrategyData, SectionStatus, UiStatus } from '../../../types/strategy';
import { SECTION_META, toUiStatus } from '../../../types/strategy';
import { ENVELOPE, type EnvelopeRec } from '../../../data/capture/envelope';

const F = 'var(--gh-font)';

type TriageFilter = 'all' | 'needs_attention' | 'confirmed';

// Downstream tabs per section key — for backward-engineering toast
const DOWNSTREAM: Partial<Record<keyof StrategyData['sections'], string[]>> = {
  teamStrategy: ['Teaming', 'Staffing', 'Pricing'],
  staffingStrategy: ['Staffing'],
  pricingStrategy: ['Pricing'],
};

// Sections flagged in backward-engineering demo
const BACKWARD_ENG_FLAGS = new Set<keyof StrategyData['sections']>(['teamStrategy', 'staffingStrategy', 'pricingStrategy']);

// ─── Confidence chip ─────────────────────────────────────────────────────────

function ConfidenceChip({ confidence, size = 'sm' }: { confidence: number; size?: 'sm' | 'md' }) {
  const [bg, color] =
    confidence >= 75 ? ['var(--gh-success-bg)', 'var(--gh-success-fg)'] :
    confidence >= 50 ? ['var(--gh-warning-bg)', 'var(--gh-warning-fg)'] :
    ['var(--gh-danger-bg)', 'var(--gh-danger-fg)'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: size === 'sm' ? '2px 7px' : '3px 10px',
      borderRadius: 'var(--gh-radius-full)',
      fontSize: size === 'sm' ? 11 : 'var(--gh-font-size-sm)',
      fontWeight: 'var(--gh-font-weight-semibold)',
      background: bg, color, fontFamily: F,
    }}>
      {confidence}%
    </span>
  );
}

// ─── Recommendations & Actions band ─────────────────────────────────────────

interface RecBandProps {
  sectionKey: keyof StrategyData['sections'];
  rejectedIds: Set<string>;
  onReject: (id: string) => void;
  onAccept: (id: string) => void;
  localStatuses: Record<string, 'accepted' | 'proposed' | 'rejected'>;
}

function RecommendationsBand({ sectionKey, rejectedIds, onAccept, localStatuses }: RecBandProps) {
  const env = ENVELOPE.sections[sectionKey];
  if (!env?.recommendations?.length) return null;

  const recs = env.recommendations.map(r => ({
    ...r,
    status: localStatuses[r.id] ?? r.status,
  }));

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <ListChecks size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />
        <span style={{ fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: F }}>
          Recommendations &amp; Actions
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {recs.map(rec => {
          const accepted  = rec.status === 'accepted';
          const rejected  = rec.status === 'rejected';
          const rowBg     = accepted ? 'var(--gh-success-bg)' : rejected ? 'var(--gh-danger-bg)' : 'var(--gh-bg-surface)';
          const rowBorder = accepted ? 'var(--gh-success-border)' : rejected ? 'var(--gh-danger-border)' : 'var(--gh-border)';
          const leftBar   = accepted ? 'var(--gh-success-fg)' : rejected ? 'var(--gh-danger-fg)' : 'transparent';
          return (
            <div
              key={rec.id}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', borderRadius: 'var(--gh-radius-lg)', background: rowBg, borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, borderLeftWidth: 3, borderTopStyle: 'solid', borderBottomStyle: 'solid', borderRightStyle: 'solid', borderLeftStyle: 'solid', borderTopColor: rowBorder, borderBottomColor: rowBorder, borderRightColor: rowBorder, borderLeftColor: leftBar, fontFamily: F }}
            >
              {/* Status icon */}
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                {accepted ? (
                  <div style={{ width: 16, height: 16, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-success-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={10} color="var(--gh-success-bg)" />
                  </div>
                ) : rejected ? (
                  <div style={{ width: 16, height: 16, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-danger-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={10} color="var(--gh-danger-bg)" />
                  </div>
                ) : (
                  <div style={{ width: 16, height: 16, borderRadius: 'var(--gh-radius-full)', border: '1.5px solid var(--gh-border)' }} />
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 'var(--gh-font-size-base)', color: rejected ? 'var(--gh-text-disabled)' : 'var(--gh-text)', textDecoration: rejected ? 'line-through' : 'none' }}>
                  {rec.text}
                </span>
                {/* Backward-engineering demo: show rejection reason for TS-R1 */}
                {rec.id === 'TS-R1' && rejected && (
                  <div style={{ marginTop: 4, fontSize: 11, color: 'var(--gh-danger-fg)' }}>
                    Rejected by S. Chen — partner no longer bidding (2026-02-12)
                  </div>
                )}
              </div>

              {/* Fix 1: enlarged hit areas ≥32×32, 8px gap, Accept dominant */}
              {rec.status === 'proposed' && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                  {/* Accept — dominant green */}
                  <button
                    title="Accept"
                    onClick={() => onAccept(rec.id)}
                    style={{ width: 32, height: 32, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-success-bg)', border: '1px solid var(--gh-success-border)', cursor: 'pointer', color: 'var(--gh-success-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <Check size={15} />
                  </button>
                  {/* Reject — quiet red */}
                  <button
                    title="Reject"
                    onClick={() => {/* handled via parent */}}
                    style={{ width: 32, height: 32, borderRadius: 'var(--gh-radius-lg)', background: 'transparent', border: '1px solid var(--gh-border)', cursor: 'pointer', color: 'var(--gh-danger-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <X size={15} />
                  </button>
                  {/* Edit — quietest */}
                  <button
                    title="Edit"
                    style={{ width: 32, height: 32, borderRadius: 'var(--gh-radius-lg)', background: 'transparent', border: '1px solid var(--gh-border)', cursor: 'pointer', color: 'var(--gh-text-disabled)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sidebar item ─────────────────────────────────────────────────────────────

interface SidebarItemProps {
  number: number;
  title: string;
  feeds: string[];
  rawStatus: SectionStatus;
  uiOverride?: UiStatus;
  confidence: number;
  confirmed: boolean;
  selected: boolean;
  flagged?: boolean;   // amber "update" dot for backward-engineering demo
  onSelect: () => void;
}

function SidebarItem({ number, title, feeds, rawStatus, uiOverride, confidence, confirmed, selected, flagged, onSelect }: SidebarItemProps) {
  const status: UiStatus = uiOverride ?? toUiStatus(rawStatus);
  const dotColor =
    status === 'confirmed'    ? 'var(--gh-success-fg)'  :
    status === 'needs_review' ? 'var(--gh-warning-fg)'  :
    'var(--gh-text-disabled)';

  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 10px',
        textAlign: 'left', cursor: 'pointer', borderRadius: 'var(--gh-radius-lg)',
        background: selected ? 'var(--gh-bg-surface-muted)' : 'transparent',
        borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1,
        borderTopStyle: 'solid', borderBottomStyle: 'solid', borderRightStyle: 'solid',
        borderTopColor: selected ? 'var(--gh-border)' : 'transparent',
        borderBottomColor: selected ? 'var(--gh-border)' : 'transparent',
        borderRightColor: selected ? 'var(--gh-border)' : 'transparent',
        borderLeftWidth: 3, borderLeftStyle: 'solid',
        borderLeftColor: selected ? 'var(--gh-accent)' : 'transparent',
        fontFamily: F,
      }}
    >
      {/* Number badge */}
      <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 'var(--gh-radius-full)', background: selected ? 'var(--gh-accent)' : 'var(--gh-bg-surface)', color: selected ? 'var(--gh-accent-fg)' : 'var(--gh-text-tertiary)', fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {number}
      </div>

      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
          {/* Status dot */}
          <div style={{ flexShrink: 0, width: 6, height: 6, borderRadius: 'var(--gh-radius-full)', background: dotColor }} />
          <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: selected ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-medium)', color: selected ? 'var(--gh-text)' : 'var(--gh-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
          {confirmed && <Check size={10} style={{ flexShrink: 0, color: 'var(--gh-success-fg)' }} />}
          {flagged && !confirmed && (
            <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-warning-fg)' }} />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gh-text-disabled)' }}>
          <ConfidenceChip confidence={confidence} size="sm" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {feeds.join(', ')}
          </span>
        </div>
      </div>

      {selected && <ChevronRight size={13} style={{ flexShrink: 0, color: 'var(--gh-accent)' }} />}
    </button>
  );
}

// ─── Detail header (sticky) ───────────────────────────────────────────────────

interface DetailHeaderProps {
  number: number;
  title: string;
  feeds: string[];
  rawStatus: SectionStatus;
  uiOverride?: UiStatus;
  confidence: number;
  confirmed: boolean;
  lastReviewed: string;
  reviewedBy: string;
  onConfirm: () => void;
  onRequestReview: () => void;
  onEdit: () => void;
  onAskAI: () => void;
}

function DetailHeader({ number, title, feeds, rawStatus, uiOverride, confidence, confirmed, lastReviewed, reviewedBy, onConfirm, onRequestReview, onEdit, onAskAI }: DetailHeaderProps) {
  const uiStatus = uiOverride ?? toUiStatus(rawStatus);
  const statusLabel = uiStatus === 'confirmed' ? 'Confirmed' : uiStatus === 'needs_review' ? 'Needs Review' : 'Draft';
  const [statusBg, statusColor] =
    uiStatus === 'confirmed'    ? ['var(--gh-success-bg)', 'var(--gh-success-fg)'] :
    uiStatus === 'needs_review' ? ['var(--gh-warning-bg)', 'var(--gh-warning-fg)'] :
    ['var(--gh-bg-surface)', 'var(--gh-text-tertiary)'];

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 10, padding: '14px 24px 10px', background: 'var(--gh-bg-canvas)', borderBottom: '1px solid var(--gh-border)', fontFamily: F }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', fontSize: 'var(--gh-font-size-base)', fontWeight: 'var(--gh-font-weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {number}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
            <h2 style={{ margin: 0, fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{title}</h2>
            <span style={{ padding: '2px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', background: statusBg, color: statusColor }}>{statusLabel}</span>
            {/* Confidence chip */}
            <ConfidenceChip confidence={confidence} size="md" />
            {confirmed && <span style={{ padding: '2px 8px', borderRadius: 'var(--gh-radius-full)', fontSize: 11, background: 'var(--gh-success-bg)', color: 'var(--gh-success-fg)' }}>Confirmed</span>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gh-text-disabled)' }}>Last reviewed {lastReviewed} · {reviewedBy}</div>
        </div>
      </div>

      {/* Fix 5: button pyramid — Confirm solid primary → Request Review outline → Edit/Ask AI tertiary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* Primary — filled */}
        <button onClick={onConfirm} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', cursor: 'pointer', fontFamily: F }}>
          <Check size={13} /> {confirmed ? 'Re-confirm' : 'Confirm'}
        </button>
        {/* Secondary — outline */}
        <button onClick={onRequestReview} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'transparent', color: 'var(--gh-accent)', border: '1px solid var(--gh-accent)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer', fontFamily: F }}>
          <RefreshCw size={13} /> Request Review
        </button>
        {/* Tertiary — icon + muted label, no border */}
        <button onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 'var(--gh-radius-lg)', background: 'transparent', color: 'var(--gh-text-tertiary)', border: 'none', fontSize: 'var(--gh-font-size-sm)', cursor: 'pointer', fontFamily: F }}>
          <Edit2 size={13} /> Edit
        </button>
        <button onClick={onAskAI} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 'var(--gh-radius-lg)', background: 'transparent', color: 'var(--gh-text-tertiary)', border: 'none', fontSize: 'var(--gh-font-size-sm)', cursor: 'pointer', fontFamily: F }}>
          <MessageCircle size={13} /> Ask AI
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {feeds.map(f => (
            <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 8px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface)', color: 'var(--gh-text-tertiary)', border: '1px solid var(--gh-border)' }}>
              <ArrowRight size={9} /> {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Version History footer ───────────────────────────────────────────────────

function VersionHistoryFooter({ sectionKey, vhOverride }: { sectionKey: keyof StrategyData['sections']; vhOverride?: typeof ENVELOPE.sections[string]['version_history'] }) {
  const [open, setOpen] = useState(false);
  const vh = vhOverride ?? ENVELOPE.sections[sectionKey]?.version_history ?? [];
  return (
    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--gh-border)' }}>
      <button onClick={() => setOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', cursor: 'pointer', color: 'var(--gh-text-tertiary)', fontSize: 'var(--gh-font-size-sm)', fontFamily: F }}>
        <History size={12} />
        Version History ({vh.length})
        <ChevronRight size={12} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>
      {open && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {vh.map((v, i) => (
            <div key={i} style={{ padding: '6px 10px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', fontSize: 11, color: 'var(--gh-text-tertiary)', fontFamily: F }}>
              <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-secondary)' }}>v{v.version}</span>
              {' · '}{v.changed_at} · {v.changed_by} — {v.change_summary}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const CHAT_SEED = [
  { q: 'What is the key risk for this section?', a: 'In the live system, the Capture Strategy Agent would identify the top risk based on current data and section analysis.' },
  { q: 'What should I do next?', a: 'Review the recommendations, confirm items that look correct, and flag any that need revision before the next milestone.' },
];

interface Props { data: StrategyData }

// ─── Pre-seeded state for "3 · Team Strategy — Change detected" screen ───────

const DEMO_VH = [
  ...ENVELOPE.sections.teamStrategy.version_history,
  { version: 2, changed_at: '2026-02-12', changed_by: 'S. Chen', change_summary: 'TS-R1 rejected — partner no longer bidding' },
];

const DEMO_CONFIRMED = new Set<keyof StrategyData['sections']>([
  'strategicPositioning', 'winStrategy', 'pastPerformance', 'resourcePlan',
]);

const DEMO_UI_OVERRIDE: Partial<Record<keyof StrategyData['sections'], UiStatus>> = {
  strategicPositioning: 'confirmed',
  winStrategy: 'confirmed',
  teamStrategy: 'needs_review',
  pastPerformance: 'confirmed',
  resourcePlan: 'confirmed',
};

const DEMO_REC_STATUSES: Record<string, Record<string, 'accepted' | 'proposed' | 'rejected'>> = {
  teamStrategy: { 'TS-R1': 'rejected' },
};

const DEMO_FLAGGED = new Set<keyof StrategyData['sections']>([
  'teamStrategy', 'staffingStrategy', 'pricingStrategy',
]);

// ─── Main component ─────────────────────────────────────────────────────────

export function StrategyPlanSubTab({ data }: Props) {
  // "demo" = the pre-seeded "3 · Team Strategy — Change detected" screen
  const [demoActive, setDemoActive] = useState(false);

  const [selectedKey, setSelectedKey] = useState<keyof StrategyData['sections']>('strategicPositioning');
  const [triageFilter, setTriageFilter] = useState<TriageFilter>('all');
  const [confirmedKeys, setConfirmedKeys] = useState<Set<keyof StrategyData['sections']>>(new Set());
  const [sectionUiOverride, setSectionUiOverride] = useState<Partial<Record<keyof StrategyData['sections'], UiStatus>>>({});
  const [aiDrawerTitle, setAiDrawerTitle] = useState<string | null>(null);
  const [confirmToast, setConfirmToast] = useState<string | null>(null);
  const [changeToast, setChangeToast] = useState<string | null>(null);
  const [recStatuses, setRecStatuses] = useState<Record<string, Record<string, 'accepted' | 'proposed' | 'rejected'>>>({});
  const [vhOverrides, setVhOverrides] = useState<Record<string, typeof ENVELOPE.sections[string]['version_history']>>({});
  const [flaggedKeys, setFlaggedKeys] = useState<Set<keyof StrategyData['sections']>>(new Set());

  // When demo is active, all derived values come from the pre-seeded constants
  const activeConfirmedKeys    = demoActive ? DEMO_CONFIRMED     : confirmedKeys;
  const activeSectionUiOverride = demoActive ? DEMO_UI_OVERRIDE  : sectionUiOverride;
  const activeRecStatuses      = demoActive ? DEMO_REC_STATUSES  : recStatuses;
  const activeFlaggedKeys      = demoActive ? DEMO_FLAGGED       : flaggedKeys;
  const activeVhOverrides      = demoActive ? { teamStrategy: DEMO_VH } : vhOverrides;
  const activeSelectedKey      = demoActive ? 'teamStrategy' as keyof StrategyData['sections'] : selectedKey;
  const activeChangeToast      = demoActive
    ? 'Change detected — downstream tabs flagged for regeneration: Teaming, Staffing, Pricing.'
    : changeToast;

  const activateDemo = () => { setDemoActive(true); };
  const exitDemo     = () => { setDemoActive(false); };

  const getRecStatuses = (key: string) => recStatuses[key] ?? {};

  const handleAcceptRec = (sectionKey: string, recId: string) => {
    setRecStatuses(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [recId]: 'accepted' } }));
  };

  const handleRejectRec = (sectionKey: keyof StrategyData['sections'], recId: string) => {
    setRecStatuses(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [recId]: 'rejected' } }));

    // Backward-engineering demo: if the section was confirmed, trigger change flow
    if (confirmedKeys.has(sectionKey)) {
      const downstream = DOWNSTREAM[sectionKey] ?? [];
      if (downstream.length) {
        // Demote section + flag downstream sections
        setSectionUiOverride(prev => ({ ...prev, [sectionKey]: 'needs_review' }));
        setConfirmedKeys(prev => { const n = new Set(prev); n.delete(sectionKey); return n; });
        setChangeToast(`Change detected — downstream tabs flagged for regeneration: ${downstream.join(', ')}.`);
        // Add v2 to version history
        const existing = vhOverrides[sectionKey] ?? ENVELOPE.sections[sectionKey]?.version_history ?? [];
        setVhOverrides(prev => ({
          ...prev,
          [sectionKey]: [...existing, { version: existing.length + 1, changed_at: '2026-02-12', changed_by: 'S. Chen', change_summary: `Recommendation ${recId} rejected — partner no longer bidding` }],
        }));
        // Flag downstream sections with amber dot
        const downstreamKeys = [...BACKWARD_ENG_FLAGS].filter(k => k !== sectionKey) as (keyof StrategyData['sections'])[];
        setFlaggedKeys(prev => { const n = new Set(prev); downstreamKeys.forEach(k => n.add(k)); return n; });
      }
    }
  };

  const handleConfirm = (key: keyof StrategyData['sections']) => {
    setConfirmedKeys(prev => new Set([...prev, key]));
    setSectionUiOverride(prev => ({ ...prev, [key]: 'confirmed' }));
    setFlaggedKeys(prev => { const n = new Set(prev); n.delete(key); return n; });
    const meta = SECTION_META.find(m => m.key === key);
    setConfirmToast(`${meta?.title} confirmed — feeds: ${(meta?.feeds ?? []).join(', ')}`);
    setTimeout(() => setConfirmToast(null), 4000);
  };

  const handleRequestReview = (key: keyof StrategyData['sections']) => {
    setSectionUiOverride(prev => ({ ...prev, [key]: 'needs_review' }));
  };

  const confirmedCount = SECTION_META.filter(m =>
    activeConfirmedKeys.has(m.key) || toUiStatus(data.sections[m.key]?.status) === 'confirmed'
  ).length;

  const filteredMeta = SECTION_META.filter(meta => {
    const raw = data.sections[meta.key]?.status;
    const ui = activeSectionUiOverride[meta.key] ?? toUiStatus(raw);
    if (triageFilter === 'confirmed') return ui === 'confirmed' || activeConfirmedKeys.has(meta.key);
    if (triageFilter === 'needs_attention') return ui !== 'confirmed' && !activeConfirmedKeys.has(meta.key);
    return true;
  });

  const visibleKeys = new Set(filteredMeta.map(m => m.key));
  const effectiveKey: keyof StrategyData['sections'] = visibleKeys.has(activeSelectedKey)
    ? activeSelectedKey
    : (filteredMeta[0]?.key ?? activeSelectedKey);

  const selectedMeta = SECTION_META.find(m => m.key === effectiveKey)!;
  const selectedSection = data.sections[effectiveKey];
  const selectedEnv = ENVELOPE.sections[effectiveKey];
  const effectiveUiStatus = activeSectionUiOverride[effectiveKey] ?? toUiStatus(selectedSection?.status);
  const effectiveConfirmed = activeConfirmedKeys.has(effectiveKey) || effectiveUiStatus === 'confirmed';
  const effectiveVH = activeVhOverrides[effectiveKey] ?? selectedEnv?.version_history;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: F }}>
      {/* Confirm toast */}
      {confirmToast && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 70, maxWidth: 380, padding: '10px 16px', borderRadius: 'var(--gh-radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--gh-success-bg)', border: '1px solid var(--gh-success-border)', color: 'var(--gh-success-fg)', fontFamily: F }}>
          <span style={{ flex: 1, fontSize: 'var(--gh-font-size-base)' }}>{confirmToast}</span>
          <button onClick={() => setConfirmToast(null)} style={{ background: 'transparent', cursor: 'pointer', color: 'var(--gh-success-fg)' }}><X size={14} /></button>
        </div>
      )}

      {/* Change-detected toast */}
      {activeChangeToast && (
        <div style={{ position: 'fixed', top: confirmToast ? 72 : 16, right: 16, zIndex: 70, maxWidth: 420, padding: '10px 16px', borderRadius: 'var(--gh-radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)', color: 'var(--gh-warning-fg)', fontFamily: F }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'var(--gh-font-weight-semibold)', fontSize: 'var(--gh-font-size-sm)', marginBottom: 2 }}>Change detected</div>
            <div style={{ fontSize: 'var(--gh-font-size-base)' }}>{activeChangeToast}</div>
          </div>
          {!demoActive && (
            <button onClick={() => setChangeToast(null)} style={{ background: 'transparent', cursor: 'pointer', color: 'var(--gh-warning-fg)', flexShrink: 0 }}><X size={14} /></button>
          )}
        </div>
      )}

      {/* Ask AI drawer */}
      {aiDrawerTitle && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }} onClick={() => setAiDrawerTitle(null)} />
          <AskAIDrawer sectionTitle={aiDrawerTitle} chatSeed={CHAT_SEED} onClose={() => setAiDrawerTitle(null)} />
        </>
      )}

      {/* Plan header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', paddingBottom: 12, flexShrink: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 3 }}>
            {/* Overall confidence chip */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', background: 'var(--gh-warning-bg)', color: 'var(--gh-warning-fg)', fontFamily: F }}>
              {ENVELOPE.overall_confidence}% confidence
            </span>
            <span style={{ padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', background: confirmedCount === 10 ? 'var(--gh-success-bg)' : 'var(--gh-bg-surface)', color: confirmedCount === 10 ? 'var(--gh-success-fg)' : 'var(--gh-text-secondary)', fontFamily: F }}>
              {confirmedCount} / {SECTION_META.length} confirmed
            </span>
            <span style={{ padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 11, background: 'var(--gh-info-bg)', color: 'var(--gh-info-fg)', fontFamily: F }}>
              {data.capturePhase}
            </span>
          </div>
          {/* Generated-by line */}
          <p style={{ fontSize: 11, color: 'var(--gh-text-disabled)', margin: 0, fontFamily: F }}>
            Drafted by {ENVELOPE.generated_by} · Capture Manager: {data.captureManager}
          </p>
        </div>

        {/* Triage filter (hidden in demo mode) */}
        {!demoActive && (
          <div style={{ display: 'flex', borderRadius: 'var(--gh-radius-lg)', overflow: 'hidden', border: '1px solid var(--gh-border)', flexShrink: 0 }}>
            {(['all', 'needs_attention', 'confirmed'] as TriageFilter[]).map(f => (
              <button key={f} onClick={() => setTriageFilter(f)} style={{ padding: '5px 12px', fontSize: 11, fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer', background: triageFilter === f ? 'var(--gh-accent)' : 'var(--gh-bg-elevated)', color: triageFilter === f ? 'var(--gh-accent-fg)' : 'var(--gh-text-tertiary)', fontFamily: F }}>
                {f === 'all' ? 'All' : f === 'needs_attention' ? 'Needs Attention' : 'Confirmed'}
              </button>
            ))}
          </div>
        )}

        {/* Screen toggle: normal ↔ "3 · Team Strategy — Change detected" */}
        {demoActive ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-warning-fg)', padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)', fontFamily: F }}>
              3 · Team Strategy — Change detected
            </span>
            <button
              onClick={exitDemo}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', color: 'var(--gh-text-tertiary)', border: '1px solid var(--gh-border)', fontSize: 11, cursor: 'pointer', fontFamily: F }}
            >
              <X size={11} /> Exit demo
            </button>
          </div>
        ) : (
          <button
            onClick={activateDemo}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-warning-bg)', color: 'var(--gh-warning-fg)', border: '1px solid var(--gh-warning-border)', fontSize: 11, cursor: 'pointer', fontFamily: F, flexShrink: 0 }}
          >
            <AlertTriangle size={11} /> Preview cascade
          </button>
        )}
      </div>

      {/* Master / detail */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', overflow: 'hidden' }}>
        {/* Fix 4: section index — inset card bg + SECTIONS header to distinguish from app nav */}
        <div style={{ width: 252, flexShrink: 0, overflowY: 'auto', background: 'var(--gh-bg-canvas)', borderRight: '1px solid var(--gh-border)' }}>
          <div style={{ margin: '10px 8px 4px', padding: '6px 8px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-elevated)', border: '1px solid var(--gh-border)' }}>
            <span style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: F }}>Sections</span>
          </div>
          <div style={{ padding: '4px 8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredMeta.map(meta => (
              <SidebarItem
                key={meta.key}
                number={meta.number}
                title={meta.title}
                feeds={meta.key === 'pastPerformance' ? ['Past Performance'] : meta.feeds}
                rawStatus={data.sections[meta.key]?.status}
                uiOverride={activeSectionUiOverride[meta.key]}
                confidence={ENVELOPE.sections[meta.key]?.confidence ?? 0}
                confirmed={activeConfirmedKeys.has(meta.key)}
                selected={effectiveKey === meta.key}
                flagged={activeFlaggedKeys.has(meta.key)}
                onSelect={() => !demoActive && setSelectedKey(meta.key)}
              />
            ))}
          </div>
        </div>

        {/* Detail */}
        <div key={effectiveKey} style={{ flex: 1, minWidth: 0, background: 'var(--gh-bg-canvas)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DetailHeader
            number={selectedMeta.number}
            title={selectedMeta.title}
            feeds={selectedMeta.key === 'pastPerformance' ? ['Past Performance'] : selectedMeta.feeds}
            rawStatus={selectedSection?.status}
            uiOverride={activeSectionUiOverride[effectiveKey]}
            confidence={selectedEnv?.confidence ?? 0}
            confirmed={effectiveConfirmed}
            lastReviewed={(selectedSection as {lastReviewed?: string})?.lastReviewed ?? '—'}
            reviewedBy={(selectedSection as {reviewedBy?: string})?.reviewedBy ?? '—'}
            onConfirm={() => !demoActive && handleConfirm(effectiveKey)}
            onRequestReview={() => !demoActive && handleRequestReview(effectiveKey)}
            onEdit={() => !demoActive && handleRequestReview(effectiveKey)}
            onAskAI={() => setAiDrawerTitle(selectedMeta.title)}
          />

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {/* Change-detected banner (detail panel, backward-engineering) */}
            {effectiveUiStatus === 'needs_review' && flaggedKeys.size > 0 && effectiveKey === 'teamStrategy' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', marginBottom: 16, background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)' }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-warning-fg)' }} />
                <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontFamily: F }}>
                  Change detected — downstream tabs flagged for regeneration: Teaming, Staffing, Pricing.
                </p>
              </div>
            )}

            {/* AI Reasoning band */}
            {selectedEnv?.ai_reasoning && (
              <div style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 'var(--gh-radius-lg)', marginBottom: 24, background: 'var(--gh-info-bg)', border: '1px solid var(--gh-info-border)' }}>
                <Bot size={16} style={{ flexShrink: 0, color: 'var(--gh-info-fg)' }} />
                <div>
                  <p style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', marginBottom: 4, color: 'var(--gh-info-fg)', fontFamily: F }}>
                    AI Reasoning — Capture Strategy Agent v3
                  </p>
                  <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0, fontFamily: F }}>
                    {selectedEnv.ai_reasoning}
                  </p>
                </div>
              </div>
            )}

            {/* Low-confidence banner (§4 Customer Engagement, confidence 46) */}
            {(selectedEnv?.confidence ?? 100) < 50 && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', marginBottom: 16, background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)' }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-warning-fg)' }} />
                <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontFamily: F }}>
                  This recommendation is based on limited data. Run ANALYZE workflow for better intelligence.
                </p>
              </div>
            )}

            {/* Conflict callout (§3 Team Strategy) */}
            {(selectedEnv?.conflicts ?? []).map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', marginBottom: 16, background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)' }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-warning-fg)' }} />
                <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontFamily: F }}>
                  <strong>Conflict:</strong> {c.message}
                </p>
              </div>
            ))}

            {/* FAIR: Facts + Analysis + Intelligence (with source chips injected into Facts) */}
            <SectionFairContent
              sectionKey={effectiveKey}
              sections={data.sections}
              sources={selectedEnv?.sources}
            />

            {/* Recommendations & Actions (4th FAIR band) */}
            <RecommendationsBand
              sectionKey={effectiveKey}
              rejectedIds={new Set(Object.entries(activeRecStatuses[effectiveKey] ?? {}).filter(([, v]) => v === 'rejected').map(([k]) => k))}
              onAccept={id => !demoActive && handleAcceptRec(effectiveKey, id)}
              onReject={id => !demoActive && handleRejectRec(effectiveKey as keyof StrategyData['sections'], id)}
              localStatuses={activeRecStatuses[effectiveKey] ?? {}}
            />

            {/* Footer: last reviewed + version history */}
            <div style={{ paddingTop: 12, borderTop: '1px solid var(--gh-border)' }}>
              <div style={{ fontSize: 11, color: 'var(--gh-text-disabled)', marginBottom: 4, fontFamily: F }}>
                Last reviewed {(selectedSection as {lastReviewed?: string})?.lastReviewed ?? '—'} · {(selectedSection as {reviewedBy?: string})?.reviewedBy ?? '—'}
              </div>
              <VersionHistoryFooter sectionKey={effectiveKey} vhOverride={effectiveVH} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

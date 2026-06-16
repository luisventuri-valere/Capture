import { useState, useRef, useEffect } from 'react';
import { Check, RefreshCw, AlertTriangle, X, MessageCircle, Edit2, History, ChevronRight, Info, Sparkles } from 'lucide-react';
import { SectionFairContent, Band } from './SectionFairContent';
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
    <Band label="Recommendations & Actions">
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
    </Band>
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

function SidebarItem({ number, title, feeds, confidence, selected, flagged, onSelect }: SidebarItemProps) {
  // Score pill (Figma StrategyRow/Score Pill): ≥80 teal · 50–79 amber · <50 red
  const [pillBg, pillColor] =
    confidence >= 80 ? ['rgba(0,255,188,0.05)', '#00ffbc'] :
    confidence >= 50 ? ['rgba(255,207,75,0.05)', '#ffcf4b'] :
    ['rgba(255,99,99,0.05)', '#ff6363'];

  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 9, width: '100%', height: 60, boxSizing: 'border-box',
        padding: '12px 10px', textAlign: 'left', cursor: 'pointer', border: 'none',
        background: selected ? 'var(--gh-blue-900)' : 'transparent', fontFamily: F,
      }}
    >
      {/* Index badge */}
      <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface)', color: 'var(--gh-white)', fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', lineHeight: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {number}
      </span>

      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
            {flagged && <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: 'var(--gh-warning-fg)' }} />}
            <span style={{ fontSize: 12, fontWeight: 'var(--gh-font-weight-semibold)', lineHeight: 1.4, color: 'var(--gh-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </span>
          </span>
          <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', lineHeight: 1.4, background: pillBg, color: pillColor }}>
          {confidence}%
          </span>
        </span>
        <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-normal)', lineHeight: 1.4, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {feeds.join(', ')}
        </span>
      </span>
    </button>
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

  // Detail scroll progress drives the top bar; Confirm unlocks at the bottom.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [scrolled, setScrolled] = useState(false);   // reveal the floating Ask AI once scrolling starts

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

  // Reset scroll/confirm gate whenever the selected section changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) { setScrollPct(0); setAtEnd(false); setScrolled(false); return; }
    el.scrollTop = 0;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 1) { setScrollPct(100); setAtEnd(true); setScrolled(true); }   // nothing to scroll → fully read
    else { setScrollPct(0); setAtEnd(false); setScrolled(false); }
  }, [effectiveKey]);

  const onDetailScroll = (e: { currentTarget: HTMLDivElement }) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    const pct = max > 1 ? Math.min(100, (el.scrollTop / max) * 100) : 100;
    setScrollPct(pct);
    if (el.scrollTop > 8) setScrolled(true);   // reveal the floating Ask AI
    if (pct >= 99) setAtEnd(true);             // latches once the end is reached
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            {/* Confirmed headline */}
            <span style={{ fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>
              {confirmedCount} of {SECTION_META.length} confirmed
            </span>
            {/* Overall confidence chip + info */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', background: 'var(--gh-warning-bg)', color: 'var(--gh-warning-fg)', fontFamily: F }}>
              {ENVELOPE.overall_confidence}% confidence
              <Info size={13} />
            </span>
          </div>
          {/* Ratified subtitle */}
          <div style={{ fontSize: 11, color: 'var(--gh-text-disabled)', marginBottom: 2, fontFamily: F }}>Sections ratified by a human</div>
          {/* Generated-by line */}
          <p style={{ fontSize: 11, color: 'var(--gh-text-disabled)', margin: 0, fontFamily: F }}>
            Drafted by {ENVELOPE.generated_by} · Capture Manager: {data.captureManager}
          </p>
        </div>

      </div>

      {/* Master / detail */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Section Index (Figma 2141:158) — canvas bg, no border (bg contrast vs the surface detail) */}
        <div style={{ width: 252, flexShrink: 0, overflowY: 'auto', background: 'var(--gh-bg-canvas)' }}>
          {/* Filter header (Figma 2141:159) — 8px padding all round */}
          <div style={{ padding: 8 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: 4, borderRadius: 'var(--gh-radius-lg)', background: 'rgba(255,255,255,0.06)' }}>
              {(['all', 'needs_attention', 'confirmed'] as TriageFilter[]).map(f => {
                const on = triageFilter === f;
                return (
                  <button key={f} onClick={() => setTriageFilter(f)} style={{
                    display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: 'var(--gh-radius-md)',
                    border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 11, whiteSpace: 'nowrap',
                    background: on ? 'rgba(255,255,255,0.14)' : 'transparent',
                    color: on ? '#edf2f7' : '#94a3b8',
                    fontWeight: on ? 'var(--gh-font-weight-medium)' : 'var(--gh-font-weight-normal)',
                  }}>
                    {f === 'all' ? 'All' : f === 'needs_attention' ? 'Needs Attention' : 'Confirmed'}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Items — full-width, fixed 60px, no gap (Figma 2141:167…) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
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
        <div key={effectiveKey} style={{ flex: 1, minWidth: 0, background: 'var(--gh-bg-surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Progress accent bar — tracks read progress (Figma 2141:178) */}
          <div style={{ height: 4, background: 'var(--gh-bg-surface-muted)', flexShrink: 0 }}>
            <div style={{ height: 4, width: `${scrollPct}%`, background: 'var(--gh-accent)', borderRadius: '0 2px 2px 0', transition: 'width 0.08s linear' }} />
          </div>

          {/* Scrollable body — bands stack edge-to-edge */}
          <div ref={scrollRef} onScroll={onDetailScroll} style={{ flex: 1, overflowY: 'auto' }}>
            {/* Contextual banners (padded) */}
            {((effectiveUiStatus === 'needs_review' && flaggedKeys.size > 0 && effectiveKey === 'teamStrategy') ||
              (selectedEnv?.confidence ?? 100) < 50 ||
              (selectedEnv?.conflicts ?? []).length > 0) && (
              <div style={{ padding: '16px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {effectiveUiStatus === 'needs_review' && flaggedKeys.size > 0 && effectiveKey === 'teamStrategy' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)' }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-warning-fg)' }} />
                    <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontFamily: F }}>
                      Change detected — downstream tabs flagged for regeneration: Teaming, Staffing, Pricing.
                    </p>
                  </div>
                )}
                {(selectedEnv?.confidence ?? 100) < 50 && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)' }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-warning-fg)' }} />
                    <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontFamily: F }}>
                      This recommendation is based on limited data. Run ANALYZE workflow for better intelligence.
                    </p>
                  </div>
                )}
                {(selectedEnv?.conflicts ?? []).map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)' }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-warning-fg)' }} />
                    <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontFamily: F }}>
                      <strong>Conflict:</strong> {c.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* AIReasoning card (Figma 2141:184) */}
            {selectedEnv?.ai_reasoning && (
              <div style={{ margin: 24, display: 'flex', gap: 12, alignItems: 'flex-start', padding: 24, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-elevated)' }}>
                <Sparkles size={14} style={{ flexShrink: 0, marginTop: 2, color: 'var(--gh-accent-tint)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-accent-tint)', fontFamily: F }}>AI Reasoning</span>
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--gh-text-secondary)', margin: 0, fontFamily: F }}>{selectedEnv.ai_reasoning}</p>
                </div>
              </div>
            )}

            {/* FAIR bands — Facts / Analysis / Intelligence */}
            <SectionFairContent
              sectionKey={effectiveKey}
              sections={data.sections}
              sources={selectedEnv?.sources}
            />

            {/* Recommendations & Actions band */}
            <RecommendationsBand
              sectionKey={effectiveKey}
              rejectedIds={new Set(Object.entries(activeRecStatuses[effectiveKey] ?? {}).filter(([, v]) => v === 'rejected').map(([k]) => k))}
              onAccept={id => !demoActive && handleAcceptRec(effectiveKey, id)}
              onReject={id => !demoActive && handleRejectRec(effectiveKey as keyof StrategyData['sections'], id)}
              localStatuses={activeRecStatuses[effectiveKey] ?? {}}
            />

            {/* Version history (Figma 2141:339) */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 11, color: 'var(--gh-text-disabled)', marginBottom: 4, fontFamily: F }}>
                Last reviewed {(selectedSection as {lastReviewed?: string})?.lastReviewed ?? '—'} · {(selectedSection as {reviewedBy?: string})?.reviewedBy ?? '—'}
              </div>
              <VersionHistoryFooter sectionKey={effectiveKey} vhOverride={effectiveVH} />
            </div>
          </div>

          {/* Bottom action bar (Figma 2141:346) */}
          <div style={{ flexShrink: 0, position: 'relative', background: 'var(--gh-bg-elevated)', padding: '16px 24px' }}>
            <button
              onClick={() => setAiDrawerTitle(selectedMeta.title)}
              aria-hidden={!scrolled}
              style={{ position: 'absolute', right: 24, top: -62, display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, padding: '12px 20px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-border-strong)', color: 'var(--gh-text-tertiary)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)', fontFamily: F, boxShadow: '0 12px 28px rgba(0,0,0,0.4)', opacity: scrolled ? 1 : 0, transform: scrolled ? 'translateY(0)' : 'translateY(8px)', pointerEvents: scrolled ? 'auto' : 'none', transition: 'opacity 0.2s ease, transform 0.2s ease' }}
            >
              <MessageCircle size={16} /> Ask AI
            </button>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => !demoActive && handleRequestReview(effectiveKey)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '12px 20px', borderRadius: 'var(--gh-radius-lg)', background: 'transparent', color: 'var(--gh-text-tertiary)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)', fontFamily: F }}>
                <Edit2 size={15} /> Edit
              </button>
              <button onClick={() => !demoActive && handleRequestReview(effectiveKey)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '12px 20px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', color: 'var(--gh-text-secondary)', border: '1px solid var(--gh-border-strong)', cursor: 'pointer', fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)', fontFamily: F }}>
                <RefreshCw size={15} /> Request Review
              </button>
              <button
                onClick={() => atEnd && !demoActive && handleConfirm(effectiveKey)}
                disabled={!atEnd}
                title={atEnd ? undefined : 'Scroll to the end of the section to confirm'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '12px 20px', borderRadius: 'var(--gh-radius-lg)', cursor: atEnd ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)', fontFamily: F, border: 'none', background: atEnd ? 'var(--gh-accent)' : 'var(--gh-bg-surface-muted)', color: atEnd ? 'var(--gh-accent-fg)' : 'var(--gh-text-disabled)' }}
              >
                <Check size={15} /> {effectiveConfirmed ? 'Re-confirm' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

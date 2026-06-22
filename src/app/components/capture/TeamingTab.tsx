import { useState } from 'react';
import { Check, RefreshCw, Edit2, AlertTriangle, X, ChevronRight, History, ClipboardList, Search, Lightbulb, ListChecks, Sparkles, Paperclip, Lock, ChevronUp, ChevronDown, CheckCircle, Circle, Info } from 'lucide-react';

const BAND_ICONS: Record<string, React.ReactNode> = {
  facts:           <ClipboardList size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />,
  analysis:        <Search       size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />,
  intelligence:    <Lightbulb   size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />,
  recommendations: <ListChecks  size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />,
};
import { PartnerKanban } from './PartnerKanban';
import { AskAIDrawer } from './AskAIDrawer';
import { SectionIndex, SectionIndexItem } from './SectionIndex';
import { DetailPanel, ActionButton } from './DetailPanel';
import {
  TEAMING_ENVELOPE,
  TEAMING_SECTION_META,
  type TeamingSectionKey,
  type SectionEnv,
  type EnvRec,
} from '../../../data/capture/teaming-envelope';
import teamingData from '../../../data/capture/opp-001-teaming.json';

const F = 'var(--gh-font)';
type UiStatus = 'confirmed' | 'needs_review' | 'draft';

// ─── Shared primitives (same pattern as StrategyPlanSubTab) ───────────────────

function Money(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function Pill({ children, bg, color, quiet }: { children: React.ReactNode; bg: string; color: string; quiet?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: quiet ? '1px 7px' : '2px 8px', borderRadius: 'var(--gh-radius-full)', fontSize: quiet ? 10 : 11, fontWeight: 'var(--gh-font-weight-medium)', letterSpacing: '0.04em', background: bg, color, fontFamily: F, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function KV({ label, value, primary }: { label: string; value: React.ReactNode; primary?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 'var(--gh-font-size-base)' }}>
      <span style={{ color: primary ? 'var(--gh-text-secondary)' : 'var(--gh-text-tertiary)', minWidth: 180, flexShrink: 0, fontWeight: primary ? 'var(--gh-font-weight-medium)' : 'var(--gh-font-weight-normal)' }}>{label}</span>
      <span style={{ color: 'var(--gh-text)', fontWeight: primary ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-normal)' }}>{value}</span>
    </div>
  );
}

function Band({ icon, label, children, defaultOpen = true }: { icon?: string; label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const iconNode = icon ? BAND_ICONS[icon] ?? null : null;
  return (
    <div style={{ width: '100%', fontFamily: F }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 24px', background: 'var(--gh-bg-elevated)', border: 'none', cursor: 'pointer', fontFamily: F }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {iconNode}
          <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.55px' }}>
            {label}
          </span>
        </span>
        <ChevronDown size={16} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0, transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform .15s' }} />
      </button>
      {open && (
        <div style={{ padding: '32px 24px', background: 'var(--gh-bg-surface)', color: 'var(--gh-text)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Card({ children, warn }: { children: React.ReactNode; warn?: boolean }) {
  return (
    <div style={{ padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', marginBottom: 10, background: warn ? 'var(--gh-warning-bg)' : 'var(--gh-bg-surface)', border: `1px solid ${warn ? 'var(--gh-warning-border)' : 'var(--gh-border)'}` }}>
      {children}
    </div>
  );
}

function SourceChips({ sources }: { sources: Array<{ label: string }> }) {
  if (!sources?.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--gh-border)' }}>
      {sources.map((s, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 'var(--gh-radius-full)', fontSize: 11, background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-secondary)', border: '1px solid var(--gh-border)', fontFamily: F }}>
          <Paperclip size={11} /> {s.label}
        </span>
      ))}
    </div>
  );
}

// ─── Recommendations band ─────────────────────────────────────────────────────

function RecsBand({ env, localStatuses, onAccept, demo, demoAddedRec }: {
  env: SectionEnv;
  localStatuses: Record<string, 'accepted' | 'proposed' | 'rejected'>;
  onAccept: (id: string) => void;
  demo?: boolean;
  demoAddedRec?: EnvRec;
}) {
  const recs = [
    ...env.recommendations.map(r => ({ ...r, status: localStatuses[r.id] ?? r.status })),
    ...(demo && demoAddedRec ? [demoAddedRec] : []),
  ];
  if (!recs.length) return null;
  return (
    <Band icon="recommendations" label="Recommendations & Actions">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {recs.map(rec => {
          const accepted = rec.status === 'accepted';
          const rejected = rec.status === 'rejected';
          const rowBg = accepted ? 'var(--gh-success-bg)' : rejected ? 'var(--gh-danger-bg)' : 'var(--gh-bg-surface)';
          const leftBar = accepted ? 'var(--gh-success-fg)' : rejected ? 'var(--gh-danger-fg)' : 'transparent';
          const rowBorder = accepted ? 'var(--gh-success-border)' : rejected ? 'var(--gh-danger-border)' : 'var(--gh-border)';
          return (
            <div key={rec.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', borderRadius: 'var(--gh-radius-lg)', background: rowBg, borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, borderLeftWidth: 3, borderTopStyle: 'solid', borderBottomStyle: 'solid', borderRightStyle: 'solid', borderLeftStyle: 'solid', borderTopColor: rowBorder, borderBottomColor: rowBorder, borderRightColor: rowBorder, borderLeftColor: leftBar }}>
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
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 'var(--gh-font-size-base)', color: rejected ? 'var(--gh-text-disabled)' : 'var(--gh-text)', textDecoration: rejected ? 'line-through' : 'none', fontFamily: F }}>
                  {rec.text}
                </span>
              </div>
              {rec.status === 'proposed' && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button title="Accept" onClick={() => onAccept(rec.id)} style={{ width: 32, height: 32, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-success-bg)', border: '1px solid var(--gh-success-border)', cursor: 'pointer', color: 'var(--gh-success-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={15} />
                  </button>
                  <button title="Reject" style={{ width: 32, height: 32, borderRadius: 'var(--gh-radius-lg)', background: 'transparent', border: '1px solid var(--gh-border)', cursor: 'pointer', color: 'var(--gh-danger-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={15} />
                  </button>
                  <button title="Edit" style={{ width: 32, height: 32, borderRadius: 'var(--gh-radius-lg)', background: 'transparent', border: '1px solid var(--gh-border)', cursor: 'pointer', color: 'var(--gh-text-disabled)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

function VersionHistoryFooter({ env, vhExtra }: { env: SectionEnv; vhExtra?: typeof env.version_history }) {
  const [open, setOpen] = useState(false);
  const vh = vhExtra ?? env.version_history;
  return (
    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--gh-border)' }}>
      <button onClick={() => setOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', cursor: 'pointer', color: 'var(--gh-text-tertiary)', fontSize: 'var(--gh-font-size-sm)', fontFamily: F }}>
        <History size={12} /> Version History ({vh.length})
        <ChevronRight size={12} style={{ transform: open ? 'rotate(90deg)' : 'none' }} />
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

// ─── Section content renderers ────────────────────────────────────────────────

type TD = typeof teamingData;

function TeamingStrategyContent({ data, demo }: { data: TD; demo: boolean }) {
  const ts    = data.teamingStrategy;
  const prime = ts.teamStructure.prime;
  const subs  = ts.teamStructure.subcontractors;
  return (
    <>
      <Band icon="facts" label="Facts">
        <KV label="Approach"                  value={ts.approach}                           primary />
        <KV label="Prime"                     value={prime.name}                            primary />
        <KV label="Prime Role"                value={prime.role}                            primary />
        <KV label="Prime Workshare"           value={`${prime.workshare}%`}                primary />
        <KV label="Prime Certifications"      value={prime.certifications.join(' · ')} />
        <KV label="SB Subcontracting Target"  value={`${ts.sbTarget}%`}                    primary />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Subcontractors</div>
          {subs.map((sub, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 10px', borderRadius: 'var(--gh-radius-md)', marginBottom: 4, background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', fontSize: 'var(--gh-font-size-base)' }}>
              <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', minWidth: 180, flexShrink: 0 }}>{sub.name}</span>
              <span style={{ color: 'var(--gh-text-tertiary)', flex: 1 }}>{sub.role}</span>
              <span style={{ color: 'var(--gh-accent-tint)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap', flexShrink: 0 }}>{sub.workshare}%</span>
            </div>
          ))}
        </div>
        <SourceChips sources={TEAMING_ENVELOPE.sections.teamingStrategy.sources} />
      </Band>

      <Band icon="analysis" label="Analysis">
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 6 }}>Rationale</div>
          <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0, lineHeight: 1.6 }}>{ts.rationale}</p>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 6 }}>SB Target Basis</div>
          <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0, lineHeight: 1.6 }}>{ts.sbTargetBasis}</p>
        </div>
        <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 8 }}>Prime Key Contributions</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)' }}>
          {prime.keyContributions.map((c, i) => <li key={i} style={{ marginBottom: 4 }}>{c}</li>)}
        </ul>
      </Band>

      <Band icon="intelligence" label="Intelligence — Partner-Selection Criteria">
        {/* teamValues is a string array in the new JSON */}
        {ts.teamValues.map((tv, i) => (
          <Card key={i}>
            <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0 }}>{tv}</p>
          </Card>
        ))}
      </Band>
    </>
  );
}

function CapabilityGapsContent({ data, demo }: { data: TD; demo: boolean }) {
  const gaps = data.capabilityGaps.map(g => {
    if (demo && g.id === 'CG-01') return { ...g, status: 'IDENTIFYING' };
    return g;
  });

  return (
    <>
      <Band icon="facts" label="Facts — Capability Gaps">
        {gaps.map(g => {
          const isReopened = demo && g.id === 'CG-01';
          return (
            <Card key={g.id} warn={g.severity === 'HIGH' || isReopened}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{g.id}</span>
                <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{g.capability}</span>
                <Pill bg={g.severity === 'HIGH' ? 'var(--gh-danger-bg)' : 'var(--gh-warning-bg)'} color={g.severity === 'HIGH' ? 'var(--gh-danger-fg)' : 'var(--gh-warning-fg)'}>{g.severity}</Pill>
                <Pill bg={g.status === 'FILLING' ? 'var(--gh-info-bg)' : 'var(--gh-warning-bg)'} color={g.status === 'FILLING' ? 'var(--gh-info-fg)' : 'var(--gh-warning-fg)'} quiet>{g.status}</Pill>
                {isReopened && <Pill bg="var(--gh-warning-bg)" color="var(--gh-warning-fg)">Reopened</Pill>}
              </div>
              <KV label="Filled By" value={isReopened ? 'TBD — see alternates' : g.filledBy} />
              {isReopened && (
                <KV label="Alternates" value="MigrationPro Federal, Attain Federal" />
              )}
            </Card>
          );
        })}
        <SourceChips sources={TEAMING_ENVELOPE.sections.capabilityGaps.sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Gap Detail">
        {gaps.map(g => (
          <div key={g.id} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 6 }}>{g.id} — {g.capability}</div>
            <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', marginBottom: 8 }}>{g.gapDescription}</p>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginBottom: 4 }}>Impact if unfilled</div>
              <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontStyle: 'italic' }}>{g.impactIfUnfilled}</p>
            </div>
            <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginBottom: 6 }}>Required Capabilities</div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)' }}>
              {g.requiredCapabilities.map((c, i) => <li key={i} style={{ marginBottom: 3 }}>{c}</li>)}
            </ul>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Pill bg="var(--gh-info-bg)" color="var(--gh-info-fg)" quiet>Recommended: {g.recommendedPartner}</Pill>
              {g.alternatePartners.map((a, i) => <Pill key={i} bg="var(--gh-bg-surface-muted)" color="var(--gh-text-tertiary)" quiet>Alt: {a}</Pill>)}
            </div>
          </div>
        ))}
      </Band>

      <Band icon="intelligence" label="Intelligence — Critical-Path Gaps">
        <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', marginBottom: 8 }}>
          CG-01 (Data Migration & ETL) is the <strong style={{ color: 'var(--gh-text)' }}>critical-path gap</strong> — the incumbent Peraton's most visible weakness and TechForward's primary discriminator opportunity. DataBridge closes it with incumbent sub-tier knowledge no competitor can replicate.
        </p>
        <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0 }}>
          CG-03 (Mainframe) covers 12 of 340+ apps — approximately 3.5% of the portfolio — but these include some of the highest-criticality DHS mission systems. A failed mainframe migration would generate an adverse CPARS entry and a protest surface for the incumbent.
        </p>
      </Band>
    </>
  );
}

function PartnerPipelineContent({ data, demo }: { data: TD; demo: boolean }) {
  // Stage distribution counts
  const stages = data.partnerPipeline.map(p => demo && p.id === 'TP-01' ? 'Declined' : p.stage);
  const committed  = stages.filter(s => s === 'Committed').length;
  const evaluating = stages.filter(s => s === 'Evaluating').length;
  const contacted  = stages.filter(s => s === 'Contacted').length;
  const identified = stages.filter(s => s === 'Identified').length;
  const declined   = stages.filter(s => s === 'Declined').length;

  return (
    <>
      {/* Facts — the full-width kanban board */}
      <Band icon="facts" label="Facts — Partner Pipeline">
        <PartnerKanban
          partners={data.partnerPipeline as Parameters<typeof PartnerKanban>[0]['partners']}
          demo={demo}
        />
        <SourceChips sources={TEAMING_ENVELOPE.sections.partnerPipeline.sources} />
      </Band>

      {/* Analysis — stage distribution + momentum */}
      <Band icon="analysis" label="Analysis — Pipeline Status">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          {[
            { label: 'Committed',  count: committed,  bg: 'var(--gh-success-bg)',     color: 'var(--gh-success-fg)' },
            { label: 'Evaluating', count: evaluating, bg: 'var(--gh-info-bg)',         color: 'var(--gh-info-fg)' },
            { label: 'Contacted',  count: contacted,  bg: 'var(--gh-bg-surface)',      color: 'var(--gh-text-secondary)' },
            { label: 'Identified', count: identified, bg: 'var(--gh-bg-surface)',      color: 'var(--gh-text-tertiary)' },
            { label: 'Declined',   count: declined,   bg: 'var(--gh-danger-bg)',       color: 'var(--gh-danger-fg)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 'var(--gh-radius-lg)', background: item.bg, border: `1px solid ${item.color === 'var(--gh-success-fg)' ? 'var(--gh-success-border)' : item.color === 'var(--gh-danger-fg)' ? 'var(--gh-danger-border)' : 'var(--gh-border)'}` }}>
              <span style={{ fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-bold)', color: item.color }}>{item.count}</span>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0 }}>
          {demo
            ? 'DataBridge withdrawn — 0 of 5 partners Committed. Sub-target of 45% is unmet; pipeline momentum has reversed. Immediate action required on alternates.'
            : '1 of 5 partners Committed (DataBridge, verbal); 1 Evaluating (GovFlow); 2 Contacted (MainframeNext, Coalfire on OCI hold); 1 Identified (Nightwing). Total committed workshare: 20% of 45% sub-target. Momentum is positive but TA execution is the critical constraint.'}
        </p>
      </Band>

      {/* Intelligence — competitive risks aggregated */}
      <Band icon="intelligence" label="Intelligence — Competitive Risks">
        {data.partnerPipeline.filter(p => p.risks && p.risks.length > 0).map(p => (
          <div key={p.id} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 6 }}>{p.name}</div>
            {p.competitorInterest && (
              <div style={{ padding: '6px 10px', borderRadius: 'var(--gh-radius-md)', marginBottom: 4, background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)', fontSize: 'var(--gh-font-size-base)' }}>
                <Lock size={12} style={{ flexShrink: 0, color: 'var(--gh-warning-fg)' }} />
                <span style={{ color: 'var(--gh-warning-fg)' }}>{p.competitorInterest}</span>
              </div>
            )}
            {p.risks.map((r, i) => (
              <div key={i} style={{ padding: '7px 10px', borderRadius: 'var(--gh-radius-md)', marginBottom: 4, background: r.severity === 'HIGH' ? 'var(--gh-danger-bg)' : 'var(--gh-warning-bg)', border: `1px solid ${r.severity === 'HIGH' ? 'var(--gh-danger-border)' : 'var(--gh-warning-border)'}`, fontSize: 'var(--gh-font-size-base)' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                  <Pill bg={r.severity === 'HIGH' ? 'var(--gh-danger-bg)' : 'var(--gh-warning-bg)'} color={r.severity === 'HIGH' ? 'var(--gh-danger-fg)' : 'var(--gh-warning-fg)'}>{r.severity}</Pill>
                  <span style={{ color: 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-medium)' }}>{r.risk}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--gh-text-secondary)' }}>Mitigation: {r.mitigation}</div>
              </div>
            ))}
          </div>
        ))}
      </Band>
    </>
  );
}

function WorkshareContent({ data, demo }: { data: TD; demo: boolean }) {
  // New JSON: workshareAllocation with prime + subcontractors[]
  const wa   = data.workshareAllocation;
  const sb   = wa.sbSummary;

  // Build unified row list: prime first, then subs
  const primeRow = {
    name: wa.prime.name,
    role: data.teamingStrategy.teamStructure.prime.role,
    workshare: wa.prime.workshare,
    estimatedValue: wa.prime.estimatedValue,
    fte: wa.prime.fte,
    scope: wa.prime.scope,
    sbCategory: wa.prime.sbCategory,
  };

  const subRows = wa.subcontractors.map(s => ({
    name: s.name,
    role: data.teamingStrategy.teamStructure.subcontractors.find(sub => sub.name === s.name)?.role ?? '',
    workshare: s.workshare,
    estimatedValue: s.estimatedValue,
    fte: s.fte,
    scope: s.scope,
    sbCategory: s.sbCategory,
  }));

  const allRows = [primeRow, ...subRows];

  // Demo: zero out DataBridge
  const rows = demo
    ? allRows.map(r => r.name === 'DataBridge Analytics' ? { ...r, workshare: 0, estimatedValue: 0, fte: 0 } : r)
    : allRows;

  const totalWorkshare = rows.reduce((s, r) => s + r.workshare, 0);
  const totalFTE       = rows.reduce((s, r) => s + r.fte, 0);
  const totalValue     = rows.reduce((s, r) => s + r.estimatedValue, 0);
  const belowPlan      = demo;

  const breakdown = sb.breakdown;

  return (
    <>
      <Band icon="facts" label="Facts — Workshare Allocation">
        {belowPlan && (
          <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-danger-bg)', border: '1px solid var(--gh-danger-border)', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-danger-fg)' }}>
            20% / $9.0M hole — DataBridge workshare unallocated. Total drops to {totalWorkshare}%. Below 45% sub-target.
          </div>
        )}
        <div style={{ overflowX: 'auto', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--gh-font-size-base)', fontFamily: F }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gh-border)' }}>
                {['Entity', 'Role', 'Workshare', 'Est. Value', 'FTE', 'SB Category', 'Scope (summary)'].map(h => (
                  <th key={h} style={{ textAlign: 'left', paddingBottom: 8, paddingRight: 12, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const isHole = demo && r.name === 'DataBridge Analytics';
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--gh-border)', opacity: isHole ? 0.5 : 1 }}>
                    <td style={{ padding: '8px 12px 8px 0', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{r.name}</td>
                    <td style={{ padding: '8px 12px 8px 0', color: 'var(--gh-text-secondary)', fontSize: 11, maxWidth: 200 }}>{r.role}</td>
                    <td style={{ padding: '8px 12px 8px 0', color: 'var(--gh-accent-tint)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap' }}>
                      {isHole ? <span style={{ color: 'var(--gh-danger-fg)' }}>0% (withdrawn)</span> : `${r.workshare}%`}
                    </td>
                    <td style={{ padding: '8px 12px 8px 0', color: 'var(--gh-text)', whiteSpace: 'nowrap' }}>{isHole ? '—' : Money(r.estimatedValue)}</td>
                    <td style={{ padding: '8px 12px 8px 0', color: 'var(--gh-text-tertiary)' }}>{isHole ? '—' : r.fte}</td>
                    <td style={{ padding: '8px 12px 8px 0' }}>
                      <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-info-fg)" quiet>{r.sbCategory}</Pill>
                    </td>
                    <td style={{ padding: '8px 12px 8px 0', color: 'var(--gh-text-secondary)', fontSize: 11 }}>
                      {r.scope.slice(0, 2).join(' · ')}{r.scope.length > 2 ? ` +${r.scope.length - 2}` : ''}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: '2px solid var(--gh-border)', background: 'var(--gh-bg-surface)' }}>
                <td style={{ padding: '8px 12px 8px 0', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>Total</td>
                <td />
                <td style={{ padding: '8px 12px 8px 0', fontWeight: 'var(--gh-font-weight-bold)', color: belowPlan ? 'var(--gh-danger-fg)' : 'var(--gh-success-fg)' }}>{totalWorkshare}%</td>
                <td style={{ padding: '8px 12px 8px 0', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)', whiteSpace: 'nowrap' }}>{Money(totalValue)}</td>
                <td style={{ padding: '8px 12px 8px 0', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>{totalFTE}</td>
                <td /><td />
              </tr>
            </tbody>
          </table>
        </div>
        <SourceChips sources={TEAMING_ENVELOPE.sections.workshareSmallBusiness.sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Small Business Summary">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'SB Goal',   value: `${sb.sbGoal}%`,                              color: 'var(--gh-text-tertiary)' },
            { label: 'SB Actual', value: demo ? `${totalWorkshare}%` : `${sb.sbActual}%`, color: demo ? 'var(--gh-danger-fg)' : 'var(--gh-success-fg)' },
          ].map(item => (
            <div key={item.label} style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', textAlign: 'center', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
              <div style={{ fontSize: 'var(--gh-font-size-xl)', fontWeight: 'var(--gh-font-weight-bold)', color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{item.label}</div>
            </div>
          ))}
        </div>
        {/* notes verbatim */}
        <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>{sb.notes}</p>

        {/* breakdown — new JSON uses object {8a, sdvosb, wosb, hubzone, sdb} */}
        <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 8 }}>Socioeconomic Breakdown</div>
        {([
          { key: '8(a)',    pct: breakdown['8a'] },
          { key: 'SDVOSB', pct: breakdown.sdvosb },
          { key: 'WOSB',   pct: breakdown.wosb },
          { key: 'HUBZone',pct: breakdown.hubzone },
          { key: 'SDB',    pct: breakdown.sdb },
        ] as Array<{ key: string; pct: number }>).map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Pill bg="var(--gh-info-bg)" color="var(--gh-info-fg)" quiet>{item.key}</Pill>
            <span style={{ fontSize: 'var(--gh-font-size-base)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', minWidth: 40 }}>{item.pct}%</span>
          </div>
        ))}
      </Band>

      <Band icon="intelligence" label="Intelligence — Evaluator Framing">
        <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0, lineHeight: 1.6 }}>
          A 100% small-business team against a {sb.sbGoal}% SB target creates an evaluator-friendly socioeconomic narrative. TechForward's dual SDVOSB + 8(a) status counts toward two DHS goal categories simultaneously. GovFlow's HUBZone certification adds a third category.
        </p>
      </Band>
    </>
  );
}

// ─── Section detail panel ─────────────────────────────────────────────────────

interface SectionDetailProps {
  sectionKey: TeamingSectionKey;
  env: SectionEnv;
  demoActive: boolean;
  localStatuses: Record<string, 'accepted' | 'proposed' | 'rejected'>;
  onAccept: (id: string) => void;
  onConfirm: () => void;
  onRequestReview: () => void;
  onEdit: () => void;
  onAskAI: () => void;
  confirmed: boolean;
  uiStatus: UiStatus;
  vhExtra?: typeof env.version_history;
  meta: typeof TEAMING_SECTION_META[number];
}

function SectionDetail(props: SectionDetailProps) {
  const { sectionKey, env, demoActive, localStatuses, onAccept, onConfirm, onRequestReview, onEdit, onAskAI, confirmed, vhExtra } = props;
  const isLowConf = env.confidence < 50 || (demoActive && sectionKey === 'partnerPipeline');

  // Demo auto-added rec for CG-01
  const demoCGRec: EnvRec | undefined = demoActive && sectionKey === 'capabilityGaps'
    ? { id: 'CG-R4', text: 'Promote MigrationPro Federal (alternate) to fill CG-01 — TA outreach required', status: 'proposed' }
    : undefined;

  return (
    <DetailPanel
      scrollKey={sectionKey}
      background="var(--gh-bg-canvas)"
      onAskAI={onAskAI}
      actions={() => (
        <>
          <ActionButton variant="ghost" icon={<Edit2 size={15} />} onClick={onEdit}>Edit</ActionButton>
          <ActionButton variant="secondary" icon={<RefreshCw size={15} />} onClick={onRequestReview}>Request Review</ActionButton>
          <ActionButton variant="primary" icon={<Check size={15} />} onClick={onConfirm}>{confirmed ? 'Re-confirm' : 'Confirm'}</ActionButton>
        </>
      )}
    >
      {/* Warning banners — outside bands */}
      {(demoActive && (sectionKey === 'capabilityGaps' || sectionKey === 'partnerPipeline' || sectionKey === 'workshareSmallBusiness') || isLowConf || env.conflicts.length > 0) && (
        <div style={{ padding: '16px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {demoActive && (sectionKey === 'capabilityGaps' || sectionKey === 'partnerPipeline' || sectionKey === 'workshareSmallBusiness') && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)' }}>
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-warning-fg)' }} />
              <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontFamily: F }}>
                Change detected — CG-01 reopened; downstream flagged for regeneration: Staffing, Pricing, Workshare.
              </p>
            </div>
          )}
          {isLowConf && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)' }}>
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-warning-fg)' }} />
              <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontFamily: F }}>
                This recommendation is based on limited data. Run ANALYZE workflow for better intelligence.
              </p>
            </div>
          )}
          {env.conflicts.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)' }}>
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gh-warning-fg)' }} />
              <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', margin: 0, fontFamily: F }}>
                <strong>Conflict:</strong> {c.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* AI Reasoning — standalone card matching Strategy */}
      <div style={{ margin: 24, display: 'flex', gap: 12, alignItems: 'flex-start', padding: 24, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-elevated)' }}>
        <Sparkles size={14} style={{ flexShrink: 0, marginTop: 2, color: 'var(--gh-accent-tint)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-accent-tint)', fontFamily: F }}>AI Reasoning</span>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--gh-text-secondary)', margin: 0, fontFamily: F }}>{env.ai_reasoning}</p>
        </div>
      </div>

      {/* FAIR content — each renders its own Facts / Analysis / Intelligence bands */}
      {sectionKey === 'teamingStrategy'        && <TeamingStrategyContent data={teamingData as TD} demo={demoActive} />}
      {sectionKey === 'capabilityGaps'          && <CapabilityGapsContent data={teamingData as TD} demo={demoActive} />}
      {sectionKey === 'partnerPipeline'         && <PartnerPipelineContent data={teamingData as TD} demo={demoActive} />}
      {sectionKey === 'workshareSmallBusiness'  && <WorkshareContent data={teamingData as TD} demo={demoActive} />}

      {/* Recommendations */}
      <RecsBand
        env={env}
        localStatuses={localStatuses}
        onAccept={onAccept}
        demo={demoActive && sectionKey === 'capabilityGaps'}
        demoAddedRec={demoCGRec}
      />

      {/* Footer */}
      <div style={{ padding: '12px 24px', borderTop: '1px solid var(--gh-border)' }}>
        <div style={{ fontSize: 11, color: 'var(--gh-text-disabled)', marginBottom: 4, fontFamily: F }}>
          Last reviewed 2026-02-10 · Teaming Intelligence Agent v3
        </div>
        <VersionHistoryFooter env={env} vhExtra={vhExtra} />
      </div>
    </DetailPanel>
  );
}


// ─── Main TeaingTab component ─────────────────────────────────────────────────

const CHAT_SEED = [
  { q: 'Why is Partner Pipeline confidence only 58%?', a: 'No teaming agreement is signed yet and CACI/Vertex is competing for both DataBridge and GovFlow. Confidence rises to ~75% once DataBridge TA is executed with exclusivity.' },
  { q: 'What happens if Coalfire OCI is confirmed?', a: 'Coalfire exits the pipeline; substitute with A-LIGN Federal or Schellman & Company for 3PAO coverage. The workshare rail is unaffected since Coalfire was advisory (0% workshare).' },
];

const DEMO_VH_EXTRA = {
  partnerPipeline: [
    ...TEAMING_ENVELOPE.sections.partnerPipeline.version_history,
    { version: 2, changed_at: '2026-02-12', changed_by: 'S. Chen', change_summary: 'DataBridge withdrawn — partner no longer bidding; CG-01 reopened; cascade to Staffing, Pricing, Workshare' },
  ],
};

export function TeamingTab({ chromeHidden = false }: { chromeHidden?: boolean }) {
  const [selectedKey, setSelectedKey] = useState<TeamingSectionKey>('teamingStrategy');
  const [confirmedKeys, setConfirmedKeys] = useState<Set<TeamingSectionKey>>(new Set(['teamingStrategy']));
  const [uiOverrides, setUiOverrides] = useState<Partial<Record<TeamingSectionKey, UiStatus>>>({ teamingStrategy: 'confirmed' });
  const [recStatuses, setRecStatuses] = useState<Record<string, Record<string, 'accepted' | 'proposed' | 'rejected'>>>({});
  const [aiSection, setAiSection] = useState<string | null>(null);
  const [demoActive, setDemoActive] = useState(false);
  const [confirmToast, setConfirmToast] = useState<string | null>(null);

  // Demo state overrides
  const demoPiplineStatus: Partial<Record<TeamingSectionKey, UiStatus>> = {
    teamingStrategy: 'confirmed',
    capabilityGaps: 'needs_review',
    partnerPipeline: 'needs_review',
    workshareSmallBusiness: 'needs_review',
  };
  const demoConfirmed = new Set<TeamingSectionKey>(['teamingStrategy']);
  const demoFlagged = new Set<TeamingSectionKey>(['capabilityGaps', 'partnerPipeline', 'workshareSmallBusiness']);

  const activeConfirmed = demoActive ? demoConfirmed : confirmedKeys;
  const activeOverrides = demoActive ? demoPiplineStatus : uiOverrides;
  const activeFlagged   = demoActive ? demoFlagged   : new Set<TeamingSectionKey>();
  const confirmedCount  = activeConfirmed.size;

  const getUiStatus = (key: TeamingSectionKey): UiStatus =>
    activeOverrides[key] ?? 'draft';

  const getEnv = (key: TeamingSectionKey) => TEAMING_ENVELOPE.sections[key];

  const handleConfirm = (key: TeamingSectionKey) => {
    if (demoActive) return;
    setConfirmedKeys(prev => new Set([...prev, key]));
    setUiOverrides(prev => ({ ...prev, [key]: 'confirmed' }));
    const meta = TEAMING_SECTION_META.find(m => m.key === key);
    setConfirmToast(`${meta?.title} confirmed — feeds: ${(meta?.feeds ?? []).join(', ')}`);
    setTimeout(() => setConfirmToast(null), 4000);
  };

  const handleReview = (key: TeamingSectionKey) => {
    if (demoActive) return;
    setUiOverrides(prev => ({ ...prev, [key]: 'needs_review' }));
  };

  const handleAccept = (sectionKey: TeamingSectionKey, recId: string) => {
    if (demoActive) return;
    setRecStatuses(prev => ({ ...prev, [sectionKey]: { ...(prev[sectionKey] ?? {}), [recId]: 'accepted' } }));
  };

  const selectedMeta = TEAMING_SECTION_META.find(m => m.key === selectedKey)!;
  const selectedEnv  = getEnv(selectedKey);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: F }}>
      {/* Confirm toast */}
      {confirmToast && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 70, maxWidth: 380, padding: '10px 16px', borderRadius: 'var(--gh-radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--gh-success-bg)', border: '1px solid var(--gh-success-border)', color: 'var(--gh-success-fg)', fontFamily: F }}>
          <span style={{ flex: 1, fontSize: 'var(--gh-font-size-base)' }}>{confirmToast}</span>
          <button onClick={() => setConfirmToast(null)} style={{ background: 'transparent', cursor: 'pointer', color: 'var(--gh-success-fg)' }}><X size={14} /></button>
        </div>
      )}

      {/* Ask AI drawer */}
      {aiSection && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }} onClick={() => setAiSection(null)} />
          <AskAIDrawer sectionTitle={aiSection} chatSeed={CHAT_SEED} onClose={() => setAiSection(null)} />
        </>
      )}

      {/* Plan header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '0 var(--gh-space-12) 12px', flexShrink: 0, overflow: 'hidden', maxHeight: chromeHidden ? 0 : 120, opacity: chromeHidden ? 0 : 1, transition: 'max-height 0.3s ease, opacity 0.18s ease' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>
              {confirmedCount} of {TEAMING_SECTION_META.length} confirmed
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', background: 'var(--gh-warning-bg)', color: 'var(--gh-warning-fg)', fontFamily: F }}>
              {TEAMING_ENVELOPE.overall_confidence}% confidence
              <Info size={13} />
            </span>
          </div>
          <p style={{ fontSize: 11, color: '#fff', margin: 0, fontFamily: F }}>
            {TEAMING_ENVELOPE.generated_by}
          </p>
        </div>
      </div>

      {/* Master / detail — shared shell (section index left + detail) */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Shared collapsible/resizable section index */}
        <SectionIndex
          title="Sections"
          renderItems={(narrow) => TEAMING_SECTION_META.map(meta => {
            const conf = demoActive && meta.key === 'partnerPipeline' ? 46 :
                         demoActive && meta.key === 'capabilityGaps' ? 55 :
                         getEnv(meta.key).confidence;
            return (
              <SectionIndexItem
                key={meta.key}
                title={meta.title}
                subtitle={meta.feeds.join(', ')}
                confidence={conf}
                confirmed={activeConfirmed.has(meta.key)}
                selected={meta.key === selectedKey}
                flagged={activeFlagged.has(meta.key)}
                narrow={narrow}
                onSelect={() => setSelectedKey(meta.key)}
              />
            );
          })}
        />

        {/* Detail */}
        <div key={selectedKey} style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--gh-bg-canvas)' }}>
          <SectionDetail
            sectionKey={selectedKey}
            meta={selectedMeta}
            env={selectedEnv}
            demoActive={demoActive}
            localStatuses={recStatuses[selectedKey] ?? {}}
            onAccept={id => handleAccept(selectedKey, id)}
            onConfirm={() => handleConfirm(selectedKey)}
            onRequestReview={() => handleReview(selectedKey)}
            onEdit={() => handleReview(selectedKey)}
            onAskAI={() => setAiSection(selectedMeta.title)}
            confirmed={activeConfirmed.has(selectedKey)}
            uiStatus={getUiStatus(selectedKey)}
            vhExtra={demoActive ? DEMO_VH_EXTRA[selectedKey as keyof typeof DEMO_VH_EXTRA] : undefined}
          />
        </div>
      </div>
    </div>
  );
}

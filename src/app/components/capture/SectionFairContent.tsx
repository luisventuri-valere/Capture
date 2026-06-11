import { useState } from 'react';
import { ClipboardList, Search, Lightbulb, ListChecks, Bot, Paperclip, Lock, BarChart2, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';

const BAND_ICONS: Record<string, React.ReactNode> = {
  facts:           <ClipboardList size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />,
  analysis:        <Search       size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />,
  intelligence:    <Lightbulb   size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />,
  recommendations: <ListChecks  size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />,
};
import type {
  StrategicPositioningSection,
  WinStrategySection,
  TeamStrategySection,
  CustomerEngagementSection,
  StaffingStrategySection,
  PastPerformanceSection,
  PricingStrategySection,
  TimelineSection,
  RiskRegisterSection,
  ResourcePlanSection,
  StrategyData,
} from '../../../types/strategy';

const F = 'var(--gh-font)';

// ─── Primitives ───────────────────────────────────────────────────────────────

function Band({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  const iconNode = BAND_ICONS[icon] ?? null;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {iconNode}
        <span style={{ fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: F }}>
          {label}
        </span>
      </div>
      <div style={{ color: 'var(--gh-text)', fontFamily: F }}>{children}</div>
    </div>
  );
}

// Fix 3: two variants — primary (decision-critical) and normal
function KV({ label, value, primary }: { label: string; value: React.ReactNode; primary?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 'var(--gh-font-size-base)' }}>
      <span style={{
        fontWeight: primary ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-normal)',
        color: primary ? 'var(--gh-text-secondary)' : 'var(--gh-text-tertiary)',
        minWidth: 180, flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        color: 'var(--gh-text)',
        fontWeight: primary ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-normal)',
      }}>
        {value}
      </span>
    </div>
  );
}

// Fix 6: quiet pill — reduced saturation + letter-spacing; only attention states stay loud
function Pill({ children, bg, color, quiet }: { children: React.ReactNode; bg: string; color: string; quiet?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: quiet ? '1px 7px' : '2px 8px',
      borderRadius: 'var(--gh-radius-full)',
      fontSize: quiet ? 10 : 11,
      fontWeight: 'var(--gh-font-weight-medium)',
      letterSpacing: '0.04em',
      background: bg, color, fontFamily: F,
    }}>
      {children}
    </span>
  );
}

function Card({ children, warn }: { children: React.ReactNode; warn?: boolean }) {
  return (
    <div style={{ padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', marginBottom: 10, background: warn ? 'var(--gh-warning-bg)' : 'var(--gh-bg-surface)', border: `1px solid ${warn ? 'var(--gh-warning-border)' : 'var(--gh-border)'}` }}>
      {children}
    </div>
  );
}

function Money(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// Fix 6: attention states = saturated; routine states = quiet (desaturated, small)
function StatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  // Attention states — full saturation
  const attention: Record<string, [string, string]> = {
    NEEDS_REVIEW: ['var(--gh-warning-bg)', 'var(--gh-warning-fg)'],
    MONITORING:   ['var(--gh-warning-bg)', 'var(--gh-warning-fg)'],
    ACTIVE:       ['var(--gh-warning-bg)', 'var(--gh-warning-fg)'],
  };
  // Routine positive — quiet
  const routinePos: Record<string, [string, string]> = {
    CONFIRMED:  ['var(--gh-bg-surface-muted)', 'var(--gh-success-fg)'],
    COMPLETED:  ['var(--gh-bg-surface-muted)', 'var(--gh-success-fg)'],
    LOI_SIGNED: ['var(--gh-bg-surface-muted)', 'var(--gh-success-fg)'],
    COMMITTED:  ['var(--gh-bg-surface-muted)', 'var(--gh-success-fg)'],
  };
  // Routine neutral — quietest
  const routineNeutral: Record<string, [string, string]> = {
    IN_PROGRESS: ['var(--gh-bg-surface-muted)', 'var(--gh-info-fg)'],
    NEGOTIATING: ['var(--gh-bg-surface-muted)', 'var(--gh-info-fg)'],
    CONTACTED:   ['var(--gh-bg-surface-muted)', 'var(--gh-info-fg)'],
    PARTNER:     ['var(--gh-bg-surface-muted)', 'var(--gh-info-fg)'],
    DRAFT:       ['var(--gh-bg-surface-muted)', 'var(--gh-text-tertiary)'],
    PENDING:     ['var(--gh-bg-surface-muted)', 'var(--gh-text-tertiary)'],
    IDENTIFIED:  ['var(--gh-bg-surface-muted)', 'var(--gh-text-tertiary)'],
    SOURCING:    ['var(--gh-bg-surface-muted)', 'var(--gh-text-tertiary)'],
  };
  if (attention[s]) {
    const [bg, color] = attention[s];
    return <Pill bg={bg} color={color}>{status}</Pill>;
  }
  const [bg, color] = routinePos[s] ?? routineNeutral[s] ?? ['var(--gh-bg-surface)', 'var(--gh-text-tertiary)'];
  return <Pill bg={bg} color={color} quiet>{status}</Pill>;
}

function RiskScorePill({ score }: { score: number }) {
  const bg = score >= 12 ? 'var(--gh-danger-bg)' : score >= 8 ? 'var(--gh-warning-bg)' : 'var(--gh-success-bg)';
  const color = score >= 12 ? 'var(--gh-danger-fg)' : score >= 8 ? 'var(--gh-warning-fg)' : 'var(--gh-success-fg)';
  // Risk scores are always attention-relevant — never quieted
  return <Pill bg={bg} color={color}>Score {score}</Pill>;
}

// Fix 2: Table with row-collapse for 4+ rows
function Table({ headers, rows, maxRows = 999 }: { headers: string[]; rows: (React.ReactNode)[][]; maxRows?: number }) {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse = rows.length > maxRows;
  const visible = shouldCollapse && !expanded ? rows.slice(0, maxRows) : rows;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--gh-font-size-base)', fontFamily: F }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--gh-border)' }}>
            {headers.map(h => (
              <th key={h} style={{ textAlign: 'left', paddingBottom: 8, paddingRight: 16, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--gh-border)' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '8px 16px 8px 0', verticalAlign: 'top', color: 'var(--gh-text)' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {shouldCollapse && (
        <button
          onClick={() => setExpanded(v => !v)}
          style={{ marginTop: 8, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-accent-tint)', background: 'transparent', cursor: 'pointer', fontFamily: F, padding: 0 }}
        >
          {expanded ? 'Show fewer' : `Show all ${rows.length}`}
        </button>
      )}
    </div>
  );
}

// Fix 2: Collapse wrapper for card-list enumerations
function CollapseList({ items, maxItems = 3, renderItem }: {
  items: unknown[];
  maxItems?: number;
  renderItem: (item: unknown, i: number) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse = items.length > maxItems;
  const visible = shouldCollapse && !expanded ? items.slice(0, maxItems) : items;
  return (
    <>
      {visible.map((item, i) => renderItem(item, i))}
      {shouldCollapse && (
        <button
          onClick={() => setExpanded(v => !v)}
          style={{ marginTop: 4, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-accent-tint)', background: 'transparent', cursor: 'pointer', fontFamily: F, padding: 0 }}
        >
          {expanded ? 'Show fewer' : `Show all ${items.length}`}
        </button>
      )}
    </>
  );
}

// ─── Source chips row ─────────────────────────────────────────────────────────

export function SourceChipsRow({ sources }: { sources?: Array<{ label: string }> }) {
  if (!sources?.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--gh-border)' }}>
      {sources.map((s, i) => (
        <span
          key={i}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 'var(--gh-radius-full)', fontSize: 11, background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-secondary)', border: '1px solid var(--gh-border)', fontFamily: F }}
        >
          <Paperclip size={11} /> {s.label}
        </span>
      ))}
    </div>
  );
}

// ─── §1 Strategic Positioning ─────────────────────────────────────────────────

function StrategicPositioningContent({ data, sources }: { data: StrategicPositioningSection; sources?: Array<{label: string}> }) {
  const p = data.positioning;
  return (
    <>
      <Band icon="facts" label="Facts">
        {/* Fix 3: Prime/Sub, Set-Aside, Estimated Value are decision-critical */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
          <KV label="Prime / Sub"           value={p.primeOrSub}              primary />
          <KV label="Set-Aside"             value={p.setAsideCategory}        primary />
          <KV label="Estimated Value"       value={Money(p.estimatedValue)}   primary />
          <KV label="Vehicle"               value={p.vehicle} />
          <KV label="Competition Type"      value={p.competitionType} />
          <KV label="NAICS"                 value={p.naics} />
          <KV label="PSC Code"              value={p.pscCode} />
          <KV label="Contract Type"         value={p.contractType} />
          <KV label="Period of Performance" value={p.periodOfPerformance} />
          <KV label="Base Year Value"       value={Money(p.baseYearValue)} />
          <KV label="Option Year Value"     value={`${Money(p.optionYearValue)} / yr`} />
          <KV label="Target Award Date"     value={p.targetAwardDate} />
          <KV label="SB Target"             value={`${p.sbTarget}%`} />
          <KV label="SB Target Basis"       value={p.sbTargetBasis} />
        </div>
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis">
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 10 }}>
            pWin: <span style={{ color: 'var(--gh-accent-tint)', fontSize: 'var(--gh-font-size-lg)' }}>{p.pwin}%</span>
          </div>
          <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-medium)', color: 'var(--gh-text-tertiary)', marginBottom: 8 }}>pWin History</div>
          {(p.pwinHistory ?? []).map((pt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6, fontSize: 'var(--gh-font-size-base)' }}>
              <span style={{ color: 'var(--gh-text-tertiary)', minWidth: 96, flexShrink: 0 }}>{pt.date}</span>
              <span style={{ fontWeight: 'var(--gh-font-weight-bold)', minWidth: 40, color: pt.pwin >= 35 ? 'var(--gh-success-fg)' : pt.pwin >= 28 ? 'var(--gh-warning-fg)' : 'var(--gh-danger-fg)' }}>
                {pt.pwin}%
              </span>
              <span style={{ color: 'var(--gh-text-tertiary)' }}>{pt.trigger}</span>
            </div>
          ))}
        </div>
      </Band>

      <Band icon="intelligence" label="Intelligence">
        <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0 }}>
          Prime positioning on {p.vehicle} under {p.competitionType}. SB target {p.sbTarget}% — basis: {p.sbTargetBasis}.
        </p>
      </Band>
    </>
  );
}

// ─── §2 Win Strategy ──────────────────────────────────────────────────────────

function WinStrategyContent({ data, sources }: { data: WinStrategySection; sources?: Array<{label: string}> }) {
  return (
    <>
      <Band icon="facts" label="Facts — Evaluation Factor Targets">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(data.winThemes ?? []).map(wt => (
            <div key={wt.id} style={{ display: 'flex', gap: 12, fontSize: 'var(--gh-font-size-base)' }}>
              <span style={{ color: 'var(--gh-text-tertiary)', minWidth: 52, flexShrink: 0 }}>{wt.id}</span>
              <span style={{ color: 'var(--gh-text-tertiary)', minWidth: 200, flexShrink: 0 }}>{wt.evaluationFactorTarget}</span>
              <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-success-fg)" quiet>{wt.strengthRating}</Pill>
            </div>
          ))}
        </div>
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Win Themes">
        {(data.winThemes ?? []).map(wt => (
          <Card key={wt.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)' }}>{wt.id}</span>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{wt.theme}</span>
              <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-success-fg)" quiet>{wt.strengthRating}</Pill>
            </div>
            <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', marginBottom: 8 }}>{wt.narrative}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(wt.evidenceAnchors ?? []).map((e, i) => (
                <Pill key={i} bg="var(--gh-bg-surface-muted)" color="var(--gh-text-secondary)" quiet>{e}</Pill>
              ))}
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--gh-text-tertiary)' }}>
              Eval target: {wt.evaluationFactorTarget}
            </div>
          </Card>
        ))}
      </Band>

      <Band icon="intelligence" label="Intelligence — Discriminators vs. Competitors">
        {(data.discriminators ?? []).map(d => (
          <Card key={d.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)' }}>{d.id}</span>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{d.discriminator}</span>
              <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-info-fg)" quiet>{d.category}</Pill>
            </div>
            <KV label="Impact"  value={d.impact} />
            <KV label="Proof"   value={d.proof} />
            <div style={{ marginTop: 6, fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)', fontStyle: 'italic' }}>
              <Lock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Competitor gap: {d.competitorGap}
            </div>
          </Card>
        ))}
      </Band>
    </>
  );
}

// ─── §3 Team Strategy ─────────────────────────────────────────────────────────

function TeamStrategyContent({ data, sources }: { data: TeamStrategySection; sources?: Array<{label: string}> }) {
  return (
    <>
      <Band icon="facts" label="Facts — Capability Gaps">
        {(data.capabilityGaps ?? []).map(g => (
          <Card key={g.id} warn={g.severity === 'HIGH'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{g.id}</span>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{g.gap}</span>
              <Pill bg={g.severity === 'HIGH' ? 'var(--gh-danger-bg)' : 'var(--gh-warning-bg)'} color={g.severity === 'HIGH' ? 'var(--gh-danger-fg)' : 'var(--gh-warning-fg)'}>{g.severity}</Pill>
              <StatusPill status={g.status} />
            </div>
            <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', marginBottom: 6 }}>{g.description}</p>
            <KV label="Recommendation" value={g.recommendation} />
            <KV label="Target Partner"  value={g.targetPartner} />
          </Card>
        ))}
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Recommended Partners">
        <Table
          headers={['Partner', 'Role', 'Workshare', 'Status', 'Risk']}
          rows={(data.recommendedPartners ?? []).map(p => [
            <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{p.name}</span>,
            p.role,
            `${p.workshare}%`,
            <StatusPill status={p.status} />,
            <Pill bg={p.riskLevel === 'LOW' ? 'var(--gh-bg-surface-muted)' : 'var(--gh-warning-bg)'} color={p.riskLevel === 'LOW' ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)'} quiet={p.riskLevel === 'LOW'}>{p.riskLevel}</Pill>,
          ])}
        />
      </Band>

      <Band icon="intelligence" label="Intelligence — Partner Risk Notes">
        {(data.recommendedPartners ?? []).map(p => (
          <div key={p.name} style={{ marginBottom: 10, fontSize: 'var(--gh-font-size-base)' }}>
            <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{p.name}: </span>
            <span style={{ color: 'var(--gh-text-secondary)' }}>{p.rationale}</span>
            {p.riskNotes && (
              <div style={{ marginTop: 4, color: 'var(--gh-warning-fg)', fontStyle: 'italic', fontSize: 11 }}><Lock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {p.riskNotes}</div>
            )}
          </div>
        ))}
      </Band>
    </>
  );
}

// ─── §4 Customer Engagement ───────────────────────────────────────────────────

function CustomerEngagementContent({ data, sources }: { data: CustomerEngagementSection; sources?: Array<{label: string}> }) {
  const strengthStyle = (s: string): [string, string] => {
    if (s === 'WARM') return ['var(--gh-bg-surface-muted)', 'var(--gh-success-fg)'];
    if (s === 'COLD') return ['var(--gh-bg-surface-muted)', 'var(--gh-danger-fg)'];
    return ['var(--gh-bg-surface-muted)', 'var(--gh-text-tertiary)'];
  };

  const rels = data.keyRelationships ?? [];

  return (
    <>
      <Band icon="facts" label="Facts — Key Relationships">
        {/* Fix 2: collapse to 3 */}
        <Table
          maxRows={3}
          headers={['Name / Title', 'Organization', 'Strength', 'Last Contact', 'Contact Method']}
          rows={rels.map(r => {
            const [bg, color] = strengthStyle(r.relationshipStrength);
            return [
              <div>
                <div style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{r.title}</div>
              </div>,
              r.organization,
              <Pill bg={bg} color={color} quiet>{r.relationshipStrength}</Pill>,
              r.lastContact ?? '—',
              r.contactMethod ?? '—',
            ];
          })}
        />
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Engagement Notes">
        {rels.map(r => (
          <Card key={r.name}>
            <div style={{ fontWeight: 'var(--gh-font-weight-semibold)', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)', marginBottom: 4 }}>
              {r.name} — {r.title}
            </div>
            <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', marginBottom: 6 }}>{r.notes}</p>
          </Card>
        ))}
      </Band>

      <Band icon="intelligence" label="Intelligence — Next Actions">
        {rels.filter(r => r.nextAction).map(r => (
          <div key={r.name} style={{ display: 'flex', gap: 12, marginBottom: 10, padding: '8px 12px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', fontSize: 'var(--gh-font-size-base)' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{r.name}: </span>
              <span style={{ color: 'var(--gh-text-secondary)' }}>{r.nextAction}</span>
            </div>
            <div style={{ flexShrink: 0, fontSize: 11, color: 'var(--gh-text-tertiary)', textAlign: 'right' }}>
              {r.nextActionDate ?? 'No date'}<br />
              <span style={{ color: 'var(--gh-text-disabled)' }}>{r.owner}</span>
            </div>
          </div>
        ))}
      </Band>
    </>
  );
}

// ─── §5 Staffing Strategy ─────────────────────────────────────────────────────

function StaffingStrategyContent({ data, sources }: { data: StaffingStrategySection; sources?: Array<{label: string}> }) {
  const cl = data.clearancePipeline;
  return (
    <>
      <Band icon="facts" label="Facts — Critical Positions">
        {/* Fix 2: collapse 8 rows to 3 */}
        <Table
          maxRows={3}
          headers={['LCAT', 'Designation', 'Clearance', 'Candidate', 'Source', 'Start', 'Status']}
          rows={(data.criticalPositions ?? []).map(pos => [
            <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{pos.lcat}</span>,
            <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-info-fg)" quiet>{pos.designation}</Pill>,
            pos.clearance,
            pos.candidate ?? <span style={{ color: 'var(--gh-text-disabled)' }}>TBD</span>,
            pos.source,
            pos.startDate,
            <StatusPill status={pos.status} />,
          ])}
        />
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Clearance Pipeline">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'TS/SCI Active', value: cl.tsScicurrent },
            { label: 'Secret Active', value: cl.secretCurrent },
            { label: 'In Process',    value: cl.inProcess },
          ].map(item => (
            <div key={item.label} style={{ padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', textAlign: 'center', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
              <div style={{ fontSize: 'var(--gh-font-size-xl)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>{item.value}</div>
              <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{item.label}</div>
            </div>
          ))}
        </div>
        <KV label="Avg. Time to Fill"   value={cl.averageTimeToFill} />
        <KV label="Recruiting Partners" value={cl.recruitingPartners.join(', ')} />
      </Band>

      <Band icon="intelligence" label="Intelligence — Position Notes">
        {(data.criticalPositions ?? []).filter(p => p.notes).map((pos, i) => (
          <div key={i} style={{ marginBottom: 8, fontSize: 'var(--gh-font-size-base)' }}>
            <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{pos.lcat}: </span>
            <span style={{ color: 'var(--gh-text-secondary)' }}>{pos.notes}</span>
          </div>
        ))}
      </Band>
    </>
  );
}

// ─── §6 Past Performance ──────────────────────────────────────────────────────

function PastPerformanceContent({ data, sources }: { data: PastPerformanceSection; sources?: Array<{label: string}> }) {
  const ratingStyle = (r: string): [string, string] =>
    r === 'Exceptional' ? ['var(--gh-bg-surface-muted)', 'var(--gh-success-fg)'] :
    ['var(--gh-bg-surface-muted)', 'var(--gh-info-fg)'];

  return (
    <>
      <Band icon="facts" label="Facts — Lead References">
        {(data.leadReferences ?? []).map(ref => {
          const [bg, color] = ratingStyle(ref.cparsRating);
          return (
            <Card key={ref.contractNumber}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 'var(--gh-font-weight-semibold)', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)', marginBottom: 2 }}>{ref.contractName}</div>
                  <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{ref.contractNumber} · {ref.agency} / {ref.component}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{Money(ref.contractValue)}</span>
                  <Pill bg={bg} color={color} quiet>CPARS: {ref.cparsRating}</Pill>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 16px', marginBottom: 8 }}>
                <KV label="Contract Type" value={ref.contractType} />
                <KV label="Period" value={ref.periodOfPerformance} />
                <KV label="COR" value={`${ref.cor.name} · ${ref.cor.email}`} />
                <KV label="Relevance" value={
                  <Pill
                    bg={ref.relevance === 'CRITICAL' ? 'var(--gh-danger-bg)' : ref.relevance === 'HIGH' ? 'var(--gh-warning-bg)' : 'var(--gh-bg-surface)'}
                    color={ref.relevance === 'CRITICAL' ? 'var(--gh-danger-fg)' : ref.relevance === 'HIGH' ? 'var(--gh-warning-fg)' : 'var(--gh-text-tertiary)'}
                  >{ref.relevance}</Pill>
                } />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {(ref.relevanceFactors ?? []).map((rf, i) => <Pill key={i} bg="var(--gh-bg-surface-muted)" color="var(--gh-info-fg)" quiet>{rf}</Pill>)}
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)' }}>
                {(ref.highlights ?? []).map((h, i) => <li key={i} style={{ marginBottom: 3 }}>{h}</li>)}
              </ul>
            </Card>
          );
        })}
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Relevance to This Pursuit">
        <Table
          headers={['Reference', 'Rating', 'Relevance', 'Key Factors']}
          rows={(data.leadReferences ?? []).map(ref => {
            const [bg, color] = ratingStyle(ref.cparsRating);
            return [
              ref.contractName,
              <Pill bg={bg} color={color} quiet>{ref.cparsRating}</Pill>,
              ref.relevance,
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{(ref.relevanceFactors ?? []).slice(0, 2).map((f, i) => <Pill key={i} bg="var(--gh-bg-surface-muted)" color="var(--gh-text-secondary)" quiet>{f}</Pill>)}</div>,
            ];
          })}
        />
      </Band>

      <Band icon="intelligence" label="Intelligence — Partner References">
        {(data.partnerReferences ?? []).map(pr => (
          <Card key={pr.contractNumber}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{pr.partner} — {pr.contractName}</span>
              <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-info-fg)" quiet>CPARS: {pr.cparsRating}</Pill>
            </div>
            <KV label="Agency"    value={pr.agency} />
            <KV label="Value"     value={Money(pr.contractValue)} />
            <KV label="Relevance" value={pr.relevance} />
            <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)' }}>
              {(pr.highlights ?? []).map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </Card>
        ))}
      </Band>
    </>
  );
}

// ─── §7 Pricing Strategy ──────────────────────────────────────────────────────

function PricingStrategyContent({ data, sources }: { data: PricingStrategySection; sources?: Array<{label: string}> }) {
  const m = data.marginTargets;
  return (
    <>
      <Band icon="facts" label="Facts">
        {/* Fix 3: PTW and blended rate are decision-critical */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
          <KV label="Price to Win (PTW)"    value={Money(data.priceToWin)}       primary />
          <KV label="Blended Rate"          value={`$${data.blendedRate}/hr`}    primary />
          <KV label="Overall Margin Target" value={`${m.overall}%`}              primary />
          <KV label="Key Personnel Margin"  value={`${m.keyPersonnel}%`} />
          <KV label="Commodity Labor"       value={`${m.commodityLabor}%`} />
          <KV label="ODCs"                  value={`${m.odcs}%`} />
          <KV label="Subcontractors"        value={`${m.subcontractors}%`} />
        </div>
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis">
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 6 }}>PTW Basis</div>
          <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0 }}>{data.ptw_basis}</p>
        </div>
        <div>
          <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 6 }}>Pricing Philosophy</div>
          <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0 }}>{data.philosophy}</p>
        </div>
      </Band>

      <Band icon="intelligence" label="Intelligence — Competitor Rates &amp; Risks">
        <Table
          headers={['Competitor', 'Est. Rate', 'Basis', 'Gap vs Ours']}
          rows={(data.competitorRateEstimates ?? []).map(c => [
            c.competitor,
            `$${c.estimatedRate}/hr`,
            c.basis,
            <span style={{ color: data.blendedRate < c.estimatedRate ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)' }}>
              {data.blendedRate < c.estimatedRate ? `$${c.estimatedRate - data.blendedRate} lower` : `$${data.blendedRate - c.estimatedRate} higher`}
            </span>,
          ])}
        />
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 8 }}>Pricing Risks</div>
          {(data.pricingRisks ?? []).map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 'var(--gh-font-size-base)' }}>
              <AlertTriangle size={13} style={{ color: 'var(--gh-warning-fg)', flexShrink: 0 }} />
              <span style={{ color: 'var(--gh-text-secondary)' }}>{r}</span>
            </div>
          ))}
        </div>
      </Band>
    </>
  );
}

// ─── §8 Timeline ──────────────────────────────────────────────────────────────

function TimelineContent({ data, sources }: { data: TimelineSection; sources?: Array<{label: string}> }) {
  const milestoneStatusStyle = (s: string): [string, string] => {
    const u = s?.toUpperCase();
    if (u === 'COMPLETED') return ['var(--gh-bg-surface-muted)', 'var(--gh-success-fg)'];
    if (u === 'IN_PROGRESS') return ['var(--gh-bg-surface-muted)', 'var(--gh-info-fg)'];
    return ['var(--gh-bg-surface-muted)', 'var(--gh-text-tertiary)'];
  };

  const milestones = data.milestones ?? [];

  return (
    <>
      <Band icon="facts" label="Facts — Milestones">
        {/* Fix 2: collapse 8 milestones to 3 */}
        <CollapseList
          items={milestones}
          maxItems={3}
          renderItem={(item, i) => {
            const ms = item as typeof milestones[0];
            const [bg, color] = milestoneStatusStyle(ms.status);
            return (
              <div key={ms.id} style={{ display: 'flex', gap: 12, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', marginBottom: 8, background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
                <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)', fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)' }}>{ms.milestone}</span>
                    <Pill bg={bg} color={color} quiet>{ms.status}</Pill>
                    <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginLeft: 'auto' }}>{ms.date}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginBottom: 4 }}>Owner: {ms.owner}</div>
                  {ms.notes && <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: '0 0 6px' }}>{ms.notes}</p>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(ms.deliverables ?? []).map((d, j) => <Pill key={j} bg="var(--gh-bg-surface-muted)" color="var(--gh-text-secondary)" quiet>{d}</Pill>)}
                  </div>
                </div>
              </div>
            );
          }}
        />
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Critical Path">
        <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0 }}>
          {milestones.filter(m => m.status === 'IN_PROGRESS').length} milestone(s) in progress.
          Next gate: <strong style={{ color: 'var(--gh-text)' }}>{milestones.find(m => m.status === 'IN_PROGRESS' || m.status === 'PENDING')?.milestone ?? '—'}</strong>
          {' '}({milestones.find(m => m.status === 'IN_PROGRESS' || m.status === 'PENDING')?.date ?? ''}).
        </p>
      </Band>
    </>
  );
}

// ─── §9 Risk Register ─────────────────────────────────────────────────────────

function RiskRegisterContent({ data, sources }: { data: RiskRegisterSection; sources?: Array<{label: string}> }) {
  const risks = data.risks ?? [];
  return (
    <>
      <Band icon="facts" label="Facts — Risk Matrix">
        {/* Fix 2: collapse 5 risks to 3 */}
        <Table
          maxRows={3}
          headers={['ID', 'Risk', 'Category', 'Likelihood', 'Impact', 'Score', 'Status']}
          rows={risks.map(r => [
            <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{r.id}</span>,
            <span style={{ fontWeight: 'var(--gh-font-weight-medium)', color: 'var(--gh-text)' }}>{r.risk}</span>,
            r.category,
            <Pill bg={r.likelihoodScore >= 4 ? 'var(--gh-danger-bg)' : r.likelihoodScore >= 3 ? 'var(--gh-warning-bg)' : 'var(--gh-bg-surface-muted)'} color={r.likelihoodScore >= 4 ? 'var(--gh-danger-fg)' : r.likelihoodScore >= 3 ? 'var(--gh-warning-fg)' : 'var(--gh-text-tertiary)'} quiet={r.likelihoodScore < 3}>{r.likelihood}</Pill>,
            <Pill bg={r.impactScore >= 5 ? 'var(--gh-danger-bg)' : r.impactScore >= 4 ? 'var(--gh-warning-bg)' : 'var(--gh-bg-surface-muted)'} color={r.impactScore >= 5 ? 'var(--gh-danger-fg)' : r.impactScore >= 4 ? 'var(--gh-warning-fg)' : 'var(--gh-text-tertiary)'} quiet={r.impactScore < 4}>{r.impact}</Pill>,
            <RiskScorePill score={r.riskScore} />,
            <StatusPill status={r.status} />,
          ])}
        />
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Mitigation &amp; Contingency">
        {/* Fix 2: collapse 5 risk details to 3 */}
        <CollapseList
          items={risks}
          maxItems={3}
          renderItem={(item) => {
            const r = item as typeof risks[0];
            return (
              <Card key={r.id} warn={r.riskScore >= 12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{r.id}</span>
                  <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)' }}>{r.risk}</span>
                  <RiskScorePill score={r.riskScore} />
                  <StatusPill status={r.status} />
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gh-text-disabled)' }}>Updated {r.lastUpdated} · {r.owner}</span>
                </div>
                <KV label="Mitigation"  value={r.mitigation} />
                <KV label="Contingency" value={r.contingency} />
              </Card>
            );
          }}
        />
      </Band>
    </>
  );
}

// ─── §10 Resource Plan ────────────────────────────────────────────────────────

function ResourcePlanContent({ data, sources }: { data: ResourcePlanSection; sources?: Array<{label: string}> }) {
  const pct = (spent: number, budget: number) => budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const cats = data.bpCategories ?? [];
  const members = data.teamMembers ?? [];

  return (
    <>
      <Band icon="facts" label="Facts — B&amp;P Budget">
        {/* Fix 3: Total Budget and Spent to Date are decision-critical */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Budget',    value: Money(data.bpBudget),         primary: true },
            { label: 'Spent to Date',   value: Money(data.bpSpentToDate),    primary: true },
            { label: 'Burn Rate/mo',    value: Money(data.bpBurnRate),       primary: false },
            { label: 'Projected Total', value: Money(data.bpProjectedTotal), primary: false },
          ].map(item => (
            <div key={item.label} style={{ padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', textAlign: 'center', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
              <div style={{ fontSize: item.primary ? 'var(--gh-font-size-xl)' : 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-bold)', color: item.primary ? 'var(--gh-text)' : 'var(--gh-text-secondary)' }}>{item.value}</div>
              <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', marginBottom: 10 }}>Budget by Category</div>
        {/* Fix 2: collapse 6 categories to 3 */}
        <CollapseList
          items={cats}
          maxItems={3}
          renderItem={(item) => {
            const cat = item as typeof cats[0];
            const p = pct(cat.spent, cat.budget);
            return (
              <div key={cat.category} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 'var(--gh-font-size-base)' }}>
                  <span style={{ color: 'var(--gh-text)' }}>{cat.category}</span>
                  <span style={{ color: 'var(--gh-text-tertiary)' }}>{Money(cat.spent)} / {Money(cat.budget)}</span>
                </div>
                <div style={{ height: 6, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)' }}>
                  <div style={{ height: 6, borderRadius: 'var(--gh-radius-full)', width: `${p}%`, background: p > 80 ? 'var(--gh-danger)' : 'var(--gh-accent)' }} />
                </div>
              </div>
            );
          }}
        />
        <SourceChipsRow sources={sources} />
      </Band>

      <Band icon="analysis" label="Analysis — Team Allocations">
        {/* Fix 2: collapse 6 team members to 3 */}
        <Table
          maxRows={3}
          headers={['Name', 'Role', 'Allocation', 'Period', 'Responsibilities']}
          rows={members.map(t => [
            <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{t.name}</span>,
            t.role,
            `${t.allocation}%`,
            `${t.startDate} → ${t.endDate}`,
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {(t.responsibilities ?? []).map((r, i) => <Pill key={i} bg="var(--gh-bg-surface-muted)" color="var(--gh-text-secondary)" quiet>{r}</Pill>)}
            </div>,
          ])}
        />
      </Band>
    </>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

interface SectionFairContentProps {
  sectionKey: keyof StrategyData['sections'];
  sections: StrategyData['sections'];
  sources?: Array<{ label: string }>;
}

export function SectionFairContent({ sectionKey, sections, sources }: SectionFairContentProps) {
  const inner = (() => {
    switch (sectionKey) {
      case 'strategicPositioning': return <StrategicPositioningContent data={sections.strategicPositioning} sources={sources} />;
      case 'winStrategy':          return <WinStrategyContent data={sections.winStrategy} sources={sources} />;
      case 'teamStrategy':         return <TeamStrategyContent data={sections.teamStrategy} sources={sources} />;
      case 'customerEngagement':   return <CustomerEngagementContent data={sections.customerEngagement} sources={sources} />;
      case 'staffingStrategy':     return <StaffingStrategyContent data={sections.staffingStrategy} sources={sources} />;
      case 'pastPerformance':      return <PastPerformanceContent data={sections.pastPerformance} sources={sources} />;
      case 'pricingStrategy':      return <PricingStrategyContent data={sections.pricingStrategy} sources={sources} />;
      case 'timeline':             return <TimelineContent data={sections.timeline} sources={sources} />;
      case 'riskRegister':         return <RiskRegisterContent data={sections.riskRegister} sources={sources} />;
      case 'resourcePlan':         return <ResourcePlanContent data={sections.resourcePlan} sources={sources} />;
      default:                     return null;
    }
  })();
  return <>{inner}</>;
}

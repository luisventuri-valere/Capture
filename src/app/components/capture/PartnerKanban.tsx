import { useState } from 'react';
import { AlertTriangle, User, X, ChevronRight, BarChart2, Lock, Paperclip, Check } from 'lucide-react';
import { KANBAN_STAGES, STAGE_LABELS, type KanbanStage } from '../../../data/capture/teaming-envelope';

const F = 'var(--gh-font)';

function Money(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function Pill({ children, bg, color, quiet }: { children: React.ReactNode; bg: string; color: string; quiet?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: quiet ? '1px 6px' : '2px 7px', borderRadius: 'var(--gh-radius-full)', fontSize: quiet ? 10 : 11, fontWeight: 'var(--gh-font-weight-medium)', letterSpacing: '0.04em', background: bg, color, fontFamily: F, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function stageBg(stage: string) {
  if (stage === 'Committed') return 'var(--gh-success-bg)';
  if (stage === 'Negotiating' || stage === 'NDA_Signed') return 'var(--gh-info-bg)';
  if (stage === 'TA_Signed') return 'var(--gh-info-bg)';
  if (stage === 'Declined') return 'var(--gh-danger-bg)';
  return 'var(--gh-bg-surface-muted)';
}
function stageColor(stage: string) {
  if (stage === 'Committed') return 'var(--gh-success-fg)';
  if (stage === 'Negotiating' || stage === 'NDA_Signed' || stage === 'TA_Signed') return 'var(--gh-info-fg)';
  if (stage === 'Declined') return 'var(--gh-danger-fg)';
  return 'var(--gh-text-tertiary)';
}

// ─── Partner data type (matches opp-001-teaming.json partnerPipeline[]) ───────

export interface Partner {
  id: string;
  name: string;
  uei?: string;
  cage?: string;
  size?: string;
  certifications: string[];
  employees?: number;
  annualRevenue?: number;
  coreCapability: string;
  relevantExperience?: string;
  stage: string;
  stageHistory?: Array<{ stage: string; date: string; notes: string }>;
  ndaStatus?: { signed: boolean; signedDate?: string; expirationDate?: string; status?: string; estimatedSignDate?: string };
  teamingAgreementStatus?: { signed: boolean; status: string; estimatedSignDate: string | null; keyTerms: string | null };
  workshare: number;
  estimatedValue: number;
  onHold?: boolean;
  limitedData?: boolean;
  keyPersonnel: Array<{ name: string; role: string; clearance: string; yearsExperience: number; available?: boolean }>;
  pastPerformance: Array<{ contract: string; value: number; cpars: string; agency: string }>;
  risks: Array<{ risk: string; severity: string; mitigation: string }>;
  strengthForTeam: string | null;
  competitorInterest: string | null;
}

// ─── Partner detail drawer ────────────────────────────────────────────────────

type DrawerTab = 'facts' | 'pipeline' | 'people' | 'performance' | 'intelligence';

function PartnerDetailDrawer({ partner, onClose, demo }: { partner: Partner; onClose: () => void; demo: boolean }) {
  const [tab, setTab] = useState<DrawerTab>('facts');
  const isWithdrawn = demo && partner.id === 'TP-01';
  const isLimited = !!(partner.limitedData || (partner.keyPersonnel.length === 0 && !partner.strengthForTeam && partner.id === 'TP-05'));

  const tabs: Array<{ id: DrawerTab; label: string }> = [
    { id: 'facts',        label: 'Facts' },
    { id: 'pipeline',     label: 'Pipeline' },
    { id: 'people',       label: 'People' },
    { id: 'performance',  label: 'Past Perf.' },
    { id: 'intelligence', label: 'Intelligence' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', pointerEvents: 'auto' }}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div style={{ width: 520, height: '100%', background: 'var(--gh-bg-elevated)', borderLeft: '1px solid var(--gh-border)', display: 'flex', flexDirection: 'column', fontFamily: F }}>
        {/* Header */}
        <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid var(--gh-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                <span style={{ fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-semibold)', color: isWithdrawn ? 'var(--gh-text-disabled)' : 'var(--gh-text)', textDecoration: isWithdrawn ? 'line-through' : 'none' }}>
                  {partner.name}
                </span>
                <Pill bg={stageBg(partner.stage)} color={stageColor(partner.stage)}>{partner.stage}</Pill>
                {partner.onHold && <Pill bg="var(--gh-warning-bg)" color="var(--gh-warning-fg)">On Hold</Pill>}
                {isWithdrawn && <Pill bg="var(--gh-danger-bg)" color="var(--gh-danger-fg)">Withdrawn</Pill>}
              </div>
              <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>{partner.coreCapability}</div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', cursor: 'pointer', color: 'var(--gh-text-tertiary)', padding: 4, marginLeft: 8, flexShrink: 0 }}>
              <X size={18} />
            </button>
          </div>
          {isWithdrawn && (
            <div style={{ marginBottom: 8, padding: '6px 12px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-danger-bg)', border: '1px solid var(--gh-danger-border)', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-danger-fg)' }}>
              Withdrawn — confirmed no longer bidding (2026-02-12)
            </div>
          )}
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '5px 12px', fontSize: 'var(--gh-font-size-sm)', fontWeight: tab === t.id ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-normal)', color: tab === t.id ? 'var(--gh-accent)' : 'var(--gh-text-tertiary)', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--gh-radius-md)', fontFamily: F, borderBottom: tab === t.id ? '2px solid var(--gh-accent)' : '2px solid transparent' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {isLimited && tab !== 'facts' && tab !== 'pipeline' ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <BarChart2 size={32} style={{ color: 'var(--gh-text-tertiary)', marginBottom: 12 }} />
              <div style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-secondary)', marginBottom: 8, fontSize: 'var(--gh-font-size-base)' }}>
                Limited data — run ANALYZE workflow for better intelligence
              </div>
              <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>
                No personnel or past performance records available at Identified stage.
              </div>
            </div>
          ) : (
            <>
              {tab === 'facts'        && <FactsTab partner={partner} />}
              {tab === 'pipeline'     && <PipelineTab partner={partner} />}
              {tab === 'people'       && <PeopleTab partner={partner} />}
              {tab === 'performance'  && <PerformanceTab partner={partner} />}
              {tab === 'intelligence' && <IntelligenceTab partner={partner} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function KV({ label, value, primary }: { label: string; value: React.ReactNode; primary?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 7, fontSize: 'var(--gh-font-size-base)' }}>
      <span style={{ color: primary ? 'var(--gh-text-secondary)' : 'var(--gh-text-tertiary)', minWidth: 160, flexShrink: 0, fontWeight: primary ? 'var(--gh-font-weight-medium)' : 'var(--gh-font-weight-normal)' }}>{label}</span>
      <span style={{ color: 'var(--gh-text)', fontWeight: primary ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-normal)', flex: 1 }}>{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontFamily: F }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function FactsTab({ partner }: { partner: Partner }) {
  return (
    <>
      <Section title="Entity">
        <KV label="Core Capability" value={partner.coreCapability} primary />
        {partner.workshare > 0 && <KV label="Workshare" value={`${partner.workshare}% · ${Money(partner.estimatedValue)}`} primary />}
        {partner.size && <KV label="Business Size" value={partner.size} />}
        {partner.uei && <KV label="UEI" value={partner.uei} />}
        {partner.cage && <KV label="CAGE" value={partner.cage} />}
        {partner.employees !== undefined && <KV label="Employees" value={partner.employees} />}
        {partner.annualRevenue !== undefined && <KV label="Annual Revenue" value={Money(partner.annualRevenue)} />}
        {partner.certifications.length > 0 && (
          <KV label="Certifications" value={
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {partner.certifications.map((c, i) => <Pill key={i} bg="var(--gh-bg-surface-muted)" color="var(--gh-info-fg)" quiet>{c}</Pill>)}
            </div>
          } />
        )}
      </Section>
      {partner.relevantExperience && (
        <Section title="Relevant Experience">
          <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0, lineHeight: 1.6 }}>{partner.relevantExperience}</p>
        </Section>
      )}
      {partner.strengthForTeam && (
        <Section title="Strength for Team">
          <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0, lineHeight: 1.6 }}>{partner.strengthForTeam}</p>
        </Section>
      )}
    </>
  );
}

function PipelineTab({ partner }: { partner: Partner }) {
  const nda = partner.ndaStatus;
  const ta  = partner.teamingAgreementStatus;
  return (
    <>
      <Section title="NDA Status">
        <KV label="Signed"     value={nda?.signed ? `Yes — ${nda.signedDate}` : 'No'} primary />
        {!nda?.signed && nda?.status && <KV label="Status" value={nda.status} />}
        {!nda?.signed && nda?.estimatedSignDate && <KV label="Est. Signature" value={nda.estimatedSignDate} />}
        {nda?.signed && nda?.expirationDate && <KV label="Expires" value={nda.expirationDate} />}
      </Section>
      {ta && (
        <Section title="Teaming Agreement">
          <KV label="Signed"         value={ta.signed ? 'Yes' : 'No'} primary />
          <KV label="Status"         value={ta.status} />
          {ta.estimatedSignDate && <KV label="Est. Signature" value={ta.estimatedSignDate} />}
          {ta.keyTerms && <KV label="Key Terms" value={ta.keyTerms} />}
          {partner.workshare > 0 && <KV label="Workshare"     value={`${partner.workshare}%`} />}
          {partner.estimatedValue > 0 && <KV label="Est. Value" value={Money(partner.estimatedValue)} />}
        </Section>
      )}
      {partner.stageHistory && partner.stageHistory.length > 0 && (
        <Section title="Stage History">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {partner.stageHistory.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 10px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 'var(--gh-radius-full)', background: i === (partner.stageHistory!.length - 1) ? 'var(--gh-accent)' : 'var(--gh-bg-surface-muted)', marginTop: 4 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <Pill bg={stageBg(h.stage)} color={stageColor(h.stage)} quiet>{h.stage}</Pill>
                    <span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{h.date}</span>
                  </div>
                  <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-secondary)', margin: 0 }}>{h.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function PeopleTab({ partner }: { partner: Partner }) {
  if (!partner.keyPersonnel.length) {
    return <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-tertiary)', textAlign: 'center', marginTop: 40 }}>No key personnel on record at this stage.</p>;
  }
  return (
    <Section title={`Key Personnel (${partner.keyPersonnel.length})`}>
      {partner.keyPersonnel.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--gh-radius-md)', marginBottom: 6, background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
          <User size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{p.name}</div>
            <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{p.role}</div>
          </div>
          <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-text-tertiary)" quiet>{p.clearance}</Pill>
          <span style={{ fontSize: 11, color: 'var(--gh-text-disabled)', whiteSpace: 'nowrap' }}>{p.yearsExperience}y</span>
          {p.available === true && <Pill bg="var(--gh-success-bg)" color="var(--gh-success-fg)" quiet>Available</Pill>}
        </div>
      ))}
    </Section>
  );
}

function PerformanceTab({ partner }: { partner: Partner }) {
  if (!partner.pastPerformance.length) {
    return <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-tertiary)', textAlign: 'center', marginTop: 40 }}>No past performance records at this stage.</p>;
  }
  return (
    <Section title={`Past Performance (${partner.pastPerformance.length})`}>
      {partner.pastPerformance.map((pp, i) => {
        const ratingColor = pp.cpars === 'Exceptional' ? 'var(--gh-success-fg)' : pp.cpars === 'Very Good' ? 'var(--gh-info-fg)' : 'var(--gh-text-tertiary)';
        return (
          <div key={i} style={{ padding: '10px 12px', borderRadius: 'var(--gh-radius-lg)', marginBottom: 8, background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', flex: 1, marginRight: 8 }}>{pp.contract}</span>
              <Pill bg="var(--gh-bg-surface-muted)" color={ratingColor} quiet>{pp.cpars}</Pill>
            </div>
            <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>
              {pp.agency} · {Money(pp.value)}
            </div>
          </div>
        );
      })}
    </Section>
  );
}

function IntelligenceTab({ partner }: { partner: Partner }) {
  return (
    <>
      {partner.competitorInterest && (
        <Section title="Competitor Interest">
          <div style={{ padding: '8px 12px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-warning-bg)', border: '1px solid var(--gh-warning-border)', fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-warning-fg)' }}>
            {partner.competitorInterest}
          </div>
        </Section>
      )}
      {partner.risks.length > 0 && (
        <Section title={`Risks (${partner.risks.length})`}>
          {partner.risks.map((r, i) => (
            <div key={i} style={{ padding: '8px 12px', borderRadius: 'var(--gh-radius-md)', marginBottom: 6, background: r.severity === 'HIGH' ? 'var(--gh-danger-bg)' : r.severity === 'MEDIUM' ? 'var(--gh-warning-bg)' : 'var(--gh-bg-surface)', border: `1px solid ${r.severity === 'HIGH' ? 'var(--gh-danger-border)' : r.severity === 'MEDIUM' ? 'var(--gh-warning-border)' : 'var(--gh-border)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Pill bg={r.severity === 'HIGH' ? 'var(--gh-danger-bg)' : r.severity === 'MEDIUM' ? 'var(--gh-warning-bg)' : 'var(--gh-bg-surface-muted)'} color={r.severity === 'HIGH' ? 'var(--gh-danger-fg)' : r.severity === 'MEDIUM' ? 'var(--gh-warning-fg)' : 'var(--gh-text-tertiary)'}>{r.severity}</Pill>
                <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{r.risk}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--gh-text-secondary)' }}>Mitigation: {r.mitigation}</div>
            </div>
          ))}
        </Section>
      )}
      {!partner.competitorInterest && !partner.risks.length && (
        <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-tertiary)', textAlign: 'center', marginTop: 40 }}>No intelligence records at this stage.</p>
      )}
    </>
  );
}

// ─── Kanban card ──────────────────────────────────────────────────────────────

function PartnerCard({ partner, demo, onOpen }: { partner: Partner; demo: boolean; onOpen: () => void }) {
  const isWithdrawn = demo && partner.id === 'TP-01';
  const ndaSigned = partner.ndaStatus?.signed ?? false;
  const taSigned  = partner.teamingAgreementStatus?.signed ?? false;

  return (
    <div
      draggable={!demo}
      onClick={onOpen}
      style={{
        padding: '10px 11px', borderRadius: 'var(--gh-radius-lg)', marginBottom: 7,
        background: partner.onHold ? 'var(--gh-warning-bg)' : isWithdrawn ? 'var(--gh-red-950)' : 'var(--gh-bg-elevated)',
        borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, borderLeftWidth: 3,
        borderTopStyle: 'solid', borderBottomStyle: 'solid', borderRightStyle: 'solid', borderLeftStyle: 'solid',
        borderTopColor: partner.onHold ? 'var(--gh-warning-border)' : isWithdrawn ? 'var(--gh-danger-border)' : 'var(--gh-border)',
        borderBottomColor: partner.onHold ? 'var(--gh-warning-border)' : isWithdrawn ? 'var(--gh-danger-border)' : 'var(--gh-border)',
        borderRightColor: partner.onHold ? 'var(--gh-warning-border)' : isWithdrawn ? 'var(--gh-danger-border)' : 'var(--gh-border)',
        borderLeftColor: isWithdrawn ? 'var(--gh-danger-fg)' : partner.stage === 'Committed' ? 'var(--gh-success-fg)' : partner.stage === 'Negotiating' ? 'var(--gh-info-fg)' : partner.onHold ? 'var(--gh-warning-fg)' : 'var(--gh-border)',
        cursor: 'pointer', userSelect: 'none', fontFamily: F,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: isWithdrawn ? 'var(--gh-text-disabled)' : 'var(--gh-text)', textDecoration: isWithdrawn ? 'line-through' : 'none', lineHeight: 1.3 }}>
          {partner.name}
        </span>
        <div style={{ display: 'flex', gap: 3, flexShrink: 0, marginTop: 1 }}>
          {partner.onHold && <AlertTriangle size={12} style={{ color: 'var(--gh-warning-fg)' }} />}
          <ChevronRight size={12} style={{ color: 'var(--gh-text-disabled)' }} />
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginBottom: partner.workshare > 0 ? 4 : 6, lineHeight: 1.3 }}>
        {partner.coreCapability}
      </div>
      {partner.workshare > 0 && (
        <div style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-accent-tint)', marginBottom: 6 }}>
          {partner.workshare}% · {Money(partner.estimatedValue)}
        </div>
      )}
      {partner.workshare === 0 && partner.id !== 'TP-05' && (
        <div style={{ fontSize: 11, color: 'var(--gh-text-disabled)', marginBottom: 6 }}>advisory · 0%</div>
      )}
      {partner.id === 'TP-05' && (
        <div style={{ fontSize: 10, color: 'var(--gh-warning-fg)', marginBottom: 4, lineHeight: 1.3 }}>
          Limited data — run ANALYZE workflow
        </div>
      )}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {ndaSigned && <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-success-fg)" quiet>NDA <Check size={9} /></Pill>}
        {!ndaSigned && partner.ndaStatus?.status && (
          <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-text-tertiary)" quiet>NDA: {partner.ndaStatus.status}</Pill>
        )}
        {taSigned && <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-success-fg)" quiet>TA <Check size={9} /></Pill>}
        {!taSigned && partner.teamingAgreementStatus?.status && (
          <Pill bg="var(--gh-bg-surface-muted)" color="var(--gh-text-tertiary)" quiet>
            TA: {partner.teamingAgreementStatus.status.length > 18 ? partner.teamingAgreementStatus.status.slice(0, 16) + '…' : partner.teamingAgreementStatus.status}
          </Pill>
        )}
        {partner.competitorInterest && <Pill bg="var(--gh-warning-bg)" color="var(--gh-warning-fg)" quiet><Lock size={9} /></Pill>}
        {partner.onHold && <Pill bg="var(--gh-warning-bg)" color="var(--gh-warning-fg)" quiet>OCI hold</Pill>}
        {isWithdrawn && <Pill bg="var(--gh-danger-bg)" color="var(--gh-danger-fg)" quiet>Withdrawn</Pill>}
      </div>
    </div>
  );
}

// ─── Main Kanban component ────────────────────────────────────────────────────

interface PartnerKanbanProps { partners: Partner[]; demo: boolean }

export function PartnerKanban({ partners, demo }: PartnerKanbanProps) {
  const [cardStages, setCardStages] = useState<Record<string, KanbanStage>>(() => {
    const map: Record<string, KanbanStage> = {};
    partners.forEach(p => {
      const s = p.stage as KanbanStage;
      map[p.id] = KANBAN_STAGES.includes(s) ? s : 'Contacted';
    });
    return map;
  });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<KanbanStage | null>(null);
  const [openPartner, setOpenPartner] = useState<Partner | null>(null);

  const effectiveStages: Record<string, KanbanStage> = { ...cardStages };
  if (demo) effectiveStages['TP-01'] = 'Declined';

  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDragEnd   = () => { setDraggingId(null); setDragOverStage(null); };
  const handleDragOver  = (e: React.DragEvent, stage: KanbanStage) => { e.preventDefault(); setDragOverStage(stage); };
  const handleDrop      = (stage: KanbanStage) => {
    if (draggingId && !demo) setCardStages(prev => ({ ...prev, [draggingId]: stage }));
    setDraggingId(null); setDragOverStage(null);
  };

  const committedWorkshare = demo ? 0 :
    partners.filter(p => effectiveStages[p.id] === 'Committed').reduce((s, p) => s + p.workshare, 0);
  const subTarget = 45;
  const railPct   = Math.min(100, Math.round((committedWorkshare / subTarget) * 100));
  const belowPlan = demo;

  return (
    <>
      {openPartner && (
        <PartnerDetailDrawer partner={openPartner} onClose={() => setOpenPartner(null)} demo={demo} />
      )}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, minWidth: 720 }}>
          {KANBAN_STAGES.map(stage => {
            const stagePartners = partners.filter(p => effectiveStages[p.id] === stage);
            const isDeclined    = stage === 'Declined';
            const isDragTarget  = dragOverStage === stage;
            return (
              <div
                key={stage}
                onDragOver={e => handleDragOver(e, stage)}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={() => handleDrop(stage)}
                style={{ borderRadius: 'var(--gh-radius-lg)', background: isDeclined ? 'rgba(69,10,10,0.4)' : isDragTarget ? 'var(--gh-bg-surface-muted)' : 'var(--gh-bg-surface)', border: `1px solid ${isDragTarget ? 'var(--gh-accent)' : isDeclined ? 'var(--gh-danger-border)' : 'var(--gh-border)'}`, padding: '8px 7px', minHeight: 160, display: 'flex', flexDirection: 'column', transition: 'border-color 0.12s, background 0.12s', fontFamily: F }}
              >
                <div style={{ marginBottom: 10, padding: '0 2px' }}>
                  <div style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-semibold)', color: isDeclined ? 'var(--gh-danger-fg)' : 'var(--gh-text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>{STAGE_LABELS[stage]}</div>
                  <div style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: stagePartners.length > 0 ? 'var(--gh-text-secondary)' : 'var(--gh-text-disabled)' }}>{stagePartners.length > 0 ? stagePartners.length : '—'}</div>
                </div>
                <div style={{ flex: 1 }}>
                  {stagePartners.map(partner => (
                    <PartnerCard key={partner.id} partner={partner} demo={demo} onOpen={() => setOpenPartner(partner)} />
                  ))}
                  {stagePartners.length === 0 && (
                    <div style={{ border: '1px dashed var(--gh-border)', borderRadius: 'var(--gh-radius-md)', padding: '14px 8px', textAlign: 'center', fontSize: 10, color: 'var(--gh-text-disabled)' }}>Drop here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Workshare rail */}
      <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 'var(--gh-radius-lg)', background: belowPlan ? 'var(--gh-danger-bg)' : 'var(--gh-bg-surface)', border: `1px solid ${belowPlan ? 'var(--gh-danger-border)' : 'var(--gh-border)'}`, fontFamily: F }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 'var(--gh-font-size-sm)' }}>
          <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: belowPlan ? 'var(--gh-danger-fg)' : 'var(--gh-text)' }}>
            Committed subcontract workshare
            {belowPlan && <span style={{ marginLeft: 8 }}> 20% / $9.0M hole — DataBridge withdrawn</span>}
          </span>
          <span style={{ fontWeight: 'var(--gh-font-weight-semibold)', color: belowPlan ? 'var(--gh-danger-fg)' : 'var(--gh-text-tertiary)' }}>
            {demo ? '0%' : `${committedWorkshare}%`} of {subTarget}% sub-target
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)' }}>
          <div style={{ height: 8, borderRadius: 'var(--gh-radius-full)', width: `${demo ? 0 : railPct}%`, background: belowPlan ? 'var(--gh-danger)' : 'var(--gh-accent)', transition: 'width 0.3s' }} />
        </div>
        <div style={{ marginTop: 5, fontSize: 11, color: 'var(--gh-text-disabled)' }}>
          {demo ? 'No committed partners — DataBridge withdrawal pending replacement' : 'DataBridge Analytics — verbal commit, TA in Legal Review (est. 2026-02-15)'}
        </div>
      </div>
    </>
  );
}

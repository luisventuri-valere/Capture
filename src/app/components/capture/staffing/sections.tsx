import React, { useState } from 'react';
import {
  TrendingDown, TrendingUp, Target, ChevronDown, ChevronRight, Building2,
  AlertTriangle, MinusCircle, CheckCircle2, ArrowRight, Flag, Clock,
} from 'lucide-react';
import type { LCAT, SalaryBenchmark, Incumbent, IncumbentPerson, TimelineData } from '../../../../types/staffing';
import {
  F, marketPosition, moneyFull, money, tone, priorityActions,
} from './helpers';
import { Pill } from './ui';

const fmtDate = (iso: string, year?: boolean) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(year ? { year: 'numeric' } : {}) });
const ms = (iso: string) => new Date(iso + 'T00:00:00').getTime();

// ─── Section 5 · Salary Intelligence ─────────────────────────────────────────
export function SalaryIntelligence({ lcats, benchmarks }: { lcats: LCAT[]; benchmarks: SalaryBenchmark[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setOpen(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {lcats.map(lcat => {
        const b = benchmarks.find(x => x.lcatId === lcat.id);
        const mk = marketPosition(lcat, b);
        const mkt = tone(mk.tone);
        const Icon = mk.dir === 'down' ? TrendingDown : mk.dir === 'up' ? TrendingUp : Target;
        const isOpen = open.has(lcat.id);
        return (
          <div key={lcat.id} style={{ border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)', overflow: 'hidden', background: 'var(--gh-bg-surface)' }}>
            <button onClick={() => toggle(lcat.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: F, textAlign: 'left' }}>
              {isOpen ? <ChevronDown size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} /> : <ChevronRight size={14} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0 }} />}
              <span style={{ flex: 1, fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{lcat.title}</span>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', whiteSpace: 'nowrap' }}>{money(lcat.salaryRange.min)} – {money(lcat.salaryRange.max)}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', background: mkt.bg, color: mkt.fg, fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap' }}><Icon size={12} /> {mk.label}</span>
            </button>
            {isOpen && b && (
              <div style={{ padding: '4px 16px 16px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <RangeBar lcat={lcat} b={b} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Source title="GSA CALC+" rows={[['Low', b.gsaCalc.low], ['Mid', b.gsaCalc.mid], ['High', b.gsaCalc.high]]} />
                  <Source title={`Glassdoor · ${b.glassdoor.region}`} rows={[['Low', b.glassdoor.low], ['Mid', b.glassdoor.mid], ['High', b.glassdoor.high]]} />
                </div>
                <div>
                  <Label>Competitor Intel</Label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {Object.entries(b.competitors).map(([name, val]) => (
                      <span key={name} style={{ display: 'inline-flex', gap: 6, padding: '4px 10px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', fontSize: 'var(--gh-font-size-xs)' }}>
                        <span style={{ color: 'var(--gh-text-tertiary)' }}>{name}</span>
                        <span style={{ color: 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-semibold)' }}>{moneyFull(val)}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-info-bg)', border: '1px solid var(--gh-info-border)' }}>
                  <Target size={14} style={{ color: 'var(--gh-info-fg)', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-secondary)', lineHeight: 1.55 }}>{b.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gh-text-tertiary)', fontWeight: 'var(--gh-font-weight-semibold)', marginBottom: 7 }}>{children}</div>;
}
function Source({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div style={{ background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', padding: '10px 12px' }}>
      <Label>{title}</Label>
      <div style={{ display: 'flex', gap: 16 }}>
        {rows.map(([k, v]) => (
          <div key={k}><div style={{ fontSize: 10, color: 'var(--gh-text-tertiary)' }}>{k}</div><div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-semibold)' }}>{money(v)}</div></div>
        ))}
      </div>
    </div>
  );
}
function RangeBar({ lcat, b }: { lcat: LCAT; b: SalaryBenchmark }) {
  const all = [lcat.salaryRange.min, lcat.salaryRange.max, b.gsaCalc.low, b.gsaCalc.high, b.glassdoor.low, b.glassdoor.high, ...Object.values(b.competitors)];
  const lo = Math.min(...all), hi = Math.max(...all);
  const pct = (v: number) => ((v - lo) / (hi - lo || 1)) * 100;
  const ourMid = (lcat.salaryRange.min + lcat.salaryRange.max) / 2;
  return (
    <div>
      <Label>Our band vs market (GSA mid ◇)</Label>
      <div style={{ position: 'relative', height: 30 }}>
        <div style={{ position: 'absolute', top: 13, left: 0, right: 0, height: 4, borderRadius: 4, background: 'var(--gh-bg-surface-muted)' }} />
        <div style={{ position: 'absolute', top: 13, height: 4, borderRadius: 4, background: 'var(--gh-accent)', left: `${pct(lcat.salaryRange.min)}%`, width: `${pct(lcat.salaryRange.max) - pct(lcat.salaryRange.min)}%` }} />
        <div title={`Our midpoint ${money(ourMid)}`} style={{ position: 'absolute', top: 8, left: `${pct(ourMid)}%`, transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: 'var(--gh-accent-tint)', border: '2px solid var(--gh-bg-elevated)' }} />
        <div title={`GSA mid ${money(b.gsaCalc.mid)}`} style={{ position: 'absolute', top: 7, left: `${pct(b.gsaCalc.mid)}%`, transform: 'translateX(-50%) rotate(45deg)', width: 10, height: 10, background: 'var(--gh-text-tertiary)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gh-text-tertiary)' }}><span>{money(lo)}</span><span>{money(hi)}</span></div>
    </div>
  );
}

// ─── Company-level incumbent context card (Change 3) ──────────────────────────
// Strategic, company-wide incumbent intel — informational only. Per-person
// recruiting controls live in the LCAT rows (Change 2), not here. Collapsible so
// it doesn't crowd the Matrix.
const friIcon = { negative: AlertTriangle, neutral: MinusCircle, positive: CheckCircle2 } as const;
const friTone = { negative: 'danger', neutral: 'neutral', positive: 'success' } as const;

export function IncumbentContextCard({ incumbent, people }: { incumbent: Incumbent; people: IncumbentPerson[] }) {
  const [open, setOpen] = useState(true);

  // Recruitable departures: matched to an open LCAT, still actively in play
  // (not already moved to the pipeline, not written off).
  const recruitable = people.filter(p => p.lcatId && p.status !== 'in_pipeline' && p.status !== 'not_pursued');
  const highRisk = recruitable.filter(p => p.flightRisk === 'high').length;
  // One-line flight-risk summary, drawn from the highest-impact negative signal.
  const topSignal = [...incumbent.flightRiskIndicators].sort((a, b) =>
    (b.type === 'negative' ? 1 : 0) - (a.type === 'negative' ? 1 : 0) ||
    ({ high: 2, medium: 1, low: 0 }[b.impact] - { high: 2, medium: 1, low: 0 }[a.impact]))[0];

  return (
    <div style={{ border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', background: 'var(--gh-bg-surface)', overflow: 'hidden', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
        <div style={{ width: 38, height: 38, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface-muted)', display: 'grid', placeItems: 'center', color: 'var(--gh-accent-tint)', flexShrink: 0 }}><Building2 size={18} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{incumbent.contractor}</span>
            <Pill tone="neutral" soft style={{ fontSize: 9 }}>Incumbent</Pill>
            <Pill tone="danger" style={{ fontSize: 9 }}><AlertTriangle size={9} /> Elevated flight risk</Pill>
          </div>
          {!open && (
            <div style={{ fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {money(incumbent.contractValue)} · {incumbent.period} · {incumbent.staffCount} staff · {recruitable.length} recruitable
            </div>
          )}
        </div>
        <button onClick={() => setOpen(o => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', padding: '5px 10px', cursor: 'pointer', color: 'var(--gh-text-tertiary)', fontSize: 'var(--gh-font-size-xs)', fontFamily: F, fontWeight: 'var(--gh-font-weight-medium)', whiteSpace: 'nowrap' }}>
          {open ? <><ChevronDown size={13} /> Hide</> : <><ChevronRight size={13} /> Details</>}
        </button>
      </div>

      {open && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Mini label="Contract Value" value={money(incumbent.contractValue)} />
            <Mini label="Period of Performance" value={incumbent.period} />
            <Mini label="Total Staff" value={String(incumbent.staffCount)} />
            <Mini label="Recruitable" value={`${recruitable.length}`} tone="warning" />
          </div>

          {topSignal && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 'var(--gh-radius-md)', background: tone(friTone[topSignal.type]).bg, border: `1px solid ${tone(friTone[topSignal.type]).bd}` }}>
              {(() => { const FI = friIcon[topSignal.type]; return <FI size={15} style={{ color: tone(friTone[topSignal.type]).fg, flexShrink: 0, marginTop: 1 }} />; })()}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>Flight risk: Elevated</div>
                <p style={{ margin: '2px 0 0', fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>{topSignal.text}</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)' }}>
            <ArrowRight size={14} style={{ color: 'var(--gh-warning-fg)', flexShrink: 0 }} />
            <span><strong style={{ color: 'var(--gh-text)' }}>{recruitable.length} recruitable departure{recruitable.length === 1 ? '' : 's'}</strong>{highRisk > 0 ? ` (${highRisk} high-risk)` : ''} you could capture — expand a position below to court them.</span>
          </div>
        </div>
      )}
    </div>
  );
}
function Mini({ label, value, tone: t }: { label: string; value: string; tone?: Parameters<typeof tone>[0] }) {
  return <div style={{ minWidth: 92 }}><div style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-bold)', color: t ? tone(t).fg : 'var(--gh-text)' }}>{value}</div><div style={{ fontSize: 10, color: 'var(--gh-text-tertiary)', marginTop: 2 }}>{label}</div></div>;
}

// ─── Section 7 · Timeline & Priority ─────────────────────────────────────────
export function TimelinePriority({ timeline, lcats, onScrollToLcat }: {
  timeline: TimelineData; lcats: LCAT[]; onScrollToLcat: (id: string) => void;
}) {
  const markers = [
    { key: 'rfp', label: 'RFP Release', iso: timeline.rfpRelease, tone: 'neutral' as const },
    { key: 'now', label: 'Today', iso: timeline.currentDate, tone: 'accent' as const },
    { key: 'due', label: 'Proposal Due', iso: timeline.proposalDue, tone: 'warning' as const },
    { key: 'award', label: 'Award', iso: timeline.award, tone: 'success' as const },
  ];
  const start = Math.min(...markers.map(m => ms(m.iso)));
  const end = Math.max(...markers.map(m => ms(m.iso)));
  const pos = (iso: string) => ((ms(iso) - start) / (end - start || 1)) * 100;
  const maxMo = Math.max(...timeline.clearanceLeadTimes.map(c => c.maxMonths), 1);
  const actions = priorityActions(lcats);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* timeline */}
      <div>
        <Label>Proposal Timeline</Label>
        <div style={{ position: 'relative', height: 64, margin: '0 8px' }}>
          <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 2, background: 'var(--gh-border-strong)' }} />
          {markers.map(m => {
            const t = tone(m.tone);
            return (
              <div key={m.key} style={{ position: 'absolute', top: 0, left: `${pos(m.iso)}%`, transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ width: m.key === 'now' ? 14 : 11, height: m.key === 'now' ? 14 : 11, borderRadius: '50%', background: t.fg, border: '2px solid var(--gh-bg-elevated)', margin: '4px auto 0', boxShadow: m.key === 'now' ? `0 0 0 4px ${t.bg}` : 'none' }} />
                <div style={{ fontSize: 10, color: 'var(--gh-text-tertiary)', marginTop: 6, whiteSpace: 'nowrap' }}>{m.label}</div>
                <div style={{ fontSize: 10, color: 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap' }}>{fmtDate(m.iso, m.key === 'award')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* clearance lead times */}
      <div>
        <Label>Clearance Lead Times</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {timeline.clearanceLeadTimes.map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 70, fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-secondary)', fontWeight: 'var(--gh-font-weight-medium)' }}>{c.label}</span>
              <div style={{ flex: 1, height: 18, borderRadius: 'var(--gh-radius-sm)', background: 'var(--gh-bg-surface-muted)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(c.minMonths / maxMo) * 100}%`, width: `${((c.maxMonths - c.minMonths) / maxMo) * 100}%`, minWidth: 6, background: 'linear-gradient(90deg, var(--gh-accent), var(--gh-accent-hover))', opacity: 0.85 }} />
              </div>
              <span style={{ width: 80, fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)', textAlign: 'right' }}>{c.minMonths}–{c.maxMonths} mo</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: 'var(--gh-text-tertiary)' }}>
          <Clock size={11} /> TS/SCI investigations gate start dates — sequence sourcing accordingly.
        </div>
      </div>

      {/* priority actions */}
      <div>
        <Label>Priority Actions</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {actions.length === 0 && <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-success-fg)' }}>All labor categories on track.</div>}
          {actions.map((a, i) => {
            const t = tone(a.tone);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 13px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', borderLeft: `3px solid ${t.fg}`, border: '1px solid var(--gh-border)', borderLeftWidth: 3, borderLeftColor: t.fg }}>
                <Pill tone={a.tone} style={{ fontSize: 10 }}><Flag size={10} /> {a.priority}</Pill>
                <button onClick={() => onScrollToLcat(a.lcatId)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-accent-tint)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', fontFamily: F, textDecoration: 'underline', textUnderlineOffset: 2, whiteSpace: 'nowrap' }}>{a.lcatTitle}</button>
                <span style={{ flex: 1, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)' }}>{a.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  TrendingDown, TrendingUp, Target, ChevronDown, ChevronRight, Building2,
  AlertTriangle, MinusCircle, CheckCircle2, ArrowRight, Flag, Clock,
} from 'lucide-react';
import type { LCAT, SalaryBenchmark, Incumbent, IncumbentPerson, TimelineData } from '../../../../types/staffing';
import {
  F, marketPosition, moneyFull, money, tone, flightTone, titleCase, priorityActions,
} from './helpers';
import { Pill, Dot, Btn } from './ui';

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
  return <div style={{ fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gh-text-disabled)', fontWeight: 'var(--gh-font-weight-semibold)', marginBottom: 7 }}>{children}</div>;
}
function Source({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div style={{ background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', padding: '10px 12px' }}>
      <Label>{title}</Label>
      <div style={{ display: 'flex', gap: 16 }}>
        {rows.map(([k, v]) => (
          <div key={k}><div style={{ fontSize: 10, color: 'var(--gh-text-disabled)' }}>{k}</div><div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-semibold)' }}>{money(v)}</div></div>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gh-text-disabled)' }}><span>{money(lo)}</span><span>{money(hi)}</span></div>
    </div>
  );
}

// ─── Section 6 · Incumbent Intelligence ──────────────────────────────────────
const friIcon = { negative: AlertTriangle, neutral: MinusCircle, positive: CheckCircle2 } as const;
const friTone = { negative: 'danger', neutral: 'neutral', positive: 'success' } as const;
const incStatusTone = (s: string) => s === 'in_pipeline' ? 'success' : s === 'interested' ? 'info' : s === 'contacted' ? 'warning' : s === 'not_pursued' ? 'danger' : 'neutral';

export function IncumbentIntelligence({ incumbent, people, onAddToPipeline }: {
  incumbent: Incumbent; people: IncumbentPerson[]; onAddToPipeline: (id: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* contract overview */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)', padding: '14px 16px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface-muted)', display: 'grid', placeItems: 'center', color: 'var(--gh-accent-tint)', flexShrink: 0 }}><Building2 size={20} /></div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{incumbent.contractor}</div>
          <div style={{ fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)', marginTop: 2 }}>Incumbent contractor</div>
        </div>
        <Mini label="Contract Value" value={money(incumbent.contractValue)} />
        <Mini label="Period" value={incumbent.period} />
        <Mini label="Staff" value={String(incumbent.staffCount)} />
      </div>

      {/* flight risk indicators */}
      <div>
        <Label>Flight Risk Indicators</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {incumbent.flightRiskIndicators.map((fr, i) => {
            const FI = friIcon[fr.type]; const t = tone(friTone[fr.type]);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--gh-radius-md)', background: t.bg, border: `1px solid ${t.bd}` }}>
                <FI size={15} style={{ color: t.fg, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>{fr.text}</span>
                <Pill tone={fr.impact === 'high' ? 'danger' : fr.impact === 'medium' ? 'warning' : 'neutral'} style={{ fontSize: 9 }}>{fr.impact.toUpperCase()}</Pill>
              </div>
            );
          })}
        </div>
      </div>

      {/* personnel table */}
      <div>
        <Label>Incumbent Personnel</Label>
        <div style={{ border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)', overflow: 'hidden' }}>
          {people.map((p, idx) => {
            const isOpen = open === p.id;
            return (
              <div key={p.id} style={{ borderTop: idx ? '1px solid var(--gh-border)' : 'none' }}>
                <button onClick={() => setOpen(isOpen ? null : p.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: isOpen ? 'var(--gh-bg-surface)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: F, textAlign: 'left' }}>
                  <Dot tone={flightTone(p.flightRisk)} />
                  <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-medium)', color: 'var(--gh-text)', minWidth: 130 }}>{p.name}</span>
                  <span style={{ flex: 1, fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)' }}>{p.role}</span>
                  <span style={{ fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-tertiary)' }}>{p.tenure}</span>
                  <Pill tone={incStatusTone(p.status)} soft style={{ fontSize: 9 }}>{titleCase(p.status)}</Pill>
                  {isOpen ? <ChevronDown size={14} style={{ color: 'var(--gh-text-tertiary)' }} /> : <ChevronRight size={14} style={{ color: 'var(--gh-text-tertiary)' }} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '4px 14px 14px 36px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 'var(--gh-font-size-xs)' }}>
                      <span><span style={{ color: 'var(--gh-text-disabled)' }}>Flight risk: </span><span style={{ color: tone(flightTone(p.flightRisk)).fg, fontWeight: 'var(--gh-font-weight-semibold)' }}>{p.flightRisk.toUpperCase()}</span></span>
                      <span><span style={{ color: 'var(--gh-text-disabled)' }}>Est. salary: </span><span style={{ color: 'var(--gh-text)' }}>{moneyFull(p.estimatedSalary)}</span></span>
                    </div>
                    {p.note && <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.55 }}>{p.note}</p>}
                    <div>
                      {p.status === 'in_pipeline'
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--gh-success-fg)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)' }}><CheckCircle2 size={14} /> In pipeline</span>
                        : <Btn kind="primary" size="sm" icon={<ArrowRight size={13} />} onClick={() => onAddToPipeline(p.id)}>Add to Pipeline</Btn>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function Mini({ label, value }: { label: string; value: string }) {
  return <div style={{ minWidth: 92 }}><div style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>{value}</div><div style={{ fontSize: 10, color: 'var(--gh-text-disabled)', marginTop: 2 }}>{label}</div></div>;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: 'var(--gh-text-disabled)' }}>
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

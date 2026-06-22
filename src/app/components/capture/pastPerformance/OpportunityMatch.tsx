import React, { useMemo, useState } from 'react';
import {
  Sparkles, Loader2, ChevronDown, ChevronRight, Check, AlertTriangle, Wand2, Users, X,
} from 'lucide-react';
import type { ScoredReference, RequirementCoverage, PPRequirement, PPLibraryEntry, CoverageStrength } from '../../../../types/pastPerformance';
import { F, tone, type Tone } from '../staffing/helpers';
import { Pill, Btn } from '../staffing/ui';
import { relevanceTone, recTone, coverageStrengthDots, coverageLevelTone, cparsTone, recencyContext } from './ppHelpers';

const DIMS: [keyof ScoredReference, string][] = [
  ['scopeRelevance', 'Scope'], ['sizeRelevance', 'Size'], ['complexityRelevance', 'Complexity'],
  ['agencyRelevance', 'Agency'], ['recencyScore', 'Recency'], ['performanceScore', 'Performance'],
];

export function OpportunityMatch({
  scored, coverage, requirements, library, selected, maxRefs, scoredRevealed, scoring, optimizing, optimizeNote,
  onScore, onToggleSelect, onOptimize, onSuggestPartner,
}: {
  scored: ScoredReference[]; coverage: RequirementCoverage[]; requirements: PPRequirement[]; library: PPLibraryEntry[];
  selected: Set<string>; maxRefs: number; scoredRevealed: boolean; scoring: boolean; optimizing: boolean; optimizeNote: string | null;
  onScore: () => void; onToggleSelect: (id: string) => void; onOptimize: () => void; onSuggestPartner: (req: string) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [evidence, setEvidence] = useState<{ req: string; refId: string; text: string } | null>(null);
  const libMap = useMemo(() => Object.fromEntries(library.map(l => [l.id, l])), [library]);
  const ranked = useMemo(() => [...scored].sort((a, b) => b.overallRelevanceScore - a.overallRelevanceScore), [scored]);
  const refsInMatrix = ranked.map(r => r.referenceId);

  // selection summary
  const covered = requirements.filter(req => {
    const row = coverage.find(c => c.requirementId === req.id);
    if (!row) return false;
    return [...selected].some(id => { const s = row.perReference[id]; return s === 'strong' || s === 'moderate'; });
  });
  const coveragePct = Math.round((covered.length / Math.max(requirements.length, 1)) * 100);
  const gaps = requirements.filter(r => !covered.includes(r));
  const selectedConcerns = [...selected].filter(id => (scored.find(s => s.referenceId === id)?.concerns.length ?? 0) > 0);
  const over = selected.size > maxRefs;

  if (!scoredRevealed) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 280, textAlign: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 'var(--gh-radius-xl)', background: 'var(--gh-info-bg)', border: '1px solid var(--gh-info-border)', display: 'grid', placeItems: 'center', color: 'var(--gh-info-fg)' }}><Sparkles size={24} /></div>
        <div>
          <div style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>Score references against this opportunity</div>
          <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)', marginTop: 4, maxWidth: 420 }}>The agent ranks every library reference by relevance to the RFP requirements and recommends a selection.</div>
        </div>
        <Btn kind="primary" icon={scoring ? <Loader2 size={14} className="gh-spin" /> : <Sparkles size={14} />} onClick={onScore} disabled={scoring}>{scoring ? 'Scoring references…' : 'Score References'}</Btn>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* selection summary (sticky-ish top) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', padding: '12px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: `1px solid ${over ? 'var(--gh-danger-border)' : 'var(--gh-border)'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 22, fontWeight: 'var(--gh-font-weight-bold)', color: over ? 'var(--gh-danger-fg)' : 'var(--gh-text)' }}>{selected.size}</span>
          <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>of {maxRefs} selected</span>
        </div>
        <div style={{ height: 26, width: 1, background: 'var(--gh-border)' }} />
        <Mini label="Coverage" value={`${coveragePct}%`} tone={coveragePct >= 80 ? 'success' : coveragePct >= 50 ? 'warning' : 'danger'} />
        <Mini label="Gaps" value={String(gaps.length)} tone={gaps.length ? 'warning' : 'success'} />
        {selectedConcerns.length > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--gh-warning-fg)', fontSize: 'var(--gh-font-size-xs)' }}><AlertTriangle size={13} /> {selectedConcerns.length} selected with concerns</span>}
        <Btn kind="primary" size="sm" style={{ marginLeft: 'auto' }} icon={optimizing ? <Loader2 size={13} className="gh-spin" /> : <Wand2 size={13} />} onClick={onOptimize} disabled={optimizing}>{optimizing ? 'Optimizing…' : 'Optimize Selection'}</Btn>
      </div>
      {optimizeNote && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 13px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-info-bg)', border: '1px solid var(--gh-info-border)' }}>
          <Wand2 size={14} style={{ color: 'var(--gh-info-fg)', flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-secondary)', lineHeight: 1.55 }}>{optimizeNote}</p>
        </div>
      )}

      {/* (A) scored list */}
      <div>
        <SectionLabel>Scored References</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ranked.map(s => {
            const lib = libMap[s.referenceId];
            const isOpen = expanded.has(s.referenceId);
            const isSel = selected.has(s.referenceId);
            const rt = tone(relevanceTone(s.overallRelevanceScore));
            const rec = tone(recTone(s.selectionRecommendation));
            const rc = lib ? recencyContext(lib.endDate) : null;
            return (
              <div key={s.referenceId} style={{ border: `1px solid ${isSel ? 'var(--gh-accent)' : 'var(--gh-border)'}`, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
                  <label style={{ display: 'flex', cursor: 'pointer' }} title="Select for proposal">
                    <input type="checkbox" checked={isSel} onChange={() => onToggleSelect(s.referenceId)} style={{ width: 16, height: 16, accentColor: 'var(--gh-accent)', cursor: 'pointer' }} />
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 54 }}>
                    <span style={{ fontSize: 18, fontWeight: 'var(--gh-font-weight-bold)', color: rt.fg, lineHeight: 1 }}>{s.overallRelevanceScore}</span>
                    <div style={{ width: 48, height: 4, borderRadius: 4, background: 'var(--gh-bg-surface-muted)', marginTop: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${s.overallRelevanceScore}%`, height: '100%', background: 'linear-gradient(90deg, var(--gh-accent), var(--gh-success-fg))' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{lib?.projectTitle ?? s.referenceId}</span>
                      {lib && <Pill tone={cparsTone(lib.cparsRating)} style={{ fontSize: 9 }}>{lib.cparsRating}</Pill>}
                      {lib?.source === 'teammate' && <Pill tone="accent" style={{ fontSize: 9 }}>{lib.sourceCompanyName}</Pill>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, fontSize: 11, color: 'var(--gh-text-tertiary)' }}>
                      {lib && <span>{lib.clientAgency}</span>}
                      {rc && <span style={{ color: tone(rc.tone).fg }}>· {rc.label}</span>}
                    </div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', background: rec.bg, color: rec.fg, fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap' }}>{s.selectionRecommendation}</span>
                  <button onClick={() => setExpanded(p => { const n = new Set(p); n.has(s.referenceId) ? n.delete(s.referenceId) : n.add(s.referenceId); return n; })} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)' }}>{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button>
                </div>
                {isOpen && (
                  <div style={{ padding: '4px 14px 14px 60px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--gh-border)' }}>
                    <p style={{ margin: '10px 0 0', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.6 }}>{s.relevanceRationale}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px 18px' }}>
                      {DIMS.map(([k, lbl]) => {
                        const v = s[k] as number;
                        return (
                          <div key={String(k)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gh-text-disabled)', marginBottom: 3 }}><span>{lbl}</span><span style={{ color: 'var(--gh-text-tertiary)' }}>{v}</span></div>
                            <div style={{ height: 4, borderRadius: 4, background: 'var(--gh-bg-surface-muted)', overflow: 'hidden' }}><div style={{ width: `${v}%`, height: '100%', background: tone(relevanceTone(v)).fg }} /></div>
                          </div>
                        );
                      })}
                    </div>
                    {s.requirementsCovered.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: 'var(--gh-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Covers</span>
                        {s.requirementsCovered.map(rid => <Pill key={rid} tone="success" style={{ fontSize: 9 }}>{rid}</Pill>)}
                      </div>
                    )}
                    {s.concerns.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: 7, fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-warning-fg)' }}><AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />{c}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* (B) coverage matrix */}
      <div>
        <SectionLabel>Requirement Coverage Matrix</SectionLabel>
        <div style={{ overflowX: 'auto', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F, minWidth: 720 }}>
            <thead><tr>
              <th style={{ ...MTH, textAlign: 'left', minWidth: 200 }}>Requirement</th>
              {refsInMatrix.map(id => <th key={id} style={MTH} title={libMap[id]?.projectTitle}>{id}</th>)}
              <th style={MTH}>Coverage</th>
            </tr></thead>
            <tbody>
              {coverage.map(row => {
                const isGap = row.coverage === 'GAP';
                return (
                  <tr key={row.requirementId} style={{ background: isGap ? 'var(--gh-danger-bg)' : 'transparent' }}>
                    <td style={{ ...MTD, textAlign: 'left' }}>
                      <span style={{ color: 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-medium)' }}>{row.requirementId}</span> <span style={{ color: 'var(--gh-text-tertiary)' }}>{row.requirement}</span>
                      {isGap && <button onClick={() => onSuggestPartner(row.requirement)} style={{ marginLeft: 8, fontSize: 10, color: 'var(--gh-danger-fg)', background: 'transparent', border: '1px solid var(--gh-danger-border)', borderRadius: 'var(--gh-radius-sm)', padding: '2px 7px', cursor: 'pointer', fontFamily: F }}>Suggest Partner</button>}
                    </td>
                    {refsInMatrix.map(id => {
                      const strength: CoverageStrength = row.perReference[id] ?? 'none';
                      const dots = coverageStrengthDots(strength);
                      const ev = row.evidence[id];
                      return (
                        <td key={id} style={{ ...MTD, cursor: dots ? 'pointer' : 'default' }} onClick={() => dots && ev && setEvidence({ req: row.requirement, refId: id, text: ev })} title={ev || ''}>
                          {dots === 0 ? <span style={{ color: 'var(--gh-text-disabled)' }}>–</span>
                            : <span style={{ color: strength === 'strong' ? 'var(--gh-success-fg)' : strength === 'moderate' ? 'var(--gh-accent-tint)' : 'var(--gh-warning-fg)', letterSpacing: 1 }}>{'●'.repeat(dots)}</span>}
                        </td>
                      );
                    })}
                    <td style={MTD}><Pill tone={coverageLevelTone(row.coverage)} style={{ fontSize: 9 }}>{row.coverage}</Pill></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 10, color: 'var(--gh-text-disabled)', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--gh-success-fg)' }}>●●● strong</span>
          <span style={{ color: 'var(--gh-accent-tint)' }}>●● moderate</span>
          <span style={{ color: 'var(--gh-warning-fg)' }}>● partial</span>
          <span>– none</span>
          <span style={{ marginLeft: 'auto' }}>Click a filled cell for evidence</span>
        </div>
        {evidence && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8, padding: '10px 13px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border-strong)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--gh-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{evidence.refId} · {evidence.req}</div>
              <p style={{ margin: 0, fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.55 }}>{evidence.text}</p>
            </div>
            <button onClick={() => setEvidence(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', alignSelf: 'flex-start' }}><X size={14} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

const MTH: React.CSSProperties = { textAlign: 'center', padding: '8px 10px', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#f8fafc', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--gh-border)', background: 'var(--gh-bg-surface)' };
const MTD: React.CSSProperties = { textAlign: 'center', padding: '9px 10px', fontSize: 'var(--gh-font-size-xs)', verticalAlign: 'middle', borderBottom: '1px solid var(--gh-border)' };

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gh-text-disabled)', fontWeight: 'var(--gh-font-weight-semibold)', marginBottom: 9 }}>{children}</div>;
}
function Mini({ label, value, tone: t }: { label: string; value: string; tone: Tone }) {
  return <div><span style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-bold)', color: tone(t).fg }}>{value}</span> <span style={{ fontSize: 11, color: 'var(--gh-text-disabled)' }}>{label}</span></div>;
}

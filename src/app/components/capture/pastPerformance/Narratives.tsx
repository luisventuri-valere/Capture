import React, { useState } from 'react';
import {
  Sparkles, Loader2, Wand2, Plus, CheckCircle2, Circle, FileText, ListChecks,
} from 'lucide-react';
import type { PPNarrative, PPLibraryEntry, PPRequirement, NarrativeSection, QualityKey } from '../../../../types/pastPerformance';
import { F, tone } from '../staffing/helpers';
import { Pill, Btn } from '../staffing/ui';
import { QUALITY_LABELS, sectionQualityTone, relevanceTone, cparsTone } from './ppHelpers';

const EDIT_SECTIONS: { key: NarrativeSection; label: string }[] = [
  { key: 'relevanceNarrative', label: 'Relevance' },
  { key: 'performanceNarrative', label: 'Performance' },
  { key: 'lessonsLearnedNarrative', label: 'Lessons Learned' },
];

type SectMap = Record<NarrativeSection, string>;

export function Narratives({ selectedIds, narratives, library, requirements, onToast }: {
  selectedIds: string[]; narratives: PPNarrative[]; library: PPLibraryEntry[]; requirements: PPRequirement[]; onToast: (m: string) => void;
}) {
  const [gen, setGen] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState<Set<string>>(new Set());
  const [text, setText] = useState<Record<string, SectMap>>({});
  const [strengthened, setStrengthened] = useState<Record<string, Set<NarrativeSection>>>({});
  const [busy, setBusy] = useState<Set<string>>(new Set()); // `${refId}:${section}`

  const reqLabel = (id: string) => requirements.find(r => r.id === id)?.label ?? id;
  const narrOf = (id: string) => narratives.find(n => n.referenceId === id);
  const libOf = (id: string) => library.find(l => l.id === id);

  const generate = (id: string) => {
    const n = narrOf(id); if (!n) return;
    setGenerating(p => new Set(p).add(id));
    window.setTimeout(() => {
      setText(t => ({ ...t, [id]: { relevanceNarrative: n.relevanceNarrative, performanceNarrative: n.performanceNarrative, lessonsLearnedNarrative: n.lessonsLearnedNarrative } }));
      setGen(g => ({ ...g, [id]: true }));
      setGenerating(p => { const s = new Set(p); s.delete(id); return s; });
    }, 800);
  };
  const strengthen = (id: string, sec: NarrativeSection) => {
    const n = narrOf(id); if (!n) return;
    const key = `${id}:${sec}`;
    setBusy(p => new Set(p).add(key));
    window.setTimeout(() => {
      setText(t => ({ ...t, [id]: { ...t[id], [sec]: n.improvedVersions[sec] } }));
      setStrengthened(s => ({ ...s, [id]: new Set(s[id] ?? []).add(sec) }));
      setBusy(p => { const x = new Set(p); x.delete(key); return x; });
    }, 800);
  };
  const addMetric = (id: string, sec: NarrativeSection) => {
    const v = window.prompt('Add a specific metric (e.g. "reduced MTTR by 38%"):');
    if (!v || !v.trim()) return;
    setText(t => ({ ...t, [id]: { ...t[id], [sec]: `${t[id][sec]} ${v.trim()}.` } }));
    onToast('Metric inserted');
  };
  const effectiveQuality = (n: PPNarrative, id: string, sec: NarrativeSection) =>
    strengthened[id]?.has(sec) ? 'strong' : n.sectionQuality[sec];

  if (selectedIds.length === 0) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 240, textAlign: 'center', gap: 10 }}>
        <FileText size={34} style={{ color: 'var(--gh-text-disabled)' }} />
        <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)', maxWidth: 360 }}>No references selected yet. Select references in <strong style={{ color: 'var(--gh-text-secondary)' }}>Opportunity Match</strong> to draft their narratives here.</div>
      </div>
    );
  }

  // combined quality
  const genIds = selectedIds.filter(id => gen[id]);
  const avgQ = genIds.length ? Math.round(genIds.reduce((s, id) => s + (narrOf(id)?.qualityScore ?? 0), 0) / genIds.length) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* combined view */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', padding: '11px 14px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
        <ListChecks size={16} style={{ color: 'var(--gh-accent-tint)' }} />
        <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)' }}>{genIds.length} of {selectedIds.length} narratives drafted</span>
        {genIds.length > 0 && <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 11, color: 'var(--gh-text-disabled)' }}>Avg quality</span><span style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-bold)', color: tone(relevanceTone(avgQ)).fg }}>{avgQ}</span></span>}
      </div>

      {selectedIds.map(id => {
        const n = narrOf(id); const lib = libOf(id);
        if (!n || !lib) return (
          <div key={id} style={{ padding: '12px 14px', borderRadius: 'var(--gh-radius-lg)', border: '1px solid var(--gh-border)', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-disabled)' }}>No pre-written narrative on file for {id}.</div>
        );
        const isGen = gen[id]; const t = text[id];
        return (
          <div key={id} style={{ border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-xl)', overflow: 'hidden', background: 'var(--gh-bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: isGen ? '1px solid var(--gh-border)' : 'none' }}>
              <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', flex: 1 }}>{lib.projectTitle}</span>
              <Pill tone={cparsTone(lib.cparsRating)} style={{ fontSize: 9 }}>{lib.cparsRating}</Pill>
              {!isGen
                ? <Btn kind="primary" size="sm" icon={generating.has(id) ? <Loader2 size={13} className="gh-spin" /> : <Sparkles size={13} />} onClick={() => generate(id)} disabled={generating.has(id)}>{generating.has(id) ? 'Drafting…' : 'Generate Narrative'}</Btn>
                : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 11, color: 'var(--gh-text-disabled)' }}>Quality</span><span style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-bold)', color: tone(relevanceTone(n.qualityScore)).fg }}>{n.qualityScore}</span></span>}
            </div>

            {isGen && t && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: 0 }}>
                {/* editor */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14, borderRight: '1px solid var(--gh-border)' }}>
                  <DisplayBlock label="Contract Information" text={n.contractInfoBlock} />
                  <DisplayBlock label="Point of Contact" text={n.contactInfoBlock} />
                  {EDIT_SECTIONS.map(sec => {
                    const q = effectiveQuality(n, id, sec.key);
                    const qt = tone(sectionQualityTone(q));
                    const k = `${id}:${sec.key}`;
                    return (
                      <div key={sec.key}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 10, color: 'var(--gh-text-disabled)', fontWeight: 'var(--gh-font-weight-semibold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sec.label}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, color: qt.fg, fontWeight: 'var(--gh-font-weight-semibold)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: qt.fg }} />{q === 'strong' ? 'Strong' : q === 'moderate' ? 'Could add metrics' : 'Weak — generic'}</span>
                          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                            <button onClick={() => addMetric(id, sec.key)} style={miniBtn}><Plus size={11} /> Metric</button>
                            {q !== 'strong' && <button onClick={() => strengthen(id, sec.key)} disabled={busy.has(k)} style={{ ...miniBtn, color: 'var(--gh-accent-tint)', borderColor: 'var(--gh-accent)' }}>{busy.has(k) ? <Loader2 size={11} className="gh-spin" /> : <Wand2 size={11} />} Strengthen</button>}
                          </div>
                        </div>
                        <textarea value={t[sec.key]} onChange={e => setText(prev => ({ ...prev, [id]: { ...prev[id], [sec.key]: e.target.value } }))} rows={4}
                          style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', background: 'var(--gh-bg-surface-muted)', border: `1px solid ${qt.bd}`, borderLeft: `3px solid ${qt.fg}`, borderRadius: 'var(--gh-radius-md)', padding: '9px 11px', color: 'var(--gh-text-secondary)', fontSize: 'var(--gh-font-size-sm)', lineHeight: 1.6, fontFamily: F }} />
                      </div>
                    );
                  })}
                </div>

                {/* quality dashboard + requirement mapping */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--gh-bg-canvas)' }}>
                  <div>
                    <Label>Quality Checklist</Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {(Object.keys(QUALITY_LABELS) as QualityKey[]).map(k => {
                        const ok = n.qualityChecklist[k];
                        return (
                          <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 11, color: ok ? 'var(--gh-text-secondary)' : 'var(--gh-text-disabled)' }}>
                            {ok ? <CheckCircle2 size={13} style={{ color: 'var(--gh-success-fg)', flexShrink: 0, marginTop: 1 }} /> : <Circle size={13} style={{ color: 'var(--gh-text-disabled)', flexShrink: 0, marginTop: 1 }} />}
                            {QUALITY_LABELS[k]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label>Requirements Addressed</Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {n.requirementsAddressed.map(rid => (
                        <div key={rid} style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--gh-text-secondary)' }}><Pill tone="success" style={{ fontSize: 9 }}>{rid}</Pill><span style={{ lineHeight: 1.4 }}>{reqLabel(rid)}</span></div>
                      ))}
                    </div>
                  </div>
                  {n.metricsIncluded.length > 0 && (
                    <div>
                      <Label>Metrics Included</Label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{n.metricsIncluded.map((m, i) => <span key={i} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)' }}>{m}</span>)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const miniBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-sm)', padding: '3px 8px', color: 'var(--gh-text-tertiary)', fontSize: 10, fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer', fontFamily: F };

function DisplayBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', padding: '9px 11px' }}>{text}</div>
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gh-text-disabled)', fontWeight: 'var(--gh-font-weight-semibold)', marginBottom: 7 }}>{children}</div>;
}

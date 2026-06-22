import React, { useState, useCallback } from 'react';
import {
  ClipboardList, Search, Lightbulb, ListChecks, Bot, Sparkles, Paperclip, Undo2,
  Lock, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronRight,
  Check, X, Edit2, ArrowRight, Target, Info,
  BarChart2, TrendingUp,
} from 'lucide-react';
import solRaw from '../../../imports/opp-001-solutioning.json';
import { SectionIndex } from './SectionIndex';
import { DetailPanel, ActionButton } from './DetailPanel';

// ─── Types aligned to the real JSON shape ────────────────────────────────────

interface WinThemeRef { id: string; theme: string; source: string }
interface GoalCoverageRef { percent: number; covered: string[]; uncovered: Array<{ factor: string; note: string }> }
interface CountsRef { validated: number; needsWork: number; shaping: number; stvPassed: number; stvConditional: number; stvFailed: number }
interface OverviewRef { winThemes: WinThemeRef[]; goalCoverage: GoalCoverageRef; counts: CountsRef; howThreshold: number }

interface RuleVerdict { verdict: string; rationale: string }
interface SBSValidation {
  overall: string;
  rules: { demonstrable: RuleVerdict; differentiating: RuleVerdict; defensible: RuleVerdict };
  suggestions: string[];
}
interface EnvSource { label: string }
interface EnvelopeRef { confidence: number; aiReasoning: string; sources: EnvSource[]; versionHistory: Array<{ version: number; changedAt: string; changedBy: string; changeSummary: string }> }
interface LinkageRef { winThemes: string[]; discriminators: string[]; capabilityGaps: string[]; partner: string | null }

interface SolutionElement {
  id: string; category: string; title: string; status: string;
  linkage: LinkageRef;
  customerSaid: string; customerReallyWants: string; customerDoesntKnow: string;
  solution: { statement: string; method: string; metric: string; proof: string };
  evidence: string[];
  howRatio: number;
  sbsValidation: SBSValidation;
  gapResolution: string | null;
  envelope: EnvelopeRef;
}

interface SolData {
  overallConfidence: number;
  generatedBy: string;
  overview: OverviewRef;
  solutionElements: SolutionElement[];
}

const sol = solRaw as unknown as SolData;

// ─── Verdict helpers ──────────────────────────────────────────────────────────

type OverallVerdict = 'PASSED' | 'CONDITIONAL' | 'FAILED';
type TriageFilter = 'All' | 'Passed' | 'Conditional' | 'Failed';

function verdictFg(v: string): string {
  if (v === 'PASSED' || v === 'PASS') return 'var(--gh-success-fg)';
  if (v === 'CONDITIONAL') return 'var(--gh-warning-fg)';
  return 'var(--gh-danger-fg)';
}
function verdictBg(v: string): string {
  if (v === 'PASSED' || v === 'PASS') return 'var(--gh-success-bg)';
  if (v === 'CONDITIONAL') return 'var(--gh-warning-bg)';
  return 'var(--gh-danger-bg)';
}
function confidenceFg(c: number): string {
  return c >= 75 ? 'var(--gh-success-fg)' : c >= 50 ? 'var(--gh-warning-fg)' : 'var(--gh-danger-fg)';
}
function confidenceBg(c: number): string {
  return c >= 75 ? 'var(--gh-success-bg)' : c >= 50 ? 'var(--gh-warning-bg)' : 'var(--gh-danger-bg)';
}
function ruleLabel(v: string): string {
  if (v === 'PASS') return 'Pass';
  if (v === 'FAIL') return 'Fail';
  return 'Conditional';
}

// ─── Rail groupings (derived from linkage.winThemes) ─────────────────────────

const RAIL_GROUPS = [
  { id: 'WT-01', label: 'WT-01 · Accelerated Mission Outcomes Through Proven Methodology' },
  { id: 'WT-02', label: 'WT-02 · Zero-Day Compliance Through FedRAMP High Authorization' },
  { id: 'WT-03', label: 'WT-03 · Mission-Focused Security Integration, Not Bolted-On Compliance' },
  { id: 'NO_THEME', label: 'Capability gaps — no theme' },
];

function groupForElement(el: SolutionElement): string {
  if (el.linkage.winThemes.length > 0) return el.linkage.winThemes[0];
  return 'NO_THEME';
}

// ─── Cascade helpers ──────────────────────────────────────────────────────────

const CASCADE_SUGGESTION = 'Re-source CG-01: DataBridge withdrew (2026-02-12) — engage MigrationPro Federal or Attain Federal before the wave-plan claim re-enters the proposal.';

function elementVerdict(el: SolutionElement, cascade: boolean): OverallVerdict {
  if (cascade && el.id === 'sol-1') return 'CONDITIONAL';
  return el.sbsValidation.overall as OverallVerdict;
}

function elementConfidence(el: SolutionElement, cascade: boolean): number {
  if (cascade && el.id === 'sol-1') return 64;
  return el.envelope.confidence;
}

function elementStatus(el: SolutionElement, cascade: boolean): string {
  if (cascade && el.id === 'sol-1') return 'needs-work';
  return el.status;
}

function demoVerdict(el: SolutionElement, cascade: boolean): string {
  if (cascade && el.id === 'sol-1') return 'CONDITIONAL';
  return el.sbsValidation.rules.demonstrable.verdict;
}

// ─── Primitive components ─────────────────────────────────────────────────────

function Chip({ children, bg, fg, style }: {
  children: React.ReactNode; bg?: string; fg?: string; style?: React.CSSProperties;
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--gh-space-1)',
      padding: 'var(--gh-space-1) var(--gh-space-3)',
      borderRadius: 'var(--gh-radius-full)',
      fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
      fontWeight: 'var(--gh-font-weight-medium)',
      background: bg ?? 'var(--gh-bg-surface-muted)',
      color: fg ?? 'var(--gh-text-tertiary)',
      whiteSpace: 'nowrap', lineHeight: 1.6,
      ...style,
    }}>
      {children}
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
      fontWeight: 'var(--gh-font-weight-semibold)',
      color: 'var(--gh-text-disabled)', textTransform: 'uppercase' as const,
      letterSpacing: '0.06em', marginBottom: 'var(--gh-space-2)',
    }}>
      {children}
    </div>
  );
}

function BodyText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{
      margin: 0, fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
      color: 'var(--gh-text-secondary)', lineHeight: 1.65, ...style,
    }}>
      {children}
    </p>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, background: 'var(--gh-border)', margin: 'var(--gh-space-6) 0' }} />;
}

function SourceChips({ sources }: { sources: EnvSource[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--gh-space-2)', marginTop: 'var(--gh-space-5)' }}>
      {sources.map((s, i) => (
        <Chip key={i} bg="var(--gh-bg-surface)" fg="var(--gh-text-tertiary)">
          <Paperclip size={9} /> {s.label}
        </Chip>
      ))}
    </div>
  );
}

// ─── Band wrapper ─────────────────────────────────────────────────────────────

function Band({ icon, title, verdict, children, defaultOpen = true }: {
  icon: React.ReactNode; title: string; verdict?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ width: '100%', fontFamily: 'var(--gh-font)' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
        padding: '16px 24px', background: 'var(--gh-bg-elevated)',
        border: 'none', cursor: 'pointer', fontFamily: 'var(--gh-font)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--gh-text-tertiary)', display: 'flex', flexShrink: 0 }}>{icon}</span>
          <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.55px' }}>
            {title}
          </span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {verdict && (
            <Chip bg={verdictBg(verdict)} fg={verdictFg(verdict)}>
              {verdict === 'PASSED' ? '✓ PASSED' : verdict === 'CONDITIONAL' ? '△ CONDITIONAL' : '✕ FAILED'}
            </Chip>
          )}
          <ChevronDown size={16} style={{ color: 'var(--gh-text-tertiary)', flexShrink: 0, transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform .15s' }} />
        </span>
      </button>
      {open && (
        <div style={{ padding: '32px 24px', background: 'var(--gh-bg-elevated)', color: 'var(--gh-text)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Zone A: Win Themes & Goal Coverage ──────────────────────────────────────

function WinThemesPanel({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { winThemes, goalCoverage } = sol.overview;
  const uncovered = goalCoverage.uncovered[0];

  return (
    <div style={{
      border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)',
      marginBottom: 'var(--gh-space-8)', overflow: 'hidden',
      background: 'var(--gh-bg-elevated)',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)',
          padding: 'var(--gh-space-5) var(--gh-space-8)',
          background: 'var(--gh-bg-surface-muted)',
          border: 'none', borderBottom: collapsed ? 'none' : '1px solid var(--gh-border)',
          cursor: 'pointer',
        }}
      >
        <Target size={14} color="var(--gh-accent-tint)" />
        <span style={{
          flex: 1, textAlign: 'left' as const,
          fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
          fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)',
        }}>
          Win Themes &amp; Goal Coverage
        </span>
        <Chip bg="var(--gh-success-bg)" fg="var(--gh-success-fg)">
          {goalCoverage.percent}% covered
        </Chip>
        {collapsed
          ? <ChevronRight size={14} color="var(--gh-text-tertiary)" />
          : <ChevronDown size={14} color="var(--gh-text-tertiary)" />}
      </button>

      {!collapsed && (
        <div style={{ padding: 'var(--gh-space-7) var(--gh-space-8)' }}>
          {/* Win theme cards */}
          <div style={{ display: 'flex', gap: 'var(--gh-space-5)', marginBottom: 'var(--gh-space-7)', flexWrap: 'wrap' as const }}>
            {winThemes.map(wt => (
              <div key={wt.id} style={{
                flex: '1 1 200px',
                padding: 'var(--gh-space-5) var(--gh-space-6)',
                background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)',
                borderRadius: 'var(--gh-radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)', marginBottom: 'var(--gh-space-3)' }}>
                  <Chip bg="var(--gh-info-bg)" fg="var(--gh-info-fg)">{wt.id}</Chip>
                  <Chip bg="var(--gh-bg-surface-muted)" fg="var(--gh-text-disabled)">
                    <Paperclip size={9} /> {wt.source}
                  </Chip>
                </div>
                <div style={{
                  fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
                  fontWeight: 'var(--gh-font-weight-medium)', color: 'var(--gh-text)', lineHeight: 1.4,
                }}>
                  {wt.theme}
                </div>
                <button style={{
                  marginTop: 'var(--gh-space-4)', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
                  color: 'var(--gh-accent-tint)', padding: 0,
                  display: 'flex', alignItems: 'center', gap: 'var(--gh-space-1)',
                }}>
                  View in Strategy <ArrowRight size={10} />
                </button>
              </div>
            ))}
          </div>

          {/* Goal coverage card */}
          <div style={{
            background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)',
            borderRadius: 'var(--gh-radius-md)', padding: 'var(--gh-space-5) var(--gh-space-6)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)', marginBottom: 'var(--gh-space-5)' }}>
              <FieldLabel>Evaluation Factor Coverage</FieldLabel>
              <Chip bg="var(--gh-success-bg)" fg="var(--gh-success-fg)" style={{ marginLeft: 'auto' }}>
                {goalCoverage.percent}%
              </Chip>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--gh-space-2)', marginBottom: 'var(--gh-space-5)' }}>
              {goalCoverage.covered.map((f, i) => (
                <Chip key={i} bg="var(--gh-success-bg)" fg="var(--gh-success-fg)">
                  <Check size={9} /> {f}
                </Chip>
              ))}
            </div>
            {uncovered && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-4)',
                padding: 'var(--gh-space-4) var(--gh-space-5)',
                background: 'var(--gh-warning-bg)',
                border: '1px solid var(--gh-warning-border)',
                borderRadius: 'var(--gh-radius-default)',
              }}>
                <AlertTriangle size={13} color="var(--gh-warning-fg)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)', marginBottom: 'var(--gh-space-2)', flexWrap: 'wrap' as const }}>
                    <span style={{
                      fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
                      fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-warning-fg)',
                    }}>
                      {uncovered.factor}
                    </span>
                    <Chip
                      bg="var(--gh-warning-bg)" fg="var(--gh-warning-fg)"
                      style={{ border: '1px solid var(--gh-warning-border)', fontSize: 9 }}
                    >
                      <ArrowRight size={8} /> Staffing
                    </Chip>
                  </div>
                  <BodyText style={{ color: 'var(--gh-warning-fg)', fontSize: 'var(--gh-font-size-xs)' }}>
                    {uncovered.note}
                  </BodyText>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Zone B: Element rail ─────────────────────────────────────────────────────

// Grouped rail items — rendered inside the shared SectionIndex (provides the
// collapsible/resizable frame). Returns the win-theme groups; `narrow` → title-only.
function renderRailGroups({ selected, onSelect, filter, cascade, narrow }: {
  selected: string; onSelect: (id: string) => void;
  filter: TriageFilter; cascade: boolean; narrow: boolean;
}) {
  return RAIL_GROUPS.map(group => {
    const items = sol.solutionElements.filter(el => groupForElement(el) === group.id);
    const shown = items.filter(el => {
      if (filter === 'All') return true;
      const v = elementVerdict(el, cascade);
      if (filter === 'Passed') return v === 'PASSED';
      if (filter === 'Conditional') return v === 'CONDITIONAL';
      return v === 'FAILED';
    });
    if (shown.length === 0) return null;

    return (
      <div key={group.id}>
        {!narrow && (
          <div style={{
            padding: 'var(--gh-space-2) var(--gh-space-6)',
            fontSize: 9, fontFamily: 'var(--gh-font)',
            fontWeight: 'var(--gh-font-weight-semibold)', letterSpacing: '0.04em',
            color: group.id === 'NO_THEME' ? 'var(--gh-warning-fg)' : 'var(--gh-text-disabled)',
            borderBottom: '1px solid var(--gh-border)',
            background: group.id === 'NO_THEME' ? 'var(--gh-warning-bg)' : 'var(--gh-bg-canvas)',
            textTransform: 'none' as const,
          }}>
            {group.id === 'NO_THEME'
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={9} /> {group.label}</span>
              : group.label}
          </div>
        )}

        {shown.map(el => {
          const v = elementVerdict(el, cascade);
          const conf = elementConfidence(el, cascade);
          const isSelected = el.id === selected;
          const DotIcon = v === 'PASSED' ? CheckCircle : v === 'CONDITIONAL' ? AlertTriangle : XCircle;

          if (narrow) {
            return (
              <button
                key={el.id}
                onClick={() => onSelect(el.id)}
                style={{
                  width: '100%', textAlign: 'left' as const,
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                  padding: '12px 10px',
                  background: isSelected ? 'var(--gh-blue-900)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                }}
              >
                <DotIcon size={12} color={verdictFg(v)} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{
                  fontSize: 12, fontWeight: 'var(--gh-font-weight-semibold)', lineHeight: 1.35,
                  color: isSelected ? 'var(--gh-text)' : '#94a3b8',
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                }}>
                  {el.title}
                </span>
              </button>
            );
          }

          return (
            <button
              key={el.id}
              onClick={() => onSelect(el.id)}
              style={{
                width: '100%', textAlign: 'left' as const,
                display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-4)',
                padding: 'var(--gh-space-5) var(--gh-space-6)',
                background: isSelected ? 'var(--gh-blue-900)' : 'transparent',
                borderLeft: `2px solid ${isSelected ? 'var(--gh-accent)' : 'transparent'}`,
                borderTop: 'none', borderRight: 'none',
                borderBottom: '1px solid var(--gh-border)',
                cursor: 'pointer',
              }}
            >
              <DotIcon size={12} color={verdictFg(v)} style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
                  fontWeight: 'var(--gh-font-weight-medium)',
                  color: isSelected ? 'var(--gh-text)' : 'var(--gh-text-secondary)',
                  marginBottom: 'var(--gh-space-2)', lineHeight: 1.35,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                }}>
                  {el.title}
                </div>
                <div style={{ display: 'flex', gap: 'var(--gh-space-2)', flexWrap: 'wrap' as const }}>
                  <Chip bg="var(--gh-bg-surface)" fg="var(--gh-text-disabled)" style={{ fontSize: 9 }}>
                    {el.howRatio}% HOW
                  </Chip>
                  <Chip bg={confidenceBg(conf)} fg={confidenceFg(conf)} style={{ fontSize: 9 }}>
                    {conf}%
                  </Chip>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  });
}

// ─── Suggestion item (string-based from real JSON) ────────────────────────────

interface SugState { [key: string]: 'proposed' | 'accepted' | 'rejected' }

function SuggestionItem({ text, stateKey, states, onAction }: {
  text: string; stateKey: string;
  states: SugState; onAction: (k: string, a: 'accepted' | 'rejected' | 'proposed') => void;
}) {
  const [editing, setEditing] = useState(false);
  const [localText, setLocalText] = useState(text);
  const [savedText, setSavedText] = useState(text);

  const current  = states[stateKey] ?? 'proposed';
  const accepted = current === 'accepted';
  const rejected = current === 'rejected';
  const rowBg = accepted ? 'var(--gh-success-bg)' : rejected ? 'var(--gh-danger-bg)' : 'var(--gh-bg-surface)';

  const saveEdit = () => { if (localText.trim()) setSavedText(localText.trim()); setEditing(false); };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: rowBg, fontFamily: 'var(--gh-font)' }}>
      {/* Status dot */}
      <div style={{ width: 16, height: 16, borderRadius: 9999, flexShrink: 0, background: accepted ? 'var(--gh-success-fg)' : rejected ? 'var(--gh-danger-fg)' : 'transparent', border: (!accepted && !rejected) ? '1px solid var(--gh-border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {accepted && <Check size={10} color="var(--gh-success-bg)" />}
        {rejected && <X size={10} color="var(--gh-danger-bg)" />}
      </div>

      {/* Text or input */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {editing ? (
          <input
            autoFocus
            value={localText}
            onChange={e => setLocalText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setLocalText(savedText); setEditing(false); } }}
            style={{ width: '100%', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-accent)', borderRadius: 'var(--gh-radius-sm)', padding: '4px 8px', color: 'var(--gh-text)', fontSize: 13, fontFamily: 'var(--gh-font)', outline: 'none', boxSizing: 'border-box' }}
          />
        ) : (
          <span style={{ fontSize: 13, color: 'var(--gh-text)', display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {savedText}
          </span>
        )}
      </div>

      {/* Actions — ghost icon buttons, no borders */}
      {accepted || rejected ? (
        <button title="Undo" onClick={() => onAction(stateKey, 'proposed')} style={{ width: 32, height: 32, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Undo2 size={14} />
        </button>
      ) : editing ? (
        <button title="Save" onClick={saveEdit} style={{ width: 32, height: 32, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-success-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check size={16} />
        </button>
      ) : (
        <div style={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}>
          <button title="Accept" onClick={() => onAction(stateKey, 'accepted')} style={{ width: 32, height: 32, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check size={16} />
          </button>
          <button title="Reject" onClick={() => onAction(stateKey, 'rejected')} style={{ width: 32, height: 32, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={16} />
          </button>
          <button title="Edit" onClick={() => { setLocalText(savedText); setEditing(true); }} style={{ width: 32, height: 32, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Edit2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Zone C: Element detail ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    validated:    { bg: 'var(--gh-success-bg)', fg: 'var(--gh-success-fg)', label: 'Validated' },
    'needs-work': { bg: 'var(--gh-warning-bg)', fg: 'var(--gh-warning-fg)', label: 'Needs Work' },
    shaping:      { bg: 'var(--gh-bg-surface-muted)', fg: 'var(--gh-text-tertiary)', label: 'Shaping' },
  };
  const s = map[status] ?? map['shaping'];
  return <Chip bg={s.bg} fg={s.fg}>{s.label}</Chip>;
}

function ElementDetail({ elementId, cascade, sugStates, onSugAction }: {
  elementId: string; cascade: boolean;
  sugStates: SugState; onSugAction: (k: string, a: 'accepted' | 'rejected') => void;
}) {
  const el = sol.solutionElements.find(e => e.id === elementId);
  if (!el) return null;

  const verdict = elementVerdict(el, cascade);
  const confidence = elementConfidence(el, cascade);
  const status = elementStatus(el, cascade);
  const isFailed = verdict === 'FAILED';
  const isLimitedData = confidence < 50;

  // Build suggestions list: cascade injects at top for sol-1
  const suggestions: string[] = [
    ...(cascade && elementId === 'sol-1' ? [CASCADE_SUGGESTION] : []),
    ...el.sbsValidation.suggestions,
  ];

  const aiReasoning = (cascade && elementId === 'sol-1')
    ? 'sol-1 anchor element degraded: DataBridge withdrew 2026-02-12. Wave-plan claim is no longer defensible at current evidence level — the CG-01 fill is gone. Engaging MigrationPro Federal or Attain Federal is the correct next action before sol-1 re-enters the proposal package.'
    : el.envelope.aiReasoning;

  const ruleDisplay = [
    { name: 'Demonstrable', verdict: demoVerdict(el, cascade), rationale: el.sbsValidation.rules.demonstrable.rationale },
    { name: 'Differentiating', verdict: el.sbsValidation.rules.differentiating.verdict, rationale: el.sbsValidation.rules.differentiating.rationale },
    { name: 'Defensible', verdict: el.sbsValidation.rules.defensible.verdict, rationale: el.sbsValidation.rules.defensible.rationale },
  ];

  return (
    <DetailPanel
      scrollKey={elementId}
      background="var(--gh-bg-canvas)"
      onAskAI={() => {}}
      actions={() => (
        <>
          <ActionButton variant="ghost" icon={<Edit2 size={13} />}>Edit</ActionButton>
          <ActionButton variant="secondary" icon={<AlertTriangle size={13} />}>Request Review</ActionButton>
          <ActionButton
            variant="primary"
            icon={<CheckCircle size={13} />}
            disabled={isFailed}
            title={isFailed ? 'Cannot confirm a failed validation' : 'Confirm'}
          >
            Confirm
          </ActionButton>
        </>
      )}
    >
      <div style={{ padding: '24px 24px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-5)', marginBottom: 'var(--gh-space-6)' }}>
        <Chip bg={verdictBg(verdict)} fg={verdictFg(verdict)} style={{ padding: 'var(--gh-space-2) var(--gh-space-5)', fontSize: 11 }}>
          {verdict === 'PASSED' ? '✓ PASSED' : verdict === 'CONDITIONAL' ? '△ CONDITIONAL' : '✕ FAILED'}
        </Chip>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)', flexWrap: 'wrap' as const }}>
            <Chip bg="var(--gh-bg-surface-muted)" fg="var(--gh-text-tertiary)">{el.category}</Chip>
            <StatusBadge status={status} />
          </div>
        </div>
        <Chip bg={confidenceBg(confidence)} fg={confidenceFg(confidence)} style={{ fontSize: 11, flexShrink: 0 }}>
          ✦ {confidence}%
        </Chip>
      </div>

      {/* Linkage chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--gh-space-2)', marginBottom: 'var(--gh-space-6)' }}>
        {el.linkage.winThemes.map(wt => (
          <Chip key={wt} bg="var(--gh-info-bg)" fg="var(--gh-info-fg)">{wt}</Chip>
        ))}
        {el.linkage.discriminators.map(d => (
          <Chip key={d} bg="var(--gh-bg-surface-muted)" fg="var(--gh-text-tertiary)">{d}</Chip>
        ))}
        {el.linkage.capabilityGaps.map(cg => (
          <Chip key={cg} bg="var(--gh-warning-bg)" fg="var(--gh-warning-fg)">{cg}</Chip>
        ))}
        {el.linkage.partner && (
          <Chip bg="var(--gh-bg-surface)" fg="var(--gh-text-secondary)">{el.linkage.partner}</Chip>
        )}
      </div>
      </div>

      {/* AI Reasoning */}
      <div style={{ margin: 24, display: 'flex', gap: 12, alignItems: 'flex-start', padding: 24, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-elevated)' }}>
        <Sparkles size={14} style={{ flexShrink: 0, marginTop: 2, color: 'var(--gh-accent-tint)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-accent-tint)', fontFamily: 'var(--gh-font)' }}>AI Reasoning</span>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--gh-text-secondary)', margin: 0, fontFamily: 'var(--gh-font)' }}>{aiReasoning}</p>
        </div>
      </div>

      {/* Limited data banner — sol-6 */}
      {isLimitedData && (
        <div style={{ margin: '0 24px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-4)',
            padding: 'var(--gh-space-5) var(--gh-space-6)',
            background: 'var(--gh-warning-bg)',
            border: '1px solid var(--gh-warning-border)',
            borderRadius: 'var(--gh-radius-md)',
          }}>
            <BarChart2 size={14} color="var(--gh-warning-fg)" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{
              fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
              color: 'var(--gh-warning-fg)', fontWeight: 'var(--gh-font-weight-medium)',
            }}>
              This recommendation is based on limited data. Run ANALYZE workflow for better intelligence.
            </span>
          </div>
        </div>
      )}

      {/* ── FACTS band ─────────────────────────────────────────────────────── */}
      <Band icon={<ClipboardList size={14} />} title="Facts — The Requirement">
        <FieldLabel>What the customer asked for</FieldLabel>
        <BodyText>{el.customerSaid}</BodyText>
        <SectionDivider />
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--gh-space-2)', marginBottom: 'var(--gh-space-3)' }}>
          <Chip bg="var(--gh-bg-surface-muted)" fg="var(--gh-text-tertiary)">{el.category}</Chip>
          {el.linkage.winThemes.map(wt => <Chip key={wt} bg="var(--gh-info-bg)" fg="var(--gh-info-fg)">{wt}</Chip>)}
          {el.linkage.capabilityGaps.map(cg => <Chip key={cg} bg="var(--gh-warning-bg)" fg="var(--gh-warning-fg)">{cg}</Chip>)}
        </div>
        <SourceChips sources={el.envelope.sources} />
      </Band>

      {/* ── ANALYSIS band ──────────────────────────────────────────────────── */}
      <Band icon={<Search size={14} />} title="Analysis — The Read & Our Solution">
        <div style={{ marginBottom: 'var(--gh-space-6)' }}>
          <FieldLabel>What they really want</FieldLabel>
          <BodyText>{el.customerReallyWants}</BodyText>
        </div>
        <div style={{ marginBottom: 'var(--gh-space-6)' }}>
          <FieldLabel>Our Solution</FieldLabel>
          <BodyText>{el.solution.statement}</BodyText>
        </div>
        <div style={{
          background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)',
          borderRadius: 'var(--gh-radius-default)', padding: 'var(--gh-space-5) var(--gh-space-6)',
        }}>
          <div style={{ marginBottom: 'var(--gh-space-5)' }}>
            <FieldLabel>Method</FieldLabel>
            <BodyText style={{ fontSize: 'var(--gh-font-size-xs)' }}>{el.solution.method}</BodyText>
          </div>
          <div>
            <FieldLabel>Metric</FieldLabel>
            <BodyText style={{ fontSize: 'var(--gh-font-size-xs)' }}>{el.solution.metric}</BodyText>
          </div>
        </div>
      </Band>

      {/* ── INTELLIGENCE band ──────────────────────────────────────────────── */}
      <Band icon={<Lightbulb size={14} />} title="Intelligence — The Edge">
        <div style={{
          padding: 'var(--gh-space-5) var(--gh-space-6)',
          background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border-strong)',
          borderRadius: 'var(--gh-radius-default)', marginBottom: 'var(--gh-space-6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)', marginBottom: 'var(--gh-space-3)' }}>
            <Lock size={11} color="var(--gh-text-disabled)" />
            <span style={{
              fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
              fontWeight: 'var(--gh-font-weight-semibold)',
              color: 'var(--gh-text-disabled)', textTransform: 'uppercase' as const, letterSpacing: '0.06em',
            }}>
              Internal only — competitive intelligence
            </span>
          </div>
          <BodyText style={{ fontSize: 'var(--gh-font-size-xs)' }}>{el.customerDoesntKnow}</BodyText>
        </div>

        <div style={{ marginBottom: 'var(--gh-space-6)' }}>
          <FieldLabel>Proof Point</FieldLabel>
          <BodyText style={{ fontSize: 'var(--gh-font-size-xs)' }}>{el.solution.proof}</BodyText>
        </div>

        {el.evidence.length > 0 && (
          <div>
            <FieldLabel>Evidence</FieldLabel>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 'var(--gh-space-2)' }}>
              {el.evidence.map((ev, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)',
                  padding: 'var(--gh-space-2) var(--gh-space-4)',
                  background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)',
                  borderRadius: 'var(--gh-radius-default)',
                }}>
                  <Paperclip size={10} color="var(--gh-text-disabled)" style={{ flexShrink: 0 }} />
                  <span style={{
                    flex: 1, fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
                    color: 'var(--gh-text-secondary)',
                  }}>
                    {ev}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Band>

      {/* ── VALIDATION band ────────────────────────────────────────────────── */}
      <Band icon={<ListChecks size={14} />} title="Validation & Recommendations" verdict={verdict}>
        {/* HOW-not-WHAT check */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-5)',
          padding: 'var(--gh-space-5) var(--gh-space-6)',
          background: el.howRatio >= 70 ? 'var(--gh-success-bg)' : 'var(--gh-warning-bg)',
          border: `1px solid ${el.howRatio >= 70 ? 'var(--gh-success-border)' : 'var(--gh-warning-border)'}`,
          borderRadius: 'var(--gh-radius-default)', marginBottom: 'var(--gh-space-8)',
        }}>
          <TrendingUp size={14} color={el.howRatio >= 70 ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)'} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)', marginBottom: 'var(--gh-space-2)', flexWrap: 'wrap' as const }}>
              <span style={{
                fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
                fontWeight: 'var(--gh-font-weight-semibold)',
                color: el.howRatio >= 70 ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)',
              }}>
                HOW-not-WHAT Check
              </span>
              <Chip
                bg={el.howRatio >= 70 ? 'var(--gh-success-bg)' : 'var(--gh-warning-bg)'}
                fg={el.howRatio >= 70 ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)'}
                style={{ border: `1px solid ${el.howRatio >= 70 ? 'var(--gh-success-border)' : 'var(--gh-warning-border)'}` }}
              >
                {el.howRatio}% HOW
              </Chip>
              <span style={{
                fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
                color: 'var(--gh-text-disabled)',
              }}>
                threshold: {sol.overview.howThreshold}%
              </span>
            </div>
            <BodyText style={{
              fontSize: 'var(--gh-font-size-xs)',
              color: el.howRatio >= 70 ? 'var(--gh-success-fg)' : 'var(--gh-warning-fg)',
            }}>
              {el.howRatio >= 70
                ? 'Meets the 70% threshold — the claim explains the method, not just the outcome.'
                : 'Below the 70% threshold — too much WHAT vs HOW. Reframe around the delivery method.'}
            </BodyText>
          </div>
        </div>

        {/* 3-Rule grid */}
        <div style={{ marginBottom: 'var(--gh-space-8)' }}>
          <FieldLabel>3-Rule Validation</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gh-space-5)' }}>
            {ruleDisplay.map(rule => (
              <div key={rule.name} style={{
                background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)',
                borderRadius: 'var(--gh-radius-md)', padding: 'var(--gh-space-5) var(--gh-space-6)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)', marginBottom: 'var(--gh-space-4)' }}>
                  <span style={{
                    flex: 1, fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
                    fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)',
                  }}>
                    {rule.name}
                  </span>
                  <Chip bg={verdictBg(rule.verdict)} fg={verdictFg(rule.verdict)}>
                    {ruleLabel(rule.verdict)}
                  </Chip>
                </div>
                <BodyText style={{ fontSize: 'var(--gh-font-size-xs)' }}>{rule.rationale}</BodyText>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div style={{ marginBottom: 'var(--gh-space-6)' }}>
            <FieldLabel>Suggestions ({suggestions.length})</FieldLabel>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 'var(--gh-space-3)' }}>
              {suggestions.map((text, i) => {
                const key = `${elementId}-sug-${i}`;
                return (
                  <SuggestionItem
                    key={key} text={text} stateKey={key}
                    states={sugStates} onAction={onSugAction}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Gap resolution */}
        {el.gapResolution && (
          <div style={{
            padding: 'var(--gh-space-4) var(--gh-space-5)',
            background: 'var(--gh-info-bg)', border: '1px solid var(--gh-info-border)',
            borderRadius: 'var(--gh-radius-default)', marginBottom: 'var(--gh-space-4)',
          }}>
            <BodyText style={{ fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-info-fg)' }}>
              <strong>Gap resolution:</strong> {el.gapResolution}
            </BodyText>
          </div>
        )}

        {/* Version history footer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)',
          paddingTop: 'var(--gh-space-6)', borderTop: '1px solid var(--gh-border)',
          marginTop: 'var(--gh-space-4)',
        }}>
          <span style={{
            fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
            color: 'var(--gh-text-disabled)',
          }}>
            Last generated {el.envelope.versionHistory[0]?.changedAt} · SOL-001/STV-001
          </span>
          <button style={{
            marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
            color: 'var(--gh-accent-tint)', padding: 0,
          }}>
            Version History ({el.envelope.versionHistory.length})
          </button>
        </div>
      </Band>
    </DetailPanel>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999, maxWidth: 440,
      background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-warning-border)',
      borderRadius: 'var(--gh-radius-md)', padding: 'var(--gh-space-5) var(--gh-space-7)',
      display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-5)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    }}>
      <AlertTriangle size={14} color="var(--gh-warning-fg)" style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{
        flex: 1, fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
        color: 'var(--gh-text-secondary)', lineHeight: 1.5,
      }}>
        {message}
      </span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--gh-text-disabled)', padding: 0, flexShrink: 0,
      }}>
        <X size={12} />
      </button>
    </div>
  );
}

// ─── SolutioningTab (root) ────────────────────────────────────────────────────

export function SolutioningTab({ chromeHidden = false }: { chromeHidden?: boolean }) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [selected, setSelected] = useState('sol-1');
  const [filter, setFilter] = useState<TriageFilter>('All');
  const [toast, setToast] = useState<string | null>(null);
  const [sugStates, setSugStates] = useState<SugState>({});

  const { counts, overallConfidence } = { counts: sol.overview.counts, overallConfidence: sol.overallConfidence };

  const validatedLabel = `${counts.stvPassed} / ${sol.solutionElements.length}`;
  const triagePassed = counts.stvPassed;
  const triageCond = counts.stvConditional;
  const triageFailed = counts.stvFailed;

  const filterCounts: Record<TriageFilter, number> = {
    All: sol.solutionElements.length,
    Passed: triagePassed,
    Conditional: triageCond,
    Failed: triageFailed,
  };

  const handleSugAction = useCallback((k: string, a: 'accepted' | 'rejected' | 'proposed') => {
    setSugStates(prev => ({ ...prev, [k]: a }));
  }, []);

  const FILTERS: TriageFilter[] = ['All', 'Passed', 'Conditional', 'Failed'];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--gh-bg-canvas)', overflow: 'hidden',
      fontFamily: 'var(--gh-font)',
    }}>
      {/* Plan header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '24px var(--gh-space-12) 12px', flexShrink: 0, overflow: 'hidden', maxHeight: chromeHidden ? 0 : 120, opacity: chromeHidden ? 0 : 1, transition: 'max-height 0.3s ease, opacity 0.18s ease' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)' }}>
              {validatedLabel} validated
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 'var(--gh-radius-full)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', background: 'var(--gh-warning-bg)', color: 'var(--gh-warning-fg)', fontFamily: 'var(--gh-font)' }}>
              {overallConfidence}% confidence
              <Info size={13} />
            </span>
          </div>
          <p style={{ fontSize: 11, color: '#fff', margin: 0, fontFamily: 'var(--gh-font)' }}>
            Drafted by Solutioning Agent (SOL-001) · validated by Strength Validator (STV-001) · v3 · 2026-02-10
          </p>
        </div>
        <button style={{ height: 28, padding: '0 var(--gh-space-6)', background: 'transparent', color: 'var(--gh-text-tertiary)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)', fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)' }}>
          <Bot size={11} /> Regenerate
        </button>
      </div>

      {/* Zone A — Win Themes panel (scrolls with content above the split) */}
      <div style={{ padding: 'var(--gh-space-8) var(--gh-space-10) 0', flexShrink: 0 }}>
        <WinThemesPanel collapsed={panelCollapsed} onToggle={() => setPanelCollapsed(p => !p)} />
      </div>

      {/* Zone B + C — shared section index + Detail */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <SectionIndex
          title={`Solution Elements · ${sol.solutionElements.length}`}
          filter={(
            <div style={{ padding: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: 4, borderRadius: 'var(--gh-radius-lg)', background: 'rgba(255,255,255,0.06)' }}>
                {FILTERS.map(f => {
                  const on = filter === f;
                  return (
                    <button key={f} onClick={() => setFilter(f)} style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: 'var(--gh-radius-md)', border: 'none', cursor: 'pointer', fontFamily: 'var(--gh-font)', fontSize: 11, whiteSpace: 'nowrap' as const, background: on ? 'rgba(255,255,255,0.14)' : 'transparent', color: on ? '#edf2f7' : '#94a3b8', fontWeight: on ? 'var(--gh-font-weight-medium)' : 'var(--gh-font-weight-normal)' }}>
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          renderItems={(narrow) => renderRailGroups({ selected, onSelect: setSelected, filter, cascade: false, narrow })}
        />
        <ElementDetail
          elementId={selected}
          cascade={false}
          sugStates={sugStates}
          onSugAction={handleSugAction}
        />
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

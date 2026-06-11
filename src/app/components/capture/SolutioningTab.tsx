import React, { useState, useCallback } from 'react';
import {
  ClipboardList, Search, Lightbulb, ListChecks, Bot, Paperclip,
  Lock, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronRight,
  Check, X, Edit2, MessageSquare, AlertCircle, ArrowRight, Target,
  BarChart2, TrendingUp,
} from 'lucide-react';
import solRaw from '../../../imports/opp-001-solutioning.json';

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

function Band({ icon, title, verdict, children }: {
  icon: React.ReactNode; title: string; verdict?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)',
      marginBottom: 'var(--gh-space-6)', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)',
        padding: 'var(--gh-space-5) var(--gh-space-8)',
        background: 'var(--gh-bg-surface-muted)',
        borderBottom: '1px solid var(--gh-border)',
      }}>
        <span style={{ color: 'var(--gh-text-tertiary)', display: 'flex', flexShrink: 0 }}>{icon}</span>
        <span style={{
          flex: 1, fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
          fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)',
        }}>
          {title}
        </span>
        {verdict && (
          <Chip bg={verdictBg(verdict)} fg={verdictFg(verdict)}>
            {verdict === 'PASSED' ? '✓ PASSED' : verdict === 'CONDITIONAL' ? '△ CONDITIONAL' : '✕ FAILED'}
          </Chip>
        )}
      </div>
      <div style={{ padding: 'var(--gh-space-7) var(--gh-space-8)', background: 'var(--gh-bg-elevated)' }}>
        {children}
      </div>
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

function ElementRail({ selected, onSelect, filter, cascade }: {
  selected: string; onSelect: (id: string) => void;
  filter: TriageFilter; cascade: boolean;
}) {
  return (
    <div style={{
      width: 284, flexShrink: 0, display: 'flex', flexDirection: 'column',
      borderRight: '1px solid var(--gh-border)', overflowY: 'auto',
    }}>
      <div style={{
        padding: 'var(--gh-space-5) var(--gh-space-6)',
        borderBottom: '1px solid var(--gh-border)',
        background: 'var(--gh-bg-surface)', flexShrink: 0,
      }}>
        <span style={{
          fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
          fontWeight: 'var(--gh-font-weight-semibold)', letterSpacing: '0.07em',
          textTransform: 'uppercase' as const, color: 'var(--gh-text-disabled)',
        }}>
          Solution Elements · {sol.solutionElements.length}
        </span>
      </div>

      {RAIL_GROUPS.map(group => {
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

            {shown.map(el => {
              const v = elementVerdict(el, cascade);
              const conf = elementConfidence(el, cascade);
              const isSelected = el.id === selected;
              const DotIcon = v === 'PASSED' ? CheckCircle : v === 'CONDITIONAL' ? AlertTriangle : XCircle;

              return (
                <button
                  key={el.id}
                  onClick={() => onSelect(el.id)}
                  style={{
                    width: '100%', textAlign: 'left' as const,
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-4)',
                    padding: 'var(--gh-space-5) var(--gh-space-6)',
                    background: isSelected ? 'var(--gh-bg-surface-muted)' : 'transparent',
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
      })}
    </div>
  );
}

// ─── Suggestion item (string-based from real JSON) ────────────────────────────

interface SugState { [key: string]: 'proposed' | 'accepted' | 'rejected' }

function SuggestionItem({ text, stateKey, states, onAction }: {
  text: string; stateKey: string;
  states: SugState; onAction: (k: string, a: 'accepted' | 'rejected') => void;
}) {
  const current = states[stateKey] ?? 'proposed';
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-5)',
      padding: 'var(--gh-space-4) var(--gh-space-5)',
      background: current === 'accepted' ? 'var(--gh-success-bg)' : 'var(--gh-bg-surface)',
      border: `1px solid ${current === 'accepted' ? 'var(--gh-success-border)' : current === 'rejected' ? 'var(--gh-border)' : 'var(--gh-border)'}`,
      borderRadius: 'var(--gh-radius-default)',
      opacity: current === 'rejected' ? 0.45 : 1,
    }}>
      <BodyText style={{
        flex: 1, fontSize: 'var(--gh-font-size-xs)',
        textDecoration: current === 'rejected' ? 'line-through' : 'none',
        color: current === 'accepted' ? 'var(--gh-success-fg)' : 'var(--gh-text-secondary)',
      }}>
        {text}
      </BodyText>
      <div style={{ display: 'flex', gap: 'var(--gh-space-2)', flexShrink: 0 }}>
        {(['accepted', 'rejected'] as const).map(action => {
          const Icon = action === 'accepted' ? Check : X;
          const isActive = current === action;
          return (
            <button
              key={action}
              onClick={() => onAction(stateKey, action)}
              title={action === 'accepted' ? 'Accept' : 'Reject'}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive
                  ? (action === 'accepted' ? 'var(--gh-success-bg)' : 'var(--gh-danger-bg)')
                  : 'var(--gh-bg-surface-muted)',
                border: `1px solid ${isActive
                  ? (action === 'accepted' ? 'var(--gh-success-border)' : 'var(--gh-danger-border)')
                  : 'var(--gh-border)'}`,
                borderRadius: 'var(--gh-radius-sm)',
                cursor: 'pointer',
                color: isActive
                  ? (action === 'accepted' ? 'var(--gh-success-fg)' : 'var(--gh-danger-fg)')
                  : 'var(--gh-text-disabled)',
              }}
            >
              <Icon size={13} />
            </button>
          );
        })}
        <button
          title="Edit"
          style={{
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--gh-bg-surface-muted)',
            border: '1px solid var(--gh-border)',
            borderRadius: 'var(--gh-radius-sm)', cursor: 'pointer',
            color: 'var(--gh-text-disabled)',
          }}
        >
          <Edit2 size={12} />
        </button>
      </div>
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
  const isPPFlagged = cascade && elementId === 'sol-1';

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
    <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--gh-space-8) var(--gh-space-10)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-5)', marginBottom: 'var(--gh-space-6)' }}>
        <Chip bg={verdictBg(verdict)} fg={verdictFg(verdict)} style={{ padding: 'var(--gh-space-2) var(--gh-space-5)', fontSize: 11 }}>
          {verdict === 'PASSED' ? '✓ PASSED' : verdict === 'CONDITIONAL' ? '△ CONDITIONAL' : '✕ FAILED'}
        </Chip>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            margin: 0, fontSize: 'var(--gh-font-size-lg)', fontFamily: 'var(--gh-font)',
            fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)', lineHeight: 1.3,
          }}>
            {el.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)', marginTop: 'var(--gh-space-4)', flexWrap: 'wrap' as const }}>
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

      {/* Action row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)',
        marginBottom: 'var(--gh-space-8)', flexWrap: 'wrap' as const,
        paddingBottom: 'var(--gh-space-6)', borderBottom: '1px solid var(--gh-border)',
      }}>
        <button
          disabled={isFailed}
          title={isFailed ? 'Cannot confirm a failed validation' : 'Confirm'}
          style={{
            height: 32, padding: '0 var(--gh-space-7)',
            background: isFailed ? 'var(--gh-bg-surface-muted)' : 'var(--gh-accent)',
            color: isFailed ? 'var(--gh-text-disabled)' : 'var(--gh-accent-fg)',
            border: 'none', borderRadius: 'var(--gh-radius-md)',
            fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
            fontWeight: 'var(--gh-font-weight-medium)',
            cursor: isFailed ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)',
          }}
        >
          <CheckCircle size={13} /> Confirm
        </button>
        {[
          { label: 'Request Review', icon: <AlertTriangle size={13} /> },
          { label: 'Edit', icon: <Edit2 size={13} /> },
        ].map(({ label, icon }) => (
          <button key={label} style={{
            height: 32, padding: '0 var(--gh-space-7)',
            background: 'transparent', color: 'var(--gh-text-secondary)',
            border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)',
            fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
            fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)',
          }}>
            {icon} {label}
          </button>
        ))}
        <button style={{
          height: 32, padding: '0 var(--gh-space-7)',
          background: 'transparent', color: 'var(--gh-text-tertiary)',
          border: 'none', borderRadius: 'var(--gh-radius-md)',
          fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
          fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)',
        }}>
          <MessageSquare size={13} /> Ask AI
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--gh-space-3)' }}>
          <Chip
            bg={isPPFlagged ? 'var(--gh-warning-bg)' : 'var(--gh-bg-surface-muted)'}
            fg={isPPFlagged ? 'var(--gh-warning-fg)' : 'var(--gh-text-tertiary)'}
          >
            <ArrowRight size={9} /> Past Performance {isPPFlagged && <AlertTriangle size={9} />}
          </Chip>
          <Chip bg="var(--gh-bg-surface-muted)" fg="var(--gh-text-tertiary)">
            <ArrowRight size={9} /> Proposal
          </Chip>
        </div>
      </div>

      {/* AI Reasoning */}
      <div style={{
        border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)',
        marginBottom: 'var(--gh-space-6)', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--gh-space-4)',
          padding: 'var(--gh-space-4) var(--gh-space-6)',
          background: 'var(--gh-bg-surface-muted)',
          borderBottom: '1px solid var(--gh-border)',
        }}>
          <Bot size={13} color="var(--gh-accent-tint)" />
          <span style={{
            fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
            fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)',
          }}>
            AI Reasoning — Solutioning Agent v3
          </span>
        </div>
        <div style={{ padding: 'var(--gh-space-5) var(--gh-space-6)', background: 'var(--gh-bg-elevated)' }}>
          <BodyText style={{ fontSize: 'var(--gh-font-size-xs)' }}>{aiReasoning}</BodyText>
        </div>
      </div>

      {/* Limited data banner — sol-6 */}
      {isLimitedData && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 'var(--gh-space-4)',
          padding: 'var(--gh-space-5) var(--gh-space-6)',
          background: 'var(--gh-warning-bg)',
          border: '1px solid var(--gh-warning-border)',
          borderRadius: 'var(--gh-radius-md)', marginBottom: 'var(--gh-space-6)',
        }}>
          <BarChart2 size={14} color="var(--gh-warning-fg)" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{
            fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)',
            color: 'var(--gh-warning-fg)', fontWeight: 'var(--gh-font-weight-medium)',
          }}>
            This recommendation is based on limited data. Run ANALYZE workflow for better intelligence.
          </span>
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
    </div>
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

export function SolutioningTab() {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [selected, setSelected] = useState('sol-1');
  const [filter, setFilter] = useState<TriageFilter>('All');
  const [cascade, setCascade] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sugStates, setSugStates] = useState<SugState>({});

  const { counts, overallConfidence } = { counts: sol.overview.counts, overallConfidence: sol.overallConfidence };

  const validatedLabel = cascade ? `${counts.stvPassed - 1} / ${sol.solutionElements.length}` : `${counts.stvPassed} / ${sol.solutionElements.length}`;
  const triagePassed = cascade ? counts.stvPassed - 1 : counts.stvPassed;
  const triageCond = cascade ? counts.stvConditional + 1 : counts.stvConditional;
  const triageFailed = counts.stvFailed;

  const filterCounts: Record<TriageFilter, number> = {
    All: sol.solutionElements.length,
    Passed: triagePassed,
    Conditional: triageCond,
    Failed: triageFailed,
  };

  const handleCascade = useCallback(() => {
    const next = !cascade;
    setCascade(next);
    if (next) {
      setSelected('sol-1');
      setToast('Change detected — Strategy §3 edit propagated: sol-1 re-validated. Downstream flagged for regeneration: Past Performance, Pricing.');
    }
  }, [cascade]);

  const handleSugAction = useCallback((k: string, a: 'accepted' | 'rejected') => {
    setSugStates(prev => ({ ...prev, [k]: a }));
  }, []);

  const FILTERS: TriageFilter[] = ['All', 'Passed', 'Conditional', 'Failed'];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--gh-bg-canvas)', overflow: 'hidden',
      fontFamily: 'var(--gh-font)',
    }}>
      {/* Plan header strip */}
      <div style={{
        padding: 'var(--gh-space-5) var(--gh-space-10)',
        background: 'var(--gh-bg-elevated)',
        borderBottom: '1px solid var(--gh-border)',
        display: 'flex', alignItems: 'center', gap: 'var(--gh-space-5)',
        flexWrap: 'wrap' as const, flexShrink: 0,
      }}>
        <Chip bg={confidenceBg(overallConfidence)} fg={confidenceFg(overallConfidence)} style={{ fontSize: 11 }}>
          ✦ {overallConfidence}% confidence
        </Chip>
        <Chip bg="var(--gh-bg-surface-muted)" fg="var(--gh-text-secondary)">
          {validatedLabel} validated
        </Chip>
        <span style={{
          fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
          color: 'var(--gh-text-disabled)',
        }}>
          Drafted by{' '}
          <strong style={{ color: 'var(--gh-text-tertiary)' }}>Solutioning Agent (SOL-001)</strong>
          {' · '}validated by{' '}
          <strong style={{ color: 'var(--gh-text-tertiary)' }}>Strength Validator (STV-001)</strong>
          {' · '}v3 · 2026-02-10
        </span>

        {/* Triage filter pills */}
        <div style={{ display: 'flex', gap: 'var(--gh-space-1)' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                height: 24, padding: '0 var(--gh-space-5)',
                background: filter === f ? 'var(--gh-bg-surface-muted)' : 'transparent',
                border: `1px solid ${filter === f ? 'var(--gh-border-strong)' : 'transparent'}`,
                borderRadius: 'var(--gh-radius-sm)',
                fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
                fontWeight: filter === f ? 'var(--gh-font-weight-medium)' : 'var(--gh-font-weight-normal)',
                color: filter === f ? 'var(--gh-text)' : 'var(--gh-text-disabled)',
                cursor: 'pointer',
              }}
            >
              {f}{f !== 'All' && <span style={{ opacity: 0.6 }}> ({filterCounts[f]})</span>}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--gh-space-4)' }}>
          <button style={{
            height: 28, padding: '0 var(--gh-space-6)',
            background: 'transparent', color: 'var(--gh-text-tertiary)',
            border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)',
            fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
            fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)',
          }}>
            <Bot size={11} /> Regenerate
          </button>
          <button
            onClick={handleCascade}
            style={{
              height: 28, padding: '0 var(--gh-space-6)',
              background: cascade ? 'var(--gh-warning-bg)' : 'transparent',
              color: cascade ? 'var(--gh-warning-fg)' : 'var(--gh-text-tertiary)',
              border: `1px solid ${cascade ? 'var(--gh-warning-border)' : 'var(--gh-border)'}`,
              borderRadius: 'var(--gh-radius-md)',
              fontSize: 'var(--gh-font-size-xs)', fontFamily: 'var(--gh-font)',
              fontWeight: 'var(--gh-font-weight-medium)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 'var(--gh-space-3)',
            }}
          >
            <AlertCircle size={11} /> Preview cascade
          </button>
        </div>
      </div>

      {/* Zone A — Win Themes panel (scrolls with content above the split) */}
      <div style={{ padding: 'var(--gh-space-8) var(--gh-space-10) 0', flexShrink: 0 }}>
        <WinThemesPanel collapsed={panelCollapsed} onToggle={() => setPanelCollapsed(p => !p)} />
      </div>

      {/* Zone B + C — Rail + Detail */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <ElementRail
          selected={selected}
          onSelect={setSelected}
          filter={filter}
          cascade={cascade}
        />
        <ElementDetail
          elementId={selected}
          cascade={cascade}
          sugStates={sugStates}
          onSugAction={handleSugAction}
        />
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

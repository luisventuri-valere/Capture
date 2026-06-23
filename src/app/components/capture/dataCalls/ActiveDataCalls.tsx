import React from 'react';
import {
  Users2, ListChecks, ChevronDown, ChevronRight, Phone, Mail, BellRing, FilePlus2, Download, FileDown,
  Pencil, CalendarClock, Flag, Check, X, RotateCcw, Eye, AlertTriangle, FileBarChart, Building2, User,
} from 'lucide-react';
import type { DataCall, DataCallItem, Partner } from '../../../../types/dataCalls';
import {
  F, tone, ORANGE, fmtDate, dueLabel, isOverdue, awaitingReview, itemAccepted, callProgress, partnerAgg,
  callStatusTone, priorityTone, trustTone,
} from './helpers';
import { Pill, Btn, PhaseBadge, StatusPill, QualityBadge, FormatChip, ActionBar, type BarAction } from './ui';

interface Handlers {
  onAccept: (i: DataCallItem) => void; onReject: (i: DataCallItem) => void; onRevise: (i: DataCallItem) => void;
  onChangeDue: (c: DataCall) => void; onChangePriority: (c: DataCall) => void; onNewDataCall: (partnerId: string) => void;
  onAskAi: (scope: 'all' | 'partner' | 'call' | 'item', scopeId: string, label: string) => void;
  onToast: (m: string) => void;
}
interface ViewState {
  viewMode: 'teammate' | 'call'; setViewMode: (v: 'teammate' | 'call') => void;
  expP: Set<string>; expC: Set<string>; expI: Set<string>;
  toggleP: (id: string) => void; toggleC: (id: string) => void; toggleI: (id: string) => void;
}

export function ActiveDataCalls({ dataCalls, partners, h, v }: { dataCalls: DataCall[]; partners: Partner[]; h: Handlers; v: ViewState }) {
  const partnerName = (id: string) => partners.find(p => p.id === id)?.name ?? id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: F }}>
      {/* ALL-level action bar */}
      <ActionBar
        label="ALL"
        actions={[
          { label: 'Remind All Overdue', icon: <BellRing size={13} />, onClick: () => h.onToast('Reminders sent for all overdue items'), kind: 'orange' },
          { label: 'Export All', icon: <Download size={13} />, onClick: () => h.onToast('Exported the full data-call portfolio (CSV)') },
          { label: 'Status Report', icon: <FileBarChart size={13} />, onClick: () => h.onToast('Generated a portfolio status report') },
        ]}
        onAskAi={() => h.onAskAi('all', 'portfolio', 'Whole portfolio')}
      />

      {/* view toggle */}
      <div style={{ display: 'inline-flex', gap: 3, padding: 3, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', alignSelf: 'flex-start' }}>
        {([['teammate', 'By Teammate', <Users2 size={14} />], ['call', 'By Data Call', <ListChecks size={14} />]] as const).map(([k, lab, ic]) => {
          const on = v.viewMode === k;
          return (
            <button key={k} onClick={() => v.setViewMode(k)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 'var(--gh-radius-md)', background: on ? ORANGE : 'transparent', color: on ? 'var(--gh-bg-canvas)' : 'var(--gh-text-secondary)', border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 'var(--gh-font-size-sm)', fontWeight: on ? 'var(--gh-font-weight-semibold)' : 'var(--gh-font-weight-medium)' }}>{ic}{lab}</button>
          );
        })}
      </div>

      {/* ── By Teammate ── */}
      {v.viewMode === 'teammate' && partners.map(p => {
        const calls = dataCalls.filter(c => c.partnerId === p.id);
        if (!calls.length) return null;
        const agg = partnerAgg(calls);
        const open = v.expP.has(p.id);
        return (
          <div key={p.id} style={{ borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', overflow: 'hidden' }}>
            <button onClick={() => v.toggleP(p.id)} style={rowBtn}>
              <span style={{ color: 'var(--gh-text-tertiary)', display: 'flex', flexShrink: 0 }}>{open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
              <span style={{ width: 32, height: 32, borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Building2 size={16} /></span>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{p.name}</span>
                  <Pill tone="neutral" soft>{p.sbStatus}</Pill>
                  <PhaseBadge phase={p.phase} />
                  <Pill tone={trustTone(p.trustTier)}>{p.trustTier}</Pill>
                </div>
                <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 3 }}>{p.specialty} · {p.primaryContact.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {agg.overdue > 0 && <Pill tone="danger"><AlertTriangle size={11} /> {agg.overdue} overdue</Pill>}
                {agg.awaiting > 0 && <Pill tone="warning">{agg.awaiting} to review</Pill>}
                <ProgressPill accepted={agg.accepted} total={agg.total} />
              </div>
            </button>
            {open && (
              <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 11 }}>
                <ActionBar
                  label="PARTNER"
                  actions={[
                    { label: 'Remind All Pending', icon: <BellRing size={13} />, onClick: () => h.onToast(`Reminder sent to ${p.name} for all pending items`), kind: 'orange' },
                    { label: 'Call', icon: <Phone size={13} />, onClick: () => h.onToast(`${p.primaryContact.name} · ${p.primaryContact.phone}`) },
                    { label: 'Email', icon: <Mail size={13} />, onClick: () => h.onToast(`Drafted an email to ${p.primaryContact.email}`) },
                    { label: 'New Data Call', icon: <FilePlus2 size={13} />, onClick: () => h.onNewDataCall(p.id) },
                    { label: 'Export Summary', icon: <FileDown size={13} />, onClick: () => h.onToast(`Exported ${p.name} summary`) },
                  ]}
                  onAskAi={() => h.onAskAi('partner', p.id, p.name)}
                />
                {calls.map(c => <CallCard key={c.id} call={c} h={h} v={v} partnerLabel={undefined} />)}
              </div>
            )}
          </div>
        );
      })}

      {/* ── By Data Call ── */}
      {v.viewMode === 'call' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {dataCalls.map(c => <CallCard key={c.id} call={c} h={h} v={v} partnerLabel={partnerName(c.partnerId)} />)}
        </div>
      )}
    </div>
  );
}

function CallCard({ call, h, v, partnerLabel }: { call: DataCall; h: Handlers; v: ViewState; partnerLabel?: string }) {
  const prog = callProgress(call);
  const open = v.expC.has(call.id);
  const due = dueLabel(call.dueDate);
  const overdue = isOverdue(call.dueDate) && call.status !== 'COMPLETE';
  return (
    <div style={{ borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-bg-elevated)', border: `1px solid ${overdue ? 'var(--gh-danger-border)' : 'var(--gh-border)'}`, overflow: 'hidden' }}>
      <button onClick={() => v.toggleC(call.id)} style={rowBtn}>
        <span style={{ color: 'var(--gh-text-tertiary)', display: 'flex', flexShrink: 0 }}>{open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</span>
        <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-bold)', color: ORANGE, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{call.id}</span>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{call.title}</span>
            <PhaseBadge phase={call.phase} />
            {partnerLabel && <Pill tone="neutral" soft><User size={10} /> {partnerLabel}</Pill>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Pill tone={callStatusTone(call.status)} soft>{call.status}</Pill>
            <Pill tone={priorityTone(call.priority)} soft>{call.priority}</Pill>
            <Pill tone={due.tone} soft>{due.text}</Pill>
          </div>
        </div>
        <ProgressPill accepted={prog.accepted} total={prog.total} />
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {call.notes && <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', fontStyle: 'italic', paddingLeft: 2 }}>{call.notes}</div>}
          <ActionBar
            label="DATA CALL"
            actions={[
              { label: 'Edit', icon: <Pencil size={13} />, onClick: () => h.onToast(`Editing ${call.id}`) },
              { label: 'Change Due Date', icon: <CalendarClock size={13} />, onClick: () => h.onChangeDue(call) },
              { label: 'Change Priority', icon: <Flag size={13} />, onClick: () => h.onChangePriority(call) },
              { label: 'Remind', icon: <BellRing size={13} />, onClick: () => h.onToast(`Reminder sent for ${call.id}`), kind: 'orange' },
              { label: 'Export', icon: <FileDown size={13} />, onClick: () => h.onToast(`Exported ${call.id}`) },
            ]}
            onAskAi={() => h.onAskAi('call', call.id, `${call.id} · ${call.title}`)}
          />
          {call.items.map(it => <ItemRow key={it.id} item={it} h={h} />)}
        </div>
      )}
    </div>
  );
}

function ItemRow({ item, h }: { item: DataCallItem; h: Handlers }) {
  const reviewable = awaitingReview(item);
  const accepted = itemAccepted(item);
  const itemActions: BarAction[] = [
    { label: 'Accept', icon: <Check size={13} />, onClick: () => h.onAccept(item), kind: 'primary' },
    { label: 'Reject', icon: <X size={13} />, onClick: () => h.onReject(item), kind: 'danger' },
    { label: 'Request Revision', icon: <RotateCcw size={13} />, onClick: () => h.onRevise(item), kind: 'orange' },
    { label: 'Preview', icon: <Eye size={13} />, onClick: () => h.onToast(`Preview: ${item.description}`) },
    { label: 'Download', icon: <Download size={13} />, onClick: () => h.onToast(`Downloaded ${item.format} for ${item.id}`) },
  ];
  return (
    <div style={{ padding: '10px 12px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', border: `1px solid ${accepted ? 'var(--gh-success-border)' : 'var(--gh-border)'}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
        <span style={{ fontSize: 10, fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text-tertiary)', flexShrink: 0, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{item.id.split('-').pop()}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)' }}>{item.description}</span>
            <FormatChip format={item.format} />
            {item.required && <span style={{ fontSize: 9, color: ORANGE, fontWeight: 700 }}>REQ</span>}
          </div>
          {item.qualityNotes && <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginTop: 4, lineHeight: 1.45 }}>{item.qualityNotes}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {item.qualityScore !== undefined && <QualityBadge score={item.qualityScore} />}
          <StatusPill status={item.status} />
        </div>
      </div>
      {reviewable && <ActionBar label="ITEM" actions={itemActions} onAskAi={() => h.onAskAi('item', item.id, `${item.id} · ${item.description.slice(0, 40)}`)} />}
    </div>
  );
}

function ProgressPill({ accepted, total }: { accepted: number; total: number }) {
  const pct = total ? Math.round((accepted / total) * 100) : 0;
  const t = pct === 100 ? 'success' : pct > 0 ? 'warning' : 'neutral';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
      <span style={{ width: 56, height: 6, borderRadius: 3, background: 'var(--gh-bg-surface-muted)', overflow: 'hidden' }}>
        <span style={{ display: 'block', width: `${pct}%`, height: '100%', background: tone(t).fg, borderRadius: 3 }} />
      </span>
      <span style={{ fontSize: 11, fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{accepted}/{total}</span>
    </span>
  );
}

const rowBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '12px 14px', textAlign: 'left',
  background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: F,
};

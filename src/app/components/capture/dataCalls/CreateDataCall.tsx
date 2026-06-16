import React, { useEffect, useState } from 'react';
import { Send, Sparkles, ShieldAlert, Trash2, Plus, Lock } from 'lucide-react';
import type { DataCallTemplate, Partner, Priority, DataCallType, Format, Phase, TrustTier } from '../../../../types/dataCalls';
import { F, TODAY, ORANGE, trustTone } from './helpers';
import { Pill, Btn, PhaseBadge, FormatChip } from './ui';

export interface NewCallPayload {
  templateId?: string; partnerId: string; phase: Phase; type: DataCallType; title: string;
  priority: Priority; dueDate: string; instructions: string;
  items: { description: string; format: Format; required: boolean }[];
  overridden: boolean;
}
type EditItem = { key: string; description: string; format: Format; required: boolean };

const TYPE_BY_TPL: Record<string, DataCallType> = {
  'tpl-resumes': 'RESUME', 'tpl-pricing': 'PRICING', 'tpl-pp-full': 'PAST_PERFORMANCE', 'tpl-pp-screen': 'PAST_PERFORMANCE',
  'tpl-tech': 'TECHNICAL', 'tpl-compliance': 'COMPLIANCE', 'tpl-cap-fit': 'EVALUATION', 'tpl-rate-range': 'EVALUATION', 'tpl-teaming-hist': 'EVALUATION',
};
const addDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * 86_400_000).toISOString().slice(0, 10);
const sel: React.CSSProperties = { padding: '8px 11px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', color: 'var(--gh-text)', fontFamily: F, fontSize: 'var(--gh-font-size-sm)', cursor: 'pointer' };
const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: 'var(--gh-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, display: 'block' };

export function CreateDataCall({ templates, partners, presetTemplateId, presetPartnerId, onSend, onLogOverride, onToast }: {
  templates: DataCallTemplate[]; partners: Partner[]; presetTemplateId: string | null; presetPartnerId: string | null;
  onSend: (p: NewCallPayload) => void; onLogOverride: (partner: string, template: string) => void; onToast: (m: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>('custom');
  const [partnerId, setPartnerId] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState(addDays(TODAY, 7));
  const [instructions, setInstructions] = useState('');
  const [items, setItems] = useState<EditItem[]>([]);
  const [override, setOverride] = useState(false);
  const [autogen, setAutogen] = useState(false);

  const tpl = templates.find(t => t.id === selectedId);
  const partner = partners.find(p => p.id === partnerId);

  useEffect(() => { if (presetTemplateId) setSelectedId(presetTemplateId); }, [presetTemplateId]);
  useEffect(() => { if (presetPartnerId) setPartnerId(presetPartnerId); }, [presetPartnerId]);
  useEffect(() => {
    setOverride(false);
    if (tpl) {
      setItems(tpl.items.map((it, i) => ({ key: `${it.id}-${i}`, description: it.description, format: it.format, required: it.required })));
      setInstructions(tpl.purpose);
      setDueDate(addDays(TODAY, tpl.suggestedDurationDays));
    } else {
      setItems([{ key: 'c0', description: '', format: 'Any', required: true }]);
      setInstructions('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const blocked = !!tpl && tpl.trustTierMinimum === 'TA' && partner?.trustTier === 'NDA';
  const canSend = !!partnerId && items.length > 0 && (!blocked || override);

  const doAutogen = () => {
    if (!partner) { onToast('Pick a recipient partner first'); return; }
    setAutogen(true);
    window.setTimeout(() => {
      setItems(prev => prev.map(it => ({ ...it, description: it.description.replace(/ — tailored .*$/, '') + ` — tailored to ${partner.name}` })));
      setAutogen(false);
      onToast(`AI customized ${items.length} item descriptions for ${partner.name}`);
    }, 950);
  };

  const send = () => {
    if (!partner) return;
    if (blocked && override) onLogOverride(partner.name, tpl!.name);
    onSend({
      templateId: tpl?.id, partnerId, phase: tpl?.phase ?? partner.phase,
      type: tpl ? (TYPE_BY_TPL[tpl.id] ?? 'CUSTOM') : 'CUSTOM',
      title: tpl?.name ?? 'Custom Data Call', priority, dueDate, instructions,
      items: items.map(({ description, format, required }) => ({ description, format, required })),
      overridden: blocked && override,
    });
    onToast(`Data call sent to ${partner.name}`);
    setSelectedId('custom'); setPartnerId(''); setPriority('MEDIUM'); setOverride(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: F }}>
      {/* template + recipient */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <div>
          <label style={lbl}>Template</label>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{ ...sel, width: '100%' }}>
            <option value="custom">Custom (no template)</option>
            <optgroup label="Pre-TA · Evaluate Fit">{templates.filter(t => t.phase === 'pre-ta').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>
            <optgroup label="Post-TA · Collect for Proposal">{templates.filter(t => t.phase === 'post-ta').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>
          </select>
          {tpl && <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 6 }}><PhaseBadge phase={tpl.phase} /><Pill tone={tpl.trustTierMinimum === 'TA' ? 'accent' : 'neutral'}>min: {tpl.trustTierMinimum}</Pill></div>}
        </div>
        <div>
          <label style={lbl}>Recipient Partner</label>
          <select value={partnerId} onChange={e => setPartnerId(e.target.value)} style={{ ...sel, width: '100%' }}>
            <option value="">Select a partner…</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.name} — {p.trustTier}</option>)}
          </select>
          {partner && <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 6 }}><Pill tone={trustTone(partner.trustTier)}>{partner.trustTier}</Pill><span style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>{partner.agreementStatus}</span></div>}
        </div>
      </div>

      {/* TRUST-TIER BLOCK */}
      {blocked && (
        <div style={{ padding: '13px 15px', borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-danger-bg)', border: '1px solid var(--gh-danger-border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <ShieldAlert size={18} style={{ color: 'var(--gh-danger-fg)', flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-danger-fg)' }}>Trust-tier violation — Post-TA template to an NDA-only partner</div>
              <p style={{ margin: '4px 0 0', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>
                {partner!.name} only has an NDA. Post-TA templates ({tpl!.name}) request detailed rates / named personnel and require a signed Teaming Agreement.
              </p>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 10, cursor: 'pointer', fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text)' }}>
                <input type="checkbox" checked={override} onChange={e => setOverride(e.target.checked)} style={{ width: 15, height: 15, accentColor: ORANGE }} />
                Override and send anyway — I accept the risk (logged to the Activity Log)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* meta row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <div><label style={lbl}>Priority</label><select value={priority} onChange={e => setPriority(e.target.value as Priority)} style={{ ...sel, width: '100%' }}>{(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}</select></div>
        <div><label style={lbl}>Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ ...sel, width: '100%' }} /></div>
      </div>

      <div>
        <label style={lbl}>Instructions to Partner</label>
        <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={2} style={{ width: '100%', boxSizing: 'border-box', padding: '9px 11px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)', color: 'var(--gh-text)', fontFamily: F, fontSize: 'var(--gh-font-size-sm)', resize: 'vertical' }} />
      </div>

      {/* items */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <label style={{ ...lbl, marginBottom: 0 }}>Requested Items ({items.length})</label>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Btn size="sm" icon={<Plus size={13} />} onClick={() => setItems(p => [...p, { key: `c${Date.now()}`, description: '', format: 'Any', required: false }])}>Add Item</Btn>
            <Btn size="sm" kind="orange" icon={autogen ? <Sparkles size={13} className="gh-spin" /> : <Sparkles size={13} />} onClick={doAutogen} disabled={autogen}>{autogen ? 'Customizing…' : 'Auto-Generate'}</Btn>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {items.map(it => (
            <div key={it.key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface)', border: '1px solid var(--gh-border)' }}>
              <input value={it.description} placeholder="Item description…" onChange={e => setItems(p => p.map(x => x.key === it.key ? { ...x, description: e.target.value } : x))} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--gh-text)', fontFamily: F, fontSize: 'var(--gh-font-size-sm)' }} />
              <FormatChip format={it.format} />
              {it.required && <span style={{ fontSize: 9, color: ORANGE, fontWeight: 700 }}>REQ</span>}
              <button onClick={() => setItems(p => p.filter(x => x.key !== it.key))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gh-text-disabled)', padding: 2 }}><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* send */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 2 }}>
        <Btn kind={blocked && override ? 'danger' : 'orange'} icon={blocked && override ? <Lock size={14} /> : <Send size={14} />} onClick={send} disabled={!canSend}>
          {blocked && override ? 'Override & Send' : 'Send Data Call'}
        </Btn>
        {!partnerId && <span style={{ fontSize: 11, color: 'var(--gh-text-disabled)' }}>Select a recipient to continue.</span>}
        {blocked && !override && <span style={{ fontSize: 11, color: 'var(--gh-danger-fg)' }}>Blocked by trust-tier policy — check override to proceed.</span>}
      </div>
    </div>
  );
}

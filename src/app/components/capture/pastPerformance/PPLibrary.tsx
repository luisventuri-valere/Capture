import React, { useMemo, useState } from 'react';
import { Search, Plus, ChevronDown, ChevronRight, Sparkles, Loader2, Paperclip, Check } from 'lucide-react';
import type { PPLibraryEntry, ContractType, CparsRating, RolePerformed, RefSource } from '../../../../types/pastPerformance';
import { F, tone, money, type Tone } from '../staffing/helpers';
import { Pill, Btn, Modal, ModalHeader, ModalFooter } from '../staffing/ui';
import { cparsTone, recencyContext, yr } from './ppHelpers';

const TH: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gh-text-disabled)', fontWeight: 'var(--gh-font-weight-semibold)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--gh-border)', background: 'var(--gh-bg-surface-muted)' };
const TD: React.CSSProperties = { padding: '10px', fontSize: 'var(--gh-font-size-xs)', color: 'var(--gh-text-secondary)', verticalAlign: 'middle', borderBottom: '1px solid var(--gh-border)' };

const selStyle: React.CSSProperties = { background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', padding: '6px 9px', color: 'var(--gh-text-secondary)', fontSize: 'var(--gh-font-size-xs)', fontFamily: F };

type SortKey = 'recency' | 'value' | 'cpars' | 'alpha';

export function PPLibrary({ library, aiPrefill, onAdd }: {
  library: PPLibraryEntry[]; aiPrefill: Partial<PPLibraryEntry>; onAdd: (e: PPLibraryEntry) => void;
}) {
  const [q, setQ] = useState('');
  const [fAgency, setFAgency] = useState('all');
  const [fType, setFType] = useState('all');
  const [fCpars, setFCpars] = useState('all');
  const [fSource, setFSource] = useState('all');
  const [sort, setSort] = useState<SortKey>('recency');
  const [addOpen, setAddOpen] = useState(false);

  const agencies = useMemo(() => [...new Set(library.map(l => l.clientAgency))], [library]);
  const types = useMemo(() => [...new Set(library.map(l => l.contractType))], [library]);
  const ratings = useMemo(() => [...new Set(library.map(l => l.cparsRating))], [library]);

  const rows = useMemo(() => {
    let r = library.filter(l => {
      if (fAgency !== 'all' && l.clientAgency !== fAgency) return false;
      if (fType !== 'all' && l.contractType !== fType) return false;
      if (fCpars !== 'all' && l.cparsRating !== fCpars) return false;
      if (fSource !== 'all' && l.source !== fSource) return false;
      if (q.trim()) {
        const hay = `${l.projectTitle} ${l.clientAgency} ${l.technicalSimilarityTags.join(' ')} ${l.scopeSimilarityTags.join(' ')}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    r = [...r].sort((a, b) => {
      if (sort === 'recency') return b.endDate.localeCompare(a.endDate);
      if (sort === 'value') return b.contractValue - a.contractValue;
      if (sort === 'cpars') return b.cparsScore - a.cparsScore;
      return a.projectTitle.localeCompare(b.projectTitle);
    });
    return r;
  }, [library, q, fAgency, fType, fCpars, fSource, sort]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', padding: '6px 10px', flex: '1 1 220px', minWidth: 180 }}>
          <Search size={13} style={{ color: 'var(--gh-text-disabled)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search references, agencies, tags…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-xs)', fontFamily: F }} />
        </div>
        <select value={fAgency} onChange={e => setFAgency(e.target.value)} style={selStyle}><option value="all">All agencies</option>{agencies.map(a => <option key={a} value={a}>{a}</option>)}</select>
        <select value={fType} onChange={e => setFType(e.target.value)} style={selStyle}><option value="all">All types</option>{types.map(t => <option key={t} value={t}>{t}</option>)}</select>
        <select value={fCpars} onChange={e => setFCpars(e.target.value)} style={selStyle}><option value="all">All CPARS</option>{ratings.map(r => <option key={r} value={r}>{r}</option>)}</select>
        <select value={fSource} onChange={e => setFSource(e.target.value)} style={selStyle}><option value="all">All sources</option><option value="company">Company</option><option value="teammate">Teammate</option></select>
        <select value={sort} onChange={e => setSort(e.target.value as SortKey)} style={selStyle}><option value="recency">Sort: Recency</option><option value="value">Sort: Value</option><option value="cpars">Sort: CPARS</option><option value="alpha">Sort: A–Z</option></select>
        <Btn kind="primary" size="sm" icon={<Plus size={14} />} onClick={() => setAddOpen(true)}>Add Reference</Btn>
      </div>

      {/* table */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F, minWidth: 860 }}>
          <thead><tr>
            <th style={TH}>Project</th><th style={TH}>Agency</th><th style={TH}>Value</th><th style={TH}>Type</th>
            <th style={TH}>CPARS</th><th style={TH}>End</th><th style={TH}>Source</th><th style={TH}>Tags</th>
          </tr></thead>
          <tbody>
            {rows.map(l => {
              const rc = recencyContext(l.endDate);
              return (
                <tr key={l.id}>
                  <td style={{ ...TD, color: 'var(--gh-text)', fontWeight: 'var(--gh-font-weight-semibold)', maxWidth: 230 }}>{l.projectTitle}<div style={{ fontSize: 10, color: 'var(--gh-text-disabled)', fontWeight: 'var(--gh-font-weight-normal)', marginTop: 2 }}>{l.clientOffice} · {l.contractNumber}</div></td>
                  <td style={{ ...TD, maxWidth: 150 }}>{l.clientAgency}</td>
                  <td style={{ ...TD, color: 'var(--gh-text)', whiteSpace: 'nowrap' }}>{money(l.contractValue)}</td>
                  <td style={TD}><Pill tone="neutral" style={{ fontSize: 9 }}>{l.contractType}</Pill></td>
                  <td style={TD}><Pill tone={cparsTone(l.cparsRating)} style={{ fontSize: 9 }}>{l.cparsRating}</Pill></td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}><span style={{ color: 'var(--gh-text)' }}>{yr(l.endDate)}</span> <span title={rc.label} style={{ color: tone(rc.tone).fg }}>●</span></td>
                  <td style={TD}><Pill tone={l.source === 'teammate' ? 'accent' : 'neutral'} style={{ fontSize: 9 }}>{l.source === 'teammate' ? l.sourceCompanyName : 'Company'}</Pill></td>
                  <td style={{ ...TD, maxWidth: 200 }}><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{l.technicalSimilarityTags.slice(0, 3).map((t, i) => <span key={i} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)' }}>{t}</span>)}{l.technicalSimilarityTags.length > 3 && <span style={{ fontSize: 9, color: 'var(--gh-text-disabled)' }}>+{l.technicalSimilarityTags.length - 3}</span>}</div></td>
                </tr>
              );
            })}
            {rows.length === 0 && <tr><td colSpan={8} style={{ ...TD, textAlign: 'center', color: 'var(--gh-text-disabled)' }}>No references match the filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: 'var(--gh-text-disabled)' }}>{rows.length} of {library.length} references</div>

      {addOpen && <AddReferenceModal aiPrefill={aiPrefill} onClose={() => setAddOpen(false)} onAdd={(e) => { onAdd(e); setAddOpen(false); }} />}
    </div>
  );
}

// ─── Add Reference modal (progressive disclosure) ────────────────────────────
type FormState = {
  projectTitle: string; clientAgency: string; clientOffice: string; contractNumber: string;
  contractType: ContractType; contractValue: string; startDate: string; endDate: string; rolePerformed: RolePerformed;
  projectDescription: string; workPerformed: string;
  cparsRating: CparsRating; cparsScore: string; deliveryPerformance: string; budgetPerformance: string; customerSatisfaction: string;
  clientContactName: string; clientContactTitle: string; clientContactEmail: string; clientContactPhone: string;
  technicalSimilarityTags: string; scopeSimilarityTags: string; naicsCodes: string;
  source: RefSource; sourceCompanyName: string;
};
const EMPTY: FormState = {
  projectTitle: '', clientAgency: '', clientOffice: '', contractNumber: '', contractType: 'FFP', contractValue: '', startDate: '', endDate: '', rolePerformed: 'prime',
  projectDescription: '', workPerformed: '', cparsRating: 'Very Good', cparsScore: '4', deliveryPerformance: '', budgetPerformance: '', customerSatisfaction: '85',
  clientContactName: '', clientContactTitle: '', clientContactEmail: '', clientContactPhone: '', technicalSimilarityTags: '', scopeSimilarityTags: '', naicsCodes: '541512',
  source: 'company', sourceCompanyName: 'TechForward Solutions',
};

const SECTIONS = ['Contract Identity', 'Scope & Description', 'Performance Metrics', 'Reference Contact', 'Tags'] as const;

function AddReferenceModal({ aiPrefill, onClose, onAdd }: { aiPrefill: Partial<PPLibraryEntry>; onClose: () => void; onAdd: (e: PPLibraryEntry) => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [open, setOpen] = useState(0);
  const [populating, setPopulating] = useState(false);
  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const populate = () => {
    setPopulating(true);
    window.setTimeout(() => {
      const p = aiPrefill;
      setForm(f => ({
        ...f,
        projectTitle: p.projectTitle ?? f.projectTitle, clientAgency: p.clientAgency ?? f.clientAgency, clientOffice: p.clientOffice ?? f.clientOffice,
        contractNumber: p.contractNumber ?? f.contractNumber, contractType: (p.contractType as ContractType) ?? f.contractType,
        contractValue: p.contractValue != null ? String(p.contractValue) : f.contractValue, startDate: p.startDate ?? f.startDate, endDate: p.endDate ?? f.endDate,
        rolePerformed: (p.rolePerformed as RolePerformed) ?? f.rolePerformed, projectDescription: p.projectDescription ?? f.projectDescription,
        cparsRating: (p.cparsRating as CparsRating) ?? f.cparsRating, cparsScore: p.cparsScore != null ? String(p.cparsScore) : f.cparsScore,
        source: (p.source as RefSource) ?? f.source, sourceCompanyName: p.sourceCompanyName ?? f.sourceCompanyName,
        technicalSimilarityTags: p.technicalSimilarityTags?.join(', ') ?? f.technicalSimilarityTags, naicsCodes: p.naicsCodes?.join(', ') ?? f.naicsCodes,
      }));
      setPopulating(false); setOpen(0);
    }, 900);
  };

  const submit = () => {
    const months = form.startDate && form.endDate ? Math.max(1, Math.round((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (30.4 * 24 * 3600 * 1000))) : 0;
    const split = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);
    onAdd({
      id: `PP-${Math.floor(Math.random() * 9000 + 1000)}`,
      projectTitle: form.projectTitle || 'Untitled Reference', clientAgency: form.clientAgency, clientOffice: form.clientOffice, contractNumber: form.contractNumber,
      contractType: form.contractType, contractValue: parseInt(form.contractValue) || 0, startDate: form.startDate, endDate: form.endDate, durationMonths: months,
      projectDescription: form.projectDescription, rolePerformed: form.rolePerformed, workPerformed: form.workPerformed,
      cparsRating: form.cparsRating, cparsScore: parseInt(form.cparsScore) || 0, deliveryPerformance: form.deliveryPerformance, budgetPerformance: form.budgetPerformance,
      customerSatisfaction: parseInt(form.customerSatisfaction) || 0, technicalSimilarityTags: split(form.technicalSimilarityTags), scopeSimilarityTags: split(form.scopeSimilarityTags),
      naicsCodes: split(form.naicsCodes), clientContactName: form.clientContactName, clientContactTitle: form.clientContactTitle, clientContactEmail: form.clientContactEmail,
      clientContactPhone: form.clientContactPhone, source: form.source, sourceCompanyName: form.source === 'teammate' ? form.sourceCompanyName : 'TechForward Solutions',
    });
  };

  return (
    <Modal open onClose={onClose} width={640}>
      <ModalHeader tone="accent" icon={<Plus size={18} />} title="Add Past-Performance Reference" subtitle="Progressive form — expand each section" onClose={onClose} />
      <div style={{ padding: '14px 20px' }}>
        <button onClick={populate} disabled={populating} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-info-bg)', border: '1px solid var(--gh-info-border)', color: 'var(--gh-info-fg)', fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', cursor: 'pointer', fontFamily: F, marginBottom: 14 }}>
          {populating ? <Loader2 size={14} className="gh-spin" /> : <Sparkles size={14} />} {populating ? 'Pulling from public award data…' : 'AI: Populate from contract number'}
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' }}>
          {SECTIONS.map((title, i) => (
            <div key={title} style={{ border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-md)', overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', background: open === i ? 'var(--gh-bg-surface)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: F, textAlign: 'left' }}>
                <span style={{ width: 18, height: 18, borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-accent-tint)', fontSize: 10, fontWeight: 'var(--gh-font-weight-bold)', display: 'grid', placeItems: 'center' }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>{title}</span>
                {open === i ? <ChevronDown size={14} style={{ color: 'var(--gh-text-tertiary)' }} /> : <ChevronRight size={14} style={{ color: 'var(--gh-text-tertiary)' }} />}
              </button>
              {open === i && <div style={{ padding: '4px 14px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {i === 0 && <>
                  <Field label="Project Title" v={form.projectTitle} on={v => set('projectTitle', v)} wide />
                  <Field label="Client Agency" v={form.clientAgency} on={v => set('clientAgency', v)} />
                  <Field label="Office" v={form.clientOffice} on={v => set('clientOffice', v)} />
                  <Field label="Contract Number" v={form.contractNumber} on={v => set('contractNumber', v)} />
                  <SelectField label="Contract Type" v={form.contractType} on={v => set('contractType', v)} opts={['CPFF', 'FFP', 'T&M', 'IDIQ', 'BPA']} />
                  <Field label="Contract Value ($)" v={form.contractValue} on={v => set('contractValue', v)} type="number" />
                  <Field label="Start Date" v={form.startDate} on={v => set('startDate', v)} type="date" />
                  <Field label="End Date" v={form.endDate} on={v => set('endDate', v)} type="date" />
                  <SelectField label="Role" v={form.rolePerformed} on={v => set('rolePerformed', v)} opts={['prime', 'sub', 'key_personnel']} />
                  <SelectField label="Source" v={form.source} on={v => set('source', v)} opts={['company', 'teammate']} />
                  {form.source === 'teammate' && <Field label="Teammate Company" v={form.sourceCompanyName} on={v => set('sourceCompanyName', v)} wide />}
                </>}
                {i === 1 && <>
                  <Field label="Project Description" v={form.projectDescription} on={v => set('projectDescription', v)} wide area />
                  <Field label="Work Performed" v={form.workPerformed} on={v => set('workPerformed', v)} wide area />
                </>}
                {i === 2 && <>
                  <SelectField label="CPARS Rating" v={form.cparsRating} on={v => set('cparsRating', v)} opts={['Exceptional', 'Very Good', 'Satisfactory', 'Marginal', 'Unsatisfactory', 'Not Rated']} />
                  <Field label="CPARS Score (1–5)" v={form.cparsScore} on={v => set('cparsScore', v)} type="number" />
                  <Field label="Delivery Performance" v={form.deliveryPerformance} on={v => set('deliveryPerformance', v)} wide />
                  <Field label="Budget Performance" v={form.budgetPerformance} on={v => set('budgetPerformance', v)} wide />
                  <Field label="Customer Satisfaction (0–100)" v={form.customerSatisfaction} on={v => set('customerSatisfaction', v)} type="number" />
                </>}
                {i === 3 && <>
                  <Field label="Contact Name" v={form.clientContactName} on={v => set('clientContactName', v)} />
                  <Field label="Title" v={form.clientContactTitle} on={v => set('clientContactTitle', v)} />
                  <Field label="Email" v={form.clientContactEmail} on={v => set('clientContactEmail', v)} />
                  <Field label="Phone" v={form.clientContactPhone} on={v => set('clientContactPhone', v)} />
                </>}
                {i === 4 && <>
                  <Field label="Technical Tags (comma-sep)" v={form.technicalSimilarityTags} on={v => set('technicalSimilarityTags', v)} wide />
                  <Field label="Scope Tags (comma-sep)" v={form.scopeSimilarityTags} on={v => set('scopeSimilarityTags', v)} wide />
                  <Field label="NAICS Codes (comma-sep)" v={form.naicsCodes} on={v => set('naicsCodes', v)} wide />
                </>}
              </div>}
            </div>
          ))}
        </div>
      </div>
      <ModalFooter>
        <span style={{ fontSize: 11, color: 'var(--gh-text-disabled)' }}>Appends to the in-memory library</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Btn kind="ghost" size="sm" onClick={onClose}>Cancel</Btn>
          <Btn kind="primary" size="sm" icon={<Check size={13} />} onClick={submit}>Add Reference</Btn>
        </div>
      </ModalFooter>
    </Modal>
  );
}

function Field({ label, v, on, type = 'text', wide, area }: { label: string; v: string; on: (v: string) => void; type?: string; wide?: boolean; area?: boolean }) {
  const inp: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-sm)', padding: '6px 8px', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-xs)', fontFamily: F };
  return (
    <label style={{ gridColumn: wide ? '1 / -1' : 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 10, color: 'var(--gh-text-disabled)', fontWeight: 'var(--gh-font-weight-semibold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      {area ? <textarea value={v} onChange={e => on(e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} /> : <input value={v} type={type} onChange={e => on(e.target.value)} style={inp} />}
    </label>
  );
}
function SelectField({ label, v, on, opts }: { label: string; v: string; on: (v: string) => void; opts: string[] }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 10, color: 'var(--gh-text-disabled)', fontWeight: 'var(--gh-font-weight-semibold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <select value={v} onChange={e => on(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: 'var(--gh-bg-surface-muted)', border: '1px solid var(--gh-border)', borderRadius: 'var(--gh-radius-sm)', padding: '6px 8px', color: 'var(--gh-text)', fontSize: 'var(--gh-font-size-xs)', fontFamily: F }}>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

import { useState } from 'react';
import { CheckCircle, XCircle, Edit2, RotateCcw } from 'lucide-react';
import type { Recommendation } from '../../../types/strategy';

interface Props {
  rec: Recommendation;
  onUpdate: (id: string, updates: Partial<Recommendation>) => void;
}

export function RecommendationItem({ rec, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rec.editedText ?? rec.text);
  const [rejectReason, setRejectReason] = useState(rec.rejectedReason ?? '');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const accept = () => onUpdate(rec.id, { status: 'accepted', rejectedReason: '' });
  const reject = () => {
    if (rec.status === 'rejected') { onUpdate(rec.id, { status: 'proposed', rejectedReason: '' }); setShowRejectInput(false); }
    else setShowRejectInput(true);
  };
  const confirmReject = () => { onUpdate(rec.id, { status: 'rejected', rejectedReason: rejectReason }); setShowRejectInput(false); };
  const saveEdit = () => { onUpdate(rec.id, { editedText: draft }); setEditing(false); };

  const rowBg = rec.status === 'accepted' ? 'var(--gh-success-bg)' : rec.status === 'rejected' ? 'var(--gh-danger-bg)' : 'var(--gh-bg-surface)';
  const rowBorder = rec.status === 'accepted' ? 'var(--gh-success-border)' : rec.status === 'rejected' ? 'var(--gh-danger-border)' : 'var(--gh-border)';

  return (
    <div
      style={{ borderRadius: 'var(--gh-radius-lg)', padding: 12, marginBottom: 8, background: rowBg, border: `1px solid ${rowBorder}`, fontFamily: 'var(--gh-font)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          {editing ? (
            <textarea
              rows={3}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              style={{ width: '100%', borderRadius: 'var(--gh-radius-md)', padding: '6px 8px', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text)', border: `1px solid var(--gh-border)`, fontSize: 'var(--gh-font-size-base)', fontFamily: 'var(--gh-font)', resize: 'vertical' }}
            />
          ) : (
            <p style={{ fontSize: 'var(--gh-font-size-base)', color: rec.status === 'rejected' ? 'var(--gh-text-tertiary)' : 'var(--gh-text)', textDecoration: rec.status === 'rejected' ? 'line-through' : 'none', margin: 0 }}>
              {rec.editedText ?? rec.text}
            </p>
          )}
          {rec.status === 'rejected' && rec.rejectedReason && (
            <p style={{ fontSize: 11, marginTop: 4, color: 'var(--gh-danger-fg-strong)', margin: '4px 0 0' }}>Rejected: {rec.rejectedReason}</p>
          )}
          {showRejectInput && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
              <input
                placeholder="Reason (optional)..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                style={{ flex: 1, borderRadius: 'var(--gh-radius-md)', padding: '4px 8px', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text)', border: `1px solid var(--gh-border)`, fontSize: 'var(--gh-font-size-sm)', fontFamily: 'var(--gh-font)' }}
              />
              <button onClick={confirmReject} style={{ padding: '4px 8px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-danger)', color: 'var(--gh-white)', fontSize: 'var(--gh-font-size-sm)', cursor: 'pointer', fontFamily: 'var(--gh-font)' }}>Confirm</button>
              <button onClick={() => setShowRejectInput(false)} style={{ padding: '4px 8px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)', fontSize: 'var(--gh-font-size-sm)', cursor: 'pointer', fontFamily: 'var(--gh-font)' }}>Cancel</button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {editing ? (
            <>
              <button onClick={saveEdit} style={{ padding: '4px 8px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', fontSize: 'var(--gh-font-size-sm)', cursor: 'pointer', fontFamily: 'var(--gh-font)' }}>Save</button>
              <button onClick={() => setEditing(false)} style={{ padding: '4px 8px', borderRadius: 'var(--gh-radius-md)', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text-tertiary)', fontSize: 'var(--gh-font-size-sm)', cursor: 'pointer', fontFamily: 'var(--gh-font)' }}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={accept} title="Accept" style={{ padding: 6, borderRadius: 'var(--gh-radius-md)', background: 'transparent', cursor: 'pointer', color: rec.status === 'accepted' ? 'var(--gh-success-fg)' : 'var(--gh-text-tertiary)' }}>
                <CheckCircle size={16} />
              </button>
              <button onClick={reject} title={rec.status === 'rejected' ? 'Undo' : 'Reject'} style={{ padding: 6, borderRadius: 'var(--gh-radius-md)', background: 'transparent', cursor: 'pointer', color: rec.status === 'rejected' ? 'var(--gh-danger-fg-strong)' : 'var(--gh-text-tertiary)' }}>
                {rec.status === 'rejected' ? <RotateCcw size={16} /> : <XCircle size={16} />}
              </button>
              {rec.editable && (
                <button onClick={() => setEditing(true)} title="Edit" style={{ padding: 6, borderRadius: 'var(--gh-radius-md)', background: 'transparent', cursor: 'pointer', color: 'var(--gh-text-tertiary)' }}>
                  <Edit2 size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

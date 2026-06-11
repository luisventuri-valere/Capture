import { useState } from 'react';
import { X, Send, Bot } from 'lucide-react';
interface ChatMessage { q: string; a: string }

interface Props {
  sectionTitle: string;
  chatSeed: ChatMessage[];
  onClose: () => void;
}

interface Msg { role: 'user' | 'ai'; text: string }

export function AskAIDrawer({ sectionTitle, chatSeed, onClose }: Props) {
  const [conversation, setConversation] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [used, setUsed] = useState<Set<number>>(new Set());

  const send = (text: string, seedIdx?: number) => {
    if (!text.trim()) return;
    setConversation(prev => [...prev, { role: 'user', text }]);
    setInput('');
    if (seedIdx !== undefined) setUsed(prev => new Set(prev).add(seedIdx));
    const match = chatSeed.find(s => s.q === text);
    const reply = match?.a ?? "I've noted your question. In the live system, the Capture Strategy Agent would generate a reasoned response drawing from the full intelligence dossier for this opportunity.";
    setTimeout(() => setConversation(prev => [...prev, { role: 'ai', text: reply }]), 600);
  };

  return (
    <div
      style={{ position: 'fixed', inset: 'var(--gh-space-0) var(--gh-space-0) var(--gh-space-0) auto', width: 384, zIndex: 50, display: 'flex', flexDirection: 'column', boxShadow: '0 0 60px rgba(0,0,0,0.5)', background: 'var(--gh-bg-elevated)', borderLeft: `1px solid var(--gh-border)`, fontFamily: 'var(--gh-font)' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: `1px solid var(--gh-border)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bot size={18} style={{ color: 'var(--gh-accent)' }} />
          <div>
            <div style={{ fontSize: 'var(--gh-font-size-base)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-text)' }}>Ask AI</div>
            <div style={{ fontSize: 11, color: 'var(--gh-text-tertiary)' }}>Scoped to: {sectionTitle}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ padding: 4, background: 'transparent', cursor: 'pointer', color: 'var(--gh-text-tertiary)' }}>
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {conversation.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <p style={{ fontSize: 'var(--gh-font-size-base)', color: 'var(--gh-text-tertiary)', marginBottom: 12 }}>Suggested questions:</p>
            {chatSeed.map((seed, idx) => !used.has(idx) && (
              <button
                key={idx}
                onClick={() => send(seed.q, idx)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: 12, borderRadius: 'var(--gh-radius-lg)', marginBottom: 8, background: 'var(--gh-bg-surface)', color: 'var(--gh-text-secondary)', border: `1px solid var(--gh-border)`, fontSize: 'var(--gh-font-size-base)', cursor: 'pointer', fontFamily: 'var(--gh-font)' }}
              >
                "{seed.q}"
              </button>
            ))}
          </div>
        )}
        {conversation.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{ maxWidth: '85%', padding: '8px 12px', borderRadius: 'var(--gh-radius-lg)', fontSize: 'var(--gh-font-size-base)', background: msg.role === 'user' ? 'var(--gh-accent)' : 'var(--gh-bg-surface)', color: msg.role === 'user' ? 'var(--gh-accent-fg)' : 'var(--gh-text)' }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions after conversation starts */}
      {conversation.length > 0 && chatSeed.some((_, i) => !used.has(i)) && (
        <div style={{ padding: '8px 16px', borderTop: `1px solid var(--gh-border)` }}>
          <p style={{ fontSize: 11, color: 'var(--gh-text-tertiary)', marginBottom: 4 }}>Suggested:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {chatSeed.map((seed, idx) => !used.has(idx) && (
              <button
                key={idx}
                onClick={() => send(seed.q, idx)}
                style={{ padding: '2px 8px', borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-bg-surface)', color: 'var(--gh-text-secondary)', border: `1px solid var(--gh-border)`, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--gh-font)' }}
              >
                {seed.q.slice(0, 40)}…
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: 12, borderTop: `1px solid var(--gh-border)` }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(input); }}
            placeholder="Ask about this section..."
            style={{ flex: 1, borderRadius: 'var(--gh-radius-lg)', padding: '8px 12px', background: 'var(--gh-bg-surface-muted)', color: 'var(--gh-text)', border: `1px solid var(--gh-border)`, fontSize: 'var(--gh-font-size-base)', fontFamily: 'var(--gh-font)' }}
          />
          <button
            onClick={() => send(input)}
            style={{ padding: 8, borderRadius: 'var(--gh-radius-lg)', background: 'var(--gh-accent)', color: 'var(--gh-accent-fg)', cursor: 'pointer' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

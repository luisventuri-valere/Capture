import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { StrategySection, VersionHistoryEntry, Recommendation } from '../types/strategy';

interface CaptureState {
  [key: string]: unknown;
}

interface SupersededKeys {
  [key: string]: boolean;
}

interface CaptureContextValue {
  confirm: (key: string, payload: unknown) => void;
  revise: (key: string, sectionId: string, changeSummary: string) => void;
  get: (key: string) => unknown;
  isConfirmed: (key: string) => boolean;
  isSuperseded: (key: string) => boolean;
  clearSuperseded: (key: string) => void;
  sectionStates: Record<string, StrategySection>;
  updateSection: (id: string, updates: Partial<StrategySection>) => void;
  updateRecommendation: (sectionId: string, recId: string, updates: Partial<Recommendation>) => void;
  lastChangeNotification: string | null;
  clearNotification: () => void;
}

const CaptureContext = createContext<CaptureContextValue | null>(null);

export function CaptureProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CaptureState>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [superseded, setSuperseded] = useState<SupersededKeys>({});
  const [sectionStates, setSectionStates] = useState<Record<string, StrategySection>>({});
  const [lastChangeNotification, setLastChangeNotification] = useState<string | null>(null);

  const confirm = useCallback((key: string, payload: unknown) => {
    setState(prev => ({ ...prev, [key]: payload }));
    setConfirmed(prev => ({ ...prev, [key]: true }));
    setSuperseded(prev => ({ ...prev, [key]: false }));
  }, []);

  const revise = useCallback((key: string, sectionId: string, changeSummary: string) => {
    setConfirmed(prev => ({ ...prev, [key]: false }));
    setSuperseded(prev => ({ ...prev, [key]: true }));

    setSectionStates(prev => {
      const existing = prev[sectionId];
      if (!existing) return prev;
      const newEntry: VersionHistoryEntry = {
        version: (existing.version_history?.length ?? 0) + 1,
        changed_at: new Date().toISOString(),
        changed_by: 'User',
        change_summary: changeSummary,
      };
      return {
        ...prev,
        [sectionId]: {
          ...existing,
          status: 'needs_review',
          version_history: [...(existing.version_history ?? []), newEntry],
        },
      };
    });

    setLastChangeNotification(`Change detected — downstream tabs flagged for regeneration. Key: ${key} superseded.`);
  }, []);

  const get = useCallback((key: string) => state[key], [state]);

  const isConfirmed = useCallback((key: string) => !!confirmed[key], [confirmed]);

  const isSuperseded = useCallback((key: string) => !!superseded[key], [superseded]);

  const clearSuperseded = useCallback((key: string) => {
    setSuperseded(prev => ({ ...prev, [key]: false }));
  }, []);

  const updateSection = useCallback((id: string, updates: Partial<StrategySection>) => {
    setSectionStates(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? {} as StrategySection), ...updates },
    }));
  }, []);

  const updateRecommendation = useCallback((sectionId: string, recId: string, updates: Partial<Recommendation>) => {
    setSectionStates(prev => {
      const section = prev[sectionId];
      if (!section) return prev;
      return {
        ...prev,
        [sectionId]: {
          ...section,
          recommendations: section.recommendations.map(r =>
            r.id === recId ? { ...r, ...updates } : r
          ),
        },
      };
    });
  }, []);

  const clearNotification = useCallback(() => setLastChangeNotification(null), []);

  return (
    <CaptureContext.Provider value={{
      confirm, revise, get, isConfirmed, isSuperseded, clearSuperseded,
      sectionStates, updateSection, updateRecommendation,
      lastChangeNotification, clearNotification,
    }}>
      {children}
    </CaptureContext.Provider>
  );
}

export function useCaptureContext() {
  const ctx = useContext(CaptureContext);
  if (!ctx) throw new Error('useCaptureContext must be used within CaptureProvider');
  return ctx;
}

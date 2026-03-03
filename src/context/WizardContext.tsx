import React, { createContext, useContext } from 'react';
import { useROI } from '../hooks/useROI';
import type { WizardData, ROIResults } from '../types';

interface WizardContextType {
  data: WizardData;
  updateSection: <K extends keyof WizardData>(
    section: K,
    values: Partial<WizardData[K]>
  ) => void;
  reset: () => void;
  results: ROIResults;
}

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const roi = useROI();
  return <WizardContext.Provider value={roi}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardContextType {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within <WizardProvider>');
  return ctx;
}

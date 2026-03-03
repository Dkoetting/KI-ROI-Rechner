import { useState, useCallback } from 'react';
import type { WizardData, ROIResults } from '../types';
import { calculateROI } from '../utils/calculations';

const defaultData: WizardData = {
  company: {
    name: '',
    industry: '',
    employees: '',
    revenue: '',
    department: '',
  },
  aiStatus: {
    currentUsage: '',
    maturityLevel: 3,
    challenges: [],
    goals: [],
  },
  investments: {
    previousInvestment: '0',
    budgetYear1: '',
    budgetYear2: '',
    budgetYear3: '',
    personnelCostsAnnual: '',
    infrastructureCostsAnnual: '0',
    serviceCostsAnnual: '0',
  },
  returns: {
    costSavingsAnnual: '',
    revenueIncreaseAnnual: '0',
    timeSavingsHoursPerWeek: '0',
    hourlyRate: '80',
  },
  risks: {
    failureProbability: 20,
    delayMonths: '0',
    personnelCostsAnnual: '',
    mainRisks: [],
  },
};

const STORAGE_KEY = 'ki-roi-wizard-data';

export function useROI() {
  const [data, setData] = useState<WizardData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as WizardData) : defaultData;
    } catch {
      return defaultData;
    }
  });

  const updateSection = useCallback(
    <K extends keyof WizardData>(section: K, values: Partial<WizardData[K]>) => {
      setData((prev) => {
        const updated: WizardData = {
          ...prev,
          [section]: { ...prev[section], ...values },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData);
  }, []);

  const results: ROIResults = calculateROI(data);

  return { data, updateSection, reset, results };
}

export interface CompanyData {
  name: string;
  industry: string;
  employees: string;
  revenue: string;
  department: string;
}

export interface AIStatusData {
  currentUsage: string;
  maturityLevel: number;
  challenges: string[];
  goals: string[];
}

export interface InvestmentData {
  previousInvestment: string;
  budgetYear1: string;
  budgetYear2: string;
  budgetYear3: string;
  personnelCostsAnnual: string;
  infrastructureCostsAnnual: string;
  serviceCostsAnnual: string;
}

export interface ReturnData {
  costSavingsAnnual: string;
  revenueIncreaseAnnual: string;
  timeSavingsHoursPerWeek: string;
  hourlyRate: string;
}

export interface RiskData {
  failureProbability: number;
  delayMonths: string;
  personnelCostsAnnual: string;
  mainRisks: string[];
}

export interface WizardData {
  company: CompanyData;
  aiStatus: AIStatusData;
  investments: InvestmentData;
  returns: ReturnData;
  risks: RiskData;
}

export interface ROIResults {
  totalInvestment: number;
  totalReturn: number;
  riskAdjustedReturn: number;
  delayCosts: number;
  totalCost: number;
  riskAdjustedROI: number;
  paybackPeriodMonths: number;
  netBenefit: number;
  annualReturn: number;
}

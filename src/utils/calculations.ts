import type { WizardData, ROIResults } from '../types';

export function parseNum(val: string | number): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateROI(data: WizardData): ROIResults {
  const { investments, returns, risks } = data;

  // ── Gesamtinvestition ──────────────────────────────────────────────────────
  // = bisherige Investition + Budgets J1-J3 + 3 * (Personal + Infra + Services)
  const previousInvestment      = parseNum(investments.previousInvestment);
  const budgetYear1             = parseNum(investments.budgetYear1);
  const budgetYear2             = parseNum(investments.budgetYear2);
  const budgetYear3             = parseNum(investments.budgetYear3);
  const personnelAnnual         = parseNum(investments.personnelCostsAnnual);
  const infraAnnual             = parseNum(investments.infrastructureCostsAnnual);
  const servicesAnnual          = parseNum(investments.serviceCostsAnnual);

  const totalInvestment =
    previousInvestment +
    budgetYear1 + budgetYear2 + budgetYear3 +
    3 * (personnelAnnual + infraAnnual + servicesAnnual);

  // ── Gesamtertrag (3 Jahre) ─────────────────────────────────────────────────
  // = 3 * (Kosteneinsparung + Umsatzplus + Zeiteinsparung_h/Woche * Stundensatz * 52)
  const costSavings    = parseNum(returns.costSavingsAnnual);
  const revenueInc     = parseNum(returns.revenueIncreaseAnnual);
  const timeSavingsH   = parseNum(returns.timeSavingsHoursPerWeek);
  const hourlyRate     = parseNum(returns.hourlyRate);

  const annualTimeReturn = timeSavingsH * hourlyRate * 52;
  const annualReturn     = costSavings + revenueInc + annualTimeReturn;
  const totalReturn      = 3 * annualReturn;

  // ── Risikoadjustierter Ertrag ─────────────────────────────────────────────
  // = Gesamtertrag * (1 - Scheiterwahrscheinlichkeit / 100)
  const riskAdjustedReturn = totalReturn * (1 - risks.failureProbability / 100);

  // ── Verzögerungskosten ────────────────────────────────────────────────────
  // = Verzögerung_Monate * (Personalkosten / 12) * 0.5
  const delayMonths          = parseNum(risks.delayMonths);
  const personnelForDelay    = parseNum(risks.personnelCostsAnnual);
  const delayCosts           = delayMonths * (personnelForDelay / 12) * 0.5;

  const totalCost = totalInvestment + delayCosts;

  // ── ROI (risikoadjustiert) ────────────────────────────────────────────────
  // = (RisikoErtrag - (Investition + Verzögerungskosten)) / (Investition + Verzögerungskosten) * 100
  const riskAdjustedROI =
    totalCost > 0
      ? ((riskAdjustedReturn - totalCost) / totalCost) * 100
      : 0;

  // ── Amortisationszeit (Monate) ────────────────────────────────────────────
  const monthlyReturn = annualReturn / 12;
  const paybackPeriodMonths =
    monthlyReturn > 0 ? Math.ceil(totalCost / monthlyReturn) : 999;

  // ── Nettoertrag ───────────────────────────────────────────────────────────
  const netBenefit = riskAdjustedReturn - totalCost;

  return {
    totalInvestment,
    totalReturn,
    riskAdjustedReturn,
    delayCosts,
    totalCost,
    riskAdjustedROI,
    paybackPeriodMonths,
    netBenefit,
    annualReturn,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)} %`;
}

export function formatMonths(months: number): string {
  if (months >= 999) return '> 10 Jahre';
  if (months > 60) return `${(months / 12).toFixed(1)} Jahre`;
  return `${months} Monate`;
}

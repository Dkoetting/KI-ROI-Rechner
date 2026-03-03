import { useWizard } from '../../context/WizardContext';
import { formatCurrency, formatPercent, formatMonths } from '../../utils/calculations';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Step6Summary() {
  const { data, results } = useWizard();
  const { company, aiStatus, investments, risks } = data;

  const usageLabel: Record<string, string> = {
    none: 'Kein KI-Einsatz',
    basic: 'Basisnutzung',
    advanced: 'Fortgeschritten',
    extensive: 'Intensiv',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800 mb-1">Zusammenfassung &amp; Vorschau</h2>
      <p className="text-gray-500 text-sm mb-6">
        Überprüfen Sie Ihre Angaben. Klicken Sie auf „Analyse starten", um die vollständige
        KI-Strategieanalyse zu erhalten.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Company */}
        <Section title="Unternehmen">
          <Row label="Name" value={company.name || '–'} />
          <Row label="Branche" value={company.industry || '–'} />
          <Row label="Mitarbeiter" value={company.employees || '–'} />
          <Row label="Jahresumsatz" value={company.revenue ? formatCurrency(parseFloat(company.revenue)) : '–'} />
          <Row label="Abteilung" value={company.department || '–'} />
        </Section>

        {/* AI Status */}
        <Section title="KI-Status">
          <Row label="Einsatz" value={usageLabel[aiStatus.currentUsage] || '–'} />
          <Row label="Reifegrad" value={`${aiStatus.maturityLevel} / 5`} />
          <Row label="Herausforderungen" value={aiStatus.challenges.length > 0 ? aiStatus.challenges.join(', ') : '–'} />
          <Row label="Ziele" value={aiStatus.goals.length > 0 ? aiStatus.goals.join(', ') : '–'} />
        </Section>

        {/* Investments */}
        <Section title="Investitionen (3-Jahres-Horizon)">
          <Row label="Bisherige Investition" value={formatCurrency(parseFloat(investments.previousInvestment) || 0)} />
          <Row label="Budget J1–J3" value={formatCurrency((parseFloat(investments.budgetYear1) || 0) + (parseFloat(investments.budgetYear2) || 0) + (parseFloat(investments.budgetYear3) || 0))} />
          <Row label="Lfd. Kosten (× 3 J.)" value={formatCurrency(3 * ((parseFloat(investments.personnelCostsAnnual) || 0) + (parseFloat(investments.infrastructureCostsAnnual) || 0) + (parseFloat(investments.serviceCostsAnnual) || 0)))} />
          <Row label="Gesamtinvestition" value={formatCurrency(results.totalInvestment)} />
        </Section>

        {/* Returns & risks */}
        <Section title="Erträge & Risiken">
          <Row label="Gesamtertrag (3 J.)" value={formatCurrency(results.totalReturn)} />
          <Row label="Scheiterwahrscheinlichkeit" value={`${risks.failureProbability} %`} />
          <Row label="Verzögerungskosten" value={formatCurrency(results.delayCosts)} />
          <Row label="Risikoert. Ertrag" value={formatCurrency(results.riskAdjustedReturn)} />
        </Section>
      </div>

      {/* ROI preview */}
      <div className="bg-navy-800 rounded-xl p-6 text-white">
        <h3 className="text-sm font-semibold uppercase tracking-wide opacity-70 mb-4">
          ROI-Vorschau
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className={`text-2xl font-bold ${results.riskAdjustedROI >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {formatPercent(results.riskAdjustedROI)}
            </div>
            <div className="text-xs opacity-60 mt-0.5">ROI (risikoadj.)</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatCurrency(results.netBenefit)}</div>
            <div className="text-xs opacity-60 mt-0.5">Nettoertrag</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatMonths(results.paybackPeriodMonths)}</div>
            <div className="text-xs opacity-60 mt-0.5">Amortisation</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatCurrency(results.totalInvestment)}</div>
            <div className="text-xs opacity-60 mt-0.5">Gesamtinvestition</div>
          </div>
        </div>
        <p className="text-xs opacity-50 mt-4">
          Klicken Sie auf „Analyse starten" für die vollständige KI-Strategieanalyse mit Handlungsempfehlungen.
        </p>
      </div>
    </div>
  );
}

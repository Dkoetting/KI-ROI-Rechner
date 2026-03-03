import { useWizard } from '../../context/WizardContext';
import { InputField } from '../ui/InputField';

export function Step3Investments() {
  const { data, updateSection } = useWizard();
  const inv = data.investments;
  const u = (key: keyof typeof inv, v: string) => updateSection('investments', { [key]: v });

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800 mb-1">KI-Investitionen</h2>
      <p className="text-gray-500 text-sm mb-6">
        Alle Kostenangaben in EUR. Laufende Kosten werden automatisch auf 3 Jahre hochgerechnet.
      </p>

      <div className="space-y-5">
        {/* One-time investments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-navy-800 mb-4">
            Einmalige &amp; projektbezogene Investitionen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Bisherige KI-Investition"
              name="previousInvestment"
              type="number"
              value={inv.previousInvestment}
              onChange={(v) => u('previousInvestment', v)}
              placeholder="0"
              suffix="€"
              hint="Bereits getätigte Investitionen"
              min={0}
            />
            <div />

            <InputField
              label="Budget Jahr 1"
              name="budgetYear1"
              type="number"
              value={inv.budgetYear1}
              onChange={(v) => u('budgetYear1', v)}
              placeholder="50000"
              suffix="€"
              required
              min={0}
            />
            <InputField
              label="Budget Jahr 2"
              name="budgetYear2"
              type="number"
              value={inv.budgetYear2}
              onChange={(v) => u('budgetYear2', v)}
              placeholder="30000"
              suffix="€"
              min={0}
            />
            <InputField
              label="Budget Jahr 3"
              name="budgetYear3"
              type="number"
              value={inv.budgetYear3}
              onChange={(v) => u('budgetYear3', v)}
              placeholder="20000"
              suffix="€"
              min={0}
            />
          </div>
        </div>

        {/* Annual operating costs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-navy-800 mb-1">
            Jährliche Betriebskosten
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Werden automatisch × 3 gerechnet (= gesamter 3-Jahres-Horizont).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InputField
              label="Personalkosten (p.a.)"
              name="personnelCostsAnnual"
              type="number"
              value={inv.personnelCostsAnnual}
              onChange={(v) => u('personnelCostsAnnual', v)}
              placeholder="120000"
              suffix="€"
              required
              hint="KI-Team, Schulungen, Externe"
              min={0}
            />
            <InputField
              label="Infrastrukturkosten (p.a.)"
              name="infrastructureCostsAnnual"
              type="number"
              value={inv.infrastructureCostsAnnual}
              onChange={(v) => u('infrastructureCostsAnnual', v)}
              placeholder="24000"
              suffix="€"
              hint="Cloud, Server, Lizenzen"
              min={0}
            />
            <InputField
              label="Servicekosten (p.a.)"
              name="serviceCostsAnnual"
              type="number"
              value={inv.serviceCostsAnnual}
              onChange={(v) => u('serviceCostsAnnual', v)}
              placeholder="15000"
              suffix="€"
              hint="Beratung, Support, APIs"
              min={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

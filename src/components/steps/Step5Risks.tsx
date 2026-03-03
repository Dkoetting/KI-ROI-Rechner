import { useWizard } from '../../context/WizardContext';
import { InputField, CheckboxGroup } from '../ui/InputField';

const RISK_OPTIONS = [
  'Fehlende Datenqualität',
  'Technische Integrationsprobleme',
  'Widerstand im Team',
  'Anbieter-Abhängigkeit',
  'Regulatorische Änderungen',
  'Fehlende Expertise intern',
  'Scope-Creep / Kostensteigerung',
  'Datenschutzverletzungen',
];

export function Step5Risks() {
  const { data, updateSection } = useWizard();
  const risks = data.risks;

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800 mb-1">Risikoabschätzung</h2>
      <p className="text-gray-500 text-sm mb-6">
        Realistische Risikoeinschätzung für eine verlässliche ROI-Prognose.
      </p>

      <div className="space-y-5">
        {/* Failure probability */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Scheiterwahrscheinlichkeit:{' '}
            <span
              className={[
                'font-bold',
                risks.failureProbability <= 20
                  ? 'text-green-700'
                  : risks.failureProbability <= 40
                  ? 'text-amber-600'
                  : 'text-red-600',
              ].join(' ')}
            >
              {risks.failureProbability} %
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={80}
            step={5}
            value={risks.failureProbability}
            onChange={(e) =>
              updateSection('risks', { failureProbability: parseInt(e.target.value) })
            }
            className="w-full h-2 accent-navy-800 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 % – sehr gering</span>
            <span>40 % – mittel</span>
            <span>80 % – hoch</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Wie wahrscheinlich ist es, dass das KI-Projekt nicht die erhofften Ergebnisse bringt?
          </p>
        </div>

        {/* Delay */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-navy-800 mb-4">Verzögerungsrisiko</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Erwartete Verzögerung"
              name="delayMonths"
              type="number"
              value={risks.delayMonths}
              onChange={(v) => updateSection('risks', { delayMonths: v })}
              placeholder="0"
              suffix="Monate"
              hint="Wie viele Monate Verzögerung sind realistisch?"
              min={0}
              max={36}
            />
            <InputField
              label="Jährliche Personalkosten (betroffene Mitarbeiter)"
              name="personnelCostsAnnual"
              type="number"
              value={risks.personnelCostsAnnual}
              onChange={(v) => updateSection('risks', { personnelCostsAnnual: v })}
              placeholder="120000"
              suffix="€/Jahr"
              hint="Für Verzögerungskostenberechnung"
              min={0}
            />
          </div>

          {/* Delay cost preview */}
          {parseFloat(risks.delayMonths) > 0 && parseFloat(risks.personnelCostsAnnual) > 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-800">
                <span className="font-medium">Kalkulierte Verzögerungskosten: </span>
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                  parseFloat(risks.delayMonths) * (parseFloat(risks.personnelCostsAnnual) / 12) * 0.5
                )}
                <span className="text-xs ml-2 font-normal">(= {risks.delayMonths} Monate × (Personalkosten / 12) × 0,5)</span>
              </p>
            </div>
          )}
        </div>

        {/* Main risks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <CheckboxGroup
            label="Hauptrisiken für Ihr Projekt"
            options={RISK_OPTIONS}
            selected={risks.mainRisks}
            onChange={(v) => updateSection('risks', { mainRisks: v })}
            hint="Mehrfachauswahl möglich – beeinflusst die KI-Strategieanalyse"
          />
        </div>
      </div>
    </div>
  );
}

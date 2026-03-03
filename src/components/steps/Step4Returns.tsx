import { useWizard } from '../../context/WizardContext';
import { InputField } from '../ui/InputField';

export function Step4Returns() {
  const { data, updateSection } = useWizard();
  const ret = data.returns;
  const u = (key: keyof typeof ret, v: string) => updateSection('returns', { [key]: v });

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800 mb-1">Erwartete Erträge</h2>
      <p className="text-gray-500 text-sm mb-6">
        Schätzen Sie die jährlichen Ertragseffekte Ihrer KI-Investitionen.
        Alle Werte werden automatisch auf 3 Jahre hochgerechnet.
      </p>

      <div className="space-y-5">
        {/* Financial returns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-navy-800 mb-4">
            Direkte Ertragseffekte (jährlich)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Kosteneinsparungen (p.a.)"
              name="costSavingsAnnual"
              type="number"
              value={ret.costSavingsAnnual}
              onChange={(v) => u('costSavingsAnnual', v)}
              placeholder="80000"
              suffix="€"
              hint="z.B. durch Automatisierung, Effizienzgewinne"
              min={0}
            />
            <InputField
              label="Umsatzsteigerung (p.a.)"
              name="revenueIncreaseAnnual"
              type="number"
              value={ret.revenueIncreaseAnnual}
              onChange={(v) => u('revenueIncreaseAnnual', v)}
              placeholder="50000"
              suffix="€"
              hint="z.B. durch bessere Vertriebssteuerung, neue Produkte"
              min={0}
            />
          </div>
        </div>

        {/* Time savings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-navy-800 mb-1">
            Zeiteinsparungen (indirekte Erträge)
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Formel: Stunden/Woche × Stundensatz × 52 Wochen = Jahreswert
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Zeiteinsparung pro Woche"
              name="timeSavingsHoursPerWeek"
              type="number"
              value={ret.timeSavingsHoursPerWeek}
              onChange={(v) => u('timeSavingsHoursPerWeek', v)}
              placeholder="20"
              suffix="Std/Woche"
              hint="Gesamte Stunden aller Mitarbeiter"
              min={0}
              step={0.5}
            />
            <InputField
              label="Durchschnittlicher Stundensatz"
              name="hourlyRate"
              type="number"
              value={ret.hourlyRate}
              onChange={(v) => u('hourlyRate', v)}
              placeholder="80"
              suffix="€/Std"
              hint="Inkl. Lohnnebenkosten"
              min={0}
            />
          </div>

          {/* Preview calculation */}
          {parseFloat(ret.timeSavingsHoursPerWeek) > 0 && parseFloat(ret.hourlyRate) > 0 && (
            <div className="mt-4 p-3 bg-navy-50 rounded-lg border border-navy-100">
              <p className="text-sm text-navy-800">
                <span className="font-medium">Jährlicher Zeiteinsparwert: </span>
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                  parseFloat(ret.timeSavingsHoursPerWeek) * parseFloat(ret.hourlyRate) * 52
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

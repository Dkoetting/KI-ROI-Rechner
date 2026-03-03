import { useWizard } from '../../context/WizardContext';
import { InputField, SelectField } from '../ui/InputField';

const INDUSTRIES = [
  { value: 'Technologie & Software',       label: 'Technologie & Software' },
  { value: 'Finanzen & Versicherung',       label: 'Finanzen & Versicherung' },
  { value: 'Gesundheitswesen',              label: 'Gesundheitswesen' },
  { value: 'Fertigung & Industrie',         label: 'Fertigung & Industrie' },
  { value: 'Handel & E-Commerce',           label: 'Handel & E-Commerce' },
  { value: 'Logistik & Transport',          label: 'Logistik & Transport' },
  { value: 'Energie & Umwelt',              label: 'Energie & Umwelt' },
  { value: 'Beratung & Professional Svcs',  label: 'Beratung & Professional Services' },
  { value: 'Medien & Unterhaltung',         label: 'Medien & Unterhaltung' },
  { value: 'Bildung & Forschung',           label: 'Bildung & Forschung' },
  { value: 'Öffentlicher Sektor',           label: 'Öffentlicher Sektor' },
  { value: 'Sonstiges',                     label: 'Sonstiges' },
];

export function Step1Company() {
  const { data, updateSection } = useWizard();
  const c = data.company;
  const u = (key: keyof typeof c, v: string) => updateSection('company', { [key]: v });

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800 mb-1">Unternehmensdaten</h2>
      <p className="text-gray-500 text-sm mb-6">
        Grundlegende Informationen zu Ihrem Unternehmen.
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full-width row */}
          <div className="md:col-span-2">
            <InputField
              label="Unternehmensname"
              name="name"
              value={c.name}
              onChange={(v) => u('name', v)}
              placeholder="Muster GmbH (optional)"
            />
          </div>

          <SelectField
            label="Branche"
            name="industry"
            value={c.industry}
            onChange={(v) => u('industry', v)}
            options={INDUSTRIES}
            required
          />

          <InputField
            label="Anzahl Mitarbeiter"
            name="employees"
            type="number"
            value={c.employees}
            onChange={(v) => u('employees', v)}
            placeholder="250"
            required
            min={1}
          />

          <InputField
            label="Jahresumsatz"
            name="revenue"
            type="number"
            value={c.revenue}
            onChange={(v) => u('revenue', v)}
            placeholder="5000000"
            required
            suffix="€"
            hint="Aktueller Jahresumsatz in EUR"
          />

          <InputField
            label="Abteilung / Schwerpunktbereich"
            name="department"
            value={c.department}
            onChange={(v) => u('department', v)}
            placeholder="z.B. Vertrieb, IT, Operations"
            required
            hint="Welche Abteilung soll von KI profitieren?"
          />
        </div>
      </div>
    </div>
  );
}

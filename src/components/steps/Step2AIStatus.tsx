import { useWizard } from '../../context/WizardContext';
import { CheckboxGroup } from '../ui/InputField';

const AI_USAGE_OPTIONS = [
  {
    value: 'none',
    label: 'Kein KI-Einsatz',
    desc: 'KI wird noch nicht genutzt',
    icon: '○',
  },
  {
    value: 'basic',
    label: 'Basisnutzung',
    desc: 'ChatGPT, Copilot, einfache Tools',
    icon: '◔',
  },
  {
    value: 'advanced',
    label: 'Fortgeschritten',
    desc: 'KI in definierten Geschäftsprozessen',
    icon: '◕',
  },
  {
    value: 'extensive',
    label: 'Intensiv',
    desc: 'KI als strategisches Kernelement',
    icon: '●',
  },
];

const CHALLENGES = [
  'Datenqualität',
  'Fehlende Expertise',
  'Budgetbeschränkungen',
  'Systemintegration',
  'Unternehmenskultur',
  'Datenschutz / DSGVO',
  'Regulatorische Anforderungen',
  'Change Management',
];

const GOALS = [
  'Effizienzsteigerung',
  'Kostensenkung',
  'Neue Erlösquellen',
  'Bessere Entscheidungen',
  'Kundenerlebnis',
  'Automatisierung',
  'Wettbewerbsvorteil',
  'Produkt-Innovation',
];

export function Step2AIStatus() {
  const { data, updateSection } = useWizard();
  const ai = data.aiStatus;

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800 mb-1">KI-Status & Ziele</h2>
      <p className="text-gray-500 text-sm mb-6">
        Beschreiben Sie den aktuellen Stand und Ihre Ziele beim KI-Einsatz.
      </p>

      <div className="space-y-5">
        {/* Current AI usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Aktueller KI-Einsatz <span className="text-red-500">*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {AI_USAGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateSection('aiStatus', { currentUsage: opt.value })}
                className={[
                  'text-left p-4 rounded-lg border-2 transition-all duration-150',
                  ai.currentUsage === opt.value
                    ? 'border-navy-800 bg-navy-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white',
                ].join(' ')}
              >
                <div className="text-xl mb-1 text-navy-800">{opt.icon}</div>
                <div className="font-medium text-sm text-gray-900">{opt.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Maturity level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            KI-Reifegrad:{' '}
            <span className="text-navy-800 font-bold">{ai.maturityLevel} / 5</span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={ai.maturityLevel}
            onChange={(e) =>
              updateSection('aiStatus', { maturityLevel: parseInt(e.target.value) })
            }
            className="w-full h-2 accent-navy-800 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 – Einsteiger</span>
            <span>3 – Fortgeschritten</span>
            <span>5 – Vorreiter</span>
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <CheckboxGroup
            label="Aktuelle Herausforderungen"
            options={CHALLENGES}
            selected={ai.challenges}
            onChange={(v) => updateSection('aiStatus', { challenges: v })}
            hint="Mehrfachauswahl möglich"
          />
        </div>

        {/* Goals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <CheckboxGroup
            label="KI-Ziele"
            options={GOALS}
            selected={ai.goals}
            onChange={(v) => updateSection('aiStatus', { goals: v })}
            hint="Welche Ziele soll der KI-Einsatz erreichen?"
          />
        </div>
      </div>
    </div>
  );
}

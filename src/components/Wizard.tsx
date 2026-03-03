import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../context/WizardContext';
import { ProgressBar } from './ui/ProgressBar';
import { Button } from './ui/Button';
import { Step1Company } from './steps/Step1Company';
import { Step2AIStatus } from './steps/Step2AIStatus';
import { Step3Investments } from './steps/Step3Investments';
import { Step4Returns } from './steps/Step4Returns';
import { Step5Risks } from './steps/Step5Risks';
import { Step6Summary } from './steps/Step6Summary';
import type { WizardData } from '../types';
import { parseNum } from '../utils/calculations';

const STEPS = [
  { label: 'Unternehmen',    component: Step1Company },
  { label: 'KI-Status',      component: Step2AIStatus },
  { label: 'Investitionen',  component: Step3Investments },
  { label: 'Erträge',        component: Step4Returns },
  { label: 'Risiken',        component: Step5Risks },
  { label: 'Zusammenfassung',component: Step6Summary },
];

function validateStep(step: number, data: WizardData): string[] {
  const errors: string[] = [];
  switch (step) {
    case 0:
      if (!data.company.name.trim())      errors.push('Unternehmensname ist erforderlich.');
      if (!data.company.industry)         errors.push('Bitte wählen Sie eine Branche aus.');
      if (!data.company.employees)        errors.push('Mitarbeiterzahl ist erforderlich.');
      if (!data.company.revenue)          errors.push('Jahresumsatz ist erforderlich.');
      if (!data.company.department.trim())errors.push('Abteilung / Schwerpunkt ist erforderlich.');
      break;
    case 1:
      if (!data.aiStatus.currentUsage)    errors.push('Bitte wählen Sie Ihren aktuellen KI-Einsatz aus.');
      break;
    case 2:
      if (!data.investments.budgetYear1)  errors.push('Budget Jahr 1 ist erforderlich.');
      if (!data.investments.personnelCostsAnnual) errors.push('Jährliche Personalkosten sind erforderlich.');
      break;
    case 3: {
      const hasReturn =
        parseNum(data.returns.costSavingsAnnual) > 0 ||
        parseNum(data.returns.revenueIncreaseAnnual) > 0 ||
        (parseNum(data.returns.timeSavingsHoursPerWeek) > 0 && parseNum(data.returns.hourlyRate) > 0);
      if (!hasReturn) errors.push('Geben Sie mindestens einen positiven Ertragswert an.');
      break;
    }
    default:
      break;
  }
  return errors;
}

export function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const { data } = useWizard();
  const navigate = useNavigate();

  const StepComponent = STEPS[currentStep].component;

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, data);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors([]);
    if (currentStep === STEPS.length - 1) {
      navigate('/results');
    } else {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrors([]);
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-navy-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">KI-ROI-Rechner</h1>
            <p className="text-xs text-navy-200 mt-0.5">Strategische KI-Investitionsanalyse</p>
          </div>
          <span className="text-xs text-navy-300 bg-navy-900 px-3 py-1 rounded-full">
            Schritt {currentStep + 1} / {STEPS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto px-6 pb-2">
          <ProgressBar steps={STEPS.map((s) => s.label)} currentStep={currentStep} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">Bitte korrigieren Sie folgende Felder:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {errors.map((e, i) => (
                    <li key={i} className="text-sm text-red-700">{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <StepComponent />

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            ← Zurück
          </Button>
          <Button onClick={handleNext}>
            {currentStep === STEPS.length - 1 ? 'Analyse starten →' : 'Weiter →'}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        KI-ROI-Rechner · Alle Berechnungen sind Schätzungen und ersetzen keine Unternehmensberatung.
      </footer>
    </div>
  );
}

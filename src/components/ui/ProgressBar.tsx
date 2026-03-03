interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="flex items-center py-4 overflow-x-auto">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1 min-w-0">
          {/* Step indicator */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                index < currentStep
                  ? 'bg-navy-800 text-white'
                  : index === currentStep
                  ? 'bg-navy-800 text-white ring-4 ring-navy-200'
                  : 'bg-gray-200 text-gray-500',
              ].join(' ')}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={[
                'text-xs mt-1 hidden sm:block whitespace-nowrap',
                index <= currentStep ? 'text-navy-800 font-medium' : 'text-gray-400',
              ].join(' ')}
            >
              {step}
            </span>
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div
              className={[
                'flex-1 h-0.5 mx-2 mt-[-1rem] sm:mt-[-1.25rem] transition-colors',
                index < currentStep ? 'bg-navy-800' : 'bg-gray-200',
              ].join(' ')}
            />
          )}
        </div>
      ))}
    </div>
  );
}



interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  suffix?: string;
  prefix?: string;
  required?: boolean;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  readOnly?: boolean;
}

export function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  suffix,
  prefix,
  required,
  hint,
  min,
  max,
  step,
  readOnly,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex">
        {prefix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm select-none">
            {prefix}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          readOnly={readOnly}
          className={[
            'flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300',
            'focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700',
            'placeholder:text-gray-400',
            readOnly ? 'bg-gray-50 cursor-not-allowed' : '',
            prefix ? 'rounded-r-md' : suffix ? 'rounded-l-md' : 'rounded-md',
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {suffix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm select-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// ─── Select helper ────────────────────────────────────────────────────────────

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
  hint,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700"
      >
        <option value="">Bitte wählen …</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// ─── Checkbox group helper ────────────────────────────────────────────────────

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  hint?: string;
}

export function CheckboxGroup({ label, options, selected, onChange, hint }: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div>
      <p className="block text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={[
              'flex items-center gap-2 px-3 py-2 rounded-md border text-sm cursor-pointer transition-colors',
              selected.includes(opt)
                ? 'border-navy-700 bg-navy-50 text-navy-800 font-medium'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
            ].join(' ')}
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="w-4 h-4 rounded text-navy-800 border-gray-300 focus:ring-navy-700"
            />
            {opt}
          </label>
        ))}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

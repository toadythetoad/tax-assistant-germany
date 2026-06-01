import { useLanguage } from '../store/AppContext';

interface FieldProps {
  label: string;
  helpKey?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ label, helpKey, error, children, required }: FieldProps) {
  const { t } = useLanguage();
  const helpText = helpKey ? (t as any)[helpKey] : undefined;
  const flatHelp = (obj: any, keys: string[]): string => {
    let val: any = obj;
    for (const k of keys) {
      if (!val) return '';
      val = val[k];
    }
    return typeof val === 'string' ? val : '';
  };

  const help = helpKey ? flatHelp(t, helpKey.split('.')) : '';

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
        {help && (
          <span className="tooltip-trigger inline-block ml-2 text-blue-500 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="tooltip-text">{help}</span>
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Input({ label, helpKey, error, required, ...props }: { label: string; helpKey?: string; error?: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField label={label} helpKey={helpKey} error={error} required={required}>
      <input
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      />
    </FormField>
  );
}

export function Select({ label, helpKey, error, required, children, ...props }: { label: string; helpKey?: string; error?: string; required?: boolean } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FormField label={label} helpKey={helpKey} error={error} required={required}>
      <select
        className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      >
        {children}
      </select>
    </FormField>
  );
}

export function NumberInput({ label, helpKey, error, required, ...props }: { label: string; helpKey?: string; error?: string; required?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <Input label={label} helpKey={helpKey} error={error} required={required} type="number" {...props} />
  );
}

export function Button({ children, variant = 'primary', ...props }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger' | 'ghost' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

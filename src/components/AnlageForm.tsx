import { useLanguage } from '../store/AppContext';
import { Button } from './FormComponents';

export interface FieldDef {
  key: string;
  label: string;
  type?: 'number' | 'text' | 'select' | 'checkbox';
  helpKey?: string;
  options?: { value: string; label: string }[];
  min?: number;
  step?: number;
  required?: boolean;
}

interface Props {
  title: string;
  fields: FieldDef[];
  data: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onSave: () => void;
  onBack: () => void;
}

export default function AnlageForm({ title, fields, data, onChange, onSave, onBack }: Props) {
  const { t } = useLanguage();

  function helpText(helpKey?: string): string {
    if (!helpKey) return '';
    const parts = helpKey.split('.');
    let val: any = t;
    for (const p of parts) {
      if (!val) return '';
      val = val[p];
    }
    return typeof val === 'string' ? val : '';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{title}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onBack}>{t.common.back}</Button>
            <Button onClick={onSave}>{t.common.save}</Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {fields.length === 0 ? (
            <p className="text-gray-400 text-center py-8">{t.interview.noData}</p>
          ) : (
            <div className="space-y-4">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {f.label}
                    {f.required && <span className="text-red-500 ml-1">*</span>}
                    {f.helpKey && (
                      <span className="tooltip-trigger inline-block ml-2 text-blue-500 cursor-help">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="tooltip-text">{helpText(f.helpKey)}</span>
                      </span>
                    )}
                  </label>
                  {f.type === 'select' && f.options ? (
                    <select
                      value={data[f.key] || ''}
                      onChange={(e) => onChange(f.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      <option value="">{t.common.select}</option>
                      {f.options.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!data[f.key]}
                        onChange={(e) => onChange(f.key, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-600">{f.label}</span>
                    </label>
                  ) : (
                    <input
                      type={f.type || 'text'}
                      value={data[f.key] ?? ''}
                      onChange={(e) => onChange(f.key, f.type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value)}
                      min={f.min}
                      step={f.step}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={onBack}>{t.common.back}</Button>
          <Button onClick={onSave}>{t.common.save}</Button>
        </div>
      </div>
    </div>
  );
}

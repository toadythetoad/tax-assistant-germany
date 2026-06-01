import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import { NumberInput, Button } from '../components/FormComponents';

const steps = ['stepPersonal', 'stepIncome', 'stepExpenses', 'stepDeductions', 'stepSummary'];

export default function Interview() {
  const { app, setApp } = useApp();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>(app.taxReturn || {});

  function set(field: string, value: number) {
    setData((prev: any) => ({ ...prev, [field]: value }));
  }

  function saveDraft() {
    setApp({ taxReturn: data });
  }

  const incomeFields = [
    { key: 'incomeEmployment', helpKey: 'interview.incomeEmploymentHelp' },
    { key: 'incomeSelfEmployment', helpKey: 'interview.incomeSelfEmploymentHelp' },
    { key: 'incomeCapital', helpKey: 'interview.incomeCapitalHelp' },
    { key: 'incomeRental', helpKey: 'interview.incomeRentalHelp' },
    { key: 'incomePension', helpKey: 'interview.incomePensionHelp' },
    { key: 'incomeOther', helpKey: 'interview.incomeOtherHelp' },
  ];

  const expenseFields = [
    { key: 'expensesAdvertising', helpKey: 'interview.expensesAdvertisingHelp' },
    { key: 'expensesSpecial', helpKey: 'interview.expensesSpecialHelp' },
    { key: 'expensesHousehold', helpKey: 'interview.expensesHouseholdHelp' },
    { key: 'expensesExtraordinary', helpKey: 'interview.expensesExtraordinaryHelp' },
    { key: 'expensesDonations', helpKey: 'interview.expensesDonationsHelp' },
    { key: 'expensesInsurance', helpKey: 'interview.expensesInsuranceHelp' },
  ];

  const totalIncome = incomeFields.reduce((sum, f) => sum + (data[f.key] || 0), 0);
  const totalExpenses = expenseFields.reduce((sum, f) => sum + (data[f.key] || 0), 0);
  const taxable = Math.max(0, totalIncome - totalExpenses);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{t.interview.title}</h1>
          <Button variant="ghost" onClick={saveDraft}>{t.interview.saveDraft}</Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className={`flex-1 h-2 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">{(t.interview as any)[steps[step]]}</h2>
              <p className="text-gray-500">{t.app.subtitle}</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput label={t.profile.children} helpKey="profile.childrenHelp" min={0} value={data.children || 0} onChange={(e) => set('children', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">{(t.interview as any)[steps[step]]}</h2>
              <p className="text-sm text-gray-500 mb-4">Summe: {totalIncome.toLocaleString('de-DE')} €</p>
              <div className="space-y-4">
                {incomeFields.map((f) => (
                  <NumberInput
                    key={f.key}
                    label={(t.interview as any)[f.key]}
                    helpKey={f.helpKey}
                    min={0}
                    step={100}
                    value={data[f.key] || 0}
                    onChange={(e) => set(f.key, parseFloat(e.target.value) || 0)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">{(t.interview as any)[steps[step]]}</h2>
              <p className="text-sm text-gray-500 mb-4">Summe: {totalExpenses.toLocaleString('de-DE')} €</p>
              <div className="space-y-4">
                {expenseFields.map((f) => (
                  <NumberInput
                    key={f.key}
                    label={(t.interview as any)[f.key]}
                    helpKey={f.helpKey}
                    min={0}
                    step={100}
                    value={data[f.key] || 0}
                    onChange={(e) => set(f.key, parseFloat(e.target.value) || 0)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">{(t.interview as any)[steps[step]]}</h2>
              <NumberInput
                label={t.interview.expensesDonations}
                helpKey="interview.expensesDonationsHelp"
                min={0}
                step={50}
                value={data.expensesDonations || 0}
                onChange={(e) => set('expensesDonations', parseFloat(e.target.value) || 0)}
              />
              <NumberInput
                label={t.interview.expensesInsurance}
                helpKey="interview.expensesInsuranceHelp"
                min={0}
                step={100}
                value={data.expensesInsurance || 0}
                onChange={(e) => set('expensesInsurance', parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">{(t.interview as any)[steps[step]]}</h2>
              <div className="space-y-3">
                {incomeFields.map((f) => data[f.key] > 0 && (
                  <div key={f.key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{(t.interview as any)[f.key]}</span>
                    <span className="font-medium">{data[f.key].toLocaleString('de-DE')} €</span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between text-sm font-semibold">
                  <span>{t.calculation.totalIncome}</span>
                  <span>{totalIncome.toLocaleString('de-DE')} €</span>
                </div>
                {expenseFields.map((f) => data[f.key] > 0 && (
                  <div key={f.key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{(t.interview as any)[f.key]}</span>
                    <span className="font-medium">-{data[f.key].toLocaleString('de-DE')} €</span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between text-lg font-bold text-blue-700">
                  <span>{t.calculation.taxableIncome}</span>
                  <span>{taxable.toLocaleString('de-DE')} €</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">{t.preview.disclaimer}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={() => step > 0 ? setStep(step - 1) : setApp({ page: 'dashboard' })}>
            {t.common.back}
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>{t.common.next}</Button>
          ) : (
            <Button onClick={() => { saveDraft(); setApp({ page: 'calculation' }); }}>
              {t.interview.submit}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

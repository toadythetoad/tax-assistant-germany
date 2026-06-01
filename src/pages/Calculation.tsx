import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';
import { calculateTax } from '../utils/taxCalculator';

export default function Calculation() {
  const { app, setApp } = useApp();
  const { t } = useLanguage();
  const data = app.taxReturn;

  const incomeFields = [
    'incomeEmployment', 'incomeSelfEmployment', 'incomeCapital',
    'incomeRental', 'incomePension', 'incomeOther',
  ];
  const expenseFields = [
    'expensesAdvertising', 'expensesSpecial', 'expensesHousehold',
    'expensesExtraordinary', 'expensesDonations', 'expensesInsurance',
  ];

  const grossIncome = incomeFields.reduce((s, f) => s + (data?.[f] || 0), 0);
  const totalExpenses = expenseFields.reduce((s, f) => s + (data?.[f] || 0), 0);
  const children = data?.children || 0;
  const church = data?.religion && data.religion !== 'none';

  const result = grossIncome > 0
    ? calculateTax(grossIncome, totalExpenses, 0, app.state, children, church)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{t.calculation.title}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
            <Button onClick={() => setApp({ page: 'preview' })}>{t.nav.taxDeclaration}</Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!result ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-400">{t.interview.noData}</p>
            <Button className="mt-4" onClick={() => setApp({ page: 'interview' })}>{t.dashboard.startInterview}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">{t.calculation.calculationBasis}</h2>
              <div className="space-y-3">
                <Row label={t.calculation.grossIncome} value={result.grossIncome} />
                <Row label={t.calculation.advertisingCosts} value={result.advertisingCosts} negative />
                <Row label={t.calculation.specialExpenses} value={result.specialExpenses} negative />
                <Row label={t.calculation.childBenefit} value={result.childAllowance} negative />
                <hr />
                <Row label={t.calculation.taxableIncome} value={result.taxableIncome} bold />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">{t.calculation.title}</h2>
              <div className="space-y-3">
                <Row label={t.calculation.incomeTax} value={result.incomeTax} />
                <Row label={t.calculation.solidaritySurcharge} value={result.solidaritySurcharge} />
                <Row label={t.calculation.churchTax} value={result.churchTax} />
                <hr />
                <Row label={t.calculation.totalTax} value={result.totalTax} bold />
                <Row label={t.calculation.effectiveTaxRate} value={parseFloat(result.effectiveTaxRate)} suffix="%" />
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">{t.calculation.stateSpecific}</h2>
              <div className="tooltip-trigger inline-block text-blue-500 cursor-help mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="tooltip-text">{t.calculation.stateSpecificHelp}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">{t.settings.state}</span>
                  <p className="font-medium">{(t.states as any)[app.state]}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t.calculation.effectiveTaxRate}</span>
                  <p className="font-medium">{result.effectiveTaxRate}%</p>
                </div>
                <div>
                  <span className="text-gray-500">{t.calculation.marginalTaxRate}</span>
                  <p className="font-medium">{result.marginalTaxRate}%</p>
                </div>
                <div>
                  <span className="text-gray-500">{t.profile.religion}</span>
                  <p className="font-medium">{church ? (t.profile as any)[`religion${data.religion.charAt(0).toUpperCase() + data.religion.slice(1)}`] || t.profile.religionCatholic : t.profile.religionNone}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, negative, bold, suffix }: { label: string; value: number; negative?: boolean; bold?: boolean; suffix?: string }) {
  const prefix = negative ? '- ' : '';
  return (
    <div className={`flex justify-between ${bold ? 'text-base font-bold' : 'text-sm'}`}>
      <span className="text-gray-600">{label}</span>
      <span className={bold ? 'text-blue-700' : ''}>
        {prefix}{value.toLocaleString('de-DE')}{suffix || ' €'}
      </span>
    </div>
  );
}

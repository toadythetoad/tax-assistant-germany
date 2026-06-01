import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';
import { calculateTax } from '../utils/taxCalculator';

export default function Calculation() {
  const { app, setApp } = useApp();
  const { t } = useLanguage();
  const data = app.taxReturn || {};
  const profile = app.profile || {};

  const result = calculateTax({
    incomeEmployment: data.incomeEmployment || 0,
    incomeSelfEmployment: data.incomeSelfEmployment || 0,
    incomeCapital: data.incomeCapital || 0,
    incomeRental: data.incomeRental || 0,
    incomePension: data.incomePension || 0,
    incomeOther: data.incomeOther || 0,
    expensesAdvertising: data.expensesAdvertising || 0,
    expensesSpecial: data.expensesSpecial || 0,
    expensesHousehold: data.expensesHousehold || 0,
    expensesExtraordinary: data.expensesExtraordinary || 0,
    expensesDonations: data.expensesDonations || 0,
    expensesInsurance: data.expensesInsurance || 0,
    maritalStatus: profile.maritalStatus || 'single',
    children: data.children || profile.children || 0,
    state: profile.state || app.state,
    religion: profile.religion || 'none',
    withholdingTax: data.withholdingTax || 0,
    withholdingSoli: data.withholdingSoli || 0,
    withholdingChurch: data.withholdingChurch || 0,
    capitalGainsWithholding: data.capitalGainsWithholding || 0,
  });

  const isRefund = result.balance < 0;

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

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {result.grossIncome <= 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-400">{t.interview.noData}</p>
            <Button className="mt-4" onClick={() => setApp({ page: 'interview' })}>{t.dashboard.startInterview}</Button>
          </div>
        ) : (
          <>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Steuerschuld</h2>
                <div className="space-y-3">
                  <Row label="Einkommensteuer" value={result.incomeTax} />
                  <Row label="Solidaritätszuschlag" value={result.solidaritySurcharge} />
                  <Row label="Kirchensteuer" value={result.churchTax} />
                  <hr />
                  <Row label="Steuerschuld gesamt" value={result.totalTax} bold />
                  <Row label="Durchschnittssteuersatz" value={parseFloat(result.effectiveTaxRate)} suffix="%" />
                  <Row label="Grenzsteuersatz" value={result.marginalTaxRate} suffix="%" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Bereits gezahlte Steuern</h2>
                <div className="space-y-3">
                  <Row label="Lohnsteuer" value={result.alreadyPaidLohnsteuer} />
                  <Row label="Solidaritätszuschlag" value={result.alreadyPaidSoli} />
                  <Row label="Kirchensteuer" value={result.alreadyPaidChurch} />
                  <Row label="Kapitalertragsteuer" value={result.alreadyPaidKapital} />
                  <hr />
                  <Row label="Bereits gezahlt gesamt" value={result.totalAlreadyPaid} bold />
                </div>
              </div>
            </div>

            <div className={`rounded-xl shadow-sm border-2 p-6 ${isRefund ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">
                  {isRefund ? 'Erstattung' : 'Nachzahlung'}
                </p>
                <p className={`text-3xl font-bold ${isRefund ? 'text-green-600' : 'text-red-600'}`}>
                  {isRefund ? '-' : '+'}{Math.abs(result.balance).toLocaleString('de-DE')} €
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Steuerschuld {result.totalTax.toLocaleString('de-DE')} €
                  – bereits gezahlt {result.totalAlreadyPaid.toLocaleString('de-DE')} €
                </p>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">{t.calculation.stateSpecific}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">{t.settings.state}</span>
                  <p className="font-medium">{(t.states as any)[app.state]}</p>
                </div>
                <div>
                  <span className="text-gray-500">Familienstand</span>
                  <p className="font-medium">{profile.maritalStatus === 'married' ? 'Verheiratet (Splitting)' : 'Ledig'}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t.profile.religion}</span>
                  <p className="font-medium">{result.churchTax > 0 ? 'Ja' : 'Nein'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Kinder</span>
                  <p className="font-medium">{result.childAllowance > 0 ? `${data.children || 0} (Freibetrag)` : '0'}</p>
                </div>
              </div>
            </div>
          </>
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

import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';

export default function Preview() {
  const { app, setApp } = useApp();
  const { t } = useLanguage();
  const data = app.taxReturn;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{t.preview.title}</h1>
          <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!data ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-400">{t.preview.noData}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">{t.calculation.calculationBasis}</h2>
              <div className="space-y-3">
                {[
                  ['incomeEmployment', t.interview.incomeEmployment],
                  ['incomeSelfEmployment', t.interview.incomeSelfEmployment],
                  ['incomeCapital', t.interview.incomeCapital],
                  ['incomeRental', t.interview.incomeRental],
                  ['incomePension', t.interview.incomePension],
                  ['incomeOther', t.interview.incomeOther],
                ].map(([key, label]) =>
                  (data as any)[key as string] ? (
                    <div key={key as string} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span>{(data as any)[key as string].toLocaleString('de-DE')} €</span>
                    </div>
                  ) : null
                )}
                <hr />
                {[
                  ['expensesAdvertising', t.interview.expensesAdvertising],
                  ['expensesSpecial', t.interview.expensesSpecial],
                  ['expensesHousehold', t.interview.expensesHousehold],
                  ['expensesExtraordinary', t.interview.expensesExtraordinary],
                  ['expensesDonations', t.interview.expensesDonations],
                  ['expensesInsurance', t.interview.expensesInsurance],
                ].map(([key, label]) =>
                  (data as any)[key as string] ? (
                    <div key={key as string} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span>-{(data as any)[key as string].toLocaleString('de-DE')} €</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button>{t.preview.generatePDF}</Button>
              <Button variant="secondary">{t.preview.downloadPDF}</Button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-6">{t.preview.disclaimer}</p>
          </>
        )}
      </div>
    </div>
  );
}

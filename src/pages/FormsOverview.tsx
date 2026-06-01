import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';

const anlagen = [
  { key: 'anlageN', icon: '💼', page: 'anlageN', color: 'border-blue-400' },
  { key: 'anlageKAP', icon: '💰', page: 'anlageKAP', color: 'border-green-400' },
  { key: 'anlageV', icon: '🏠', page: 'anlageV', color: 'border-yellow-400' },
  { key: 'anlageR', icon: '👴', page: 'anlageR', color: 'border-purple-400' },
  { key: 'anlageSO', icon: '📄', page: 'anlageSO', color: 'border-orange-400' },
  { key: 'anlageVorsorge', icon: '🛡️', page: 'anlageVorsorge', color: 'border-teal-400' },
];

export default function FormsOverview() {
  const { app, setApp } = useApp();
  const { t, language } = useLanguage();

  function hasData(key: string): boolean {
    const f = app.forms[key];
    if (!f) return false;
    return Object.values(f).some(v => v !== undefined && v !== null && v !== '' && v !== false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Steuerformulare {app.year}</h1>
            <p className="text-sm text-gray-500">{t.forms.title}</p>
          </div>
          <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {anlagen.map(a => {
            const filled = hasData(a.key);
            return (
              <button
                key={a.key}
                onClick={() => setApp({ page: a.page })}
                className={`bg-white rounded-xl p-5 shadow-sm border-2 text-left transition hover:shadow-md ${filled ? a.color + ' bg-white' : 'border-gray-200'}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{a.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{(t.forms as any)[a.key]?.title || a.key}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {filled ? '✓ Ausgefüllt' : '✗ Nicht ausgefüllt'}
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="secondary" onClick={() => setApp({ page: 'calculation' })}>{t.nav.calculator}</Button>
          <Button onClick={() => setApp({ page: 'preview' })}>{t.nav.taxDeclaration}</Button>
        </div>
      </div>
    </div>
  );
}

import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';

const actions = [
  { key: 'uploadPayslip', icon: '📄', descKey: 'uploadDesc', page: 'payslipUpload' },
  { key: 'startInterview', icon: '💬', descKey: 'interviewDesc', page: 'interview' },
  { key: 'documents', icon: '📁', descKey: 'documentsDesc', page: 'documents' },
  { key: 'preview', icon: '📋', descKey: 'previewDesc', page: 'preview' },
  { key: 'calculator', icon: '🧮', descKey: 'calculatorDesc', page: 'calculation' },
];

export default function Dashboard() {
  const { setApp } = useApp();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">€</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{t.app.title}</h1>
              <p className="text-xs text-gray-500">{t.dashboard.welcome}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setApp({ page: 'profile' })}>{t.nav.profile}</Button>
            <Button variant="ghost" onClick={() => setApp({ page: 'settings' })}>{t.nav.settings}</Button>
            <Button variant="ghost" onClick={() => setApp({ page: 'help' })}>{t.nav.help}</Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">{t.dashboard.recentActivity}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((a) => (
            <button
              key={a.key}
              onClick={() => setApp({ page: a.page })}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-left"
            >
              <div className="text-2xl mb-2">{a.icon}</div>
              <h3 className="font-medium text-gray-900">{(t.dashboard as any)[a.key]}</h3>
              <p className="text-sm text-gray-500 mt-1">{(t.dashboard as any)[a.descKey]}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">{t.dashboard.statistics}</h3>
          <p className="text-gray-500 text-sm">{t.dashboard.noActivity}</p>
        </div>
      </main>
    </div>
  );
}

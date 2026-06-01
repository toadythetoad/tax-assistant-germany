import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';

export default function Help() {
  const { setApp } = useApp();
  const { t } = useLanguage();

  const faqs = [
    { q: t.help.faq1q, a: t.help.faq1a },
    { q: t.help.faq2q, a: t.help.faq2a },
    { q: t.help.faq3q, a: t.help.faq3a },
    { q: t.help.faq4q, a: t.help.faq4a },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{t.help.title}</h1>
          <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">{t.help.gettingStarted}</h2>
          <p className="text-sm text-gray-600">{t.help.gettingStartedText}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">{t.help.supportedDocs}</h2>
          <p className="text-sm text-gray-600">{t.help.supportedDocsList}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">{t.help.tooltips}</h2>
          <p className="text-sm text-gray-600">{t.help.tooltipsText}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">{t.help.detailedGuide}</h2>
          <p className="text-sm text-gray-600 mb-4">{t.help.detailedGuideText}</p>
          <Button>{t.help.openGuide}</Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t.help.faq}</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-medium text-gray-900 text-sm">{faq.q}</h3>
                <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">{t.help.disclaimer}</p>
      </div>
    </div>
  );
}

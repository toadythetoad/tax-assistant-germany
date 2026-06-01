import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';

const elsterLinks = [
  { url: 'https://www.elster.de/eportal/help/main', label: 'ELSTER-Hilfeportal', desc: 'Offizielle ELSTER-Hilfe zu allen Formularen' },
  { url: 'https://www.elster.de/eportal/help/formulare', label: 'ELSTER-Formularhilfen', desc: 'Detaillierte Hilfe zu jedem Steuerformular' },
  { url: 'https://www.elster.de/eportal/help/faq', label: 'ELSTER-FAQ', desc: 'Häufig gestellte Fragen zur elektronischen Steuererklärung' },
];

export default function Help() {
  const { setApp } = useApp();
  const { t } = useLanguage();

  async function openExternal(url: string) {
    try {
      await (window as any).electronAPI?.pdf?.openExternal(url);
    } catch {
      window.open(url, '_blank');
    }
  }

  async function openGuide() {
    try {
      const path = await (window as any).electronAPI?.app?.getHelpPath();
      if (path) await (window as any).electronAPI?.pdf?.openExternal(path);
    } catch {
      // fallback
    }
  }

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
          <Button onClick={openGuide}>{t.help.openGuide}</Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">{t.help.elsterHelp}</h2>
          <p className="text-sm text-gray-600 mb-4">{t.help.elsterHelpText}</p>
          <div className="space-y-3">
            {elsterLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => openExternal(link.url)}
                className="w-full p-4 bg-blue-50 rounded-lg border border-blue-200 text-left hover:bg-blue-100 transition"
              >
                <p className="font-medium text-blue-700">{link.label}</p>
                <p className="text-sm text-blue-600 mt-1">{link.desc}</p>
              </button>
            ))}
          </div>
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

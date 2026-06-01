import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';
import { generateElsterXml } from '../utils/elsterExport';

export default function ElsterExport() {
  const { app, setApp } = useApp();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const xml = app.profile ? generateElsterXml({
    year: app.year,
    state: app.state,
    profile: app.profile,
    forms: app.forms,
  }) : null;

  async function copyXml() {
    if (!xml) return;
    try {
      await navigator.clipboard.writeText(xml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  async function downloadXml() {
    if (!xml) return;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `steuererklaerung_${app.year}_elster.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">ELSTER-Export {app.year}</h1>
            <p className="text-sm text-gray-500">{t.preview.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!xml ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-400">Bitte erstelle zuerst ein Profil.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">ELSTER-XML exportieren</h2>
              <p className="text-sm text-gray-600 mb-4">
                Diese XML-Datei enthält alle deine eingegebenen Steuerdaten und kann in das ELSTER-Portal importiert werden.
                Lade die Datei herunter und lade sie unter{' '}
                <a href="https://www.elster.de" target="_blank" rel="noopener" className="text-blue-600 hover:underline">www.elster.de</a> hoch.
              </p>
              <div className="flex gap-3">
                <Button onClick={downloadXml}>XML herunterladen</Button>
                <Button variant="secondary" onClick={copyXml}>
                  {copied ? 'Kopiert!' : 'In Zwischenablage'}
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Vorschau (XML)</span>
                <span className="text-xs text-gray-400">{xml.length.toLocaleString()} Bytes</span>
              </div>
              <pre className="p-4 text-xs font-mono text-gray-700 overflow-x-auto max-h-96 overflow-y-auto">
                {xml.slice(0, 3000)}
                {xml.length > 3000 ? '\n... (gekürzt)' : ''}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

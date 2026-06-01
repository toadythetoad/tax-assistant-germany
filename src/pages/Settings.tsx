import { useApp, useLanguage } from '../store/AppContext';
import { Button, Select } from '../components/FormComponents';
import { Language } from '../i18n';

const states = [
  { code: 'BW', de: 'Baden-Württemberg', en: 'Baden-Württemberg' },
  { code: 'BY', de: 'Bayern', en: 'Bavaria' },
  { code: 'BE', de: 'Berlin', en: 'Berlin' },
  { code: 'BB', de: 'Brandenburg', en: 'Brandenburg' },
  { code: 'HB', de: 'Bremen', en: 'Bremen' },
  { code: 'HH', de: 'Hamburg', en: 'Hamburg' },
  { code: 'HE', de: 'Hessen', en: 'Hesse' },
  { code: 'MV', de: 'Mecklenburg-Vorpommern', en: 'Mecklenburg-Western Pomerania' },
  { code: 'NI', de: 'Niedersachsen', en: 'Lower Saxony' },
  { code: 'NW', de: 'Nordrhein-Westfalen', en: 'North Rhine-Westphalia' },
  { code: 'RP', de: 'Rheinland-Pfalz', en: 'Rhineland-Palatinate' },
  { code: 'SL', de: 'Saarland', en: 'Saarland' },
  { code: 'SN', de: 'Sachsen', en: 'Saxony' },
  { code: 'ST', de: 'Sachsen-Anhalt', en: 'Saxony-Anhalt' },
  { code: 'SH', de: 'Schleswig-Holstein', en: 'Schleswig-Holstein' },
  { code: 'TH', de: 'Thüringen', en: 'Thuringia' },
];

export default function Settings() {
  const { app, setApp } = useApp();
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{t.settings.title}</h1>
          <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Select
            label={t.settings.language}
            helpKey="settings.languageHelp"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </Select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Select
            label={t.settings.state}
            helpKey="settings.stateHelp"
            value={app.state}
            onChange={(e) => setApp({ state: e.target.value })}
          >
            {states.map((s) => (
              <option key={s.code} value={s.code}>{language === 'de' ? s.de : s.en}</option>
            ))}
          </Select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t.settings.about}</h2>
          <p className="text-sm text-gray-600">{t.settings.aboutText}</p>
        </div>
      </div>
    </div>
  );
}

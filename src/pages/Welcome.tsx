import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';
import { Language } from '../i18n';

const states = [
  { code: 'BW', nameDe: 'Baden-Württemberg', nameEn: 'Baden-Württemberg' },
  { code: 'BY', nameDe: 'Bayern', nameEn: 'Bavaria' },
  { code: 'BE', nameDe: 'Berlin', nameEn: 'Berlin' },
  { code: 'BB', nameDe: 'Brandenburg', nameEn: 'Brandenburg' },
  { code: 'HB', nameDe: 'Bremen', nameEn: 'Bremen' },
  { code: 'HH', nameDe: 'Hamburg', nameEn: 'Hamburg' },
  { code: 'HE', nameDe: 'Hessen', nameEn: 'Hesse' },
  { code: 'MV', nameDe: 'Mecklenburg-Vorpommern', nameEn: 'Mecklenburg-Western Pomerania' },
  { code: 'NI', nameDe: 'Niedersachsen', nameEn: 'Lower Saxony' },
  { code: 'NW', nameDe: 'Nordrhein-Westfalen', nameEn: 'North Rhine-Westphalia' },
  { code: 'RP', nameDe: 'Rheinland-Pfalz', nameEn: 'Rhineland-Palatinate' },
  { code: 'SL', nameDe: 'Saarland', nameEn: 'Saarland' },
  { code: 'SN', nameDe: 'Sachsen', nameEn: 'Saxony' },
  { code: 'ST', nameDe: 'Sachsen-Anhalt', nameEn: 'Saxony-Anhalt' },
  { code: 'SH', nameDe: 'Schleswig-Holstein', nameEn: 'Schleswig-Holstein' },
  { code: 'TH', nameDe: 'Thüringen', nameEn: 'Thuringia' },
];

export default function Welcome() {
  const { app, setApp } = useApp();
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">€</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.app.title}</h1>
        <p className="text-gray-500 mb-8">{t.app.subtitle}</p>

        <div className="space-y-4">
          <Button className="w-full" onClick={() => setApp({ page: 'profile' })}>
            {t.welcome.startNew}
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => setApp({ page: 'dashboard' })}>
            {t.welcome.loadProfile}
          </Button>
        </div>

        <hr className="my-6" />

        <div className="space-y-3 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.welcome.selectLanguage}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.welcome.selectState}</label>
            <select
              value={app.state}
              onChange={(e) => setApp({ state: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {language === 'de' ? s.nameDe : s.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

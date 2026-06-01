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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white text-3xl font-bold">€</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.app.title}</h1>
        <p className="text-gray-500 mb-8">{t.app.subtitle}</p>

        <div className="space-y-4">
          <button
            onClick={() => setApp({ page: 'profile' })}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold 
                       hover:bg-blue-700 active:bg-blue-800 transition shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t.welcome.startNew}
          </button>
          <button
            onClick={() => setApp({ page: 'dashboard' })}
            className="w-full px-6 py-4 bg-gray-100 text-gray-700 rounded-xl text-lg font-semibold 
                       hover:bg-gray-200 active:bg-gray-300 transition
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            {t.welcome.loadProfile}
          </button>
        </div>

        <hr className="my-8" />

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.welcome.selectLanguage}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
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

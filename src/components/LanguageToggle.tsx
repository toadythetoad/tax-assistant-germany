import { useLanguage } from '../store/AppContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-white/90 backdrop-blur border border-gray-200 rounded-lg shadow-sm px-3 py-1.5 text-sm">
      <button
        className={`font-medium transition-colors ${language === 'de' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => setLanguage('de')}
      >
        DE
      </button>
      <span className="text-gray-300 select-none">|</span>
      <button
        className={`font-medium transition-colors ${language === 'en' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}

import { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '../i18n';

interface AppState {
  profile: Record<string, any> | null;
  page: string;
  year: number;
  taxReturn: Record<string, any> | null;
  taxReturns: Record<number, any>;
  forms: Record<string, any>;
  state: string;
}

interface AppContextType {
  app: AppState;
  setApp: (state: Partial<AppState>) => void;
  setForm: (key: string, data: any) => void;
  getForm: (key: string) => any;
  saveYearData: () => void;
  loadYearData: (year: number) => void;
  importFromPreviousYear: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [app, setAppState] = useState<AppState>({
    profile: null,
    page: 'welcome',
    year: 2024,
    taxReturn: null,
    taxReturns: {},
    forms: {},
    state: 'NW',
  });

  function setApp(partial: Partial<AppState>) {
    setAppState(prev => ({ ...prev, ...partial }));
  }

  // Store current year's data into taxReturns
  function saveYearData() {
    setAppState(prev => {
      const yearData = prev.taxReturns[prev.year] || {};
      return {
        ...prev,
        taxReturns: {
          ...prev.taxReturns,
          [prev.year]: {
            ...yearData,
            forms: { ...prev.forms },
            taxReturn: prev.taxReturn ? { ...prev.taxReturn } : null,
          },
        },
      };
    });
  }

  // Load data for a specific year
  function loadYearData(year: number) {
    setAppState(prev => {
      const yearData = prev.taxReturns[year];
      return {
        ...prev,
        year,
        forms: yearData?.forms ? { ...yearData.forms } : {},
        taxReturn: yearData?.taxReturn || null,
        page: 'dashboard',
      };
    });
  }

  // Copy previous year's form data to current year
  function importFromPreviousYear(): boolean {
    const prevYear = app.year - 1;
    const prevData = app.taxReturns[prevYear];
    if (!prevData?.forms) return false;
    setAppState(prev => ({
      ...prev,
      forms: { ...prevData.forms },
    }));
    return true;
  }

  function setForm(key: string, data: any) {
    setAppState(prev => ({
      ...prev,
      forms: { ...prev.forms, [key]: data },
    }));
  }

  function getForm(key: string): any {
    return app.forms[key] || null;
  }

  return (
    <AppContext.Provider value={{ app, setApp, setForm, getForm, saveYearData, loadYearData, importFromPreviousYear }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

interface LanguageContextType {
  language: Language;
  t: typeof translations.de;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('de');
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

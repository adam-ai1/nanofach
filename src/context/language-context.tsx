"use client";

import React, { createContext, useState, useEffect } from 'react';
import ar from '@/locales/ar.json';
import en from '@/locales/en.json';

export const translations = {
  en,
  ar,
};

type Language = 'en' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof en;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: en,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ar') {
      setLanguage('ar');
    }
  }, []);

  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const t = language === 'ar' ? ar : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

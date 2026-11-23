import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../utils/i18n';

interface LanguageSwitcherProps {
  darkMode: boolean;
  compact?: boolean;
  onLanguageChange?: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  darkMode,
  compact = false,
  onLanguageChange
}) => {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (lang: Language) => {
    if (lang === language) return;
    setLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  return (
    <div
      data-i18n-native="true"
      className={`inline-flex items-center p-0.5 rounded-xl border transition-colors shrink-0 ${
        darkMode
          ? 'bg-slate-800/70 border-slate-700/80'
          : 'bg-slate-100/90 border-slate-200/90 shadow-2xs'
      }`}
      role="group"
      aria-label={language === 'en' ? 'Select System Language' : 'Pilih Bahasa Sistem'}
    >
      {!compact && (
        <span
          className={`hidden sm:inline-flex items-center justify-center pl-1.5 pr-1 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
          title={language === 'en' ? 'System Language' : 'Bahasa Sistem'}
        >
          <Globe className="w-3.5 h-3.5" />
        </span>
      )}

      <button
        type="button"
        onClick={() => handleSelect('id')}
        className={`px-2 py-1 rounded-lg text-[11px] font-extrabold tracking-wide transition-all cursor-pointer ${
          language === 'id'
            ? 'dabaco-nav-active text-white shadow-xs'
            : darkMode
            ? 'text-slate-400 hover:text-white'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Bahasa Indonesia"
        aria-pressed={language === 'id'}
      >
        ID
      </button>

      <button
        type="button"
        onClick={() => handleSelect('en')}
        className={`px-2 py-1 rounded-lg text-[11px] font-extrabold tracking-wide transition-all cursor-pointer ${
          language === 'en'
            ? 'dabaco-nav-active text-white shadow-xs'
            : darkMode
            ? 'text-slate-400 hover:text-white'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="English (Enterprise)"
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  );
};

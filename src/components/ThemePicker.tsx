import React, { useState, useRef, useEffect } from 'react';
import { Palette, Sun, Moon, Check, ChevronDown } from 'lucide-react';
import { SYSTEM_THEMES, ThemeId, getThemeById } from '../utils/themes';
import { useLanguage } from '../contexts/LanguageContext';

interface ThemePickerProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  compact?: boolean;
  align?: 'left' | 'right';
}

export const ThemePicker: React.FC<ThemePickerProps> = ({
  darkMode,
  setDarkMode,
  activeTheme,
  onSelectTheme,
  compact = false,
  align = 'right'
}) => {
  const { language, tr } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentThemeObj = getThemeById(activeTheme);
  const lightThemes = SYSTEM_THEMES.filter((t) => t.mode === 'light');
  const darkThemes = SYSTEM_THEMES.filter((t) => t.mode === 'dark');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleChooseTheme = (themeId: ThemeId) => {
    onSelectTheme(themeId);
    setOpen(false);
  };

  const handleQuickModeToggle = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    onSelectTheme(nextDark ? 'midnight-dark' : 'crimson-light');
  };

  return (
    <div ref={containerRef} data-i18n-native="true" className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          compact ? 'px-2 sm:px-2.5 py-1.5' : 'px-2.5 sm:px-3 py-1.5 sm:py-2'
        } ${
          open
            ? darkMode
              ? 'bg-slate-800 border-slate-600 text-white shadow-sm'
              : 'bg-slate-100 border-slate-300 text-slate-900 shadow-xs'
            : darkMode
            ? 'bg-slate-800/75 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
        }`}
        title={tr(
          `Tema Aktif: ${currentThemeObj.name} — Klik untuk ganti tema`,
          `Active Theme: ${currentThemeObj.name} — Click to switch theme`
        )}
        aria-label={tr('Pilih Tema Sistem', 'Select System Theme')}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="relative flex items-center justify-center shrink-0">
          <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: currentThemeObj.swatches.accent }} />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900"
            style={{ backgroundColor: currentThemeObj.swatches.accent }}
          />
        </span>
        <span className="hidden md:inline text-xs font-semibold tracking-tight">
          {currentThemeObj.shortName}
        </span>
        <ChevronDown
          className={`w-3 h-3 opacity-60 transition-transform duration-200 hidden sm:inline ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-[310px] sm:w-[340px] rounded-2xl border shadow-2xl overflow-hidden z-50 transition-all ${
            darkMode
              ? 'bg-[#0f1624]/95 border-slate-700/90 text-slate-100 backdrop-blur-xl shadow-black/60'
              : 'bg-white/98 border-slate-200/95 text-slate-900 backdrop-blur-xl shadow-slate-900/15'
          }`}
        >
          {/* Popover Header */}
          <div
            className={`px-3.5 py-2.5 border-b flex items-center justify-between gap-2 ${
              darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/80'
            }`}
          >
            <div className="min-w-0">
              <p className="text-xs font-extrabold tracking-tight flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 shrink-0" style={{ color: currentThemeObj.swatches.accent }} />
                <span>{tr('Tema Tampilan Korporat', 'Corporate Theme Studio')}</span>
              </p>
              <p className={`text-[10px] truncate mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {tr(
                  'Tersinkronisasi di Beranda, Login & Dashboard',
                  'Synced across Home, Login & Workspace'
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={handleQuickModeToggle}
              className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={darkMode ? tr('Beralih ke Mode Terang', 'Switch to Light Mode') : tr('Beralih ke Mode Gelap', 'Switch to Dark Mode')}
            >
              {darkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              <span>{darkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          <div className="p-2.5 space-y-2.5 max-h-[75vh] overflow-y-auto">
            {/* Light Themes Group */}
            <div>
              <div className="px-1.5 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-500" />
                  {tr('Tema Terang (Light Mode)', 'Light Mode Themes')}
                </span>
              </div>
              <div className="space-y-1">
                {lightThemes.map((theme) => {
                  const isSelected = activeTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isSelected}
                      onClick={() => handleChooseTheme(theme.id)}
                      className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                        isSelected
                          ? darkMode
                            ? 'bg-slate-800/90 border-slate-600 shadow-xs'
                            : 'bg-slate-50 border-slate-300 shadow-xs'
                          : darkMode
                          ? 'border-transparent hover:bg-slate-800/50'
                          : 'border-transparent hover:bg-slate-50/90'
                      }`}
                      style={
                        isSelected
                          ? { borderColor: theme.swatches.accent }
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Mini UI Swatch Preview */}
                        <div
                          className="w-9 h-7 rounded-lg border overflow-hidden flex flex-col shrink-0 shadow-2xs"
                          style={{
                            backgroundColor: theme.swatches.bg,
                            borderColor: theme.swatches.border
                          }}
                        >
                          <div
                            className="h-1.5 w-full"
                            style={{
                              background: `linear-gradient(90deg, ${theme.swatches.accent}, ${theme.swatches.accentSecondary})`
                            }}
                          />
                          <div className="flex-1 flex p-0.5 gap-0.5">
                            <div
                              className="w-2.5 h-full rounded-[2px]"
                              style={{ backgroundColor: theme.swatches.sidebar, border: `1px solid ${theme.swatches.border}` }}
                            />
                            <div
                              className="flex-1 h-full rounded-[2px]"
                              style={{ backgroundColor: theme.swatches.surface, border: `1px solid ${theme.swatches.border}` }}
                            />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate flex items-center gap-1.5">
                            <span>{theme.name}</span>
                          </div>
                          <div className={`text-[10px] truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {theme.tagline} &middot; {language === 'en' ? theme.recommendedForEn : theme.recommendedFor}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: theme.swatches.accent }}
                        >
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dark Themes Group */}
            <div className={`pt-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="px-1.5 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-400" />
                  {tr('Tema Gelap (Dark Mode)', 'Dark Mode Themes')}
                </span>
              </div>
              <div className="space-y-1">
                {darkThemes.map((theme) => {
                  const isSelected = activeTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isSelected}
                      onClick={() => handleChooseTheme(theme.id)}
                      className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                        isSelected
                          ? darkMode
                            ? 'bg-slate-800/90 border-slate-600 shadow-xs'
                            : 'bg-slate-50 border-slate-300 shadow-xs'
                          : darkMode
                          ? 'border-transparent hover:bg-slate-800/50'
                          : 'border-transparent hover:bg-slate-50/90'
                      }`}
                      style={
                        isSelected
                          ? { borderColor: theme.swatches.accent }
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Mini UI Swatch Preview */}
                        <div
                          className="w-9 h-7 rounded-lg border overflow-hidden flex flex-col shrink-0 shadow-2xs"
                          style={{
                            backgroundColor: theme.swatches.bg,
                            borderColor: theme.swatches.border
                          }}
                        >
                          <div
                            className="h-1.5 w-full"
                            style={{
                              background: `linear-gradient(90deg, ${theme.swatches.accent}, ${theme.swatches.accentSecondary})`
                            }}
                          />
                          <div className="flex-1 flex p-0.5 gap-0.5">
                            <div
                              className="w-2.5 h-full rounded-[2px]"
                              style={{ backgroundColor: theme.swatches.sidebar }}
                            />
                            <div
                              className="flex-1 h-full rounded-[2px]"
                              style={{ backgroundColor: theme.swatches.surface }}
                            />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate flex items-center gap-1.5">
                            <span>{theme.name}</span>
                          </div>
                          <div className={`text-[10px] truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {theme.tagline} &middot; {language === 'en' ? theme.recommendedForEn : theme.recommendedFor}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: theme.swatches.accent }}
                        >
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

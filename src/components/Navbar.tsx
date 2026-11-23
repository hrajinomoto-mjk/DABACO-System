import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Bell,
  RefreshCw,
  Calendar,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Keyboard,
  UploadCloud,
  Database,
  ShieldCheck,
  CheckCircle2,
  Palette,
  Check
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { AlertNotification } from '../types';
import { SYSTEM_THEMES, ThemeId, getThemeById } from '../utils/themes';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../utils/i18n';

interface NavbarProps {
  activeTab: ActiveTab;
  onToggleSidebar: () => void;
  onQuickSync: () => void;
  isSyncing: boolean;
  alerts: AlertNotification[];
  onOpenAlerts: () => void;
  onOpenBulkUpload?: () => void;
  darkMode: boolean;
  setDarkMode?: (dark: boolean) => void;
  activeTheme?: ThemeId;
  onSelectTheme?: (theme: ThemeId) => void;
  onLanguageChange?: (lang: Language) => void;
  isSidebarCollapsed?: boolean;
  onLogout?: () => void;
  isAltPressed?: boolean;
  onOpenShortcutsHelp?: () => void;
  onPushToSupabase?: () => void;
  isPushingSupabase?: boolean;
  onOpenSupabase?: () => void;
  dbSyncStatus?: 'connected' | 'empty' | 'unconfigured' | 'error';
}

interface TabMeta {
  title: string;
  category: string;
  subtitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onToggleSidebar,
  onQuickSync,
  isSyncing,
  alerts,
  onOpenAlerts,
  darkMode,
  setDarkMode,
  activeTheme = (darkMode ? 'midnight-dark' : 'crimson-light') as ThemeId,
  onSelectTheme,
  onLanguageChange,
  isSidebarCollapsed = false,
  onLogout,
  isAltPressed = false,
  onOpenShortcutsHelp,
  onPushToSupabase,
  isPushingSupabase = false,
  onOpenSupabase,
  dbSyncStatus = 'connected'
}) => {
  const { language, locale, tr } = useLanguage();
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDateString(now.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [locale]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabMeta = (tab: ActiveTab): TabMeta => {
    switch (tab) {
      case 'dashboard':
        return {
          title: tr('Dashboard Operasional', 'Operational Dashboard'),
          category: tr('Strategis & Eksekutif', 'Strategic & Executive'),
          subtitle: tr('Monitoring Realisasi & Alokasi Budget Finansial', 'Financial Budget Allocation & Realization Monitoring')
        };
      case 'executive-report':
        return {
          title: tr('Laporan Manajemen Puncak', 'Top Management Report'),
          category: tr('Strategis & Eksekutif', 'Strategic & Executive'),
          subtitle: tr('Laporan Finansial Komprehensif Direksi & Efisiensi Biaya', 'Comprehensive Board Financial Report & Cost Efficiency')
        };
      case 'budget':
        return {
          title: tr('Rencana Anggaran (Budget Plan)', 'Annual Budget Plan'),
          category: tr('Keuangan Inti', 'Core Financials'),
          subtitle: tr('Target Alokasi Biaya Pelatihan & Rekrutmen', 'Training & Recruitment Cost Allocation Targets')
        };
      case 'forecast':
        return {
          title: tr('Proyeksi Anggaran (Forecast)', 'Budget Forecast'),
          category: tr('Keuangan Inti', 'Core Financials'),
          subtitle: tr('Estimasi Kebutuhan Finansial Periode Berjalan', 'Rolling Period Financial Requirement Estimates')
        };
      case 'realization':
        return {
          title: tr('Realisasi Kas Aktual', 'Actual Cash Realization'),
          category: tr('Keuangan Inti', 'Core Financials'),
          subtitle: tr('Pencatatan Transaksi & Pengeluaran Nyata', 'Transaction Ledger & Actual Expenditure Tracking')
        };
      case 'looker':
        return {
          title: tr('Analitik BI (Looker)', 'Business Intelligence (BI)'),
          category: tr('Analitik & Wawasan', 'Analytics & Insights'),
          subtitle: tr('Visualisasi Grafik Tren & Analisis Variansi', 'Trend Visualization & Variance Analytics')
        };
      case 'sheets-sync':
        return {
          title: 'Google Sheets Sync',
          category: tr('Integrasi', 'Integrations'),
          subtitle: tr('Sinkronisasi Dua Arah Data Spreadsheet Online', 'Two-Way Online Spreadsheet Synchronization')
        };
      case 'email-alerts':
        return {
          title: tr('Notifikasi Email & Monitoring', 'Email Alerts & Monitoring'),
          category: tr('Sistem Peringatan Dini', 'Early Warning System'),
          subtitle: tr('Notifikasi Otomatis Ambang Batas Pengeluaran', 'Automated Expenditure Threshold Notifications')
        };
      case 'users':
        return {
          title: tr('Manajemen Pengguna', 'User Management'),
          category: tr('Tata Kelola & Keamanan', 'Governance & Security'),
          subtitle: tr('Hak Akses Akun & Otorisasi Finansial', 'Account Access Control & Financial Authorization')
        };
      case 'banking':
        return {
          title: tr('Integrasi Rekening Bank', 'Corporate Banking Integration'),
          category: tr('Perbendaharaan Korporat', 'Corporate Treasury'),
          subtitle: tr('Koneksi Rekening Operasional & Arus Kas', 'Operational Account & Cashflow Connectivity')
        };
      case 'supabase':
        return {
          title: 'Supabase Database Backend',
          category: tr('Infrastruktur Cloud', 'Cloud Infrastructure'),
          subtitle: tr('Penyimpanan Terpusat, RLS & Cadangan Data', 'Centralized Storage, RLS & Data Backup')
        };
      case 'settings':
        return {
          title: tr('Pengaturan Sistem', 'System Settings'),
          category: tr('Konfigurasi', 'Configuration'),
          subtitle: tr('Preferensi Aplikasi, Parameter & Keamanan', 'Application Preferences, Policy & Security')
        };
      default:
        return {
          title: tr('Sistem Pengendalian Anggaran', 'Budget Control System'),
          category: tr('Sistem DABACO', 'DABACO System'),
          subtitle: 'PT Ajinomoto Indonesia'
        };
    }
  };

  const meta = getTabMeta(activeTab);
  const unreadAlerts = alerts.filter(a => a.severity === 'danger' || a.severity === 'warning');
  const currentThemeObj = getThemeById(activeTheme);
  const lightThemes = SYSTEM_THEMES.filter(t => t.mode === 'light');
  const darkThemes = SYSTEM_THEMES.filter(t => t.mode === 'dark');

  return (
    <header
      data-i18n-native="true"
      className={`fixed top-0 right-0 left-0 ${
        isSidebarCollapsed ? 'lg:left-20' : 'lg:left-72'
      } z-30 border-b backdrop-blur-md transition-all duration-300 ease-in-out dabaco-navbar ${
        darkMode
          ? 'bg-[#090d16]/95 border-slate-800/80 text-white'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Seamless Top Accent Line matching Sidebar */}
      <div className="h-1 w-full dabaco-top-accent" />

      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2.5 md:gap-4">

        {/* ========================================================= */}
        {/* LEFT ZONE: Mobile Menu + Single-Line Clean Title & Badge  */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 overflow-hidden">
          {/* Mobile Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className={`lg:hidden p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              darkMode
                ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Context & Title Block */}
          <div className="min-w-0 flex items-center gap-2 sm:gap-2.5 overflow-hidden">
            <h1 className={`text-base sm:text-lg lg:text-xl font-black tracking-tight truncate shrink-0 max-w-[200px] sm:max-w-[300px] md:max-w-none ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {meta.title}
            </h1>

            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-md border whitespace-nowrap dabaco-badge-accent">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse dabaco-dot-accent" />
                {tr('Pabrik Mojokerto', 'Mojokerto Factory')}
              </span>
              <span className="hidden 2xl:inline text-slate-300 dark:text-slate-700 font-normal">|</span>
              <span className={`hidden 2xl:inline text-xs font-medium truncate max-w-[150px] ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {meta.category}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT ZONE: Structured Action Groups, Utilities & Profile */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* GROUP 1: Cloud & Data Sync Operations */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Live Sync Status & Trigger Pill */}
            <button
              onClick={onQuickSync}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 relative ${
                isSyncing
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 cursor-wait'
                  : isAltPressed
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 ring-2 ring-amber-400/40'
                  : darkMode
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-emerald-50/80 border-emerald-200/80 text-emerald-700 hover:bg-emerald-100'
              }`}
              title={tr('Sinkronisasi data dengan Google Sheets & Database (Ctrl+S)', 'Sync data with Google Sheets & Database (Ctrl+S)')}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-500 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="font-bold hidden sm:inline">
                {isSyncing ? tr('Menyinkronkan...', 'Syncing...') : tr('Tersinkronisasi', 'Live Synced')}
              </span>
              {isAltPressed && (
                <span className="hidden sm:inline-block px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-xs animate-bounce">
                  Ctrl+S
                </span>
              )}
            </button>

            {/* Supabase Push & Database Quick Action */}
            {onPushToSupabase && (
              <button
                onClick={onPushToSupabase}
                disabled={isPushingSupabase}
                className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isPushingSupabase
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400 cursor-wait'
                    : darkMode
                    ? 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-emerald-500/40 hover:text-emerald-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-500/40 hover:text-emerald-600 shadow-2xs'
                }`}
                title={tr('Push seluruh data budget, forecast, dan realisasi ke Supabase', 'Push all budget, forecast, and realization datasets to Supabase')}
              >
                <UploadCloud className={`w-3.5 h-3.5 text-emerald-500 shrink-0 ${isPushingSupabase ? 'animate-bounce' : ''}`} />
                <span>{isPushingSupabase ? tr('Mengunggah...', 'Pushing...') : 'Push DB'}</span>
              </button>
            )}

            {/* Supabase Status Pill */}
            {onOpenSupabase && (
              <button
                onClick={onOpenSupabase}
                className={`hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  dbSyncStatus === 'connected'
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500 hover:bg-emerald-500/20'
                    : dbSyncStatus === 'empty'
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-500 hover:bg-amber-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title={tr('Status Supabase Database. Klik untuk membuka konfigurasi Supabase.', 'Supabase Database status. Click to open Supabase settings.')}
              >
                <Database className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>
                  {dbSyncStatus === 'connected'
                    ? 'Cloud DB'
                    : dbSyncStatus === 'empty'
                    ? tr('DB Kosong', 'Empty DB')
                    : 'Database'}
                </span>
              </button>
            )}
          </div>

          {/* Enterprise ID | EN Language Switcher */}
          <LanguageSwitcher darkMode={darkMode} onLanguageChange={onLanguageChange} />

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* GROUP 2: Utility Cluster (Shortcuts, Multi-Theme Picker, Quick Mode Toggle, Notifications) */}
          <div className={`inline-flex items-center p-0.5 rounded-xl border ${
            darkMode
              ? 'bg-slate-800/60 border-slate-700/70'
              : 'bg-slate-100/80 border-slate-200/90 shadow-2xs'
          }`}>

            {/* Keyboard Shortcuts Cheatsheet Button */}
            {onOpenShortcutsHelp && (
              <button
                onClick={onOpenShortcutsHelp}
                className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer relative ${
                  darkMode
                    ? 'hover:bg-slate-700/70 text-slate-300 hover:text-amber-400'
                    : 'hover:bg-white text-slate-600 hover:text-amber-600 hover:shadow-2xs'
                }`}
                title={tr('Panduan Pintasan Keyboard (Tekan ?)', 'Keyboard Shortcuts Guide (Press ?)')}
              >
                <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400" />
                {isAltPressed && (
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm animate-bounce">
                    ?
                  </span>
                )}
              </button>
            )}

            {/* Professional Multi-Theme Picker Popover */}
            {onSelectTheme && (
              <div className="relative" ref={themeDropdownRef}>
                <button
                  onClick={() => {
                    setThemeDropdownOpen(prev => !prev);
                    setUserDropdownOpen(false);
                  }}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer relative flex items-center gap-1 ${
                    themeDropdownOpen
                      ? darkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-slate-900 shadow-2xs'
                      : darkMode
                      ? 'hover:bg-slate-700/70 text-slate-300 hover:text-white'
                      : 'hover:bg-white text-slate-700 hover:shadow-2xs'
                  }`}
                  title={tr(
                    `Tema Aktif: ${currentThemeObj.name} — Klik untuk ganti tema`,
                    `Active Theme: ${currentThemeObj.name} — Click to switch theme`
                  )}
                  aria-label={tr('Pilih Tema Tampilan', 'Choose Interface Theme')}
                >
                  <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span
                    className="w-2 h-2 rounded-full ring-1 ring-black/15 dark:ring-white/30 shrink-0"
                    style={{ backgroundColor: currentThemeObj.swatches.accent }}
                  />
                </button>

                {themeDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2.5 w-80 sm:w-[340px] rounded-2xl border shadow-2xl p-3 z-50 transition-all animate-in fade-in zoom-in-95 duration-150 ${
                      darkMode
                        ? 'bg-[#0f1422] border-slate-700/90 text-white shadow-black/70'
                        : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                      <div>
                        <p className="text-xs font-extrabold tracking-tight flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5" style={{ color: currentThemeObj.swatches.accent }} />
                          <span>{tr('Tema Tampilan Sistem', 'System Visual Themes')}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {tr('Aktif:', 'Active:')} <span className="font-bold">{currentThemeObj.name}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md dabaco-badge-accent border">
                        {SYSTEM_THEMES.length} {tr('Konsep', 'Themes')}
                      </span>
                    </div>

                    {/* Light Themes Group */}
                    <div className="mb-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-1.5 flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-500" />
                        {tr('Mode Terang (Light)', 'Light Mode')}
                      </p>
                      <div className="space-y-1">
                        {lightThemes.map(theme => {
                          const isSelected = activeTheme === theme.id;
                          return (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() => {
                                onSelectTheme(theme.id);
                                setThemeDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? darkMode
                                    ? 'bg-white/10 border-white/25'
                                    : 'bg-slate-100/90 border-slate-300 shadow-2xs'
                                  : darkMode
                                  ? 'border-transparent hover:bg-white/5'
                                  : 'border-transparent hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="w-9 h-7 rounded-lg border overflow-hidden flex shrink-0 shadow-2xs"
                                  style={{ backgroundColor: theme.swatches.bg, borderColor: theme.swatches.border }}
                                >
                                  <div className="w-2.5 h-full" style={{ backgroundColor: theme.swatches.sidebar, borderRight: `1px solid ${theme.swatches.border}` }} />
                                  <div className="flex-1 flex flex-col">
                                    <div className="h-1.5 w-full" style={{ backgroundColor: theme.swatches.accent }} />
                                    <div className="flex-1 p-1 flex items-center gap-0.5">
                                      <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: theme.swatches.accent }} />
                                      <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: theme.swatches.accentSecondary }} />
                                    </div>
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold leading-tight truncate">{theme.name}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    {theme.tagline} &bull; {language === 'en' ? theme.recommendedForEn : theme.recommendedFor}
                                  </p>
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
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-1.5 flex items-center gap-1">
                        <Moon className="w-3 h-3 text-indigo-400" />
                        {tr('Mode Gelap (Dark)', 'Dark Mode')}
                      </p>
                      <div className="space-y-1">
                        {darkThemes.map(theme => {
                          const isSelected = activeTheme === theme.id;
                          return (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() => {
                                onSelectTheme(theme.id);
                                setThemeDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? darkMode
                                    ? 'bg-white/10 border-white/25'
                                    : 'bg-slate-100/90 border-slate-300 shadow-2xs'
                                  : darkMode
                                  ? 'border-transparent hover:bg-white/5'
                                  : 'border-transparent hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="w-9 h-7 rounded-lg border overflow-hidden flex shrink-0 shadow-2xs"
                                  style={{ backgroundColor: theme.swatches.bg, borderColor: theme.swatches.border }}
                                >
                                  <div className="w-2.5 h-full" style={{ backgroundColor: theme.swatches.sidebar, borderRight: `1px solid ${theme.swatches.border}` }} />
                                  <div className="flex-1 flex flex-col">
                                    <div className="h-1.5 w-full" style={{ backgroundColor: theme.swatches.accent }} />
                                    <div className="flex-1 p-1 flex items-center gap-0.5">
                                      <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: theme.swatches.accent }} />
                                      <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: theme.swatches.accentSecondary }} />
                                    </div>
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold leading-tight truncate">{theme.name}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    {theme.tagline} &bull; {language === 'en' ? theme.recommendedForEn : theme.recommendedFor}
                                  </p>
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
                )}
              </div>
            )}

            {/* Quick Dark / Light Mode Switcher */}
            {setDarkMode && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer relative ${
                  darkMode
                    ? 'hover:bg-slate-700/70 text-amber-400'
                    : 'hover:bg-white text-slate-700 hover:shadow-2xs'
                }`}
                title={
                  darkMode
                    ? tr('Beralih ke Mode Terang (Ctrl+D)', 'Switch to Light Mode (Ctrl+D)')
                    : tr('Beralih ke Mode Gelap (Ctrl+D)', 'Switch to Dark Mode (Ctrl+D)')
                }
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                {isAltPressed && (
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm animate-bounce">
                    ^D
                  </span>
                )}
              </button>
            )}

            {/* Notifications Alert Button */}
            <button
              onClick={onOpenAlerts}
              className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer relative ${
                darkMode
                  ? 'hover:bg-slate-700/70 text-slate-300 hover:text-white'
                  : 'hover:bg-white text-slate-600 hover:text-slate-900 hover:shadow-2xs'
              }`}
              title={tr('Lihat peringatan anggaran (Alt+8)', 'View budget alerts (Alt+8)')}
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs animate-pulse">
                  {unreadAlerts.length}
                </span>
              )}
              {isAltPressed && (
                <span className="absolute -bottom-1 -left-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm animate-bounce">
                  ^8
                </span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden xl:block" />

          {/* GROUP 3: Live Clock & Date */}
          <div className="hidden xl:flex flex-col items-end text-right justify-center shrink-0">
            <span className="font-mono tabular-nums font-bold text-xs leading-none text-slate-800 dark:text-slate-200">
              {timeString || '00:00:00'}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 leading-none">
              <Calendar className="w-2.5 h-2.5 opacity-70" />
              {dateString || 'Mon, 14 Sep 2026'}
            </span>
          </div>

          {/* GROUP 4: User Profile & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setThemeDropdownOpen(false);
              }}
              className={`flex items-center gap-2 p-1 sm:pl-2 rounded-xl transition-all cursor-pointer border ${
                darkMode
                  ? 'border-transparent hover:border-slate-700 hover:bg-slate-800/80'
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-100/90'
              }`}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl dabaco-avatar-accent text-white font-black text-xs flex items-center justify-center shadow-xs">
                  A
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#090d16]" />
              </div>

              <div className="hidden xl:block text-left text-xs leading-tight">
                <p className="font-bold text-slate-800 dark:text-white">Admin HR</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">HR Controller</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl p-2 z-50 transition-all animate-in fade-in zoom-in-95 duration-150 ${
                darkMode ? 'bg-[#0f1422] border-slate-800 text-white shadow-black/60' : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'
              }`}>
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: currentThemeObj.swatches.accent }}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    PT Ajinomoto Indonesia
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">HR Administrator</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">paajinomoto@gmail.com</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {tr('Sesi Aktif • Role Controller', 'Active Session • Controller Role')}
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{tr('Keluar / Ganti Akun', 'Sign Out / Switch Account')}</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

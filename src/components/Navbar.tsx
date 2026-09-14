import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Bell,
  RefreshCw,
  Calendar,
  Upload,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Keyboard,
  UploadCloud,
  Database,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { AlertNotification } from '../types';
import { AjinomotoLogo } from './AjinomotoLogo';

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
  onOpenBulkUpload,
  darkMode,
  setDarkMode,
  onLogout,
  isAltPressed = false,
  onOpenShortcutsHelp,
  onPushToSupabase,
  isPushingSupabase = false,
  onOpenSupabase,
  dbSyncStatus = 'connected'
}) => {
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateString(now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabMeta = (tab: ActiveTab): TabMeta => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Dashboard Operasional',
          category: 'Strategic & Executive',
          subtitle: 'Monitoring Realisasi & Alokasi Budget Finansial'
        };
      case 'executive-report':
        return {
          title: 'Top Management Report',
          category: 'Strategic & Executive',
          subtitle: 'Laporan Finansial Komprehensif Direksi & Efisiensi Biaya'
        };
      case 'budget':
        return {
          title: 'Rencana Anggaran (Budget Plan)',
          category: 'Core Financials',
          subtitle: 'Target Alokasi Biaya Pelatihan & Rekrutmen'
        };
      case 'forecast':
        return {
          title: 'Proyeksi Anggaran (Forecast)',
          category: 'Core Financials',
          subtitle: 'Estimasi Kebutuhan Finansial Periode Berjalan'
        };
      case 'realization':
        return {
          title: 'Realisasi Kas Aktual',
          category: 'Core Financials',
          subtitle: 'Pencatatan Transaksi & Pengeluaran Nyata'
        };
      case 'looker':
        return {
          title: 'Business Intelligence (BI)',
          category: 'Analytics & Insights',
          subtitle: 'Visualisasi Grafik Tren & Analisis Variansi'
        };
      case 'sheets-sync':
        return {
          title: 'Google Sheets Sync',
          category: 'Integrations',
          subtitle: 'Sinkronisasi Dua Arah Data Spreadsheet Online'
        };
      case 'email-alerts':
        return {
          title: 'Email Alerts & Monitoring',
          category: 'Early Warning System',
          subtitle: 'Notifikasi Otomatis Ambang Batas Pengeluaran'
        };
      case 'users':
        return {
          title: 'Manajemen Pengguna',
          category: 'Governance & Security',
          subtitle: 'Hak Akses Akun & Otorisasi Finansial'
        };
      case 'banking':
        return {
          title: 'Integrasi Rekening Bank',
          category: 'Corporate Treasury',
          subtitle: 'Koneksi Rekening Operasional & Arus Kas'
        };
      case 'supabase':
        return {
          title: 'Supabase Database Backend',
          category: 'Cloud Infrastructure',
          subtitle: 'Penyimpanan Terpusat, RLS & Cadangan Data'
        };
      case 'settings':
        return {
          title: 'Pengaturan Sistem',
          category: 'Configuration',
          subtitle: 'Preferensi Aplikasi, Parameter & Keamanan'
        };
      default:
        return {
          title: 'Sistem Pengendalian Anggaran',
          category: 'DABACO System',
          subtitle: 'PT Ajinomoto Indonesia'
        };
    }
  };

  const meta = getTabMeta(activeTab);
  const unreadAlerts = alerts.filter(a => a.severity === 'danger' || a.severity === 'warning');

  return (
    <header className={`sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3 border-b backdrop-blur-md transition-colors duration-200 ${
      darkMode
        ? 'bg-[#090d16]/90 border-slate-800/80 text-white'
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="flex items-center justify-between gap-3 md:gap-4">
        
        {/* ========================================================= */}
        {/* LEFT ZONE: Mobile Menu + Single-Line Clean Title & Badge  */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 min-w-0">
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
          <div className="min-w-0 flex items-center gap-2 sm:gap-2.5">
            <h1 className={`text-base sm:text-lg lg:text-xl font-black tracking-tight whitespace-nowrap ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {meta.title}
            </h1>

            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                Mojokerto Factory
              </span>
              <span className="text-slate-300 dark:text-slate-700 font-normal">|</span>
              <span className={`text-xs font-medium truncate max-w-[130px] lg:max-w-[200px] ${
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
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* GROUP 1: Cloud & Data Sync Operations */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Live Sync Status & Trigger Pill */}
            <button
              onClick={onQuickSync}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap relative ${
                isSyncing
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 cursor-wait'
                  : isAltPressed
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 ring-2 ring-amber-400/40'
                  : darkMode
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-emerald-50/80 border-emerald-200/80 text-emerald-700 hover:bg-emerald-100'
              }`}
              title="Sinkronisasi data dengan Google Sheets & Database (Ctrl+S)"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-500 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="font-bold">
                {isSyncing ? 'Syncing...' : 'Live Synced'}
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
                className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  isPushingSupabase
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400 cursor-wait'
                    : darkMode
                    ? 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-emerald-500/40 hover:text-emerald-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-500/40 hover:text-emerald-600 shadow-2xs'
                }`}
                title="Push seluruh data budget, forecast, dan realisasi ke Supabase"
              >
                <UploadCloud className={`w-3.5 h-3.5 text-emerald-500 shrink-0 ${isPushingSupabase ? 'animate-bounce' : ''}`} />
                <span>{isPushingSupabase ? 'Pushing...' : 'Push DB'}</span>
              </button>
            )}

            {/* Supabase Status Pill */}
            {onOpenSupabase && (
              <button
                onClick={onOpenSupabase}
                className={`hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  dbSyncStatus === 'connected'
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500 hover:bg-emerald-500/20'
                    : dbSyncStatus === 'empty'
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-500 hover:bg-amber-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Status Supabase Database. Klik untuk membuka konfigurasi Supabase."
              >
                <Database className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>
                  {dbSyncStatus === 'connected' ? 'Cloud DB' : dbSyncStatus === 'empty' ? 'DB Kosong' : 'Database'}
                </span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* GROUP 2: Utility Cluster (Shortcuts, Theme Toggle, Notifications) */}
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
                title="Panduan Pintasan Keyboard (Tekan ?)"
              >
                <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400" />
                {isAltPressed && (
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm animate-bounce">
                    ?
                  </span>
                )}
              </button>
            )}

            {/* Dark / Light Mode Switcher */}
            {setDarkMode && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer relative ${
                  darkMode
                    ? 'hover:bg-slate-700/70 text-amber-400'
                    : 'hover:bg-white text-slate-700 hover:shadow-2xs'
                }`}
                title={darkMode ? 'Beralih ke Tampilan Terang (Ctrl+D)' : 'Beralih ke Tampilan Gelap (Ctrl+D)'}
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
              title="Lihat peringatan anggaran (Alt+8)"
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
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

          {/* GROUP 3: Live Clock & Date */}
          <div className="hidden md:flex flex-col items-end text-right justify-center">
            <span className="font-mono tabular-nums font-bold text-xs leading-none text-slate-800 dark:text-slate-200">
              {timeString || '00:00:00'}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 leading-none">
              <Calendar className="w-2.5 h-2.5 opacity-70" />
              {dateString || 'Senin, 14 Sep 2026'}
            </span>
          </div>

          {/* GROUP 4: User Profile & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`flex items-center gap-2 p-1 sm:pl-2 rounded-xl transition-all cursor-pointer border ${
                darkMode
                  ? 'border-transparent hover:border-slate-700 hover:bg-slate-800/80'
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-100/90'
              }`}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
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
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    PT Ajinomoto Indonesia
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">HR Administrator</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">paajinomoto@gmail.com</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Sesi Aktif &bull; Role Controller
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
                    <span>Keluar / Ganti Akun</span>
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


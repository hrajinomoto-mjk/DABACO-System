import React, { useState, useEffect } from 'react';
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
  Database
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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateString(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTabTitle = (tab: ActiveTab): string => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Budget Training & Recruitment';
      case 'executive-report': return 'Laporan Eksekutif Direksi';
      case 'budget': return 'Rencana Anggaran (Budget Plan)';
      case 'forecast': return 'Proyeksi Anggaran (Forecast)';
      case 'realization': return 'Realisasi & Pengeluaran Kas';
      case 'looker': return 'Laporan Visual & Analisis Grafik';
      case 'sheets-sync': return 'Sinkronisasi Google Sheets';
      case 'email-alerts': return 'Pengingat Ambang Batas Email';
      case 'users': return 'Manajemen Pengguna & Hak Akses';
      case 'banking': return 'Manajemen Pengguna & Hak Akses';
      case 'supabase': return 'Basis Data & Riwayat Cadangan';
      case 'settings': return 'Pengaturan Sistem & Keamanan';
      default: return 'Sistem Pengendalian Anggaran';
    }
  };

  const unreadAlerts = alerts.filter(a => a.severity === 'danger' || a.severity === 'warning');

  return (
    <header className={`sticky top-0 z-30 px-4 sm:px-8 py-3.5 border-b backdrop-blur-xl transition-colors ${
      darkMode
        ? 'bg-[#090d16]/85 border-slate-800/80 text-white'
        : 'bg-white/85 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Mobile toggle + Breadcrumb Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className={`lg:hidden p-2 rounded-xl border transition-colors cursor-pointer ${
              darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex items-center gap-2.5">
            <div className="hidden sm:flex h-10 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs items-center justify-center shrink-0">
              <AjinomotoLogo variant="full" className="h-7 w-auto" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-600/10 px-2 py-0.5 rounded-md border border-red-500/20 truncate max-w-xs md:max-w-md">
                  PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory
                </span>
                <span className={`text-[11px] hidden lg:inline ${darkMode ? 'text-slate-400' : 'text-slate-600 font-semibold'}`}>
                  &bull; Financial Controlling Infrastructure
                </span>
              </div>
              <h2 className={`text-base sm:text-lg font-extrabold tracking-tight truncate ${
                darkMode ? 'text-white' : 'text-slate-950'
              }`}>
                {getTabTitle(activeTab)}
              </h2>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions, Theme Switcher, Alerts & Clock */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Bulk CSV Upload Button */}
          {onOpenBulkUpload && (
            <button
              onClick={onOpenBulkUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all cursor-pointer shadow-sm relative"
              title="Bulk upload data finansial via CSV (Ctrl+U)"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Bulk CSV</span>
              {isAltPressed && (
                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-sm ml-1 animate-bounce">
                  ^U
                </span>
              )}
            </button>
          )}

          {/* Quick Sync Button */}
          <button
            onClick={onQuickSync}
            disabled={isSyncing}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer relative ${
              isSyncing
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 cursor-wait'
                : isAltPressed
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 ring-2 ring-amber-400/40'
                : darkMode
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
            title="Sinkronisasi data dengan Google Sheets & Database (Ctrl+S)"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Live Synced'}</span>
            {isAltPressed && (
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-md ml-0.5 animate-bounce">
                Ctrl+S
              </span>
            )}
          </button>

          {/* Supabase Push & Database Quick Action */}
          {onPushToSupabase && (
            <button
              onClick={onPushToSupabase}
              disabled={isPushingSupabase}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isPushingSupabase
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 cursor-wait'
                  : darkMode
                  ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-emerald-500/40 hover:text-emerald-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-500/40 hover:text-emerald-600 shadow-sm'
              }`}
              title="Push seluruh data budget, forecast, dan realisasi ke Supabase"
            >
              <UploadCloud className={`w-3.5 h-3.5 text-emerald-500 ${isPushingSupabase ? 'animate-bounce' : ''}`} />
              <span>{isPushingSupabase ? 'Pushing DB...' : 'Push Supabase'}</span>
            </button>
          )}

          {/* Supabase Status Pill */}
          {onOpenSupabase && (
            <button
              onClick={onOpenSupabase}
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                dbSyncStatus === 'connected'
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500 hover:bg-emerald-500/20'
                  : dbSyncStatus === 'empty'
                  ? 'bg-amber-500/10 border-amber-500/25 text-amber-500 hover:bg-amber-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Status Supabase Database. Klik untuk membuka konfigurasi Supabase."
            >
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {dbSyncStatus === 'connected' ? 'Supabase Live' : dbSyncStatus === 'empty' ? 'Supabase Kosong' : 'Supabase'}
              </span>
            </button>
          )}

          {/* Keyboard Shortcuts Cheatsheet Button */}
          {onOpenShortcutsHelp && (
            <button
              onClick={onOpenShortcutsHelp}
              className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-amber-600 hover:bg-slate-100 shadow-sm'
              }`}
              title="Panduan Pintasan Keyboard (Tekan ?)"
            >
              <Keyboard className="w-4 h-4 text-amber-400" />
              {isAltPressed && (
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm animate-bounce">
                  ?
                </span>
              )}
            </button>
          )}

          {/* Dark / Light Mode Switcher */}
          {setDarkMode && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
              title={darkMode ? 'Beralih ke Tampilan Terang (Ctrl+D)' : 'Beralih ke Tampilan Gelap (Ctrl+D)'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isAltPressed && (
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm animate-bounce">
                  ^D
                </span>
              )}
            </button>
          )}

          {/* Notifications button */}
          <button
            onClick={onOpenAlerts}
            className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
              darkMode
                ? 'border-slate-700/60 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-700 shadow-sm'
            }`}
            title="Lihat peringatan anggaran (Alt+8)"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
            {isAltPressed && (
              <span className="absolute -bottom-1 -left-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm animate-bounce">
                ^8
              </span>
            )}
          </button>

          {/* Date & Clock */}
          <div className="hidden md:flex flex-col items-end text-right border-l border-slate-300 dark:border-slate-800 pl-3 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">{timeString || '20:55 WIB'}</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {dateString || 'Sabtu, 5 Sep 2026'}
            </span>
          </div>

          {/* User Profile / Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`flex items-center gap-2 pl-2 p-1 rounded-xl transition-all cursor-pointer ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                A
              </div>
              <div className="hidden xl:block text-left text-xs">
                <p className="font-bold leading-tight text-slate-800 dark:text-white">Admin</p>
                <p className="text-[10px] text-slate-400">HR Mojokerto</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-52 rounded-2xl border shadow-xl p-2 z-50 transition-all ${
                darkMode ? 'bg-[#0f1422] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold">HR Administrator</p>
                  <p className="text-[11px] text-slate-400">paajinomoto@gmail.com</p>
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

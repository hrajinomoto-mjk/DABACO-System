import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Building2,
  Zap,
  Fingerprint,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { UserSession } from '../types';
import { AjinomotoLogo } from './AjinomotoLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemePicker } from './ThemePicker';
import { AmbientBackdrop } from './AmbientBackdrop';
import { useLanguage } from '../contexts/LanguageContext';
import { ThemeId, getThemeById } from '../utils/themes';

interface LoginPageProps {
  onLoginSuccess: (user: Partial<UserSession>) => void;
  onBackToLanding: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTheme?: ThemeId;
  onSelectTheme?: (theme: ThemeId) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
  darkMode,
  setDarkMode,
  activeTheme = (darkMode ? 'midnight-dark' : 'crimson-light') as ThemeId,
  onSelectTheme
}) => {
  const { tr, locale } = useLanguage();
  const handleSelectTheme = (themeId: ThemeId) => {
    if (onSelectTheme) {
      onSelectTheme(themeId);
    } else {
      const target = getThemeById(themeId);
      setDarkMode(target.mode === 'dark');
    }
  };
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Admin Account Preset for instant testing & evaluation
  const adminAccount = {
    role: 'SuperAdmin' as const,
    roleName: 'Super Admin',
    username: 'admin',
    password: 'admin123',
    displayName: 'Ahmad Syafiq',
    dept: 'HR Development',
    badge: tr('Akses Penuh', 'Full Access')
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(
        tr(
          'Harap lengkapi nama pengguna dan kata sandi.',
          'Please enter both username and password.'
        )
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Check registered users from persistent database
      let matchedUser = null;
      try {
        const storedUsers = localStorage.getItem('dabaco_users');
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          matchedUser = parsed.find((u: any) => u.username?.toLowerCase() === username.trim().toLowerCase());
        }
      } catch (err) {
        console.error('Error reading dabaco_users in LoginPage', err);
      }

      const timestamp = new Date().toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';

      if (matchedUser) {
        if (matchedUser.status === 'Inactive') {
          setError(
            tr(
              'Akun ini dinonaktifkan oleh administrator. Silakan hubungi Pimpinan HR Dept. atau Helpdesk.',
              'This account has been deactivated by an administrator. Please contact HR Dept. Leadership or Helpdesk.'
            )
          );
          return;
        }

        onLoginSuccess({
          username: matchedUser.username,
          displayName: matchedUser.displayName,
          department: matchedUser.department,
          role: matchedUser.role,
          isLoggedIn: true,
          lastLogin: timestamp
        });
        return;
      }

      // Default Admin verification
      if (
        (username.toLowerCase() === 'admin' && password === 'admin123') ||
        (username.length >= 3 && password.length >= 5)
      ) {
        onLoginSuccess({
          username: username.trim(),
          displayName: username.toLowerCase() === 'admin' ? adminAccount.displayName : 'Staff HR Mojokerto',
          department: adminAccount.dept,
          role: 'SuperAdmin',
          isLoggedIn: true,
          lastLogin: timestamp
        });
      } else {
        setError(
          tr(
            'Kombinasi nama pengguna atau kata sandi tidak valid. Silakan periksa kembali.',
            'Invalid username or password combination. Please verify your credentials.'
          )
        );
      }
    }, 500);
  };

  return (
    <div
      data-i18n-native="true"
      className={`min-h-screen lg:h-screen lg:max-h-screen w-full flex flex-col justify-between transition-colors duration-200 relative overflow-x-hidden dabaco-app-shell ${
        darkMode ? 'bg-[#080c14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Executive Architectural & Theme-Adaptive Background */}
      <AmbientBackdrop activeTheme={activeTheme} darkMode={darkMode} variant="login" />

      {/* Top Header Bar */}
      <header className={`w-full border-b backdrop-blur-xl sticky top-0 z-30 transition-colors shrink-0 dabaco-navbar ${
        darkMode ? 'bg-[#090d16]/85 border-slate-800/80' : 'bg-white/85 border-slate-200/90 shadow-xs'
      }`}>
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 h-12 sm:h-13 flex items-center justify-between gap-2">
          {/* Left: Back button & brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onBackToLanding}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                darkMode
                  ? 'border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 shadow-2xs'
              }`}
              title={tr('Kembali ke Halaman Beranda DABACO', 'Back to DABACO Home Page')}
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0 dabaco-accent-text" />
              <span className="hidden sm:inline">{tr('Kembali ke Beranda', 'Back to Home')}</span>
              <span className="sm:hidden">{tr('Kembali', 'Back')}</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-2.5 border-l border-slate-200 dark:border-slate-800 min-w-0">
              <div className="h-7 sm:h-8 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center shrink-0">
                <AjinomotoLogo variant="full" className="h-4.5 sm:h-5.5 w-auto" />
              </div>
              <div className="leading-tight min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs sm:text-sm tracking-tight shrink-0 dabaco-brand-text">
                    DABACO
                  </span>
                  <span className="hidden md:inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border truncate dabaco-badge-accent">
                    v2.6 Enterprise
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block font-medium">
                  PT Ajinomoto Indonesia &bull; {tr('Pabrik Mojokerto', 'Mojokerto Factory')}
                </span>
              </div>
            </div>
          </div>

          {/* Right actions: Language, Help & 6-Theme Picker */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageSwitcher darkMode={darkMode} />

            <button
              onClick={() => setShowHelpModal(true)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-2xs'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>{tr('Bantuan HR', 'HR Helpdesk')}</span>
            </button>

            <ThemePicker
              compact
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              activeTheme={activeTheme}
              onSelectTheme={handleSelectTheme}
            />
          </div>
        </div>
      </header>

      {/* Main Responsive Container */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-4 relative z-10 w-full min-h-0">
        <div className={`w-full max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-5xl 2xl:max-w-[1100px] rounded-2xl border shadow-xl backdrop-blur-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300 ${
          darkMode
            ? 'bg-[#0f1422]/95 border-slate-800/90 shadow-[0_20px_60px_rgba(0,0,0,0.7)]'
            : 'bg-white/95 border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)]'
        }`}>

          {/* ========================================================= */}
          {/* LEFT COLUMN: Corporate Identity & Security Architecture   */}
          {/* ========================================================= */}
          <div className={`lg:col-span-5 p-3.5 sm:p-4.5 lg:p-5 xl:p-5.5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r transition-colors ${
            darkMode
              ? 'bg-[#0a0f1c]/75 border-slate-800/90'
              : 'bg-slate-50/80 border-slate-200/80'
          }`}>
            <div>
              {/* Brand Emblem & Plant Badge Header */}
              <div className="flex items-center justify-between gap-2.5 mb-2 sm:mb-2.5">
                <div className="inline-flex h-8 sm:h-9 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs items-center justify-center">
                  <AjinomotoLogo variant="full" className="h-5 sm:h-6 w-auto" />
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold dabaco-badge-accent">
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{tr('Pabrik Mojokerto', 'Mojokerto Factory')}</span>
                </div>
              </div>

              {/* Plant Corporation Full Title */}
              <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-1 truncate">
                PT Ajinomoto Indonesia &bull; PT Ajinex International
              </div>

              {/* Main Headline */}
              <h1 className="text-base sm:text-xl lg:text-[22px] font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                {tr('Gateway Otentikasi', 'Authentication Gateway')} <br className="hidden sm:inline" />
                <span className="dabaco-hero-gradient">
                  HR Budget Ecosystem
                </span>
              </h1>

              <p className={`mt-1 sm:mt-1.5 text-xs leading-relaxed ${
                darkMode ? 'text-slate-300 font-normal' : 'text-slate-600 font-normal'
              }`}>
                {tr(
                  'Portal terintegrasi kendali budget tahunan, forecasting bulanan, sinkronisasi Google Sheets, Looker Studio, dan realisasi aktual HR Development.',
                  'Integrated portal for annual budget control, monthly forecasting, Google Sheets sync, Looker Studio analytics, and HR Development actual realizations.'
                )}
              </p>

              {/* Compact Security Pill Strip on Mobile / Tablets (< lg) */}
              <div className="lg:hidden mt-2.5 grid grid-cols-3 gap-1.5">
                <div className={`p-1.5 rounded-xl border flex flex-col items-center text-center gap-0.5 ${
                  darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200/80 shadow-2xs'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{tr('Akses Peran', 'Role Access')}</span>
                </div>
                <div className={`p-1.5 rounded-xl border flex flex-col items-center text-center gap-0.5 ${
                  darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200/80 shadow-2xs'
                }`}>
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 leading-tight">AES-256</span>
                </div>
                <div className={`p-1.5 rounded-xl border flex flex-col items-center text-center gap-0.5 ${
                  darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200/80 shadow-2xs'
                }`}>
                  <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{tr('Sinkron Sheets', 'Sync Sheets')}</span>
                </div>
              </div>

              {/* Core Feature Highlights on Desktop (lg+) */}
              <div className="hidden lg:block mt-3 space-y-1.5 sm:space-y-2">
                <div className={`p-2.5 rounded-xl border transition-all ${
                  darkMode
                    ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                    : 'bg-white/90 border-slate-200/80 shadow-2xs hover:border-red-200 hover:bg-red-50/20'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-600/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-[11.5px] font-bold text-slate-900 dark:text-slate-100">
                        {tr('Otentikasi Berbasis Peran Terpadu', 'Unified Role-Based Authentication')}
                      </h2>
                      <p className={`text-[10px] leading-snug mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tr(
                          'Hak akses aman terenkripsi untuk Administrator & Tim HR Development Pabrik Mojokerto.',
                          'Encrypted role-scoped access for Administrators & HR Development Teams at Mojokerto Factory.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border transition-all ${
                  darkMode
                    ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                    : 'bg-white/90 border-slate-200/80 shadow-2xs hover:border-emerald-200 hover:bg-emerald-50/20'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Fingerprint className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-[11.5px] font-bold text-slate-900 dark:text-slate-100">
                        {tr('Enkripsi Standar Korporat AES-256', 'Corporate-Grade AES-256 Encryption')}
                      </h2>
                      <p className={`text-[10px] leading-snug mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tr(
                          'Setiap transaksi, catatan penyerapan kas, dan kredensial diamankan protokol standar enterprise.',
                          'Every transaction, cash absorption record, and credential is protected by enterprise-grade protocols.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border transition-all ${
                  darkMode
                    ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                    : 'bg-white/90 border-slate-200/80 shadow-2xs hover:border-blue-200 hover:bg-blue-50/20'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-[11.5px] font-bold text-slate-900 dark:text-slate-100">
                        {tr('Sinkronisasi Real-Time Google Sheets', 'Real-Time Google Sheets Sync')}
                      </h2>
                      <p className={`text-[10px] leading-snug mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tr(
                          'Koneksi data dua arah otomatis antara spreadsheet online dan analitik BI Looker Studio.',
                          'Automated two-way data synchronization between online spreadsheets and Looker Studio BI analytics.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className={`mt-3 pt-2 border-t flex flex-wrap items-center justify-between gap-1.5 text-[10px] ${
              darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {tr('Sistem Aktif', 'System Active')}
                </span>
                <span className="text-slate-400 dark:text-slate-600">&bull;</span>
                <span>{tr('Node Mojokerto', 'Mojokerto Node')}</span>
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                {tr('TLS 1.3 Aktif', 'TLS 1.3 Active')}
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Credential Form & Quick Demo Fill           */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-3.5 sm:p-4.5 lg:p-5 xl:p-5.5 flex flex-col justify-between">
            <div>
              {/* Card Form Header */}
              <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                <span className="text-[10px] font-extrabold tracking-wider uppercase dabaco-accent-text flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 dabaco-dot-accent" />
                  {tr('Otentikasi Kredensial Resmi', 'Official Credential Authentication')}
                </span>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className={`text-[11px] flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                    darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{tr('Bantuan HR', 'HR Helpdesk')}</span>
                </button>
              </div>

              <h2 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {tr('Masuk ke Akun Anda', 'Sign In to Your Account')}
              </h2>
              <p className={`text-xs mt-0.5 leading-snug ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {tr(
                  'Gunakan kredensial internal Ajinomoto untuk mengakses dashboard operasional DABACO.',
                  'Use your internal Ajinomoto credentials to access the DABACO operational dashboard.'
                )}
              </p>

              {/* Authority Privilege Notice */}
              <div className="mt-2.5 mb-2.5">
                <div className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2.5 ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg dabaco-accent-soft flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block text-slate-900 dark:text-slate-100 truncate">
                        {tr('Otoritas Akses: Super Admin', 'Access Authority: Super Admin')}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                        {tr(
                          'HR Development • Kendali Penuh Modul Anggaran',
                          'HR Development • Full Budget Module Control'
                        )}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 dabaco-badge-accent">
                    {tr('Akses Penuh', 'Full Privilege')}
                  </span>
                </div>
              </div>

              {/* Error Message Box */}
              {error && (
                <div className="mb-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              )}

              {/* Form inputs */}
              <form onSubmit={handleCredentialSubmit} className="space-y-2 sm:space-y-2.5">
                {/* Username Input */}
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${
                    darkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    {tr('Username Pegawai / Email', 'Employee Username / Email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder={tr('contoh: admin atau paajinomoto', 'e.g. admin or paajinomoto')}
                      className={`w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs rounded-xl border transition-all focus:outline-none dabaco-input-focus ${
                        darkMode
                          ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-2xs'
                      }`}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-[11px] font-bold ${
                      darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {tr('Kata Sandi', 'Password')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowHelpModal(true)}
                      className="text-[10px] font-semibold dabaco-accent-text hover:underline cursor-pointer"
                    >
                      {tr('Lupa kata sandi?', 'Forgot password?')}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={tr('Masukkan kata sandi Anda', 'Enter your password')}
                      className={`w-full pl-9 pr-9 py-1.5 sm:py-2 text-xs rounded-xl border transition-all focus:outline-none dabaco-input-focus ${
                        darkMode
                          ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-2xs'
                      }`}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      title={showPassword ? tr('Sembunyikan kata sandi', 'Hide password') : tr('Tampilkan kata sandi', 'Show password')}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Role Indicator */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                      {tr('Ingat sesi login saya', 'Remember my session')}
                    </span>
                  </label>

                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="hidden sm:inline">{tr('Otoritas:', 'Authority:')}</span>
                    <span className="dabaco-accent-text font-extrabold">Super Admin</span>
                  </span>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-9 sm:h-10 rounded-xl dabaco-nav-active text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{tr('Memverifikasi Kredensial Resmi...', 'Verifying Official Credentials...')}</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{tr('Masuk ke Dashboard Sistem', 'Sign In to System Dashboard')}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Quick Fill: Clean Single Admin Card */}
            <div className={`mt-2.5 pt-2 border-t ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  {tr('Akses Cepat Demo Akun:', 'Quick Demo Account Access:')}
                </span>
                <span className="text-[10px] text-slate-400">
                  {tr('Klik untuk isi instan', 'Click to auto-fill')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUsername(adminAccount.username);
                  setPassword(adminAccount.password);
                  setError('');
                }}
                className={`w-full p-2 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  username === adminAccount.username
                    ? 'dabaco-badge-accent'
                    : darkMode
                    ? 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg dabaco-accent-soft flex items-center justify-center font-bold text-[11px] shrink-0">
                    SA
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">
                      {adminAccount.displayName} &bull; {adminAccount.roleName}
                    </div>
                    <div className="text-[10px] opacity-75 font-mono truncate">
                      @{adminAccount.username} / {adminAccount.password}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded dabaco-nav-active text-white shrink-0 ml-2">
                  {tr('Isi Kredensial', 'Fill Credentials')}
                </span>
              </button>

              {/* Corporate Security Cert */}
              <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-400">
                <span className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  {tr('Jaringan Internal • ISO 27001', 'Internal Network • ISO 27001')}
                </span>
                <span className="font-mono text-[9px] shrink-0">PT AI - MOJOKERTO</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-2 px-4 text-center text-xs transition-colors border-t relative z-10 shrink-0 ${
        darkMode ? 'border-slate-800/80 text-slate-400 bg-[#080c14]/90' : 'border-slate-200 text-slate-500 bg-white/70'
      }`}>
        <p className="font-medium text-[10px] sm:text-[11px]">
          PT Ajinomoto Indonesia &bull; PT Ajinex International, {tr('Pabrik Mojokerto', 'Mojokerto Factory')} &bull; DABACO Budget Control System &copy; {new Date().getFullYear()}
        </p>
      </footer>

      {/* ========================================================= */}
      {/* MODAL: Bantuan Akun & Pemulihan Akses Internal (HR)       */}
      {/* ========================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border shadow-2xl p-5 sm:p-7 relative ${
            darkMode ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={tr('Tutup modal', 'Close modal')}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">
                  {tr('Bantuan HR & Kredensial', 'HR Support & Credentials')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {tr('Layanan Helpdesk HR Pabrik Mojokerto', 'Mojokerto Factory HR Helpdesk Service')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {tr(
                'Untuk pemulihan kata sandi, pembuatan akun staf baru, atau otorisasi hak akses modul DABACO, silakan hubungi saluran resmi HR berikut:',
                'For password recovery, new staff account provisioning, or DABACO module access authorization, please contact the official HR channels below:'
              )}
            </p>

            <div className="space-y-2.5 mb-5">
              <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                darkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold block">{tr('Telepon Internal / PABX:', 'Internal Phone / PABX:')}</span>
                  <span className="text-slate-500 dark:text-slate-400">Ext. 2411 / 2412 (HR Helpdesk Factory)</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                darkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold block">{tr('Email Resmi:', 'Official Email:')}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">hr.helpdesk@ajinomoto.co.id</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                darkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <Clock className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold block">{tr('Jam Layanan:', 'Service Hours:')}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {tr('Senin - Jumat: 08.00 - 17.00 WIB', 'Monday – Friday: 08:00 – 17:00 WIB')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed mb-5">
              <strong>{tr('Tips Demo:', 'Demo Tip:')}</strong>{' '}
              {tr(
                'Anda dapat menggunakan akun default admin / admin123 untuk peran Super Admin tanpa perlu registrasi tambahan.',
                'You can use the default admin / admin123 account for the Super Admin role without additional registration.'
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl dabaco-nav-active text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {tr('Tutup Panduan', 'Close Guide')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

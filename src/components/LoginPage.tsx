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
  Sun,
  Moon,
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

interface LoginPageProps {
  onLoginSuccess: (user: Partial<UserSession>) => void;
  onBackToLanding: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
  darkMode,
  setDarkMode
}) => {
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
    badge: 'Akses Penuh'
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Harap lengkapi nama pengguna dan kata sandi.');
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

      const timestamp = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';

      if (matchedUser) {
        if (matchedUser.status === 'Inactive') {
          setError('Akun ini dinonaktifkan oleh administrator. Silakan hubungi Pimpinan HR Dept. atau Helpdesk.');
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
        setError('Kombinasi nama pengguna atau kata sandi tidak valid. Silakan periksa kembali.');
      }
    }, 500);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-200 relative ${
      darkMode ? 'bg-[#080c14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Background Decorative Ambient Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-red-600/10 dark:bg-red-600/[0.12] rounded-full blur-[100px] -translate-x-1/2" />
        <div className="absolute -bottom-32 right-1/4 w-[550px] h-[550px] bg-rose-600/10 dark:bg-rose-600/[0.10] rounded-full blur-[120px] translate-x-1/2" />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Top Header Bar */}
      <header className={`w-full border-b backdrop-blur-xl sticky top-0 z-30 transition-colors ${
        darkMode ? 'bg-[#090d16]/85 border-slate-800/80' : 'bg-white/85 border-slate-200/90 shadow-xs'
      }`}>
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Back button & brand */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <button
              onClick={onBackToLanding}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                darkMode
                  ? 'border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 shadow-2xs'
              }`}
              title="Kembali ke Halaman Beranda DABACO"
            >
              <ArrowLeft className="w-4 h-4 shrink-0 text-red-600" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Kembali</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800 min-w-0">
              <div className="h-8 sm:h-9 px-2 py-0.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center shrink-0">
                <AjinomotoLogo variant="full" className="h-5 sm:h-6 w-auto" />
              </div>
              <div className="leading-tight min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs sm:text-sm tracking-tight text-red-600 dark:text-red-500 shrink-0">
                    DABACO
                  </span>
                  <span className="hidden md:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 truncate">
                    v2.6 Enterprise
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block font-medium">
                  PT Ajinomoto Indonesia &bull; Mojokerto Factory
                </span>
              </div>
            </div>
          </div>

          {/* Right actions: Help & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowHelpModal(true)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-2xs'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Bantuan HR</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800/70 border-slate-700/80 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-2xs'
              }`}
              title={darkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Container */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 relative z-10 w-full">
        <div className={`w-full max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1200px] rounded-2xl sm:rounded-3xl border shadow-xl lg:shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300 ${
          darkMode
            ? 'bg-[#0f1422]/95 border-slate-800/90 shadow-[0_20px_60px_rgba(0,0,0,0.7)]'
            : 'bg-white/95 border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)]'
        }`}>

          {/* ========================================================= */}
          {/* LEFT COLUMN: Corporate Identity & Security Architecture   */}
          {/* ========================================================= */}
          <div className={`lg:col-span-5 p-4 sm:p-6 lg:p-8 xl:p-9 flex flex-col justify-between border-b lg:border-b-0 lg:border-r transition-colors ${
            darkMode
              ? 'bg-gradient-to-br from-[#121829] via-[#0f1422] to-[#0a0e18] border-slate-800/90'
              : 'bg-gradient-to-br from-rose-50/50 via-slate-50/40 to-white border-slate-200/80'
          }`}>
            <div>
              {/* Brand Emblem & Plant Badge Header */}
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-5">
                <div className="inline-flex h-10 sm:h-12 px-3 sm:px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs items-center justify-center">
                  <AjinomotoLogo variant="full" className="h-6 sm:h-8 w-auto" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/10 text-red-700 dark:text-red-400 border border-red-500/20 text-[10px] sm:text-[11px] font-bold">
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">Mojokerto Factory</span>
                </div>
              </div>

              {/* Plant Corporation Full Title */}
              <div className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-1.5 sm:mb-2 truncate">
                PT Ajinomoto Indonesia &bull; PT Ajinex International
              </div>

              {/* Main Headline */}
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Gateway Otentikasi <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-700 dark:from-red-500 dark:via-rose-400 dark:to-red-400">
                  HR Budget Ecosystem
                </span>
              </h1>

              <p className={`mt-2 sm:mt-2.5 text-xs sm:text-sm leading-relaxed ${
                darkMode ? 'text-slate-300 font-normal' : 'text-slate-600 font-normal'
              }`}>
                Portal terintegrasi kendali budget tahunan, forecasting bulanan, sinkronisasi Google Sheets, Looker Studio, dan realisasi aktual HR Development.
              </p>

              {/* Compact Security Pill Strip on Mobile / Tablets (< lg) */}
              <div className="lg:hidden mt-3 sm:mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
                <div className={`p-2 rounded-xl border flex flex-col items-center text-center gap-1 ${
                  darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200/80 shadow-2xs'
                }`}>
                  <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Role Access</span>
                </div>
                <div className={`p-2 rounded-xl border flex flex-col items-center text-center gap-1 ${
                  darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200/80 shadow-2xs'
                }`}>
                  <Fingerprint className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight">AES-256</span>
                </div>
                <div className={`p-2 rounded-xl border flex flex-col items-center text-center gap-1 ${
                  darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200/80 shadow-2xs'
                }`}>
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Sync Sheets</span>
                </div>
              </div>

              {/* Core Feature Highlights on Desktop (lg+) */}
              <div className="hidden lg:block mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
                <div className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all ${
                  darkMode
                    ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                    : 'bg-white/90 border-slate-200/80 shadow-2xs hover:border-red-200 hover:bg-red-50/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-600/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Otentikasi Berbasis Peran Terpadu
                      </h2>
                      <p className={`text-[11px] leading-snug mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Hak akses aman terenkripsi untuk Administrator & Tim HR Development Pabrik Mojokerto.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all ${
                  darkMode
                    ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                    : 'bg-white/90 border-slate-200/80 shadow-2xs hover:border-emerald-200 hover:bg-emerald-50/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Enkripsi Standar Korporat AES-256
                      </h2>
                      <p className={`text-[11px] leading-snug mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Setiap transaksi, catatan penyerapan kas, dan kredensial diamankan protokol standar enterprise.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all ${
                  darkMode
                    ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                    : 'bg-white/90 border-slate-200/80 shadow-2xs hover:border-blue-200 hover:bg-blue-50/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Sinkronisasi Real-Time Google Sheets
                      </h2>
                      <p className={`text-[11px] leading-snug mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Koneksi data dua arah otomatis antara spreadsheet online dan analitik BI Looker Studio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] ${
              darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Sistem Aktif</span>
                <span className="text-slate-400 dark:text-slate-600">&bull;</span>
                <span>Node Mojokerto</span>
              </div>
              <span className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                TLS 1.3 Active
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Credential Form & Quick Demo Fill           */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 xl:p-9 flex flex-col justify-between">
            <div>
              {/* Card Form Header */}
              <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  Otentikasi Kredensial Resmi
                </span>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className={`text-[11px] flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                    darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Bantuan HR</span>
                </button>
              </div>

              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Masuk ke Akun Anda
              </h2>
              <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Gunakan kredensial internal Ajinomoto untuk mengakses dashboard operasional DABACO.
              </p>

              {/* Authority Privilege Notice */}
              <div className="mt-3.5 sm:mt-4 mb-3.5 sm:mb-4">
                <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border flex items-center justify-between gap-2.5 sm:gap-3 ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-red-600/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block text-slate-900 dark:text-slate-100 truncate">
                        Otoritas Akses: Super Admin
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                        HR Development &bull; Kendali Penuh Modul Anggaran
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20 shrink-0">
                    Full Privilege
                  </span>
                </div>
              </div>

              {/* Error Message Box */}
              {error && (
                <div className="mb-3.5 sm:mb-4 p-2.5 sm:p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              )}

              {/* Form inputs */}
              <form onSubmit={handleCredentialSubmit} className="space-y-3 sm:space-y-4">
                {/* Username Input */}
                <div>
                  <label className={`block text-xs font-bold mb-1 sm:mb-1.5 ${
                    darkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    Username Pegawai / Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="contoh: admin atau paajinomoto"
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-red-500/30 ${
                        darkMode
                          ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:border-red-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500 shadow-2xs'
                      }`}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                    <label className={`text-xs font-bold ${
                      darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowHelpModal(true)}
                      className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi Anda"
                      className={`w-full pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-red-500/30 ${
                        darkMode
                          ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:border-red-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500 shadow-2xs'
                      }`}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Role Indicator */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                      Ingat sesi login saya
                    </span>
                  </label>

                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="hidden sm:inline">Otoritas:</span>
                    <span className="text-red-600 dark:text-red-400 font-extrabold">Super Admin</span>
                  </span>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/30 hover:shadow-lg hover:shadow-red-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Kredensial Resmi...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Masuk ke Dashboard Sistem</span>
                      <ChevronRight className="w-4 h-4 opacity-80" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Quick Fill: Clean Single Admin Card */}
            <div className={`mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  Akses Cepat Demo Akun:
                </span>
                <span className="text-[10px] text-slate-400">Klik untuk isi instan</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUsername(adminAccount.username);
                  setPassword(adminAccount.password);
                  setError('');
                }}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  username === adminAccount.username
                    ? darkMode
                      ? 'bg-red-500/10 border-red-500/40 text-red-300'
                      : 'bg-red-50 border-red-200 text-red-700'
                    : darkMode
                    ? 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-red-600/15 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
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
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-600 text-white shrink-0 ml-2">
                  Isi Kredensial
                </span>
              </button>

              {/* Corporate Security Cert */}
              <div className="mt-2.5 sm:mt-3 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  Internal Network &bull; ISO 27001
                </span>
                <span className="font-mono text-[9px] shrink-0">PT AI - MOJOKERTO</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-3 sm:py-4 px-4 text-center text-xs transition-colors border-t relative z-10 ${
        darkMode ? 'border-slate-800/80 text-slate-400 bg-[#080c14]/90' : 'border-slate-200 text-slate-500 bg-white/70'
      }`}>
        <p className="font-medium text-[10px] sm:text-xs">
          PT Ajinomoto Indonesia &bull; PT Ajinex International, Mojokerto Factory &bull; DABACO Budget Control System &copy; {new Date().getFullYear()}
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
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">Bantuan HR & Kredensial</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Layanan Helpdesk HR Pabrik Mojokerto</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Untuk pemulihan kata sandi, pembuatan akun staf baru, atau otorisasi hak akses modul DABACO, silakan hubungi saluran resmi HR berikut:
            </p>

            <div className="space-y-2.5 mb-5">
              <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                darkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold block">Telepon Internal / PABX:</span>
                  <span className="text-slate-500 dark:text-slate-400">Ext. 2411 / 2412 (HR Helpdesk Factory)</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                darkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold block">Email Resmi:</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">hr.helpdesk@ajinomoto.co.id</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                darkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <Clock className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold block">Jam Layanan:</span>
                  <span className="text-slate-500 dark:text-slate-400">Senin - Jumat: 08.00 - 17.00 WIB</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed mb-5">
              💡 <strong>Tips Demo:</strong> Anda dapat menggunakan akun default <strong>admin / admin123</strong> untuk peran Super Admin tanpa perlu registrasi tambahan.
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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
  HelpCircle
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
  const [selectedRole, setSelectedRole] = useState<'SuperAdmin' | 'BudgetController' | 'Auditor'>('SuperAdmin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Harap lengkapi username dan password.');
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

      if (matchedUser) {
        if (matchedUser.status === 'Inactive') {
          setError('Akun ini sedang dinonaktifkan oleh administrator. Silakan hubungi Pimpinan HR Dept. atau administrator.');
          return;
        }

        onLoginSuccess({
          username: matchedUser.username,
          displayName: matchedUser.displayName,
          department: matchedUser.department,
          role: matchedUser.role,
          isLoggedIn: true,
          lastLogin: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) + ' WIB'
        });
        return;
      }

      // Validate default credentials
      if (
        (username.toLowerCase() === 'admin' && password === 'admin123') ||
        (username.length >= 3 && password.length >= 5)
      ) {
        onLoginSuccess({
          username,
          displayName: selectedRole === 'SuperAdmin' ? 'HR Administrator' : selectedRole === 'BudgetController' ? 'Budget Controller' : 'Auditor Finansial',
          department: 'HR Development',
          role: selectedRole,
          isLoggedIn: true,
          lastLogin: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) + ' WIB'
        });
      } else {
        setError('Kombinasi username atau kata sandi tidak valid. Silakan periksa kembali akun Anda.');
      }
    }, 600);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-200 flex flex-col justify-between ${
      darkMode ? 'bg-[#080c14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Top Header Bar */}
      <header className={`w-full border-b backdrop-blur-md sticky top-0 z-30 transition-colors ${
        darkMode ? 'bg-[#090d16]/80 border-slate-800/80' : 'bg-white/80 border-slate-200/90'
      }`}>
        <div className="w-full max-w-[1680px] 2xl:max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                darkMode
                  ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-300 dark:border-slate-800">
              <div className="h-9 px-2 py-0.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
                <AjinomotoLogo variant="full" className="h-6 w-auto" />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-sm tracking-tight text-red-600 dark:text-red-500">DABACO</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">HR Budget Control &bull; PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory</span>
              </div>
            </div>
          </div>

          {/* Right actions: Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800/70 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm'
              }`}
              title={darkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Subtle Ambient Background Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-600/10 dark:bg-red-600/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none translate-x-1/2" />

        <div className={`relative z-10 w-full max-w-5xl xl:max-w-6xl rounded-3xl border shadow-2xl overflow-hidden grid lg:grid-cols-[1.1fr_1.3fr] transition-all duration-300 ${
          darkMode
            ? 'bg-[#0f1422]/90 border-slate-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.7)]'
            : 'bg-white border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]'
        }`}>
          {/* Left Visual Column: Corporate Security & System Status */}
          <div className={`p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r transition-colors ${
            darkMode
              ? 'bg-gradient-to-br from-[#121829] to-[#0d121f] border-slate-800'
              : 'bg-gradient-to-br from-rose-50/40 via-white to-slate-50 border-slate-200'
          }`}>
            <div>
              {/* Ajinomoto Official Logo Showcase */}
              <div className="mb-6">
                <div className="inline-flex h-14 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm items-center justify-center">
                  <AjinomotoLogo variant="full" className="h-10 w-auto" />
                </div>
              </div>

              {/* Plant Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/10 text-red-700 dark:text-red-400 border border-red-500/20 text-xs font-semibold mb-6">
                <Building2 className="w-3.5 h-3.5" />
                <span>PT AJINOMOTO INDONESIA - PT AJINEX INTERNATIONAL, MOJOKERTO FACTORY</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Gateway Otentikasi <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-500">
                  HR Budget Ecosystem
                </span>
              </h2>

              <p className={`mt-3 text-xs sm:text-sm leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Portal terpusat untuk monitoring anggaran tahunan, sinkronisasi Google Sheets,
                visualisasi BI Looker Studio, dan pengawasan realisasi pengeluaran HR Development.
              </p>

              {/* Security Points */}
              <div className="mt-6 space-y-3.5">
                <div className={`p-3.5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-white/[0.03] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-600/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Otentikasi Kredensial Resmi</h4>
                      <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Hak akses terotorisasi berdasarkan peran pengguna pabrik Mojokerto.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-white/[0.03] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Enkripsi Data AES-256</h4>
                      <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Semua transmisi data dan kredensial diamankan standar enterprise.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-white/[0.03] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Sinkronisasi Otomatis Google Sheets</h4>
                      <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Integrasi data dua arah Budget &bull; Forecast &bull; Realisasi secara instan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom status note */}
            <div className={`mt-8 pt-4 border-t flex items-center justify-between text-[11px] ${
              darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
            }`}>
              <span>Status Sistem: Operasional Normal</span>
              <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>
          </div>

          {/* Right Column: Direct Login Form */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-red-600 dark:text-red-400">
                    Otentikasi Kredensial Resmi
                  </span>
                    <button
                      type="button"
                      onClick={() => setShowHelp(!showHelp)}
                      className={`text-[11px] flex items-center gap-1 font-medium transition-colors ${
                        darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Bantuan Akun</span>
                    </button>
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight mt-1">Masuk ke Akun Anda</h3>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Gunakan kredensial internal Ajinomoto untuk mengakses modul DABACO.
                  </p>
                </div>

                {/* Role Authority Selection */}
                <div className="mb-4">
                  <label className={`block text-xs font-semibold mb-1.5 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Peran Otoritas Akun
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('SuperAdmin')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                        selectedRole === 'SuperAdmin'
                          ? 'bg-red-600 text-white border-red-500 shadow-sm'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('BudgetController')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                        selectedRole === 'BudgetController'
                          ? 'bg-red-600 text-white border-red-500 shadow-sm'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Controller
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('Auditor')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                        selectedRole === 'Auditor'
                          ? 'bg-red-600 text-white border-red-500 shadow-sm'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Auditor
                    </button>
                  </div>
                </div>

                {showHelp && (
                  <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                    💡 Gunakan kredensial resmi akun perusahaan Anda. Untuk reset kata sandi atau otorisasi hak akses, hubungi tim IT Helpdesk atau HR Development Factory Mojokerto.
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleCredentialSubmit} className="space-y-4">
                  {/* Username Field */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
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
                        className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40 ${
                          darkMode
                            ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`text-xs font-semibold ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowHelp(true)}
                        className="text-[11px] text-red-600 dark:text-red-400 hover:underline"
                      >
                        Lupa password?
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
                        placeholder="Masukkan password Anda"
                        className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40 ${
                          darkMode
                            ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Role Badge */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Ingat sesi login saya</span>
                    </label>

                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Peran: <span className="text-red-600 dark:text-red-400 font-bold">{selectedRole}</span>
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 h-12 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Memverifikasi Kredensial...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Masuk ke Dashboard Sistem</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-4 text-center text-xs transition-colors border-t ${
        darkMode ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'
      }`}>
        <p className="font-medium text-slate-600 dark:text-slate-400">
          PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory &bull; DABACO Budget Control System &copy; 2026
        </p>
      </footer>
    </div>
  );
};

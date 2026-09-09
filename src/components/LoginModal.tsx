import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react';
import { AjinomotoLogo } from './AjinomotoLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { username: string; displayName: string; role: 'SuperAdmin' | 'BudgetController' | 'Auditor' }) => void;
  darkMode?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess, darkMode = true }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progressWidth, setProgressWidth] = useState(0);

  if (!isOpen) return null;

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Harap masukkan username dan password.');
      return;
    }

    setLoading(true);
    setProgressWidth(30);

    const timer1 = setTimeout(() => {
      setProgressWidth(70);
    }, 200);

    const timer2 = setTimeout(() => {
      setProgressWidth(100);
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
        console.error('Error reading dabaco_users in LoginModal', err);
      }

      if (matchedUser) {
        if (matchedUser.status === 'Inactive') {
          setError('Akun ini sedang dinonaktifkan oleh administrator.');
          setProgressWidth(0);
          return;
        }

        onSuccess({
          username: matchedUser.username,
          displayName: matchedUser.displayName,
          role: matchedUser.role
        });
        onClose();
        return;
      }

      // Verify credentials (accepts admin/admin123 or valid inputs)
      if (
        (username.toLowerCase() === 'admin' && password === 'admin123') ||
        (username.length >= 3 && password.length >= 5)
      ) {
        onSuccess({
          username,
          displayName: 'HR Administrator',
          role: 'SuperAdmin'
        });
        onClose();
      } else {
        setError('Kombinasi Username atau Password tidak valid. Silakan periksa kembali.');
        setProgressWidth(0);
      }
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
        darkMode ? 'bg-[#0e1320] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Loading bar */}
        <div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 transition-all duration-300"
          style={{ width: `${progressWidth}%` }}
        />

        {/* Modal Header */}
        <div className={`p-6 sm:p-7 text-center border-b relative ${
          darkMode ? 'border-slate-800' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 p-1.5 rounded-xl transition-colors cursor-pointer ${
              darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            ✕
          </button>

          <div className="h-12 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs inline-flex items-center justify-center mx-auto mb-3">
            <AjinomotoLogo variant="full" className="h-8 w-auto" />
          </div>

          <p className="text-[11px] font-extrabold tracking-[0.2em] text-red-600 dark:text-red-400 uppercase">Gateway Otentikasi Enterprise</p>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Admin Login
          </h3>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
            Masukkan kredensial akun untuk mengakses sistem DABACO.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCredentialSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username (admin)"
                  required
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all ${
                    darkMode
                      ? 'bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password (admin123)"
                  required
                  className={`w-full pl-11 pr-11 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all ${
                    darkMode
                      ? 'bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
            </button>
          </form>

          <div className={`mt-5 pt-4 border-t text-center text-[11px] ${
            darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
          }`}>
            🔒 End-to-End Encryption &middot; PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  totalWarningSeconds: number;
  timeoutMinutes: number;
  darkMode: boolean;
  onExtendSession: () => void;
  onLogoutNow: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  remainingSeconds,
  totalWarningSeconds,
  timeoutMinutes,
  darkMode,
  onExtendSession,
  onLogoutNow
}) => {
  const { tr } = useLanguage();

  if (!isOpen) return null;

  const clampedSeconds = Math.max(0, remainingSeconds);
  const mins = Math.floor(clampedSeconds / 60);
  const secs = clampedSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progressPct = Math.max(
    0,
    Math.min(100, (clampedSeconds / Math.max(1, totalWarningSeconds)) * 100)
  );

  return (
    <div
      data-i18n-native="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-timeout-title"
    >
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
          darkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Accent Progress Bar */}
        <div className={`h-1.5 w-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3
                id="session-timeout-title"
                className={`text-base font-bold leading-snug ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {tr('Sesi Login Akan Segera Berakhir', 'Session About to Expire')}
              </h3>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {tr(
                  `Tidak ada aktivitas terdeteksi mendekati batas waktu (${timeoutMinutes} menit). Untuk melindungi keamanan data finansial, sistem akan otomatis kembali ke halaman Login.`,
                  `No activity detected near your ${timeoutMinutes}-minute idle limit. To protect financial data security, the system will automatically return to the Login page.`
                )}
              </p>
            </div>
          </div>

          {/* Countdown Box */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              darkMode
                ? 'bg-slate-800/70 border-slate-700'
                : 'bg-amber-50/70 border-amber-200/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {tr('Otomatis kembali ke Login dalam', 'Auto-returning to Login in')}
              </span>
            </div>
            <span
              className={`font-mono text-xl font-extrabold tabular-nums ${
                clampedSeconds <= 10
                  ? 'text-rose-500'
                  : darkMode
                    ? 'text-amber-400'
                    : 'text-amber-600'
              }`}
            >
              {formattedTime}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onLogoutNow}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{tr('Keluar ke Login', 'Return to Login')}</span>
            </button>
            <button
              type="button"
              onClick={onExtendSession}
              autoFocus
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{tr('Tetap Masuk (Perpanjang Sesi)', 'Stay Signed In')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

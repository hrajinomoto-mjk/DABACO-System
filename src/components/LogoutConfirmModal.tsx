import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  darkMode?: boolean;
  userName?: string;
  userRole?: string;
  department?: string;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  darkMode = false,
  userName = 'Admin Controller',
  userRole = 'Financial Administrator',
  department = 'HR Development'
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        {/* Darkened backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden z-10 transition-colors ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/90'
              : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
          }`}
        >
          {/* Top Brand Decorative Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

          <div className="p-6 sm:p-7">
            {/* Top Close Button & Icon Row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3.5">
                {/* Glowing Icon Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/15 via-rose-500/10 to-orange-500/15 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-red-600 dark:text-rose-400 shadow-inner">
                    <LogOut className="w-7 h-7" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white">
                    <AlertTriangle className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900">
                    <Lock className="w-2.5 h-2.5" />
                    Keamanan Sesi Pengguna
                  </span>
                  <h3
                    id="logout-modal-title"
                    className={`text-lg sm:text-xl font-black tracking-tight mt-1 ${
                      darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    Konfirmasi Keluar Sesi
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-xl transition-colors ${
                  darkMode
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }`}
                aria-label="Batal dan tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Card */}
            <div
              className={`p-3.5 rounded-2xl border mb-4 flex items-center gap-3 transition-colors ${
                darkMode
                  ? 'bg-slate-800/60 border-slate-700/80'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
                HR
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-xs font-black truncate ${
                      darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {userName}
                  </p>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {userRole} &bull; {department}
                </p>
              </div>
            </div>

            {/* Description Paragraph */}
            <p
              className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Apakah Anda yakin ingin mengakhiri sesi kerja saat ini? Sesi Anda akan ditutup dengan aman dan Anda akan diarahkan kembali ke Landing Page.
            </p>

            {/* Safety Assurance Points */}
            <div
              className={`space-y-2 p-3 rounded-2xl border text-xs ${
                darkMode
                  ? 'bg-slate-800/40 border-slate-800 text-slate-300'
                  : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Seluruh transaksi dan data budget telah tersimpan</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Token autentikasi lokal akan dihapus secara bersih</span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                Tetap di Sistem
              </button>

              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-lg shadow-red-600/30 hover:shadow-red-600/50 flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ya, Keluar Sesi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Trash2,
  X,
  HelpCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export type AlertType = 'error' | 'warning' | 'info' | 'success' | 'confirm' | 'delete';

export interface SystemAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  detail?: string;
  type?: AlertType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  itemData?: {
    label?: string;
    value?: string;
    subValue?: string;
  };
  darkMode?: boolean;
}

export const SystemAlertModal: React.FC<SystemAlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  detail,
  type = 'info',
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  onConfirm,
  itemData,
  darkMode = false
}) => {
  if (!isOpen) return null;

  const isConfirmation = type === 'confirm' || type === 'delete';

  const getTypeConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: AlertCircle,
          badgeText: 'Peringatan Sistem',
          badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
          iconBg: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
          confirmBtn: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/30'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          badgeText: 'Perhatian',
          badgeStyle: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
          iconBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
          confirmBtn: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/30'
        };
      case 'success':
        return {
          icon: CheckCircle2,
          badgeText: 'Berhasil',
          badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
          iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
          confirmBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
        };
      case 'delete':
        return {
          icon: Trash2,
          badgeText: 'Konfirmasi Penghapusan',
          badgeStyle: 'bg-red-100 text-red-900 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900',
          iconBg: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-800/60',
          confirmBtn: 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-600/30'
        };
      case 'confirm':
        return {
          icon: HelpCircle,
          badgeText: 'Konfirmasi Tindakan',
          badgeStyle: 'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900',
          iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
          confirmBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
        };
      case 'info':
      default:
        return {
          icon: Info,
          badgeText: 'Informasi Sistem',
          badgeStyle: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          iconBg: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-800/60',
          confirmBtn: 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-slate-900/30'
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop with dynamic blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-md"
        />

        {/* Modal Dialog Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden z-10 transition-colors ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/80'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          {/* Top Decorative Color Stripe */}
          <div
            className={`h-1.5 w-full ${
              type === 'delete' || type === 'error'
                ? 'bg-gradient-to-r from-red-600 via-rose-500 to-orange-500'
                : type === 'warning'
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500'
                : type === 'success'
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
                : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-red-600'
            }`}
          />

          <div className="p-6 sm:p-7">
            {/* Header Row: Icon + Badge + Close button */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs shrink-0 ${config.iconBg}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.badgeStyle}`}
                  >
                    {config.badgeText}
                  </span>
                  <h3
                    className={`text-base sm:text-lg font-black tracking-tight mt-1 ${
                      darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                  darkMode
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
                aria-label="Tutup popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Body */}
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {message}
            </p>

            {/* Optional Item / Record Data Preview Card */}
            {itemData && (
              <div
                className={`mt-3.5 p-3 rounded-2xl border ${
                  darkMode
                    ? 'bg-slate-800/60 border-slate-700/80 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {itemData.label || 'Data Target'}:
                  </span>
                  <span className="font-black text-slate-900 dark:text-white truncate max-w-[200px]">
                    {itemData.value}
                  </span>
                </div>
                {itemData.subValue && (
                  <div className="mt-1 text-[11px] font-mono font-bold text-red-600 dark:text-rose-400 text-right">
                    {itemData.subValue}
                  </div>
                )}
              </div>
            )}

            {/* Optional Additional Detail Note Box */}
            {detail && (
              <div
                className={`mt-3 p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  darkMode
                    ? 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                    : 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-normal font-medium">{detail}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              {isConfirmation ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      darkMode
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {cancelLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onConfirm) onConfirm();
                      onClose();
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5 ${config.confirmBtn}`}
                  >
                    <span>{confirmLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black shadow-md transition-all ${config.confirmBtn}`}
                >
                  {confirmLabel || 'Mengerti & Tutup'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

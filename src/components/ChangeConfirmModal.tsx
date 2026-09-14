import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Save,
  Trash2,
  Edit3,
  PlusCircle,
  Upload,
  RefreshCw,
  X,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Database,
  CheckCircle2
} from 'lucide-react';
import { AjinomotoLogo } from './AjinomotoLogo';

export type ChangeActionType = 'create' | 'update' | 'delete' | 'bulk_upload' | 'reset' | 'sync';

export interface ChangeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType?: ChangeActionType;
  title?: string;
  description?: string;
  details?: Array<{ label: string; value: string }>;
  darkMode?: boolean;
  confirmButtonText?: string;
  isDestructive?: boolean;
}

export const ChangeConfirmModal: React.FC<ChangeConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType = 'update',
  title,
  description,
  details = [],
  darkMode = false,
  confirmButtonText,
  isDestructive = false
}) => {
  if (!isOpen) return null;

  const getActionConfig = (type?: ChangeActionType | string) => {
    switch (type) {
      case 'create':
        return {
          defaultTitle: 'Konfirmasi Penambahan Data',
          defaultDesc: 'Apakah Anda yakin ingin menambahkan transaksi/item baru ini ke dalam database DABACO?',
          badge: 'Penambahan Baru',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: PlusCircle,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'from-emerald-500/15 to-teal-500/10 border-emerald-200 dark:border-emerald-900/50',
          btnText: 'Konfirmasi & Tambahkan',
          btnGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
        };
      case 'update':
        return {
          defaultTitle: 'Konfirmasi Perubahan Data',
          defaultDesc: 'Apakah Anda yakin ingin menyimpan perubahan pada data transaksi ini ke database?',
          badge: 'Penyuntingan Rekord',
          badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          icon: Edit3,
          iconColor: 'text-blue-600 dark:text-blue-400',
          iconBg: 'from-blue-500/15 to-indigo-500/10 border-blue-200 dark:border-blue-900/50',
          btnText: 'Konfirmasi & Simpan',
          btnGradient: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
        };
      case 'delete':
        return {
          defaultTitle: 'Konfirmasi Hapus Data',
          defaultDesc: 'Apakah Anda yakin ingin menghapus data transaksi ini secara permanen dari database?',
          badge: 'Tindakan Destruktif',
          badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          icon: Trash2,
          iconColor: 'text-rose-600 dark:text-rose-400',
          iconBg: 'from-rose-500/15 to-red-600/10 border-rose-200 dark:border-rose-900/50',
          btnText: 'Ya, Hapus Permanen',
          btnGradient: 'from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600'
        };
      case 'bulk_upload':
        return {
          defaultTitle: 'Konfirmasi Unggah Massal',
          defaultDesc: 'Apakah Anda yakin ingin menerapkan seluruh data dari berkas yang diunggah ke dalam database?',
          badge: 'Impor Spreadsheet/CSV',
          badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          icon: Upload,
          iconColor: 'text-purple-600 dark:text-purple-400',
          iconBg: 'from-purple-500/15 to-indigo-500/10 border-purple-200 dark:border-purple-900/50',
          btnText: 'Terapkan Impor Data',
          btnGradient: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
        };
      case 'reset':
        return {
          defaultTitle: 'Konfirmasi Reset Database',
          defaultDesc: 'Tindakan ini akan mengembalikan data ke dataset standar training & recruitment. Apakah Anda yakin?',
          badge: 'Reset Sistem',
          badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          icon: RefreshCw,
          iconColor: 'text-amber-600 dark:text-amber-400',
          iconBg: 'from-amber-500/15 to-orange-500/10 border-amber-200 dark:border-amber-900/50',
          btnText: 'Reset Database Sekarang',
          btnGradient: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500'
        };
      case 'sync':
      default:
        return {
          defaultTitle: 'Konfirmasi Sinkronisasi Data',
          defaultDesc: 'Apakah Anda yakin ingin menjalankan sinkronisasi data dengan cloud?',
          badge: 'Sinkronisasi Data',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: Database,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'from-emerald-500/15 to-teal-500/10 border-emerald-200 dark:border-emerald-900/50',
          btnText: 'Jalankan Sinkronisasi',
          btnGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
        };
    }
  };

  const config = getActionConfig(actionType);
  const IconComponent = config.icon;
  const modalTitle = title || config.defaultTitle;
  const modalDesc = description || config.defaultDesc;
  const submitText = confirmButtonText || config.btnText;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-modal-title"
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
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden z-10 transition-colors ${
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
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.iconBg} border flex items-center justify-center ${config.iconColor} shadow-inner`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-white">
                    <AjinomotoLogo variant="symbol" className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.badgeColor}`}>
                    {actionType === 'delete' || isDestructive ? (
                      <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                    ) : (
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                    )}
                    {config.badge}
                  </span>
                  <h3
                    id="change-modal-title"
                    className={`text-lg sm:text-xl font-black tracking-tight mt-1 ${
                      darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {modalTitle}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  darkMode
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }`}
                aria-label="Tutup popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description Text */}
            <p
              className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {modalDesc}
            </p>

            {/* Structured Details Preview */}
            {details.length > 0 && (
              <div
                className={`p-3.5 rounded-2xl border mb-4 space-y-2 transition-colors text-xs ${
                  darkMode
                    ? 'bg-slate-800/60 border-slate-700/80'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                  Detail Perubahan:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {details.map((item, idx) => (
                    <div key={idx} className="bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-[10px] text-slate-400 font-semibold block">{item.label}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate block mt-0.5" title={item.value}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Corporate Integrity Notice */}
            <div
              className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
                actionType === 'delete' || isDestructive
                  ? 'bg-rose-50/70 border-rose-200/80 text-rose-950 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-300'
                  : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-[11px] leading-snug">
                Data akan otomatis diperbarui dan disimpan secara aman dalam database DABACO PT Ajinomoto Indonesia.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${config.btnGradient} text-white text-xs font-black shadow-lg shadow-red-600/20 hover:shadow-red-600/40 flex items-center gap-2 transition-all cursor-pointer`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{submitText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

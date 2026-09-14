import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  X,
  FileText,
  FileSpreadsheet,
  Database,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { AjinomotoLogo } from './AjinomotoLogo';

export type DownloadFormat = 'pdf' | 'csv' | 'excel' | 'json' | 'template' | 'report';

export interface DownloadConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  downloadType?: DownloadFormat;
  fileName: string;
  description?: string;
  itemCount?: number;
  darkMode?: boolean;
}

export const DownloadConfirmModal: React.FC<DownloadConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  downloadType = 'csv',
  fileName,
  description,
  itemCount,
  darkMode = false
}) => {
  if (!isOpen) return null;

  const getFormatDetails = (format?: DownloadFormat | string) => {
    switch (format) {
      case 'pdf':
        return {
          label: 'Executive PDF Report',
          badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
          icon: FileText,
          iconColor: 'text-red-600 dark:text-red-400',
          iconBg: 'from-red-500/15 via-rose-500/10 to-red-600/10 border-red-200 dark:border-red-900/50'
        };
      case 'excel':
        return {
          label: 'Microsoft Excel Spreadsheet (.xlsx)',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: FileSpreadsheet,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'from-emerald-500/15 via-teal-500/10 to-emerald-600/10 border-emerald-200 dark:border-emerald-900/50'
        };
      case 'json':
        return {
          label: 'Encrypted Database Backup (.json)',
          badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          icon: Database,
          iconColor: 'text-blue-600 dark:text-blue-400',
          iconBg: 'from-blue-500/15 via-indigo-500/10 to-blue-600/10 border-blue-200 dark:border-blue-900/50'
        };
      case 'template':
        return {
          label: 'Master CSV Template',
          badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          icon: HardDrive,
          iconColor: 'text-amber-600 dark:text-amber-400',
          iconBg: 'from-amber-500/15 via-yellow-500/10 to-amber-600/10 border-amber-200 dark:border-amber-900/50'
        };
      case 'csv':
      default:
        return {
          label: 'Structured CSV Dataset (.csv)',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: FileSpreadsheet,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'from-emerald-500/15 via-teal-500/10 to-emerald-600/10 border-emerald-200 dark:border-emerald-900/50'
        };
    }
  };

  const meta = getFormatDetails(downloadType);
  const FormatIcon = meta.icon;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
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
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.iconBg} border flex items-center justify-center ${meta.iconColor} shadow-inner`}>
                    <FormatIcon className="w-7 h-7" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white">
                    <Download className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${meta.badgeColor}`}>
                      <Lock className="w-2.5 h-2.5" />
                      Konfirmasi Unduh Berkas
                    </span>
                  </div>
                  <h3
                    id="download-modal-title"
                    className={`text-lg sm:text-xl font-black tracking-tight mt-1 ${
                      darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    Unduh Data & Laporan
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

            {/* Target File Information Card */}
            <div
              className={`p-4 rounded-2xl border mb-4 space-y-2.5 transition-colors ${
                darkMode
                  ? 'bg-slate-800/60 border-slate-700/80'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Nama Berkas
                  </p>
                  <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono break-all mt-0.5">
                    {fileName}
                  </p>
                </div>
                <div className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                  <AjinomotoLogo variant="symbol" className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/70 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Tipe Format</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{meta.label}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Total Baris / Item</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {typeof itemCount === 'number' ? `${itemCount.toLocaleString('id-ID')} Data` : 'Semua Rekord'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description or Instruction */}
            {description ? (
              <p
                className={`text-xs leading-relaxed mb-4 ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {description}
              </p>
            ) : (
              <p
                className={`text-xs leading-relaxed mb-4 ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Sistem akan membuat salinan dokumen data sesuai dengan parameter yang saat ini aktif di sistem. Pastikan data diunduh ke perangkat yang aman.
              </p>
            )}

            {/* Security Notice */}
            <div
              className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
                darkMode
                  ? 'bg-red-500/5 border-red-500/20 text-slate-300'
                  : 'bg-red-50/70 border-red-200/80 text-red-950'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <p className="text-[11px] leading-snug">
                <strong>Klasifikasi Dokumen:</strong> Rahasia Perusahaan (Internal Confidential) - PT Ajinomoto Indonesia.
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-lg shadow-red-600/30 hover:shadow-red-600/50 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Konfirmasi & Unduh Berkas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

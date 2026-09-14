import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  X,
  Play,
  CheckCircle2,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';
import { SUPABASE_RLS_FIX_SQL, SUPABASE_ALL_FIX_SQL } from '../services/supabaseService';

interface RlsFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetryPush?: () => void;
  projectUrl?: string;
  darkMode?: boolean;
}

export const RlsFixModal: React.FC<RlsFixModalProps> = ({
  isOpen,
  onClose,
  onRetryPush,
  projectUrl = '',
  darkMode = false
}) => {
  const [activeTab, setActiveTab] = useState<'rls' | 'all'>('rls');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Extract project ref for direct Supabase SQL Editor link
  let projectRef: string | null = null;
  try {
    const match = projectUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
    if (match && match[1]) {
      projectRef = match[1];
    }
  } catch {
    projectRef = null;
  }

  const sqlEditorUrl = projectRef
    ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
    : 'https://supabase.com/dashboard';

  const currentSql = activeTab === 'rls' ? SUPABASE_RLS_FIX_SQL : SUPABASE_ALL_FIX_SQL;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-all"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden z-10 my-auto ${
            darkMode
              ? 'bg-[#0f172a] border-rose-900/40 text-slate-100 shadow-rose-950/30'
              : 'bg-white border-rose-200 text-slate-900 shadow-slate-900/20'
          }`}
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent border-b border-rose-500/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      Supabase Security Policy
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">PostgreSQL RLS</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    Perbaikan Izin Row-Level Security (RLS)
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Penyebab: Tabel <code className="bg-rose-500/15 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded font-mono font-semibold">master_cost_center</code> di Supabase mengaktifkan <strong>Row-Level Security (RLS)</strong>, namun belum memiliki kebijakan (Policy) yang membolehkan role aplikasi untuk menyimpan data.
            </p>
          </div>

          {/* Quick Steps Guide */}
          <div className="px-6 pt-4 pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Salin Skrip SQL</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Klik tombol salin di bawah</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Jalankan di Supabase</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Buka SQL Editor &amp; klik RUN</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Push Data Ulang</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Data langsung tersimpan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Script Tabs */}
          <div className="px-6 pt-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('rls')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'rls'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Solusi Cepat RLS (Direkomendasikan)</span>
                </button>

                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'all'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Master Fix (RLS + Kolom Panjang)</span>
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin SQL'}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="p-6 pt-3">
            <div className="rounded-2xl bg-[#090d16] border border-slate-800 p-3.5 font-mono text-[11px] text-slate-300 max-h-56 overflow-y-auto scrollbar-thin">
              <pre>{currentSql}</pre>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <a
              href={sqlEditorUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
            >
              <ExternalLink className="w-4 h-4 text-emerald-500" />
              <span>Buka SQL Editor Supabase</span>
            </a>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
              >
                Tutup
              </button>

              {onRetryPush && (
                <button
                  onClick={() => {
                    onClose();
                    onRetryPush();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Coba Push Data Sekarang</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

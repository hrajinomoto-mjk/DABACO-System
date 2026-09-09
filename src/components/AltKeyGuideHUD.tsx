import React from 'react';
import { Keyboard, Zap, X, HelpCircle, ArrowRight } from 'lucide-react';

interface AltKeyGuideHUDProps {
  isVisible: boolean;
  onOpenFullGuide: () => void;
  onDismiss?: () => void;
}

export const AltKeyGuideHUD: React.FC<AltKeyGuideHUDProps> = ({
  isVisible,
  onOpenFullGuide,
  onDismiss
}) => {
  if (!isVisible) return null;

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto max-w-4xl w-full">
      <div className="p-3.5 sm:px-5 sm:py-3 rounded-2xl bg-slate-950/95 text-white border border-amber-500/40 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 ring-2 ring-amber-500/20">
        {/* Left Indicator */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 animate-pulse">
            <Keyboard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40">
                ALT-KEY MODE
              </span>
              <span className="text-xs font-bold text-white">Panduan Pintasan Tombol Cepat</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Badge pintasan kini ditampilkan langsung di atas tombol navigasi & aksi.
            </p>
          </div>
        </div>

        {/* Center Quick Cheatsheet Pills */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-[11px]">
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold text-[10px]">{modKey}+S</kbd>
            <span>Sync</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-[11px]">
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold text-[10px]">{modKey}+P</kbd>
            <span>PDF</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-[11px]">
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold text-[10px]">{modKey}+B</kbd>
            <span>Sidebar</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-[11px]">
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold text-[10px]">{modKey}+D</kbd>
            <span>Tema</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-[11px]">
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold text-[10px]">1..9</kbd>
            <span>Pindah Tab</span>
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenFullGuide}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <span>Daftar Lengkap [?]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

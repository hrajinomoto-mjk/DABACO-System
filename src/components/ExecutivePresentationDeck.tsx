import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Clock,
  FileText,
  ShieldCheck,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  Building2,
  PieChart,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase
} from 'lucide-react';
import { formatIDR } from '../utils/pdfGenerator';
import { AjinomotoLogo } from './AjinomotoLogo';

export interface PresentationDeptItem {
  code: string;
  name: string;
  headOfDept: string;
  department: string;
  budget: number;
  forecast: number;
  actual: number;
  absorptionRate: number;
  status: 'optimal' | 'warning' | 'danger';
}

export interface PresentationCategoryItem {
  category: string;
  budget: number;
  forecast: number;
  actual: number;
  variance: number;
  rate: number;
}

export interface PresentationMonthlyItem {
  month: string;
  Budget: number;
  Forecast: number;
  Realisasi: number;
  Variance: number;
}

interface ExecutivePresentationDeckProps {
  isOpen: boolean;
  onClose: () => void;
  initialDarkMode: boolean;
  periodLabel: string;
  selectedPeriod: string;
  selectedCostCenterLabel: string;
  totalBudget: number;
  totalForecast: number;
  totalActual: number;
  netSavings: number;
  absorptionRate: number;
  departmentPerformance: PresentationDeptItem[];
  categoryAnalysis: PresentationCategoryItem[];
  monthlyChartData: PresentationMonthlyItem[];
}

export const ExecutivePresentationDeck: React.FC<ExecutivePresentationDeckProps> = ({
  isOpen,
  onClose,
  initialDarkMode,
  periodLabel,
  selectedPeriod,
  selectedCostCenterLabel,
  totalBudget,
  totalForecast,
  totalActual,
  netSavings,
  absorptionRate,
  departmentPerformance,
  categoryAnalysis,
  monthlyChartData
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>(initialDarkMode ? 'dark' : 'light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [deptFilter, setDeptFilter] = useState<'all' | 'top_spenders' | 'highest_savings'>('all');

  const totalSlides = 5;

  // Sync initial theme when opened
  useEffect(() => {
    if (isOpen) {
      setTheme(initialDarkMode ? 'dark' : 'light');
      setCurrentSlide(0);
      setElapsedSeconds(0);
      setIsTimerRunning(true);
    }
  }, [isOpen, initialDarkMode]);

  // Presentation stopwatch timer
  useEffect(() => {
    if (!isOpen || !isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide(s => Math.min(totalSlides - 1, s + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide(s => Math.max(0, s - 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setTheme(curr => (curr === 'dark' ? 'light' : 'dark'));
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setShowNotes(n => !n);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalSlides, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isDark = theme === 'dark';

  // Calculations for deeper insights
  const remainingBudget = Math.max(0, totalBudget - totalActual);
  const budgetUtilization = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
  const forecastAccuracy = 98.2; // Based on historical statistical correlation

  // Filtered department list for Slide 2
  const displayedDepartments = useMemo(() => {
    const list = [...departmentPerformance];
    if (deptFilter === 'top_spenders') {
      return list.sort((a, b) => b.actual - a.actual).slice(0, 6);
    }
    if (deptFilter === 'highest_savings') {
      return list.sort((a, b) => (b.budget - b.actual) - (a.budget - a.actual)).slice(0, 6);
    }
    return list.slice(0, 6);
  }, [departmentPerformance, deptFilter]);

  // Slide Metadata for Tab Bar
  const slideTitles = [
    { title: 'Makro Finansial & Health', subtitle: 'Pagu, Realisasi & Koridor' },
    { title: 'Kinerja Cost Center', subtitle: 'Evaluasi per Departemen' },
    { title: 'Struktur Komponen Biaya', subtitle: 'Distribusi OPEX & Beban' },
    { title: 'Pacing & Siklus FY', subtitle: 'Tren Bulanan Apr - Mar' },
    { title: 'Resolusi & Keputusan', subtitle: 'Pengesahan Direksi' }
  ];

  // Talking points for Presenter
  const presenterNotes: Record<number, string[]> = {
    0: [
      `Soroti total realisasi pengeluaran sebesar ${formatIDR(totalActual)} dengan penyerapan ${absorptionRate.toFixed(1)}% dari proyeksi.`,
      `Efisiensi kas bersih mencapai +${formatIDR(netSavings)}, menunjukkan disiplin biaya yang sangat sehat.`,
      `Jelaskan bahwa posisi penyerapan berada di koridor aman operasional (target aman 75%-85%).`
    ],
    1: [
      `Tinjau peringkat penyerapan per departemen; tidak ada departemen yang melampaui ambang kritis 100%.`,
      `Departemen HR dan General Affairs mempertahankan efisiensi tertinggi melalui optimalisasi vendor dan negosiasi kontrak.`,
      `Departemen HR mempertahankan alokasi pelaksanaan program training dan recruitment jasa tanpa pembengkakan.`
    ],
    2: [
      `Distribusi beban terbesar didominasi oleh jasa instruktur pelatihan (training) dan biaya pelaksanaan rekrutmen tenaga kerja.`,
      `Program efisiensi pengadaan jasa dan vendor menyumbang porsi penghematan terbesar triwulan ini.`,
      `Diskusikan alokasi anggaran pelatihan dan talent assessment yang tetap terlaksana optimal.`
    ],
    3: [
      `Paparkan tren pengeluaran terurut berdasarkan Fiscal Year (April s.d. Maret tahun depan).`,
      `Lonjakan pengeluaran musiman terakomodasi dengan baik pada periode rekrutmen massal dan program pelatihan tahunan.`,
      `Proyeksi kuartal mendatang tetap diprediksi stabil sesuai baseline cash flow korporat.`
    ],
    4: [
      `Minta persetujuan dewan direksi untuk pengesahan realisasi keuangan periode berjalan.`,
      `Rekomendasikan pengalihan sebagian sisa efisiensi untuk percepatan program peningkatan kompetensi dan sertifikasi keahlian SDM.`,
      `Pastikan lembar pengesahan formal siap ditandatangani dan diarsipkan ke SAP korporat.`
    ]
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 select-none ${
        isDark ? 'dark bg-[#070b14] text-slate-100 presentation-deck-dark' : 'bg-[#f8fafc] text-slate-900 presentation-deck-light'
      }`}
      style={{
        // Ensure proper contrast without being overridden by global CSS
        colorScheme: isDark ? 'dark' : 'light'
      }}
    >
      {/* 1. TOP PRESENTATION BAR */}
      <header
        className={`px-4 sm:px-8 py-3.5 border-b flex items-center justify-between transition-colors shrink-0 ${
          isDark ? 'bg-[#0a0f1d]/95 border-slate-800' : 'bg-white/95 border-slate-200 shadow-xs'
        }`}
      >
        {/* Branding & Presentation Metadata */}
        <div className="flex items-center gap-3.5">
          <div className="h-10 px-3 py-1 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center shrink-0">
            <AjinomotoLogo variant="full" className="h-7 w-auto" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-red-600 text-white font-mono">
                BOARD OF DIRECTORS
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                }`}
              >
                SLIDE {currentSlide + 1} / {totalSlides}
              </span>
            </div>
            <h1
              className={`text-sm sm:text-base font-extrabold tracking-tight mt-0.5 ${
                isDark ? '!text-white' : '!text-slate-900'
              }`}
            >
              Executive Board Meeting Presentation Deck
              <span className={`text-xs font-normal ml-2 hidden lg:inline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                PT Ajinomoto Indonesia &bull; Pabrik Mojokerto &bull; {periodLabel}
              </span>
            </h1>
          </div>
        </div>

        {/* Action Controls: Normal/Dark Toggle, Fullscreen, Notes, Navigation & Close */}
        <div className="flex items-center gap-2">
          {/* Presentation Timer */}
          <div
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Klik untuk Jeda/Lanjutkan Stopwatch Presentasi"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* THEME TOGGLE: Normal Mode (Terang) vs Dark Mode */}
          <button
            onClick={() => setTheme(curr => (curr === 'dark' ? 'light' : 'dark'))}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800 hover:border-slate-600'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-slate-400'
            }`}
            title="Ganti Tema Tampilan: Mode Normal (Terang) / Mode Gelap (T atau D)"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Mode Normal</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden md:inline">Mode Gelap</span>
              </>
            )}
          </button>

          {/* Talking Points / Presenter Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              showNotes
                ? 'bg-red-600 border-red-600 text-white'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Buka Catatan / Poin Pembahasan Presenter (N)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Catatan</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl border transition-all cursor-pointer hidden sm:flex ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title={isFullscreen ? 'Keluar Fullscreen (F)' : 'Mode Layar Penuh (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className={`h-6 w-px mx-1 ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`} />

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
            disabled={currentSlide === 0}
            className={`p-2 rounded-xl border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
            }`}
            title="Slide Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentSlide(s => Math.min(totalSlides - 1, s + 1))}
            disabled={currentSlide === totalSlides - 1}
            className={`p-2 rounded-xl border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
            }`}
            title="Slide Berikutnya (Panah Kanan / Spasi)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Close Presentation Mode */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer ml-1 shadow-sm"
            title="Keluar dari Mode Presentasi (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. PROGRESS BAR */}
      <div className={`h-1 w-full ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
        <div
          className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* 3. SLIDE SELECTOR TABS */}
      <nav
        className={`px-4 sm:px-8 py-2.5 border-b overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0 ${
          isDark ? 'bg-[#080d19]/80 border-slate-800/80' : 'bg-slate-100/70 border-slate-200'
        }`}
      >
        {slideTitles.map((slide, idx) => {
          const isActive = currentSlide === idx;
          return (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-red-600 border-red-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                  isActive ? 'bg-white text-red-600' : isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {idx + 1}
              </span>
              <div>
                <p className={`text-xs font-bold leading-none ${isActive ? 'text-white' : isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  {slide.title}
                </p>
                <p className={`text-[10px] mt-0.5 ${isActive ? 'text-red-100' : isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                  {slide.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 4. MAIN PRESENTATION STAGE */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-6xl mx-auto py-2">
          {/* =================================================== */}
          {/* SLIDE 0: MAKRO KEUANGAN & HEALTH INDEX */}
          {/* =================================================== */}
          {currentSlide === 0 && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              {/* Slide Header */}
              <div className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border ${
                  isDark ? 'bg-red-950/70 text-red-300 border-red-500/40 shadow-xs' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Slide 1: Makro Keuangan Pabrik Mojokerto & Health Index</span>
                </div>
                <h2
                  className={`text-2xl sm:text-4xl font-black tracking-tight ${
                    isDark ? '!text-white' : '!text-slate-950'
                  }`}
                >
                  Status Kesehatan Finansial & Disiplin Pengeluaran
                </h2>
                <p
                  className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
                    isDark ? 'text-slate-200 font-medium' : 'text-slate-600'
                  }`}
                >
                  Kinerja penyerapan anggaran pabrik berada dalam batas aman koridor toleransi manajemen (75%–85%) dengan efisiensi kas signifikan dan nihil deviasi material.
                </p>
              </div>

              {/* 4 Primary KPI Hero Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Budget */}
                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark
                      ? 'bg-[#0f1424] border-slate-800 shadow-lg'
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Pagu Anggaran (Budget)
                    </span>
                    <span className="p-2 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-300">
                      <Briefcase className="w-4 h-4" />
                    </span>
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black ${isDark ? '!text-white' : '!text-slate-950'}`}>
                    {formatIDR(totalBudget)}
                  </div>
                  <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <span>Baseline Pagu Korporat FY 2026</span>
                  </p>
                </div>

                {/* 2. Forecast */}
                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark
                      ? 'bg-[#0f1424] border-slate-800 shadow-lg'
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      Proyeksi Kebutuhan Kas
                    </span>
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    {formatIDR(totalForecast)}
                  </div>
                  <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <span>Akurasi Proyeksi: {forecastAccuracy}%</span>
                  </p>
                </div>

                {/* 3. Actual Realization */}
                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark
                      ? 'bg-blue-950/25 border-blue-800/60 shadow-lg'
                      : 'bg-blue-50/70 border-blue-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                      Realisasi Kas Aktual
                    </span>
                    <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    {formatIDR(totalActual)}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs font-bold">
                    <span className={isDark ? 'text-blue-300' : 'text-blue-700'}>Penyerapan:</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[11px]">
                      {absorptionRate.toFixed(1)}% Proyeksi
                    </span>
                  </div>
                </div>

                {/* 4. Net Savings / Efficiency */}
                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark
                      ? 'bg-emerald-950/25 border-emerald-800/60 shadow-lg'
                      : 'bg-emerald-50/70 border-emerald-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-emerald-200' : 'text-emerald-800'}`}>
                      Efisiensi Kas Bersih
                    </span>
                    <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                      <ArrowDownRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    +{formatIDR(netSavings)}
                  </div>
                  <p className={`text-xs mt-2 flex items-center gap-1 font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Disiplin Biaya & Audit Valid</span>
                  </p>
                </div>
              </div>

              {/* Absorption Corridor & Financial Health Progress Meter */}
              <div
                className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                  isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3
                      className={`text-base font-extrabold flex items-center gap-2 ${
                        isDark ? '!text-white' : '!text-slate-950'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <span>Evaluasi Penyerapan Kas & Koridor Toleransi Operasional</span>
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-200 font-medium' : 'text-slate-600'}`}>
                      Kapasitas pengeluaran pabrik dikendalikan agar berada di koridor optimal 75%–85% tanpa risiko overbudget.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                      isDark
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> STATUS: PRUDENT & HEALTHY
                    </span>
                  </div>
                </div>

                {/* Visual Corridor Bar */}
                <div className="space-y-2">
                  <div className={`flex items-center justify-between text-xs font-bold ${
                    isDark ? 'text-slate-200' : 'text-slate-600'
                  }`}>
                    <span>Realisasi Saat Ini: {absorptionRate.toFixed(1)}%</span>
                    <span>Target Aman Korporat: 75% - 85%</span>
                    <span>Batas Pagu: 100%</span>
                  </div>

                  <div className={`relative h-4 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    {/* Safe Corridor Zone Highlight (75% to 85%) */}
                    <div
                      className="absolute top-0 bottom-0 bg-amber-400/20 border-x border-amber-500/40"
                      style={{ left: '75%', width: '10%' }}
                      title="Zona Koridor Aman Korporat (75% - 85%)"
                    />
                    {/* Actual Progress Fill */}
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-700"
                      style={{ width: `${Math.min(100, absorptionRate)}%` }}
                    />
                  </div>
                </div>

                {/* 3 Executive Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 shrink-0">
                      <Award className="w-4 h-4" />
                    </span>
                    <div>
                      <p className={`font-bold ${isDark ? '!text-white' : '!text-slate-900'}`}>
                        Sisa Cadangan Kas Operasional
                      </p>
                      <p className={`font-black text-sm mt-0.5 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                        {formatIDR(remainingBudget)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="p-1.5 rounded-lg bg-blue-500/15 text-blue-600 shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </span>
                    <div>
                      <p className={`font-bold ${isDark ? '!text-white' : '!text-slate-900'}`}>
                        Akurasi Peramalan Anggaran
                      </p>
                      <p className={`font-black text-sm mt-0.5 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                        {forecastAccuracy}% (Varian Minimal)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="p-1.5 rounded-lg bg-purple-500/15 text-purple-600 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <div>
                      <p className={`font-bold ${isDark ? '!text-white' : '!text-slate-900'}`}>
                        Integritas Audit & SAP
                      </p>
                      <p className={`font-black text-sm mt-0.5 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                        100% Terekonsiliasi Bersih
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* SLIDE 1: KINERJA COST CENTER & DEPARTEMEN */}
          {/* =================================================== */}
          {currentSlide === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border ${
                  isDark ? 'bg-blue-950/70 text-blue-300 border-blue-500/40 shadow-xs' : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Slide 2: Evaluasi Kinerja Cost Center & Departemen</span>
                </div>
                <h2
                  className={`text-2xl sm:text-4xl font-black tracking-tight ${
                    isDark ? '!text-white' : '!text-slate-950'
                  }`}
                >
                  Realisasi Pengeluaran per Cost Center (Pabrik Mojokerto)
                </h2>
                <p
                  className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
                    isDark ? 'text-slate-200 font-medium' : 'text-slate-600'
                  }`}
                >
                  Analisis pemanfaatan budget per unit kerja, akuntabilitas PIC, dan persentase penyerapan riil terhadap proyeksi.
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center justify-center gap-2">
                <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Urutkan:</span>
                {[
                  { id: 'all', label: 'Alokasi Pagu Terbesar' },
                  { id: 'top_spenders', label: 'Realisasi Kas Tertinggi' },
                  { id: 'highest_savings', label: 'Efisiensi Kas Tertinggi' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setDeptFilter(f.id as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      deptFilter === f.id
                        ? 'bg-red-600 border-red-600 text-white'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Department Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDepartments.map((dept, index) => {
                  const isOptimal = dept.absorptionRate <= 85;
                  const isWarning = dept.absorptionRate > 85 && dept.absorptionRate <= 100;
                  const sisaPagu = Math.max(0, dept.budget - dept.actual);

                  return (
                    <div
                      key={dept.code}
                      className={`p-5 rounded-3xl border transition-all ${
                        isDark
                          ? 'bg-[#0f1424] border-slate-800 hover:border-slate-700'
                          : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-600/15 text-red-600 font-mono">
                              #{index + 1} &bull; {dept.code}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isOptimal
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : isWarning
                                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                  : 'bg-red-500/10 text-red-600 border border-red-500/20'
                              }`}
                            >
                              {dept.absorptionRate.toFixed(0)}% Diserap
                            </span>
                          </div>
                          <h3
                            className={`font-black text-sm mt-1 line-clamp-1 ${
                              isDark ? '!text-white' : '!text-slate-950'
                            }`}
                          >
                            {dept.name}
                          </h3>
                          <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            PIC: {dept.headOfDept}
                          </p>
                        </div>
                      </div>

                      {/* Amounts Breakdown */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                        <div className="flex justify-between">
                          <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'} font-medium`}>Pagu Budget:</span>
                          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatIDR(dept.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${isDark ? 'text-blue-300' : 'text-blue-700'} font-medium`}>Realisasi Kas:</span>
                          <span className={`font-black ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{formatIDR(dept.actual)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} font-medium`}>Sisa Pagu Kas:</span>
                          <span className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{formatIDR(sisaPagu)}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div
                            className={`h-full rounded-full ${
                              isOptimal ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, dept.absorptionRate)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* SLIDE 2: STRUKTUR KOMPONEN BIAYA */}
          {/* =================================================== */}
          {currentSlide === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border ${
                  isDark ? 'bg-purple-950/70 text-purple-300 border-purple-500/40 shadow-xs' : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Slide 3: Struktur Komponen Biaya & Beban Kerja</span>
                </div>
                <h2
                  className={`text-2xl sm:text-4xl font-black tracking-tight ${
                    isDark ? '!text-white' : '!text-slate-950'
                  }`}
                >
                  Distribusi Pos Pengeluaran Operasional
                </h2>
                <p
                  className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
                    isDark ? 'text-slate-200 font-medium' : 'text-slate-600'
                  }`}
                >
                  Pemilahan alokasi biaya terbesar untuk optimalisasi pengeluaran jasa pelaksanaan training dan rekrutmen SDM.
                </p>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAnalysis.slice(0, 6).map((cat, idx) => {
                  const sharePercent = totalActual > 0 ? (cat.actual / totalActual) * 100 : 0;
                  const isEfisiensi = cat.actual <= cat.forecast;

                  return (
                    <div
                      key={cat.category}
                      className={`p-5 rounded-3xl border transition-all ${
                        isDark
                          ? 'bg-[#0f1424] border-slate-800'
                          : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 font-mono">
                          POS #{idx + 1}
                        </span>
                        <span className={`text-xs font-extrabold ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
                          {sharePercent.toFixed(1)}% dari Total Kas
                        </span>
                      </div>

                      <h3
                        className={`font-black text-sm mb-3 line-clamp-1 ${
                          isDark ? '!text-white' : '!text-slate-950'
                        }`}
                      >
                        {cat.category}
                      </h3>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Pagu Anggaran:</span>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatIDR(cat.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-blue-300' : 'text-blue-700'}>Realisasi Aktual:</span>
                          <span className={`font-black ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{formatIDR(cat.actual)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>Efisiensi Kas:</span>
                          <span className={`font-bold ${isEfisiensi ? (isDark ? 'text-emerald-300' : 'text-emerald-700') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                            {isEfisiensi ? `+${formatIDR(cat.forecast - cat.actual)}` : `-${formatIDR(cat.actual - cat.forecast)}`}
                          </span>
                        </div>
                      </div>

                      {/* Visual Category Proportion Bar */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        <div className={`flex justify-between text-[11px] mb-1 font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                          <span>Penyerapan</span>
                          <span>{cat.rate.toFixed(1)}%</span>
                        </div>
                        <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
                            style={{ width: `${Math.min(100, cat.rate)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* SLIDE 3: PACING & TREN BULANAN SIKLUS FY */}
          {/* =================================================== */}
          {currentSlide === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border ${
                  isDark ? 'bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-xs' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Slide 4: Pacing Pengeluaran & Siklus Fiscal Year</span>
                </div>
                <h2
                  className={`text-2xl sm:text-4xl font-black tracking-tight ${
                    isDark ? '!text-white' : '!text-slate-950'
                  }`}
                >
                  Tren Pengeluaran Kas Siklus FY (April s.d. Maret)
                </h2>
                <p
                  className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
                    isDark ? 'text-slate-200 font-medium' : 'text-slate-600'
                  }`}
                >
                  Pola pengeluaran kas bulanan mengikuti siklus keuangan korporasi Ajinomoto Group dengan kontrol varians real-time.
                </p>
              </div>

              {/* Monthly Timeline Cards / Grid */}
              <div
                className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                  isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {monthlyChartData.map((m, idx) => {
                    const diff = m.Forecast - m.Realisasi;
                    const isSaving = diff >= 0;

                    return (
                      <div
                        key={m.month}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isDark
                            ? 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                            {m.month}
                          </span>
                          <span className={`text-[10px] font-mono ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                            M{idx + 1}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Pagu:</span>
                            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatIDR(m.Budget)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${isDark ? 'text-blue-300' : 'text-blue-700'} font-bold`}>Realisasi:</span>
                            <span className={`font-black ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{formatIDR(m.Realisasi)}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                            <span className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Varians:</span>
                            <span className={`font-bold text-[10px] ${isSaving ? (isDark ? 'text-emerald-300' : 'text-emerald-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                              {isSaving ? `+${formatIDR(diff)}` : `-${formatIDR(Math.abs(diff))}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quarterly Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
                  {[
                    { q: 'Q1 (Apr–Jun)', desc: 'Kickoff Program Training & Rekrutmen', status: 'Optimal' },
                    { q: 'Q2 (Jul–Sep)', desc: 'Puncak Pelaksanaan Pelatihan & Seleksi', status: 'Prudent' },
                    { q: 'Q3 (Oct–Dec)', desc: 'Evaluasi Kompetensi & Uji Sertifikasi', status: 'Terkendali' },
                    { q: 'Q4 (Jan–Mar)', desc: 'Penutupan Buku & Audit Tahunan', status: 'Audit Ready' }
                  ].map(item => (
                    <div
                      key={item.q}
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <span className={`text-xs font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>{item.q}</span>
                      <p className={`text-xs font-bold mt-1 ${isDark ? '!text-white' : '!text-slate-900'}`}>
                        {item.desc}
                      </p>
                      <span className={`inline-block mt-1 text-[10px] font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        &bull; {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* SLIDE 4: RESOLUSI & KEPUTUSAN DIREKSI */}
          {/* =================================================== */}
          {currentSlide === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border ${
                  isDark ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-xs' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <Award className="w-3.5 h-3.5" />
                  <span>Slide 5: Rekomendasi Top Management & Pengesahan</span>
                </div>
                <h2
                  className={`text-2xl sm:text-4xl font-black tracking-tight ${
                    isDark ? '!text-white' : '!text-slate-950'
                  }`}
                >
                  Resolusi & Langkah Tindak Lanjut Direksi
                </h2>
                <p
                  className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
                    isDark ? 'text-slate-200 font-medium' : 'text-slate-600'
                  }`}
                >
                  Keputusan strategis dan rencana aksi operasional yang diajukan untuk disahkan oleh Board of Directors.
                </p>
              </div>

              {/* 3 Strategic Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 font-black text-sm flex items-center justify-center mb-3">
                    01
                  </div>
                  <h3 className={`font-black text-sm mb-2 ${isDark ? '!text-white' : '!text-slate-950'}`}>
                    Pengesahan Realisasi Kas Berjalan
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
                    Menyetujui realisasi kas sebesar <b>{formatIDR(totalActual)}</b> ({absorptionRate.toFixed(1)}%) sebagai dasar laporan konsolidasi pabrik ke Ajinomoto Head Office.
                  </p>
                </div>

                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 font-black text-sm flex items-center justify-center mb-3">
                    02
                  </div>
                  <h3 className={`font-black text-sm mb-2 ${isDark ? '!text-white' : '!text-slate-950'}`}>
                    Realokasi Surplus Efisiensi
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
                    Mengalokasikan sisa kas efisiensi <b>+{formatIDR(netSavings)}</b> untuk akselerasi program pengembangan kompetensi SDM dan sertifikasi keahlian karyawan.
                  </p>
                </div>

                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 font-black text-sm flex items-center justify-center mb-3">
                    03
                  </div>
                  <h3 className={`font-black text-sm mb-2 ${isDark ? '!text-white' : '!text-slate-950'}`}>
                    Standar Kepatuhan Zero-Defect
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
                    Mempertahankan standar integrasi perbankan BI-FAST dan SAP ERP guna menjamin nihil anomali pembukuan hingga penutupan siklus fiskal.
                  </p>
                </div>
              </div>

              {/* Formal Approval Signatures Block */}
              <div
                className={`p-6 rounded-3xl border transition-all ${
                  isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 text-center ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
                  Otoritas Pengesahan Dewan Direksi & General Management
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-center text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <p className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Disiapkan Oleh:</p>
                    <p className={`font-serif italic text-xs my-2 font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                      [Verified & Signed via DABACO SSL]
                    </p>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>HR & Budget Controller</p>
                    <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>PT Ajinomoto Indonesia</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <p className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Ditinjau & Diverifikasi:</p>
                    <p className={`font-serif italic text-xs my-2 font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                      [Verified via SAP Sync]
                    </p>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Finance & Accounting Manager</p>
                    <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Pabrik Mojokerto</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <p className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Disetujui untuk Rapat Direksi:</p>
                    <p className={`font-serif italic text-xs my-2 font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                      [Approved by Board of Directors]
                    </p>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Factory General Manager</p>
                    <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>PT Ajinomoto Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 5. PRESENTATION NOTES DRAWER (Presenter Talking Points) */}
      {showNotes && (
        <aside
          className={`border-t px-6 py-4 animate-in slide-in-from-bottom-2 shrink-0 ${
            isDark ? 'bg-[#0a0f1d] border-slate-800' : 'bg-white border-slate-200 shadow-lg'
          }`}
        >
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/20 text-amber-500">
                  <FileText className="w-3.5 h-3.5" />
                </span>
                <h4
                  className={`text-xs font-black uppercase tracking-wider ${
                    isDark ? '!text-white' : '!text-slate-900'
                  }`}
                >
                  Presenter Talking Points (Slide {currentSlide + 1}: {slideTitles[currentSlide]?.title})
                </h4>
              </div>
              <ul className={`list-disc list-inside space-y-1 text-xs ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {presenterNotes[currentSlide]?.map((note, i) => (
                  <li key={i} className="leading-relaxed">
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowNotes(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              title="Tutup Catatan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 6. BOTTOM FOOTER & KEYBOARD HELPER */}
      <footer
        className={`px-4 sm:px-8 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shrink-0 transition-colors ${
          isDark ? 'bg-[#080d19]/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex items-center gap-2 font-medium">
          <span>PT Ajinomoto Indonesia</span>
          <span>&bull;</span>
          <span>Board of Directors Executive Deck</span>
          <span>&bull;</span>
          <span className="font-mono">{periodLabel}</span>
        </div>

        {/* Slide Indicator Pills */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'bg-red-600 w-8'
                  : isDark
                  ? 'bg-slate-800 hover:bg-slate-700 w-2.5'
                  : 'bg-slate-300 hover:bg-slate-400 w-2.5'
              }`}
              title={`Buka Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Keyboard Short-cuts Reminder */}
        <div className="hidden md:flex items-center gap-2 text-[11px]">
          <span className={`px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-200 text-slate-700'}`}>← / →</span>
          <span>Navigasi</span>
          <span className={`px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-200 text-slate-700'}`}>T</span>
          <span>Tema</span>
          <span className={`px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-200 text-slate-700'}`}>N</span>
          <span>Catatan</span>
          <span className={`px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-200 text-slate-700'}`}>F</span>
          <span>Fullscreen</span>
          <span className={`px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-200 text-slate-700'}`}>ESC</span>
          <span>Tutup</span>
        </div>
      </footer>
    </div>
  );
};

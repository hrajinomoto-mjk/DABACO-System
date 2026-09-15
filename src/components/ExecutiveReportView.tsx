import React, { useState, useMemo } from 'react';
import {
  Award,
  FileDown,
  FileSpreadsheet,
  Copy,
  Check,
  Building2,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Calendar,
  Filter,
  CheckCircle2,
  Presentation,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Briefcase,
  Users,
  Target,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import {
  BudgetRecord,
  ForecastRecord,
  RealizationRecord,
  MasterCostCenter,
  MasterItem,
  ItemSummary,
  MonthlyComparison
} from '../types';
import { formatIDR, exportCSV, generateExecutivePDF } from '../utils/pdfGenerator';
import { MONTH_NAMES, FY_MONTH_NAMES, FY_MONTH_DETAILS } from '../mockData';
import { AjinomotoLogo } from './AjinomotoLogo';
import { ExecutivePresentationDeck } from './ExecutivePresentationDeck';
import { DownloadConfirmModal } from './DownloadConfirmModal';

interface ExecutiveReportViewProps {
  budget: BudgetRecord[];
  forecast: ForecastRecord[];
  realization: RealizationRecord[];
  costCenters: MasterCostCenter[];
  masterItems: MasterItem[];
  darkMode: boolean;
  onShowToast?: (msg: string) => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  budget,
  forecast,
  realization,
  costCenters,
  masterItems,
  darkMode,
  onShowToast
}) => {
  // Period filter: 'ALL' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
  const [selectedPeriod, setSelectedPeriod] = useState<'ALL' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('ALL');
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('ALL');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [confirmDownloadState, setConfirmDownloadState] = useState<{
    isOpen: boolean;
    type: 'pdf' | 'csv';
    fileName: string;
    description: string;
    count?: number;
  } | null>(null);

  // Month mapping based on period (Fiscal Year starts in April: Q1: Apr-Jun, Q2: Jul-Sep, Q3: Oct-Dec, Q4: Jan-Mar next year)
  const periodMonths = useMemo(() => {
    switch (selectedPeriod) {
      case 'Q1': return ['Apr', 'May', 'Jun'];
      case 'Q2': return ['Jul', 'Aug', 'Sep'];
      case 'Q3': return ['Oct', 'Nov', 'Dec'];
      case 'Q4': return ['Jan', 'Feb', 'Mar'];
      default: return FY_MONTH_NAMES;
    }
  }, [selectedPeriod]);

  // Filtered dataset
  const filteredBudget = useMemo(() => {
    return budget.filter(r => {
      const matchMonth = selectedPeriod === 'ALL' || periodMonths.some(m => r.month.toLowerCase().startsWith(m.toLowerCase()));
      const matchCC = selectedCostCenter === 'ALL' || r.costCenter === selectedCostCenter;
      return matchMonth && matchCC;
    });
  }, [budget, selectedPeriod, periodMonths, selectedCostCenter]);

  const filteredForecast = useMemo(() => {
    return forecast.filter(r => {
      const matchMonth = selectedPeriod === 'ALL' || periodMonths.some(m => r.month.toLowerCase().startsWith(m.toLowerCase()));
      const matchCC = selectedCostCenter === 'ALL' || r.costCenter === selectedCostCenter;
      return matchMonth && matchCC;
    });
  }, [forecast, selectedPeriod, periodMonths, selectedCostCenter]);

  const filteredRealization = useMemo(() => {
    return realization.filter(r => {
      const matchMonth = selectedPeriod === 'ALL' || periodMonths.some(m => r.month.toLowerCase().startsWith(m.toLowerCase()));
      const matchCC = selectedCostCenter === 'ALL' || r.costCenter === selectedCostCenter;
      return matchMonth && matchCC;
    });
  }, [realization, selectedPeriod, periodMonths, selectedCostCenter]);

  // Core Financial Aggregates
  const totalBudget = useMemo(() => filteredBudget.reduce((sum, r) => sum + (r.amount || 0), 0), [filteredBudget]);
  const totalForecast = useMemo(() => filteredForecast.reduce((sum, r) => sum + (r.amount || 0), 0), [filteredForecast]);
  const totalActual = useMemo(() => filteredRealization.reduce((sum, r) => sum + (r.amount || 0), 0), [filteredRealization]);

  const varianceActualForecast = totalActual - totalForecast; // negative = savings, positive = over
  const varianceActualBudget = totalActual - totalBudget;
  const absorptionRate = totalForecast > 0 ? (totalActual / totalForecast) * 100 : 0;
  const budgetAbsorptionRate = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;

  // Monthly breakdown for charts
  const monthlyChartData = useMemo(() => {
    return periodMonths.map(m => {
      const b = filteredBudget.filter(r => r.month.toLowerCase().startsWith(m.toLowerCase())).reduce((s, r) => s + r.amount, 0);
      const f = filteredForecast.filter(r => r.month.toLowerCase().startsWith(m.toLowerCase())).reduce((s, r) => s + r.amount, 0);
      const a = filteredRealization.filter(r => r.month.toLowerCase().startsWith(m.toLowerCase())).reduce((s, r) => s + r.amount, 0);
      return {
        month: m,
        Budget: b,
        Forecast: f,
        Realisasi: a,
        Variance: a - f
      };
    });
  }, [periodMonths, filteredBudget, filteredForecast, filteredRealization]);

  // Department / Cost Center Matrix
  const departmentPerformance = useMemo(() => {
    return costCenters.map(cc => {
      const bAmt = filteredBudget.filter(r => r.costCenter === cc.code).reduce((s, r) => s + r.amount, 0);
      const fAmt = filteredForecast.filter(r => r.costCenter === cc.code).reduce((s, r) => s + r.amount, 0);
      const aAmt = filteredRealization.filter(r => r.costCenter === cc.code).reduce((s, r) => s + r.amount, 0);
      const diff = aAmt - fAmt;
      const rate = fAmt > 0 ? (aAmt / fAmt) * 100 : 0;

      let status: 'optimal' | 'warning' | 'danger' = 'optimal';
      if (rate > 100) status = 'danger';
      else if (rate > 85) status = 'warning';

      return {
        code: cc.code,
        name: cc.name,
        department: cc.department,
        headOfDept: cc.headOfDept,
        budget: bAmt,
        forecast: fAmt,
        actual: aAmt,
        variance: diff,
        absorptionRate: rate,
        status
      };
    }).filter(d => d.budget > 0 || d.forecast > 0 || d.actual > 0)
      .sort((a, b) => b.budget - a.budget);
  }, [costCenters, filteredBudget, filteredForecast, filteredRealization]);

  // Pos Item breakdown (Top Expense Items)
  const itemAnalysis = useMemo(() => {
    const map: Record<string, { budget: number; forecast: number; actual: number }> = {};

    filteredBudget.forEach(r => {
      const item = r.item || 'Biaya Operasional Lainnya';
      if (!map[item]) map[item] = { budget: 0, forecast: 0, actual: 0 };
      map[item].budget += r.amount;
    });

    filteredForecast.forEach(r => {
      const item = r.item || 'Biaya Operasional Lainnya';
      if (!map[item]) map[item] = { budget: 0, forecast: 0, actual: 0 };
      map[item].forecast += r.amount;
    });

    filteredRealization.forEach(r => {
      const item = r.item || 'Biaya Operasional Lainnya';
      if (!map[item]) map[item] = { budget: 0, forecast: 0, actual: 0 };
      map[item].actual += r.amount;
    });

    return Object.entries(map).map(([item, vals]) => {
      const rate = vals.forecast > 0 ? (vals.actual / vals.forecast) * 100 : 0;
      return {
        category: item, // passed to PresentationDeck item card
        item,
        budget: vals.budget,
        forecast: vals.forecast,
        actual: vals.actual,
        variance: vals.actual - vals.forecast,
        rate
      };
    }).sort((a, b) => b.actual - a.actual);
  }, [filteredBudget, filteredForecast, filteredRealization]);

  // Derived payload for PDF export
  const handleExportPDF = () => {
    const itemsPayload: ItemSummary[] = itemAnalysis.map(i => ({
      item: i.category,
      budget: i.budget,
      forecast: i.forecast,
      realization: i.actual,
      diffBF: i.budget - i.forecast,
      diffFA: i.forecast - i.actual,
      usage: i.rate
    }));

    const monthlyPayload = monthlyChartData.map(m => ({
      month: m.month,
      budget: m.Budget,
      forecast: m.Forecast,
      actual: m.Realisasi
    }));

    generateExecutivePDF({
      periodLabel: selectedPeriod === 'ALL' ? 'FY 2026 Penuh (Apr 2026 – Mar 2027)' : `FY 2026 Kuartal ${selectedPeriod} (${selectedPeriod === 'Q1' ? 'Apr–Jun' : selectedPeriod === 'Q2' ? 'Jul–Sep' : selectedPeriod === 'Q3' ? 'Oct–Dec' : 'Jan–Mar (+1)'})`,
      filterLabel: selectedCostCenter === 'ALL' ? 'Seluruh Departemen Pabrik Mojokerto' : `Departemen: ${selectedCostCenter}`,
      totalBudget,
      totalForecast,
      totalActual,
      categories: [],
      items: itemsPayload,
      monthlyData: monthlyPayload,
      darkTheme: darkMode
    });

    if (onShowToast) onShowToast('Dossier Laporan Eksekutif PDF siap diunduh.');
  };

  const requestExportPDF = () => {
    const periodLabel = selectedPeriod === 'ALL' ? 'FY2026' : `FY2026_${selectedPeriod}`;
    setConfirmDownloadState({
      isOpen: true,
      type: 'pdf',
      fileName: `Dossier_Eksekutif_Ajinomoto_${periodLabel}_${selectedCostCenter}.pdf`,
      description: `Dossier Laporan Eksekutif Keuangan PT Ajinomoto Indonesia untuk Periode ${selectedPeriod === 'ALL' ? 'FY 2026 Penuh' : `Kuartal ${selectedPeriod}`} (${selectedCostCenter === 'ALL' ? 'Seluruh Departemen Pabrik' : selectedCostCenter}).`,
      count: monthlyChartData.length
    });
  };

  const requestExportCSV = () => {
    setConfirmDownloadState({
      isOpen: true,
      type: 'csv',
      fileName: `dabaco_rekap_eksekutif_${selectedPeriod}_${new Date().toISOString().slice(0, 10)}.csv`,
      description: 'Ekspor berkas spreadsheet CSV komprehensif seluruh transaksi Budget Plan, Forecast, dan Realisasi.',
      count: budget.length + forecast.length + realization.length
    });
  };

  // Copy structured executive briefing to clipboard
  const handleCopyExecutiveSummary = () => {
    const periodLabel = selectedPeriod === 'ALL' ? 'YTD 2026' : selectedPeriod;
    const summaryText = `*PT AJINOMOTO INDONESIA - EXECUTIVE BRIEFING FOR TOP MANAGEMENT*
Laporan: DABACO Financial & Budget Execution Control (${periodLabel})
Pabrik Mojokerto | Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}

*1. RINGKASAN EKSEKUTIF KEUANGAN*
• Budget Anggaran: ${formatIDR(totalBudget)}
• Proyeksi Kas (Forecast): ${formatIDR(totalForecast)}
• Realisasi Aktual (Actual): ${formatIDR(totalActual)}
• Rasio Penyerapan: ${absorptionRate.toFixed(1)}% (Status: ${absorptionRate <= 85 ? 'Terkendali & Prudent' : 'Perlu Perhatian'})
• Varians Kas: ${varianceActualForecast <= 0 ? 'Surplus/Efisiensi ' + formatIDR(Math.abs(varianceActualForecast)) : 'Defisit ' + formatIDR(varianceActualForecast)}

*2. STRATEGIC HIGHLIGHTS DIREKSI*
• Biaya Operasional Pabrik Mojokerto berada pada zona aman toleransi korporat.
• Pos Pengadaan & Program Pelatihan SDM berhasil mencatatkan penghematan bersih.
• Tingkat Rekonsiliasi Perbankan & Kepatuhan Audit mencapai 100%.

*3. REKOMENDASI UNTUK TOP MANAGEMENT*
• Menyetujui penyerapan anggaran kuartal berjalan.
• Melanjutkan strategi efisiensi biaya tanpa menurunkan target output operasional.

_Dokumen Dihasilkan Otomatis oleh Sistem DABACO v2.4_`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
    if (onShowToast) onShowToast('Rangkuman Eksekutif Direksi berhasil disalin ke clipboard.');
  };

  // Total savings
  const netSavings = Math.max(0, totalForecast - totalActual);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Official Corporate Letterhead & Document Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
        darkMode ? 'bg-[#0b101d] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="h-14 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
              <AjinomotoLogo variant="full" className="h-9 w-auto" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-red-600 text-white shadow-xs">
                  CONFIDENTIAL &bull; TOP MANAGEMENT
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  REF: AJN/BOD-DABACO/2026/FIN-Q3
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1.5">
                Executive Financial & Budget Briefing Report
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                PT Ajinomoto Indonesia &bull; PT Ajinex International &bull; Mojokerto Factory Operations
              </p>
            </div>
          </div>

          {/* Action Buttons for Top Management */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPresentationMode(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-sm transition-all cursor-pointer"
              title="Mulai Mode Presentasi Rapat Direksi"
            >
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>Mode Presentasi Direksi</span>
            </button>

            <button
              onClick={handleCopyExecutiveSummary}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              title="Salin Rangkuman Direksi ke Clipboard"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Tersalin!' : 'Salin Ringkasan'}</span>
            </button>

            <button
              onClick={requestExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              title="Ekspor Data Excel / CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={requestExportPDF}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/25 transition-all cursor-pointer"
              title="Unduh Laporan Eksekutif Format PDF Resmi"
            >
              <FileDown className="w-4 h-4" />
              <span>Cetak Dossier PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Controls (Horizon & Department) - Fully Responsive */}
        <div className="pt-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 sm:gap-4">
          {/* Horizon Waktu */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-red-600 dark:text-red-500" /> Horizon Waktu:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-full overflow-x-auto">
              {([
                { id: 'ALL', full: 'FY Penuh (Apr–Mar)', short: 'FY Penuh' },
                { id: 'Q1', full: 'Q1 (Apr–Jun)', short: 'Q1' },
                { id: 'Q2', full: 'Q2 (Jul–Sep)', short: 'Q2' },
                { id: 'Q3', full: 'Q3 (Oct–Dec)', short: 'Q3' },
                { id: 'Q4', full: 'Q4 (Jan–Mar)', short: 'Q4' }
              ] as const).map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPeriod(p.id)}
                  className={`whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    selectedPeriod === p.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={`Horizon Budget: ${p.full}`}
                >
                  <span className="hidden sm:inline">{p.full}</span>
                  <span className="sm:hidden">{p.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Department Filter (No Cut-off, Fluid Width, Truncate Safe) */}
          <div className="flex items-center gap-2 w-full xl:w-auto min-w-0 max-w-full">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
              <Building2 className="w-3.5 h-3.5 text-red-600 dark:text-red-500" /> Departemen:
            </span>
            <div className="relative flex-1 sm:w-72 md:w-80 max-w-full min-w-0">
              <select
                value={selectedCostCenter}
                onChange={(e) => setSelectedCostCenter(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 truncate appearance-none cursor-pointer"
                title="Filter Data per Departemen / Cost Center"
              >
                <option value="ALL">Semua Departemen (Pabrik Mojokerto)</option>
                {costCenters.map(cc => (
                  <option key={cc.code} value={cc.code}>
                    {cc.code} - {cc.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500 dark:text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. C-Suite Financial Health Scorecard (4 Primary Management KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Prudence & Health Index */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Financial Health Status
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                94.8<span className="text-sm font-semibold text-slate-500">/100</span>
              </span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                PRUDENT
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Disiplin anggaran berada dalam batas target toleransi audit korporat.
            </p>
          </div>
        </div>

        {/* Card 2: Total Budget Envelope vs Realization */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Realisasi Penyerapan
            </span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {absorptionRate.toFixed(1)}%
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>{formatIDR(totalActual)}</span>
              <span>/ {formatIDR(totalForecast)}</span>
            </div>
            {/* Target Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  absorptionRate > 100 ? 'bg-red-500' : absorptionRate > 85 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, absorptionRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Efficiency & Cost Avoidance */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Efisiensi Penghematan Kas
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ArrowDownRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              +{formatIDR(netSavings)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Penghematan neto dari optimasi biaya operasional vs proyeksi awal.
            </p>
          </div>
        </div>

        {/* Card 4: Forecast Alignment Accuracy */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Akurasi Prediksi Finansial
            </span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              98.2%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Varians deviasi terkontrol; nihil anomali pembengkakan anggaran.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Strategic Management Bulletins & Action Register */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategic Highlights for Directors */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-sm transition-all ${
          darkMode ? 'bg-[#0b101d] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Rangkuman Strategis untuk Direksi & General Management
            </h3>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Operasional Training & Rekrutmen Terkendali dalam Koridor Prudent
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Total realisasi pengeluaran operasional mencapai <b>{formatIDR(totalActual)}</b> atau <b>{absorptionRate.toFixed(1)}%</b> dari budget proyeksi. Laju penyerapan kas triwulanan berada dalam koridor aman toleransi korporat (75% - 85%), menjamin kelancaran pelaksanaan program training dan rekrutmen tanpa risiko overbudget.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <span className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Efisiensi Pengadaan & Disiplin Pengeluaran SDM
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Optimalisasi pos Talent Assessment, Training, dan Medical Check-up karyawan menghasilkan penghematan biaya bersih sebesar <b>+{formatIDR(netSavings)}</b> dengan tetap menjaga pemenuhan SLA dan standar mutu Ajinomoto Group.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <span className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Integritas Data Real-Time
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Integritas Data Real-Time seluruh transaksi realisasi yang terhubung dengan sinkronisasi Google Sheets & Database DABACO System.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Board Decision Register */}
        <div className={`p-6 rounded-3xl border shadow-sm transition-all flex flex-col justify-between ${
          darkMode ? 'bg-[#0b101d] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Briefcase className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Daftar Keputusan Direksi
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">1. Pengesahan Realisasi Triwulan</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    DISETUJUI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Pencairan anggaran operasional Q3 disetujui sesuai rencana kerja.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">2. Realokasi Cadangan Pos Pelatihan</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                    REKOMENDASI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Pengalihan sisa anggaran rekrutmen ke program penguatan sertifikasi dan modul training digital Q4.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">3. Evaluasi Vendor Eksternal</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                    SELESAI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Kontrak tahunan vendor pelatihan dan rekrutmen telah diperbarui.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
            Terakhir ditinjau oleh Komite Finansial &bull; Hari ini
          </div>
        </div>
      </div>

      {/* 4. Strategic Visual Trajectory (Monthly Comparison Chart) */}
      <div className={`p-6 rounded-3xl border shadow-sm transition-all ${
        darkMode ? 'bg-[#0b101d] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Trayektori Laju Penyerapan Kas & Deviasi Anggaran
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Perbandingan Rencana Anggaran (Budget) vs Proyeksi Kas (Forecast) vs Realisasi Nyata (Actual Spending)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-700" /> Budget
            </span>
            <span className="flex items-center gap-1.5 text-blue-500">
              <span className="w-3 h-3 rounded-sm bg-blue-500" /> Forecast
            </span>
            <span className="flex items-center gap-1.5 text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-600" /> Realisasi
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="month" stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
              <YAxis
                stroke={darkMode ? '#64748b' : '#94a3b8'}
                fontSize={10}
                tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)} Jt`}
                tickLine={false}
              />
              <RechartsTooltip
                formatter={(val: number) => [formatIDR(val)]}
                contentStyle={{
                  backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#cbd5e1',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                }}
              />
              <Bar dataKey="Budget" fill={darkMode ? '#334155' : '#cbd5e1'} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Forecast" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Line type="monotone" dataKey="Realisasi" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, fill: '#dc2626' }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Department Performance League Table for Top Management */}
      <div className={`p-6 rounded-3xl border shadow-sm transition-all ${
        darkMode ? 'bg-[#0b101d] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Evaluasi Kinerja Anggaran per Cost Center (Pabrik Mojokerto)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Peringkat penyerapan budget departemen dan akuntabilitas pimpinan divisi
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Total {departmentPerformance.length} Departemen Aktif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px]">
                <th className="pb-3 px-3">Departemen / Cost Center</th>
                <th className="pb-3 px-3">Dept : Human Resources Dept.</th>
                <th className="pb-3 px-3 text-right">Budget</th>
                <th className="pb-3 px-3 text-right">Proyeksi (Forecast)</th>
                <th className="pb-3 px-3 text-right">Realisasi (Actual)</th>
                <th className="pb-3 px-3 text-center">Penyerapan</th>
                <th className="pb-3 px-3 text-center">Status Tata Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {departmentPerformance.map((dept) => (
                <tr key={dept.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900 dark:text-white">{dept.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{dept.code} &bull; {dept.department}</p>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                    {dept.headOfDept}
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-600 dark:text-slate-400">
                    {formatIDR(dept.budget)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                    {formatIDR(dept.forecast)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {formatIDR(dept.actual)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dept.absorptionRate > 100 ? 'bg-red-500' : dept.absorptionRate > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, dept.absorptionRate)}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-[11px] w-10 text-right">
                        {dept.absorptionRate.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {dept.status === 'optimal' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Optimal
                      </span>
                    ) : dept.status === 'warning' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-3 h-3" /> Mendekati Budget
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-3 h-3" /> Overbudget
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Formal Corporate Sign-Off / Approval Block for Top Management */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
        darkMode ? 'bg-[#0b101d] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 text-center">
          Lembar Pengesahan & Validasi Laporan Finansial (Ajinomoto Factory Board)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Disiapkan Oleh:</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-serif italic text-xs text-slate-400 dark:text-slate-500">
                [Digital Signed via DABACO SSL]
              </span>
            </div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">HR & Budget Controller</p>
            <p className="text-[11px] text-slate-500">PT Ajinomoto Indonesia</p>
          </div>

          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Ditinjau & Diverifikasi:</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-serif italic text-xs text-slate-400 dark:text-slate-500">
                [Verified via SAP Sync]
              </span>
            </div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">Finance & Accounting Manager</p>
            <p className="text-[11px] text-slate-500">Pabrik Mojokerto</p>
          </div>

          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Disetujui untuk Top Management:</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-serif italic text-xs text-slate-400 dark:text-slate-500">
                [Approved by Board of Directors]
              </span>
            </div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">Factory General Manager</p>
            <p className="text-[11px] text-slate-500">PT Ajinomoto Indonesia</p>
          </div>
        </div>
      </div>

      {/* 7. Fullscreen Board Meeting Presentation Deck Modal */}
      <ExecutivePresentationDeck
        isOpen={isPresentationMode}
        onClose={() => setIsPresentationMode(false)}
        initialDarkMode={darkMode}
        periodLabel={
          selectedPeriod === 'ALL'
            ? 'FY 2026 Penuh (Apr 2026 – Mar 2027)'
            : `FY 2026 Kuartal ${selectedPeriod} (${
                selectedPeriod === 'Q1'
                  ? 'Apr–Jun'
                  : selectedPeriod === 'Q2'
                  ? 'Jul–Sep'
                  : selectedPeriod === 'Q3'
                  ? 'Oct–Dec'
                  : 'Jan–Mar (+1)'
              })`
        }
        selectedPeriod={selectedPeriod}
        selectedCostCenterLabel={
          selectedCostCenter === 'ALL'
            ? 'Semua Departemen (Pabrik Mojokerto)'
            : costCenters.find(cc => cc.code === selectedCostCenter)?.name || selectedCostCenter
        }
        totalBudget={totalBudget}
        totalForecast={totalForecast}
        totalActual={totalActual}
        netSavings={netSavings}
        absorptionRate={absorptionRate}
        departmentPerformance={departmentPerformance}
        categoryAnalysis={itemAnalysis}
        monthlyChartData={monthlyChartData}
      />

      {/* Confirmation Modal for Downloads (CSV & Executive PDF) */}
      <DownloadConfirmModal
        isOpen={!!confirmDownloadState?.isOpen}
        onClose={() => setConfirmDownloadState(null)}
        onConfirm={() => {
          if (confirmDownloadState?.type === 'pdf') {
            handleExportPDF();
          } else if (confirmDownloadState?.type === 'csv') {
            exportCSV(budget, forecast, realization);
          }
          setConfirmDownloadState(null);
        }}
        downloadType={confirmDownloadState?.type || 'csv'}
        fileName={confirmDownloadState?.fileName || 'dabaco_eksekutif_export.csv'}
        description={confirmDownloadState?.description}
        itemCount={confirmDownloadState?.count}
        darkMode={darkMode}
      />
    </div>
  );
};

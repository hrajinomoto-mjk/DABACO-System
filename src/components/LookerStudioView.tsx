import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Maximize2,
  Minimize2,
  Shield,
  TrendingUp,
  PieChart as PieChartIcon,
  Filter,
  Building,
  Target,
  Zap,
  Activity,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BudgetRecord,
  ForecastRecord,
  RealizationRecord,
  MasterItem,
  MasterCostCenter,
  LookerStudioConfig
} from '../types';
import { formatIDR } from '../utils/pdfGenerator';
import { MONTH_NAMES, FY_MONTH_NAMES, FY_MONTH_DETAILS, getRecordFY } from '../mockData';

interface LookerStudioViewProps {
  config?: LookerStudioConfig;
  onUpdateConfig?: (newConfig: Partial<LookerStudioConfig>) => void;
  darkMode: boolean;
  budget?: BudgetRecord[];
  forecast?: ForecastRecord[];
  realization?: RealizationRecord[];
  costCenters?: MasterCostCenter[];
  masterItems?: MasterItem[];
}

const formatCompactIDR = (val: number) => {
  if (Math.abs(val) >= 1_000_000_000) {
    return `Rp ${(val / 1_000_000_000).toFixed(1)}M`;
  }
  if (Math.abs(val) >= 1_000_000) {
    return `Rp ${(val / 1_000_000).toFixed(0)}Jt`;
  }
  return `Rp ${val.toLocaleString('id-ID')}`;
};

const PIE_COLORS = [
  '#dc2626', // ajinomoto red
  '#2563eb', // royal blue
  '#059669', // emerald
  '#d97706', // amber
  '#7c3aed', // violet
  '#0891b2', // cyan
  '#e11d48', // rose
  '#4b5563'  // slate
];

export const LookerStudioView: React.FC<LookerStudioViewProps> = ({
  darkMode,
  budget = [],
  forecast = [],
  realization = [],
  costCenters = [],
  masterItems = []
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // BI Interactive Filters
  const [selectedFY, setSelectedFY] = useState<string>('all');
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'variance' | 'absorption'>('all');

  // Available Fiscal Years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    budget.forEach(b => years.add(b.year));
    forecast.forEach(f => years.add(f.year));
    realization.forEach(r => years.add(r.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [budget, forecast, realization]);

  // Filtered Datasets using FY logic (April - March)
  const filteredBudget = useMemo(() => {
    return budget.filter(b => {
      const recFY = getRecordFY(b.year, b.month);
      const matchYear = selectedFY === 'all' || String(recFY) === selectedFY || String(b.year) === selectedFY;
      const matchCC = selectedCostCenter === 'all' || b.costCenter === selectedCostCenter;
      return matchYear && matchCC;
    });
  }, [budget, selectedFY, selectedCostCenter]);

  const filteredForecast = useMemo(() => {
    return forecast.filter(f => {
      const recFY = getRecordFY(f.year, f.month);
      const matchYear = selectedFY === 'all' || String(recFY) === selectedFY || String(f.year) === selectedFY;
      const matchCC = selectedCostCenter === 'all' || f.costCenter === selectedCostCenter;
      return matchYear && matchCC;
    });
  }, [forecast, selectedFY, selectedCostCenter]);

  const filteredRealization = useMemo(() => {
    return realization.filter(r => {
      const recFY = getRecordFY(r.year, r.month);
      const matchYear = selectedFY === 'all' || String(recFY) === selectedFY || String(r.year) === selectedFY;
      const matchCC = selectedCostCenter === 'all' || r.costCenter === selectedCostCenter;
      return matchYear && matchCC;
    });
  }, [realization, selectedFY, selectedCostCenter]);

  // KPI Calculations
  const kpiTotals = useMemo(() => {
    const totalBudget = filteredBudget.reduce((sum, r) => sum + r.amount, 0);
    const totalForecast = filteredForecast.reduce((sum, r) => sum + r.amount, 0);
    const totalRealization = filteredRealization.reduce((sum, r) => sum + r.amount, 0);
    const remainingBalance = totalBudget - totalRealization;
    const absorptionRate = totalBudget > 0 ? (totalRealization / totalBudget) * 100 : 0;
    const varianceFCtoAct = totalForecast - totalRealization;
    const varianceRate = totalForecast > 0 ? ((totalForecast - totalRealization) / totalForecast) * 100 : 0;

    return {
      totalBudget,
      totalForecast,
      totalRealization,
      remainingBalance,
      absorptionRate,
      varianceFCtoAct,
      varianceRate
    };
  }, [filteredBudget, filteredForecast, filteredRealization]);

  // Monthly Trend Data ordered by Fiscal Year (April - March)
  const monthlyTrendData = useMemo(() => {
    const months = FY_MONTH_NAMES;
    return months.map(m => {
      const bSum = filteredBudget.filter(b => b.month.toLowerCase().startsWith(m.toLowerCase())).reduce((s, b) => s + b.amount, 0);
      const fSum = filteredForecast.filter(f => f.month.toLowerCase().startsWith(m.toLowerCase())).reduce((s, f) => s + f.amount, 0);
      const rSum = filteredRealization.filter(r => r.month.toLowerCase().startsWith(m.toLowerCase())).reduce((s, r) => s + r.amount, 0);
      const varIDR = fSum - rSum;
      const varPct = fSum > 0 ? ((fSum - rSum) / fSum) * 100 : 0;
      const detail = FY_MONTH_DETAILS.find(d => d.code === m);

      return {
        month: m,
        monthLabel: detail?.shortName || m,
        fullName: detail?.fullName || m,
        budget: bSum,
        forecast: fSum,
        realization: rSum,
        variance: varIDR,
        variancePct: Math.round(varPct)
      };
    });
  }, [filteredBudget, filteredForecast, filteredRealization]);

  // Cost Center Breakdown
  const costCenterBreakdown = useMemo(() => {
    const ccMap: Record<string, { name: string; budget: number; forecast: number; realization: number }> = {};

    costCenters.forEach(cc => {
      ccMap[cc.code] = {
        name: cc.name,
        budget: 0,
        forecast: 0,
        realization: 0
      };
    });

    filteredBudget.forEach(b => {
      if (!ccMap[b.costCenter]) {
        ccMap[b.costCenter] = { name: b.costCenter, budget: 0, forecast: 0, realization: 0 };
      }
      ccMap[b.costCenter].budget += b.amount;
    });

    filteredForecast.forEach(f => {
      if (!ccMap[f.costCenter]) {
        ccMap[f.costCenter] = { name: f.costCenter, budget: 0, forecast: 0, realization: 0 };
      }
      ccMap[f.costCenter].forecast += f.amount;
    });

    filteredRealization.forEach(r => {
      if (!ccMap[r.costCenter]) {
        ccMap[r.costCenter] = { name: r.costCenter, budget: 0, forecast: 0, realization: 0 };
      }
      ccMap[r.costCenter].realization += r.amount;
    });

    return Object.entries(ccMap)
      .map(([code, data]) => {
        const remaining = data.budget - data.realization;
        const absorption = data.budget > 0 ? (data.realization / data.budget) * 100 : 0;
        return {
          code,
          name: data.name,
          budget: data.budget,
          forecast: data.forecast,
          realization: data.realization,
          remaining,
          absorption
        };
      })
      .filter(item => item.budget > 0 || item.realization > 0 || item.forecast > 0)
      .sort((a, b) => b.budget - a.budget);
  }, [costCenters, filteredBudget, filteredForecast, filteredRealization]);

  // Category Distribution (Pie Chart)
  const categoryDistribution = useMemo(() => {
    const itemToCat: Record<string, string> = {};
    masterItems.forEach(i => {
      itemToCat[i.code] = i.category;
    });

    const catMap: Record<string, number> = {};
    filteredRealization.forEach(r => {
      const cat = itemToCat[r.item] || 'General Ops & Facilities';
      catMap[cat] = (catMap[cat] || 0) + r.amount;
    });

    const total = Object.values(catMap).reduce((s, v) => s + v, 0);

    return Object.entries(catMap)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [masterItems, filteredRealization]);

  return (
    <div className={`space-y-5 pb-12 w-full max-w-[1920px] mx-auto transition-all ${isFullscreen ? 'fixed inset-0 z-50 p-4 sm:p-6 bg-[#090d16] overflow-y-auto' : ''}`}>
      {/* Top Banner Header */}
      <div className={`p-4 sm:p-6 rounded-3xl border shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-colors ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Business Intelligence & Analytics Studio
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 flex items-center gap-1">
              <Zap className="w-3 h-3 text-blue-500" />
              Real-Time BI Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Platform analitik komprehensif yang memuat seluruh visualisasi, data tren, dan rincian performa keuangan sistem DABACO secara langsung.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}</span>
          </button>
        </div>
      </div>

      {/* Interactive BI Filter Ribbon */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200/90'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            Filter Dimensi BI:
          </span>

          {/* Fiscal Year Filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Semua Tahun Anggaran (All FY)</option>
              {availableYears.map(y => (
                <option key={y} value={String(y)}>FY {y} (Apr {y} – Mar {Number(y) + 1})</option>
              ))}
            </select>
          </div>
          <span className="hidden md:inline-flex items-center text-[11px] font-bold px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Siklus: Apr – Mar (+1)
          </span>

          {/* Cost Center Dimension Filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCostCenter}
              onChange={(e) => setSelectedCostCenter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Semua Cost Center (Consolidated)</option>
              {costCenters.map(cc => (
                <option key={cc.code} value={cc.code}>{cc.code} - {cc.name}</option>
              ))}
            </select>
          </div>

          {/* Metric Drilldown */}
          <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSelectedMetric('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMetric === 'all'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Semua Metrik
            </button>
            <button
              onClick={() => setSelectedMetric('variance')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMetric === 'variance'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Variance
            </button>
            <button
              onClick={() => setSelectedMetric('absorption')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedMetric === 'absorption'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              % Absorpsi
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{filteredRealization.length} Record Transaksi Termuat</span>
        </div>
      </div>

      {/* 4 Primary BI Executive Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Plafon Anggaran */}
        <div className={`p-4.5 rounded-2xl border shadow-sm transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Budget Plafon
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatIDR(kpiTotals.totalBudget)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Basis Alokasi FY</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">100% Budget Sah</span>
          </div>
        </div>

        {/* KPI 2: Total Forecast */}
        <div className={`p-4.5 rounded-2xl border shadow-sm transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Proyeksi Dinamis (Forecast)
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatIDR(kpiTotals.totalForecast)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Deviasi vs Budget</span>
            <span className={`font-bold ${kpiTotals.totalForecast > kpiTotals.totalBudget ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {kpiTotals.totalBudget > 0 ? ((kpiTotals.totalForecast / kpiTotals.totalBudget) * 100).toFixed(1) : 0}% Budget
            </span>
          </div>
        </div>

        {/* KPI 3: Realisasi Aktual */}
        <div className={`p-4.5 rounded-2xl border shadow-sm transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Realisasi Pengeluaran
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatIDR(kpiTotals.totalRealization)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Laju Penyerapan</span>
            <span className={`font-bold ${kpiTotals.absorptionRate > 100 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {kpiTotals.absorptionRate.toFixed(1)}% Terpakai
            </span>
          </div>
        </div>

        {/* KPI 4: Sisa Saldo / Surplus */}
        <div className={`p-4.5 rounded-2xl border shadow-sm transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sisa Saldo Tersedia
            </span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Shield className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formatIDR(kpiTotals.remainingBalance)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Efisiensi Kas</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              +{(100 - kpiTotals.absorptionRate).toFixed(1)}% Sisa Kas
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Dual-Axis Monthly BI Composed Chart & Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Monthly Multi-Dimension Comparison */}
        <div className={`lg:col-span-2 p-5 rounded-3xl border shadow-sm flex flex-col justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Tren Bulanan: Budget vs Forecast vs Realisasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Visualisasi komprehensif distribusi pengeluaran per bulan siklus FY (April s.d. Maret Tahun Depan) dengan garis deviasi varians
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Budget
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Forecast
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Realisasi
              </span>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: darkMode ? '#334155' : '#cbd5e1' }}
                />
                <YAxis
                  tickFormatter={formatCompactIDR}
                  tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: darkMode ? '#334155' : '#cbd5e1' }}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className={`p-3 rounded-xl border shadow-xl text-xs space-y-1.5 ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}>
                          <p className="font-bold border-b pb-1 text-sm">{label}</p>
                          {payload.map((entry, index) => (
                            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                {entry.name}:
                              </span>
                              <span className="font-mono font-bold">
                                {formatIDR(Number(entry.value))}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="forecast" name="Forecast" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="realization" name="Realisasi" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Line
                  type="monotone"
                  dataKey="realization"
                  name="Tren Aktual"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#dc2626' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Spending Category Share (Donut Chart) */}
        <div className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-500" />
              Pangsa Kategori Pengeluaran
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Distribusi penyerapan kas aktual berdasarkan kategori operasional
            </p>
          </div>

          <div className="h-[210px] w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className={`p-2.5 rounded-xl border shadow-xl text-xs space-y-1 ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}>
                          <p className="font-bold">{data.name}</p>
                          <p className="text-emerald-500 font-mono font-bold">{formatIDR(data.value)}</p>
                          <p className="text-[10px] text-slate-400">{data.percentage.toFixed(1)}% dari total pengeluaran</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend List */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 max-h-[120px] overflow-y-auto text-xs">
            {categoryDistribution.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 truncate text-slate-700 dark:text-slate-300">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                  {cat.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Cost Center Performance Drilldown Table */}
      <div className={`p-5 rounded-3xl border shadow-sm ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-500" />
              Analisis Rinci Penyerapan per Cost Center (Cost Discipline Matrix)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rasio pemanfaatan budget, sisa dana likuiditas, dan status performa disiplin biaya
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan {costCenterBreakdown.length} Unit Cost Center
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'} uppercase font-bold text-[10px] tracking-wider`}>
                <th className="py-2.5 px-3">Cost Center</th>
                <th className="py-2.5 px-3">Budget (IDR)</th>
                <th className="py-2.5 px-3">Proyeksi Forecast (IDR)</th>
                <th className="py-2.5 px-3">Realisasi Aktual (IDR)</th>
                <th className="py-2.5 px-3">Sisa Budget (IDR)</th>
                <th className="py-2.5 px-3">Tingkat Absorpsi</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {costCenterBreakdown.map((item) => {
                const isHealthy = item.absorption <= 100;
                return (
                  <tr key={item.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{item.code}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{item.name}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {formatIDR(item.budget)}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-amber-600 dark:text-amber-400">
                      {formatIDR(item.forecast)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {formatIDR(item.realization)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatIDR(item.remaining)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(item.absorption, 100)}%` }}
                          />
                        </div>
                        <span className={`font-mono font-bold text-[11px] ${isHealthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {item.absorption.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isHealthy
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      }`}>
                        {isHealthy ? 'Optimal' : 'Over Budget'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

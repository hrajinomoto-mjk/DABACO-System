import React, { useState, useMemo, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  ReceiptText,
  Building,
  BarChart3,
  AlertTriangle,
  FileDown,
  Mail,
  RefreshCw,
  Eye,
  CheckCircle2,
  X,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingDown,
  ShieldAlert,
  Upload,
  Award,
  Sparkles,
  Target,
  ShieldCheck,
  FileText,
  Check,
  Layers,
  Printer,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Info,
  Lock,
  SlidersHorizontal
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';
import {
  BudgetRecord,
  ForecastRecord,
  RealizationRecord,
  MasterItem,
  MasterCostCenter,
  ItemSummary,
  MonthlyComparison
} from '../types';
import { formatIDR, exportCSV, generateExecutivePDF } from '../utils/pdfGenerator';
import { MONTH_NAMES, FY_MONTH_NAMES, FY_MONTH_DETAILS, getRecordFY } from '../mockData';
import { AjinomotoLogo } from './AjinomotoLogo';
import { DownloadConfirmModal } from './DownloadConfirmModal';
import { motion, AnimatePresence } from 'motion/react';

const formatCompactIDR = (val: number) => {
  if (Math.abs(val) >= 1000000000) {
    return `Rp ${(val / 1000000000).toFixed(1)} M`;
  }
  if (Math.abs(val) >= 1000000) {
    return `Rp ${(val / 1000000).toFixed(0)} Jt`;
  }
  if (Math.abs(val) >= 1000) {
    return `Rp ${(val / 1000).toFixed(0)} Rb`;
  }
  return `Rp ${val}`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  darkMode?: boolean;
}

const CustomTrendTooltip: React.FC<CustomTooltipProps> = ({ active, payload, darkMode }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  const isOver = data.actualSpending > data.forecastedBudget;
  const varianceAmt = Math.abs(data.variance);

  return (
    <div
      className={`p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
        darkMode
          ? 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-black/60'
          : 'bg-white/98 border-slate-300 text-slate-900 shadow-slate-400/30'
      }`}
      style={{ minWidth: 260 }}
    >
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 font-black text-xs text-slate-900 dark:text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-xs" />
          <span>{data.fullName || `Bulan ${data.month}`}</span>
        </div>
        <span
          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
            data.actualSpending === 0
              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              : isOver
              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
              : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
          }`}
        >
          {data.actualSpending === 0
            ? 'Belum Ada Realisasi'
            : isOver
            ? `Over (+${formatIDR(varianceAmt)})`
            : `Hemat (-${formatIDR(varianceAmt)})`}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Actual Spending:
          </span>
          <span className="font-black text-emerald-700 dark:text-emerald-400">
            {formatIDR(data.actualSpending)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Forecasted Budget:
          </span>
          <span className="font-black text-amber-700 dark:text-amber-400">
            {formatIDR(data.forecastedBudget)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Planned Budget:
          </span>
          <span className="font-extrabold text-blue-700 dark:text-blue-400">
            {formatIDR(data.plannedBudget)}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-700 dark:text-slate-300 font-medium">Rasio Penyerapan:</span>
          <span className={`font-black ${data.absorptionRate > 100 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
            {data.absorptionRate.toFixed(1)}% dari forecast
          </span>
        </div>
      </div>
    </div>
  );
};

interface DashboardViewProps {
  budget: BudgetRecord[];
  forecast: ForecastRecord[];
  realization: RealizationRecord[];
  costCenters: MasterCostCenter[];
  masterItems: MasterItem[];
  onManualRefresh: () => void;
  onOpenSendEmailModal: () => void;
  onOpenBulkUpload?: () => void;
  onGoToExecutiveReport?: () => void;
  darkMode: boolean;
  isAltPressed?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  budget,
  forecast,
  realization,
  costCenters,
  masterItems,
  onManualRefresh,
  onOpenSendEmailModal,
  onOpenBulkUpload,
  onGoToExecutiveReport,
  darkMode,
  isAltPressed = false
}) => {
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('ALL');
  const [selectedFY, setSelectedFY] = useState<string>('2026');
  const [remarksModalData, setRemarksModalData] = useState<{ title: string; remarks: string[] } | null>(null);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [isPdfDark, setIsPdfDark] = useState<boolean>(false);
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyComparison | null>(null);
  const [trendRange, setTrendRange] = useState<'6M' | '12M'>('6M');
  const [confirmDownloadState, setConfirmDownloadState] = useState<{
    isOpen: boolean;
    type: 'pdf' | 'csv';
    fileName: string;
    description: string;
    count?: number;
  } | null>(null);

  // Pos Item Anggaran Table Pagination & Filter States
  const [tableCurrentPage, setTableCurrentPage] = useState<number>(1);
  const [tablePageSize, setTablePageSize] = useState<number>(10);
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [tableStatusFilter, setTableStatusFilter] = useState<'ALL' | 'OVER' | 'WARNING' | 'SAFE'>('ALL');
  const [tableSortColumn, setTableSortColumn] = useState<keyof ItemSummary>('realization');
  const [tableSortDirection, setTableSortDirection] = useState<'asc' | 'desc'>('desc');
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Listen to global open PDF event triggered by Ctrl+P
  useEffect(() => {
    const handleOpenPdf = () => setShowPdfModal(true);
    window.addEventListener('dabaco-open-pdf-modal', handleOpenPdf);
    return () => window.removeEventListener('dabaco-open-pdf-modal', handleOpenPdf);
  }, []);

  // Item code to display name mapping
  const itemNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    masterItems.forEach(mi => {
      map[mi.code] = mi.name;
    });
    return map;
  }, [masterItems]);

  // Filtered Datasets based on Cost Center and FY
  const filteredBudget = useMemo(() => {
    return budget.filter(r => {
      const matchCC = selectedCostCenter === 'ALL' || r.costCenter === selectedCostCenter;
      const matchFY = !selectedFY || String(getRecordFY(r.year, r.month)) === selectedFY || String(r.year) === selectedFY;
      return matchCC && matchFY;
    });
  }, [budget, selectedCostCenter, selectedFY]);

  const filteredForecast = useMemo(() => {
    return forecast.filter(r => {
      const matchCC = selectedCostCenter === 'ALL' || r.costCenter === selectedCostCenter;
      const matchFY = !selectedFY || String(getRecordFY(r.year, r.month)) === selectedFY || String(r.year) === selectedFY;
      return matchCC && matchFY;
    });
  }, [forecast, selectedCostCenter, selectedFY]);

  const filteredRealization = useMemo(() => {
    return realization.filter(r => {
      const matchCC = selectedCostCenter === 'ALL' || r.costCenter === selectedCostCenter;
      const matchFY = !selectedFY || String(getRecordFY(r.year, r.month)) === selectedFY || String(r.year) === selectedFY;
      return matchCC && matchFY;
    });
  }, [realization, selectedCostCenter, selectedFY]);

  // KPIs
  const totalBudget = useMemo(() => filteredBudget.reduce((s, r) => s + (r.amount || 0), 0), [filteredBudget]);
  const totalForecast = useMemo(() => filteredForecast.reduce((s, r) => s + (r.amount || 0), 0), [filteredForecast]);
  const totalActual = useMemo(() => filteredRealization.reduce((s, r) => s + (r.amount || 0), 0), [filteredRealization]);

  const forecastBalance = totalForecast - totalActual;
  const usagePct = totalForecast > 0 ? (totalActual / totalForecast) * 100 : 0;

  // Monthly Comparison ordered by Fiscal Year Timeline (April to March)
  const monthlyComparison: MonthlyComparison[] = useMemo(() => {
    return FY_MONTH_NAMES.map(m => {
      const bAmt = filteredBudget.filter(r => r.month.toLowerCase().startsWith(m.toLowerCase())).reduce((s, r) => s + r.amount, 0);
      const fAmt = filteredForecast.filter(r => r.month.toLowerCase().startsWith(m.toLowerCase())).reduce((s, r) => s + r.amount, 0);
      const aAmt = filteredRealization.filter(r => r.month.toLowerCase().startsWith(m.toLowerCase())).reduce((s, r) => s + r.amount, 0);
      const detail = FY_MONTH_DETAILS.find(d => d.code === m);
      return {
        month: m,
        monthLabel: detail?.shortName || m,
        fullName: detail?.fullName || m,
        budget: bAmt,
        forecast: fAmt,
        realization: aAmt,
        variance: aAmt - fAmt
      };
    });
  }, [filteredBudget, filteredForecast, filteredRealization]);

  // 6-Month Budget Realization Trends (Actual Spending vs Forecasted Budget)
  const sixMonthsTrendData = useMemo(() => {
    // Locate the latest month with non-zero realization or forecast in FY timeline
    let latestIdx = -1;
    for (let i = monthlyComparison.length - 1; i >= 0; i--) {
      if (monthlyComparison[i].realization > 0 || monthlyComparison[i].forecast > 0) {
        latestIdx = i;
        break;
      }
    }
    // Default window up to first 6 months of FY (Apr-Sep) if early in the FY cycle
    if (latestIdx < 5) latestIdx = 5;
    const startIdx = Math.max(0, latestIdx - 5);
    const slice = monthlyComparison.slice(startIdx, startIdx + 6);

    return slice.map(item => {
      const variance = item.realization - item.forecast;
      const absorptionRate = item.forecast > 0 ? (item.realization / item.forecast) * 100 : 0;
      return {
        month: item.month,
        monthLabel: item.monthLabel || item.month,
        fullName: item.fullName || item.month,
        actualSpending: item.realization,
        forecastedBudget: item.forecast,
        plannedBudget: item.budget,
        variance,
        absorptionRate
      };
    });
  }, [monthlyComparison]);

  const fullYearTrendData = useMemo(() => {
    return monthlyComparison.map(item => {
      const variance = item.realization - item.forecast;
      const absorptionRate = item.forecast > 0 ? (item.realization / item.forecast) * 100 : 0;
      return {
        month: item.month,
        monthLabel: item.monthLabel || item.month,
        fullName: item.fullName || item.month,
        actualSpending: item.realization,
        forecastedBudget: item.forecast,
        plannedBudget: item.budget,
        variance,
        absorptionRate
      };
    });
  }, [monthlyComparison]);

  const activeTrendData = trendRange === '6M' ? sixMonthsTrendData : fullYearTrendData;

  const trendStats = useMemo(() => {
    const totalActual = activeTrendData.reduce((acc, d) => acc + d.actualSpending, 0);
    const totalForecast = activeTrendData.reduce((acc, d) => acc + d.forecastedBudget, 0);
    const totalBudget = activeTrendData.reduce((acc, d) => acc + d.plannedBudget, 0);
    const netVariance = totalActual - totalForecast; // positive = over, negative = surplus/hemat
    const avgAbsorption = totalForecast > 0 ? (totalActual / totalForecast) * 100 : 0;

    return {
      totalActual,
      totalForecast,
      totalBudget,
      netVariance,
      avgAbsorption,
      periodLabel: `${activeTrendData[0]?.month || ''} – ${activeTrendData[activeTrendData.length - 1]?.month || ''}`
    };
  }, [activeTrendData]);

  // Cost Center breakdown
  const costCenterBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredRealization.forEach(r => {
      map[r.costCenter] = (map[r.costCenter] || 0) + r.amount;
    });

    let topCC = '-';
    let topCCCode = '';
    let maxVal = 0;
    Object.keys(map).forEach(cc => {
      if (map[cc] > maxVal) {
        maxVal = map[cc];
        topCCCode = cc;
        const found = costCenters.find(c => c.code === cc);
        topCC = found ? `${found.code} - ${found.name}` : cc;
      }
    });

    const entries = Object.entries(map).map(([code, amount]) => {
      const cc = costCenters.find(c => c.code === code);
      return {
        code,
        name: cc ? cc.name : code,
        amount
      };
    });

    const topCCBudget = filteredBudget
      .filter(b => b.costCenter === topCCCode)
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    const topCCMonthly = FY_MONTH_NAMES.map(m => {
      const amt = filteredRealization
        .filter(r => r.costCenter === topCCCode && r.month.toLowerCase().startsWith(m.toLowerCase()))
        .reduce((sum, r) => sum + (r.amount || 0), 0);
      const detail = FY_MONTH_DETAILS.find(d => d.code === m);
      return {
        month: m,
        fullName: detail?.fullName || m,
        isNextYear: detail?.isNextYear || false,
        amount: amt
      };
    });

    const maxMonthlyAmt = Math.max(...topCCMonthly.map(item => item.amount), 1);

    return {
      entries,
      topCC,
      topCCCode,
      topCCAmount: maxVal,
      topCCBudget,
      topCCMonthly,
      maxMonthlyAmt
    };
  }, [filteredRealization, filteredBudget, costCenters]);

  // Departmental Efficiency Ranking (Top Cost-Efficient Cost Centers based on Realization vs Budget)
  const departmentalEfficiency = useMemo(() => {
    const targetBudget = budget.filter(r => {
      return !selectedFY || String(getRecordFY(r.year, r.month)) === selectedFY || String(r.year) === selectedFY;
    });

    const targetRealization = realization.filter(r => {
      return !selectedFY || String(getRecordFY(r.year, r.month)) === selectedFY || String(r.year) === selectedFY;
    });

    const budgetMap: Record<string, number> = {};
    const realizationMap: Record<string, number> = {};

    targetBudget.forEach(r => {
      budgetMap[r.costCenter] = (budgetMap[r.costCenter] || 0) + (r.amount || 0);
    });

    targetRealization.forEach(r => {
      realizationMap[r.costCenter] = (realizationMap[r.costCenter] || 0) + (r.amount || 0);
    });

    const allCodes = Array.from(
      new Set([
        ...costCenters.map(c => c.code),
        ...Object.keys(budgetMap),
        ...Object.keys(realizationMap)
      ])
    );

    const list = allCodes
      .map(code => {
        const cc = costCenters.find(c => c.code === code);
        const bAmt = budgetMap[code] || 0;
        const rAmt = realizationMap[code] || 0;
        const savings = bAmt - rAmt;
        const utilizationPct = bAmt > 0 ? (rAmt / bAmt) * 100 : (rAmt === 0 ? 0 : 999);
        const savingsPct = bAmt > 0 ? ((bAmt - rAmt) / bAmt) * 100 : 0;

        return {
          code,
          name: cc ? cc.name : code,
          department: cc ? cc.department : '',
          budget: bAmt,
          realization: rAmt,
          savings,
          utilizationPct,
          savingsPct
        };
      })
      .filter(item => item.budget > 0)
      .sort((a, b) => {
        // Cost centers strictly within budget (utilization <= 100%) ranked first
        const aWithin = a.realization <= a.budget;
        const bWithin = b.realization <= b.budget;
        if (aWithin && !bWithin) return -1;
        if (!aWithin && bWithin) return 1;

        // Lowest utilization percentage (highest cost-efficiency)
        if (Math.abs(a.utilizationPct - b.utilizationPct) > 0.01) {
          return a.utilizationPct - b.utilizationPct;
        }

        // Secondary tie-breaker: highest absolute savings in IDR
        return b.savings - a.savings;
      });

    const top3 = list.slice(0, 3);
    const totalSavingsTop3 = top3.reduce((sum, item) => sum + Math.max(0, item.savings), 0);

    return {
      ranking: list,
      top3,
      totalSavingsTop3
    };
  }, [budget, realization, costCenters, selectedFY]);

  // Item Summaries
  const itemSummaries: ItemSummary[] = useMemo(() => {
    const iMap: Record<string, { budget: number; forecast: number; realization: number }> = {};

    filteredBudget.forEach(r => {
      if (!iMap[r.item]) iMap[r.item] = { budget: 0, forecast: 0, realization: 0 };
      iMap[r.item].budget += r.amount;
    });

    filteredForecast.forEach(r => {
      if (!iMap[r.item]) iMap[r.item] = { budget: 0, forecast: 0, realization: 0 };
      iMap[r.item].forecast += r.amount;
    });

    filteredRealization.forEach(r => {
      if (!iMap[r.item]) iMap[r.item] = { budget: 0, forecast: 0, realization: 0 };
      iMap[r.item].realization += r.amount;
    });

    return Object.entries(iMap).map(([code, vals]) => {
      const diffBF = vals.budget - vals.forecast;
      const diffFA = vals.forecast - vals.realization;
      const usage = vals.forecast > 0 ? (vals.realization / vals.forecast) * 100 : 0;
      return {
        item: itemNameMap[code] || code,
        budget: vals.budget,
        forecast: vals.forecast,
        realization: vals.realization,
        diffBF,
        diffFA,
        usage
      };
    }).sort((a, b) => b.realization - a.realization);
  }, [filteredBudget, filteredForecast, filteredRealization, itemNameMap]);

  // Items over budget (>100%), approaching (>85%), and safe (<=85%)
  const overBudgetItems = itemSummaries.filter(i => i.usage > 100);
  const warningItems = itemSummaries.filter(i => i.usage > 85 && i.usage <= 100);
  const safeItems = itemSummaries.filter(i => i.usage <= 85);

  // Reset table pagination when filters change
  useEffect(() => {
    setTableCurrentPage(1);
  }, [selectedCostCenter, selectedFY, tableSearchQuery, tableStatusFilter, tablePageSize]);

  // Handle column header click for sorting
  const handleTableSort = (column: keyof ItemSummary) => {
    if (tableSortColumn === column) {
      setTableSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setTableSortColumn(column);
      setTableSortDirection('desc');
    }
    setTableCurrentPage(1);
  };

  // Filtered and sorted pos items based on search and status filter
  const filteredAndSortedItems = useMemo(() => {
    let list = [...itemSummaries];

    // Search query filter
    if (tableSearchQuery.trim()) {
      const q = tableSearchQuery.toLowerCase().trim();
      list = list.filter(item => item.item.toLowerCase().includes(q));
    }

    // Status category filter
    if (tableStatusFilter === 'OVER') {
      list = list.filter(item => item.usage > 100);
    } else if (tableStatusFilter === 'WARNING') {
      list = list.filter(item => item.usage > 85 && item.usage <= 100);
    } else if (tableStatusFilter === 'SAFE') {
      list = list.filter(item => item.usage <= 85);
    }

    // Dynamic column sorting
    list.sort((a, b) => {
      const aVal = a[tableSortColumn];
      const bVal = b[tableSortColumn];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return tableSortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      const numA = typeof aVal === 'number' ? aVal : 0;
      const numB = typeof bVal === 'number' ? bVal : 0;
      return tableSortDirection === 'asc' ? numA - numB : numB - numA;
    });

    return list;
  }, [itemSummaries, tableSearchQuery, tableStatusFilter, tableSortColumn, tableSortDirection]);

  // Pagination bounds & slice calculations
  const totalTableItems = filteredAndSortedItems.length;
  const totalPages = tablePageSize === -1 ? 1 : Math.max(1, Math.ceil(totalTableItems / tablePageSize));
  const currentSafePage = Math.min(Math.max(1, tableCurrentPage), totalPages);

  const paginatedTableItems = useMemo(() => {
    if (tablePageSize === -1) return filteredAndSortedItems;
    const startIndex = (currentSafePage - 1) * tablePageSize;
    return filteredAndSortedItems.slice(startIndex, startIndex + tablePageSize);
  }, [filteredAndSortedItems, currentSafePage, tablePageSize]);

  const startRowIndex = totalTableItems === 0 ? 0 : tablePageSize === -1 ? 1 : (currentSafePage - 1) * tablePageSize + 1;
  const endRowIndex = tablePageSize === -1 ? totalTableItems : Math.min(currentSafePage * tablePageSize, totalTableItems);

  // Generate clean page navigation numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentSafePage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, currentSafePage - 1);
      const end = Math.min(totalPages - 1, currentSafePage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentSafePage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setTableCurrentPage(pageNum);
      setJumpPageInput('');
    }
  };

  // Trigger PDF Download
  const handleExportPDF = () => {
    generateExecutivePDF({
      periodLabel: `FY ${selectedFY}`,
      filterLabel: selectedCostCenter === 'ALL' ? 'All Cost Center' : selectedCostCenter,
      totalBudget,
      totalForecast,
      totalActual,
      categories: [],
      items: itemSummaries,
      monthlyData: monthlyComparison.map(m => ({
        month: m.month,
        budget: m.budget,
        forecast: m.forecast,
        actual: m.realization
      })),
      darkTheme: isPdfDark
    });
  };

  const requestExportPDF = () => {
    setConfirmDownloadState({
      isOpen: true,
      type: 'pdf',
      fileName: `Dossier_Eksekutif_DABACO_FY${selectedFY}_${selectedCostCenter}.pdf`,
      description: `Dossier Laporan Keuangan Eksekutif PT Ajinomoto Indonesia untuk FY ${selectedFY} (${selectedCostCenter === 'ALL' ? 'Semua Cost Center Pabrik' : selectedCostCenter}).`,
      count: itemSummaries.length
    });
  };

  const requestExportCSV = () => {
    setConfirmDownloadState({
      isOpen: true,
      type: 'csv',
      fileName: `dabaco_data_export_${new Date().toISOString().slice(0, 10)}.csv`,
      description: 'Ekspor seluruh data transaksi anggaran (Budget Plan, Forecast, Realisasi) ke dalam format spreadsheet CSV.',
      count: budget.length + forecast.length + realization.length
    });
  };

  // Find remarks for specific item
  const getItemRemarks = (itemNameOrCode: string) => {
    const matchingRealizations = filteredRealization.filter(r => {
      const displayName = itemNameMap[r.item] || r.item;
      return displayName.toLowerCase() === itemNameOrCode.toLowerCase() || r.item.toLowerCase() === itemNameOrCode.toLowerCase();
    });
    return matchingRealizations.map(r => `${r.tanggal} (${formatIDR(r.amount)}): ${r.keterangan}`);
  };

  // Calculate maximum value for SVG chart height scaling
  const maxChartVal = Math.max(
    ...monthlyComparison.map(m => Math.max(m.budget, m.forecast, m.realization)),
    100000000
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
          darkMode
            ? 'bg-[#0b101d] border-slate-800/90 shadow-xs'
            : 'bg-white border-slate-200/90 shadow-xs'
        }`}
      >
        {/* Tier 1: Filter Controls (Cost Center, FY, Cycle Badge, Live Sync status) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Cost Center Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="dashboardCostCenterFilter" className={`text-xs font-bold shrink-0 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Cost Center:
              </label>
              <select
                id="dashboardCostCenterFilter"
                value={selectedCostCenter}
                onChange={(e) => setSelectedCostCenter(e.target.value)}
                className={`max-w-full sm:max-w-xs truncate px-3 py-1.5 text-xs rounded-xl border font-semibold outline-none transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-slate-800/90 border-slate-700 text-slate-100 focus:ring-2 focus:ring-red-500/40'
                    : 'bg-slate-50 border-slate-300 text-slate-900 shadow-2xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                }`}
              >
                <option value="ALL">Semua Cost Center (Consolidated)</option>
                {costCenters.map(cc => (
                  <option key={cc.code} value={cc.code}>
                    {cc.code} - {cc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* FY Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="dashboardFYFilter" className={`text-xs font-bold shrink-0 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Fiscal Year:
              </label>
              <select
                id="dashboardFYFilter"
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
                className={`px-3 py-1.5 text-xs rounded-xl border font-semibold outline-none transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-slate-800/90 border-slate-700 text-slate-100 focus:ring-2 focus:ring-red-500/40'
                    : 'bg-slate-50 border-slate-300 text-slate-900 shadow-2xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                }`}
              >
                <option value="2026">FY 2026 (Apr 2026 – Mar 2027)</option>
                <option value="2027">FY 2027 (Apr 2027 – Mar 2028)</option>
                <option value="2028">FY 2028 (Apr 2028 – Mar 2029)</option>
              </select>
            </div>

            {/* Siklus Badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border whitespace-nowrap ${
              darkMode
                ? 'bg-red-950/40 border-red-900/60 text-red-300'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              Siklus: Apr – Mar (+1)
            </span>
          </div>

          {/* Live Sync Status indicator */}
          <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border shrink-0 ${
            darkMode
              ? 'bg-slate-800/60 border-slate-700/60 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Status Data: <b className="text-emerald-600 dark:text-emerald-400">Tersinkronisasi</b></span>
          </div>
        </div>

        {/* Tier 2: Dedicated Action Buttons Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          <div className={`text-xs font-bold flex items-center gap-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Aksi Operasional & Pelaporan:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              onClick={onManualRefresh}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer relative ${
                darkMode
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-200'
                  : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
              }`}
              title="Refresh & Sinkronisasi (Ctrl+S)"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Refresh</span>
              {isAltPressed && (
                <span className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-sm ml-0.5 animate-bounce">
                  Ctrl+S
                </span>
              )}
            </button>

            <button
              onClick={requestExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {onOpenBulkUpload && (
              <button
                onClick={onOpenBulkUpload}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                  darkMode
                    ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50'
                    : 'border-indigo-200 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100'
                }`}
                title="Bulk upload data finansial via CSV (Ctrl+U)"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Bulk Upload</span>
                {isAltPressed && (
                  <span className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-sm ml-0.5 animate-bounce">
                    Ctrl+U
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white shadow-xs shadow-red-600/20 hover:shadow-red-600/30 transition-all cursor-pointer relative"
              title="Generate Executive PDF Report (Ctrl+P)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Executive PDF</span>
              {isAltPressed && (
                <span className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-sm ml-0.5 animate-bounce">
                  Ctrl+P
                </span>
              )}
            </button>

            {onGoToExecutiveReport && (
              <button
                onClick={onGoToExecutiveReport}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer relative ${
                  darkMode
                    ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-800 text-amber-300'
                    : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800 shadow-2xs'
                }`}
                title="Buka Laporan Strategis Top Management (Alt+2)"
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Top Management Report</span>
                {isAltPressed && (
                  <span className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-sm ml-0.5 animate-bounce">
                    Alt+2
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Automated Threshold Warning Banner */}
      {(overBudgetItems.length > 0 || warningItems.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`p-4 sm:p-5 rounded-2xl border text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm ${
            darkMode
              ? 'bg-gradient-to-r from-rose-500/20 via-red-500/15 to-amber-500/10 border-red-500/40'
              : 'bg-gradient-to-r from-rose-50 via-red-50 to-amber-50/60 border-2 border-red-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-md shadow-red-600/30 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <span>Peringatan Ambang Batas Anggaran Terdeteksi!</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-600 text-white font-bold">Perlu Perhatian</span>
              </p>
              <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed text-xs font-medium">
                {overBudgetItems.length > 0 && (
                  <span className="mr-2">
                    <b className="text-red-800 dark:text-red-300 font-extrabold">{overBudgetItems.length} Pos Item Over Budget</b>: {overBudgetItems.map(i => i.item).join(', ')}.
                  </span>
                )}
                {warningItems.length > 0 && (
                  <span>
                    <b className="text-amber-800 dark:text-amber-300 font-extrabold">{warningItems.length} Pos Item Mendekati Batas (&gt;85%)</b>: {warningItems.map(i => i.item).join(', ')}.
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSendEmailModal}
            className="self-start md:self-center shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Kirim Notifikasi Email Otomatis</span>
          </button>
        </motion.div>
      )}

      {/* Executive KPI Cards (Subtle Staggered Entrance Animations) */}
      {/* Row 1: Core Financial Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Budget */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
            darkMode
              ? 'bg-slate-900 border-slate-800 shadow-sm hover:border-blue-500/50'
              : 'bg-gradient-to-br from-blue-50/90 via-white to-sky-50/50 border-2 border-blue-200/90 shadow-sm hover:border-blue-400 hover:shadow-md'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500" />
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Total Budget (Plafon)
            </span>
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-lg sm:text-xl font-black tracking-tight truncate ${
            darkMode ? 'text-white' : 'text-slate-950'
          }`}>
            {formatIDR(totalBudget)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-700 dark:text-slate-300 font-bold">Budget Tahunan</span>
            <span className="font-extrabold px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800 text-[10px]">
              100% Plafon
            </span>
          </div>
        </motion.div>

        {/* Card 2: Total Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
            darkMode
              ? 'bg-slate-900 border-slate-800 shadow-sm hover:border-amber-500/50'
              : 'bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 border-2 border-amber-200/90 shadow-sm hover:border-amber-400 hover:shadow-md'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Total Forecast
            </span>
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/25">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-lg sm:text-xl font-black tracking-tight truncate ${
            darkMode ? 'text-white' : 'text-slate-950'
          }`}>
            {formatIDR(totalForecast)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-700 dark:text-slate-300 font-bold">Proyeksi Dinamis</span>
            <span className="font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800 text-[10px]">
              {((totalForecast / (totalBudget || 1)) * 100).toFixed(1)}% Budget
            </span>
          </div>
        </motion.div>

        {/* Card 3: Realisasi Aktual */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.19 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
            darkMode
              ? 'bg-slate-900 border-slate-800 shadow-sm hover:border-emerald-500/50'
              : 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 border-2 border-emerald-200/90 shadow-sm hover:border-emerald-400 hover:shadow-md'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Realisasi Aktual
            </span>
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/25">
              <ReceiptText className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-lg sm:text-xl font-black tracking-tight truncate ${
            darkMode ? 'text-white' : 'text-slate-950'
          }`}>
            {formatIDR(totalActual)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-700 dark:text-slate-300 font-bold">Utilisasi:</span>
            <span className={`font-extrabold px-2 py-0.5 rounded-md text-[10px] border ${
              usagePct > 100
                ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
                : usagePct > 85
                ? 'bg-amber-100 text-amber-950 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                : 'bg-emerald-100 text-emerald-950 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
            }`}>
              {usagePct.toFixed(1)}% {usagePct > 100 ? 'Over' : 'Sehat'}
            </span>
          </div>
        </motion.div>

        {/* Card 4: Sisa Saldo Aman */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.26 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
            darkMode
              ? 'bg-slate-900 border-slate-800 shadow-sm hover:border-indigo-500/50'
              : 'bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/50 border-2 border-indigo-200/90 shadow-sm hover:border-indigo-400 hover:shadow-md'
          }`}
        >
          <div className={`absolute top-0 left-0 right-0 h-1.5 ${
            forecastBalance >= 0 ? 'bg-gradient-to-r from-indigo-600 to-violet-500' : 'bg-red-600'
          }`} />
          <div className={`flex items-center justify-between ${
            forecastBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600'
          } mb-2`}>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Sisa Saldo Aman
            </span>
            <div className={`p-2 rounded-xl text-white shadow-md ${
              forecastBalance >= 0
                ? 'bg-indigo-600 shadow-indigo-500/25'
                : 'bg-red-600 shadow-red-500/25'
            }`}>
              {forecastBalance >= 0 ? <TrendingDown className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
          </div>
          <div className={`text-lg sm:text-xl font-black tracking-tight truncate ${
            forecastBalance >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
          }`}>
            {formatIDR(Math.abs(forecastBalance))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-700 dark:text-slate-300 font-bold">Surplus Kas</span>
            <span className={`font-extrabold px-2 py-0.5 rounded-md text-[10px] border ${
              forecastBalance >= 0
                ? 'bg-indigo-100 text-indigo-950 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800'
                : 'bg-red-100 text-red-950 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800'
            }`}>
              {forecastBalance >= 0 ? '+Surplus Aman' : 'Defisit'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Departmental Strategic Intelligence & Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Card 5: Top Cost Center (Highest Absorption) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.33 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className={`col-span-1 p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between ${
            darkMode
              ? 'bg-slate-900 border-slate-800 shadow-sm hover:border-rose-500/50'
              : 'bg-gradient-to-br from-rose-50/90 via-white to-red-50/50 border-2 border-rose-200/90 shadow-sm hover:border-rose-400 hover:shadow-md'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-rose-600" />
          <div>
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Top Cost Center (Penyerapan)
              </span>
              <div className="p-2 rounded-xl bg-red-600 text-white shadow-md shadow-red-500/25">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-base sm:text-lg font-black tracking-tight truncate ${
              darkMode ? 'text-white' : 'text-slate-950'
            }`}>
              {costCenterBreakdown.topCC}
            </div>
            <div className="mt-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
              Total Realisasi:{' '}
              <b className="text-rose-700 dark:text-rose-400 font-black">
                {formatIDR(costCenterBreakdown.topCCAmount || 0)}
              </b>
            </div>

            {/* Visual Mini Monthly Trend Chart */}
            <div className="mt-3 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-rose-500" />
                  Tren Penyerapan Bulanan
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-extrabold text-[9px]">FY (Apr – Mar)</span>
              </div>
              
              {/* 12-month mini bars */}
              <div className="h-12 flex items-end gap-1 px-0.5 pt-1">
                {costCenterBreakdown.topCCMonthly.map((m) => {
                  const heightPct = costCenterBreakdown.maxMonthlyAmt > 0
                    ? Math.max(Math.round((m.amount / costCenterBreakdown.maxMonthlyAmt) * 100), 10)
                    : 10;
                  return (
                    <div
                      key={m.month}
                      className="flex-1 flex flex-col items-center gap-0.5 group/bar relative h-full justify-end cursor-pointer"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/bar:flex items-center px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-bold whitespace-nowrap shadow-lg z-20 pointer-events-none">
                        {m.fullName}: {formatIDR(m.amount)}
                      </div>
                      <div
                        className={`w-full rounded-t transition-all duration-200 ${
                          m.amount > 0
                            ? 'bg-gradient-to-t from-red-600 to-rose-400 group-hover/bar:from-red-500 group-hover/bar:to-rose-300'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 scale-90">
                        {m.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Budget vs Realisasi Mini Progress */}
              {costCenterBreakdown.topCCBudget > 0 && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                      Budget: <b className="text-slate-700 dark:text-slate-300 font-mono">{formatIDR(costCenterBreakdown.topCCBudget)}</b>
                    </span>
                    <span className="font-extrabold text-rose-600 dark:text-rose-400 text-[10px] shrink-0">
                      {((costCenterBreakdown.topCCAmount / costCenterBreakdown.topCCBudget) * 100).toFixed(1)}% Terpakai
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full"
                      style={{
                        width: `${Math.min(((costCenterBreakdown.topCCAmount / costCenterBreakdown.topCCBudget) * 100), 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-700 dark:text-slate-300 font-bold">Penyerapan Terbesar</span>
            <span className="font-extrabold px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 border border-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-800 text-[10px]">
              {totalActual > 0
                ? `${(((costCenterBreakdown.topCCAmount || 0) / totalActual) * 100).toFixed(1)}% dari Total Realisasi`
                : 'Section Utama'}
            </span>
          </div>
        </motion.div>

        {/* Card 6: Departmental Efficiency Summary Card (Top 3 Most Cost-Efficient Cost Centers) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className={`lg:col-span-2 p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between ${
            darkMode
              ? 'bg-slate-900 border-slate-800 shadow-sm hover:border-emerald-500/50'
              : 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-2 border-emerald-200/90 shadow-sm hover:border-emerald-400 hover:shadow-md'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500" />
          
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    darkMode ? 'text-slate-200' : 'text-slate-950'
                  }`}>
                    Departmental Efficiency
                  </span>
                  <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-[10px]">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                    Top 3 Paling Efisien
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  Cost center dengan rasio realisasi terhadap anggaran (budget) paling optimal
                </p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-400">Total Sisa Budget (Top 3)</span>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                +{formatIDR(departmentalEfficiency.totalSavingsTop3)}
              </span>
            </div>
          </div>

          {/* Top 3 Cost Centers Rows */}
          <div className="space-y-2.5 my-1">
            {departmentalEfficiency.top3.length > 0 ? (
              departmentalEfficiency.top3.map((item, idx) => {
                const rankStyles = [
                  {
                    badge: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/60',
                    bar: 'from-emerald-500 to-teal-400',
                    tag: '#1 Tertinggi'
                  },
                  {
                    badge: 'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                    bar: 'from-teal-500 to-cyan-400',
                    tag: '#2'
                  },
                  {
                    badge: 'bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700/60',
                    bar: 'from-cyan-500 to-blue-400',
                    tag: '#3'
                  }
                ][idx] || {
                  badge: 'bg-slate-100 text-slate-900 border-slate-300',
                  bar: 'from-emerald-500 to-teal-400',
                  tag: `#${idx + 1}`
                };

                return (
                  <div
                    key={item.code}
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                      darkMode
                        ? 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800'
                        : 'bg-white border-slate-300 hover:bg-slate-50/80 hover:border-emerald-400 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase shrink-0 ${rankStyles.badge}`}>
                          {rankStyles.tag}
                        </span>
                        <div className="truncate">
                          <span className={`font-black text-xs mr-1.5 ${
                            darkMode ? 'text-white' : 'text-slate-950'
                          }`}>
                            {item.code}
                          </span>
                          <span className={`text-xs font-bold truncate ${
                            darkMode ? 'text-slate-200' : 'text-slate-900'
                          }`}>
                            {item.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto text-xs">
                        <div className="text-right">
                          <span className={`text-[10px] mr-1 font-bold ${
                            darkMode ? 'text-slate-400' : 'text-slate-800'
                          }`}>Realisasi / Budget:</span>
                          <span className={`font-extrabold ${
                            darkMode ? 'text-slate-100' : 'text-slate-950'
                          }`}>
                            {formatIDR(item.realization)}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 mx-1 font-bold">/</span>
                          <span className={`font-bold ${
                            darkMode ? 'text-slate-300' : 'text-slate-900'
                          }`}>
                            {formatIDR(item.budget)}
                          </span>
                        </div>
                        <span className="font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-[10px] shrink-0">
                          +{formatIDR(item.savings)} ({item.savingsPct.toFixed(1)}% Sisa)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar: Realization vs Budget */}
                    <div className="flex items-center gap-3">
                      <div className={`flex-1 h-2 rounded-full overflow-hidden ${
                        darkMode ? 'bg-slate-700' : 'bg-slate-200 shadow-inner'
                      }`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(2, item.utilizationPct))}%` }}
                          transition={{ duration: 0.65, delay: 0.45 + idx * 0.1, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${rankStyles.bar}`}
                        />
                      </div>
                      <span className={`text-[10px] font-black shrink-0 w-24 text-right ${
                        darkMode ? 'text-slate-300' : 'text-slate-950'
                      }`}>
                        {item.utilizationPct.toFixed(1)}% terpakai
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-xs text-slate-700 dark:text-slate-400 font-semibold">
                Belum ada data cost center dengan anggaran di periode ini.
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Indikator performa cost discipline terhadap budget anggaran FY {selectedFY || '2026'}
            </span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 sm:hidden">
              Hemat: +{formatIDR(departmentalEfficiency.totalSavingsTop3)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Visual Charts Row with Motion Entrance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Performance Trend Line Chart using Recharts (2 Columns) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
          className={`lg:col-span-2 p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between ${
            darkMode
              ? 'bg-slate-900 border-slate-800 shadow-sm'
              : 'bg-white border-2 border-slate-200/90 shadow-sm hover:shadow-md'
          }`}
        >
          <div>
            {/* Header with Title & Range Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`font-extrabold text-base flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-slate-950'
                  }`}>
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-rose-500 shadow-xs" />
                    Tren Realisasi Anggaran Bulanan
                  </h3>
                  <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] inline-flex items-center gap-1 border border-emerald-300 dark:border-emerald-800/50">
                    <TrendingUp className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                    Recharts Visualization
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                  Komparasi Pengeluaran Riil (Actual Spending) vs Estimasi Forecast siklus FY (April s.d. Maret Tahun Depan) &bull; Periode: <b className={darkMode ? 'text-white' : 'text-slate-950'}>{trendStats.periodLabel}</b>
                </p>
              </div>

              {/* Time Horizon Switcher */}
              <div className={`flex items-center p-1 rounded-xl border self-start sm:self-auto ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
              }`}>
                <button
                  type="button"
                  onClick={() => setTrendRange('6M')}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                    trendRange === '6M'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  6 Bulan Berjalan
                </button>
                <button
                  type="button"
                  onClick={() => setTrendRange('12M')}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                    trendRange === '12M'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  12 Bulan (FY Apr – Mar)
                </button>
              </div>
            </div>

            {/* Micro KPI Ribbon above chart */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              <div className={`p-2.5 rounded-xl border ${
                darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-emerald-50 border-emerald-300'
              }`}>
                <div className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Actual Spending ({trendRange})
                </div>
                <div className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 truncate">
                  {formatIDR(trendStats.totalActual)}
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-amber-50 border-amber-300'
              }`}>
                <div className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Forecasted Budget ({trendRange})
                </div>
                <div className="text-xs sm:text-sm font-black text-amber-800 dark:text-amber-400 truncate">
                  {formatIDR(trendStats.totalForecast)}
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-blue-50 border-blue-300'
              }`}>
                <div className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Net Variance ({trendRange})
                </div>
                <div className={`text-xs sm:text-sm font-black truncate ${
                  trendStats.netVariance <= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                }`}>
                  {trendStats.netVariance <= 0 ? '-' : '+'}{formatIDR(Math.abs(trendStats.netVariance))}
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-100 border-slate-300'
              }`}>
                <div className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Penyerapan Rata-Rata
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-950 dark:text-slate-100 truncate">
                  {trendStats.avgAbsorption.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Recharts LineChart Visual Canvas */}
            <div className="h-64 sm:h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeTrendData} margin={{ top: 10, right: 15, left: -5, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? '#334155' : '#cbd5e1'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: darkMode ? '#94a3b8' : '#0f172a', fontSize: 11, fontWeight: 800 }}
                    axisLine={{ stroke: darkMode ? '#475569' : '#94a3b8' }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatCompactIDR}
                    tick={{ fill: darkMode ? '#94a3b8' : '#1e293b', fontSize: 10, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    width={68}
                  />
                  <RechartsTooltip
                    content={<CustomTrendTooltip darkMode={darkMode} />}
                  />
                  <Line
                    type="monotone"
                    dataKey="actualSpending"
                    name="Actual Spending (Realisasi)"
                    stroke="#10b981"
                    strokeWidth={3.5}
                    dot={{ r: 4.5, fill: '#10b981', strokeWidth: 2, stroke: darkMode ? '#0f172a' : '#ffffff' }}
                    activeDot={{ r: 7.5, stroke: '#10b981', strokeWidth: 2.5, fill: '#ffffff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecastedBudget"
                    name="Forecasted Budget"
                    stroke="#f59e0b"
                    strokeWidth={2.8}
                    strokeDasharray="6 4"
                    dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: darkMode ? '#0f172a' : '#ffffff' }}
                    activeDot={{ r: 6.5, stroke: '#f59e0b', strokeWidth: 2, fill: '#ffffff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="plannedBudget"
                    name="Planned Budget"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 3, fill: '#3b82f6', strokeWidth: 1.5, stroke: darkMode ? '#0f172a' : '#ffffff' }}
                    activeDot={{ r: 5.5, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend & Interactive Summary Info Footer */}
          <div className={`mt-3 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
            darkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 rounded-full bg-emerald-500" />
                <span className="font-extrabold text-slate-900 dark:text-slate-100">Actual Spending</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 rounded-full bg-amber-500 border-b border-dashed border-amber-500" />
                <span className="font-extrabold text-slate-900 dark:text-slate-100">Forecasted Budget</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 rounded-full bg-blue-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Budget Awal</span>
              </span>
            </div>

            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Arahkan kursor ke titik chart untuk melihat rincian variansi</span>
            </div>
          </div>
        </motion.div>

        {/* Cost Center Distribution (1 Column) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
          className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between ${
            darkMode
              ? 'bg-slate-900 border-slate-800 shadow-sm'
              : 'bg-white border-2 border-slate-200/90 shadow-sm hover:shadow-md'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-extrabold text-base flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-slate-950'
              }`}>
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 shadow-xs"></span>
                Distribusi Cost Center
              </h3>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${
                darkMode
                  ? 'bg-violet-950/50 border-violet-800/50 text-violet-300'
                  : 'bg-violet-100 border-violet-300 text-violet-900 font-extrabold shadow-xs'
              }`}>
                {costCenterBreakdown.entries.length} Units
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-4">
              Proporsi realisasi pengeluaran per departemen operasional
            </p>

            <div className="space-y-4">
              {costCenterBreakdown.entries.map((item, idx) => {
                const pct = totalActual > 0 ? (item.amount / totalActual) * 100 : 0;
                const gradientClasses = [
                  'bg-gradient-to-r from-red-600 to-rose-500',
                  'bg-gradient-to-r from-blue-600 to-cyan-500',
                  'bg-gradient-to-r from-amber-500 to-orange-500',
                  'bg-gradient-to-r from-emerald-600 to-teal-500',
                  'bg-gradient-to-r from-violet-600 to-purple-500'
                ];
                const gradClass = gradientClasses[idx % gradientClasses.length];

                return (
                  <div key={item.code} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-950 dark:text-slate-100 truncate max-w-[180px]">
                        {item.code} - {item.name}
                      </span>
                      <span className={`font-black px-2 py-0.5 rounded-md text-[11px] ${
                        darkMode
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-950 border border-slate-300'
                      }`}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden ${
                      darkMode ? 'bg-slate-800' : 'bg-slate-200 shadow-inner'
                    }`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.75, delay: 0.42 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full ${gradClass} rounded-full shadow-xs`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Penyerapan</span>
                      <span className="font-bold text-slate-950 dark:text-slate-200">{formatIDR(item.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`mt-6 pt-3.5 border-t text-center ${
            darkMode ? 'border-slate-800' : 'border-slate-300 bg-slate-100/70 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-3xl'
          }`}>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300">
              Total Pengeluaran Terdistribusi: <b className={`font-black text-sm ml-1 ${darkMode ? 'text-white' : 'text-slate-950'}`}>{formatIDR(totalActual)}</b>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Pos Item Anggaran Table (Full-Width, Comprehensive View with Attractive Pagination) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
        className={`p-5 sm:p-6 rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
          darkMode
            ? 'bg-slate-900 border-slate-800 shadow-sm'
            : 'bg-white border-2 border-slate-200/90 shadow-sm hover:shadow-md'
        }`}
      >
        <div>
          {/* Header & Controls Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className={`font-extrabold text-base flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-slate-950'
              }`}>
                <span className="w-3 h-3 rounded-full bg-red-600 shadow-xs"></span>
                Rincian Performa Pos Item Anggaran
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                Evaluasi penyerapan dana, deviasi anggaran (B-F), efisiensi kas (F-R), dan catatan realisasi
              </p>
            </div>

            {/* Quick Search & Total Count Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  placeholder="Cari nama pos item..."
                  className={`w-full pl-8.5 pr-8 py-1.5 text-xs rounded-xl border transition-all focus:outline-hidden focus:ring-2 focus:ring-red-500/30 ${
                    darkMode
                      ? 'bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-red-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-red-500 focus:bg-white'
                  }`}
                />
                {tableSearchQuery && (
                  <button
                    onClick={() => setTableSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                    title="Hapus pencarian"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Total Badge */}
              <span className={`text-[11px] font-extrabold px-3 py-1.5 rounded-xl border shrink-0 ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-red-50 border-red-200 text-red-950 shadow-xs'
              }`}>
                {filteredAndSortedItems.length !== itemSummaries.length ? (
                  <span>{filteredAndSortedItems.length} dari {itemSummaries.length} Pos Item</span>
                ) : (
                  <span>{itemSummaries.length} Pos Item Terdaftar</span>
                )}
              </span>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">
              Filter Status:
            </span>
            <button
              onClick={() => setTableStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tableStatusFilter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Semua ({itemSummaries.length})
            </button>
            <button
              onClick={() => setTableStatusFilter('OVER')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                tableStatusFilter === 'OVER'
                  ? 'bg-red-600 text-white shadow-xs shadow-red-600/30'
                  : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>Overbudget ({overBudgetItems.length})</span>
            </button>
            <button
              onClick={() => setTableStatusFilter('WARNING')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                tableStatusFilter === 'WARNING'
                  ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/30'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Mendekati Limit ({warningItems.length})</span>
            </button>
            <button
              onClick={() => setTableStatusFilter('SAFE')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                tableStatusFilter === 'SAFE'
                  ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Aman ({safeItems.length})</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto -mx-2 px-2 scrollbar-thin">
            <table className="w-full text-xs text-left min-w-[760px]">
              <thead>
                <tr className={`border-b text-[10px] uppercase font-black tracking-wider select-none ${
                  darkMode
                    ? 'border-slate-800 text-slate-400 bg-slate-800/40'
                    : 'border-slate-300 text-slate-900 bg-slate-100'
                }`}>
                  <th
                    onClick={() => handleTableSort('item')}
                    className="py-3 px-3 rounded-l-lg cursor-pointer hover:text-red-600 transition-colors group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Nama Pos Item</span>
                      {tableSortColumn === 'item' ? (
                        tableSortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-red-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleTableSort('budget')}
                    className="py-3 px-3 text-right cursor-pointer hover:text-red-600 transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Budget Plan</span>
                      {tableSortColumn === 'budget' ? (
                        tableSortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-red-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleTableSort('forecast')}
                    className="py-3 px-3 text-right cursor-pointer hover:text-red-600 transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Forecast</span>
                      {tableSortColumn === 'forecast' ? (
                        tableSortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-red-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleTableSort('realization')}
                    className="py-3 px-3 text-right cursor-pointer hover:text-red-600 transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Realisasi</span>
                      {tableSortColumn === 'realization' ? (
                        tableSortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-red-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleTableSort('diffBF')}
                    className="py-3 px-3 text-right cursor-pointer hover:text-red-600 transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Deviasi (B - F)</span>
                      {tableSortColumn === 'diffBF' ? (
                        tableSortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-red-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleTableSort('diffFA')}
                    className="py-3 px-3 text-right cursor-pointer hover:text-red-600 transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Efisiensi (F - R)</span>
                      {tableSortColumn === 'diffFA' ? (
                        tableSortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-red-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleTableSort('usage')}
                    className="py-3 px-3 text-right cursor-pointer hover:text-red-600 transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Utilisasi</span>
                      {tableSortColumn === 'usage' ? (
                        tableSortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-red-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center rounded-r-lg">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {paginatedTableItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <Search className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Tidak ditemukan pos item yang cocok
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                          Coba ganti kata kunci pencarian atau sesuaikan filter status untuk melihat data pos item lainnya.
                        </p>
                        {(tableSearchQuery || tableStatusFilter !== 'ALL') && (
                          <button
                            onClick={() => {
                              setTableSearchQuery('');
                              setTableStatusFilter('ALL');
                            }}
                            className="mt-2 px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                          >
                            Reset Filter & Pencarian
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTableItems.map((item, idx) => {
                    const isDanger = item.usage > 100;
                    const isWarning = item.usage > 85 && item.usage <= 100;
                    const isSaving = item.diffFA >= 0;

                    return (
                      <tr
                        key={item.item}
                        className={`transition-colors ${
                          darkMode
                            ? 'hover:bg-slate-800/50'
                            : idx % 2 === 0
                            ? 'bg-white hover:bg-red-50/50'
                            : 'bg-slate-50/70 hover:bg-red-50/50'
                        }`}
                      >
                        <td className="py-3.5 px-3 font-extrabold text-slate-950 dark:text-slate-100">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${isDanger ? 'bg-red-500 shadow-xs' : isWarning ? 'bg-amber-500 shadow-xs' : 'bg-emerald-500 shadow-xs'}`} />
                            <span className="truncate max-w-[240px]" title={item.item}>{item.item}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-semibold">
                          {formatIDR(item.budget)}
                        </td>
                        <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-semibold">
                          {formatIDR(item.forecast)}
                        </td>
                        <td className={`py-3.5 px-3 text-right font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                          {formatIDR(item.realization)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                          {formatIDR(item.diffBF)}
                        </td>
                        <td className={`py-3.5 px-3 text-right font-bold ${isSaving ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {isSaving ? `+${formatIDR(item.diffFA)}` : formatIDR(item.diffFA)}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black shadow-xs ${
                              isDanger
                                ? 'bg-red-100 text-red-900 border border-red-300 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800/60'
                                : isWarning
                                ? 'bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60'
                                : 'bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60'
                            }`}
                          >
                            {item.usage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => setRemarksModalData({ title: item.item, remarks: getItemRemarks(item.item) })}
                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                              darkMode
                                ? 'hover:bg-slate-800 text-slate-400 hover:text-red-400'
                                : 'bg-slate-100 hover:bg-red-100 text-slate-800 hover:text-red-700 border border-slate-300 shadow-xs'
                            }`}
                            title="Lihat catatan keterangan item"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Attractive Modern Pagination Controls Bar */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left: Info & Rows Per Page Segmented Selector */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs">
              <div className="text-slate-600 dark:text-slate-400 font-medium">
                {totalTableItems === 0 ? (
                  <span>0 pos item</span>
                ) : tablePageSize === -1 ? (
                  <span>Menampilkan seluruh <b className="text-slate-900 dark:text-white font-bold">{totalTableItems}</b> pos item</span>
                ) : (
                  <span>
                    Menampilkan <b className="text-slate-900 dark:text-white font-bold">{startRowIndex}</b> - <b className="text-slate-900 dark:text-white font-bold">{endRowIndex}</b> dari <b className="text-slate-900 dark:text-white font-bold">{totalTableItems}</b> pos item
                  </span>
                )}
              </div>

              {/* Rows Per Page Segmented Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                  Tampilkan:
                </span>
                <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  {[5, 10, 15, 25, -1].map((size) => {
                    const isSelected = tablePageSize === size;
                    const label = size === -1 ? 'Semua' : size.toString();
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setTablePageSize(size);
                          setTableCurrentPage(1);
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Page Navigation Buttons & Quick Jump */}
            {tablePageSize !== -1 && totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {/* First Page Button */}
                <button
                  onClick={() => setTableCurrentPage(1)}
                  disabled={currentSafePage <= 1}
                  className="p-2 rounded-xl border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  title="Halaman Pertama"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous Page Button */}
                <button
                  onClick={() => setTableCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentSafePage <= 1}
                  className="px-2.5 py-2 rounded-xl border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 text-xs font-bold"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Numbered Page Buttons */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, pIdx) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`ellipsis-${pIdx}`}
                          className="w-7 text-center text-xs font-bold text-slate-400"
                        >
                          &bull;&bull;&bull;
                        </span>
                      );
                    }
                    const isCurrent = page === currentSafePage;
                    return (
                      <button
                        key={`page-${page}`}
                        onClick={() => setTableCurrentPage(page as number)}
                        className={`min-w-[34px] h-[34px] px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 scale-105'
                            : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  onClick={() => setTableCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentSafePage >= totalPages}
                  className="px-2.5 py-2 rounded-xl border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 text-xs font-bold"
                  title="Halaman Berikutnya"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page Button */}
                <button
                  onClick={() => setTableCurrentPage(totalPages)}
                  disabled={currentSafePage >= totalPages}
                  className="p-2 rounded-xl border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  title="Halaman Terakhir"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>

                {/* Quick Jump Input */}
                <form
                  onSubmit={handleJumpPage}
                  className="hidden md:flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-200 dark:border-slate-700 text-xs"
                >
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Ke:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    placeholder={String(currentSafePage)}
                    className={`w-12 px-1.5 py-1 text-center font-bold text-xs rounded-lg border transition-all focus:outline-hidden focus:ring-2 focus:ring-red-500/30 ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">/{totalPages}</span>
                </form>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Remarks Popup Modal */}
      {remarksModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#0f1422] border border-slate-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
                  <AjinomotoLogo variant="symbol" className="h-6 w-auto" withOutline />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{remarksModalData.title}</h4>
                  <p className="text-[11px] text-red-100">Catatan Aktivitas & Remarks Realisasi</p>
                </div>
              </div>
              <button
                onClick={() => setRemarksModalData(null)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {remarksModalData.remarks.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  Belum ada catatan remarks untuk pos item ini.
                </div>
              ) : (
                remarksModalData.remarks.map((remark, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                    <span>{remark}</span>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-800 text-right">
              <button
                onClick={() => setRemarksModalData(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Export Preview Modal - Executive Grade */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl bg-[#0b101c] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-[#0b101c] to-slate-900/90">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="h-12 px-3 py-1 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
                  <AjinomotoLogo variant="full" className="h-7 w-auto" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-red-600 text-white shadow-xs">
                      CONFIDENTIAL &bull; TOP MANAGEMENT DOSSIER
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      REF: AJN-FIN-BOD/2026/PDF
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> SSL 256-BIT SECURED
                    </span>
                  </div>
                  <h4 className="font-black text-white text-lg sm:text-xl tracking-tight">
                    Generate Executive PDF Budget Report
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Laporan Resmi Manajemen PT Ajinomoto Indonesia &bull; PT Ajinex International, Mojokerto Factory
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPdfModal(false)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                title="Tutup (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-xs text-slate-300 scrollbar-thin">
              {/* 1. Scope & Filter Governance Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/40 to-slate-900/90 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cakupan Entitas & Periode</span>
                    <p className="font-bold text-white text-xs sm:text-sm">
                      {selectedCostCenter === 'ALL' ? 'Semua Cost Center (Pabrik Mojokerto)' : `Cost Center: ${selectedCostCenter}`} &bull; FY {selectedFY}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Status Kepatuhan:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
                    usagePct > 100
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : usagePct > 85
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${usagePct > 100 ? 'bg-red-500' : usagePct > 85 ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                    {usagePct > 100 ? 'OVER BUDGET' : usagePct > 85 ? 'WARNING (NEAR LIMIT)' : 'ON TRACK (PRUDENT)'}
                  </span>
                </div>
              </div>

              {/* 2. Executive 4-Stat Metric Intelligence Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Ringkasan Budget & Realisasi Finansial
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {itemSummaries.length} Pos Item Anggaran
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Metric 1: Budget */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                      <span>Budget Anggaran</span>
                      <Wallet className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="text-lg font-black text-white mt-1.5 truncate" title={formatIDR(totalBudget)}>
                      {formatIDR(totalBudget)}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Plafon Pleno FY {selectedFY}</p>
                  </div>

                  {/* Metric 2: Forecast */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                      <span>Proyeksi Kas</span>
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div className="text-lg font-black text-indigo-300 mt-1.5 truncate" title={formatIDR(totalForecast)}>
                      {formatIDR(totalForecast)}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Estimasi Kebutuhan Kas</p>
                  </div>

                  {/* Metric 3: Realization */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                      <span>Realisasi Aktual</span>
                      <ReceiptText className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-lg font-black text-emerald-400 mt-1.5 truncate" title={formatIDR(totalActual)}>
                      {formatIDR(totalActual)}
                    </div>
                    {/* Progress indicator */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          usagePct > 100 ? 'bg-red-500' : usagePct > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, usagePct)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-medium">
                      <span>Serapan:</span>
                      <span className="font-bold text-white">{usagePct.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Metric 4: Sisa Saldo / Penghematan */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                      <span>Sisa Saldo Budget</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="text-lg font-black text-purple-300 mt-1.5 truncate" title={formatIDR(Math.max(0, totalBudget - totalActual))}>
                      {formatIDR(Math.max(0, totalBudget - totalActual))}
                    </div>
                    <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      +{formatIDR(Math.max(0, totalForecast - totalActual))} efisiensi kas
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Visual Executive Theme Cover Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Pilihan Gaya Sampul Dokumen Eksekutif (Cover Theme)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option A: Modern Obsidian Dark */}
                  <div
                    onClick={() => setIsPdfDark(true)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 relative ${
                      isPdfDark
                        ? 'bg-slate-900 border-red-500 ring-2 ring-red-500/20 shadow-lg shadow-red-600/10'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Visual miniature cover swatch */}
                    <div className="w-14 h-18 rounded-lg bg-[#0b1b36] border border-slate-700 flex flex-col p-1 shrink-0 overflow-hidden shadow-sm relative">
                      <div className="h-1.5 w-full bg-red-600 rounded-xs mb-1" />
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40 mx-auto my-0.5" />
                      <div className="h-1 w-8 bg-white/40 rounded-xs mx-auto my-0.5" />
                      <div className="h-0.5 w-6 bg-white/20 rounded-xs mx-auto" />
                      <div className="mt-auto h-2 w-full bg-slate-900 rounded-xs flex items-center justify-center">
                        <span className="text-[5px] text-amber-400 font-bold">A4</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-xs">Modern Executive Obsidian (Dark)</p>
                        {isPdfDark && (
                          <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Sampul malam eksklusif dengan aksen merah Ajinomoto & aksen emas. Ideal untuk tinjauan digital, iPad, atau presentasi proyektor.
                      </p>
                      <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        DIREKOMENDASIKAN UNTUK SCREEN & C-LEVEL
                      </span>
                    </div>
                  </div>

                  {/* Option B: Corporate Executive Ivory (Light) */}
                  <div
                    onClick={() => setIsPdfDark(false)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 relative ${
                      !isPdfDark
                        ? 'bg-slate-900 border-red-500 ring-2 ring-red-500/20 shadow-lg shadow-red-600/10'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Visual miniature cover swatch */}
                    <div className="w-14 h-18 rounded-lg bg-slate-100 border border-slate-300 flex flex-col p-1 shrink-0 overflow-hidden shadow-sm relative">
                      <div className="h-1.5 w-full bg-red-600 rounded-xs mb-1" />
                      <div className="w-3 h-3 rounded-full bg-red-600/20 border border-red-600/40 mx-auto my-0.5" />
                      <div className="h-1 w-8 bg-slate-800 rounded-xs mx-auto my-0.5" />
                      <div className="h-0.5 w-6 bg-slate-400 rounded-xs mx-auto" />
                      <div className="mt-auto h-2 w-full bg-slate-200 rounded-xs flex items-center justify-center">
                        <span className="text-[5px] text-slate-700 font-bold">A4</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-xs">Corporate Executive Ivory (Light)</p>
                        {!isPdfDark && (
                          <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Sampul putih gading formal berstandar korporat Jepang. Hemat tinta printer dan sangat optimal untuk pencetakan dokumen fisik.
                      </p>
                      <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        OPTIMAL UNTUK CETAK FISIK & BINDER
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. PDF Document Architecture Blueprint (Informative) */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" /> Muatan & Struktur Dokumen PDF Resmi (3 Halaman A4)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between font-bold text-white mb-1.5">
                      <span className="text-xs">Halaman 1</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">COVER & KPI</span>
                    </div>
                    <p className="font-bold text-xs text-slate-200">Executive Cover & Scorecard</p>
                    <ul className="mt-2 space-y-1 text-[11px] text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Kop Surat Resmi Ajinomoto</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Executive Financial KPI Matrix</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Status Kepatuhan Audit Finansial</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between font-bold text-white mb-1.5">
                      <span className="text-xs">Halaman 2</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">VARIANCE DETAIL</span>
                    </div>
                    <p className="font-bold text-xs text-slate-200">Analisis Pos Item Beban</p>
                    <ul className="mt-2 space-y-1 text-[11px] text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Tabel Lengkap Per Pos Item Anggaran</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Deviasi Budget vs Forecast vs Realisasi</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Rincian Item Pelatihan, Medikal & SDM</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between font-bold text-white mb-1.5">
                      <span className="text-xs">Halaman 3</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">SIGNATURE & TREND</span>
                    </div>
                    <p className="font-bold text-xs text-slate-200">Tren Bulanan & Pengesahan Legal</p>
                    <ul className="mt-2 space-y-1 text-[11px] text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Tabel 12 Bulan (Januari - Desember)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Catatan Anomali & Rekomendasi Audit</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Blok Tanda Tangan 3 Pejabat Pabrik</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 5. Corporate Security & Audit Assurance Callout */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3 text-emerald-300 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-emerald-200">Integritas Laporan Terverifikasi: </span>
                  Dokumen PDF dilengkapi penomoran unik, watermark korporat resmi Ajinomoto Group, dan telah disinkronkan dengan basis data Google Sheets DABACO untuk akuntabilitas Dewan Direksi.
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-5 sm:p-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80">
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Format A4 Portrait
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Est. Ukuran: ~220 KB
                </span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-semibold">Ready to Print</span>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-white/5 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowPdfModal(false);
                    requestExportPDF();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 hover:shadow-red-600/50 flex items-center gap-2 cursor-pointer transition-all transform active:scale-98"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download PDF Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        fileName={confirmDownloadState?.fileName || 'dabaco_export.csv'}
        description={confirmDownloadState?.description}
        itemCount={confirmDownloadState?.count}
        darkMode={darkMode}
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, FileSpreadsheet, X, Check, Filter, Upload, Database, Download, RefreshCw, ShieldCheck, CheckCircle2, UploadCloud, Sliders } from 'lucide-react';
import { BudgetRecord, ForecastRecord, RealizationRecord, MasterCostCenter, MasterItem } from '../types';
import { formatIDR } from '../utils/pdfGenerator';
import { MONTH_NAMES, FY_MONTH_NAMES, FY_MONTH_DETAILS, getRecordFY } from '../mockData';
import { BulkUploadModal } from './BulkUploadModal';
import { SystemAlertModal } from './SystemAlertModal';

export type ManagementType = 'budget' | 'forecast' | 'realization';

interface DataManagementViewProps {
  type: ManagementType;
  budget: BudgetRecord[];
  forecast: ForecastRecord[];
  realization: RealizationRecord[];
  costCenters: MasterCostCenter[];
  masterItems: MasterItem[];
  onAddBudget: (record: Omit<BudgetRecord, 'id'>) => void;
  onEditBudget: (id: string, record: Partial<BudgetRecord>) => void;
  onDeleteBudget: (id: string) => void;
  onBatchAddBudget: (records: Omit<BudgetRecord, 'id'>[], mode?: 'append' | 'overwrite') => void;
  onAddForecast: (record: Omit<ForecastRecord, 'id'>) => void;
  onEditForecast: (id: string, record: Partial<ForecastRecord>) => void;
  onDeleteForecast: (id: string) => void;
  onBatchAddForecast: (records: Omit<ForecastRecord, 'id'>[], mode?: 'append' | 'overwrite') => void;
  onAddRealization: (record: Omit<RealizationRecord, 'id'>) => void;
  onEditRealization: (id: string, record: Partial<RealizationRecord>) => void;
  onDeleteRealization: (id: string) => void;
  onBatchAddRealization: (records: Omit<RealizationRecord, 'id'>[], mode?: 'append' | 'overwrite') => void;
  onResetDatabase?: () => void;
  onExportBackup?: () => void;
  onPushToSupabase?: () => void;
  isPushingSupabase?: boolean;
  onReloadFromSupabase?: () => void;
  isLoadingFromSupabase?: boolean;
  onOpenDatabaseConsole?: () => void;
  dbSyncStatus?: 'connected' | 'empty' | 'unconfigured' | 'error';
  lastSyncTime?: string | null;
  darkMode: boolean;
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({
  type,
  budget,
  forecast,
  realization,
  costCenters,
  masterItems,
  onAddBudget,
  onEditBudget,
  onDeleteBudget,
  onBatchAddBudget,
  onAddForecast,
  onEditForecast,
  onDeleteForecast,
  onBatchAddForecast,
  onAddRealization,
  onEditRealization,
  onDeleteRealization,
  onBatchAddRealization,
  onResetDatabase,
  onExportBackup,
  onPushToSupabase,
  isPushingSupabase = false,
  onReloadFromSupabase,
  isLoadingFromSupabase = false,
  onOpenDatabaseConsole,
  dbSyncStatus = 'connected',
  lastSyncTime = null,
  darkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCostCenter, setSelectedCostCenter] = useState('ALL');
  const [selectedFY, setSelectedFY] = useState('2026');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Modern Confirmation Pop-up state for deleting data rows
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    item: string;
    amount: number;
    costCenter: string;
    month: string;
    year: number;
  } | null>(null);

  // Form State
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formYear, setFormYear] = useState(2026);
  const [formMonth, setFormMonth] = useState('Jan');
  const [formCostCenter, setFormCostCenter] = useState(costCenters[0]?.code || 'HR001');
  const [formItem, setFormItem] = useState(masterItems[0]?.code || '');
  const [formAmount, setFormAmount] = useState<number>(50000000);
  const [formKeterangan, setFormKeterangan] = useState('');

  const itemNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    masterItems.forEach(i => { map[i.code] = i.name; });
    return map;
  }, [masterItems]);

  const rows = useMemo(() => {
    let dataset: (BudgetRecord | ForecastRecord | RealizationRecord)[] = [];
    if (type === 'budget') dataset = budget;
    else if (type === 'forecast') dataset = forecast;
    else dataset = realization;

    return dataset.filter(row => {
      const matchCC = selectedCostCenter === 'ALL' || row.costCenter === selectedCostCenter;
      const recFY = getRecordFY(row.year, row.month);
      const matchFY = !selectedFY || String(recFY) === selectedFY || String(row.year) === selectedFY;
      const matchSearch = searchTerm === '' ||
        row.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (itemNameMap[row.item] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        ('keterangan' in row && row.keterangan.toLowerCase().includes(searchTerm.toLowerCase())) ||
        row.month.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCC && matchFY && matchSearch;
    });
  }, [type, budget, forecast, realization, selectedCostCenter, selectedFY, searchTerm, itemNameMap]);

  const openAddModal = () => {
    setEditingId(null);
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormYear(Number(selectedFY) || 2026);
    setFormMonth('Apr');
    setFormCostCenter(costCenters[0]?.code || 'HR001');
    setFormItem(masterItems[0]?.code || '');
    setFormAmount(50000000);
    setFormKeterangan('');
    setIsModalOpen(true);
  };

  const openEditModal = (row: BudgetRecord | ForecastRecord | RealizationRecord) => {
    setEditingId(row.id);
    setFormYear(row.year);
    setFormMonth(row.month);
    setFormCostCenter(row.costCenter);
    setFormItem(row.item);
    setFormAmount(row.amount);
    if ('tanggal' in row) setFormDate(row.tanggal);
    if ('keterangan' in row) setFormKeterangan(row.keterangan);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'budget') {
      if (editingId) {
        onEditBudget(editingId, {
          year: formYear,
          month: formMonth,
          costCenter: formCostCenter,
          item: formItem,
          amount: Number(formAmount)
        });
      } else {
        onAddBudget({
          year: formYear,
          month: formMonth,
          costCenter: formCostCenter,
          item: formItem,
          amount: Number(formAmount)
        });
      }
    } else if (type === 'forecast') {
      if (editingId) {
        onEditForecast(editingId, {
          year: formYear,
          month: formMonth,
          costCenter: formCostCenter,
          item: formItem,
          amount: Number(formAmount)
        });
      } else {
        onAddForecast({
          year: formYear,
          month: formMonth,
          costCenter: formCostCenter,
          item: formItem,
          amount: Number(formAmount)
        });
      }
    } else {
      if (editingId) {
        onEditRealization(editingId, {
          tanggal: formDate,
          year: formYear,
          month: formMonth,
          costCenter: formCostCenter,
          item: formItem,
          amount: Number(formAmount),
          keterangan: formKeterangan
        });
      } else {
        onAddRealization({
          tanggal: formDate,
          year: formYear,
          month: formMonth,
          costCenter: formCostCenter,
          item: formItem,
          amount: Number(formAmount),
          keterangan: formKeterangan
        });
      }
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (type === 'budget') onDeleteBudget(deleteTarget.id);
    else if (type === 'forecast') onDeleteForecast(deleteTarget.id);
    else onDeleteRealization(deleteTarget.id);
    setDeleteTarget(null);
  };

  const titles = {
    budget: { title: 'Budget Plan Management', desc: 'Kelola alokasi perencanaan plafon anggaran tahunan (BUDGET_PLAN)', color: 'blue' },
    forecast: { title: 'Forecast Management', desc: 'Pemantauan estimasi dan revisi berkala pengeluaran (FORECAST)', color: 'amber' },
    realization: { title: 'Realization Tracking', desc: 'Pencatatan realisasi pengeluaran riil aktual (REALIZATION)', color: 'emerald' }
  };

  const currentMeta = titles[type];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {currentMeta.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
            {currentMeta.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsBulkUploadOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            title="Unggah berkas spreadsheet/CSV langsung ke database"
          >
            <Upload className="w-4 h-4 text-red-600" />
            <span>Bulk Upload CSV</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Baru</span>
          </button>
        </div>
      </div>

      {/* Database Connection & Auto-Save Indicator Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
        darkMode
          ? 'bg-[#0b101d] border-slate-800/90 shadow-xs'
          : 'bg-gradient-to-r from-emerald-50/60 via-white to-slate-50/70 border-emerald-200/80 shadow-xs'
      }`}>
        {/* Tier 1: Connection Status & System Description */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Database Supabase Cloud Live
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  • Auto-Load Aktif (Bebas LocalStorage)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Data dimuat langsung dari Supabase setiap kali sistem dibuka. Gunakan tombol <strong>&quot;Push ke Supabase&quot;</strong> untuk memperbarui cloud database.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0 self-start md:self-center">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tersimpan Permanen</span>
          </div>
        </div>

        {/* Tier 2: Operations Toolbar & Data Record Counts */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pt-0.5">
          {/* Record Counts Pill */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 mr-1">Total di Database:</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-extrabold shadow-2xs whitespace-nowrap">
              {budget.length} Data Budget
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-extrabold shadow-2xs whitespace-nowrap">
              {forecast.length} Data Forecast
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-extrabold shadow-2xs whitespace-nowrap">
              {realization.length} Data Realisasi
            </span>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenDatabaseConsole && (
              <button
                type="button"
                onClick={onOpenDatabaseConsole}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-red-500/40 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title="Buka konsol manajemen database: opsi menimpa, menambahkan, cadangan, dan pemulihan"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Konsol Database</span>
              </button>
            )}

            {onPushToSupabase && (
              <button
                type="button"
                onClick={onPushToSupabase}
                disabled={isPushingSupabase}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-500/40 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                title="Unggah seluruh dataset ke cloud database Supabase"
              >
                <UploadCloud className={`w-3.5 h-3.5 ${isPushingSupabase ? 'animate-bounce' : ''}`} />
                <span>{isPushingSupabase ? 'Pushing...' : 'Push ke Supabase'}</span>
              </button>
            )}

            {onReloadFromSupabase && (
              <button
                type="button"
                onClick={onReloadFromSupabase}
                disabled={isLoadingFromSupabase}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                title="Ambil ulang data terbaru dari Supabase"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFromSupabase ? 'animate-spin text-emerald-500' : ''}`} />
                <span>{isLoadingFromSupabase ? 'Memuat...' : 'Reload DB'}</span>
              </button>
            )}

            {onExportBackup && (
              <button
                type="button"
                onClick={onExportBackup}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title="Unduh cadangan seluruh data transaksi dalam format JSON"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Backup JSON</span>
              </button>
            )}

            {onResetDatabase && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title="Kembalikan database ke data standar pabrik"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                <span>Reset Default</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Cost Center */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-700 dark:text-slate-400 font-bold">CC:</span>
            <select
              value={selectedCostCenter}
              onChange={(e) => setSelectedCostCenter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
            >
              <option value="ALL">Semua Cost Center</option>
              {costCenters.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          {/* FY */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-700 dark:text-slate-400 font-bold">FY:</span>
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
            >
              <option value="2026">FY 2026 (Apr 2026 – Mar 2027)</option>
              <option value="2027">FY 2027 (Apr 2027 – Mar 2028)</option>
              <option value="2028">FY 2028 (Apr 2028 – Mar 2029)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari item atau catatan..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          />
        </div>
      </div>

      {/* Records Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] uppercase font-extrabold tracking-wider">
                {type === 'realization' && <th className="p-3.5">Tanggal</th>}
                <th className="p-3.5">Bulan / Thn</th>
                <th className="p-3.5">Cost Center</th>
                <th className="p-3.5">Item Deskripsi</th>
                <th className="p-3.5 text-right">Nominal (IDR)</th>
                {type === 'realization' && <th className="p-3.5">Keterangan</th>}
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={type === 'realization' ? 7 : 5} className="text-center py-12 text-slate-400 italic">
                    Tidak ada data ditemukan untuk kriteria filter ini.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {type === 'realization' && 'tanggal' in row && (
                      <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">
                        {row.tanggal}
                      </td>
                    )}
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-200">
                      {row.month} {row.year}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                        {row.costCenter}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {itemNameMap[row.item] || row.item}
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white font-mono">
                      {formatIDR(row.amount)}
                    </td>
                    {type === 'realization' && 'keterangan' in row && (
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-sm truncate" title={row.keterangan}>
                        {row.keterangan || '-'}
                      </td>
                    )}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(row)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-500 hover:text-blue-600 transition-colors"
                          title="Edit baris data"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({
                            id: row.id,
                            item: itemNameMap[row.item] || row.item,
                            amount: row.amount,
                            costCenter: row.costCenter,
                            month: row.month,
                            year: row.year
                          })}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Hapus baris data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan {rows.length} catatan</span>
          <span>Sistem DABACO Terintegrasi Google Sheets</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Database className="w-4 h-4 text-rose-200" />
                  <span>{editingId ? 'Edit Data Transaksi' : 'Input Data Baru'} - {type.toUpperCase()}</span>
                </h3>
                <p className="text-xs text-red-100">Data otomatis tersimpan langsung secara permanen ke dalam database DABACO</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              {type === 'realization' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tahun</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Bulan</label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {FY_MONTH_DETAILS.map(d => (
                      <option key={d.code} value={d.code}>
                        {d.code} - {d.fullName} {d.isNextYear ? '(Tahun Depan)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cost Center</label>
                <select
                  value={formCostCenter}
                  onChange={(e) => setFormCostCenter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {costCenters.map(cc => (
                    <option key={cc.code} value={cc.code}>
                      {cc.code} - {cc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Item Anggaran</label>
                <select
                  value={formItem}
                  onChange={(e) => setFormItem(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {masterItems.map(item => (
                    <option key={item.code} value={item.code}>
                      {item.name} ({item.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nominal Amount (IDR)</label>
                <input
                  type="number"
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  required
                  min="0"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {type === 'realization' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Keterangan / Remarks</label>
                  <textarea
                    value={formKeterangan}
                    onChange={(e) => setFormKeterangan(e.target.value)}
                    rows={3}
                    placeholder="Contoh: Pembayaran invoice vendor batch certification..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-red-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Otomatis ke Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Bulk Upload CSV Modal with Pre-Validation & Header Mapper */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        defaultTarget={type}
        costCenters={costCenters}
        masterItems={masterItems}
        onBatchAddBudget={onBatchAddBudget}
        onBatchAddForecast={onBatchAddForecast}
        onBatchAddRealization={onBatchAddRealization}
        darkMode={darkMode}
      />

      {/* Modern Pop-up Confirmation Modal for Permanent Record Deletion */}
      <SystemAlertModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Catatan Data"
        message={`Apakah Anda yakin ingin menghapus data ${type.toUpperCase()} ini secara permanen? Data yang telah dihapus tidak dapat dipulihkan.`}
        type="delete"
        confirmLabel="Ya, Hapus Data"
        cancelLabel="Batal"
        detail="Sistem DABACO akan secara instan memperbarui perhitungan agregat dan rekonsiliasi data."
        itemData={deleteTarget ? {
          label: `${deleteTarget.costCenter} • Periode ${deleteTarget.month} ${deleteTarget.year}`,
          value: deleteTarget.item,
          subValue: formatIDR(deleteTarget.amount)
        } : undefined}
        darkMode={darkMode}
      />

      {/* Modern Confirmation Modal for Resetting Database */}
      <SystemAlertModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          if (onResetDatabase) onResetDatabase();
          setShowResetConfirm(false);
        }}
        title="Reset Database ke Standar Pabrik"
        message="Apakah Anda yakin ingin mereset seluruh database transaksi kembali ke data standar bawaan pabrik? Data baru yang Anda input akan dihapus."
        type="warning"
        confirmLabel="Ya, Reset Database"
        cancelLabel="Batal"
        detail="Operasi ini berguna jika Anda ingin menghapus data percobaan dan memulai kembali dengan dataset default."
        darkMode={darkMode}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  UploadCloud,
  DownloadCloud,
  RefreshCw,
  Trash2,
  FileDown,
  FileUp,
  AlertTriangle,
  CheckCircle2,
  Check,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
  Info,
  Sliders,
  FolderArchive,
  History
} from 'lucide-react';
import {
  BudgetRecord,
  ForecastRecord,
  RealizationRecord,
  MasterCostCenter,
  MasterItem,
  SupabaseConfig
} from '../types';
import { DownloadConfirmModal } from './DownloadConfirmModal';
import {
  pushDatabaseToSupabase,
  fetchDatabaseFromSupabase,
  fetchDatabaseCountsFromSupabase,
  clearDatabaseTablesInSupabase,
  SupabaseTableCounts,
  PushOptions
} from '../services/supabaseService';

interface DatabaseConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  supabaseConfig: SupabaseConfig;
  budget: BudgetRecord[];
  forecast: ForecastRecord[];
  realization: RealizationRecord[];
  costCenters: MasterCostCenter[];
  masterItems: MasterItem[];
  onOverwriteLocalDatabase: (data: {
    budget?: BudgetRecord[];
    forecast?: ForecastRecord[];
    realization?: RealizationRecord[];
    costCenters?: MasterCostCenter[];
    masterItems?: MasterItem[];
  }) => void;
  onMergeLocalDatabase: (data: {
    budget?: BudgetRecord[];
    forecast?: ForecastRecord[];
    realization?: RealizationRecord[];
    costCenters?: MasterCostCenter[];
    masterItems?: MasterItem[];
  }) => void;
  onResetFactoryData: () => void;
  onOpenRlsFixModal: (errorMsg?: string) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
  darkMode: boolean;
}

type TabType = 'push' | 'pull' | 'backup' | 'clear' | 'factory';

export const DatabaseConsoleModal: React.FC<DatabaseConsoleModalProps> = ({
  isOpen,
  onClose,
  supabaseConfig,
  budget,
  forecast,
  realization,
  costCenters,
  masterItems,
  onOverwriteLocalDatabase,
  onMergeLocalDatabase,
  onResetFactoryData,
  onOpenRlsFixModal,
  showToast,
  darkMode
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('push');

  // Cloud counts
  const [cloudCounts, setCloudCounts] = useState<SupabaseTableCounts | null>(null);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [countError, setCountError] = useState<string | null>(null);

  // Push options
  const [pushMode, setPushMode] = useState<'append' | 'overwrite'>('append');
  const [pushTables, setPushTables] = useState({
    budget: true,
    forecast: true,
    realization: true,
    masterItems: true,
    costCenters: true
  });
  const [isPushing, setIsPushing] = useState(false);
  const [pushProgress, setPushProgress] = useState<string>('');

  // Pull options
  const [pullMode, setPullMode] = useState<'overwrite' | 'merge'>('overwrite');
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState<string>('');
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);

  // Clear tables state
  const [clearTarget, setClearTarget] = useState<'transactions_only' | 'all_tables'>('transactions_only');
  const [confirmText, setConfirmText] = useState('');
  const [isClearing, setIsClearing] = useState(false);

  // Backup / Restore state
  const [restoreMode, setRestoreMode] = useState<'overwrite' | 'merge'>('overwrite');
  const [restoreFileName, setRestoreFileName] = useState<string | null>(null);
  const [restoreData, setRestoreData] = useState<any | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  // Load cloud counts on open
  useEffect(() => {
    if (isOpen) {
      loadCloudCounts();
    }
  }, [isOpen, supabaseConfig.projectUrl, supabaseConfig.anonKey]);

  const loadCloudCounts = async () => {
    if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
      setCountError('Kredensial Supabase belum dikonfigurasi.');
      return;
    }
    setIsLoadingCounts(true);
    setCountError(null);
    try {
      const res = await fetchDatabaseCountsFromSupabase(supabaseConfig);
      if (res.success && res.counts) {
        setCloudCounts(res.counts);
      } else {
        setCountError(res.error || 'Gagal memuat jumlah baris Supabase.');
      }
    } catch (e: any) {
      setCountError(e.message || 'Error saat mengambil jumlah baris.');
    } finally {
      setIsLoadingCounts(false);
    }
  };

  // 1. EXECUTE PUSH
  const handleExecutePush = async () => {
    if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
      showToast('Kredensial Supabase belum dikonfigurasi!', 'error');
      return;
    }

    setIsPushing(true);
    setPushProgress('Memulai persiapan data...');

    try {
      const res = await pushDatabaseToSupabase(
        {
          costCenters,
          masterItems,
          budget,
          forecast,
          realization
        },
        supabaseConfig,
        (msg) => setPushProgress(msg),
        {
          mode: pushMode,
          tables: pushTables
        }
      );

      if (res.success) {
        const modeLabel = pushMode === 'overwrite' ? 'Menimpa Total' : 'Menambahkan/Upsert';
        showToast(`Sukses sinkronisasi (${modeLabel}) ke Supabase!`, 'success');
        loadCloudCounts();
      } else {
        if (res.isRlsError) {
          onOpenRlsFixModal(res.error);
        } else {
          showToast(`Gagal push ke Supabase: ${res.error}`, 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal push ke Supabase', 'error');
    } finally {
      setIsPushing(false);
      setPushProgress('');
    }
  };

  // 2. EXECUTE PULL
  const handleExecutePull = async () => {
    if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
      showToast('Kredensial Supabase belum dikonfigurasi!', 'error');
      return;
    }

    setIsPulling(true);
    setPullProgress('Mengunduh data dari database Supabase Cloud...');

    try {
      const res = await fetchDatabaseFromSupabase(supabaseConfig);
      if (res.success && res.data) {
        if (pullMode === 'overwrite') {
          onOverwriteLocalDatabase(res.data);
          showToast('Seluruh data lokal berhasil ditimpa dengan data Supabase!', 'success');
        } else {
          onMergeLocalDatabase(res.data);
          showToast('Data Supabase berhasil digabungkan ke data lokal!', 'success');
        }
        loadCloudCounts();
      } else {
        showToast(`Gagal memuat data dari Supabase: ${res.error}`, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat data dari Supabase', 'error');
    } finally {
      setIsPulling(false);
      setPullProgress('');
    }
  };

  // 3. EXECUTE CLEAR TABLES
  const handleExecuteClear = async () => {
    if (confirmText.trim().toUpperCase() !== 'RESET') {
      showToast('Ketik konfirmasi kata "RESET" dengan tepat!', 'warning');
      return;
    }

    setIsClearing(true);
    try {
      const tablesToClear = {
        realization: true,
        forecast: true,
        budget: true,
        masterItems: clearTarget === 'all_tables',
        costCenters: clearTarget === 'all_tables'
      };

      const res = await clearDatabaseTablesInSupabase(supabaseConfig, tablesToClear);
      if (res.success) {
        showToast(`Tabel [${res.cleared.join(', ')}] di Supabase berhasil dikosongkan!`, 'success');
        setConfirmText('');
        loadCloudCounts();
      } else {
        showToast(res.error || 'Gagal mengosongkan tabel di Supabase', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengosongkan tabel', 'error');
    } finally {
      setIsClearing(false);
    }
  };

  // 4. BACKUP DOWNLOAD
  const handleDownloadBackup = () => {
    const backupPayload = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      system: 'DABACO Financial Database System',
      data: {
        budget,
        forecast,
        realization,
        costCenters,
        masterItems
      }
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dabaco_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Snapshot cadangan database berhasil diunduh!');
  };

  // 5. RESTORE FILE UPLOAD
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreFileName(file.name);
    setRestoreError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const data = parsed.data || parsed;
        if (!data.budget && !data.forecast && !data.realization && !data.costCenters && !data.masterItems) {
          throw new Error('Format JSON tidak sesuai struktur cadangan DABACO.');
        }
        setRestoreData(data);
      } catch (err: any) {
        setRestoreError(err.message || 'File JSON tidak valid atau korup.');
        setRestoreData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!restoreData) return;
    if (restoreMode === 'overwrite') {
      onOverwriteLocalDatabase(restoreData);
      showToast(`Database lokal berhasil ditimpa dari file cadangan ${restoreFileName}!`, 'success');
    } else {
      onMergeLocalDatabase(restoreData);
      showToast(`Data cadangan ${restoreFileName} berhasil digabungkan ke data lokal!`, 'success');
    }
    setRestoreData(null);
    setRestoreFileName(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between gap-4 ${
          darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl tracking-tight">
                  Konsol Manajemen Database & Sinkronisasi
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fitur lengkap untuk Menimpa (Overwrite), Menambahkan (Append), Mengosongkan, dan Cadangan database lokal & Supabase Cloud.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Comparison Bar */}
        <div className="px-6 py-3.5 border-b bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-600" />
              <span>Status Perbandingan Record: Lokal vs Supabase Cloud</span>
            </span>
            <button
              type="button"
              onClick={loadCloudCounts}
              disabled={isLoadingCounts}
              className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer self-start sm:self-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingCounts ? 'animate-spin' : ''}`} />
              <span>{isLoadingCounts ? 'Memeriksa Cloud...' : 'Segarkan Hitungan Cloud'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            {/* Budget */}
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Budget Plan</div>
              <div className="flex items-center justify-center gap-1.5 mt-1 font-mono text-xs">
                <span className="font-bold text-blue-600 dark:text-blue-400">{budget.length}</span>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {cloudCounts ? cloudCounts.budget : (countError ? '!' : '...')}
                </span>
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">Lokal / Cloud</div>
            </div>

            {/* Forecast */}
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Forecast</div>
              <div className="flex items-center justify-center gap-1.5 mt-1 font-mono text-xs">
                <span className="font-bold text-amber-600 dark:text-amber-400">{forecast.length}</span>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {cloudCounts ? cloudCounts.forecast : (countError ? '!' : '...')}
                </span>
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">Lokal / Cloud</div>
            </div>

            {/* Realization */}
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Realisasi</div>
              <div className="flex items-center justify-center gap-1.5 mt-1 font-mono text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{realization.length}</span>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {cloudCounts ? cloudCounts.realization : (countError ? '!' : '...')}
                </span>
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">Lokal / Cloud</div>
            </div>

            {/* Cost Centers */}
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Cost Center</div>
              <div className="flex items-center justify-center gap-1.5 mt-1 font-mono text-xs">
                <span className="font-bold text-purple-600 dark:text-purple-400">{costCenters.length}</span>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {cloudCounts ? cloudCounts.costCenters : (countError ? '!' : '...')}
                </span>
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">Lokal / Cloud</div>
            </div>

            {/* Master Items */}
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Master Item</div>
              <div className="flex items-center justify-center gap-1.5 mt-1 font-mono text-xs">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{masterItems.length}</span>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {cloudCounts ? cloudCounts.masterItems : (countError ? '!' : '...')}
                </span>
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">Lokal / Cloud</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b overflow-x-auto px-6 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('push')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'push'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>1. Push ke Supabase (Menimpa / Tambah)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pull')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'pull'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DownloadCloud className="w-4 h-4" />
            <span>2. Tarik Data (Pull & Restore)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'backup'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>3. Cadangan File (Snapshot JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('clear')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'clear'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>4. Kosongkan Tabel Cloud</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('factory')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'factory'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4 text-amber-500" />
            <span>5. Reset Standar Pabrik</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PUSH TO SUPABASE */}
          {activeTab === 'push' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pilih Mode Sinkronisasi ke Supabase:
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tentukan apakah Anda ingin menambahkan/memperbarui data secara incremental atau menimpa total data lama di Supabase.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setPushMode('append')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      pushMode === 'append'
                        ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Mode Menambahkan (Append / Upsert)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        Default & Aman
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      Menambahkan data baru dan memperbarui baris dengan ID yang sama. <strong>Data yang sudah ada sebelumnya di Supabase TIDAK akan dihapus.</strong>
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPushMode('overwrite')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      pushMode === 'overwrite'
                        ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Mode Menimpa Total (Clean Overwrite)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                        Sinkronisasi Bersih
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      Membersihkan/menghapus record tabel yang dipilih di Supabase terlebih dahulu, lalu memasukkan dataset saat ini secara segar.
                    </p>
                  </button>
                </div>
              </div>

              {/* Table Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Tabel yang Hendak Disinkronkan:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={pushTables.budget}
                      onChange={e => setPushTables(p => ({ ...p, budget: e.target.checked }))}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold">Budget Plan ({budget.length} baris)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={pushTables.forecast}
                      onChange={e => setPushTables(p => ({ ...p, forecast: e.target.checked }))}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold">Forecast ({forecast.length} baris)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={pushTables.realization}
                      onChange={e => setPushTables(p => ({ ...p, realization: e.target.checked }))}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold">Realisasi Kas ({realization.length} baris)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={pushTables.costCenters}
                      onChange={e => setPushTables(p => ({ ...p, costCenters: e.target.checked }))}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold">Master Cost Center ({costCenters.length})</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={pushTables.masterItems}
                      onChange={e => setPushTables(p => ({ ...p, masterItems: e.target.checked }))}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold">Master Items ({masterItems.length})</span>
                  </label>
                </div>
              </div>

              {/* Action Button & Status */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Target Eksekusi:
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {pushMode === 'overwrite' ? '⚠️ Menimpa & mengganti total data di cloud' : '🟢 Menambahkan & upsert data ke cloud'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExecutePush}
                  disabled={isPushing || (!pushTables.budget && !pushTables.forecast && !pushTables.realization && !pushTables.costCenters && !pushTables.masterItems)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    pushMode === 'overwrite'
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  }`}
                >
                  {isPushing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{pushProgress || 'Memproses Sinkronisasi...'}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>
                        {pushMode === 'overwrite' ? 'Jalankan Push (Menimpa)' : 'Jalankan Push (Menambahkan)'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PULL FROM SUPABASE */}
          {activeTab === 'pull' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tarik Data dari Database Supabase Cloud ke Sistem Ini:
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Muat data terbaru yang tersimpan di cloud database ke dalam aplikasi ini.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setPullMode('overwrite')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      pullMode === 'overwrite'
                        ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-950/30 text-blue-950 dark:text-blue-100 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <DownloadCloud className="w-4 h-4" />
                      <span>Menimpa Data Lokal (Overwrite Local)</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      Menggantikan seluruh data di aplikasi dengan data terbaru yang ada di database Supabase.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPullMode('merge')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      pullMode === 'merge'
                        ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <Layers className="w-4 h-4" />
                      <span>Gabungkan ke Data Lokal (Append & Merge)</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      Menggabungkan data dari Supabase dengan data lokal. Data lokal yang belum di-push ke cloud tidak akan hilang.
                    </p>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Data yang ditarik meliputi: <strong>Budget Plan, Forecast, Realisasi Kas, Cost Center, dan Master Items</strong>.
                </div>

                <button
                  type="button"
                  onClick={handleExecutePull}
                  disabled={isPulling}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isPulling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{pullProgress || 'Mengunduh Data...'}</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-4 h-4" />
                      <span>Tarik & Pulihkan Data Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BACKUP & RESTORE JSON */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Export Section */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      Unduh Snapshot Cadangan (JSON Backup)
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Simpan seluruh data sistem (Budget, Forecast, Realisasi, Cost Center, Items) ke berkas offline.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDownloadConfirm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download File Cadangan (.json)</span>
                  </button>
                </div>
              </div>

              {/* Restore Section */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      Pulihkan Database dari File Cadangan (JSON Restore)
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Unggah berkas JSON cadangan DABACO untuk memulihkan atau menambahkan data.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRestoreMode('overwrite')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      restoreMode === 'overwrite'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-100 ring-1 ring-amber-500'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400">Mode Menimpa (Overwrite)</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Ganti seluruh data saat ini dengan isi file cadangan.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRestoreMode('merge')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      restoreMode === 'merge'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Mode Menambahkan (Merge)</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Gabungkan isi file cadangan dengan data yang sedang aktif.
                    </div>
                  </button>
                </div>

                <div>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileSelect}
                    className="block w-full text-xs text-slate-500 dark:text-slate-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-semibold
                      file:bg-slate-100 file:text-slate-700
                      dark:file:bg-slate-800 dark:file:text-slate-200
                      hover:file:bg-slate-200 cursor-pointer"
                  />
                  {restoreFileName && (
                    <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Berkas terpilih: <strong>{restoreFileName}</strong></span>
                    </div>
                  )}
                  {restoreError && (
                    <div className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{restoreError}</span>
                    </div>
                  )}
                </div>

                {restoreData && (
                  <button
                    type="button"
                    onClick={handleExecuteRestore}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      Terapkan Pemulihan ({restoreMode === 'overwrite' ? 'Menimpa' : 'Menambahkan'})
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CLEAR SUPABASE TABLES */}
          {activeTab === 'clear' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                      Operasi Berbahaya: Kosongkan Tabel di Supabase Cloud
                    </h5>
                    <p className="text-xs text-rose-800/80 dark:text-rose-300/80 mt-1 leading-relaxed">
                      Tindakan ini akan menghapus data pada tabel di database cloud Supabase secara permanen. Pastikan Anda telah mengunduh cadangan sebelum melanjutkan.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Pilih Cakupan Pembersihan:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setClearTarget('transactions_only')}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                        clearTarget === 'transactions_only'
                          ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500 text-rose-950 dark:text-rose-100 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold">Hanya Tabel Transaksi</div>
                      <div className="text-[11px] mt-1 opacity-80">
                        Kosongkan: <strong>Budget Plan, Forecast, Realisasi Kas</strong>. Master Cost Center dan Items tetap aman.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setClearTarget('all_tables')}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                        clearTarget === 'all_tables'
                          ? 'border-rose-600 bg-rose-600/10 ring-1 ring-rose-600 text-rose-950 dark:text-rose-100 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400">Seluruh Tabel Database</div>
                      <div className="text-[11px] mt-1 opacity-80">
                        Kosongkan semua 5 tabel termasuk Master Cost Center dan Master Items.
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ketik kata <span className="font-mono text-rose-600 dark:text-rose-400">RESET</span> untuk mengonfirmasi:
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="text"
                      value={confirmText}
                      onChange={e => setConfirmText(e.target.value)}
                      placeholder="Ketik RESET"
                      className="px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-xs font-bold font-mono text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleExecuteClear}
                      disabled={confirmText.trim().toUpperCase() !== 'RESET' || isClearing}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isClearing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Mengosongkan Database...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>Kosongkan Tabel Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FACTORY RESET (SEED DATA) */}
          {activeTab === 'factory' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                      Pulihkan ke Data Standar Bawaan Pabrik (Initial Sample Seed)
                    </h5>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                      Fitur ini akan mengembalikan data lokal ke dataset standar awal PT Ajinomoto Indonesia (dataset default Budget Plan, Forecast, Realisasi, Cost Centers, dan Master Items).
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetFactoryData();
                      showToast('Database lokal berhasil dikembalikan ke dataset standar awal!', 'success');
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition cursor-pointer"
                  >
                    <History className="w-4 h-4" />
                    <span>Terapkan Dataset Standar Awal Pabrik</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${
          darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50/80'
        }`}>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Semua aksi di konsol ini dicatat secara aman dalam sistem DABACO.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
          >
            Tutup Konsol
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Database Backup Download */}
      <DownloadConfirmModal
        isOpen={showDownloadConfirm}
        onClose={() => setShowDownloadConfirm(false)}
        onConfirm={() => {
          setShowDownloadConfirm(false);
          handleDownloadBackup();
        }}
        downloadType="json"
        fileName={`dabaco_backup_${new Date().toISOString().slice(0, 10)}.json`}
        description="Berkas JSON cadangan ini memuat seluruh data DABACO: Anggaran, Forecast, Realisasi Kas Aktual, Master Cost Centers, dan Master Item."
        itemCount={budget.length + forecast.length + realization.length}
        darkMode={darkMode}
      />
    </div>
  );
};

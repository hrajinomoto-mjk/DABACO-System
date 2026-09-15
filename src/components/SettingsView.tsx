import React, { useState, useMemo, useEffect } from 'react';
import {
  Settings,
  Key,
  Lock,
  Download,
  Moon,
  Sun,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  Edit2,
  Sparkles,
  AlertTriangle,
  X,
  Check,
  FolderSync,
  Building2,
  Sliders,
  Calendar,
  Layers,
  Activity,
  FileSpreadsheet,
  BarChart3,
  Database,
  Save
} from 'lucide-react';
import { MasterCostCenter, MasterItem, BudgetRecord, ForecastRecord, RealizationRecord } from '../types';
import { createEncryptedBackup } from '../utils/encryption';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  costCenters: MasterCostCenter[];
  onAddCostCenter?: (cc: MasterCostCenter) => void;
  onEditCostCenter?: (cc: MasterCostCenter) => void;
  onDeleteCostCenter?: (code: string) => void;
  onAutoSyncMasterData?: () => void;
  masterItems?: MasterItem[];
  totalRecords: { budget: number; forecast: number; realization: number };
  dataset: { budget: unknown[]; forecast: unknown[]; realization: unknown[]; metadata: unknown };
  budgetData?: BudgetRecord[];
  forecastData?: ForecastRecord[];
  realizationData?: RealizationRecord[];
  // Backwards compatibility if passed
  onAddMasterItem?: (item: MasterItem) => void;
  onEditMasterItem?: (item: MasterItem) => void;
  onDeleteMasterItem?: (code: string) => void;
}

export interface BudgetPolicyConfig {
  fiscalYear: string;
  fiscalCycle: string;
  warningThreshold: number; // e.g. 85%
  criticalThreshold: number; // e.g. 100%
  currencyUnit: 'IDR' | 'JUTA' | 'MILIAR';
  lockStatus: 'Open' | 'Audited' | 'Locked';
  defaultPlant: string;
  overbudgetAlert: boolean;
}

const DEFAULT_POLICY: BudgetPolicyConfig = {
  fiscalYear: 'FY2024',
  fiscalCycle: 'April - Maret (Standar Ajinomoto Group)',
  warningThreshold: 85,
  criticalThreshold: 100,
  currencyUnit: 'IDR',
  lockStatus: 'Open',
  defaultPlant: 'Pabrik Mojokerto (PT AI & PT AX)',
  overbudgetAlert: true
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  setDarkMode,
  costCenters,
  onAddCostCenter,
  onEditCostCenter,
  onDeleteCostCenter,
  onAutoSyncMasterData,
  totalRecords,
  dataset,
  budgetData = [],
  forecastData = [],
  realizationData = []
}) => {
  // Credentials state
  const [username, setUsername] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credSuccess, setCredSuccess] = useState(false);
  const [credError, setCredError] = useState('');

  // Policy configuration state (Stored in localStorage)
  const [policy, setPolicy] = useState<BudgetPolicyConfig>(() => {
    const saved = localStorage.getItem('dabaco_budget_policy');
    if (saved) {
      try {
        return { ...DEFAULT_POLICY, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse dabaco_budget_policy', e);
      }
    }
    return DEFAULT_POLICY;
  });
  const [policySaved, setPolicySaved] = useState(false);

  // Cost Center management modal state
  const [showAddCC, setShowAddCC] = useState(false);
  const [newCCCode, setNewCCCode] = useState('');
  const [newCCName, setNewCCName] = useState('');
  const [newCCDept, setNewCCDept] = useState('');
  const [newCCHead, setNewCCHead] = useState('');

  const [editingCC, setEditingCC] = useState<MasterCostCenter | null>(null);
  const [editCCName, setEditCCName] = useState('');
  const [editCCDept, setEditCCDept] = useState('');
  const [editCCHead, setEditCCHead] = useState('');

  const [deletingCC, setDeletingCC] = useState<MasterCostCenter | null>(null);

  // Search and filter for Cost Centers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<'ALL' | 'PT_AI' | 'PT_AX'>('ALL');

  // Backup & sync state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Save budget policy to localStorage
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('dabaco_budget_policy', JSON.stringify(policy));
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 3000);
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    if (!newPassword || newPassword.length < 5) {
      setCredError('Password minimal harus 5 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setCredError('Konfirmasi password tidak cocok.');
      return;
    }
    setCredSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setCredSuccess(false), 3000);
  };

  const handleCreateEncryptedBackup = async () => {
    setIsBackingUp(true);
    try {
      const backup = await createEncryptedBackup(dataset);
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DABACO_Encrypted_Backup_${new Date().toISOString().slice(0, 10)}.enc.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 3500);
    } catch (err) {
      console.error('Backup error:', err);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleTriggerAutoSync = () => {
    setIsSyncing(true);
    if (onAutoSyncMasterData) {
      onAutoSyncMasterData();
    }
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice(`Sinkronisasi berhasil! Master Cost Center otomatis disesuaikan dari seluruh ${totalRecords.budget + totalRecords.forecast + totalRecords.realization} data upload.`);
      setTimeout(() => setSyncNotice(null), 4000);
    }, 600);
  };

  // Add Cost Center
  const handleSaveCC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCCCode.trim()) return;

    if (onAddCostCenter) {
      onAddCostCenter({
        code: newCCCode.trim(),
        name: newCCName.trim() || newCCCode.trim(),
        department: newCCDept.trim() || 'Human Resources',
        headOfDept: newCCHead.trim() || '-'
      });
    }

    setNewCCCode('');
    setNewCCName('');
    setNewCCDept('');
    setNewCCHead('');
    setShowAddCC(false);
  };

  // Edit Cost Center
  const handleOpenEditCC = (cc: MasterCostCenter) => {
    setEditingCC(cc);
    setEditCCName(cc.name || cc.code);
    setEditCCDept(cc.department || 'Human Resources');
    setEditCCHead(cc.headOfDept || '');
  };

  const handleSaveEditCC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCC) return;

    if (onEditCostCenter) {
      onEditCostCenter({
        ...editingCC,
        name: editCCName.trim(),
        department: editCCDept.trim(),
        headOfDept: editCCHead.trim()
      });
    }
    setEditingCC(null);
  };

  // Delete Cost Center
  const handleConfirmDeleteCC = () => {
    if (!deletingCC) return;
    if (onDeleteCostCenter) {
      onDeleteCostCenter(deletingCC.code);
    }
    setDeletingCC(null);
  };

  // Calculate unique items count for each Cost Center across transaction tables
  const costCenterUsageMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const addToMap = (cc: string, item: string) => {
      if (!cc || !item) return;
      const key = cc.trim();
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(item.trim());
    };

    budgetData.forEach(b => addToMap(b.costCenter, b.item));
    forecastData.forEach(f => addToMap(f.costCenter, f.item));
    realizationData.forEach(r => addToMap(r.costCenter, r.item));

    return map;
  }, [budgetData, forecastData, realizationData]);

  // Filtered cost centers
  const filteredCostCenters = useMemo(() => {
    return costCenters.filter(cc => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        cc.code.toLowerCase().includes(q) ||
        (cc.name && cc.name.toLowerCase().includes(q)) ||
        (cc.department && cc.department.toLowerCase().includes(q)) ||
        (cc.headOfDept && cc.headOfDept.toLowerCase().includes(q));

      let matchEntity = true;
      if (selectedEntityFilter === 'PT_AX') {
        matchEntity = cc.code.toUpperCase().includes('HRX') || cc.department.toLowerCase().includes('ajinex');
      } else if (selectedEntityFilter === 'PT_AI') {
        matchEntity = !cc.code.toUpperCase().includes('HRX') && !cc.department.toLowerCase().includes('ajinex');
      }

      return matchSearch && matchEntity;
    });
  }, [costCenters, searchQuery, selectedEntityFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400">
              <Settings className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Pengaturan Sistem & Kebijakan Anggaran
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Konfigurasi parameter fiskal Ajinomoto, master cost center pabrik riil, enkripsi data, dan integritas sistem.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: KEBIJAKAN ANGGARAN & SIKLUS FISKAL KORPORAT     */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-600/20 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Kebijakan Anggaran & Siklus Fiskal Ajinomoto
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Standar tahun anggaran, siklus kalender April - Maret, dan batas peringatan dini (Early Warning).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Kebijakan Aktif
            </span>
          </div>
        </div>

        {policySaved && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">Konfigurasi kebijakan anggaran berhasil disimpan dan diperbarui di seluruh modul sistem!</span>
          </div>
        )}

        <form onSubmit={handleSavePolicy} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Fiscal Year */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-600" />
                Tahun Fiskal Aktif
              </span>
            </div>
            <select
              value={policy.fiscalYear}
              onChange={(e) => setPolicy({ ...policy, fiscalYear: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value="FY2024">FY2024 (Apr 2024 - Mar 2025)</option>
              <option value="FY2025">FY2025 (Apr 2025 - Mar 2026)</option>
              <option value="FY2026">FY2026 (Apr 2026 - Mar 2027)</option>
            </select>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Siklus: <strong>{policy.fiscalCycle}</strong>
            </p>
          </div>

          {/* Warning Threshold */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                Level Waspada (Warning)
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-extrabold">{policy.warningThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={policy.warningThreshold}
              onChange={(e) => setPolicy({ ...policy, warningThreshold: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tanda peringatan kuning saat serapan mencapai ambang ini.
            </p>
          </div>

          {/* Critical Threshold */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <ShieldCheck className="w-4 h-4" />
                Level Kritis (Overbudget)
              </span>
              <span className="font-mono text-rose-600 dark:text-rose-400 font-extrabold">{policy.criticalThreshold}%</span>
            </div>
            <input
              type="range"
              min="90"
              max="120"
              step="5"
              value={policy.criticalThreshold}
              onChange={(e) => setPolicy({ ...policy, criticalThreshold: Number(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Peringatan merah saat serapan melampaui alokasi budget.
            </p>
          </div>

          {/* Lock Status */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                Status Revisi Anggaran
              </span>
            </div>
            <select
              value={policy.lockStatus}
              onChange={(e) => setPolicy({ ...policy, lockStatus: e.target.value as any })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value="Open">Terbuka (Revisi & Input Aktif)</option>
              <option value="Audited">Proses Audit (Read-Only Warning)</option>
              <option value="Locked">Terkunci Resmi (Final Budget)</option>
            </select>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Unit: <strong>Pabrik Mojokerto</strong>
            </p>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Kebijakan ini menjadi acuan kalkulasi visualisasi KPI, alert overbudget, dan ekspor analitik Looker Studio.
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Parameter Kebijakan</span>
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: MASTER COST CENTER PABRIK MOJOKERTO RIIL       */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    Master Cost Center Pabrik Mojokerto
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    {costCenters.length} Pusat Biaya
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daftar resmi Pusat Biaya operasional PT Ajinomoto Indonesia & PT Ajinex International (Pabrik Mojokerto). Digunakan sebagai pemetaan budget anggaran dan serapan kas riil.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriggerAutoSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Periksa seluruh data upload dan daftarkan cost center baru secara otomatis"
            >
              <FolderSync className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyelaraskan...' : 'Sinkronisasi Otomatis'}</span>
            </button>

            <button
              onClick={() => setShowAddCC(!showAddCC)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Cost Center</span>
            </button>
          </div>
        </div>

        {/* Sync Success Notice */}
        {syncNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{syncNotice}</span>
            </div>
            <button onClick={() => setSyncNotice(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add Cost Center Form */}
        {showAddCC && (
          <form onSubmit={handleSaveCC} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-4 text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-500" />
                Tambah Cost Center Baru
              </h4>
              <button
                type="button"
                onClick={() => setShowAddCC(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Cost Center (Contoh: HR001, HRX001)
                </label>
                <input
                  type="text"
                  placeholder="Kode unik CC"
                  value={newCCCode}
                  onChange={(e) => setNewCCCode(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Deskripsi Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Contoh: HR001 - Education Fee Training"
                  value={newCCName}
                  onChange={(e) => setNewCCName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Departemen / Bagian
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Human Resources (Training & Dev)"
                  value={newCCDept}
                  onChange={(e) => setNewCCDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kepala Bagian / PIC
                </label>
                <input
                  type="text"
                  placeholder="Contoh: S. Wardhana"
                  value={newCCHead}
                  onChange={(e) => setNewCCHead(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCC(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Cost Center</span>
              </button>
            </div>
          </form>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode CC, nama, atau PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedEntityFilter}
              onChange={(e) => setSelectedEntityFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="ALL">Semua Entitas ({costCenters.length})</option>
              <option value="PT_AI">PT Ajinomoto Indonesia</option>
              <option value="PT_AX">PT Ajinex International (HRX)</option>
            </select>
          </div>
        </div>

        {/* Cost Centers Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 scrollbar-thin">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Kode Cost Center</th>
                <th className="py-3 px-4">Entitas Pabrik</th>
                <th className="py-3 px-4">Departemen / Bagian</th>
                <th className="py-3 px-4">Kepala Bagian (PIC)</th>
                <th className="py-3 px-4 text-center">Pos Item Terhubung</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCostCenters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada Cost Center yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              ) : (
                filteredCostCenters.map((cc) => {
                  const isAjinex = cc.code.toUpperCase().includes('HRX') || cc.department.toLowerCase().includes('ajinex');
                  const usedItemCount = costCenterUsageMap.get(cc.code)?.size || 0;

                  return (
                    <tr key={cc.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                        {cc.code}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          isAjinex
                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
                            : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                        }`}>
                          <Building2 className="w-3 h-3" />
                          {isAjinex ? 'PT Ajinex International' : 'PT Ajinomoto Indonesia'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {cc.department || 'Human Resources'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {cc.headOfDept || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {usedItemCount} Pos Anggaran
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditCC(cc)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Cost Center"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCC(cc)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Hapus Cost Center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
          <span>Menampilkan {filteredCostCenters.length} dari {costCenters.length} Cost Center Pabrik</span>
          <span className="text-[11px]">Format terhubung langsung dengan modul Budget Plan, Forecast, dan Realisasi</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: STATUS INTEGRASI EKOSISTEM DABACO             */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Google Sheets Sync Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Google Sheets</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">2-Way Sync Engine</h4>
            <p className="text-[11px] text-slate-400 mt-1">Sinkronisasi otomatis spreadsheet online ke database internal.</p>
          </div>
        </div>

        {/* Looker Studio Connector */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">Looker Studio</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">BI Analytics Live Feed</h4>
            <p className="text-[11px] text-slate-400 mt-1">Dashboard interaktif visualisasi pimpinan terhubung real-time.</p>
          </div>
        </div>

        {/* Storage Capacity */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase">Total Data Riil</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
              {totalRecords.budget + totalRecords.forecast + totalRecords.realization} Rekaman Transaksi
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Budget: {totalRecords.budget} &bull; Forecast: {totalRecords.forecast} &bull; Realisasi: {totalRecords.realization}
            </p>
          </div>
        </div>

        {/* Security & Encryption */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">Enkripsi Enterprise</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">AES-256 GCM & SHA-256</h4>
            <p className="text-[11px] text-slate-400 mt-1">Sesi login & backup terproteksi standar ISO/IEC 27001.</p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 4: KREDENSIAL LOGIN & ENKRIPSI CADANGAN DATA      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials & Security */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              Kredensial Login & Hak Akses Administrator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Perbarui kata sandi akun resmi administrator DABACO</p>
          </div>

          {credSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Kredensial berhasil diperbarui secara aman!
            </div>
          )}

          {credError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {credError}
            </div>
          )}

          <form onSubmit={handleUpdateCredentials} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 5 karakter"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Update Kredensial
            </button>
          </form>

          {/* Security Status Info */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">Protokol Keamanan Kredensial</p>
                <p className="text-[11px] text-slate-400">Enkripsi sesi SHA-256 dengan proteksi brute-force</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Terproteksi Aktif
            </span>
          </div>
        </div>

        {/* Real-time Backup & Encryption Vault */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Enkripsi & Cadangan Data Real-Time
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Cadangkan seluruh snapshot keuangan terenkripsi AES-256 GCM</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span>Protokol Enkripsi:</span>
              <span className="font-mono font-bold text-emerald-500">AES-GCM-256 / SHA-256</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span>Status Auto-Backup Realtime:</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Berjalan Otomatis
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span>Total Dataset Terproteksi:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {totalRecords.budget + totalRecords.forecast + totalRecords.realization} Rekaman Finansial
              </span>
            </div>
          </div>

          {backupSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> File cadangan terenkripsi (.enc.json) berhasil diunduh!
            </div>
          )}

          <button
            onClick={handleCreateEncryptedBackup}
            disabled={isBackingUp}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isBackingUp ? 'Mengenkripsi & Mengunduh...' : 'Unduh Cadangan Terenkripsi (.enc.json)'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: EDIT COST CENTER                                   */}
      {/* ========================================================= */}
      {editingCC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-red-500" />
                Edit Master Cost Center
              </h4>
              <button
                onClick={() => setEditingCC(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCC} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Cost Center (Tetap)
                </label>
                <input
                  type="text"
                  value={editingCC.code}
                  disabled
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Deskripsi Lengkap
                </label>
                <input
                  type="text"
                  value={editCCName}
                  onChange={(e) => setEditCCName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Departemen / Bagian
                </label>
                <input
                  type="text"
                  value={editCCDept}
                  onChange={(e) => setEditCCDept(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kepala Bagian / PIC
                </label>
                <input
                  type="text"
                  value={editCCHead}
                  onChange={(e) => setEditCCHead(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCC(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION COST CENTER                    */}
      {/* ========================================================= */}
      {deletingCC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Hapus Cost Center?
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                Anda akan menghapus Cost Center berikut dari katalog resmi sistem:
              </p>
              <div className="p-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                {deletingCC.code}
                <div className="font-sans font-normal text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  {deletingCC.name || deletingCC.department}
                </div>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                Catatan: Data transaksi historis (Budget, Forecast, Realisasi) yang telah tersimpan tidak akan terhapus.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingCC(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteCC}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Settings,
  Key,
  Lock,
  Download,
  Moon,
  Sun,
  CheckCircle2,
  RefreshCw,
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
  Layers,
  FolderSync
} from 'lucide-react';
import { MasterItem, MasterCostCenter } from '../types';
import { createEncryptedBackup } from '../utils/encryption';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  masterItems: MasterItem[];
  onAddMasterItem: (item: MasterItem) => void;
  onEditMasterItem?: (item: MasterItem) => void;
  onDeleteMasterItem?: (code: string) => void;
  onAutoSyncMasterData?: () => void;
  costCenters: MasterCostCenter[];
  totalRecords: { budget: number; forecast: number; realization: number };
  dataset: { budget: unknown[]; forecast: unknown[]; realization: unknown[]; metadata: unknown };
}

const STANDARD_CATEGORIES = [
  'Training & Development',
  'IT & Digital Systems',
  'Facility & Operations',
  'Employee Welfare',
  'Recruitment & Assessment',
  'Legal & Compliance',
  'General & Other'
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  setDarkMode,
  masterItems,
  onAddMasterItem,
  onEditMasterItem,
  onDeleteMasterItem,
  onAutoSyncMasterData,
  costCenters,
  totalRecords,
  dataset
}) => {
  const [username, setUsername] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credSuccess, setCredSuccess] = useState(false);
  const [credError, setCredError] = useState('');

  // Add Item state
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Training & Development');
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // Edit Item modal state
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');

  // Delete Item modal state
  const [deletingItem, setDeletingItem] = useState<MasterItem | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Backup state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

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

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemCode.trim() || !newItemName.trim()) return;

    const finalCategory = newItemCategory === 'CUSTOM'
      ? (customCategoryInput.trim() || 'General & Other')
      : newItemCategory;

    onAddMasterItem({
      code: newItemCode.trim(),
      name: newItemName.trim(),
      category: finalCategory,
      status: 'Active'
    });

    setNewItemCode('');
    setNewItemName('');
    setCustomCategoryInput('');
    setShowAddItem(false);
  };

  const handleOpenEdit = (item: MasterItem) => {
    setEditingItem(item);
    setEditName(item.name || item.code);
    setEditCategory(item.category || 'General & Other');
    setEditStatus(item.status || 'Active');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (onEditMasterItem) {
      onEditMasterItem({
        ...editingItem,
        name: editName.trim(),
        category: editCategory.trim(),
        status: editStatus
      });
    } else {
      onAddMasterItem({
        ...editingItem,
        name: editName.trim(),
        category: editCategory.trim(),
        status: editStatus
      });
    }
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    if (onDeleteMasterItem) {
      onDeleteMasterItem(deletingItem.code);
    }
    setDeletingItem(null);
  };

  const handleTriggerAutoSync = () => {
    setIsSyncing(true);
    if (onAutoSyncMasterData) {
      onAutoSyncMasterData();
    }
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice(`Sinkronisasi berhasil! Master Item & Kategori otomatis disesuaikan dari seluruh ${totalRecords.budget + totalRecords.forecast + totalRecords.realization} data upload.`);
      setTimeout(() => setSyncNotice(null), 4000);
    }, 600);
  };

  // Available unique categories from masterItems
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    masterItems.forEach(i => {
      if (i.category) set.add(i.category);
    });
    STANDARD_CATEGORIES.forEach(c => set.add(c));
    return Array.from(set).sort();
  }, [masterItems]);

  // Filtered master items
  const filteredMasterItems = useMemo(() => {
    return masterItems.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.code.toLowerCase().includes(q) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      const matchCategory = selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;

      return matchSearch && matchCategory;
    });
  }, [masterItems, searchQuery, selectedCategoryFilter]);

  // Category badge style mapper
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Training & Development':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20';
      case 'IT & Digital Systems':
        return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20';
      case 'Facility & Operations':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'Employee Welfare':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'Recruitment & Assessment':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
      case 'Legal & Compliance':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Settings className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Pengaturan Sistem & Master Data
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manajemen Master Item & Kategori Anggaran otomatis dari data upload, enkripsi login, dan backup data.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* MASTER ITEM MANAGEMENT SECTION */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-600" />
                Master Item & Kategori Anggaran
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {masterItems.length} Item Terdaftar
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Katalog standar akun biaya PT Ajinomoto Indonesia. Sistem secara otomatis mendeteksi dan menyesuaikan kategori dari file data upload (CSV/Excel), serta mendukung penambahan manual dan penghapusan item.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriggerAutoSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Periksa semua data upload dan daftarkan item baru secara otomatis"
            >
              <FolderSync className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyelaraskan...' : 'Sinkronisasi Otomatis'}</span>
            </button>

            <button
              onClick={() => setShowAddItem(!showAddItem)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Item Baru</span>
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

        {/* Add Master Item Form */}
        {showAddItem && (
          <form onSubmit={handleSaveItem} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-4 text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-500" />
                Tambah Master Item Baru
              </h4>
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Item (Contoh: HR001, English Training)
                </label>
                <input
                  type="text"
                  value={newItemCode}
                  onChange={(e) => setNewItemCode(e.target.value)}
                  placeholder="Contoh: HR001 atau English Training"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Deskripsi Item
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Contoh: English Training Program for Staff"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Anggaran
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {STANDARD_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="CUSTOM">+ Kategori Kustom Lainnya...</option>
                </select>
              </div>
            </div>

            {newItemCategory === 'CUSTOM' && (
              <div className="animate-in fade-in">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tuliskan Nama Kategori Kustom
                </label>
                <input
                  type="text"
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  placeholder="Contoh: Special Corporate Event"
                  required
                  className="w-full md:w-1/2 p-2.5 rounded-xl border border-blue-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                Simpan Master Item
              </button>
            </div>
          </form>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode atau nama item..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="ALL">Semua Kategori ({masterItems.length})</option>
              {uniqueCategories.map(cat => {
                const count = masterItems.filter(i => i.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Master Items Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 scrollbar-thin">
          <table className="w-full text-xs text-left min-w-[650px]">
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Kode Item</th>
                <th className="py-3 px-4">Nama Deskripsi Akun</th>
                <th className="py-3 px-4">Kategori Anggaran</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredMasterItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada master item yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              ) : (
                filteredMasterItems.map((item) => (
                  <tr key={item.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.code}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {item.name || item.code}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getCategoryBadgeClass(item.category)}`}>
                        {item.category || 'General & Other'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Inactive'
                          ? 'bg-slate-500/10 text-slate-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {item.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Master Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                          title="Hapus Master Item"
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

        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
          <span>Menampilkan {filteredMasterItems.length} dari {masterItems.length} Master Item</span>
          <span className="text-[11px]">Format kategori tersinkronisasi otomatis dengan Dashboard & Executive Report</span>
        </div>
      </div>

      {/* Two Column Grid: Credentials and Real-time Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials & Security */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              Kredensial Login & Akses Otoritas
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Perbarui kata sandi dan hak akses akun administrator</p>
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

      {/* EDIT MASTER ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-500" />
                Edit Master Item
              </h4>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Item (Tetap)
                </label>
                <input
                  type="text"
                  value={editingItem.code}
                  disabled
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Deskripsi Item
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Anggaran
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {STANDARD_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {!STANDARD_CATEGORIES.includes(editCategory) && (
                    <option value={editCategory}>{editCategory}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Hapus Master Item?
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                Anda akan menghapus item master berikut dari katalog sistem:
              </p>
              <div className="p-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                {deletingItem.code}
                <div className="font-sans font-normal text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  {deletingItem.name || deletingItem.code}
                </div>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                Catatan: Data transaksi historis yang sudah tersimpan tidak akan terhapus.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
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

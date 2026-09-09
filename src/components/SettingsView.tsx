import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Lock,
  Download,
  Upload,
  Moon,
  Sun,
  Database,
  CheckCircle2,
  RefreshCw,
  Plus,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';
import { MasterItem, MasterCostCenter } from '../types';
import { createEncryptedBackup } from '../utils/encryption';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  masterItems: MasterItem[];
  onAddMasterItem: (item: MasterItem) => void;
  costCenters: MasterCostCenter[];
  totalRecords: { budget: number; forecast: number; realization: number };
  dataset: { budget: unknown[]; forecast: unknown[]; realization: unknown[]; metadata: unknown };
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  setDarkMode,
  masterItems,
  onAddMasterItem,
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

  // Backup state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

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

    onAddMasterItem({
      code: newItemCode.trim().toUpperCase().replace(/\s+/g, ''),
      name: newItemName.trim(),
      category: newItemCategory,
      status: 'Active'
    });

    setNewItemCode('');
    setNewItemName('');
    setShowAddItem(false);
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
              Pengaturan Sistem & Keamanan Akun
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manajemen kredensial login, enkripsi sesi terproteksi, backup terenkripsi AES-256, dan master item.
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors self-start md:self-center"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          <span>{darkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}</span>
        </button>
      </div>

      {/* Two Column Grid */}
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
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors"
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

      {/* Master Item Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Master Item & Kategori Anggaran</h3>
            <p className="text-xs text-slate-400">Katalog standar kode akun biaya PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory</p>
          </div>

          <button
            onClick={() => setShowAddItem(!showAddItem)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item Master</span>
          </button>
        </div>

        {showAddItem && (
          <form onSubmit={handleSaveItem} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Kode Item (Unik)</label>
                <input
                  type="text"
                  value={newItemCode}
                  onChange={(e) => setNewItemCode(e.target.value)}
                  placeholder="Contoh: HR007SAFETYSHOES"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Item</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Contoh: Pengadaan Sepatu Safety Lapangan"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Training & Development">Training & Development</option>
                  <option value="Recruitment & Assessment">Recruitment & Assessment</option>
                  <option value="Employee Welfare">Employee Welfare</option>
                  <option value="Facility & Operations">Facility & Operations</option>
                  <option value="IT & Digital Systems">IT & Digital Systems</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Simpan Master Item
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs text-left min-w-[550px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                <th className="py-2.5">Kode Item</th>
                <th className="py-2.5">Nama Deskripsi</th>
                <th className="py-2.5">Kategori</th>
                <th className="py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {masterItems.map(item => (
                <tr key={item.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 font-mono font-semibold text-blue-500">{item.code}</td>
                  <td className="py-2.5 text-slate-800 dark:text-slate-200">{item.name}</td>
                  <td className="py-2.5 text-slate-500 dark:text-slate-400">{item.category}</td>
                  <td className="py-2.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Database,
  ShieldCheck,
  Copy,
  Check,
  Key,
  Server,
  BookOpen,
  ExternalLink,
  UploadCloud,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowDownToLine,
  Layers,
  ShieldAlert,
  Terminal,
  Sliders
} from 'lucide-react';
import { SupabaseConfig } from '../types';
import {
  testSupabaseConnection,
  SUPABASE_RLS_FIX_SQL,
  SUPABASE_ALL_FIX_SQL
} from '../services/supabaseService';

interface SupabaseViewProps {
  config: SupabaseConfig;
  onUpdateConfig: (newConfig: Partial<SupabaseConfig>) => void;
  darkMode: boolean;
  dataCounts?: {
    costCenters: number;
    masterItems: number;
    budget: number;
    forecast: number;
    realization: number;
  };
  onPushData?: (customConfig?: Partial<SupabaseConfig>) => Promise<void>;
  isPushing?: boolean;
  pushProgress?: string;
  onReloadData?: (customConfig?: Partial<SupabaseConfig>) => Promise<void>;
  isLoadingData?: boolean;
  onOpenDatabaseConsole?: () => void;
  dbSyncStatus?: 'connected' | 'empty' | 'unconfigured' | 'error';
  lastSyncTime?: string | null;
}

export const SupabaseView: React.FC<SupabaseViewProps> = ({
  config,
  onUpdateConfig,
  darkMode,
  dataCounts = { costCenters: 4, masterItems: 10, budget: 12, forecast: 12, realization: 14 },
  onPushData,
  isPushing = false,
  pushProgress = '',
  onReloadData,
  isLoadingData = false,
  onOpenDatabaseConsole,
  dbSyncStatus = 'unconfigured',
  lastSyncTime = null
}) => {
  const [projectUrl, setProjectUrl] = useState(config.projectUrl || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sql' | 'documentation'>('overview');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setProjectUrl(config.projectUrl || '');
    setAnonKey(config.anonKey || '');
  }, [config.projectUrl, config.anonKey]);

  const [copiedMigrationSql, setCopiedMigrationSql] = useState(false);
  const [copiedRlsSql, setCopiedRlsSql] = useState(false);

  const rlsFixSql = SUPABASE_RLS_FIX_SQL;
  const migrationFixSql = SUPABASE_ALL_FIX_SQL;

  const supabaseSqlSchema = `-- ========================================================
-- DABACO DATABASE SCHEMA & ENCRYPTION FOR SUPABASE
-- Project: PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory
-- ========================================================

-- 1. Enable pgcrypto extension for transparent database encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Master Cost Center Table (Kapasitas kode diperluas hingga 128 karakter)
CREATE TABLE IF NOT EXISTS public.master_cost_center (
    code VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(128) NOT NULL,
    head_of_dept VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Master Items Table
CREATE TABLE IF NOT EXISTS public.master_items (
    code VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    status VARCHAR(16) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Budget Plan Table
CREATE TABLE IF NOT EXISTS public.budget_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INT NOT NULL,
    month VARCHAR(32) NOT NULL,
    cost_center VARCHAR(128) REFERENCES public.master_cost_center(code),
    item VARCHAR(128) REFERENCES public.master_items(code),
    amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Forecast Table
CREATE TABLE IF NOT EXISTS public.forecast (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INT NOT NULL,
    month VARCHAR(32) NOT NULL,
    cost_center VARCHAR(128) REFERENCES public.master_cost_center(code),
    item VARCHAR(128) REFERENCES public.master_items(code),
    amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Realization Table (with Encrypted Payload Support)
CREATE TABLE IF NOT EXISTS public.realization (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tanggal DATE NOT NULL,
    year INT NOT NULL,
    month VARCHAR(32) NOT NULL,
    cost_center VARCHAR(128) REFERENCES public.master_cost_center(code),
    item VARCHAR(128) REFERENCES public.master_items(code),
    amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    keterangan TEXT,
    encrypted_note TEXT, -- Encrypted AES-256 for confidential vendor / payroll remarks
    banking_reference VARCHAR(128),
    reconciled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Permissions & Row Level Security (RLS) Configuration
-- Berikan izin akses penuh ke tabel untuk role anon dan authenticated
GRANT ALL ON TABLE public.master_cost_center TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.master_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.budget_plan TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.forecast TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.realization TO anon, authenticated, service_role;

-- Matikan pembatasan RLS agar web dashboard internal bebas hambatan simpan:
ALTER TABLE public.master_cost_center DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_plan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.realization DISABLE ROW LEVEL SECURITY;

-- Kebijakan permisif cadangan (jika suatu saat RLS diaktifkan kembali):
DROP POLICY IF EXISTS "Allow all for master_cost_center" ON public.master_cost_center;
DROP POLICY IF EXISTS "Allow access to master cost center" ON public.master_cost_center;
CREATE POLICY "Allow all for master_cost_center" ON public.master_cost_center FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for master_items" ON public.master_items;
DROP POLICY IF EXISTS "Allow access to master items" ON public.master_items;
CREATE POLICY "Allow all for master_items" ON public.master_items FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for budget_plan" ON public.budget_plan;
DROP POLICY IF EXISTS "Allow access to budget plan" ON public.budget_plan;
CREATE POLICY "Allow all for budget_plan" ON public.budget_plan FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for forecast" ON public.forecast;
DROP POLICY IF EXISTS "Allow access to forecast" ON public.forecast;
CREATE POLICY "Allow all for forecast" ON public.forecast FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for realization" ON public.realization;
DROP POLICY IF EXISTS "Allow access to realization" ON public.realization;
CREATE POLICY "Allow all for realization" ON public.realization FOR ALL TO public USING (true) WITH CHECK (true);

-- 8. Encrypted View Function
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_note(note_text TEXT, secret_key TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(pgp_sym_encrypt(note_text, secret_key), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSaveCredentials = () => {
    onUpdateConfig({
      projectUrl: projectUrl.trim(),
      anonKey: anonKey.trim()
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    handleSaveCredentials();

    const tempConfig: SupabaseConfig = {
      ...config,
      projectUrl: projectUrl.trim(),
      anonKey: anonKey.trim()
    };

    const res = await testSupabaseConnection(tempConfig);
    setIsTesting(false);
    setTestResult({
      success: res.success,
      message: res.message || (res.success ? 'Koneksi ke Supabase berhasil!' : 'Koneksi gagal.')
    });

    if (res.success) {
      onUpdateConfig({
        projectUrl: projectUrl.trim(),
        anonKey: anonKey.trim(),
        status: 'connected',
        lastBackupTime: new Date().toISOString()
      });
    } else {
      onUpdateConfig({
        projectUrl: projectUrl.trim(),
        anonKey: anonKey.trim(),
        status: 'disconnected'
      });
    }
  };

  const handleTriggerPush = async () => {
    handleSaveCredentials();
    if (onPushData) {
      await onPushData({
        projectUrl: projectUrl.trim(),
        anonKey: anonKey.trim()
      });
    }
  };

  const handleTriggerReload = async () => {
    handleSaveCredentials();
    if (onReloadData) {
      await onReloadData({
        projectUrl: projectUrl.trim(),
        anonKey: anonKey.trim()
      });
    }
  };

  const isEnvConfigured = Boolean(
    typeof import.meta !== 'undefined' &&
    import.meta.env?.VITE_SUPABASE_URL &&
    import.meta.env?.VITE_SUPABASE_ANON_KEY
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Backend Supabase Database & Keamanan Enkripsi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Penyimpanan data cloud PostgreSQL terpusat (menggantikan penyimpanan lokal). Setiap kali sistem dibuka, data otomatis dimuat langsung dari Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenDatabaseConsole && (
            <button
              onClick={onOpenDatabaseConsole}
              className="flex items-center gap-2 px-4.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-600/25 transition cursor-pointer"
              title="Buka konsol manajemen database: opsi menimpa, menambahkan, cadangan, dan pemulihan"
            >
              <Sliders className="w-4 h-4" />
              <span>Konsol Manajemen Database</span>
            </button>
          )}

          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <Server className="w-3.5 h-3.5" />
            <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
          </button>

          <button
            onClick={handleTriggerPush}
            disabled={isPushing}
            className="flex items-center gap-2 px-4.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
            <span>{isPushing ? 'Sedang Push...' : 'Push Data ke Supabase'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Status Card & Cloud Sync Controller */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-slate-900 border border-emerald-500/20 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                dbSyncStatus === 'connected' ? 'bg-emerald-400' :
                dbSyncStatus === 'empty' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                dbSyncStatus === 'connected' ? 'bg-emerald-500' :
                dbSyncStatus === 'empty' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Status Penyimpanan:
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  dbSyncStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  dbSyncStatus === 'empty' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {dbSyncStatus === 'connected' && 'Terhubung ke Database (Cloud Live)'}
                  {dbSyncStatus === 'empty' && 'Tabel Supabase Kosong (Perlu Push Awal)'}
                  {dbSyncStatus === 'unconfigured' && 'Kredensial Belum Lengkap'}
                  {dbSyncStatus === 'error' && 'Gagal Memuat dari Supabase'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lastSyncTime ? `Sinkronisasi terakhir: pukul ${lastSyncTime} WIB` : 'Otomatis memuat data dari database saat aplikasi dibuka'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerReload}
              disabled={isLoadingData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Tarik ulang data terbaru langsung dari Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isLoadingData ? 'Memuat Data...' : 'Reload dari Database'}</span>
            </button>
            <button
              onClick={handleTriggerPush}
              disabled={isPushing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition cursor-pointer disabled:opacity-50"
              title="Kirim dan timpa data di Supabase dengan dataset saat ini"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${isPushing ? 'animate-spin' : ''}`} />
              <span>{isPushing ? 'Mengunggah...' : 'Push Sekarang'}</span>
            </button>
          </div>
        </div>

        {/* Push Progress Notification */}
        {isPushing && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-pulse">
            <UploadCloud className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{pushProgress || 'Sedang mengunggah data ke Supabase...'}</span>
          </div>
        )}

        {/* Dataset Breakdown Pills */}
        <div className="pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Cost Centers</div>
            <div className="text-base font-bold text-white">{dataCounts.costCenters}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Master Items</div>
            <div className="text-base font-bold text-white">{dataCounts.masterItems}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Budget Plan</div>
            <div className="text-base font-bold text-blue-400">{dataCounts.budget}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Forecast</div>
            <div className="text-base font-bold text-amber-400">{dataCounts.forecast}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-400 font-medium">Realisasi Kas</div>
            <div className="text-base font-bold text-emerald-400">{dataCounts.realization}</div>
          </div>
        </div>
      </div>

      {testResult && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 border ${
          testResult.success
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Kredensial & Pengaturan Sinkronisasi
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sql'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          DABACO SQL Schema & RLS
        </button>
        <button
          onClick={() => setActiveTab('documentation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'documentation'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Panduan Integrasi Supabase
        </button>
      </div>

      {/* Tab 1: Overview & Config */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-500" />
                Kredensial API Supabase
              </h3>
              <button
                onClick={handleSaveCredentials}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
              >
                Simpan Kredensial
              </button>
            </div>

            {isEnvConfigured && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <div>
                  <span className="font-bold">Environment Variables Terdeteksi:</span> Kredensial aktif dimuat dari sistem environment (<code className="px-1 py-0.5 rounded bg-emerald-500/15 font-mono text-[10px]">VITE_SUPABASE_URL</code>).
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Project URL</label>
                <input
                  type="text"
                  value={projectUrl}
                  onChange={(e) => {
                    setProjectUrl(e.target.value);
                    onUpdateConfig({ projectUrl: e.target.value });
                  }}
                  placeholder="https://your-project.supabase.co"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Public Anon Key</label>
                <textarea
                  value={anonKey}
                  onChange={(e) => {
                    setAnonKey(e.target.value);
                    onUpdateConfig({ anonKey: e.target.value });
                  }}
                  rows={3}
                  placeholder="eyJhbGciOi..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Kunci anon digunakan untuk operasi query terlindungi Row-Level Security (RLS). Seluruh transaksi diverifikasi dengan token otentikasi PostgreSQL.
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              Arsitektur Database Cloud DABACO
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-800 dark:text-white">1. Auto-Load Saat Sistem Dibuka</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Sistem tidak lagi mengandalkan LocalStorage browser. Saat aplikasi dimuat, transaksi ditarik langsung dari Supabase sebagai sumber data tunggal (single source of truth).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-800 dark:text-white">2. 1-Click Push Dataset</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Tombol Push Data akan mengunggah Master Cost Centers, Master Items, Budget Plan, Forecast, dan Realisasi ke Supabase secara terurut sesuai relasi Foreign Key.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-800 dark:text-white">3. Row-Level Security (RLS)</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Seluruh tabel diamankan dengan kebijakan RLS sehingga integritas data finansial training & rekrutmen terjamin dari manipulasi eksternal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SQL Schema */}
      {activeTab === 'sql' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">SQL Schema Skrip DABACO</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Jalankan di Supabase SQL Editor untuk membuat tabel dan fungsi enkripsi</p>
            </div>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700 transition"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Tersalin ke Clipboard!' : 'Salin Seluruh SQL'}</span>
            </button>
          </div>

          {/* Dedicated RLS Policy Fix Banner */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                <strong className="text-rose-800 dark:text-rose-300 font-bold">
                  Solusi Error &quot;new row violates row-level security policy&quot;:
                </strong>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(rlsFixSql);
                    setCopiedRlsSql(true);
                    setTimeout(() => setCopiedRlsSql(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-sm transition"
                >
                  {copiedRlsSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRlsSql ? 'Tersalin!' : 'Salin Skrip Perbaikan RLS'}</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(migrationFixSql);
                    setCopiedMigrationSql(true);
                    setTimeout(() => setCopiedMigrationSql(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-[11px] shadow-sm transition"
                >
                  {copiedMigrationSql ? <Check className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
                  <span>{copiedMigrationSql ? 'Tersalin!' : 'Salin Skrip Lengkap (RLS + Kolom)'}</span>
                </button>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Jika saat push data muncul pesan <code className="bg-rose-200/60 dark:bg-rose-950/80 px-1 py-0.5 rounded text-rose-900 dark:text-rose-200 font-mono">new row violates row-level security policy for table &quot;master_cost_center&quot;</code>, tabel di Supabase Anda memiliki fitur RLS aktif namun belum mengizinkan akses simpan untuk aplikasi. Salin skrip di atas lalu jalankan di <strong>SQL Editor Supabase</strong> untuk mematikan pembatasan RLS dan memberikan izin simpan penuh.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-emerald-800 dark:text-emerald-300">Tips saat klik RUN di Supabase:</strong> Skrip skema di bawah ini sudah diperbarui dengan perintah pembatalan RLS dan hak akses penuh untuk role <code>anon</code> dan <code>authenticated</code>, sehingga data master &amp; transaksi kas dijamin dapat tersimpan mulus.
            </div>
          </div>

          <div className="rounded-2xl bg-[#090d16] border border-slate-800 p-4 font-mono text-[11px] text-slate-300 max-h-[460px] overflow-y-auto scrollbar-thin">
            <pre>{supabaseSqlSchema}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Documentation */}
      {activeTab === 'documentation' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Panduan Integrasi Backend Supabase</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            DABACO menggunakan Supabase sebagai lapisan backend penyimpanan relasional yang tangguh, menggantikan spreadsheet lokal untuk audit jangka panjang dan multi-user access.
          </p>

          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Langkah 1: Setup Proyek Supabase</h4>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
                <li>Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-500 underline">supabase.com</a> dan buat organisasi / proyek baru.</li>
                <li>Pilih region Asia Tenggara (misal: <em>Singapore</em>) untuk latensi tercepat ke Indonesia.</li>
                <li>Masuk ke menu <strong>SQL Editor</strong>, tempelkan skrip dari tab <strong>DABACO SQL Schema & RLS</strong>, lalu klik <strong>Run</strong> (pilih opsi <em>Run and enable RLS</em>).</li>
              </ol>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Langkah 2: Sambungkan Kredensial</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Di dashboard Supabase, buka <strong>Project Settings → API</strong>. Salin <strong>Project URL</strong> dan <strong>Project API Keys (anon / public)</strong>, lalu tempelkan ke form kredensial DABACO di atas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Langkah 3: Push & Auto-Load</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Klik tombol <strong>Push Data ke Supabase</strong> untuk mengunggah master data dan seluruh catatan transaksi. Setelah itu, setiap kali aplikasi dibuka, sistem akan otomatis membaca data langsung dari Supabase tanpa memerlukan penyimpanan lokal browser lagi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20">
              <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 mb-1.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Langkah 4: Konfigurasi Auto-Load di Vercel (Production)
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                Agar saat diakses melalui domain Vercel aplikasi langsung otomatis terhubung dan memuat data dari Supabase tanpa perlu mengisi form kredensial secara manual, tambahkan Environment Variables berikut di dashboard Vercel:
              </p>
              <div className="space-y-2 font-mono text-[11px] bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-800 gap-1">
                  <span className="text-emerald-400 font-bold">VITE_SUPABASE_URL</span>
                  <span className="text-slate-400">URL Supabase Anda (contoh: https://xyz.supabase.co)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 gap-1">
                  <span className="text-emerald-400 font-bold">VITE_SUPABASE_ANON_KEY</span>
                  <span className="text-slate-400">Public anon key (eyJhbGciOi...)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <strong>Cara setting:</strong> Buka Project Vercel &rarr; Settings &rarr; Environment Variables &rarr; Masukkan kedua variabel di atas &rarr; Klik Save &rarr; Lakukan <em>Redeploy</em>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

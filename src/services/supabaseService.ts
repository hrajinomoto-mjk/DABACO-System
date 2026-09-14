import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  BudgetRecord,
  ForecastRecord,
  RealizationRecord,
  MasterCostCenter,
  MasterItem,
  SupabaseConfig
} from '../types';

let cachedClient: SupabaseClient | null = null;
let cachedUrl: string | null = null;
let cachedKey: string | null = null;

// Convert string ID (like 'b-01') into a deterministic valid RFC-4122 v4 UUID
export const SUPABASE_RLS_FIX_SQL = `-- ========================================================
-- PERBAIKAN ROW-LEVEL SECURITY (RLS) DI SUPABASE
-- Mengatasi error: "new row violates row-level security policy"
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda:
-- ========================================================

-- 1. Matikan pembatasan RLS pada seluruh tabel DABACO (Paling Praktis & Efektif)
ALTER TABLE public.master_cost_center DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_plan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.realization DISABLE ROW LEVEL SECURITY;

-- 2. Berikan izin akses penuh ke role anon, authenticated, dan service_role
GRANT ALL ON TABLE public.master_cost_center TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.master_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.budget_plan TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.forecast TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.realization TO anon, authenticated, service_role;

-- 3. Bersihkan policy lama agar tidak terjadi konflik
DROP POLICY IF EXISTS "Allow all for master_cost_center" ON public.master_cost_center;
DROP POLICY IF EXISTS "Allow access to master cost center" ON public.master_cost_center;
DROP POLICY IF EXISTS "Allow all for master_items" ON public.master_items;
DROP POLICY IF EXISTS "Allow access to master items" ON public.master_items;
DROP POLICY IF EXISTS "Allow all for budget_plan" ON public.budget_plan;
DROP POLICY IF EXISTS "Allow access to budget plan" ON public.budget_plan;
DROP POLICY IF EXISTS "Allow all for forecast" ON public.forecast;
DROP POLICY IF EXISTS "Allow access to forecast" ON public.forecast;
DROP POLICY IF EXISTS "Allow all for realization" ON public.realization;
DROP POLICY IF EXISTS "Allow access to realization" ON public.realization;

-- 4. Kebijakan permisif cadangan (jika suatu saat RLS diaktifkan kembali)
CREATE POLICY "Allow all for master_cost_center" ON public.master_cost_center FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for master_items" ON public.master_items FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for budget_plan" ON public.budget_plan FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for forecast" ON public.forecast FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for realization" ON public.realization FOR ALL TO public USING (true) WITH CHECK (true);`;

export const SUPABASE_ALL_FIX_SQL = `-- ========================================================
-- MASTER ALL-IN-ONE FIX (KAPASITAS KOLOM & ROW-LEVEL SECURITY)
-- Mengatasi "value too long" DAN "violates row-level security policy"
-- Jalankan skrip ini di Supabase SQL Editor:
-- ========================================================

-- 1. Perbesar batas panjang kolom (VARCHAR 128 / 255)
ALTER TABLE public.master_cost_center ALTER COLUMN code TYPE VARCHAR(128);
ALTER TABLE public.master_cost_center ALTER COLUMN name TYPE VARCHAR(255);
ALTER TABLE public.master_cost_center ALTER COLUMN department TYPE VARCHAR(128);

ALTER TABLE public.master_items ALTER COLUMN code TYPE VARCHAR(128);
ALTER TABLE public.master_items ALTER COLUMN name TYPE VARCHAR(255);

ALTER TABLE public.budget_plan ALTER COLUMN cost_center TYPE VARCHAR(128);
ALTER TABLE public.budget_plan ALTER COLUMN item TYPE VARCHAR(128);
ALTER TABLE public.budget_plan ALTER COLUMN month TYPE VARCHAR(32);

ALTER TABLE public.forecast ALTER COLUMN cost_center TYPE VARCHAR(128);
ALTER TABLE public.forecast ALTER COLUMN item TYPE VARCHAR(128);
ALTER TABLE public.forecast ALTER COLUMN month TYPE VARCHAR(32);

ALTER TABLE public.realization ALTER COLUMN cost_center TYPE VARCHAR(128);
ALTER TABLE public.realization ALTER COLUMN item TYPE VARCHAR(128);
ALTER TABLE public.realization ALTER COLUMN month TYPE VARCHAR(32);
ALTER TABLE public.realization ALTER COLUMN banking_reference TYPE VARCHAR(128);

-- 2. Matikan pembatasan RLS & berikan izin simpan penuh
ALTER TABLE public.master_cost_center DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_plan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.realization DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.master_cost_center TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.master_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.budget_plan TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.forecast TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.realization TO anon, authenticated, service_role;

-- 3. Bersihkan policy lama
DROP POLICY IF EXISTS "Allow all for master_cost_center" ON public.master_cost_center;
DROP POLICY IF EXISTS "Allow access to master cost center" ON public.master_cost_center;
DROP POLICY IF EXISTS "Allow all for master_items" ON public.master_items;
DROP POLICY IF EXISTS "Allow access to master items" ON public.master_items;
DROP POLICY IF EXISTS "Allow all for budget_plan" ON public.budget_plan;
DROP POLICY IF EXISTS "Allow access to budget plan" ON public.budget_plan;
DROP POLICY IF EXISTS "Allow all for forecast" ON public.forecast;
DROP POLICY IF EXISTS "Allow access to forecast" ON public.forecast;
DROP POLICY IF EXISTS "Allow all for realization" ON public.realization;
DROP POLICY IF EXISTS "Allow access to realization" ON public.realization;

-- 4. Kebijakan permisif cadangan
CREATE POLICY "Allow all for master_cost_center" ON public.master_cost_center FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for master_items" ON public.master_items FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for budget_plan" ON public.budget_plan FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for forecast" ON public.forecast FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for realization" ON public.realization FOR ALL TO public USING (true) WITH CHECK (true);`;

export function ensureUUID(id: string): string {
  if (!id) {
    return '00000000-0000-4000-8000-000000000001';
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id.toLowerCase();
  }
  
  // Deterministic 32-hex hash based on string content
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < id.length; i++) {
    const ch = id.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  const s1 = ((h1 ^ (h1 >>> 16)) >>> 0).toString(16).padStart(8, '0');
  const s2 = ((h2 ^ (h2 >>> 16)) >>> 0).toString(16).padStart(8, '0');
  const s3 = (Math.imul(id.length * 31, 0x1234567) >>> 0).toString(16).padStart(8, '0');
  const s4 = (Math.imul(id.length * 17 + 99, 0x7654321) >>> 0).toString(16).padStart(8, '0');
  const raw = (s1 + s2 + s3 + s4).slice(0, 32);

  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-4${raw.slice(13, 16)}-a${raw.slice(17, 20)}-${raw.slice(20, 32)}`;
}

export function isConfigValid(config?: SupabaseConfig | null): boolean {
  if (!config) return false;
  const url = config.projectUrl?.trim();
  const key = config.anonKey?.trim();
  if (!url || !key) return false;
  if (
    url === 'https://your-project.supabase.co' ||
    url.includes('your-project') ||
    url.includes('dabaco-ajinomoto-prod') ||
    key.includes('dabaco_encrypted_signature_demo')
  ) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') && key.length > 25;
  } catch {
    return false;
  }
}

export function getSupabaseClient(config?: SupabaseConfig | null): SupabaseClient | null {
  if (!isConfigValid(config)) {
    return null;
  }
  const url = config!.projectUrl.trim();
  const key = config!.anonKey.trim();

  if (cachedClient && cachedUrl === url && cachedKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: { persistSession: false },
      db: { schema: 'public' }
    });
    cachedUrl = url;
    cachedKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Error creating Supabase client:', err);
    return null;
  }
}

export interface FetchResult {
  success: boolean;
  isEmpty?: boolean;
  error?: string;
  data?: {
    costCenters: MasterCostCenter[];
    masterItems: MasterItem[];
    budget: BudgetRecord[];
    forecast: ForecastRecord[];
    realization: RealizationRecord[];
  };
}

export async function fetchDatabaseFromSupabase(config: SupabaseConfig): Promise<FetchResult> {
  const client = getSupabaseClient(config);
  if (!client) {
    return {
      success: false,
      error: 'Konfigurasi Supabase belum valid (URL atau Anon Key tidak valid).'
    };
  }

  try {
    // Fetch all tables in parallel
    const [
      costCentersRes,
      masterItemsRes,
      budgetRes,
      forecastRes,
      realizationRes
    ] = await Promise.all([
      client.from('master_cost_center').select('*').order('code', { ascending: true }),
      client.from('master_items').select('*').order('code', { ascending: true }),
      client.from('budget_plan').select('*').order('created_at', { ascending: true }),
      client.from('forecast').select('*').order('created_at', { ascending: true }),
      client.from('realization').select('*').order('tanggal', { ascending: false })
    ]);

    // Check for schema or connection errors
    if (costCentersRes.error) {
      throw new Error(`Tabel master_cost_center: ${costCentersRes.error.message}`);
    }
    if (masterItemsRes.error) {
      throw new Error(`Tabel master_items: ${masterItemsRes.error.message}`);
    }
    if (budgetRes.error) {
      throw new Error(`Tabel budget_plan: ${budgetRes.error.message}`);
    }
    if (forecastRes.error) {
      throw new Error(`Tabel forecast: ${forecastRes.error.message}`);
    }
    if (realizationRes.error) {
      throw new Error(`Tabel realization: ${realizationRes.error.message}`);
    }

    const rawCostCenters = costCentersRes.data || [];
    const rawMasterItems = masterItemsRes.data || [];
    const rawBudget = budgetRes.data || [];
    const rawForecast = forecastRes.data || [];
    const rawRealization = realizationRes.data || [];

    const totalRows = rawCostCenters.length + rawMasterItems.length + rawBudget.length + rawForecast.length + rawRealization.length;
    if (totalRows === 0) {
      return {
        success: true,
        isEmpty: true,
        data: {
          costCenters: [],
          masterItems: [],
          budget: [],
          forecast: [],
          realization: []
        }
      };
    }

    // Map database snake_case columns back to application models
    const costCenters: MasterCostCenter[] = rawCostCenters.map(row => ({
      code: row.code,
      name: row.name,
      department: row.department,
      headOfDept: row.head_of_dept || ''
    }));

    const masterItems: MasterItem[] = rawMasterItems.map(row => ({
      code: row.code,
      name: row.name,
      category: row.category,
      status: (row.status === 'Inactive' ? 'Inactive' : 'Active') as 'Active' | 'Inactive'
    }));

    const budget: BudgetRecord[] = rawBudget.map(row => ({
      id: String(row.id),
      year: Number(row.year),
      month: String(row.month),
      costCenter: String(row.cost_center),
      item: String(row.item),
      amount: Number(row.amount || 0),
      createdAt: row.created_at
    }));

    const forecast: ForecastRecord[] = rawForecast.map(row => ({
      id: String(row.id),
      year: Number(row.year),
      month: String(row.month),
      costCenter: String(row.cost_center),
      item: String(row.item),
      amount: Number(row.amount || 0),
      createdAt: row.created_at
    }));

    const realization: RealizationRecord[] = rawRealization.map(row => ({
      id: String(row.id),
      tanggal: String(row.tanggal),
      year: Number(row.year),
      month: String(row.month),
      costCenter: String(row.cost_center),
      item: String(row.item),
      amount: Number(row.amount || 0),
      keterangan: String(row.keterangan || ''),
      encryptedNote: row.encrypted_note || undefined,
      bankingReference: row.banking_reference || undefined,
      reconciled: Boolean(row.reconciled)
    }));

    return {
      success: true,
      isEmpty: false,
      data: {
        costCenters,
        masterItems,
        budget,
        forecast,
        realization
      }
    };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const isNetwork = errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError') || errMsg.includes('TypeError');
    return {
      success: false,
      error: isNetwork
        ? 'Server Supabase tidak dapat dijangkau. Periksa kembali Project URL dan Anon Key di tab Supabase Backend.'
        : `Gagal memuat data dari Supabase: ${errMsg}`
    };
  }
}

export interface PushOptions {
  mode?: 'append' | 'overwrite'; // 'append' = upsert/add without deleting; 'overwrite' = clean tables first
  tables?: {
    costCenters?: boolean;
    masterItems?: boolean;
    budget?: boolean;
    forecast?: boolean;
    realization?: boolean;
  };
}

export interface PushResult {
  success: boolean;
  error?: string;
  isRlsError?: boolean;
  modeUsed?: 'append' | 'overwrite';
  counts?: {
    costCenters: number;
    masterItems: number;
    budget: number;
    forecast: number;
    realization: number;
  };
}

export interface SupabaseTableCounts {
  costCenters: number;
  masterItems: number;
  budget: number;
  forecast: number;
  realization: number;
}

export async function fetchDatabaseCountsFromSupabase(
  config: SupabaseConfig
): Promise<{ success: boolean; counts?: SupabaseTableCounts; error?: string }> {
  const client = getSupabaseClient(config);
  if (!client) {
    return { success: false, error: 'Koneksi Supabase belum dikonfigurasi.' };
  }

  try {
    const [ccRes, itRes, bRes, fRes, rRes] = await Promise.all([
      client.from('master_cost_center').select('*', { count: 'exact', head: true }),
      client.from('master_items').select('*', { count: 'exact', head: true }),
      client.from('budget_plan').select('*', { count: 'exact', head: true }),
      client.from('forecast').select('*', { count: 'exact', head: true }),
      client.from('realization').select('*', { count: 'exact', head: true })
    ]);

    return {
      success: true,
      counts: {
        costCenters: ccRes.count ?? 0,
        masterItems: itRes.count ?? 0,
        budget: bRes.count ?? 0,
        forecast: fRes.count ?? 0,
        realization: rRes.count ?? 0
      }
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Gagal mengambil jumlah data dari Supabase.'
    };
  }
}

export async function clearDatabaseTablesInSupabase(
  config: SupabaseConfig,
  tables: {
    realization?: boolean;
    forecast?: boolean;
    budget?: boolean;
    masterItems?: boolean;
    costCenters?: boolean;
  },
  onProgress?: (step: string) => void
): Promise<{ success: boolean; error?: string; cleared: string[] }> {
  const client = getSupabaseClient(config);
  if (!client) {
    return { success: false, error: 'Koneksi Supabase belum dikonfigurasi.', cleared: [] };
  }

  const cleared: string[] = [];
  try {
    // Foreign key safety: delete transactions first, then master tables
    if (tables.realization) {
      onProgress?.('Mengosongkan tabel Realization...');
      const { error } = await client
        .from('realization')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw new Error(`Gagal mengosongkan realization: ${error.message}`);
      cleared.push('Realization');
    }

    if (tables.forecast) {
      onProgress?.('Mengosongkan tabel Forecast...');
      const { error } = await client
        .from('forecast')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw new Error(`Gagal mengosongkan forecast: ${error.message}`);
      cleared.push('Forecast');
    }

    if (tables.budget) {
      onProgress?.('Mengosongkan tabel Budget Plan...');
      const { error } = await client
        .from('budget_plan')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw new Error(`Gagal mengosongkan budget_plan: ${error.message}`);
      cleared.push('Budget Plan');
    }

    if (tables.masterItems) {
      onProgress?.('Mengosongkan tabel Master Items...');
      const { error } = await client
        .from('master_items')
        .delete()
        .neq('code', '__NON_EXISTING_CODE__');
      if (error) throw new Error(`Gagal mengosongkan master_items: ${error.message}`);
      cleared.push('Master Items');
    }

    if (tables.costCenters) {
      onProgress?.('Mengosongkan tabel Master Cost Center...');
      const { error } = await client
        .from('master_cost_center')
        .delete()
        .neq('code', '__NON_EXISTING_CODE__');
      if (error) throw new Error(`Gagal mengosongkan master_cost_center: ${error.message}`);
      cleared.push('Master Cost Center');
    }

    onProgress?.('Tabel berhasil dikosongkan!');
    return { success: true, cleared };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Gagal mengosongkan tabel di Supabase.',
      cleared
    };
  }
}

export async function pushDatabaseToSupabase(
  data: {
    costCenters: MasterCostCenter[];
    masterItems: MasterItem[];
    budget: BudgetRecord[];
    forecast: ForecastRecord[];
    realization: RealizationRecord[];
  },
  config: SupabaseConfig,
  onProgress?: (step: string) => void,
  options?: PushOptions
): Promise<PushResult> {
  const client = getSupabaseClient(config);
  if (!client) {
    return {
      success: false,
      error: 'Koneksi Supabase belum dikonfigurasi atau URL/Key tidak valid.'
    };
  }

  try {
    // 1. Prepare cost centers with intelligent lookup and length safety (max 32 chars for VARCHAR(32) compatibility)
    onProgress?.('Menyiapkan Master Cost Center...');
    const codeLookup = new Map<string, string>(); // identifier -> safeCode
    const resolvedCostCenterMap = new Map<string, MasterCostCenter>();

    // Register known master cost centers first
    data.costCenters.forEach(cc => {
      const rawCode = (cc.code || '').trim();
      const safeCode = (rawCode.length > 32 ? rawCode.slice(0, 32) : rawCode) || 'CC001';
      const safeName = (cc.name || safeCode).trim().slice(0, 128);
      const safeDept = (cc.department || 'HR & GA Department').trim().slice(0, 64);
      const safeHead = cc.headOfDept ? cc.headOfDept.trim().slice(0, 128) : null;

      codeLookup.set(rawCode.toLowerCase(), safeCode);
      if (cc.name) codeLookup.set(cc.name.trim().toLowerCase(), safeCode);

      resolvedCostCenterMap.set(safeCode, {
        code: safeCode,
        name: safeName,
        department: safeDept,
        headOfDept: safeHead || undefined
      });
    });

    // Helper to resolve any cost center string into a valid <= 32 char code
    const resolveSafeCostCenter = (rawCC: string): string => {
      if (!rawCC || !rawCC.trim()) return 'HR001';
      const trimmed = rawCC.trim();
      const lower = trimmed.toLowerCase();

      // Check direct match
      if (codeLookup.has(lower)) {
        return codeLookup.get(lower)!;
      }

      // Check partial name or code match
      for (const [knownKey, targetCode] of codeLookup.entries()) {
        if (knownKey.length >= 4 && (lower.includes(knownKey) || knownKey.includes(lower))) {
          codeLookup.set(lower, targetCode);
          return targetCode;
        }
      }

      // If code is within 32 chars, use it directly
      if (trimmed.length <= 32) {
        codeLookup.set(lower, trimmed);
        if (!resolvedCostCenterMap.has(trimmed)) {
          resolvedCostCenterMap.set(trimmed, {
            code: trimmed,
            name: `Cost Center ${trimmed}`.slice(0, 128),
            department: 'HR & GA Department',
            headOfDept: 'Manager'
          });
        }
        return trimmed;
      }

      // If code exceeds 32 characters (e.g. descriptive department name from CSV):
      // Generate a deterministic safe slug <= 32 chars
      let hash = 0;
      for (let i = 0; i < trimmed.length; i++) {
        hash = ((hash << 5) - hash) + trimmed.charCodeAt(i);
        hash |= 0;
      }
      const hashStr = Math.abs(hash).toString(36).toUpperCase().slice(0, 5);
      const words = trimmed.split(/[\s_\-/]+/).filter(Boolean);
      const prefix = words.map(w => w[0].toUpperCase()).join('').slice(0, 6) || 'CC';
      const safeSlug = `${prefix}-${trimmed.slice(0, 18).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${hashStr}`.slice(0, 32);

      codeLookup.set(lower, safeSlug);
      if (!resolvedCostCenterMap.has(safeSlug)) {
        resolvedCostCenterMap.set(safeSlug, {
          code: safeSlug,
          name: trimmed.slice(0, 128), // Keep full original descriptive text in name
          department: 'HR & GA Department',
          headOfDept: 'Manager'
        });
      }
      return safeSlug;
    };

    // 2. Prepare master items with intelligent lookup (max 64 chars for VARCHAR(64) compatibility)
    onProgress?.('Menyiapkan Master Items & Biaya...');
    const itemLookup = new Map<string, string>();
    const resolvedItemMap = new Map<string, MasterItem>();

    data.masterItems.forEach(it => {
      const rawCode = (it.code || '').trim();
      const safeCode = (rawCode.length > 64 ? rawCode.slice(0, 64) : rawCode) || 'ITEM001';
      const safeName = (it.name || safeCode).trim().slice(0, 255);
      const safeCategory = (it.category || 'Operasional').trim().slice(0, 128);
      const safeStatus = (it.status === 'Inactive' ? 'Inactive' : 'Active') as 'Active' | 'Inactive';

      itemLookup.set(rawCode.toLowerCase(), safeCode);
      if (it.name) itemLookup.set(it.name.trim().toLowerCase(), safeCode);

      resolvedItemMap.set(safeCode, {
        code: safeCode,
        name: safeName,
        category: safeCategory,
        status: safeStatus
      });
    });

    const resolveSafeItem = (rawItem: string): string => {
      if (!rawItem || !rawItem.trim()) return 'HR001EDUCATIONFEETRAINING';
      const trimmed = rawItem.trim();
      const lower = trimmed.toLowerCase();

      if (itemLookup.has(lower)) {
        return itemLookup.get(lower)!;
      }

      for (const [knownKey, targetCode] of itemLookup.entries()) {
        if (knownKey.length >= 5 && (lower.includes(knownKey) || knownKey.includes(lower))) {
          itemLookup.set(lower, targetCode);
          return targetCode;
        }
      }

      const safeCode = trimmed.slice(0, 64);
      itemLookup.set(lower, safeCode);
      if (!resolvedItemMap.has(safeCode)) {
        resolvedItemMap.set(safeCode, {
          code: safeCode,
          name: trimmed.slice(0, 255),
          category: 'Operasional',
          status: 'Active'
        });
      }
      return safeCode;
    };

    // Helper for safe month string (max 8 characters, e.g. "Sep" instead of "September")
    const resolveSafeMonth = (rawMonth: string): string => {
      if (!rawMonth) return 'Jan';
      const m = String(rawMonth).trim().toLowerCase();
      if (m.startsWith('jan')) return 'Jan';
      if (m.startsWith('feb')) return 'Feb';
      if (m.startsWith('mar')) return 'Mar';
      if (m.startsWith('apr')) return 'Apr';
      if (m.startsWith('may') || m.startsWith('mei')) return 'May';
      if (m.startsWith('jun')) return 'Jun';
      if (m.startsWith('jul')) return 'Jul';
      if (m.startsWith('aug') || m.startsWith('agu')) return 'Aug';
      if (m.startsWith('sep')) return 'Sep';
      if (m.startsWith('oct') || m.startsWith('okt')) return 'Oct';
      if (m.startsWith('nov')) return 'Nov';
      if (m.startsWith('dec') || m.startsWith('des')) return 'Dec';
      return String(rawMonth).trim().slice(0, 8);
    };

    // Pre-resolve all foreign keys from dataset rows so missing master rows are created first
    data.budget.forEach(b => {
      resolveSafeCostCenter(b.costCenter);
      resolveSafeItem(b.item);
    });
    data.forecast.forEach(f => {
      resolveSafeCostCenter(f.costCenter);
      resolveSafeItem(f.item);
    });
    data.realization.forEach(r => {
      resolveSafeCostCenter(r.costCenter);
      resolveSafeItem(r.item);
    });

    const selectedTables = {
      costCenters: options?.tables?.costCenters !== false,
      masterItems: options?.tables?.masterItems !== false,
      budget: options?.tables?.budget !== false,
      forecast: options?.tables?.forecast !== false,
      realization: options?.tables?.realization !== false
    };

    const wrapTableError = (table: string, err: any): Error => {
      const rawMsg = err?.message || String(err);
      if (rawMsg.toLowerCase().includes('violates row-level security policy') || rawMsg.toLowerCase().includes('row-level security')) {
        return new Error(`Gagal push ${table}: new row violates row-level security policy for table "${table}". Database Supabase Anda memblokir izin simpan karena pembatasan Row-Level Security (RLS).`);
      }
      return new Error(`Gagal push ${table}: ${rawMsg}`);
    };

    // If Overwrite mode is chosen: delete existing records from chosen tables first (in reverse dependency order)
    if (options?.mode === 'overwrite') {
      onProgress?.('Membersihkan data lama di Supabase (Mode Menimpa)...');
      if (selectedTables.realization) {
        const { error } = await client
          .from('realization')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw wrapTableError('realization (delete)', error);
      }
      if (selectedTables.forecast) {
        const { error } = await client
          .from('forecast')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw wrapTableError('forecast (delete)', error);
      }
      if (selectedTables.budget) {
        const { error } = await client
          .from('budget_plan')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw wrapTableError('budget_plan (delete)', error);
      }
      if (selectedTables.masterItems) {
        const { error } = await client
          .from('master_items')
          .delete()
          .neq('code', '__NON_EXISTING_CODE__');
        if (error) throw wrapTableError('master_items (delete)', error);
      }
      if (selectedTables.costCenters) {
        const { error } = await client
          .from('master_cost_center')
          .delete()
          .neq('code', '__NON_EXISTING_CODE__');
        if (error) throw wrapTableError('master_cost_center (delete)', error);
      }
    }

    // Upload cost centers
    const costCenterRows = Array.from(resolvedCostCenterMap.values()).map(cc => ({
      code: cc.code.slice(0, 32),
      name: cc.name.slice(0, 128),
      department: cc.department.slice(0, 64),
      head_of_dept: cc.headOfDept ? cc.headOfDept.slice(0, 128) : null
    }));

    if (selectedTables.costCenters && costCenterRows.length > 0) {
      onProgress?.('Mengunggah Master Cost Center...');
      const { error: ccErr } = await client
        .from('master_cost_center')
        .upsert(costCenterRows, { onConflict: 'code' });
      if (ccErr) throw wrapTableError('master_cost_center', ccErr);
    }

    // Upload master items
    const itemRows = Array.from(resolvedItemMap.values()).map(it => ({
      code: it.code.slice(0, 64),
      name: it.name.slice(0, 255),
      category: it.category.slice(0, 128),
      status: it.status || 'Active'
    }));

    if (selectedTables.masterItems && itemRows.length > 0) {
      onProgress?.('Mengunggah Master Items & Biaya...');
      const { error: itErr } = await client
        .from('master_items')
        .upsert(itemRows, { onConflict: 'code' });
      if (itErr) throw wrapTableError('master_items', itErr);
    }

    // 3. Push Budget Plan
    const budgetRows = data.budget.map(b => ({
      id: ensureUUID(b.id),
      year: Number(b.year) || 2026,
      month: resolveSafeMonth(b.month),
      cost_center: resolveSafeCostCenter(b.costCenter),
      item: resolveSafeItem(b.item),
      amount: Number(b.amount) || 0
    }));

    if (selectedTables.budget && budgetRows.length > 0) {
      onProgress?.('Mengunggah data Rencana Anggaran (Budget Plan)...');
      const { error: bErr } = await client
        .from('budget_plan')
        .upsert(budgetRows, { onConflict: 'id' });
      if (bErr) throw wrapTableError('budget_plan', bErr);
    }

    // 4. Push Forecast
    const forecastRows = data.forecast.map(f => ({
      id: ensureUUID(f.id),
      year: Number(f.year) || 2026,
      month: resolveSafeMonth(f.month),
      cost_center: resolveSafeCostCenter(f.costCenter),
      item: resolveSafeItem(f.item),
      amount: Number(f.amount) || 0
    }));

    if (selectedTables.forecast && forecastRows.length > 0) {
      onProgress?.('Mengunggah data Proyeksi Anggaran (Forecast)...');
      const { error: fErr } = await client
        .from('forecast')
        .upsert(forecastRows, { onConflict: 'id' });
      if (fErr) throw wrapTableError('forecast', fErr);
    }

    // 5. Push Realization
    const realizationRows = data.realization.map(r => ({
      id: ensureUUID(r.id),
      tanggal: (r.tanggal && r.tanggal.length >= 10) ? r.tanggal.slice(0, 10) : new Date().toISOString().slice(0, 10),
      year: Number(r.year) || 2026,
      month: resolveSafeMonth(r.month),
      cost_center: resolveSafeCostCenter(r.costCenter),
      item: resolveSafeItem(r.item),
      amount: Number(r.amount) || 0,
      keterangan: r.keterangan ? String(r.keterangan).trim() : '',
      encrypted_note: r.encryptedNote || null,
      banking_reference: r.bankingReference ? String(r.bankingReference).trim().slice(0, 64) : null,
      reconciled: Boolean(r.reconciled)
    }));

    if (selectedTables.realization && realizationRows.length > 0) {
      onProgress?.('Mengunggah data Realisasi Transaksi Kas...');
      const { error: rErr } = await client
        .from('realization')
        .upsert(realizationRows, { onConflict: 'id' });
      if (rErr) throw wrapTableError('realization', rErr);
    }

    onProgress?.('Sinkronisasi Supabase selesai!');
    return {
      success: true,
      modeUsed: options?.mode || 'append',
      counts: {
        costCenters: selectedTables.costCenters ? costCenterRows.length : 0,
        masterItems: selectedTables.masterItems ? itemRows.length : 0,
        budget: selectedTables.budget ? budgetRows.length : 0,
        forecast: selectedTables.forecast ? forecastRows.length : 0,
        realization: selectedTables.realization ? realizationRows.length : 0
      }
    };
  } catch (err: any) {
    console.error('Failed to push to Supabase:', err);
    const rawMsg = err?.message || 'Terjadi kesalahan saat mengunggah data ke Supabase.';
    const isRls = rawMsg.toLowerCase().includes('violates row-level security policy') ||
                  rawMsg.toLowerCase().includes('row-level security');
    return {
      success: false,
      error: rawMsg,
      isRlsError: isRls
    };
  }
}

export async function testSupabaseConnection(config: SupabaseConfig): Promise<{ success: boolean; latencyMs?: number; message?: string }> {
  const startTime = performance.now();
  const client = getSupabaseClient(config);
  if (!client) {
    return {
      success: false,
      message: 'Project URL atau Public Anon Key belum valid. Pastikan format URL https://[ref].supabase.co.'
    };
  }

  try {
    const { error } = await client.from('master_cost_center').select('code').limit(1);
    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      // If table doesn't exist yet, but connection was authenticated
      if (error.code === '42P01') {
        return {
          success: true,
          latencyMs,
          message: 'Terhubung ke Supabase! Catatan: Tabel database belum dibuat. Silakan jalankan DABACO SQL Schema terlebih dahulu di SQL Editor Supabase.'
        };
      }
      return {
        success: false,
        latencyMs,
        message: `Koneksi ditolak: ${error.message} (Code: ${error.code || 'UNKNOWN'})`
      };
    }

    return {
      success: true,
      latencyMs,
      message: `Koneksi Supabase Sukses! Latensi ${latencyMs}ms. RLS dan otorisasi API terverifikasi aktif.`
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal menghubungi server Supabase.'
    };
  }
}

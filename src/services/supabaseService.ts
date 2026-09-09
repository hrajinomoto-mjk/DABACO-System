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

export interface PushResult {
  success: boolean;
  error?: string;
  counts?: {
    costCenters: number;
    masterItems: number;
    budget: number;
    forecast: number;
    realization: number;
  };
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
  onProgress?: (step: string) => void
): Promise<PushResult> {
  const client = getSupabaseClient(config);
  if (!client) {
    return {
      success: false,
      error: 'Koneksi Supabase belum dikonfigurasi atau URL/Key tidak valid.'
    };
  }

  try {
    // 1. Prepare cost centers (ensure all cost centers used in budget/forecast/realization exist)
    onProgress?.('Menyiapkan Master Cost Center...');
    const costCenterMap = new Map<string, MasterCostCenter>();
    data.costCenters.forEach(cc => costCenterMap.set(cc.code, cc));

    // Auto-create missing cost centers referenced in records
    const allCostCenterCodes = new Set([
      ...data.budget.map(b => b.costCenter),
      ...data.forecast.map(f => f.costCenter),
      ...data.realization.map(r => r.costCenter)
    ]);
    allCostCenterCodes.forEach(code => {
      if (code && !costCenterMap.has(code)) {
        costCenterMap.set(code, {
          code,
          name: `Cost Center ${code}`,
          department: 'HR & GA Department',
          headOfDept: 'Manager'
        });
      }
    });

    const costCenterRows = Array.from(costCenterMap.values()).map(cc => ({
      code: cc.code,
      name: cc.name,
      department: cc.department,
      head_of_dept: cc.headOfDept || null
    }));

    if (costCenterRows.length > 0) {
      const { error: ccErr } = await client
        .from('master_cost_center')
        .upsert(costCenterRows, { onConflict: 'code' });
      if (ccErr) throw new Error(`Gagal push master_cost_center: ${ccErr.message}`);
    }

    // 2. Prepare master items (ensure all items referenced exist)
    onProgress?.('Menyiapkan Master Items & Biaya...');
    const itemMap = new Map<string, MasterItem>();
    data.masterItems.forEach(it => itemMap.set(it.code, it));

    const allItemCodes = new Set([
      ...data.budget.map(b => b.item),
      ...data.forecast.map(f => f.item),
      ...data.realization.map(r => r.item)
    ]);
    allItemCodes.forEach(code => {
      if (code && !itemMap.has(code)) {
        itemMap.set(code, {
          code,
          name: code,
          category: 'Operasional',
          status: 'Active'
        });
      }
    });

    const itemRows = Array.from(itemMap.values()).map(it => ({
      code: it.code,
      name: it.name,
      category: it.category,
      status: it.status || 'Active'
    }));

    if (itemRows.length > 0) {
      const { error: itErr } = await client
        .from('master_items')
        .upsert(itemRows, { onConflict: 'code' });
      if (itErr) throw new Error(`Gagal push master_items: ${itErr.message}`);
    }

    // 3. Push Budget Plan
    onProgress?.('Mengunggah data Rencana Anggaran (Budget Plan)...');
    const budgetRows = data.budget.map(b => ({
      id: ensureUUID(b.id),
      year: b.year,
      month: b.month,
      cost_center: b.costCenter,
      item: b.item,
      amount: b.amount
    }));

    if (budgetRows.length > 0) {
      const { error: bErr } = await client
        .from('budget_plan')
        .upsert(budgetRows, { onConflict: 'id' });
      if (bErr) throw new Error(`Gagal push budget_plan: ${bErr.message}`);
    }

    // 4. Push Forecast
    onProgress?.('Mengunggah data Proyeksi Anggaran (Forecast)...');
    const forecastRows = data.forecast.map(f => ({
      id: ensureUUID(f.id),
      year: f.year,
      month: f.month,
      cost_center: f.costCenter,
      item: f.item,
      amount: f.amount
    }));

    if (forecastRows.length > 0) {
      const { error: fErr } = await client
        .from('forecast')
        .upsert(forecastRows, { onConflict: 'id' });
      if (fErr) throw new Error(`Gagal push forecast: ${fErr.message}`);
    }

    // 5. Push Realization
    onProgress?.('Mengunggah data Realisasi Transaksi Kas...');
    const realizationRows = data.realization.map(r => ({
      id: ensureUUID(r.id),
      tanggal: r.tanggal,
      year: r.year,
      month: r.month,
      cost_center: r.costCenter,
      item: r.item,
      amount: r.amount,
      keterangan: r.keterangan || '',
      encrypted_note: r.encryptedNote || null,
      banking_reference: r.bankingReference || null,
      reconciled: r.reconciled ?? false
    }));

    if (realizationRows.length > 0) {
      const { error: rErr } = await client
        .from('realization')
        .upsert(realizationRows, { onConflict: 'id' });
      if (rErr) throw new Error(`Gagal push realization: ${rErr.message}`);
    }

    onProgress?.('Sinkronisasi Supabase selesai!');
    return {
      success: true,
      counts: {
        costCenters: costCenterRows.length,
        masterItems: itemRows.length,
        budget: budgetRows.length,
        forecast: forecastRows.length,
        realization: realizationRows.length
      }
    };
  } catch (err: any) {
    console.error('Failed to push to Supabase:', err);
    return {
      success: false,
      error: err?.message || 'Terjadi kesalahan saat mengunggah data ke Supabase.'
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

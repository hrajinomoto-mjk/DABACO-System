import {
  BulkUploadTarget,
  SchemaFieldDefinition,
  ValidatedRow,
  PreValidationSummary,
  BudgetRecord,
  ForecastRecord,
  RealizationRecord,
  MasterCostCenter,
  MasterItem
} from '../types';

export const SCHEMA_DEFINITIONS: Record<BulkUploadTarget, SchemaFieldDefinition[]> = {
  budget: [
    {
      key: 'year',
      label: 'Tahun (Fiscal Year)',
      required: true,
      type: 'number',
      description: 'Tahun anggaran 4 digit (misal: 2026)',
      example: '2026',
      aliases: ['tahun', 'year', 'fy', 'fiscal year', 'fiscal_year', 'thn', 'periode_tahun']
    },
    {
      key: 'month',
      label: 'Bulan (Periode)',
      required: true,
      type: 'month',
      description: 'Nama bulan (Jan, Feb, ... atau 1-12)',
      example: 'Jan',
      aliases: ['bulan', 'month', 'bln', 'period', 'periode', 'mo', 'nama_bulan']
    },
    {
      key: 'costCenter',
      label: 'Cost Center Code',
      required: true,
      type: 'string',
      description: 'Kode unit kerja / departemen (misal: HR001, PR002)',
      example: 'HR001',
      aliases: ['cost center', 'cost_center', 'costcenter', 'cc', 'kode cc', 'kode_cc', 'department', 'departemen', 'dept']
    },
    {
      key: 'item',
      label: 'Item Code',
      required: true,
      type: 'string',
      description: 'Kode akun pengeluaran dari master item (misal: HR001SALARY)',
      example: 'HR001SALARY',
      aliases: ['item', 'item code', 'item_code', 'kode item', 'kode_item', 'account', 'akun', 'account_code', 'kode_akun', 'coa']
    },
    {
      key: 'amount',
      label: 'Nominal Plafon (Budget)',
      required: true,
      type: 'number',
      description: 'Jumlah alokasi anggaran dalam Rupiah (misal: 150000000)',
      example: '150000000',
      aliases: ['amount', 'nominal', 'budget', 'plafon', 'jumlah', 'nilai', 'anggaran', 'total', 'budget_plan', 'biaya']
    }
  ],
  forecast: [
    {
      key: 'year',
      label: 'Tahun (Fiscal Year)',
      required: true,
      type: 'number',
      description: 'Tahun estimasi pengeluaran (misal: 2026)',
      example: '2026',
      aliases: ['tahun', 'year', 'fy', 'fiscal year', 'fiscal_year', 'thn']
    },
    {
      key: 'month',
      label: 'Bulan (Periode)',
      required: true,
      type: 'month',
      description: 'Nama bulan estimasi (Jan..Des atau 1-12)',
      example: 'Jan',
      aliases: ['bulan', 'month', 'bln', 'period', 'periode', 'mo']
    },
    {
      key: 'costCenter',
      label: 'Cost Center Code',
      required: true,
      type: 'string',
      description: 'Kode unit kerja / departemen (misal: HR001)',
      example: 'HR001',
      aliases: ['cost center', 'cost_center', 'costcenter', 'cc', 'kode cc', 'department', 'dept']
    },
    {
      key: 'item',
      label: 'Item Code',
      required: true,
      type: 'string',
      description: 'Kode akun pengeluaran dari master item',
      example: 'HR001SALARY',
      aliases: ['item', 'item code', 'item_code', 'kode item', 'kode_item', 'account', 'akun']
    },
    {
      key: 'amount',
      label: 'Nominal Forecast',
      required: true,
      type: 'number',
      description: 'Jumlah estimasi proyeksi pengeluaran',
      example: '145000000',
      aliases: ['amount', 'nominal', 'forecast', 'proyeksi', 'estimasi', 'jumlah', 'nilai', 'prediksi']
    }
  ],
  realization: [
    {
      key: 'tanggal',
      label: 'Tanggal Transaksi',
      required: true,
      type: 'date',
      description: 'Format tanggal YYYY-MM-DD atau DD/MM/YYYY (misal: 2026-01-25)',
      example: '2026-01-25',
      aliases: ['tanggal', 'date', 'tgl', 'tgl_transaksi', 'trans_date', 'transaction_date', 'waktu']
    },
    {
      key: 'costCenter',
      label: 'Cost Center Code',
      required: true,
      type: 'string',
      description: 'Kode unit kerja (misal: HR001)',
      example: 'HR001',
      aliases: ['cost center', 'cost_center', 'costcenter', 'cc', 'kode cc', 'department']
    },
    {
      key: 'item',
      label: 'Item Code',
      required: true,
      type: 'string',
      description: 'Kode akun pengeluaran',
      example: 'HR001SALARY',
      aliases: ['item', 'item code', 'item_code', 'kode item', 'kode_item', 'account', 'akun']
    },
    {
      key: 'amount',
      label: 'Nominal Realisasi',
      required: true,
      type: 'number',
      description: 'Jumlah aktual pengeluaran dalam Rupiah',
      example: '143500000',
      aliases: ['amount', 'nominal', 'realisasi', 'realization', 'aktual', 'actual', 'jumlah', 'nilai', 'pengeluaran', 'debet', 'debit']
    },
    {
      key: 'keterangan',
      label: 'Keterangan / Memo',
      required: false,
      type: 'string',
      description: 'Catatan atau referensi transaksi (opsional)',
      example: 'Gaji Pokok Karyawan Tetap & Kontrak Periode Jan 2026',
      aliases: ['keterangan', 'deskripsi', 'description', 'notes', 'catatan', 'memo', 'remarks', 'uraian', 'referensi']
    },
    {
      key: 'year',
      label: 'Tahun (Opsional)',
      required: false,
      type: 'number',
      description: 'Otomatis diambil dari tanggal transaksi jika kosong',
      example: '2026',
      aliases: ['tahun', 'year', 'fy', 'thn']
    },
    {
      key: 'month',
      label: 'Bulan (Opsional)',
      required: false,
      type: 'month',
      description: 'Otomatis diambil dari tanggal transaksi jika kosong',
      example: 'Jan',
      aliases: ['bulan', 'month', 'bln', 'periode']
    }
  ]
};

const MONTH_MAP: Record<string, string> = {
  '1': 'Jan', '01': 'Jan', 'jan': 'Jan', 'januari': 'Jan', 'january': 'Jan',
  '2': 'Feb', '02': 'Feb', 'feb': 'Feb', 'februari': 'Feb', 'february': 'Feb',
  '3': 'Mar', '03': 'Mar', 'mar': 'Mar', 'maret': 'Mar', 'march': 'Mar',
  '4': 'Apr', '04': 'Apr', 'apr': 'Apr', 'april': 'Apr',
  '5': 'May', '05': 'May', 'may': 'May', 'mei': 'May',
  '6': 'Jun', '06': 'Jun', 'jun': 'Jun', 'juni': 'Jun', 'june': 'Jun',
  '7': 'Jul', '07': 'Jul', 'jul': 'Jul', 'juli': 'Jul', 'july': 'Jul',
  '8': 'Aug', '08': 'Aug', 'aug': 'Aug', 'agustus': 'Aug', 'august': 'Aug',
  '9': 'Sep', '09': 'Sep', 'sep': 'Sep', 'september': 'Sep',
  '10': 'Oct', 'oct': 'Oct', 'oktober': 'Oct', 'october': 'Oct',
  '11': 'Nov', 'nov': 'Nov', 'november': 'Nov',
  '12': 'Dec', 'dec': 'Dec', 'desember': 'Dec', 'december': 'Dec'
};

/**
 * Parses raw CSV string into headers and rows.
 * Supports auto-detecting delimiters (, ; \t), quotes, newlines, and UTF-8 BOM.
 */
export function parseCSV(rawContent: string): { headers: string[]; rows: Record<string, string>[]; rawRowCount: number } {
  // Strip BOM if present
  let content = rawContent.replace(/^\uFEFF/, '').trim();
  if (!content) {
    return { headers: [], rows: [], rawRowCount: 0 };
  }

  // Detect delimiter based on first line
  const firstLine = content.split(/\r?\n/)[0] || '';
  let delimiter = ',';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semiCount > commaCount && semiCount > tabCount) {
    delimiter = ';';
  } else if (tabCount > commaCount && tabCount > semiCount) {
    delimiter = '\t';
  }

  // State machine parser to handle quoted strings with commas and newlines
  const parsedRows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      currentCell = '';
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
        parsedRows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  // Push last cell & row if remaining
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
      parsedRows.push(currentRow);
    }
  }

  if (parsedRows.length === 0) {
    return { headers: [], rows: [], rawRowCount: 0 };
  }

  const rawHeaders = parsedRows[0].map(h => h.trim());
  const dataRows = parsedRows.slice(1);

  const rows: Record<string, string>[] = [];
  for (const rowCells of dataRows) {
    // Check if entire row is empty
    if (rowCells.every(c => c === '')) continue;
    const rowObj: Record<string, string> = {};
    rawHeaders.forEach((header, idx) => {
      rowObj[header] = rowCells[idx] !== undefined ? rowCells[idx].trim() : '';
    });
    rows.push(rowObj);
  }

  return {
    headers: rawHeaders,
    rows,
    rawRowCount: dataRows.length
  };
}

/**
 * Cleans string for fuzzy matching against aliases
 */
function normalizeHeaderName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Intelligent auto-mapping of user CSV headers to internal schema definitions.
 */
export function autoMapHeaders(
  csvHeaders: string[],
  target: BulkUploadTarget
): Record<string, string> {
  const schemaFields = SCHEMA_DEFINITIONS[target];
  const mapping: Record<string, string> = {};
  const usedHeaders = new Set<string>();

  schemaFields.forEach(field => {
    const normalizedKey = normalizeHeaderName(field.key);
    const normalizedLabel = normalizeHeaderName(field.label);
    const normalizedAliases = field.aliases.map(normalizeHeaderName);

    // 1. Exact match on field.key
    let match = csvHeaders.find(h => !usedHeaders.has(h) && normalizeHeaderName(h) === normalizedKey);

    // 2. Exact match on label
    if (!match) {
      match = csvHeaders.find(h => !usedHeaders.has(h) && normalizeHeaderName(h) === normalizedLabel);
    }

    // 3. Match against aliases
    if (!match) {
      match = csvHeaders.find(h => !usedHeaders.has(h) && normalizedAliases.includes(normalizeHeaderName(h)));
    }

    // 4. Substring / contains match
    if (!match) {
      match = csvHeaders.find(h => {
        if (usedHeaders.has(h)) return false;
        const normH = normalizeHeaderName(h);
        return normalizedAliases.some(alias => normH.includes(alias) || alias.includes(normH));
      });
    }

    if (match) {
      mapping[field.key] = match;
      usedHeaders.add(match);
    } else {
      mapping[field.key] = ''; // Unmapped
    }
  });

  return mapping;
}

/**
 * Parses monetary string into a clean number.
 * Handles "Rp 150.000.000,00", "150,000,000.00", "150000000", "(5000)", etc.
 */
export function parseFinancialAmount(val: string | number | undefined): number | null {
  if (val === undefined || val === null) return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;

  let str = String(val).trim();
  if (!str) return null;

  // Handle accounting negative format: (1000) -> -1000
  let isNegative = false;
  if (str.startsWith('(') && str.endsWith(')')) {
    isNegative = true;
    str = str.slice(1, -1).trim();
  } else if (str.startsWith('-')) {
    isNegative = true;
    str = str.slice(1).trim();
  }

  // Remove currency prefix and symbols
  str = str.replace(/^(rp|idr|usd|\$)\s*/i, '');
  str = str.replace(/[^\d.,]/g, '');

  // Determine decimal separator
  // Indonesian: 150.000.000,50 -> dot is thousand separator, comma is decimal
  // US: 150,000,000.50 -> comma is thousand, dot is decimal
  if (str.includes('.') && str.includes(',')) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      // Indonesian format
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      // US format
      str = str.replace(/,/g, '');
    }
  } else if (str.includes(',')) {
    // Check if comma is used as decimal or thousand
    const parts = str.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      str = parts[0] + '.' + parts[1];
    } else {
      str = str.replace(/,/g, '');
    }
  } else if (str.includes('.')) {
    // Multiple dots = thousand separators (e.g. 150.000.000)
    const dots = str.split('.').length - 1;
    if (dots > 1) {
      str = str.replace(/\./g, '');
    } else {
      const parts = str.split('.');
      if (parts[1].length === 3) {
        // likely thousand separator, e.g. 50.000
        str = str.replace(/\./g, '');
      }
    }
  }

  const num = parseFloat(str);
  if (isNaN(num)) return null;
  return isNegative ? -num : num;
}

/**
 * Normalizes month string into standardized 'Jan'..'Dec'
 */
export function normalizeMonth(val: string | undefined): string | null {
  if (!val) return null;
  const clean = val.trim().toLowerCase();
  return MONTH_MAP[clean] || null;
}

/**
 * Normalizes date string into YYYY-MM-DD
 */
export function normalizeDate(val: string | undefined): { dateStr: string; year: number; month: string } | null {
  if (!val) return null;
  const str = val.trim();

  // 1. Check ISO format YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const monthStr = normalizeMonth(String(m)) || 'Jan';
      const formattedDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      return { dateStr: formattedDate, year: y, month: monthStr };
    }
  }

  // 2. Check DD/MM/YYYY or DD-MM-YYYY (Indonesian format)
  const idMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (idMatch) {
    const d = parseInt(idMatch[1], 10);
    const m = parseInt(idMatch[2], 10);
    const y = parseInt(idMatch[3], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const monthStr = normalizeMonth(String(m)) || 'Jan';
      const formattedDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      return { dateStr: formattedDate, year: y, month: monthStr };
    }
  }

  // 3. Fallback native Date parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = parsed.getMonth() + 1;
    const d = parsed.getDate();
    const monthStr = normalizeMonth(String(m)) || 'Jan';
    const formattedDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return { dateStr: formattedDate, year: y, month: monthStr };
  }

  return null;
}

/**
 * Runs pre-validation logic mapping raw CSV rows to the internal schema definitions.
 */
export function preValidateRows(
  rawRows: Record<string, string>[],
  headerMapping: Record<string, string>,
  target: BulkUploadTarget,
  masterCostCenters: MasterCostCenter[],
  masterItems: MasterItem[]
): {
  validatedRows: ValidatedRow[];
  summary: PreValidationSummary;
} {
  const schemaFields = SCHEMA_DEFINITIONS[target];
  const knownCostCenters = new Set(masterCostCenters.map(cc => cc.code.toUpperCase()));
  const knownItems = new Set(masterItems.map(item => item.code.toUpperCase()));

  // Identify unmapped required fields
  const unmappedRequiredFields = schemaFields
    .filter(f => f.required && (!headerMapping[f.key] || headerMapping[f.key].trim() === ''))
    .map(f => f.label);

  const validatedRows: ValidatedRow[] = [];
  let validCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  rawRows.forEach((row, index) => {
    const errors: ValidatedRow['errors'] = [];
    const rowIndex = index + 1;

    // Check required fields mapping
    if (unmappedRequiredFields.length > 0) {
      errors.push({
        field: 'mapping',
        message: `Kolom wajib belum dipetakan: ${unmappedRequiredFields.join(', ')}`,
        severity: 'error'
      });
    }

    let parsedResult: any = null;

    if (target === 'budget' || target === 'forecast') {
      const yearCol = headerMapping['year'];
      const monthCol = headerMapping['month'];
      const ccCol = headerMapping['costCenter'];
      const itemCol = headerMapping['item'];
      const amountCol = headerMapping['amount'];

      const rawYear = yearCol ? row[yearCol] : '';
      const rawMonth = monthCol ? row[monthCol] : '';
      const rawCC = ccCol ? row[ccCol] : '';
      const rawItem = itemCol ? row[itemCol] : '';
      const rawAmount = amountCol ? row[amountCol] : '';

      // Year validation
      let yearNum = parseInt(rawYear, 10);
      if (!rawYear || isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
        errors.push({
          field: 'year',
          message: `Tahun tidak valid: "${rawYear || 'kosong'}" (Harus 4 digit, misal: 2026)`,
          severity: 'error'
        });
      }

      // Month validation
      const normalizedMonthVal = normalizeMonth(rawMonth);
      if (!normalizedMonthVal) {
        errors.push({
          field: 'month',
          message: `Bulan tidak valid: "${rawMonth || 'kosong'}" (Gunakan Jan..Dec atau 1..12)`,
          severity: 'error'
        });
      }

      // Cost Center validation
      const cleanCC = (rawCC || '').trim().toUpperCase();
      if (!cleanCC) {
        errors.push({
          field: 'costCenter',
          message: 'Kode Cost Center wajib diisi',
          severity: 'error'
        });
      } else if (!knownCostCenters.has(cleanCC)) {
        errors.push({
          field: 'costCenter',
          message: `Cost Center "${cleanCC}" tidak terdaftar di master (Akan tetap diimpor sebagai kode baru)`,
          severity: 'warning'
        });
      }

      // Item validation
      const cleanItem = (rawItem || '').trim();
      if (!cleanItem) {
        errors.push({
          field: 'item',
          message: 'Kode Item wajib diisi',
          severity: 'error'
        });
      } else if (!knownItems.has(cleanItem.toUpperCase())) {
        errors.push({
          field: 'item',
          message: `Kode Item "${cleanItem}" belum terdaftar di Master Item (Akan tetap diimpor)`,
          severity: 'warning'
        });
      }

      // Amount validation
      const parsedAmount = parseFinancialAmount(rawAmount);
      if (parsedAmount === null) {
        errors.push({
          field: 'amount',
          message: `Nominal tidak valid: "${rawAmount || 'kosong'}"`,
          severity: 'error'
        });
      } else if (parsedAmount < 0) {
        errors.push({
          field: 'amount',
          message: `Nominal bernilai negatif (${parsedAmount.toLocaleString('id-ID')})`,
          severity: 'warning'
        });
      }

      const hasFatalErrors = errors.some(e => e.severity === 'error');
      if (!hasFatalErrors && normalizedMonthVal && parsedAmount !== null) {
        parsedResult = {
          year: yearNum || 2026,
          month: normalizedMonthVal,
          costCenter: cleanCC,
          item: cleanItem,
          amount: parsedAmount
        };
      }
    } else {
      // Realization Target
      const dateCol = headerMapping['tanggal'];
      const ccCol = headerMapping['costCenter'];
      const itemCol = headerMapping['item'];
      const amountCol = headerMapping['amount'];
      const ketCol = headerMapping['keterangan'];
      const yearCol = headerMapping['year'];
      const monthCol = headerMapping['month'];

      const rawDate = dateCol ? row[dateCol] : '';
      const rawCC = ccCol ? row[ccCol] : '';
      const rawItem = itemCol ? row[itemCol] : '';
      const rawAmount = amountCol ? row[amountCol] : '';
      const rawKet = ketCol ? row[ketCol] : '';
      const rawYear = yearCol ? row[yearCol] : '';
      const rawMonth = monthCol ? row[monthCol] : '';

      // Date validation
      const dateObj = normalizeDate(rawDate);
      if (!dateObj) {
        errors.push({
          field: 'tanggal',
          message: `Format tanggal tidak dikenali: "${rawDate || 'kosong'}" (Gunakan YYYY-MM-DD atau DD/MM/YYYY)`,
          severity: 'error'
        });
      }

      let yearVal = dateObj?.year || 2026;
      if (rawYear) {
        const parsedY = parseInt(rawYear, 10);
        if (!isNaN(parsedY) && parsedY >= 2000) yearVal = parsedY;
      }

      let monthVal = dateObj?.month || 'Jan';
      if (rawMonth) {
        const normM = normalizeMonth(rawMonth);
        if (normM) monthVal = normM;
      }

      // Cost Center
      const cleanCC = (rawCC || '').trim().toUpperCase();
      if (!cleanCC) {
        errors.push({
          field: 'costCenter',
          message: 'Kode Cost Center wajib diisi',
          severity: 'error'
        });
      } else if (!knownCostCenters.has(cleanCC)) {
        errors.push({
          field: 'costCenter',
          message: `Cost Center "${cleanCC}" tidak terdaftar di master`,
          severity: 'warning'
        });
      }

      // Item
      const cleanItem = (rawItem || '').trim();
      if (!cleanItem) {
        errors.push({
          field: 'item',
          message: 'Kode Item wajib diisi',
          severity: 'error'
        });
      } else if (!knownItems.has(cleanItem.toUpperCase())) {
        errors.push({
          field: 'item',
          message: `Kode Item "${cleanItem}" belum terdaftar di Master Item`,
          severity: 'warning'
        });
      }

      // Amount
      const parsedAmount = parseFinancialAmount(rawAmount);
      if (parsedAmount === null) {
        errors.push({
          field: 'amount',
          message: `Nominal tidak valid: "${rawAmount || 'kosong'}"`,
          severity: 'error'
        });
      }

      const hasFatalErrors = errors.some(e => e.severity === 'error');
      if (!hasFatalErrors && dateObj && parsedAmount !== null) {
        parsedResult = {
          tanggal: dateObj.dateStr,
          year: yearVal,
          month: monthVal,
          costCenter: cleanCC,
          item: cleanItem,
          amount: parsedAmount,
          keterangan: rawKet || 'Bulk Upload CSV Ingestion'
        };
      }
    }

    const hasErrors = errors.some(e => e.severity === 'error');
    const hasWarnings = errors.some(e => e.severity === 'warning');

    if (hasErrors) {
      errorCount++;
    } else {
      validCount++;
    }
    if (hasWarnings) {
      warningCount++;
    }

    validatedRows.push({
      rowIndex,
      rawData: row,
      parsedData: parsedResult,
      isValid: !hasErrors,
      hasWarnings,
      errors
    });
  });

  return {
    validatedRows,
    summary: {
      totalRows: rawRows.length,
      validCount,
      errorCount,
      warningCount,
      unmappedRequiredFields
    }
  };
}

/**
 * Generates sample CSV template content for user download
 */
export function generateSampleCSV(target: BulkUploadTarget): string {
  if (target === 'budget') {
    return `Tahun,Bulan,Cost_Center,Kode_Item,Nominal_Plafon
2026,Jan,HR001,HR001SALARY,150000000
2026,Jan,HR001,HR001BONUS,45000000
2026,Jan,PR002,PR002RAWMEAT,320000000
2026,Feb,HR001,HR001TRAINING,65000000
2026,Feb,GA003,GA003OFFICESUPPLY,35000000
2026,Feb,QC004,QC004LABREAGENTS,42000000`;
  } else if (target === 'forecast') {
    return `Year,Month,CostCenter,ItemCode,ForecastAmount
2026,Jan,HR001,HR001SALARY,148000000
2026,Jan,HR001,HR001BONUS,42000000
2026,Jan,PR002,PR002RAWMEAT,315000000
2026,Feb,HR001,HR001TRAINING,68000000
2026,Feb,GA003,GA003OFFICESUPPLY,33000000
2026,Feb,QC004,QC004LABREAGENTS,44000000`;
  } else {
    return `Tanggal,Cost_Center,Kode_Item,Nominal_Realisasi,Keterangan
2026-01-25,HR001,HR001SALARY,147500000,"Payroll Payroll Gaji Karyawan Tetap Jan 2026"
2026-01-28,PR002,PR002RAWMEAT,310000000,"PO-2026-004 Pembelian Daging Bahan Baku Ajinomoto"
2026-02-10,HR001,HR001TRAINING,71500000,"Pelatihan Food Safety & ISO 22000 Auditor"
2026-02-15,GA003,GA003OFFICESUPPLY,32800000,"Pengadaan ATK dan Kertas Divisi Head Office"
2026-02-18,QC004,QC004LABREAGENTS,43900000,"Reagen Analisis Laboratorium Batch Q1"`;
  }
}

export type Language = 'id' | 'en';

export interface LanguageOption {
  code: Language;
  shortLabel: string;
  name: string;
  nativeName: string;
  region: string;
  locale: string;
  descriptionId: string;
  descriptionEn: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'id',
    shortLabel: 'ID',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    region: 'Indonesia (WIB)',
    locale: 'id-ID',
    descriptionId: 'Bahasa standar operasional pabrik Mojokerto untuk seluruh modul kendali anggaran, pelaporan, dan pengaturan.',
    descriptionEn: 'Standard operational language for Mojokerto Factory across all budget control, reporting, and configuration modules.'
  },
  {
    code: 'en',
    shortLabel: 'EN',
    name: 'English',
    nativeName: 'English (Enterprise)',
    region: 'International Corporate',
    locale: 'en-US',
    descriptionId: 'Bahasa korporat internasional untuk rapat direksi, audit regional Ajinomoto Group, dan ekspor laporan eksekutif.',
    descriptionEn: 'International corporate English for Board of Directors meetings, Ajinomoto Group regional audits, and executive reporting.'
  }
];

/**
 * Curated Full-Enterprise Indonesian -> English phrase dictionary.
 * Covers Dashboard, Executive Report, Presentation Deck, Data Management,
 * Looker BI, Google Sheets Sync, Email Alerts, User Management, Banking API,
 * Supabase Backend, System Settings, and all Modals.
 */
const RAW_ENTERPRISE_DICTIONARY: Array<[string, string]> = [
  // =========================================================
  // FULL SENTENCES & LONGER DESCRIPTIVE PHRASES
  // =========================================================
  ['Konfigurasi parameter fiskal Ajinomoto, master cost center pabrik riil, enkripsi data, dan integritas sistem.', 'Configure Ajinomoto fiscal parameters, factory master cost centers, data encryption, and system integrity.'],
  ['Konfigurasi kebijakan anggaran berhasil disimpan dan diperbarui di seluruh modul sistem!', 'Budget policy configuration has been saved and updated across all system modules!'],
  ['Standar tahun anggaran, siklus kalender April - Maret, dan batas peringatan dini (Early Warning).', 'Fiscal year standard, April–March calendar cycle, and early warning thresholds.'],
  ['Data otomatis tersimpan langsung secara permanen ke dalam database DABACO', 'Data is automatically saved permanently to the DABACO database'],
  ['Data otomatis tersimpan langsung ke database', 'Data is automatically saved directly to the database'],
  ['Data yang sudah ada sebelumnya di Supabase TIDAK akan dihapus.', 'Existing records in Supabase will NOT be deleted.'],
  ['Semua aksi di konsol ini dicatat secara aman dalam sistem DABACO.', 'All actions in this console are securely logged in the DABACO system.'],
  ['Arahkan kursor ke titik chart untuk melihat rincian variansi', 'Hover over chart points to inspect variance details'],
  ['Peringatan Ambang Batas Anggaran Terdeteksi!', 'Budget Threshold Warning Detected!'],
  ['Kirim peringatan kuning saat realisasi mencapai nilai ini.', 'Send warning alert when realization reaches this threshold.'],
  ['Kirim alert prioritas tinggi saat realisasi melampaui forecast.', 'Send high-priority alert when realization exceeds forecast.'],
  ['Format terhubung langsung dengan modul Budget Plan, Forecast, dan Realisasi', 'Format integrates directly with Budget Plan, Forecast, and Realization modules'],
  ['Sinkronisasi otomatis spreadsheet online ke database internal.', 'Automatic synchronization from online spreadsheets to the internal database.'],
  ['Dashboard interaktif visualisasi pimpinan terhubung real-time.', 'Interactive executive visualization dashboard connected in real time.'],
  ['Sesi login & backup terproteksi standar ISO/IEC 27001.', 'Login sessions and backups protected under ISO/IEC 27001 standards.'],
  ['Perbarui kata sandi akun resmi administrator DABACO', 'Update official DABACO administrator account password'],
  ['Enkripsi sesi SHA-256 dengan proteksi brute-force', 'SHA-256 session encryption with brute-force protection'],
  ['Pintasan aktif secara global di seluruh sistem DABACO.', 'Shortcuts are active globally across the DABACO system.'],
  ['Seluruh transaksi dan data budget telah tersimpan', 'All transactions and budget records have been saved'],
  ['Dapat ditemukan pada URL spreadsheet Anda antara /d/ dan /edit.', 'Can be found in your spreadsheet URL between /d/ and /edit.'],
  ['Salin skrip ini ke Apps Script spreadsheet Anda', 'Copy this script into your spreadsheet Apps Script'],
  ['Jalankan di Supabase SQL Editor untuk membuat tabel dan fungsi enkripsi', 'Run in the Supabase SQL Editor to create tables and encryption functions'],
  ['Kredensial aktif dimuat dari sistem environment', 'Active credentials loaded from system environment'],
  ['cadangan kas pabrik Mojokerto berada dalam kondisi yang sangat memadai (surplus likuiditas', 'Mojokerto Factory cash reserves are in a very strong position (liquidity surplus'],
  ['Budget Plan, Forecast, Realisasi Kas, Cost Center, dan Master Items', 'Budget Plan, Forecast, Cash Realization, Cost Centers, and Master Items'],
  ['Budget Plan, Forecast, Realisasi Kas', 'Budget Plan, Forecast, Cash Realization'],
  ['Pengaturan Sistem & Kebijakan Anggaran', 'System Settings & Budget Policy'],
  ['Kebijakan Anggaran & Siklus Fiskal Ajinomoto', 'Ajinomoto Budget Policy & Fiscal Cycle'],
  ['Slide 1: Makro Keuangan Pabrik Mojokerto & Health Index', 'Slide 1: Mojokerto Factory Financial Macro & Health Index'],
  ['Slide 2: Evaluasi Kinerja Cost Center & Departemen', 'Slide 2: Cost Center & Department Performance Evaluation'],
  ['Slide 3: Rincian Pos Item Beban Operasional', 'Slide 3: Operational Expense Line-Item Breakdown'],
  ['Slide 4: Pacing Pengeluaran & Siklus Fiscal Year', 'Slide 4: Spending Pacing & Fiscal Year Cycle'],
  ['Evaluasi Penyerapan Kas & Koridor Toleransi Operasional', 'Cash Absorption Evaluation & Operational Tolerance Corridor'],
  ['Catatan Tambahan untuk Manajemen (Opsional)', 'Additional Notes for Management (Optional)'],
  ['Catatan Aktivitas & Remarks Realisasi', 'Activity Notes & Realization Remarks'],
  ['Catatan Anomali & Rekomendasi Audit', 'Anomaly Notes & Audit Recommendations'],
  ['Blok Tanda Tangan 3 Pejabat Pabrik', '3-Executive Factory Approval Signature Block'],
  ['Tabel Lengkap Per Pos Item Anggaran', 'Complete Table by Budget Line Item'],
  ['Tabel 12 Bulan (Januari - Desember)', '12-Month Breakdown Table (January – December)'],
  ['Deviasi Budget vs Forecast vs Realisasi', 'Budget vs Forecast vs Realization Variance'],
  ['Tren Bulanan & Pengesahan Legal', 'Monthly Trends & Official Authorization'],
  ['Status Kepatuhan Audit Finansial', 'Financial Audit Compliance Status'],
  ['Integritas Laporan Terverifikasi:', 'Verified Report Integrity:'],
  ['Status Perbandingan Record: Lokal vs Supabase Cloud', 'Record Comparison Status: Local vs Supabase Cloud'],
  ['1. Push ke Supabase (Menimpa / Tambah)', '1. Push to Supabase (Overwrite / Append)'],
  ['2. Tarik Data (Pull & Restore)', '2. Pull Data (Pull & Restore)'],
  ['3. Cadangan File (Snapshot JSON)', '3. File Backup (JSON Snapshot)'],
  ['4. Kosongkan Tabel Cloud', '4. Clear Cloud Tables'],
  ['5. Reset Standar Pabrik', '5. Factory Default Reset'],
  ['1. Auto-Load Instan Saat Sistem Dibuka', '1. Instant Auto-Load on System Launch'],
  ['1. Pengesahan Realisasi Triwulan', '1. Quarterly Realization Approval'],
  ['2. Realokasi Cadangan Pos Pelatihan', '2. Training Reserve Reallocation'],
  ['Panduan Integrasi Backend Supabase', 'Supabase Backend Integration Guide'],
  ['Panduan Pintasan Tombol Cepat', 'Quick Keyboard Shortcuts Guide'],
  ['Rekening Koran & Pencocokan Voucher', 'Bank Statements & Voucher Reconciliation'],
  ['Berita Acara Rekonsiliasi (BAP Resmi)', 'Official Reconciliation Report (BAP)'],
  ['Proyeksi Kebutuhan Kas (30 Hari)', 'Cash Requirement Forecast (30 Days)'],
  ['2 Rekening Giro Operasional', '2 Operational Checking Accounts'],
  ['Sistem DABACO Terintegrasi Google Sheets', 'DABACO System Integrated with Google Sheets'],
  ['Pimpinan & Manajemen HR Department', 'HR Department Leadership & Management'],
  ['Disetujui untuk Rapat Direksi:', 'Approved for Board of Directors Meeting:'],
  ['Terbuka (Revisi & Input Aktif)', 'Open (Active Revision & Input)'],
  ['Proses Audit (Read-Only Warning)', 'Audit In Progress (Read-Only Warning)'],
  ['Terkunci Resmi (Final Budget)', 'Officially Locked (Final Budget)'],
  ['April - Maret (Standar Ajinomoto Group)', 'April – March (Ajinomoto Group Standard)'],
  ['Pabrik Mojokerto (PT AI & PT AX)', 'Mojokerto Factory (PT AI & PT AX)'],

  // =========================================================
  // SECTION TITLES, CARDS, BUTTONS & STATUS LABELS
  // =========================================================
  ['Aksi Operasional & Pelaporan:', 'Operational & Reporting Actions:'],
  ['Kirim Notifikasi Email Otomatis', 'Send Automated Email Notification'],
  ['Kirim Laporan via Email', 'Send Report via Email'],
  ['Semua Cost Center (Consolidated)', 'All Cost Centers (Consolidated)'],
  ['Semua Departemen (Pabrik Mojokerto)', 'All Departments (Mojokerto Factory)'],
  ['Semua Tahun Anggaran (All FY)', 'All Fiscal Years (All FY)'],
  ['Semua Seksi / Departemen', 'All Sections / Departments'],
  ['Semua Status Pencocokan', 'All Reconciliation Statuses'],
  ['Semua Rekening Bank', 'All Bank Accounts'],
  ['Semua Status Akun', 'All Account Statuses'],
  ['Semua Peran (Role)', 'All Roles'],
  ['Semua Cost Center', 'All Cost Centers'],
  ['Semua Kategori', 'All Categories'],
  ['Semua Bulan', 'All Months'],
  ['Semua Tahun', 'All Years'],
  ['Semua Status', 'All Statuses'],
  ['Mode Presentasi Direksi', 'Board Presentation Mode'],
  ['Cetak Dossier PDF', 'Export PDF Dossier'],
  ['Cetak / Unduh Berita Acara', 'Print / Download Report'],
  ['Ekspor CSV', 'Export CSV'],
  ['Ekspor PDF', 'Export PDF'],
  ['Ekspor Excel', 'Export Excel'],
  ['Unduh Format Template CSV', 'Download CSV Template Format'],
  ['Download File Cadangan (.json)', 'Download Backup File (.json)'],
  ['Konfirmasi & Unduh Berkas', 'Confirm & Download File'],
  ['Bulk Upload Data Keuangan', 'Bulk Upload Financial Data'],
  ['Konsol Manajemen Database', 'Database Management Console'],
  ['Tarik & Pulihkan Data Sekarang', 'Pull & Restore Data Now'],
  ['Terapkan Dataset Standar Awal Pabrik', 'Apply Factory Default Dataset'],
  ['Kosongkan Tabel Sekarang', 'Clear Tables Now'],
  ['Push Data ke Supabase', 'Push Data to Supabase'],
  ['Coba Push Data Sekarang', 'Try Pushing Data Now'],
  ['Push Data Ulang', 'Re-Push Data'],
  ['Buka SQL Editor Supabase', 'Open Supabase SQL Editor'],
  ['Buka SQL Editor & klik RUN', 'Open SQL Editor & click RUN'],
  ['Salin Skrip SQL', 'Copy SQL Script'],
  ['Klik tombol salin di bawah', 'Click the copy button below'],
  ['Data langsung tersimpan', 'Data saved immediately'],
  ['Tersimpan Permanen', 'Permanently Saved'],
  ['Simpan Otomatis ke Database', 'Auto-Save to Database'],
  ['Simpan Parameter Kebijakan', 'Save Policy Parameters'],
  ['Simpan Cost Center', 'Save Cost Center'],
  ['Simpan Perubahan', 'Save Changes'],
  ['Simpan Pengaturan', 'Save Settings'],
  ['Tambah Cost Center', 'Add Cost Center'],
  ['Tambah Pengguna Baru', 'Add New User'],
  ['Tambah Data Baru', 'Add New Record'],
  ['Ubah Data Pengguna', 'Edit User Profile'],
  ['Ya, Keluar Sesi', 'Yes, Sign Out'],
  ['Ya, Hapus', 'Yes, Delete'],
  ['Batal', 'Cancel'],
  ['Tutup', 'Close'],
  ['Kembali', 'Back'],
  ['Lanjut ke Pra-Validasi', 'Proceed to Pre-Validation'],
  ['Mode Menimpa Total (Clean Overwrite)', 'Clean Overwrite Mode'],
  ['Menimpa Total (Overwrite)', 'Full Overwrite'],
  ['Menimpa Data Lokal (Overwrite Local)', 'Overwrite Local Data'],
  ['Gabungkan ke Data Lokal (Append & Merge)', 'Append & Merge to Local Data'],
  ['Hanya Tabel Transaksi', 'Transaction Tables Only'],
  ['Seluruh Tabel Database', 'All Database Tables'],
  ['Reset Auto-Mapping', 'Reset Auto-Mapping'],
  ['Reset Default', 'Reset Default'],
  ['Target Skema:', 'Target Schema:'],
  ['Kolom pada File CSV Pengguna', 'Columns in User CSV File'],
  ['-- Tidak Dipetakan (Kosong) --', '-- Unmapped (Empty) --'],
  ['Baris Valid (Siap Impor)', 'Valid Rows (Ready to Import)'],
  ['Peringatan (Master Baru)', 'Warnings (New Master Items)'],
  ['Error Kritis (Invalid)', 'Critical Errors (Invalid)'],
  ['Data Hasil Normalisasi', 'Normalized Output Data'],
  ['Data gagal dinormalisasi', 'Failed to normalize data'],
  ['Total Baris / Item', 'Total Rows / Items'],
  ['Total Baris', 'Total Rows'],
  ['Total di Database:', 'Total in Database:'],
  ['Total Dataset Terproteksi:', 'Total Protected Datasets:'],
  ['Total Data Riil', 'Total Real Records'],
  ['Status Auto-Backup Realtime:', 'Real-Time Auto-Backup Status:'],
  ['Protokol Enkripsi:', 'Encryption Protocol:'],
  ['Protokol Keamanan Kredensial', 'Credential Security Protocol'],
  ['Enkripsi Enterprise', 'Enterprise Encryption'],
  ['Enkripsi AES-256 Aktif', 'AES-256 Encryption Active'],
  ['Password Baru', 'New Password'],
  ['Konfirmasi Password', 'Confirm Password'],
  ['Kata Sandi Baru', 'New Password'],
  ['Kata Sandi', 'Password'],
  ['Email penerima terdaftar aktif', 'Active registered recipient emails'],
  ['Peringatan Awal (Warning Threshold):', 'Early Warning Threshold:'],
  ['Batas Bahaya (Over Budget Threshold):', 'Critical Limit (Over Budget Threshold):'],
  ['Target testing:', 'Test target:'],
  ['Target Aman Korporat: 75% - 85%', 'Corporate Safe Target: 75% – 85%'],
  ['Batas Budget: 100%', 'Budget Ceiling: 100%'],
  ['Disiplin Biaya & Audit Valid', 'Cost Discipline & Audit Valid'],
  ['Kapasitas Sangat Aman', 'Highly Secure Capacity'],
  ['Kop Surat Resmi Ajinomoto', 'Official Ajinomoto Letterhead'],
  ['Cakupan Entitas & Periode', 'Entity & Period Coverage'],
  ['Status Kepatuhan:', 'Compliance Status:'],
  ['Status Tata Kelola', 'Governance Status'],
  ['Status Koneksi', 'Connection Status'],
  ['Status Data:', 'Data Status:'],
  ['Status Tombol Alt:', 'Alt-Key Status:'],
  ['Daftar Lengkap [?]', 'Full Directory [?]'],
  ['SELISIH KAS BERSIH (VARIANS):', 'NET CASH VARIANCE:'],
  ['Total Sisa Budget (Top 3)', 'Total Remaining Budget (Top 3)'],
  ['Sisa Saldo Budget', 'Remaining Budget Balance'],
  ['Sisa Budget Kas:', 'Remaining Cash Budget:'],
  ['Sisa Budget (IDR)', 'Remaining Budget (IDR)'],
  ['Sisa Budget', 'Remaining Budget'],
  ['Sisa Anggaran', 'Remaining Budget'],
  ['Budget Tahunan', 'Annual Budget'],
  ['Budget Anggaran:', 'Allocated Budget:'],
  ['Budget Anggaran', 'Allocated Budget'],
  ['Proyeksi Dinamis', 'Dynamic Forecast'],
  ['Proyeksi Kas', 'Cash Forecast'],
  ['Proyeksi Forecast (IDR)', 'Forecast Projection (IDR)'],
  ['Proyeksi (Forecast)', 'Forecast Projection'],
  ['Estimasi Kebutuhan Kas', 'Estimated Cash Requirement'],
  ['Realisasi Aktual (IDR)', 'Actual Realization (IDR)'],
  ['Realisasi Aktual:', 'Actual Realization:'],
  ['Realisasi Aktual', 'Actual Realization'],
  ['Realisasi (Actual)', 'Actual Realization'],
  ['Realisasi Kas:', 'Cash Realization:'],
  ['Realisasi Kas', 'Cash Realization'],
  ['Realisasi / Budget:', 'Realization / Budget:'],
  ['Realisasi:', 'Realization:'],
  ['Penyerapan Terbesar', 'Highest Absorption'],
  ['Rasio Penyerapan:', 'Absorption Ratio:'],
  ['Laju Penyerapan', 'Absorption Rate'],
  ['Penyerapan:', 'Absorption:'],
  ['Deviasi vs Budget', 'Variance vs Budget'],
  ['Deviasi (B - F)', 'Variance (B - F)'],
  ['Efisiensi (F - R)', 'Efficiency (F - R)'],
  ['Efisiensi Kas:', 'Cash Efficiency:'],
  ['Efisiensi Kas', 'Cash Efficiency'],
  ['Basis Alokasi FY', 'FY Allocation Basis'],
  ['Analisis Pos Item Beban', 'Expense Line-Item Analysis'],
  ['Nama Pos Item', 'Expense Line Item'],
  ['Pos Item Terhubung', 'Linked Line Items'],
  ['Item Anggaran', 'Budget Item'],
  ['Tanggal Transaksi', 'Transaction Date'],
  ['Uraian Transaksi Mutasi', 'Statement Transaction Description'],
  ['Nominal Pengeluaran', 'Expense Amount'],
  ['Nominal Amount (IDR)', 'Amount (IDR)'],
  ['Nominal (IDR)', 'Amount (IDR)'],
  ['Keterangan / Remarks', 'Description / Remarks'],
  ['Keterangan', 'Remarks'],
  ['Bulan / Thn', 'Month / Yr'],
  ['Baris Realisasi', 'Realization Rows'],
  ['Entitas Pabrik', 'Factory Entity'],
  ['Departemen / Bagian', 'Department / Section'],
  ['Seksi / Departemen', 'Section / Department'],
  ['Kepala Bagian (PIC)', 'Section Head (PIC)'],
  ['Pengguna & Akun', 'Users & Accounts'],
  ['Peran & Hak Akses', 'Roles & Permissions'],
  ['Akun Aktif', 'Active Accounts'],
  ['Budget & Pelaporan Tiap Seksi', 'Section Budget & Reporting'],
  ['Kebijakan Aktif', 'Active Policy'],
  ['Tahun Fiskal Aktif', 'Active Fiscal Year'],
  ['Siklus Tahun Fiskal', 'Fiscal Year Cycle'],
  ['Ambang Peringatan (%)', 'Warning Threshold (%)'],
  ['Ambang Kritis (%)', 'Critical Threshold (%)'],
  ['Satuan Tampilan Mata Uang', 'Display Currency Unit'],
  ['Status Penguncian Anggaran', 'Budget Lock Status'],
  ['Lokasi Pabrik Default', 'Default Plant Location'],
  ['Notifikasi Overbudget Otomatis', 'Automatic Overbudget Alert'],
  ['Master Cost Center Pabrik', 'Factory Master Cost Centers'],
  ['Pabrik Mojokerto', 'Mojokerto Factory'],
  ['BCA Giro Operasional', 'BCA Operational Giro'],
  ['Pilih region Asia Tenggara (misal:', 'Select Southeast Asia region (e.g.:'],
  ['Masuk ke menu', 'Go to menu'],
  ['(pilih opsi', '(select option'],

  // =========================================================
  // COMMON SINGLE TERMS & COLUMN HEADERS (BOUNDARY-SAFE)
  // =========================================================
  ['Peringatan', 'Warning'],
  ['Realisasi', 'Realization'],
  ['Penyerapan', 'Absorption'],
  ['Departemen', 'Department'],
  ['Pengeluaran', 'Expenditure'],
  ['Anggaran', 'Budget'],
  ['Proyeksi', 'Forecast'],
  ['Efisiensi', 'Efficiency'],
  ['Deviasi', 'Variance'],
  ['Urutkan:', 'Sort by:'],
  ['Urutkan', 'Sort'],
  ['Tanggal', 'Date'],
  ['Bulan', 'Month'],
  ['Tahun', 'Year'],
  ['Aksi', 'Actions'],
  ['Tambah', 'Add'],
  ['Hapus', 'Delete'],
  ['Simpan', 'Save'],
  ['Salin', 'Copy'],
  ['Unduh', 'Download'],
  ['Ekspor', 'Export'],
  ['Impor', 'Import'],
  ['Cari', 'Search'],
  ['Pengguna', 'Users'],
  ['Pengaturan', 'Settings'],
  ['Laporan', 'Report'],
  ['Ringkasan', 'Summary'],
  ['Rincian', 'Details'],
  ['Keamanan', 'Security'],
  ['Cadangan', 'Backup'],
  ['Aktif', 'Active'],
  ['Nonaktif', 'Inactive'],
  ['Terhubung', 'Connected'],
  ['Kosong', 'Empty'],
  ['Baru saja', 'Just now'],
  ['menit lalu', 'min ago'],
  ['jam lalu', 'hr ago'],
  ['Hari ini', 'Today'],

  // Indonesian Month Names
  ['Januari', 'January'],
  ['Februari', 'February'],
  ['Maret', 'March'],
  ['Mei', 'May'],
  ['Juni', 'June'],
  ['Juli', 'July'],
  ['Agustus', 'August'],
  ['Oktober', 'October'],
  ['Desember', 'December'],
  ['Senin', 'Monday'],
  ['Selasa', 'Tuesday'],
  ['Rabu', 'Wednesday'],
  ['Kamis', 'Thursday'],
  ['Jumat', 'Friday'],
  ['Sabtu', 'Saturday'],
  ['Minggu', 'Sunday']
];

// Sort longest first so multi-word phrases always take precedence over shorter words
const SORTED_DICTIONARY = [...RAW_ENTERPRISE_DICTIONARY].sort((a, b) => b[0].length - a[0].length);

const EXACT_MAP = new Map<string, string>(
  SORTED_DICTIONARY.map(([idStr, enStr]) => [idStr.trim(), enStr])
);

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Precompile phrase matchers (longer phrases use direct match; single words require word boundaries)
const COMPILED_MATCHERS = SORTED_DICTIONARY.map(([idStr, enStr]) => {
  const isSingleWord = /^[A-Za-zÀ-ÿ0-9-]+$/.test(idStr);
  const pattern = isSingleWord
    ? new RegExp(`(?<![A-Za-z0-9_-])${escapeRegExp(idStr)}(?![A-Za-z0-9_-])`, 'g')
    : new RegExp(escapeRegExp(idStr), 'g');
  return { idStr, enStr, pattern };
});

// Quick pre-check: skip pure numbers, currencies, codes, URLs, emails
const SKIP_PATTERN = /^[\s\d.,:%+\-–—/()RpIDR$€¥•|[\]{}@#*!?]+$/;
const CODE_OR_EMAIL_PATTERN = /^(https?:\/\/|[^\s@]+@[^\s@]+\.[^\s@]+|HR\d{3}[A-Z0-9]+|[A-Z]{2,5}\d{2,6})$/;

export function translateTextToEnglish(raw: string): string {
  if (!raw || raw.length < 2) return raw;
  const trimmed = raw.trim();
  if (!trimmed || SKIP_PATTERN.test(trimmed) || CODE_OR_EMAIL_PATTERN.test(trimmed)) {
    return raw;
  }

  // Fast exact lookup preserving leading/trailing whitespace
  const exact = EXACT_MAP.get(trimmed);
  if (exact) {
    const leading = raw.match(/^\s*/)?.[0] || '';
    const trailing = raw.match(/\s*$/)?.[0] || '';
    return `${leading}${exact}${trailing}`;
  }

  let result = raw;
  let changed = false;

  for (const { idStr, enStr, pattern } of COMPILED_MATCHERS) {
    if (result.includes(idStr)) {
      const next = result.replace(pattern, enStr);
      if (next !== result) {
        result = next;
        changed = true;
      }
    }
  }

  return changed ? result : raw;
}

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
 * Comprehensive Full-Enterprise Indonesian -> English Dictionary.
 * Audited across every single file in src/ (Dashboard, Executive Report,
 * Presentation Deck, Data Management, Looker BI, Google Sheets Sync,
 * Email Alerts, User Management, Banking API, Supabase Backend,
 * System Settings, Toasts, and all Modals).
 */
const RAW_ENTERPRISE_DICTIONARY: Array<[string, string]> = [
  // =========================================================
  // 1. FULL PARAGRAPHS & LONG SENTENCES (ALL MODULES)
  // =========================================================
  [
    'Konfigurasi parameter fiskal Ajinomoto, master cost center pabrik riil, enkripsi data, dan integritas sistem.',
    'Configure Ajinomoto fiscal parameters, factory master cost centers, data encryption, and system integrity.'
  ],
  [
    'Konfigurasi kebijakan anggaran berhasil disimpan dan diperbarui di seluruh modul sistem!',
    'Budget policy configuration has been saved and updated across all system modules!'
  ],
  [
    'Standar tahun anggaran, siklus kalender April - Maret, dan batas peringatan dini (Early Warning).',
    'Fiscal year standard, April–March calendar cycle, and early warning thresholds.'
  ],
  [
    'Kebijakan ini menjadi acuan kalkulasi visualisasi KPI, alert overbudget, dan ekspor analitik Looker Studio.',
    'This policy governs KPI visualization calculations, overbudget alerts, and Looker Studio analytics exports.'
  ],
  [
    'Daftar resmi Pusat Biaya operasional PT Ajinomoto Indonesia & PT Ajinex International (Pabrik Mojokerto). Digunakan sebagai pemetaan budget anggaran dan serapan kas riil.',
    'Official roster of operational Cost Centers for PT Ajinomoto Indonesia & PT Ajinex International (Mojokerto Factory), used to map budgets and actual cash absorption.'
  ],
  [
    'Catatan: Data transaksi historis (Budget, Forecast, Realisasi) yang telah tersimpan tidak akan terhapus.',
    'Note: Previously saved historical transaction data (Budget, Forecast, Realization) will not be deleted.'
  ],
  [
    'Anda akan menghapus Cost Center berikut dari katalog resmi sistem:',
    'You are about to remove the following Cost Center from the official system catalog:'
  ],
  [
    'Tidak ada Cost Center yang cocok dengan pencarian / filter.',
    'No Cost Centers match the current search or filter criteria.'
  ],
  [
    'Tanda peringatan kuning saat serapan mencapai ambang ini.',
    'Yellow warning indicator when absorption reaches this threshold.'
  ],
  [
    'Peringatan merah saat serapan melampaui alokasi budget.',
    'Red critical alert when absorption exceeds the allocated budget.'
  ],
  [
    'Data otomatis tersimpan langsung secara permanen ke dalam database DABACO',
    'Data is automatically saved permanently to the DABACO database'
  ],
  [
    'Data otomatis tersimpan langsung ke database',
    'Data is automatically saved directly to the database'
  ],
  [
    'Data database otomatis termuat setiap kali sistem dibuka tanpa perlu pull manual. Gunakan tombol',
    'Database records load automatically whenever the system opens with no manual pull needed. Use the button'
  ],
  [
    'untuk sinkronisasi ke cloud database.',
    'to synchronize with the cloud database.'
  ],
  [
    'Tidak ada data ditemukan untuk kriteria filter ini.',
    'No records found matching these filter criteria.'
  ],
  [
    'Data akan otomatis diperbarui dan disimpan secara aman dalam database DABACO PT Ajinomoto Indonesia.',
    'Data will be automatically updated and securely stored in the PT Ajinomoto Indonesia DABACO database.'
  ],
  [
    'Data yang sudah ada sebelumnya di Supabase TIDAK akan dihapus.',
    'Existing records in Supabase will NOT be deleted.'
  ],
  [
    'Semua aksi di konsol ini dicatat secara aman dalam sistem DABACO.',
    'All actions in this console are securely logged in the DABACO system.'
  ],
  [
    'Fitur lengkap untuk Menimpa (Overwrite), Menambahkan (Append), Mengosongkan, dan Cadangan database lokal & Supabase Cloud.',
    'Full toolkit to Overwrite, Append, Clear, and Back Up both local and Supabase Cloud databases.'
  ],
  [
    'Tentukan apakah Anda ingin menambahkan/memperbarui data secara incremental atau menimpa total data lama di Supabase.',
    'Choose whether to incrementally append/update records or cleanly overwrite existing records in Supabase.'
  ],
  [
    'Menambahkan data baru dan memperbarui baris dengan ID yang sama.',
    'Adds new records and updates existing rows sharing the same ID.'
  ],
  [
    'Membersihkan/menghapus record tabel yang dipilih di Supabase terlebih dahulu, lalu memasukkan dataset saat ini secara segar.',
    'Clears selected table records in Supabase first, then inserts the current dataset cleanly.'
  ],
  [
    'Tarik Data dari Database Supabase Cloud ke Sistem Ini:',
    'Pull Data from Supabase Cloud Database into This System:'
  ],
  [
    'Muat data terbaru yang tersimpan di cloud database ke dalam aplikasi ini.',
    'Load the latest records stored in the cloud database into this application.'
  ],
  [
    'Menggantikan seluruh data di aplikasi dengan data terbaru yang ada di database Supabase.',
    'Replaces all local application data with the latest records from the Supabase database.'
  ],
  [
    'Menggabungkan data dari Supabase dengan data lokal. Data lokal yang belum di-push ke cloud tidak akan hilang.',
    'Merges Supabase data with local records. Unpushed local records will remain preserved.'
  ],
  [
    'Simpan seluruh data sistem (Budget, Forecast, Realisasi, Cost Center, Items) ke berkas offline.',
    'Export all system datasets (Budget, Forecast, Realization, Cost Centers, Items) to an offline file.'
  ],
  [
    'Unggah berkas JSON cadangan DABACO untuk memulihkan atau menambahkan data.',
    'Upload a DABACO JSON backup file to restore or append records.'
  ],
  [
    'Ganti seluruh data saat ini dengan isi file cadangan.',
    'Replace all current data with the contents of the backup file.'
  ],
  [
    'Gabungkan isi file cadangan dengan data yang sedang aktif.',
    'Merge the backup file contents with the currently active dataset.'
  ],
  [
    'Tindakan ini akan menghapus data pada tabel di database cloud Supabase secara permanen. Pastikan Anda telah mengunduh cadangan sebelum melanjutkan.',
    'This action permanently deletes records from the selected Supabase cloud tables. Make sure you have downloaded a backup before proceeding.'
  ],
  [
    '. Master Cost Center dan Items tetap aman.',
    '. Master Cost Centers and Items remain untouched.'
  ],
  [
    'Kosongkan semua 5 tabel termasuk Master Cost Center dan Master Items.',
    'Clear all 5 tables including Master Cost Centers and Master Items.'
  ],
  [
    'Pulihkan ke Data Standar Bawaan Pabrik (Initial Sample Seed)',
    'Restore to Factory Default Dataset (Initial Sample Seed)'
  ],
  [
    'Fitur ini akan mengembalikan data lokal ke dataset standar awal PT Ajinomoto Indonesia (dataset default Budget Plan, Forecast, Realisasi, Cost Centers, dan Master Items).',
    'This restores local storage to the initial PT Ajinomoto Indonesia baseline dataset (default Budget Plan, Forecast, Realization, Cost Centers, and Master Items).'
  ],
  [
    'Sistem akan membuat salinan dokumen data sesuai dengan parameter yang saat ini aktif di sistem. Pastikan data diunduh ke perangkat yang aman.',
    'The system will generate a document copy matching your active filters and parameters. Ensure the file is downloaded to a secure device.'
  ],
  [
    'Apakah Anda yakin ingin mengakhiri sesi kerja saat ini? Sesi Anda akan ditutup dengan aman dan Anda akan diarahkan kembali ke Landing Page.',
    'Are you sure you want to end your current work session? Your session will be safely closed and you will return to the Landing Page.'
  ],
  [
    'Token autentikasi lokal akan dihapus secara bersih',
    'Local authentication tokens will be cleanly cleared'
  ],
  [
    'Seluruh transaksi dan data budget telah tersimpan',
    'All transactions and budget records have been saved'
  ],
  [
    'Arahkan kursor ke titik chart untuk melihat rincian variansi',
    'Hover over chart points to inspect variance details'
  ],
  [
    'Peringatan Ambang Batas Anggaran Terdeteksi!',
    'Budget Threshold Warning Detected!'
  ],
  [
    'Cost center dengan rasio realisasi terhadap anggaran (budget) paling optimal',
    'Cost centers with the highest realization-to-budget ratio'
  ],
  [
    'Belum ada data cost center dengan anggaran di periode ini.',
    'No cost center budget records found for this period.'
  ],
  [
    'Komparasi Pengeluaran Riil (Actual Spending) vs Estimasi Forecast siklus FY (April s.d. Maret Tahun Depan)',
    'Comparison of Actual Spending vs Forecast Estimates across the FY cycle (April to March next year)'
  ],
  [
    'Proporsi realisasi pengeluaran per departemen operasional',
    'Share of actual expenditure by operational department'
  ],
  [
    'Evaluasi penyerapan dana, deviasi anggaran (B-F), efisiensi kas (F-R), dan catatan realisasi',
    'Evaluation of fund absorption, budget variance (B-F), cash efficiency (F-R), and realization remarks'
  ],
  [
    'Coba ganti kata kunci pencarian atau sesuaikan filter status untuk melihat data pos item lainnya.',
    'Try changing your search keywords or adjusting the status filter to inspect other expense line items.'
  ],
  [
    'Tidak ditemukan pos item yang cocok',
    'No matching expense line items found'
  ],
  [
    'Belum ada catatan remarks untuk pos item ini.',
    'No realization remarks recorded for this line item yet.'
  ],
  [
    'Sampul malam eksklusif dengan aksen merah Ajinomoto & aksen emas. Ideal untuk tinjauan digital, iPad, atau presentasi proyektor.',
    'Exclusive midnight cover featuring Ajinomoto crimson and gold accents. Ideal for digital reviews, tablets, and boardroom projectors.'
  ],
  [
    'DIREKOMENDASIKAN UNTUK SCREEN & C-LEVEL',
    'RECOMMENDED FOR SCREEN & C-LEVEL'
  ],
  [
    'Sampul putih gading formal berstandar korporat Jepang. Hemat tinta printer dan sangat optimal untuk pencetakan dokumen fisik.',
    'Formal Japanese corporate ivory-white cover. Ink-efficient and optimized for physical document printing and archival binders.'
  ],
  [
    'OPTIMAL UNTUK CETAK FISIK & BINDER',
    'OPTIMAL FOR PHYSICAL PRINT & BINDERS'
  ],
  [
    'Dokumen PDF dilengkapi penomoran unik, watermark korporat resmi Ajinomoto Group, dan telah disinkronkan dengan basis data Google Sheets DABACO untuk akuntabilitas Dewan Direksi.',
    'PDF dossiers include unique document numbering, official Ajinomoto Group corporate watermarks, and real-time DABACO Google Sheets synchronization for Board accountability.'
  ],
  [
    'Kinerja penyerapan anggaran pabrik berada dalam batas aman koridor toleransi manajemen (75%–85%) dengan efisiensi kas signifikan dan nihil deviasi material.',
    'Factory budget absorption remains well within management’s safe tolerance corridor (75%–85%), delivering significant cash efficiency with zero material variance.'
  ],
  [
    'Kapasitas pengeluaran pabrik dikendalikan agar berada di koridor optimal 75%–85% tanpa risiko overbudget.',
    'Factory expenditure capacity is controlled within the optimal 75%–85% corridor with zero overbudget risk.'
  ],
  [
    'Analisis pemanfaatan budget per unit kerja, akuntabilitas PIC, dan persentase penyerapan riil terhadap proyeksi.',
    'Budget utilization analysis by business unit, PIC accountability, and actual absorption rate against forecast.'
  ],
  [
    'Pemilahan alokasi biaya terbesar untuk optimalisasi pengeluaran dan evaluasi penyerapan per pos item beban.',
    'Breakdown of top cost allocations to optimize spending and evaluate absorption per expense line item.'
  ],
  [
    'Pola pengeluaran kas bulanan mengikuti siklus keuangan korporasi Ajinomoto Group dengan kontrol varians real-time.',
    'Monthly cash disbursement pattern aligned with the Ajinomoto Group corporate fiscal cycle with real-time variance controls.'
  ],
  [
    'Keputusan strategis dan rencana aksi operasional yang diajukan untuk disahkan oleh Board of Directors.',
    'Strategic resolutions and operational action plans submitted for Board of Directors endorsement.'
  ],
  [
    'Mempertahankan standar integrasi perbankan BI-FAST dan SAP ERP guna menjamin nihil anomali pembukuan hingga penutupan siklus fiskal.',
    'Maintain BI-FAST banking and SAP ERP integration standards to ensure zero ledger anomalies through fiscal year closing.'
  ],
  [
    'untuk akselerasi program pengembangan kompetensi SDM dan sertifikasi keahlian karyawan.',
    'to accelerate HR competency development programs and employee technical certifications.'
  ],
  [
    'Disiplin anggaran berada dalam batas target toleransi audit korporat.',
    'Budget discipline remains within corporate audit tolerance targets.'
  ],
  [
    'Penghematan neto dari optimasi biaya operasional vs proyeksi awal.',
    'Net savings generated from operational cost optimization vs initial forecast.'
  ],
  [
    'Varians deviasi terkontrol; nihil anomali pembengkakan anggaran.',
    'Variance deviation under control; zero budget overrun anomalies.'
  ],
  [
    'dari budget proyeksi. Laju penyerapan kas triwulanan berada dalam koridor aman toleransi korporat (75% - 85%), menjamin kelancaran pelaksanaan program training dan rekrutmen tanpa risiko overbudget.',
    'of forecasted budget. Quarterly cash absorption pacing sits comfortably inside the corporate tolerance corridor (75%–85%), securing uninterrupted training and recruitment execution without overrun risk.'
  ],
  [
    'Optimalisasi pos Talent Assessment, Training, dan Medical Check-up karyawan menghasilkan penghematan biaya bersih sebesar',
    'Optimization across Talent Assessment, Training, and Employee Medical Check-up accounts delivered net cost savings of'
  ],
  [
    'dengan tetap menjaga pemenuhan SLA dan standar mutu Ajinomoto Group.',
    'while upholding full SLA fulfillment and Ajinomoto Group quality standards.'
  ],
  [
    'Integritas Data Real-Time seluruh transaksi realisasi yang terhubung dengan sinkronisasi Google Sheets & Database DABACO System.',
    'Real-time data integrity across all realization transactions synchronized with Google Sheets and the DABACO database.'
  ],
  [
    'Pencairan anggaran operasional Q3 disetujui sesuai rencana kerja.',
    'Q3 operational budget disbursement approved per annual workplan.'
  ],
  [
    'Pengalihan sisa anggaran rekrutmen ke program penguatan sertifikasi dan modul training digital Q4.',
    'Reallocation of remaining recruitment surplus to Q4 certification and digital training modules.'
  ],
  [
    'Kontrak tahunan vendor pelatihan dan rekrutmen telah diperbarui.',
    'Annual training and recruitment vendor contracts have been renewed.'
  ],
  [
    'Perbandingan Rencana Anggaran (Budget) vs Proyeksi Kas (Forecast) vs Realisasi Nyata (Actual Spending)',
    'Comparison of Annual Budget Plan vs Cash Forecast vs Actual Spending'
  ],
  [
    'Peringkat penyerapan budget departemen dan akuntabilitas pimpinan divisi',
    'Departmental budget absorption ranking and division leadership accountability'
  ],
  [
    'Pemantauan saldo kas rekening operasional pabrik, pencocokan bukti voucher pengeluaran riil, dan Berita Acara Rekonsiliasi (BAP).',
    'Monitoring of factory operational bank balances, actual expense voucher reconciliation, and Official Reconciliation Reports (BAP).'
  ],
  [
    'Kalkulasi kebutuhan likuiditas kas berdasarkan jadwal komitmen pengeluaran dan forecast operasional masing-masing seksi.',
    'Liquidity requirement calculation based on committed payment schedules and each section’s operational forecast.'
  ],
  [
    'Total estimasi kebutuhan kas operasional untuk 30 hari ke depan adalah sebesar',
    'Total estimated operational cash requirement for the next 30 days is'
  ],
  [
    '. Dengan saldo kas saat ini yang mencapai',
    '. With current cash balances reaching'
  ],
  [
    ', cadangan kas pabrik Mojokerto berada dalam kondisi yang sangat memadai (surplus likuiditas',
    ', Mojokerto Factory cash reserves are in a very strong position (liquidity surplus'
  ],
  [
    '). Tidak diperlukan pengajuan pencairan dana darurat ke Head Office.',
    '). No emergency cash disbursement request to Head Office is required.'
  ],
  [
    'Pada hari ini telah dilakukan rekonsiliasi antara catatan kas pengeluaran operasional (DABACO HR & GA) dengan rekening koran bank operasional PT Ajinomoto Indonesia dan PT Ajinex International Pabrik Mojokerto, dengan hasil sebagai berikut:',
    'On this day, a formal reconciliation was conducted between operational cash disbursement ledgers (DABACO HR & GA) and the corporate bank statements of PT Ajinomoto Indonesia and PT Ajinex International Mojokerto Factory, with the following findings:'
  ],
  [
    'Catatan: Seluruh transaksi pengeluaran kas telah diverifikasi dan memiliki bukti pendukung voucher yang sah. Tidak ditemukan transaksi anomali atau selisih pembukuan.',
    'Note: All cash disbursement transactions have been verified with valid supporting vouchers. Zero anomalous transactions or ledger discrepancies were found.'
  ],
  [
    'Pra-validasi & pemetaan header kustom, data otomatis tersimpan permanen ke database DABACO',
    'Pre-validation & custom header mapping — records are saved permanently to the DABACO database'
  ],
  [
    'Mendukung pemisah koma (,), titik koma (;), atau tab. Nama header tidak harus sama persis dengan skema internal, Anda dapat memetakannya di langkah berikutnya.',
    'Supports comma (,), semicolon (;), or tab delimiters. Header names do not need to match the internal schema exactly; you can map them in the next step.'
  ],
  [
    'Sistem telah memetakan kolom secara otomatis berdasarkan sinonim dan kata kunci. Pastikan seluruh kolom bertanda',
    'The system automatically mapped columns using corporate synonyms and keywords. Confirm all columns marked'
  ],
  [
    'telah sesuai dengan kolom pada file CSV Anda sebelum melanjutkan ke pra-validasi.',
    'match your CSV file columns before proceeding to pre-validation.'
  ],
  [
    'Plafon alokasi anggaran tahunan per bulan dan Cost Center',
    'Annual budget allocation ceiling per month and Cost Center'
  ],
  [
    'Estimasi revisi pengeluaran berkala per Cost Center',
    'Periodic revised expenditure estimates per Cost Center'
  ],
  [
    'Pencatatan aktual tanggal transaksi, bukti pengeluaran riil',
    'Actual transaction date logging and real expenditure vouchers'
  ],
  [
    'Platform analitik komprehensif yang memuat seluruh visualisasi, data tren, dan rincian performa keuangan sistem DABACO secara langsung.',
    'Comprehensive analytics workspace presenting live visualizations, spending trends, and financial performance breakdowns directly from DABACO.'
  ],
  [
    'Visualisasi komprehensif distribusi pengeluaran per bulan siklus FY (April s.d. Maret Tahun Depan) dengan garis deviasi varians',
    'Comprehensive monthly expenditure distribution across the FY cycle (April to March next year) with variance trendlines'
  ],
  [
    'Distribusi penyerapan kas aktual berdasarkan pos item pengeluaran',
    'Actual cash absorption distribution by expense line item'
  ],
  [
    'Rasio pemanfaatan budget, sisa dana likuiditas, dan status performa disiplin biaya',
    'Budget utilization ratio, remaining liquidity reserves, and cost-discipline performance status'
  ],
  [
    'Menghubungkan DABACO langsung dengan Spreadsheet aktif (BUDGET_PLAN, FORECAST, REALIZATION) via Google Apps Script Web API.',
    'Connects DABACO directly to active spreadsheets (BUDGET_PLAN, FORECAST, REALIZATION) via the Google Apps Script Web API.'
  ],
  [
    'Endpoint Web App berizin akses eksekutif (Execute as Me, Who has access: Anyone).',
    'Authorized executive Web App endpoint (Execute as Me, Who has access: Anyone).'
  ],
  [
    'Dapat ditemukan pada URL spreadsheet Anda antara /d/ dan /edit.',
    'Located in your spreadsheet URL between /d/ and /edit.'
  ],
  [
    '. Berikan akses "Anyone" dan salin URL Web App yang dihasilkan ke form di sebelah kiri.',
    '. Grant "Anyone" access and paste the generated Web App URL into the form on the left.'
  ],
  [
    'Kirim peringatan kuning saat realisasi mencapai nilai ini.',
    'Send warning alert when realization reaches this threshold.'
  ],
  [
    'Kirim alert prioritas tinggi saat realisasi melampaui forecast.',
    'Send high-priority alert when realization exceeds forecast.'
  ],
  [
    'Otomatis kirim email saat batas anggaran terpicu',
    'Automatically dispatch email alerts when budget thresholds are triggered'
  ],
  [
    'Bersama email ini kami sampaikan bahwa sistem',
    'We hereby notify you that the'
  ],
  [
    'mendeteksi realisasi anggaran periode berjalan telah mencapai status evaluasi.',
    'has detected that current-period budget realization has reached evaluation status.'
  ],
  [
    'Rincian lengkap dan dokumen PDF laporan terenkripsi terlampir secara otomatis pada pesan ini untuk diverifikasi oleh tim Controller & Manajemen.',
    'Full breakdowns and the encrypted executive PDF dossier are automatically attached for verification by the Controller and Management teams.'
  ],
  [
    'beserta rincian KPI pengeluaran akan otomatis dilampirkan dan dikirim ke email tujuan.',
    'along with expenditure KPI breakdowns will be automatically attached and dispatched to the recipient.'
  ],
  [
    'Kelola akun staf, kepala seksi, dan penanggung jawab anggaran. Penambahan dan penghapusan akun terintegrasi langsung dengan basis data DABACO.',
    'Manage staff, section head, and budget PIC accounts. Account creation and removal sync directly with the DABACO database.'
  ],
  [
    'Pengguna dapat memperbarui kata sandi mandiri melalui menu Pengaturan Akun.',
    'Users can update their own password anytime via the Account Settings menu.'
  ],
  [
    ') dari basis data DABACO? Pengguna tidak akan dapat mengakses modul seksi lagi.',
    ') from the DABACO database? The user will immediately lose access to section modules.'
  ],
  [
    'Penyimpanan data cloud PostgreSQL terpusat (menggantikan penyimpanan lokal). Setiap kali sistem dibuka, data otomatis dimuat langsung dari Supabase.',
    'Centralized PostgreSQL cloud storage (replacing local browser storage). Every time the system opens, records load automatically from Supabase.'
  ],
  [
    'Kunci anon digunakan untuk operasi query terlindungi Row-Level Security (RLS). Seluruh transaksi diverifikasi dengan token otentikasi PostgreSQL.',
    'The anon key is used for Row-Level Security (RLS) protected queries. All transactions are authenticated with PostgreSQL tokens.'
  ],
  [
    'Data yang tersimpan di database langsung termuat otomatis secara instan saat sistem dibuka tanpa perlu pull manual setiap sesi. Transaksi tetap sinkron, aman, dan siap digunakan.',
    'Records stored in the database load automatically the moment the app opens without manual pulls per session. All transactions remain synchronized, secure, and ready.'
  ],
  [
    'Tombol Push Data akan mengunggah Master Cost Centers, Master Items, Budget Plan, Forecast, dan Realisasi ke Supabase secara terurut sesuai relasi Foreign Key.',
    'The Push Data button uploads Master Cost Centers, Master Items, Budget Plan, Forecast, and Realization to Supabase in proper Foreign Key dependency order.'
  ],
  [
    'Seluruh tabel diamankan dengan kebijakan RLS sehingga integritas data finansial training & rekrutmen terjamin dari manipulasi eksternal.',
    'All tables are secured with RLS policies to guarantee training & recruitment financial integrity against external tampering.'
  ],
  [
    ', tabel di Supabase Anda memiliki fitur RLS aktif namun belum mengizinkan akses simpan untuk aplikasi. Salin skrip di atas lalu jalankan di',
    ', your Supabase tables have RLS enabled without write policies for this application. Copy the script above and run it in'
  ],
  [
    'untuk mematikan pembatasan RLS dan memberikan izin simpan penuh.',
    'to resolve RLS restrictions and grant full write permissions.'
  ],
  [
    'Skrip skema di bawah ini sudah diperbarui dengan perintah pembatalan RLS dan hak akses penuh untuk role',
    'The schema script below has been updated with RLS policy adjustments and full grants for roles'
  ],
  [
    ', sehingga data master & transaksi kas dijamin dapat tersimpan mulus.',
    ', ensuring master data and cash transactions save reliably.'
  ],
  [
    'DABACO menggunakan Supabase sebagai lapisan backend penyimpanan relasional yang tangguh, menggantikan spreadsheet lokal untuk audit jangka panjang dan multi-user access.',
    'DABACO uses Supabase as a robust relational backend layer, replacing local spreadsheets for long-term auditing and multi-user access.'
  ],
  [
    'untuk mengunggah master data dan seluruh catatan transaksi. Setelah itu, setiap kali aplikasi dibuka, sistem akan otomatis membaca data langsung dari Supabase tanpa memerlukan penyimpanan lokal browser lagi.',
    'to upload master data and all transaction records. Afterward, each time the app opens, it will automatically read live from Supabase without relying on local browser storage.'
  ],
  [
    'Agar saat diakses melalui domain Vercel aplikasi langsung otomatis terhubung dan memuat data dari Supabase tanpa perlu mengisi form kredensial secara manual, tambahkan Environment Variables berikut di dashboard Vercel:',
    'So that the app connects automatically to Supabase on Vercel without manual credential entry, add the following Environment Variables in your Vercel project dashboard:'
  ],
  [
    ', namun belum memiliki kebijakan (Policy) yang membolehkan role aplikasi untuk menyimpan data.',
    ', but does not yet have an active Policy allowing the application role to write records.'
  ],
  [
    'Badge pintasan kini ditampilkan langsung di atas tombol navigasi & aksi.',
    'Shortcut badges are now displayed directly over navigation & action buttons.'
  ],
  [
    'Membuka wizard impor data massal Budget, Forecast, atau Realisasi.',
    'Opens the bulk CSV import wizard for Budget, Forecast, or Realization data.'
  ],
  [
    'Pintasan aktif secara global di seluruh sistem DABACO.',
    'Shortcuts are active globally across the DABACO system.'
  ],
  [
    'Format terhubung langsung dengan modul Budget Plan, Forecast, dan Realisasi',
    'Format integrates directly with Budget Plan, Forecast, and Realization modules'
  ],
  [
    'Sinkronisasi otomatis spreadsheet online ke database internal.',
    'Automatic synchronization from online spreadsheets to the internal database.'
  ],
  [
    'Dashboard interaktif visualisasi pimpinan terhubung real-time.',
    'Interactive executive visualization dashboard connected in real time.'
  ],
  [
    'Sesi login & backup terproteksi standar ISO/IEC 27001.',
    'Login sessions and backups protected under ISO/IEC 27001 standards.'
  ],
  [
    'Perbarui kata sandi akun resmi administrator DABACO',
    'Update official DABACO administrator account password'
  ],
  [
    'Enkripsi sesi SHA-256 dengan proteksi brute-force',
    'SHA-256 session encryption with brute-force protection'
  ],
  [
    'Cadangkan seluruh snapshot keuangan terenkripsi AES-256 GCM',
    'Back up the complete financial snapshot with AES-256 GCM encryption'
  ],
  [
    'Masukkan kredensial akun untuk mengakses sistem DABACO.',
    'Enter your account credentials to access the DABACO system.'
  ],
  [
    'Daftarkan akun staf atau pimpinan untuk mengakses DABACO',
    'Register a staff or leadership account to access DABACO'
  ],
  [
    'Otomatis memuat data dari database saat aplikasi dibuka',
    'Automatically loads data from the database on startup'
  ],
  // Speaker notes in ExecutivePresentationDeck
  [
    'Soroti total realisasi pengeluaran sebesar',
    'Highlight total actual expenditure of'
  ],
  [
    'dengan penyerapan',
    'with an absorption rate of'
  ],
  [
    'dari proyeksi.',
    'of forecast.'
  ],
  [
    'Efisiensi kas bersih mencapai',
    'Net cash efficiency reached'
  ],
  [
    ', menunjukkan disiplin biaya yang sangat sehat.',
    ', demonstrating strong financial discipline.'
  ],
  [
    'Jelaskan bahwa posisi penyerapan berada di koridor aman operasional (target aman 75%-85%).',
    'Emphasize that absorption remains inside the safe operational corridor (target 75%–85%).'
  ],
  [
    'Tinjau peringkat penyerapan per departemen; tidak ada departemen yang melampaui ambang kritis 100%.',
    'Review departmental absorption rankings; zero departments exceeded the 100% critical ceiling.'
  ],
  [
    'Departemen HR dan General Affairs mempertahankan efisiensi tertinggi melalui optimalisasi vendor dan negosiasi kontrak.',
    'HR and General Affairs maintained top efficiency through vendor optimization and contract negotiation.'
  ],
  [
    'Departemen HR mempertahankan alokasi pelaksanaan program training dan recruitment jasa tanpa pembengkakan.',
    'HR preserved training and recruitment allocations without cost overruns.'
  ],
  [
    'Distribusi beban terbesar didominasi oleh jasa instruktur pelatihan (training) dan biaya pelaksanaan rekrutmen tenaga kerja.',
    'Largest expenditure shares are led by training instructor services and workforce recruitment operations.'
  ],
  [
    'Program efisiensi pengadaan jasa dan vendor menyumbang porsi penghematan terbesar triwulan ini.',
    'Service procurement and vendor efficiency programs contributed the largest savings this quarter.'
  ],
  [
    'Diskusikan alokasi anggaran pelatihan dan talent assessment yang tetap terlaksana optimal.',
    'Discuss training and talent assessment budgets executing smoothly on target.'
  ],
  [
    'Paparkan tren pengeluaran terurut berdasarkan Fiscal Year (April s.d. Maret tahun depan).',
    'Present expenditure trends chronologically by Fiscal Year (April to March next year).'
  ],
  [
    'Lonjakan pengeluaran musiman terakomodasi dengan baik pada periode rekrutmen massal dan program pelatihan tahunan.',
    'Seasonal spending peaks are well accommodated during mass recruitment and annual training cycles.'
  ],
  [
    'Proyeksi kuartal mendatang tetap diprediksi stabil sesuai baseline cash flow korporat.',
    'Upcoming quarterly forecasts remain stable in alignment with corporate cash flow baselines.'
  ],
  [
    'Minta persetujuan dewan direksi untuk pengesahan realisasi keuangan periode berjalan.',
    'Request Board of Directors approval to endorse current-period financial realizations.'
  ],
  [
    'Rekomendasikan pengalihan sebagian sisa efisiensi untuk percepatan program peningkatan kompetensi dan sertifikasi keahlian SDM.',
    'Recommend reallocating part of efficiency savings to accelerate HR competency and certification initiatives.'
  ],

  // =========================================================
  // 2. TOASTS, NOTIFICATIONS & DYNAMIC STATUS MESSAGES
  // =========================================================
  ['Database transaksi berhasil direset ke dataset standar training & recruitment.', 'Transaction database reset to the standard training & recruitment dataset.'],
  ['Cadangan database DABACO berhasil diunduh!', 'DABACO database backup downloaded successfully!'],
  ['Akun pengguna berhasil dihapus dari basis data.', 'User account deleted from the database.'],
  ['Data akun pengguna berhasil diperbarui!', 'User account updated successfully!'],
  ['Basis data otentikasi DABACO berhasil disinkronkan!', 'DABACO authentication database synchronized!'],
  ['Data Budget Plan berhasil ditambahkan!', 'Budget Plan record added successfully!'],
  ['Data Budget Plan berhasil diperbarui!', 'Budget Plan record updated successfully!'],
  ['Data Budget Plan berhasil dihapus.', 'Budget Plan record deleted.'],
  ['Data Forecast berhasil ditambahkan!', 'Forecast record added successfully!'],
  ['Data Forecast berhasil diperbarui!', 'Forecast record updated successfully!'],
  ['Data Forecast berhasil dihapus.', 'Forecast record deleted.'],
  ['Data Realisasi Aktual berhasil ditambahkan!', 'Actual Realization record added successfully!'],
  ['Data Realisasi Aktual berhasil diperbarui!', 'Actual Realization record updated successfully!'],
  ['Data Realisasi Aktual berhasil dihapus.', 'Actual Realization record deleted.'],
  ['Sinkronisasi dua arah Google Sheets & Database Berhasil!', 'Two-way Google Sheets & Database synchronization succeeded!'],
  ['Sesi kerja Anda telah diakhiri dengan aman.', 'Your work session has been signed out safely.'],
  ['Pengaturan Looker Studio disimpan!', 'Looker Studio settings saved!'],
  ['Konfigurasi Google Sheets disimpan!', 'Google Sheets configuration saved!'],
  ['Pengaturan notifikasi email disimpan!', 'Email alert preferences saved!'],
  ['Konfigurasi Supabase disimpan!', 'Supabase configuration saved!'],
  ['Gagal memuat data dari Supabase.', 'Failed to load data from Supabase.'],
  ['Gagal memuat data dari Supabase', 'Failed to load data from Supabase'],
  ['Gagal memuat jumlah baris Supabase.', 'Failed to fetch Supabase row counts.'],
  ['Gagal Memuat dari Supabase', 'Failed to Load from Supabase'],
  ['Gagal push ke Supabase', 'Failed to push to Supabase'],
  ['Terjadi galat saat memuat data database.', 'An error occurred while loading database records.'],
  ['File JSON tidak valid atau korup.', 'Invalid or corrupted JSON file.'],
  ['Kredensial berhasil diperbarui secara aman!', 'Credentials updated securely!'],
  ['File cadangan terenkripsi (.enc.json) berhasil diunduh!', 'Encrypted backup file (.enc.json) downloaded successfully!'],
  ['Email Alert Berhasil Dikirim!', 'Email Alert Sent Successfully!'],
  ['Batch Processing & Penyimpanan Berhasil!', 'Batch Processing & Storage Completed!'],
  ['Berhasil menimpa seluruh data Budget Plan dengan', 'Successfully overwrote Budget Plan data with'],
  ['Berhasil menimpa seluruh data Forecast dengan', 'Successfully overwrote Forecast data with'],
  ['Berhasil menimpa seluruh data Realisasi dengan', 'Successfully overwrote Realization data with'],
  ['Berhasil menambahkan', 'Successfully added'],
  ['baris baru!', 'new rows!'],
  ['data Budget Plan baru!', 'new Budget Plan records!'],
  ['data Forecast baru!', 'new Forecast records!'],
  ['data Realisasi baru!', 'new Realization records!'],
  ['Sukses push ke Supabase!', 'Successfully pushed to Supabase!'],
  ['Realisasi kas berhasil diunggah', 'Cash Realization records uploaded'],
  ['Sukses sinkronisasi', 'Successfully synchronized'],
  ['Email Laporan Eksekutif berhasil dikirimkan ke:', 'Executive Report email sent to:'],
  ['berhasil disimpan.', 'saved successfully.'],
  ['berhasil diperbarui.', 'updated successfully.'],
  ['berhasil dihapus.', 'deleted successfully.'],
  ['berhasil ditambahkan!', 'added successfully!'],
  ['berhasil didaftarkan ke basis data.', 'registered in the database.'],
  ['telah dihapus dari basis data.', 'has been removed from the database.'],
  ['berhasil disimpan.', 'saved successfully.'],
  ['berhasil dikosongkan!', 'cleared successfully!'],
  ['berhasil ditimpa dari file cadangan', 'overwritten from backup file'],
  ['berhasil digabungkan ke data lokal!', 'merged into local data!'],
  ['sudah digunakan oleh pengguna lain.', 'is already used by another account.'],
  ['Sinkronisasi Selesai:', 'Synchronization Complete:'],
  ['Master data sudah sinkron dengan seluruh', 'Master data is already synced with all'],
  ['Sinkronisasi berhasil! Master Cost Center otomatis disesuaikan dari seluruh', 'Sync succeeded! Master Cost Centers auto-synced across all'],
  ['Selamat datang,', 'Welcome,'],
  ['Over Budget Terdeteksi:', 'Over Budget Detected:'],
  ['Kategori Training & Development Mendekati Limit', 'Training & Development Category Approaching Limit'],
  ['Penyerapan biaya sertifikasi telah mencapai 94.2% dari plafon forecast.', 'Certification cost absorption has reached 94.2% of the forecast ceiling.'],
  ['pada bulan Feb melampaui forecast sebesar', 'in Feb exceeded forecast by'],
  ['Menghubungi server Supabase...', 'Connecting to Supabase server...'],
  ['Gagal mengunggah data ke Supabase.', 'Failed to upload data to Supabase.'],
  ['Terjadi kesalahan saat push data ke database.', 'An error occurred while pushing data to the database.'],
  ['Kredensial Supabase belum lengkap.', 'Supabase credentials are incomplete.'],
  ['melampaui limit anggaran! Email otomatis terkirim.', 'exceeded the budget ceiling! Automated email dispatched.'],
  ['Silakan isi Project URL & Anon Key di menu Supabase Backend.', 'Please enter your Project URL & Anon Key in the Supabase Backend menu.'],
  ['Apakah Anda yakin ingin menghapus data', 'Are you sure you want to delete this'],
  ['ini secara permanen? Data yang telah dihapus tidak dapat dipulihkan.', 'record permanently? Deleted records cannot be recovered.'],
  ['Apakah Anda yakin ingin menghapus akun', 'Are you sure you want to delete account'],
  ['Perubahan data untuk', 'Profile updates for'],
  ['Status akun', 'Account status for'],
  ['diubah menjadi', 'changed to'],
  ['Sinkronisasi terakhir: pukul', 'Last synchronized at'],

  // =========================================================
  // 3. SECTION HEADERS, SUBTITLES & CARD TITLES
  // =========================================================
  ['BERITA ACARA REKONSILIASI KAS & REKENING BANK', 'OFFICIAL CASH & BANK ACCOUNT RECONCILIATION REPORT'],
  ['Berita Acara Rekonsiliasi Kas & Bank (BAP)', 'Official Cash & Bank Reconciliation Report (BAP)'],
  ['Berita Acara Rekonsiliasi (BAP Resmi)', 'Official Reconciliation Report (BAP)'],
  ['Berita Acara Rekonsiliasi', 'Reconciliation Report (BAP)'],
  ['Dokumen Pengesahan Resmi Pembukuan Kas Pabrik Mojokerto', 'Official Cash Ledger Approval Document — Mojokerto Factory'],
  ['Pengawasan Arus Kas & Rekonsiliasi Bank', 'Cash Flow Oversight & Bank Reconciliation'],
  ['Rekening Koran & Pencocokan Voucher', 'Bank Statements & Voucher Reconciliation'],
  ['Proyeksi Kebutuhan Kas Mingguan Pabrik (30 Hari ke Depan)', 'Weekly Factory Cash Requirement Forecast (Next 30 Days)'],
  ['Proyeksi Kebutuhan Kas (30 Hari)', 'Cash Requirement Forecast (30 Days)'],
  ['Kesimpulan Likuiditas & Rekomendasi Kas Pabrik', 'Factory Liquidity Conclusion & Cash Recommendations'],
  ['1. Saldo Kas menurut Rekening Koran Bank (BCA & Mandiri):', '1. Cash Balance per Corporate Bank Statements (BCA & Mandiri):'],
  ['2. Ditambah: Setoran dalam Perjalanan (Deposit in Transit):', '2. Plus: Deposits in Transit:'],
  ['3. Dikurangi: Pembayaran Belum Dicairkan (Outstanding Transfer):', '3. Less: Outstanding Transfers:'],
  ['4. Saldo Kas menurut Buku Pembukuan DABACO Pabrik:', '4. Cash Balance per Factory DABACO Ledger:'],
  ['Rp 0 (NIHIL - SESUAI SEMPURNA)', 'Rp 0 (ZERO VARIANCE — PERFECT MATCH)'],
  ['SELISIH KAS BERSIH (VARIANS):', 'NET CASH VARIANCE:'],
  ['Total Kas di Bank', 'Total Cash in Bank'],
  ['Kas Keluar Terverifikasi', 'Verified Cash Outflow'],
  ['Sesuai Voucher DABACO & SAP', 'Matched with DABACO & SAP Vouchers'],
  ['Tingkat Rekonsiliasi', 'Reconciliation Rate'],
  ['Ketahanan Kas (Runway)', 'Cash Runway'],
  ['Operasional Aktif', 'Active Operations'],
  ['2 Rekening Giro Operasional', '2 Operational Checking Accounts'],
  ['Saldo Riil di Bank:', 'Actual Bank Balance:'],
  ['Penyelarasan Terakhir:', 'Last Reconciled:'],
  ['Sudah Terverifikasi (Klir)', 'Verified (Cleared)'],
  ['Menunggu Verifikasi', 'Pending Verification'],
  ['Belum dipasangkan', 'Unmatched'],
  ['Pilih Voucher Realisasi DABACO:', 'Select DABACO Realization Voucher:'],
  ['No. Referensi Bank', 'Bank Reference No.'],
  ['Voucher Terkait', 'Linked Voucher'],
  ['Disiapkan Oleh:', 'Prepared By:'],
  ['Ditinjau & Diverifikasi:', 'Reviewed & Verified By:'],
  ['Diverifikasi Oleh:', 'Verified By:'],
  ['Disetujui Oleh:', 'Approved By:'],
  ['[Disahkan Manajemen]', '[Management Endorsed]'],

  ['Pengaturan Sistem & Kebijakan Anggaran', 'System Settings & Budget Policy'],
  ['Kebijakan Anggaran & Siklus Fiskal Ajinomoto', 'Ajinomoto Budget Policy & Fiscal Cycle'],
  ['Master Cost Center Pabrik', 'Factory Master Cost Centers'],
  ['Tambah Cost Center Baru', 'Add New Cost Center'],
  ['Kode Cost Center (Contoh: HR001, HRX001)', 'Cost Center Code (e.g. HR001, HRX001)'],
  ['Kode Cost Center (Tetap)', 'Cost Center Code (Locked)'],
  ['Kode Cost Center', 'Cost Center Code'],
  ['Nama Deskripsi Lengkap', 'Full Description Name'],
  ['Kredensial Login & Hak Akses Administrator', 'Administrator Login Credentials & Access Rights'],
  ['Update Kredensial', 'Update Credentials'],
  ['Enkripsi & Cadangan Data Real-Time', 'Real-Time Encryption & Data Backup'],
  ['Berjalan Otomatis', 'Running Automatically'],
  ['Budget Plan, Forecast, Realisasi Kas, Cost Center, dan Master Items', 'Budget Plan, Forecast, Cash Realization, Cost Centers, and Master Items'],
  ['Budget Plan, Forecast, Realisasi Kas', 'Budget Plan, Forecast, Cash Realization'],

  ['Slide 1: Makro Keuangan Pabrik Mojokerto & Health Index', 'Slide 1: Mojokerto Factory Financial Macro & Health Index'],
  ['Slide 2: Evaluasi Kinerja Cost Center & Departemen', 'Slide 2: Cost Center & Department Performance Evaluation'],
  ['Slide 3: Rincian Pos Item Beban Operasional', 'Slide 3: Operational Expense Line-Item Breakdown'],
  ['Slide 4: Pacing Pengeluaran & Siklus Fiscal Year', 'Slide 4: Spending Pacing & Fiscal Year Cycle'],
  ['Slide 5: Rekomendasi Top Management & Pengesahan', 'Slide 5: Top Management Recommendations & Approval'],
  ['Resolusi & Langkah Tindak Lanjut Direksi', 'Board Resolutions & Next Action Items'],
  ['Pengesahan Realisasi Kas Berjalan', 'Endorsement of Current Cash Realizations'],
  ['Menyetujui realisasi kas sebesar', 'Approve actual cash disbursements totaling'],
  ['Mengalokasikan sisa kas efisiensi', 'Reallocate remaining efficiency surplus of'],
  ['Otoritas Pengesahan Dewan Direksi & General Management', 'Board of Directors & General Management Sign-Off'],
  ['Baseline Budget Korporat FY 2026', 'FY 2026 Corporate Budget Baseline'],
  ['Proyeksi Kebutuhan Kas', 'Projected Cash Requirements'],
  ['Sisa Cadangan Kas Operasional', 'Remaining Operational Cash Reserve'],
  ['Distribusi Pos Item Pengeluaran Terbesar', 'Top Expense Line-Item Distribution'],
  ['Tren Pengeluaran Kas Siklus FY (April s.d. Maret)', 'FY Cycle Cash Disbursement Trend (April–March)'],
  ['Evaluasi Penyerapan Kas & Koridor Toleransi Operasional', 'Cash Absorption Evaluation & Operational Tolerance Corridor'],
  ['Budget, Realisasi & Koridor', 'Budget, Realization & Corridor'],
  ['Alokasi Budget Terbesar', 'Largest Budget Allocations'],
  ['Disetujui untuk Rapat Direksi:', 'Approved for Board of Directors Meeting:'],
  ['Disetujui untuk Top Management:', 'Approved for Top Management:'],

  ['Rangkuman Strategis untuk Direksi & General Management', 'Strategic Summary for Board & General Management'],
  ['Operasional Training & Rekrutmen Terkendali dalam Koridor Prudent', 'Training & Recruitment Operations Controlled Within Prudent Corridor'],
  ['Total realisasi pengeluaran operasional mencapai', 'Total actual operational spending reached'],
  ['Efisiensi Penghematan Kas', 'Cash Savings Efficiency'],
  ['Daftar Keputusan Direksi', 'Board of Directors Resolutions'],
  ['1. Pengesahan Realisasi Triwulan', '1. Quarterly Realization Approval'],
  ['2. Realokasi Cadangan Pos Pelatihan', '2. Training Reserve Reallocation'],
  ['3. Evaluasi Vendor Eksternal', '3. External Vendor Review'],
  ['Terakhir ditinjau oleh Komite Finansial', 'Last reviewed by Financial Committee'],
  ['Trayektori Laju Penyerapan Kas & Deviasi Anggaran', 'Cash Absorption Trajectory & Budget Variance'],
  ['Evaluasi Kinerja Anggaran per Cost Center (Pabrik Mojokerto)', 'Budget Performance Evaluation by Cost Center (Mojokerto Factory)'],
  ['Lembar Pengesahan & Validasi Laporan Finansial (Ajinomoto Factory Board)', 'Financial Report Sign-Off & Validation Sheet (Ajinomoto Factory Board)'],
  ['Dossier Laporan Eksekutif Keuangan PT Ajinomoto Indonesia untuk Periode', 'PT Ajinomoto Indonesia Executive Financial Dossier for Period'],
  ['Dossier Laporan Keuangan Eksekutif PT Ajinomoto Indonesia untuk', 'PT Ajinomoto Indonesia Executive Financial Dossier for'],
  ['FY 2026 Penuh', 'Full FY 2026'],
  ['Seluruh Departemen Pabrik', 'All Factory Departments'],
  ['Semua Cost Center Pabrik', 'All Factory Cost Centers'],

  ['Tren Realisasi Anggaran Bulanan', 'Monthly Budget Realization Trend'],
  ['Tren Penyerapan Bulanan', 'Monthly Absorption Trend'],
  ['Rincian Performa Pos Item Anggaran', 'Budget Line-Item Performance Breakdown'],
  ['Ringkasan Budget & Realisasi Finansial', 'Financial Budget & Realization Summary'],
  ['Pilihan Gaya Sampul Dokumen Eksekutif (Cover Theme)', 'Executive Document Cover Theme'],
  ['Muatan & Struktur Dokumen PDF Resmi (3 Halaman A4)', 'Official PDF Dossier Contents & Structure (3 A4 Pages)'],
  ['Rincian Item Pelatihan, Medikal & SDM', 'Training, Medical & HR Item Details'],
  ['Laporan Resmi Manajemen PT Ajinomoto Indonesia', 'Official Management Report — PT Ajinomoto Indonesia'],
  ['Sisa Saldo Aman', 'Safe Remaining Balance'],
  ['Sisa Saldo Tersedia', 'Available Remaining Balance'],
  ['Surplus Kas', 'Cash Surplus'],
  ['Budget Awal', 'Initial Budget'],
  ['Perlu Perhatian', 'Needs Attention'],
  ['Tersinkronisasi', 'Synchronized'],
  ['Belum Ada Realisasi', 'No Realization Yet'],
  ['Mendekati Budget', 'Approaching Budget'],
  ['Download PDF Sekarang', 'Download PDF Now'],
  ['Menampilkan seluruh', 'Showing all'],
  ['0 pos item', '0 line items'],
  ['pos item', 'line items'],
  ['dari Total Realisasi', 'of Total Realization'],
  ['Halaman 1', 'Page 1'],
  ['Halaman 2', 'Page 2'],
  ['Halaman 3', 'Page 3'],

  ['Tren Bulanan: Budget vs Forecast vs Realisasi', 'Monthly Trend: Budget vs Forecast vs Realization'],
  ['Pangsa Pos Item Beban', 'Expense Line-Item Share'],
  ['Tingkat Absorpsi', 'Absorption Rate'],
  ['Semua Metrik', 'All Metrics'],
  ['Siklus: Apr – Mar (+1)', 'Cycle: Apr – Mar (+1)'],

  ['Integrasi & Sinkronisasi Otomatis Google Sheets', 'Automated Google Sheets Integration & Sync'],
  ['Parameter Sinkronisasi Dua Arah', 'Two-Way Synchronization Parameters'],
  ['Auto-Sync Otomatis', 'Automatic Auto-Sync'],
  ['Simpan Konfigurasi Sinkronisasi', 'Save Sync Configuration'],
  ['Audit Log Sinkronisasi Terakhir:', 'Last Synchronization Audit Log:'],
  ['Baris Budget Plan', 'Budget Plan Rows'],
  ['Baris Forecast', 'Forecast Rows'],
  ['Baris Realisasi', 'Realization Rows'],
  ['Tiap 1 Menit (Realtime)', 'Every 1 Minute (Real-Time)'],
  ['Tiap 5 Menit (Direkomendasikan)', 'Every 5 Minutes (Recommended)'],
  ['Tiap 15 Menit', 'Every 15 Minutes'],
  ['Tiap 1 Jam', 'Every 1 Hour'],
  ['Salin skrip ini ke Apps Script spreadsheet Anda', 'Copy this script into your spreadsheet Apps Script'],
  ['SQL Schema Skrip DABACO', 'DABACO SQL Schema Script'],
  ['Cari transaksi, no. voucher, atau ref bank...', 'Search transactions, voucher no., or bank ref...'],
  ['Refresh & Sinkronisasi (Ctrl+S)', 'Refresh & Synchronize (Ctrl+S)'],
  ['Lihat catatan keterangan item', 'View item remarks & notes'],
  ['Halaman Pertama', 'First Page'],
  ['Halaman Sebelumnya', 'Previous Page'],
  ['Halaman Berikutnya', 'Next Page'],
  ['Halaman Terakhir', 'Last Page'],
  ['Unggah berkas spreadsheet/CSV langsung ke database', 'Upload spreadsheet/CSV file directly to database'],
  ['Buka konsol manajemen database: opsi menimpa, menambahkan, cadangan, dan pemulihan', 'Open Database Management Console: overwrite, append, backup, and restore options'],
  ['Unggah seluruh dataset ke cloud database Supabase', 'Upload complete dataset to Supabase cloud database'],
  ['Ambil ulang data terbaru dari Supabase', 'Reload latest records from Supabase'],
  ['Unduh cadangan seluruh data transaksi dalam format JSON', 'Download full transaction database backup in JSON format'],
  ['Kembalikan database ke data standar pabrik', 'Restore database to factory default dataset'],
  ['Cari item atau catatan...', 'Search items or remarks...'],
  ['Contoh: Pembayaran invoice vendor batch certification...', 'e.g., Vendor invoice payment for batch certification...'],
  ['Reset Database ke Standar Pabrik', 'Reset Database to Factory Default'],
  ['Klik untuk Jeda/Lanjutkan Stopwatch Presentasi', 'Click to Pause/Resume Presentation Stopwatch'],
  ['Ganti Tema Tampilan: Mode Normal (Terang) / Mode Gelap (T atau D)', 'Switch Display Theme: Light Mode / Dark Mode (T or D)'],
  ['Slide Sebelumnya (Panah Kiri)', 'Previous Slide (Left Arrow)'],
  ['Slide Berikutnya (Panah Kanan)', 'Next Slide (Right Arrow)'],
  ['Keluar dari Mode Presentasi (ESC)', 'Exit Presentation Mode (ESC)'],
  ['Zona Koridor Aman Korporat (75% - 85%)', 'Corporate Safe Tolerance Corridor (75% – 85%)'],
  ['Mulai Mode Presentasi Rapat Direksi', 'Start Board Meeting Presentation Mode'],
  ['Salin Rangkuman Direksi ke Clipboard', 'Copy Executive Summary to Clipboard'],
  ['Unduh Laporan Eksekutif Format PDF Resmi', 'Download Official Executive PDF Report'],
  ['Contoh: 1eC6V4mC9F9G_Ajinomoto_Budget_2026_Sheet', 'e.g., 1eC6V4mC9F9G_Ajinomoto_Budget_2026_Sheet'],
  ['Masukkan username (admin)', 'Enter username (admin)'],
  ['Masukkan password (admin123)', 'Enter password (admin123)'],
  ['Contoh: Mohon review realisasi anggaran pelatihan Q1 yang telah mencapai batas warning...', 'e.g., Please review Q1 training budget realization which has reached the warning threshold...'],
  ['Periksa seluruh data upload dan daftarkan cost center baru secara otomatis', 'Scan all uploaded data and automatically register new cost centers'],
  ['Kode unik CC', 'Unique CC code'],
  ['Contoh: HR001 - Education Fee Training', 'e.g., HR001 - Education Fee Training'],
  ['Contoh: Human Resources (Training & Dev)', 'e.g., Human Resources (Training & Dev)'],
  ['Contoh: S. Wardhana', 'e.g., S. Wardhana'],
  ['Cari kode CC, nama, atau PIC...', 'Search CC code, name, or PIC...'],
  ['Tarik ulang data terbaru langsung dari Supabase', 'Pull latest records directly from Supabase'],
  ['Kirim dan timpa data di Supabase dengan dataset saat ini', 'Push and overwrite Supabase records with current dataset'],
  ['Cari nama, username, email, seksi...', 'Search name, username, email, section...'],
  ['Klik untuk mengubah status akun', 'Click to toggle account status'],
  ['Ubah Rincian Pengguna', 'Edit User Details'],
  ['Contoh: Budi Santoso', 'e.g., Budi Santoso'],
  ['Contoh: budi_ga', 'e.g., budi_ga'],
  ['nama@ajinomoto.co.id', 'name@ajinomoto.co.id'],

  ['Di Spreadsheet Google, klik', 'In Google Sheets, click'],
  [', timpa dengan kode di atas, lalu klik', ', replace with the code above, then click'],
  ['Cara Pasang:', 'Setup Steps:'],
  ['Tersimpan!', 'Saved!'],

  ['Notifikasi Email Otomatis & Alert Anggaran', 'Automated Email Notifications & Budget Alerts'],
  ['Konfigurasi Ambang Batas (Threshold) & Penerima', 'Threshold & Recipient Configuration'],
  ['Daftar Penerima Notifikasi (Email Stakeholder)', 'Notification Recipient List (Stakeholder Emails)'],
  ['Daftar Penerima Email', 'Email Recipient List'],
  ['Simpan Ambang Batas', 'Save Thresholds'],
  ['Preview Template Email Eksekutif (GAS Style)', 'Executive Email Template Preview (GAS Style)'],
  ['Kepada Yth.', 'Dear'],
  ['Alamat Email Penerima', 'Recipient Email Address'],

  ['Manajemen Pengguna & Hak Akses', 'User Management & Access Control'],
  ['Total Pengguna Terdaftar', 'Total Registered Users'],
  ['Hak Akses Penuh & Verifikasi', 'Full Access & Verification'],
  ['Kepala Seksi & Staf', 'Section Heads & Staff'],
  ['Akun Ditangguhkan', 'Suspended Accounts'],
  ['Login Terakhir', 'Last Login'],
  ['Nama Lengkap Pegawai *', 'Employee Full Name *'],
  ['Nama Lengkap Pegawai', 'Employee Full Name'],
  ['Alamat Email Ajinomoto *', 'Ajinomoto Email Address *'],
  ['Kata Sandi Awal (Password)', 'Initial Password'],
  ['Simpan Akun Pengguna', 'Save User Account'],
  ['Hapus Akun Pengguna?', 'Delete User Account?'],
  ['Ya, Hapus Akun', 'Yes, Delete Account'],
  ['Tindakan', 'Actions'],

  ['Backend Supabase Database & Keamanan Enkripsi', 'Supabase Database Backend & Encryption Security'],
  ['Kredensial & Pengaturan Sinkronisasi', 'Credentials & Sync Settings'],
  ['Panduan Integrasi Supabase', 'Supabase Integration Guide'],
  ['Panduan Integrasi Backend Supabase', 'Supabase Backend Integration Guide'],
  ['Kredensial API Supabase', 'Supabase API Credentials'],
  ['Simpan Kredensial', 'Save Credentials'],
  ['Environment Variables Terdeteksi:', 'Environment Variables Detected:'],
  ['Kredensial aktif dimuat dari sistem environment', 'Active credentials loaded from system environment'],
  ['1. Auto-Load Instan Saat Sistem Dibuka', '1. Instant Auto-Load on System Launch'],
  ['Jalankan di Supabase SQL Editor untuk membuat tabel dan fungsi enkripsi', 'Run in the Supabase SQL Editor to create tables and encryption functions'],
  ['Tips saat klik RUN di Supabase:', 'Tips when clicking RUN in Supabase:'],
  ['Jika saat push data muncul pesan', 'If pushing data returns the message'],
  ['Langkah 1: Setup Proyek Supabase', 'Step 1: Set Up Supabase Project'],
  ['Langkah 2: Sambungkan Kredensial', 'Step 2: Connect Credentials'],
  ['Langkah 3: Push & Auto-Load', 'Step 3: Push & Auto-Load'],
  ['Langkah 4: Konfigurasi Auto-Load di Vercel (Production)', 'Step 4: Configure Auto-Load on Vercel (Production)'],
  ['dan buat organisasi / proyek baru.', 'and create a new organization / project.'],
  ['Pilih region Asia Tenggara (misal:', 'Select a Southeast Asia region (e.g.:'],
  [') untuk latensi tercepat ke Indonesia.', ') for the lowest latency to Indonesia.'],
  ['Masuk ke menu', 'Open the'],
  [', tempelkan skrip dari tab', ', paste the script from the tab'],
  [', lalu klik', ', then click'],
  ['(pilih opsi', '(select option'],
  ['Di dashboard Supabase, buka', 'In the Supabase dashboard, open'],
  [', lalu tempelkan ke form kredensial DABACO di atas.', ', then paste them into the DABACO credential form above.'],
  ['Klik tombol', 'Click the button'],
  ['URL Supabase Anda (contoh: https://xyz.supabase.co)', 'Your Supabase URL (e.g., https://xyz.supabase.co)'],
  ['Buka Project Vercel → Settings → Environment Variables → Masukkan kedua variabel di atas → Klik Save → Lakukan', 'Open Vercel Project → Settings → Environment Variables → Add both variables above → Click Save → Trigger'],
  ['Reload dari Database', 'Reload from Database'],
  ['Cara setting:', 'How to configure:'],

  ['Konsol Manajemen Database & Sinkronisasi', 'Database Management & Sync Console'],
  ['Konsol Manajemen Database', 'Database Management Console'],
  ['Konsol Database', 'Database Console'],
  ['Status Perbandingan Record: Lokal vs Supabase Cloud', 'Record Comparison Status: Local vs Supabase Cloud'],
  ['Lokal / Cloud', 'Local / Cloud'],
  ['1. Push ke Supabase (Menimpa / Tambah)', '1. Push to Supabase (Overwrite / Append)'],
  ['2. Tarik Data (Pull & Restore)', '2. Pull Data (Pull & Restore)'],
  ['3. Cadangan File (Snapshot JSON)', '3. File Backup (JSON Snapshot)'],
  ['4. Kosongkan Tabel Cloud', '4. Clear Cloud Tables'],
  ['5. Reset Standar Pabrik', '5. Factory Default Reset'],
  ['Pilih Mode Sinkronisasi ke Supabase:', 'Select Supabase Sync Mode:'],
  ['Default & Aman', 'Default & Safe'],
  ['Sinkronisasi Bersih', 'Clean Sync'],
  ['Pilih Tabel yang Hendak Disinkronkan:', 'Select Tables to Synchronize:'],
  ['Data yang ditarik meliputi:', 'Pulled datasets include:'],
  ['Pulihkan Database dari File Cadangan (JSON Restore)', 'Restore Database from Backup File (JSON Restore)'],
  ['Mode Menimpa (Overwrite)', 'Overwrite Mode'],
  ['Berkas terpilih:', 'Selected file:'],
  ['Operasi Berbahaya: Kosongkan Tabel di Supabase Cloud', 'Destructive Operation: Clear Tables in Supabase Cloud'],
  ['Pilih Cakupan Pembersihan:', 'Select Cleanup Scope:'],
  ['Ketik kata', 'Type the word'],
  ['untuk mengonfirmasi:', 'to confirm:'],
  ['Ketik RESET', 'Type RESET'],

  ['Bulk Upload Data Keuangan', 'Bulk Upload Financial Data'],
  ['3. Pra-Validasi Skema', '3. Schema Pre-Validation'],
  ['Pilih Target Skema Database Finansial:', 'Select Target Financial Database Schema:'],
  ['Tarik & Letakkan File CSV di sini, atau Klik untuk Memilih', 'Drag & Drop CSV File Here, or Click to Browse'],
  ['Tempelkan Teks CSV Mentah (Dari Excel / Notepad):', 'Paste Raw CSV Text (From Excel / Notepad):'],
  ['Proses Teks CSV', 'Process CSV Text'],
  ['File Terdeteksi:', 'File Detected:'],
  ['Skema Internal DABACO', 'DABACO Internal Schema'],
  ['Contoh Nilai (Baris 1)', 'Sample Value (Row 1)'],
  ['Catatan Validasi', 'Validation Notes'],
  ['Sesuai skema internal', 'Matches internal schema'],
  ['telah sukses divalidasi dan', 'were successfully validated and'],
  ['Selesai & Lihat Data', 'Done & View Data'],
  ['Unggah File Lain', 'Upload Another File'],
  ['Ganti File', 'Change File'],
  ['Ubah Pemetaan Header', 'Edit Header Mapping'],
  ['Tidak Ada Data Valid', 'No Valid Data'],
  ['[Wajib]', '[Required]'],

  ['Perbaikan Izin Row-Level Security (RLS)', 'Row-Level Security (RLS) Permission Fix'],
  ['Penyebab: Tabel', 'Cause: Table'],
  ['Master Fix (RLS + Kolom Panjang)', 'Master Fix (RLS + Extended Columns)'],
  ['Buka SQL Editor & klik RUN', 'Open SQL Editor & click RUN'],
  ['Buka SQL Editor Supabase', 'Open Supabase SQL Editor'],
  ['Coba Push Data Sekarang', 'Try Pushing Data Now'],
  ['Push Data Ulang', 'Re-Push Data'],
  ['Salin Skrip SQL', 'Copy SQL Script'],
  ['Klik tombol salin di bawah', 'Click the copy button below'],
  ['Data langsung tersimpan', 'Data saved immediately'],

  ['Pintasan Keyboard (Keyboard Shortcuts)', 'Keyboard Shortcuts'],
  ['Panduan Pintasan Tombol Cepat', 'Quick Keyboard Shortcuts Guide'],
  ['Status Tombol Alt:', 'Alt-Key Status:'],
  ['Tahan tombol', 'Hold the'],
  ['untuk melihat badge navigasi di antarmuka.', 'key to preview navigation shortcut badges on screen.'],
  ['Tutup (ESC)', 'Close (ESC)'],
  ['Tutup popup', 'Close dialog'],

  ['Keamanan Sesi Pengguna', 'User Session Security'],
  ['Konfirmasi Keluar Sesi', 'Confirm Sign Out'],
  ['Konfirmasi Unduh Berkas', 'Confirm File Download'],
  ['Konfirmasi Perubahan', 'Confirm Changes'],
  ['Konfirmasi Penambahan', 'Confirm Addition'],
  ['Detail Perubahan:', 'Change Summary:'],
  ['Nama Berkas', 'File Name'],
  ['Semua Rekord', 'All Records'],
  ['Masuk ke Dashboard', 'Sign In to Dashboard'],

  // =========================================================
  // 4. COMMON UI BUTTONS, LABELS, FILTERS & HEADERS
  // =========================================================
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
  ['Sistem DABACO Terintegrasi Google Sheets', 'DABACO System Integrated with Google Sheets'],
  ['Pimpinan & Manajemen HR Department', 'HR Department Leadership & Management'],
  ['Terbuka (Revisi & Input Aktif)', 'Open (Active Revision & Input)'],
  ['Proses Audit (Read-Only Warning)', 'Audit In Progress (Read-Only Warning)'],
  ['Terkunci Resmi (Final Budget)', 'Officially Locked (Final Budget)'],
  ['April - Maret (Standar Ajinomoto Group)', 'April – March (Ajinomoto Group Standard)'],
  ['Pabrik Mojokerto (PT AI & PT AX)', 'Mojokerto Factory (PT AI & PT AX)'],

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
  ['Ekspor Data Excel / CSV', 'Export Excel / CSV Data'],
  ['Ekspor CSV', 'Export CSV'],
  ['Ekspor PDF', 'Export PDF'],
  ['Ekspor Excel', 'Export Excel'],
  ['Unduh Format Template CSV', 'Download CSV Template Format'],
  ['Download File Cadangan (.json)', 'Download Backup File (.json)'],
  ['Konfirmasi & Unduh Berkas', 'Confirm & Download File'],
  ['Tarik & Pulihkan Data Sekarang', 'Pull & Restore Data Now'],
  ['Terapkan Dataset Standar Awal Pabrik', 'Apply Factory Default Dataset'],
  ['Kosongkan Tabel Sekarang', 'Clear Tables Now'],
  ['Push Data ke Supabase', 'Push Data to Supabase'],
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
  ['Edit baris data', 'Edit data row'],
  ['Hapus baris data', 'Delete data row'],
  ['Ya, Keluar Sesi', 'Yes, Sign Out'],
  ['Ya, Hapus', 'Yes, Delete'],
  ['Lanjut ke Pra-Validasi', 'Proceed to Pre-Validation'],
  ['Mode Menimpa Total (Clean Overwrite)', 'Clean Overwrite Mode'],
  ['Menimpa Total (Overwrite)', 'Full Overwrite'],
  ['Menimpa Data Lokal (Overwrite Local)', 'Overwrite Local Data'],
  ['Gabungkan ke Data Lokal (Append & Merge)', 'Append & Merge to Local Data'],
  ['Hanya Tabel Transaksi', 'Transaction Tables Only'],
  ['Seluruh Tabel Database', 'All Database Tables'],
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
  ['Daftar Lengkap [?]', 'Full Directory [?]'],
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
  ['Item Deskripsi', 'Item Description'],
  ['Item Anggaran', 'Budget Item'],
  ['Tanggal Transaksi', 'Transaction Date'],
  ['Uraian Transaksi Mutasi', 'Statement Transaction Description'],
  ['Nominal Pengeluaran', 'Expense Amount'],
  ['Nominal Amount (IDR)', 'Amount (IDR)'],
  ['Nominal (IDR)', 'Amount (IDR)'],
  ['Keterangan / Remarks', 'Description / Remarks'],
  ['Bulan / Thn', 'Month / Yr'],
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
  ['Pabrik Mojokerto', 'Mojokerto Factory'],
  ['BCA Giro Operasional', 'BCA Operational Giro'],
  ['Mode Gelap', 'Dark Mode'],
  ['Mode Terang', 'Light Mode'],
  ['Utilisasi:', 'Utilization:'],
  ['Utilisasi', 'Utilization'],
  ['Departemen:', 'Department:'],
  ['Periode:', 'Period:'],

  // =========================================================
  // 5. BOUNDARY-SAFE SINGLE WORDS & SHORT LABELS
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
  ['Keterangan', 'Remarks'],
  ['Catatan', 'Notes'],
  ['Urutkan:', 'Sort by:'],
  ['Urutkan', 'Sort'],
  ['Tanggal', 'Date'],
  ['Bulan', 'Month'],
  ['Tahun', 'Year'],
  ['Baris', 'Row'],
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
  ['Selesai', 'Done'],
  ['Berhasil', 'Success'],
  ['Batal', 'Cancel'],
  ['Tutup', 'Close'],
  ['Kembali', 'Back'],
  ['Tema', 'Theme'],
  ['Semua', 'All'],
  ['Buka', 'Open'],
  ['Baru saja', 'Just now'],
  ['menit lalu', 'min ago'],
  ['jam lalu', 'hr ago'],
  ['Hari ini', 'Today'],

  // Indonesian Month & Day Names
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
  ['Minggu', 'Sunday'],
  ['Transaksi', 'Transactions'],

  // =========================================================
  // 6. DEEP-AUDITED MODALS, SHORTCUTS, ALERTS & OPERATIONAL STRINGS
  // =========================================================
  ['Bulk upload data finansial via CSV (Ctrl+U)', 'Bulk upload financial data via CSV (Ctrl+U)'],
  ['Hapus Catatan Data', 'Delete Data Record'],
  ['Klasifikasi Dokumen:', 'Document Classification:'],
  ['Varians:', 'Variance:'],
  ['Horizon Waktu:', 'Time Horizon:'],
  ['. Berikan akses "Anyone" dan salin URL Web App yang dihasilkan ke form di sebelah kiri.', '. Grant "Anyone" access and copy the generated Web App URL into the form on the left.'],
  [', sehingga data master & transaksi kas dijamin dapat tersimpan mulus.', ', ensuring master data & cash transactions save smoothly.'],
  ['Section Utama', 'Primary Section'],
  ['Push Data Sekarang', 'Push Data Now'],
  ['berhasil ditambahkan!', 'has been successfully added!'],
  ['Akun pengguna', 'User account'],
  ['Sinkronisasi sukses:', 'Synchronization succeeded:'],
  ['terverifikasi checksum SHA-256.', 'verified with SHA-256 checksum.'],
  ['Sinkronisasi Selesai:', 'Synchronization Complete:'],
  ['Cost Center baru berhasil disesuaikan!', 'new Cost Centers successfully synchronized!'],
  ['Master data sudah sinkron dengan seluruh', 'Master data is already synchronized with all'],
  ['data transaksi.', 'transaction records.'],
  ['Voucher pengeluaran berhasil dipasangkan dengan mutasi kas bank.', 'Expense voucher successfully matched with bank cash statement.'],
  ['Perbarui Mutasi', 'Refresh Statements'],
  ['Format CSV Kosong / Tidak Valid', 'Empty / Invalid CSV Format'],
  ['File CSV yang Anda unggah tidak memiliki baris data atau format kolom tidak dapat dibaca oleh sistem.', 'The uploaded CSV file contains no data rows or its column format cannot be parsed by the system.'],
  ['Pastikan file memiliki header pada baris pertama dan menggunakan pemisah koma (,) atau titik koma (;).', 'Ensure the file includes headers on the first row and uses comma (,) or semicolon (;) delimiters.'],
  ['Format File Tidak Didukung', 'Unsupported File Format'],
  ['Hanya berkas berformat CSV (.csv) yang didukung untuk impor massal sistem.', 'Only CSV (.csv) files are supported for system bulk import.'],
  ['Silakan simpan atau ekspor berkas spreadsheet Anda menjadi format CSV berpemisah koma (,) atau titik koma (;).', 'Please save or export your spreadsheet as a comma (,) or semicolon (;) delimited CSV file.'],
  ['Konten CSV Belum Diisi', 'CSV Content Is Empty'],
  ['Silakan tempelkan konten teks berformat CSV pada area teks yang tersedia sebelum melanjutkan.', 'Please paste CSV-formatted text into the text area provided before continuing.'],
  ['Tidak ditemukan baris data yang valid untuk diimpor ke dalam database sistem.', 'No valid data rows were found to import into the system database.'],
  ['Periksa kembali pemetaan kolom dan perbaiki baris data bertanda merah pada tabel validasi sebelum memproses.', 'Review your column mapping and fix red-highlighted rows in the validation table before proceeding.'],
  ['Mode Menambahkan (Append)', 'Append Mode'],
  ['Menimpa Seluruh Data', 'Overwrite All Data'],
  ['Menambahkan ke Data yang Ada', 'Append to Existing Data'],
  ['Apakah Anda yakin ingin menambahkan transaksi/item baru ini ke dalam database DABACO?', 'Are you sure you want to add this new transaction/item to the DABACO database?'],
  ['Penambahan Baru', 'New Addition'],
  ['Konfirmasi & Tambahkan', 'Confirm & Add'],
  ['Apakah Anda yakin ingin menyimpan perubahan pada data transaksi ini ke database?', 'Are you sure you want to save changes to this transaction record in the database?'],
  ['Penyuntingan Rekord', 'Record Edit'],
  ['Konfirmasi & Simpan', 'Confirm & Save'],
  ['Konfirmasi Hapus Data', 'Confirm Data Deletion'],
  ['Apakah Anda yakin ingin menghapus data transaksi ini secara permanen dari database?', 'Are you sure you want to permanently delete this transaction record from the database?'],
  ['Konfirmasi Unggah Massal', 'Confirm Bulk Upload'],
  ['Apakah Anda yakin ingin menerapkan seluruh data dari berkas yang diunggah ke dalam database?', 'Are you sure you want to import all records from the uploaded file into the database?'],
  ['Terapkan Impor Data', 'Apply Data Import'],
  ['Konfirmasi Reset Database', 'Confirm Database Reset'],
  ['Tindakan ini akan mengembalikan data ke dataset standar training & recruitment. Apakah Anda yakin?', 'This action will restore data to the standard training & recruitment dataset. Are you sure?'],
  ['Reset Sistem', 'System Reset'],
  ['Reset Database Sekarang', 'Reset Database Now'],
  ['Konfirmasi Sinkronisasi Data', 'Confirm Data Synchronization'],
  ['Apakah Anda yakin ingin menjalankan sinkronisasi data dengan cloud?', 'Are you sure you want to run cloud data synchronization?'],
  ['Sinkronisasi Data', 'Data Synchronization'],
  ['Jalankan Sinkronisasi', 'Run Synchronization'],
  ['Ekspor seluruh data transaksi anggaran (Budget Plan, Forecast, Realisasi) ke dalam format spreadsheet CSV.', 'Export all budget transaction records (Budget Plan, Forecast, Realization) into CSV spreadsheet format.'],
  ['Ekspor berkas spreadsheet CSV komprehensif seluruh transaksi Budget Plan, Forecast, dan Realisasi.', 'Export a comprehensive CSV spreadsheet covering all Budget Plan, Forecast, and Realization transactions.'],
  ['Biaya Operasional Lainnya', 'Other Operational Expenses'],
  ['Keluar Layar Penuh', 'Exit Fullscreen'],
  ['Layar Penuh', 'Fullscreen'],
  ['Tren Aktual', 'Actual Trend'],
  ['Kuartal', 'Quarter'],
  ['Item Rekord', 'Record Item'],
  ['Periode / Tahun', 'Period / Year'],
  ['Nominal Biaya', 'Expense Amount'],
  ['Kelola alokasi perencanaan plafon anggaran tahunan (BUDGET_PLAN)', 'Manage annual budget ceiling allocations (BUDGET_PLAN)'],
  ['Pemantauan estimasi dan revisi berkala pengeluaran (FORECAST)', 'Monitor periodic spending estimates and revisions (FORECAST)'],
  ['Memuat...', 'Loading...'],
  ['Edit Data Transaksi', 'Edit Transaction Record'],
  ['Input Data Baru', 'Add New Record'],
  ['Sistem DABACO akan secara instan memperbarui perhitungan agregat dan rekonsiliasi data.', 'DABACO will immediately recalculate aggregate totals and data reconciliation.'],
  ['Apakah Anda yakin ingin mereset seluruh database transaksi kembali ke data standar bawaan pabrik? Data baru yang Anda input akan dihapus.', 'Are you sure you want to reset the entire transaction database back to the factory default dataset? Newly entered records will be removed.'],
  ['Operasi ini berguna jika Anda ingin menghapus data percobaan dan memulai kembali dengan dataset default.', 'This operation is useful if you want to clear test records and start fresh with the default dataset.'],
  ['Berkas cadangan JSON berisi seluruh tabel database DABACO: Budget Plan, Forecast, Realisasi Aktual, Master Cost Centers, dan Master Items.', 'The JSON backup file contains all DABACO database tables: Budget Plan, Forecast, Actual Realization, Master Cost Centers, and Master Items.'],
  ['Periode', 'Period'],
  ['Kredensial Supabase belum dikonfigurasi.', 'Supabase credentials are not configured yet.'],
  ['Kredensial Supabase belum dikonfigurasi!', 'Supabase credentials are not configured yet!'],
  ['Error saat mengambil jumlah baris.', 'Error retrieving row counts.'],
  ['Menimpa Total', 'Full Overwrite'],
  ['Menambahkan/Upsert', 'Append / Upsert'],
  ['Mengunduh data dari database Supabase Cloud...', 'Downloading data from Supabase Cloud database...'],
  ['Seluruh data lokal berhasil ditimpa dengan data Supabase!', 'All local data has been successfully overwritten with Supabase data!'],
  ['Gagal mengosongkan tabel di Supabase', 'Failed to clear tables in Supabase'],
  ['Gagal mengosongkan tabel', 'Failed to clear tables'],
  ['Format JSON tidak sesuai struktur cadangan DABACO.', 'JSON format does not match the DABACO backup schema.'],
  ['⚠️ Menimpa & mengganti total data di cloud', '⚠️ Overwrite & replace all data in cloud'],
  ['🟢 Menambahkan & upsert data ke cloud', '🟢 Append & upsert data to cloud'],
  ['Memproses Sinkronisasi...', 'Processing Synchronization...'],
  ['Jalankan Push (Menimpa)', 'Run Push (Overwrite)'],
  ['Jalankan Push (Menambahkan)', 'Run Push (Append)'],
  ['Mengunduh Data...', 'Downloading Data...'],
  ['Menimpa', 'Overwrite'],
  ['Menambahkan', 'Append'],
  ['Berkas JSON cadangan ini memuat seluruh data DABACO: Anggaran, Forecast, Realisasi Kas Aktual, Master Cost Centers, dan Master Item.', 'This JSON backup file contains all DABACO datasets: Budget, Forecast, Actual Cash Realization, Master Cost Centers, and Master Items.'],
  ['Kirim Alert Sekarang', 'Send Alert Now'],
  ['Masukkan alamat email tujuan yang valid.', 'Please enter a valid recipient email address.'],
  ['Kirim Sekarang', 'Send Now'],
  ['Sedang Sinkronisasi...', 'Synchronizing...'],
  ['Sinkronisasi Sekarang', 'Sync Now'],
  ['Makro Finansial & Health', 'Financial Macro & Health'],
  ['Kinerja Cost Center', 'Cost Center Performance'],
  ['Evaluasi per Departemen', 'Evaluation by Department'],
  ['Pacing & Siklus FY', 'Pacing & FY Cycle'],
  ['Tren Bulanan Apr - Mar', 'Monthly Trend Apr – Mar'],
  ['Pengesahan Direksi', 'Board Endorsement'],
  ['Pastikan lembar pengesahan formal siap ditandatangani dan diarsipkan ke SAP korporat.', 'Ensure the formal sign-off sheet is ready for signatures and archived to corporate SAP.'],
  ['Keluar Fullscreen (F)', 'Exit Fullscreen (F)'],
  ['Mode Layar Penuh (F)', 'Fullscreen Mode (F)'],
  ['Slide Berikutnya (Panah Kanan / Spasi)', 'Next Slide (Right Arrow / Space)'],
  ['Evaluasi Kompetensi & Uji Sertifikasi', 'Competency Assessment & Certification Exam'],
  ['Penutupan Buku & Audit Tahunan', 'Annual Book Closing & Audit'],
  ['Tindakan Cepat & Sinkronisasi', 'Quick Actions & Synchronization'],
  ['Sinkronisasi Google Sheets & Database', 'Google Sheets & Database Sync'],
  ['Memicu sinkronisasi data dua arah dengan checksum SHA-256 secara instan.', 'Triggers instant two-way data synchronization with SHA-256 checksum verification.'],
  ['Unggah Berkas Massal (Bulk CSV Upload)', 'Bulk File Upload (CSV)'],
  ['Kirim Laporan Eksekutif via Email', 'Send Executive Report via Email'],
  ['Membuka formulir distribusi email notifikasi & approval anggaran.', 'Opens the budget notification & approval email distribution form.'],
  ['Dashboard Operasional Finansial', 'Operational Financial Dashboard'],
  ['Beralih langsung ke halaman Executive Budget Dashboard utama.', 'Jump directly to the main Executive Budget Dashboard view.'],
  ['Beralih ke tabel manajemen budget anggaran tahunan.', 'Switch to the annual budget plan management table.'],
  ['Proyeksi Forecast Finansial', 'Financial Forecast Projections'],
  ['Beralih ke estimasi arus kas bulanan & triwulanan.', 'Switch to monthly & quarterly cash flow estimates.'],
  ['Beralih ke riwayat pencairan dan invoice aktual.', 'Switch to actual disbursement history and invoices.'],
  ['Google Sheets Sinkronisasi', 'Google Sheets Sync'],
  ['Pemantauan anomali dan limit peringatan dini.', 'Anomaly monitoring and early warning thresholds.'],
  ['Kelola akun staf, hak akses seksi, dan otentikasi database.', 'Manage staff accounts, section access permissions, and database authentication.'],
  ['Antarmuka & Kontrol Tampilan', 'Interface & Display Controls'],
  ['Perkecil / Perluas Sidebar (Collapse)', 'Collapse / Expand Sidebar'],
  ['Mengubah lebar navigasi dari 288px ke 80px untuk area kerja lebih luas.', 'Toggles navigation rail width between 288px and 80px for a wider workspace.'],
  ['Mengubah skema warna antarmuka instan tanpa memuat ulang halaman.', 'Switches the interface color scheme instantly without reloading the page.'],
  ['Tampilkan Tooltip Pintasan Langsung di Layar', 'Show Live On-Screen Shortcut Tooltips'],
  ['Tahan tombol Alt untuk memunculkan badge petunjuk di atas setiap tombol interaktif.', 'Hold the Alt key to display shortcut hint badges over interactive buttons.'],
  ['Buka / Tutup Panduan Pintasan Ini', 'Open / Close This Shortcuts Guide'],
  ['Menutup modal dialog yang sedang terbuka seketika.', 'Immediately closes the currently open modal dialog.'],
  ['Tombol Alt Sedang Ditekan (Aktif)', 'Alt Key Pressed (Active)'],
  ['Tombol Alt Dilepas', 'Alt Key Released'],
  ['Akun ini sedang dinonaktifkan oleh administrator.', 'This account is currently deactivated by the administrator.'],
  ['Kombinasi Username atau Password tidak valid. Silakan periksa kembali.', 'Invalid Username or Password combination. Please check and try again.'],
  ['Konfirmasi password tidak cocok.', 'Password confirmation does not match.'],
  ['Sinkronisasi Otomatis', 'Automatic Sync'],
  ['Mengenkripsi & Mengunduh...', 'Encrypting & Downloading...'],
  ['Koneksi gagal.', 'Connection failed.'],
  ['Tabel Supabase Kosong (Perlu Push Awal)', 'Supabase Tables Empty (Initial Push Required)'],
  ['Kredensial Belum Lengkap', 'Incomplete Credentials'],
  ['Memuat Data...', 'Loading Data...'],
  ['Mengunggah...', 'Uploading...'],
  ['Push Sekarang', 'Push Now'],
  ['Salin Skrip Perbaikan RLS', 'Copy RLS Fix Script'],
  ['Peringatan Sistem', 'System Warning'],
  ['Konfirmasi Penghapusan', 'Confirm Deletion'],
  ['Konfirmasi Tindakan', 'Confirm Action'],
  ['Informasi Sistem', 'System Information'],
  ['Konfirmasi', 'Confirm'],
  ['Budget Control Pabrik', 'Factory Budget Control'],
  ['Akses penuh seluruh modul, konfigurasi sistem, dan manajemen hak akses.', 'Full access to all modules, system configuration, and access control management.'],
  ['Pemeriksaan anggaran, persetujuan forecast, dan analisis varians.', 'Budget review, forecast approval, and variance analysis.'],
  ['Kepala Seksi (Section Head)', 'Section Head'],
  ['Pengawasan budget dan pengajuan realisasi di seksi bersangkutan.', 'Budget oversight and realization submission for the assigned section.'],
  ['Auditor Finansial', 'Financial Auditor'],
  ['Akses peninjauan dan pengunduhan laporan eksekutif (Read-only).', 'Review and download access for executive reports (Read-only).'],
  ['Staf Administrasi Seksi', 'Section Administrative Staff'],
  ['Pencatatan nota realisasi harian dan pengunggahan berkas bukti kas.', 'Daily realization voucher recording and cash proof file uploads.'],
  ['Belum pernah login', 'Never logged in'],
  ['Tidak dapat menghapus akun yang sedang Anda gunakan saat ini.', 'Cannot delete the account you are currently signed in with.'],
  ['Daftar pengguna dan hak akses berhasil disinkronkan dengan basis data.', 'User directory and access permissions successfully synced with the database.'],
  ['Daftar akun pengguna berhasil diunduh dalam format CSV.', 'User account directory successfully downloaded in CSV format.'],
  ['Akun aktif tidak dapat dihapus', 'Active account cannot be deleted'],
  ['Hapus Akun Pengguna', 'Delete User Account'],

  // =========================================================
  // 7. COMPLETE AST-AUDITED FULL-SYSTEM COVERAGE (ZERO FRANGLAIS)
  // =========================================================
  // Executive Report & Board Briefing
  ['Akurasi Prediksi Finansial', 'Financial Forecast Accuracy'],
  ['Efisiensi Pengadaan & Disiplin Pengeluaran SDM', 'Procurement Efficiency & HR Spending Discipline'],
  ['Integritas Data Real-Time', 'Real-Time Data Integrity'],
  ['Realisasi Penyerapan', 'Realized Absorption'],
  ['Departemen Aktif', 'Active Departments'],
  ['Disetujui', 'Approved'],
  ['Rekomendasi', 'Recommended'],

  // Dashboard View & Charts
  ['Buka Laporan Strategis Top Management (Alt+2)', 'Open Top Management Strategic Report (Alt+2)'],
  ['Pos Item Over Budget', 'Over-Budget Line Items'],
  ['Pos Item Mendekati Batas (>85%)', 'Line Items Approaching Limit (>85%)'],
  ['Top Cost Center (Penyerapan)', 'Top Cost Centers (Absorption)'],
  ['Total Realisasi:', 'Total Realization:'],
  ['Indikator performa cost discipline terhadap budget anggaran FY', 'Cost discipline performance indicator against allocated FY budget'],
  ['6 Bulan Berjalan', 'Rolling 6 Months'],
  ['12 Bulan (FY Apr – Mar)', '12 Months (FY Apr – Mar)'],
  ['Penyerapan Rata-Rata', 'Average Absorption'],
  ['Actual Spending (Realisasi)', 'Actual Spending (Realization)'],
  ['Total Pengeluaran Terdistribusi:', 'Total Distributed Expenditure:'],
  ['Cari nama pos item...', 'Search line item name...'],
  ['Hapus pencarian', 'Clear search'],
  ['Pos Item Terdaftar', 'Registered Line Items'],
  ['Pos Item Anggaran', 'Budget Line Item'],
  ['Total Budget (Plafon)', 'Total Budget (Ceiling)'],
  ['100% Plafon', '100% Ceiling'],
  ['Top 3 Paling Efisien', 'Top 3 Most Efficient'],
  ['% dari forecast', '% of forecast'],
  ['% Sisa)', '% Remaining)'],
  ['% Terpakai', '% Used'],
  ['% terpakai', '% used'],
  ['Hemat: +', 'Saved: +'],
  ['Distribusi Cost Center', 'Cost Center Distribution'],
  ['Filter Status:', 'Status Filter:'],
  ['Mendekati Limit (', 'Approaching Limit ('],
  ['Mendekati Limit (>', 'Approaching Limit (>'],
  ['Aman (', 'Safe ('],
  ['Semua (', 'All ('],
  ['Reset Filter & Pencarian', 'Reset Filters & Search'],
  ['Menampilkan', 'Showing'],
  ['Tampilkan:', 'Show:'],
  ['Ke:', 'Go to:'],
  ['Plafon Pleno FY', 'Full FY Ceiling'],
  ['Serapan:', 'Absorption:'],
  ['Est. Ukuran: ~220 KB', 'Est. Size: ~220 KB'],

  // Executive Presentation Deck
  ['Buka Catatan / Poin Pembahasan Presenter (N)', 'Open Presenter Notes / Talking Points (N)'],
  ['Status Kesehatan Finansial & Disiplin Pengeluaran', 'Financial Health Status & Spending Discipline'],
  ['Akurasi Proyeksi:', 'Forecast Accuracy:'],
  ['Realisasi Kas Aktual', 'Actual Cash Realization'],
  ['% Proyeksi', '% Forecast'],
  ['Efisiensi Kas Bersih', 'Net Cash Efficiency'],
  ['Realisasi Saat Ini:', 'Current Realization:'],
  ['Akurasi Peramalan Anggaran', 'Budget Forecast Accuracy'],
  ['Realisasi Pengeluaran per Cost Center (Pabrik Mojokerto)', 'Actual Expenditure by Cost Center (Mojokerto Factory)'],
  ['POS ITEM #', 'LINE ITEM #'],
  ['%) sebagai dasar laporan konsolidasi pabrik ke Ajinomoto Head Office.', '%) as the basis for consolidated factory reporting to Ajinomoto Head Office.'],
  ['Realokasi Surplus Efisiensi', 'Efficiency Surplus Reallocation'],
  ['Tutup Catatan', 'Close Notes'],
  ['Mode Normal', 'Light Mode'],
  ['% (Varian Minimal)', '% (Minimal Variance)'],
  ['Integritas Audit & SAP', 'Audit & SAP Integrity'],
  ['100% Terekonsiliasi Bersih', '100% Cleanly Reconciled'],
  ['% Diserap', '% Absorbed'],
  ['% dari Total Kas', '% of Total Cash'],
  ['Standar Kepatuhan Zero-Defect', 'Zero-Defect Compliance Standard'],
  ['Navigasi', 'Navigation'],

  // Bulk Upload Modal
  ['Tersambung ke Database', 'Connected to Database'],
  ['2. Pemetaan Header', '2. Header Mapping'],
  ['4. Hasil Batch', '4. Batch Results'],
  ['Beralih ke Upload File', 'Switch to File Upload'],
  ['Status Pemetaan:', 'Mapping Status:'],
  ['kolom wajib terpetakan', 'required columns mapped'],
  ['kolom)', 'columns)'],
  ['baris data,', 'data rows,'],
  ['Semua Baris (', 'All Rows ('],
  ['Hanya Siap Impor (', 'Ready to Import Only ('],
  ['Bermasalah (', 'Issues ('],
  ['Abaikan baris error dan tetap impor', 'Skip error rows and proceed with import'],
  ['baris valid', 'valid rows'],
  ['Tentukan apakah baris baru akan ditambahkan ke data yang sudah ada, atau menimpa total data skema', 'Choose whether new rows are appended to existing records or overwrite the entire schema'],
  ['Metode Penyimpanan ke Database:', 'Database Save Mode:'],
  ['Menambahkan (Append)', 'Append'],
  ['Menyisipkan baris baru ke tabel', 'Inserts new rows into table'],
  ['. Data lama yang sudah ada di database tetap dipertahankan.', '. Existing records in the database are preserved.'],
  ['Mengganti seluruh data tabel', 'Replaces all records in table'],
  ['dengan baris baru dari file ini. Data lama akan digantikan.', 'with new rows from this file. Previous data will be overwritten.'],
  ['Baris)', 'Rows)'],
  ['baris)', 'rows)'],
  ['Sebanyak', 'A total of'],
  ['record data', 'data records'],
  ['otomatis tersimpan (', 'automatically saved ('],
  ['langsung ke dalam database DABACO untuk skema', 'directly into the DABACO database for schema'],
  ['Memproses Batch...', 'Processing Batch...'],
  ['Wajib', 'Required'],
  ['Opsional', 'Optional'],

  // Database Console, Data Management & Download Confirm
  ['Database Supabase Cloud Live', 'Live Supabase Cloud Database'],
  ['"Push ke Supabase"', '"Push to Supabase"'],
  ['Data Budget', 'Budget Data'],
  ['Data Forecast', 'Forecast Data'],
  ['Data Realisasi', 'Realization Data'],
  ['• Auto-Load Aktif (Instant On-Start)', '• Auto-Load Active (Instant On-Start)'],
  ['Mode Menambahkan (Append / Upsert)', 'Append / Upsert Mode'],
  ['Mode Menambahkan (Merge)', 'Append / Merge Mode'],
  ['Unduh Snapshot Cadangan (JSON Backup)', 'Download Backup Snapshot (JSON)'],
  ['Tutup Konsol', 'Close Console'],
  ['Target Eksekusi:', 'Execution Target:'],
  ['Terapkan Pemulihan (', 'Apply Restore ('],
  ['Kosongkan:', 'Clear:'],
  ['Mengosongkan Database...', 'Clearing Database...'],
  ['Realisasi Kas (', 'Cash Realization ('],
  ['Unduh Data & Laporan', 'Download Data & Reports'],
  ['Tipe Format', 'Format Type'],
  ['Rahasia Perusahaan (Internal Confidential) - PT Ajinomoto Indonesia.', 'Company Confidential (Internal Use Only) — PT Ajinomoto Indonesia.'],

  // Banking, Email Alerts, Sheets Sync, Shortcuts, Login/Logout Modals
  ['Pindah Tab', 'Switch Tabs'],
  ['transaksi klir', 'cleared transactions'],
  ['Rek:', 'Acct:'],
  ['Pasangkan Voucher', 'Match Voucher'],
  ['[Tervalidasi Sistem]', '[System Validated]'],
  ['[Tervalidasi SAP]', '[SAP Validated]'],
  ['Pengiriman peringatan otomatis ke manajemen jika penyerapan mendekati batas (', 'Automated alert dispatch to management when absorption nears threshold ('],
  ['%) atau melampaui limit anggaran (', '%) or exceeds the budget ceiling ('],
  ['Pos Item Over Budget (>', 'Over-Budget Line Items (>'],
  ['GAS Connector Code (Siap Pakai)', 'GAS Connector Code (Ready to Deploy)'],
  ['Mengerti & Tutup (ESC)', 'Got It & Close (ESC)'],
  ['Batal dan tutup', 'Cancel and close'],
  ['Gateway Otentikasi Enterprise', 'Enterprise Authentication Gateway'],
  ['Tetap di Sistem', 'Stay Signed In'],
  ['Dokumen', 'Document'],
  ['Hari', 'Days'],

  // Looker Studio, RLS Fix, Settings, Supabase, User Management, Dynamic Alerts
  ['Filter Dimensi BI:', 'BI Dimension Filter:'],
  ['% Absorpsi', '% Absorption'],
  ['Total Budget Plafon', 'Total Budget Ceiling'],
  ['100% Budget Sah', '100% Approved Budget'],
  ['% Sisa Kas', '% Cash Remaining'],
  ['Record Transaksi Termuat', 'Transaction Records Loaded'],
  ['Proyeksi Dinamis (Forecast)', 'Dynamic Forecast'],
  ['Realisasi Pengeluaran', 'Actual Expenditure'],
  ['% dari total pengeluaran', '% of total expenditure'],
  ['Analisis Rinci Penyerapan per Cost Center (Cost Discipline Matrix)', 'Detailed Absorption Analysis by Cost Center (Cost Discipline Matrix)'],
  ['Unit Cost Center', 'Cost Center Unit'],
  ['di Supabase mengaktifkan', 'in Supabase has enabled'],
  ['Pesan Galat Supabase:', 'Supabase Error Message:'],
  ['Jalankan di Supabase', 'Run in Supabase'],
  ['Solusi Cepat RLS (Direkomendasikan)', 'Quick RLS Fix (Recommended)'],
  ['Siklus:', 'Cycle:'],
  ['Level Waspada (Warning)', 'Warning Level'],
  ['Level Kritis (Overbudget)', 'Critical Level (Overbudget)'],
  ['Status Revisi Anggaran', 'Budget Revision Status'],
  ['Master Cost Center Pabrik Mojokerto', 'Mojokerto Factory Master Cost Centers'],
  ['Semua Entitas (', 'All Entities ('],
  ['Pusat Biaya', 'Cost Center'],
  ['Pos Anggaran', 'Budget Line Item'],
  ['Kepala Bagian / PIC', 'Section Head / PIC'],
  ['Cost Center Pabrik', 'Factory Cost Centers'],
  ['Rekaman Transaksi', 'Transaction Records'],
  ['Rekaman Finansial', 'Financial Records'],
  ['Terproteksi Aktif', 'Actively Protected'],
  ['Min. 5 karakter', 'Min. 5 characters'],
  ['Ulangi password', 'Repeat password'],
  ['Status Penyimpanan:', 'Storage Status:'],
  ['Arsitektur Database Cloud DABACO', 'DABACO Cloud Database Architecture'],
  ['Solusi Error "new row violates row-level security policy":', 'Fix for "new row violates row-level security policy":'],
  ['Akun Berstatus Aktif', 'Account Status: Active'],
  ['Admin & Pengendali Anggaran', 'Admin & Budget Controller'],
  ['Koneksi Basis Data', 'Database Connection'],
  ['Tersinkron', 'Synchronized'],
  ['Perbarui profil atau hak akses untuk @', 'Update profile or access permissions for @'],
  ['Akun', 'Accounts'],
  ['Kategori Training & Development Mendekati Limit', 'Training & Development Category Approaching Limit'],
  ['Penyerapan biaya sertifikasi telah mencapai 94.2% dari plafon forecast.', 'Certification cost absorption has reached 94.2% of the forecast ceiling.'],
  ['Item HR001EDUCATIONFEETRAINING pada bulan Feb melampaui forecast sebesar Rp 8.000.000.', 'Item HR001EDUCATIONFEETRAINING in Feb exceeded forecast by Rp 8,000,000.'],
  ['Over Budget Terdeteksi:', 'Over Budget Detected:'],
  ['Pengeluaran aktual telah melebihi plafon budget sebesar', 'Actual expenditure has exceeded the budget ceiling by'],
  ['Notifikasi email otomatis dikirim.', 'Automated email notification has been dispatched.'],

  // =========================================================
  // 8. JS STRING LITERALS, DECK SLIDES, SPEAKER NOTES, SERVICES & PARSER
  // =========================================================
  // Executive Presentation Deck Slide Tabs, Cards & Speaker Notes
  ['Struktur Pos Item Beban', 'Expense Line-Item Structure'],
  ['Distribusi Pos Item Pengeluaran', 'Expense Line-Item Distribution'],
  ['Resolusi & Keputusan', 'Resolutions & Decisions'],
  ['Realisasi Kas Tertinggi', 'Highest Cash Realization'],
  ['Efisiensi Kas Tertinggi', 'Highest Cash Efficiency'],
  ['Kickoff Program Training & Rekrutmen', 'Training & Recruitment Program Kickoff'],
  ['Puncak Pelaksanaan Pelatihan & Seleksi', 'Peak Training & Recruitment Execution'],
  ['Soroti total realisasi pengeluaran sebesar', 'Highlight total actual expenditure of'],
  ['dengan penyerapan', 'with absorption at'],
  ['% dari proyeksi.', '% of forecast.'],
  ['Efisiensi kas bersih mencapai', 'Net cash efficiency reached'],
  [', menunjukkan disiplin biaya yang sangat sehat.', ', demonstrating strong and healthy cost discipline.'],
  ['Terkendali & Prudent', 'Controlled & Prudent'],
  ['Terkendali', 'Controlled'],

  // App, Banking, Dashboard, Data Management, Database Console, Alerts, Reports, Shortcuts
  ['Database Supabase terhubung, namun tabel masih kosong. Silakan gunakan tombol "Push Data ke Supabase" untuk mengunggah dataset awal.', 'Supabase database is connected, but tables are still empty. Please click "Push Data to Supabase" to upload the initial dataset.'],
  ['Saldo kas dan mutasi rekening koran berhasil disinkronkan.', 'Cash balances and bank account statements have been successfully synchronized.'],
  ['Pembayaran Trainer Lean Kaizen & Vendor Konsumsi', 'Lean Kaizen Trainer & Catering Vendor Payment'],
  ['Jasa Lembaga Training & Sertifikasi SDM', 'HR Training & Certification Institute Services'],
  ['Langganan Software HRIS & Assessment Rekrutmen', 'HRIS Software & Recruitment Assessment Subscription'],
  ['Pelaksanaan Psikotes & Medical Check-Up Rekrutmen', 'Recruitment Psychometric Test & Medical Check-Up Execution'],
  ['Hemat (-', 'Saved (-'],
  ['+Surplus Aman', '+Safe Surplus'],
  ['Aman', 'Safe'],
  ['Tipe Data', 'Data Type'],
  ['Pencatatan realisasi pengeluaran riil aktual (REALIZATION)', 'Actual cash expenditure ledger recording (REALIZATION)'],
  ['Ketik konfirmasi kata "RESET" dengan tepat!', 'Type the confirmation word "RESET" exactly!'],
  ['Database lokal berhasil dikembalikan ke dataset standar awal!', 'Local database has been successfully restored to the factory default dataset!'],
  ['Tabel [', 'Tables ['],
  ['Semua pos item terkendali', 'All line items are under control'],
  ['Tidak ada item berisiko', 'No items at risk'],
  [') • Varians Kas:', ') • Cash Variance:'],
  ['Rangkuman Eksekutif Direksi berhasil disalin ke clipboard.', 'Board Executive Summary successfully copied to clipboard.'],
  ['FY Penuh (Apr–Mar)', 'Full FY (Apr–Mar)'],
  ['FY Penuh', 'Full FY'],
  ['Terakhir:', 'Last:'],
  ['Membuka dialog pembuatan dossier PDF resmi Direksi Ajinomoto.', 'Opens the official Ajinomoto Board PDF dossier generator dialog.'],
  ['Navigasi Tab Modul Cepat', 'Quick Module Tab Navigation'],
  ['Beralih ke laporan presentasi khusus Dewan Direksi & C-Suite.', 'Switch to the dedicated Board of Directors & C-Suite presentation report.'],
  ['Plafon Budget Plan (Perencanaan)', 'Annual Budget Plan Ceiling'],
  ['Pencatatan Realisasi Aktual Kas', 'Actual Cash Realization Ledger'],
  ['Password minimal harus 5 karakter.', 'Password must be at least 5 characters.'],
  ['Sedang Push...', 'Pushing...'],
  ['Sedang mengunggah data ke Supabase...', 'Uploading datasets to Supabase...'],
  ['Salin Seluruh SQL', 'Copy Full SQL'],
  ['Mengerti & Tutup', 'Got It & Close'],
  ['Harap lengkapi seluruh isian wajib.', 'Please complete all required fields.'],

  // Supabase Service Live Progress & Status Messages
  ['Konfigurasi Supabase belum valid (URL atau Anon Key tidak valid).', 'Supabase configuration is invalid (URL or Anon Key is not valid).'],
  ['Tabel master_cost_center:', 'Table master_cost_center:'],
  ['Tabel master_items:', 'Table master_items:'],
  ['Tabel budget_plan:', 'Table budget_plan:'],
  ['Tabel forecast:', 'Table forecast:'],
  ['Tabel realization:', 'Table realization:'],
  ['Server Supabase tidak dapat dijangkau. Periksa kembali Project URL dan Anon Key di tab Supabase Backend.', 'Cannot reach Supabase server. Please verify Project URL and Anon Key in the Supabase Backend tab.'],
  ['Koneksi Supabase belum dikonfigurasi.', 'Supabase connection is not configured yet.'],
  ['Gagal mengambil jumlah data dari Supabase.', 'Failed to fetch record counts from Supabase.'],
  ['Mengosongkan tabel Realization...', 'Clearing Realization table...'],
  ['Gagal mengosongkan realization:', 'Failed to clear realization:'],
  ['Mengosongkan tabel Forecast...', 'Clearing Forecast table...'],
  ['Gagal mengosongkan forecast:', 'Failed to clear forecast:'],
  ['Mengosongkan tabel Budget Plan...', 'Clearing Budget Plan table...'],
  ['Gagal mengosongkan budget_plan:', 'Failed to clear budget_plan:'],
  ['Mengosongkan tabel Master Items...', 'Clearing Master Items table...'],
  ['Gagal mengosongkan master_items:', 'Failed to clear master_items:'],
  ['Mengosongkan tabel Master Cost Center...', 'Clearing Master Cost Center table...'],
  ['Gagal mengosongkan master_cost_center:', 'Failed to clear master_cost_center:'],
  ['Tabel berhasil dikosongkan!', 'Tables cleared successfully!'],
  ['Koneksi Supabase belum dikonfigurasi atau URL/Key tidak valid.', 'Supabase connection is not configured or URL/Key is invalid.'],
  ['Menyiapkan Master Items & Biaya...', 'Preparing Master Items & Expenses...'],
  ['Gagal push', 'Push failed'],
  ['Membersihkan data lama di Supabase (Mode Menimpa)...', 'Clearing existing data in Supabase (Overwrite Mode)...'],
  ['Mengunggah Master Cost Center...', 'Uploading Master Cost Centers...'],
  ['Mengunggah Master Items & Biaya...', 'Uploading Master Items & Expenses...'],
  ['Mengunggah data Rencana Anggaran (Budget Plan)...', 'Uploading Annual Budget Plan data...'],
  ['Mengunggah data Proyeksi Anggaran (Forecast)...', 'Uploading Budget Forecast data...'],
  ['Mengunggah data Realisasi Transaksi Kas...', 'Uploading Cash Realization transaction data...'],
  ['Sinkronisasi Supabase selesai!', 'Supabase synchronization complete!'],
  ['Terjadi kesalahan saat mengunggah data ke Supabase.', 'An error occurred while uploading data to Supabase.'],
  ['Project URL atau Public Anon Key belum valid. Pastikan format URL https://[ref].supabase.co.', 'Project URL or Public Anon Key is invalid. Ensure URL matches https://[ref].supabase.co.'],
  ['Terhubung ke Supabase! Catatan: Tabel database belum dibuat. Silakan jalankan DABACO SQL Schema terlebih dahulu di SQL Editor Supabase.', 'Connected to Supabase! Note: Database tables have not been created yet. Please run the DABACO SQL Schema in the Supabase SQL Editor first.'],
  ['Koneksi ditolak:', 'Connection rejected:'],
  ['Gagal menghubungi server Supabase.', 'Failed to connect to Supabase server.'],

  // CSV Parser Column Descriptions & Validation Messages
  ['Kode unit kerja / departemen (misal: HR001, PR002)', 'Department / work unit code (e.g. HR001, PR002)'],
  ['Nominal Plafon (Budget)', 'Budget Ceiling Amount'],
  ['Jumlah alokasi anggaran dalam Rupiah (misal: 150000000)', 'Allocated budget amount in IDR (e.g. 150000000)'],
  ['Tahun estimasi pengeluaran (misal: 2026)', 'Forecast expenditure year (e.g. 2026)'],
  ['Nama bulan estimasi (Jan..Des atau 1-12)', 'Forecast month name (Jan..Dec or 1–12)'],
  ['Kode unit kerja / departemen (misal: HR001)', 'Department / work unit code (e.g. HR001)'],
  ['Jumlah estimasi proyeksi pengeluaran', 'Estimated forecast expenditure amount'],
  ['Kode unit kerja (misal: HR001)', 'Work unit code (e.g. HR001)'],
  ['Jumlah aktual pengeluaran dalam Rupiah', 'Actual expenditure amount in IDR'],
  ['Gaji Pokok Karyawan Tetap & Kontrak Periode Jan 2026', 'Permanent & Contract Employee Base Salary — Jan 2026'],
  ['Otomatis diambil dari tanggal transaksi jika kosong', 'Automatically derived from transaction date if left blank'],
  ['Kolom wajib belum dipetakan:', 'Required column not mapped:'],
  ['Tahun tidak valid:', 'Invalid year:'],
  ['(Harus 4 digit, misal: 2026)', '(Must be 4 digits, e.g. 2026)'],
  ['Bulan tidak valid:', 'Invalid month:'],
  ['(Gunakan Jan..Dec atau 1..12)', '(Use Jan..Dec or 1..12)'],
  ['belum ada di master (Otomatis didaftarkan)', 'is not in master yet (Will be auto-registered)'],
  ['belum terdaftar di Master Item (Akan tetap diimpor)', 'is not registered in Master Items yet (Will still be imported)'],
  ['Nominal tidak valid:', 'Invalid amount:'],
  ['Format tanggal tidak dikenali:', 'Unrecognized date format:'],
  ['(Gunakan YYYY-MM-DD atau DD/MM/YYYY)', '(Use YYYY-MM-DD or DD/MM/YYYY)'],
  ['belum terdaftar di Master Item', 'is not registered in Master Items']
];

/**
 * Curated English -> Indonesian dictionary for legacy English-only labels
 * inside operational modules when Bahasa Indonesia (ID) mode is active.
 * Never touches proper nouns (DABACO, Ajinomoto, SAP, Google Sheets, Supabase, Looker Studio, PDF, CSV, JSON).
 */
const RAW_EN_TO_ID_DICTIONARY: Array<[string, string]> = [
  ['Executive Financial & Budget Briefing Report', 'Laporan Ringkasan Finansial & Anggaran Eksekutif'],
  ['Executive Board Meeting Presentation Deck', 'Dek Presentasi Rapat Direksi Eksekutif'],
  ['Business Intelligence & Analytics Studio', 'Studio Analitik & Business Intelligence'],
  ['Generate Executive PDF Budget Report', 'Buat Laporan Anggaran PDF Eksekutif'],
  ['Generate Executive PDF Report (Ctrl+P)', 'Buat Laporan PDF Eksekutif (Ctrl+P)'],
  ['CONFIDENTIAL • TOP MANAGEMENT DOSSIER', 'RAHASIA • DOSIR MANAJEMEN PUNCAK'],
  ['CONFIDENTIAL • TOP MANAGEMENT', 'RAHASIA • MANAJEMEN PUNCAK'],
  ['Executive Budget Report Alert', 'Peringatan Laporan Anggaran Eksekutif'],
  ['Executive Budget Report (PDF)', 'Laporan Anggaran Eksekutif (PDF)'],
  ['Executive Cover & Scorecard', 'Sampul Eksekutif & Scorecard'],
  ['Executive Financial KPI Matrix', 'Matriks KPI Finansial Eksekutif'],
  ['Finance & Accounting Manager', 'Manajer Keuangan & Akuntansi'],
  ['Factory General Manager', 'General Manager Pabrik'],
  ['Financial Health Status', 'Status Kesehatan Finansial'],
  ['Departmental Efficiency', 'Efisiensi Departemen'],
  ['Top Management Report', 'Laporan Manajemen Puncak'],
  ['Actual Spending:', 'Pengeluaran Aktual:'],
  ['Forecasted Budget:', 'Anggaran Proyeksi:'],
  ['Planned Budget:', 'Rencana Anggaran:'],
  ['Actual Spending', 'Pengeluaran Aktual'],
  ['Forecasted Budget', 'Anggaran Proyeksi'],
  ['Planned Budget', 'Rencana Anggaran'],
  ['Forecast Projections', 'Proyeksi Anggaran'],
  ['Actual Realization', 'Realisasi Aktual'],
  ['Real-Time BI Engine', 'Mesin BI Real-Time'],
  ['HTML Mail Preview', 'Pratinjau Email HTML'],
  ['Bulk Upload CSV', 'Unggah Massal CSV'],
  ['Bulk Upload', 'Unggah Massal'],
  ['Executive PDF', 'PDF Eksekutif'],
  ['Export CSV', 'Ekspor CSV'],
  ['Backup JSON', 'Cadangan JSON'],
  ['Reset Default', 'Reset Standar'],
  ['Budget Plan', 'Rencana Anggaran'],
  ['Live Connected', 'Terhubung Aktif'],
  ['Ready to Print', 'Siap Cetak'],
  ['Refresh', 'Muat Ulang'],
  ['Remarks', 'Keterangan']
];

// Deduplicate & sort longest-first so full sentences always match before sub-phrases
const dedupeAndSort = (entries: Array<[string, string]>) => {
  const seen = new Set<string>();
  const unique: Array<[string, string]> = [];
  for (const [k, v] of entries) {
    const key = k.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push([key, v]);
  }
  return unique.sort((a, b) => b[0].length - a[0].length);
};

const SORTED_ID_TO_EN = dedupeAndSort(RAW_ENTERPRISE_DICTIONARY);
const SORTED_EN_TO_ID = dedupeAndSort(RAW_EN_TO_ID_DICTIONARY);

const EXACT_ID_TO_EN = new Map<string, string>(
  SORTED_ID_TO_EN.map(([k, v]) => [k.toLowerCase(), v])
);
const EXACT_EN_TO_ID = new Map<string, string>(
  SORTED_EN_TO_ID.map(([k, v]) => [k.toLowerCase(), v])
);

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const compileMatchers = (entries: Array<[string, string]>, caseInsensitive: boolean) =>
  entries.map(([src, dst]) => {
    const isShortWord = /^[A-Za-zÀ-ÿ0-9-]+$/.test(src);
    const flags = caseInsensitive ? 'gi' : 'g';
    const pattern = isShortWord
      ? new RegExp(`(?<![A-Za-z0-9_-])${escapeRegExp(src)}(?![A-Za-z0-9_-])`, flags)
      : new RegExp(escapeRegExp(src), flags);
    return { src, srcLower: src.toLowerCase(), dst, pattern, isShortWord };
  });

const COMPILED_ID_TO_EN = compileMatchers(SORTED_ID_TO_EN, true);
const COMPILED_EN_TO_ID = compileMatchers(SORTED_EN_TO_ID, true);

// Quick pre-check: skip pure numbers, currencies, codes, URLs, emails
const SKIP_PATTERN = /^[\s\d.,:%+\-–—/()RpIDR$€¥•|[\]{}@#*!?]+$/;
const CODE_OR_EMAIL_PATTERN = /^(https?:\/\/|[^\s@]+@[^\s@]+\.[^\s@]+|HR\d{3}[A-Z0-9]+|[A-Z]{2,5}\d{2,6})$/;

const preserveCasing = (matched: string, replacement: string): string => {
  if (matched.length >= 3 && matched === matched.toUpperCase() && /[A-Z]/.test(matched)) {
    return replacement.toUpperCase();
  }
  return replacement;
};

export function translateTextToEnglish(raw: string): string {
  if (!raw || raw.length < 2) return raw;
  const trimmed = raw.trim();
  if (!trimmed || SKIP_PATTERN.test(trimmed) || CODE_OR_EMAIL_PATTERN.test(trimmed)) {
    return raw;
  }

  const leading = raw.match(/^\s*/)?.[0] || '';
  const trailing = raw.match(/\s*$/)?.[0] || '';

  // Fast case-insensitive exact lookup (including standalone Indonesian connectors & badges)
  const lowerTrimmed = trimmed.toLowerCase();
  if (lowerTrimmed === 'atau') return `${leading}${preserveCasing(trimmed, 'or')}${trailing}`;
  if (lowerTrimmed === 'dari') return `${leading}${preserveCasing(trimmed, 'of')}${trailing}`;
  if (lowerTrimmed === 'dan') return `${leading}${preserveCasing(trimmed, 'and')}${trailing}`;
  if (lowerTrimmed === 'anda') return `${leading}${preserveCasing(trimmed, 'You')}${trailing}`;

  const exact = EXACT_ID_TO_EN.get(lowerTrimmed);
  if (exact) {
    return `${leading}${preserveCasing(trimmed, exact)}${trailing}`;
  }

  let result = raw;
  let resultLower = result.toLowerCase();
  let changed = false;

  for (const { srcLower, dst, pattern } of COMPILED_ID_TO_EN) {
    if (resultLower.includes(srcLower)) {
      const next = result.replace(pattern, (match) => preserveCasing(match, dst));
      if (next !== result) {
        result = next;
        resultLower = result.toLowerCase();
        changed = true;
      }
    }
  }

  // Natural cleanup for common Indonesian connector remnants inside mixed dynamic strings
  if (changed) {
    result = result
      .replace(/(?<![A-Za-z])atau(?![A-Za-z])/gi, 'or')
      .replace(/(?<![A-Za-z])dan(?![A-Za-z])/gi, 'and')
      .replace(/(?<![A-Za-z])dari(?![A-Za-z])/gi, 'of');
  }

  return changed ? result : raw;
}

export function translateTextToIndonesian(raw: string): string {
  if (!raw || raw.length < 3) return raw;
  const trimmed = raw.trim();
  if (!trimmed || SKIP_PATTERN.test(trimmed) || CODE_OR_EMAIL_PATTERN.test(trimmed)) {
    return raw;
  }

  const leading = raw.match(/^\s*/)?.[0] || '';
  const trailing = raw.match(/\s*$/)?.[0] || '';

  const exact = EXACT_EN_TO_ID.get(trimmed.toLowerCase());
  if (exact) {
    return `${leading}${preserveCasing(trimmed, exact)}${trailing}`;
  }

  let result = raw;
  let resultLower = result.toLowerCase();
  let changed = false;

  for (const { srcLower, dst, pattern } of COMPILED_EN_TO_ID) {
    if (resultLower.includes(srcLower)) {
      const next = result.replace(pattern, (match) => preserveCasing(match, dst));
      if (next !== result) {
        result = next;
        resultLower = result.toLowerCase();
        changed = true;
      }
    }
  }

  return changed ? result : raw;
}

export function translateText(raw: string, language: Language): string {
  return language === 'en' ? translateTextToEnglish(raw) : translateTextToIndonesian(raw);
}

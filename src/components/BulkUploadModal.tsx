import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Check,
  X,
  FileText,
  HelpCircle,
  Sparkles,
  Layers,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import {
  BulkUploadTarget,
  BudgetRecord,
  ForecastRecord,
  RealizationRecord,
  MasterCostCenter,
  MasterItem,
  ValidatedRow,
  PreValidationSummary
} from '../types';
import { SystemAlertModal, AlertType } from './SystemAlertModal';
import {
  SCHEMA_DEFINITIONS,
  parseCSV,
  autoMapHeaders,
  preValidateRows,
  generateSampleCSV
} from '../utils/csvParser';
import { formatIDR } from '../utils/pdfGenerator';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTarget?: BulkUploadTarget;
  costCenters: MasterCostCenter[];
  masterItems: MasterItem[];
  onBatchAddBudget: (records: Omit<BudgetRecord, 'id'>[], mode?: 'append' | 'overwrite') => void;
  onBatchAddForecast: (records: Omit<ForecastRecord, 'id'>[], mode?: 'append' | 'overwrite') => void;
  onBatchAddRealization: (records: Omit<RealizationRecord, 'id'>[], mode?: 'append' | 'overwrite') => void;
  darkMode: boolean;
}

type Step = 'upload' | 'mapping' | 'validation' | 'completed';

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  defaultTarget = 'budget',
  costCenters,
  masterItems,
  onBatchAddBudget,
  onBatchAddForecast,
  onBatchAddRealization,
  darkMode
}) => {
  const [step, setStep] = useState<Step>('upload');
  const [target, setTarget] = useState<BulkUploadTarget>(defaultTarget);
  const [fileName, setFileName] = useState<string>('');
  const [rawContent, setRawContent] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPasting, setIsPasting] = useState<boolean>(false);
  const [pastedText, setPastedText] = useState<string>('');

  // Parsing & Mapping State
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [headerMapping, setHeaderMapping] = useState<Record<string, string>>({});

  // Validation State
  const [validatedRows, setValidatedRows] = useState<ValidatedRow[]>([]);
  const [validationSummary, setValidationSummary] = useState<PreValidationSummary | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'valid' | 'issues'>('all');
  const [skipInvalidRows, setSkipInvalidRows] = useState<boolean>(true);
  const [importMode, setImportMode] = useState<'append' | 'overwrite'>('append');

  // Batch Processing State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importedCount, setImportedCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom System Alert Modal state replacing default browser alert()
  const [systemAlert, setSystemAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: AlertType;
    detail?: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  // Sync default target when modal opens
  useEffect(() => {
    if (isOpen) {
      setTarget(defaultTarget);
      resetState();
    }
  }, [isOpen, defaultTarget]);

  const resetState = () => {
    setStep('upload');
    setFileName('');
    setRawContent('');
    setCsvHeaders([]);
    setRawRows([]);
    setHeaderMapping({});
    setValidatedRows([]);
    setValidationSummary(null);
    setIsProcessing(false);
    setImportedCount(0);
    setIsPasting(false);
    setPastedText('');
  };

  // Change target and re-trigger auto-mapping if CSV is already loaded
  const handleTargetChange = (newTarget: BulkUploadTarget) => {
    setTarget(newTarget);
    if (csvHeaders.length > 0) {
      const autoMapped = autoMapHeaders(csvHeaders, newTarget);
      setHeaderMapping(autoMapped);
    }
  };

  // Process loaded CSV text
  const processCSVText = (text: string, sourceName: string) => {
    setRawContent(text);
    setFileName(sourceName);
    const parsed = parseCSV(text);

    if (parsed.headers.length === 0 || parsed.rows.length === 0) {
      setSystemAlert({
        isOpen: true,
        title: 'Format CSV Kosong / Tidak Valid',
        message: 'File CSV yang Anda unggah tidak memiliki baris data atau format kolom tidak dapat dibaca oleh sistem.',
        type: 'warning',
        detail: 'Pastikan file memiliki header pada baris pertama dan menggunakan pemisah koma (,) atau titik koma (;).'
      });
      return;
    }

    setCsvHeaders(parsed.headers);
    setRawRows(parsed.rows);

    // Run auto-mapping
    const initialMapping = autoMapHeaders(parsed.headers, target);
    setHeaderMapping(initialMapping);
    setStep('mapping');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processCSVText(content, file.name);
    };
    reader.readAsText(file);
    // Reset file input value so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setSystemAlert({
        isOpen: true,
        title: 'Format File Tidak Didukung',
        message: 'Hanya berkas berformat CSV (.csv) yang didukung untuk impor massal sistem.',
        type: 'error',
        detail: 'Silakan simpan atau ekspor berkas spreadsheet Anda menjadi format CSV berpemisah koma (,) atau titik koma (;).'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processCSVText(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const sample = generateSampleCSV(target);
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `template_${target}_ajinomoto.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApplyPastedText = () => {
    if (!pastedText.trim()) {
      setSystemAlert({
        isOpen: true,
        title: 'Konten CSV Belum Diisi',
        message: 'Silakan tempelkan konten teks berformat CSV pada area teks yang tersedia sebelum melanjutkan.',
        type: 'warning'
      });
      return;
    }
    processCSVText(pastedText, 'pasted_clipboard_data.csv');
    setIsPasting(false);
  };

  // Run Pre-Validation Logic
  const handleProceedToValidation = () => {
    const result = preValidateRows(rawRows, headerMapping, target, costCenters, masterItems);
    setValidatedRows(result.validatedRows);
    setValidationSummary(result.summary);
    setStep('validation');
  };

  // Sample values preview for mapping helper
  const getHeaderSampleValue = (userCol: string): string => {
    if (!userCol || rawRows.length === 0) return '-';
    const sample = rawRows[0][userCol];
    return sample !== undefined && sample !== '' ? sample : '(kosong)';
  };

  // Execute Batch Processing
  const handleExecuteBatchImport = () => {
    const rowsToImport = skipInvalidRows
      ? validatedRows.filter(r => r.isValid && r.parsedData !== null)
      : validatedRows.filter(r => r.parsedData !== null);

    if (rowsToImport.length === 0) {
      setSystemAlert({
        isOpen: true,
        title: 'Tidak Ada Data Valid',
        message: 'Tidak ditemukan baris data yang valid untuk diimpor ke dalam database sistem.',
        type: 'error',
        detail: 'Periksa kembali pemetaan kolom dan perbaiki baris data bertanda merah pada tabel validasi sebelum memproses.'
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      if (target === 'budget') {
        const records = rowsToImport.map(r => r.parsedData as Omit<BudgetRecord, 'id'>);
        onBatchAddBudget(records, importMode);
      } else if (target === 'forecast') {
        const records = rowsToImport.map(r => r.parsedData as Omit<ForecastRecord, 'id'>);
        onBatchAddForecast(records, importMode);
      } else {
        const records = rowsToImport.map(r => r.parsedData as Omit<RealizationRecord, 'id'>);
        onBatchAddRealization(records, importMode);
      }

      setImportedCount(rowsToImport.length);
      setIsProcessing(false);
      setStep('completed');
    }, 600);
  };

  // Filtered rows for pre-validation table
  const displayedRows = useMemo(() => {
    if (filterMode === 'valid') {
      return validatedRows.filter(r => r.isValid);
    }
    if (filterMode === 'issues') {
      return validatedRows.filter(r => !r.isValid || r.hasWarnings);
    }
    return validatedRows;
  }, [validatedRows, filterMode]);

  const currentSchemaFields = SCHEMA_DEFINITIONS[target];
  const requiredFields = currentSchemaFields.filter(f => f.required);
  const mappedRequiredCount = requiredFields.filter(f => Boolean(headerMapping[f.key])).length;
  const isMappingComplete = mappedRequiredCount === requiredFields.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${
          darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center border border-red-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Bulk Upload Data Keuangan</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Tersambung ke Database
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pra-validasi & pemetaan header kustom, data otomatis tersimpan permanen ke database DABACO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className={`px-6 py-3 border-b flex items-center justify-between text-xs font-semibold ${
          darkMode ? 'border-slate-800/80 bg-slate-900' : 'border-slate-100 bg-white'
        }`}>
          <div className="flex items-center gap-6 overflow-x-auto py-1">
            <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 'upload' ? 'bg-red-600 text-white' : (step !== 'upload' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800')
              }`}>
                {step !== 'upload' ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span>1. Upload File</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />

            <div className={`flex items-center gap-2 ${step === 'mapping' ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 'mapping' ? 'bg-red-600 text-white' : (step === 'validation' || step === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800')
              }`}>
                {step === 'validation' || step === 'completed' ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span>2. Pemetaan Header</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />

            <div className={`flex items-center gap-2 ${step === 'validation' ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 'validation' ? 'bg-red-600 text-white' : (step === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800')
              }`}>
                {step === 'completed' ? <Check className="w-3.5 h-3.5" /> : '3'}
              </span>
              <span>3. Pra-Validasi Skema</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />

            <div className={`flex items-center gap-2 ${step === 'completed' ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800'
              }`}>
                4
              </span>
              <span>4. Hasil Batch</span>
            </div>
          </div>

          {/* Active Target Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]">
            <span className="text-slate-400">Target Skema:</span>
            <span className="font-bold text-red-600 dark:text-red-400 uppercase">
              {target === 'budget' ? 'BUDGET_PLAN' : target === 'forecast' ? 'FORECAST' : 'REALIZATION'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: UPLOAD FILE */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Target Schema Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  Pilih Target Skema Database Finansial:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTargetChange('budget')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      target === 'budget'
                        ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 text-blue-900 dark:text-blue-100 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-sm">Budget Plan</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Plafon alokasi anggaran tahunan per bulan dan Cost Center
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTargetChange('forecast')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      target === 'forecast'
                        ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-100 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-sm">Forecast Projections</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Estimasi revisi pengeluaran berkala per Cost Center
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTargetChange('realization')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      target === 'realization'
                        ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-100 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-sm">Actual Realization</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Pencatatan aktual tanggal transaksi, bukti pengeluaran riil
                    </div>
                  </button>
                </div>
              </div>

              {/* Drag & Drop Area */}
              {!isPasting ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    isDragging
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                      : 'border-slate-300 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv"
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shadow-inner">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                      Tarik & Letakkan File CSV di sini, atau Klik untuk Memilih
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                      Mendukung pemisah koma (,), titik koma (;), atau tab. Nama header tidak harus sama persis dengan skema internal, Anda dapat memetakannya di langkah berikutnya.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tempelkan Teks CSV Mentah (Dari Excel / Notepad):
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPasting(false)}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Beralih ke Upload File
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder={`Tahun,Bulan,Cost_Center,Kode_Item,Nominal\n2026,Jan,HR001,HR001SALARY,150000000\n2026,Feb,PR002,PR002RAWMEAT,320000000`}
                    className="w-full font-mono text-xs p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPastedText}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
                  >
                    Proses Teks CSV
                  </button>
                </div>
              )}

              {/* Quick Helper Tools */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Unduh Format Template CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPasting(!isPasting)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>{isPasting ? 'Upload File' : 'Paste Teks CSV'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Database className="w-3.5 h-3.5" />
                  <span>Data otomatis tersimpan langsung ke database</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: HEADER MAPPING */}
          {step === 'mapping' && (
            <div className="space-y-6">
              {/* Info banner */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3 text-xs text-blue-800 dark:text-blue-300">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold mb-1">
                    File Terdeteksi: <span className="underline">{fileName}</span> ({rawRows.length} baris data, {csvHeaders.length} kolom)
                  </div>
                  <p className="leading-relaxed">
                    Sistem telah memetakan kolom secara otomatis berdasarkan sinonim dan kata kunci. Pastikan seluruh kolom bertanda <strong>[Wajib]</strong> telah sesuai dengan kolom pada file CSV Anda sebelum melanjutkan ke pra-validasi.
                  </p>
                </div>
              </div>

              {/* Status Header Mapping */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Status Pemetaan: <span className={isMappingComplete ? 'text-emerald-600 font-bold' : 'text-amber-500 font-bold'}>
                    {mappedRequiredCount} dari {requiredFields.length} kolom wajib terpetakan
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHeaderMapping(autoMapHeaders(csvHeaders, target))}
                  className="flex items-center gap-1.5 text-xs text-red-600 hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Auto-Mapping</span>
                </button>
              </div>

              {/* Interactive Mapping Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5 w-1/3">Skema Internal DABACO</th>
                      <th className="p-3.5 w-1/3">Kolom pada File CSV Pengguna</th>
                      <th className="p-3.5 w-1/3">Contoh Nilai (Baris 1)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {currentSchemaFields.map((field) => {
                      const selectedCol = headerMapping[field.key] || '';
                      const isMapped = Boolean(selectedCol);
                      const sampleVal = getHeaderSampleValue(selectedCol);

                      return (
                        <tr key={field.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {field.label}
                              </span>
                              {field.required ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900/60">
                                  Wajib
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                  Opsional
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                              {field.description}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <select
                              value={selectedCol}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHeaderMapping(prev => ({
                                  ...prev,
                                  [field.key]: val
                                }));
                              }}
                              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                                isMapped
                                  ? 'bg-slate-50 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                                  : field.required
                                  ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-600'
                                  : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                              }`}
                            >
                              <option value="">-- Tidak Dipetakan (Kosong) --</option>
                              {csvHeaders.map(header => (
                                <option key={header} value={header}>
                                  {header}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                            {isMapped ? (
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]">
                                {sampleVal}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: PRE-VALIDATION LOGIC REVIEW */}
          {step === 'validation' && validationSummary && (
            <div className="space-y-6">
              {/* Validation KPI Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Baris</span>
                  <div className="text-2xl font-black mt-1 text-slate-800 dark:text-slate-100">
                    {validationSummary.totalRows}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Baris Valid (Siap Impor)</span>
                  <div className="text-2xl font-black mt-1 text-emerald-700 dark:text-emerald-400">
                    {validationSummary.validCount}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Peringatan (Master Baru)</span>
                  <div className="text-2xl font-black mt-1 text-amber-700 dark:text-amber-400">
                    {validationSummary.warningCount}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Error Kritis (Invalid)</span>
                  <div className="text-2xl font-black mt-1 text-rose-700 dark:text-rose-400">
                    {validationSummary.errorCount}
                  </div>
                </div>
              </div>

              {/* Table Controls & Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      filterMode === 'all'
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Semua Baris ({validatedRows.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('valid')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      filterMode === 'valid'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    Hanya Siap Impor ({validationSummary.validCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('issues')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      filterMode === 'issues'
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    Bermasalah ({validationSummary.errorCount + validationSummary.warningCount})
                  </button>
                </div>

                {validationSummary.errorCount > 0 && (
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={skipInvalidRows}
                      onChange={(e) => setSkipInvalidRows(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span>Abaikan baris error dan tetap impor {validationSummary.validCount} baris valid</span>
                  </label>
                )}
              </div>

              {/* Data Pre-Validation Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3 w-16">Baris</th>
                      <th className="p-3">Data Hasil Normalisasi</th>
                      <th className="p-3 w-32">Status</th>
                      <th className="p-3">Catatan Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {displayedRows.map((row) => (
                      <tr
                        key={row.rowIndex}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                          !row.isValid ? 'bg-rose-50/40 dark:bg-rose-950/10' : row.hasWarnings ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        <td className="p-3 font-mono text-slate-500 dark:text-slate-400 font-medium">
                          #{row.rowIndex}
                        </td>

                        <td className="p-3">
                          {row.parsedData ? (
                            <div className="flex flex-wrap items-center gap-2 text-[11px]">
                              {target === 'realization' && (
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                  {row.parsedData.tanggal}
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                {row.parsedData.year} {row.parsedData.month}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                                {row.parsedData.costCenter}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                                {row.parsedData.item}
                              </span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {formatIDR(row.parsedData.amount)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Data gagal dinormalisasi</span>
                          )}
                        </td>

                        <td className="p-3">
                          {!row.isValid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
                              <XCircle className="w-3 h-3" />
                              <span>Error</span>
                            </span>
                          ) : row.hasWarnings ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Peringatan</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Valid</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-[11px]">
                          {row.errors.length > 0 ? (
                            <ul className="space-y-1">
                              {row.errors.map((err, i) => (
                                <li
                                  key={i}
                                  className={err.severity === 'error' ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-amber-600 dark:text-amber-400'}
                                >
                                  • {err.message}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              Sesuai skema internal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Database Storage Action Mode Selector (Menimpa vs Menambahkan) */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Metode Penyimpanan ke Database:</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        importMode === 'append'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {importMode === 'append' ? 'Mode Menambahkan (Append)' : 'Mode Menimpa (Overwrite)'}
                      </span>
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Tentukan apakah baris baru akan ditambahkan ke data yang sudah ada, atau menimpa total data skema {target.toUpperCase()}.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setImportMode('append')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      importMode === 'append'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                      importMode === 'append' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {importMode === 'append' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>Menambahkan (Append)</span>
                        <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">Rekomendasi</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Menyisipkan baris baru ke tabel {target.toUpperCase()}. Data lama yang sudah ada di database tetap dipertahankan.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportMode('overwrite')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      importMode === 'overwrite'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                      importMode === 'overwrite' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {importMode === 'overwrite' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                        <span>Menimpa Total (Overwrite)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Mengganti seluruh data tabel {target.toUpperCase()} dengan baris baru dari file ini. Data lama akan digantikan.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BATCH IMPORT COMPLETED */}
          {step === 'completed' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-4 border-emerald-500/20 animate-in zoom-in-50">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Batch Processing & Penyimpanan Berhasil!
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Sebanyak <strong>{importedCount} record data</strong> telah sukses divalidasi dan <strong>otomatis tersimpan ({importMode === 'overwrite' ? 'Menimpa Seluruh Data' : 'Menambahkan ke Data yang Ada'})</strong> langsung ke dalam database DABACO untuk skema {target.toUpperCase()}.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md cursor-pointer hover:opacity-90"
                >
                  Selesai & Lihat Data
                </button>
                <button
                  type="button"
                  onClick={resetState}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Unggah File Lain
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step !== 'completed' && (
          <div className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${
            darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50/80'
          }`}>
            <div>
              {step === 'mapping' && (
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ganti File</span>
                </button>
              )}

              {step === 'validation' && (
                <button
                  type="button"
                  onClick={() => setStep('mapping')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ubah Pemetaan Header</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>

              {step === 'mapping' && (
                <button
                  type="button"
                  disabled={!isMappingComplete}
                  onClick={handleProceedToValidation}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md cursor-pointer ${
                    isMappingComplete
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Lanjut ke Pra-Validasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 'validation' && validationSummary && (
                <button
                  type="button"
                  disabled={isProcessing || (skipInvalidRows ? validationSummary.validCount === 0 : validationSummary.errorCount > 0)}
                  onClick={handleExecuteBatchImport}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memproses Batch...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>
                        {importMode === 'overwrite' ? 'Timpa & Simpan ke DB' : 'Tambahkan ke Database'} ({skipInvalidRows ? validationSummary.validCount : validationSummary.totalRows} Baris)
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modern Pop-up Alert Modal replacing default alert */}
      <SystemAlertModal
        isOpen={systemAlert.isOpen}
        onClose={() => setSystemAlert(prev => ({ ...prev, isOpen: false }))}
        title={systemAlert.title}
        message={systemAlert.message}
        type={systemAlert.type || 'warning'}
        detail={systemAlert.detail}
        darkMode={darkMode}
      />
    </div>
  );
};

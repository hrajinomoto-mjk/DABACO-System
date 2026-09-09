import React, { useState } from 'react';
import {
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Clock,
  ExternalLink,
  Play,
  ArrowUpDown,
  Database,
  ShieldCheck
} from 'lucide-react';
import { GoogleSheetsConfig } from '../types';

interface GoogleSheetsSyncViewProps {
  config: GoogleSheetsConfig;
  onUpdateConfig: (newConfig: Partial<GoogleSheetsConfig>) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  totalRecords: { budget: number; forecast: number; realization: number };
  darkMode: boolean;
}

export const GoogleSheetsSyncView: React.FC<GoogleSheetsSyncViewProps> = ({
  config,
  onUpdateConfig,
  onTriggerSync,
  isSyncing,
  totalRecords,
  darkMode
}) => {
  const [spreadsheetId, setSpreadsheetId] = useState(config.spreadsheetId);
  const [gasUrl, setGasUrl] = useState(config.gasWebAppUrl);
  const [autoSync, setAutoSync] = useState(config.autoSync);
  const [syncInterval, setSyncInterval] = useState(config.syncIntervalMinutes);
  const [copiedScript, setCopiedScript] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const sampleGasScript = `/**
 * ========================================================
 * DABACO AUTOMATED SYNC CONNECTOR
 * PT AJINOMOTO INDONESIA - PT AJINEX INTERNATIONAL, MOJOKERTO FACTORY
 * Paste code ini ke Google Apps Script Spreadsheet Anda:
 * Extensions -> Apps Script -> Paste -> Deploy as Web App.
 * ========================================================
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'bundle';
  
  if (action === 'bundle') {
    return ContentService.createTextOutput(JSON.stringify(getDabacoBundle()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'OK', system: 'DABACO-GAS-v2.4' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (payload.sheet && payload.rows) {
      var sh = ss.getSheetByName(payload.sheet);
      if (!sh) sh = ss.insertSheet(payload.sheet);
      
      // Append or sync records safely
      payload.rows.forEach(function(r) {
        sh.appendRow(r);
      });
      return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS', count: payload.rows.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'NO_ACTION' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getDabacoBundle() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  function getRows(name) {
    var sh = ss.getSheetByName(name);
    if (!sh) return [];
    return sh.getDataRange().getValues();
  }
  return {
    budget: getRows('BUDGET_PLAN'),
    forecast: getRows('FORECAST'),
    realization: getRows('REALIZATION'),
    timestamp: new Date().toISOString()
  };
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(sampleGasScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      spreadsheetId,
      gasWebAppUrl: gasUrl,
      autoSync,
      syncIntervalMinutes: Number(syncInterval)
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Integrasi & Sinkronisasi Otomatis Google Sheets
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Menghubungkan DABACO langsung dengan Spreadsheet aktif (BUDGET_PLAN, FORECAST, REALIZATION) via Google Apps Script Web API.
          </p>
        </div>

        <button
          onClick={onTriggerSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sedang Sinkronisasi...' : 'Sinkronisasi Sekarang'}</span>
        </button>
      </div>

      {/* Sync Status KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Status Koneksi</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-lg font-bold text-emerald-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Live Connected
          </p>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {config.lastSyncTimestamp ? `Terakhir: ${config.lastSyncTimestamp}` : 'Baru saja disinkronkan'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Baris Budget Plan</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">
            {totalRecords.budget} Records
          </p>
          <p className="text-[11px] text-blue-500 mt-1 font-mono">Sheet: BUDGET_PLAN</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Baris Forecast</span>
            <Database className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">
            {totalRecords.forecast} Records
          </p>
          <p className="text-[11px] text-amber-500 mt-1 font-mono">Sheet: FORECAST</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Baris Realisasi</span>
            <Database className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">
            {totalRecords.realization} Records
          </p>
          <p className="text-[11px] text-emerald-500 mt-1 font-mono">Sheet: REALIZATION</p>
        </div>
      </div>

      {/* Two Column Layout: Configuration & GAS Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              Parameter Sinkronisasi Dua Arah
            </h3>
            {saveSuccess && (
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Tersimpan!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Google Spreadsheet ID</label>
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="Contoh: 1eC6V4mC9F9G_Ajinomoto_Budget_2026_Sheet"
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">Dapat ditemukan pada URL spreadsheet Anda antara /d/ dan /edit.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Google Apps Script Web App URL</label>
              <input
                type="url"
                value={gasUrl}
                onChange={(e) => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">Endpoint Web App berizin akses eksekutif (Execute as Me, Who has access: Anyone).</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="autoSyncCheck"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="autoSyncCheck" className="font-semibold text-slate-800 dark:text-white cursor-pointer">
                  Auto-Sync Otomatis
                </label>
              </div>

              <div>
                <select
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(Number(e.target.value))}
                  disabled={!autoSync}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium disabled:opacity-50"
                >
                  <option value={1}>Tiap 1 Menit (Realtime)</option>
                  <option value={5}>Tiap 5 Menit (Direkomendasikan)</option>
                  <option value={15}>Tiap 15 Menit</option>
                  <option value={60}>Tiap 1 Jam</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold shadow transition-colors"
            >
              Simpan Konfigurasi Sinkronisasi
            </button>
          </form>

          {config.lastLog && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-mono leading-relaxed">
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Audit Log Sinkronisasi Terakhir:
              </p>
              {config.lastLog}
            </div>
          )}
        </div>

        {/* Ready to Deploy GAS Script Snippet */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">GAS Connector Code (Siap Pakai)</h3>
              <p className="text-xs text-slate-400">Salin skrip ini ke Apps Script spreadsheet Anda</p>
            </div>
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? 'Tersalin!' : 'Salin Skrip'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl bg-[#090d16] border border-slate-800 p-4 font-mono text-[11px] text-slate-300 max-h-[360px] overflow-y-auto scrollbar-thin">
            <pre>{sampleGasScript}</pre>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
            💡 <b>Cara Pasang:</b> Di Spreadsheet Google, klik <i>Extensions &gt; Apps Script</i>, timpa dengan kode di atas, lalu klik <i>Deploy &gt; New deployment &gt; Web app</i>. Berikan akses &quot;Anyone&quot; dan salin URL Web App yang dihasilkan ke form di sebelah kiri.
          </div>
        </div>
      </div>
    </div>
  );
};

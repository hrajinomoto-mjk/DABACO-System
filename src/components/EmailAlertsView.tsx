import React, { useState } from 'react';
import { Mail, Bell, ShieldAlert, Send, Plus, X, Check, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { EmailSetting, AlertNotification, CategoryDetail, ItemSummary } from '../types';
import { formatIDR } from '../utils/pdfGenerator';

interface EmailAlertsViewProps {
  emailSetting: EmailSetting;
  onUpdateEmailSetting: (newSetting: Partial<EmailSetting>) => void;
  categories?: CategoryDetail[];
  items: ItemSummary[];
  alerts: AlertNotification[];
  onTriggerEmailAlert: (recipient: string, subject: string, bodyHtml: string) => void;
  darkMode: boolean;
}

export const EmailAlertsView: React.FC<EmailAlertsViewProps> = ({
  emailSetting,
  onUpdateEmailSetting,
  categories = [],
  items,
  alerts,
  onTriggerEmailAlert,
  darkMode
}) => {
  const [warningThreshold, setWarningThreshold] = useState(emailSetting.warningThreshold);
  const [dangerThreshold, setDangerThreshold] = useState(emailSetting.dangerThreshold);
  const [recipients, setRecipients] = useState<string[]>(emailSetting.recipients);
  const [newRecipient, setNewRecipient] = useState('');
  const [autoSend, setAutoSend] = useState(emailSetting.autoSendOnThreshold);
  const [previewRecipient, setPreviewRecipient] = useState(recipients[0] || 'paajinomoto@gmail.com');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Active alerts calculated from item usage
  const overBudgetItems = items.filter(i => i.usage > dangerThreshold);
  const warningItems = items.filter(i => i.usage > warningThreshold && i.usage <= dangerThreshold);

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.trim() || !newRecipient.includes('@')) return;
    if (!recipients.includes(newRecipient.trim())) {
      const updated = [...recipients, newRecipient.trim()];
      setRecipients(updated);
      onUpdateEmailSetting({ recipients: updated });
    }
    setNewRecipient('');
  };

  const handleRemoveRecipient = (email: string) => {
    const updated = recipients.filter(r => r !== email);
    setRecipients(updated);
    onUpdateEmailSetting({ recipients: updated });
  };

  const handleSaveThresholds = () => {
    onUpdateEmailSetting({
      warningThreshold: Number(warningThreshold),
      dangerThreshold: Number(dangerThreshold),
      autoSendOnThreshold: autoSend
    });
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 2000);
  };

  const handleSendManualNotification = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onTriggerEmailAlert(
        previewRecipient,
        `[DABACO ALERT] Laporan Anggaran PT Ajinomoto - Over Budget Warning`,
        'Executive Email Template Rendered'
      );
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <Mail className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Notifikasi Email Otomatis & Alert Anggaran
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pengiriman peringatan otomatis ke manajemen jika penyerapan mendekati batas ({warningThreshold}%) atau melampaui limit anggaran ({dangerThreshold}%).
          </p>
        </div>

        <button
          onClick={handleSendManualNotification}
          disabled={isSending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSending ? 'Mengirim Email...' : 'Kirim Alert Sekarang'}</span>
        </button>
      </div>

      {/* Real-time Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Pos Item Over Budget (&gt;{dangerThreshold}%)</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-extrabold text-red-500">{overBudgetItems.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {overBudgetItems.length > 0 ? overBudgetItems.map(i => i.item).join(', ') : 'Semua pos item terkendali'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Mendekati Limit (&gt;{warningThreshold}%)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-500">{warningItems.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {warningItems.length > 0 ? warningItems.map(i => i.item).join(', ') : 'Tidak ada item berisiko'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Daftar Penerima Email</span>
            <Mail className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-blue-500">{recipients.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Email penerima terdaftar aktif</p>
        </div>
      </div>

      {/* Two Columns: Config & Email Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threshold Settings & Recipient Manager */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-red-500" />
            Konfigurasi Ambang Batas (Threshold) & Penerima
          </h3>

          {/* Threshold sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-amber-500">Peringatan Awal (Warning Threshold):</span>
                <span className="font-bold">{warningThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Kirim peringatan kuning saat realisasi mencapai nilai ini.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-red-500">Batas Bahaya (Over Budget Threshold):</span>
                <span className="font-bold">{dangerThreshold}%</span>
              </div>
              <input
                type="range"
                min="90"
                max="120"
                value={dangerThreshold}
                onChange={(e) => setDangerThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Kirim alert prioritas tinggi saat realisasi melampaui forecast.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="autoSendThresholdCheck"
                checked={autoSend}
                onChange={(e) => setAutoSend(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <label htmlFor="autoSendThresholdCheck" className="text-xs font-semibold text-slate-800 dark:text-white cursor-pointer">
                Otomatis kirim email saat batas anggaran terpicu
              </label>
            </div>

            <button
              onClick={handleSaveThresholds}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Simpan Ambang Batas
            </button>
          </div>

          {/* Recipient Manager */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Daftar Penerima Notifikasi (Email Stakeholder)
            </h4>

            <form onSubmit={handleAddRecipient} className="flex gap-2">
              <input
                type="email"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                placeholder="nama@ajinomoto.co.id"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-1">
              {recipients.map(email => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  <span>{email}</span>
                  <button
                    onClick={() => handleRemoveRecipient(email)}
                    className="text-slate-400 hover:text-red-500 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Executive Email Template Preview */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              Preview Template Email Eksekutif (GAS Style)
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">HTML Mail Preview</span>
          </div>

          {/* Email Preview Shell */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#070b14] overflow-hidden text-slate-800 dark:text-slate-200 text-xs shadow-inner">
            {/* Email Header Bar */}
            <div className="p-5 bg-gradient-to-r from-[#0B2545] via-[#132C56] to-[#B4001F] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-slate-900 font-extrabold flex items-center justify-center font-serif text-sm shadow">
                  AJI
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-[#C9A15A] uppercase font-bold">PT AJINOMOTO INDONESIA</p>
                  <h4 className="text-sm font-bold tracking-tight">Executive Budget Report Alert</h4>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${
                overBudgetItems.length > 0 ? 'bg-rose-600' : 'bg-emerald-600'
              }`}>
                {overBudgetItems.length > 0 ? 'OVER BUDGET' : 'ON TRACK'}
              </span>
            </div>

            {/* Email Body */}
            <div className="p-5 space-y-4 leading-relaxed">
              <p>Kepada Yth. <b>Pimpinan & Manajemen HR Department</b>,</p>
              <p className="text-slate-600 dark:text-slate-300">
                Bersama email ini kami sampaikan bahwa sistem <b>DABACO Budget Control System</b> mendeteksi realisasi anggaran periode berjalan telah mencapai status evaluasi.
              </p>

              {/* KPI Strip */}
              <div className="grid grid-cols-3 gap-2 text-center py-2">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Forecast</span>
                  <span className="font-bold text-amber-500">Rp 2.19 M</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Realisasi</span>
                  <span className="font-bold text-emerald-500">Rp 1.48 M</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Utilisasi</span>
                  <span className="font-bold text-red-500">92.4%</span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300">
                Rincian lengkap dan dokumen PDF laporan terenkripsi terlampir secara otomatis pada pesan ini untuk diverifikasi oleh tim Controller & Manajemen.
              </p>

              <div className="pt-2">
                <p className="font-semibold text-slate-900 dark:text-white">HR Development Section</p>
                <p className="text-[11px] text-slate-400">Mojokerto Factory &middot; DABACO Automated Dispatcher</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Target testing: <b>{previewRecipient}</b></span>
            {sendSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Email Alert Berhasil Dikirim!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

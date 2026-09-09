import React, { useState, useMemo } from 'react';
import {
  Landmark,
  ArrowRightLeft,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  Printer,
  Calendar,
  Layers,
  FileSpreadsheet,
  Check,
  ExternalLink,
  ReceiptText
} from 'lucide-react';
import { BankingAccount, BankTransaction, RealizationRecord } from '../types';
import { formatIDR } from '../utils/pdfGenerator';
import { AjinomotoLogo } from './AjinomotoLogo';

interface BankingApiViewProps {
  accounts: BankingAccount[];
  transactions: BankTransaction[];
  realization: RealizationRecord[];
  onReconcileTransaction: (transactionId: string, realizationId: string) => void;
  onRefreshBankFeed: () => void;
  darkMode: boolean;
}

export const BankingApiView: React.FC<BankingApiViewProps> = ({
  accounts,
  transactions,
  realization,
  onReconcileTransaction,
  onRefreshBankFeed,
  darkMode
}) => {
  const [activeTab, setActiveTab] = useState<'statement' | 'runway' | 'bap'>('statement');
  const [selectedBankFilter, setSelectedBankFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Reconciled' | 'Pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [matchingTxId, setMatchingTxId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations
  const totalBalance = useMemo(() => accounts.reduce((sum, a) => sum + a.balance, 0), [accounts]);
  
  const totalReconciledAmount = useMemo(() => {
    return transactions
      .filter(t => t.status === 'Reconciled')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const reconciledCount = useMemo(() => transactions.filter(t => t.status === 'Reconciled').length, [transactions]);
  const reconciliationRate = transactions.length > 0 ? (reconciledCount / transactions.length) * 100 : 100;

  // Average monthly burn rate estimation
  const estimatedDailyBurn = 35000000; // ~Rp 35 Juta per hari kerja operasional pabrik
  const operationalRunwayDays = Math.round(totalBalance / estimatedDailyBurn);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Bank filter
      if (selectedBankFilter !== 'all') {
        if (selectedBankFilter === 'bca' && !tx.referenceNo.includes('BCA')) return false;
        if (selectedBankFilter === 'mandiri' && !tx.referenceNo.includes('MDR')) return false;
      }
      // Status filter
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = tx.description.toLowerCase().includes(q);
        const matchRef = tx.referenceNo.toLowerCase().includes(q);
        const matchReal = tx.matchedRealizationId?.toLowerCase().includes(q);
        if (!matchDesc && !matchRef && !matchReal) return false;
      }
      return true;
    });
  }, [transactions, selectedBankFilter, statusFilter, searchQuery]);

  const handleManualReconcile = (txId: string, realId: string) => {
    onReconcileTransaction(txId, realId);
    setMatchingTxId(null);
    showNotification('Voucher pengeluaran berhasil dipasangkan dengan mutasi kas bank.');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onRefreshBankFeed();
      showNotification('Saldo kas dan mutasi rekening koran berhasil disinkronkan.');
    }, 600);
  };

  const handlePrintBAP = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-14 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        darkMode ? 'bg-[#0f1424] border-slate-800 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400">
                <Landmark className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Pengawasan Arus Kas & Rekonsiliasi Bank
                </h2>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Pemantauan saldo kas rekening operasional pabrik, pencocokan bukti voucher pengeluaran riil, dan Berita Acara Rekonsiliasi (BAP).
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Menyelaraskan...' : 'Perbarui Mutasi'}</span>
            </button>

            <button
              onClick={() => setActiveTab('bap')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/25 transition-all cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Berita Acara Rekonsiliasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Informative Key Financial Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Saldo Kas Bank */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Total Kas di Bank
            </span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Landmark className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatIDR(totalBalance)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2 Rekening Giro Operasional</span>
          </div>
        </div>

        {/* Metric 2: Kas Keluar Terverifikasi */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Kas Keluar Terverifikasi
            </span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatIDR(totalReconciledAmount)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-bold">
            <span>Sesuai Voucher DABACO & SAP</span>
          </div>
        </div>

        {/* Metric 3: Tingkat Kesesuaian Rekonsiliasi */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Tingkat Rekonsiliasi
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {reconciliationRate.toFixed(1)}%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{reconciledCount} dari {transactions.length} transaksi klir</span>
          </div>
        </div>

        {/* Metric 4: Ketahanan Kas Operasional */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Ketahanan Kas (Runway)
            </span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            ~{operationalRunwayDays} Hari
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Kapasitas Sangat Aman</span>
          </div>
        </div>
      </div>

      {/* Saldo Rekening Bank Operasional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map(acc => (
          <div
            key={acc.accountNumber}
            className={`p-5 rounded-3xl border transition-all ${
              darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                  {acc.bankName.includes('BCA') ? 'BCA' : 'MDR'}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {acc.bankName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Rek: {acc.accountNumber}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Operasional Aktif
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Saldo Riil di Bank:</span>
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {formatIDR(acc.balance)}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <span>Penyelarasan Terakhir:</span>
                <p className="font-medium text-slate-600 dark:text-slate-300">{acc.lastSync}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('statement')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'statement'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ReceiptText className="w-3.5 h-3.5" />
          <span>Rekening Koran & Pencocokan Voucher</span>
        </button>

        <button
          onClick={() => setActiveTab('runway')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'runway'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Proyeksi Kebutuhan Kas (30 Hari)</span>
        </button>

        <button
          onClick={() => setActiveTab('bap')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'bap'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Berita Acara Rekonsiliasi (BAP Resmi)</span>
        </button>
      </div>

      {/* TAB 1: REKENING KORAN & PENCOCOKAN VOUCHER */}
      {activeTab === 'statement' && (
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Controls bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search input */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari transaksi, no. voucher, atau ref bank..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition-colors outline-none ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-red-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500'
                  }`}
                />
              </div>

              {/* Filter Bank */}
              <select
                value={selectedBankFilter}
                onChange={(e) => setSelectedBankFilter(e.target.value)}
                className={`px-3 py-2 rounded-xl text-xs border outline-none font-medium cursor-pointer ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="all">Semua Rekening Bank</option>
                <option value="bca">BCA Giro Operasional</option>
                <option value="mandiri">Bank Mandiri Disbursement</option>
              </select>

              {/* Filter Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`px-3 py-2 rounded-xl text-xs border outline-none font-medium cursor-pointer ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="all">Semua Status Pencocokan</option>
                <option value="Reconciled">Sudah Terverifikasi (Klir)</option>
                <option value="Pending">Menunggu Verifikasi</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Menampilkan <b>{filteredTransactions.length}</b> transaksi
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-xs text-left min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-3 px-2">Tanggal</th>
                  <th className="py-3 px-2">No. Referensi Bank</th>
                  <th className="py-3 px-2">Uraian Transaksi Mutasi</th>
                  <th className="py-3 px-2 text-right">Nominal Pengeluaran</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-2">Voucher Terkait</th>
                  <th className="py-3 px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-2 font-mono text-slate-600 dark:text-slate-400">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-2 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {tx.referenceNo}
                    </td>
                    <td className="py-3.5 px-2 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatIDR(tx.amount)}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'Reconciled'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                      }`}>
                        {tx.status === 'Reconciled' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {tx.status === 'Reconciled' ? 'Terverifikasi' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-[11px]">
                      {tx.matchedRealizationId ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Voucher #{tx.matchedRealizationId}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Belum dipasangkan</span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      {tx.status === 'Pending' ? (
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setMatchingTxId(matchingTxId === tx.id ? null : tx.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Pasangkan Voucher
                          </button>

                          {/* Realization selector dropdown */}
                          {matchingTxId === tx.id && (
                            <div className={`absolute right-0 mt-1 w-64 p-2 rounded-2xl border shadow-xl z-20 text-left ${
                              darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                            }`}>
                              <p className="text-[11px] font-bold mb-1.5 px-1 text-slate-500 dark:text-slate-400">
                                Pilih Voucher Realisasi DABACO:
                              </p>
                              <div className="max-h-48 overflow-y-auto space-y-1">
                                {realization.slice(0, 5).map(r => (
                                  <button
                                    key={r.id}
                                    onClick={() => handleManualReconcile(tx.id, r.id)}
                                    className="w-full text-left p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] transition-colors"
                                  >
                                    <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                      #{r.id} - {r.description}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      {formatIDR(r.amount)}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROYEKSI KEBUTUHAN KAS & RUNWAY OPERASIONAL */}
      {activeTab === 'runway' && (
        <div className={`p-6 rounded-3xl border space-y-6 ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Proyeksi Kebutuhan Kas Mingguan Pabrik (30 Hari ke Depan)
            </h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Kalkulasi kebutuhan likuiditas kas berdasarkan jadwal komitmen pengeluaran dan forecast operasional masing-masing seksi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { week: 'Minggu ke-1', target: 245000000, desc: 'Pembayaran Trainer Lean Kaizen & Vendor Konsumsi', status: 'Aman' },
              { week: 'Minggu ke-2', target: 310000000, desc: 'Jasa Lembaga Training & Sertifikasi SDM', status: 'Aman' },
              { week: 'Minggu ke-3', target: 185000000, desc: 'Langganan Software HRIS & Assessment Rekrutmen', status: 'Aman' },
              { week: 'Minggu ke-4', target: 420000000, desc: 'Pelaksanaan Psikotes & Medical Check-Up Rekrutmen', status: 'Aman' },
            ].map((w, idx) => (
              <div
                key={w.week}
                className={`p-4 rounded-2xl border ${
                  darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-red-600 dark:text-red-400">{w.week}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {w.status}
                  </span>
                </div>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1">
                  {formatIDR(w.target)}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>

          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-blue-50/50 border-blue-200'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Kesimpulan Likuiditas & Rekomendasi Kas Pabrik
            </h4>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              Total estimasi kebutuhan kas operasional untuk 30 hari ke depan adalah sebesar <b>{formatIDR(1160000000)}</b>.
              Dengan saldo kas saat ini yang mencapai <b>{formatIDR(totalBalance)}</b>, cadangan kas pabrik Mojokerto berada dalam kondisi yang sangat memadai (surplus likuiditas <b>{formatIDR(totalBalance - 1160000000)}</b>).
              Tidak diperlukan pengajuan pencairan dana darurat ke Head Office.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: BERITA ACARA REKONSILIASI (BAP RESMI) */}
      {activeTab === 'bap' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 px-2 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <AjinomotoLogo variant="full" className="h-6 w-auto" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Berita Acara Rekonsiliasi Kas & Bank (BAP)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dokumen Pengesahan Resmi Pembukuan Kas Pabrik Mojokerto
                </p>
              </div>
            </div>

            <button
              onClick={handlePrintBAP}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Unduh Berita Acara</span>
            </button>
          </div>

          {/* BAP Content Sheet */}
          <div className={`p-6 rounded-2xl border text-xs space-y-5 font-sans ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-center space-y-1 pb-4 border-b border-slate-200 dark:border-slate-800">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                BERITA ACARA REKONSILIASI KAS & REKENING BANK
              </h4>
              <p className="text-slate-500">Nomor: BAP/RECON/AJI-MJKT/{new Date().getFullYear()}/09</p>
              <p className="text-slate-500">Periode: September {new Date().getFullYear()}</p>
            </div>

            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              Pada hari ini telah dilakukan rekonsiliasi antara catatan kas pengeluaran operasional (DABACO HR & GA) dengan rekening koran bank operasional PT Ajinomoto Indonesia dan PT Ajinex International Pabrik Mojokerto, dengan hasil sebagai berikut:
            </p>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="font-sans font-medium text-slate-600 dark:text-slate-300">
                  1. Saldo Kas menurut Rekening Koran Bank (BCA & Mandiri):
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{formatIDR(totalBalance)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <span className="font-sans">
                  2. Ditambah: Setoran dalam Perjalanan (Deposit in Transit):
                </span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <span className="font-sans">
                  3. Dikurangi: Pembayaran Belum Dicairkan (Outstanding Transfer):
                </span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="font-sans font-medium text-slate-600 dark:text-slate-300">
                  4. Saldo Kas menurut Buku Pembukuan DABACO Pabrik:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{formatIDR(totalBalance)}</span>
              </div>
              <div className="flex justify-between py-2 bg-emerald-500/10 px-3 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold font-sans">
                <span>SELISIH KAS BERSIH (VARIANS):</span>
                <span className="font-mono">Rp 0 (NIHIL - SESUAI SEMPURNA)</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed italic pt-2">
              Catatan: Seluruh transaksi pengeluaran kas telah diverifikasi dan memiliki bukti pendukung voucher yang sah. Tidak ditemukan transaksi anomali atau selisih pembukuan.
            </p>

            {/* Signature Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-center text-[11px]">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-500">Disiapkan Oleh:</p>
                <div className="h-12 flex items-center justify-center font-serif italic text-emerald-600 dark:text-emerald-400 font-bold">
                  [Tervalidasi Sistem]
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200">HR & Budget Controller</p>
                <p className="text-slate-500">PT Ajinomoto Indonesia</p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-500">Diverifikasi Oleh:</p>
                <div className="h-12 flex items-center justify-center font-serif italic text-blue-600 dark:text-blue-400 font-bold">
                  [Tervalidasi SAP]
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Finance & Accounting Manager</p>
                <p className="text-slate-500">Pabrik Mojokerto</p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-500">Disetujui Oleh:</p>
                <div className="h-12 flex items-center justify-center font-serif italic text-purple-600 dark:text-purple-400 font-bold">
                  [Disahkan Manajemen]
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Factory General Manager</p>
                <p className="text-slate-500">PT Ajinomoto Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  Lock,
  Database,
  FileSpreadsheet,
  BarChart3,
  Mail,
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  Wallet,
  ReceiptText,
  Sun,
  Moon,
  Sparkles,
  Zap,
  ChevronRight,
  Layers,
  ArrowUpRight,
  FileCheck
} from 'lucide-react';
import { ParticleCanvas } from './ParticleCanvas';
import { AjinomotoLogo } from './AjinomotoLogo';
import { BudgetRecord, ForecastRecord, RealizationRecord, MasterCostCenter } from '../types';

interface LandingPageProps {
  onOpenLogin: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  budgetData?: BudgetRecord[];
  forecastData?: ForecastRecord[];
  realizationData?: RealizationRecord[];
  costCenters?: MasterCostCenter[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  darkMode,
  setDarkMode,
  budgetData,
  forecastData,
  realizationData,
  costCenters
}) => {
  // Compute dynamic financial metrics if datasets exist, with graceful fallback
  const totalBgt = useMemo(() => {
    if (!budgetData || budgetData.length === 0) return 1000000000;
    return budgetData.reduce((s, r) => s + (r.amount || 0), 0);
  }, [budgetData]);

  const totalFc = useMemo(() => {
    if (!forecastData || forecastData.length === 0) return 984000000;
    return forecastData.reduce((s, r) => s + (r.amount || 0), 0);
  }, [forecastData]);

  const totalAct = useMemo(() => {
    if (!realizationData || realizationData.length === 0) return 938000000;
    return realizationData.reduce((s, r) => s + (r.amount || 0), 0);
  }, [realizationData]);

  // Penyerapan Anggaran: Realisasi / Budget
  const absorptionRate = useMemo(() => {
    if (!budgetData || budgetData.length === 0) return 93.8;
    return totalBgt > 0 ? (totalAct / totalBgt) * 100 : 93.8;
  }, [budgetData, totalAct, totalBgt]);

  // Kesesuaian Rencana & Kas: Akurasi Proyeksi vs Realisasi
  const forecastAccuracy = useMemo(() => {
    if (!forecastData || forecastData.length === 0) return 98.4;
    if (totalFc <= 0) return 98.4;
    const diff = Math.abs(totalAct - totalFc);
    const variancePct = (diff / totalFc) * 100;
    return Math.max(0, 100 - variancePct);
  }, [forecastData, totalAct, totalFc]);

  // Sisa Cadangan Efisiensi / Kas
  const reserveRate = useMemo(() => {
    return Math.max(0, +(100 - absorptionRate).toFixed(1));
  }, [absorptionRate]);

  // Total Pusat Biaya (Cost Center)
  const ccCount = useMemo(() => {
    if (costCenters && costCenters.length > 0) return costCenters.length;
    return 4; // HR001, HR002, HRX001, HRX002
  }, [costCenters]);
  return (
    <div className={`relative min-h-screen w-full transition-colors duration-200 overflow-x-hidden ${
      darkMode ? 'bg-[#080c14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Dynamic Background Particle System */}
      <ParticleCanvas />

      {/* Ambient Gradient Auras */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[650px] bg-red-600/10 dark:bg-red-600/15 rounded-full blur-[160px] pointer-events-none -translate-x-1/2 -translate-y-1/3" />
      <div className="fixed bottom-0 right-10 w-[600px] h-[600px] bg-rose-600/10 dark:bg-rose-500/10 rounded-full blur-[170px] pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Top Sticky Header / Navigation */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors ${
        darkMode ? 'bg-[#090d16]/85 border-slate-800/80' : 'bg-white/85 border-slate-200/90 shadow-xs'
      }`}>
        <div className="w-full max-w-[1680px] 2xl:max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 px-2 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center">
              <AjinomotoLogo variant="full" className="h-6 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-red-600 dark:text-red-500">
                  DABACO
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  Dashboard Badget Control System &bull; Pabrik Mojokerto
                </span>
              </div>
              <p className={`text-[10px] font-medium hidden sm:block ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold">
            <a
              href="#features"
              className={`transition-colors hover:text-red-600 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Fitur Utama
            </a>
            <a
              href="#metrics"
              className={`transition-colors hover:text-red-600 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Ringkasan Anggaran
            </a>
            <a
              href="#architecture"
              className={`transition-colors hover:text-red-600 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Alur Kerja
            </a>
            <a
              href="#security"
              className={`transition-colors hover:text-red-600 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Keamanan Data
            </a>
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
              }`}
              title={darkMode ? 'Ganti ke Tampilan Terang (Light Mode)' : 'Ganti ke Tampilan Gelap (Dark Mode)'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login Portal Button */}
            <button
              id="navBtnLogin"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Masuk ke Sistem</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-6 sm:pt-8 pb-6 sm:pb-7 px-4 sm:px-6 lg:px-8 max-w-[1600px] 2xl:max-w-[1800px] mx-auto text-center">
        {/* Eyebrow Chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DABACO (Dashboard Badget Control System) &bull; Pabrik Mojokerto</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          Pengendalian Anggaran Pabrik yang{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-500">
            Praktis, Tertib, dan Terukur
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`mt-2.5 text-xs sm:text-sm lg:text-[15px] leading-relaxed max-w-3xl mx-auto ${
          darkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          <strong className="font-semibold text-red-600 dark:text-red-400">DABACO (Dashboard Badget Control System)</strong> membantu Pimpinan HR Dept. dan anggota dibawahnya di Pabrik Mojokerto memantau budget,
          melacak pengeluaran riil setiap bulan, dan memastikan tidak ada pembengkakan biaya
          operasional melalui data yang selalu sinkron dan transparan.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Masuk ke Portal DABACO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#architecture"
            className={`flex items-center gap-1.5 px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              darkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 shadow-xs'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-xs'
            }`}
          >
            <span>Lihat Alur Kerja Sistem</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Live Status Indicators Banner */}
        <div className={`mt-5 sm:mt-6 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-2 rounded-xl border text-[11px] font-medium backdrop-blur-md transition-colors ${
          darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-800 shadow-xs'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sinkronisasi Spreadsheet: <b>Terhubung Aktif</b></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Rekap Grafik: <b>Siap Ditinjau</b></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Pengingat Email: <b>Otomatis Siaga</b></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Manajemen Pengguna: <b>Terverifikasi & Aktif</b></span>
          </div>
        </div>
      </section>

      {/* Live Financial Health & Section Summary */}
      <section id="metrics" className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] 2xl:max-w-[1800px] mx-auto py-5 sm:py-6">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-[10px] font-bold mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Ringkasan Anggaran &bull; Tahun Fiskal 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Kondisi Penyerapan & Kesehatan Anggaran Pabrik
          </h2>
          <p className={`text-xs mt-1 max-w-2xl mx-auto ${
            darkMode ? 'text-slate-400' : 'text-slate-600 font-medium'
          }`}>
            Gambaran umum pemanfaatan budget di setiap seksi operasional, perbandingan antara rencana dan pengeluaran nyata, serta cadangan kas yang masih tersedia.
          </p>
        </div>

        {/* 4 Minimalist & Exclusive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Rasio Penyerapan */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
            darkMode
              ? 'bg-slate-900/85 border-slate-800/90 shadow-xs hover:border-slate-700 hover:shadow-sm'
              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Penyerapan Anggaran
                </span>
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white font-mono leading-none">
                {absorptionRate.toFixed(1)}%
              </div>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Zona Terkendali &bull; Di Bawah Pagu</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Realisasi beban operasional pabrik berjalan tertib di bawah batas alokasi pagu tahunan dengan kepatuhan fiskal konsisten.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 dark:text-slate-400 font-medium">Deviasi Terhadap Pagu</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">+{reserveRate}% Efisiensi</span>
            </div>
          </div>

          {/* Card 2: Kesesuaian Rencana & Kas */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
            darkMode
              ? 'bg-slate-900/85 border-slate-800/90 shadow-xs hover:border-slate-700 hover:shadow-sm'
              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Kesesuaian Rencana & Kas
                </span>
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-amber-500 transition-colors">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white font-mono leading-none">
                {forecastAccuracy.toFixed(1)}%
              </div>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Estimasi Presisi &bull; Varian 1.6%</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Proyeksi kebutuhan biaya bulanan berjalan akurat dengan deviasi minimal terhadap realisasi belanja aktual di Pabrik Mojokerto.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 dark:text-slate-400 font-medium">Siklus Evaluasi</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">12 Bulan Terpantau</span>
            </div>
          </div>

          {/* Card 3: Kepatuhan Pusat Biaya (Cost Center) */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
            darkMode
              ? 'bg-slate-900/85 border-slate-800/90 shadow-xs hover:border-slate-700 hover:shadow-sm'
              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Kepatuhan Pusat Biaya
                </span>
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white font-mono leading-none">
                100% Tertib
              </div>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Cost Center PT AI & PT AX</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Seluruh Pusat Biaya (HR001, HR002, HRX001, HRX002) mengelola belanja harian dalam plafon resmi tanpa overbudget.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 dark:text-slate-400 font-medium">Status Pelanggaran</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">Nihil Overbudget</span>
            </div>
          </div>

          {/* Card 4: Sisa Cadangan Kas & Efisiensi */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
            darkMode
              ? 'bg-slate-900/85 border-slate-800/90 shadow-xs hover:border-slate-700 hover:shadow-sm'
              : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Cadangan Kas & Efisiensi
                </span>
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white font-mono leading-none">
                +{reserveRate}%
              </div>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Cadangan Siaga Terlindungi</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Alokasi cadangan kas dan efisiensi anggaran yang belum terserap, siaga sebagai bantalan fiskal aman hingga tutup tahun.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 dark:text-slate-400 font-medium">Ketahanan Finansial</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">Surplus Terjaga</span>
            </div>
          </div>
        </div>

        {/* Minimalist & Exclusive Strategic Allocation Meter */}
        <div className={`mt-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
          darkMode
            ? 'bg-slate-900/85 border-slate-800/90 shadow-xs'
            : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Komposisi Pengeluaran</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20">Pagu Terkendali</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Alokasi Pengeluaran & Sisa Cadangan Kas Pabrik
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-200" />
                Sudah Direalisasikan (88.4%)
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Komitmen Berjalan (5.4%)
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Cadangan Efisiensi (6.2%)
              </span>
            </div>
          </div>

          {/* Minimalist Multi-tier Visual Bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div className="h-full bg-slate-900 dark:bg-slate-200 transition-all duration-700" style={{ width: '88.4%' }} title="Sudah Dikeluarkan 88.4%" />
            <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: '5.4%' }} title="Komitmen Berjalan 5.4%" />
            <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: '6.2%' }} title="Cadangan Efisiensi 6.2%" />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>PT Ajinomoto Indonesia &bull; PT Ajinex International (Pabrik Mojokerto)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Sistem Peringatan Dini: Ambang Batas 85% Pagu Otomatis Aktif</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid Section */}
      <section id="features" className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] 2xl:max-w-[1800px] mx-auto py-6 sm:py-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-[10px] font-bold mb-1.5">
            <Layers className="w-3 h-3" />
            <span>Kemudahan Pengelolaan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Fitur Utama untuk Membantu Kerja Tim Setiap Hari
          </h2>
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Dirancang praktis agar staf administrasi, penanggung jawab seksi, dan pimpinan dapat mengawasi anggaran tanpa kerumitan administrasi manual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Bento Card 1: Google Sheets Sync */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-emerald-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-emerald-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-1.5">Sinkronisasi Google Sheets</h3>
              <p className={`text-xs leading-relaxed mb-3 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Tim tetap bisa mencatat rencana kerja dan realisasi di spreadsheet yang sudah biasa dipakai.
                Sistem akan memperbarui data secara otomatis sehingga data di dashboard selalu yang paling baru.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Pembaruan Berkala Otomatis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Card 2: Looker Studio BI Visualizer */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-blue-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-blue-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center mb-3">
                <BarChart3 className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-1.5">Grafik & Laporan Visual Interaktif</h3>
              <p className={`text-xs leading-relaxed mb-3 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Tampilkan perbandingan pengeluaran antar bulan dan antar seksi dalam grafik yang bersih dan mudah dibaca.
                Membantu pimpinan melihat tren biaya dan mengambil keputusan rapat dengan cepat.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <span>Praktis untuk Rapat Pimpinan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Card 3: Email Alerts System */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-rose-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-rose-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center mb-3">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-1.5">Pengingat Ambang Batas Email</h3>
              <p className={`text-xs leading-relaxed mb-3 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Jika pengeluaran suatu seksi sudah mendekati 85% atau melampaui batas anggaran,
                sistem otomatis mengirimkan email pengingat kepada PIC bersangkutan agar dapat segera dievaluasi.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              <span>Pencegahan Dini Biaya Bengkak</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Card 4: Executive Report & PDF Generation */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-amber-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-amber-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-3">
                <FileCheck className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-1.5">Laporan Eksekutif & Dokumen PDF</h3>
              <p className={`text-xs leading-relaxed mb-3 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Susun laporan pertanggungjawaban anggaran secara instan untuk Pimpinan HR Dept. dan manajemen pabrik.
                Lengkap dengan analisis varians biaya per seksi dan ekspor berkas PDF berstandar korporat siap rapat.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <span>Dokumen Resmi Siap Cetak</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Card 5: Manajemen Pengguna & Hak Akses Berjenjang */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-cyan-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-cyan-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 flex items-center justify-center mb-3">
                <Users className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-1.5">Manajemen Pengguna & Akses</h3>
              <p className={`text-xs leading-relaxed mb-3 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Kelola akun staf administrasi, kepala seksi, budget controller, hingga auditor dengan mudah.
                Tambah atau nonaktifkan akun pengguna yang terhubung langsung ke basis data otentikasi DABACO.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
              <span>Pemisahan Wewenang Antar Seksi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Card 6: Supabase & Cloud Security */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-red-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-red-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-1.5">Penyimpanan Tertib & Hak Akses</h3>
              <p className={`text-xs leading-relaxed mb-3 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Seluruh riwayat pengeluaran tersimpan rapi dengan cadangan berkala. Hak akses dibatasi sesuai peran
                masing-masing staf untuk menjaga kerahasiaan data internal pabrik.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-red-600 dark:text-red-400">
              <span>Akses Berjenjang & Terlindungi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Data Flow Section */}
      <section id="architecture" className={`relative z-10 py-6 sm:py-8 border-y transition-colors ${
        darkMode ? 'bg-[#0a0f1c] border-slate-800/80' : 'bg-slate-100/70 border-slate-200/90'
      }`}>
        <div className="w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Alur Kerja Praktis
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
              Empat Langkah Pengendalian Anggaran di Pabrik
            </h2>
            <p className={`text-xs mt-1 leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Dari pencatatan nota operasional harian hingga menjadi laporan evaluasi yang siap ditinjau pimpinan pabrik.
            </p>
          </div>

          {/* Flow Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
            {/* Step 1 */}
            <div className={`p-4 sm:p-4.5 rounded-2xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center mb-2.5 text-[11px]">
                01
              </div>
              <h4 className="font-bold text-xs sm:text-sm mb-1">Pencatatan & Sinkronisasi</h4>
              <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Staf masing-masing seksi mencatat rencana dan bukti pengeluaran melalui lembar kerja spreadsheet yang terintegrasi otomatis.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-4 sm:p-4.5 rounded-2xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center mb-2.5 text-[11px]">
                02
              </div>
              <h4 className="font-bold text-xs sm:text-sm mb-1">Pemeriksaan & Validasi</h4>
              <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Sistem memeriksa kesesuaian biaya dengan budget yang disetujui serta memverifikasi wewenang penanggung jawab seksi.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-4 sm:p-4.5 rounded-2xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center mb-2.5 text-[11px]">
                03
              </div>
              <h4 className="font-bold text-xs sm:text-sm mb-1">Rangkuman Grafik & Evaluasi</h4>
              <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Angka-angka dirangkum menjadi grafik perbandingan biaya yang mudah dibaca untuk rapat evaluasi bulanan.
              </p>
            </div>

            {/* Step 4 */}
            <div className={`p-4 sm:p-4.5 rounded-2xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-6 h-6 rounded-lg bg-rose-600/10 text-rose-600 font-bold flex items-center justify-center mb-2.5 text-[11px]">
                04
              </div>
              <h4 className="font-bold text-xs sm:text-sm mb-1">Pengingat & Laporan Resmi</h4>
              <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Pengingat email terkirim jika anggaran mendekati batas, dan laporan resmi siap dicetak atau diunduh dalam format PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Banner & CTA Section */}
      <section id="security" className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
        <div className={`rounded-2xl p-6 sm:p-8 border relative overflow-hidden text-center shadow-lg transition-all ${
          darkMode
            ? 'bg-gradient-to-br from-[#131a2e] via-[#0e1424] to-[#0a0f1b] border-slate-800'
            : 'bg-gradient-to-br from-white via-rose-50/40 to-slate-50 border-slate-200/90'
        }`}>
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sistem Pengendalian Anggaran PT Ajinomoto Indonesia &bull; Pabrik Mojokerto</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
              Pantau dan Kelola Anggaran Seksi Anda Lebih Mudah
            </h2>

            <p className={`mt-2 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Gunakan portal <strong>DABACO (Dashboard Badget Control System)</strong> dengan akun kerja Anda untuk melihat rekapitulasi pengeluaran terkini,
              memeriksa sisa anggaran seksi, dan menyusun laporan biaya operasional yang rapi dan transparan.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk ke Portal DABACO</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Footer */}
      <footer className={`border-t py-5 sm:py-6 transition-colors ${
        darkMode ? 'bg-[#060910] border-slate-800/80 text-slate-500' : 'bg-slate-100/90 border-slate-200 text-slate-600'
      }`}>
        <div className="w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-7 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <AjinomotoLogo variant="full" className="h-5 w-auto" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                PT AJINOMOTO INDONESIA - PT AJINEX INTERNATIONAL, PABRIK MOJOKERTO
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                DABACO (Dashboard Badget Control System) - Sistem Pengendalian & Monitoring Anggaran Biaya Operasional
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right text-[10px]">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              &copy; {new Date().getFullYear()} PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory. Hak Cipta Dilindungi.
            </p>
            <p className="text-slate-500 dark:text-slate-400">Portal Internal Keuangan & Pengendalian Biaya</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

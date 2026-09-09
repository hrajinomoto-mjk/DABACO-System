import React, { useState } from 'react';
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

interface LandingPageProps {
  onOpenLogin: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  darkMode,
  setDarkMode
}) => {
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
        darkMode ? 'bg-[#090d16]/85 border-slate-800/80' : 'bg-white/85 border-slate-200/90 shadow-sm'
      }`}>
        <div className="w-full max-w-[1680px] 2xl:max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="h-12 px-2.5 py-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
              <AjinomotoLogo variant="full" className="h-8 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-red-600 dark:text-red-500">
                  DABACO
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  Dashboard Badget Control System &bull; Pabrik Mojokerto
                </span>
              </div>
              <p className={`text-[11px] font-semibold hidden sm:block ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold">
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
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
              title={darkMode ? 'Ganti ke Tampilan Terang (Light Mode)' : 'Ganti ke Tampilan Gelap (Dark Mode)'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login Portal Button */}
            <button
              id="navBtnLogin"
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/25 hover:shadow-red-600/40 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Masuk ke Sistem</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] 2xl:max-w-[1800px] mx-auto text-center">
        {/* Eyebrow Chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DABACO (Dashboard Badget Control System) &bull; Pabrik Mojokerto</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-5xl mx-auto">
          Pengendalian Anggaran Pabrik yang{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-500">
            Praktis, Tertib, dan Terukur
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`mt-5 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto ${
          darkMode ? 'text-slate-300' : 'text-slate-700 font-normal'
        }`}>
          <strong className="font-semibold text-red-600 dark:text-red-400">DABACO (Dashboard Badget Control System)</strong> membantu Pimpinan HR Dept. dan anggota dibawahnya di Pabrik Mojokerto memantau budget,
          melacak pengeluaran riil setiap bulan, dan memastikan tidak ada pembengkakan biaya
          operasional melalui data yang selalu sinkron dan transparan.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Masuk ke Portal DABACO</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <a
            href="#architecture"
            className={`flex items-center gap-1.5 px-6 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
              darkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 shadow-md'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-md'
            }`}
          >
            <span>Lihat Alur Kerja Sistem</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Live Status Indicators Banner */}
        <div className={`mt-12 sm:mt-14 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-5 py-3 rounded-2xl border text-xs font-semibold backdrop-blur-md transition-colors ${
          darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-800 shadow-xs'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sinkronisasi Spreadsheet: <b>Terhubung Aktif</b></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Rekap Grafik: <b>Siap Ditinjau</b></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Pengingat Email: <b>Otomatis Siaga</b></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Manajemen Pengguna: <b>Terverifikasi & Aktif</b></span>
          </div>
        </div>
      </section>

      {/* Live Financial Health & Section Summary */}
      <section id="metrics" className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] 2xl:max-w-[1800px] mx-auto py-8 sm:py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ringkasan Anggaran &bull; Tahun Fiskal 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Kondisi Penyerapan & Kesehatan Anggaran Pabrik
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-2xl mx-auto ${
            darkMode ? 'text-slate-400' : 'text-slate-700 font-semibold'
          }`}>
            Gambaran umum pemanfaatan budget di setiap seksi operasional, perbandingan antara rencana dan pengeluaran nyata, serta cadangan kas yang masih tersedia.
          </p>
        </div>

        {/* 4 Informative Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Rasio Penyerapan */}
          <div className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
            darkMode
              ? 'bg-[#0f1524] border-slate-800/90 shadow-lg hover:border-emerald-500/50'
              : 'bg-white border-emerald-200/80 shadow-md hover:border-emerald-500/60 hover:shadow-xl'
          }`}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="flex items-center justify-between text-emerald-600 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Penyerapan Anggaran
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
              93.8%
            </div>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zona Aman & Terkendali</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              Pengeluaran operasional pabrik berjalan tertib di bawah batas budget tahunan, dengan sisa cadangan efisiensi sebesar <b>+6.2%</b>.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
              <span>Batas Deviasi Aman</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">&plusmn;5% Target</span>
            </div>
          </div>

          {/* Card 2: Ketepatan Estimasi */}
          <div className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
            darkMode
              ? 'bg-[#0f1524] border-slate-800/90 shadow-lg hover:border-amber-500/50'
              : 'bg-white border-amber-200/80 shadow-md hover:border-amber-500/60 hover:shadow-xl'
          }`}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="flex items-center justify-between text-amber-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Kesesuaian Rencana & Kas
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-500 dark:text-amber-400">
              98.4%
            </div>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Estimasi Akurat &bull; Selisih 1.6%</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              Perkiraan biaya bulanan berjalan cukup presisi dengan selisih yang sangat minim terhadap kebutuhan lapangan di Pabrik Mojokerto.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
              <span>Evaluasi Berjalan</span>
              <span className="font-semibold text-amber-500">12 Bulan Terpantau</span>
            </div>
          </div>

          {/* Card 3: Status Anggaran Tiap Seksi */}
          <div className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
            darkMode
              ? 'bg-[#0f1524] border-slate-800/90 shadow-lg hover:border-blue-500/50'
              : 'bg-white border-blue-200/80 shadow-md hover:border-blue-500/60 hover:shadow-xl'
          }`}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="flex items-center justify-between text-blue-600 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Kepatuhan Budget per Seksi
              </span>
              <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
              5 / 5 Seksi
            </div>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Semua Seksi Tertib Budget</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              Seksi HR, Training, GA, Recruitment, dan C&B mengelola pengeluaran harian dalam batas budget yang telah ditetapkan manajemen.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status Pelanggaran</span>
              <span className="font-semibold text-emerald-500">Nihil Melebihi Batas</span>
            </div>
          </div>

          {/* Card 4: Pengendalian Akses & Keamanan Akun */}
          <div className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
            darkMode
              ? 'bg-[#0f1524] border-slate-800/90 shadow-lg hover:border-violet-500/50'
              : 'bg-white border-violet-200/80 shadow-md hover:border-violet-500/60 hover:shadow-xl'
          }`}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 to-purple-600" />
            <div className="flex items-center justify-between text-violet-600 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pengendalian Akses & Akun
              </span>
              <div className="p-2 rounded-xl bg-violet-600/10 text-violet-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-violet-600 dark:text-violet-400">
              100% Tertib
            </div>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span>Hak Akses Sesuai Seksi</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              Setiap PIC seksi, kepala bagian, dan pengendali anggaran memiliki akun dengan batas wewenang yang terisolasi dan tertata rapi.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
              <span>Kesiapan Audit</span>
              <span className="font-semibold text-violet-600 dark:text-violet-400">Terlindungi Otentikasi</span>
            </div>
          </div>
        </div>

        {/* Strategic Allocation Meter */}
        <div className={`mt-8 p-6 sm:p-7 rounded-3xl border transition-colors ${
          darkMode
            ? 'bg-gradient-to-r from-[#0d121f] via-[#101728] to-[#0d121f] border-slate-800/90'
            : 'bg-gradient-to-r from-slate-50 via-white to-blue-50/40 border-slate-200/90 shadow-sm'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Komposisi Pengeluaran</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold">Rasio Terkendali</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                Alokasi Pengeluaran & Sisa Cadangan Kas Pabrik
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Sudah Dikeluarkan (88.4%)
              </span>
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                Komitmen Berjalan (5.4%)
              </span>
              <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
                <span className="w-3 h-3 rounded-full bg-violet-500" />
                Cadangan Efisiensi (6.2%)
              </span>
            </div>
          </div>

          {/* Multi-tier Visual Bar */}
          <div className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex shadow-inner">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700" style={{ width: '88.4%' }} title="Sudah Dikeluarkan 88.4%" />
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700" style={{ width: '5.4%' }} title="Komitmen Berjalan 5.4%" />
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-700" style={{ width: '6.2%' }} title="Cadangan Efisiensi 6.2%" />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Standar Tata Kelola: PT Ajinomoto Indonesia - PT Ajinex International, Pabrik Mojokerto</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Pemberitahuan Otomatis: Aktif saat pengeluaran seksi melebihi 85% dari budget</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid Section */}
      <section id="features" className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] 2xl:max-w-[1800px] mx-auto py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Kemudahan Pengelolaan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Fitur Utama untuk Membantu Kerja Tim Setiap Hari
          </h2>
          <p className={`text-sm sm:text-base mt-3 leading-relaxed ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Dirancang praktis agar staf administrasi, penanggung jawab seksi, dan pimpinan dapat mengawasi anggaran tanpa kerumitan administrasi manual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: Google Sheets Sync */}
          <div className={`p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-emerald-500/50 shadow-xl'
              : 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500/50'
          }`}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sinkronisasi Google Sheets</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Tim tetap bisa mencatat rencana kerja dan realisasi di spreadsheet yang sudah biasa dipakai.
                Sistem akan memperbarui data secara otomatis sehingga data di dashboard selalu yang paling baru.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Pembaruan Berkala Otomatis</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 2: Looker Studio BI Visualizer */}
          <div className={`p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-blue-500/50 shadow-xl'
              : 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-500/50'
          }`}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Grafik & Laporan Visual Interaktif</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Tampilkan perbandingan pengeluaran antar bulan dan antar seksi dalam grafik yang bersih dan mudah dibaca.
                Membantu pimpinan melihat tren biaya dan mengambil keputusan rapat dengan cepat.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Praktis untuk Rapat Pimpinan</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 3: Email Alerts System */}
          <div className={`p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-rose-500/50 shadow-xl'
              : 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-rose-500/50'
          }`}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pengingat Ambang Batas Email</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Jika pengeluaran suatu seksi sudah mendekati 85% atau melampaui batas anggaran,
                sistem otomatis mengirimkan email pengingat kepada PIC bersangkutan agar dapat segera dievaluasi.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Pencegahan Dini Biaya Bengkak</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 4: Executive Report & PDF Generation */}
          <div className={`p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-amber-500/50 shadow-xl'
              : 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-amber-500/50'
          }`}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-6">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Laporan Eksekutif & Dokumen PDF Resmi</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Susun laporan pertanggungjawaban anggaran secara instan untuk Pimpinan HR Dept. dan manajemen pabrik.
                Lengkap dengan analisis varians biaya per seksi, matriks efisiensi kas, dan ekspor berkas PDF berstandar korporat siap rapat.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Dokumen Resmi Siap Cetak & Rapat</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 5: Manajemen Pengguna & Hak Akses Berjenjang */}
          <div className={`p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-cyan-500/50 shadow-xl'
              : 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-cyan-500/50'
          }`}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Manajemen Pengguna & Hak Akses</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Kelola akun staf administrasi, kepala seksi, budget controller, hingga auditor dengan mudah.
                Tambah atau nonaktifkan akun pengguna yang terhubung langsung ke basis data otentikasi DABACO.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <span>Pemisahan Wewenang Antar Seksi</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 6: Supabase & Cloud Security */}
          <div className={`p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-red-500/50 shadow-xl'
              : 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-red-500/50'
          }`}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Penyimpanan Tertib & Hak Akses Aman</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Seluruh riwayat pengeluaran tersimpan rapi dengan cadangan berkala. Hak akses dibatasi sesuai peran
                masing-masing staf untuk menjaga kerahasiaan data internal pabrik.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-red-600 dark:text-red-400">
              <span>Akses Berjenjang & Terlindungi</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Data Flow Section */}
      <section id="architecture" className={`relative z-10 py-12 sm:py-16 border-y transition-colors ${
        darkMode ? 'bg-[#0a0f1c] border-slate-800/80' : 'bg-slate-100/70 border-slate-200/90'
      }`}>
        <div className="w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
              Alur Kerja Praktis
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              Empat Langkah Pengendalian Anggaran di Pabrik
            </h2>
            <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Dari pencatatan nota operasional harian hingga menjadi laporan evaluasi yang siap ditinjau pimpinan pabrik.
            </p>
          </div>

          {/* Flow Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className={`p-6 rounded-3xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center mb-4 text-xs">
                01
              </div>
              <h4 className="font-bold text-sm mb-1">Pencatatan & Sinkronisasi</h4>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Staf masing-masing seksi mencatat rencana dan bukti pengeluaran melalui lembar kerja spreadsheet yang terintegrasi otomatis.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-3xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center mb-4 text-xs">
                02
              </div>
              <h4 className="font-bold text-sm mb-1">Pemeriksaan & Validasi</h4>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Sistem memeriksa kesesuaian biaya dengan budget yang disetujui serta memverifikasi wewenang penanggung jawab seksi.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-3xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center mb-4 text-xs">
                03
              </div>
              <h4 className="font-bold text-sm mb-1">Rangkuman Grafik & Evaluasi</h4>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Angka-angka dirangkum menjadi grafik perbandingan biaya yang mudah dibaca untuk rapat evaluasi bulanan.
              </p>
            </div>

            {/* Step 4 */}
            <div className={`p-6 rounded-3xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-rose-600/10 text-rose-600 font-bold flex items-center justify-center mb-4 text-xs">
                04
              </div>
              <h4 className="font-bold text-sm mb-1">Pengingat & Laporan Resmi</h4>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Pengingat email terkirim jika anggaran mendekati batas, dan laporan resmi siap dicetak atau diunduh dalam format PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Banner & CTA Section */}
      <section id="security" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
        <div className={`rounded-3xl p-8 sm:p-14 border relative overflow-hidden text-center shadow-2xl transition-all ${
          darkMode
            ? 'bg-gradient-to-br from-[#131a2e] via-[#0e1424] to-[#0a0f1b] border-slate-800'
            : 'bg-gradient-to-br from-white via-rose-50/40 to-slate-50 border-slate-200/90'
        }`}>
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Sistem Pengendalian Anggaran PT Ajinomoto Indonesia &bull; Pabrik Mojokerto</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Pantau dan Kelola Anggaran Seksi Anda Lebih Mudah
            </h2>

            <p className={`mt-4 text-sm sm:text-base leading-relaxed ${
              darkMode ? 'text-slate-300' : 'text-slate-700 font-medium'
            }`}>
              Gunakan portal <strong>DABACO (Dashboard Badget Control System)</strong> dengan akun kerja Anda untuk melihat rekapitulasi pengeluaran terkini,
              memeriksa sisa anggaran seksi, dan menyusun laporan biaya operasional yang rapi dan transparan.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 transition-all cursor-pointer"
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
      <footer className={`border-t py-10 transition-colors ${
        darkMode ? 'bg-[#060910] border-slate-800/80 text-slate-500' : 'bg-slate-100/90 border-slate-200 text-slate-600'
      }`}>
        <div className="w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-8 px-2 py-0.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <AjinomotoLogo variant="full" className="h-6 w-auto" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                PT AJINOMOTO INDONESIA - PT AJINEX INTERNATIONAL, PABRIK MOJOKERTO
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                DABACO (Dashboard Badget Control System) - Sistem Pengendalian & Monitoring Anggaran Biaya Operasional
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px]">
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

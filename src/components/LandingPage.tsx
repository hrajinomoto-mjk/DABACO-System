import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  FileSpreadsheet,
  BarChart3,
  Mail,
  Users,
  Sun,
  Moon,
  Sparkles,
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
        darkMode ? 'bg-[#090d16]/85 border-slate-800/80' : 'bg-white/85 border-slate-200/90 shadow-xs'
      }`}>
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="h-9 sm:h-10 px-2 py-0.5 sm:py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center shrink-0">
              <AjinomotoLogo variant="full" className="h-5 sm:h-6 w-auto" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-red-600 dark:text-red-500 shrink-0">
                  DABACO
                </span>
                <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 truncate">
                  Dashboard Budget Control System &bull; Pabrik Mojokerto
                </span>
                <span className="sm:hidden text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shrink-0">
                  Mojokerto
                </span>
              </div>
              <p className={`text-[11px] font-medium hidden md:block truncate ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                PT Ajinomoto Indonesia &bull; PT Ajinex International, Mojokerto Factory
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <a
              href="#features"
              className={`transition-colors hover:text-red-600 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Fitur Utama
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
              }`}
              title={darkMode ? 'Ganti ke Tampilan Terang (Light Mode)' : 'Ganti ke Tampilan Gelap (Dark Mode)'}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login Portal Button */}
            <button
              id="navBtnLogin"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Masuk ke Sistem</span>
              <span className="sm:hidden">Masuk</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-6 sm:pt-10 md:pt-12 pb-6 sm:pb-9 px-4 sm:px-6 lg:px-8 max-w-5xl lg:max-w-6xl 2xl:max-w-7xl mx-auto text-center">
        {/* Eyebrow Chip */}
        <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] sm:text-xs font-bold mb-3 sm:mb-4 max-w-full">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">DABACO (Dashboard Budget Control System) &bull; Pabrik Mojokerto</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.2] max-w-4xl mx-auto">
          Pengendalian Anggaran Pabrik yang{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-500">
            Praktis, Tertib, dan Terukur
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`mt-3 sm:mt-4 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto ${
          darkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          <strong className="font-semibold text-red-600 dark:text-red-400">DABACO (Dashboard Budget Control System)</strong> membantu Pimpinan HR Dept. dan anggota dibawahnya di Pabrik Mojokerto memantau budget,
          melacak pengeluaran riil setiap bulan, dan memastikan tidak ada pembengkakan biaya
          operasional melalui data yang selalu sinkron dan transparan.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 max-w-md sm:max-w-none mx-auto w-full">
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm md:text-base shadow-md shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Masuk ke Portal DABACO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#architecture"
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              darkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 shadow-xs'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-xs'
            }`}
          >
            <span>Lihat Alur Kerja Sistem</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Live Status Indicators Banner - 2x2 grid on mobile, flex row on desktop */}
        <div className={`mt-5 sm:mt-7 grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-2 sm:gap-3.5 md:gap-6 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl border text-[11px] sm:text-xs md:text-sm font-medium backdrop-blur-md transition-colors max-w-3xl mx-auto ${
          darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-800 shadow-xs'
        }`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">Spreadsheet: <b className="font-semibold">Aktif</b></span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue-500 shrink-0" />
            <span className="truncate">Rekap Grafik: <b className="font-semibold">Siap</b></span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="truncate">Alert Email: <b className="font-semibold">Siaga</b></span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="truncate">Akses User: <b className="font-semibold">Terverifikasi</b></span>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid Section */}
      <section id="features" className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1600px] mx-auto py-7 sm:py-10">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Kemudahan Pengelolaan</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Fitur Utama untuk Membantu Kerja Tim Setiap Hari
          </h2>
          <p className={`text-xs sm:text-sm md:text-base mt-2 leading-relaxed ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Dirancang praktis agar staf administrasi, penanggung jawab seksi, dan pimpinan dapat mengawasi anggaran tanpa kerumitan administrasi manual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {/* Bento Card 1: Google Sheets Sync */}
          <div className={`p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-emerald-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-emerald-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1.5 sm:mb-2">Sinkronisasi Google Sheets</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Tim tetap bisa mencatat rencana kerja dan realisasi di spreadsheet yang sudah biasa dipakai.
                Sistem akan memperbarui data secara otomatis sehingga data di dashboard selalu yang paling baru.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Pembaruan Berkala Otomatis</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 2: Looker Studio BI Visualizer */}
          <div className={`p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-blue-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-blue-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center mb-3">
                <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1.5 sm:mb-2">Grafik & Laporan Visual Interaktif</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Tampilkan perbandingan pengeluaran antar bulan dan antar seksi dalam grafik yang bersih dan mudah dibaca.
                Membantu pimpinan melihat tren biaya dan mengambil keputusan rapat dengan cepat.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Praktis untuk Rapat Pimpinan</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 3: Email Alerts System */}
          <div className={`p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-rose-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-rose-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center mb-3">
                <Mail className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1.5 sm:mb-2">Pengingat Ambang Batas Email</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Jika pengeluaran suatu seksi sudah mendekati 85% atau melampaui batas anggaran,
                sistem otomatis mengirimkan email pengingat kepada PIC bersangkutan agar dapat segera dievaluasi.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Pencegahan Dini Biaya Bengkak</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 4: Executive Report & PDF Generation */}
          <div className={`p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-amber-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-amber-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-3">
                <FileCheck className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1.5 sm:mb-2">Laporan Eksekutif & Dokumen PDF</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Susun laporan pertanggungjawaban anggaran secara instan untuk Pimpinan HR Dept. dan manajemen pabrik.
                Lengkap dengan analisis varians biaya per seksi dan ekspor berkas PDF berstandar korporat siap rapat.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Dokumen Resmi Siap Cetak</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 5: Manajemen Pengguna & Hak Akses Berjenjang */}
          <div className={`p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-cyan-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-cyan-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 flex items-center justify-center mb-3">
                <Users className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1.5 sm:mb-2">Manajemen Pengguna & Akses</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Kelola akun staf administrasi, kepala seksi, budget controller, hingga auditor dengan mudah.
                Tambah atau nonaktifkan akun pengguna yang terhubung langsung ke basis data otentikasi DABACO.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <span>Pemisahan Wewenang Antar Seksi</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 6: Supabase & Cloud Security */}
          <div className={`p-4 sm:p-5 lg:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            darkMode
              ? 'bg-[#0f1422] border-slate-800 hover:border-red-500/50 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs hover:border-red-500/50 hover:shadow-sm'
          }`}>
            <div>
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1.5 sm:mb-2">Penyimpanan Tertib & Hak Akses</h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Seluruh riwayat pengeluaran tersimpan rapi dengan cadangan berkala. Hak akses dibatasi sesuai peran
                masing-masing staf untuk menjaga kerahasiaan data internal pabrik.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-red-600 dark:text-red-400">
              <span>Akses Berjenjang & Terlindungi</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Data Flow Section */}
      <section id="architecture" className={`relative z-10 py-8 sm:py-12 border-y transition-colors ${
        darkMode ? 'bg-[#0a0f1c] border-slate-800/80' : 'bg-slate-100/70 border-slate-200/90'
      }`}>
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Alur Kerja Praktis
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
              Empat Langkah Pengendalian Anggaran di Pabrik
            </h2>
            <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Dari pencatatan nota operasional harian hingga menjadi laporan evaluasi yang siap ditinjau pimpinan pabrik.
            </p>
          </div>

          {/* Flow Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 relative">
            {/* Step 1 */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center mb-2.5 text-xs">
                01
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-1">Pencatatan & Sinkronisasi</h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Staf masing-masing seksi mencatat rencana dan bukti pengeluaran melalui lembar kerja spreadsheet yang terintegrasi otomatis.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center mb-2.5 text-xs">
                02
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-1">Pemeriksaan & Validasi</h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Sistem memeriksa kesesuaian biaya dengan budget yang disetujui serta memverifikasi wewenang penanggung jawab seksi.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center mb-2.5 text-xs">
                03
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-1">Rangkuman Grafik & Evaluasi</h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Angka-angka dirangkum menjadi grafik perbandingan biaya yang mudah dibaca untuk rapat evaluasi bulanan.
              </p>
            </div>

            {/* Step 4 */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-rose-600/10 text-rose-600 font-bold flex items-center justify-center mb-2.5 text-xs">
                04
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-1">Pengingat & Laporan Resmi</h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Pengingat email terkirim jika anggaran mendekati batas, dan laporan resmi siap dicetak atau diunduh dalam format PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Banner & CTA Section */}
      <section id="security" className="relative z-10 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border relative overflow-hidden text-center shadow-lg transition-all ${
          darkMode
            ? 'bg-gradient-to-br from-[#131a2e] via-[#0e1424] to-[#0a0f1b] border-slate-800'
            : 'bg-gradient-to-br from-white via-rose-50/40 to-slate-50 border-slate-200/90'
        }`}>
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] sm:text-xs font-bold mb-3 sm:mb-4 max-w-full">
              <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
              <span className="truncate">Sistem Pengendalian Anggaran PT Ajinomoto Indonesia &bull; Pabrik Mojokerto</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Pantau dan Kelola Anggaran Seksi Anda Lebih Mudah
            </h2>

            <p className={`mt-3 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Gunakan portal <strong>DABACO (Dashboard Budget Control System)</strong> dengan akun kerja Anda untuk melihat rekapitulasi pengeluaran terkini,
              memeriksa sisa anggaran seksi, dan menyusun laporan biaya operasional yang rapi dan transparan.
            </p>

            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm md:text-base shadow-md shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5 transition-all cursor-pointer"
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
      <footer className={`border-t py-6 sm:py-8 transition-colors ${
        darkMode ? 'bg-[#060910] border-slate-800/80 text-slate-500' : 'bg-slate-100/90 border-slate-200 text-slate-600'
      }`}>
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="h-8 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
              <AjinomotoLogo variant="full" className="h-5 sm:h-6 w-auto" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm truncate">
                PT AJINOMOTO INDONESIA &bull; PT AJINEX INTERNATIONAL, PABRIK MOJOKERTO
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                DABACO (Dashboard Budget Control System) &bull; Sistem Pengendalian & Monitoring Anggaran
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] sm:text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              &copy; {new Date().getFullYear()} PT Ajinomoto Indonesia &bull; Pabrik Mojokerto.
            </p>
            <p className="text-slate-500 dark:text-slate-400">Portal Internal Keuangan & Pengendalian Biaya</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

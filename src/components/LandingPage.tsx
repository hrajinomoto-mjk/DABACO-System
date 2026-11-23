import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Sparkles,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { AmbientBackdrop } from './AmbientBackdrop';
import { ThemePicker } from './ThemePicker';
import { AjinomotoLogo } from './AjinomotoLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { ThemeId, getThemeById } from '../utils/themes';
import { BudgetRecord, ForecastRecord, RealizationRecord, MasterCostCenter } from '../types';

interface LandingPageProps {
  onOpenLogin: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTheme?: ThemeId;
  onSelectTheme?: (theme: ThemeId) => void;
  budgetData?: BudgetRecord[];
  forecastData?: ForecastRecord[];
  realizationData?: RealizationRecord[];
  costCenters?: MasterCostCenter[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  darkMode,
  setDarkMode,
  activeTheme = (darkMode ? 'midnight-dark' : 'crimson-light') as ThemeId,
  onSelectTheme
}) => {
  const { tr } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const currentThemeObj = getThemeById(activeTheme);
  const handleSelectTheme = (themeId: ThemeId) => {
    if (onSelectTheme) {
      onSelectTheme(themeId);
    } else {
      const target = getThemeById(themeId);
      setDarkMode(target.mode === 'dark');
    }
  };

  const faqItems = [
    {
      question: tr(
        'Bagaimana siklus perhitungan Tahun Fiskal (FY) pada sistem DABACO?',
        'How does the Fiscal Year (FY) calculation cycle work in DABACO?'
      ),
      answer: tr(
        'Siklus anggaran pada sistem DABACO mengikuti kalender Tahun Fiskal (Fiscal Year/FY) korporat PT Ajinomoto Indonesia yang dimulai pada tanggal 1 April hingga 31 Maret tahun berikutnya. Data anggaran diorganisasi ke dalam Semester 1 (April–September) dan Semester 2 (Oktober–Maret), mencakup perbandingan menyeluruh antara Budget tahunan, estimasi berjalan (Forecast), dan realisasi pengeluaran riil bulanan per Cost Center.',
        'The budget cycle in DABACO follows PT Ajinomoto Indonesia’s corporate Fiscal Year (FY) calendar running from April 1 to March 31 of the following year. Budget data is organized into Semester 1 (April–September) and Semester 2 (October–March), providing comprehensive comparisons across Annual Budget, rolling Forecast, and actual monthly realizations per Cost Center.'
      )
    },
    {
      question: tr(
        'Bagaimana pembagian dan pengelompokan Cost Center (Seksi) di DABACO?',
        'How are Cost Centers (Sections) structured and grouped in DABACO?'
      ),
      answer: tr(
        'Seluruh pos anggaran dikelompokkan secara tertib berdasarkan Master Cost Center masing-masing bagian di lingkungan Pabrik Mojokerto (seperti General Affairs, Personnel, Medical, HR Development, dan seksi terkait lainnya). Setiap seksi memiliki alokasi anggaran tersendiri sehingga pimpinan dan penanggung jawab seksi dapat memantau serapan dana secara transparan tanpa tumpang tindih.',
        'All budget line items are structured cleanly under Master Cost Centers for each Mojokerto Factory unit (such as General Affairs, Personnel, Medical, HR Development, and related sections). Each section maintains its dedicated allocation so leadership and PICs can track utilization transparently without overlap.'
      )
    },
    {
      question: tr(
        'Bagaimana alur persetujuan dan evaluasi jika ada deviasi anggaran?',
        'What is the approval and evaluation workflow when budget deviations occur?'
      ),
      answer: tr(
        'Sistem DABACO memonitor deviasi biaya secara otomatis. Jika serapan anggaran suatu seksi mendekati ambang batas peringatan 85% atau melampaui 100%, sistem akan langsung mengirimkan notifikasi Email Alert otomatis kepada PIC seksi terkait dan menandai status transaksi pada dashboard untuk segera ditinjau dan dievaluasi bersama Pimpinan HR Dept.',
        'DABACO monitors cost variances automatically. Whenever a section’s absorption approaches the 85% early warning threshold or exceeds 100%, the system triggers an automated Email Alert to the responsible PIC and flags the item on the dashboard for prompt review with HR Department Leadership.'
      )
    },
    {
      question: tr(
        'Apakah data dapat diekspor ke dalam bentuk laporan resmi?',
        'Can data be exported into official management reports?'
      ),
      answer: tr(
        'Ya, DABACO dilengkapi fitur ekspor Dokumen Dossier Eksekutif PDF resmi berlogo Ajinomoto berstandar korporat yang siap digunakan untuk presentasi dan rapat evaluasi manajemen. Selain berkas PDF, pengguna juga dapat mengunduh seluruh transaksi ke format CSV/Excel serta memanfaatkan sinkronisasi otomatis dengan Google Sheets.',
        'Yes. DABACO includes an official corporate Executive Dossier PDF exporter featuring the official Ajinomoto letterhead, ready for board presentations and management reviews. In addition to PDF, users can export full ledgers to CSV/Excel and sync automatically with Google Sheets.'
      )
    },
    {
      question: tr(
        'Bagaimana integrasi Google Sheets dan keamanan data di DABACO?',
        'How are Google Sheets integration and data security handled in DABACO?'
      ),
      answer: tr(
        'DABACO terintegrasi langsung dengan lembar kerja Google Sheets untuk memudahkan tim lapangan memperbarui data operasional harian. Seluruh data disimpan dan diamankan menggunakan enkripsi cloud, kontrol hak akses berbasis peran (RBAC), serta pencadangan berkala untuk menjaga integritas dan kerahasiaan data internal pabrik.',
        'DABACO connects directly with Google Sheets so operational teams can update daily expenditure sheets seamlessly. All records are protected using cloud encryption, Role-Based Access Control (RBAC), and scheduled backups to safeguard internal factory financial integrity and confidentiality.'
      )
    }
  ];

  // Automatically strip any hash from URL bar (e.g., #security, #features)
  // so the address bar only displays the clean domain URL.
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace(/^#/, '');
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }

    const handleHash = () => {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      data-i18n-native="true"
      className={`relative min-h-screen w-full transition-colors duration-200 overflow-x-hidden dabaco-app-shell ${
        darkMode ? 'bg-[#080c14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Executive Architectural & Theme-Adaptive Background */}
      <AmbientBackdrop activeTheme={activeTheme} darkMode={darkMode} variant="landing" />

      {/* Top Sticky Header / Navigation */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors dabaco-navbar ${
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
                <span className="font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-red-600 dark:text-red-500 shrink-0 dabaco-brand-text">
                  DABACO
                </span>
                <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border truncate dabaco-badge-accent">
                  {tr(
                    'Dashboard Budget Control System • Pabrik Mojokerto',
                    'Dashboard Budget Control System • Mojokerto Factory'
                  )}
                </span>
                <span className="sm:hidden text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 dabaco-badge-accent">
                  Mojokerto
                </span>
              </div>
              <p className={`text-[11px] font-medium hidden md:block truncate ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {tr(
                  'PT Ajinomoto Indonesia • PT Ajinex International, Pabrik Mojokerto',
                  'PT Ajinomoto Indonesia • PT Ajinex International, Mojokerto Factory'
                )}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <button
              type="button"
              onClick={() => scrollToSection('architecture')}
              className={`transition-colors dabaco-hover-accent cursor-pointer whitespace-nowrap shrink-0 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {tr('Alur Kerja', 'Workflow')}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('security')}
              className={`transition-colors dabaco-hover-accent cursor-pointer whitespace-nowrap shrink-0 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {tr('Keamanan Data', 'Data Security')}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className={`transition-colors dabaco-hover-accent cursor-pointer whitespace-nowrap shrink-0 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              FAQ
            </button>
          </nav>

          {/* Action CTAs, Language Switcher & Multi-Theme Studio Picker */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Enterprise ID | EN Switcher */}
            <LanguageSwitcher darkMode={darkMode} />

            {/* 6-Theme Corporate Picker */}
            <ThemePicker
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              activeTheme={activeTheme}
              onSelectTheme={handleSelectTheme}
            />

            {/* Login Portal Button */}
            <button
              id="navBtnLogin"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl dabaco-nav-active text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tr('Masuk ke Sistem', 'Sign In to System')}</span>
              <span className="sm:hidden">{tr('Masuk', 'Sign In')}</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl lg:max-w-6xl 2xl:max-w-7xl mx-auto text-center">
        {/* Eyebrow Chip */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-4 sm:mb-5 max-w-full dabaco-badge-accent">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {tr(
              'DABACO (Dashboard Budget Control System) • Pabrik Mojokerto',
              'DABACO (Dashboard Budget Control System) • Mojokerto Factory'
            )}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.2] max-w-4xl mx-auto [text-wrap:balance]">
          {tr('Pengendalian Anggaran Pabrik yang ', 'Enterprise Factory Budget Control — ')}
          <span className="dabaco-hero-gradient">
            {tr('Praktis, Tertib, dan Terukur', 'Practical, Disciplined, and Measurable')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`mt-4 sm:mt-5 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto ${
          darkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          <strong className="font-semibold dabaco-accent-text">
            DABACO (Dashboard Budget Control System)
          </strong>{' '}
          {tr(
            'membantu Pimpinan HR Dept. dan anggota dibawahnya di Pabrik Mojokerto memantau budget, melacak pengeluaran riil setiap bulan, dan memastikan tidak ada pembengkakan biaya operasional melalui data yang selalu sinkron dan transparan.',
            'empowers HR Department Leadership and teams at Mojokerto Factory to monitor budgets, track actual monthly expenditures, and prevent operational cost overruns through synchronized, transparent financial data.'
          )}
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto w-full">
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl dabaco-nav-active text-white font-bold text-sm sm:text-base hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{tr('Masuk ke Portal DABACO', 'Enter DABACO Portal')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('architecture')}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold border transition-all cursor-pointer ${
              darkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 shadow-xs'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-xs'
            }`}
          >
            <span>{tr('Lihat Alur Kerja Sistem', 'Explore System Workflow')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Architecture & Data Flow Section */}
      <section
        id="architecture"
        className={`relative z-10 scroll-mt-16 sm:scroll-mt-20 py-8 sm:py-12 lg:py-14 border-y transition-colors ${
          darkMode ? 'bg-[#0a0f1c] border-slate-800/80' : 'bg-slate-100/70 border-slate-200/90'
        }`}
      >
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-7">
            <p className="text-xs font-bold uppercase tracking-wider dabaco-accent-text">
              {tr('Alur Kerja Praktis', 'Operational Workflow')}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
              {tr('Empat Langkah Pengendalian Anggaran di Pabrik', 'Four Steps to Factory Budget Governance')}
            </h2>
            <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {tr(
                'Dari pencatatan nota operasional harian hingga menjadi laporan evaluasi yang siap ditinjau pimpinan pabrik.',
                'From daily operational voucher entry to board-ready executive variance reports for factory leadership.'
              )}
            </p>
          </div>

          {/* Flow Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 relative">
            {/* Step 1 */}
            <div className={`p-4 sm:p-4.5 rounded-xl border transition-all flex flex-col justify-between ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div>
                <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center mb-2.5 text-xs">
                  01
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-1">
                  {tr('Pencatatan & Sinkronisasi', 'Recording & Synchronization')}
                </h4>
                <p className={`text-xs sm:text-[13px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tr(
                    'Staf masing-masing seksi mencatat rencana dan bukti pengeluaran melalui lembar kerja spreadsheet yang terintegrasi otomatis.',
                    'Each section records plans and expense vouchers through automatically integrated online spreadsheet ledgers.'
                  )}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-4 sm:p-4.5 rounded-xl border transition-all flex flex-col justify-between ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center mb-2.5 text-xs">
                  02
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-1">
                  {tr('Pemeriksaan & Validasi', 'Verification & Validation')}
                </h4>
                <p className={`text-xs sm:text-[13px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tr(
                    'Sistem memeriksa kesesuaian biaya dengan budget yang disetujui serta memverifikasi wewenang penanggung jawab seksi.',
                    'The system validates expenditure alignment against approved budgets and verifies section PIC authorization.'
                  )}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-4 sm:p-4.5 rounded-xl border transition-all flex flex-col justify-between ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center mb-2.5 text-xs">
                  03
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-1">
                  {tr('Rangkuman Grafik & Evaluasi', 'Visual Analytics & Evaluation')}
                </h4>
                <p className={`text-xs sm:text-[13px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tr(
                    'Angka-angka dirangkum menjadi grafik perbandingan biaya yang mudah dibaca untuk rapat evaluasi bulanan.',
                    'Financial figures are synthesized into executive variance charts designed for monthly evaluation reviews.'
                  )}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`p-4 sm:p-4.5 rounded-xl border transition-all flex flex-col justify-between ${
              darkMode ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div>
                <div className="w-7 h-7 rounded-lg bg-rose-600/10 text-rose-600 font-bold flex items-center justify-center mb-2.5 text-xs">
                  04
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-1">
                  {tr('Pengingat & Laporan Resmi', 'Alerts & Official Reports')}
                </h4>
                <p className={`text-xs sm:text-[13px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tr(
                    'Pengingat email terkirim jika anggaran mendekati batas, dan laporan resmi siap dicetak atau diunduh dalam format PDF.',
                    'Automated email alerts trigger near spending thresholds, while official PDF dossiers remain ready for export.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Banner & CTA Section */}
      <section
        id="security"
        className="relative z-10 scroll-mt-16 sm:scroll-mt-20 py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl lg:max-w-6xl mx-auto w-full"
      >
        <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 border relative overflow-hidden text-center shadow-lg transition-all ${
          darkMode
            ? 'bg-[#0f1422]/95 border-slate-800 backdrop-blur-md'
            : 'bg-white/95 border-slate-200/90 backdrop-blur-md'
        }`}>
          {/* Subtle Theme-Adaptive Ambient Glow */}
          <div
            className="absolute -top-12 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(circle, ${currentThemeObj.swatches.accent}, ${currentThemeObj.swatches.accentSecondary}, transparent 70%)`
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] sm:text-xs font-bold mb-2.5 sm:mb-3.5 max-w-full">
              <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
              <span className="truncate">
                {tr(
                  'Sistem Pengendalian Anggaran PT Ajinomoto Indonesia • Pabrik Mojokerto',
                  'PT Ajinomoto Indonesia Budget Control System • Mojokerto Factory'
                )}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {tr(
                'Pantau dan Kelola Anggaran Seksi Anda Lebih Mudah',
                'Monitor and Govern Your Section Budgets with Clarity'
              )}
            </h2>

            <p className={`mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {tr('Gunakan portal ', 'Access the ')}
              <strong>DABACO (Dashboard Budget Control System)</strong>{' '}
              {tr(
                'dengan akun kerja Anda untuk melihat rekapitulasi pengeluaran terkini, memeriksa sisa anggaran seksi, dan menyusun laporan biaya operasional yang rapi dan transparan.',
                'portal with your corporate credentials to review real-time expenditure summaries, inspect remaining section allocations, and produce structured operational cost reports.'
              )}
            </p>

            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl dabaco-nav-active text-white font-bold text-xs sm:text-sm md:text-base hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{tr('Masuk ke Portal DABACO', 'Enter DABACO Portal')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="relative z-10 scroll-mt-16 sm:scroll-mt-20 py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl lg:max-w-5xl mx-auto w-full"
      >
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-7">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider dabaco-accent-text mb-1.5">
            {tr('TANYA JAWAB OPERASIONAL', 'OPERATIONAL Q&A')}
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            {tr('Pertanyaan yang Sering Diajukan (FAQ)', 'Frequently Asked Questions (FAQ)')}
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {tr(
              'Panduan operasional dan penjelasan seputar alur kerja sistem pengendalian anggaran DABACO di Pabrik Mojokerto.',
              'Operational guidance and documentation covering the DABACO budget control workflow at Mojokerto Factory.'
            )}
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  darkMode
                    ? 'bg-[#0f1422]/95 border-slate-800 hover:border-slate-700 shadow-xs'
                    : 'bg-white/95 border-slate-200/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-4.5 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-xs sm:text-sm md:text-[15px] transition-colors ${
                    isOpen
                      ? 'dabaco-accent-text'
                      : darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {item.question}
                  </span>
                  <div className={`p-1 rounded-md transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 dabaco-accent-text' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4.5 sm:px-5 pb-4 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      darkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
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
                {tr(
                  'PT AJINOMOTO INDONESIA • PT AJINEX INTERNATIONAL, PABRIK MOJOKERTO',
                  'PT AJINOMOTO INDONESIA • PT AJINEX INTERNATIONAL, MOJOKERTO FACTORY'
                )}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {tr(
                  'DABACO (Dashboard Budget Control System) • Sistem Pengendalian & Monitoring Anggaran',
                  'DABACO (Dashboard Budget Control System) • Enterprise Budget Control & Monitoring Platform'
                )}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] sm:text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              &copy; {new Date().getFullYear()} PT Ajinomoto Indonesia &bull; {tr('Pabrik Mojokerto.', 'Mojokerto Factory.')}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {tr('Portal Internal Keuangan & Pengendalian Biaya', 'Internal Finance & Cost Control Portal')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

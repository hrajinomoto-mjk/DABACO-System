import React from 'react';
import {
  X,
  Keyboard,
  RefreshCw,
  FileDown,
  Upload,
  Mail,
  PanelLeftClose,
  Sun,
  Layers,
  HelpCircle,
  Zap,
  Sparkles,
  Command,
  Info
} from 'lucide-react';
import { AjinomotoLogo } from './AjinomotoLogo';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAltPressed: boolean;
  darkMode: boolean;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  isAltPressed,
  darkMode
}) => {
  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘ Cmd' : 'Ctrl';

  const shortcutGroups = [
    {
      category: 'Tindakan Cepat & Sinkronisasi',
      icon: Zap,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      items: [
        {
          keys: [modKey, 'S'],
          action: 'Sinkronisasi Google Sheets & Database',
          description: 'Memicu sinkronisasi data dua arah dengan checksum SHA-256 secara instan.',
          badge: 'High Priority'
        },
        {
          keys: [modKey, 'P'],
          action: 'Buka Generator Executive PDF Report',
          description: 'Membuka dialog pembuatan dossier PDF resmi Direksi Ajinomoto.',
          badge: 'Executive'
        },
        {
          keys: [modKey, 'U'],
          action: 'Unggah Berkas Massal (Bulk CSV Upload)',
          description: 'Membuka wizard impor data massal Budget, Forecast, atau Realisasi.'
        },
        {
          keys: [modKey, 'E'],
          action: 'Kirim Laporan Eksekutif via Email',
          description: 'Membuka formulir distribusi email notifikasi & approval anggaran.'
        }
      ]
    },
    {
      category: 'Navigasi Tab Modul Cepat',
      icon: Layers,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      items: [
        {
          keys: [modKey, '1'],
          altKeys: ['Alt', '1'],
          action: 'Dashboard Operasional Finansial',
          description: 'Beralih langsung ke halaman Executive Budget Dashboard utama.'
        },
        {
          keys: [modKey, '2'],
          altKeys: ['Alt', '2'],
          action: 'Top Management Report & Strategic Dossier',
          description: 'Beralih ke laporan presentasi khusus Dewan Direksi & C-Suite.'
        },
        {
          keys: [modKey, '3'],
          altKeys: ['Alt', '3'],
          action: 'Plafon Budget Plan (Perencanaan)',
          description: 'Beralih ke tabel manajemen budget anggaran tahunan.'
        },
        {
          keys: [modKey, '4'],
          altKeys: ['Alt', '4'],
          action: 'Proyeksi Forecast Finansial',
          description: 'Beralih ke estimasi arus kas bulanan & triwulanan.'
        },
        {
          keys: [modKey, '5'],
          altKeys: ['Alt', '5'],
          action: 'Pencatatan Realisasi Aktual Kas',
          description: 'Beralih ke riwayat pencairan dan invoice aktual.'
        },
        {
          keys: [modKey, '6'],
          altKeys: ['Alt', '6'],
          action: 'Business Intelligence (BI) Studio',
          description: 'Buka dasbor Business Intelligence terintegrasi.'
        },
        {
          keys: [modKey, '7'],
          altKeys: ['Alt', '7'],
          action: 'Google Sheets Sinkronisasi',
          description: 'Konfigurasi integrasi spreadsheet dua arah.'
        },
        {
          keys: [modKey, '8'],
          altKeys: ['Alt', '8'],
          action: 'Automated Email Alerts Engine',
          description: 'Pemantauan anomali dan limit peringatan dini.'
        },
        {
          keys: [modKey, '9'],
          altKeys: ['Alt', '9'],
          action: 'Manajemen Pengguna & Hak Akses',
          description: 'Kelola akun staf, hak akses seksi, dan otentikasi database.'
        }
      ]
    },
    {
      category: 'Antarmuka & Kontrol Tampilan',
      icon: Command,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      items: [
        {
          keys: [modKey, 'B'],
          action: 'Perkecil / Perluas Sidebar (Collapse)',
          description: 'Mengubah lebar navigasi dari 288px ke 80px untuk area kerja lebih luas.'
        },
        {
          keys: [modKey, 'D'],
          action: 'Alihkan Tema Gelap / Terang (Dark/Light)',
          description: 'Mengubah skema warna antarmuka instan tanpa memuat ulang halaman.'
        },
        {
          keys: ['Alt'],
          hold: true,
          action: 'Tampilkan Tooltip Pintasan Langsung di Layar',
          description: 'Tahan tombol Alt untuk memunculkan badge petunjuk di atas setiap tombol interaktif.'
        },
        {
          keys: ['?'],
          altKeys: ['Shift', '/'],
          action: 'Buka / Tutup Panduan Pintasan Ini',
          description: 'Menampilkan cheatsheet ringkasan pintasan keyboard kapan saja.'
        },
        {
          keys: ['ESC'],
          action: 'Tutup Dialog & Pop-up Aktif',
          description: 'Menutup modal dialog yang sedang terbuka seketika.'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-[#0c111d] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-[#0c111d] to-slate-900/90">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-red-600/10 border border-red-500/25 shrink-0 shadow-xs">
              <AjinomotoLogo variant="symbol" className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-red-600 text-white">
                  PRODUCTIVITY BOOST
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Keyboard className="w-3.5 h-3.5 text-amber-400" /> DABACO Speed Dial
                </span>
              </div>
              <h3 className="font-black text-white text-lg sm:text-xl tracking-tight">
                Pintasan Keyboard (Keyboard Shortcuts)
              </h3>
              <p className="text-xs text-slate-400">
                PT Ajinomoto Indonesia &bull; Pabrik Mojokerto Financial Controlling System
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
            title="Tutup (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Alt-Key Interactive Status Banner */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Status Tombol Alt:</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
              isAltPressed
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isAltPressed ? 'bg-amber-400' : 'bg-slate-500'}`} />
              {isAltPressed ? 'Tombol Alt Sedang Ditekan (Aktif)' : 'Tombol Alt Dilepas'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Tahan tombol <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[10px]">Alt</kbd> untuk melihat badge navigasi di antarmuka.</span>
          </div>
        </div>

        {/* Modal Body: Groups of shortcuts */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-xs text-slate-300 scrollbar-thin">
          {shortcutGroups.map((group, gIdx) => {
            const GroupIcon = group.icon;
            return (
              <div key={gIdx} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800/70 pb-2">
                  <div className={`p-1.5 rounded-lg ${group.bgColor} ${group.borderColor} border`}>
                    <GroupIcon className={`w-4 h-4 ${group.color}`} />
                  </div>
                  <h4 className="font-extrabold text-white text-sm tracking-tight">
                    {group.category}
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {group.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">
                            {item.action}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 text-[9px] font-black rounded bg-red-600/20 text-red-400 border border-red-500/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Keycaps */}
                      <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                        {item.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="min-w-[28px] h-7 px-2.5 rounded-lg bg-slate-800 border border-slate-700/90 text-white font-mono font-bold text-xs shadow-xs flex items-center justify-center">
                              {k}
                            </kbd>
                            {kIdx < item.keys.length - 1 && (
                              <span className="text-slate-500 font-bold text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}

                        {item.altKeys && (
                          <>
                            <span className="text-slate-600 text-[10px] mx-1">atau</span>
                            {item.altKeys.map((ak, akIdx) => (
                              <React.Fragment key={akIdx}>
                                <kbd className="min-w-[24px] h-6 px-2 rounded-md bg-slate-800/60 border border-slate-700 text-slate-300 font-mono text-[11px] flex items-center justify-center">
                                  {ak}
                                </kbd>
                                {akIdx < item.altKeys.length - 1 && (
                                  <span className="text-slate-600 text-[10px]">+</span>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Pintasan aktif secara global di seluruh sistem DABACO.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer self-end"
          >
            Mengerti & Tutup (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ReceiptText,
  BarChart3,
  FileSpreadsheet,
  Mail,
  Users,
  Database,
  Settings,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AjinomotoLogo } from './AjinomotoLogo';

export type ActiveTab =
  | 'dashboard'
  | 'executive-report'
  | 'budget'
  | 'forecast'
  | 'realization'
  | 'looker'
  | 'sheets-sync'
  | 'email-alerts'
  | 'users'
  | 'banking'
  | 'supabase'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onLogout: () => void;
  unreadAlertsCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isAltPressed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  darkMode,
  setDarkMode,
  onLogout,
  unreadAlertsCount,
  isCollapsed = false,
  onToggleCollapse,
  isAltPressed = false
}) => {
  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    section?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard Operasional', icon: LayoutDashboard },
    { id: 'executive-report', label: 'Top Management Report', icon: Award, section: 'Strategic & Executive' },
    { id: 'budget', label: 'Budget Plan', icon: Wallet, section: 'Core Financials' },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'realization', label: 'Realization', icon: ReceiptText },
    { id: 'looker', label: 'Business Intelligence (BI)', icon: BarChart3, section: 'Integrations & Analytics' },
    { id: 'sheets-sync', label: 'Google Sheets Sync', icon: FileSpreadsheet },
    { id: 'email-alerts', label: 'Email Alerts', icon: Mail, badge: unreadAlertsCount },
    { id: 'users', label: 'Manajemen Pengguna', icon: Users, section: 'Architecture & Security' },
    { id: 'supabase', label: 'Supabase Backend', icon: Database },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isCollapsed ? 'w-72 lg:w-20' : 'w-72'
        } ${
          darkMode
            ? 'bg-[#0a0e17] border-r border-slate-800/80 text-slate-200 shadow-2xl shadow-black/60'
            : 'bg-white border-r border-slate-200/90 text-slate-800 shadow-xl shadow-slate-200/50'
        }`}
      >
        {/* Subtle Top Ajinomoto Red Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-700" />

        {/* Brand Header */}
        <div
          className={`border-b border-slate-200/70 dark:border-slate-800/80 transition-all ${
            isCollapsed
              ? 'p-3 flex flex-col items-center gap-2.5'
              : 'px-5 py-4 flex items-center justify-between'
          }`}
        >
          {!isCollapsed ? (
            <>
              {/* Expanded Brand Lockup */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-11 px-2.5 py-1 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
                  <AjinomotoLogo variant="full" className="h-7 w-auto" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black tracking-tight text-base bg-gradient-to-r from-red-600 via-rose-600 to-red-700 bg-clip-text text-transparent">
                      DABACO
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20">
                      v2.4
                    </span>
                  </div>
                  <p
                    className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[130px]"
                    title="PT Ajinomoto Indonesia - Mojokerto Factory"
                  >
                    PT Ajinomoto Indonesia
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors relative cursor-pointer"
                  title={darkMode ? 'Ganti ke Mode Terang (Ctrl+D)' : 'Ganti ke Mode Gelap (Ctrl+D)'}
                >
                  {darkMode ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )}
                  {isAltPressed && (
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm ring-1 ring-amber-300 animate-bounce">
                      ^D
                    </span>
                  )}
                </button>

                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer relative"
                    title="Perkecil Sidebar (Ctrl+B)"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                    {isAltPressed && (
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm ring-1 ring-amber-300 animate-bounce">
                        ^B
                      </span>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Collapsed Brand Icon */}
              <div
                className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-1.5 cursor-pointer shadow-sm group relative hover:border-red-500/40 transition-all"
                onClick={onToggleCollapse}
                title="PT Ajinomoto Indonesia - Klik untuk memperluas (Ctrl+B)"
              >
                <AjinomotoLogo variant="full" className="h-5 w-auto max-w-full" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
                {isAltPressed && (
                  <span className="absolute -top-1 -left-1 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-md border border-amber-300 animate-bounce">
                    ^B
                  </span>
                )}
              </div>

              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer relative"
                  title="Perluas Sidebar (Ctrl+B)"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                  {isAltPressed && (
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm ring-1 ring-amber-300 animate-bounce">
                      ^B
                    </span>
                  )}
                </button>
              )}
            </>
          )}
        </div>

        {/* User Session Profile Capsule */}
        <div
          className={`border-b border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-white/[0.015] transition-all ${
            isCollapsed ? 'p-2.5 flex justify-center' : 'px-5 py-3.5 flex items-center gap-3'
          }`}
        >
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white font-black text-xs flex items-center justify-center shadow-md shadow-red-600/25 ring-2 ring-white dark:ring-slate-800">
              HR
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-[0_0_8px_#10b981]" />

            {/* Floating Tooltip in Collapsed Mode */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-2 rounded-2xl bg-slate-950 text-white text-xs font-semibold shadow-2xl border border-slate-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                <p className="font-black text-white">Admin Controller</p>
                <p className="text-[10px] text-slate-400">HR Development &bull; Online</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-black truncate ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  Admin Controller
                </p>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  HR Development &bull; Sesi Aktif
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation Item List */}
        <nav
          className={`flex-1 overflow-y-auto space-y-1.5 scrollbar-thin transition-all ${
            isCollapsed ? 'p-2' : 'p-3.5'
          }`}
          aria-label="Sidebar Navigation"
        >
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const shortcutNum = idx < 9 ? idx + 1 : null;

            return (
              <React.Fragment key={item.id}>
                {item.section && (
                  isCollapsed ? (
                    <div className="my-2.5 border-t border-slate-200/60 dark:border-slate-800/60 mx-2" />
                  ) : (
                    <div className="pt-4 pb-1.5 px-3 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {item.section}
                      </span>
                      <span className="flex-1 h-px bg-slate-200/60 dark:bg-slate-800/60" />
                    </div>
                  )
                )}

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={`w-full rounded-2xl text-xs font-bold transition-all relative group cursor-pointer ${
                    isCollapsed
                      ? 'flex items-center justify-center p-3'
                      : 'flex items-center justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 via-[#D10010] to-[#B3000E] text-white shadow-lg shadow-red-600/25 ring-1 ring-red-500/40'
                      : darkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                  title={isCollapsed ? `${item.label}${shortcutNum ? ` (Alt+${shortcutNum})` : ''}` : undefined}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="relative flex items-center justify-center">
                      <Icon
                        className={`w-4 h-4 transition-all duration-200 ${
                          isActive
                            ? 'text-white scale-110'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:scale-110'
                        }`}
                      />

                      {/* Collapsed Badge Dot */}
                      {isCollapsed && item.badge && item.badge > 0 ? (
                        <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900 animate-ping" />
                      ) : null}

                      {/* Shortcut Key Overlay (Alt pressed) */}
                      {isCollapsed && isAltPressed && shortcutNum && (
                        <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-lg border border-amber-300 ring-2 ring-amber-400/40 z-20 animate-bounce">
                          {shortcutNum}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {/* Right Badges & Shortcuts in Expanded Mode */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isCollapsed && isAltPressed && shortcutNum && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-[10px] shadow-xs flex items-center gap-0.5 animate-bounce">
                        Alt+{shortcutNum}
                      </span>
                    )}

                    {!isCollapsed && item.badge && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Floating Tooltip in Collapsed Mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3.5 py-2 rounded-2xl bg-slate-950 text-white text-xs font-bold shadow-2xl border border-slate-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap flex items-center gap-2.5">
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] font-black text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Bottom System Status & Quick Actions */}
        <div
          className={`border-t border-slate-200/70 dark:border-slate-800/80 space-y-2 transition-all ${
            isCollapsed ? 'p-2 flex flex-col items-center' : 'p-4'
          }`}
        >
          {!isCollapsed ? (
            <>
              {/* Security Status Card */}
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate font-bold">End-to-End SSL Encryption On</span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-white hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-700 transition-all cursor-pointer shadow-xs border border-rose-200 dark:border-rose-900/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar / Ganti Akun</span>
              </button>
            </>
          ) : (
            <>
              {/* Compact Security Icon */}
              <div className="relative group">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center cursor-help">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-2xl bg-slate-950 text-white text-xs font-semibold shadow-2xl border border-slate-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  End-to-End SSL Encryption On
                </div>
              </div>

              {/* Compact Dark Mode Toggle */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                  title={darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                >
                  {darkMode ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )}
                </button>
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-2xl bg-slate-950 text-white text-xs font-semibold shadow-2xl border border-slate-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {darkMode ? 'Mode Terang' : 'Mode Gelap'}
                </div>
              </div>

              {/* Compact Logout Button */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2.5 rounded-2xl text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer flex items-center justify-center border border-rose-200/50 dark:border-rose-900/40"
                  title="Keluar / Ganti Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-2xl bg-slate-950 text-white text-xs font-semibold shadow-2xl border border-slate-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Keluar / Ganti Akun
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

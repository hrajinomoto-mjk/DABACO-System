import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ReceiptText,
  BarChart3,
  FileSpreadsheet,
  Mail,
  Building2,
  Landmark,
  Database,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Award
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
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; section?: string }> = [
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container with Smooth Dynamic Width Transition */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isCollapsed ? 'w-72 lg:w-20' : 'w-72'
        } ${
          darkMode
            ? 'bg-[#090d16] border-r border-slate-800 text-slate-200'
            : 'bg-white border-r border-slate-200 text-slate-800 shadow-xl'
        }`}
      >
        {/* Brand Header */}
        <div className={`border-b border-slate-200/80 dark:border-slate-800 transition-all ${
          isCollapsed ? 'p-3 flex flex-col items-center gap-3' : 'p-4 sm:p-5 flex items-center justify-between'
        }`}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-11 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-center shrink-0">
                  <AjinomotoLogo variant="full" className="h-7 w-auto" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold tracking-tight text-base text-red-600 dark:text-red-500">DABACO</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-600/10 text-red-700 dark:text-red-400 border border-red-500/20">v2.4</span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[130px]" title="PT Ajinomoto Indonesia - Mojokerto Factory">
                    PT Ajinomoto Indonesia - Mojokerto Factory
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-colors relative"
                  title={darkMode ? 'Ganti ke Mode Terang (Ctrl+D)' : 'Ganti ke Mode Gelap (Ctrl+D)'}
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                  {isAltPressed && (
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[8px] shadow-sm ring-1 ring-amber-300 animate-bounce">
                      ^D
                    </span>
                  )}
                </button>

                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer relative"
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
              <div
                className="w-10 h-10 rounded-xl bg-red-600/10 dark:bg-red-500/10 border border-red-500/20 flex items-center justify-center p-1.5 cursor-pointer shadow-xs group relative"
                onClick={onToggleCollapse}
                title="PT Ajinomoto Indonesia - Klik untuk memperluas (Ctrl+B)"
              >
                <AjinomotoLogo variant="symbol" className="w-6 h-6" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
                {isAltPressed && (
                  <span className="absolute -top-1 -left-1 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-md border border-amber-300 animate-bounce">
                    ^B
                  </span>
                )}
              </div>

              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer relative"
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

        {/* User Session Bar */}
        <div className={`border-b border-slate-200/80 dark:border-slate-850 bg-slate-100/60 dark:bg-white/[0.02] transition-all ${
          isCollapsed ? 'p-2 flex justify-center' : 'px-5 py-3 flex items-center gap-3'
        }`}>
          <div className="relative group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-blue-500/30">
              HR
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-[0_0_6px_#10b981]" />

            {/* Floating Tooltip in Collapsed Mode */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                <p className="font-bold">Admin Controller</p>
                <p className="text-[10px] text-slate-400">HR Development &bull; Online</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-bold truncate ${darkMode ? 'text-white' : 'text-slate-950'}`}>Admin Controller</p>
                <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate">HR Development &bull; Online</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </>
          )}
        </div>

        {/* Navigation List */}
        <div className={`flex-1 overflow-y-auto space-y-1 scrollbar-thin transition-all ${
          isCollapsed ? 'p-2' : 'p-4'
        }`}>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const shortcutNum = idx < 9 ? idx + 1 : null;

            return (
              <React.Fragment key={item.id}>
                {item.section && (
                  isCollapsed ? (
                    <div className="my-2 border-t border-slate-200/60 dark:border-slate-800/60 mx-1.5" />
                  ) : (
                    <p className="px-3 pt-3.5 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {item.section}
                    </p>
                  )
                )}

                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={`w-full rounded-xl text-xs font-semibold transition-all relative group cursor-pointer ${
                    isCollapsed
                      ? 'flex items-center justify-center p-3'
                      : 'flex items-center justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/25'
                      : darkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/90'
                  }`}
                  title={isCollapsed ? `${item.label}${shortcutNum ? ` (Alt+${shortcutNum})` : ''}` : undefined}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="relative">
                      <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400'
                      }`} />
                      {isCollapsed && item.badge && item.badge > 0 ? (
                        <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      ) : null}

                      {isCollapsed && isAltPressed && shortcutNum && (
                        <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-[9px] shadow-lg border border-amber-300 ring-2 ring-amber-400/40 z-20 animate-bounce">
                          {shortcutNum}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isCollapsed && isAltPressed && shortcutNum && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-[10px] shadow-xs flex items-center gap-0.5 animate-bounce">
                        Alt+{shortcutNum}
                      </span>
                    )}

                    {!isCollapsed && item.badge && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Floating Tooltip in Collapsed Mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom System Status & Quick Actions */}
        <div className={`border-t border-slate-200 dark:border-slate-800 space-y-2 transition-all ${
          isCollapsed ? 'p-2 flex flex-col items-center' : 'p-4'
        }`}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate font-medium">End-to-End SSL Encryption On</span>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar / Ganti Akun</span>
              </button>
            </>
          ) : (
            <>
              <div className="relative group">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center cursor-help">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  End-to-End SSL Encryption On
                </div>
              </div>

              <div className="relative group">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                  title={darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                </div>
              </div>

              <div className="relative group">
                <button
                  onClick={onLogout}
                  className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer flex items-center justify-center"
                  title="Keluar / Ganti Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
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

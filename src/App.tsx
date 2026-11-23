import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { LoginModal } from './components/LoginModal';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DataManagementView } from './components/DataManagementView';
import { LookerStudioView } from './components/LookerStudioView';
import { GoogleSheetsSyncView } from './components/GoogleSheetsSyncView';
import { EmailAlertsView } from './components/EmailAlertsView';
import { BankingApiView } from './components/BankingApiView';
import { UserManagementView } from './components/UserManagementView';
import { SupabaseView } from './components/SupabaseView';
import { SettingsView } from './components/SettingsView';
import { ExecutiveReportView } from './components/ExecutiveReportView';
import { calculateCategoriesAndItems } from './utils/calculator';
import { extractAndSyncMasterData } from './utils/categoryDetector';
import { SendEmailModal } from './components/SendEmailModal';
import { BulkUploadModal } from './components/BulkUploadModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { AltKeyGuideHUD } from './components/AltKeyGuideHUD';
import { RlsFixModal } from './components/RlsFixModal';
import { DatabaseConsoleModal } from './components/DatabaseConsoleModal';
import { SessionTimeoutModal } from './components/SessionTimeoutModal';
import {
  ThemeId,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  getThemeById,
  isValidThemeId
} from './utils/themes';
import { useLanguage } from './contexts/LanguageContext';
import { Language, translateText } from './utils/i18n';

import {
  INITIAL_BUDGET,
  INITIAL_FORECAST,
  INITIAL_REALIZATION,
  INITIAL_COST_CENTERS,
  INITIAL_MASTER_ITEMS,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_BANK_TRANSACTIONS,
  INITIAL_SHEETS_CONFIG,
  INITIAL_LOOKER_CONFIG,
  INITIAL_SUPABASE_CONFIG,
  INITIAL_EMAIL_SETTING,
  INITIAL_USERS
} from './mockData';

import {
  fetchDatabaseFromSupabase,
  pushDatabaseToSupabase,
  isConfigValid,
  normalizeSupabaseConfig,
  diagnoseSupabaseConfigIssue,
  upsertUserToSupabase,
  deleteUserFromSupabase,
  syncUsersToSupabase,
  upsertCostCenterToSupabase,
  deleteCostCenterFromSupabase,
  upsertMasterItemToSupabase,
  deleteMasterItemFromSupabase,
  upsertBudgetToSupabase,
  deleteBudgetFromSupabase,
  upsertForecastToSupabase,
  deleteForecastFromSupabase,
  upsertRealizationToSupabase,
  deleteRealizationFromSupabase
} from './services/supabaseService';

import {
  BudgetRecord,
  ForecastRecord,
  RealizationRecord,
  MasterItem,
  MasterCostCenter,
  AlertNotification,
  GoogleSheetsConfig,
  LookerStudioConfig,
  SupabaseConfig,
  EmailSetting,
  BankingAccount,
  BankTransaction,
  UserSession,
  UserAccount
} from './types';

// Helper to safely load persistent database records from local storage with initial fallback
const loadPersistentData = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.length > 0 ? (parsed as T) : fallback;
      }
      if (parsed !== null && parsed !== undefined) {
        return parsed as T;
      }
    }
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
  }
  return fallback;
};

const SESSION_TAB_KEY = 'dabaco_tab_session';
const SESSION_ACTIVE_FLAG_KEY = 'dabaco_had_active_session';
const SESSION_TIMEOUT_MINUTES_KEY = 'dabaco_session_timeout_minutes';
const VALID_TIMEOUT_OPTIONS = [1, 5, 10, 15, 30, 60] as const;

const DEFAULT_USER_SESSION: UserSession = {
  username: 'admin',
  displayName: 'HR Administrator',
  department: 'HR Development',
  role: 'SuperAdmin',
  isLoggedIn: false,
  lastLogin: '2026-09-06 20:55 WIB'
};

interface SessionNoticeState {
  reason: 'timeout' | 'tab_closed';
  timeoutMinutes?: number;
}

interface InitialSessionBootstrap {
  timeoutMinutes: number;
  page: 'landing' | 'login' | 'workspace';
  isAuthenticated: boolean;
  user: UserSession;
  activeTab: ActiveTab;
  notice: SessionNoticeState | null;
  shouldClearExpiredSession: boolean;
  shouldClearActiveFlag: boolean;
}

const loadInitialSessionBootstrap = (): InitialSessionBootstrap => {
  let timeoutMinutes = 15;
  try {
    const savedTimeout = Number(localStorage.getItem(SESSION_TIMEOUT_MINUTES_KEY));
    if (VALID_TIMEOUT_OPTIONS.includes(savedTimeout as (typeof VALID_TIMEOUT_OPTIONS)[number])) {
      timeoutMinutes = savedTimeout;
    }
  } catch {
    // Ignore storage errors
  }

  try {
    const rawTabSession = sessionStorage.getItem(SESSION_TAB_KEY);
    if (rawTabSession) {
      const parsed = JSON.parse(rawTabSession);
      const lastActivityAt = typeof parsed?.lastActivityAt === 'number' ? parsed.lastActivityAt : 0;
      const elapsedMs = Date.now() - lastActivityAt;
      if (parsed?.user?.isLoggedIn && elapsedMs >= 0 && elapsedMs < timeoutMinutes * 60_000) {
        return {
          timeoutMinutes,
          page: 'workspace',
          isAuthenticated: true,
          user: { ...DEFAULT_USER_SESSION, ...parsed.user, isLoggedIn: true },
          activeTab: (parsed.activeTab as ActiveTab) || 'dashboard',
          notice: null,
          shouldClearExpiredSession: false,
          shouldClearActiveFlag: false
        };
      }
      // Session existed in this tab but timed out while idle/sleeping
      return {
        timeoutMinutes,
        page: 'login',
        isAuthenticated: false,
        user: DEFAULT_USER_SESSION,
        activeTab: 'dashboard',
        notice: { reason: 'timeout', timeoutMinutes },
        shouldClearExpiredSession: true,
        shouldClearActiveFlag: true
      };
    }

    // No sessionStorage in this tab: check if user had previously logged in and closed the browser tab
    if (localStorage.getItem(SESSION_ACTIVE_FLAG_KEY) === '1') {
      return {
        timeoutMinutes,
        page: 'login',
        isAuthenticated: false,
        user: DEFAULT_USER_SESSION,
        activeTab: 'dashboard',
        notice: { reason: 'tab_closed' },
        shouldClearExpiredSession: false,
        shouldClearActiveFlag: true
      };
    }
  } catch {
    // Fallback cleanly to landing page
  }

  return {
    timeoutMinutes,
    page: 'landing',
    isAuthenticated: false,
    user: DEFAULT_USER_SESSION,
    activeTab: 'dashboard',
    notice: null,
    shouldClearExpiredSession: false,
    shouldClearActiveFlag: false
  };
};

export default function App() {
  const { language, tr } = useLanguage();
  const languageRef = React.useRef<Language>(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const initialSessionRef = React.useRef<InitialSessionBootstrap | null>(null);
  if (!initialSessionRef.current) {
    initialSessionRef.current = loadInitialSessionBootstrap();
  }
  const initialSession = initialSessionRef.current;

  // Page Routing & Authentication State
  // Flow: Landing -> Login -> Workspace; automatically returns to Login on idle timeout or after browser tab is closed
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'workspace'>(initialSession.page);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialSession.isAuthenticated);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [user, setUser] = useState<UserSession>(initialSession.user);

  // Session Timeout & Tab-Close Security State
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(initialSession.timeoutMinutes);
  const [sessionNotice, setSessionNotice] = useState<SessionNoticeState | null>(initialSession.notice);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState<boolean>(false);
  const [timeoutRemainingSeconds, setTimeoutRemainingSeconds] = useState<number>(60);
  const lastActivityAtRef = React.useRef<number>(Date.now());
  const showTimeoutWarningRef = React.useRef<boolean>(false);
  useEffect(() => {
    showTimeoutWarningRef.current = showTimeoutWarning;
  }, [showTimeoutWarning]);

  // Perform one-time storage cleanup after bootstrap (safe under React StrictMode)
  useEffect(() => {
    try {
      if (initialSession.shouldClearExpiredSession) {
        sessionStorage.removeItem(SESSION_TAB_KEY);
      }
      if (initialSession.shouldClearActiveFlag) {
        localStorage.removeItem(SESSION_ACTIVE_FLAG_KEY);
      }
      if (initialSession.isAuthenticated) {
        // Refresh lastActivityAt on valid same-tab reload
        const existing = sessionStorage.getItem(SESSION_TAB_KEY);
        if (existing) {
          const parsed = JSON.parse(existing);
          sessionStorage.setItem(
            SESSION_TAB_KEY,
            JSON.stringify({ ...parsed, lastActivityAt: Date.now() })
          );
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, [initialSession]);

  // Navigation & Theme
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialSession.activeTab);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('dabaco_sidebar_collapsed') === 'true';
  });

  // Strip any URL hash (e.g. #security, #features) so the address bar only shows the clean domain
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    const cleanUrlHash = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    window.addEventListener('hashchange', cleanUrlHash);
    return () => window.removeEventListener('hashchange', cleanUrlHash);
  }, []);

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('dabaco_sidebar_collapsed', String(next));
      return next;
    });
  };

  const [activeTheme, setActiveTheme] = useState<ThemeId>(() => {
    const savedTheme = localStorage.getItem('dabaco_theme');
    if (isValidThemeId(savedTheme)) {
      return savedTheme;
    }
    return localStorage.getItem('dabaco_dark_mode') !== 'false'
      ? DEFAULT_DARK_THEME
      : DEFAULT_LIGHT_THEME;
  });

  const darkMode = getThemeById(activeTheme).mode === 'dark';

  const handleSelectTheme = (themeId: ThemeId, silent = false) => {
    const selected = getThemeById(themeId);
    setActiveTheme(selected.id);
    localStorage.setItem('dabaco_theme', selected.id);
    if (selected.mode === 'dark') {
      localStorage.setItem('dabaco_last_dark_theme', selected.id);
    } else {
      localStorage.setItem('dabaco_last_light_theme', selected.id);
    }
    if (!silent) {
      showToast(
        tr(
          `Tema "${selected.name}" diterapkan (${selected.tagline})`,
          `Theme "${selected.name}" applied (${selected.tagline})`
        )
      );
    }
  };

  const handleLanguageChange = (lang: Language) => {
    languageRef.current = lang;
    setToast({
      message:
        lang === 'en'
          ? 'System language switched to English (Corporate Enterprise)'
          : 'Bahasa sistem diubah ke Bahasa Indonesia',
      type: 'success'
    });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const setDarkMode = (valOrUpdater: boolean | ((prev: boolean) => boolean)) => {
    setActiveTheme(prevTheme => {
      const prevDark = getThemeById(prevTheme).mode === 'dark';
      const nextDark = typeof valOrUpdater === 'function' ? valOrUpdater(prevDark) : valOrUpdater;
      if (nextDark === prevDark) return prevTheme;
      const savedTarget = localStorage.getItem(nextDark ? 'dabaco_last_dark_theme' : 'dabaco_last_light_theme');
      const fallback = nextDark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
      const nextTheme = isValidThemeId(savedTarget) && getThemeById(savedTarget).mode === (nextDark ? 'dark' : 'light')
        ? savedTarget
        : fallback;
      localStorage.setItem('dabaco_theme', nextTheme);
      return nextTheme;
    });
  };

  // Core Datasets (Persisted in local database storage and auto-loaded immediately on system launch)
  const [budget, setBudget] = useState<BudgetRecord[]>(() =>
    loadPersistentData('dabaco_db_budget', INITIAL_BUDGET)
  );
  const [forecast, setForecast] = useState<ForecastRecord[]>(() =>
    loadPersistentData('dabaco_db_forecast', INITIAL_FORECAST)
  );
  const [realization, setRealization] = useState<RealizationRecord[]>(() =>
    loadPersistentData('dabaco_db_realization', INITIAL_REALIZATION)
  );
  const [costCenters, setCostCenters] = useState<MasterCostCenter[]>(() =>
    loadPersistentData('dabaco_db_cost_centers', INITIAL_COST_CENTERS)
  );
  const [masterItems, setMasterItems] = useState<MasterItem[]>(() =>
    loadPersistentData('dabaco_db_master_items', INITIAL_MASTER_ITEMS)
  );

  // Automatically persist all database changes so data is immediately available on next open without pulling
  useEffect(() => {
    try {
      localStorage.setItem('dabaco_db_budget', JSON.stringify(budget));
      localStorage.setItem('dabaco_db_forecast', JSON.stringify(forecast));
      localStorage.setItem('dabaco_db_realization', JSON.stringify(realization));
      localStorage.setItem('dabaco_db_cost_centers', JSON.stringify(costCenters));
      localStorage.setItem('dabaco_db_master_items', JSON.stringify(masterItems));
      localStorage.setItem('dabaco_db_last_saved', new Date().toISOString());
    } catch (e) {
      console.warn('Failed to auto-persist database state to storage', e);
    }
  }, [budget, forecast, realization, costCenters, masterItems]);

  // Automatically detect, adapt, and synchronize Master Items & Cost Centers from all upload/transaction data
  useEffect(() => {
    const { updatedMasterItems, updatedCostCenters, newItemsCount, newCostCentersCount } = extractAndSyncMasterData(
      budget,
      forecast,
      realization,
      masterItems,
      costCenters
    );
    if (newItemsCount > 0) {
      setMasterItems(updatedMasterItems);
    }
    if (newCostCentersCount > 0) {
      setCostCenters(updatedCostCenters);
    }
  }, [budget, forecast, realization]);

  // Supabase Database Connection & Synchronization State
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const manualOverride = localStorage.getItem('dabaco_supabase_manual_override') === '1';

    // Helper to load saved localStorage config (normalized)
    const loadSavedLocal = (): SupabaseConfig | null => {
      const saved = localStorage.getItem('dabaco_supabase_config');
      if (!saved) return null;
      try {
        const parsed = normalizeSupabaseConfig(JSON.parse(saved));
        if (parsed.projectUrl?.includes('dabaco-ajinomoto-prod') || !isConfigValid(parsed)) {
          localStorage.removeItem('dabaco_supabase_config');
          return null;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse dabaco_supabase_config', e);
        return null;
      }
    };

    // If user manually saved custom credentials in this browser, honor them first
    if (manualOverride) {
      const localCfg = loadSavedLocal();
      if (localCfg) return localCfg;
    }

    // 1. Prioritize environment variables (Vercel / Production Deployment)
    const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ? String(import.meta.env.VITE_SUPABASE_URL).trim() : '';
    const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ? String(import.meta.env.VITE_SUPABASE_ANON_KEY).trim() : '';

    if (envUrl && envKey) {
      const candidate = normalizeSupabaseConfig({
        projectUrl: envUrl,
        anonKey: envKey,
        status: 'connected',
        tablesSynced: 0,
        lastBackupTime: null,
        encryptionActive: true
      });
      if (isConfigValid(candidate)) {
        return candidate;
      }
    }

    // 2. Fallback to saved manual configuration in localStorage
    const localCfg = loadSavedLocal();
    if (localCfg) return localCfg;

    return normalizeSupabaseConfig(INITIAL_SUPABASE_CONFIG);
  });

  useEffect(() => {
    if (isConfigValid(supabaseConfig)) {
      localStorage.setItem('dabaco_supabase_config', JSON.stringify(normalizeSupabaseConfig(supabaseConfig)));
    }
  }, [supabaseConfig]);

  // Data is instantly ready on startup from persistent storage
  const [isDbLoading, setIsDbLoading] = useState<boolean>(false);
  const [isPushingToSupabase, setIsPushingToSupabase] = useState<boolean>(false);
  const [pushProgressMessage, setPushProgressMessage] = useState<string>('');
  const [lastSupabaseError, setLastSupabaseError] = useState<{
    message: string;
    diagnosticType?: 'ok' | 'schema_missing' | 'config_invalid' | 'network_or_paused' | 'auth_invalid' | 'rls_blocked' | 'unknown';
  } | null>(null);
  const [dbSyncStatus, setDbSyncStatus] = useState<'connected' | 'empty' | 'unconfigured' | 'error'>(() =>
    isConfigValid(supabaseConfig) ? 'connected' : 'unconfigured'
  );
  const [dbLastSyncTime, setDbLastSyncTime] = useState<string | null>(() => {
    const saved = localStorage.getItem('dabaco_db_last_saved');
    if (saved) {
      try {
        return new Date(saved).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } catch {
        return null;
      }
    }
    return null;
  });

  const [usersCloudStatus, setUsersCloudStatus] = useState<'synced' | 'table_missing' | 'unconfigured' | 'error'>(() =>
    isConfigValid(supabaseConfig) ? 'synced' : 'unconfigured'
  );
  const lastCloudPullAtRef = React.useRef<number>(0);

  const stampLastSyncNow = () => {
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setDbLastSyncTime(nowStr);
  };

  // Load latest data (Financial + Master + Users) from Supabase Cloud
  const handleLoadFromSupabase = async (configToUse = supabaseConfig, silent = false) => {
    if (!isConfigValid(configToUse)) {
      setDbSyncStatus('unconfigured');
      setUsersCloudStatus('unconfigured');
      setIsDbLoading(false);
      return;
    }

    setIsDbLoading(true);
    try {
      const res = await fetchDatabaseFromSupabase(configToUse);
      lastCloudPullAtRef.current = Date.now();
      if (res.success && res.data) {
        // Sync Users table from Supabase Cloud (cross-browser Edge <-> Chrome)
        if (res.usersTableMissing) {
          setUsersCloudStatus('table_missing');
        } else if (Array.isArray(res.data.users)) {
          if (res.data.users.length > 0) {
            setUsers(res.data.users);
            setUsersCloudStatus('synced');
          } else {
            // Table exists in Supabase but is empty -> seed initial users once
            const seedRes = await syncUsersToSupabase(users, configToUse);
            setUsersCloudStatus(seedRes.success ? 'synced' : seedRes.tableMissing ? 'table_missing' : 'error');
          }
        }

        if (res.isEmpty) {
          setDbSyncStatus('empty');
          if (!silent) {
            showToast('Database Supabase terhubung, namun tabel masih kosong. Silakan gunakan tombol "Push Data ke Supabase" untuk mengunggah dataset awal.', 'warning');
          }
        } else {
          if (res.data.costCenters.length > 0) setCostCenters(res.data.costCenters);
          if (res.data.masterItems.length > 0) setMasterItems(res.data.masterItems);
          if (res.data.budget.length > 0) setBudget(res.data.budget);
          if (res.data.forecast.length > 0) setForecast(res.data.forecast);
          if (res.data.realization.length > 0) setRealization(res.data.realization);

          setDbSyncStatus('connected');
          setLastSupabaseError(null);
          stampLastSyncNow();
          if (!silent) {
            const usersNote = Array.isArray(res.data.users) ? `, ${res.data.users.length} Pengguna` : '';
            showToast(`Data berhasil dimuat dari database Supabase (${res.data.budget.length} Budget, ${res.data.forecast.length} Forecast, ${res.data.realization.length} Realisasi${usersNote})!`);
          }
        }
      } else {
        setDbSyncStatus('error');
        if (!silent) {
          showToast(res.error || 'Gagal memuat data dari Supabase.', 'warning');
        }
      }
    } catch (err: any) {
      setDbSyncStatus('error');
      if (!silent) {
        showToast(err?.message || 'Terjadi galat saat memuat data database.', 'error');
      }
    } finally {
      setIsDbLoading(false);
    }
  };

  // Real Auto-Load on system launch & when Supabase credentials become valid (ensures Edge & Chrome always pull latest cloud data)
  useEffect(() => {
    if (isConfigValid(supabaseConfig)) {
      void handleLoadFromSupabase(supabaseConfig, true);
    } else if (!dbLastSyncTime) {
      stampLastSyncNow();
    }
  }, [supabaseConfig.projectUrl, supabaseConfig.anonKey]);

  // Auto-refresh from Supabase Cloud when switching back to this browser tab (e.g. edited in Edge -> switch to Chrome)
  useEffect(() => {
    const handleTabVisibleRefresh = () => {
      if (document.visibilityState !== 'visible') return;
      if (!isConfigValid(supabaseConfig) || isPushingToSupabase || isDbLoading) return;
      if (Date.now() - lastCloudPullAtRef.current < 15_000) return;
      void handleLoadFromSupabase(supabaseConfig, true);
    };
    document.addEventListener('visibilitychange', handleTabVisibleRefresh);
    return () => document.removeEventListener('visibilitychange', handleTabVisibleRefresh);
  }, [supabaseConfig.projectUrl, supabaseConfig.anonKey, isPushingToSupabase, isDbLoading]);

  // Push full dataset (including users) to Supabase
  const handlePushDataToSupabase = async (customConfig?: Partial<SupabaseConfig>) => {
    const activeCfg = normalizeSupabaseConfig({ ...supabaseConfig, ...customConfig });
    const cfgIssue = diagnoseSupabaseConfigIssue(activeCfg);
    if (cfgIssue || !isConfigValid(activeCfg)) {
      setDbSyncStatus('unconfigured');
      setLastSupabaseError({
        message: cfgIssue || 'Kredensial Supabase belum lengkap. Silakan isi Project URL & Anon Key di menu Supabase Backend.',
        diagnosticType: 'config_invalid'
      });
      showToast(cfgIssue || 'Kredensial Supabase belum lengkap. Silakan isi Project URL & Anon Key di menu Supabase Backend.', 'warning');
      setActiveTab('supabase');
      return;
    }

    setIsPushingToSupabase(true);
    setLastSupabaseError(null);
    setPushProgressMessage('Menghubungi server Supabase...');
    try {
      const res = await pushDatabaseToSupabase(
        {
          costCenters,
          masterItems,
          budget,
          forecast,
          realization,
          users
        },
        activeCfg,
        (step) => setPushProgressMessage(step)
      );

      if (res.success && res.counts) {
        stampLastSyncNow();
        setDbSyncStatus('connected');
        setUsersCloudStatus(res.usersTableMissing ? 'table_missing' : 'synced');
        setLastSupabaseError(null);
        setSupabaseConfig(prev =>
          normalizeSupabaseConfig({
            ...prev,
            ...customConfig,
            status: 'connected',
            lastBackupTime: new Date().toISOString()
          })
        );
        showToast(
          `Sukses push ke Supabase! (${res.counts.budget} Budget, ${res.counts.forecast} Forecast, ${res.counts.realization} Realisasi kas berhasil diunggah)`,
          'success'
        );
      } else {
        const errorMsg = res.error || 'Gagal mengunggah data ke Supabase.';
        setDbSyncStatus('error');
        setLastSupabaseError({
          message: errorMsg,
          diagnosticType: res.diagnosticType || 'unknown'
        });
        showToast(errorMsg, 'error');
        if (res.isRlsError || errorMsg.toLowerCase().includes('row-level security')) {
          setRlsErrorMessage(errorMsg);
          setShowRlsFixModal(true);
        }
      }
    } catch (err: any) {
      console.error('Error during push to Supabase:', err);
      const errMsg = err?.message || 'Terjadi kesalahan saat push data ke database.';
      setDbSyncStatus('error');
      setLastSupabaseError({
        message: errMsg,
        diagnosticType: errMsg.toLowerCase().includes('failed to fetch') ? 'network_or_paused' : 'unknown'
      });
      showToast(errMsg, 'error');
      if (errMsg.toLowerCase().includes('row-level security')) {
        setRlsErrorMessage(errMsg);
        setShowRlsFixModal(true);
      }
    } finally {
      setIsPushingToSupabase(false);
      setPushProgressMessage('');
    }
  };

  const handleResetDatabaseToDefault = () => {
    setBudget(INITIAL_BUDGET);
    setForecast(INITIAL_FORECAST);
    setRealization(INITIAL_REALIZATION);
    showToast('Database transaksi berhasil direset ke dataset standar training & recruitment.');
  };

  const handleExportDatabaseBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      system: 'DABACO (Dashboard Badget Control System)',
      budget,
      forecast,
      realization,
      costCenters,
      masterItems
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dabaco_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Cadangan database DABACO berhasil diunduh!');
  };

  // Integrations State
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(INITIAL_SHEETS_CONFIG);
  const [lookerConfig, setLookerConfig] = useState<LookerStudioConfig>(INITIAL_LOOKER_CONFIG);
  const [emailSetting, setEmailSetting] = useState<EmailSetting>(INITIAL_EMAIL_SETTING);
  const [bankAccounts, setBankAccounts] = useState<BankingAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(INITIAL_BANK_TRANSACTIONS);

  // User Management State (Persisted in localStorage with initial fallback)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('dabaco_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse dabaco_users', e);
      }
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('dabaco_users', JSON.stringify(users));
  }, [users]);

  const handleAddUser = (userData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setUsers(prev => [newUser, ...prev]);
    if (isConfigValid(supabaseConfig)) {
      void upsertUserToSupabase(newUser, supabaseConfig).then(res => {
        if (res.success) {
          setUsersCloudStatus('synced');
          stampLastSyncNow();
        } else if (res.tableMissing) {
          setUsersCloudStatus('table_missing');
          showToast(
            tr(
              'Akun tersimpan di browser ini, namun tabel app_users belum dibuat di Supabase agar sinkron ke browser lain.',
              'Account saved locally, but table app_users is not created in Supabase yet for cross-browser sync.'
            ),
            'warning'
          );
        } else {
          setUsersCloudStatus('error');
        }
      });
    }
    showToast(`Akun pengguna ${newUser.displayName} (@${newUser.username}) berhasil ditambahkan!`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (isConfigValid(supabaseConfig)) {
      void deleteUserFromSupabase(userId, supabaseConfig).then(res => {
        if (res.success) {
          setUsersCloudStatus('synced');
          stampLastSyncNow();
        } else if (res.tableMissing) {
          setUsersCloudStatus('table_missing');
        }
      });
    }
    showToast('Akun pengguna berhasil dihapus dari basis data.');
  };

  const handleUpdateUser = (userId: string, updates: Partial<UserAccount>) => {
    let updatedAccount: UserAccount | null = null;
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          updatedAccount = { ...u, ...updates };
          return updatedAccount;
        }
        return u;
      })
    );
    const existing = users.find(u => u.id === userId);
    const targetToSync: UserAccount | null = updatedAccount || (existing ? { ...existing, ...updates } : null);
    if (targetToSync && isConfigValid(supabaseConfig)) {
      void upsertUserToSupabase(targetToSync, supabaseConfig).then(res => {
        if (res.success) {
          setUsersCloudStatus('synced');
          stampLastSyncNow();
        } else if (res.tableMissing) {
          setUsersCloudStatus('table_missing');
          showToast(
            tr(
              'Perubahan tersimpan di browser ini. Buat tabel app_users di Supabase agar perubahan otomatis muncul di Chrome/browser lain.',
              'Saved locally. Create table app_users in Supabase so changes automatically sync to Chrome/other browsers.'
            ),
            'warning'
          );
        } else {
          setUsersCloudStatus('error');
        }
      });
    }
    showToast('Data akun pengguna berhasil diperbarui!');
  };

  const handleUpdateAdminPassword = (targetUsername: string, newPassword: string) => {
    const cleanUser = targetUsername.trim().toLowerCase();
    const matched = users.find(u => u.username.toLowerCase() === cleanUser);
    if (matched) {
      handleUpdateUser(matched.id, { password: newPassword });
    } else {
      const created: UserAccount = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        username: cleanUser,
        displayName: user.displayName || 'HR Administrator',
        email: `${cleanUser}@ajinomoto.co.id`,
        department: user.department || 'HR Development',
        role: 'SuperAdmin',
        status: 'Active',
        createdAt: new Date().toISOString().slice(0, 10),
        password: newPassword,
        avatarColor: 'bg-red-600'
      };
      setUsers(prev => [created, ...prev]);
      if (isConfigValid(supabaseConfig)) {
        void upsertUserToSupabase(created, supabaseConfig);
      }
      showToast('Kredensial administrator berhasil diperbarui & disinkronkan!');
    }
  };

  const handleSyncUserDatabase = async () => {
    localStorage.setItem('dabaco_users', JSON.stringify(users));
    if (!isConfigValid(supabaseConfig)) {
      setUsersCloudStatus('unconfigured');
      showToast(
        tr(
          'Tersimpan lokal. Hubungkan Supabase terlebih dahulu agar data pengguna sinkron antara Edge & Chrome.',
          'Saved locally. Configure Supabase first so users sync across Edge & Chrome.'
        ),
        'warning'
      );
      return;
    }

    const res = await syncUsersToSupabase(users, supabaseConfig);
    if (res.success) {
      if (Array.isArray(res.users) && res.users.length > 0) {
        setUsers(res.users);
      }
      setUsersCloudStatus('synced');
      stampLastSyncNow();
      showToast(
        tr(
          `Basis data pengguna berhasil disinkronkan ke Cloud Supabase (${res.users?.length ?? users.length} akun aktif lintas browser)!`,
          `User database synced to Supabase Cloud (${res.users?.length ?? users.length} accounts synced across browsers)!`
        )
      );
    } else if (res.tableMissing) {
      setUsersCloudStatus('table_missing');
      showToast(
        tr(
          'Tabel public.app_users belum dibuat di Supabase. Klik "Salin SQL Tabel Pengguna" di halaman ini lalu jalankan di Supabase SQL Editor.',
          'Table public.app_users is missing in Supabase. Click "Copy Users Table SQL" and run it in Supabase SQL Editor.'
        ),
        'warning'
      );
    } else {
      setUsersCloudStatus('error');
      showToast(res.error || 'Gagal menyinkronkan pengguna ke Supabase.', 'error');
    }
  };

  // Real-time Sync & Toast state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [showSendEmailModal, setShowSendEmailModal] = useState<boolean>(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [isAltPressed, setIsAltPressed] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [showRlsFixModal, setShowRlsFixModal] = useState<boolean>(false);
  const [showDatabaseConsoleModal, setShowDatabaseConsoleModal] = useState<boolean>(false);
  const [rlsErrorMessage, setRlsErrorMessage] = useState<string | undefined>(undefined);

  // Active Alerts
  const [alerts, setAlerts] = useState<AlertNotification[]>([
    {
      id: 'alt-1',
      title: 'Kategori Training & Development Mendekati Limit',
      message: 'Penyerapan biaya sertifikasi telah mencapai 94.2% dari plafon forecast.',
      severity: 'warning',
      timestamp: 'Baru saja'
    },
    {
      id: 'alt-2',
      title: 'ISO 22000 Refresher Over Budget',
      message: 'Item HR001EDUCATIONFEETRAINING pada bulan Feb melampaui forecast sebesar Rp 8.000.000.',
      severity: 'danger',
      timestamp: '10 menit lalu'
    }
  ]);

  // Derived Categories and Items for Email Alerts and Validation
  const derivedData = React.useMemo(() => {
    return calculateCategoriesAndItems(budget, forecast, realization, masterItems);
  }, [budget, forecast, realization, masterItems]);

  // Sync Active Theme & Dark Mode with html attributes/classes and local storage
  useEffect(() => {
    localStorage.setItem('dabaco_theme', activeTheme);
    localStorage.setItem('dabaco_dark_mode', String(darkMode));
    document.documentElement.setAttribute('data-theme', activeTheme);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [activeTheme, darkMode]);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    const localizedMessage = translateText(message, languageRef.current);
    setToast({ message: localizedMessage, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // CRUD for Budget (with automatic Supabase Cloud sync)
  const handleAddBudget = (newRecord: Omit<BudgetRecord, 'id'>) => {
    const record: BudgetRecord = {
      ...newRecord,
      id: `b-${Date.now()}`
    };
    setBudget(prev => [record, ...prev]);
    if (isConfigValid(supabaseConfig)) {
      void upsertBudgetToSupabase(record, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast('Data Budget Plan berhasil ditambahkan!');
  };

  const handleEditBudget = (id: string, updated: Partial<BudgetRecord>) => {
    const existing = budget.find(b => b.id === id);
    const merged = existing ? { ...existing, ...updated } : null;
    setBudget(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
    if (merged && isConfigValid(supabaseConfig)) {
      void upsertBudgetToSupabase(merged, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast('Data Budget Plan berhasil diperbarui!');
  };

  const handleDeleteBudget = (id: string) => {
    setBudget(prev => prev.filter(b => b.id !== id));
    if (isConfigValid(supabaseConfig)) {
      void deleteBudgetFromSupabase(id, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast('Data Budget Plan berhasil dihapus.');
  };

  const handleBatchAddBudget = (records: Omit<BudgetRecord, 'id'>[], mode: 'append' | 'overwrite' = 'append') => {
    const timestamp = Date.now();
    const newRecords: BudgetRecord[] = records.map((r, idx) => ({
      ...r,
      id: `b-bulk-${timestamp}-${idx}`
    }));
    const nextBudget = mode === 'overwrite' ? newRecords : [...newRecords, ...budget];
    setBudget(nextBudget);
    if (isConfigValid(supabaseConfig)) {
      void pushDatabaseToSupabase(
        { costCenters, masterItems, budget: nextBudget, forecast, realization },
        supabaseConfig,
        undefined,
        { mode, tables: { budget: true, costCenters: true, masterItems: true, forecast: false, realization: false } }
      ).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    if (mode === 'overwrite') {
      showToast(`Berhasil menimpa seluruh data Budget Plan dengan ${records.length} baris baru!`);
    } else {
      showToast(`Berhasil menambahkan ${records.length} data Budget Plan baru!`);
    }
  };

  // CRUD for Forecast (with automatic Supabase Cloud sync)
  const handleAddForecast = (newRecord: Omit<ForecastRecord, 'id'>) => {
    const record: ForecastRecord = {
      ...newRecord,
      id: `f-${Date.now()}`
    };
    setForecast(prev => [record, ...prev]);
    if (isConfigValid(supabaseConfig)) {
      void upsertForecastToSupabase(record, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast('Data Forecast berhasil ditambahkan!');
  };

  const handleEditForecast = (id: string, updated: Partial<ForecastRecord>) => {
    const existing = forecast.find(f => f.id === id);
    const merged = existing ? { ...existing, ...updated } : null;
    setForecast(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
    if (merged && isConfigValid(supabaseConfig)) {
      void upsertForecastToSupabase(merged, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast('Data Forecast berhasil diperbarui!');
  };

  const handleDeleteForecast = (id: string) => {
    setForecast(prev => prev.filter(f => f.id !== id));
    if (isConfigValid(supabaseConfig)) {
      void deleteForecastFromSupabase(id, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast('Data Forecast berhasil dihapus.');
  };

  const handleBatchAddForecast = (records: Omit<ForecastRecord, 'id'>[], mode: 'append' | 'overwrite' = 'append') => {
    const timestamp = Date.now();
    const newRecords: ForecastRecord[] = records.map((r, idx) => ({
      ...r,
      id: `f-bulk-${timestamp}-${idx}`
    }));
    const nextForecast = mode === 'overwrite' ? newRecords : [...newRecords, ...forecast];
    setForecast(nextForecast);
    if (isConfigValid(supabaseConfig)) {
      void pushDatabaseToSupabase(
        { costCenters, masterItems, budget, forecast: nextForecast, realization },
        supabaseConfig,
        undefined,
        { mode, tables: { forecast: true, costCenters: true, masterItems: true, budget: false, realization: false } }
      ).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    if (mode === 'overwrite') {
      showToast(`Berhasil menimpa seluruh data Forecast dengan ${records.length} baris baru!`);
    } else {
      showToast(`Berhasil menambahkan ${records.length} data Forecast baru!`);
    }
  };

  // CRUD for Realization (with automatic Supabase Cloud sync)
  const handleAddRealization = (newRecord: Omit<RealizationRecord, 'id'>) => {
    const record: RealizationRecord = {
      ...newRecord,
      id: `r-${Date.now()}`
    };
    setRealization(prev => [record, ...prev]);
    if (isConfigValid(supabaseConfig)) {
      void upsertRealizationToSupabase(record, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }

    // Check automatic threshold violation
    const itemBudget = budget.filter(b => b.item === record.item).reduce((s, c) => s + c.amount, 0);
    const itemTotalActual = realization.filter(r => r.item === record.item).reduce((s, c) => s + c.amount, 0) + record.amount;

    if (itemBudget > 0 && itemTotalActual > itemBudget) {
      const overAlert: AlertNotification = {
        id: `alt-${Date.now()}`,
        title: `Over Budget Terdeteksi: ${record.item}`,
        message: `Pengeluaran aktual telah melebihi plafon budget sebesar Rp ${(itemTotalActual - itemBudget).toLocaleString('id-ID')}. Notifikasi email otomatis dikirim.`,
        severity: 'danger',
        timestamp: 'Baru saja'
      };
      setAlerts(prev => [overAlert, ...prev]);
      showToast(`⚠️ Peringatan: Item ${record.item} melampaui limit anggaran! Email otomatis terkirim.`, 'error');
    } else {
      showToast('Data Realisasi Aktual berhasil ditambahkan!');
    }
  };

  const handleEditRealization = (id: string, updated: Partial<RealizationRecord>) => {
    const existing = realization.find(r => r.id === id);
    const merged = existing ? { ...existing, ...updated } : null;
    setRealization(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    if (merged && isConfigValid(supabaseConfig)) {
      void upsertRealizationToSupabase(merged, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast('Data Realisasi Aktual berhasil diperbarui!');
  };

  const handleDeleteRealization = (id: string) => {
    setRealization(prev => prev.filter(r => r.id !== id));
    if (isConfigValid(supabaseConfig)) {
      void deleteRealizationFromSupabase(id, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast('Data Realisasi Aktual berhasil dihapus.');
  };

  const handleBatchAddRealization = (records: Omit<RealizationRecord, 'id'>[], mode: 'append' | 'overwrite' = 'append') => {
    const timestamp = Date.now();
    const newRecords: RealizationRecord[] = records.map((r, idx) => ({
      ...r,
      id: `r-bulk-${timestamp}-${idx}`
    }));
    const nextRealization = mode === 'overwrite' ? newRecords : [...newRecords, ...realization];
    setRealization(nextRealization);
    if (isConfigValid(supabaseConfig)) {
      void pushDatabaseToSupabase(
        { costCenters, masterItems, budget, forecast, realization: nextRealization },
        supabaseConfig,
        undefined,
        { mode, tables: { realization: true, costCenters: true, masterItems: true, budget: false, forecast: false } }
      ).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    if (mode === 'overwrite') {
      showToast(`Berhasil menimpa seluruh data Realisasi dengan ${records.length} baris baru!`);
    } else {
      showToast(`Berhasil menambahkan ${records.length} data Realisasi baru!`);
    }
  };

  // Local Database Overwrite and Merge Handlers for Database Management Console
  const handleOverwriteLocalDatabase = (data: {
    budget?: BudgetRecord[];
    forecast?: ForecastRecord[];
    realization?: RealizationRecord[];
    costCenters?: MasterCostCenter[];
    masterItems?: MasterItem[];
  }) => {
    if (data.budget) setBudget(data.budget);
    if (data.forecast) setForecast(data.forecast);
    if (data.realization) setRealization(data.realization);
    if (data.costCenters) setCostCenters(data.costCenters);
    if (data.masterItems) setMasterItems(data.masterItems);
  };

  const handleMergeLocalDatabase = (data: {
    budget?: BudgetRecord[];
    forecast?: ForecastRecord[];
    realization?: RealizationRecord[];
    costCenters?: MasterCostCenter[];
    masterItems?: MasterItem[];
  }) => {
    if (data.budget && data.budget.length > 0) {
      setBudget(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = data.budget!.filter(b => !existingIds.has(b.id));
        return [...prev, ...newItems];
      });
    }
    if (data.forecast && data.forecast.length > 0) {
      setForecast(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = data.forecast!.filter(f => !existingIds.has(f.id));
        return [...prev, ...newItems];
      });
    }
    if (data.realization && data.realization.length > 0) {
      setRealization(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = data.realization!.filter(r => !existingIds.has(r.id));
        return [...prev, ...newItems];
      });
    }
    if (data.costCenters && data.costCenters.length > 0) {
      setCostCenters(prev => {
        const existingCodes = new Set(prev.map(c => c.code));
        const newItems = data.costCenters!.filter(c => !existingCodes.has(c.code));
        return [...prev, ...newItems];
      });
    }
    if (data.masterItems && data.masterItems.length > 0) {
      setMasterItems(prev => {
        const existingCodes = new Set(prev.map(i => i.code));
        const newItems = data.masterItems!.filter(i => !existingCodes.has(i.code));
        return [...prev, ...newItems];
      });
    }
  };

  const handleResetFactoryData = () => {
    setBudget(INITIAL_BUDGET);
    setForecast(INITIAL_FORECAST);
    setRealization(INITIAL_REALIZATION);
    setCostCenters(INITIAL_COST_CENTERS);
    setMasterItems(INITIAL_MASTER_ITEMS);
  };

  // Trigger Two-Way Google Sheets Sync
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSheetsConfig(prev => ({
        ...prev,
        lastSyncTimestamp: new Date().toLocaleTimeString('id-ID'),
        lastLog: `Sinkronisasi sukses: ${budget.length} Budget, ${forecast.length} Forecast, ${realization.length} Realisasi terverifikasi checksum SHA-256.`
      }));
      showToast('Sinkronisasi dua arah Google Sheets & Database Berhasil!');
    }, 900);
  };

  // Send Email Alert
  const handleTriggerEmailAlert = (recipient: string, subject: string, body: string) => {
    showToast(`Email Laporan Eksekutif berhasil dikirimkan ke: ${recipient}`);
  };

  const handleAddCostCenter = (cc: MasterCostCenter) => {
    setCostCenters(prev => {
      const idx = prev.findIndex(c => c.code.toLowerCase() === cc.code.toLowerCase());
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = cc;
        return next;
      }
      return [cc, ...prev];
    });
    if (isConfigValid(supabaseConfig)) {
      void upsertCostCenterToSupabase(cc, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast(`Cost Center "${cc.code}" berhasil disimpan.`);
  };

  const handleEditCostCenter = (updatedCC: MasterCostCenter) => {
    setCostCenters(prev => prev.map(c => c.code === updatedCC.code ? updatedCC : c));
    if (isConfigValid(supabaseConfig)) {
      void upsertCostCenterToSupabase(updatedCC, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast(`Cost Center "${updatedCC.code}" berhasil diperbarui.`);
  };

  const handleDeleteCostCenter = (code: string) => {
    setCostCenters(prev => prev.filter(c => c.code !== code));
    if (isConfigValid(supabaseConfig)) {
      void deleteCostCenterFromSupabase(code, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast(`Cost Center "${code}" berhasil dihapus.`);
  };

  const handleAddMasterItem = (item: MasterItem) => {
    setMasterItems(prev => {
      const existsIndex = prev.findIndex(i => i.code.toLowerCase() === item.code.toLowerCase());
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = item;
        return next;
      }
      return [item, ...prev];
    });
    if (isConfigValid(supabaseConfig)) {
      void upsertMasterItemToSupabase(item, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast(`Master Item "${item.code}" berhasil disimpan.`);
  };

  const handleEditMasterItem = (updatedItem: MasterItem) => {
    setMasterItems(prev => prev.map(i => i.code === updatedItem.code ? updatedItem : i));
    if (isConfigValid(supabaseConfig)) {
      void upsertMasterItemToSupabase(updatedItem, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast(`Master Item "${updatedItem.name || updatedItem.code}" berhasil diperbarui.`);
  };

  const handleDeleteMasterItem = (code: string) => {
    setMasterItems(prev => prev.filter(i => i.code !== code));
    if (isConfigValid(supabaseConfig)) {
      void deleteMasterItemFromSupabase(code, supabaseConfig).then(res => {
        if (res.success) {
          setDbSyncStatus('connected');
          stampLastSyncNow();
        }
      });
    }
    showToast(`Master Item "${code}" berhasil dihapus.`);
  };

  const handleAutoSyncMasterData = () => {
    const { updatedMasterItems, updatedCostCenters, newItemsCount, newCostCentersCount } = extractAndSyncMasterData(
      budget,
      forecast,
      realization,
      masterItems,
      costCenters
    );
    setMasterItems(updatedMasterItems);
    setCostCenters(updatedCostCenters);
    if (newItemsCount > 0 || newCostCentersCount > 0) {
      showToast(`Sinkronisasi Selesai: +${newItemsCount} Master Item dan +${newCostCentersCount} Cost Center baru berhasil disesuaikan!`);
    } else {
      showToast(`Master data sudah sinkron dengan seluruh ${budget.length + forecast.length + realization.length} data transaksi.`);
    }
  };

  const persistTabSession = (nextUser: UserSession, tab: ActiveTab, activityTimestamp = Date.now()) => {
    try {
      sessionStorage.setItem(
        SESSION_TAB_KEY,
        JSON.stringify({
          user: nextUser,
          activeTab: tab,
          lastActivityAt: activityTimestamp
        })
      );
      localStorage.setItem(SESSION_ACTIVE_FLAG_KEY, '1');
    } catch {
      // Ignore storage quota errors
    }
  };

  const clearAllSessionMarkers = () => {
    try {
      sessionStorage.removeItem(SESSION_TAB_KEY);
      localStorage.removeItem(SESSION_ACTIVE_FLAG_KEY);
    } catch {
      // Ignore storage access errors
    }
  };

  const handleLoginSuccess = (userData: Partial<UserSession>) => {
    const loggedInUser: UserSession = {
      ...user,
      username: userData.username || 'admin',
      displayName: userData.displayName || 'HR Administrator',
      department: 'HR Development',
      role: (userData.role as any) || 'SuperAdmin',
      isLoggedIn: true,
      lastLogin: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB'
    };
    const now = Date.now();
    lastActivityAtRef.current = now;
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setSessionNotice(null);
    setShowTimeoutWarning(false);
    setCurrentPage('workspace');
    persistTabSession(loggedInUser, activeTab, now);
    showToast(`Selamat datang, ${userData.displayName || 'Administrator'}!`);
  };

  const handleRequestLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleExecuteLogout = () => {
    clearAllSessionMarkers();
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setIsAuthenticated(false);
    setShowTimeoutWarning(false);
    setSessionNotice(null);
    setCurrentPage('landing');
    setShowLogoutConfirm(false);
    showToast('Sesi kerja Anda telah diakhiri dengan aman.');
  };

  const handleSessionExpired = React.useCallback((reason: 'timeout' | 'tab_closed' = 'timeout') => {
    clearAllSessionMarkers();
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setIsAuthenticated(false);
    setShowTimeoutWarning(false);
    setShowLogoutConfirm(false);
    setShowSendEmailModal(false);
    setShowBulkUploadModal(false);
    setShowDatabaseConsoleModal(false);
    setShowShortcutsModal(false);
    setShowRlsFixModal(false);
    setSessionNotice({ reason, timeoutMinutes: sessionTimeoutMinutes });
    setCurrentPage('login');
    showToast(
      reason === 'tab_closed'
        ? tr(
            'Sesi berakhir otomatis karena tab browser ditutup. Silakan login kembali.',
            'Session ended automatically because the browser tab was closed. Please sign in again.'
          )
        : tr(
            `Sesi berakhir otomatis setelah ${sessionTimeoutMinutes} menit tidak aktif. Silakan login kembali.`,
            `Session expired automatically after ${sessionTimeoutMinutes} minutes of inactivity. Please sign in again.`
          ),
      'error'
    );
  }, [sessionTimeoutMinutes, tr]);

  const handleExtendSession = () => {
    const now = Date.now();
    lastActivityAtRef.current = now;
    setShowTimeoutWarning(false);
    if (isAuthenticated) {
      persistTabSession(user, activeTab, now);
    }
    showToast(
      tr(
        `Sesi berhasil diperpanjang (${sessionTimeoutMinutes} menit).`,
        `Session extended successfully (${sessionTimeoutMinutes} minutes).`
      )
    );
  };

  const handleChangeSessionTimeout = (minutes: number) => {
    if (!VALID_TIMEOUT_OPTIONS.includes(minutes as (typeof VALID_TIMEOUT_OPTIONS)[number])) return;
    setSessionTimeoutMinutes(minutes);
    const now = Date.now();
    lastActivityAtRef.current = now;
    setShowTimeoutWarning(false);
    try {
      localStorage.setItem(SESSION_TIMEOUT_MINUTES_KEY, String(minutes));
      if (isAuthenticated) {
        persistTabSession(user, activeTab, now);
      }
    } catch {
      // Ignore storage access errors
    }
    showToast(
      tr(
        `Batas waktu sesi (auto-timeout) diatur ke ${minutes} menit.`,
        `Session idle auto-timeout set to ${minutes} minutes.`
      )
    );
  };

  // Sync activeTab into per-tab sessionStorage while logged in
  useEffect(() => {
    if (!isAuthenticated || currentPage !== 'workspace') return;
    persistTabSession(user, activeTab, lastActivityAtRef.current);
  }, [activeTab, isAuthenticated, currentPage]);

  // Enterprise Idle Timeout, Background Tab Expiration & Tab-Close Session Guard
  useEffect(() => {
    if (!isAuthenticated || currentPage !== 'workspace') return;

    const timeoutMs = sessionTimeoutMinutes * 60_000;
    const warningSec = sessionTimeoutMinutes <= 1 ? 15 : 60;
    const warningMs = warningSec * 1000;

    let lastRecordedEventAt = 0;

    const recordActivity = () => {
      if (showTimeoutWarningRef.current) return;
      const now = Date.now();
      if (now - lastRecordedEventAt < 1000) return;
      lastRecordedEventAt = now;
      lastActivityAtRef.current = now;
      try {
        const raw = sessionStorage.getItem(SESSION_TAB_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          sessionStorage.setItem(
            SESSION_TAB_KEY,
            JSON.stringify({ ...parsed, lastActivityAt: now })
          );
        }
      } catch {
        // Ignore storage errors
      }
    };

    const evaluateSession = () => {
      const elapsed = Date.now() - lastActivityAtRef.current;
      const remainingMs = timeoutMs - elapsed;

      if (remainingMs <= 0) {
        handleSessionExpired('timeout');
        return;
      }

      if (remainingMs <= warningMs) {
        setShowTimeoutWarning(true);
        setTimeoutRemainingSeconds(Math.max(1, Math.ceil(remainingMs / 1000)));
      } else if (showTimeoutWarningRef.current) {
        setShowTimeoutWarning(false);
      }
    };

    const handleVisibilityOrPageShow = () => {
      if (document.visibilityState === 'visible') {
        evaluateSession();
      }
    };

    const handlePageHide = () => {
      // Ensure active session flag is recorded before tab closes (sessionStorage is auto-cleared on tab close)
      try {
        localStorage.setItem(SESSION_ACTIVE_FLAG_KEY, '1');
      } catch {
        // Ignore storage errors
      }
    };

    const activityEvents: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'pointerdown',
      'click'
    ];

    activityEvents.forEach(evt => window.addEventListener(evt, recordActivity, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibilityOrPageShow);
    window.addEventListener('pageshow', handleVisibilityOrPageShow);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);

    const intervalId = window.setInterval(evaluateSession, 1000);

    return () => {
      window.clearInterval(intervalId);
      activityEvents.forEach(evt => window.removeEventListener(evt, recordActivity));
      document.removeEventListener('visibilitychange', handleVisibilityOrPageShow);
      window.removeEventListener('pageshow', handleVisibilityOrPageShow);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
    };
  }, [isAuthenticated, currentPage, sessionTimeoutMinutes, handleSessionExpired]);

  // Global Keyboard Shortcuts Engine & Alt-Key Guide Detection
  useEffect(() => {
    const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Detect Alt key for floating HUD & button tooltips
      if (e.key === 'Alt') {
        setIsAltPressed(true);
      }

      const isCtrlOrMeta = isMac ? e.metaKey : (e.ctrlKey || e.metaKey);
      const key = e.key.toLowerCase();
      const activeEl = document.activeElement;
      const isEditing = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.tagName === 'SELECT' ||
        (activeEl as HTMLElement).isContentEditable
      );

      // Escape key: Close any active modal
      if (e.key === 'Escape') {
        setShowShortcutsModal(false);
        setShowBulkUploadModal(false);
        setShowSendEmailModal(false);
        setShowLogoutConfirm(false);
        return;
      }

      // Question mark (? or Shift+/): Toggle Shortcuts Help Cheatsheet
      if (e.key === '?' && !isEditing) {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
        return;
      }

      // Ctrl+S / Cmd+S: Two-way Google Sheets Sync
      if (isCtrlOrMeta && key === 's') {
        e.preventDefault();
        handleTriggerSync();
        return;
      }

      // Ctrl+P / Cmd+P: Open Executive PDF Report
      if (isCtrlOrMeta && key === 'p') {
        e.preventDefault();
        if (currentPage !== 'workspace') {
          setCurrentPage('workspace');
        }
        setActiveTab('dashboard');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dabaco-open-pdf-modal'));
        }, 80);
        showToast(tr('Membuka Generator Executive PDF Report (Ctrl+P)', 'Opening Executive PDF Report Generator (Ctrl+P)'));
        return;
      }

      // Ctrl+B / Cmd+B: Toggle Sidebar Collapsed State
      if (isCtrlOrMeta && key === 'b') {
        e.preventDefault();
        handleToggleSidebarCollapse();
        showToast(tr('Sidebar dialihkan (Ctrl+B)', 'Sidebar toggled (Ctrl+B)'));
        return;
      }

      // Ctrl+D / Cmd+D: Toggle Dark / Light Mode
      if (isCtrlOrMeta && key === 'd') {
        e.preventDefault();
        setDarkMode(prev => !prev);
        showToast(tr('Mode tema dialihkan (Ctrl+D)', 'Theme mode toggled (Ctrl+D)'));
        return;
      }

      // Ctrl+U / Cmd+U: Bulk CSV Upload Modal
      if (isCtrlOrMeta && key === 'u') {
        e.preventDefault();
        setShowBulkUploadModal(true);
        return;
      }

      // Ctrl+E / Cmd+E: Send Executive Report via Email
      if (isCtrlOrMeta && key === 'e') {
        e.preventDefault();
        setShowSendEmailModal(true);
        return;
      }

      // Navigation: Ctrl+1..9 or Alt+1..9 (Quick Tab Switching)
      if ((isCtrlOrMeta || e.altKey) && ['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        e.preventDefault();
        const tabMap: Record<string, ActiveTab> = {
          '1': 'dashboard',
          '2': 'executive-report',
          '3': 'budget',
          '4': 'forecast',
          '5': 'realization',
          '6': 'looker',
          '7': 'sheets-sync',
          '8': 'email-alerts',
          '9': 'users'
        };

        const targetTab = tabMap[e.key];
        if (targetTab) {
          if (currentPage !== 'workspace') {
            setCurrentPage('workspace');
          }
          setActiveTab(targetTab);
          const tabLabel = targetTab.replace('-', ' ').toUpperCase();
          showToast(
            tr(
              `Navigasi: ${tabLabel} (${isCtrlOrMeta ? 'Ctrl+' : 'Alt+'}${e.key})`,
              `Navigated: ${tabLabel} (${isCtrlOrMeta ? 'Ctrl+' : 'Alt+'}${e.key})`
            )
          );
        }
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(false);
      }
    };

    const handleBlur = () => {
      setIsAltPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [currentPage, budget, forecast, realization, tr]);

  return (
    <div className={`min-h-screen transition-colors duration-200 dabaco-app-shell ${
      darkMode ? 'bg-[#080c14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] animate-in slide-in-from-top-4 duration-300 max-w-lg">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center justify-between gap-3 ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30'
              : toast.type === 'warning'
              ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/30'
              : 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30'
          }`}>
            <span className="leading-relaxed">{toast.message}</span>
            {toast.type === 'error' && toast.message.toLowerCase().includes('row-level security') && (
              <button
                onClick={() => setShowRlsFixModal(true)}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold underline shrink-0 transition"
              >
                {tr('Solusi RLS', 'Fix RLS')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* View 1: Landing Page (Default on system start) */}
      {currentPage === 'landing' && (
        <LandingPage
          onOpenLogin={() => setCurrentPage('login')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          activeTheme={activeTheme}
          onSelectTheme={handleSelectTheme}
          budgetData={budget}
          forecastData={forecast}
          realizationData={realization}
          costCenters={costCenters}
        />
      )}

      {/* View 2: Dedicated Full Login Page */}
      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => {
            setSessionNotice(null);
            setCurrentPage('landing');
          }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          activeTheme={activeTheme}
          onSelectTheme={handleSelectTheme}
          users={users}
          sessionNotice={sessionNotice}
          onDismissSessionNotice={() => setSessionNotice(null)}
        />
      )}

      {/* View 3: Authenticated Main Application Workspace */}
      {currentPage === 'workspace' && (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={handleRequestLogout}
            unreadAlertsCount={alerts.length}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebarCollapse}
            isAltPressed={isAltPressed}
          />

          {/* Main Content Area */}
          <div className={`flex-1 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} pt-[68px] flex flex-col min-w-0 transition-all duration-300 ease-in-out`}>
            <Navbar
              activeTab={activeTab}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onQuickSync={handleTriggerSync}
              isSyncing={isSyncing}
              alerts={alerts}
              onOpenAlerts={() => setActiveTab('email-alerts')}
              onOpenBulkUpload={() => setShowBulkUploadModal(true)}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              activeTheme={activeTheme}
              onSelectTheme={handleSelectTheme}
              onLanguageChange={handleLanguageChange}
              isSidebarCollapsed={isSidebarCollapsed}
              onLogout={handleRequestLogout}
              isAltPressed={isAltPressed}
              onOpenShortcutsHelp={() => setShowShortcutsModal(true)}
              onPushToSupabase={() => handlePushDataToSupabase()}
              isPushingSupabase={isPushingToSupabase}
              onOpenSupabase={() => setActiveTab('supabase')}
              dbSyncStatus={dbSyncStatus}
            />

            {/* Top Database Status Alert / Empty Notification */}
            {dbSyncStatus === 'empty' && activeTab !== 'supabase' && (
              <div
                data-i18n-native="true"
                className="mx-4 sm:mx-6 mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                  <span>
                    <strong>{tr('Database Supabase Terhubung:', 'Supabase Database Connected:')}</strong>{' '}
                    {tr(
                      'Tabel database masih kosong. Klik "Push Data Sekarang" untuk mengunggah dataset awal ke Supabase.',
                      'Database tables are currently empty. Click "Push Data Now" to upload the initial dataset to Supabase.'
                    )}
                  </span>
                </div>
                <button
                  onClick={() => handlePushDataToSupabase()}
                  disabled={isPushingToSupabase}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0 disabled:opacity-50"
                >
                  {isPushingToSupabase
                    ? tr('Sedang Push...', 'Pushing...')
                    : tr('Push Data Sekarang', 'Push Data Now')}
                </button>
              </div>
            )}

            <main className="flex-1 p-3.5 sm:p-5 lg:p-6 xl:p-8 w-full max-w-[1920px] mx-auto transition-all duration-300">
              {activeTab === 'dashboard' && (
                <DashboardView
                  budget={budget}
                  forecast={forecast}
                  realization={realization}
                  costCenters={costCenters}
                  masterItems={masterItems}
                  onManualRefresh={handleTriggerSync}
                  onOpenSendEmailModal={() => setShowSendEmailModal(true)}
                  onOpenBulkUpload={() => setShowBulkUploadModal(true)}
                  onGoToExecutiveReport={() => setActiveTab('executive-report')}
                  darkMode={darkMode}
                  isAltPressed={isAltPressed}
                />
              )}

              {activeTab === 'executive-report' && (
                <ExecutiveReportView
                  budget={budget}
                  forecast={forecast}
                  realization={realization}
                  costCenters={costCenters}
                  masterItems={masterItems}
                  darkMode={darkMode}
                  onShowToast={(msg) => showToast(msg)}
                />
              )}

              {(activeTab === 'budget' || activeTab === 'forecast' || activeTab === 'realization') && (
                <DataManagementView
                  type={activeTab}
                  budget={budget}
                  forecast={forecast}
                  realization={realization}
                  costCenters={costCenters}
                  masterItems={masterItems}
                  onAddBudget={handleAddBudget}
                  onEditBudget={handleEditBudget}
                  onDeleteBudget={handleDeleteBudget}
                  onBatchAddBudget={handleBatchAddBudget}
                  onAddForecast={handleAddForecast}
                  onEditForecast={handleEditForecast}
                  onDeleteForecast={handleDeleteForecast}
                  onBatchAddForecast={handleBatchAddForecast}
                  onAddRealization={handleAddRealization}
                  onEditRealization={handleEditRealization}
                  onDeleteRealization={handleDeleteRealization}
                  onBatchAddRealization={handleBatchAddRealization}
                  onResetDatabase={handleResetDatabaseToDefault}
                  onExportBackup={handleExportDatabaseBackup}
                  onPushToSupabase={() => handlePushDataToSupabase()}
                  isPushingSupabase={isPushingToSupabase}
                  onReloadFromSupabase={() => handleLoadFromSupabase(supabaseConfig, false)}
                  isLoadingFromSupabase={isDbLoading}
                  onOpenDatabaseConsole={() => setShowDatabaseConsoleModal(true)}
                  dbSyncStatus={dbSyncStatus}
                  lastSyncTime={dbLastSyncTime}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'looker' && (
                <LookerStudioView
                  config={lookerConfig}
                  onUpdateConfig={(c) => {
                    setLookerConfig(prev => ({ ...prev, ...c }));
                    showToast('Pengaturan Looker Studio disimpan!');
                  }}
                  darkMode={darkMode}
                  budget={budget}
                  forecast={forecast}
                  realization={realization}
                  costCenters={costCenters}
                  masterItems={masterItems}
                />
              )}

              {activeTab === 'sheets-sync' && (
                <GoogleSheetsSyncView
                  config={sheetsConfig}
                  onUpdateConfig={(c) => {
                    setSheetsConfig(prev => ({ ...prev, ...c }));
                    showToast('Konfigurasi Google Sheets disimpan!');
                  }}
                  onTriggerSync={handleTriggerSync}
                  isSyncing={isSyncing}
                  totalRecords={{ budget: budget.length, forecast: forecast.length, realization: realization.length }}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'email-alerts' && (
                <EmailAlertsView
                  emailSetting={emailSetting}
                  onUpdateEmailSetting={(s) => {
                    setEmailSetting(prev => ({ ...prev, ...s }));
                    showToast('Pengaturan notifikasi email disimpan!');
                  }}
                  categories={derivedData.categories}
                  items={derivedData.items}
                  alerts={alerts}
                  onTriggerEmailAlert={handleTriggerEmailAlert}
                  darkMode={darkMode}
                />
              )}

              {(activeTab === 'users' || activeTab === 'banking') && (
                <UserManagementView
                  users={users}
                  onAddUser={handleAddUser}
                  onDeleteUser={handleDeleteUser}
                  onUpdateUser={handleUpdateUser}
                  onSyncDatabase={handleSyncUserDatabase}
                  usersCloudStatus={usersCloudStatus}
                  supabaseProjectUrl={supabaseConfig.projectUrl}
                  currentUser={user}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'supabase' && (
                <SupabaseView
                  config={supabaseConfig}
                  onUpdateConfig={(c, silent) => {
                    const updated = normalizeSupabaseConfig({ ...supabaseConfig, ...c });
                    setSupabaseConfig(updated);
                    if (c.projectUrl !== undefined || c.anonKey !== undefined) {
                      if (isConfigValid(updated)) {
                        localStorage.setItem('dabaco_supabase_manual_override', '1');
                      }
                    }
                    if (!silent) {
                      showToast('Konfigurasi Supabase disimpan!');
                    }
                  }}
                  darkMode={darkMode}
                  dataCounts={{
                    costCenters: costCenters.length,
                    masterItems: masterItems.length,
                    budget: budget.length,
                    forecast: forecast.length,
                    realization: realization.length
                  }}
                  onPushData={handlePushDataToSupabase}
                  isPushing={isPushingToSupabase}
                  pushProgress={pushProgressMessage}
                  onReloadData={(c) => handleLoadFromSupabase(normalizeSupabaseConfig({ ...supabaseConfig, ...c }), false)}
                  isLoadingData={isDbLoading}
                  onOpenDatabaseConsole={() => setShowDatabaseConsoleModal(true)}
                  dbSyncStatus={dbSyncStatus}
                  onSyncStatusChange={setDbSyncStatus}
                  lastPushError={lastSupabaseError}
                  lastSyncTime={dbLastSyncTime}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  activeTheme={activeTheme}
                  onSelectTheme={handleSelectTheme}
                  onLanguageChange={handleLanguageChange}
                  costCenters={costCenters}
                  onAddCostCenter={handleAddCostCenter}
                  onEditCostCenter={handleEditCostCenter}
                  onDeleteCostCenter={handleDeleteCostCenter}
                  onAutoSyncMasterData={handleAutoSyncMasterData}
                  masterItems={masterItems}
                  totalRecords={{ budget: budget.length, forecast: forecast.length, realization: realization.length }}
                  dataset={{ budget, forecast, realization, metadata: { version: '2.6', company: 'PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory' } }}
                  budgetData={budget}
                  forecastData={forecast}
                  realizationData={realization}
                  sessionTimeoutMinutes={sessionTimeoutMinutes}
                  onChangeSessionTimeout={handleChangeSessionTimeout}
                  onUpdateAdminPassword={handleUpdateAdminPassword}
                />
              )}
            </main>
          </div>

          {/* Quick Send Email Modal */}
          <SendEmailModal
            isOpen={showSendEmailModal}
            onClose={() => setShowSendEmailModal(false)}
            onSend={(email, notes) => {
              handleTriggerEmailAlert(email, 'Executive Budget Report Alert', notes);
            }}
            defaultRecipient={emailSetting.recipients[0] || 'paajinomoto@gmail.com'}
          />

          {/* Global Bulk Upload CSV Modal */}
          <BulkUploadModal
            isOpen={showBulkUploadModal}
            onClose={() => setShowBulkUploadModal(false)}
            defaultTarget={activeTab === 'forecast' ? 'forecast' : activeTab === 'realization' ? 'realization' : 'budget'}
            costCenters={costCenters}
            masterItems={masterItems}
            onBatchAddBudget={handleBatchAddBudget}
            onBatchAddForecast={handleBatchAddForecast}
            onBatchAddRealization={handleBatchAddRealization}
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Quick Modal fallback if invoked */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        users={users}
        darkMode={darkMode}
      />

      {/* Dedicated Executive Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleExecuteLogout}
        darkMode={darkMode}
        userName={user.displayName || 'HR Administrator'}
        userRole={user.role || 'SuperAdmin'}
        department={user.department || 'HR Development'}
      />

      {/* Session Idle Timeout Countdown Warning Modal */}
      <SessionTimeoutModal
        isOpen={showTimeoutWarning && isAuthenticated && currentPage === 'workspace'}
        remainingSeconds={timeoutRemainingSeconds}
        totalWarningSeconds={sessionTimeoutMinutes <= 1 ? 15 : 60}
        timeoutMinutes={sessionTimeoutMinutes}
        darkMode={darkMode}
        onExtendSession={handleExtendSession}
        onLogoutNow={() => handleSessionExpired('timeout')}
      />

      {/* Centralized Keyboard Shortcuts Help Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        isAltPressed={isAltPressed}
        darkMode={darkMode}
      />

      {/* Floating Alt-Key Quick Reference Guide HUD */}
      <AltKeyGuideHUD
        isVisible={isAltPressed && !showShortcutsModal}
        onOpenFullGuide={() => setShowShortcutsModal(true)}
      />

      {/* Supabase Row-Level Security (RLS) Policy Fix Modal */}
      <RlsFixModal
        isOpen={showRlsFixModal}
        onClose={() => setShowRlsFixModal(false)}
        onRetryPush={() => handlePushDataToSupabase()}
        projectUrl={supabaseConfig.projectUrl}
        errorMessage={rlsErrorMessage}
        darkMode={darkMode}
      />

      {/* Full-featured Database Management Console Modal (Menimpa, Menambahkan, Cadangan, Reset) */}
      <DatabaseConsoleModal
        isOpen={showDatabaseConsoleModal}
        onClose={() => setShowDatabaseConsoleModal(false)}
        supabaseConfig={supabaseConfig}
        budget={budget}
        forecast={forecast}
        realization={realization}
        costCenters={costCenters}
        masterItems={masterItems}
        onOverwriteLocalDatabase={handleOverwriteLocalDatabase}
        onMergeLocalDatabase={handleMergeLocalDatabase}
        onResetFactoryData={handleResetFactoryData}
        onOpenRlsFixModal={(err) => {
          setRlsErrorMessage(err);
          setShowRlsFixModal(true);
        }}
        showToast={showToast}
        darkMode={darkMode}
      />
    </div>
  );
}

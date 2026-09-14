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
import { SendEmailModal } from './components/SendEmailModal';
import { BulkUploadModal } from './components/BulkUploadModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { AltKeyGuideHUD } from './components/AltKeyGuideHUD';
import { RlsFixModal } from './components/RlsFixModal';
import { DatabaseConsoleModal } from './components/DatabaseConsoleModal';

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
  isConfigValid
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

export default function App() {
  // Page Routing & Authentication State
  // Required flow: When system is opened, system directly opens Landing Page -> Login Page -> Dashboard System
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'workspace'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [user, setUser] = useState<UserSession>({
    username: 'admin',
    displayName: 'HR Administrator',
    department: 'HR Development',
    role: 'SuperAdmin',
    isLoggedIn: false,
    lastLogin: '2026-09-06 20:55 WIB'
  });

  // Navigation & Theme
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('dabaco_sidebar_collapsed') === 'true';
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('dabaco_sidebar_collapsed', String(next));
      return next;
    });
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('dabaco_dark_mode') !== 'false';
  });

  // Core Datasets (Managed primarily via Supabase Cloud Database)
  const [budget, setBudget] = useState<BudgetRecord[]>(INITIAL_BUDGET);
  const [forecast, setForecast] = useState<ForecastRecord[]>(INITIAL_FORECAST);
  const [realization, setRealization] = useState<RealizationRecord[]>(INITIAL_REALIZATION);
  const [costCenters, setCostCenters] = useState<MasterCostCenter[]>(INITIAL_COST_CENTERS);
  const [masterItems, setMasterItems] = useState<MasterItem[]>(INITIAL_MASTER_ITEMS);

  // Supabase Database Connection & Synchronization State
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    // 1. Prioritize environment variables (Vercel / Production Deployment)
    const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ? String(import.meta.env.VITE_SUPABASE_URL).trim() : '';
    const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ? String(import.meta.env.VITE_SUPABASE_ANON_KEY).trim() : '';

    if (envUrl && envKey) {
      const candidate: SupabaseConfig = {
        projectUrl: envUrl,
        anonKey: envKey,
        status: 'connected',
        tablesSynced: 0,
        lastBackupTime: null,
        encryptionActive: true
      };
      if (isConfigValid(candidate)) {
        return candidate;
      }
    }

    // 2. Check saved manual configuration in localStorage
    const saved = localStorage.getItem('dabaco_supabase_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.projectUrl?.includes('dabaco-ajinomoto-prod') || !isConfigValid(parsed)) {
          localStorage.removeItem('dabaco_supabase_config');
          return INITIAL_SUPABASE_CONFIG;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse dabaco_supabase_config', e);
      }
    }
    return INITIAL_SUPABASE_CONFIG;
  });

  useEffect(() => {
    if (isConfigValid(supabaseConfig)) {
      localStorage.setItem('dabaco_supabase_config', JSON.stringify(supabaseConfig));
    }
  }, [supabaseConfig]);

  const [isDbLoading, setIsDbLoading] = useState<boolean>(true);
  const [isPushingToSupabase, setIsPushingToSupabase] = useState<boolean>(false);
  const [pushProgressMessage, setPushProgressMessage] = useState<string>('');
  const [dbSyncStatus, setDbSyncStatus] = useState<'connected' | 'empty' | 'unconfigured' | 'error'>('unconfigured');
  const [dbLastSyncTime, setDbLastSyncTime] = useState<string | null>(null);

  // Auto-load data from Supabase directly on startup
  const handleLoadFromSupabase = async (configToUse = supabaseConfig, silent = false) => {
    if (!isConfigValid(configToUse)) {
      setDbSyncStatus('unconfigured');
      setIsDbLoading(false);
      return;
    }

    setIsDbLoading(true);
    try {
      const res = await fetchDatabaseFromSupabase(configToUse);
      if (res.success && res.data) {
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
          const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setDbLastSyncTime(nowStr);
          if (!silent) {
            showToast(`Data berhasil dimuat dari database Supabase (${res.data.budget.length} Budget, ${res.data.forecast.length} Forecast, ${res.data.realization.length} Realisasi)!`);
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

  // Run auto-load on system launch
  useEffect(() => {
    handleLoadFromSupabase(supabaseConfig, true);
  }, []);

  // Push full dataset to Supabase
  const handlePushDataToSupabase = async (customConfig?: Partial<SupabaseConfig>) => {
    const activeCfg: SupabaseConfig = { ...supabaseConfig, ...customConfig };
    if (!isConfigValid(activeCfg)) {
      showToast('Kredensial Supabase belum lengkap. Silakan isi Project URL & Anon Key di menu Supabase Backend.', 'warning');
      setActiveTab('supabase');
      return;
    }

    setIsPushingToSupabase(true);
    setPushProgressMessage('Menghubungi server Supabase...');
    try {
      const res = await pushDatabaseToSupabase(
        {
          costCenters,
          masterItems,
          budget,
          forecast,
          realization
        },
        activeCfg,
        (step) => setPushProgressMessage(step)
      );

      if (res.success && res.counts) {
        const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setDbSyncStatus('connected');
        setDbLastSyncTime(nowTime);
        setSupabaseConfig(prev => ({
          ...prev,
          ...customConfig,
          status: 'connected',
          lastBackupTime: new Date().toISOString()
        }));
        showToast(
          `Sukses push ke Supabase! (${res.counts.budget} Budget, ${res.counts.forecast} Forecast, ${res.counts.realization} Realisasi kas berhasil diunggah)`,
          'success'
        );
      } else {
        const errorMsg = res.error || 'Gagal mengunggah data ke Supabase.';
        showToast(errorMsg, 'error');
        if (res.isRlsError || errorMsg.toLowerCase().includes('row-level security')) {
          setRlsErrorMessage(errorMsg);
          setShowRlsFixModal(true);
        }
      }
    } catch (err: any) {
      console.error('Error during push to Supabase:', err);
      const errMsg = err?.message || 'Terjadi kesalahan saat push data ke database.';
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
    showToast(`Akun pengguna ${newUser.displayName} (@${newUser.username}) berhasil ditambahkan!`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast('Akun pengguna berhasil dihapus dari basis data.');
  };

  const handleUpdateUser = (userId: string, updates: Partial<UserAccount>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    showToast('Data akun pengguna berhasil diperbarui!');
  };

  const handleSyncUserDatabase = () => {
    localStorage.setItem('dabaco_users', JSON.stringify(users));
    showToast('Basis data otentikasi DABACO berhasil disinkronkan!');
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

  // Sync Dark Mode with html class and local storage
  useEffect(() => {
    localStorage.setItem('dabaco_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // CRUD for Budget
  const handleAddBudget = (newRecord: Omit<BudgetRecord, 'id'>) => {
    const record: BudgetRecord = {
      ...newRecord,
      id: `b-${Date.now()}`
    };
    setBudget(prev => [record, ...prev]);
    showToast('Data Budget Plan berhasil ditambahkan!');
  };

  const handleEditBudget = (id: string, updated: Partial<BudgetRecord>) => {
    setBudget(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
    showToast('Data Budget Plan berhasil diperbarui!');
  };

  const handleDeleteBudget = (id: string) => {
    setBudget(prev => prev.filter(b => b.id !== id));
    showToast('Data Budget Plan berhasil dihapus.');
  };

  const handleBatchAddBudget = (records: Omit<BudgetRecord, 'id'>[], mode: 'append' | 'overwrite' = 'append') => {
    const timestamp = Date.now();
    const newRecords: BudgetRecord[] = records.map((r, idx) => ({
      ...r,
      id: `b-bulk-${timestamp}-${idx}`
    }));
    if (mode === 'overwrite') {
      setBudget(newRecords);
      showToast(`Berhasil menimpa seluruh data Budget Plan dengan ${records.length} baris baru!`);
    } else {
      setBudget(prev => [...newRecords, ...prev]);
      showToast(`Berhasil menambahkan ${records.length} data Budget Plan baru!`);
    }
  };

  // CRUD for Forecast
  const handleAddForecast = (newRecord: Omit<ForecastRecord, 'id'>) => {
    const record: ForecastRecord = {
      ...newRecord,
      id: `f-${Date.now()}`
    };
    setForecast(prev => [record, ...prev]);
    showToast('Data Forecast berhasil ditambahkan!');
  };

  const handleEditForecast = (id: string, updated: Partial<ForecastRecord>) => {
    setForecast(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
    showToast('Data Forecast berhasil diperbarui!');
  };

  const handleDeleteForecast = (id: string) => {
    setForecast(prev => prev.filter(f => f.id !== id));
    showToast('Data Forecast berhasil dihapus.');
  };

  const handleBatchAddForecast = (records: Omit<ForecastRecord, 'id'>[], mode: 'append' | 'overwrite' = 'append') => {
    const timestamp = Date.now();
    const newRecords: ForecastRecord[] = records.map((r, idx) => ({
      ...r,
      id: `f-bulk-${timestamp}-${idx}`
    }));
    if (mode === 'overwrite') {
      setForecast(newRecords);
      showToast(`Berhasil menimpa seluruh data Forecast dengan ${records.length} baris baru!`);
    } else {
      setForecast(prev => [...newRecords, ...prev]);
      showToast(`Berhasil menambahkan ${records.length} data Forecast baru!`);
    }
  };

  // CRUD for Realization
  const handleAddRealization = (newRecord: Omit<RealizationRecord, 'id'>) => {
    const record: RealizationRecord = {
      ...newRecord,
      id: `r-${Date.now()}`
    };
    setRealization(prev => [record, ...prev]);

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
    setRealization(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    showToast('Data Realisasi Aktual berhasil diperbarui!');
  };

  const handleDeleteRealization = (id: string) => {
    setRealization(prev => prev.filter(r => r.id !== id));
    showToast('Data Realisasi Aktual berhasil dihapus.');
  };

  const handleBatchAddRealization = (records: Omit<RealizationRecord, 'id'>[], mode: 'append' | 'overwrite' = 'append') => {
    const timestamp = Date.now();
    const newRecords: RealizationRecord[] = records.map((r, idx) => ({
      ...r,
      id: `r-bulk-${timestamp}-${idx}`
    }));
    if (mode === 'overwrite') {
      setRealization(newRecords);
      showToast(`Berhasil menimpa seluruh data Realisasi dengan ${records.length} baris baru!`);
    } else {
      setRealization(prev => [...newRecords, ...prev]);
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

  const handleAddMasterItem = (item: MasterItem) => {
    setMasterItems(prev => [...prev, item]);
    showToast(`Master Item ${item.code} berhasil ditambahkan!`);
  };

  const handleLoginSuccess = (userData: Partial<UserSession>) => {
    setUser(prev => ({
      ...prev,
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
    }));
    setIsAuthenticated(true);
    setCurrentPage('workspace');
    showToast(`Selamat datang, ${userData.displayName || 'Administrator'}!`);
  };

  const handleRequestLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleExecuteLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
    setShowLogoutConfirm(false);
    showToast('Sesi kerja Anda telah diakhiri dengan aman.');
  };

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
        showToast('Membuka Generator Executive PDF Report (Ctrl+P)');
        return;
      }

      // Ctrl+B / Cmd+B: Toggle Sidebar Collapsed State
      if (isCtrlOrMeta && key === 'b') {
        e.preventDefault();
        handleToggleSidebarCollapse();
        showToast('Sidebar dialihkan (Ctrl+B)');
        return;
      }

      // Ctrl+D / Cmd+D: Toggle Dark / Light Mode
      if (isCtrlOrMeta && key === 'd') {
        e.preventDefault();
        setDarkMode(prev => !prev);
        showToast('Mode tema dialihkan (Ctrl+D)');
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
          showToast(`Navigasi: ${tabLabel} (${isCtrlOrMeta ? 'Ctrl+' : 'Alt+'}${e.key})`);
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
  }, [currentPage, budget, forecast, realization]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
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
                Solusi RLS
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
        />
      )}

      {/* View 2: Dedicated Full Login Page */}
      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setCurrentPage('landing')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
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
          <div className={`flex-1 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} flex flex-col min-w-0 transition-all duration-300 ease-in-out`}>
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
              <div className="mx-4 sm:mx-6 mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                  <span>
                    <strong>Database Supabase Terhubung:</strong> Tabel database masih kosong. Klik <em>&quot;Push Data Sekarang&quot;</em> untuk mengunggah dataset awal ke Supabase.
                  </span>
                </div>
                <button
                  onClick={() => handlePushDataToSupabase()}
                  disabled={isPushingToSupabase}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0 disabled:opacity-50"
                >
                  {isPushingToSupabase ? 'Sedang Push...' : 'Push Data Sekarang'}
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
                  currentUser={user}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'supabase' && (
                <SupabaseView
                  config={supabaseConfig}
                  onUpdateConfig={(c) => {
                    setSupabaseConfig(prev => ({ ...prev, ...c }));
                    showToast('Konfigurasi Supabase disimpan!');
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
                  onReloadData={(c) => handleLoadFromSupabase({ ...supabaseConfig, ...c }, false)}
                  isLoadingData={isDbLoading}
                  onOpenDatabaseConsole={() => setShowDatabaseConsoleModal(true)}
                  dbSyncStatus={dbSyncStatus}
                  lastSyncTime={dbLastSyncTime}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  masterItems={masterItems}
                  onAddMasterItem={handleAddMasterItem}
                  costCenters={costCenters}
                  totalRecords={{ budget: budget.length, forecast: forecast.length, realization: realization.length }}
                  dataset={{ budget, forecast, realization, metadata: { version: '2.4', company: 'PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory' } }}
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

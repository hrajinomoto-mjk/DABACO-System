export interface BudgetRecord {
  id: string;
  year: number;
  month: string; // e.g., 'Jan', 'Feb', etc.
  costCenter: string;
  item: string;
  amount: number;
  createdAt?: string;
}

export interface ForecastRecord {
  id: string;
  year: number;
  month: string;
  costCenter: string;
  item: string;
  amount: number;
  createdAt?: string;
}

export interface RealizationRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  year: number;
  month: string;
  costCenter: string;
  item: string;
  amount: number;
  keterangan: string;
  encryptedNote?: string;
  bankingReference?: string;
  reconciled?: boolean;
}

export interface MasterItem {
  code: string;
  name: string;
  category: string;
  status: 'Active' | 'Inactive';
}

export interface MasterCostCenter {
  code: string;
  name: string;
  department: string;
  headOfDept: string;
}

export interface MonthlyComparison {
  month: string;
  monthLabel?: string;
  fullName?: string;
  budget: number;
  forecast: number;
  realization: number;
  variance: number; // realization - forecast
}

export interface CategoryDetail {
  category: string;
  budget: number;
  forecast: number;
  realization: number;
  diffFB: number; // budget - forecast
  diffFR: number; // forecast - realization
  usage: number;  // (realization / forecast) * 100
  remarks: string[];
}

export interface ItemSummary {
  item: string;
  budget: number;
  forecast: number;
  realization: number;
  diffBF: number; // budget - forecast
  diffFA: number; // forecast - realization
  usage: number;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: string;
  costCenter?: string;
  category?: string;
  item?: string;
  usagePct?: number;
  sentToEmail?: boolean;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetNameBudget: string;
  sheetNameForecast: string;
  sheetNameRealization: string;
  gasWebAppUrl: string;
  apiKey: string;
  autoSync: boolean;
  syncIntervalMinutes: number;
  lastSyncTimestamp: string | null;
  status: 'idle' | 'syncing' | 'connected' | 'error';
  lastLog?: string;
}

export interface LookerStudioConfig {
  reportUrl: string;
  enabled: boolean;
  theme: 'dark' | 'light';
  aspectRatio: string;
}

export interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  status: 'connected' | 'disconnected' | 'configuring';
  tablesSynced: number;
  lastBackupTime: string | null;
  encryptionActive: boolean;
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  referenceNo: string;
  status: 'Reconciled' | 'Pending' | 'Unmatched';
  matchedRealizationId?: string;
}

export interface BankingAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  currency: string;
  apiEnvironment: 'Sandbox' | 'Production';
  status: 'Active' | 'Syncing' | 'Standby';
  lastSync: string;
}

export type UserRole = 'SuperAdmin' | 'BudgetController' | 'Auditor' | 'SectionHead' | 'Staff';

export interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  email: string;
  department: string;
  role: UserRole;
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
  password?: string;
  avatarColor?: string;
}

export interface UserSession {
  username: string;
  displayName: string;
  department: string;
  role: UserRole;
  isLoggedIn: boolean;
  lastLogin: string;
}

export interface EmailSetting {
  warningThreshold: number; // e.g. 85%
  dangerThreshold: number;  // e.g. 100%
  recipients: string[];
  autoSendOnThreshold: boolean;
  senderName: string;
  smtpStatus: 'Ready' | 'Testing';
}

export type BulkUploadTarget = 'budget' | 'forecast' | 'realization';

export interface SchemaFieldDefinition {
  key: string;
  label: string;
  required: boolean;
  type: 'number' | 'string' | 'date' | 'month';
  description: string;
  example: string;
  aliases: string[];
}

export interface RowValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidatedRow<T = any> {
  rowIndex: number;
  rawData: Record<string, string>;
  parsedData: T | null;
  isValid: boolean;
  hasWarnings: boolean;
  errors: RowValidationError[];
}

export interface PreValidationSummary {
  totalRows: number;
  validCount: number;
  errorCount: number;
  warningCount: number;
  unmappedRequiredFields: string[];
}

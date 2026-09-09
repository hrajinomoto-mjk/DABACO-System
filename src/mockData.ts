import {
  BudgetRecord,
  ForecastRecord,
  RealizationRecord,
  MasterItem,
  MasterCostCenter,
  BankingAccount,
  BankTransaction,
  EmailSetting,
  GoogleSheetsConfig,
  LookerStudioConfig,
  SupabaseConfig,
  UserAccount
} from './types';

export const INITIAL_COST_CENTERS: MasterCostCenter[] = [
  { code: 'HR001', name: 'HR Development & Training', department: 'Human Resources', headOfDept: 'S. Wardhana' },
  { code: 'HR002', name: 'Recruitment & Assessment', department: 'Human Resources', headOfDept: 'D. Prasetyo' },
  { code: 'GA001', name: 'General Affairs & Operations', department: 'General Affairs', headOfDept: 'B. Santoso' },
  { code: 'IT001', name: 'IT Infrastructure & Security', department: 'Information Technology', headOfDept: 'A. Rahman' },
  { code: 'PR001', name: 'Plant Operations Support', department: 'Manufacturing', headOfDept: 'M. Hidayat' }
];

export const INITIAL_MASTER_ITEMS: MasterItem[] = [
  { code: 'HR001EDUCATIONFEETRAINING', name: 'Training & Certification Competency', category: 'Training & Development', status: 'Active' },
  { code: 'HR002SEMINAREXTERNAL', name: 'Seminar & Strategic Workshop External', category: 'Training & Development', status: 'Active' },
  { code: 'HR003LEADERSHIPPROGRAM', name: 'Management Leadership Development Program', category: 'Training & Development', status: 'Active' },
  { code: 'HR004TALENTACQUISITION', name: 'Executive Talent Assessment & Psychotest', category: 'Recruitment & Assessment', status: 'Active' },
  { code: 'HR005EMPLOYEEWELFARE', name: 'Annual Health Screening & Medical Checkup', category: 'Employee Welfare', status: 'Active' },
  { code: 'HR006EMPLOYEEENGAGEMENT', name: 'Townhall Gathering & Corporate Value Event', category: 'Employee Welfare', status: 'Active' },
  { code: 'GA001OFFICEEXPENSE', name: 'Operational Facility & Office Consumables', category: 'Facility & Operations', status: 'Active' },
  { code: 'IT001CLOUDINFRASUPABASE', name: 'Cloud Database Storage & Supabase Sync', category: 'IT & Digital Systems', status: 'Active' },
  { code: 'IT002LOOKERLICENSE', name: 'Looker Studio Enterprise BI Connectors', category: 'IT & Digital Systems', status: 'Active' },
  { code: 'IT003SECURITYENCRYPTION', name: 'SSL Auth Gateway & Encryption Infrastructure', category: 'IT & Digital Systems', status: 'Active' }
];

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Standar Siklus Fiscal Year (Dimulai April s.d. Maret Tahun Depan)
export const FY_MONTH_NAMES = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export interface FYMonthInfo {
  code: string;
  shortName: string;
  fullName: string;
  isNextYear: boolean;
  order: number; // 1 s.d. 12
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
}

export const FY_MONTH_DETAILS: FYMonthInfo[] = [
  { code: 'Apr', shortName: 'Apr', fullName: 'April', isNextYear: false, order: 1, quarter: 'Q1' },
  { code: 'May', shortName: 'Mei', fullName: 'Mei', isNextYear: false, order: 2, quarter: 'Q1' },
  { code: 'Jun', shortName: 'Jun', fullName: 'Juni', isNextYear: false, order: 3, quarter: 'Q1' },
  { code: 'Jul', shortName: 'Jul', fullName: 'Juli', isNextYear: false, order: 4, quarter: 'Q2' },
  { code: 'Aug', shortName: 'Agu', fullName: 'Agustus', isNextYear: false, order: 5, quarter: 'Q2' },
  { code: 'Sep', shortName: 'Sep', fullName: 'September', isNextYear: false, order: 6, quarter: 'Q2' },
  { code: 'Oct', shortName: 'Okt', fullName: 'Oktober', isNextYear: false, order: 7, quarter: 'Q3' },
  { code: 'Nov', shortName: 'Nov', fullName: 'November', isNextYear: false, order: 8, quarter: 'Q3' },
  { code: 'Dec', shortName: 'Des', fullName: 'Desember', isNextYear: false, order: 9, quarter: 'Q3' },
  { code: 'Jan', shortName: 'Jan (+1)', fullName: 'Januari (Tahun Depan)', isNextYear: true, order: 10, quarter: 'Q4' },
  { code: 'Feb', shortName: 'Feb (+1)', fullName: 'Februari (Tahun Depan)', isNextYear: true, order: 11, quarter: 'Q4' },
  { code: 'Mar', shortName: 'Mar (+1)', fullName: 'Maret (Tahun Depan)', isNextYear: true, order: 12, quarter: 'Q4' },
];

// Helper kalkulasi FY akuntansi korporat (April s.d. Maret)
export const getRecordFY = (year: number, monthStr: string): number => {
  const m = monthStr.toLowerCase();
  const map: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };
  let monthNum = 1;
  for (const k in map) {
    if (m.includes(k)) {
      monthNum = map[k];
      break;
    }
  }
  return monthNum >= 4 ? year : year - 1;
};

export const INITIAL_BUDGET: BudgetRecord[] = [
  { id: 'b-01', year: 2026, month: 'Jan', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 180000000 },
  { id: 'b-02', year: 2026, month: 'Jan', costCenter: 'HR001', item: 'HR002SEMINAREXTERNAL', amount: 65000000 },
  { id: 'b-03', year: 2026, month: 'Jan', costCenter: 'HR002', item: 'HR004TALENTACQUISITION', amount: 95000000 },
  { id: 'b-04', year: 2026, month: 'Jan', costCenter: 'IT001', item: 'IT001CLOUDINFRASUPABASE', amount: 50000000 },

  { id: 'b-05', year: 2026, month: 'Feb', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 210000000 },
  { id: 'b-06', year: 2026, month: 'Feb', costCenter: 'HR001', item: 'HR003LEADERSHIPPROGRAM', amount: 140000000 },
  { id: 'b-07', year: 2026, month: 'Feb', costCenter: 'HR002', item: 'HR005EMPLOYEEWELFARE', amount: 80000000 },
  { id: 'b-08', year: 2026, month: 'Feb', costCenter: 'IT001', item: 'IT002LOOKERLICENSE', amount: 35000000 },

  { id: 'b-09', year: 2026, month: 'Mar', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 190000000 },
  { id: 'b-10', year: 2026, month: 'Mar', costCenter: 'HR002', item: 'HR006EMPLOYEEENGAGEMENT', amount: 110000000 },
  { id: 'b-11', year: 2026, month: 'Mar', costCenter: 'GA001', item: 'GA001OFFICEEXPENSE', amount: 75000000 },

  { id: 'b-12', year: 2026, month: 'Apr', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 240000000 },
  { id: 'b-13', year: 2026, month: 'Apr', costCenter: 'HR001', item: 'HR002SEMINAREXTERNAL', amount: 90000000 },
  { id: 'b-14', year: 2026, month: 'Apr', costCenter: 'IT001', item: 'IT003SECURITYENCRYPTION', amount: 65000000 },

  { id: 'b-15', year: 2026, month: 'May', costCenter: 'HR001', item: 'HR003LEADERSHIPPROGRAM', amount: 220000000 },
  { id: 'b-16', year: 2026, month: 'May', costCenter: 'HR002', item: 'HR005EMPLOYEEWELFARE', amount: 95000000 },

  { id: 'b-17', year: 2026, month: 'Jun', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 230000000 },
  { id: 'b-18', year: 2026, month: 'Jun', costCenter: 'GA001', item: 'GA001OFFICEEXPENSE', amount: 85000000 },

  { id: 'b-19', year: 2026, month: 'Jul', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 200000000 },
  { id: 'b-20', year: 2026, month: 'Aug', costCenter: 'HR001', item: 'HR002SEMINAREXTERNAL', amount: 120000000 },
  { id: 'b-21', year: 2026, month: 'Sep', costCenter: 'HR001', item: 'HR003LEADERSHIPPROGRAM', amount: 175000000 },
  { id: 'b-22', year: 2026, month: 'Oct', costCenter: 'HR002', item: 'HR004TALENTACQUISITION', amount: 130000000 },
  { id: 'b-23', year: 2026, month: 'Nov', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 210000000 },
  { id: 'b-24', year: 2026, month: 'Dec', costCenter: 'HR002', item: 'HR006EMPLOYEEENGAGEMENT', amount: 150000000 }
];

export const INITIAL_FORECAST: ForecastRecord[] = [
  { id: 'f-01', year: 2026, month: 'Jan', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 195000000 },
  { id: 'f-02', year: 2026, month: 'Jan', costCenter: 'HR001', item: 'HR002SEMINAREXTERNAL', amount: 70000000 },
  { id: 'f-03', year: 2026, month: 'Jan', costCenter: 'HR002', item: 'HR004TALENTACQUISITION', amount: 90000000 },
  { id: 'f-04', year: 2026, month: 'Jan', costCenter: 'IT001', item: 'IT001CLOUDINFRASUPABASE', amount: 52000000 },

  { id: 'f-05', year: 2026, month: 'Feb', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 220000000 },
  { id: 'f-06', year: 2026, month: 'Feb', costCenter: 'HR001', item: 'HR003LEADERSHIPPROGRAM', amount: 145000000 },
  { id: 'f-07', year: 2026, month: 'Feb', costCenter: 'HR002', item: 'HR005EMPLOYEEWELFARE', amount: 82000000 },
  { id: 'f-08', year: 2026, month: 'Feb', costCenter: 'IT001', item: 'IT002LOOKERLICENSE', amount: 35000000 },

  { id: 'f-09', year: 2026, month: 'Mar', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 185000000 },
  { id: 'f-10', year: 2026, month: 'Mar', costCenter: 'HR002', item: 'HR006EMPLOYEEENGAGEMENT', amount: 115000000 },
  { id: 'f-11', year: 2026, month: 'Mar', costCenter: 'GA001', item: 'GA001OFFICEEXPENSE', amount: 78000000 },

  { id: 'f-12', year: 2026, month: 'Apr', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 235000000 },
  { id: 'f-13', year: 2026, month: 'Apr', costCenter: 'HR001', item: 'HR002SEMINAREXTERNAL', amount: 85000000 },
  { id: 'f-14', year: 2026, month: 'Apr', costCenter: 'IT001', item: 'IT003SECURITYENCRYPTION', amount: 62000000 },

  { id: 'f-15', year: 2026, month: 'May', costCenter: 'HR001', item: 'HR003LEADERSHIPPROGRAM', amount: 215000000 },
  { id: 'f-16', year: 2026, month: 'May', costCenter: 'HR002', item: 'HR005EMPLOYEEWELFARE', amount: 98000000 },

  { id: 'f-17', year: 2026, month: 'Jun', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 225000000 },
  { id: 'f-18', year: 2026, month: 'Jun', costCenter: 'GA001', item: 'GA001OFFICEEXPENSE', amount: 80000000 },

  { id: 'f-19', year: 2026, month: 'Jul', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 195000000 },
  { id: 'f-20', year: 2026, month: 'Aug', costCenter: 'HR001', item: 'HR002SEMINAREXTERNAL', amount: 115000000 },
  { id: 'f-21', year: 2026, month: 'Sep', costCenter: 'HR001', item: 'HR003LEADERSHIPPROGRAM', amount: 180000000 },
  { id: 'f-22', year: 2026, month: 'Oct', costCenter: 'HR002', item: 'HR004TALENTACQUISITION', amount: 125000000 },
  { id: 'f-23', year: 2026, month: 'Nov', costCenter: 'HR001', item: 'HR001EDUCATIONFEETRAINING', amount: 215000000 },
  { id: 'f-24', year: 2026, month: 'Dec', costCenter: 'HR002', item: 'HR006EMPLOYEEENGAGEMENT', amount: 145000000 }
];

export const INITIAL_REALIZATION: RealizationRecord[] = [
  {
    id: 'r-01',
    tanggal: '2026-01-14',
    year: 2026,
    month: 'Jan',
    costCenter: 'HR001',
    item: 'HR001EDUCATIONFEETRAINING',
    amount: 192500000,
    keterangan: 'Batch 1 Lean Manufacturing & TPM Certification Trainer Batch Surabaya',
    bankingReference: 'BCA-TX-990214',
    reconciled: true
  },
  {
    id: 'r-02',
    tanggal: '2026-01-22',
    year: 2026,
    month: 'Jan',
    costCenter: 'HR001',
    item: 'HR002SEMINAREXTERNAL',
    amount: 68400000,
    keterangan: 'HR Executive Summit Jakarta - 3 participants flight & accommodations',
    bankingReference: 'BCA-TX-990230',
    reconciled: true
  },
  {
    id: 'r-03',
    tanggal: '2026-01-28',
    year: 2026,
    month: 'Jan',
    costCenter: 'HR002',
    item: 'HR004TALENTACQUISITION',
    amount: 94200000,
    keterangan: 'Online Psychotest platform annual quota & Campus Hiring Malang fee',
    bankingReference: 'MDR-TX-881290',
    reconciled: true
  },
  {
    id: 'r-04',
    tanggal: '2026-01-31',
    year: 2026,
    month: 'Jan',
    costCenter: 'IT001',
    item: 'IT001CLOUDINFRASUPABASE',
    amount: 51200000,
    keterangan: 'Dedicated database cloud instance + encrypted backup storage Jan',
    bankingReference: 'BCA-TX-990401',
    reconciled: true
  },
  {
    id: 'r-05',
    tanggal: '2026-02-12',
    year: 2026,
    month: 'Feb',
    costCenter: 'HR001',
    item: 'HR001EDUCATIONFEETRAINING',
    amount: 228000000, // Slightly over forecast! (forecast: 220M) -> Triggers warning!
    keterangan: 'Additional ISO 22000 & Halal Auditor refresher for 15 factory leaders',
    bankingReference: 'BCA-TX-991102',
    reconciled: true
  },
  {
    id: 'r-06',
    tanggal: '2026-02-19',
    year: 2026,
    month: 'Feb',
    costCenter: 'HR001',
    item: 'HR003LEADERSHIPPROGRAM',
    amount: 141000000,
    keterangan: 'Section Manager leadership development module 1 & venue rental',
    bankingReference: 'MDR-TX-882310',
    reconciled: true
  },
  {
    id: 'r-07',
    tanggal: '2026-02-26',
    year: 2026,
    month: 'Feb',
    costCenter: 'HR002',
    item: 'HR005EMPLOYEEWELFARE',
    amount: 81500000,
    keterangan: 'Phase 1 Periodic Health Surveillance for Shift Workers Mojokerto',
    bankingReference: 'BCA-TX-991340',
    reconciled: true
  },
  {
    id: 'r-08',
    tanggal: '2026-02-28',
    year: 2026,
    month: 'Feb',
    costCenter: 'IT001',
    item: 'IT002LOOKERLICENSE',
    amount: 34800000,
    keterangan: 'Looker Studio Pro subscription 12 viewers + connector quota',
    bankingReference: 'BCA-TX-991590',
    reconciled: true
  },
  {
    id: 'r-09',
    tanggal: '2026-03-08',
    year: 2026,
    month: 'Mar',
    costCenter: 'HR001',
    item: 'HR001EDUCATIONFEETRAINING',
    amount: 182000000,
    keterangan: 'Safety Officer BNSP Certification for 8 plant supervisors',
    bankingReference: 'BCA-TX-992100',
    reconciled: true
  },
  {
    id: 'r-10',
    tanggal: '2026-03-24',
    year: 2026,
    month: 'Mar',
    costCenter: 'HR002',
    item: 'HR006EMPLOYEEENGAGEMENT',
    amount: 119500000, // Approaching limit
    keterangan: 'Ramadhan Blessing community engagement & factory staff iftar',
    bankingReference: 'MDR-TX-883490',
    reconciled: true
  },
  {
    id: 'r-11',
    tanggal: '2026-03-30',
    year: 2026,
    month: 'Mar',
    costCenter: 'GA001',
    item: 'GA001OFFICEEXPENSE',
    amount: 76800000,
    keterangan: 'Q1 Stationery, printing papers, and ergonomic meeting accessories',
    bankingReference: 'BCA-TX-992810',
    reconciled: true
  }
];

export const INITIAL_BANK_ACCOUNTS: BankingAccount[] = [
  {
    bankName: 'PT Bank Central Asia Tbk (BCA)',
    accountNumber: '028-891-2300',
    accountName: 'PT AJINOMOTO INDONESIA - PT AJINEX INTERNATIONAL, MOJOKERTO FACTORY - OPS',
    balance: 4850000000,
    currency: 'IDR',
    apiEnvironment: 'Production',
    status: 'Active',
    lastSync: '2026-09-05 20:45 WIB'
  },
  {
    bankName: 'PT Bank Mandiri (Persero) Tbk',
    accountNumber: '142-00-9981244-1',
    accountName: 'PT AJINOMOTO INDONESIA - PT AJINEX INTERNATIONAL, MOJOKERTO FACTORY - DISBURSEMENT',
    balance: 2980000000,
    currency: 'IDR',
    apiEnvironment: 'Production',
    status: 'Active',
    lastSync: '2026-09-05 20:48 WIB'
  }
];

export const INITIAL_BANK_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'btx-101',
    date: '2026-01-14',
    description: 'TRF BATCH LEAN MFG TRAINER PT KAIZEN INDO',
    amount: 192500000,
    type: 'debit',
    referenceNo: 'BCA-TX-990214',
    status: 'Reconciled',
    matchedRealizationId: 'r-01'
  },
  {
    id: 'btx-102',
    date: '2026-01-22',
    description: 'TRF TRAVELOKA CORP ACC EXEC SUMMIT',
    amount: 68400000,
    type: 'debit',
    referenceNo: 'BCA-TX-990230',
    status: 'Reconciled',
    matchedRealizationId: 'r-02'
  },
  {
    id: 'btx-103',
    date: '2026-01-28',
    description: 'TRF PSYCHOTEST INTL CORP SUBSCRIPTION',
    amount: 94200000,
    type: 'debit',
    referenceNo: 'MDR-TX-881290',
    status: 'Reconciled',
    matchedRealizationId: 'r-03'
  },
  {
    id: 'btx-104',
    date: '2026-02-12',
    description: 'TRF HALAL TRAINING CTR INDO',
    amount: 228000000,
    type: 'debit',
    referenceNo: 'BCA-TX-991102',
    status: 'Reconciled',
    matchedRealizationId: 'r-05'
  },
  {
    id: 'btx-105',
    date: '2026-03-24',
    description: 'TRF KATERING IFTAR MOJOKERTO PLANT',
    amount: 119500000,
    type: 'debit',
    referenceNo: 'MDR-TX-883490',
    status: 'Reconciled',
    matchedRealizationId: 'r-10'
  },
  {
    id: 'btx-106',
    date: '2026-04-02',
    description: 'SETTLEMENT VIRTUAL ACCOUNT VENDOR ATK',
    amount: 15400000,
    type: 'debit',
    referenceNo: 'BCA-TX-993021',
    status: 'Pending'
  }
];

export const INITIAL_EMAIL_SETTING: EmailSetting = {
  warningThreshold: 85,
  dangerThreshold: 100,
  recipients: [
    'paajinomoto@gmail.com',
    'hr.director@ajinomoto.co.id',
    'factory.finance@ajinomoto.co.id',
    'internal.audit@ajinomoto.co.id'
  ],
  autoSendOnThreshold: true,
  senderName: 'DABACO System - PT Ajinomoto Indonesia - PT Ajinex International, Mojokerto Factory',
  smtpStatus: 'Ready'
};

export const INITIAL_SHEETS_CONFIG: GoogleSheetsConfig = {
  spreadsheetId: '1eC6V4mC9F9G_Ajinomoto_Budget_2026_Sheet',
  sheetNameBudget: 'BUDGET_PLAN',
  sheetNameForecast: 'FORECAST',
  sheetNameRealization: 'REALIZATION',
  gasWebAppUrl: 'https://script.google.com/macros/s/AKfycbz_DabacoAjinomotoApi/exec',
  apiKey: 'aji_sec_live_99482710492147',
  autoSync: true,
  syncIntervalMinutes: 5,
  lastSyncTimestamp: '2026-09-05 20:50:12',
  status: 'connected',
  lastLog: 'Synchronization success: 24 Budget rows, 24 Forecast rows, 11 Realization rows verified with checksum.'
};

export const INITIAL_LOOKER_CONFIG: LookerStudioConfig = {
  reportUrl: 'https://lookerstudio.google.com/embed/reporting/0B5f2e82-sample-ajinomoto-budget/page/p_dabaco_live',
  enabled: true,
  theme: 'dark',
  aspectRatio: '16:9'
};

export const INITIAL_SUPABASE_CONFIG: SupabaseConfig = {
  projectUrl: '',
  anonKey: '',
  status: 'disconnected',
  tablesSynced: 0,
  lastBackupTime: null,
  encryptionActive: true
};

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-01',
    username: 'admin',
    displayName: 'Ahmad Syafiq',
    email: 'paajinomoto@gmail.com',
    department: 'HR Development',
    role: 'SuperAdmin',
    status: 'Active',
    createdAt: '2026-01-10',
    lastLogin: 'Hari ini, 08:30 WIB',
    avatarColor: 'bg-red-600'
  },
  {
    id: 'usr-02',
    username: 'controller_pabrik',
    displayName: 'Tri Wahyuni, SE',
    email: 'tri.wahyuni@ajinomoto.co.id',
    department: 'Budget Control Pabrik',
    role: 'BudgetController',
    status: 'Active',
    createdAt: '2026-01-15',
    lastLogin: 'Kemarin, 14:15 WIB',
    avatarColor: 'bg-blue-600'
  },
  {
    id: 'usr-03',
    username: 'head_ga',
    displayName: 'Bambang Prasetyo',
    email: 'bambang.p@ajinomoto.co.id',
    department: 'General Affairs',
    role: 'SectionHead',
    status: 'Active',
    createdAt: '2026-02-01',
    lastLogin: '3 hari yang lalu',
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'usr-04',
    username: 'head_training',
    displayName: 'Siti Rahmawati',
    email: 'siti.rahma@ajinomoto.co.id',
    department: 'Training & Development',
    role: 'SectionHead',
    status: 'Active',
    createdAt: '2026-02-05',
    lastLogin: '1 minggu yang lalu',
    avatarColor: 'bg-purple-600'
  },
  {
    id: 'usr-05',
    username: 'auditor_internal',
    displayName: 'Hendro Kusumo',
    email: 'hendro.k@ajinomoto.co.id',
    department: 'Internal Audit & Compliance',
    role: 'Auditor',
    status: 'Active',
    createdAt: '2026-01-20',
    lastLogin: '2 minggu yang lalu',
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'usr-06',
    username: 'staff_recruitment',
    displayName: 'Dian Permata',
    email: 'dian.permata@ajinomoto.co.id',
    department: 'Recruitment & Staffing',
    role: 'Staff',
    status: 'Active',
    createdAt: '2026-03-01',
    lastLogin: 'Kemarin, 16:45 WIB',
    avatarColor: 'bg-cyan-600'
  }
];


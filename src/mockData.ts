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
  {
    "code": "HR001 - Education Fee Training",
    "name": "HR001 - Education Fee Training",
    "department": "Human Resources (Training & Dev)",
    "headOfDept": "S. Wardhana"
  },
  {
    "code": "HR002 - Education Fee Recruitment",
    "name": "HR002 - Education Fee Recruitment",
    "department": "Human Resources (Recruitment)",
    "headOfDept": "D. Prasetyo"
  },
  {
    "code": "HRX002 - Education Fee Recruitment",
    "name": "HRX002 - Education Fee Recruitment",
    "department": "PT Ajinex International",
    "headOfDept": "R. Kusumo"
  },
  {
    "code": "HRX001 - Education Fee Training",
    "name": "HRX001 - Education Fee Training",
    "department": "PT Ajinex International",
    "headOfDept": "H. Sugiharto"
  },
  {
    "code": "HR001",
    "name": "HR Development & Training",
    "department": "Human Resources",
    "headOfDept": "S. Wardhana"
  },
  {
    "code": "HR002",
    "name": "Recruitment & Assessment",
    "department": "Human Resources",
    "headOfDept": "D. Prasetyo"
  },
  {
    "code": "GA001",
    "name": "General Affairs & Operations",
    "department": "General Affairs",
    "headOfDept": "B. Santoso"
  },
  {
    "code": "IT001",
    "name": "IT Infrastructure & Security",
    "department": "Information Technology",
    "headOfDept": "A. Rahman"
  },
  {
    "code": "PR001",
    "name": "Plant Operations Support",
    "department": "Manufacturing",
    "headOfDept": "M. Hidayat"
  }
];

export const INITIAL_MASTER_ITEMS: MasterItem[] = [
  {
    "code": "English Training",
    "name": "English Training",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "HR Training",
    "name": "HR Training",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Pelatihan Purchasing & Procurement Management",
    "name": "Pelatihan Purchasing & Procurement Management",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Building & Facility Management",
    "name": "Building & Facility Management",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Formalities Document for Expatriate and Legal Procedures",
    "name": "Formalities Document for Expatriate and Legal Procedures",
    "category": "Legal & Compliance",
    "status": "Active"
  },
  {
    "code": "Training PI System",
    "name": "Training PI System",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Health Age",
    "name": "Health Age",
    "category": "Employee Welfare",
    "status": "Active"
  },
  {
    "code": "Training for Trainer",
    "name": "Training for Trainer",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Manajemen SDM Warehouse Training",
    "name": "Manajemen SDM Warehouse Training",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Training Leadership & Team Building (PUK)",
    "name": "Training Leadership & Team Building (PUK)",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Effective Communication & Time Management",
    "name": "Effective Communication & Time Management",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "SIBI Awards",
    "name": "SIBI Awards",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Recruitment",
    "name": "Recruitment",
    "category": "Recruitment & Assessment",
    "status": "Active"
  },
  {
    "code": "Training Power BI, Power Apps & Power Automate",
    "name": "Training Power BI, Power Apps & Power Automate",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "Training Data Science For Expert",
    "name": "Training Data Science For Expert",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "Health Dissemination Based on Hasil MCU Kesehatan Jantung",
    "name": "Health Dissemination Based on Hasil MCU Kesehatan Jantung",
    "category": "Employee Welfare",
    "status": "Active"
  },
  {
    "code": "Health Dissemination Mental Health",
    "name": "Health Dissemination Mental Health",
    "category": "Employee Welfare",
    "status": "Active"
  },
  {
    "code": "Health Dissemination Based on Hasil MCU Obesitas",
    "name": "Health Dissemination Based on Hasil MCU Obesitas",
    "category": "Employee Welfare",
    "status": "Active"
  },
  {
    "code": "Learning Delivery From Gap Based on Technical Skill",
    "name": "Learning Delivery From Gap Based on Technical Skill",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Expertice Document Legal",
    "name": "Expertice Document Legal",
    "category": "Legal & Compliance",
    "status": "Active"
  },
  {
    "code": "Sertifikasi Kompetensi Kelistrikan mengacu SMK2",
    "name": "Sertifikasi Kompetensi Kelistrikan mengacu SMK2",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Refreshment Teknologi WWTP",
    "name": "Refreshment Teknologi WWTP",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Supply Chain Management",
    "name": "Supply Chain Management",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Sertifikasi HR Manager",
    "name": "Sertifikasi HR Manager",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Operator Overhead Crane Class III",
    "name": "Operator Overhead Crane Class III",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Cargo Hoist Crane",
    "name": "Cargo Hoist Crane",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Pelatihan & Sertifikasi Petugas K3 Kimia",
    "name": "Pelatihan & Sertifikasi Petugas K3 Kimia",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "DCS Sistem",
    "name": "DCS Sistem",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Project Management",
    "name": "Project Management",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Regulasi Ketenagakerjaan",
    "name": "Regulasi Ketenagakerjaan",
    "category": "Legal & Compliance",
    "status": "Active"
  },
  {
    "code": "Certified Basic Legal Officer (CBLO)",
    "name": "Certified Basic Legal Officer (CBLO)",
    "category": "Legal & Compliance",
    "status": "Active"
  },
  {
    "code": "Certified Contract Drafter",
    "name": "Certified Contract Drafter",
    "category": "Legal & Compliance",
    "status": "Active"
  },
  {
    "code": "Training Basic Data Analysis",
    "name": "Training Basic Data Analysis",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "DX Improvement NIR sensor",
    "name": "DX Improvement NIR sensor",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "S-Jar Operation Improvement",
    "name": "S-Jar Operation Improvement",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Food Safety Culture Excellence",
    "name": "Food Safety Culture Excellence",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "name": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Training Digital Transformation",
    "name": "Training Digital Transformation",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "Health Dissemination Based on Hasil MCU Penurunan Fungsi Ginjal",
    "name": "Health Dissemination Based on Hasil MCU Penurunan Fungsi Ginjal",
    "category": "Employee Welfare",
    "status": "Active"
  },
  {
    "code": "Data Story Telling & Impactfull Presentation",
    "name": "Data Story Telling & Impactfull Presentation",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Sertifikasi PPPU",
    "name": "Sertifikasi PPPU",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Pelatihan Basic Procurement / Teknik Negosiasi",
    "name": "Pelatihan Basic Procurement / Teknik Negosiasi",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Health Dissemination Based on Hasil MCU Hiperglikemia",
    "name": "Health Dissemination Based on Hasil MCU Hiperglikemia",
    "category": "Employee Welfare",
    "status": "Active"
  },
  {
    "code": "Pelatihan Basic Procurement / Analisa Procurement",
    "name": "Pelatihan Basic Procurement / Analisa Procurement",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Program PLC Training",
    "name": "Program PLC Training",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Asset Management",
    "name": "Asset Management",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Sertifikasi Talent Management",
    "name": "Sertifikasi Talent Management",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Pest Management",
    "name": "Pest Management",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Training AI For Expert",
    "name": "Training AI For Expert",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "Packaging Development & Automation Training",
    "name": "Packaging Development & Automation Training",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Color Matching di Maker Tinta",
    "name": "Color Matching di Maker Tinta",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Training ke Maker Cylinder",
    "name": "Training ke Maker Cylinder",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Sertifikasi Training of Trainer KKNI Level 3",
    "name": "Sertifikasi Training of Trainer KKNI Level 3",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "Training Ms Office",
    "name": "Training Ms Office",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "Training Ms Office Expert",
    "name": "Training Ms Office Expert",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "Pelatihan MR-Configurator dan Maintenance Automation",
    "name": "Pelatihan MR-Configurator dan Maintenance Automation",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "Training AI Beginner",
    "name": "Training AI Beginner",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "Sertifikasi Data Analisis",
    "name": "Sertifikasi Data Analisis",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "Food Loos, Food Wate & Equepment Management",
    "name": "Food Loos, Food Wate & Equepment Management",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "HR001EDUCATIONFEETRAINING",
    "name": "Training & Certification Competency",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "HR002SEMINAREXTERNAL",
    "name": "Seminar & Strategic Workshop External",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "HR003LEADERSHIPPROGRAM",
    "name": "Management Leadership Development Program",
    "category": "Training & Development",
    "status": "Active"
  },
  {
    "code": "HR004TALENTACQUISITION",
    "name": "Executive Talent Assessment & Psychotest",
    "category": "Recruitment & Assessment",
    "status": "Active"
  },
  {
    "code": "HR005EMPLOYEEWELFARE",
    "name": "Annual Health Screening & Medical Checkup",
    "category": "Employee Welfare",
    "status": "Active"
  },
  {
    "code": "HR006EMPLOYEEENGAGEMENT",
    "name": "Townhall Gathering & Corporate Value Event",
    "category": "Employee Welfare",
    "status": "Active"
  },
  {
    "code": "GA001OFFICEEXPENSE",
    "name": "Operational Facility & Office Consumables",
    "category": "Facility & Operations",
    "status": "Active"
  },
  {
    "code": "IT001CLOUDINFRASUPABASE",
    "name": "Cloud Database Storage & Supabase Sync",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "IT002LOOKERLICENSE",
    "name": "Looker Studio Enterprise BI Connectors",
    "category": "IT & Digital Systems",
    "status": "Active"
  },
  {
    "code": "IT003SECURITYENCRYPTION",
    "name": "SSL Auth Gateway & Encryption Infrastructure",
    "category": "IT & Digital Systems",
    "status": "Active"
  }
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

export const FY_MONTHS: FYMonthInfo[] = [
  { code: 'Apr', shortName: 'Apr', fullName: 'April', isNextYear: false, order: 1, quarter: 'Q1' },
  { code: 'May', shortName: 'Mei', fullName: 'Mei', isNextYear: false, order: 2, quarter: 'Q1' },
  { code: 'Jun', shortName: 'Jun', fullName: 'Juni', isNextYear: false, order: 3, quarter: 'Q1' },
  { code: 'Jul', shortName: 'Jul', fullName: 'Juli', isNextYear: false, order: 4, quarter: 'Q2' },
  { code: 'Aug', shortName: 'Agu', fullName: 'Agustus', isNextYear: false, order: 5, quarter: 'Q2' },
  { code: 'Sep', shortName: 'Sep', fullName: 'September', isNextYear: false, order: 6, quarter: 'Q2' },
  { code: 'Oct', shortName: 'Okt', fullName: 'Oktober', isNextYear: false, order: 7, quarter: 'Q3' },
  { code: 'Nov', shortName: 'Nov', fullName: 'November', isNextYear: false, order: 8, quarter: 'Q3' },
  { code: 'Dec', shortName: 'Des', fullName: 'Desember', isNextYear: false, order: 9, quarter: 'Q3' },
  { code: 'Jan', shortName: 'Jan', fullName: 'Januari', isNextYear: true, order: 10, quarter: 'Q4' },
  { code: 'Feb', shortName: 'Feb', fullName: 'Februari', isNextYear: true, order: 11, quarter: 'Q4' },
  { code: 'Mar', shortName: 'Mar', fullName: 'Maret', isNextYear: true, order: 12, quarter: 'Q4' }
];

export const FY_MONTH_DETAILS = FY_MONTHS;

export function getRecordFY(year: number, month: string): number {
  const norm = (month || '').slice(0, 3).toLowerCase();
  if (norm === 'jan' || norm === 'feb' || norm === 'mar') {
    return year - 1;
  }
  return year;
}

export const INITIAL_BUDGET: BudgetRecord[] = [
  {
    "id": "b-001",
    "year": 2026,
    "month": "Apr",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 20000000
  },
  {
    "id": "b-002",
    "year": 2026,
    "month": "Apr",
    "costCenter": "HR001 - Education Fee Training",
    "item": "HR Training",
    "amount": 5000000
  },
  {
    "id": "b-003",
    "year": 2026,
    "month": "May",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan Purchasing & Procurement Management",
    "amount": 5000000
  },
  {
    "id": "b-004",
    "year": 2026,
    "month": "May",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Building & Facility Management",
    "amount": 10000000
  },
  {
    "id": "b-005",
    "year": 2026,
    "month": "May",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Formalities Document for Expatriate and Legal Procedures",
    "amount": 15000000
  },
  {
    "id": "b-006",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training PI System",
    "amount": 30000000
  },
  {
    "id": "b-007",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Age",
    "amount": 5000000
  },
  {
    "id": "b-008",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training for Trainer",
    "amount": 27500000
  },
  {
    "id": "b-009",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "HR Training",
    "amount": 19085139
  },
  {
    "id": "b-010",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Manajemen SDM Warehouse Training",
    "amount": 15000000
  },
  {
    "id": "b-011",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Leadership & Team Building (PUK)",
    "amount": 60000000
  },
  {
    "id": "b-012",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Effective Communication & Time Management",
    "amount": 5000000
  },
  {
    "id": "b-013",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR001 - Education Fee Training",
    "item": "SIBI Awards",
    "amount": 30000000
  },
  {
    "id": "b-014",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 50000000
  },
  {
    "id": "b-015",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HRX002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 17000000
  },
  {
    "id": "b-016",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Power BI, Power Apps & Power Automate",
    "amount": 150000000
  },
  {
    "id": "b-017",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Data Science For Expert",
    "amount": 30000000
  },
  {
    "id": "b-018",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Based on Hasil MCU Kesehatan Jantung",
    "amount": 5000000
  },
  {
    "id": "b-019",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Mental Health",
    "amount": 3952167
  },
  {
    "id": "b-020",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Based on Hasil MCU Obesitas",
    "amount": 3000000
  },
  {
    "id": "b-021",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 30000000
  },
  {
    "id": "b-022",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 7000000
  },
  {
    "id": "b-023",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training for Trainer",
    "amount": 25000000
  },
  {
    "id": "b-024",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Expertice Document Legal",
    "amount": 10000000
  },
  {
    "id": "b-025",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi Kompetensi Kelistrikan mengacu SMK2",
    "amount": 15000000
  },
  {
    "id": "b-026",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Refreshment Teknologi WWTP",
    "amount": 8000000
  },
  {
    "id": "b-027",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Supply Chain Management",
    "amount": 10000000
  },
  {
    "id": "b-028",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi HR Manager",
    "amount": 30000000
  },
  {
    "id": "b-029",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Operator Overhead Crane Class III",
    "amount": 10000000
  },
  {
    "id": "b-030",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Cargo Hoist Crane",
    "amount": 10000000
  },
  {
    "id": "b-031",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan & Sertifikasi Petugas K3 Kimia",
    "amount": 10000000
  },
  {
    "id": "b-032",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "DCS Sistem",
    "amount": 10000000
  },
  {
    "id": "b-033",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Project Management",
    "amount": 12000000
  },
  {
    "id": "b-034",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Regulasi Ketenagakerjaan",
    "amount": 10000000
  },
  {
    "id": "b-035",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Certified Basic Legal Officer (CBLO)",
    "amount": 12000000
  },
  {
    "id": "b-036",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Certified Contract Drafter",
    "amount": 13000000
  },
  {
    "id": "b-037",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Power BI, Power Apps & Power Automate",
    "amount": 30500000
  },
  {
    "id": "b-038",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Basic Data Analysis",
    "amount": 30500000
  },
  {
    "id": "b-039",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Effective Communication & Time Management",
    "amount": 8000000
  },
  {
    "id": "b-040",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "DX Improvement NIR sensor",
    "amount": 5500000
  },
  {
    "id": "b-041",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "S-Jar Operation Improvement",
    "amount": 5500000
  },
  {
    "id": "b-042",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Food Safety Culture Excellence",
    "amount": 22000000
  },
  {
    "id": "b-043",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 10000000
  },
  {
    "id": "b-044",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 2000000
  },
  {
    "id": "b-045",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 80000000
  },
  {
    "id": "b-046",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Data Science For Expert",
    "amount": 35000000
  },
  {
    "id": "b-047",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Digital Transformation",
    "amount": 55000000
  },
  {
    "id": "b-048",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Based on Hasil MCU Penurunan Fungsi Ginjal",
    "amount": 5000000
  },
  {
    "id": "b-049",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 6000000
  },
  {
    "id": "b-050",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 22000000
  },
  {
    "id": "b-051",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training for Trainer",
    "amount": 30000000
  },
  {
    "id": "b-052",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Data Story Telling & Impactfull Presentation",
    "amount": 35000000
  },
  {
    "id": "b-053",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi PPPU",
    "amount": 20000000
  },
  {
    "id": "b-054",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan Basic Procurement / Teknik Negosiasi",
    "amount": 10000000
  },
  {
    "id": "b-055",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 11627280
  },
  {
    "id": "b-056",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Data Science For Expert",
    "amount": 10500000
  },
  {
    "id": "b-057",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Digital Transformation",
    "amount": 10500000
  },
  {
    "id": "b-058",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 135000000
  },
  {
    "id": "b-059",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Power BI, Power Apps & Power Automate",
    "amount": 70000000
  },
  {
    "id": "b-060",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Basic Data Analysis",
    "amount": 110000000
  },
  {
    "id": "b-061",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Based on Hasil MCU Hiperglikemia",
    "amount": 5000000
  },
  {
    "id": "b-062",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 7000000
  },
  {
    "id": "b-063",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 5000000
  },
  {
    "id": "b-064",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training for Trainer",
    "amount": 35000000
  },
  {
    "id": "b-065",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan Basic Procurement / Analisa Procurement",
    "amount": 12000000
  },
  {
    "id": "b-066",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Program PLC Training",
    "amount": 15000000
  },
  {
    "id": "b-067",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Asset Management",
    "amount": 10000000
  },
  {
    "id": "b-068",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi Talent Management",
    "amount": 17000000
  },
  {
    "id": "b-069",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Pest Management",
    "amount": 2500000
  },
  {
    "id": "b-070",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 80000000
  },
  {
    "id": "b-071",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training AI For Expert",
    "amount": 150000000
  },
  {
    "id": "b-072",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 2000000
  },
  {
    "id": "b-073",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 2000000
  },
  {
    "id": "b-074",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "SIBI Awards",
    "amount": 60000000
  },
  {
    "id": "b-075",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Data Story Telling & Impactfull Presentation",
    "amount": 70000000
  },
  {
    "id": "b-076",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Packaging Development & Automation Training",
    "amount": 7000000
  },
  {
    "id": "b-077",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Color Matching di Maker Tinta",
    "amount": 7000000
  },
  {
    "id": "b-078",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training ke Maker Cylinder",
    "amount": 7000000
  },
  {
    "id": "b-079",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi Training of Trainer KKNI Level 3",
    "amount": 7000000
  },
  {
    "id": "b-080",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 20500000
  },
  {
    "id": "b-081",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training AI For Expert",
    "amount": 40500000
  },
  {
    "id": "b-082",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Ms Office",
    "amount": 110000000
  },
  {
    "id": "b-083",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Ms Office Expert",
    "amount": 60000000
  },
  {
    "id": "b-084",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 2000000
  },
  {
    "id": "b-085",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 2000000
  },
  {
    "id": "b-086",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan MR-Configurator dan Maintenance Automation",
    "amount": 10000000
  },
  {
    "id": "b-087",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Ms Office",
    "amount": 16000000
  },
  {
    "id": "b-088",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Ms Office Expert",
    "amount": 15500000
  },
  {
    "id": "b-089",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training AI Beginner",
    "amount": 35000000
  },
  {
    "id": "b-090",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 2000000
  },
  {
    "id": "b-091",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 2000000
  },
  {
    "id": "b-092",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi Data Analisis",
    "amount": 25000000
  },
  {
    "id": "b-093",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Food Loos, Food Wate & Equepment Management",
    "amount": 2500000
  },
  {
    "id": "b-094",
    "year": 2027,
    "month": "Feb",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 35000000
  },
  {
    "id": "b-095",
    "year": 2027,
    "month": "Feb",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 5000000
  },
  {
    "id": "b-096",
    "year": 2027,
    "month": "Mar",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 35000000
  },
  {
    "id": "b-097",
    "year": 2027,
    "month": "Mar",
    "costCenter": "HR002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 50000000
  },
  {
    "id": "b-098",
    "year": 2027,
    "month": "Mar",
    "costCenter": "HRX002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 6000000
  }
];

export const INITIAL_FORECAST: ForecastRecord[] = [
  {
    "id": "f-001",
    "year": 2026,
    "month": "Apr",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 17286324
  },
  {
    "id": "f-002",
    "year": 2026,
    "month": "Apr",
    "costCenter": "HR001 - Education Fee Training",
    "item": "HR Training",
    "amount": 3490000
  },
  {
    "id": "f-003",
    "year": 2026,
    "month": "May",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan Purchasing & Procurement Management",
    "amount": 807520
  },
  {
    "id": "f-004",
    "year": 2026,
    "month": "May",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Building & Facility Management",
    "amount": 4000000
  },
  {
    "id": "f-005",
    "year": 2026,
    "month": "May",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Formalities Document for Expatriate and Legal Procedures",
    "amount": 10000000
  },
  {
    "id": "f-006",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training PI System",
    "amount": 3438000
  },
  {
    "id": "f-007",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Age",
    "amount": 4005020
  },
  {
    "id": "f-008",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training for Trainer",
    "amount": 9000000
  },
  {
    "id": "f-009",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "HR Training",
    "amount": 5008793
  },
  {
    "id": "f-010",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Manajemen SDM Warehouse Training",
    "amount": 12000000
  },
  {
    "id": "f-011",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Leadership & Team Building (PUK)",
    "amount": 57407232
  },
  {
    "id": "f-012",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Effective Communication & Time Management",
    "amount": 2208000
  },
  {
    "id": "f-013",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR001 - Education Fee Training",
    "item": "SIBI Awards",
    "amount": 26083682
  },
  {
    "id": "f-014",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 35362500
  },
  {
    "id": "f-015",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HRX002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 6562965
  },
  {
    "id": "f-016",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Power BI, Power Apps & Power Automate",
    "amount": 109000000
  },
  {
    "id": "f-017",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Data Science For Expert",
    "amount": 30000000
  },
  {
    "id": "f-018",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Based on Hasil MCU Kesehatan Jantung",
    "amount": 5000000
  },
  {
    "id": "f-019",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Mental Health",
    "amount": 1890753
  },
  {
    "id": "f-020",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Based on Hasil MCU Obesitas",
    "amount": 3000000
  },
  {
    "id": "f-021",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 30000000
  },
  {
    "id": "f-022",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 5000000
  },
  {
    "id": "f-023",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training for Trainer",
    "amount": 25000000
  },
  {
    "id": "f-024",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Expertice Document Legal",
    "amount": 10000000
  },
  {
    "id": "f-025",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi Kompetensi Kelistrikan mengacu SMK2",
    "amount": 15000000
  },
  {
    "id": "f-026",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Refreshment Teknologi WWTP",
    "amount": 8000000
  },
  {
    "id": "f-027",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Supply Chain Management",
    "amount": 10000000
  },
  {
    "id": "f-028",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi HR Manager",
    "amount": 30000000
  },
  {
    "id": "f-029",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Operator Overhead Crane Class III",
    "amount": 5000000
  },
  {
    "id": "f-030",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Cargo Hoist Crane",
    "amount": 5000000
  },
  {
    "id": "f-031",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan & Sertifikasi Petugas K3 Kimia",
    "amount": 7000000
  },
  {
    "id": "f-032",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "DCS Sistem",
    "amount": 5000000
  },
  {
    "id": "f-033",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Project Management",
    "amount": 10000000
  },
  {
    "id": "f-034",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Regulasi Ketenagakerjaan",
    "amount": 8000000
  },
  {
    "id": "f-035",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Certified Basic Legal Officer (CBLO)",
    "amount": 10000000
  },
  {
    "id": "f-036",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Certified Contract Drafter",
    "amount": 12000000
  },
  {
    "id": "f-037",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Power BI, Power Apps & Power Automate",
    "amount": 30000000
  },
  {
    "id": "f-038",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Basic Data Analysis",
    "amount": 30000000
  },
  {
    "id": "f-039",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Effective Communication & Time Management",
    "amount": 7627280
  },
  {
    "id": "f-040",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "DX Improvement NIR sensor",
    "amount": 5000000
  },
  {
    "id": "f-041",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "S-Jar Operation Improvement",
    "amount": 5000000
  },
  {
    "id": "f-042",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Food Safety Culture Excellence",
    "amount": 22000000
  },
  {
    "id": "f-043",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HR002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 7200000
  },
  {
    "id": "f-044",
    "year": 2026,
    "month": "Aug",
    "costCenter": "HRX002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 2000000
  },
  {
    "id": "f-045",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 70000000
  },
  {
    "id": "f-046",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Data Science For Expert",
    "amount": 25000000
  },
  {
    "id": "f-047",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Digital Transformation",
    "amount": 50000000
  },
  {
    "id": "f-048",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Based on Hasil MCU Penurunan Fungsi Ginjal",
    "amount": 3000000
  },
  {
    "id": "f-049",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 5000000
  },
  {
    "id": "f-050",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 20317268
  },
  {
    "id": "f-051",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training for Trainer",
    "amount": 25000000
  },
  {
    "id": "f-052",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Data Story Telling & Impactfull Presentation",
    "amount": 30000000
  },
  {
    "id": "f-053",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi PPPU",
    "amount": 15000000
  },
  {
    "id": "f-054",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan Basic Procurement / Teknik Negosiasi",
    "amount": 7000000
  },
  {
    "id": "f-055",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 10000000
  },
  {
    "id": "f-056",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Data Science For Expert",
    "amount": 10000000
  },
  {
    "id": "f-057",
    "year": 2026,
    "month": "Sep",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Digital Transformation",
    "amount": 10000000
  },
  {
    "id": "f-058",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 67099500
  },
  {
    "id": "f-059",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Power BI, Power Apps & Power Automate",
    "amount": 64404908
  },
  {
    "id": "f-060",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Basic Data Analysis",
    "amount": 100000000
  },
  {
    "id": "f-061",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Dissemination Based on Hasil MCU Hiperglikemia",
    "amount": 3000000
  },
  {
    "id": "f-062",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 5000000
  },
  {
    "id": "f-063",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 2000000
  },
  {
    "id": "f-064",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training for Trainer",
    "amount": 30000000
  },
  {
    "id": "f-065",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan Basic Procurement / Analisa Procurement",
    "amount": 10000000
  },
  {
    "id": "f-066",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Program PLC Training",
    "amount": 12000000
  },
  {
    "id": "f-067",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Asset Management",
    "amount": 8000000
  },
  {
    "id": "f-068",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi Talent Management",
    "amount": 15000000
  },
  {
    "id": "f-069",
    "year": 2026,
    "month": "Oct",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Pest Management",
    "amount": 2000000
  },
  {
    "id": "f-070",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 70000000
  },
  {
    "id": "f-071",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training AI For Expert",
    "amount": 100000000
  },
  {
    "id": "f-072",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 1000000
  },
  {
    "id": "f-073",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 1000000
  },
  {
    "id": "f-074",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "SIBI Awards",
    "amount": 50000000
  },
  {
    "id": "f-075",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Data Story Telling & Impactfull Presentation",
    "amount": 70000000
  },
  {
    "id": "f-076",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Packaging Development & Automation Training",
    "amount": 5000000
  },
  {
    "id": "f-077",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Color Matching di Maker Tinta",
    "amount": 5000000
  },
  {
    "id": "f-078",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training ke Maker Cylinder",
    "amount": 5000000
  },
  {
    "id": "f-079",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi Training of Trainer KKNI Level 3",
    "amount": 5000000
  },
  {
    "id": "f-080",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Assesment Soft Skill level M3-M4, ST-4 & New ST-5",
    "amount": 10000000
  },
  {
    "id": "f-081",
    "year": 2026,
    "month": "Nov",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training AI For Expert",
    "amount": 40000000
  },
  {
    "id": "f-082",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Ms Office",
    "amount": 103200000
  },
  {
    "id": "f-083",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Ms Office Expert",
    "amount": 55900000
  },
  {
    "id": "f-084",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 1000000
  },
  {
    "id": "f-085",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 1000000
  },
  {
    "id": "f-086",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan MR-Configurator dan Maintenance Automation",
    "amount": 5000000
  },
  {
    "id": "f-087",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Ms Office",
    "amount": 15000000
  },
  {
    "id": "f-088",
    "year": 2026,
    "month": "Dec",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Training Ms Office Expert",
    "amount": 15000000
  },
  {
    "id": "f-089",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training AI Beginner",
    "amount": 30000000
  },
  {
    "id": "f-090",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 1000000
  },
  {
    "id": "f-091",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 1000000
  },
  {
    "id": "f-092",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Sertifikasi Data Analisis",
    "amount": 24000000
  },
  {
    "id": "f-093",
    "year": 2027,
    "month": "Jan",
    "costCenter": "HRX001 - Education Fee Training",
    "item": "Food Loos, Food Wate & Equepment Management",
    "amount": 2000000
  },
  {
    "id": "f-094",
    "year": 2027,
    "month": "Feb",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 31000000
  },
  {
    "id": "f-095",
    "year": 2027,
    "month": "Feb",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 1000000
  },
  {
    "id": "f-096",
    "year": 2027,
    "month": "Mar",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Learning Delivery From Gap Based on Technical Skill",
    "amount": 31000000
  },
  {
    "id": "f-097",
    "year": 2027,
    "month": "Mar",
    "costCenter": "HR002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 60000000
  },
  {
    "id": "f-098",
    "year": 2027,
    "month": "Mar",
    "costCenter": "HRX002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 9437035
  }
];

export const INITIAL_REALIZATION: RealizationRecord[] = [
  {
    "id": "r-01",
    "tanggal": "2026-04-01",
    "year": 2026,
    "month": "Apr",
    "costCenter": "HR001 - Education Fee Training",
    "item": "English Training",
    "amount": 17286324,
    "keterangan": "Success Reduce Biaya sebesar 32% vs Forecast Last",
    "bankingReference": "BCA-TX-202601",
    "reconciled": true
  },
  {
    "id": "r-02",
    "tanggal": "2026-04-01",
    "year": 2026,
    "month": "Apr",
    "costCenter": "HR001 - Education Fee Training",
    "item": "HR Training",
    "amount": 3490000,
    "keterangan": "Success Reduce Biaya sebesar 10% vs Forecast Last",
    "bankingReference": "BCA-TX-202602",
    "reconciled": true
  },
  {
    "id": "r-03",
    "tanggal": "2026-05-01",
    "year": 2026,
    "month": "May",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Pelatihan Purchasing & Procurement Management",
    "amount": 807520,
    "keterangan": "Mendapati Biaya lebih murah dari yang dianggarkan dengan CD sebesar 15%",
    "bankingReference": "BCA-TX-202603",
    "reconciled": true
  },
  {
    "id": "r-04",
    "tanggal": "2026-05-01",
    "year": 2026,
    "month": "May",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Building & Facility Management",
    "amount": 4000000,
    "keterangan": "Mendapati Biaya lebih murah dari yang dianggarkan dengan CD sebesar 20%",
    "bankingReference": "BCA-TX-202604",
    "reconciled": true
  },
  {
    "id": "r-05",
    "tanggal": "2026-05-01",
    "year": 2026,
    "month": "May",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Formalities Document for Expatriate and Legal Procedures",
    "amount": 10000000,
    "keterangan": "Mendapati Biaya lebih murah dari yang dianggarkan dengan CD sebesar 15%",
    "bankingReference": "BCA-TX-202605",
    "reconciled": true
  },
  {
    "id": "r-06",
    "tanggal": "2026-06-01",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training PI System",
    "amount": 3438000,
    "keterangan": "Success Reduce Biaya sebesar 85%, Biaya dikeluarkan hanya untuk persiapan konsumsi",
    "bankingReference": "BCA-TX-202606",
    "reconciled": true
  },
  {
    "id": "r-07",
    "tanggal": "2026-06-01",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Health Age",
    "amount": 4005020,
    "keterangan": "Success Reduce Biaya sebesar 20% vs Forecast Last",
    "bankingReference": "BCA-TX-202607",
    "reconciled": true
  },
  {
    "id": "r-08",
    "tanggal": "2026-06-01",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training for Trainer",
    "amount": 9000000,
    "keterangan": "Success Reduce Biaya sebesar 70% vs Forecast Last",
    "bankingReference": "BCA-TX-202608",
    "reconciled": true
  },
  {
    "id": "r-09",
    "tanggal": "2026-06-01",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "HR Training",
    "amount": 5008793,
    "keterangan": "Biaya Pelatihan terserap penuh 100% dari yang dianggarkan",
    "bankingReference": "BCA-TX-202609",
    "reconciled": true
  },
  {
    "id": "r-10",
    "tanggal": "2026-06-01",
    "year": 2026,
    "month": "Jun",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Manajemen SDM Warehouse Training",
    "amount": 12000000,
    "keterangan": "Success Reduce Biaya sebesar 20% vs Forecast Last",
    "bankingReference": "BCA-TX-202610",
    "reconciled": true
  },
  {
    "id": "r-11",
    "tanggal": "2026-07-01",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Training Leadership & Team Building (PUK)",
    "amount": 57407232,
    "keterangan": "Mendapati Biaya lebih murah dari yang dianggarkan dengan CD sebesar 15%",
    "bankingReference": "BCA-TX-202611",
    "reconciled": true
  },
  {
    "id": "r-12",
    "tanggal": "2026-07-01",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR001 - Education Fee Training",
    "item": "Effective Communication & Time Management",
    "amount": 2208000,
    "keterangan": "Mendapati Biaya lebih murah dari yang dianggarkan dengan CD sebesar 15%",
    "bankingReference": "BCA-TX-202612",
    "reconciled": true
  },
  {
    "id": "r-13",
    "tanggal": "2026-07-01",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR001 - Education Fee Training",
    "item": "SIBI Awards",
    "amount": 26083682,
    "keterangan": "Mendapati biaya over dari budget yang dianggarkan sebesar 15%",
    "bankingReference": "BCA-TX-202613",
    "reconciled": true
  },
  {
    "id": "r-14",
    "tanggal": "2026-07-01",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HR002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 35362500,
    "keterangan": "Mendapati Biaya lebih murah dari yang dianggarkan dengan CD sebesar 2%",
    "bankingReference": "BCA-TX-202614",
    "reconciled": true
  },
  {
    "id": "r-15",
    "tanggal": "2026-07-01",
    "year": 2026,
    "month": "Jul",
    "costCenter": "HRX002 - Education Fee Recruitment",
    "item": "Recruitment",
    "amount": 6562965,
    "keterangan": "Mendapati Biaya lebih murah dari yang dianggarkan dengan CD sebesar 15%",
    "bankingReference": "BCA-TX-202615",
    "reconciled": true
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
    date: '2026-04-01',
    description: 'TRF ENGLISH TRAINING VENDOR PT KAIZEN INDO',
    amount: 17286324,
    type: 'debit',
    referenceNo: 'BCA-TX-202601',
    status: 'Reconciled',
    matchedRealizationId: 'r-01'
  },
  {
    id: 'btx-102',
    date: '2026-04-01',
    description: 'TRF HR TRAINING BATCH SURABAYA',
    amount: 3490000,
    type: 'debit',
    referenceNo: 'BCA-TX-202602',
    status: 'Reconciled',
    matchedRealizationId: 'r-02'
  },
  {
    id: 'btx-103',
    date: '2026-05-01',
    description: 'TRF PELATIHAN PURCHASING & PROCUREMENT',
    amount: 807520,
    type: 'debit',
    referenceNo: 'BCA-TX-202603',
    status: 'Reconciled',
    matchedRealizationId: 'r-03'
  },
  {
    id: 'btx-104',
    date: '2026-05-01',
    description: 'TRF BUILDING & FACILITY MGMT WORKSHOP',
    amount: 4000000,
    type: 'debit',
    referenceNo: 'BCA-TX-202604',
    status: 'Reconciled',
    matchedRealizationId: 'r-04'
  },
  {
    id: 'btx-105',
    date: '2026-05-01',
    description: 'TRF LEGAL EXPATRIATE FORMALITIES DOCS',
    amount: 10000000,
    type: 'debit',
    referenceNo: 'BCA-TX-202605',
    status: 'Reconciled',
    matchedRealizationId: 'r-05'
  },
  {
    id: 'btx-106',
    date: '2026-06-01',
    description: 'TRF TRAINING PI SYSTEM KONSUMSI',
    amount: 3438000,
    type: 'debit',
    referenceNo: 'BCA-TX-202606',
    status: 'Reconciled',
    matchedRealizationId: 'r-06'
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
  lastLog: 'Synchronization success: 98 Budget rows, 98 Forecast rows, 15 Realization rows verified with checksum.'
};

export const INITIAL_LOOKER_CONFIG: LookerStudioConfig = {
  reportUrl: 'https://lookerstudio.google.com/embed/reporting/0B5f2e82-sample-ajinomoto-budget/page/p_dabaco_live',
  enabled: true,
  theme: 'dark',
  aspectRatio: '16:9'
};

const envSupabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ? String(import.meta.env.VITE_SUPABASE_URL).trim() : '';
const envSupabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ? String(import.meta.env.VITE_SUPABASE_ANON_KEY).trim() : '';

export const INITIAL_SUPABASE_CONFIG: SupabaseConfig = {
  projectUrl: envSupabaseUrl,
  anonKey: envSupabaseAnonKey,
  status: envSupabaseUrl && envSupabaseAnonKey ? 'connected' : 'disconnected',
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

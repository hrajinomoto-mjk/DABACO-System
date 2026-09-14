import { MasterItem, MasterCostCenter, BudgetRecord, ForecastRecord, RealizationRecord } from '../types';

export const STANDARD_CATEGORIES = [
  'Training & Development',
  'IT & Digital Systems',
  'Facility & Operations',
  'Employee Welfare',
  'Recruitment & Assessment',
  'Legal & Compliance',
  'General & Other'
] as const;

export type StandardCategory = typeof STANDARD_CATEGORIES[number];

/**
 * Intelligent categorization logic that examines the item name, code,
 * and cost center to determine the proper corporate category.
 */
export function autoDetectCategory(itemCodeOrName: string, costCenter: string = ''): string {
  if (!itemCodeOrName) return 'General & Other';
  const text = `${itemCodeOrName} ${costCenter}`.toLowerCase();

  // 1. Recruitment & Assessment
  if (
    text.includes('recruitment') ||
    text.includes('rekrutmen') ||
    text.includes('talent acquisition') ||
    text.includes('psychotest') ||
    text.includes('psikotes') ||
    text.includes('seleksi')
  ) {
    return 'Recruitment & Assessment';
  }

  // 2. Employee Welfare & Health
  if (
    text.includes('health') ||
    text.includes('mcu') ||
    text.includes('kesehatan') ||
    text.includes('jantung') ||
    text.includes('ginjal') ||
    text.includes('obesitas') ||
    text.includes('hiperglikemia') ||
    text.includes('mental health') ||
    text.includes('medical') ||
    text.includes('welfare') ||
    text.includes('wellness') ||
    text.includes('screening')
  ) {
    return 'Employee Welfare';
  }

  // 3. IT & Digital Systems
  if (
    text.includes('power bi') ||
    text.includes('power apps') ||
    text.includes('automate') ||
    text.includes('data science') ||
    text.includes('data analis') ||
    text.includes('data analysis') ||
    text.includes('ai for') ||
    text.includes('ai beginner') ||
    text.includes('training ai') ||
    text.includes('digital transformation') ||
    text.includes('ms office') ||
    text.includes('office expert') ||
    text.includes('supabase') ||
    text.includes('looker') ||
    text.includes('security') ||
    text.includes('encryption') ||
    text.includes('cloud') ||
    text.includes('software') ||
    text.includes('database') ||
    text.includes('dx improvement')
  ) {
    return 'IT & Digital Systems';
  }

  // 4. Legal & Compliance
  if (
    text.includes('legal') ||
    text.includes('cblo') ||
    text.includes('contract drafter') ||
    text.includes('regulasi') ||
    text.includes('formalities') ||
    text.includes('expatriate') ||
    text.includes('hukum') ||
    text.includes('perizinan') ||
    text.includes('ketenagakerjaan')
  ) {
    return 'Legal & Compliance';
  }

  // 5. Facility & Plant Operations
  if (
    text.includes('crane') ||
    text.includes('hoist') ||
    text.includes('wwtp') ||
    text.includes('k3 kimia') ||
    text.includes('dcs') ||
    text.includes('plc') ||
    text.includes('sensor') ||
    text.includes('nir') ||
    text.includes('s-jar') ||
    text.includes('food safety') ||
    text.includes('food loos') ||
    text.includes('food waste') ||
    text.includes('pest') ||
    text.includes('packaging') ||
    text.includes('tinta') ||
    text.includes('cylinder') ||
    text.includes('mr-configurator') ||
    text.includes('kelistrikan') ||
    text.includes('building') ||
    text.includes('facility') ||
    text.includes('warehouse') ||
    text.includes('asset management') ||
    text.includes('office expense') ||
    text.includes('consumables') ||
    text.includes('pppu') ||
    text.includes('smk2') ||
    text.includes('plant')
  ) {
    return 'Facility & Operations';
  }

  // 6. Training & Competency Development
  if (
    text.includes('training') ||
    text.includes('pelatihan') ||
    text.includes('sertifikasi') ||
    text.includes('learning') ||
    text.includes('competency') ||
    text.includes('leadership') ||
    text.includes('communication') ||
    text.includes('english') ||
    text.includes('procurement') ||
    text.includes('purchasing') ||
    text.includes('supply chain') ||
    text.includes('project management') ||
    text.includes('soft skill') ||
    text.includes('talent management') ||
    text.includes('presentation') ||
    text.includes('story telling') ||
    text.includes('sibi') ||
    text.includes('puk') ||
    text.includes('seminar') ||
    text.includes('workshop') ||
    text.includes('education') ||
    text.includes('trainer')
  ) {
    return 'Training & Development';
  }

  // Cost center fallbacks
  if (costCenter.toLowerCase().includes('recruitment')) return 'Recruitment & Assessment';
  if (costCenter.toLowerCase().includes('training')) return 'Training & Development';
  if (costCenter.toLowerCase().includes('general') || costCenter.toLowerCase().includes('ga')) return 'Facility & Operations';
  if (costCenter.toLowerCase().includes('it')) return 'IT & Digital Systems';

  return 'Training & Development';
}

/**
 * Infer Department from Cost Center string
 */
export function inferDepartmentFromCC(costCenter: string): { department: string; headOfDept: string } {
  const ccUpper = costCenter.toUpperCase();
  if (ccUpper.includes('HRX')) {
    return {
      department: 'PT Ajinex International (HR)',
      headOfDept: ccUpper.includes('RECRUIT') ? 'R. Kusumo' : 'H. Sugiharto'
    };
  }
  if (ccUpper.includes('HR001')) {
    return { department: 'Human Resources (Training & Dev)', headOfDept: 'S. Wardhana' };
  }
  if (ccUpper.includes('HR002') || ccUpper.includes('RECRUIT')) {
    return { department: 'Human Resources (Talent Acquisition)', headOfDept: 'D. Prasetyo' };
  }
  if (ccUpper.includes('GA')) {
    return { department: 'General Affairs & Operations', headOfDept: 'B. Santoso' };
  }
  if (ccUpper.includes('IT')) {
    return { department: 'Information Technology', headOfDept: 'A. Rahman' };
  }
  return { department: 'Operational Division', headOfDept: 'PIC Mojokerto Factory' };
}

/**
 * Extracts and synchronizes unique items and cost centers from all current transactions
 * into master data without losing user customizations.
 */
export function extractAndSyncMasterData(
  budget: BudgetRecord[],
  forecast: ForecastRecord[],
  realization: RealizationRecord[],
  currentMasterItems: MasterItem[],
  currentCostCenters: MasterCostCenter[]
): {
  updatedMasterItems: MasterItem[];
  updatedCostCenters: MasterCostCenter[];
  newItemsCount: number;
  newCostCentersCount: number;
} {
  const itemMap = new Map<string, MasterItem>();
  currentMasterItems.forEach(item => {
    itemMap.set(item.code, item);
    // Also record standard name if present
    if (item.name && item.name !== item.code) {
      itemMap.set(item.name, item);
    }
  });

  const ccMap = new Map<string, MasterCostCenter>();
  currentCostCenters.forEach(cc => {
    ccMap.set(cc.code, cc);
    if (cc.name && cc.name !== cc.code) {
      ccMap.set(cc.name, cc);
    }
  });

  let newItemsCount = 0;
  let newCostCentersCount = 0;

  // Process all records
  const allRecords: { item: string; costCenter: string }[] = [
    ...budget.map(b => ({ item: b.item, costCenter: b.costCenter })),
    ...forecast.map(f => ({ item: f.item, costCenter: f.costCenter })),
    ...realization.map(r => ({ item: r.item, costCenter: r.costCenter }))
  ];

  allRecords.forEach(({ item, costCenter }) => {
    const cleanItem = (item || '').trim();
    const cleanCC = (costCenter || '').trim();

    if (cleanItem && !itemMap.has(cleanItem)) {
      const category = autoDetectCategory(cleanItem, cleanCC);
      const newItem: MasterItem = {
        code: cleanItem,
        name: cleanItem,
        category,
        status: 'Active'
      };
      itemMap.set(cleanItem, newItem);
      newItemsCount++;
    }

    if (cleanCC && !ccMap.has(cleanCC)) {
      const { department, headOfDept } = inferDepartmentFromCC(cleanCC);
      const newCC: MasterCostCenter = {
        code: cleanCC,
        name: cleanCC,
        department,
        headOfDept
      };
      ccMap.set(cleanCC, newCC);
      newCostCentersCount++;
    }
  });

  // Unique list
  const uniqueMasterItems = Array.from(new Set(Array.from(itemMap.values())));
  const uniqueCostCenters = Array.from(new Set(Array.from(ccMap.values())));

  return {
    updatedMasterItems: uniqueMasterItems,
    updatedCostCenters: uniqueCostCenters,
    newItemsCount,
    newCostCentersCount
  };
}

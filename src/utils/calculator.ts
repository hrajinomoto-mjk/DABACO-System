import { BudgetRecord, ForecastRecord, RealizationRecord, MasterItem, CategoryDetail, ItemSummary } from '../types';
import { autoDetectCategory } from './categoryDetector';

export function calculateCategoriesAndItems(
  budget: BudgetRecord[],
  forecast: ForecastRecord[],
  realization: RealizationRecord[],
  masterItems: MasterItem[]
): { categories: CategoryDetail[]; items: ItemSummary[] } {
  const itemMap: Record<string, MasterItem> = {};
  masterItems.forEach(i => {
    itemMap[i.code] = i;
    if (i.code.toLowerCase() !== i.code) {
      itemMap[i.code.toLowerCase()] = i;
    }
  });

  const catMap: Record<string, { budget: number; forecast: number; realization: number; remarks: string[] }> = {};
  const itemSummaryMap: Record<string, {
    item: string;
    budget: number;
    forecast: number;
    realization: number;
  }> = {};

  const ensureItemSummary = (itemCode: string) => {
    if (!itemSummaryMap[itemCode]) {
      itemSummaryMap[itemCode] = {
        item: itemCode,
        budget: 0,
        forecast: 0,
        realization: 0
      };
    }
  };

  const getCategory = (itemCode: string, costCenter?: string): string => {
    return itemMap[itemCode]?.category ||
      itemMap[itemCode.toLowerCase()]?.category ||
      autoDetectCategory(itemCode, costCenter);
  };

  // Seed with master items
  masterItems.forEach(item => {
    ensureItemSummary(item.code);
    if (!catMap[item.category]) {
      catMap[item.category] = { budget: 0, forecast: 0, realization: 0, remarks: [] };
    }
  });

  budget.forEach(b => {
    ensureItemSummary(b.item);
    itemSummaryMap[b.item].budget += b.amount;

    const cat = getCategory(b.item, b.costCenter);
    if (!catMap[cat]) catMap[cat] = { budget: 0, forecast: 0, realization: 0, remarks: [] };
    catMap[cat].budget += b.amount;
  });

  forecast.forEach(f => {
    ensureItemSummary(f.item);
    itemSummaryMap[f.item].forecast += f.amount;

    const cat = getCategory(f.item, f.costCenter);
    if (!catMap[cat]) catMap[cat] = { budget: 0, forecast: 0, realization: 0, remarks: [] };
    catMap[cat].forecast += f.amount;
  });

  realization.forEach(r => {
    ensureItemSummary(r.item);
    itemSummaryMap[r.item].realization += r.amount;

    const cat = getCategory(r.item, r.costCenter);
    if (!catMap[cat]) catMap[cat] = { budget: 0, forecast: 0, realization: 0, remarks: [] };
    catMap[cat].realization += r.amount;
    if (r.keterangan && !catMap[cat].remarks.includes(r.keterangan)) {
      catMap[cat].remarks.push(r.keterangan);
    }
  });

  const categories: CategoryDetail[] = Object.entries(catMap)
    .filter(([_, vals]) => vals.budget > 0 || vals.forecast > 0 || vals.realization > 0)
    .map(([category, vals]) => {
      const diffFB = vals.budget - vals.forecast;
      const diffFR = vals.forecast - vals.realization;
      const usage = vals.forecast > 0 ? (vals.realization / vals.forecast) * 100 : 0;
      return {
        category,
        budget: vals.budget,
        forecast: vals.forecast,
        realization: vals.realization,
        diffFB,
        diffFR,
        usage,
        remarks: vals.remarks
      };
    })
    .sort((a, b) => b.budget - a.budget);

  const items: ItemSummary[] = Object.values(itemSummaryMap)
    .filter(i => i.budget > 0 || i.forecast > 0 || i.realization > 0)
    .map(i => {
      const diffBF = i.budget - i.forecast;
      const diffFA = i.forecast - i.realization;
      const usage = i.forecast > 0 ? (i.realization / i.forecast) * 100 : 0;
      return {
        item: i.item,
        budget: i.budget,
        forecast: i.forecast,
        realization: i.realization,
        diffBF,
        diffFA,
        usage
      };
    })
    .sort((a, b) => b.budget - a.budget);

  return { categories, items };
}

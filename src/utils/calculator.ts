import { BudgetRecord, ForecastRecord, RealizationRecord, MasterItem, CategoryDetail, ItemSummary } from '../types';

export function calculateCategoriesAndItems(
  budget: BudgetRecord[],
  forecast: ForecastRecord[],
  realization: RealizationRecord[],
  masterItems: MasterItem[]
): { categories: CategoryDetail[]; items: ItemSummary[] } {
  const itemMap: Record<string, MasterItem> = {};
  masterItems.forEach(i => { itemMap[i.code] = i; });

  const catMap: Record<string, { budget: number; forecast: number; realization: number; remarks: string[] }> = {};
  const itemSummaryMap: Record<string, {
    item: string;
    budget: number;
    forecast: number;
    realization: number;
  }> = {};

  masterItems.forEach(item => {
    itemSummaryMap[item.code] = {
      item: item.code,
      budget: 0,
      forecast: 0,
      realization: 0
    };
    if (!catMap[item.category]) {
      catMap[item.category] = { budget: 0, forecast: 0, realization: 0, remarks: [] };
    }
  });

  budget.forEach(b => {
    if (itemSummaryMap[b.item]) {
      itemSummaryMap[b.item].budget += b.amount;
    }
    const cat = itemMap[b.item]?.category || 'General Operations';
    if (!catMap[cat]) catMap[cat] = { budget: 0, forecast: 0, realization: 0, remarks: [] };
    catMap[cat].budget += b.amount;
  });

  forecast.forEach(f => {
    if (itemSummaryMap[f.item]) {
      itemSummaryMap[f.item].forecast += f.amount;
    }
    const cat = itemMap[f.item]?.category || 'General Operations';
    if (!catMap[cat]) catMap[cat] = { budget: 0, forecast: 0, realization: 0, remarks: [] };
    catMap[cat].forecast += f.amount;
  });

  realization.forEach(r => {
    if (itemSummaryMap[r.item]) {
      itemSummaryMap[r.item].realization += r.amount;
    }
    const cat = itemMap[r.item]?.category || 'General Operations';
    if (!catMap[cat]) catMap[cat] = { budget: 0, forecast: 0, realization: 0, remarks: [] };
    catMap[cat].realization += r.amount;
    if (r.keterangan && !catMap[cat].remarks.includes(r.keterangan)) {
      catMap[cat].remarks.push(r.keterangan);
    }
  });

  const categories: CategoryDetail[] = Object.keys(catMap).map(catName => {
    const data = catMap[catName];
    const diffFB = data.budget - data.forecast;
    const diffFR = data.forecast - data.realization;
    const usage = data.forecast > 0 ? (data.realization / data.forecast) * 100 : 0;
    return {
      category: catName,
      budget: data.budget,
      forecast: data.forecast,
      realization: data.realization,
      diffFB,
      diffFR,
      usage,
      remarks: data.remarks
    };
  });

  const items: ItemSummary[] = Object.values(itemSummaryMap).map(i => {
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
  });

  return { categories, items };
}

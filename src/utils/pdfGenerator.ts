import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BudgetRecord, ForecastRecord, RealizationRecord, CategoryDetail, ItemSummary } from '../types';

export function formatIDR(amount: number): string {
  return 'Rp ' + Math.round(amount || 0).toLocaleString('id-ID');
}

export function exportCSV(
  budget: BudgetRecord[],
  forecast: ForecastRecord[],
  realization: RealizationRecord[]
): void {
  let csv = '=== DABACO BUDGET CONTROL SYSTEM - EXPORT DATA ===\r\n';
  csv += `Export Timestamp: ${new Date().toISOString()}\r\n\r\n`;

  // BUDGET
  csv += '=== BUDGET_PLAN ===\r\n';
  csv += 'ID,Year,Month,Cost Center,Item Code,Amount\r\n';
  budget.forEach(b => {
    csv += `"${b.id}","${b.year}","${b.month}","${b.costCenter}","${b.item}",${b.amount}\r\n`;
  });
  csv += '\r\n';

  // FORECAST
  csv += '=== FORECAST ===\r\n';
  csv += 'ID,Year,Month,Cost Center,Item Code,Amount\r\n';
  forecast.forEach(f => {
    csv += `"${f.id}","${f.year}","${f.month}","${f.costCenter}","${f.item}",${f.amount}\r\n`;
  });
  csv += '\r\n';

  // REALIZATION
  csv += '=== REALIZATION ===\r\n';
  csv += 'ID,Date,Year,Month,Cost Center,Item Code,Amount,Keterangan,Banking Reference\r\n';
  realization.forEach(r => {
    const cleanKet = (r.keterangan || '').replace(/"/g, '""');
    csv += `"${r.id}","${r.tanggal}","${r.year}","${r.month}","${r.costCenter}","${r.item}",${r.amount},"${cleanKet}","${r.bankingReference || '-'}"\r\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DABACO_Financial_Export_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface PDFReportPayload {
  periodLabel: string;
  filterLabel: string;
  totalBudget: number;
  totalForecast: number;
  totalActual: number;
  categories: CategoryDetail[];
  items: ItemSummary[];
  monthlyData: { month: string; budget: number; forecast: number; actual: number }[];
  darkTheme?: boolean;
}

export function generateExecutivePDF(payload: PDFReportPayload): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const usage = payload.totalForecast > 0 ? (payload.totalActual / payload.totalForecast) * 100 : 0;
  const isOver = usage > 100;
  const isWarn = usage > 85 && usage <= 100;
  const statusLabel = isOver ? 'OVER BUDGET' : isWarn ? 'WARNING (NEAR LIMIT)' : 'ON TRACK';
  const statusColor: [number, number, number] = isOver ? [225, 29, 72] : isWarn ? [217, 119, 6] : [14, 159, 110];

  // =================== PAGE 1: EXECUTIVE COVER ===================
  // Background gradient block
  doc.setFillColor(11, 37, 69); // Deep Navy #0B2545
  doc.rect(0, 0, 210, 297, 'F');

  // Subtle decorative accents
  doc.setFillColor(230, 0, 42); // Ajinomoto Red
  doc.circle(200, 20, 45, 'F');
  doc.setFillColor(201, 161, 90); // Gold
  doc.circle(10, 280, 30, 'F');

  // Redraw inner cover card
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(15, 20, 180, 257, 4, 4, 'F');

  // Top header in cover
  doc.setFillColor(230, 0, 42);
  doc.rect(15, 20, 180, 6, 'F');

  // Brand Badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(25, 38, 24, 22, 2, 2, 'F');
  doc.setFillColor(230, 0, 42); // Ajinomoto Red
  doc.circle(33, 46, 4.5, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(33, 46, 2.2, 'F');
  doc.setFillColor(230, 0, 42);
  doc.rect(35, 43.5, 6, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(230, 0, 42);
  doc.text('AJINOMOTO', 37, 57, { align: 'center' });

  // Organization texts
  doc.setTextColor(201, 161, 90); // Gold
  doc.setFontSize(7.5);
  doc.text('PT AJINOMOTO INDONESIA - PT AJINEX INTERNATIONAL, MOJOKERTO FACTORY', 52, 44);
  doc.setTextColor(220, 225, 235);
  doc.setFontSize(10);
  doc.text('HR DEVELOPMENT SECTION - DABACO SYSTEM', 52, 52);

  // Active Filter Pill
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(25, 70, 160, 9, 3, 3, 'F');
  doc.setTextColor(201, 161, 90);
  doc.setFontSize(8);
  doc.text(`ACTIVE FILTER: ${payload.filterLabel.toUpperCase()} | PERIODE: ${payload.periodLabel}`, 30, 76);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Budget Report', 25, 98);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text('Consolidated Financial Realization & Budget Performance Analysis', 25, 106);

  // Status Badge
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(25, 116, 55, 10, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`[!] ${statusLabel}`, 52, 122.5, { align: 'center' });

  // KPI Grid on Cover
  const drawCoverKpi = (label: string, val: string, x: number, y: number, w: number, h: number, barColor: [number, number, number]) => {
    doc.setFillColor(24, 32, 47);
    doc.roundedRect(x, y, w, h, 2, 2, 'F');
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    doc.rect(x, y, w, 2.5, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(label.toUpperCase(), x + 4, y + 8);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10.5);
    doc.text(val, x + 4, y + 17);
  };

  drawCoverKpi('Total Budget Plan', formatIDR(payload.totalBudget), 25, 134, 76, 23, [37, 99, 235]);
  drawCoverKpi('Total Forecast', formatIDR(payload.totalForecast), 108, 134, 77, 23, [217, 119, 6]);
  drawCoverKpi('Total Realization', formatIDR(payload.totalActual), 25, 162, 76, 23, [16, 185, 129]);
  drawCoverKpi('Budget Utilization', `${usage.toFixed(1)}%`, 108, 162, 77, 23, statusColor);

  // Executive Summary text
  doc.setFillColor(20, 27, 41);
  doc.roundedRect(25, 192, 160, 32, 2, 2, 'F');
  doc.setFillColor(230, 0, 42);
  doc.rect(25, 192, 3, 32, 'F');
  doc.setTextColor(230, 0, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE AUDIT SUMMARY', 32, 200);

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const diffVal = payload.totalActual - payload.totalForecast;
  const summaryLine1 = `Total realization reached ${formatIDR(payload.totalActual)} (${usage.toFixed(1)}% of total forecast).`;
  const summaryLine2 = diffVal > 0
    ? `Spending is currently ${formatIDR(Math.abs(diffVal))} OVER forecast limit, requiring management review.`
    : `Spending is currently within operational forecast with remaining balance of ${formatIDR(Math.abs(diffVal))}.`;
  doc.text(summaryLine1, 32, 207);
  doc.text(summaryLine2, 32, 214);

  // Footer Metadata on Cover
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('PREPARED FOR:', 25, 245);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Management & Department Head Committee', 25, 251);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('TIMESTAMP GENERATED:', 125, 245);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(new Date().toLocaleString('id-ID'), 125, 251);

  doc.setDrawColor(51, 65, 85);
  doc.line(25, 260, 185, 260);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('CONFIDENTIAL - FOR INTERNAL OPERATIONAL CONTROLLING USE ONLY - AJINOMOTO DABACO', 25, 266);

  // =================== PAGE 2: FINANCIAL BREAKDOWN TABLES ===================
  doc.addPage();

  // Page 2 Header Bar
  doc.setFillColor(11, 37, 69);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFillColor(230, 0, 42);
  doc.rect(0, 20, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DABACO - Financial Performance & Variance Breakdown', 15, 13);
  doc.setFontSize(8);
  doc.setTextColor(201, 161, 90);
  doc.text(`Filter: ${payload.filterLabel}`, 155, 13);

  // Section 1: Monthly Trend Table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Monthly Budget, Forecast & Realization Trend', 15, 30);

  const monthlyRows = payload.monthlyData.map(m => {
    const diff = m.actual - m.forecast;
    return [
      m.month,
      formatIDR(m.budget),
      formatIDR(m.forecast),
      formatIDR(m.actual),
      (diff > 0 ? '+' : '') + formatIDR(diff)
    ];
  });

  autoTable(doc, {
    startY: 33,
    head: [['Month', 'Budget Plan', 'Forecast', 'Realization', 'Variance (Act - Fc)']],
    body: monthlyRows,
    theme: 'grid',
    headStyles: { fillColor: [11, 37, 69], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 25 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' },
      4: { halign: 'right' }
    }
  });

  // Section 2: Category Performance Table
  // @ts-expect-error doc.lastAutoTable is added by jspdf-autotable
  const nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 110;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Cost Center & Category Utilization Performance', 15, nextY);

  const catRows = payload.categories.map(c => [
    c.category,
    formatIDR(c.budget),
    formatIDR(c.forecast),
    formatIDR(c.realization),
    `${c.usage.toFixed(1)}%`,
    c.remarks.length > 0 ? c.remarks.slice(0, 1).join(', ') : '-'
  ]);

  autoTable(doc, {
    startY: nextY + 3,
    head: [['Category Name', 'Budget Plan', 'Forecast', 'Realization', 'Usage (%)', 'Primary Remarks']],
    body: catRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' },
      4: { halign: 'center' },
      5: { cellWidth: 50, fontSize: 6.5 }
    }
  });

  // Section 3: Signature & Approval Block
  // @ts-expect-error doc.lastAutoTable
  const signY = Math.min(doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 230, 240);

  doc.setDrawColor(203, 213, 225);
  doc.line(15, signY, 195, signY);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Mojokerto, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 140, signY + 6);
  doc.text('Mengetahui & Menyetujui,', 140, signY + 11);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(138, signY + 14, 52, 18, 1, 1, 'F');
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('E-VERIFIED & APPROVED', 142, signY + 22);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text('DABACO Security Protocol v2.4', 142, signY + 28);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('HR Department Head', 140, signY + 38);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PT AJINOMOTO INDONESIA - PT AJINEX INTERNATIONAL', 140, signY + 42);
  doc.text('MOJOKERTO FACTORY', 140, signY + 45.5);

  // Save/Download PDF
  const filename = `DABACO_Executive_Report_${payload.periodLabel.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

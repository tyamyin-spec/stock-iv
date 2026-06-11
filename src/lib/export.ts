// Report export utilities — dependency-free.
// Builds datasets from live data and downloads them as CSV, Excel (.xls), or PDF.

import type { FluidType, Movement, Price, StockRow, Ward } from './db.types';
import { daysFromToday, formatThaiDate } from './data';

export type ReportFormat = 'xlsx' | 'pdf' | 'csv';
export type ReportId = 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6';

export type ReportData = {
  title: string;
  subtitle: string;
  headers: string[];
  rows: (string | number)[][];
};

type BuildCtx = {
  stock: StockRow[];
  movements: Movement[];
  wards: Ward[];
  fluids: FluidType[];
  prices: Price[];
  from: string; // BE date "พ.ศ.-MM-DD"
  to: string;
  ward: string; // ward id or "all"
};

// ── helpers ─────────────────────────────────────────────────────────────────

const beToAd = (be: string): Date | null => {
  const parts = be.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [y, m, d] = parts;
  return new Date(y - 543, m - 1, d);
};

const fluidName = (fluids: FluidType[], code: string): string =>
  fluids.find((f) => f.code === code)?.name ?? code;

const wardName = (wards: Ward[], id: string | null): string =>
  (id && wards.find((w) => w.id === id)?.name) || '—';

const kindLabel: Record<Movement['kind'], string> = {
  in: 'รับเข้า',
  out: 'เบิกออก',
  adjust: 'ปรับยอด',
  discard: 'จำหน่าย',
};

// Filter movements by the selected BE date range (inclusive) and ward.
function filterMovements(ctx: BuildCtx): Movement[] {
  const fromAd = beToAd(ctx.from);
  const toAd = beToAd(ctx.to);
  if (toAd) toAd.setHours(23, 59, 59, 999);
  return ctx.movements.filter((m) => {
    if (ctx.ward !== 'all' && m.ward_id !== ctx.ward) return false;
    const t = new Date(m.occurred_at).getTime();
    if (fromAd && t < fromAd.getTime()) return false;
    if (toAd && t > toAd.getTime()) return false;
    return true;
  });
}

function filterStock(ctx: BuildCtx): StockRow[] {
  return ctx.stock.filter((s) => ctx.ward === 'all' || s.ward_id === ctx.ward);
}

// ── report builders ──────────────────────────────────────────────────────────

export function buildReport(id: ReportId, ctx: BuildCtx): ReportData {
  const range = `${ctx.from} ถึง ${ctx.to}`;
  const wardLabel = ctx.ward === 'all' ? 'ทุกวอร์ด' : wardName(ctx.wards, ctx.ward);
  const subtitle = `${wardLabel} · ${range}`;

  switch (id) {
    case 'r1': {
      const rows = filterStock(ctx)
        .slice()
        .sort((a, b) => a.display_code.localeCompare(b.display_code))
        .map((s) => [
          s.display_code,
          fluidName(ctx.fluids, s.fluid_code),
          s.lot,
          formatThaiDate(s.expiry),
          wardName(ctx.wards, s.ward_id),
          s.qty,
          s.min_qty,
        ]);
      return {
        title: 'รายงานคงคลังประจำวัน',
        subtitle,
        headers: ['รหัส', 'ชื่อสารน้ำ', 'Lot', 'วันหมดอายุ', 'วอร์ด', 'คงเหลือ', 'ขั้นต่ำ'],
        rows,
      };
    }

    case 'r2': {
      const outs = filterMovements(ctx).filter((m) => m.kind === 'out');
      const agg = new Map<string, { count: number; qty: number }>();
      for (const m of outs) {
        const cur = agg.get(m.fluid_code) ?? { count: 0, qty: 0 };
        cur.count += 1;
        cur.qty += Math.abs(m.qty);
        agg.set(m.fluid_code, cur);
      }
      const rows = [...agg.entries()]
        .sort((a, b) => b[1].qty - a[1].qty)
        .map(([code, v]) => [code, fluidName(ctx.fluids, code), v.count, v.qty]);
      return {
        title: 'รายงานการใช้รายเดือน',
        subtitle,
        headers: ['รหัสสารน้ำ', 'ชื่อสารน้ำ', 'จำนวนครั้งที่เบิก', 'รวมจำนวน (ขวด)'],
        rows,
      };
    }

    case 'r3': {
      const rows = filterStock(ctx)
        .map((s) => ({ s, days: daysFromToday(s.expiry) }))
        .filter((x) => x.days <= 90)
        .sort((a, b) => a.days - b.days)
        .map(({ s, days }) => [
          s.display_code,
          fluidName(ctx.fluids, s.fluid_code),
          s.lot,
          formatThaiDate(s.expiry),
          wardName(ctx.wards, s.ward_id),
          s.qty,
          days < 0 ? `หมดอายุแล้ว ${-days} วัน` : `อีก ${days} วัน`,
        ]);
      return {
        title: 'รายงานสารน้ำใกล้หมดอายุ',
        subtitle: `${subtitle} · ภายใน 90 วัน`,
        headers: ['รหัส', 'ชื่อสารน้ำ', 'Lot', 'วันหมดอายุ', 'วอร์ด', 'คงเหลือ', 'สถานะ'],
        rows,
      };
    }

    case 'r4': {
      const rows = filterMovements(ctx)
        .slice()
        .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
        .map((m) => [
          new Date(m.occurred_at).toLocaleString('th-TH'),
          kindLabel[m.kind],
          fluidName(ctx.fluids, m.fluid_code),
          wardName(ctx.wards, m.ward_id),
          m.qty,
          m.note ?? '',
        ]);
      return {
        title: 'รายงานการรับ-เบิก',
        subtitle,
        headers: ['วันที่/เวลา', 'ประเภท', 'สารน้ำ', 'วอร์ด', 'จำนวน', 'หมายเหตุ'],
        rows,
      };
    }

    case 'r5': {
      const wardList = ctx.ward === 'all' ? ctx.wards : ctx.wards.filter((w) => w.id === ctx.ward);
      const rows = wardList.map((w) => {
        const items = ctx.stock.filter((s) => s.ward_id === w.id);
        const total = items.reduce((a, s) => a + s.qty, 0);
        return [w.name, items.length, total];
      });
      const grand = rows.reduce((a, r) => a + (r[2] as number), 0);
      rows.push(['รวมทั้งหมด', '', grand]);
      return {
        title: 'รายงานสรุปแยกตามวอร์ด',
        subtitle,
        headers: ['วอร์ด', 'จำนวนรายการ', 'รวมคงเหลือ (ขวด)'],
        rows,
      };
    }

    case 'r6': {
      const rows = filterMovements(ctx)
        .filter((m) => m.kind === 'adjust' || m.kind === 'discard')
        .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
        .map((m) => [
          new Date(m.occurred_at).toLocaleString('th-TH'),
          kindLabel[m.kind],
          fluidName(ctx.fluids, m.fluid_code),
          wardName(ctx.wards, m.ward_id),
          m.qty,
          m.note ?? '',
        ]);
      return {
        title: 'รายงานปรับยอด/จำหน่าย',
        subtitle,
        headers: ['วันที่/เวลา', 'ประเภท', 'สารน้ำ', 'วอร์ด', 'จำนวน', 'หมายเหตุ'],
        rows,
      };
    }
  }
}

// ── file writers ─────────────────────────────────────────────────────────────

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvCell = (v: string | number): string => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function downloadCsv(data: ReportData, filename: string) {
  const lines = [data.headers, ...data.rows].map((r) => r.map(csvCell).join(','));
  // UTF-8 BOM so Excel renders Thai correctly.
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

const esc = (v: string | number): string =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function tableHtml(data: ReportData): string {
  const head = data.headers.map((h) => `<th>${esc(h)}</th>`).join('');
  const body = data.rows
    .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
    .join('');
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function downloadXls(data: ReportData, filename: string) {
  const html =
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">` +
    `<head><meta charset="utf-8"/>` +
    `<style>table{border-collapse:collapse}th,td{border:1px solid #ccc;padding:4px 8px;font-family:'Tahoma',sans-serif;font-size:11pt}th{background:#1E6FEB;color:#fff}</style>` +
    `</head><body>` +
    `<h3>${esc(data.title)}</h3><p>${esc(data.subtitle)}</p>` +
    tableHtml(data) +
    `</body></html>`;
  const blob = new Blob(['﻿' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  triggerDownload(blob, filename);
}

function exportPdf(data: ReportData) {
  const win = window.open('', '_blank');
  if (!win) {
    throw new Error('เบราว์เซอร์บล็อกหน้าต่างใหม่ — กรุณาอนุญาต popup แล้วลองอีกครั้ง');
  }
  const generatedAt = new Date().toLocaleString('th-TH');
  win.document.write(`<!doctype html><html lang="th"><head><meta charset="utf-8"/>
    <title>${esc(data.title)}</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:'Sarabun','Tahoma',sans-serif;margin:28px;color:#0f172a}
      h1{font-size:20px;margin:0 0 4px}
      .sub{color:#64748b;font-size:13px;margin:0 0 2px}
      .gen{color:#94a3b8;font-size:11px;margin:0 0 16px}
      table{border-collapse:collapse;width:100%;font-size:12px}
      th,td{border:1px solid #e2e8f0;padding:6px 10px;text-align:left}
      th{background:#1E6FEB;color:#fff;font-weight:600}
      tr:nth-child(even) td{background:#f8fafc}
      @media print{.noprint{display:none}}
      .noprint{margin-bottom:16px}
      button{background:#1E6FEB;color:#fff;border:0;padding:8px 16px;border-radius:8px;font-size:13px;cursor:pointer}
    </style></head><body>
    <div class="noprint"><button onclick="window.print()">พิมพ์ / บันทึกเป็น PDF</button></div>
    <h1>${esc(data.title)}</h1>
    <p class="sub">${esc(data.subtitle)}</p>
    <p class="gen">สร้างเมื่อ ${esc(generatedAt)} · ${data.rows.length} รายการ</p>
    ${tableHtml(data)}
    </body></html>`);
  win.document.close();
}

// ── public API ───────────────────────────────────────────────────────────────

export function exportReport(id: ReportId, format: ReportFormat, ctx: BuildCtx): ReportData {
  const data = buildReport(id, ctx);
  const stamp = `${ctx.from}_${ctx.to}`.replace(/[^\d_]/g, '');
  const base = `${id}_${stamp}`;
  if (format === 'csv') downloadCsv(data, `${base}.csv`);
  else if (format === 'xlsx') downloadXls(data, `${base}.xls`);
  else exportPdf(data);
  return data;
}

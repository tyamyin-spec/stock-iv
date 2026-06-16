// Printable lot labels. Each label carries a QR encoding the stock row id
// (prefixed "IV:") plus human-readable fluid/lot/expiry, so a lot can be
// scanned later to open dispense/count with everything pre-filled.

import type { StockRow } from './db.types';
import { formatThaiDate } from './data';

export const LABEL_PREFIX = 'IV:';
export const encodeStockId = (id: string) => `${LABEL_PREFIX}${id}`;
export const decodeStockId = (text: string): string | null =>
  text.startsWith(LABEL_PREFIX) ? text.slice(LABEL_PREFIX.length) : null;

type LabelMeta = { fluidName: (code: string) => string; wardName: (id: string) => string };

export async function printStockLabels(rows: StockRow[], meta: LabelMeta) {
  if (rows.length === 0) return;
  const QRCode = await import('qrcode');

  const cards = await Promise.all(
    rows.map(async (r) => {
      const qr = await QRCode.toDataURL(encodeStockId(r.id), { margin: 1, width: 220 });
      return `
        <div class="label">
          <img class="qr" src="${qr}" alt="qr" />
          <div class="meta">
            <div class="name">${esc(meta.fluidName(r.fluid_code))}</div>
            <div class="row2">Lot ${esc(r.lot)} · ${esc(r.display_code)}</div>
            <div class="row3">หมดอายุ ${esc(formatThaiDate(r.expiry))}</div>
            <div class="row4">${esc(meta.wardName(r.ward_id))}</div>
          </div>
        </div>`;
    }),
  );

  const win = window.open('', '_blank');
  if (!win) throw new Error('เบราว์เซอร์บล็อกหน้าต่างใหม่ — กรุณาอนุญาต popup');
  win.document.write(`<!doctype html><html lang="th"><head><meta charset="utf-8"/>
    <title>พิมพ์ป้ายสารน้ำ</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:'Sarabun','Tahoma',sans-serif;margin:10px;color:#0f172a}
      .sheet{display:flex;flex-wrap:wrap;gap:8px}
      .label{display:flex;gap:10px;align-items:center;width:48%;border:1px solid #cbd5e1;border-radius:8px;padding:8px}
      .qr{width:90px;height:90px;flex:none}
      .meta{min-width:0}
      .name{font-size:15px;font-weight:600}
      .row2{font-size:12px;font-family:monospace;margin-top:2px}
      .row3{font-size:12px;margin-top:2px}
      .row4{font-size:11px;color:#64748b;margin-top:2px}
      @media print{.noprint{display:none}.label{width:48%}}
      .noprint{margin-bottom:10px}
      button{background:#1E6FEB;color:#fff;border:0;padding:8px 16px;border-radius:8px;font-size:13px;cursor:pointer}
    </style></head><body>
    <div class="noprint"><button onclick="window.print()">พิมพ์ (${rows.length} ป้าย)</button></div>
    <div class="sheet">${cards.join('')}</div>
    <script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script>
    </body></html>`);
  win.document.close();
}

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

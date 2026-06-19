// Supabase Edge Function: send-report
//
// Invoked on a schedule by pg_cron (see migration 0002). For every enabled row
// in report_schedules that is "due" today, it builds the configured report from
// live data and emails it as a CSV/Excel attachment via Resend.
//
// Required secrets (set with `supabase secrets set ...`):
//   RESEND_API_KEY   — from https://resend.com (free tier is fine)
//   REPORT_FROM      — verified sender, e.g. "Stock IV <reports@yourdomain>"
// Automatically present in the edge runtime:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// Manual test:
//   curl -X POST "$SUPABASE_URL/functions/v1/send-report" \
//        -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
//        -H "Content-Type: application/json" -d '{"force":true}'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

type Frequency = 'daily' | 'weekly' | 'monthly';
type ReportId = 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6';

// ── due-date logic (Asia/Bangkok) ────────────────────────────────────────────
function isDue(freq: Frequency, now: Date): boolean {
  // Convert to Bangkok local time.
  const bkk = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  switch (freq) {
    case 'daily':
      return true;
    case 'weekly':
      return bkk.getDay() === 1; // Monday
    case 'monthly': {
      const tomorrow = new Date(bkk);
      tomorrow.setDate(bkk.getDate() + 1);
      return tomorrow.getMonth() !== bkk.getMonth(); // last day of month
    }
  }
}

// ── date helpers (expiry stored as ค.ศ./AD `date`) ────────────────────────────
const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
function thaiDate(adIso: string): string {
  const d = new Date(adIso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
function daysFrom(adIso: string): number {
  const d = new Date(adIso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

const kindLabel: Record<string, string> = { in: 'รับเข้า', out: 'เบิกออก', adjust: 'ปรับยอด', discard: 'จำหน่าย' };

type Report = { title: string; headers: string[]; rows: (string | number)[][] };

// ── report builders (server-side, query live data) ───────────────────────────
async function buildReport(sb: any, id: ReportId, ward: string): Promise<Report> {
  const [{ data: wards }, { data: fluids }] = await Promise.all([
    sb.from('wards').select('id,name'),
    sb.from('fluid_types').select('code,name'),
  ]);
  const wardName = (wid: string | null) => wards?.find((w: any) => w.id === wid)?.name ?? '—';
  const fluidName = (c: string) => fluids?.find((f: any) => f.code === c)?.name ?? c;
  const wardFilter = (q: any, col = 'ward_id') => (ward !== 'all' ? q.eq(col, ward) : q);

  if (id === 'r2' || id === 'r4' || id === 'r6') {
    let q = sb.from('movements').select('*').order('occurred_at', { ascending: false }).limit(5000);
    q = wardFilter(q);
    const { data: moves } = await q;
    const list = moves ?? [];
    if (id === 'r2') {
      const agg = new Map<string, { count: number; qty: number }>();
      for (const m of list.filter((m: any) => m.kind === 'out')) {
        const cur = agg.get(m.fluid_code) ?? { count: 0, qty: 0 };
        cur.count += 1;
        cur.qty += Math.abs(m.qty);
        agg.set(m.fluid_code, cur);
      }
      return {
        title: 'รายงานการใช้รายเดือน',
        headers: ['รหัสสารน้ำ', 'ชื่อสารน้ำ', 'จำนวนครั้งที่เบิก', 'รวมจำนวน (ขวด)'],
        rows: [...agg.entries()].sort((a, b) => b[1].qty - a[1].qty).map(([c, v]) => [c, fluidName(c), v.count, v.qty]),
      };
    }
    const filtered = id === 'r6' ? list.filter((m: any) => m.kind === 'adjust' || m.kind === 'discard') : list;
    return {
      title: id === 'r6' ? 'รายงานปรับยอด/จำหน่าย' : 'รายงานการรับ-เบิก',
      headers: ['วันที่/เวลา', 'ประเภท', 'สารน้ำ', 'วอร์ด', 'จำนวน', 'หมายเหตุ'],
      rows: filtered.map((m: any) => [
        new Date(m.occurred_at).toLocaleString('th-TH'),
        kindLabel[m.kind] ?? m.kind,
        fluidName(m.fluid_code),
        wardName(m.ward_id),
        m.qty,
        m.note ?? '',
      ]),
    };
  }

  // stock-based reports
  let sq = sb.from('stock').select('*').order('display_code');
  sq = wardFilter(sq);
  const { data: stock } = await sq;
  const list = stock ?? [];

  if (id === 'r3') {
    return {
      title: 'รายงานสารน้ำใกล้หมดอายุ',
      headers: ['รหัส', 'ชื่อสารน้ำ', 'Lot', 'วันหมดอายุ', 'วอร์ด', 'คงเหลือ', 'สถานะ'],
      rows: list
        .map((s: any) => ({ s, d: daysFrom(s.expiry) }))
        .filter((x: any) => x.d <= 210)
        .sort((a: any, b: any) => a.d - b.d)
        .map(({ s, d }: any) => [
          s.display_code,
          fluidName(s.fluid_code),
          s.lot,
          thaiDate(s.expiry),
          wardName(s.ward_id),
          s.qty,
          d < 0 ? `หมดอายุแล้ว ${-d} วัน` : `อีก ${d} วัน`,
        ]),
    };
  }
  if (id === 'r5') {
    const list2 = ward !== 'all' ? wards.filter((w: any) => w.id === ward) : wards;
    const rows = (list2 ?? []).map((w: any) => {
      const items = list.filter((s: any) => s.ward_id === w.id);
      return [w.name, items.length, items.reduce((a: number, s: any) => a + s.qty, 0)];
    });
    return { title: 'รายงานสรุปแยกตามวอร์ด', headers: ['วอร์ด', 'จำนวนรายการ', 'รวมคงเหลือ (ขวด)'], rows };
  }
  // r1 default
  return {
    title: 'รายงานคงคลังประจำวัน',
    headers: ['รหัส', 'ชื่อสารน้ำ', 'Lot', 'วันหมดอายุ', 'วอร์ด', 'คงเหลือ', 'ขั้นต่ำ'],
    rows: list.map((s: any) => [
      s.display_code,
      fluidName(s.fluid_code),
      s.lot,
      thaiDate(s.expiry),
      wardName(s.ward_id),
      s.qty,
      s.min_qty,
    ]),
  };
}

// ── file builders ─────────────────────────────────────────────────────────────
const csvCell = (v: unknown) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
function toCsv(r: Report): string {
  return '﻿' + [r.headers, ...r.rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
}
// Real .xlsx (OOXML) via SheetJS — opens and previews cleanly everywhere,
// unlike the old HTML-table-as-.xls trick. Returns base64 directly.
function toXlsxBase64(r: Report): string {
  const ws = XLSX.utils.aoa_to_sheet([r.headers, ...r.rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  return XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
}
function base64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

// ── send via Resend ───────────────────────────────────────────────────────────
async function sendEmail(to: string[], subject: string, html: string, attachment: { filename: string; content: string }) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('REPORT_FROM') ?? 'Stock IV <onboarding@resend.dev>';
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html, attachments: [attachment] }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

// CORS so the app can invoke this from the browser (supabase.functions.invoke).
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sb = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({}));
    const force = body?.force === true;
    const now = new Date();

    const { data: schedules, error } = await sb.from('report_schedules').select('*').eq('enabled', true);
    if (error) throw error;

    const results: any[] = [];
    for (const s of schedules ?? []) {
      if (!force && !isDue(s.frequency, now)) {
        results.push({ id: s.id, skipped: 'not due' });
        continue;
      }
      try {
        const report = await buildReport(sb, s.report_id as ReportId, s.ward);
        const stamp = now.toISOString().slice(0, 10);
        const isXls = s.format === 'xlsx';
        const attachment = {
          filename: `${s.report_id}_${stamp}.${isXls ? 'xlsx' : 'csv'}`,
          content: isXls ? toXlsxBase64(report) : base64(toCsv(report)),
        };
        const recipients = s.recipients.split(',').map((x: string) => x.trim()).filter(Boolean);
        const html =
          `<p>เรียนผู้เกี่ยวข้อง,</p>` +
          `<p>รายงาน <b>${esc(report.title)}</b> ประจำวันที่ ${esc(now.toLocaleDateString('th-TH'))}</p>` +
          `<p>จำนวน ${report.rows.length} รายการ (ดูไฟล์แนบ)</p>` +
          `<p style="color:#888;font-size:12px">ส่งอัตโนมัติจากระบบจัดการสารน้ำ (Stock IV)</p>`;
        await sendEmail(recipients, `[Stock IV] ${report.title} — ${now.toLocaleDateString('th-TH')}`, html, attachment);
        await sb.from('report_schedules').update({ last_sent_at: now.toISOString(), last_status: 'ok' }).eq('id', s.id);
        results.push({ id: s.id, sent: recipients.length, rows: report.rows.length });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        await sb.from('report_schedules').update({ last_status: msg.slice(0, 240) }).eq('id', s.id);
        results.push({ id: s.id, error: msg });
      }
    }
    return new Response(JSON.stringify({ ok: true, processed: results.length, results }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});

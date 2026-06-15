// Supabase Edge Function: send-backup
//
// Gathers every table into one JSON snapshot and emails it as an attachment via
// Resend. Invoked manually from the app ("ส่งสำรองเข้าอีเมลตอนนี้") and on a
// weekly pg_cron schedule.
//
// Recipient resolution: body.to → env BACKUP_TO → most-recent report_schedules row.
// Secrets reused from send-report: RESEND_API_KEY, REPORT_FROM (optional).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const TABLES = ['wards', 'fluid_types', 'prices', 'stock', 'movements', 'report_schedules', 'profiles'];
const SHEET_NAMES: Record<string, string> = {
  wards: 'วอร์ด', fluid_types: 'ชนิดสารน้ำ', prices: 'ราคา', stock: 'สต็อก',
  movements: 'ประวัติรับ-เบิก', report_schedules: 'ตารางอีเมล', profiles: 'ผู้ใช้',
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function base64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

async function sendEmail(to: string[], subject: string, html: string, attachments: { filename: string; content: string }[]) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('REPORT_FROM') ?? 'Stock IV <onboarding@resend.dev>';
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html, attachments }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

function buildXlsxBase64(tables: Record<string, unknown[]>): string {
  const wb = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(tables)) {
    const ws = XLSX.utils.json_to_sheet(rows as any[]);
    XLSX.utils.book_append_sheet(wb, ws, (SHEET_NAMES[name] ?? name).slice(0, 31));
  }
  return XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const body = await req.json().catch(() => ({}));

    // Gather all tables.
    const tables: Record<string, unknown[]> = {};
    let rowCount = 0;
    for (const t of TABLES) {
      const { data, error } = await sb.from(t).select('*');
      if (error) throw error;
      tables[t] = data ?? [];
      rowCount += (data ?? []).length;
    }
    const now = new Date();
    const snapshot = { app: 'stock-iv', version: 1, exported_at: now.toISOString(), source: 'supabase', tables };

    // Resolve recipients.
    let recipients: string[] = [];
    if (typeof body?.to === 'string' && body.to.trim()) {
      recipients = body.to.split(',').map((x: string) => x.trim()).filter(Boolean);
    } else if (Deno.env.get('BACKUP_TO')) {
      recipients = Deno.env.get('BACKUP_TO')!.split(',').map((x) => x.trim()).filter(Boolean);
    } else {
      const { data } = await sb.from('report_schedules').select('recipients').eq('enabled', true).limit(1);
      if (data && data[0]?.recipients) recipients = data[0].recipients.split(',').map((x: string) => x.trim()).filter(Boolean);
    }
    if (recipients.length === 0) throw new Error('ไม่มีอีเมลผู้รับ (ส่ง to ใน body หรือ ตั้ง BACKUP_TO)');

    const stamp = now.toISOString().slice(0, 10);
    const attachments = [
      { filename: `stock-iv-backup_${stamp}.xlsx`, content: buildXlsxBase64(tables) },
      { filename: `stock-iv-backup_${stamp}.json`, content: base64(JSON.stringify(snapshot)) },
    ];
    const html =
      `<p>ไฟล์สำรองข้อมูลระบบจัดการสารน้ำ (Stock IV)</p>` +
      `<p>วันที่ ${now.toLocaleString('th-TH')} · รวม ${rowCount} แถว</p>` +
      `<p style="color:#888;font-size:12px">แนบ 2 ไฟล์: Excel (อ่านง่าย) และ JSON (ใช้กู้คืนข้อมูล) — เก็บไว้ในที่ปลอดภัย</p>`;
    await sendEmail(recipients, `[Stock IV] สำรองข้อมูล — ${now.toLocaleDateString('th-TH')}`, html, attachments);

    return new Response(JSON.stringify({ ok: true, rows: rowCount, sent: recipients.length }), {
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

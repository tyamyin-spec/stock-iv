// Supabase Edge Function: line-alert
//
// Checks stock for items below minimum and lots near/over expiry, then broadcasts
// a summary to the LINE Official Account's friends via the Messaging API.
// Invoked from the app ("ส่งทดสอบ LINE") and on a daily pg_cron schedule.
//
// Secret required: LINE_TOKEN = Channel access token of the Messaging API channel.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

const EXPIRY_WARN_DAYS = 210; // 7 months, matches the app default

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
function thaiDate(adIso: string): string {
  const d = new Date(adIso);
  return `${d.getDate()} ${months[d.getMonth()]} ${(d.getFullYear() + 543) % 100}`;
}
function daysFrom(adIso: string): number {
  const d = new Date(adIso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

async function broadcast(token: string, text: string) {
  const res = await fetch('https://api.line.me/v2/bot/message/broadcast', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ type: 'text', text }] }),
  });
  if (!res.ok) throw new Error(`LINE ${res.status}: ${await res.text()}`);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const token = Deno.env.get('LINE_TOKEN');
    if (!token) throw new Error('LINE_TOKEN is not set');
    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const body = await req.json().catch(() => ({}));
    const force = body?.force === true;

    const [{ data: wards }, { data: fluids }, { data: stock }] = await Promise.all([
      sb.from('wards').select('id,name'),
      sb.from('fluid_types').select('code,name'),
      sb.from('stock').select('*'),
    ]);
    const wardName = (id: string | null) => wards?.find((w: any) => w.id === id)?.name ?? '—';
    const fluidName = (c: string) => fluids?.find((f: any) => f.code === c)?.name ?? c;

    // Low stock per ward+fluid (sum of lots vs the max min_qty among them).
    const groups = new Map<string, any[]>();
    for (const s of stock ?? []) {
      const k = `${s.ward_id}|${s.fluid_code}`;
      const arr = groups.get(k);
      if (arr) arr.push(s);
      else groups.set(k, [s]);
    }
    const low: string[] = [];
    for (const [k, lots] of groups) {
      const [ward_id, fluid_code] = k.split('|');
      const qty = lots.reduce((a: number, s: any) => a + s.qty, 0);
      const min = Math.max(...lots.map((s: any) => s.min_qty));
      const max = Math.max(...lots.map((s: any) => s.max_qty));
      if (qty < min) low.push(`• ${fluidName(fluid_code)} [${wardName(ward_id)}] เบิกเพิ่ม +${max - qty} (เหลือ ${qty} → เต็ม ${max})`);
    }

    // Near / over expiry lots.
    const expiring = (stock ?? [])
      .map((s: any) => ({ s, d: daysFrom(s.expiry) }))
      .filter((x: any) => x.d <= EXPIRY_WARN_DAYS)
      .sort((a: any, b: any) => a.d - b.d)
      .slice(0, 20)
      .map(({ s, d }: any) =>
        `• ${fluidName(s.fluid_code)} [${wardName(s.ward_id)}] lot ${s.lot} ${d < 0 ? `หมดอายุแล้ว` : `อีก ${d} วัน`} (${thaiDate(s.expiry)})`,
      );

    if (low.length === 0 && expiring.length === 0 && !force) {
      return new Response(JSON.stringify({ ok: true, skipped: 'nothing to alert' }), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const today = new Date().toLocaleDateString('th-TH');
    let text = `🔔 แจ้งเตือนสต็อกสารน้ำ (${today})\n`;
    text += `\n📦 ต้องเบิกเพิ่มวันนี้ — เติมให้เต็ม max (${low.length})\n` + (low.length ? low.join('\n') : '— ไม่มี');
    text += `\n\n⏰ ใกล้/เลยหมดอายุ ภายใน 7 เดือน (${expiring.length})\n` + (expiring.length ? expiring.join('\n') : '— ไม่มี');
    if (text.length > 4900) text = text.slice(0, 4900) + '\n…(ดูทั้งหมดในแอป)';

    await broadcast(token, text);
    return new Response(JSON.stringify({ ok: true, low: low.length, expiring: expiring.length }), {
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

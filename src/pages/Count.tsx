// Stock count (cycle count) — pick a ward, enter the physically-counted qty per
// lot, and reconcile: the system adjusts each lot to the counted value and logs
// an 'adjust' movement for the difference.

import { useEffect, useMemo, useState } from 'react';
import { Icons } from '../icons';
import { Button, Card, EmptyState, Input, Select, useToast } from '../ui';
import { formatThaiDate, useFluids, useStock, useWards } from '../lib/data';

export function CountPage() {
  const I = Icons;
  const toast = useToast();
  const { stock, loading, recount } = useStock();
  const { wards } = useWards();
  const { fluids } = useFluids();

  const [ward, setWard] = useState('');
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const fluidName = useMemo(() => {
    const m: Record<string, string> = {};
    fluids.forEach((f) => (m[f.code] = f.name));
    return m;
  }, [fluids]);

  // Default the ward to the first one.
  useEffect(() => {
    if (!ward && wards.length > 0) setWard(wards[0].id);
  }, [wards, ward]);

  const rows = useMemo(
    () => stock.filter((s) => s.ward_id === ward).sort((a, b) => a.display_code.localeCompare(b.display_code)),
    [stock, ward],
  );

  // Seed the count inputs with the current system qty whenever the ward changes.
  useEffect(() => {
    const seed: Record<string, string> = {};
    rows.forEach((r) => (seed[r.id] = String(r.qty)));
    setCounts(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ward, rows.length]);

  const diffs = useMemo(
    () =>
      rows
        .map((r) => ({ row: r, counted: parseInt(counts[r.id] ?? '') , delta: (parseInt(counts[r.id] ?? '') || 0) - r.qty }))
        .filter((x) => !Number.isNaN(x.counted) && x.delta !== 0),
    [rows, counts],
  );

  const handleSubmit = async () => {
    const items = rows
      .map((r) => ({ id: r.id, counted: parseInt(counts[r.id] ?? '') }))
      .filter((x) => !Number.isNaN(x.counted));
    setBusy(true);
    try {
      const res = await recount(items);
      if (res.length === 0) toast({ tone: 'info', title: 'ไม่มีส่วนต่าง', desc: 'ยอดตรงกับระบบทั้งหมด' });
      else toast({ tone: 'success', title: 'ปรับยอดตามการนับแล้ว', desc: `${res.length} รายการมีการแก้ไข` });
    } catch (e: any) {
      toast({ tone: 'danger', title: 'ปรับยอดไม่สำเร็จ', desc: e?.message });
    } finally {
      setBusy(false);
    }
  };

  const wardName = wards.find((w) => w.id === ward)?.name ?? '';

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">ตรวจนับสต็อก</span>
          <h1>ตรวจนับและปรับยอดให้ตรงจริง</h1>
          <p>เลือกวอร์ด กรอกจำนวนที่นับได้จริงในแต่ละ lot ระบบจะปรับยอดให้ตรงและบันทึกส่วนต่างเป็นประวัติ</p>
        </div>
      </div>

      <Card>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ minWidth: 220 }}>
            <label className="muted" style={{ fontSize: 12.5, display: 'block', marginBottom: 4 }}>
              วอร์ดที่ตรวจนับ
            </label>
            <Select value={ward} onChange={(e) => setWard(e.target.value)} style={{ width: '100%' }}>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="spacer" />
          <div className="muted" style={{ fontSize: 13 }}>
            {diffs.length > 0 ? (
              <span style={{ color: '#B45309', fontWeight: 600 }}>{diffs.length} รายการมีส่วนต่าง</span>
            ) : (
              'ยอดตรงกับระบบ'
            )}
          </div>
          <Button variant="primary" icon={<I.Check size={16} />} onClick={handleSubmit} disabled={busy || rows.length === 0}>
            {busy ? 'กำลังบันทึก…' : 'ยืนยันการนับ'}
          </Button>
        </div>
      </Card>

      <Card padding={false} style={{ marginTop: 16 }}>
        {loading ? (
          <EmptyState icon={<I.Refresh size={28} />} title="กำลังโหลด..." desc="ดึงข้อมูลคลัง" />
        ) : rows.length === 0 ? (
          <EmptyState icon={<I.Box size={28} />} title="ไม่มีสารน้ำในวอร์ดนี้" desc="เลือกวอร์ดอื่น" />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>ชื่อสารน้ำ</th>
                  <th>Lot</th>
                  <th>วันหมดอายุ</th>
                  <th className="num">ยอดระบบ</th>
                  <th className="num">นับจริง</th>
                  <th className="num">ส่วนต่าง</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const counted = parseInt(counts[r.id] ?? '');
                  const delta = (Number.isNaN(counted) ? r.qty : counted) - r.qty;
                  return (
                    <tr key={r.id}>
                      <td className="col-code">{r.display_code}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{fluidName[r.fluid_code] ?? r.fluid_code}</div>
                        <div className="muted mono" style={{ fontSize: 11 }}>
                          {r.fluid_code}
                        </div>
                      </td>
                      <td className="mono">{r.lot}</td>
                      <td className="muted" style={{ fontSize: 12 }}>
                        {formatThaiDate(r.expiry)}
                      </td>
                      <td className="num">
                        <span style={{ fontWeight: 600 }}>{r.qty}</span>
                      </td>
                      <td className="num">
                        <Input
                          type="number"
                          min={0}
                          value={counts[r.id] ?? ''}
                          onChange={(e) => setCounts((c) => ({ ...c, [r.id]: e.target.value }))}
                          style={{ width: 90, textAlign: 'right' }}
                        />
                      </td>
                      <td className="num">
                        {delta === 0 ? (
                          <span className="muted">0</span>
                        ) : (
                          <span style={{ fontWeight: 700, color: delta < 0 ? '#DC2626' : '#16A34A' }}>
                            {delta > 0 ? '+' : ''}
                            {delta}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="muted" style={{ fontSize: 12, marginTop: 12 }}>
        หมายเหตุ: ช่อง "นับจริง" ตั้งค่าเริ่มต้นเป็นยอดในระบบ — แก้เฉพาะรายการที่นับได้ไม่ตรง · กด "ยืนยันการนับ" แล้วระบบจะปรับยอด
        {wardName ? ` ของ ${wardName}` : ''} ให้ตรงและบันทึกส่วนต่างเป็นประวัติ (ปรับยอด)
      </div>
    </div>
  );
}

// Stock planning — reorder suggestions + usage forecast (days of stock left).
// Both are driven by buildPlanning(), which derives average daily use from
// 'out' movements over a trailing window.

import { useMemo, useState } from 'react';
import { Icons } from '../icons';
import { Badge, Button, Card, EmptyState, Input, Select, useToast } from '../ui';
import { buildPlanning, fmtNum, useFluids, useMovements, useStock, useWards, type PlanRow } from '../lib/data';

const WINDOW_DAYS = 30;

function statusBadge(s: PlanRow['status']) {
  if (s === 'low') return <Badge tone="danger">ต้องเติม</Badge>;
  if (s === 'over') return <Badge tone="warning">เหลือเยอะ</Badge>;
  return <Badge tone="success">พอดี</Badge>;
}

export function PlanningPage() {
  const I = Icons;
  const toast = useToast();
  const { stock } = useStock();
  const { movements } = useMovements(2000);
  const { wards } = useWards();
  const { fluids } = useFluids();

  const [wardFilter, setWardFilter] = useState('all');
  const [onlyReorder, setOnlyReorder] = useState(false);
  const [query, setQuery] = useState('');

  const fluidName = useMemo(() => {
    const m: Record<string, string> = {};
    fluids.forEach((f) => (m[f.code] = f.name));
    return m;
  }, [fluids]);
  const wardName = (id: string) => wards.find((w) => w.id === id)?.name ?? '—';

  const rows = useMemo(() => buildPlanning(stock, movements, WINDOW_DAYS), [stock, movements]);

  const filtered = useMemo(() => {
    let arr = rows;
    if (wardFilter !== 'all') arr = arr.filter((r) => r.ward_id === wardFilter);
    if (onlyReorder) arr = arr.filter((r) => r.status === 'low');
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter((r) => (fluidName[r.fluid_code] ?? r.fluid_code).toLowerCase().includes(q) || r.fluid_code.toLowerCase().includes(q));
    }
    // Most urgent first: low → over → ok, then by days left.
    const rank = { low: 0, over: 1, ok: 2 } as const;
    return [...arr].sort((a, b) => rank[a.status] - rank[b.status] || (a.daysLeft ?? 1e9) - (b.daysLeft ?? 1e9));
  }, [rows, wardFilter, onlyReorder, query, fluidName]);

  const counts = useMemo(() => {
    const scope = wardFilter === 'all' ? rows : rows.filter((r) => r.ward_id === wardFilter);
    return {
      low: scope.filter((r) => r.status === 'low').length,
      over: scope.filter((r) => r.status === 'over').length,
      tracked: scope.length,
    };
  }, [rows, wardFilter]);

  const exportReorder = () => {
    const low = rows.filter((r) => r.status === 'low' && (wardFilter === 'all' || r.ward_id === wardFilter));
    if (low.length === 0) {
      toast({ tone: 'warning', title: 'ไม่มีรายการที่ต้องเติม' });
      return;
    }
    const headers = ['วอร์ด', 'รหัส', 'ชื่อสารน้ำ', 'คงเหลือ', 'ขั้นต่ำ', 'แนะนำเติม (ขวด)'];
    const lines = [headers, ...low.map((r) => [wardName(r.ward_id), r.fluid_code, fluidName[r.fluid_code] ?? r.fluid_code, r.qty, r.min, r.reorderQty])];
    const csv = '﻿' + lines.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reorder_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({ tone: 'success', title: 'ดาวน์โหลดรายการขอเติมแล้ว', desc: `${low.length} รายการ` });
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">วางแผนสต็อก</span>
          <h1>ขอเติมสต็อก & พยากรณ์การใช้</h1>
          <p>คำนวณอัตราการใช้จากประวัติเบิก {WINDOW_DAYS} วันล่าสุด เพื่อแนะนำการเติมและเตือนของใกล้หมด/เหลือเยอะ</p>
        </div>
        <div className="row row-gap-sm">
          <Button variant="secondary" icon={<I.Download size={18} />} onClick={exportReorder}>
            Export รายการขอเติม
          </Button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <div className="kpi kpi-danger">
          <div className="kpi-icon">
            <I.AlertTri size={22} />
          </div>
          <div className="kpi-body">
            <div className="kpi-label">ต้องเติม (ต่ำกว่าขั้นต่ำ/ใกล้หมด)</div>
            <div className="kpi-value">
              {counts.low}
              <span className="kpi-unit">รายการ</span>
            </div>
            <div className="kpi-foot">เร่งสั่งเติมก่อนของขาด</div>
          </div>
        </div>
        <div className="kpi kpi-warning">
          <div className="kpi-icon">
            <I.Clock size={22} />
          </div>
          <div className="kpi-body">
            <div className="kpi-label">เหลือเยอะ (เสี่ยงหมดอายุ)</div>
            <div className="kpi-value">
              {counts.over}
              <span className="kpi-unit">รายการ</span>
            </div>
            <div className="kpi-foot">ใช้ช้า ควรชะลอสั่ง/กระจาย</div>
          </div>
        </div>
        <div className="kpi kpi-info">
          <div className="kpi-icon">
            <I.Box size={22} />
          </div>
          <div className="kpi-body">
            <div className="kpi-label">ติดตามทั้งหมด</div>
            <div className="kpi-value">
              {counts.tracked}
              <span className="kpi-unit">รายการ</span>
            </div>
            <div className="kpi-foot">สารน้ำ × วอร์ด</div>
          </div>
        </div>
      </div>

      <Card padding={false}>
        <div className="table-toolbar" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)} style={{ width: 180 }}>
            <option value="all">ทุกวอร์ด</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </Select>
          <Button variant={onlyReorder ? 'primary' : 'secondary'} size="sm" onClick={() => setOnlyReorder((v) => !v)}>
            เฉพาะที่ต้องเติม
          </Button>
          <div className="spacer"></div>
          <Input
            icon={<I.Search size={16} />}
            placeholder="ค้นหาสารน้ำ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: 220 }}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<I.CheckCircle size={28} />} title="ไม่มีรายการในเงื่อนไขนี้" desc="ลองปรับตัวกรอง" />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ชื่อสารน้ำ</th>
                  <th>วอร์ด</th>
                  <th className="num">คงเหลือ</th>
                  <th className="num">ขั้นต่ำ</th>
                  <th className="num">ใช้/วัน</th>
                  <th className="num">เหลือใช้ได้</th>
                  <th className="num">แนะนำเติม</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={`${r.ward_id}|${r.fluid_code}`}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{fluidName[r.fluid_code] ?? r.fluid_code}</div>
                      <div className="muted mono" style={{ fontSize: 11 }}>
                        {r.fluid_code}
                      </div>
                    </td>
                    <td>{wardName(r.ward_id)}</td>
                    <td className="num">
                      <span style={{ fontWeight: 600 }}>{r.qty}</span>
                    </td>
                    <td className="num muted">{r.min}</td>
                    <td className="num">{r.avgPerDay > 0 ? r.avgPerDay.toFixed(1) : '—'}</td>
                    <td className="num">
                      {r.daysLeft === null ? (
                        <span className="muted">ไม่มีสถิติ</span>
                      ) : (
                        <span style={{ fontWeight: 600, color: r.daysLeft <= 14 ? '#DC2626' : 'inherit' }}>~{r.daysLeft} วัน</span>
                      )}
                    </td>
                    <td className="num">
                      {r.reorderQty > 0 ? <span style={{ fontWeight: 600, color: '#1E6FEB' }}>+{r.reorderQty}</span> : <span className="muted">—</span>}
                    </td>
                    <td>{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="muted" style={{ fontSize: 12, marginTop: 12 }}>
        หมายเหตุ: "ใช้/วัน" คำนวณจากยอดเบิกออกเฉลี่ยใน {WINDOW_DAYS} วันล่าสุด · "เหลือใช้ได้" = คงเหลือ ÷ อัตราใช้ ·
        "แนะนำเติม" = เติมให้ถึงระดับสูงสุด (max) เมื่อต่ำกว่าขั้นต่ำ · {fmtNum(counts.tracked)} รายการที่ติดตาม
      </div>
    </div>
  );
}

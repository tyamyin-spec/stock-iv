// Expiry alerts page — live from useStock.

import { useMemo, useState } from 'react';
import { Icons } from '../icons';
import { Button, Card, EmptyState, ExpiryBadge, Input, Tabs } from '../ui';
import { daysFromToday, formatThaiDate, useFluids, useStock, useWards } from '../lib/data';
import { useSettings, warnWindowLabel } from '../lib/settings';

export function ExpiryPage() {
  const I = Icons;
  const [tab, setTab] = useState('soon');
  const [query, setQuery] = useState('');
  const { stock, loading } = useStock();
  const { wards } = useWards();
  const { fluids } = useFluids();
  const { expiryWarnDays } = useSettings();
  const warnLabel = warnWindowLabel(expiryWarnDays);

  const fluidName = useMemo(() => {
    const m: Record<string, string> = {};
    fluids.forEach((f) => (m[f.code] = f.name));
    return m;
  }, [fluids]);

  const buckets = useMemo(() => {
    const all = stock.map((x) => ({ ...x, days: daysFromToday(x.expiry) }));
    return {
      expired: all.filter((x) => x.days < 0),
      critical: all.filter((x) => x.days >= 0 && x.days <= 30),
      soon: all.filter((x) => x.days > 30 && x.days <= expiryWarnDays),
      ok: all.filter((x) => x.days > expiryWarnDays),
    };
  }, [stock, expiryWarnDays]);

  const tabs = [
    { value: 'expired', label: 'หมดอายุแล้ว', count: buckets.expired.length },
    { value: 'critical', label: 'ภายใน 30 วัน', count: buckets.critical.length },
    { value: 'soon', label: `≤ ${warnLabel}`, count: buckets.soon.length },
    { value: 'ok', label: 'ยังไม่เสี่ยง', count: buckets.ok.length },
  ];

  const list = useMemo(() => {
    let arr = (buckets as any)[tab] as typeof buckets.soon;
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (x) =>
          x.display_code.toLowerCase().includes(q) ||
          x.lot.toLowerCase().includes(q) ||
          (fluidName[x.fluid_code] ?? x.fluid_code).toLowerCase().includes(q),
      );
    }
    return [...arr].sort((a, b) => a.days - b.days);
  }, [buckets, tab, query, fluidName]);

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">การแจ้งเตือนหมดอายุ</span>
          <h1>สารน้ำใกล้และเลยวันหมดอายุ</h1>
          <p>{buckets.expired.length + buckets.critical.length} รายการต้องดำเนินการเร่งด่วน</p>
        </div>
        <div className="row row-gap-sm">
          <Button variant="secondary" icon={<I.Print size={18} />}>
            พิมพ์รายการ
          </Button>
          <Button variant="secondary" icon={<I.Download size={18} />}>
            Export
          </Button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <div className="kpi kpi-danger">
          <div className="kpi-icon">
            <I.AlertTri size={22} />
          </div>
          <div className="kpi-body">
            <div className="kpi-label">หมดอายุแล้ว</div>
            <div className="kpi-value">
              {buckets.expired.length}
              <span className="kpi-unit">รายการ</span>
            </div>
            <div className="kpi-foot">ต้องนำออกจากคลังทันที</div>
          </div>
        </div>
        <div className="kpi kpi-warning">
          <div className="kpi-icon">
            <I.Clock size={22} />
          </div>
          <div className="kpi-body">
            <div className="kpi-label">เร่งด่วน (≤30 วัน)</div>
            <div className="kpi-value">
              {buckets.critical.length}
              <span className="kpi-unit">รายการ</span>
            </div>
            <div className="kpi-foot">เร่งใช้ก่อน, หรือคืนคลังกลาง</div>
          </div>
        </div>
        <div className="kpi kpi-info">
          <div className="kpi-icon">
            <I.Calendar size={22} />
          </div>
          <div className="kpi-body">
            <div className="kpi-label">ใกล้หมด (≤ {warnLabel})</div>
            <div className="kpi-value">
              {buckets.soon.length}
              <span className="kpi-unit">รายการ</span>
            </div>
            <div className="kpi-foot">วางแผนใช้ก่อนหมดอายุ</div>
          </div>
        </div>
        <div className="kpi kpi-success">
          <div className="kpi-icon">
            <I.CheckCircle size={22} />
          </div>
          <div className="kpi-body">
            <div className="kpi-label">ยังไม่เสี่ยง</div>
            <div className="kpi-value">
              {buckets.ok.length}
              <span className="kpi-unit">รายการ</span>
            </div>
            <div className="kpi-foot">เหลือมากกว่า {warnLabel}</div>
          </div>
        </div>
      </div>

      <Card padding={false}>
        <div className="table-toolbar" style={{ gap: 12 }}>
          <Tabs value={tab} onChange={setTab} items={tabs} />
          <div className="spacer"></div>
          <Input
            icon={<I.Search size={16} />}
            placeholder="ค้นหารหัส, ชื่อ, Lot..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: 260 }}
          />
        </div>

        {loading ? (
          <EmptyState icon={<I.Refresh size={28} />} title="กำลังโหลด..." desc="ดึงข้อมูลคลัง" />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<I.CheckCircle size={28} />}
            title="ไม่มีรายการในกลุ่มนี้"
            desc="ทุกรายการอยู่ในสภาพปลอดภัย"
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>ชื่อสารน้ำ</th>
                  <th>Lot</th>
                  <th>วันหมดอายุ</th>
                  <th>วอร์ด</th>
                  <th className="num">คงเหลือ</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {list.map((x) => (
                  <tr key={x.id}>
                    <td className="col-code">{x.display_code}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{fluidName[x.fluid_code] ?? x.fluid_code}</div>
                      <div className="muted mono" style={{ fontSize: 11 }}>
                        {x.fluid_code}
                      </div>
                    </td>
                    <td className="mono">{x.lot}</td>
                    <td>
                      <div>{formatThaiDate(x.expiry)}</div>
                      <div className="muted" style={{ fontSize: 11 }}>
                        {x.days < 0 ? `เลยมา ${Math.abs(x.days)} วัน` : `อีก ${x.days} วัน`}
                      </div>
                    </td>
                    <td>{wards.find((w) => w.id === x.ward_id)?.name ?? '—'}</td>
                    <td className="num">
                      <span style={{ fontWeight: 600 }}>{x.qty}</span> <span className="muted">ขวด</span>
                    </td>
                    <td>
                      <ExpiryBadge days={x.days} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}


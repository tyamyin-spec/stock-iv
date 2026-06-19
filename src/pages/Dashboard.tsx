// Dashboard — live KPIs + charts off real stock + movements.

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Icons } from '../icons';
import { Button, Card, EmptyState } from '../ui';
import { daysFromToday, fmtNum, formatThaiDate, useMovements, useStock, useWards } from '../lib/data';
import { useSettings } from '../lib/settings';
import type { PageId } from '../shell';

function useMountIn(delay = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}

export type Tone = 'primary' | 'info' | 'teal' | 'indigo' | 'amber' | 'rose' | 'danger' | 'warning' | 'success';

const WARD_TONE: Record<string, Tone> = {
  'semi-sx': 'info',
  'surg-male': 'teal',
  'surg-female': 'indigo',
  icu: 'amber',
  er: 'rose',
};
// Fallback palette so any ward (incl. custom ones) gets a distinct colour.
const WARD_TONE_CYCLE: Tone[] = ['info', 'teal', 'indigo', 'amber', 'rose'];

export function DashboardPage({
  onNavigate,
  onOpenAdd,
}: {
  onNavigate: (p: PageId) => void;
  onOpenAdd: () => void;
  onOpenScan: () => void;
}) {
  const I = Icons;
  const [wardFilter, setWardFilter] = useState('all');
  const [usageRange, setUsageRange] = useState<'7d' | '14d' | '30d'>('14d');

  const { stock, loading: stockLoading } = useStock();
  const { wards } = useWards();
  const { expiryWarnDays } = useSettings();
  const { movements } = useMovements(500);

  // Stock filtered by ward.
  const filteredStock = useMemo(
    () => (wardFilter === 'all' ? stock : stock.filter((s) => s.ward_id === wardFilter)),
    [stock, wardFilter],
  );

  // Per-ward totals — shown as KPI hero tiles.
  const wardTotals = useMemo(() => {
    const m: Record<string, number> = {};
    wards.forEach((w) => (m[w.id] = 0));
    stock.forEach((s) => {
      m[s.ward_id] = (m[s.ward_id] ?? 0) + s.qty;
    });
    return m;
  }, [wards, stock]);

  // Alert counts.
  const alerts = useMemo(() => {
    const low = filteredStock.filter((s) => s.qty < s.min_qty).length;
    const withDays = filteredStock.map((s) => ({ ...s, days: daysFromToday(s.expiry) }));
    const expSoon = withDays.filter((x) => x.days >= 0 && x.days <= 180).length;
    const expired = withDays.filter((x) => x.days < 0).length;
    return { low, expSoon, expired };
  }, [filteredStock]);

  // Top 5 fluids by total qty for the bar chart.
  const stockByType = useMemo(() => {
    const m: Record<string, number> = {};
    filteredStock.forEach((s) => {
      m[s.fluid_code] = (m[s.fluid_code] ?? 0) + s.qty;
    });
    return Object.entries(m)
      .map(([code, qty]) => ({ code, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [filteredStock]);

  // Daily usage histogram from movements (kind='out' qty).
  const usageDaily = useMemo(() => {
    const days = usageRange === '7d' ? 7 : usageRange === '30d' ? 30 : 14;
    const out: number[] = new Array(days).fill(0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - (days - 1));
    movements.forEach((m) => {
      if (m.kind !== 'out') return;
      if (wardFilter !== 'all' && m.ward_id !== wardFilter) return;
      const dt = new Date(m.occurred_at);
      dt.setHours(0, 0, 0, 0);
      const idx = Math.floor((dt.getTime() - start.getTime()) / 86400000);
      if (idx >= 0 && idx < days) out[idx] += Math.abs(m.qty);
    });
    return out;
  }, [movements, usageRange, wardFilter]);

  // Soon-expiring rows for the table.
  const expiringItems = useMemo(() => {
    return filteredStock
      .map((s) => ({ ...s, days: daysFromToday(s.expiry) }))
      .filter((s) => s.days >= 0 && s.days <= expiryWarnDays)
      .sort((a, b) => a.days - b.days)
      .slice(0, 6);
  }, [filteredStock, expiryWarnDays]);

  const totalStock = useMemo(() => stock.reduce((s, x) => s + x.qty, 0), [stock]);
  const heroTotal = wardFilter === 'all' ? totalStock : (wardTotals[wardFilter] ?? 0);
  const wardName = wards.find((w) => w.id === wardFilter)?.name;
  const heroLabel = wardFilter === 'all' ? 'Stock รวมทั้งหมด' : `Stock ${wardName}`;

  const filterBadge = wardFilter !== 'all' && (
    <div className="filter-badge-row">
      <span className="filter-badge">
        <I.Filter size={12} /> วอร์ด: <b>{wardName}</b>
        <button onClick={() => setWardFilter('all')} aria-label="ล้างตัวกรอง">
          <I.Close size={12} />
        </button>
      </span>
    </div>
  );

  return (
    <div className="dash-root">
      <div className="dash-header">
        <div className="dash-title">
          <h1>ภาพรวมระบบ</h1>
          <p>สรุปคงคลังและการใช้สารน้ำของวอร์ดที่รับผิดชอบ</p>
        </div>
        <div className="dash-header-actions">
          <WardSelector value={wardFilter} onChange={setWardFilter} wards={wards} />
          <Button variant="primary" icon={<I.Plus size={18} />} onClick={onOpenAdd}>
            เพิ่มสารน้ำ
          </Button>
        </div>
      </div>

      {filterBadge}

      {/* Section 1: stock totals */}
      <div className="kpi-section">
        <div className="kpi-section-head">
          <h3>ภาพรวมสต็อก</h3>
          <span className="muted">รวม {fmtNum(totalStock)} ขวด ใน {wards.length} วอร์ด</span>
        </div>
        <div className="kpi-row-3">
          <KpiHero
            idx={0}
            tone="primary"
            icon={<I.Box size={28} />}
            label={heroLabel}
            value={heroTotal}
            unit="ขวด"
            highlight
          />
          {wards.map((w, i) => (
            <KpiHero
              key={w.id}
              idx={i + 1}
              tone={WARD_TONE[w.code] || WARD_TONE_CYCLE[i % WARD_TONE_CYCLE.length]}
              icon={w.code === 'semi-sx' ? <I.Building size={28} /> : <BedIcon size={28} />}
              label={w.name}
              value={wardTotals[w.id] ?? 0}
              unit="ขวด"
              dim={wardFilter !== 'all' && wardFilter !== w.id}
              active={wardFilter === w.id}
            />
          ))}
        </div>
      </div>

      {/* Section 2: alerts */}
      <div className="kpi-section">
        <div className="kpi-section-head">
          <h3>การแจ้งเตือน</h3>
          <span className="muted">{alerts.low + alerts.expSoon + alerts.expired} รายการต้องการความสนใจ</span>
        </div>
        <div className="kpi-row-3">
          <KpiAlert
            idx={0}
            tone="danger"
            icon={<I.AlertTri size={28} />}
            label="ต่ำกว่าขั้นต่ำ"
            value={alerts.low}
            unit="รายการ"
            desc="ควรเบิกเพิ่มภายในวันนี้"
            onClick={() => onNavigate('stock')}
          />
          <KpiAlert
            idx={1}
            tone="warning"
            icon={<I.Clock size={28} />}
            label="ใกล้หมดอายุ"
            value={alerts.expSoon}
            unit="รายการ"
            desc="ภายใน 6 เดือนข้างหน้า"
            onClick={() => onNavigate('expiry')}
          />
          <KpiAlert
            idx={2}
            tone="danger"
            icon={<I.ExpiredCal size={28} />}
            label="หมดอายุแล้ว"
            value={alerts.expired}
            unit="รายการ"
            desc="ต้องนำออกจากคลังทันที"
            onClick={() => onNavigate('expiry')}
          />
        </div>
      </div>

      {/* Section 3: stock by type */}
      <div className="dash-chart-row dash-chart-row--single">
        <Card className="chart-card">
          <div className="dash-chart-head">
            <div>
              <h3 className="dash-chart-title">คงเหลือแยกตามชนิดสารน้ำ</h3>
              <p className="muted" style={{ fontSize: 12.5 }}>
                หน่วย: ขวด · 5 ชนิดที่มียอดสูงสุด{wardFilter !== 'all' && wardName ? ` · ${wardName}` : ''}
              </p>
            </div>
          </div>
          {stockByType.length > 0 ? (
            <VerticalBarChart data={stockByType} />
          ) : stockLoading ? (
            <EmptyState icon={<I.Refresh size={24} />} title="กำลังโหลด..." />
          ) : (
            <EmptyState icon={<I.Box size={24} />} title="ไม่พบข้อมูล" desc="ยังไม่มีสารน้ำในคลังกลุ่มนี้" />
          )}
        </Card>
      </div>

      {/* Section 4: usage chart */}
      <Card>
        <div className="dash-chart-head">
          <div>
            <h3 className="dash-chart-title">
              แนวโน้มการเบิกใช้ {usageRange === '7d' ? '7' : usageRange === '30d' ? '30' : '14'} วันล่าสุด
            </h3>
            <p className="muted" style={{ fontSize: 12.5 }}>
              เลื่อนเมาส์ที่แท่งเพื่อดูข้อมูล{wardFilter !== 'all' && wardName ? ` · ${wardName}` : ''}
            </p>
          </div>
          <UsageRangeToggle value={usageRange} onChange={setUsageRange} />
        </div>
        <UsageBarChart data={usageDaily} />
      </Card>

      {/* Section 5: expiring */}
      <div className="dash-bottom-row">
        <Card>
          <h3 className="dash-chart-title">
            <span style={{ color: 'var(--warning)' }}>
              <I.AlertTri size={18} />
            </span>{' '}
            สารน้ำใกล้หมดอายุ <span className="muted">(เรียงจากใกล้สุด{wardFilter !== 'all' && wardName ? ` · ${wardName}` : ''})</span>
          </h3>
          {expiringItems.length === 0 ? (
            <EmptyState
              icon={<I.CheckCircle size={24} />}
              title="ไม่มีรายการใกล้หมดอายุ"
              desc={`${wardName || 'ทุกวอร์ด'}อยู่ในสภาพปลอดภัย`}
            />
          ) : (
            <div className="table-wrap" style={{ marginTop: 6 }}>
              <table className="table dash-table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>ชนิด</th>
                    <th>Lot</th>
                    <th>วันหมดอายุ</th>
                    <th className="num">เหลืออีก</th>
                    <th>วอร์ด</th>
                    <th className="num">คงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringItems.map((x, i) => (
                    <tr
                      key={x.id}
                      onClick={() => onNavigate('expiry')}
                      style={{ cursor: 'pointer', animationDelay: `${i * 40}ms` }}
                      className="reveal-row"
                    >
                      <td className="col-code">{x.display_code}</td>
                      <td className="mono">{x.fluid_code}</td>
                      <td className="mono">{x.lot}</td>
                      <td>{formatThaiDate(x.expiry)}</td>
                      <td className="num">
                        <span
                          className={`days-pill ${x.days < 30 ? 'days-urgent' : x.days < 90 ? 'days-warn' : 'days-ok'}`}
                        >
                          {x.days} วัน
                        </span>
                      </td>
                      <td>{wards.find((w) => w.id === x.ward_id)?.name ?? '—'}</td>
                      <td className="num">
                        <b>{x.qty}</b> <span className="muted">ขวด</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="dash-footnote">
        <I.Info size={16} />
        <span>
          <b>หมายเหตุ:</b> ข้อมูลอัปเดตอัตโนมัติจากรายการเคลื่อนไหวล่าสุด
        </span>
      </div>
    </div>
  );
}

// ── KPI hero / alert cards ─────────────────────────────────────────────────
function KpiHero({
  idx = 0,
  tone = 'primary',
  icon,
  label,
  value,
  unit,
  highlight,
  dim,
  active,
}: {
  idx?: number;
  tone?: Tone;
  icon: ReactNode;
  label: ReactNode;
  value: number;
  unit: string;
  highlight?: boolean;
  dim?: boolean;
  active?: boolean;
}) {
  const mounted = useMountIn(idx * 70);
  return (
    <div
      className={`kpi-hero kpi-hero-${tone} ${highlight ? 'is-highlight' : ''} ${dim ? 'is-dim' : ''} ${
        active ? 'is-active' : ''
      } ${mounted ? 'is-in' : ''}`}
    >
      <div className="kpi-hero-icon">{icon}</div>
      <div className="kpi-hero-content">
        <div className="kpi-hero-label">{label}</div>
        <div className="kpi-hero-stack">
          <span className="kpi-hero-value mono">{value.toLocaleString('en-US')}</span>
          <span className="kpi-hero-unit">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function KpiAlert({
  idx = 0,
  tone = 'danger',
  icon,
  label,
  value,
  unit,
  desc,
  onClick,
}: {
  idx?: number;
  tone?: Tone;
  icon: ReactNode;
  label: ReactNode;
  value: number;
  unit: string;
  desc: ReactNode;
  onClick?: () => void;
}) {
  const I = Icons;
  const mounted = useMountIn(idx * 70);
  return (
    <div
      className={`kpi-alert kpi-alert-${tone} ${mounted ? 'is-in' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="kpi-alert-head">
        <div className="kpi-alert-icon">{icon}</div>
        <div className={`kpi-alert-pulse pulse-${tone}`}>
          <span></span>
        </div>
      </div>
      <div className="kpi-alert-label">{label}</div>
      <div className="kpi-alert-value-row">
        <span className="kpi-alert-value mono">{value}</span>
        <span className="kpi-alert-unit">{unit}</span>
      </div>
      <div className="kpi-alert-desc">{desc}</div>
      <div className="kpi-alert-cta">
        ดูรายการ <I.ChevronRight size={14} />
      </div>
    </div>
  );
}

function BedIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 6v14M22 12v8M2 14h20M2 18h20" />
      <circle cx="8" cy="11" r="2.4" />
      <path d="M12 14V9h7a3 3 0 0 1 3 3v2" />
    </svg>
  );
}

function WardSelector({
  value,
  onChange,
  wards,
}: {
  value: string;
  onChange: (v: string) => void;
  wards: { id: string; name: string }[];
}) {
  const I = Icons;
  return (
    <div className="header-badge header-badge-select">
      <div className="header-badge-icon">
        <I.Building size={18} />
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="เลือกวอร์ด">
        <option value="all">ทุกวอร์ด</option>
        {wards.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
      <I.ChevronDown size={16} className="muted" />
    </div>
  );
}

// ── Vertical bar chart ───────────────────────────────────────────────────
function VerticalBarChart({ data }: { data: { code: string; qty: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const mounted = useMountIn(200);
  const max = Math.max(...data.map((d) => d.qty), 1);
  const stepY = max <= 100 ? 25 : max <= 250 ? 50 : 100;
  const yMax = Math.ceil(max / stepY) * stepY;
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += stepY) yTicks.push(v);
  const w = 400,
    h = 240,
    pad = { l: 36, r: 8, t: 32, b: 30 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const barW = innerW / data.length;
  return (
    <div className="vbar-block">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="vbarG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1E6FEB" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
          <linearGradient id="vbarH" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1746A1" />
            <stop offset="100%" stopColor="#1E6FEB" />
          </linearGradient>
        </defs>
        {yTicks.map((v) => {
          const y = pad.t + innerH - (v / yMax) * innerH;
          return (
            <g key={v}>
              <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#EEF3F8" strokeWidth="1" />
              <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="10.5" fill="#7B8AA0" fontFamily="var(--mono)">
                {v}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const fullBh = (d.qty / yMax) * innerH;
          const bh = mounted ? fullBh : 0;
          const x = pad.l + i * barW + barW * 0.22;
          const bw = barW * 0.56;
          const y = pad.t + innerH - bh;
          const isHover = hover === i;
          return (
            <g
              key={d.code}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <rect x={pad.l + i * barW} y={pad.t} width={barW} height={innerH} fill="transparent" />
              <rect
                x={x}
                y={y}
                width={bw}
                height={bh}
                rx="4"
                fill={isHover ? 'url(#vbarH)' : 'url(#vbarG)'}
                opacity={hover !== null && !isHover ? 0.5 : 1}
                style={{
                  transition: `height .7s cubic-bezier(.16,1,.3,1) ${i * 80}ms, y .7s cubic-bezier(.16,1,.3,1) ${
                    i * 80
                  }ms, opacity .15s, fill .15s`,
                }}
              />
              <text
                x={x + bw / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize={isHover ? 14 : 12.5}
                fontWeight="700"
                fill={isHover ? '#1746A1' : '#1E6FEB'}
                fontFamily="var(--mono)"
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: `opacity .3s ease ${i * 80 + 400}ms, font-size .12s, fill .12s`,
                }}
              >
                {d.qty}
              </text>
              <text
                x={x + bw / 2}
                y={h - 10}
                textAnchor="middle"
                fontSize="11"
                fill={isHover ? '#0B1F3A' : '#475569'}
                fontWeight={isHover ? 600 : 500}
              >
                {d.code}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function UsageRangeToggle({
  value,
  onChange,
}: {
  value: '7d' | '14d' | '30d';
  onChange: (v: '7d' | '14d' | '30d') => void;
}) {
  return (
    <div className="segmented">
      {(['7d', '14d', '30d'] as const).map((opt) => (
        <button key={opt} aria-pressed={value === opt} onClick={() => onChange(opt)}>
          {opt === '7d' ? '7 วัน' : opt === '14d' ? '14 วัน' : '30 วัน'}
        </button>
      ))}
    </div>
  );
}

function UsageBarChart({ data }: { data: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const mounted = useMountIn(300);
  if (!data || data.length === 0 || data.every((v) => v === 0)) {
    return (
      <div
        className="chart-wrap"
        style={{ position: 'relative', minHeight: 220, display: 'grid', placeItems: 'center', color: 'var(--text-3)' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>ยังไม่มีข้อมูลการเบิกใช้</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>ข้อมูลจะแสดงเมื่อมีรายการเบิกออก</div>
        </div>
      </div>
    );
  }
  const max = Math.max(...data, 1);
  const avg = data.reduce((s, x) => s + x, 0) / data.length;
  const w = 800,
    h = 240,
    pad = { l: 36, r: 12, t: 24, b: 30 };
  const barW = (w - pad.l - pad.r) / data.length;
  const innerH = h - pad.t - pad.b;
  const today = new Date();
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const dateFor = (i: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (data.length - 1 - i));
    return d;
  };
  const labelStep = data.length <= 7 ? 1 : data.length <= 14 ? 2 : 4;

  return (
    <div className="chart-wrap" style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="ubarG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#A5B4FC" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="ubarToday" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="ubarH" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = pad.t + innerH - p * innerH;
          const v = Math.round(max * p);
          return (
            <g key={i}>
              <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#EEF3F8" strokeWidth="1" />
              <text x={pad.l - 8} y={y + 4} fontSize="10.5" fill="#7B8AA0" textAnchor="end" fontFamily="var(--mono)">
                {v}
              </text>
            </g>
          );
        })}
        {(() => {
          const y = pad.t + innerH - (avg / max) * innerH;
          return (
            <>
              <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#C4B5FD" strokeDasharray="4 4" strokeWidth="1.5" />
              <text x={w - pad.r - 4} y={y - 6} fontSize="10" fill="#7C3AED" textAnchor="end" fontFamily="var(--mono)">
                เฉลี่ย {avg.toFixed(1)}
              </text>
            </>
          );
        })()}
        {data.map((v, i) => {
          const fullBh = (v / max) * innerH;
          const bh = mounted ? fullBh : 0;
          const x = pad.l + i * barW + 4;
          const y = pad.t + innerH - bh;
          const isTodayBar = i === data.length - 1;
          const isHover = hover === i;
          const fill = isHover ? 'url(#ubarH)' : isTodayBar ? 'url(#ubarToday)' : 'url(#ubarG)';
          return (
            <g key={i}>
              <rect
                x={pad.l + i * barW}
                y={pad.t}
                width={barW}
                height={innerH}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              <rect
                x={x}
                y={y}
                width={barW - 8}
                height={bh}
                rx="5"
                fill={fill}
                opacity={hover !== null && !isHover ? 0.45 : 1}
                style={{
                  transition: `height .8s cubic-bezier(.16,1,.3,1) ${i * 35}ms, y .8s cubic-bezier(.16,1,.3,1) ${
                    i * 35
                  }ms, opacity .15s, fill .15s`,
                  pointerEvents: 'none',
                }}
              />
              {(isHover || isTodayBar) && (
                <text
                  x={x + (barW - 8) / 2}
                  y={y - 6}
                  fontSize="11"
                  fill={isHover ? '#312E81' : '#4F46E5'}
                  textAnchor="middle"
                  fontWeight="700"
                  fontFamily="var(--mono)"
                  style={{ pointerEvents: 'none' }}
                >
                  {v}
                </text>
              )}
              {(i % labelStep === 0 || isTodayBar) && (
                <text
                  x={x + (barW - 8) / 2}
                  y={h - 10}
                  fontSize="10"
                  fill={isTodayBar ? '#4F46E5' : '#7B8AA0'}
                  textAnchor="middle"
                  fontWeight={isTodayBar ? 600 : 400}
                  style={{ pointerEvents: 'none' }}
                >
                  {dateFor(i).getDate()}/{dateFor(i).getMonth() + 1}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null &&
        (() => {
          const d = dateFor(hover);
          const v = data[hover];
          const diff = v - avg;
          const leftPct = ((pad.l + hover * barW + barW / 2) / w) * 100;
          const yr = d.getFullYear();
          return (
            <div className="chart-tip" style={{ left: `${leftPct}%` }}>
              <div className="chart-tip-date">
                {d.getDate()} {months[d.getMonth()]} {yr}
              </div>
              <div className="chart-tip-row">
                <span className="dot" style={{ background: '#4F46E5' }}></span>
                <span>จำนวนเบิก</span>
                <b className="mono">{v} ขวด</b>
              </div>
              <div className="chart-tip-row muted">
                <span style={{ width: 10 }}></span>
                <span>{diff >= 0 ? 'มากกว่า' : 'น้อยกว่า'}เฉลี่ย</span>
                <b className="mono" style={{ color: diff >= 0 ? 'var(--danger)' : 'var(--success)' }}>
                  {diff >= 0 ? '+' : ''}
                  {diff.toFixed(1)}
                </b>
              </div>
            </div>
          );
        })()}
    </div>
  );
}


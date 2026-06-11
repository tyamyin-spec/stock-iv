// Value / pricing page — live prices, computed off real stock.
// Two layouts (A: matrix-first, B: ward-cards-first) toggled from the Tweaks panel.

import { useMemo, useState } from 'react';
import { Icons } from '../icons';
import { Button, Card, useToast } from '../ui';
import { fmtBaht, fmtBaht2, fmtNum, useFluids, usePrices, useStock, useWards } from '../lib/data';
import type { FluidType, Ward } from '../lib/db.types';

export function ValuePage({ layout = 'a' }: { layout?: 'a' | 'b' }) {
  const I = Icons;
  const toast = useToast();
  const { priceMap, setOne: setPrice, reset: resetPrices } = usePrices();
  const { stock } = useStock();
  const { wards } = useWards();
  const { fluids } = useFluids();
  const [preview, setPreview] = useState(false);
  const [matrixMode, setMatrixMode] = useState<'value' | 'qty'>('value');

  // Total bottles by ward × fluid based on real stock (or empty for preview-off).
  const realQty = useMemo(() => {
    const m: Record<string, Record<string, number>> = {};
    stock.forEach((s) => {
      m[s.ward_id] = m[s.ward_id] || {};
      m[s.ward_id][s.fluid_code] = (m[s.ward_id][s.fluid_code] || 0) + s.qty;
    });
    return m;
  }, [stock]);

  // Preview mode populates pretend numbers so the matrix isn't blank when stock = [].
  const previewQty = useMemo<Record<string, Record<string, number>>>(() => {
    const seedTotals: Record<string, Record<string, number>> = {
      'semi-sx': { NSS1000: 120, RL1000: 80, D5W1000: 60, 'D5N2-1000': 30, NSS500: 40 },
      'surg-male': { NSS1000: 90, RL1000: 70, D5W1000: 45, 'D5N2-1000': 25, NSS500: 35 },
      'surg-female': { NSS1000: 85, RL1000: 65, D5W1000: 40, 'D5N2-1000': 20, NSS500: 30 },
      icu: { NSS1000: 60, RL1000: 50, D5W1000: 70, 'D5N2-1000': 40, NSS500: 25 },
      er: { NSS1000: 150, RL1000: 110, D5W1000: 50, 'D5N2-1000': 20, NSS500: 60 },
    };
    return seedTotals;
  }, []);

  const qtyOf = (wardCode: string, fluidCode: string) => {
    if (preview) return previewQty[wardCode]?.[fluidCode] ?? 0;
    const ward = wards.find((w) => w.code === wardCode);
    if (!ward) return 0;
    return realQty[ward.id]?.[fluidCode] ?? 0;
  };

  const visibleFluids = useMemo(() => {
    // Show only the catalog rows that actually have stock somewhere (or all in preview).
    if (preview) return fluids.slice(0, 7);
    const used = new Set(stock.map((s) => s.fluid_code));
    const have = fluids.filter((f) => used.has(f.code));
    return have.length > 0 ? have : fluids.slice(0, 7);
  }, [fluids, stock, preview]);

  const data = useMemo(() => {
    const wardAgg: WardAgg[] = wards.map((w) => {
      const breakdown = visibleFluids.map((t) => {
        const q = qtyOf(w.code, t.code);
        return { code: t.code, name: t.name, qty: q, value: q * (priceMap[t.code] ?? 0) };
      });
      const value = breakdown.reduce((s, b) => s + b.value, 0);
      const qty = breakdown.reduce((s, b) => s + b.qty, 0);
      const top = [...breakdown].sort((a, b) => b.value - a.value)[0];
      return { id: w.id, code: w.code, name: w.name, color: w.color, value, qty, breakdown, top };
    });
    const typeAgg: TypeAgg[] = visibleFluids.map((t) => {
      let qty = 0;
      wards.forEach((w) => {
        qty += qtyOf(w.code, t.code);
      });
      return { ...t, unitPrice: priceMap[t.code] ?? 0, qty, value: qty * (priceMap[t.code] ?? 0) };
    });
    const grandValue = wardAgg.reduce((s, w) => s + w.value, 0);
    const grandQty = wardAgg.reduce((s, w) => s + w.qty, 0);
    return { wardAgg, typeAgg, grandValue, grandQty };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wards, visibleFluids, priceMap, preview, realQty]);

  const topWard = [...data.wardAgg].sort((a, b) => b.value - a.value)[0];
  const topType = [...data.typeAgg].sort((a, b) => b.value - a.value)[0];
  const avgPerBottle = data.grandQty ? data.grandValue / data.grandQty : 0;
  const hasData = data.grandValue > 0;

  const exportToast = () =>
    toast({
      tone: 'success',
      title: 'กำลังสร้างไฟล์มูลค่าคงคลัง...',
      desc: `มูลค่ารวม ${fmtBaht(data.grandValue)} · ${wards.length} วอร์ด`,
    });

  const pageHead = (
    <div className="page-head">
      <div>
        <span className="muted">คลังสารน้ำ</span>
        <h1>ราคา &amp; มูลค่าสต็อก</h1>
        <p>ราคาต่อหน่วยของสารน้ำแต่ละชนิด และมูลค่าคงคลังที่แต่ละวอร์ดถือครอง</p>
      </div>
      <div className="row row-gap-sm">
        <div className="seg-preview" role="group" aria-label="แหล่งข้อมูล">
          <button className={!preview ? 'is-on' : ''} onClick={() => setPreview(false)}>
            สต็อกจริง
          </button>
          <button className={preview ? 'is-on' : ''} onClick={() => setPreview(true)}>
            ข้อมูลตัวอย่าง
          </button>
        </div>
        <Button variant="secondary" icon={<I.Download size={18} />} onClick={exportToast}>
          Export
        </Button>
      </div>
    </div>
  );

  const previewBanner = preview ? (
    <div className="val-note val-note-info">
      <I.Info size={16} />
      <span>
        <b>กำลังแสดงข้อมูลตัวอย่าง (พรีวิว)</b> เพื่อให้เห็นการคำนวณมูลค่า — สลับเป็น “สต็อกจริง” เพื่อดูสถานะจริง
      </span>
    </div>
  ) : !hasData ? (
    <div className="val-note val-note-empty">
      <I.Box size={16} />
      <span>
        <b>ยังไม่มีสต็อกในระบบ</b> มูลค่าทุกวอร์ดเป็น ฿0 — เพิ่มสารน้ำเข้าคลังหรือสลับเป็น “ข้อมูลตัวอย่าง”
      </span>
    </div>
  ) : null;

  const sharedProps: LayoutProps = {
    data,
    topWard,
    topType,
    avgPerBottle,
    priceMap,
    setPrice,
    resetPrices: async () => {
      await resetPrices();
      toast({ tone: 'info', title: 'รีเซ็ตราคากลับเป็นค่าเริ่มต้น' });
    },
    matrixMode,
    setMatrixMode,
    wards: data.wardAgg,
    types: data.typeAgg,
  };

  return (
    <div className="val-root">
      {pageHead}
      {previewBanner}
      {layout === 'b' ? <LayoutB {...sharedProps} /> : <LayoutA {...sharedProps} />}
      <div className="dash-footnote">
        <I.Info size={16} />
        <span>
          <b>การคำนวณ:</b> มูลค่า = จำนวนคงเหลือ × ราคาต่อหน่วย · แก้ไขราคาในตาราง “ราคาต่อหน่วย” แล้วมูลค่าจะอัปเดตทันที
        </span>
      </div>
    </div>
  );
}

// ── shared types ──────────────────────────────────────────────────────────
type WardAgg = {
  id: string;
  code: string;
  name: string;
  color: string;
  value: number;
  qty: number;
  breakdown: { code: string; name: string; qty: number; value: number }[];
  top: { code: string; name: string; qty: number; value: number } | undefined;
};
type TypeAgg = FluidType & { unitPrice: number; qty: number; value: number };
type AggData = { wardAgg: WardAgg[]; typeAgg: TypeAgg[]; grandValue: number; grandQty: number };

type LayoutProps = {
  data: AggData;
  topWard?: WardAgg;
  topType?: TypeAgg;
  avgPerBottle: number;
  priceMap: Record<string, number>;
  setPrice: (code: string, price: number) => Promise<void>;
  resetPrices: () => Promise<void>;
  matrixMode: 'value' | 'qty';
  setMatrixMode: (m: 'value' | 'qty') => void;
  wards: WardAgg[];
  types: TypeAgg[];
};

// ── KPI cards ─────────────────────────────────────────────────────────────
function ValueKpis({
  data,
  topWard,
  topType,
  avgPerBottle,
}: {
  data: AggData;
  topWard?: WardAgg;
  topType?: TypeAgg;
  avgPerBottle: number;
}) {
  const I = Icons;
  return (
    <div className="val-kpi-grid">
      <div className="kpi-hero kpi-hero-primary is-highlight is-in" style={{ minHeight: 0 }}>
        <div className="kpi-hero-icon">
          <I.Wallet size={28} />
        </div>
        <div className="kpi-hero-content">
          <div className="kpi-hero-label">มูลค่าคงคลังรวมทั้งหมด</div>
          <div className="kpi-hero-stack">
            <span className="kpi-hero-value mono">{fmtBaht(data.grandValue)}</span>
          </div>
          <div className="kpi-hero-foot">
            <span className="muted">
              {fmtNum(data.grandQty)} ขวด · {data.wardAgg.length} วอร์ด
            </span>
          </div>
        </div>
      </div>

      <div className="kpi kpi-info">
        <div className="kpi-icon">
          <I.Building size={22} />
        </div>
        <div className="kpi-body">
          <div className="kpi-label">วอร์ดมูลค่าสูงสุด</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {fmtBaht(topWard?.value || 0)}
          </div>
          <div className="kpi-foot">
            <span className="dot-sm" style={{ background: topWard?.color }}></span>
            {topWard?.name ?? '—'}
          </div>
        </div>
      </div>

      <div className="kpi kpi-success">
        <div className="kpi-icon">
          <I.Flask size={22} />
        </div>
        <div className="kpi-body">
          <div className="kpi-label">ชนิดมูลค่าสูงสุด</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {fmtBaht(topType?.value || 0)}
          </div>
          <div className="kpi-foot">{topType?.name ?? '—'}</div>
        </div>
      </div>

      <div className="kpi">
        <div className="kpi-icon">
          <I.Coins size={22} />
        </div>
        <div className="kpi-body">
          <div className="kpi-label">มูลค่าเฉลี่ยต่อขวด</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {fmtBaht2(avgPerBottle)}
          </div>
          <div className="kpi-foot">ถัวเฉลี่ยถ่วงน้ำหนัก</div>
        </div>
      </div>
    </div>
  );
}

// ── Editable price table ─────────────────────────────────────────────────
function PriceTable({
  types,
  priceMap,
  setPrice,
  resetPrices,
  compact,
}: {
  types: TypeAgg[];
  priceMap: Record<string, number>;
  setPrice: (code: string, price: number) => Promise<void>;
  resetPrices: () => Promise<void>;
  compact?: boolean;
}) {
  const I = Icons;
  return (
    <Card padding={false} className="val-card">
      <div className="val-card-head">
        <div>
          <h3 className="dash-chart-title">
            <I.Tag size={17} /> ราคาต่อหน่วย
          </h3>
          <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>
            แก้ไขได้ · บาท/ขวด
          </p>
        </div>
        <Button variant="ghost" size="sm" icon={<I.Refresh size={14} />} onClick={resetPrices}>
          คืนค่า
        </Button>
      </div>
      <div className="table-wrap">
        <table className="table val-price-table">
          <thead>
            <tr>
              <th>ชนิดสารน้ำ</th>
              {!compact && <th>รายละเอียด</th>}
              <th className="num">ราคา/ขวด</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t) => (
              <tr key={t.code}>
                <td>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div className="muted col-code" style={{ fontSize: 11 }}>
                    {t.code}
                  </div>
                </td>
                {!compact && (
                  <td className="muted" style={{ fontSize: 12.5 }}>
                    {t.full_name}
                  </td>
                )}
                <td className="num">
                  <div className="price-input-wrap">
                    <span className="price-baht">฿</span>
                    <input
                      className="price-input mono"
                      type="number"
                      min="0"
                      step="0.5"
                      value={priceMap[t.code] ?? 0}
                      onChange={(e) => setPrice(t.code, e.target.value === '' ? 0 : +e.target.value)}
                      aria-label={`ราคา ${t.name}`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ── Value matrix ─────────────────────────────────────────────────────────
function ValueMatrix({
  wards,
  types,
  mode,
  setMode,
}: {
  wards: WardAgg[];
  types: TypeAgg[];
  mode: 'value' | 'qty';
  setMode: (m: 'value' | 'qty') => void;
}) {
  const I = Icons;
  const cell = (q: number, val: number) => (mode === 'qty' ? fmtNum(q) : fmtBaht(val));
  const grandQty = wards.reduce((s, w) => s + w.qty, 0);
  const grandValue = wards.reduce((s, w) => s + w.value, 0);
  return (
    <Card padding={false} className="val-card val-matrix-card">
      <div className="val-card-head">
        <div>
          <h3 className="dash-chart-title">
            <I.Box size={17} /> มูลค่าแยกตามชนิด × วอร์ด
          </h3>
          <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>
            {mode === 'qty' ? 'จำนวนคงเหลือ (ขวด)' : 'มูลค่าคงคลัง (บาท)'} ในแต่ละวอร์ด
          </p>
        </div>
        <div className="segmented">
          <button aria-pressed={mode === 'value'} onClick={() => setMode('value')}>
            มูลค่า ฿
          </button>
          <button aria-pressed={mode === 'qty'} onClick={() => setMode('qty')}>
            จำนวน
          </button>
        </div>
      </div>
      <div className="table-wrap">
        <table className="table val-matrix">
          <thead>
            <tr>
              <th className="sticky-col">ชนิดสารน้ำ</th>
              <th className="num">ราคา/ขวด</th>
              {wards.map((w) => (
                <th key={w.id} className="num">
                  <span className="mx-ward">
                    <span className="dot-sm" style={{ background: w.color }}></span>
                    {w.name}
                  </span>
                </th>
              ))}
              <th className="num mx-total-col">รวมทั้งชนิด</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t) => (
              <tr key={t.code}>
                <td className="sticky-col">
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div className="muted col-code" style={{ fontSize: 11 }}>
                    {t.code}
                  </div>
                </td>
                <td className="num mono muted">{fmtBaht(t.unitPrice)}</td>
                {wards.map((w) => {
                  const b = w.breakdown.find((x) => x.code === t.code);
                  const empty = !b || b.qty === 0;
                  return (
                    <td key={w.id} className={`num ${empty ? 'mx-empty' : ''}`}>
                      <span className="mono">{empty ? '–' : cell(b!.qty, b!.value)}</span>
                      {!empty && mode === 'value' && <div className="mx-sub muted">{fmtNum(b!.qty)} ขวด</div>}
                    </td>
                  );
                })}
                <td className="num mx-total-col">
                  <span className="mono" style={{ fontWeight: 700 }}>
                    {cell(t.qty, t.value)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="sticky-col" style={{ fontWeight: 700 }}>
                รวมทั้งวอร์ด
              </td>
              <td></td>
              {wards.map((w) => (
                <td key={w.id} className="num">
                  <span className="mono" style={{ fontWeight: 700 }}>
                    {cell(w.qty, w.value)}
                  </span>
                </td>
              ))}
              <td className="num mx-grand">
                <span className="mono">{mode === 'qty' ? fmtNum(grandQty) : fmtBaht(grandValue)}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}

function WardBars({ wards }: { wards: WardAgg[] }) {
  const sorted = [...wards].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((w) => w.value), 1);
  const grand = wards.reduce((s, w) => s + w.value, 0) || 1;
  return (
    <div className="val-bars">
      {sorted.map((w) => (
        <div className="val-bar-row" key={w.id}>
          <div className="val-bar-label">
            <span className="dot-sm" style={{ background: w.color }}></span>
            {w.name}
          </div>
          <div className="val-bar-track">
            <div className="val-bar-fill" style={{ width: `${(w.value / max) * 100}%`, background: w.color }}></div>
          </div>
          <div className="val-bar-amt">
            <span className="mono">{fmtBaht(w.value)}</span>
            <span className="muted"> · {((w.value / grand) * 100).toFixed(0)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WardCard({ ward, grand }: { ward: WardAgg; grand: number }) {
  const I = Icons;
  const share = grand ? (ward.value / grand) * 100 : 0;
  return (
    <div className="ward-card">
      <div className="ward-card-head">
        <div className="ward-card-name">
          <span className="ward-dot" style={{ background: ward.color }}></span>
          {ward.name}
        </div>
        <span className="ward-share">{share.toFixed(0)}%</span>
      </div>
      <div className="ward-card-value mono">{fmtBaht(ward.value)}</div>
      <div className="ward-card-sub muted">
        {fmtNum(ward.qty)} ขวด · {ward.breakdown.filter((b) => b.qty > 0).length} ชนิด
      </div>
      <div className="ward-share-track">
        <div className="ward-share-fill" style={{ width: `${share}%`, background: ward.color }}></div>
      </div>
      <div className="ward-card-foot">
        <span className="muted">มูลค่าสูงสุด</span>
        <span className="ward-top">
          {ward.top && ward.top.qty > 0 ? (
            <>
              <I.Flask size={13} /> {ward.top.name}
            </>
          ) : (
            '—'
          )}
        </span>
      </div>
    </div>
  );
}

function LayoutA(p: LayoutProps) {
  const I = Icons;
  return (
    <div className="val-stack">
      <ValueKpis data={p.data} topWard={p.topWard} topType={p.topType} avgPerBottle={p.avgPerBottle} />

      <section className="val-section">
        <div className="val-section-head">
          <h3 className="dash-chart-title">
            <I.Building size={17} /> มูลค่าคงคลังแยกตามวอร์ด
          </h3>
          <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>
            สัดส่วนมูลค่าและชนิดที่มีมูลค่าสูงสุดของแต่ละวอร์ด
          </p>
        </div>
        <div className="ward-card-grid">
          {[...p.wards]
            .sort((a, b) => b.value - a.value)
            .map((w) => (
              <WardCard key={w.id} ward={w} grand={p.data.grandValue} />
            ))}
        </div>
      </section>

      <ValueMatrix wards={p.wards} types={p.types} mode={p.matrixMode} setMode={p.setMatrixMode} />

      <div className="val-grid-2">
        <Card className="val-card">
          <div className="val-card-head" style={{ padding: 0, border: 0, marginBottom: 14 }}>
            <div>
              <h3 className="dash-chart-title">
                <I.Chart size={17} /> เปรียบเทียบมูลค่าระหว่างวอร์ด
              </h3>
              <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>
                เรียงจากมูลค่าสูงสุด
              </p>
            </div>
          </div>
          <WardBars wards={p.wards} />
        </Card>
        <PriceTable types={p.types} priceMap={p.priceMap} setPrice={p.setPrice} resetPrices={p.resetPrices} compact />
      </div>
    </div>
  );
}

function LayoutB(p: LayoutProps) {
  const I = Icons;
  return (
    <div className="val-stack">
      <ValueKpis data={p.data} topWard={p.topWard} topType={p.topType} avgPerBottle={p.avgPerBottle} />
      <div className="val-card-head" style={{ padding: 0, border: 0, marginBottom: -4 }}>
        <h3 className="dash-chart-title">
          <I.Building size={17} /> มูลค่าคงคลังแยกตามวอร์ด
        </h3>
      </div>
      <div className="ward-card-grid">
        {p.wards.map((w) => (
          <WardCard key={w.id} ward={w} grand={p.data.grandValue} />
        ))}
      </div>
      <div className="val-grid-2">
        <Card className="val-card">
          <div className="val-card-head" style={{ padding: 0, border: 0, marginBottom: 14 }}>
            <div>
              <h3 className="dash-chart-title">
                <I.Chart size={17} /> เปรียบเทียบมูลค่าระหว่างวอร์ด
              </h3>
              <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>
                เรียงจากมูลค่าสูงสุด
              </p>
            </div>
          </div>
          <WardBars wards={p.wards} />
        </Card>
        <PriceTable types={p.types} priceMap={p.priceMap} setPrice={p.setPrice} resetPrices={p.resetPrices} compact />
      </div>
      <ValueMatrix wards={p.wards} types={p.types} mode={p.matrixMode} setMode={p.setMatrixMode} />
    </div>
  );
}

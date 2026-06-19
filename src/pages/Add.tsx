// Add data page — multi-step with fluid picker + barcode scanner.
// Persists stock + a corresponding movement.

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Icons } from '../icons';
import { Badge, Button, Card, Field, Input, Modal, Select, useToast } from '../ui';
import {
  FLUID_CATS,
  formatThaiDate,
  useFluids,
  useMovements,
  useStock,
  useWards,
  type FluidCategory,
} from '../lib/data';
import { decodeStockId } from '../lib/labels';
import type { FluidType, StockRow } from '../lib/db.types';

function FluidLabel({ fluid, size = 'md' }: { fluid: FluidType | null; size?: 'md' | 'lg' }) {
  if (!fluid) return null;
  const color = FLUID_CATS[fluid.category]?.color || '#1E6FEB';
  return (
    <div className={`fluid-label fluid-label--${size}`} style={{ ['--cat' as any]: color } as CSSProperties}>
      <div className="fluid-label-cap"></div>
      <div className="fluid-label-band">
        <span className="fluid-label-tag">{fluid.tag}</span>
      </div>
      <div className="fluid-label-body">
        <span className="fluid-label-size">{fluid.size_ml}</span>
        <span className="fluid-label-ml">ml</span>
      </div>
    </div>
  );
}

function FluidPicker({
  value,
  fluids,
  onPick,
}: {
  value: string;
  fluids: FluidType[];
  onPick: (f: FluidType) => void;
}) {
  const I = Icons;
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'all' | FluidCategory>('all');
  const list = fluids.filter((f) => {
    if (cat !== 'all' && f.category !== cat) return false;
    if (!q.trim()) return true;
    const s = (f.code + ' ' + f.name + ' ' + (f.full_name ?? '') + ' ' + f.tag).toLowerCase();
    return s.includes(q.trim().toLowerCase());
  });
  return (
    <div className="fluid-picker">
      <div className="fluid-picker-controls">
        <div className="fluid-search">
          <I.Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชนิดสารน้ำ เช่น NSS, D5W, 1000…"
          />
          {q && (
            <button className="fluid-search-clear" onClick={() => setQ('')} aria-label="ล้าง">
              <I.Close size={14} />
            </button>
          )}
        </div>
        <div className="fluid-cat-chips">
          <button className={`fluid-chip ${cat === 'all' ? 'is-on' : ''}`} onClick={() => setCat('all')}>
            ทั้งหมด
          </button>
          {Object.entries(FLUID_CATS).map(([k, c]) => (
            <button
              key={k}
              className={`fluid-chip ${cat === k ? 'is-on' : ''}`}
              onClick={() => setCat(k as FluidCategory)}
              style={{ ['--cat' as any]: c.color } as CSSProperties}
            >
              <span className="fluid-chip-dot"></span>
              {c.label.replace(/\s*\(.*\)/, '')}
            </button>
          ))}
        </div>
      </div>
      {list.length === 0 ? (
        <div className="fluid-empty">ไม่พบชนิดสารน้ำที่ค้นหา</div>
      ) : (
        <div className="fluid-grid">
          {list.map((f) => (
            <button
              key={f.code}
              type="button"
              className={`fluid-card ${value === f.code ? 'is-selected' : ''}`}
              onClick={() => onPick(f)}
            >
              <FluidLabel fluid={f} />
              <div className="fluid-card-info">
                <div className="fluid-card-name">{f.name}</div>
                <div className="fluid-card-meta">
                  <span className="fluid-card-code mono">{f.code}</span>
                  <span className="fluid-card-mm">
                    ขั้นต่ำ {f.default_min} · สูงสุด {f.default_max}
                  </span>
                </div>
              </div>
              {value === f.code && (
                <span className="fluid-card-check">
                  <I.Check size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExpiryPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const THAI_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const parts = (value || '').split('-');
  const y = parts[0] || '';
  const m = parts[1] ? String(Number(parts[1])) : '';
  const d = parts[2] ? String(Number(parts[2])) : '';
  const pad = (n: number | string) => String(n).padStart(2, '0');
  const emit = (nd: string, nm: string, ny: string) =>
    onChange(`${ny || ''}-${nm ? pad(nm) : ''}-${nd ? pad(nd) : ''}`);
  const nDays = m ? new Date(y ? Number(y) - 543 : 2024, Number(m), 0).getDate() : 31;
  const thisBE = new Date().getFullYear() + 543;
  const years: number[] = [];
  for (let i = -1; i <= 6; i++) years.push(thisBE + i);
  return (
    <div className="picker-3">
      <Select value={d} onChange={(e) => emit(e.target.value, m, y)} aria-label="วันที่">
        <option value="">วัน</option>
        {Array.from({ length: nDays }, (_, i) => i + 1).map((dd) => (
          <option key={dd} value={dd}>
            {dd}
          </option>
        ))}
      </Select>
      <Select value={m} onChange={(e) => emit(d, e.target.value, y)} aria-label="เดือน">
        <option value="">เดือน</option>
        {THAI_MONTHS.map((mn, i) => (
          <option key={i} value={i + 1}>
            {mn}
          </option>
        ))}
      </Select>
      <Select value={y} onChange={(e) => emit(d, m, e.target.value)} aria-label="ปี พ.ศ.">
        <option value="">ปี พ.ศ.</option>
        {years.map((yy) => (
          <option key={yy} value={yy}>
            {yy}
          </option>
        ))}
      </Select>
    </div>
  );
}

// Validate a "พ.ศ.-MM-DD" string. We store the BE form directly in `expiry`
// (Postgres `date` happily accepts any valid YYYY-MM-DD); display helpers
// assume BE input throughout the app.
function isValidBeDate(be: string): boolean {
  const [y, m, d] = be.split('-').map(Number);
  return Boolean(y && m && d && m >= 1 && m <= 12 && d >= 1 && d <= 31);
}

export function AddPage({
  onDone,
  prefillBarcode,
  onOpenScan,
}: {
  onDone: () => void;
  prefillBarcode: string | null;
  onOpenScan: () => void;
}) {
  const I = Icons;
  const toast = useToast();
  const { fluids } = useFluids();
  const { wards } = useWards();
  const { stock, create: createStock, adjustQty } = useStock();
  const { create: createMovement } = useMovements();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'in' | 'out' | 'new'>('in');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    barcode: prefillBarcode || '',
    code: '',
    lot: '',
    exp: '',
    qty: 1,
    ward: '',
    min: 30,
    max: 120,
    note: '',
  });
  const upd = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const selFluid = useMemo(() => fluids.find((f) => f.code === form.code) || null, [fluids, form.code]);

  const pickFluid = (f: FluidType) =>
    setForm((prev) => ({ ...prev, code: f.code, min: f.default_min, max: f.default_max }));

  // Default the ward to the first available one (or any user-pinned ward).
  useEffect(() => {
    if (!form.ward && wards.length > 0) {
      setForm((f) => ({ ...f, ward: wards[0].id }));
    }
  }, [wards, form.ward]);

  // Match a scanned code against an existing stock row to pre-fill. Two cases:
  //  1. Our printed label "IV:<id>" → find that exact lot.
  //  2. A manufacturer/own barcode stored on a stock row's `barcode` field.
  useEffect(() => {
    if (!prefillBarcode) return;
    const internalId = decodeStockId(prefillBarcode);
    const found = internalId
      ? stock.find((x) => x.id === internalId)
      : stock.find((x) => x.barcode === prefillBarcode);
    setForm((f) => ({ ...f, barcode: found?.barcode ?? (internalId ? '' : prefillBarcode) }));
    if (found) {
      setForm((f) => ({
        ...f,
        code: found.fluid_code,
        lot: found.lot,
        exp: found.expiry,
        ward: found.ward_id,
        min: found.min_qty,
        max: found.max_qty,
      }));
      setStep(1);
    }
  }, [prefillBarcode, stock]);

  const handleSubmit = async () => {
    if (!selFluid || !form.ward || !form.lot || !form.exp) {
      toast({ tone: 'danger', title: 'กรอกข้อมูลไม่ครบ', desc: 'ตรวจสอบชนิด, lot, วันหมดอายุ, วอร์ด' });
      return;
    }
    if (!isValidBeDate(form.exp)) {
      toast({ tone: 'danger', title: 'วันหมดอายุไม่ถูกต้อง' });
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'out') {
        // Try to find the matching existing stock row by ward + fluid + lot.
        const target = stock.find(
          (s) => s.ward_id === form.ward && s.fluid_code === form.code && s.lot === form.lot,
        );
        if (!target) {
          toast({ tone: 'danger', title: 'ไม่พบ Lot นี้ในวอร์ด', desc: 'ต้องมีในคลังก่อนถึงจะเบิกออกได้' });
          setSubmitting(false);
          return;
        }
        if (target.qty < form.qty) {
          toast({ tone: 'warning', title: 'จำนวนคงเหลือไม่พอ', desc: `เหลือ ${target.qty} ขวด` });
          setSubmitting(false);
          return;
        }
        await adjustQty(target.id, -form.qty);
        await createMovement({
          stock_id: target.id,
          fluid_code: form.code,
          ward_id: form.ward,
          kind: 'out',
          qty: -form.qty,
          note: form.note || null,
        });
        toast({ tone: 'success', title: 'บันทึกเบิกออก', desc: `${selFluid.name} ${form.qty} ขวด` });
      } else {
        // 'in' or 'new' — both end up as a new stock row (or top up an existing
        // matching lot in the same ward).
        const existing = stock.find(
          (s) => s.ward_id === form.ward && s.fluid_code === form.code && s.lot === form.lot,
        );
        let stockId: string;
        if (existing && mode === 'in') {
          await adjustQty(existing.id, form.qty);
          stockId = existing.id;
        } else {
          const displayCode = nextDisplayCode(stock);
          const newRow = await createStock({
            display_code: displayCode,
            fluid_code: form.code,
            ward_id: form.ward,
            lot: form.lot,
            expiry: form.exp,
            qty: form.qty,
            min_qty: form.min,
            max_qty: form.max,
            barcode: form.barcode || null,
            note: form.note || null,
          });
          stockId = newRow.id;
        }
        await createMovement({
          stock_id: stockId,
          fluid_code: form.code,
          ward_id: form.ward,
          kind: 'in',
          qty: form.qty,
          note: form.note || null,
        });
        toast({
          tone: 'success',
          title: `บันทึก${mode === 'in' ? 'รับเข้า' : 'เพิ่มรายการใหม่'}สำเร็จ`,
          desc: `${selFluid.name} จำนวน ${form.qty} ขวด`,
        });
      }
      onDone?.();
    } catch (e: any) {
      toast({ tone: 'danger', title: 'บันทึกไม่สำเร็จ', desc: e?.message ?? 'unknown' });
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'เลือกวิธีการ' },
    { num: 2, label: 'กรอกข้อมูล' },
    { num: 3, label: 'ยืนยัน' },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">เพิ่ม/ลงข้อมูล</span>
          <h1>เพิ่มข้อมูลสารน้ำ</h1>
          <p>เลือกวิธีการ → กรอกข้อมูล → ยืนยัน บันทึก</p>
        </div>
      </div>

      <Card padding={false}>
        <div className="stepper">
          {steps.map((s, i) => (
            <div key={s.num} className="step" data-state={i < step ? 'done' : i === step ? 'current' : 'next'}>
              <div className="num">{i < step ? <I.Check size={14} /> : s.num}</div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {step === 0 && (
            <div className="col" style={{ gap: 24 }}>
              <div>
                <h3 style={{ marginBottom: 6 }}>เลือกประเภทรายการ</h3>
                <p className="muted">เลือกว่าจะรับเข้า, เบิกออก, หรือเพิ่มสารน้ำใหม่ที่ยังไม่เคยมีในระบบ</p>
              </div>

              <div className="grid-12" style={{ gap: 12 }}>
                {[
                  { id: 'in' as const, title: 'รับเข้าคลัง', desc: 'เพิ่มสต็อกจากคลังกลาง หรือบริษัทผู้ผลิต', icon: <I.ArrowDown size={22} /> },
                  { id: 'out' as const, title: 'เบิกออก', desc: 'เบิกใช้กับผู้ป่วย หรือย้ายไปวอร์ดอื่น', icon: <I.ArrowUp size={22} /> },
                  { id: 'new' as const, title: 'เพิ่มรายการใหม่', desc: 'สารน้ำชนิดใหม่ที่ยังไม่เคยมีในคลัง', icon: <I.Plus size={22} /> },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setMode(c.id)}
                    className="report-card"
                    style={{
                      gridColumn: 'span 4',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderColor: mode === c.id ? 'var(--brand-400)' : undefined,
                      background: mode === c.id ? 'var(--brand-50)' : undefined,
                      boxShadow: mode === c.id ? '0 0 0 2px rgba(30,111,235,.18)' : undefined,
                    }}
                  >
                    <div
                      className={`mvt-pill mvt-${c.id === 'in' ? 'in' : c.id === 'out' ? 'out' : 'adj'}`}
                      style={{ width: 40, height: 40 }}
                    >
                      {c.icon}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{c.title}</div>
                    <div className="muted" style={{ fontSize: 12.5 }}>
                      {c.desc}
                    </div>
                  </button>
                ))}
              </div>

              <div className="divider"></div>

              <div className="col" style={{ gap: 14 }}>
                <h4>วิธีระบุสารน้ำ</h4>
                <div className="grid-12" style={{ gap: 12 }}>
                  <div style={{ gridColumn: 'span 6' }}>
                    <button
                      onClick={onOpenScan}
                      className="report-card"
                      style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div className="report-icon">
                        <I.Scan size={22} />
                      </div>
                      <div style={{ fontWeight: 600 }}>สแกน Barcode</div>
                      <div className="muted" style={{ fontSize: 12.5 }}>
                        ใช้กล้องสแกน หรือเครื่องสแกนเนอร์ — เร็วและไม่ผิดพลาด
                      </div>
                      <div className="row" style={{ marginTop: 8 }}>
                        <Badge tone="success" icon={<I.Check size={12} />}>
                          แนะนำ
                        </Badge>
                      </div>
                    </button>
                  </div>
                  <div style={{ gridColumn: 'span 6' }}>
                    <div className="report-card" style={{ background: 'var(--surface-2)' }}>
                      <div className="report-icon" style={{ background: 'var(--surface)' }}>
                        <I.Edit size={22} />
                      </div>
                      <div style={{ fontWeight: 600 }}>กรอกด้วยตนเอง</div>
                      <div className="muted" style={{ fontSize: 12.5 }}>
                        กรอกรหัส, ชื่อสารน้ำ, Lot, วันหมดอายุ ทีละช่อง
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        style={{ alignSelf: 'flex-start', marginTop: 8 }}
                        onClick={() => setStep(1)}
                      >
                        เริ่มกรอก
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="col" style={{ gap: 20 }}>
              <div>
                <h3 style={{ marginBottom: 6 }}>กรอกข้อมูลสารน้ำ</h3>
                <p className="muted">
                  {mode === 'in' ? 'รับเข้าคลัง' : mode === 'out' ? 'เบิกออก' : 'เพิ่มรายการใหม่'}
                  {form.barcode && (
                    <>
                      {' '}
                      · barcode <span className="mono">{form.barcode}</span>
                    </>
                  )}
                </p>
              </div>

              {form.barcode && (
                <div className="barcode-strip">
                  <I.Barcode size={18} />
                  <span>{form.barcode}</span>
                  <Badge tone="success" icon={<I.Check size={12} />}>
                    สแกนแล้ว
                  </Badge>
                </div>
              )}

              <Field
                label="ชนิดสารน้ำ"
                required
                hint="แตะที่รูปสารน้ำเพื่อเลือก — ขั้นต่ำ/สูงสุดจะเติมให้อัตโนมัติ"
              >
                <FluidPicker value={form.code} fluids={fluids} onPick={pickFluid} />
              </Field>

              {selFluid && (
                <div className="fluid-selected">
                  <FluidLabel fluid={selFluid} size="lg" />
                  <div className="fluid-selected-info">
                    <div className="fluid-selected-name">{selFluid.name}</div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {selFluid.full_name}
                    </div>
                    <div className="fluid-selected-tags">
                      <span
                        className="cat-pill"
                        style={{ ['--cat' as any]: FLUID_CATS[selFluid.category]?.color } as CSSProperties}
                      >
                        <span className="cat-pill-dot"></span>
                        {FLUID_CATS[selFluid.category]?.label}
                      </span>
                      <span className="mono">{selFluid.code}</span>
                    </div>
                  </div>
                  <div className="fluid-selected-mm">
                    <div className="mm-box">
                      <span className="mm-k">ขั้นต่ำ</span>
                      <span className="mm-v mono">{form.min}</span>
                    </div>
                    <div className="mm-box">
                      <span className="mm-k">สูงสุด</span>
                      <span className="mm-v mono">{form.max}</span>
                    </div>
                    <span className="mm-auto">
                      <I.Check size={12} /> เติมอัตโนมัติ
                    </span>
                  </div>
                </div>
              )}

              <div className="grid-12" style={{ gap: 14 }}>
                <div style={{ gridColumn: 'span 4' }}>
                  <Field label="Lot Number" required>
                    <Input className="mono" value={form.lot} onChange={(e) => upd('lot', e.target.value)} placeholder="A001" />
                  </Field>
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <Field label="วันหมดอายุ (พ.ศ.)" required hint="เลือก วัน · เดือน · ปี พ.ศ.">
                    <ExpiryPicker value={form.exp} onChange={(v) => upd('exp', v)} />
                  </Field>
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <Field label="จำนวน (ขวด)" required>
                    <Input type="number" min={1} value={form.qty} onChange={(e) => upd('qty', +e.target.value)} />
                  </Field>
                </div>

                <div style={{ gridColumn: 'span 6' }}>
                  <Field label="วอร์ด/ที่เก็บ" required>
                    <Select value={form.ward} onChange={(e) => upd('ward', e.target.value)}>
                      {wards.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <Field label="ขั้นต่ำในคลัง" hint="แจ้งเตือนเมื่อต่ำกว่าค่านี้">
                    <Input type="number" value={form.min} onChange={(e) => upd('min', +e.target.value)} />
                  </Field>
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <Field label="สูงสุดในคลัง" hint="เพดานการสำรอง">
                    <Input type="number" value={form.max} onChange={(e) => upd('max', +e.target.value)} />
                  </Field>
                </div>

                <div style={{ gridColumn: 'span 12' }}>
                  <Field label="หมายเหตุ" hint="ไม่บังคับ">
                    <textarea
                      className="input"
                      rows={3}
                      value={form.note}
                      onChange={(e) => upd('note', e.target.value)}
                      placeholder="เช่น รับจากคลังกลาง รอบเช้า"
                    ></textarea>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="col" style={{ gap: 20 }}>
              <div>
                <h3 style={{ marginBottom: 6 }}>ตรวจสอบและยืนยัน</h3>
                <p className="muted">โปรดตรวจสอบความถูกต้องก่อนบันทึก</p>
              </div>

              <div
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-md)',
                  padding: 20,
                }}
              >
                <div className="row" style={{ marginBottom: 14, gap: 14 }}>
                  {selFluid ? (
                    <FluidLabel fluid={selFluid} size="lg" />
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        background: '#fff',
                        border: '1px solid var(--line)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--brand-600)',
                      }}
                    >
                      <I.Flask size={28} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3>{selFluid?.name ?? '—'}</h3>
                    <div className="muted">
                      ประเภท: {mode === 'in' ? 'รับเข้าคลัง' : mode === 'out' ? 'เบิกออก' : 'เพิ่มรายการใหม่'}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: mode === 'in' ? 'var(--success)' : mode === 'out' ? 'var(--text-1)' : 'var(--brand-600)',
                    }}
                    className="mono"
                  >
                    {mode === 'in' ? '+' : mode === 'out' ? '−' : ''}
                    {form.qty}
                  </div>
                </div>
                <div className="divider"></div>
                <div className="grid-12" style={{ gap: 14, fontSize: 13.5 }}>
                  <Detail span="span 4" label="ชนิด" value={form.code || '—'} mono />
                  <Detail span="span 4" label="Lot" value={form.lot || '—'} mono />
                  <Detail span="span 4" label="วันหมดอายุ" value={form.exp ? formatThaiDate(form.exp) : '—'} />
                  <Detail span="span 4" label="วอร์ด" value={wards.find((w) => w.id === form.ward)?.name ?? '—'} />
                  <Detail span="span 4" label="ขั้นต่ำ / สูงสุด" value={`${form.min} / ${form.max} ขวด`} />
                  <Detail span="span 4" label="Barcode" value={form.barcode || '—'} mono />
                  {form.note && <Detail span="span 12" label="หมายเหตุ" value={form.note} />}
                </div>
              </div>
            </div>
          )}
        </div>

        <footer
          style={{ padding: 16, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', gap: 8 }}
        >
          <Button variant="ghost" onClick={() => (step === 0 ? onDone?.() : setStep((s) => s - 1))} disabled={submitting}>
            {step === 0 ? 'ยกเลิก' : '← ย้อนกลับ'}
          </Button>
          {step < 2 ? (
            <Button variant="primary" onClick={() => setStep((s) => s + 1)} iconRight={<I.ArrowRight size={16} />}>
              ถัดไป
            </Button>
          ) : (
            <Button variant="primary" icon={<I.Check size={16} />} disabled={submitting} onClick={handleSubmit}>
              {submitting ? 'กำลังบันทึก…' : 'บันทึกข้อมูล'}
            </Button>
          )}
        </footer>
      </Card>
    </div>
  );
}

function Detail({ span, label, value, mono }: { span: string; label: ReactNode; value: ReactNode; mono?: boolean }) {
  return (
    <div style={{ gridColumn: span }}>
      <div className="muted" style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.04em' }}>
        {label}
      </div>
      <div className={mono ? 'mono' : ''} style={{ fontWeight: 500, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
}

function nextDisplayCode(stock: StockRow[]): string {
  let max = 0;
  for (const s of stock) {
    const m = /^S(\d+)$/.exec(s.display_code);
    if (m) max = Math.max(max, +m[1]);
  }
  return 'S' + String(max + 1).padStart(3, '0');
}

// ── Scanner modal ──────────────────────────────────────────────────────────
export function ScannerModal({
  open,
  onClose,
  onCapture,
}: {
  open: boolean;
  onClose: () => void;
  onCapture: (bc: string) => void;
}) {
  const I = Icons;
  const [manualCode, setManualCode] = useState('');
  const [camState, setCamState] = useState<'starting' | 'live' | 'error'>('starting');
  const [camMsg, setCamMsg] = useState('');
  const toast = useToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const firedRef = useRef(false); // guard: only capture once per open

  const useCode = (bc: string) => {
    const v = bc.trim();
    if (!v) return;
    onCapture?.(v);
    onClose();
    toast({ tone: 'success', title: 'สแกนสำเร็จ', desc: v });
  };

  useEffect(() => {
    if (!open) {
      setManualCode('');
      return;
    }
    firedRef.current = false;
    setCamState('starting');
    setCamMsg('');
    let cleanup = () => {};

    const onDetected = (raw: string) => {
      if (firedRef.current || !raw) return;
      firedRef.current = true;
      cleanup();
      useCode(raw);
    };

    (async () => {
      const video = videoRef.current;
      if (!video) return;
      try {
        if ('BarcodeDetector' in window) {
          // Native path (Android Chrome etc.)
          const Detector = (window as any).BarcodeDetector;
          const formats = await Detector.getSupportedFormats?.().catch(() => []);
          const want = ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39'].filter(
            (f) => !formats?.length || formats.includes(f),
          );
          const detector = new Detector({ formats: want.length ? want : undefined });
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          video.srcObject = stream;
          await video.play();
          setCamState('live');
          const iv = setInterval(async () => {
            try {
              const codes = await detector.detect(video);
              if (codes && codes[0]?.rawValue) onDetected(codes[0].rawValue);
            } catch {
              /* transient detect errors are fine */
            }
          }, 350);
          cleanup = () => {
            clearInterval(iv);
            stream.getTracks().forEach((t) => t.stop());
          };
        } else {
          // Fallback path (iOS Safari): ZXing, loaded on demand.
          const { BrowserMultiFormatReader } = await import('@zxing/browser');
          const reader = new BrowserMultiFormatReader();
          const controls = await reader.decodeFromVideoDevice(undefined, video, (result) => {
            if (result) onDetected(result.getText());
          });
          setCamState('live');
          cleanup = () => controls.stop();
        }
      } catch (e: any) {
        setCamState('error');
        setCamMsg(
          e?.name === 'NotAllowedError'
            ? 'ไม่ได้รับอนุญาตให้ใช้กล้อง — กรุณาอนุญาตในเบราว์เซอร์ หรือกรอกด้วยตนเอง'
            : 'เปิดกล้องไม่ได้บนอุปกรณ์นี้ — ใช้เครื่องสแกน USB หรือกรอกด้วยตนเองได้',
        );
      }
    })();

    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="สแกนบาร์โค้ด / QR"
      subtitle="วางบาร์โค้ดหรือ QR ให้อยู่ในกรอบ ระบบจะตรวจจับอัตโนมัติ"
      size="md"
      footer={
        <Button variant="ghost" onClick={onClose}>
          ยกเลิก
        </Button>
      }
    >
      <div className="col" style={{ gap: 16 }}>
        <div className="scan-stage">
          <div className="scan-viewfinder" style={{ position: 'relative', overflow: 'hidden' }}>
            <video
              ref={videoRef}
              muted
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: camState === 'live' ? 'block' : 'none',
              }}
            />
            <span className="corner-tl"></span>
            <span className="corner-tr"></span>
            <span className="corner-bl"></span>
            <span className="corner-br"></span>
            {camState !== 'live' && (
              <div className="scan-bars">
                <I.Barcode size={120} />
              </div>
            )}
            {camState === 'live' && <div className="scan-line"></div>}
          </div>
          <div className="scan-hint">
            {camState === 'starting' && 'กำลังเปิดกล้อง…'}
            {camState === 'live' && 'เล็งกล้องไปที่บาร์โค้ด/QR บนขวดหรือป้าย'}
            {camState === 'error' && <span style={{ color: 'var(--danger)' }}>{camMsg}</span>}
          </div>
        </div>

        <div className="divider"></div>

        <Field label="หรือกรอก/ยิงด้วยเครื่องสแกน USB">
          <div className="row" style={{ gap: 8 }}>
            <Input
              className="mono"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualCode) useCode(manualCode);
              }}
              placeholder="8851234500011"
              style={{ flex: 1 }}
              autoFocus
            />
            <Button variant="primary" disabled={!manualCode} onClick={() => useCode(manualCode)}>
              ใช้
            </Button>
          </div>
        </Field>
      </div>
    </Modal>
  );
}

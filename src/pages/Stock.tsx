// Stock list page — live data via useStock/useWards/useFluids.

import { useMemo, useState } from 'react';
import { Icons } from '../icons';
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ExpiryBadge,
  Field,
  IconButton,
  Input,
  Modal,
  Select,
  StockBadge,
  useToast,
} from '../ui';
import { daysFromToday, formatThaiDate, useFluids, useStock, useWards } from '../lib/data';
import type { StockRow, Ward } from '../lib/db.types';

export function StockPage({ onOpenAdd, onOpenScan }: { onOpenAdd: () => void; onOpenScan: () => void }) {
  const I = Icons;
  const toast = useToast();
  const { stock, loading, update, remove, transfer } = useStock();
  const { wards } = useWards();
  const { fluids } = useFluids();

  const [query, setQuery] = useState('');
  const [wardFilter, setWardFilter] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState<{ key: 'display_code' | 'fluid_code' | 'expiry' | 'qty'; dir: 'asc' | 'desc' }>({
    key: 'expiry',
    dir: 'asc',
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ ids: string[]; desc: string } | null>(null);
  const [editing, setEditing] = useState<StockRow | null>(null);
  const [transfering, setTransfering] = useState<StockRow | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const fluidByCode = useMemo(() => {
    const m: Record<string, string> = {};
    fluids.forEach((f) => (m[f.code] = f.name));
    return m;
  }, [fluids]);

  const filtered = useMemo(() => {
    let arr = stock;
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (x) =>
          (fluidByCode[x.fluid_code] ?? x.fluid_code).toLowerCase().includes(q) ||
          x.lot.toLowerCase().includes(q) ||
          x.display_code.toLowerCase().includes(q) ||
          (x.barcode ?? '').includes(q),
      );
    }
    if (wardFilter !== 'all') arr = arr.filter((x) => x.ward_id === wardFilter);
    if (status !== 'all') {
      arr = arr.filter((x) => {
        const d = daysFromToday(x.expiry);
        if (status === 'low') return x.qty < x.min_qty;
        if (status === 'expiring') return d >= 0 && d <= 180;
        if (status === 'expired') return d < 0;
        if (status === 'ok') return x.qty >= x.min_qty && d > 180;
        return true;
      });
    }
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...arr].sort((a, b) => {
      const va = (a as any)[sort.key];
      const vb = (b as any)[sort.key];
      if (typeof va === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [stock, query, wardFilter, status, sort, fluidByCode]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleAll = () => {
    if (selected.size === pageItems.length) setSelected(new Set());
    else setSelected(new Set(pageItems.map((x) => x.id)));
  };
  const toggleOne = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await remove(ids);
      setSelected(new Set());
      setConfirm(null);
      toast({ tone: 'success', title: `ลบ ${ids.length} รายการสำเร็จ` });
    } catch (e: any) {
      toast({ tone: 'danger', title: 'ลบไม่สำเร็จ', desc: e?.message });
    }
  };

  const wardLabel = wards.find((w) => w.id === wardFilter)?.name || '';
  const statusLabel = ({ all: '', low: 'ต่ำกว่าขั้นต่ำ', expiring: 'ใกล้หมดอายุ', expired: 'หมดอายุแล้ว', ok: 'ปกติ' } as Record<string, string>)[status];

  const sortBtn = (key: typeof sort.key, label: string, align: 'left' | 'right' = 'left') => (
    <span
      className={`t-sort ${sort.key === key ? 'active' : ''}`}
      onClick={() => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))}
      style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start', display: 'inline-flex' }}
    >
      {label}
      {sort.key === key ? (
        sort.dir === 'asc' ? (
          <I.ArrowUp size={12} />
        ) : (
          <I.ArrowDown size={12} />
        )
      ) : (
        <I.ArrowDown size={12} style={{ opacity: 0.3 }} />
      )}
    </span>
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">รายการคงคลัง</span>
          <h1>รายการสารน้ำในคลัง</h1>
          <p>
            ทั้งหมด <b>{filtered.length}</b> รายการ · เลือก <b>{selected.size}</b> รายการ
          </p>
        </div>
        <div className="row row-gap-sm">
          <Button variant="secondary" icon={<I.Download size={18} />}>
            Export
          </Button>
          <Button variant="secondary" icon={<I.Scan size={18} />} onClick={onOpenScan}>
            สแกน
          </Button>
          <Button variant="primary" icon={<I.Plus size={18} />} onClick={onOpenAdd}>
            เพิ่มสารน้ำ
          </Button>
        </div>
      </div>

      <Card padding={false}>
        <div className="table-toolbar">
          <div className="search">
            <Input
              icon={<I.Search size={16} />}
              placeholder="ค้นหารหัส, ชื่อ, Lot, barcode..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={wardFilter}
            onChange={(e) => {
              setWardFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">ทุกวอร์ด</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </Select>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">สถานะทุกประเภท</option>
            <option value="ok">ปกติ</option>
            <option value="low">ต่ำกว่าขั้นต่ำ</option>
            <option value="expiring">ใกล้หมดอายุ</option>
            <option value="expired">หมดอายุแล้ว</option>
          </Select>

          <div className="spacer"></div>

          {(wardFilter !== 'all' || status !== 'all' || query) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setWardFilter('all');
                setStatus('all');
                setPage(1);
              }}
            >
              ล้างตัวกรอง
            </Button>
          )}

          {selected.size > 0 && (
            <>
              <Button variant="secondary" size="sm" icon={<I.Download size={14} />}>
                Export ({selected.size})
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<I.Trash size={14} />}
                onClick={() => setConfirm({ ids: [...selected], desc: `ลบ ${selected.size} รายการที่เลือก?` })}
              >
                ลบ
              </Button>
            </>
          )}
        </div>

        {(wardFilter !== 'all' || status !== 'all') && (
          <div className="row" style={{ padding: '10px 16px 0', borderBottom: 0 }}>
            {wardFilter !== 'all' && (
              <span className="filter-chip">
                วอร์ด: {wardLabel}
                <button onClick={() => setWardFilter('all')} aria-label="ล้าง">
                  <I.Close size={12} />
                </button>
              </span>
            )}
            {status !== 'all' && (
              <span className="filter-chip">
                สถานะ: {statusLabel}
                <button onClick={() => setStatus('all')} aria-label="ล้าง">
                  <I.Close size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="row-select">
                  <div
                    className="check"
                    data-checked={pageItems.length > 0 && selected.size === pageItems.length}
                    data-indeterminate={selected.size > 0 && selected.size < pageItems.length}
                    onClick={toggleAll}
                  >
                    {selected.size === pageItems.length && pageItems.length > 0 ? <I.Check size={12} /> : null}
                  </div>
                </th>
                <th>{sortBtn('display_code', 'รหัส')}</th>
                <th>{sortBtn('fluid_code', 'ชื่อสารน้ำ')}</th>
                <th>Lot</th>
                <th>{sortBtn('expiry', 'วันหมดอายุ')}</th>
                <th>วอร์ด</th>
                <th className="num">{sortBtn('qty', 'คงเหลือ', 'right')}</th>
                <th>สถานะ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState icon={<I.Refresh size={24} />} title="กำลังโหลด..." desc="ดึงข้อมูลคลังจากเซิร์ฟเวอร์" />
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      icon={<I.Search size={24} />}
                      title="ไม่พบรายการ"
                      desc="ลองเปลี่ยนคำค้นหรือล้างตัวกรอง"
                    />
                  </td>
                </tr>
              ) : (
                pageItems.map((x) => {
                  const days = daysFromToday(x.expiry);
                  const fluidName = fluidByCode[x.fluid_code] ?? x.fluid_code;
                  return (
                    <tr key={x.id}>
                      <td>
                        <div className="check" data-checked={selected.has(x.id)} onClick={() => toggleOne(x.id)}>
                          {selected.has(x.id) ? <I.Check size={12} /> : null}
                        </div>
                      </td>
                      <td className="col-code">{x.display_code}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{fluidName}</div>
                        <div className="muted mono" style={{ fontSize: 11 }}>
                          {x.fluid_code}
                          {x.barcode ? ` · ${x.barcode}` : ''}
                        </div>
                      </td>
                      <td className="mono">{x.lot}</td>
                      <td>
                        <div>{formatThaiDate(x.expiry)}</div>
                        <ExpiryBadge days={days} />
                      </td>
                      <td>{wards.find((w) => w.id === x.ward_id)?.name ?? '—'}</td>
                      <td className="num">
                        <div style={{ fontWeight: 600 }}>{x.qty}</div>
                        <div className="muted" style={{ fontSize: 11 }}>
                          ขั้นต่ำ {x.min_qty}
                        </div>
                      </td>
                      <td>
                        <StockBadge qty={x.qty} min={x.min_qty} />
                      </td>
                      <td>
                        <div className="actions">
                          <IconButton icon={<I.ArrowRight size={16} />} label="โอนย้าย" onClick={() => setTransfering(x)} />
                          <IconButton icon={<I.Edit size={16} />} label="แก้ไข" onClick={() => setEditing(x)} />
                          <IconButton
                            icon={<I.Trash size={16} />}
                            label="ลบ"
                            onClick={() =>
                              setConfirm({ ids: [x.id], desc: `ลบรายการ ${x.display_code} (${fluidName})?` })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            แสดง {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} จาก{' '}
            {filtered.length} รายการ
          </span>
          <div className="page-btns">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <I.ArrowLeft size={14} />
            </button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                className="page-btn"
                aria-current={page === i + 1 ? 'page' : undefined}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button className="page-btn" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>
              <I.ArrowRight size={14} />
            </button>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && handleDelete(confirm.ids)}
        title="ยืนยันการลบ"
        desc={confirm?.desc}
        confirmLabel="ลบรายการ"
      />

      {editing && (
        <EditStockModal
          item={editing}
          wards={wards}
          onClose={() => setEditing(null)}
          onSave={async (patch) => {
            try {
              await update(editing.id, patch);
              setEditing(null);
              toast({ tone: 'success', title: 'บันทึกการแก้ไขแล้ว', desc: editing.display_code });
            } catch (e: any) {
              toast({ tone: 'danger', title: 'บันทึกไม่สำเร็จ', desc: e?.message });
            }
          }}
        />
      )}

      {transfering && (
        <TransferStockModal
          item={transfering}
          wards={wards}
          fluids={fluids}
          onClose={() => setTransfering(null)}
          onTransfer={async (input) => {
            try {
              await transfer(input);
              setTransfering(null);
              toast({ tone: 'success', title: 'โอนย้ายสำเร็จ', desc: `โอน ${input.qty} ขวดไปยัง ${wards.find((w) => w.id === input.to_ward_id)?.name || 'ward'}` });
            } catch (e: any) {
              toast({ tone: 'danger', title: 'โอนย้ายไม่สำเร็จ', desc: e?.message });
            }
          }}
        />
      )}
    </div>
  );
}

function EditStockModal({
  item,
  wards,
  onClose,
  onSave,
}: {
  item: StockRow;
  wards: Ward[];
  onClose: () => void;
  onSave: (patch: Partial<StockRow>) => void | Promise<void>;
}) {
  const [form, setForm] = useState(item);
  const u = <K extends keyof StockRow>(k: K, v: StockRow[K]) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`แก้ไข ${item.display_code}`}
      subtitle={item.fluid_code}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={() => onSave(form)}>
            บันทึก
          </Button>
        </>
      }
    >
      <div className="col" style={{ gap: 14 }}>
        <div className="grid-12" style={{ gap: 12 }}>
          <div style={{ gridColumn: 'span 6' }}>
            <Field label="Lot" required>
              <Input className="mono" value={form.lot} onChange={(e) => u('lot', e.target.value)} />
            </Field>
          </div>
          <div style={{ gridColumn: 'span 6' }}>
            <Field label="วันหมดอายุ (พ.ศ.)">
              <Input value={form.expiry} onChange={(e) => u('expiry', e.target.value)} placeholder="2569-01-31" />
            </Field>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <Field label="คงเหลือ">
              <Input type="number" value={form.qty} onChange={(e) => u('qty', +e.target.value)} />
            </Field>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <Field label="ขั้นต่ำ">
              <Input type="number" value={form.min_qty} onChange={(e) => u('min_qty', +e.target.value)} />
            </Field>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <Field label="สูงสุด">
              <Input type="number" value={form.max_qty} onChange={(e) => u('max_qty', +e.target.value)} />
            </Field>
          </div>
          <div style={{ gridColumn: 'span 12' }}>
            <Field label="วอร์ด">
              <Select value={form.ward_id} onChange={(e) => u('ward_id', e.target.value)}>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
        <Field label="Barcode">
          <Input className="mono" value={form.barcode ?? ''} onChange={(e) => u('barcode', e.target.value || null)} />
        </Field>
      </div>
    </Modal>
  );
}

function TransferStockModal({
  item,
  wards,
  fluids,
  onClose,
  onTransfer,
}: {
  item: StockRow;
  wards: Ward[];
  fluids: any[];
  onClose: () => void;
  onTransfer: (input: { from_id: string; to_ward_id: string; qty: number; note?: string }) => void | Promise<void>;
}) {
  const [toWardId, setToWardId] = useState('');
  const [qty, setQty] = useState('1');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const sourceWard = wards.find((w) => w.id === item.ward_id);
  const targetWard = wards.find((w) => w.id === toWardId);
  const fluidName = fluids.find((f) => f.code === item.fluid_code)?.name || item.fluid_code;
  const qtyNum = Math.max(1, Math.min(item.qty, parseInt(qty) || 1));
  const canTransfer = toWardId && toWardId !== item.ward_id && qtyNum > 0 && qtyNum <= item.qty;

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="โอนย้ายสารน้ำ"
      subtitle={`จาก ${sourceWard?.name || ''} → ไป ${targetWard?.name || 'เลือกวอร์ด'}`}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            ยกเลิก
          </Button>
          <Button variant="primary" disabled={!canTransfer || busy} onClick={async () => {
            setBusy(true);
            try {
              await onTransfer({
                from_id: item.id,
                to_ward_id: toWardId,
                qty: qtyNum,
                note: note || undefined,
              });
              onClose();
            } finally {
              setBusy(false);
            }
          }}>
            {busy ? 'กำลังโอนย้าย…' : 'โอนย้าย'}
          </Button>
        </>
      }
    >
      <div className="col" style={{ gap: 14 }}>
        <div className="card-info" style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>รายการต้นทาง</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
            {fluidName} · {item.lot}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
            {sourceWard?.name} · คงเหลือ {item.qty} ขวด
          </div>
        </div>

        <Field label="วอร์ดปลายทาง" required>
          <Select value={toWardId} onChange={(e) => setToWardId(e.target.value)}>
            <option value="">เลือกวอร์ด</option>
            {wards
              .filter((w) => w.id !== item.ward_id)
              .map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
          </Select>
        </Field>

        <Field label="จำนวนที่จะโอนย้าย (ขวด)" required>
          <Input
            type="number"
            min={1}
            max={item.qty}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="1"
          />
          <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
            สูงสุด {item.qty} ขวด
          </div>
        </Field>

        <Field label="หมายเหตุ" hint="ไม่บังคับ">
          <textarea
            className="input"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น ส่วนเกินหลังตรวจสอบ"
          />
        </Field>
      </div>
    </Modal>
  );
}

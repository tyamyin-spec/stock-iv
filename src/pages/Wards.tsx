// Ward management page — CRUD + per-ward defaults + recent activity.

import { useMemo, useState } from 'react';
import { Icons } from '../icons';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  IconButton,
  Input,
  Modal,
  SectionTitle,
  useToast,
} from '../ui';
import { useMovements, useStock, useWards, fmtNum } from '../lib/data';
import type { Ward } from '../lib/db.types';

const SWATCHES = ['#1E6FEB', '#0EA5E9', '#22C5B0', '#16A34A', '#6366F1', '#F59E0B', '#F43F5E', '#7C3AED', '#64748B'];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
}

export function WardsPage() {
  const I = Icons;
  const toast = useToast();
  const { wards, loading, create, update, remove } = useWards();
  const { stock } = useStock();
  const { movements } = useMovements(50);

  const [editing, setEditing] = useState<Ward | 'new' | null>(null);
  const [confirmDel, setConfirmDel] = useState<Ward | null>(null);

  // Pre-compute per-ward stats for the list cards.
  const stats = useMemo(() => {
    const m: Record<string, { qty: number; lots: number; low: number }> = {};
    wards.forEach((w) => (m[w.id] = { qty: 0, lots: 0, low: 0 }));
    stock.forEach((s) => {
      if (!m[s.ward_id]) return;
      m[s.ward_id].qty += s.qty;
      m[s.ward_id].lots += 1;
      if (s.qty < s.min_qty) m[s.ward_id].low += 1;
    });
    return m;
  }, [wards, stock]);

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">การจัดการ</span>
          <h1>จัดการวอร์ด</h1>
          <p>
            ทั้งหมด <b>{wards.length}</b> วอร์ด · ตั้งค่าขั้นต่ำ/สูงสุดและผู้รับผิดชอบของแต่ละหน่วยงาน
          </p>
        </div>
        <div className="row row-gap-sm">
          <Button variant="primary" icon={<I.Plus size={18} />} onClick={() => setEditing('new')}>
            เพิ่มวอร์ด
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <EmptyState icon={<I.Building size={28} />} title="กำลังโหลด..." desc="ดึงข้อมูลวอร์ด" />
        </Card>
      ) : wards.length === 0 ? (
        <Card>
          <EmptyState
            icon={<I.Building size={28} />}
            title="ยังไม่มีวอร์ดในระบบ"
            desc="เพิ่มวอร์ดแรกเพื่อเริ่มจัดการสต็อก"
            action={
              <Button variant="primary" icon={<I.Plus size={16} />} onClick={() => setEditing('new')}>
                เพิ่มวอร์ดแรก
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="ward-mgr-grid">
          {wards.map((w) => {
            const s = stats[w.id] ?? { qty: 0, lots: 0, low: 0 };
            return (
              <div key={w.id} className="ward-mgr-card">
                <div className="ward-mgr-head">
                  <span className="ward-mgr-dot" style={{ background: w.color }}></span>
                  <div className="ward-mgr-name">
                    <h3>{w.name}</h3>
                    <span className="muted mono">{w.code}</span>
                  </div>
                  <div className="ward-mgr-actions">
                    <IconButton icon={<I.Edit size={16} />} label="แก้ไข" onClick={() => setEditing(w)} />
                    <IconButton icon={<I.Trash size={16} />} label="ลบ" onClick={() => setConfirmDel(w)} />
                  </div>
                </div>

                <div className="ward-mgr-stats">
                  <div>
                    <div className="muted" style={{ fontSize: 11 }}>
                      คงเหลือรวม
                    </div>
                    <div className="ward-mgr-val mono">{fmtNum(s.qty)}</div>
                  </div>
                  <div>
                    <div className="muted" style={{ fontSize: 11 }}>
                      Lot ทั้งหมด
                    </div>
                    <div className="ward-mgr-val mono">{fmtNum(s.lots)}</div>
                  </div>
                  <div>
                    <div className="muted" style={{ fontSize: 11 }}>
                      ต่ำกว่าขั้นต่ำ
                    </div>
                    <div className="ward-mgr-val mono">
                      {s.low > 0 ? <Badge tone="warning">{s.low}</Badge> : '0'}
                    </div>
                  </div>
                </div>

                <div className="ward-mgr-thresholds">
                  <span className="muted">ค่าเริ่มต้นใหม่:</span>
                  <span>
                    ขั้นต่ำ <b className="mono">{w.default_min}</b>
                  </span>
                  <span>
                    สูงสุด <b className="mono">{w.default_max}</b>
                  </span>
                </div>

                {w.responsible && (
                  <div className="ward-mgr-resp">
                    <I.User size={13} /> {w.responsible}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Card style={{ marginTop: 16 }}>
        <SectionTitle title="ความเคลื่อนไหวล่าสุด" subtitle="รายการรับเข้า / เบิกออก / ปรับยอด ที่เพิ่งเกิดขึ้น" />
        {movements.length === 0 ? (
          <EmptyState icon={<I.Refresh size={24} />} title="ยังไม่มีรายการเคลื่อนไหว" desc="ข้อมูลจะแสดงเมื่อมีการรับเข้า/เบิกออก" />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>เวลา</th>
                  <th>วอร์ด</th>
                  <th>ชนิด</th>
                  <th>ประเภท</th>
                  <th className="num">จำนวน</th>
                  <th>หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {movements.slice(0, 20).map((m) => {
                  const ward = wards.find((w) => w.id === m.ward_id);
                  const kindLabel =
                    m.kind === 'in'
                      ? 'รับเข้า'
                      : m.kind === 'out'
                        ? 'เบิกออก'
                        : m.kind === 'adjust'
                          ? 'ปรับยอด'
                          : 'นำออก';
                  const tone = m.kind === 'in' ? 'success' : m.kind === 'out' ? 'info' : m.kind === 'discard' ? 'danger' : 'warning';
                  return (
                    <tr key={m.id}>
                      <td className="muted" style={{ fontSize: 12 }}>
                        {new Date(m.occurred_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td>{ward?.name ?? '—'}</td>
                      <td className="mono">{m.fluid_code}</td>
                      <td>
                        <Badge tone={tone as any}>{kindLabel}</Badge>
                      </td>
                      <td className="num mono">
                        {m.qty > 0 ? '+' : ''}
                        {m.qty}
                      </td>
                      <td className="muted" style={{ fontSize: 12 }}>
                        {m.note ?? ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && (
        <WardEditModal
          initial={editing === 'new' ? null : editing}
          existingCodes={wards.map((w) => w.code)}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              if (editing === 'new') {
                await create(input);
                toast({ tone: 'success', title: 'เพิ่มวอร์ดสำเร็จ', desc: input.name });
              } else {
                await update(editing.id, input);
                toast({ tone: 'success', title: 'บันทึกการเปลี่ยนแปลง', desc: input.name });
              }
              setEditing(null);
            } catch (e: any) {
              toast({ tone: 'danger', title: 'บันทึกไม่สำเร็จ', desc: e?.message ?? 'unknown' });
            }
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={async () => {
          if (!confirmDel) return;
          try {
            await remove(confirmDel.id);
            toast({ tone: 'success', title: 'ลบวอร์ดแล้ว', desc: confirmDel.name });
          } catch (e: any) {
            toast({ tone: 'danger', title: 'ลบไม่สำเร็จ', desc: e?.message ?? 'unknown' });
          } finally {
            setConfirmDel(null);
          }
        }}
        title={`ลบวอร์ด ${confirmDel?.name ?? ''}?`}
        desc="สต็อกและรายการเคลื่อนไหวที่ผูกกับวอร์ดนี้จะถูกลบด้วย — ดำเนินการต่อหรือไม่?"
        confirmLabel="ลบวอร์ด"
      />
    </div>
  );
}

type Input = {
  code: string;
  name: string;
  color: string;
  default_min: number;
  default_max: number;
  responsible: string | null;
  note: string | null;
};

function WardEditModal({
  initial,
  existingCodes,
  onClose,
  onSave,
}: {
  initial: Ward | null;
  existingCodes: string[];
  onClose: () => void;
  onSave: (input: Input) => void | Promise<void>;
}) {
  const isNew = !initial;
  const [form, setForm] = useState<Input>(
    initial
      ? {
          code: initial.code,
          name: initial.name,
          color: initial.color,
          default_min: initial.default_min,
          default_max: initial.default_max,
          responsible: initial.responsible,
          note: initial.note,
        }
      : { code: '', name: '', color: SWATCHES[0], default_min: 30, default_max: 120, responsible: '', note: '' },
  );
  const set = <K extends keyof Input>(k: K, v: Input[K]) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-suggest a code while the user types the name on the new-form.
  const onNameChange = (v: string) => {
    set('name', v);
    if (isNew && (!form.code || form.code === slugify(form.name))) {
      set('code', slugify(v) || form.code);
    }
  };

  const codeConflict = isNew && existingCodes.includes(form.code);
  const minOverMax = form.default_max < form.default_min;
  const canSave = form.name.trim().length > 0 && form.code.trim().length > 0 && !codeConflict && !minOverMax;

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={isNew ? 'เพิ่มวอร์ดใหม่' : `แก้ไข ${initial?.name}`}
      subtitle={isNew ? 'กรอกข้อมูลพื้นฐานและค่าเริ่มต้นของวอร์ด' : 'แก้ไขข้อมูลและค่าเริ่มต้นของวอร์ด'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button variant="primary" disabled={!canSave} onClick={() => onSave(form)}>
            บันทึก
          </Button>
        </>
      }
    >
      <div className="col" style={{ gap: 14 }}>
        <div className="grid-12" style={{ gap: 12 }}>
          <div style={{ gridColumn: 'span 7' }}>
            <Field label="ชื่อวอร์ด" required>
              <Input value={form.name} onChange={(e) => onNameChange(e.target.value)} placeholder="เช่น ICU" />
            </Field>
          </div>
          <div style={{ gridColumn: 'span 5' }}>
            <Field
              label="รหัส (slug)"
              required
              hint="ใช้เป็นตัวระบุภายในระบบ — เปลี่ยนภายหลังต้องระวัง"
              error={codeConflict ? 'รหัสนี้มีอยู่แล้ว' : undefined}
            >
              <Input
                className="mono"
                value={form.code}
                onChange={(e) => set('code', slugify(e.target.value))}
                placeholder="เช่น icu"
                disabled={!isNew}
              />
            </Field>
          </div>
        </div>

        <Field label="สีของวอร์ด" hint="ใช้ในการ์ดและกราฟ">
          <div className="ward-color-row">
            {SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                className={`ward-swatch ${form.color === c ? 'is-on' : ''}`}
                style={{ background: c }}
                onClick={() => set('color', c)}
              />
            ))}
            <input
              type="color"
              className="ward-color-native"
              value={form.color}
              onChange={(e) => set('color', e.target.value)}
              aria-label="สีกำหนดเอง"
            />
          </div>
        </Field>

        <div className="grid-12" style={{ gap: 12 }}>
          <div style={{ gridColumn: 'span 6' }}>
            <Field label="ขั้นต่ำเริ่มต้น (default min)" hint="ใช้เมื่อเพิ่มสารน้ำใหม่ในวอร์ดนี้">
              <Input
                type="number"
                min={0}
                value={form.default_min}
                onChange={(e) => set('default_min', Math.max(0, +e.target.value))}
              />
            </Field>
          </div>
          <div style={{ gridColumn: 'span 6' }}>
            <Field
              label="สูงสุดเริ่มต้น (default max)"
              hint="เพดานการสำรอง"
              error={minOverMax ? 'ต้องมากกว่าหรือเท่ากับขั้นต่ำ' : undefined}
            >
              <Input
                type="number"
                min={0}
                value={form.default_max}
                onChange={(e) => set('default_max', Math.max(0, +e.target.value))}
              />
            </Field>
          </div>
        </div>

        <Field label="ผู้รับผิดชอบ" hint="ชื่อหรืออีเมล (ไม่บังคับ)">
          <Input
            value={form.responsible ?? ''}
            onChange={(e) => set('responsible', e.target.value || null)}
            placeholder="เช่น นภัสสร อ."
          />
        </Field>

        <Field label="หมายเหตุ" hint="รายละเอียดเพิ่มเติม (ไม่บังคับ)">
          <textarea
            className="input"
            rows={2}
            value={form.note ?? ''}
            onChange={(e) => set('note', e.target.value || null)}
            placeholder="เช่น รับ admin จากแผนกฉุกเฉิน"
          />
        </Field>
      </div>
    </Modal>
  );
}

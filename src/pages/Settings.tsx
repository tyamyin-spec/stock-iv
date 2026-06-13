// Settings page — profile, system defaults, security (sign-out + change password).

import { useState, type ReactNode } from 'react';
import { Icons } from '../icons';
import { Badge, Button, Card, Field, Input, Modal, SectionTitle, Select, useToast } from '../ui';
import { useWards } from '../lib/data';
import { useAuth } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase';

export function SettingsPage() {
  const I = Icons;
  const toast = useToast();
  const { wards } = useWards();
  const { user, signOut, updatePassword } = useAuth();
  const [pwModal, setPwModal] = useState(false);

  const rawEmail = user?.email ?? '';
  const isSyntheticEmail = /^u[0-9a-f]{16}@stock-iv\.com$/i.test(rawEmail);
  const meta = (user?.user_metadata ?? {}) as { display_name?: string; position?: string; ward_id?: string };
  const displayName = meta.display_name || (isSyntheticEmail ? '' : rawEmail.split('@')[0]) || 'ผู้ใช้';
  const initials = displayName.slice(0, 2);
  const position = meta.position ?? '';
  const wardName = wards.find((w) => w.id === meta.ward_id)?.name ?? '';
  const POSITION_LABELS: Record<string, string> = {
    NA: 'NA - ผู้ช่วยพยาบาล',
    PN: 'PN - พยาบาลเทคนิค',
    RN: 'RN - พยาบาลวิชาชีพ',
  };
  const roleLine = [position, wardName].filter(Boolean).join(' · ') || 'เจ้าหน้าที่';

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">ตั้งค่า</span>
          <h1>ตั้งค่าระบบ</h1>
          <p>โปรไฟล์, การแจ้งเตือน, และการเชื่อมต่ออุปกรณ์</p>
        </div>
        <div className="row row-gap-sm">
          {!isSupabaseConfigured && <Badge tone="warning">โหมดออฟไลน์</Badge>}
        </div>
      </div>

      <div className="grid-2">
        <div className="col" style={{ gap: 16 }}>
          <Card>
            <SectionTitle title="โปรไฟล์ผู้ใช้" />
            <div className="row" style={{ gap: 16, marginBottom: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #60A5FA, #1E6FEB)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{displayName}</div>
                <div className="muted">{roleLine}</div>
              </div>
            </div>
            <div className="grid-12" style={{ gap: 14 }}>
              <div style={{ gridColumn: 'span 6' }}>
                <Field label="ชื่อที่แสดง">
                  <Input defaultValue={displayName} disabled />
                </Field>
              </div>
              <div style={{ gridColumn: 'span 6' }}>
                <Field label="ตำแหน่ง">
                  <Input defaultValue={POSITION_LABELS[position] ?? position ?? '—'} disabled />
                </Field>
              </div>
              <div style={{ gridColumn: 'span 12' }}>
                <Field label="วอร์ดหลัก">
                  <Input defaultValue={wardName || '—'} disabled />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle title="ข้อมูลพื้นฐาน" subtitle="กำหนดค่าที่ใช้ทั้งระบบ" />
            <div className="col" style={{ gap: 14 }}>
              <SettingRow
                icon={<I.Box size={18} />}
                title="ขั้นต่ำคงเหลือเริ่มต้น"
                desc="ค่าเริ่มต้นเมื่อเพิ่มสารน้ำใหม่"
                control={<Input type="number" defaultValue={30} style={{ width: 100 }} />}
              />
              <SettingRow
                icon={<I.Clock size={18} />}
                title="ระยะเตือนใกล้หมดอายุ"
                desc="แสดงเตือนเมื่อเหลือกี่วัน"
                control={
                  <Select defaultValue="180" style={{ width: 150 }}>
                    <option value="30">30 วัน</option>
                    <option value="90">90 วัน</option>
                    <option value="180">180 วัน</option>
                    <option value="365">365 วัน</option>
                  </Select>
                }
              />
              <SettingRow
                icon={<I.Scan size={18} />}
                title="อุปกรณ์สแกนบาร์โค้ด"
                desc="เชื่อมต่อ USB scanner หรือใช้กล้องของอุปกรณ์"
                control={
                  <Badge tone="success" icon={<I.CheckCircle size={12} />}>
                    พร้อมใช้งาน
                  </Badge>
                }
              />
            </div>
          </Card>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <Card>
            <SectionTitle title="การแจ้งเตือน" />
            <div className="col" style={{ gap: 14 }}>
              <SettingToggle title="แจ้งเตือนเมื่อต่ำกว่าขั้นต่ำ" desc="ส่งทันทีเมื่อสารน้ำใดต่ำกว่ายอด" defaultChecked />
              <SettingToggle title="แจ้งเตือนใกล้หมดอายุ" desc="ทุกเช้า 08:00 น." defaultChecked />
              <SettingToggle title="สรุปประจำสัปดาห์ทางอีเมล" desc="ส่งวันจันทร์เช้า" />
              <SettingToggle title="แจ้งเตือนผ่าน LINE Notify" desc="ต้องเชื่อมต่อบัญชี LINE ก่อน" />
            </div>
          </Card>

          <Card>
            <SectionTitle title="ความปลอดภัย" />
            <div className="col" style={{ gap: 10 }}>
              <Button variant="secondary" onClick={() => setPwModal(true)} disabled={!isSupabaseConfigured}>
                เปลี่ยนรหัสผ่าน
              </Button>
              <Button variant="secondary" disabled>
                เปิดการยืนยัน 2 ขั้นตอน
              </Button>
              <Button
                variant="danger-ghost"
                icon={<I.Logout size={16} />}
                onClick={async () => {
                  await signOut();
                  toast({ tone: 'success', title: 'ออกจากระบบเรียบร้อย' });
                }}
              >
                ออกจากระบบ
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ChangePasswordModal
        open={pwModal}
        onClose={() => setPwModal(false)}
        onSubmit={async (pw) => {
          const { error } = await updatePassword(pw);
          if (error) {
            toast({ tone: 'danger', title: 'เปลี่ยนรหัสผ่านไม่สำเร็จ', desc: error });
          } else {
            setPwModal(false);
            toast({ tone: 'success', title: 'อัปเดตรหัสผ่านแล้ว' });
          }
        }}
      />
    </div>
  );
}

function ChangePasswordModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (pw: string) => Promise<void> | void;
}) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const mismatch = pw && pw2 && pw !== pw2;
  const tooShort = pw.length > 0 && pw.length < 8;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="เปลี่ยนรหัสผ่าน"
      subtitle="กำหนดรหัสผ่านใหม่ที่ไม่ใช่รหัสปัจจุบัน"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            variant="primary"
            disabled={!pw || tooShort || mismatch}
            onClick={async () => {
              await onSubmit(pw);
              setPw('');
              setPw2('');
            }}
          >
            บันทึก
          </Button>
        </>
      }
    >
      <div className="col" style={{ gap: 12 }}>
        <Field label="รหัสผ่านใหม่" required error={tooShort ? 'ต้องอย่างน้อย 8 ตัวอักษร' : undefined}>
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} minLength={8} />
        </Field>
        <Field label="ยืนยันรหัสผ่านใหม่" required error={mismatch ? 'รหัสผ่านไม่ตรงกัน' : undefined}>
          <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

function SettingRow({
  icon,
  title,
  desc,
  control,
}: {
  icon: ReactNode;
  title: ReactNode;
  desc: ReactNode;
  control: ReactNode;
}) {
  return (
    <div className="list-item" style={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 10 }}>
      <div className="list-pill">{icon}</div>
      <div className="body" style={{ minWidth: 150 }}>
        <div className="title">{title}</div>
        <div className="sub">{desc}</div>
      </div>
      <div style={{ flex: '0 0 auto', marginLeft: 'auto' }}>{control}</div>
    </div>
  );
}

function SettingToggle({ title, desc, defaultChecked }: { title: ReactNode; desc: ReactNode; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="list-item" style={{ alignItems: 'center' }}>
      <div className="body">
        <div className="title">{title}</div>
        <div className="sub">{desc}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          background: on ? 'var(--brand-500)' : '#CFDBE9',
          border: 0,
          cursor: 'pointer',
          padding: 0,
          position: 'relative',
          transition: 'background .15s',
        }}
        aria-pressed={on}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: on ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left .18s',
            boxShadow: '0 1px 2px rgba(0,0,0,.2)',
          }}
        ></span>
      </button>
    </div>
  );
}

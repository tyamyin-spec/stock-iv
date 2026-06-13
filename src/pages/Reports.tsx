// Reports page — reads live data and exports real CSV / Excel / PDF files.

import { useEffect, useState } from 'react';
import { Icons } from '../icons';
import { Button, Card, EmptyState, Field, Input, SectionTitle, Select, useToast } from '../ui';
import { useFluids, useMovements, usePrices, useReportSchedule, useStock, useWards } from '../lib/data';
import { exportReport, type ReportFormat, type ReportId } from '../lib/export';

// Report metadata, shared by the export cards and the email-schedule picker.
const REPORTS: { id: ReportId; title: string; desc: string; icon: keyof typeof Icons }[] = [
  { id: 'r1', icon: 'Box', title: 'รายงานคงคลังประจำวัน', desc: 'ยอดคงเหลือ ณ สิ้นวัน แยกตาม Lot' },
  { id: 'r2', icon: 'Chart', title: 'รายงานการใช้รายเดือน', desc: 'จำนวนเบิก, สถิติการใช้, แนวโน้ม' },
  { id: 'r3', icon: 'AlertTri', title: 'รายงานสารน้ำใกล้หมดอายุ', desc: 'แสดงรายการที่จะหมดอายุภายในเวลาที่กำหนด' },
  { id: 'r4', icon: 'Refresh', title: 'รายงานการรับ-เบิก', desc: 'ประวัติการเคลื่อนไหวทั้งหมด' },
  { id: 'r5', icon: 'Building', title: 'รายงานสรุปแยกตามวอร์ด', desc: 'การใช้และคงเหลือ แยกตามหน่วยงาน' },
  { id: 'r6', icon: 'Clipboard', title: 'รายงานปรับยอด/จำหน่าย', desc: 'การปรับยอดและสารน้ำที่ถูกตัดออก' },
];

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function ReportsPage() {
  const I = Icons;
  const toast = useToast();
  const { wards } = useWards();
  const { stock } = useStock();
  const { movements } = useMovements(1000);
  const { fluids } = useFluids();
  const { prices } = usePrices();
  const { current: schedule, save: saveSchedule, remove: removeSchedule, sendTestNow } = useReportSchedule();
  const [from, setFrom] = useState('2567-05-01');
  const [to, setTo] = useState('2567-05-21');
  const [ward, setWard] = useState('all');
  const [format, setFormat] = useState<ReportFormat>('xlsx');

  // Email-schedule form state (hydrated from the saved schedule).
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailFreq, setEmailFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [emailReport, setEmailReport] = useState<ReportId>('r1');
  const [emailFormat, setEmailFormat] = useState<'csv' | 'xlsx'>('csv');
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (!schedule) return;
    setEmailRecipients(schedule.recipients);
    setEmailFreq(schedule.frequency);
    setEmailReport(schedule.report_id);
    setEmailFormat(schedule.format);
  }, [schedule]);

  const handleSaveSchedule = async () => {
    const emails = emailRecipients.split(',').map((s) => s.trim()).filter(Boolean);
    if (emails.length === 0) {
      toast({ tone: 'warning', title: 'กรุณากรอกอีเมลผู้รับ' });
      return;
    }
    const bad = emails.filter((e) => !isEmail(e));
    if (bad.length) {
      toast({ tone: 'danger', title: 'รูปแบบอีเมลไม่ถูกต้อง', desc: bad.join(', ') });
      return;
    }
    setSavingSchedule(true);
    try {
      await saveSchedule(
        {
          recipients: emails.join(', '),
          frequency: emailFreq,
          report_id: emailReport,
          format: emailFormat,
          ward,
          enabled: true,
        },
        schedule?.id,
      );
      toast({ tone: 'success', title: 'บันทึกการตั้งค่าแล้ว', desc: `ส่งถึง ${emails.length} อีเมล` });
    } catch (e: any) {
      toast({ tone: 'danger', title: 'บันทึกไม่สำเร็จ', desc: e?.message });
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleSendTest = async () => {
    setTesting(true);
    try {
      const res = await sendTestNow();
      const first = res?.results?.[0];
      if (res?.ok && first?.sent) {
        toast({ tone: 'success', title: 'ส่งอีเมลทดสอบแล้ว', desc: `ส่งถึง ${first.sent} อีเมล · ${first.rows} รายการ` });
      } else if (first?.error) {
        toast({ tone: 'danger', title: 'ส่งไม่สำเร็จ', desc: first.error });
      } else if (res?.ok && res?.results?.length === 0) {
        toast({ tone: 'warning', title: 'ยังไม่มีตารางส่งที่เปิดใช้งาน', desc: 'กรุณาบันทึกการตั้งค่าก่อน' });
      } else {
        toast({ tone: 'warning', title: 'ส่งเสร็จแต่ไม่มีผลลัพธ์', desc: JSON.stringify(res).slice(0, 120) });
      }
    } catch (e: any) {
      toast({ tone: 'danger', title: 'เรียกระบบส่งอีเมลไม่สำเร็จ', desc: e?.message });
    } finally {
      setTesting(false);
    }
  };

  const handleDisableSchedule = async () => {
    if (!schedule) return;
    try {
      await removeSchedule(schedule.id);
      setEmailRecipients('');
      toast({ tone: 'success', title: 'ปิดการส่งอัตโนมัติแล้ว' });
    } catch (e: any) {
      toast({ tone: 'danger', title: 'ดำเนินการไม่สำเร็จ', desc: e?.message });
    }
  };

  const handleExport = async (id: ReportId) => {
    try {
      const data = await exportReport(id, format, { stock, movements, wards, fluids, prices, from, to, ward }, { print: true });
      if (data.rows.length === 0) {
        toast({ tone: 'warning', title: 'ไม่มีข้อมูลในช่วงที่เลือก', desc: data.title });
      } else {
        toast({
          tone: 'success',
          title: format === 'pdf' ? 'เปิดหน้าต่างพิมพ์ PDF แล้ว' : 'ดาวน์โหลดไฟล์แล้ว',
          desc: `${data.title} · ${data.rows.length} รายการ`,
        });
      }
    } catch (e: any) {
      toast({ tone: 'danger', title: 'สร้างไฟล์ไม่สำเร็จ', desc: e?.message });
    }
  };

  const handlePreview = async (id: ReportId) => {
    try {
      const data = await exportReport(id, 'pdf', { stock, movements, wards, fluids, prices, from, to, ward }, { print: false });
      if (data.rows.length === 0) {
        toast({ tone: 'warning', title: 'ไม่มีข้อมูลในช่วงที่เลือก', desc: data.title });
      }
    } catch (e: any) {
      toast({ tone: 'danger', title: 'เปิดตัวอย่างไม่สำเร็จ', desc: e?.message });
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">รายงาน</span>
          <h1>รายงานและการ Export</h1>
          <p>เลือกช่วงเวลาและรูปแบบที่ต้องการ ระบบจะสร้างไฟล์ให้พร้อมดาวน์โหลด</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="col" style={{ gap: 16 }}>
          <Card>
            <SectionTitle title="สร้างรายงาน" subtitle="เลือกประเภทและช่วงเวลา" />
            <div className="grid-12" style={{ gap: 14 }}>
              <div style={{ gridColumn: 'span 6' }}>
                <Field label="จากวันที่">
                  <Input icon={<I.Calendar size={16} />} value={from} onChange={(e) => setFrom(e.target.value)} />
                </Field>
              </div>
              <div style={{ gridColumn: 'span 6' }}>
                <Field label="ถึงวันที่">
                  <Input icon={<I.Calendar size={16} />} value={to} onChange={(e) => setTo(e.target.value)} />
                </Field>
              </div>
              <div style={{ gridColumn: 'span 6' }}>
                <Field label="วอร์ด">
                  <Select value={ward} onChange={(e) => setWard(e.target.value)}>
                    <option value="all">ทุกวอร์ด</option>
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <div style={{ gridColumn: 'span 6' }}>
                <Field label="รูปแบบไฟล์">
                  <div className="segmented" style={{ width: '100%' }}>
                    {[
                      { v: 'xlsx', l: 'Excel' },
                      { v: 'pdf', l: 'PDF' },
                      { v: 'csv', l: 'CSV' },
                    ].map((f) => (
                      <button
                        key={f.v}
                        aria-pressed={format === f.v}
                        onClick={() => setFormat(f.v as 'xlsx' | 'pdf' | 'csv')}
                        style={{ flex: 1 }}
                      >
                        {f.l}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <div className="divider"></div>

            <h4 style={{ marginBottom: 12 }}>เลือกประเภทรายงาน</h4>
            <div className="grid-12" style={{ gap: 12 }}>
              {REPORTS.map((r) => {
                const Icon = I[r.icon] as (p: { size?: number }) => JSX.Element;
                return (
                  <div key={r.id} className="report-card" style={{ gridColumn: 'span 6' }}>
                    <div className="report-icon">
                      <Icon size={22} />
                    </div>
                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                    <div className="muted" style={{ fontSize: 12.5 }}>
                      {r.desc}
                    </div>
                    <div className="report-card-foot">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(r.id)}>
                        ดูตัวอย่าง
                      </Button>
                      <Button variant="primary" size="sm" icon={<I.Download size={14} />} onClick={() => handleExport(r.id)}>
                        Export
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <Card>
            <SectionTitle title="รายงานล่าสุด" subtitle="ดาวน์โหลดที่สร้างไว้ก่อนหน้า" />
            <EmptyState icon={<I.Clipboard size={24} />} title="ยังไม่มีรายงานที่สร้างไว้" desc="กดสร้างรายงานเพื่อเริ่ม" />
          </Card>

          <Card>
            <SectionTitle title="ส่ง Email อัตโนมัติ" subtitle="ตั้งให้ระบบส่งรายงานเป็นประจำ" />
            <div className="col" style={{ gap: 14 }}>
              {schedule && (
                <div
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 12.5,
                  }}
                >
                  <span className="badge badge-success">เปิดใช้งานอยู่</span>
                  <span className="muted" style={{ marginLeft: 8 }}>
                    {schedule.last_sent_at
                      ? `ส่งล่าสุด ${new Date(schedule.last_sent_at).toLocaleString('th-TH')}`
                      : 'ยังไม่เคยส่ง'}
                    {schedule.last_status && schedule.last_status !== 'ok' ? ` · ${schedule.last_status}` : ''}
                  </span>
                </div>
              )}
              <Field label="อีเมลผู้รับ" hint="คั่นด้วยจุลภาค (,) สำหรับหลายคน">
                <Input
                  placeholder="head@hospital.go.th"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
              </Field>
              <Field label="ประเภทรายงาน">
                <Select value={emailReport} onChange={(e) => setEmailReport(e.target.value as ReportId)}>
                  {REPORTS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="รูปแบบไฟล์แนบ">
                <Select value={emailFormat} onChange={(e) => setEmailFormat(e.target.value as 'csv' | 'xlsx')}>
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                </Select>
              </Field>
              <Field label="ความถี่">
                <Select value={emailFreq} onChange={(e) => setEmailFreq(e.target.value as 'daily' | 'weekly' | 'monthly')}>
                  <option value="daily">ทุกวัน 18:00 น.</option>
                  <option value="weekly">ทุกวันจันทร์ 18:00 น.</option>
                  <option value="monthly">ทุกสิ้นเดือน 18:00 น.</option>
                </Select>
              </Field>
              <Button
                variant="secondary"
                icon={<I.Check size={16} />}
                onClick={handleSaveSchedule}
                disabled={savingSchedule}
              >
                {savingSchedule ? 'กำลังบันทึก…' : 'บันทึกการตั้งค่า'}
              </Button>
              {schedule && (
                <Button variant="primary" icon={<I.Refresh size={16} />} onClick={handleSendTest} disabled={testing}>
                  {testing ? 'กำลังส่ง…' : 'ส่งทดสอบเดี๋ยวนี้'}
                </Button>
              )}
              {schedule && (
                <Button variant="ghost" size="sm" onClick={handleDisableSchedule}>
                  ปิดการส่งอัตโนมัติ
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

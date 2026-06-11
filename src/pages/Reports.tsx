// Reports page — reads live data and exports real CSV / Excel / PDF files.

import { useState } from 'react';
import { Icons } from '../icons';
import { Button, Card, EmptyState, Field, Input, SectionTitle, Select, useToast } from '../ui';
import { useFluids, useMovements, usePrices, useStock, useWards } from '../lib/data';
import { exportReport, type ReportFormat, type ReportId } from '../lib/export';

export function ReportsPage() {
  const I = Icons;
  const toast = useToast();
  const { wards } = useWards();
  const { stock } = useStock();
  const { movements } = useMovements(1000);
  const { fluids } = useFluids();
  const { prices } = usePrices();
  const [from, setFrom] = useState('2567-05-01');
  const [to, setTo] = useState('2567-05-21');
  const [ward, setWard] = useState('all');
  const [format, setFormat] = useState<ReportFormat>('xlsx');

  const handleExport = (id: ReportId) => {
    try {
      const data = exportReport(id, format, { stock, movements, wards, fluids, prices, from, to, ward });
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

  const handlePreview = (id: ReportId) => {
    try {
      const data = exportReport(id, 'pdf', { stock, movements, wards, fluids, prices, from, to, ward });
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
              {[
                { id: 'r1', icon: <I.Box size={22} />, title: 'รายงานคงคลังประจำวัน', desc: 'ยอดคงเหลือ ณ สิ้นวัน แยกตาม Lot' },
                { id: 'r2', icon: <I.Chart size={22} />, title: 'รายงานการใช้รายเดือน', desc: 'จำนวนเบิก, สถิติการใช้, แนวโน้ม' },
                { id: 'r3', icon: <I.AlertTri size={22} />, title: 'รายงานสารน้ำใกล้หมดอายุ', desc: 'แสดงรายการที่จะหมดอายุภายในเวลาที่กำหนด' },
                { id: 'r4', icon: <I.Refresh size={22} />, title: 'รายงานการรับ-เบิก', desc: 'ประวัติการเคลื่อนไหวทั้งหมด' },
                { id: 'r5', icon: <I.Building size={22} />, title: 'รายงานสรุปแยกตามวอร์ด', desc: 'การใช้และคงเหลือ แยกตามหน่วยงาน' },
                { id: 'r6', icon: <I.Clipboard size={22} />, title: 'รายงานปรับยอด/จำหน่าย', desc: 'การปรับยอดและสารน้ำที่ถูกตัดออก' },
              ].map((r) => (
                <div key={r.id} className="report-card" style={{ gridColumn: 'span 6' }}>
                  <div className="report-icon">{r.icon}</div>
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
                  <div className="muted" style={{ fontSize: 12.5 }}>
                    {r.desc}
                  </div>
                  <div className="report-card-foot">
                    <Button variant="ghost" size="sm" onClick={() => handlePreview(r.id as ReportId)}>
                      ดูตัวอย่าง
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<I.Download size={14} />}
                      onClick={() => handleExport(r.id as ReportId)}
                    >
                      Export
                    </Button>
                  </div>
                </div>
              ))}
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
              <Field label="อีเมลผู้รับ" hint="คั่นด้วยจุลภาค (,) สำหรับหลายคน">
                <Input placeholder="head@hospital.go.th" />
              </Field>
              <Field label="ความถี่">
                <Select defaultValue="daily">
                  <option value="daily">ทุกวัน 18:00 น.</option>
                  <option value="weekly">ทุกวันจันทร์ 09:00 น.</option>
                  <option value="monthly">ทุกสิ้นเดือน</option>
                </Select>
              </Field>
              <Button variant="secondary" icon={<I.Check size={16} />}>
                บันทึกการตั้งค่า
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

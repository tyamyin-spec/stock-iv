// Mock data for IV stock management

window.WARDS = [
  { id: 'all', name: 'ทุกวอร์ด' },
  { id: 'semi-sx', name: 'SEMI SX' },
  { id: 'surg-male', name: 'ศัลยกรรมชาย' },
  { id: 'surg-female', name: 'ศัลยกรรมหญิง' },
  { id: 'icu', name: 'ICU' },
  { id: 'er', name: 'ER' },
];

window.FLUID_TYPES = [
  { code: 'NSS', name: 'NSS 1000 ml', full: '0.9% Sodium Chloride' },
  { code: 'RL',  name: 'RL 1000 ml',  full: "Ringer's Lactate" },
  { code: 'D5W', name: 'D5W 1000 ml', full: '5% Dextrose in Water' },
  { code: '5DN2',name: '5%D/N/2 1000 ml', full: '5% Dextrose in 1/2 NSS' },
  { code: 'LR',  name: 'LR 1000 ml',  full: "Lactated Ringer's" },
  { code: '3NaCl', name: '3%NaCl 100 ml', full: '3% Sodium Chloride' },
  { code: 'D10W', name: 'D10W 1000 ml', full: '10% Dextrose in Water' },
];

// Stock items
window.STOCK = [
  { id: 'IV001', code: 'NSS',  name: 'NSS 1000 ml',  lot: 'A001', exp: '2567-11-15', ward: 'semi-sx',    qty: 60, min: 30, barcode: '8851234500011' },
  { id: 'IV002', code: 'RL',   name: 'RL 1000 ml',   lot: 'B002', exp: '2567-11-20', ward: 'surg-male',  qty: 40, min: 30, barcode: '8851234500028' },
  { id: 'IV003', code: 'D5W',  name: 'D5W 1000 ml',  lot: 'C003', exp: '2567-11-25', ward: 'semi-sx',    qty: 30, min: 30, barcode: '8851234500035' },
  { id: 'IV004', code: '5DN2', name: '5%D/N/2 1000 ml', lot: 'D004', exp: '2567-12-05', ward: 'surg-male', qty: 20, min: 25, barcode: '8851234500042' },
  { id: 'IV005', code: 'NSS',  name: 'NSS 1000 ml',  lot: 'A005', exp: '2567-12-18', ward: 'semi-sx',    qty: 25, min: 30, barcode: '8851234500059' },
  { id: 'IV006', code: 'LR',   name: 'LR 1000 ml',   lot: 'E006', exp: '2568-02-10', ward: 'icu',        qty: 18, min: 20, barcode: '8851234500066' },
  { id: 'IV007', code: '3NaCl',name: '3%NaCl 100 ml',lot: 'F007', exp: '2568-03-22', ward: 'icu',        qty: 10, min: 15, barcode: '8851234500073' },
  { id: 'IV008', code: 'D5W',  name: 'D5W 1000 ml',  lot: 'C008', exp: '2568-04-30', ward: 'er',         qty: 55, min: 40, barcode: '8851234500080' },
  { id: 'IV009', code: 'NSS',  name: 'NSS 1000 ml',  lot: 'A009', exp: '2568-06-12', ward: 'surg-female',qty: 95, min: 40, barcode: '8851234500097' },
  { id: 'IV010', code: 'RL',   name: 'RL 1000 ml',   lot: 'B010', exp: '2568-07-08', ward: 'semi-sx',    qty: 80, min: 40, barcode: '8851234500103' },
  { id: 'IV011', code: 'D10W', name: 'D10W 1000 ml', lot: 'G011', exp: '2568-09-14', ward: 'er',         qty: 14, min: 20, barcode: '8851234500110' },
  { id: 'IV012', code: 'LR',   name: 'LR 1000 ml',   lot: 'E012', exp: '2568-10-25', ward: 'surg-female',qty: 28, min: 30, barcode: '8851234500127' },
];

// Recent movements (in/out)
window.MOVEMENTS = [
  { id: 'M2401', ts: '21 พ.ค. 67 09:42', type: 'out', item: 'NSS 1000 ml',   lot: 'A001', qty: 6,  ward: 'SEMI SX',     by: 'พ.ส.มาลี' },
  { id: 'M2400', ts: '21 พ.ค. 67 09:15', type: 'in',  item: 'RL 1000 ml',    lot: 'B010', qty: 20, ward: 'SEMI SX',     by: 'พ.ส.วิภา' },
  { id: 'M2399', ts: '21 พ.ค. 67 08:58', type: 'out', item: 'D5W 1000 ml',   lot: 'C003', qty: 4,  ward: 'SEMI SX',     by: 'พ.ส.มาลี' },
  { id: 'M2398', ts: '21 พ.ค. 67 08:30', type: 'out', item: '5%D/N/2 1000 ml', lot: 'D004', qty: 2, ward: 'ศัลยกรรมชาย', by: 'พ.ส.อรุณ' },
  { id: 'M2397', ts: '20 พ.ค. 67 17:12', type: 'in',  item: 'NSS 1000 ml',   lot: 'A009', qty: 50, ward: 'ศัลยกรรมหญิง', by: 'จ.พัสดุ สมชาย' },
  { id: 'M2396', ts: '20 พ.ค. 67 14:45', type: 'out', item: 'LR 1000 ml',    lot: 'E006', qty: 3,  ward: 'ICU',         by: 'พ.ส.กนกพร' },
  { id: 'M2395', ts: '20 พ.ค. 67 11:08', type: 'adj', item: '3%NaCl 100 ml', lot: 'F007', qty: -2, ward: 'ICU',         by: 'หัวหน้าฯ' },
  { id: 'M2394', ts: '20 พ.ค. 67 09:30', type: 'out', item: 'NSS 1000 ml',   lot: 'A005', qty: 5,  ward: 'SEMI SX',     by: 'พ.ส.มาลี' },
];

// Daily usage for chart (last 30 days)
window.USAGE_30D = [
  15, 18, 22, 14, 19, 25, 21, 17, 23, 28,
  20, 24, 19, 26, 31, 19, 24, 28, 22, 35,
  27, 30, 24, 33, 18, 22, 14, 26, 31, 19,
];
// Last 14 days = USAGE_30D.slice(-14)
window.USAGE_14D = window.USAGE_30D.slice(-14);

// Stock split by ward (current snapshot)
window.STOCK_BY_WARD = [
  { id: 'semi-sx',   name: 'SEMI SX',     qty: 420, color: '#1E6FEB' },
  { id: 'surg-male', name: 'ศัลยกรรมชาย', qty: 200, color: '#22C5B0' },
];

// Stock split by fluid type (current snapshot)
window.STOCK_BY_TYPE = [
  { code: 'NSS',    qty: 220 },
  { code: 'RL',     qty: 150 },
  { code: 'DSW',    qty: 100 },
  { code: '5%D/N/2',qty: 80 },
  { code: 'LR',     qty: 70 },
];

// Type usage (30d)
window.TYPE_USAGE_30D = [
  { code: 'NSS',     qty: 180 },
  { code: 'RL',      qty: 120 },
  { code: 'D5W',     qty:  90 },
  { code: '5%D/N/2', qty:  60 },
  { code: 'LR',      qty:  40 },
];

// Least used in 30 days
window.TYPE_LEAST_30D = [
  { code: 'LR 1000 ml',     qty: 40 },
  { code: '5%D/N/2 1000 ml',qty: 60 },
  { code: '3%NaCl 100 ml',  qty: 10 },
];

window.NOTIFICATIONS = [
  { id: 'n1', kind: 'danger',  title: 'หมดอายุแล้ว 2 รายการ', meta: 'IV001 · IV004', ts: '5 นาทีที่แล้ว' },
  { id: 'n2', kind: 'warning', title: 'ใกล้หมดอายุภายใน 7 เดือน', meta: '12 รายการ', ts: '1 ชม.ที่แล้ว' },
  { id: 'n3', kind: 'info',    title: 'รับเข้า RL 1000 ml × 20 ขวด', meta: 'Lot B010 · SEMI SX', ts: '2 ชม.ที่แล้ว' },
  { id: 'n4', kind: 'warning', title: 'คงเหลือต่ำกว่าขั้นต่ำ', meta: '8 รายการ', ts: 'เมื่อวาน' },
];

// Reports presets
window.REPORTS = [
  { id: 'r1', name: 'รายงานคงคลังประจำวัน',  period: '21 พ.ค. 2567',           rows: 12, by: 'อัตโนมัติ' },
  { id: 'r2', name: 'รายงานการใช้รายเดือน',  period: 'พ.ค. 2567',              rows: 248, by: 'พ.ส.มาลี' },
  { id: 'r3', name: 'รายงานสารน้ำใกล้หมดอายุ', period: 'ภายใน 7 เดือน',         rows: 12,  by: 'อัตโนมัติ' },
  { id: 'r4', name: 'รายงานการรับ-เบิก',     period: '1-21 พ.ค. 2567',         rows: 86,  by: 'พ.ส.วิภา' },
  { id: 'r5', name: 'รายงานสรุปแยกตามวอร์ด', period: 'พ.ค. 2567',              rows: 6,   by: 'หัวหน้าฯ' },
];

// helpers
window.fmtNum = (n) => n.toLocaleString('en-US');
window.daysFromToday = (be) => {
  // be = "2567-11-15" => convert to Gregorian
  const [y, m, d] = be.split('-').map(Number);
  const ad = new Date(y - 543, m - 1, d);
  const today = new Date(2567 - 543, 4, 21); // 21 พ.ค. 2567
  return Math.round((ad - today) / 86400000);
};
window.formatThaiDate = (be) => {
  const [y, m, d] = be.split('-').map(Number);
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  return `${d} ${months[m-1]} ${y}`;
};

// Data configuration for Stock IV
// Database integration - starts empty, loads from Supabase

// Ward definitions (fixed)
window.WARDS = [
  { id: 'all', name: 'ทุกวอร์ด' },
  { id: 'semi-sx', name: 'SEMI SX' },
  { id: 'surg-male', name: 'ศัลยกรรมชาย' },
  { id: 'surg-female', name: 'ศัลยกรรมหญิง' },
  { id: 'icu', name: 'ICU' },
  { id: 'er', name: 'ER' },
];

// Fluid types (fixed)
window.FLUID_TYPES = [
  { code: 'NSS', name: 'NSS 1000 ml', full: '0.9% Sodium Chloride' },
  { code: 'RL',  name: 'RL 1000 ml',  full: "Ringer's Lactate" },
  { code: 'D5W', name: 'D5W 1000 ml', full: '5% Dextrose in Water' },
  { code: '5DN2',name: '5%D/N/2 1000 ml', full: '5% Dextrose in 1/2 NSS' },
  { code: 'LR',  name: 'LR 1000 ml',  full: "Lactated Ringer's" },
  { code: '3NaCl', name: '3%NaCl 100 ml', full: '3% Sodium Chloride' },
  { code: 'D10W', name: 'D10W 1000 ml', full: '10% Dextrose in Water' },
];

// Stock items - START EMPTY (loads from Supabase)
window.STOCK = [];

// Movements - START EMPTY
window.MOVEMENTS = [];

// Usage data - empty
window.USAGE_30D = [];
window.USAGE_14D = [];

// Derived data (empty to start)
window.STOCK_BY_WARD = [];
window.STOCK_BY_TYPE = [];
window.TYPE_USAGE_30D = [];
window.TYPE_LEAST_30D = [];

// Notifications - empty
window.NOTIFICATIONS = [];

// Reports - empty
window.REPORTS = [];

// Utility functions
window.fmtNum = (n) => n.toLocaleString('en-US');

window.daysFromToday = (be) => {
  if (!be) return null;
  const today = new Date();
  const target = new Date(be + 'T00:00:00');
  return Math.floor((target - today) / (1000 * 60 * 60 * 24));
};

window.formatThaiDate = (be) => {
  if (!be) return '-';
  const d = new Date(be + 'T00:00:00');
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const y = d.getFullYear() + 543;
  return `${d.getDate()} ${months[d.getMonth()]} ${y}`;
};

// Note: Database loading happens in db-patch.js
console.log('✅ Stock IV data configuration loaded (empty by default, loads from Supabase)');

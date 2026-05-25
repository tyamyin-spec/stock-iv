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

// Fluid types (master catalog - synced with Supabase fluid_types table)
// Fields: code, name (short display), full (description), size, unit, min/max stock thresholds
window.FLUID_TYPES = [
  { code: 'NSS100(IV)', name: 'NSS(IV) 100 ml', full: '0.9% Sodium Chloride (IV)', size: '100 ml', unit: 'ขวด', min: 40, max: 80 },
  { code: 'NSS500', name: 'NSS 500 ml', full: '0.9% Sodium Chloride', size: '500 ml', unit: 'ขวด', min: 3, max: 5 },
  { code: 'NSS1000(IV)', name: 'NSS(IV) 1000 ml', full: '0.9% Sodium Chloride (IV)', size: '1000 ml', unit: 'ขวด', min: 20, max: 40 },
  { code: 'NSS045-1000', name: '0.45 NaCl 1000 ml', full: '0.45% Sodium Chloride', size: '1000 ml', unit: 'ขวด', min: 3, max: 5 },
  { code: 'D5W100', name: 'D-5-W 100 ml', full: '5% Dextrose in Water', size: '100 ml', unit: 'ขวด', min: 20, max: 30 },
  { code: 'D5W200', name: 'D-5-W 200 ml', full: '5% Dextrose in Water', size: '200 ml', unit: 'ขวด', min: 10, max: 20 },
  { code: 'D5W250', name: 'D-5-W 250 ml', full: '5% Dextrose in Water', size: '250 ml', unit: 'ขวด', min: 10, max: 20 },
  { code: 'D5W500', name: 'D-5-W 500 ml', full: '5% Dextrose in Water', size: '500 ml', unit: 'ขวด', min: 5, max: 10 },
  { code: 'D5W1000', name: 'D-5-W 1000 ml', full: '5% Dextrose in Water', size: '1000 ml', unit: 'ขวด', min: 3, max: 5 },
  { code: 'D5S1000', name: 'D-5-S 1000 ml', full: '5% Dextrose in Saline', size: '1000 ml', unit: 'ขวด', min: 3, max: 5 },
  { code: 'D5N2-500', name: 'D-5-N/2 500 ml', full: '5% Dextrose in 1/2 NSS', size: '500 ml', unit: 'ขวด', min: 2, max: 3 },
  { code: 'D5N2-1000', name: 'D-5-N/2 1000 ml', full: '5% Dextrose in 1/2 NSS', size: '1000 ml', unit: 'ขวด', min: 5, max: 10 },
  { code: 'D5N3-500', name: 'D-5-N/3 500 ml', full: '5% Dextrose in 1/3 NSS', size: '500 ml', unit: 'ขวด', min: 2, max: 3 },
  { code: 'D10S1000', name: 'D-10-S 1000 ml', full: '10% Dextrose in Saline', size: '1000 ml', unit: 'ขวด', min: 5, max: 10 },
  { code: 'D10N2-1000', name: 'D-10-N/2 1000 ml', full: '10% Dextrose in 1/2 NSS', size: '1000 ml', unit: 'ขวด', min: 5, max: 10 },
  { code: 'RAC1000', name: 'Acetate Ringer 1000 ml', full: 'Acetate Ringer', size: '1000 ml', unit: 'ถุง', min: 6, max: 10 },
  { code: 'ACETAR5-1000', name: 'ACETAR-5 1000 ml', full: 'Acetar-5', size: '1000 ml', unit: 'ขวด', min: 3, max: 5 },
  { code: 'RL1000', name: 'LACTATE RINGER 1000 ml', full: "Lactated Ringer's", size: '1000 ml', unit: 'ขวด', min: 6, max: 10 },
  { code: 'NSS(irrigate)1000', name: 'NSS(irrigate) 1000 ml', full: 'NSS for Irrigation', size: '1000 ml', unit: 'ขวด', min: 5, max: 10 },
  { code: 'SWI(irrigate)1000', name: 'Sterile Water(irrigate) 1000 ml', full: 'Sterile Water for Irrigation', size: '1000 ml', unit: 'ขวด', min: 5, max: 10 },
  { code: 'SWI(IV)1000', name: 'Sterile Water(IV) 1000 ml', full: 'Sterile Water for Injection (IV)', size: '1000 ml', unit: 'ขวด', min: 10, max: 20 },
  { code: 'SWI100', name: 'Sterile Water 100 ml', full: 'Sterile Water for Injection', size: '100 ml', unit: 'ขวด', min: 10, max: 20 },
  { code: 'D5N4-500', name: 'D-5-N/4 500 ml', full: '5% Dextrose in 1/4 NSS', size: '500 ml', unit: 'ขวด', min: 0, max: 0 },
  { code: 'D5N5-500', name: 'D-5-N/5 500 ml', full: '5% Dextrose in 1/5 NSS', size: '500 ml', unit: 'ขวด', min: 0, max: 0 },
  { code: 'D10W1000ml', name: 'D-10-W 1000 ml', full: '10% Dextrose in Water', size: '1000 ml', unit: 'ขวด', min: 0, max: 0 },
  { code: 'D10N5-500', name: 'D-10N/5 500 ml', full: '10% Dextrose in 1/5 NSS', size: '500 ml', unit: 'ขวด', min: 0, max: 0 },
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
console.log('✅ Stock IV data configuration loaded (' + window.FLUID_TYPES.length + ' fluid types)');

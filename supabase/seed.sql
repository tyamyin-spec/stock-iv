-- Stock IV — seed reference data
-- Run after migrations. Idempotent (uses on conflict do nothing / update).

-- ── wards ──────────────────────────────────────────────────────────────────
insert into public.wards (code, name, color, default_min, default_max) values
  ('semi-sx',     'SEMI SX',         '#1E6FEB', 40, 150),
  ('surg-male',   'ศัลยกรรมชาย',     '#22C5B0', 30, 120),
  ('surg-female', 'ศัลยกรรมหญิง',    '#0EA5E9', 30, 120),
  ('icu',         'ICU',             '#6366F1', 35, 130),
  ('er',          'ER',              '#F59E0B', 40, 140)
on conflict (code) do nothing;

-- ── fluid_types (catalog) ──────────────────────────────────────────────────
insert into public.fluid_types (code, tag, name, full_name, size_ml, category, default_min, default_max, default_price) values
  ('NSS100',      'NSS',    'NSS',                   '0.9% Sodium Chloride',           100,  'saline',     20, 80,  12),
  ('NSS500',      'NSS',    'NSS',                   '0.9% Sodium Chloride',           500,  'saline',     24, 100, 15),
  ('NSS1000',     'NSS',    'NSS',                   '0.9% Sodium Chloride',           1000, 'saline',     40, 150, 18),
  ('NSS045-1000', '½NS',    '0.45% NaCl',            '0.45% Sodium Chloride',          1000, 'saline',     15, 60,  18),
  ('D5W100',      'D5W',    'D-5-W',                 '5% Dextrose in Water',           100,  'dextrose',   15, 60,  14),
  ('D5W200',      'D5W',    'D-5-W',                 '5% Dextrose in Water',           200,  'dextrose',   15, 60,  16),
  ('D5W250',      'D5W',    'D-5-W',                 '5% Dextrose in Water',           250,  'dextrose',   15, 60,  18),
  ('D5W500',      'D5W',    'D-5-W',                 '5% Dextrose in Water',           500,  'dextrose',   20, 80,  20),
  ('D5W1000',     'D5W',    'D-5-W',                 '5% Dextrose in Water',           1000, 'dextrose',   40, 150, 22),
  ('D5S1000',     'D5S',    'D-5-S',                 '5% Dextrose in NSS',             1000, 'dextrose',   20, 80,  24),
  ('D5N2-500',    'D5N2',   'D-5-N/2',               '5% Dextrose in ½ NSS',           500,  'dextrose',   15, 60,  26),
  ('D5N2-1000',   'D5N2',   'D-5-N/2',               '5% Dextrose in ½ NSS',           1000, 'dextrose',   20, 80,  30),
  ('D5N3-500',    'D5N3',   'D-5-N/3',               '5% Dextrose in ⅓ NSS',           500,  'dextrose',   15, 60,  28),
  ('D10S1000',    'D10S',   'D-10-S',                '10% Dextrose in NSS',            1000, 'dextrose10', 15, 60,  26),
  ('D10N2-1000',  'D10N2',  'D-10-N/2',              '10% Dextrose in ½ NSS',          1000, 'dextrose10', 15, 60,  28),
  ('RAC1000',     'RAC',    'Acetate Ringer',        'Acetated Ringer',                1000, 'ringer',     20, 80,  30),
  ('ACETAR5-1000','ACE5',   'ACETAR-5',              'Acetar-5 (Dextrose+Acetate)',    1000, 'ringer',     15, 60,  34),
  ('RL1000',      'RL',     'Lactate Ringer',        'Lactated Ringer',                1000, 'ringer',     30, 120, 28),
  ('NSSI1000',    'NSS-I',  'NSS irrigate',          'NSS (irrigation)',               1000, 'water',      15, 60,  16),
  ('SWI1000',     'SWI',    'Sterile Water irrigate','Sterile Water (irrigation)',     1000, 'water',      15, 60,  16),
  ('SWI1000IV',   'SWI-IV', 'Sterile Water IV',      'Sterile Water for Injection',    1000, 'water',      15, 60,  18),
  ('SWI100',      'SWI',    'Sterile Water',         'Sterile Water for Injection',    100,  'water',      10, 40,  12)
on conflict (code) do update set
  tag = excluded.tag,
  name = excluded.name,
  full_name = excluded.full_name,
  size_ml = excluded.size_ml,
  category = excluded.category;

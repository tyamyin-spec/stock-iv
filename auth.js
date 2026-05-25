// Auth for Stock IV — name/password against Supabase `users` table.
// Login matches a user by `username` OR `display_name` (trimmed, case-insensitive)
// and compares the password as plain text (a SHA-256 hash is also accepted, in
// case some rows store a hash). Validation happens client-side.
// Wrapped in an IIFE so its locals don't collide with other classic scripts
// that also declare SUPABASE_URL at the global level.
(function () {
const rawUrl = window.SUPABASE_URL || '';
const rawKey = window.SUPABASE_ANON_KEY || '';
// Treat un-substituted Vercel placeholders (e.g. "${SUPABASE_URL}") as offline.
const SUPABASE_URL = rawUrl.includes('${') ? '' : rawUrl;
const SUPABASE_ANON_KEY = rawKey.includes('${') ? '' : rawKey;
const isOnline = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

const SESSION_KEY = 'stockiv_user';

// SHA-256 hex digest. Use window.Auth.hashPassword('mypw') in the console
// to generate a hash for seeding the users table.
async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const norm = (s) => (s == null ? '' : String(s)).trim();

// Position (role) per staff name. The live `users` table has no role column,
// so we map it here. Everyone is RN unless listed below.
const ROLE_OVERRIDE = {
  'วราภรณ์': 'TN',
  'มณธิการณ์': 'PN',
  'พิชัยบัญชา': 'PN',
  'อุมาภรณ์': 'NA',
  'อัมรา': 'NA',
  'วันเพ็ญ': 'NA',
  'admin': 'admin',
};
const roleForName = (name) => ROLE_OVERRIDE[norm(name)] || 'RN';

// Offline fallback so the app is usable without Supabase configured.
// Mirrors the live `users` table (password '1234' for everyone) so testing
// on localhost works for every name, not just a couple.
const MOCK_STAFF = {
  RN: ['อุมา', 'ศรัญญา', 'พัชรินทร์', 'สาริณี', 'กัณฑิมา', 'สุนีย์', 'วรวี', 'สุกัญยา',
       'สุดารัตน์', 'ชยากร', 'รสริน', 'เจนจิรา', 'ปวิตรา', 'ฐิติมา', 'ปวีณา', 'นิภาพร',
       'สุพัตรา', 'นวลฉวี', 'เพ็ชรลดา', 'อลิษา', 'ภัทราวดี'],
  TN: ['วราภรณ์'],
  PN: ['มณธิการณ์', 'พิชัยบัญชา'],
  NA: ['อุมาภรณ์', 'อัมรา', 'วันเพ็ญ'],
};
const MOCK_USERS = [
  { username: 'admin', password_hash: '1234', display_name: 'ผู้ดูแลระบบ', role: 'admin' },
  ...Object.entries(MOCK_STAFF).flatMap(([role, names]) =>
    names.map((n) => ({ username: n, password_hash: '1234', display_name: n, role }))
  ),
];

window.Auth = {
  hashPassword,
  isOnline,

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  async login(name, password) {
    const q = norm(name).toLowerCase();
    if (!q || !password) {
      return { ok: false, error: 'กรุณากรอกชื่อและรหัสผ่าน' };
    }

    let users = [];
    if (isOnline) {
      try {
        // Small table — fetch all rows and match locally so we can trim
        // stray whitespace and match either column case-insensitively.
        // select=* keeps this working whether or not the table has
        // display_name / role columns.
        const url = `${SUPABASE_URL}/rest/v1/users?select=*`;
        const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY } });
        if (!res.ok) {
          return { ok: false, error: 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ' };
        }
        users = await res.json();
      } catch (e) {
        return { ok: false, error: 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ' };
      }
    } else {
      users = MOCK_USERS;
    }

    // Match by username OR display_name (trimmed, case-insensitive).
    const user = users.find(
      (u) => norm(u.username).toLowerCase() === q || norm(u.display_name).toLowerCase() === q
    );
    if (!user) {
      return { ok: false, error: 'ไม่พบชื่อนี้ในระบบ' };
    }

    // Accept either a plain-text password or a SHA-256 hash of it.
    const stored = norm(user.password_hash);
    const hash = await hashPassword(password);
    if (stored !== password && stored !== hash) {
      return { ok: false, error: 'รหัสผ่านไม่ถูกต้อง' };
    }

    const uname = norm(user.username) || norm(user.display_name);
    const session = {
      username: uname,
      display_name: norm(user.display_name) || uname,
      role: norm(user.role) || roleForName(uname),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, user: session };
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};
})();

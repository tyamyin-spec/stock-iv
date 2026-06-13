// Login + sign-up screen. Shown by App's route guard when there's no session.

import { useState } from 'react';
import { Icons } from '../icons';
import { Button, Field, Input, Select } from '../ui';
import { useAuth, usernameToEmail } from '../lib/auth';
import { useWards } from '../lib/data';

const POSITIONS: { v: string; l: string }[] = [
  { v: 'NA', l: 'NA - ผู้ช่วยพยาบาล' },
  { v: 'PN', l: 'PN - พยาบาลเทคนิค' },
  { v: 'RN', l: 'RN - พยาบาลวิชาชีพ' },
];

export function LoginPage() {
  const I = Icons;
  const { signIn, signUp } = useAuth();
  const { wards } = useWards();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [wardId, setWardId] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const uname = name.trim();
    if (mode === 'up') {
      if (uname.length < 2) {
        setError('กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร');
        return;
      }
      if (password.length < 3) {
        setError('รหัสผ่านอย่างน้อย 3 ตัวอักษร');
        return;
      }
      if (!position) {
        setError('กรุณาเลือกตำแหน่ง');
        return;
      }
      if (!wardId) {
        setError('กรุณาเลือกวอร์ดหลัก');
        return;
      }
    }
    setBusy(true);
    const email = usernameToEmail(uname);
    if (mode === 'in') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      // Name doubles as the login id and the display name shown in audit.
      const { error } = await signUp(email, password, uname, { ward_id: wardId, position });
      if (error) setError(error);
      else setInfo('สร้างบัญชีเรียบร้อย — เข้าสู่ระบบได้เลย');
    }
    setBusy(false);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">
            <I.IVBag size={26} />
          </div>
          <div>
            <div className="auth-brand-name">Stock IV</div>
            <div className="auth-brand-sub">ระบบจัดการสารน้ำ</div>
          </div>
        </div>

        <h1 className="auth-title">{mode === 'in' ? 'เข้าสู่ระบบ' : 'สมัครใช้งาน'}</h1>
        <p className="auth-sub muted">
          {mode === 'in'
            ? 'ใช้ชื่อและรหัสผ่านของคุณ'
            : 'สร้างบัญชีเจ้าหน้าที่ — ชื่อจะปรากฏในประวัติว่าใครลงข้อมูล'}
        </p>

        <form onSubmit={submit} className="auth-form">
          <Field label="ชื่อ" required hint={mode === 'up' ? 'ไทยหรืออังกฤษก็ได้ เช่น นภัสสร หรือ naphat' : undefined}>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น นภัสสร"
              autoComplete="username"
              autoCapitalize="none"
              required
            />
          </Field>
          {mode === 'up' && (
            <>
              <Field label="ตำแหน่ง" required>
                <Select value={position} onChange={(e) => setPosition(e.target.value)} required>
                  <option value="">เลือกตำแหน่ง</option>
                  {POSITIONS.map((p) => (
                    <option key={p.v} value={p.v}>
                      {p.l}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="วอร์ดหลัก" required>
                <Select value={wardId} onChange={(e) => setWardId(e.target.value)} required>
                  <option value="">เลือกวอร์ด</option>
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </>
          )}
          <Field label="รหัสผ่าน" required hint={mode === 'up' ? 'ขั้นต่ำ 3 ตัวอักษร' : undefined}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
              minLength={mode === 'up' ? 3 : undefined}
              required
            />
          </Field>

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}

          <Button variant="primary" size="lg" disabled={busy}>
            {busy ? 'กำลังดำเนินการ…' : mode === 'in' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </Button>

          <div className="auth-switch">
            {mode === 'in' ? (
              <>
                ยังไม่มีบัญชี?{' '}
                <button type="button" className="auth-link" onClick={() => setMode('up')}>
                  สมัครใช้งาน
                </button>
              </>
            ) : (
              <>
                มีบัญชีแล้ว?{' '}
                <button type="button" className="auth-link" onClick={() => setMode('in')}>
                  เข้าสู่ระบบ
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

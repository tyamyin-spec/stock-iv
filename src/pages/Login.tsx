// Login + sign-up screen. Shown by App's route guard when there's no session.

import { useState } from 'react';
import { Icons } from '../icons';
import { Button, Field, Input } from '../ui';
import { useAuth } from '../lib/auth';

export function LoginPage() {
  const I = Icons;
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    if (mode === 'in') {
      const { error } = await signIn(email.trim(), password);
      if (error) setError(error);
    } else {
      const { error } = await signUp(email.trim(), password, displayName.trim() || email.split('@')[0]);
      if (error) setError(error);
      else setInfo('สร้างบัญชีเรียบร้อย — ตรวจอีเมลเพื่อยืนยัน (ถ้าเปิด confirmation ไว้)');
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
            ? 'ใช้อีเมลและรหัสผ่านของโรงพยาบาล'
            : 'สร้างบัญชีใหม่สำหรับเจ้าหน้าที่ ใช้อีเมลจริงเพื่อรับการแจ้งเตือน'}
        </p>

        <form onSubmit={submit} className="auth-form">
          {mode === 'up' && (
            <Field label="ชื่อที่แสดง">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="เช่น นภัสสร อ."
                autoComplete="name"
              />
            </Field>
          )}
          <Field label="อีเมล" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hospital.go.th"
              autoComplete="email"
              required
            />
          </Field>
          <Field label="รหัสผ่าน" required hint={mode === 'up' ? 'ขั้นต่ำ 8 ตัวอักษร' : undefined}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
              minLength={mode === 'up' ? 8 : undefined}
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

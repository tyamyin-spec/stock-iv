// Login + sign-up screen. Shown by App's route guard when there's no session.

import { useState } from 'react';
import { Icons } from '../icons';
import { Button, Field, Input } from '../ui';
import { useAuth, usernameToEmail } from '../lib/auth';

export function LoginPage() {
  const I = Icons;
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const uname = username.trim();
    if (mode === 'up' && !/^[a-zA-Z0-9._-]{3,}$/.test(uname)) {
      setError('ชื่อผู้ใช้ต้องเป็นภาษาอังกฤษ/ตัวเลข อย่างน้อย 3 ตัว (เช่น somchai, nurse01)');
      return;
    }
    setBusy(true);
    const email = usernameToEmail(uname);
    if (mode === 'in') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signUp(email, password, displayName.trim() || uname);
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
            ? 'ใช้ชื่อผู้ใช้และรหัสผ่านของคุณ'
            : 'สร้างบัญชีเจ้าหน้าที่ — ชื่อที่แสดงจะปรากฏในประวัติว่าใครลงข้อมูล'}
        </p>

        <form onSubmit={submit} className="auth-form">
          {mode === 'up' && (
            <Field label="ชื่อที่แสดง (ชื่อจริง-สกุล)" hint="ภาษาไทยได้ — ใช้ระบุว่าใครเป็นคนลงข้อมูล">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="เช่น นภัสสร อ."
                autoComplete="name"
              />
            </Field>
          )}
          <Field label="ชื่อผู้ใช้" required hint={mode === 'up' ? 'ภาษาอังกฤษ/ตัวเลข เช่น somchai, nurse01' : undefined}>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="เช่น somchai"
              autoComplete="username"
              autoCapitalize="none"
              required
            />
          </Field>
          <Field label="รหัสผ่าน" required hint={mode === 'up' ? 'ขั้นต่ำ 6 ตัวอักษร' : undefined}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
              minLength={mode === 'up' ? 6 : undefined}
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

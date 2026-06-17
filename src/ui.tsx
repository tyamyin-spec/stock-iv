// UI primitives — Card, Button, Input, Select, Badge, Modal, Toast, etc.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { Icons } from './icons';

// ---------- Buttons ----------
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconRight?: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
      {icon ? <span className="btn-icon">{icon}</span> : null}
      {children ? <span>{children}</span> : null}
      {iconRight ? <span className="btn-icon">{iconRight}</span> : null}
    </button>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
};

export function IconButton({ icon, label, className = '', ...rest }: IconButtonProps) {
  return (
    <button className={`icon-btn ${className}`} aria-label={label} {...rest}>
      {icon}
    </button>
  );
}

// Action button with the icon AND a small caption underneath — clearer than an
// icon alone. Used for row actions in tables.
export function RowAction({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 6px',
        borderRadius: 8,
        color: danger ? 'var(--danger, #DC2626)' : 'var(--text-2, #475569)',
        fontSize: 10.5,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ---------- Surfaces ----------
type CardProps = {
  children?: ReactNode;
  className?: string;
  padding?: boolean;
  style?: React.CSSProperties;
};

export function Card({ children, className = '', padding = true, ...rest }: CardProps) {
  return (
    <div className={`card ${padding ? 'card-pad' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <h3>{title}</h3>
        {subtitle ? <p className="muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

// ---------- Form fields ----------
type FieldProps = {
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
};

export function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <label className="field">
      {label ? (
        <span className="field-label">
          {label}
          {required ? <span className="req"> *</span> : null}
        </span>
      ) : null}
      {children}
      {hint && !error ? <span className="field-hint">{hint}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode };

export function Input({ icon, className = '', ...rest }: InputProps) {
  if (icon) {
    return (
      <div className="input-wrap">
        <span className="input-icon">{icon}</span>
        <input className={`input has-icon ${className}`} {...rest} />
      </div>
    );
  }
  return <input className={`input ${className}`} {...rest} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode };

export function Select({ children, className = '', ...rest }: SelectProps) {
  return (
    <div className="input-wrap select-wrap">
      <select className={`input select ${className}`} {...rest}>
        {children}
      </select>
      <span className="select-caret">
        <Icons.ChevronDown size={16} />
      </span>
    </div>
  );
}

// ---------- Badges & pills ----------
type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export function Badge({ tone = 'neutral', children, icon }: { tone?: Tone; children: ReactNode; icon?: ReactNode }) {
  return (
    <span className={`badge badge-${tone}`}>
      {icon ? <span className="badge-icon">{icon}</span> : null}
      {children}
    </span>
  );
}

export function StockBadge({ qty, min }: { qty: number; min: number }) {
  if (qty === 0) return <Badge tone="danger">หมด</Badge>;
  if (qty < min) return <Badge tone="warning">ต่ำกว่าขั้นต่ำ</Badge>;
  if (qty < min * 1.5) return <Badge tone="info">กำลังพร่อง</Badge>;
  return <Badge tone="success">เพียงพอ</Badge>;
}

export function ExpiryBadge({ days }: { days: number }) {
  if (days < 0)
    return (
      <Badge tone="danger" icon={<Icons.AlertTri size={12} />}>
        หมดอายุแล้ว
      </Badge>
    );
  if (days <= 30) return <Badge tone="danger">เหลือ {days} วัน</Badge>;
  if (days <= 90) return <Badge tone="warning">เหลือ {days} วัน</Badge>;
  if (days <= 180) return <Badge tone="info">เหลือ {days} วัน</Badge>;
  return <Badge tone="neutral">{days} วัน</Badge>;
}

// ---------- Modal ----------
type ModalProps = {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal modal-${size}`} onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
          <IconButton icon={<Icons.Close size={20} />} label="ปิด" onClick={onClose} />
        </header>
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-foot">{footer}</footer> : null}
      </div>
    </div>
  );
}

// ---------- Tabs ----------
type TabItem = { value: string; label: ReactNode; count?: number };

export function Tabs({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (v: string) => void;
  items: TabItem[];
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((it) => (
        <button
          key={it.value}
          role="tab"
          aria-selected={value === it.value}
          className={`tab ${value === it.value ? 'tab-active' : ''}`}
          onClick={() => onChange(it.value)}
        >
          {it.label}
          {it.count != null ? <span className="tab-count">{it.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

// ---------- Toast ----------
type ToastTone = 'success' | 'warning' | 'danger' | 'info';
type ToastInput = { tone?: ToastTone; title: ReactNode; desc?: ReactNode; duration?: number };
type ToastItem = ToastInput & { id: string };

const ToastCtx = createContext<((t: ToastInput) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const push = (t: ToastInput) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((arr) => [...arr, { id, ...t }]);
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), t.duration || 3500);
  };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone || 'success'}`}>
            <span className="toast-icon">
              {t.tone === 'danger' ? (
                <Icons.AlertTri size={18} />
              ) : t.tone === 'warning' ? (
                <Icons.AlertTri size={18} />
              ) : t.tone === 'info' ? (
                <Icons.Info size={18} />
              ) : (
                <Icons.CheckCircle size={18} />
              )}
            </span>
            <div>
              <div className="toast-title">{t.title}</div>
              {t.desc ? <div className="toast-desc">{t.desc}</div> : null}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) return (_t: ToastInput) => {};
  return ctx;
};

// ---------- Confirmation ----------
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  desc,
  confirmLabel = 'ยืนยัน',
  tone = 'danger',
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: ReactNode;
  desc?: ReactNode;
  confirmLabel?: ReactNode;
  tone?: 'danger' | 'primary';
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{ margin: 0, color: 'var(--text-2)' }}>{desc}</p>
    </Modal>
  );
}

// ---------- Empty state ----------
export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon?: ReactNode;
  title: ReactNode;
  desc?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h4>{title}</h4>
      {desc ? <p className="muted">{desc}</p> : null}
      {action}
    </div>
  );
}

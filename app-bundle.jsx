// ===== icons.jsx =====
// Inline SVG icons — Lucide-style, 1.75 stroke
// All icons accept size and className props

const Icon = ({ size = 20, children, className = '', strokeWidth = 1.75, fill = 'none' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Icons = {
  // brand mark — water droplet
  IVBag: ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 28" fill="none" className={className} aria-hidden="true">
      <path d="M12 1.5c0 0 -8 9.5 -8 15.5a8 8 0 0 0 16 0c0 -6 -8 -15.5 -8 -15.5Z"
        fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M8 17.5a4 4 0 0 0 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".75"/>
    </svg>
  ),
  Home: ({ size, className }) => <Icon size={size} className={className}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></Icon>,
  Box:  ({ size, className }) => <Icon size={size} className={className}><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></Icon>,
  Plus: ({ size, className }) => <Icon size={size} className={className}><path d="M12 5v14M5 12h14"/></Icon>,
  Chart: ({ size, className }) => <Icon size={size} className={className}><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></Icon>,
  Bell: ({ size, className }) => <Icon size={size} className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Icon>,
  Settings: ({ size, className }) => <Icon size={size} className={className}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></Icon>,
  Search: ({ size, className }) => <Icon size={size} className={className}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>,
  Filter: ({ size, className }) => <Icon size={size} className={className}><path d="M4 5h16M7 12h10M10 19h4"/></Icon>,
  Download: ({ size, className }) => <Icon size={size} className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></Icon>,
  Edit: ({ size, className }) => <Icon size={size} className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Icon>,
  Trash: ({ size, className }) => <Icon size={size} className={className}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/></Icon>,
  Close: ({ size, className }) => <Icon size={size} className={className}><path d="M18 6 6 18M6 6l12 12"/></Icon>,
  Menu: ({ size, className }) => <Icon size={size} className={className}><path d="M3 12h18M3 6h18M3 18h18"/></Icon>,
  Calendar: ({ size, className }) => <Icon size={size} className={className}><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Icon>,
  Building: ({ size, className }) => <Icon size={size} className={className}><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></Icon>,
  AlertTri: ({ size, className }) => <Icon size={size} className={className}><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z"/><path d="M12 9v4"/><path d="M12 17h.01"/></Icon>,
  Clock: ({ size, className }) => <Icon size={size} className={className}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  ExpiredCal: ({ size, className }) => <Icon size={size} className={className}><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 6-6M15 16 9 10"/></Icon>,
  ArrowUp: ({ size, className }) => <Icon size={size} className={className}><path d="m18 15-6-6-6 6"/></Icon>,
  ArrowDown: ({ size, className }) => <Icon size={size} className={className}><path d="m6 9 6 6 6-6"/></Icon>,
  ArrowRight: ({ size, className }) => <Icon size={size} className={className}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>,
  ArrowLeft: ({ size, className }) => <Icon size={size} className={className}><path d="M19 12H5M12 19l-7-7 7-7"/></Icon>,
  Check: ({ size, className }) => <Icon size={size} className={className}><path d="m5 12 5 5L20 7"/></Icon>,
  CheckCircle: ({ size, className }) => <Icon size={size} className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></Icon>,
  Info: ({ size, className }) => <Icon size={size} className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></Icon>,
  Barcode: ({ size, className }) => <Icon size={size} className={className} strokeWidth={1.6}><path d="M3 5v14M6 5v14M8 5v14M11 5v14M13 5v10M16 5v14M18 5v14M21 5v14"/></Icon>,
  Scan: ({ size, className }) => <Icon size={size} className={className}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></Icon>,
  Flask: ({ size, className }) => <Icon size={size} className={className}><path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></Icon>,
  Clipboard: ({ size, className }) => <Icon size={size} className={className}><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6M9 18h4"/></Icon>,
  User: ({ size, className }) => <Icon size={size} className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>,
  Refresh: ({ size, className }) => <Icon size={size} className={className}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></Icon>,
  ChevronRight: ({ size, className }) => <Icon size={size} className={className}><path d="m9 18 6-6-6-6"/></Icon>,
  ChevronDown: ({ size, className }) => <Icon size={size} className={className}><path d="m6 9 6 6 6-6"/></Icon>,
  Dot: ({ size = 8, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 8 8" className={className} aria-hidden="true"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>
  ),
  Logout: ({ size, className }) => <Icon size={size} className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></Icon>,
  Print: ({ size, className }) => <Icon size={size} className={className}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14" rx="1"/></Icon>,
};

window.Icons = Icons;

// ===== ui.jsx =====
// UI primitives — Card, Button, Input, Select, Badge, Modal, etc.

const { useState, useEffect, useRef, useMemo } = React;

// ---------- Buttons ----------
function Button({ variant = 'primary', size = 'md', icon, iconRight, children, className = '', ...rest }) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
      {icon ? <span className="btn-icon">{icon}</span> : null}
      {children ? <span>{children}</span> : null}
      {iconRight ? <span className="btn-icon">{iconRight}</span> : null}
    </button>
  );
}

function IconButton({ icon, label, className = '', ...rest }) {
  return (
    <button className={`icon-btn ${className}`} aria-label={label} {...rest}>{icon}</button>
  );
}

// ---------- Surfaces ----------
function Card({ children, className = '', padding = true, ...rest }) {
  return <div className={`card ${padding ? 'card-pad' : ''} ${className}`} {...rest}>{children}</div>;
}

function SectionTitle({ title, subtitle, action }) {
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
function Field({ label, required, hint, error, children }) {
  return (
    <label className="field">
      {label ? (
        <span className="field-label">
          {label}{required ? <span className="req"> *</span> : null}
        </span>
      ) : null}
      {children}
      {hint && !error ? <span className="field-hint">{hint}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

function Input({ icon, ...rest }) {
  if (icon) {
    return (
      <div className="input-wrap">
        <span className="input-icon">{icon}</span>
        <input className="input has-icon" {...rest} />
      </div>
    );
  }
  return <input className="input" {...rest} />;
}

function Select({ children, ...rest }) {
  return (
    <div className="input-wrap select-wrap">
      <select className="input select" {...rest}>{children}</select>
      <span className="select-caret"><window.Icons.ChevronDown size={16}/></span>
    </div>
  );
}

// ---------- Badges & pills ----------
function Badge({ tone = 'neutral', children, icon }) {
  return (
    <span className={`badge badge-${tone}`}>
      {icon ? <span className="badge-icon">{icon}</span> : null}
      {children}
    </span>
  );
}

// Stock-status helper
function StockBadge({ qty, min }) {
  if (qty === 0) return <Badge tone="danger">หมด</Badge>;
  if (qty < min) return <Badge tone="warning">ต่ำกว่าขั้นต่ำ</Badge>;
  if (qty < min * 1.5) return <Badge tone="info">กำลังพร่อง</Badge>;
  return <Badge tone="success">เพียงพอ</Badge>;
}

function ExpiryBadge({ days }) {
  if (days < 0) return <Badge tone="danger" icon={<window.Icons.AlertTri size={12}/>}>หมดอายุแล้ว</Badge>;
  if (days <= 30) return <Badge tone="danger">เหลือ {days} วัน</Badge>;
  if (days <= 90) return <Badge tone="warning">เหลือ {days} วัน</Badge>;
  if (days <= 180) return <Badge tone="info">เหลือ {days} วัน</Badge>;
  return <Badge tone="neutral">{days} วัน</Badge>;
}

// ---------- Modal ----------
function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
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
          <IconButton icon={<window.Icons.Close size={20}/>} label="ปิด" onClick={onClose}/>
        </header>
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-foot">{footer}</footer> : null}
      </div>
    </div>
  );
}

// ---------- Tabs ----------
function Tabs({ value, onChange, items }) {
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
const ToastCtx = React.createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = (t) => {
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
              {t.tone === 'danger' ? <window.Icons.AlertTri size={18}/> :
               t.tone === 'warning' ? <window.Icons.AlertTri size={18}/> :
               t.tone === 'info' ? <window.Icons.Info size={18}/> :
               <window.Icons.CheckCircle size={18}/>}
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
const useToast = () => React.useContext(ToastCtx);

// ---------- Confirmation ----------
function ConfirmDialog({ open, onClose, onConfirm, title, desc, confirmLabel = 'ยืนยัน', tone = 'danger' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>ยกเลิก</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p style={{ margin: 0, color: 'var(--text-2)' }}>{desc}</p>
    </Modal>
  );
}

// ---------- Empty state ----------
function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h4>{title}</h4>
      {desc ? <p className="muted">{desc}</p> : null}
      {action}
    </div>
  );
}

Object.assign(window, {
  Button, IconButton, Card, SectionTitle, Field, Input, Select,
  Badge, StockBadge, ExpiryBadge, Modal, Tabs,
  ToastProvider, useToast, ConfirmDialog, EmptyState,
});

// ===== shell.jsx =====
// App shell — Sidebar, Topbar, Mobile tabbar

const { useState: useShellState } = React;

const NAV_ITEMS = [
  { id: 'dashboard', label: 'แดชบอร์ด', icon: 'Home' },
  { id: 'stock',     label: 'รายการคงคลัง', icon: 'Box' },
  { id: 'add',       label: 'เพิ่ม/ลงข้อมูล', icon: 'Plus' },
  { id: 'expiry',    label: 'แจ้งเตือนหมดอายุ', icon: 'AlertTri' },
  { id: 'reports',   label: 'รายงาน', icon: 'Chart' },
  { id: 'settings',  label: 'ตั้งค่า', icon: 'Settings' },
];

function initials(name) {
  const s = (name || '').trim();
  if (!s) return '?';
  return s.slice(0, 2);
}

window.roleLabel = function (role) {
  const r = (role || '').trim();
  const map = {
    RN: 'พยาบาลวิชาชีพ (RN)',
    TN: 'พยาบาลเทคนิค (TN)',
    PN: 'ผู้ช่วยพยาบาล (PN)',
    NA: 'ผู้ช่วยเหลือคนไข้ (NA)',
    admin: 'ผู้ดูแลระบบ',
  };
  return map[r] || r || 'เจ้าหน้าที่';
};

// Count items that are expired or expiring within 180 days (live, from real data).
window.expiryAlertCount = function () {
  const stock = window.STOCK || [];
  return stock.filter((x) => {
    const d = window.daysFromToday(x.exp);
    return typeof d === 'number' && !isNaN(d) && d <= 180;
  }).length;
};

function Sidebar({ active, onNavigate, user, onLogout }) {
  const I = window.Icons;
  const badges = { expiry: window.expiryAlertCount() };
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><I.IVBag size={22}/></div>
        <div className="brand-text">
          <span className="name">Stock IV</span>
          <span className="sub">ระบบจัดการสารน้ำ</span>
        </div>
      </div>

      <nav className="side-nav" aria-label="เมนูหลัก">
        <div className="side-section-label">เมนูหลัก</div>
        {NAV_ITEMS.slice(0, 5).map((it) => {
          const Ico = I[it.icon];
          const badge = badges[it.id];
          return (
            <button
              key={it.id}
              className="side-link"
              aria-current={active === it.id ? 'page' : undefined}
              onClick={() => onNavigate(it.id)}
            >
              <Ico size={19}/>
              <span>{it.label}</span>
              {badge ? <span className="nav-badge">{badge}</span> : null}
            </button>
          );
        })}

        <div className="side-section-label">ระบบ</div>
        <button
          className="side-link"
          aria-current={active === 'settings' ? 'page' : undefined}
          onClick={() => onNavigate('settings')}
        >
          <I.Settings size={19}/><span>ตั้งค่า</span>
        </button>
      </nav>

      <div className="side-foot">
        <div className="side-user">
          <div className="avatar">{initials(user?.display_name)}</div>
          <div className="who">
            <div className="name">{user?.display_name || 'ผู้ใช้'}</div>
            <div className="role">{window.roleLabel(user?.role)}</div>
          </div>
          <button className="icon-btn" aria-label="ออกจากระบบ" title="ออกจากระบบ" onClick={onLogout}>
            <I.Logout size={18}/>
          </button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, crumb, onOpenSearch, onOpenNotifs, onOpenMenu, notifCount, user, onLogout }) {
  const I = window.Icons;
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <window.IconButton
          icon={<I.Menu size={20}/>}
          label="เมนู"
          className="menu-btn bordered"
          onClick={onOpenMenu}
        />
        <div className="topbar-title">
          {crumb ? <span className="crumb">{crumb}</span> : null}
          <h2>{title}</h2>
        </div>

        <div className="topbar-search">
          <window.Input
            icon={<I.Search size={16}/>}
            placeholder="ค้นหา รหัส / ชื่อสารน้ำ / Lot..."
            onFocus={onOpenSearch}
          />
        </div>

        <div className="topbar-actions">
          <window.IconButton icon={<I.Scan size={20}/>} label="สแกนบาร์โค้ด" className="bordered" onClick={() => window.dispatchEvent(new Event('open-scan'))}/>
          <button className="icon-btn bordered topbar-bell" aria-label="การแจ้งเตือน" onClick={onOpenNotifs}>
            <I.Bell size={20}/>
            {notifCount > 0 ? <span className="badge-dot"></span> : null}
          </button>
          <button className="topbar-profile" aria-label="ออกจากระบบ" title="ออกจากระบบ" onClick={onLogout}>
            <div className="avatar">{initials(user?.display_name)}</div>
            <div className="who">
              <span className="name">{user?.display_name || 'ผู้ใช้'}</span>
              <span className="role">{window.roleLabel(user?.role)}</span>
            </div>
            <I.Logout size={14}/>
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileTabbar({ active, onNavigate }) {
  const I = window.Icons;
  const tabs = [
    { id: 'dashboard', label: 'หน้าหลัก',  icon: 'Home' },
    { id: 'stock',     label: 'คงคลัง',    icon: 'Box' },
    { id: 'add',       label: 'เพิ่ม',     icon: 'Plus' },
    { id: 'expiry',    label: 'หมดอายุ',   icon: 'AlertTri' },
    { id: 'reports',   label: 'รายงาน',    icon: 'Chart' },
  ];
  return (
    <nav className="mobile-tabbar" aria-label="แท็บมือถือ">
      {tabs.map((t) => {
        const Ico = I[t.icon];
        return (
          <button
            key={t.id}
            className="mobile-tab"
            aria-current={active === t.id ? 'page' : undefined}
            onClick={() => onNavigate(t.id)}
          >
            <span className="tab-nub"></span>
            <Ico size={22}/>
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// Notifications drawer
function NotificationsDrawer({ open, onClose }) {
  const I = window.Icons;
  if (!open) return null;
  const items = window.NOTIFICATIONS;
  const kindIcon = { danger: <I.AlertTri size={18}/>, warning: <I.Clock size={18}/>, info: <I.Info size={18}/> };
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}></div>
      <aside className="drawer" role="dialog" aria-label="การแจ้งเตือน">
        <header className="drawer-head">
          <div>
            <h3>การแจ้งเตือน</h3>
            <p className="muted">{items.length} รายการ · อัปเดตล่าสุด 09:42</p>
          </div>
          <window.IconButton icon={<I.Close size={20}/>} label="ปิด" onClick={onClose}/>
        </header>
        <div className="drawer-body">
          <div className="col" style={{ gap: 8 }}>
            {items.map((n) => (
              <div key={n.id} className={`notif notif-${n.kind}`}>
                <div className="notif-icon">{kindIcon[n.kind]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-meta">{n.meta} · {n.ts}</div>
                </div>
                <button className="notif-link">ดู</button>
              </div>
            ))}
          </div>
        </div>
        <footer className="drawer-foot">
          <window.Button variant="ghost" onClick={onClose}>ปิด</window.Button>
          <window.Button variant="secondary">ทำเครื่องหมายอ่านทั้งหมด</window.Button>
        </footer>
      </aside>
    </>
  );
}

Object.assign(window, { Sidebar, Topbar, MobileTabbar, NotificationsDrawer, NAV_ITEMS });

// ===== page-dashboard.jsx =====
// Dashboard v3 — animated, interactive, bigger
// KPI cards with count-up + sparkline · animated donut/bars · hover details

const { useState: uS, useMemo: uM, useEffect: uE, useRef: uR } = React;

/* ============================================================
   Animation helpers
   ============================================================ */

// Count-up — disabled (just returns target directly) to avoid React 18 dev mode unmount issues
function useCountUp(target) {
  return target;
}

// Reveal "in" once on mount — used for CSS class triggers
function useMountIn(delay = 0) {
  const [on, setOn] = uS(false);
  uE(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, []);
  return on;
}

/* ============================================================
   Main page
   ============================================================ */

function DashboardPage({ onNavigate, onOpenAdd, onOpenScan }) {
  const I = window.Icons;
  const [ward, setWard] = uS('all');
  const [date, setDate] = uS({ y: 2567, m: 5, d: 21 });
    const [dbVersion, setDbVersion] = uS(0);
    uE(() => {
          const onDbUpdate = () => setDbVersion(v => v + 1);
          window.addEventListener('dbupdate', onDbUpdate);
          window.addEventListener('stocksUpdated', onDbUpdate);
          return () => {
                  window.removeEventListener('dbupdate', onDbUpdate);
                  window.removeEventListener('stocksUpdated', onDbUpdate);
          };
    }, []);
  const [usageRange, setUsageRange] = uS('14d');

  // Date-based variation factor (deterministic from date for demo)
  // Today (21 พ.ค.) = 1.0; earlier dates show slightly different snapshots
  const dateFactor = uM(() => {
    const today = { y: 2567, m: 5, d: 21 };
    const daysAgo = (today.y - date.y) * 365 + (today.m - date.m) * 30 + (today.d - date.d);
    // Deterministic pseudo-variation: ±10% based on day-of-year
    const dayOfYear = (date.m - 1) * 30 + date.d;
    const variation = Math.sin(dayOfYear * 0.7) * 0.08 + (daysAgo === 0 ? 0 : -daysAgo * 0.005);
    return 1 + variation;
  }, [date]);

  const isToday = date.y === 2567 && date.m === 5 && date.d === 21;

  // Ward-filtered + date-adjusted data
  const wardData = uM(() => {
    const all = window.STOCK;
    const filtered = ward === 'all' ? all : all.filter((x) => x.ward === ward);

    const baseTotal = filtered.reduce((s, x) => s + x.qty, 0);
    const total = Math.round(baseTotal * dateFactor);
    const lowStock = Math.max(0, Math.round(filtered.filter((x) => x.qty < x.min).length * (1 + (1 - dateFactor) * 2)));
    const withDays = filtered.map((x) => ({ ...x, days: window.daysFromToday(x.exp) }));
    const expSoon = withDays.filter((x) => x.days >= 0 && x.days <= 220).length;
    const expired = isToday ? withDays.filter((x) => x.days < 0).length : Math.max(0, withDays.filter((x) => x.days < 0).length - 1);

    // Stock by type for filtered set
    const byType = {};
    filtered.forEach((x) => {
      const key = x.code === '5DN2' ? '5%D/N/2' : x.code === '3NaCl' ? '3%NaCl' : x.code === 'D5W' ? 'DSW' : x.code;
      byType[key] = (byType[key] || 0) + x.qty;
    });
    const stockByType = Object.entries(byType)
      .map(([code, qty]) => ({ code, qty: Math.round(qty * dateFactor) }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // Usage scaling: ward share * date factor
    const totalAll = all.reduce((s, x) => s + x.qty, 0);
    const wardShare = ward === 'all' ? 1 : (baseTotal / totalAll);
    const usage30d = window.TYPE_USAGE_30D.map((d) => ({ ...d, qty: Math.max(1, Math.round(d.qty * wardShare * dateFactor)) }));
    const rawUsage = usageRange === '7d' ? window.USAGE_30D.slice(-7)
                   : usageRange === '30d' ? window.USAGE_30D
                   : window.USAGE_30D.slice(-14);
    const usageDaily = rawUsage.map((v, i) => {
      const seed = Math.sin((date.d * 31 + i) * 0.5) * 0.15;
      return Math.max(1, Math.round(v * wardShare * (1 + seed)));
    });

    const expiringItems = withDays
      .filter((x) => x.days >= 0 && x.days <= 220)
      .sort((a, b) => a.days - b.days)
      .slice(0, 5);

    const wardChartData = ward === 'all'
      ? window.STOCK_BY_WARD.map((w) => ({ ...w, qty: Math.round(w.qty * dateFactor) }))
      : window.STOCK_BY_WARD.map((w) => ({ ...w, qty: w.id === ward ? total : 0 })).filter((w) => w.qty > 0);

    return { total, lowStock, expSoon, expired, stockByType, usage30d, usageDaily, expiringItems, wardChartData, wardShare };
  }, [ward, dateFactor, isToday, date.d, usageRange, dbVersion]);

  // Hero values
  const stockSemiSX = Math.round((window.STOCK_BY_WARD.find((w) => w.id === 'semi-sx')?.qty || 0) * dateFactor);
  const stockSurgM  = Math.round((window.STOCK_BY_WARD.find((w) => w.id === 'surg-male')?.qty || 0) * dateFactor);
  const totalStock  = stockSemiSX + stockSurgM;

  const heroTotal = ward === 'all' ? totalStock : wardData.total;
  const heroLabel = ward === 'all' ? 'Stock รวมทั้งหมด' : `Stock ${window.WARDS.find((w) => w.id === ward)?.name}`;

  const sparks = {
    total: (() => { const t = totalStock || 0; return [t,t,t,t,t,t,t]; })(),
            semi:  (() => { const s = Math.round((window.STOCK_BY_WARD.find(w => w.id === 'semi-sx')?.qty || 0)); return [s,s,s,s,s,s,s]; })(),
            surg:  (() => { const s = Math.round((window.STOCK_BY_WARD.find(w => w.id === 'surg-male')?.qty || 0)); return [s,s,s,s,s,s,s]; })(),
            low:   [0,0,0,0,0,0,0],
            soon:  [0,0,0,0,0,0,0],
            expd:  [0,0,0,0,0,0,0],
  };

  const wardName = window.WARDS.find((w) => w.id === ward)?.name;
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const dateLabel = `${date.d} ${months[date.m - 1]} ${date.y}`;
  const filterBadge = (ward !== 'all' || !isToday) && (
    <div className="filter-badge-row">
      {ward !== 'all' && (
        <span className="filter-badge">
          <I.Filter size={12}/> วอร์ด: <b>{wardName}</b>
          <button onClick={() => setWard('all')} aria-label="ล้างตัวกรอง"><I.Close size={12}/></button>
        </span>
      )}
      {!isToday && (
        <span className="filter-badge filter-badge-date">
          <I.Calendar size={12}/> ข้อมูลย้อนหลัง: <b>{dateLabel}</b>
          <button onClick={() => setDate({ y: 2567, m: 5, d: 21 })} aria-label="กลับวันนี้"><I.Close size={12}/></button>
        </span>
      )}
    </div>
  );

  return (
    <div className="dash-root">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-title">
          <h1>ภาพรวมระบบ</h1>
          <p>สรุปคงคลังและการใช้สารน้ำของวอร์ดที่รับผิดชอบ</p>
        </div>
        <div className="dash-header-actions">
          <DateBadge date={date} onChange={setDate}/>
          <WardSelector value={ward} onChange={setWard}/>
          <window.Button variant="primary" icon={<I.Plus size={18}/>} onClick={onOpenAdd}>เพิ่มสารน้ำ</window.Button>
        </div>
      </div>

      {filterBadge}

      {/* Section 1: KPI primary */}
      <div className="kpi-section">
        <div className="kpi-section-head"><h3>ภาพรวมสต็อก</h3><span className="muted">เทียบเดือนที่แล้ว</span></div>
        <div className="kpi-row-3">
          <KpiHero idx={0} tone="primary" icon={<I.Box size={28}/>} label={heroLabel} value={heroTotal} unit="ขวด" trend={12} spark={sparks.total} highlight/>
          <KpiHero idx={1} tone="info" icon={<I.Building size={28}/>} label="SEMI SX" value={stockSemiSX} unit="ขวด" trend={10} spark={sparks.semi} dim={ward !== 'all' && ward !== 'semi-sx'} active={ward === 'semi-sx'}/>
          <KpiHero idx={2} tone="teal" icon={<BedIcon size={28}/>} label="ศัลยกรรมชาย" value={stockSurgM} unit="ขวด" trend={15} spark={sparks.surg} dim={ward !== 'all' && ward !== 'surg-male'} active={ward === 'surg-male'}/>
        </div>
      </div>

      {/* Section 2: KPI alerts */}
      <div className="kpi-section">
        <div className="kpi-section-head"><h3>การแจ้งเตือน</h3><span className="muted">{wardData.lowStock + wardData.expSoon + wardData.expired} รายการต้องการความสนใจ</span></div>
        <div className="kpi-row-3">
          <KpiAlert idx={0} tone="danger" icon={<I.AlertTri size={28}/>} label="ต่ำกว่าขั้นต่ำ" value={wardData.lowStock} unit="รายการ" desc="ควรเบิกเพิ่มภายในวันนี้" spark={sparks.low} onClick={() => onNavigate('stock')}/>
          <KpiAlert idx={1} tone="warning" icon={<I.Clock size={28}/>} label="ใกล้หมดอายุ" value={wardData.expSoon}  unit="รายการ" desc="ภายใน 7 เดือนข้างหน้า" spark={sparks.soon} onClick={() => onNavigate('expiry')}/>
          <KpiAlert idx={2} tone="danger" icon={<I.ExpiredCal size={28}/>} label="หมดอายุแล้ว" value={wardData.expired} unit="รายการ" desc="ต้องนำออกจากคลังทันที" spark={sparks.expd} onClick={() => onNavigate('expiry')}/>
        </div>
      </div>

      {/* Section 3: 3 charts */}
      <div className="dash-chart-row">
        <window.Card className="chart-card">
          <div className="dash-chart-head">
            <div>
              <h3 className="dash-chart-title">คงเหลือแยกตามวอร์ด</h3>
              <p className="muted" style={{ fontSize: 12.5 }}>สัดส่วน {ward === 'all' ? totalStock : wardData.total} ขวด{ward !== 'all' ? ` (${wardName})` : ' ทั้งหมด'}</p>
            </div>
          </div>
          <DonutByWard data={ward === 'all' ? window.STOCK_BY_WARD : wardData.wardChartData} highlightId={ward !== 'all' ? ward : null}/>
        </window.Card>

        <window.Card className="chart-card">
          <div className="dash-chart-head">
            <div>
              <h3 className="dash-chart-title">คงเหลือแยกตามชนิดสารน้ำ</h3>
              <p className="muted" style={{ fontSize: 12.5 }}>หน่วย: ขวด{ward !== 'all' ? ` · ${wardName}` : ''}</p>
            </div>
          </div>
          {wardData.stockByType.length > 0
            ? <VerticalBarChart data={wardData.stockByType}/>
            : <window.EmptyState icon={<I.Box size={24}/>} title="ไม่พบข้อมูล" desc="วอร์ดนี้ยังไม่มีสารน้ำคงเหลือ"/>
          }
        </window.Card>

      </div>

      {/* Section 4: Usage timeline */}
      <window.Card>
        <div className="dash-chart-head">
          <div>
            <h3 className="dash-chart-title">แนวโน้มการเบิกใช้ {usageRange === '7d' ? '7' : usageRange === '30d' ? '30' : '14'} วันล่าสุด</h3>
            <p className="muted" style={{ fontSize: 12.5 }}>เลื่อนเมาส์ที่แท่งเพื่อดูข้อมูล{ward !== 'all' ? ` · ${wardName}` : ''}</p>
          </div>
          <UsageRangeToggle value={usageRange} onChange={setUsageRange}/>
        </div>
        <UsageBarChart data={wardData.usageDaily} range={usageRange}/>
      </window.Card>

      {/* Section 5: Expiring table */}
      <div className="dash-bottom-row">
        <window.Card>
          <h3 className="dash-chart-title">
            <span style={{ color: 'var(--warning)' }}><I.AlertTri size={18}/></span>
            สารน้ำใกล้หมดอายุ <span className="muted">(เรียงจากใกล้สุด{ward !== 'all' ? ` · ${wardName}` : ''})</span>
          </h3>
          {wardData.expiringItems.length === 0 ? (
            <window.EmptyState icon={<I.CheckCircle size={24}/>} title="ไม่มีรายการใกล้หมดอายุ" desc={`${wardName || 'ทุกวอร์ด'}อยู่ในสภาพปลอดภัย`}/>
          ) : (
            <div className="table-wrap" style={{ marginTop: 6 }}>
              <table className="table dash-table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>ชื่อสารน้ำ</th>
                    <th>Lot No.</th>
                    <th>วันหมดอายุ</th>
                    <th className="num">เหลืออีก</th>
                    <th>วอร์ด</th>
                    <th className="num">คงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {wardData.expiringItems.map((x, i) => (
                    <tr key={x.id} onClick={() => onNavigate('expiry')} style={{ cursor: 'pointer', animationDelay: `${i * 40}ms` }} className="reveal-row">
                      <td className="col-code">{x.id}</td>
                      <td>{x.name}</td>
                      <td className="mono">{x.lot}</td>
                      <td className="mono">{x.exp.split('-').reverse().join('/')}</td>
                      <td className="num">
                        <span className={`days-pill ${x.days < 30 ? 'days-urgent' : x.days < 90 ? 'days-warn' : 'days-ok'}`}>{x.days} วัน</span>
                      </td>
                      <td>{window.WARDS.find((w) => w.id === x.ward)?.name}</td>
                      <td className="num"><b>{x.qty}</b> <span className="muted">ขวด</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </window.Card>
      </div>

      {/* Footnote */}
      <div className="dash-footnote">
        <I.Info size={16}/>
        <span><b>หมายเหตุ:</b> ข้อมูลอัปเดตอัตโนมัติจากรายการเคลื่อนไหวล่าสุด · อัปเดตล่าสุด 10:30 น.</span>
      </div>
    </div>
  );
}

/* ============================================================
   KPI hero card (with sparkline + count-up + trend pill)
   ============================================================ */
function KpiHero({ idx = 0, tone = 'primary', icon, label, value, unit, trend, spark, highlight, dim, active }) {
  const I = window.Icons;
  const animated = useCountUp(value, 900);
  const mounted = useMountIn(idx * 70);
  return (
    <div className={`kpi-hero kpi-hero-${tone} ${highlight ? 'is-highlight' : ''} ${dim ? 'is-dim' : ''} ${active ? 'is-active' : ''} ${mounted ? 'is-in' : ''}`}>
      <div className="kpi-hero-icon">{icon}</div>
      <div className="kpi-hero-content">
        <div className="kpi-hero-label">{label}</div>
        <div className="kpi-hero-stack">
          <span className="kpi-hero-value mono">{animated.toLocaleString('en-US')}</span>
          <span className="kpi-hero-unit">{unit}</span>
        </div>
        <div className="kpi-hero-foot">
          <span className={`trend-pill trend-up`}><I.ArrowUp size={11}/> {trend}%</span>
          <span className="muted">จากเดือนที่แล้ว</span>
        </div>
      </div>
      <div className="kpi-hero-spark">
        <Sparkline data={spark} tone={tone}/>
      </div>
    </div>
  );
}

/* ============================================================
   KPI alert card
   ============================================================ */
function KpiAlert({ idx = 0, tone = 'danger', icon, label, value, unit, desc, spark, onClick }) {
  const I = window.Icons;
  const animated = useCountUp(value, 700);
  const mounted = useMountIn(idx * 70);
  return (
    <div className={`kpi-alert kpi-alert-${tone} ${mounted ? 'is-in' : ''}`} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className="kpi-alert-head">
        <div className="kpi-alert-icon">{icon}</div>
        <div className={`kpi-alert-pulse pulse-${tone}`}><span></span></div>
      </div>
      <div className="kpi-alert-label">{label}</div>
      <div className="kpi-alert-value-row">
        <span className="kpi-alert-value mono">{animated}</span>
        <span className="kpi-alert-unit">{unit}</span>
      </div>
      <div className="kpi-alert-desc">{desc}</div>
      <div className="kpi-alert-spark"><Sparkline data={spark} tone={tone} h={26}/></div>
      <div className="kpi-alert-cta">
        ดูรายการ <I.ChevronRight size={14}/>
      </div>
    </div>
  );
}

/* ============================================================
   Sparkline mini-chart
   ============================================================ */
function Sparkline({ data, tone = 'primary', h = 36 }) {
  const w = 110;
  const min = Math.min(...data), max = Math.max(...data);
  const rng = Math.max(1, max - min);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / rng) * h * 0.85 - h * 0.075;
    return [x, y];
  });
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const fillPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
  const colors = {
    primary: '#1E6FEB', info: '#0EA5E9', teal: '#22C5B0',
    danger: '#DC2626', warning: '#F59E0B', success: '#16A34A',
  };
  const c = colors[tone] || colors.primary;
  const gradId = `spk-${tone}-${data.join('-').slice(0, 12)}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity=".25"/>
          <stop offset="100%" stopColor={c} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradId})`}/>
      <path d={linePath} fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={c}/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="6" fill={c} opacity=".25"/>
    </svg>
  );
}

/* ============================================================
   Bed icon
   ============================================================ */
function BedIcon({ size = 24, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 6v14M22 12v8M2 14h20M2 18h20"/>
      <circle cx="8" cy="11" r="2.4"/>
      <path d="M12 14V9h7a3 3 0 0 1 3 3v2"/>
    </svg>
  );
}

/* ============================================================
   Header bits
   ============================================================ */
function DateBadge({ date, onChange }) {
  const I = window.Icons;
  const [open, setOpen] = uS(false);
  const ref = uR(null);

  uE(() => {
    if (!open) return;
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const months = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  return (
    <div ref={ref} className="header-badge header-badge-clickable" style={{ position: 'relative' }}>
      <button className="header-badge-btn" onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open}>
        <div className="header-badge-icon"><I.Calendar size={18}/></div>
        <div>
          <div className="header-badge-label">วันที่</div>
          <div className="header-badge-value">{date.d} {months[date.m - 1]} {date.y}</div>
        </div>
        <I.ChevronDown size={16} className="muted" style={{ marginLeft: 4, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}/>
      </button>
      {open && <DatePopover date={date} onChange={(d) => { onChange(d); setOpen(false); }}/>}
    </div>
  );
}

function DatePopover({ date, onChange }) {
  const I = window.Icons;
  const [view, setView] = uS({ y: date.y, m: date.m });
  const months = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const weekDays = ['อา','จ','อ','พ','พฤ','ศ','ส'];

  // Calculate first day of month and days in month (BE year → AD: y - 543)
  const firstDay = new Date(view.y - 543, view.m - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(view.y - 543, view.m, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => setView((v) => v.m === 1 ? { y: v.y - 1, m: 12 } : { y: v.y, m: v.m - 1 });
  const next = () => setView((v) => v.m === 12 ? { y: v.y + 1, m: 1 } : { y: v.y, m: v.m + 1 });

  return (
    <div className="date-popover">
      <div className="date-popover-head">
        <button onClick={prev} className="icon-btn"><I.ChevronRight size={16} style={{ transform: 'rotate(180deg)' }}/></button>
        <div className="date-popover-title">{months[view.m - 1]} {view.y}</div>
        <button onClick={next} className="icon-btn"><I.ChevronRight size={16}/></button>
      </div>
      <div className="date-popover-grid">
        {weekDays.map((d, i) => <div key={i} className="date-cell date-cell-head">{d}</div>)}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} className="date-cell"></div>;
          const isSelected = d === date.d && view.m === date.m && view.y === date.y;
          const isToday = d === 21 && view.m === 5 && view.y === 2567;
          return (
            <button key={i}
              className={`date-cell date-cell-day ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
              onClick={() => onChange({ y: view.y, m: view.m, d })}>
              {d}
            </button>
          );
        })}
      </div>
      <div className="date-popover-foot">
        <button className="btn btn-ghost btn-sm" onClick={() => onChange({ y: 2567, m: 5, d: 21 })}>วันนี้</button>
      </div>
    </div>
  );
}
function WardSelector({ value, onChange }) {
  const I = window.Icons;
  return (
    <div className="header-badge header-badge-select">
      <div className="header-badge-icon"><I.Building size={18}/></div>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="เลือกวอร์ด">
        {window.WARDS.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
      </select>
      <I.ChevronDown size={16} className="muted"/>
    </div>
  );
}

/* ============================================================
   Donut chart by ward (animated + interactive)
   ============================================================ */
function DonutByWard({ data, highlightId }) {
  const [hover, setHover] = uS(null);
  const mounted = useMountIn(150);
  const total = data.reduce((s, x) => s + x.qty, 0);
  const r = 64, R = 96, cx = 110, cy = 110;
  let cum = 0;
  const slices = data.map((d) => {
    const start = cum / total;
    cum += d.qty;
    const end = cum / total;
    return { ...d, start, end };
  });
  const arc = (start, end, expand = false) => {
    const exp = expand ? 6 : 0;
    const Rx = R + exp;
    const a0 = start * 2 * Math.PI - Math.PI / 2;
    const a1 = end   * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + Rx * Math.cos(a0), y0 = cy + Rx * Math.sin(a0);
    const x1 = cx + Rx * Math.cos(a1), y1 = cy + Rx * Math.sin(a1);
    const x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1);
    const x3 = cx + r * Math.cos(a0), y3 = cy + r * Math.sin(a0);
    const large = (end - start) > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${Rx} ${Rx} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${r} ${r} 0 ${large} 0 ${x3} ${y3} Z`;
  };
  const hovered = hover !== null ? slices[hover] : null;
  const displayQty = hovered ? hovered.qty : total;
  const displayLabel = hovered ? hovered.name : 'รวมทั้งหมด';
  const displayPct = hovered ? ((hovered.end - hovered.start) * 100).toFixed(1) : null;
  const animatedQty = useCountUp(displayQty, 500);

  return (
    <div className="donut-block">
      <div className={`donut-svg ${mounted ? 'is-in' : ''}`}>
        <svg viewBox="0 0 220 220" width="100%" height="100%">
          {slices.map((s, i) => {
            const isHighlightedByProp = highlightId === s.id;
            const isDimByProp = highlightId && highlightId !== s.id;
            return (
              <path
                key={s.id}
                d={arc(s.start, s.end, hover === i || isHighlightedByProp)}
                fill={s.color}
                stroke="#fff"
                strokeWidth="1.5"
                opacity={isDimByProp ? .3 : (hover !== null && hover !== i ? .4 : 1)}
                style={{ cursor: 'pointer', transition: 'opacity .15s, d .2s' }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize="11.5" fill="#7B8AA0">{displayLabel}</text>
          <text x={cx} y={cy + 18} textAnchor="middle" fontSize="32" fontWeight="700" fill="#0B1F3A" fontFamily="var(--mono)">{animatedQty.toLocaleString('en-US')}</text>
          <text x={cx} y={cy + 38} textAnchor="middle" fontSize="11" fill="#7B8AA0">ขวด{displayPct ? ` · ${displayPct}%` : ''}</text>
        </svg>
      </div>
      <div className="donut-legend">
        {slices.map((s, i) => (
          <div key={s.id}
            className={`donut-legend-item ${hover === i ? 'is-active' : ''}`}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="dot" style={{ background: s.color }}></span>
            <div style={{ flex: 1 }}>
              <div className="legend-name">{s.name}</div>
              <div className="legend-value mono"><b>{s.qty}</b> <span className="muted">ขวด · {((s.end - s.start)*100).toFixed(1)}%</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Vertical bar chart (stock by type) — animated + hover
   ============================================================ */
function VerticalBarChart({ data }) {
  const [hover, setHover] = uS(null);
  const mounted = useMountIn(200);
  const max = Math.max(...data.map((d) => d.qty));
  const stepY = max <= 100 ? 25 : max <= 250 ? 50 : 100;
  const yMax = Math.ceil(max / stepY) * stepY;
  const yTicks = [];
  for (let v = 0; v <= yMax; v += stepY) yTicks.push(v);

  const w = 400, h = 240, pad = { l: 36, r: 8, t: 32, b: 30 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const barW = innerW / data.length;

  return (
    <div className="vbar-block">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="vbarG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1E6FEB"/>
            <stop offset="100%" stopColor="#60A5FA"/>
          </linearGradient>
          <linearGradient id="vbarH" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1746A1"/>
            <stop offset="100%" stopColor="#1E6FEB"/>
          </linearGradient>
        </defs>
        {yTicks.map((v) => {
          const y = pad.t + innerH - (v / yMax) * innerH;
          return (
            <g key={v}>
              <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#EEF3F8" strokeWidth="1"/>
              <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="10.5" fill="#7B8AA0" fontFamily="var(--mono)">{v}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const fullBh = (d.qty / yMax) * innerH;
          const bh = mounted ? fullBh : 0;
          const x = pad.l + i * barW + barW * 0.22;
          const bw = barW * 0.56;
          const y = pad.t + innerH - bh;
          const isHover = hover === i;
          return (
            <g key={d.code} style={{ cursor: 'pointer' }}
               onMouseEnter={() => setHover(i)}
               onMouseLeave={() => setHover(null)}>
              <rect x={pad.l + i * barW} y={pad.t} width={barW} height={innerH} fill="transparent"/>
              <rect x={x} y={y} width={bw} height={bh} rx="4"
                fill={isHover ? 'url(#vbarH)' : 'url(#vbarG)'}
                opacity={hover !== null && !isHover ? .5 : 1}
                style={{ transition: `height .7s cubic-bezier(.16,1,.3,1) ${i * 80}ms, y .7s cubic-bezier(.16,1,.3,1) ${i * 80}ms, opacity .15s, fill .15s` }}/>
              <text x={x + bw / 2} y={y - 8} textAnchor="middle"
                fontSize={isHover ? 14 : 12.5}
                fontWeight="700"
                fill={isHover ? '#1746A1' : '#1E6FEB'}
                fontFamily="var(--mono)"
                style={{ opacity: mounted ? 1 : 0, transition: `opacity .3s ease ${i * 80 + 400}ms, font-size .12s, fill .12s` }}>{d.qty}</text>
              <text x={x + bw / 2} y={h - 10} textAnchor="middle"
                fontSize="11"
                fill={isHover ? '#0B1F3A' : '#475569'}
                fontWeight={isHover ? 600 : 500}>{d.code}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ============================================================
   Horizontal bar chart — animated + interactive
   ============================================================ */
function HorizontalBarChart({ data }) {
  const [hover, setHover] = uS(null);
  const mounted = useMountIn(250);
  const max = Math.max(...data.map((d) => d.qty));
  const total = data.reduce((s, d) => s + d.qty, 0);
  return (
    <div className="hbar-block">
      {data.map((d, i) => {
        // Cap visual fill at 80% so value text always has room to the right
        const pct = (d.qty / max) * 80;
        const sharePct = ((d.qty / total) * 100).toFixed(1);
        const color = i === 0 ? '#6D5BE3' : i === 1 ? '#8576EB' : i === 2 ? '#A696F0' : i === 3 ? '#BDB1F4' : '#D4CBF7';
        const isHover = hover === i;
        return (
          <div key={d.code} className={`hbar-row ${isHover ? 'is-hover' : ''}`}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <div className="hbar-label">{d.code}</div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{
                width: mounted ? `${pct}%` : '0%',
                background: color,
                transitionDelay: `${i * 90}ms`,
              }}></div>
              <div className="hbar-value mono" style={{
                left: mounted ? `calc(${pct}% + 10px)` : '10px',
                transitionDelay: `${i * 90}ms`,
              }}>
                <b>{d.qty}</b>
                {isHover && <span className="muted" style={{ fontSize: 11, marginLeft: 6 }}>({sharePct}%)</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Usage 14-day chart (interactive, with tooltip)
   ============================================================ */
function UsageRangeToggle({ value, onChange }) {
  return (
    <div className="segmented">
      {['7d', '14d', '30d'].map((opt) => (
        <button key={opt} aria-pressed={value === opt} onClick={() => onChange(opt)}>{opt === '7d' ? '7 วัน' : opt === '14d' ? '14 วัน' : '30 วัน'}</button>
      ))}
    </div>
  );
}

function UsageBarChart({ data, range = '14d' }) {
  const [hover, setHover] = uS(null);
  const mounted = useMountIn(300);
  const max = data.length ? Math.max(Math.max(...data), 1) : 1;
  const avg = data.length ? data.reduce((s, x) => s + x, 0) / data.length : 0;
  const w = 800, h = 240, pad = { l: 36, r: 12, t: 24, b: 30 };
  const barW = (w - pad.l - pad.r) / data.length;
  const innerH = h - pad.t - pad.b;
  const today = new Date(2024, 4, 21);
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const dateFor = (i) => { const d = new Date(today); d.setDate(d.getDate() - (data.length - 1 - i)); return d; };
  // Label density: show every Nth label so they don't overlap
  const labelStep = data.length <= 7 ? 1 : data.length <= 14 ? 2 : 4;

  return (
    <div className="chart-wrap" style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="ubarG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#A5B4FC"/>
            <stop offset="100%" stopColor="#818CF8"/>
          </linearGradient>
          <linearGradient id="ubarToday" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366F1"/>
            <stop offset="100%" stopColor="#4F46E5"/>
          </linearGradient>
          <linearGradient id="ubarH" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5"/>
            <stop offset="100%" stopColor="#312E81"/>
          </linearGradient>
        </defs>
        {[0, .25, .5, .75, 1].map((p, i) => {
          const y = pad.t + innerH - p * innerH;
          const v = Math.round(max * p);
          return (
            <g key={i}>
              <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#EEF3F8" strokeWidth="1"/>
              <text x={pad.l - 8} y={y + 4} fontSize="10.5" fill="#7B8AA0" textAnchor="end" fontFamily="var(--mono)">{v}</text>
            </g>
          );
        })}
        {(() => {
          const y = pad.t + innerH - (avg / max) * innerH;
          return <>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#C4B5FD" strokeDasharray="4 4" strokeWidth="1.5"/>
            <text x={w - pad.r - 4} y={y - 6} fontSize="10" fill="#7C3AED" textAnchor="end" fontFamily="var(--mono)">เฉลี่ย {avg.toFixed(1)}</text>
          </>;
        })()}
        {data.map((v, i) => {
          const fullBh = (v / max) * innerH;
          const bh = mounted ? fullBh : 0;
          const x = pad.l + i * barW + 4;
          const y = pad.t + innerH - bh;
          const isToday = i === data.length - 1;
          const isHover = hover === i;
          const fill = isHover ? 'url(#ubarH)' : isToday ? 'url(#ubarToday)' : 'url(#ubarG)';
          return (
            <g key={i}>
              <rect x={pad.l + i * barW} y={pad.t} width={barW} height={innerH} fill="transparent" style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}/>
              <rect x={x} y={y} width={barW - 8} height={bh} rx="5"
                fill={fill}
                opacity={hover !== null && !isHover ? .45 : 1}
                style={{ transition: `height .8s cubic-bezier(.16,1,.3,1) ${i * 35}ms, y .8s cubic-bezier(.16,1,.3,1) ${i * 35}ms, opacity .15s, fill .15s`, pointerEvents: 'none' }}/>
              {(isHover || isToday) && (
                <text x={x + (barW - 8) / 2} y={y - 6} fontSize="11" fill={isHover ? '#312E81' : '#4F46E5'} textAnchor="middle" fontWeight="700" fontFamily="var(--mono)" style={{ pointerEvents: 'none' }}>{v}</text>
              )}
              {(i % labelStep === 0 || isToday) && (
                <text x={x + (barW - 8) / 2} y={h - 10} fontSize="10" fill={isToday ? '#4F46E5' : '#7B8AA0'} textAnchor="middle" fontWeight={isToday ? 600 : 400} style={{ pointerEvents: 'none' }}>{dateFor(i).getDate()}/{dateFor(i).getMonth()+1}</text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (() => {
        const d = dateFor(hover);
        const v = data[hover];
        const diff = v - avg;
        const leftPct = ((pad.l + hover * barW + barW / 2) / w) * 100;
        return (
          <div className="chart-tip" style={{ left: `${leftPct}%` }}>
            <div className="chart-tip-date">{d.getDate()} {months[d.getMonth()]} 2567</div>
            <div className="chart-tip-row">
              <span className="dot" style={{ background: '#4F46E5' }}></span>
              <span>จำนวนเบิก</span>
              <b className="mono">{v} ขวด</b>
            </div>
            <div className="chart-tip-row muted">
              <span style={{ width: 10 }}></span>
              <span>{diff >= 0 ? 'มากกว่า' : 'น้อยกว่า'}เฉลี่ย</span>
              <b className="mono" style={{ color: diff >= 0 ? 'var(--danger)' : 'var(--success)' }}>{diff >= 0 ? '+' : ''}{diff.toFixed(1)}</b>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ============================================================
   Rank row (with progress bar)
   ============================================================ */
function RankRow({ rank, name, qty, max, tone }) {
  const I = window.Icons;
  const pct = max ? (qty / max) * 100 : 0;
  const mounted = useMountIn(rank * 100 + 200);
  return (
    <div className={`rank-row rank-tone-${tone}`}>
      <div className={`rank-num rank-num-${tone}`}>{rank}</div>
      <div className="rank-iv"><I.IVBag size={18}/></div>
      <div className="rank-name-block">
        <div className="rank-name">{name}</div>
        <div className="rank-progress">
          <div className="rank-progress-fill" style={{ width: mounted ? `${pct}%` : '0%' }}></div>
        </div>
      </div>
      <div className="rank-qty mono"><b>{qty}</b> <span className="muted">ขวด</span></div>
    </div>
  );
}

Object.assign(window, { DashboardPage });

// ===== page-stock.jsx =====
// Stock list (inventory) page — search, filter, table, edit/delete

const { useState: usS, useMemo: usM } = React;

function StockPage({ onOpenAdd, onOpenScan }) {
  const I = window.Icons;
  const toast = window.useToast();
  const [items, setItems] = usS(window.STOCK);
  const [query, setQuery] = usS('');
  const [ward, setWard] = usS('all');
  const [status, setStatus] = usS('all');
  const [sort, setSort] = usS({ key: 'exp', dir: 'asc' });
  const [selected, setSelected] = usS(new Set());
  const [confirm, setConfirm] = usS(null);
  const [editing, setEditing] = usS(null);
  const [page, setPage] = usS(1);
  const perPage = 8;

  const filtered = usM(() => {
    let arr = items;
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter((x) => x.name.toLowerCase().includes(q) || x.lot.toLowerCase().includes(q) || x.id.toLowerCase().includes(q) || x.barcode.includes(q));
    }
    if (ward !== 'all') arr = arr.filter((x) => x.ward === ward);
    if (status !== 'all') {
      arr = arr.filter((x) => {
        const d = window.daysFromToday(x.exp);
        if (status === 'low')      return x.qty < x.min;
        if (status === 'expiring') return d >= 0 && d <= 180;
        if (status === 'expired')  return d < 0;
        if (status === 'ok')       return x.qty >= x.min && d > 180;
        return true;
      });
    }
    const dir = sort.dir === 'asc' ? 1 : -1;
    arr = [...arr].sort((a, b) => {
      const va = a[sort.key], vb = b[sort.key];
      if (typeof va === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
    return arr;
  }, [items, query, ward, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleAll = () => {
    if (selected.size === pageItems.length) setSelected(new Set());
    else setSelected(new Set(pageItems.map((x) => x.id)));
  };
  const toggleOne = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const handleDelete = (ids) => {
    setItems((arr) => arr.filter((x) => !ids.includes(x.id)));
    setSelected(new Set());
    setConfirm(null);
    toast({ tone: 'success', title: `ลบ ${ids.length} รายการสำเร็จ`, desc: 'ข้อมูลถูกย้ายไปยังถังขยะ (30 วัน)' });
  };

  const wardLabel = window.WARDS.find((w) => w.id === ward)?.name || '';
  const statusLabel = ({ all: '', low: 'ต่ำกว่าขั้นต่ำ', expiring: 'ใกล้หมดอายุ', expired: 'หมดอายุแล้ว', ok: 'ปกติ' })[status];

  const sortBtn = (key, label, align = 'left') => (
    <span
      className={`t-sort ${sort.key === key ? 'active' : ''}`}
      onClick={() => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))}
      style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start', display: 'inline-flex' }}
    >
      {label}
      {sort.key === key ? (sort.dir === 'asc' ? <I.ArrowUp size={12}/> : <I.ArrowDown size={12}/>) : <I.ArrowDown size={12} style={{ opacity: .3 }}/>}
    </span>
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">รายการคงคลัง</span>
          <h1>รายการสารน้ำในคลัง</h1>
          <p>ทั้งหมด <b>{filtered.length}</b> รายการ · เลือก <b>{selected.size}</b> รายการ</p>
        </div>
        <div className="row row-gap-sm">
          <window.Button variant="secondary" icon={<I.Download size={18}/>}>Export</window.Button>
          <window.Button variant="secondary" icon={<I.Scan size={18}/>} onClick={onOpenScan}>สแกน</window.Button>
          <window.Button variant="primary" icon={<I.Plus size={18}/>} onClick={onOpenAdd}>เพิ่มสารน้ำ</window.Button>
        </div>
      </div>

      <window.Card padding={false}>
        <div className="table-toolbar">
          <div className="search">
            <window.Input
              icon={<I.Search size={16}/>}
              placeholder="ค้นหารหัส, ชื่อ, Lot, barcode..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          </div>
          <window.Select value={ward} onChange={(e) => { setWard(e.target.value); setPage(1); }}>
            {window.WARDS.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </window.Select>
          <window.Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="all">สถานะทุกประเภท</option>
            <option value="ok">ปกติ</option>
            <option value="low">ต่ำกว่าขั้นต่ำ</option>
            <option value="expiring">ใกล้หมดอายุ</option>
            <option value="expired">หมดอายุแล้ว</option>
          </window.Select>

          <div className="spacer"></div>

          {(ward !== 'all' || status !== 'all' || query) && (
            <window.Button variant="ghost" size="sm" onClick={() => { setQuery(''); setWard('all'); setStatus('all'); setPage(1); }}>
              ล้างตัวกรอง
            </window.Button>
          )}

          {selected.size > 0 && (
            <>
              <window.Button variant="secondary" size="sm" icon={<I.Download size={14}/>}>Export ({selected.size})</window.Button>
              <window.Button variant="danger" size="sm" icon={<I.Trash size={14}/>}
                onClick={() => setConfirm({ ids: [...selected], desc: `ลบ ${selected.size} รายการที่เลือก?` })}>
                ลบ
              </window.Button>
            </>
          )}
        </div>

        {/* Active filter chips */}
        {(ward !== 'all' || status !== 'all') && (
          <div className="row" style={{ padding: '10px 16px 0', borderBottom: 0 }}>
            {ward !== 'all' && (
              <span className="filter-chip">วอร์ด: {wardLabel}
                <button onClick={() => setWard('all')} aria-label="ล้าง"><I.Close size={12}/></button>
              </span>
            )}
            {status !== 'all' && (
              <span className="filter-chip">สถานะ: {statusLabel}
                <button onClick={() => setStatus('all')} aria-label="ล้าง"><I.Close size={12}/></button>
              </span>
            )}
          </div>
        )}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="row-select">
                  <div className="check"
                    data-checked={pageItems.length > 0 && selected.size === pageItems.length}
                    data-indeterminate={selected.size > 0 && selected.size < pageItems.length}
                    onClick={toggleAll}
                  >
                    {selected.size === pageItems.length && pageItems.length > 0 ? <I.Check size={12}/> : null}
                  </div>
                </th>
                <th>{sortBtn('id', 'รหัส')}</th>
                <th>{sortBtn('name', 'ชื่อสารน้ำ')}</th>
                <th>Lot</th>
                <th>{sortBtn('exp', 'วันหมดอายุ')}</th>
                <th>วอร์ด</th>
                <th className="num">{sortBtn('qty', 'คงเหลือ', 'right')}</th>
                <th>สถานะ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={9}>
                  <window.EmptyState icon={<I.Search size={24}/>} title="ไม่พบรายการ" desc="ลองเปลี่ยนคำค้นหรือล้างตัวกรอง"/>
                </td></tr>
              ) : pageItems.map((x) => {
                const days = window.daysFromToday(x.exp);
                return (
                  <tr key={x.id}>
                    <td>
                      <div className="check" data-checked={selected.has(x.id)} onClick={() => toggleOne(x.id)}>
                        {selected.has(x.id) ? <I.Check size={12}/> : null}
                      </div>
                    </td>
                    <td className="col-code">{x.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{x.name}</div>
                      <div className="muted mono" style={{ fontSize: 11 }}>{x.barcode}</div>
                    </td>
                    <td className="mono">{x.lot}</td>
                    <td>
                      <div>{window.formatThaiDate(x.exp)}</div>
                      <window.ExpiryBadge days={days}/>
                    </td>
                    <td>{window.WARDS.find((w) => w.id === x.ward)?.name}</td>
                    <td className="num">
                      <div style={{ fontWeight: 600 }}>{x.qty}</div>
                      <div className="muted" style={{ fontSize: 11 }}>ขั้นต่ำ {x.min}</div>
                    </td>
                    <td><window.StockBadge qty={x.qty} min={x.min}/></td>
                    <td>
                      <div className="actions">
                        <window.IconButton icon={<I.Edit size={16}/>} label="แก้ไข" onClick={() => setEditing(x)}/>
                        <window.IconButton icon={<I.Trash size={16}/>} label="ลบ"
                          onClick={() => setConfirm({ ids: [x.id], desc: `ลบรายการ ${x.id} (${x.name})?` })}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>แสดง {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} จาก {filtered.length} รายการ</span>
          <div className="page-btns">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><I.ArrowLeft size={14}/></button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button key={i} className="page-btn" aria-current={page === i + 1 ? 'page' : undefined} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}><I.ArrowRight size={14}/></button>
          </div>
        </div>
      </window.Card>

      <window.ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => handleDelete(confirm.ids)}
        title="ยืนยันการลบ"
        desc={confirm?.desc}
        confirmLabel="ลบรายการ"
      />

      {editing && (
        <EditStockModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setItems((arr) => arr.map((x) => x.id === updated.id ? updated : x));
            setEditing(null);
            toast({ tone: 'success', title: 'บันทึกการแก้ไขแล้ว', desc: `${updated.id} · ${updated.name}` });
          }}
        />
      )}
    </div>
  );
}

function EditStockModal({ item, onClose, onSave }) {
  const [form, setForm] = usS(item);
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <window.Modal
      open={true}
      onClose={onClose}
      title={`แก้ไข ${item.id}`}
      subtitle={item.name}
      size="md"
      footer={
        <>
          <window.Button variant="ghost" onClick={onClose}>ยกเลิก</window.Button>
          <window.Button variant="primary" onClick={() => onSave(form)}>บันทึก</window.Button>
        </>
      }
    >
      <div className="col" style={{ gap: 14 }}>
        <window.Field label="ชื่อสารน้ำ" required>
          <window.Input value={form.name} onChange={(e) => update('name', e.target.value)}/>
        </window.Field>
        <div className="grid-12" style={{ gap: 12 }}>
          <div style={{ gridColumn: 'span 6' }}>
            <window.Field label="Lot" required>
              <window.Input className="mono" value={form.lot} onChange={(e) => update('lot', e.target.value)}/>
            </window.Field>
          </div>
          <div style={{ gridColumn: 'span 6' }}>
            <window.Field label="วันหมดอายุ (พ.ศ.)">
              <window.Input type="date" value={form.exp || ''} onChange={(e) => update('exp', e.target.value)}/>
            </window.Field>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <window.Field label="คงเหลือ">
              <window.Input type="number" value={form.qty} onChange={(e) => update('qty', +e.target.value)}/>
            </window.Field>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <window.Field label="ขั้นต่ำ">
              <window.Input type="number" value={form.min} onChange={(e) => update('min', +e.target.value)}/>
            </window.Field>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <window.Field label="วอร์ด">
              <window.Select value={form.ward} onChange={(e) => update('ward', e.target.value)}>
                {window.WARDS.filter((w) => w.id !== 'all').map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </window.Select>
            </window.Field>
          </div>
        </div>
        <window.Field label="Barcode">
          <window.Input className="mono" value={form.barcode} onChange={(e) => update('barcode', e.target.value)}/>
        </window.Field>
      </div>
    </window.Modal>
  );
}

Object.assign(window, { StockPage });

// ===== page-add.jsx =====
// Add data page — multi-step with barcode scanner
const { useState: uaS, useEffect: uaE, useRef: uaR } = React;

function AddPage({ onDone, prefillBarcode, onOpenScan }) {
  const I = window.Icons;
  const toast = window.useToast();
  const [step, setStep] = uaS(0); // 0: scan/select, 1: details, 2: confirm
  const [mode, setMode] = uaS('in'); // in / out / new
  const [form, setForm] = uaS({
    barcode: prefillBarcode || '',
    code: '', name: '', lot: '', exp: '', qty: 1, ward: 'semi-sx', min: 30, note: '',
  });
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  uaE(() => {
    if (prefillBarcode) {
      setForm((f) => ({ ...f, barcode: prefillBarcode }));
      // Auto-detect known barcode
      const found = window.STOCK.find((x) => x.barcode === prefillBarcode);
      if (found) {
        setForm((f) => ({ ...f, code: found.code, name: found.name, lot: found.lot, exp: found.exp, ward: found.ward, min: found.min }));
        setStep(1);
      }
    }
  }, [prefillBarcode]);

  const handleSubmit = async () => { try { if (mode === 'in' || mode === 'new') { const result = await window.DBIntegration?.addStock?.({ code: form.code, name: form.name, type: form.code, ward: form.ward, lot: form.lot, qty: form.qty, expiry: form.exp }); if (!result) { toast({ tone: 'danger', title: 'บันทึกไม่สำเร็จ', desc: 'ไม่สามารถบันทึกข้อมูลลงฐานข้อมูลได้ กรุณาลองใหม่' }); return; } } toast({ tone: 'success', title: `บันทึก${mode === 'in' ? 'รับเข้า' : mode === 'out' ? 'เบิกออก' : 'เพิ่มรายการใหม่'}สำเร็จ`, desc: `${form.name} จำนวน ${form.qty} ขวด` }); onDone?.(); } catch (e) { console.error('Submit error:', e); toast({ tone: 'danger', title: 'เกิดข้อผิดพลาด', desc: String(e.message || e) }); } };

  const steps = [
    { num: 1, label: 'เลือกวิธีการ' },
    { num: 2, label: 'กรอกข้อมูล' },
    { num: 3, label: 'ยืนยัน' },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">เพิ่ม/ลงข้อมูล</span>
          <h1>เพิ่มข้อมูลสารน้ำ</h1>
          <p>เลือกวิธีการ → กรอกข้อมูล → ยืนยัน บันทึก</p>
        </div>
      </div>

      <window.Card padding={false}>
        {/* Stepper */}
        <div className="stepper">
          {steps.map((s, i) => (
            <div key={s.num} className="step" data-state={i < step ? 'done' : i === step ? 'current' : 'next'}>
              <div className="num">{i < step ? <I.Check size={14}/> : s.num}</div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {step === 0 && (
            <div className="col" style={{ gap: 24 }}>
              <div>
                <h3 style={{ marginBottom: 6 }}>เลือกประเภทรายการ</h3>
                <p className="muted">เลือกว่าจะรับเข้า, เบิกออก, หรือเพิ่มสารน้ำใหม่ที่ยังไม่เคยมีในระบบ</p>
              </div>

              <div className="grid-12" style={{ gap: 12 }}>
                {[
                  { id: 'in',  title: 'รับเข้าคลัง', desc: 'เพิ่มสต็อกจากคลังกลาง หรือบริษัทผู้ผลิต', icon: <I.ArrowDown size={22}/>, tone: 'success' },
                  { id: 'out', title: 'เบิกออก',    desc: 'เบิกใช้กับผู้ป่วย หรือย้ายไปวอร์ดอื่น',     icon: <I.ArrowUp size={22}/>, tone: 'info' },
                  { id: 'new', title: 'เพิ่มรายการใหม่', desc: 'สารน้ำชนิดใหม่ที่ยังไม่เคยมีในคลัง',     icon: <I.Plus size={22}/>, tone: 'primary' },
                ].map((c) => (
                  <button key={c.id}
                    onClick={() => setMode(c.id)}
                    className="report-card"
                    style={{
                      gridColumn: 'span 4',
                      cursor: 'pointer', textAlign: 'left',
                      borderColor: mode === c.id ? 'var(--brand-400)' : undefined,
                      background: mode === c.id ? 'var(--brand-50)' : undefined,
                      boxShadow: mode === c.id ? '0 0 0 2px rgba(30,111,235,.18)' : undefined,
                    }}
                  >
                    <div className={`mvt-pill mvt-${c.id === 'in' ? 'in' : c.id === 'out' ? 'out' : 'adj'}`} style={{ width: 40, height: 40 }}>{c.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{c.title}</div>
                    <div className="muted" style={{ fontSize: 12.5 }}>{c.desc}</div>
                  </button>
                ))}
              </div>

              <div className="divider"></div>

              <div className="col" style={{ gap: 14 }}>
                <h4>วิธีระบุสารน้ำ</h4>
                <div className="grid-12" style={{ gap: 12 }}>
                  <div style={{ gridColumn: 'span 6' }}>
                    <button onClick={onOpenScan} className="report-card" style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                      <div className="report-icon"><I.Scan size={22}/></div>
                      <div style={{ fontWeight: 600 }}>สแกน Barcode</div>
                      <div className="muted" style={{ fontSize: 12.5 }}>ใช้กล้องสแกน หรือเครื่องสแกนเนอร์ — เร็วและไม่ผิดพลาด</div>
                      <div className="row" style={{ marginTop: 8 }}><window.Badge tone="success" icon={<I.Check size={12}/>}>แนะนำ</window.Badge></div>
                    </button>
                  </div>
                  <div style={{ gridColumn: 'span 6' }}>
                    <div className="report-card" style={{ background: 'var(--surface-2)' }}>
                      <div className="report-icon" style={{ background: 'var(--surface)' }}><I.Edit size={22}/></div>
                      <div style={{ fontWeight: 600 }}>กรอกด้วยตนเอง</div>
                      <div className="muted" style={{ fontSize: 12.5 }}>กรอกรหัส, ชื่อสารน้ำ, Lot, วันหมดอายุ ทีละช่อง</div>
                      <window.Button variant="secondary" size="sm" style={{ alignSelf: 'flex-start', marginTop: 8 }} onClick={() => setStep(1)}>เริ่มกรอก</window.Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="col" style={{ gap: 20 }}>
              <div>
                <h3 style={{ marginBottom: 6 }}>กรอกข้อมูลสารน้ำ</h3>
                <p className="muted">
                  {mode === 'in' ? 'รับเข้าคลัง' : mode === 'out' ? 'เบิกออก' : 'เพิ่มรายการใหม่'}
                  {form.barcode && <> · barcode <span className="mono">{form.barcode}</span></>}
                </p>
              </div>

              {form.barcode && (
                <div className="barcode-strip">
                  <I.Barcode size={18}/>
                  <span>{form.barcode}</span>
                  <window.Badge tone="success" icon={<I.Check size={12}/>}>สแกนแล้ว</window.Badge>
                </div>
              )}

              <div className="grid-12" style={{ gap: 14 }}>
                <div style={{ gridColumn: 'span 4' }}>
                  <window.Field label="ชนิดสารน้ำ" required>
                    <window.Select value={form.code} onChange={(e) => {
                      const t = window.FLUID_TYPES.find((x) => x.code === e.target.value);
                      upd('code', e.target.value);
                      if (t) {
                        upd('name', t.name);
                        if (t.min !== undefined) upd('min', t.min);
                      }
                    }}>
                      <option value="">— เลือก —</option>
                      {window.FLUID_TYPES.map((t) => <option key={t.code} value={t.code}>{t.code} — {t.full}</option>)}
                    </window.Select>
                  </window.Field>
                </div>
                <div style={{ gridColumn: 'span 8' }}>
                  <window.Field label="ชื่อ/รายละเอียดสารน้ำ" required>
                    <window.Input value={form.name} onChange={(e) => upd('name', e.target.value)} placeholder="เช่น NSS 1000 ml"/>
                  </window.Field>
                </div>

                <div style={{ gridColumn: 'span 4' }}>
                  <window.Field label="Lot Number" required>
                    <window.Input className="mono" value={form.lot} onChange={(e) => upd('lot', e.target.value)} placeholder="A001"/>
                  </window.Field>
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <window.Field label="วันหมดอายุ (พ.ศ.)" required>
                    <window.Input type="date" value={form.exp || ''} onChange={(e) => upd('exp', e.target.value)}/>
                  </window.Field>
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <window.Field label={`จำนวน (${(window.FLUID_TYPES.find(x=>x.code===form.code)||{}).unit||'ขวด'})`} required>
                    <window.Input type="number" min={1} value={form.qty} onChange={(e) => upd('qty', +e.target.value)}/>
                  </window.Field>
                </div>

                <div style={{ gridColumn: 'span 6' }}>
                  <window.Field label="วอร์ด/ที่เก็บ" required>
                    <window.Select value={form.ward} onChange={(e) => upd('ward', e.target.value)}>
                      {window.WARDS.filter((w) => w.id !== 'all').map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </window.Select>
                  </window.Field>
                </div>
                <div style={{ gridColumn: 'span 6' }}>
                  <window.Field label="ขั้นต่ำในคลัง" hint="ระบบจะแจ้งเตือนเมื่อต่ำกว่าค่านี้">
                    <window.Input type="number" value={form.min} onChange={(e) => upd('min', +e.target.value)}/>
                  </window.Field>
                </div>

                <div style={{ gridColumn: 'span 12' }}>
                  <window.Field label="หมายเหตุ" hint="ไม่บังคับ">
                    <textarea className="input" rows="3" value={form.note} onChange={(e) => upd('note', e.target.value)} placeholder="เช่น รับจากคลังกลาง รอบเช้า"></textarea>
                  </window.Field>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="col" style={{ gap: 20 }}>
              <div>
                <h3 style={{ marginBottom: 6 }}>ตรวจสอบและยืนยัน</h3>
                <p className="muted">โปรดตรวจสอบความถูกต้องก่อนบันทึก</p>
              </div>

              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: 20 }}>
                <div className="row" style={{ marginBottom: 14, gap: 14 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 12,
                    background: '#fff', border: '1px solid var(--line)',
                    display: 'grid', placeItems: 'center', color: 'var(--brand-600)'
                  }}><I.Flask size={28}/></div>
                  <div style={{ flex: 1 }}>
                    <h3>{form.name || '—'}</h3>
                    <div className="muted">ประเภท: {mode === 'in' ? 'รับเข้าคลัง' : mode === 'out' ? 'เบิกออก' : 'เพิ่มรายการใหม่'}</div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: mode === 'in' ? 'var(--success)' : mode === 'out' ? 'var(--text-1)' : 'var(--brand-600)' }} className="mono">
                    {mode === 'in' ? '+' : mode === 'out' ? '−' : ''}{form.qty}
                  </div>
                </div>
                <div className="divider"></div>
                <div className="grid-12" style={{ gap: 14, fontSize: 13.5 }}>
                  <Detail span="span 4" label="ชนิด" value={form.code || '—'} mono/>
                  <Detail span="span 4" label="Lot"  value={form.lot || '—'} mono/>
                  <Detail span="span 4" label="วันหมดอายุ" value={form.exp ? window.formatThaiDate(form.exp) : '—'}/>
                  <Detail span="span 4" label="วอร์ด" value={window.WARDS.find((w) => w.id === form.ward)?.name}/>
                  <Detail span="span 4" label="ขั้นต่ำ" value={`${form.min} ขวด`}/>
                  <Detail span="span 4" label="Barcode" value={form.barcode || '—'} mono/>
                  {form.note && <Detail span="span 12" label="หมายเหตุ" value={form.note}/>}
                </div>
              </div>
            </div>
          )}
        </div>

        <footer style={{ padding: 16, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <window.Button variant="ghost" onClick={() => step === 0 ? onDone?.() : setStep((s) => s - 1)}>
            {step === 0 ? 'ยกเลิก' : '← ย้อนกลับ'}
          </window.Button>
          {step < 2 ? (
            <window.Button variant="primary" onClick={() => setStep((s) => s + 1)} iconRight={<I.ArrowRight size={16}/>}>ถัดไป</window.Button>
          ) : (
            <window.Button variant="primary" icon={<I.Check size={16}/>} onClick={handleSubmit}>บันทึกข้อมูล</window.Button>
          )}
        </footer>
      </window.Card>
    </div>
  );
}

function Detail({ span, label, value, mono }) {
  return (
    <div style={{ gridColumn: span }}>
      <div className="muted" style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      <div className={mono ? 'mono' : ''} style={{ fontWeight: 500, marginTop: 4 }}>{value}</div>
    </div>
  );
}

/* ============================================================
   BARCODE SCANNER MODAL
   ============================================================ */
function ScannerModal({ open, onClose, onCapture }) {
  const I = window.Icons;
  const [manualCode, setManualCode] = uaS('');
  const [detected, setDetected] = uaS(null);
  const toast = window.useToast();

  uaE(() => {
    if (!open) { setDetected(null); setManualCode(''); return; }
    // Simulate auto-detect after 2.2s
    const t = setTimeout(() => {
      const pick = window.STOCK[Math.floor(Math.random() * 4)]; // pick from first 4
      setDetected(pick);
    }, 2200);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const useCode = (bc) => {
    onCapture?.(bc);
    onClose();
    toast({ tone: 'success', title: 'สแกนสำเร็จ', desc: `barcode ${bc}` });
  };

  return (
    <window.Modal
      open={open}
      onClose={onClose}
      title="สแกนบาร์โค้ด"
      subtitle="วางบาร์โค้ดให้อยู่ในกรอบ ระบบจะตรวจจับอัตโนมัติ"
      size="md"
      footer={
        <>
          <window.Button variant="ghost" onClick={onClose}>ยกเลิก</window.Button>
          {detected && <window.Button variant="primary" icon={<I.Check size={16}/>} onClick={() => useCode(detected.barcode)}>ใช้รายการนี้</window.Button>}
        </>
      }
    >
      <div className="col" style={{ gap: 16 }}>
        <div className="scan-stage">
          <div className="scan-viewfinder">
            <span className="corner-tl"></span>
            <span className="corner-tr"></span>
            <span className="corner-bl"></span>
            <span className="corner-br"></span>
            <div className="scan-bars">
              <I.Barcode size={140}/>
            </div>
            <div className="scan-line"></div>
          </div>
          <div className="scan-hint">
            {detected
              ? <span style={{ color: '#4ADE80' }}>✓ ตรวจพบ: <b>{detected.name}</b> · Lot {detected.lot}</span>
              : <>กำลังสแกน... <span style={{ opacity: .5 }}>(จำลอง — รอ ~2 วินาที)</span></>}
          </div>
        </div>

        <div className="divider"></div>

        <div>
          <window.Field label="หรือกรอก barcode ด้วยตนเอง">
            <div className="row" style={{ gap: 8 }}>
              <window.Input className="mono" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="8851234500011" style={{ flex: 1 }}/>
              <window.Button variant="primary" disabled={!manualCode} onClick={() => useCode(manualCode)}>ใช้</window.Button>
            </div>
          </window.Field>
        </div>
      </div>
    </window.Modal>
  );
}

Object.assign(window, { AddPage, ScannerModal });

// ===== page-expiry.jsx =====
// Expiry alerts page

const { useState: ueS, useMemo: ueM } = React;

function ExpiryPage({ onOpenAdd }) {
  const I = window.Icons;
  const [tab, setTab] = ueS('soon');

  const buckets = ueM(() => {
    const all = window.STOCK.map((x) => ({ ...x, days: window.daysFromToday(x.exp) }));
    return {
      expired: all.filter((x) => x.days < 0),
      critical: all.filter((x) => x.days >= 0 && x.days <= 30),
      soon: all.filter((x) => x.days > 30 && x.days <= 180),
      ok: all.filter((x) => x.days > 180),
    };
  }, []);

  const tabs = [
    { value: 'expired',  label: 'หมดอายุแล้ว', count: buckets.expired.length },
    { value: 'critical', label: 'ภายใน 30 วัน', count: buckets.critical.length },
    { value: 'soon',     label: '1–6 เดือน', count: buckets.soon.length },
    { value: 'ok',       label: 'ยังไม่เสี่ยง', count: buckets.ok.length },
  ];

  const list = buckets[tab].sort((a, b) => a.days - b.days);

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">การแจ้งเตือนหมดอายุ</span>
          <h1>สารน้ำใกล้และเลยวันหมดอายุ</h1>
          <p>{buckets.expired.length + buckets.critical.length} รายการต้องดำเนินการเร่งด่วน</p>
        </div>
        <div className="row row-gap-sm">
          <window.Button variant="secondary" icon={<I.Print size={18}/>}>พิมพ์รายการ</window.Button>
          <window.Button variant="secondary" icon={<I.Download size={18}/>}>Export</window.Button>
        </div>
      </div>

      {/* Summary */}
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <div className="kpi kpi-danger">
          <div className="kpi-icon"><I.AlertTri size={22}/></div>
          <div className="kpi-body">
            <div className="kpi-label">หมดอายุแล้ว</div>
            <div className="kpi-value">{buckets.expired.length}<span className="kpi-unit">รายการ</span></div>
            <div className="kpi-foot">ต้องนำออกจากคลังทันที</div>
          </div>
        </div>
        <div className="kpi kpi-warning">
          <div className="kpi-icon"><I.Clock size={22}/></div>
          <div className="kpi-body">
            <div className="kpi-label">เร่งด่วน (≤30 วัน)</div>
            <div className="kpi-value">{buckets.critical.length}<span className="kpi-unit">รายการ</span></div>
            <div className="kpi-foot">เร่งใช้ก่อน, หรือคืนคลังกลาง</div>
          </div>
        </div>
        <div className="kpi kpi-info">
          <div className="kpi-icon"><I.Calendar size={22}/></div>
          <div className="kpi-body">
            <div className="kpi-label">ใกล้หมด (1–6 เดือน)</div>
            <div className="kpi-value">{buckets.soon.length}<span className="kpi-unit">รายการ</span></div>
            <div className="kpi-foot">วางแผนใช้ก่อนหมดอายุ</div>
          </div>
        </div>
        <div className="kpi kpi-success">
          <div className="kpi-icon"><I.CheckCircle size={22}/></div>
          <div className="kpi-body">
            <div className="kpi-label">ยังไม่เสี่ยง</div>
            <div className="kpi-value">{buckets.ok.length}<span className="kpi-unit">รายการ</span></div>
            <div className="kpi-foot">เหลือมากกว่า 6 เดือน</div>
          </div>
        </div>
      </div>

      <window.Card padding={false}>
        <div className="table-toolbar" style={{ gap: 12 }}>
          <window.Tabs value={tab} onChange={setTab} items={tabs}/>
          <div className="spacer"></div>
          <window.Input icon={<I.Search size={16}/>} placeholder="ค้นหารหัส, ชื่อ, Lot..." style={{ width: 260 }}/>
        </div>

        {list.length === 0 ? (
          <window.EmptyState icon={<I.CheckCircle size={28}/>} title="ไม่มีรายการในกลุ่มนี้" desc="ทุกรายการอยู่ในสภาพปลอดภัย"/>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>ชื่อสารน้ำ</th>
                  <th>Lot</th>
                  <th>วันหมดอายุ</th>
                  <th>วอร์ด</th>
                  <th className="num">คงเหลือ</th>
                  <th>สถานะ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((x) => (
                  <tr key={x.id}>
                    <td className="col-code">{x.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{x.name}</div>
                      <div className="muted mono" style={{ fontSize: 11 }}>{x.barcode}</div>
                    </td>
                    <td className="mono">{x.lot}</td>
                    <td>
                      <div>{window.formatThaiDate(x.exp)}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{x.days < 0 ? `เลยมา ${Math.abs(x.days)} วัน` : `อีก ${x.days} วัน`}</div>
                    </td>
                    <td>{window.WARDS.find((w) => w.id === x.ward)?.name}</td>
                    <td className="num"><span style={{ fontWeight: 600 }}>{x.qty}</span> <span className="muted">ขวด</span></td>
                    <td><window.ExpiryBadge days={x.days}/></td>
                    <td>
                      <div className="actions">
                        {x.days < 0
                          ? <window.Button variant="danger" size="sm" icon={<I.Trash size={14}/>}>นำออก</window.Button>
                          : <window.Button variant="secondary" size="sm" icon={<I.ArrowRight size={14}/>}>เบิกใช้</window.Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </window.Card>
    </div>
  );
}

Object.assign(window, { ExpiryPage });

// ===== page-reports.jsx =====
// Reports page

const { useState: urS } = React;

function ReportsPage() {
  const I = window.Icons;
  const toast = window.useToast();
  const [from, setFrom] = urS('2567-05-01');
  const [to, setTo] = urS('2567-05-21');
  const [ward, setWard] = urS('all');
  const [format, setFormat] = urS('xlsx');

  const handleExport = () => {
    toast({ tone: 'success', title: 'กำลังสร้างไฟล์...', desc: `รูปแบบ ${format.toUpperCase()} · ${from} → ${to}` });
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
          <window.Card>
            <window.SectionTitle title="สร้างรายงาน" subtitle="เลือกประเภทและช่วงเวลา"/>
            <div className="grid-12" style={{ gap: 14 }}>
              <div style={{ gridColumn: 'span 6' }}>
                <window.Field label="จากวันที่">
                  <window.Input icon={<I.Calendar size={16}/>} value={from} onChange={(e) => setFrom(e.target.value)}/>
                </window.Field>
              </div>
              <div style={{ gridColumn: 'span 6' }}>
                <window.Field label="ถึงวันที่">
                  <window.Input icon={<I.Calendar size={16}/>} value={to} onChange={(e) => setTo(e.target.value)}/>
                </window.Field>
              </div>
              <div style={{ gridColumn: 'span 6' }}>
                <window.Field label="วอร์ด">
                  <window.Select value={ward} onChange={(e) => setWard(e.target.value)}>
                    {window.WARDS.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </window.Select>
                </window.Field>
              </div>
              <div style={{ gridColumn: 'span 6' }}>
                <window.Field label="รูปแบบไฟล์">
                  <div className="segmented" style={{ width: '100%' }}>
                    {[
                      { v: 'xlsx', l: 'Excel' },
                      { v: 'pdf',  l: 'PDF' },
                      { v: 'csv',  l: 'CSV' },
                    ].map((f) => (
                      <button key={f.v} aria-pressed={format === f.v} onClick={() => setFormat(f.v)} style={{ flex: 1 }}>{f.l}</button>
                    ))}
                  </div>
                </window.Field>
              </div>
            </div>

            <div className="divider"></div>

            <h4 style={{ marginBottom: 12 }}>เลือกประเภทรายงาน</h4>
            <div className="grid-12" style={{ gap: 12 }}>
              {[
                { id: 'r1', icon: <I.Box size={22}/>,       title: 'รายงานคงคลังประจำวัน',  desc: 'ยอดคงเหลือ ณ สิ้นวัน แยกตาม Lot' },
                { id: 'r2', icon: <I.Chart size={22}/>,     title: 'รายงานการใช้รายเดือน',  desc: 'จำนวนเบิก, สถิติการใช้, แนวโน้ม' },
                { id: 'r3', icon: <I.AlertTri size={22}/>,  title: 'รายงานสารน้ำใกล้หมดอายุ', desc: 'แสดงรายการที่จะหมดอายุภายในเวลาที่กำหนด' },
                { id: 'r4', icon: <I.Refresh size={22}/>,   title: 'รายงานการรับ-เบิก',     desc: 'ประวัติการเคลื่อนไหวทั้งหมด' },
                { id: 'r5', icon: <I.Building size={22}/>,  title: 'รายงานสรุปแยกตามวอร์ด', desc: 'การใช้และคงเหลือ แยกตามหน่วยงาน' },
                { id: 'r6', icon: <I.Clipboard size={22}/>, title: 'รายงานปรับยอด/จำหน่าย',  desc: 'การปรับยอดและสารน้ำที่ถูกตัดออก' },
              ].map((r) => (
                <div key={r.id} className="report-card" style={{ gridColumn: 'span 6' }}>
                  <div className="report-icon">{r.icon}</div>
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
                  <div className="muted" style={{ fontSize: 12.5 }}>{r.desc}</div>
                  <div className="report-card-foot">
                    <window.Button variant="ghost" size="sm">ดูตัวอย่าง</window.Button>
                    <window.Button variant="primary" size="sm" icon={<I.Download size={14}/>} onClick={handleExport}>Export</window.Button>
                  </div>
                </div>
              ))}
            </div>
          </window.Card>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <window.Card>
            <window.SectionTitle title="รายงานล่าสุด" subtitle="ดาวน์โหลดที่สร้างไว้ก่อนหน้า"/>
            <div className="col" style={{ gap: 4 }}>
              {window.REPORTS.map((r) => (
                <div key={r.id} className="list-item">
                  <div className="list-pill"><I.Clipboard size={18}/></div>
                  <div className="body">
                    <div className="title">{r.name}</div>
                    <div className="sub">{r.period} · {r.rows} แถว · โดย {r.by}</div>
                  </div>
                  <window.IconButton icon={<I.Download size={16}/>} label="ดาวน์โหลด"/>
                </div>
              ))}
            </div>
          </window.Card>

          <window.Card>
            <window.SectionTitle title="ส่ง Email อัตโนมัติ" subtitle="ตั้งให้ระบบส่งรายงานเป็นประจำ"/>
            <div className="col" style={{ gap: 14 }}>
              <window.Field label="อีเมลผู้รับ" hint="คั่นด้วยจุลภาค (,) สำหรับหลายคน">
                <window.Input placeholder="head@hospital.go.th"/>
              </window.Field>
              <window.Field label="ความถี่">
                <window.Select>
                  <option>ทุกวัน 18:00 น.</option>
                  <option>ทุกวันจันทร์ 09:00 น.</option>
                  <option>ทุกสิ้นเดือน</option>
                </window.Select>
              </window.Field>
              <window.Button variant="secondary" icon={<I.Check size={16}/>}>บันทึกการตั้งค่า</window.Button>
            </div>
          </window.Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ReportsPage });

// ===== page-settings.jsx =====
// Settings page (light) + Search overlay

const { useState: usgS } = React;

function SettingsPage() {
  const I = window.Icons;
  let _user=null; try{_user=JSON.parse(localStorage.getItem("stockiv_user")||"null")}catch(e){}
  const _displayName=_user&&_user.display_name?_user.display_name:"";
  const _roleLabel=(window.roleLabel?window.roleLabel(_user&&_user.role):"")||"";
  const _initial=((_user&&_user.display_name)||"?").trim().charAt(0)||"?";
  return (
    <div>
      <div className="page-head">
        <div>
          <span className="muted">ตั้งค่า</span>
          <h1>ตั้งค่าระบบ</h1>
          <p>โปรไฟล์, การแจ้งเตือน, และการเชื่อมต่ออุปกรณ์</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="col" style={{ gap: 16 }}>
          <window.Card>
            <window.SectionTitle title="โปรไฟล์ผู้ใช้"/>
            <div className="row" style={{ gap: 16, marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #60A5FA, #1E6FEB)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 600 }}>{_initial}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{_displayName||"ผู้ใช้"}</div>
                <div className="muted">{_roleLabel}</div>
              </div>
            </div>
            <div className="grid-12" style={{ gap: 14 }}>
              <div style={{ gridColumn: 'span 6' }}><window.Field label="ชื่อ"><window.Input/></window.Field></div>
              <div style={{ gridColumn: 'span 6' }}><window.Field label="นามสกุล"><window.Input/></window.Field></div>
              <div style={{ gridColumn: 'span 6' }}><window.Field label="อีเมล"><window.Input/></window.Field></div>
              
            </div>
          </window.Card>

          <window.Card>
            <window.SectionTitle title="ข้อมูลพื้นฐาน" subtitle="กำหนดค่าที่ใช้ทั้งระบบ"/>
            <div className="col" style={{ gap: 14 }}>
              <SettingRow icon={<I.Clock size={18}/>} title="ระยะเตือนใกล้หมดอายุ" desc="แสดงเตือนเมื่อเหลือกี่วัน"
                control={<window.Select defaultValue="180" style={{ width: 140 }}><option value="30">30 วัน</option><option value="90">90 วัน</option><option value="180">180 วัน</option><option value="210">210 วัน</option><option value="365">365 วัน</option></window.Select>}/>
              <SettingRow icon={<I.Scan size={18}/>} title="อุปกรณ์สแกนบาร์โค้ด" desc="เชื่อมต่อ USB scanner หรือใช้กล้องของอุปกรณ์"
                control={<window.Badge tone="success" icon={<I.CheckCircle size={12}/>}>เชื่อมต่อแล้ว</window.Badge>}/>
            </div>
          </window.Card>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <window.Card>
            <window.SectionTitle title="การแจ้งเตือน"/>
            <div className="col" style={{ gap: 14 }}>
              <SettingToggle title="แจ้งเตือนเมื่อต่ำกว่าขั้นต่ำ" desc="ส่งทันทีเมื่อสารน้ำใดต่ำกว่ายอด" defaultChecked/>
              <SettingToggle title="แจ้งเตือนใกล้หมดอายุ" desc="ทุกเช้า 08:00 น." defaultChecked/>
              <SettingToggle title="สรุปประจำสัปดาห์ทางอีเมล" desc="ส่งวันจันทร์เช้า"/>
              <SettingToggle title="แจ้งเตือนผ่าน LINE Notify" desc="ต้องเชื่อมต่อบัญชี LINE ก่อน"/>
            </div>
          </window.Card>

          <window.Card>
            <window.SectionTitle title="ความปลอดภัย"/>
            <div className="col" style={{ gap: 10 }}>
              <window.Button variant="secondary">เปลี่ยนรหัสผ่าน</window.Button>
              <window.Button variant="secondary">เปิดการยืนยัน 2 ขั้นตอน</window.Button>
              <window.Button variant="danger-ghost" icon={<I.Logout size={16}/>}>ออกจากระบบ</window.Button>
            </div>
          </window.Card>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, title, desc, control }) {
  return (
    <div className="list-item" style={{ alignItems: 'center' }}>
      <div className="list-pill">{icon}</div>
      <div className="body">
        <div className="title">{title}</div>
        <div className="sub">{desc}</div>
      </div>
      {control}
    </div>
  );
}

function SettingToggle({ title, desc, defaultChecked }) {
  const [on, setOn] = usgS(!!defaultChecked);
  return (
    <div className="list-item" style={{ alignItems: 'center' }}>
      <div className="body">
        <div className="title">{title}</div>
        <div className="sub">{desc}</div>
      </div>
      <button onClick={() => setOn(!on)}
        style={{
          width: 40, height: 22, borderRadius: 999,
          background: on ? 'var(--brand-500)' : '#CFDBE9',
          border: 0, cursor: 'pointer', padding: 0, position: 'relative',
          transition: 'background .15s'
        }}
        aria-pressed={on}
      >
        <span style={{
          position: 'absolute', top: 2, left: on ? 20 : 2,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          transition: 'left .18s', boxShadow: '0 1px 2px rgba(0,0,0,.2)'
        }}></span>
      </button>
    </div>
  );
}

Object.assign(window, { SettingsPage });

// ===== app.jsx =====
// Root App

const { useState: uAS, useEffect: uAE } = React;

function LoginScreen({ onLogin }) {
  const I = window.Icons;
  const [username, setUsername] = uAS('');
  const [password, setPassword] = uAS('');
  const [error, setError] = uAS('');
  const [busy, setBusy] = uAS(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    const res = await window.Auth.login(username, password);
    setBusy(false);
    if (res.ok) {
      onLogin(res.user);
    } else {
      setError(res.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <div className="login-screen">
      <form className="card card-pad login-card" onSubmit={submit}>
        <div className="login-brand">
          <div className="brand-mark"><I.IVBag size={26}/></div>
          <div className="brand-text">
            <span className="name">Stock IV</span>
            <span className="sub">ระบบจัดการสารน้ำ</span>
          </div>
        </div>

        <h2 className="login-title">เข้าสู่ระบบ</h2>

        <window.Field label="ชื่อ" required>
          <window.Input
            icon={<I.User size={16}/>}
            placeholder="ชื่อจริง เช่น อุมา"
            value={username}
            autoFocus
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </window.Field>

        <window.Field label="รหัสผ่าน" required error={error}>
          <window.Input
            type="password"
            placeholder="••••••••"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </window.Field>

        <window.Button type="submit" variant="primary" size="lg" className="login-submit" disabled={busy}>
          {busy ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
        </window.Button>
      </form>
    </div>
  );
}

function App() {
  const [user, setUser] = uAS(() => window.Auth.getCurrentUser());
  const [page, setPage] = uAS('dashboard');
  const [openNotif, setOpenNotif] = uAS(false);
  const [openScan, setOpenScan] = uAS(false);
  const [scannedCode, setScannedCode] = uAS(null);

  // Tweaks
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "density": "cozy",
    "accent": "#1E6FEB",
    "showWelcome": true
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to DOM
  uAE(() => {
    document.body.setAttribute('data-density', t.density || 'cozy');
    document.documentElement.style.setProperty('--brand-500', t.accent);
  }, [t.density, t.accent]);

  // Listen for "open-scan" event (from topbar icon)
  uAE(() => {
    const h = () => setOpenScan(true);
    window.addEventListener('open-scan', h);
    return () => window.removeEventListener('open-scan', h);
  }, []);

  const titles = {
    dashboard: { crumb: 'หน้าหลัก', title: 'แดชบอร์ด' },
    stock:     { crumb: 'คลังสารน้ำ', title: 'รายการคงคลัง' },
    add:       { crumb: 'บันทึก',     title: 'เพิ่ม / ลงข้อมูล' },
    expiry:    { crumb: 'การแจ้งเตือน', title: 'หมดอายุและใกล้หมดอายุ' },
    reports:   { crumb: 'รายงาน',     title: 'รายงาน & Export' },
    settings:  { crumb: 'ระบบ',       title: 'ตั้งค่า' },
  }[page] || { crumb: '', title: '' };

  const openAdd = () => { setScannedCode(null); setPage('add'); };
  const openScanModal = () => setOpenScan(true);

  const logout = () => {
    window.Auth.logout();
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={setUser}/>;
  }

  return (
    <window.ToastProvider>
      <div className="app" data-screen-label={`Stock IV — ${titles.title}`}>
        <window.Sidebar active={page} onNavigate={setPage} user={user} onLogout={logout}/>
        <window.Topbar
          title={titles.title}
          crumb={titles.crumb}
          onOpenNotifs={() => setOpenNotif(true)}
          notifCount={window.NOTIFICATIONS.length}
          onOpenMenu={() => alert('เมนูมือถือ — ใช้แท็บล่างแทน')}
          user={user}
          onLogout={logout}
        />
        <main className="main">
          {page === 'dashboard' && <window.DashboardPage onNavigate={setPage} onOpenAdd={openAdd} onOpenScan={openScanModal}/>}
          {page === 'stock'     && <window.StockPage onOpenAdd={openAdd} onOpenScan={openScanModal}/>}
          {page === 'add'       && <window.AddPage onDone={() => setPage('stock')} prefillBarcode={scannedCode} onOpenScan={openScanModal}/>}
          {page === 'expiry'    && <window.ExpiryPage onOpenAdd={openAdd}/>}
          {page === 'reports'   && <window.ReportsPage/>}
          {page === 'settings'  && <window.SettingsPage/>}
        </main>
        <window.MobileTabbar active={page} onNavigate={setPage}/>

        <window.NotificationsDrawer open={openNotif} onClose={() => setOpenNotif(false)}/>
        <window.ScannerModal
          open={openScan}
          onClose={() => setOpenScan(false)}
          onCapture={(bc) => { setScannedCode(bc); setPage('add'); }}
        />

        {(
          <window.TweaksPanel title="Tweaks">
            <window.TweakSection title="ความหนาแน่นของข้อมูล">
              <window.TweakRadio
                label="Density"
                value={t.density}
                onChange={(v) => setTweak('density', v)}
                options={[
                  { value: 'comfy',   label: 'สบายตา' },
                  { value: 'cozy',    label: 'มาตรฐาน' },
                  { value: 'compact', label: 'หนาแน่น' },
                ]}
              />
            </window.TweakSection>
            <window.TweakSection title="สีหลัก">
              <window.TweakColor
                label="Accent"
                value={t.accent}
                onChange={(v) => setTweak('accent', v)}
                options={['#1E6FEB', '#0EA5E9', '#2563EB', '#0891B2', '#1746A1']}
              />
            </window.TweakSection>
            <window.TweakSection title="หน้าจอ">
              <window.TweakSelect
                label="ดูหน้า"
                value={page}
                onChange={setPage}
                options={[
                  { value: 'dashboard', label: 'แดชบอร์ด' },
                  { value: 'stock', label: 'รายการคงคลัง' },
                  { value: 'add', label: 'เพิ่ม/ลงข้อมูล' },
                  { value: 'expiry', label: 'หมดอายุ' },
                  { value: 'reports', label: 'รายงาน' },
                  { value: 'settings', label: 'ตั้งค่า' },
                  { value: 'receive', label: 'รับเข้าคลังกลาง' },
                ]}
              />
              <window.TweakButton onClick={openScanModal}>เปิด Barcode Scanner</window.TweakButton>
            </window.TweakSection>
          </window.TweaksPanel>
        )}
      </div>
    </window.ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);


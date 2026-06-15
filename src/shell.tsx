// App shell — Sidebar, Topbar, MobileTabbar, NotificationsDrawer.

import { useEffect, useState, type ReactNode } from 'react';
import { Icons, type IconKey } from './icons';
import { Button, IconButton, Input } from './ui';
import { useAuth } from './lib/auth';
import { useWards } from './lib/data';

export type PageId = 'dashboard' | 'stock' | 'add' | 'expiry' | 'planning' | 'reports' | 'value' | 'wards' | 'settings';

export const NAV_ITEMS: { id: PageId; label: string; icon: IconKey; section: 'main' | 'system' }[] = [
  { id: 'dashboard', label: 'แดชบอร์ด', icon: 'Home', section: 'main' },
  { id: 'stock', label: 'รายการคงคลัง', icon: 'Box', section: 'main' },
  { id: 'add', label: 'เพิ่ม/ลงข้อมูล', icon: 'Plus', section: 'main' },
  { id: 'expiry', label: 'แจ้งเตือนหมดอายุ', icon: 'AlertTri', section: 'main' },
  { id: 'planning', label: 'วางแผนสต็อก', icon: 'Clipboard', section: 'main' },
  { id: 'reports', label: 'รายงาน', icon: 'Chart', section: 'main' },
  { id: 'value', label: 'ราคา & มูลค่า', icon: 'Coins', section: 'main' },
  { id: 'wards', label: 'จัดการวอร์ด', icon: 'Building', section: 'system' },
  { id: 'settings', label: 'ตั้งค่า', icon: 'Settings', section: 'system' },
];

export function Sidebar({
  active,
  onNavigate,
  open,
  onClose,
}: {
  active: PageId;
  onNavigate: (p: PageId) => void;
  open?: boolean;
  onClose?: () => void;
}) {
  const I = Icons;
  const { user } = useAuth();
  const { wards } = useWards();
  const meta = (user?.user_metadata ?? {}) as { display_name?: string; position?: string; ward_id?: string };
  const displayName = meta.display_name || user?.email?.split('@')[0] || 'ผู้ใช้งาน';
  const wardName = wards.find((w) => w.id === meta.ward_id)?.name ?? '';
  const roleLine = [meta.position, wardName].filter(Boolean).join(' · ') || 'เข้าสู่ระบบแล้ว';
  const initials = displayName.slice(0, 2);
  return (
    <>
      {open && <div className="sidebar-scrim" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <I.IVBag size={22} />
          </div>
          <div className="brand-text">
            <span className="name">Stock IV</span>
            <span className="sub">ระบบจัดการสารน้ำ</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="ปิดเมนู">
            <I.Close size={18} />
          </button>
        </div>

        <nav className="side-nav" aria-label="เมนูหลัก">
          <div className="side-section-label">เมนูหลัก</div>
          {NAV_ITEMS.filter((it) => it.section === 'main').map((it) => {
            const Ico = I[it.icon];
            return (
              <button
                key={it.id}
                className="side-link"
                aria-current={active === it.id ? 'page' : undefined}
                onClick={() => {
                  onNavigate(it.id);
                  onClose?.();
                }}
              >
                <Ico size={19} />
                <span>{it.label}</span>
              </button>
            );
          })}

          <div className="side-section-label">ระบบ</div>
          {NAV_ITEMS.filter((it) => it.section === 'system').map((it) => {
            const Ico = I[it.icon];
            return (
              <button
                key={it.id}
                className="side-link"
                aria-current={active === it.id ? 'page' : undefined}
                onClick={() => {
                  onNavigate(it.id);
                  onClose?.();
                }}
              >
                <Ico size={19} />
                <span>{it.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="side-foot">
          <div className="side-user" role="button" tabIndex={0}>
            <div className="avatar">{initials}</div>
            <div className="who">
              <div className="name">{displayName}</div>
              <div className="role">{roleLine}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Topbar({
  title,
  crumb,
  onOpenSearch,
  onOpenNotifs,
  onOpenMenu,
  notifCount,
}: {
  title: ReactNode;
  crumb?: ReactNode;
  onOpenSearch?: () => void;
  onOpenNotifs?: () => void;
  onOpenMenu?: () => void;
  notifCount?: number;
}) {
  const I = Icons;
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <IconButton icon={<I.Menu size={20} />} label="เมนู" className="menu-btn bordered" onClick={onOpenMenu} />
        <div className="topbar-title">
          {crumb ? <span className="crumb">{crumb}</span> : null}
          <h2>{title}</h2>
        </div>

        <div className="topbar-search">
          <Input
            icon={<I.Search size={16} />}
            placeholder="ค้นหา รหัส / ชื่อสารน้ำ / Lot..."
            onFocus={onOpenSearch}
          />
        </div>

        <div className="topbar-actions">
          <IconButton
            icon={<I.Scan size={20} />}
            label="สแกนบาร์โค้ด"
            className="bordered"
            onClick={() => window.dispatchEvent(new Event('open-scan'))}
          />
          <button className="icon-btn bordered topbar-bell" aria-label="การแจ้งเตือน" onClick={onOpenNotifs}>
            <I.Bell size={20} />
            {notifCount && notifCount > 0 ? <span className="badge-dot"></span> : null}
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileTabbar({ active, onNavigate }: { active: PageId; onNavigate: (p: PageId) => void }) {
  const I = Icons;
  const tabs: { id: PageId; label: string; icon: IconKey }[] = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: 'Home' },
    { id: 'stock', label: 'คงคลัง', icon: 'Box' },
    { id: 'add', label: 'เพิ่ม', icon: 'Plus' },
    { id: 'expiry', label: 'หมดอายุ', icon: 'AlertTri' },
    { id: 'wards', label: 'วอร์ด', icon: 'Building' },
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
            <Ico size={22} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// Notifications drawer — computed live from stock state via the prop.
export function NotificationsDrawer({
  open,
  onClose,
  items = [],
}: {
  open: boolean;
  onClose: () => void;
  items?: { id: string; kind: 'danger' | 'warning' | 'info'; title: string; meta: string; ts: string }[];
}) {
  const I = Icons;
  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  const kindIcon: Record<string, ReactNode> = {
    danger: <I.AlertTri size={18} />,
    warning: <I.Clock size={18} />,
    info: <I.Info size={18} />,
  };
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}></div>
      <aside className="drawer" role="dialog" aria-label="การแจ้งเตือน">
        <header className="drawer-head">
          <div>
            <h3>การแจ้งเตือน</h3>
            <p className="muted">{items.length} รายการ</p>
          </div>
          <IconButton icon={<I.Close size={20} />} label="ปิด" onClick={onClose} />
        </header>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="muted" style={{ padding: 24, textAlign: 'center' }}>
              ไม่มีการแจ้งเตือน
            </div>
          ) : (
            <div className="col" style={{ gap: 8 }}>
              {items.map((n) => (
                <div key={n.id} className={`notif notif-${n.kind}`}>
                  <div className="notif-icon">{kindIcon[n.kind]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-meta">
                      {n.meta} · {n.ts}
                    </div>
                  </div>
                  <button className="notif-link">ดู</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <footer className="drawer-foot">
          <Button variant="ghost" onClick={onClose}>
            ปิด
          </Button>
        </footer>
      </aside>
    </>
  );
}

// Helper hook: convert live alerts into notification items.
export function useNotifications(
  stockAlerts: { low: number; expSoon: number; expired: number },
): { id: string; kind: 'danger' | 'warning' | 'info'; title: string; meta: string; ts: string }[] {
  const items: { id: string; kind: 'danger' | 'warning' | 'info'; title: string; meta: string; ts: string }[] = [];
  if (stockAlerts.expired > 0)
    items.push({
      id: 'exp',
      kind: 'danger',
      title: `${stockAlerts.expired} รายการหมดอายุแล้ว`,
      meta: 'ต้องนำออกจากคลัง',
      ts: 'วันนี้',
    });
  if (stockAlerts.low > 0)
    items.push({
      id: 'low',
      kind: 'warning',
      title: `${stockAlerts.low} รายการต่ำกว่าขั้นต่ำ`,
      meta: 'ควรเบิกเพิ่มภายในวันนี้',
      ts: 'วันนี้',
    });
  if (stockAlerts.expSoon > 0)
    items.push({
      id: 'soon',
      kind: 'info',
      title: `${stockAlerts.expSoon} รายการใกล้หมดอายุ`,
      meta: 'ภายใน 6 เดือน',
      ts: 'สัปดาห์นี้',
    });
  return items;
}

export function useViewport() {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1024 : window.innerWidth));
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return { width: w, isMobile: w < 900 };
}

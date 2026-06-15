// Root App — auth gate, page router, mobile menu state, floating tweaks panel.

import { useEffect, useMemo, useState } from 'react';
import { MobileTabbar, NotificationsDrawer, Sidebar, Topbar, useNotifications, type PageId } from './shell';
import { ToastProvider } from './ui';
import { TweakButton, TweakColor, TweakRadio, TweakSection, TweakSelect, TweaksPanel, useTweaks } from './tweaks';
import { DashboardPage } from './pages/Dashboard';
import { StockPage } from './pages/Stock';
import { AddPage, ScannerModal } from './pages/Add';
import { ExpiryPage } from './pages/Expiry';
import { ReportsPage } from './pages/Reports';
import { ValuePage } from './pages/Value';
import { SettingsPage } from './pages/Settings';
import { WardsPage } from './pages/Wards';
import { LoginPage } from './pages/Login';
import { AuthProvider, useAuth } from './lib/auth';
import { SettingsProvider, useSettings } from './lib/settings';
import { daysFromToday, useStock } from './lib/data';

type Density = 'comfy' | 'cozy' | 'compact';
type ValueLayout = 'a' | 'b';
type TweakState = { density: Density; accent: string; valueLayout: ValueLayout };

const TWEAK_DEFAULTS: TweakState = { density: 'cozy', accent: '#1E6FEB', valueLayout: 'a' };

const PAGE_TITLES: Record<PageId, { crumb: string; title: string }> = {
  dashboard: { crumb: 'หน้าหลัก', title: 'แดชบอร์ด' },
  stock: { crumb: 'คลังสารน้ำ', title: 'รายการคงคลัง' },
  add: { crumb: 'บันทึก', title: 'เพิ่ม / ลงข้อมูล' },
  expiry: { crumb: 'การแจ้งเตือน', title: 'หมดอายุและใกล้หมดอายุ' },
  reports: { crumb: 'รายงาน', title: 'รายงาน & Export' },
  value: { crumb: 'คลังสารน้ำ', title: 'ราคา & มูลค่าสต็อก' },
  wards: { crumb: 'การจัดการ', title: 'จัดการวอร์ด' },
  settings: { crumb: 'ระบบ', title: 'ตั้งค่า' },
};

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ToastProvider>
          <AppInner />
        </ToastProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

function AppInner() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-shell">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="muted">กำลังโหลด...</div>
        </div>
      </div>
    );
  }
  if (!user) return <LoginPage />;
  return <Shell />;
}

function Shell() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [openNotif, setOpenNotif] = useState(false);
  const [openScan, setOpenScan] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [t, setTweak] = useTweaks<TweakState>(TWEAK_DEFAULTS);
  const { stock } = useStock();
  const { expiryWarnDays } = useSettings();

  useEffect(() => {
    document.body.setAttribute('data-density', t.density || 'cozy');
    document.documentElement.style.setProperty('--brand-500', t.accent);
  }, [t.density, t.accent]);

  useEffect(() => {
    const h = () => setOpenScan(true);
    window.addEventListener('open-scan', h);
    return () => window.removeEventListener('open-scan', h);
  }, []);

  // Close mobile drawer on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [page]);

  const titles = PAGE_TITLES[page] || { crumb: '', title: '' };
  const openAdd = () => {
    setScannedCode(null);
    setPage('add');
  };
  const openScanModal = () => setOpenScan(true);

  // Build live notifications from stock state.
  const alerts = useMemo(() => {
    const low = stock.filter((s) => s.qty < s.min_qty).length;
    const dayMap = stock.map((s) => daysFromToday(s.expiry));
    const expSoon = dayMap.filter((d) => d >= 0 && d <= expiryWarnDays).length;
    const expired = dayMap.filter((d) => d < 0).length;
    return { low, expSoon, expired };
  }, [stock, expiryWarnDays]);
  const notifItems = useNotifications(alerts);

  return (
    <div className="app" data-screen-label={`Stock IV — ${titles.title}`}>
      <Sidebar active={page} onNavigate={setPage} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Topbar
        title={titles.title}
        crumb={titles.crumb}
        onOpenNotifs={() => setOpenNotif(true)}
        notifCount={notifItems.length}
        onOpenMenu={() => setMenuOpen(true)}
      />
      <main className="main">
        {page === 'dashboard' && <DashboardPage onNavigate={setPage} onOpenAdd={openAdd} onOpenScan={openScanModal} />}
        {page === 'stock' && <StockPage onOpenAdd={openAdd} onOpenScan={openScanModal} />}
        {page === 'add' && (
          <AddPage onDone={() => setPage('stock')} prefillBarcode={scannedCode} onOpenScan={openScanModal} />
        )}
        {page === 'expiry' && <ExpiryPage />}
        {page === 'reports' && <ReportsPage />}
        {page === 'value' && <ValuePage layout={t.valueLayout || 'a'} />}
        {page === 'wards' && <WardsPage />}
        {page === 'settings' && <SettingsPage />}
      </main>
      <MobileTabbar active={page} onNavigate={setPage} />

      <NotificationsDrawer open={openNotif} onClose={() => setOpenNotif(false)} items={notifItems} />
      <ScannerModal
        open={openScan}
        onClose={() => setOpenScan(false)}
        onCapture={(bc) => {
          setScannedCode(bc);
          setPage('add');
        }}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection title="ความหนาแน่นของข้อมูล">
          <TweakRadio<Density>
            label="Density"
            value={t.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { value: 'comfy', label: 'สบายตา' },
              { value: 'cozy', label: 'มาตรฐาน' },
              { value: 'compact', label: 'หนาแน่น' },
            ]}
          />
        </TweakSection>
        <TweakSection title="สีหลัก">
          <TweakColor
            label="Accent"
            value={t.accent}
            onChange={(v) => setTweak('accent', v)}
            options={['#1E6FEB', '#0EA5E9', '#2563EB', '#0891B2', '#1746A1']}
          />
        </TweakSection>
        <TweakSection title="หน้าราคา & มูลค่า — เลย์เอาต์">
          <TweakRadio<ValueLayout>
            label="Layout"
            value={t.valueLayout || 'a'}
            onChange={(v) => {
              setTweak('valueLayout', v);
              setPage('value');
            }}
            options={[
              { value: 'a', label: 'A · ตารางนำ' },
              { value: 'b', label: 'B · การ์ดวอร์ด' },
            ]}
          />
        </TweakSection>
        <TweakSection title="หน้าจอ">
          <TweakSelect<PageId>
            label="ดูหน้า"
            value={page}
            onChange={setPage}
            options={[
              { value: 'dashboard', label: 'แดชบอร์ด' },
              { value: 'stock', label: 'รายการคงคลัง' },
              { value: 'add', label: 'เพิ่ม/ลงข้อมูล' },
              { value: 'expiry', label: 'หมดอายุ' },
              { value: 'reports', label: 'รายงาน' },
              { value: 'value', label: 'ราคา & มูลค่า' },
              { value: 'wards', label: 'จัดการวอร์ด' },
              { value: 'settings', label: 'ตั้งค่า' },
            ]}
          />
          <TweakButton onClick={openScanModal}>เปิด Barcode Scanner</TweakButton>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

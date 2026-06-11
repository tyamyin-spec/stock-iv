// Inline SVG icons — Lucide-style, 1.75 stroke.

import type { CSSProperties, ReactNode } from 'react';

type IconProps = { size?: number; className?: string; style?: CSSProperties };

type InnerIconProps = IconProps & {
  children: ReactNode;
  strokeWidth?: number;
  fill?: string;
};

const Icon = ({ size = 20, children, className = '', strokeWidth = 1.75, fill = 'none', style }: InnerIconProps) => (
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
    style={style}
    aria-hidden="true"
  >
    {children}
  </svg>
);

type DotProps = IconProps;

export const Icons = {
  IVBag: ({ size = 24, className = '', style }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 28" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M12 1.5c0 0 -8 9.5 -8 15.5a8 8 0 0 0 16 0c0 -6 -8 -15.5 -8 -15.5Z"
        fill="currentColor"
        fillOpacity=".18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 17.5a4 4 0 0 0 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".75" />
    </svg>
  ),
  Home: (p: IconProps) => (
    <Icon {...p}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </Icon>
  ),
  Box: (p: IconProps) => (
    <Icon {...p}>
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
      <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    </Icon>
  ),
  Plus: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  ),
  Chart: (p: IconProps) => (
    <Icon {...p}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-6" />
    </Icon>
  ),
  Bell: (p: IconProps) => (
    <Icon {...p}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Icon>
  ),
  Settings: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </Icon>
  ),
  Search: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Icon>
  ),
  Filter: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 5h16M7 12h10M10 19h4" />
    </Icon>
  ),
  Download: (p: IconProps) => (
    <Icon {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </Icon>
  ),
  Edit: (p: IconProps) => (
    <Icon {...p}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Icon>
  ),
  Trash: (p: IconProps) => (
    <Icon {...p}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6M14 11v6" />
    </Icon>
  ),
  Close: (p: IconProps) => (
    <Icon {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  ),
  Menu: (p: IconProps) => (
    <Icon {...p}>
      <path d="M3 12h18M3 6h18M3 18h18" />
    </Icon>
  ),
  Calendar: (p: IconProps) => (
    <Icon {...p}>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Icon>
  ),
  Building: (p: IconProps) => (
    <Icon {...p}>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </Icon>
  ),
  AlertTri: (p: IconProps) => (
    <Icon {...p}>
      <path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Icon>
  ),
  Clock: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  ),
  ExpiredCal: (p: IconProps) => (
    <Icon {...p}>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m9 16 6-6M15 16 9 10" />
    </Icon>
  ),
  ArrowUp: (p: IconProps) => (
    <Icon {...p}>
      <path d="m18 15-6-6-6 6" />
    </Icon>
  ),
  ArrowDown: (p: IconProps) => (
    <Icon {...p}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  ),
  ArrowRight: (p: IconProps) => (
    <Icon {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </Icon>
  ),
  ArrowLeft: (p: IconProps) => (
    <Icon {...p}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </Icon>
  ),
  Check: (p: IconProps) => (
    <Icon {...p}>
      <path d="m5 12 5 5L20 7" />
    </Icon>
  ),
  CheckCircle: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  ),
  Info: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </Icon>
  ),
  Barcode: (p: IconProps) => (
    <Icon {...p} strokeWidth={1.6}>
      <path d="M3 5v14M6 5v14M8 5v14M11 5v14M13 5v10M16 5v14M18 5v14M21 5v14" />
    </Icon>
  ),
  Scan: (p: IconProps) => (
    <Icon {...p}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </Icon>
  ),
  Flask: (p: IconProps) => (
    <Icon {...p}>
      <path d="M10 2v7.31" />
      <path d="M14 9.3V2" />
      <path d="M8.5 2h7" />
      <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
      <path d="M5.52 16h12.96" />
    </Icon>
  ),
  Clipboard: (p: IconProps) => (
    <Icon {...p}>
      <rect width="8" height="4" x="8" y="2" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 14h6M9 18h4" />
    </Icon>
  ),
  User: (p: IconProps) => (
    <Icon {...p}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  ),
  Refresh: (p: IconProps) => (
    <Icon {...p}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </Icon>
  ),
  ChevronRight: (p: IconProps) => (
    <Icon {...p}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  ),
  ChevronDown: (p: IconProps) => (
    <Icon {...p}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  ),
  Dot: ({ size = 8, className = '', style }: DotProps) => (
    <svg width={size} height={size} viewBox="0 0 8 8" className={className} style={style} aria-hidden="true">
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  ),
  Logout: (p: IconProps) => (
    <Icon {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </Icon>
  ),
  Print: (p: IconProps) => (
    <Icon {...p}>
      <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="8" x="6" y="14" rx="1" />
    </Icon>
  ),
  Coins: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </Icon>
  ),
  Tag: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l8.7 8.71a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42Z" />
      <circle cx="7.5" cy="7.5" r=".75" fill="currentColor" stroke="none" />
    </Icon>
  ),
  Wallet: (p: IconProps) => (
    <Icon {...p}>
      <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" />
      <path d="M16 12h.01" />
    </Icon>
  ),
};

export type IconKey = keyof typeof Icons;

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type NavItem = {
  href: string;
  label: string;
  icon: 'dashboard' | 'invoice' | 'customers' | 'receipts' | 'trips' | 'vat' | 'roadmap' | 'score' | 'settings';
};

const baseNavItems: NavItem[] = [
  { href: '/app/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/app/facturen', label: 'Facturen', icon: 'invoice' },
  { href: '/app/klanten', label: 'Klanten', icon: 'customers' },
  { href: '/app/bonnetjes', label: 'Bonnetjes', icon: 'receipts' },
  { href: '/app/ritten', label: 'Ritten', icon: 'trips' },
  { href: '/app/btw', label: 'BTW', icon: 'vat' },
  { href: '/app/roadmap', label: 'Roadmap', icon: 'roadmap' },
  { href: '/app/instellingen', label: 'Instellingen', icon: 'settings' },
];

function NavIcon({ name }: { name: NavItem['icon'] }) {
  const base = 'h-5 w-5 stroke-current';
  switch (name) {
***REMOVED***case 'dashboard':
***REMOVED***  return (
***REMOVED******REMOVED***<svg aria-hidden viewBox="0 0 24 24" className={base} fill="none" strokeWidth={1.6}>
***REMOVED******REMOVED***  <rect x="3" y="3" width="8" height="7" rx="2" />
***REMOVED******REMOVED***  <rect x="13" y="3" width="8" height="4" rx="2" />
***REMOVED******REMOVED***  <rect x="13" y="9" width="8" height="12" rx="2" />
***REMOVED******REMOVED***  <rect x="3" y="12" width="8" height="9" rx="2" />
***REMOVED******REMOVED***</svg>
***REMOVED***  );
***REMOVED***case 'invoice':
***REMOVED***  return (
***REMOVED******REMOVED***<svg aria-hidden viewBox="0 0 24 24" className={base} fill="none" strokeWidth={1.6}>
***REMOVED******REMOVED***  <path d="M7 3h7.5L19 7.5V21H7z" />
***REMOVED******REMOVED***  <path d="M14.5 3V7.5H19" />
***REMOVED******REMOVED***  <path d="M10 11h5" />
***REMOVED******REMOVED***  <path d="M10 14.5h5" />
***REMOVED******REMOVED***</svg>
***REMOVED***  );
***REMOVED***case 'customers':
***REMOVED***  return (
***REMOVED******REMOVED***<svg aria-hidden viewBox="0 0 24 24" className={base} fill="none" strokeWidth={1.6}>
***REMOVED******REMOVED***  <circle cx="9" cy="9" r="3.2" />
***REMOVED******REMOVED***  <path d="M4.5 18.5C5.4 16.3 7.2 15 9 15s3.6 1.3 4.5 3.5" />
***REMOVED******REMOVED***  <circle cx="17" cy="8" r="2.4" />
***REMOVED******REMOVED***  <path d="M14.5 15.2C15.2 14.3 16 14 17 14c1.4 0 2.6.9 3.2 2.4" />
***REMOVED******REMOVED***</svg>
***REMOVED***  );
***REMOVED***case 'receipts':
***REMOVED***  return (
***REMOVED******REMOVED***<svg aria-hidden viewBox="0 0 24 24" className={base} fill="none" strokeWidth={1.6}>
***REMOVED******REMOVED***  <path d="M7 3.5 9 5l2-1.5L13 5l2-1.5L17 5l2-1.5V20l-2-1.5-2 1.5-2-1.5L9 20l-2-1.5L5 20V4z" />
***REMOVED******REMOVED***  <path d="M9 9.5h6" />
***REMOVED******REMOVED***  <path d="M9 13h4" />
***REMOVED******REMOVED***</svg>
***REMOVED***  );
***REMOVED***case 'trips':
***REMOVED***  return (
***REMOVED******REMOVED***<svg aria-hidden viewBox="0 0 24 24" className={base} fill="none" strokeWidth={1.6}>
***REMOVED******REMOVED***  <path d="M12 3l8 4v8l-8 4-8-4v-8l8-4z" />
***REMOVED******REMOVED***  <path d="M12 3v10" />
***REMOVED******REMOVED***  <path d="M4 7l8 4" />
***REMOVED******REMOVED***  <path d="M20 7l-8 4" />
***REMOVED******REMOVED***</svg>
***REMOVED***  );
***REMOVED***case 'vat':
***REMOVED***  return (
***REMOVED******REMOVED***<svg aria-hidden viewBox="0 0 24 24" className={base} fill="none" strokeWidth={1.6}>
***REMOVED******REMOVED***  <path d="M5 18c1.2-2.8 3.4-4.5 6-4.5 2.6 0 4.8 1.7 6 4.5" />
***REMOVED******REMOVED***  <circle cx="11" cy="9" r="3.2" />
***REMOVED******REMOVED***  <path d="M17 4v7" />
***REMOVED******REMOVED***  <path d="M15.25 5.75 17 4l1.75 1.75" />
***REMOVED******REMOVED***</svg>
***REMOVED***  );
***REMOVED***case 'settings':
***REMOVED***  return (
***REMOVED******REMOVED***<svg aria-hidden viewBox="0 0 24 24" className={base} fill="none" strokeWidth={1.6}>
***REMOVED******REMOVED***  <circle cx="12" cy="12" r="3" />
***REMOVED******REMOVED***  <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
***REMOVED******REMOVED***  <circle cx="12" cy="12" r="8" />
***REMOVED******REMOVED***</svg>
***REMOVED***  );
***REMOVED***case 'roadmap':
***REMOVED***  return (
***REMOVED******REMOVED***<svg aria-hidden viewBox="0 0 24 24" className={base} fill="none" strokeWidth={1.6}>
***REMOVED******REMOVED***  <path d="M5 5v14" />
***REMOVED******REMOVED***  <path d="M5 6.5h9l-1.2 2.6L14 12H7.5" />
***REMOVED******REMOVED***  <circle cx="5" cy="5" r="1.3" fill="currentColor" stroke="none" />
***REMOVED******REMOVED***  <circle cx="5" cy="19" r="1.3" fill="currentColor" stroke="none" />
***REMOVED******REMOVED***</svg>
***REMOVED***  );
***REMOVED***case 'score':
***REMOVED***  return (
***REMOVED******REMOVED***<svg aria-hidden viewBox="0 0 24 24" className={base} fill="none" strokeWidth={1.6}>
***REMOVED******REMOVED***  <path d="M4 18h16" />
***REMOVED******REMOVED***  <path d="M7 18v-4" />
***REMOVED******REMOVED***  <path d="M12 18v-7" />
***REMOVED******REMOVED***  <path d="M17 18v-10" />
***REMOVED******REMOVED***</svg>
***REMOVED***  );
***REMOVED***default:
***REMOVED***  return null;
  }
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [enableClientScore, setEnableClientScore] = useState(false);

  useEffect(() => {
***REMOVED***const raw = localStorage.getItem('fiscaliq.featureFlags.v1');
***REMOVED***if (raw) {
***REMOVED***  try {
***REMOVED******REMOVED***const parsed = JSON.parse(raw) as { enableClientScore?: boolean };
***REMOVED******REMOVED***setEnableClientScore(Boolean(parsed.enableClientScore));
***REMOVED***  } catch {}
***REMOVED***}
***REMOVED***const onStorage = () => {
***REMOVED***  const current = localStorage.getItem('fiscaliq.featureFlags.v1');
***REMOVED***  if (!current) {
***REMOVED******REMOVED***setEnableClientScore(false);
***REMOVED******REMOVED***return;
***REMOVED***  }
***REMOVED***  try {
***REMOVED******REMOVED***const parsed = JSON.parse(current) as { enableClientScore?: boolean };
***REMOVED******REMOVED***setEnableClientScore(Boolean(parsed.enableClientScore));
***REMOVED***  } catch {}
***REMOVED***};
***REMOVED***window.addEventListener('storage', onStorage);
***REMOVED***return () => window.removeEventListener('storage', onStorage);
  }, []);

  const navItems = [
***REMOVED***...baseNavItems.slice(0, 7),
***REMOVED***...(enableClientScore ? ([{ href: '/app/klantscore', label: 'Klantscore', icon: 'score' }] as NavItem[]) : []),
***REMOVED***baseNavItems[7],
  ];

  useEffect(() => {
***REMOVED***async function checkAuth() {
***REMOVED***  const { data, error } = await supabase.auth.getUser();
***REMOVED***  if (error || !data.user) {
***REMOVED******REMOVED***router.replace('/login');
***REMOVED******REMOVED***return;
***REMOVED***  }
***REMOVED***  setUserEmail(data.user.email ?? null);
***REMOVED***  setAuthChecked(true);
***REMOVED***}
***REMOVED***checkAuth();
  }, [router]);

  async function handleLogout() {
***REMOVED***await supabase.auth.signOut();
***REMOVED***router.replace('/login');
  }

  if (!authChecked) {
***REMOVED***return (
***REMOVED***  <div className="flex min-h-screen items-center justify-center bg-bg text-text">
***REMOVED******REMOVED***<div className="rounded-2xl border border-border bg-surface px-6 py-4 text-sm text-muted shadow-sm">
***REMOVED******REMOVED***  Even controleren of je bent ingelogd…
***REMOVED******REMOVED***</div>
***REMOVED***  </div>
***REMOVED***);
  }

  return (
***REMOVED***<div className="flex min-h-screen bg-bg text-text">
***REMOVED***  {/* Desktop sidebar */}
***REMOVED***  <aside
***REMOVED******REMOVED***className={`hidden border-r border-border bg-surface transition-all duration-200 ease-out md:flex md:flex-col ${
***REMOVED******REMOVED***  sidebarOpen ? 'w-64' : 'w-20'
***REMOVED******REMOVED***}`}
***REMOVED***  >
***REMOVED******REMOVED***<div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
***REMOVED******REMOVED***  <Link href="/" className="flex items-center gap-2">
***REMOVED******REMOVED******REMOVED***<div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white">
***REMOVED******REMOVED******REMOVED***  FQ
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***{sidebarOpen && (
***REMOVED******REMOVED******REMOVED***  <div className="flex flex-col">
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="text-sm font-semibold tracking-tight">Fiscaliq</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="text-[11px] text-muted">Rust in je administratie</span>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED***  </Link>
***REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED***onClick={() => setSidebarOpen((prev) => !prev)}
***REMOVED******REMOVED******REMOVED***className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs text-muted hover:bg-surface-2"
***REMOVED******REMOVED******REMOVED***aria-label={sidebarOpen ? 'Zijbalk inklappen' : 'Zijbalk uitklappen'}
***REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED***☰
***REMOVED******REMOVED***  </button>
***REMOVED******REMOVED***</div>

***REMOVED******REMOVED***<nav className="flex-1 space-y-1 px-2 py-3 text-sm">
***REMOVED******REMOVED***  {navItems.map((item) => {
***REMOVED******REMOVED******REMOVED***const active = pathname?.startsWith(item.href);
***REMOVED******REMOVED******REMOVED***return (
***REMOVED******REMOVED******REMOVED***  <Link
***REMOVED******REMOVED******REMOVED******REMOVED***key={item.href}
***REMOVED******REMOVED******REMOVED******REMOVED***href={item.href}
***REMOVED******REMOVED******REMOVED******REMOVED***className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-surface-offset ${
***REMOVED******REMOVED******REMOVED******REMOVED***  active ? 'bg-surface-offset text-primary' : 'text-muted'
***REMOVED******REMOVED******REMOVED******REMOVED***}`}
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="flex h-7 w-7 items-center justify-center rounded-xl bg-surface-offset-2 text-[11px]">
***REMOVED******REMOVED******REMOVED******REMOVED***  <NavIcon name={item.icon} />
***REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED***{sidebarOpen && <span className="truncate">{item.label}</span>}
***REMOVED******REMOVED******REMOVED***  </Link>
***REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***  })}
***REMOVED******REMOVED***</nav>

***REMOVED******REMOVED***<div className="border-t border-border px-4 py-3 text-[11px] text-muted">
***REMOVED******REMOVED***  <div className="flex items-center justify-between gap-2">
***REMOVED******REMOVED******REMOVED***<div className="flex flex-col">
***REMOVED******REMOVED******REMOVED***  <span className="text-[11px] font-medium text-text">Ingelogd</span>
***REMOVED******REMOVED******REMOVED***  {userEmail && <span className="max-w-[140px] truncate text-[10px]">{userEmail}</span>}
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED***  onClick={handleLogout}
***REMOVED******REMOVED******REMOVED***  className="rounded-full bg-surface-offset px-3 py-1 text-[10px] font-medium text-text hover:bg-surface-offset-2"
***REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED***  Uitloggen
***REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </aside>

***REMOVED***  {/* Main area with mobile topbar */}
***REMOVED***  <div className="flex flex-1 flex-col">
***REMOVED******REMOVED***<header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
***REMOVED******REMOVED***  <div className="flex items-center gap-2">
***REMOVED******REMOVED******REMOVED***<div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary text-xs font-semibold text-white">
***REMOVED******REMOVED******REMOVED***  FQ
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<span className="text-sm font-semibold tracking-tight">Fiscaliq</span>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED***onClick={() => setSidebarOpen((prev) => !prev)}
***REMOVED******REMOVED******REMOVED***className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs text-muted hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED***aria-label={sidebarOpen ? 'Menu verbergen' : 'Menu tonen'}
***REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED***☰
***REMOVED******REMOVED***  </button>
***REMOVED******REMOVED***</header>

***REMOVED******REMOVED***{/* Mobile slide-in sidebar */}
***REMOVED******REMOVED***{sidebarOpen && (
***REMOVED******REMOVED***  <div className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface px-2 py-3 text-sm shadow-lg md:hidden">
***REMOVED******REMOVED******REMOVED***<div className="mb-3 flex items-center justify-between px-2">
***REMOVED******REMOVED******REMOVED***  <span className="text-sm font-semibold tracking-tight">Menu</span>
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => setSidebarOpen(false)}
***REMOVED******REMOVED******REMOVED******REMOVED***className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[11px] text-muted hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***✕
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<nav className="flex-1 space-y-1">
***REMOVED******REMOVED******REMOVED***  {navItems.map((item) => {
***REMOVED******REMOVED******REMOVED******REMOVED***const active = pathname?.startsWith(item.href);
***REMOVED******REMOVED******REMOVED******REMOVED***return (
***REMOVED******REMOVED******REMOVED******REMOVED***  <Link
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key={item.href}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***href={item.href}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => setSidebarOpen(false)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-surface-offset ${
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  active ? 'bg-surface-offset text-primary' : 'text-muted'
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}`}
***REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="flex h-7 w-7 items-center justify-center rounded-xl bg-surface-offset-2 text-[11px]">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <NavIcon name={item.icon} />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="truncate">{item.label}</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Link>
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED***  })}
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={handleLogout}
***REMOVED******REMOVED******REMOVED******REMOVED***className="mt-3 w-full rounded-2xl bg-surface-offset px-3 py-2 text-left text-[11px] font-medium text-text hover:bg-surface-offset-2"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***Uitloggen
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***</nav>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***)}

***REMOVED******REMOVED***{/* Main content */}
***REMOVED******REMOVED***<main className="flex-1 bg-bg px-4 py-4 md:px-8 md:py-6">
***REMOVED******REMOVED***  <div className="mx-auto max-w-6xl">{children}</div>
***REMOVED******REMOVED***</main>
***REMOVED***  </div>
***REMOVED***</div>
  );
}

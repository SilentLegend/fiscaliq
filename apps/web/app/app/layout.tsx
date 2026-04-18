'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/app/dashboard', label: 'Dashboard' },
  { href: '/app/facturen', label: 'Facturen' },
  { href: '/app/klanten', label: 'Klanten' },
  { href: '/app/bonnetjes', label: 'Bonnetjes' },
  { href: '/app/btw', label: 'BTW' },
  { href: '/app/instellingen', label: 'Instellingen' },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
***REMOVED***<div className="flex min-h-screen bg-bg text-text">
***REMOVED***  {/* Sidebar */}
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
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="flex h-6 w-6 items-center justify-center rounded-xl bg-surface-offset-2 text-[11px] font-semibold">
***REMOVED******REMOVED******REMOVED******REMOVED***  {item.label.charAt(0)}
***REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED***{sidebarOpen && <span className="truncate">{item.label}</span>}
***REMOVED******REMOVED******REMOVED***  </Link>
***REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***  })}
***REMOVED******REMOVED***</nav>

***REMOVED******REMOVED***<div className="border-t border-border px-4 py-3 text-[11px] text-muted">
***REMOVED******REMOVED***  <div className="flex items-center justify-between">
***REMOVED******REMOVED******REMOVED***<span>Ingelogd</span>
***REMOVED******REMOVED******REMOVED***<span className="rounded-full bg-surface-offset px-2 py-0.5 text-[10px]">ZZP</span>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </aside>

***REMOVED***  {/* Mobile topbar */}
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
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="flex h-6 w-6 items-center justify-center rounded-xl bg-surface-offset-2 text-[11px] font-semibold">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {item.label.charAt(0)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="truncate">{item.label}</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Link>
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED***  })}
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

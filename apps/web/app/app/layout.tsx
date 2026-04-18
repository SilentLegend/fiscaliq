import '../globals.css';
import Link from 'next/link';

const appNav = [
  { label: 'Dashboard', href: '/app/dashboard' },
  { label: 'Facturen', href: '/app/facturen' },
  { label: 'Klanten', href: '/app/klanten' },
  { label: 'Bonnetjes', href: '/app/bonnetjes' },
  { label: 'BTW', href: '/app/btw' },
  { label: 'Instellingen', href: '/app/instellingen' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
***REMOVED***<div className="min-h-screen bg-bg text-text">
***REMOVED***  <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-8">
***REMOVED******REMOVED***<aside className="w-full max-w-xs shrink-0 rounded-[1.8rem] border border-border bg-surface p-4 md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
***REMOVED******REMOVED***  <div className="flex items-center justify-between gap-3 px-2 pb-4">
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Werkruimte</div>
***REMOVED******REMOVED******REMOVED***  <div className="mt-1 text-lg font-semibold tracking-tight">Fiscaliq</div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<Link
***REMOVED******REMOVED******REMOVED***  href="/"
***REMOVED******REMOVED******REMOVED***  className="rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-medium text-muted hover:text-text"
***REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED***  Terug naar site
***REMOVED******REMOVED******REMOVED***</Link>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <nav className="mt-2 space-y-1">
***REMOVED******REMOVED******REMOVED***{appNav.map((item) => (
***REMOVED******REMOVED******REMOVED***  <Link
***REMOVED******REMOVED******REMOVED******REMOVED***key={item.href}
***REMOVED******REMOVED******REMOVED******REMOVED***href={item.href}
***REMOVED******REMOVED******REMOVED******REMOVED***className="block rounded-2xl px-4 py-3 text-sm font-medium text-muted hover:bg-highlight hover:text-primary data-[active=true]:bg-highlight data-[active=true]:text-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***data-active={typeof window !== 'undefined' && window.location.pathname === item.href}
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***{item.label}
***REMOVED******REMOVED******REMOVED***  </Link>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </nav>
***REMOVED******REMOVED***</aside>
***REMOVED******REMOVED***<main className="flex-1 rounded-[1.8rem] border border-border bg-surface p-5 shadow-soft md:p-7">
***REMOVED******REMOVED***  {children}
***REMOVED******REMOVED***</main>
***REMOVED***  </div>
***REMOVED***</div>
  );
}

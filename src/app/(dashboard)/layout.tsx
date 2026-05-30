import { Header } from '@/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar is rendered inside Header for mobile toggle */}
      <Header />

      {/* Desktop sidebar spacer */}
      <aside className="hidden lg:block w-64 shrink-0" aria-hidden="true" />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="page-container">{children}</div>
      </div>
    </div>
  );
}

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fiscaliq',
  description: 'Betaalbaar boekhouden voor kleine zzp’ers in Nederland.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
***REMOVED***<html lang="nl">
***REMOVED***  <body className="min-h-screen bg-bg text-text antialiased">{children}</body>
***REMOVED***</html>
  );
}

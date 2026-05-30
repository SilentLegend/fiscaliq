'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-neutral-200 sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="btn-ghost p-1"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-lg font-bold text-primary-800">Fiscaliq</span>
        <div className="w-8" /> {/* Spacer for centering */}
      </header>
    </>
  );
}

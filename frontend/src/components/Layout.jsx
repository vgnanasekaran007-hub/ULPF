import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ children, currentPath, onNavigate, pageTitle, onQuickDemo }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-72 flex-1 flex flex-col min-w-0 bg-slate-950">
        <Topbar
          onOpenSidebar={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
          onQuickDemo={onQuickDemo}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6 bg-slate-950">
          {children}
        </main>

        <footer className="py-4 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-400">
          ULPF © 2026 • SIH Submission Prototype • <span className="font-mono text-blue-400">Any Log → One Standard Schema</span>
        </footer>
      </div>
    </div>
  );
}

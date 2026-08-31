import React from 'react';
import { Menu } from 'lucide-react';

export default function Topbar({ onOpenSidebar, pageTitle }) {
  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base font-bold text-white leading-tight tracking-tight">{pageTitle}</h2>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Universal Log Pre-processing Framework — <span className="font-semibold text-blue-400">"Any Log → One Standard"</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Engine Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Engine Online
        </div>
      </div>
    </header>
  );
}

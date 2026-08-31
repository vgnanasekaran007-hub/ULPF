import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Database, 
  Sliders, 
  ShieldCheck, 
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/processing', label: 'Log Processing', icon: Cpu },
  { path: '/events', label: 'Events', icon: Database },
  { path: '/parsers', label: 'Parser Registry', icon: Sliders },
];

export default function Sidebar({ currentPath, onNavigate, isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container - Expanded Width (w-72) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-950 text-slate-200 border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wider font-mono flex items-center gap-2">
                ULPF <span className="text-[11px] bg-blue-500/20 text-blue-400 font-sans px-2 py-0.5 rounded font-semibold border border-blue-500/30">v1.0</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Log Pre-processing Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items - Larger Touch & Access Boxes */}
        <nav className="flex-1 px-4 py-6 space-y-2.5 overflow-y-auto">
          <div className="px-3 pb-3 text-xs uppercase font-bold tracking-wider text-slate-400">
            Core Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold border border-blue-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/90 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

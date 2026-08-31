import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color = 'blue', description }) {
  const colorMap = {
    blue: 'bg-blue-950/80 text-blue-400 border-blue-800/80',
    green: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80',
    red: 'bg-red-950/80 text-red-400 border-red-800/80',
    amber: 'bg-amber-950/80 text-amber-400 border-amber-800/80',
    purple: 'bg-purple-950/80 text-purple-400 border-purple-800/80',
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-sm transition-all hover:border-slate-700 hover:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-white tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${colorMap[color] || colorMap.blue}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}

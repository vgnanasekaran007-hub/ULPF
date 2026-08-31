import React from 'react';

export default function StatusBadge({ status, type = 'status' }) {
  const value = String(status || '').toLowerCase();

  let colorClasses = 'bg-slate-900 text-slate-300 border-slate-800';

  if (type === 'severity') {
    switch (value) {
      case 'critical':
      case 'high':
        colorClasses = 'bg-red-950/80 text-red-400 border-red-800/80 font-semibold';
        break;
      case 'medium':
        colorClasses = 'bg-amber-950/80 text-amber-400 border-amber-800/80';
        break;
      case 'low':
        colorClasses = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
        break;
      default:
        colorClasses = 'bg-slate-900 text-slate-400 border-slate-800';
    }
  } else if (type === 'source') {
    switch (value) {
      case 'linux':
        colorClasses = 'bg-blue-950/80 text-blue-400 border-blue-800/80';
        break;
      case 'windows':
        colorClasses = 'bg-indigo-950/80 text-indigo-400 border-indigo-800/80';
        break;
      case 'firewall':
        colorClasses = 'bg-purple-950/80 text-purple-400 border-purple-800/80';
        break;
      case 'application':
        colorClasses = 'bg-teal-950/80 text-teal-400 border-teal-800/80';
        break;
      default:
        colorClasses = 'bg-slate-900 text-slate-300 border-slate-800';
    }
  } else {
    // General Status
    switch (value) {
      case 'processed':
      case 'active':
      case 'success':
        colorClasses = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
        break;
      case 'failed':
      case 'error':
        colorClasses = 'bg-red-950/80 text-red-400 border-red-800/80';
        break;
      case 'warning':
      case 'unknown':
        colorClasses = 'bg-amber-950/80 text-amber-400 border-amber-800/80';
        break;
      default:
        colorClasses = 'bg-slate-900 text-slate-300 border-slate-800';
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}>
      <span className="capitalize">{status}</span>
    </span>
  );
}

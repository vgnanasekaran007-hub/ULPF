import React from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function EventTable({ events = [], onSelectEvent }) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-8 text-center">
        <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-300">No Normalized Events Found</p>
        <p className="text-xs text-slate-500 mt-1">Try clearing filters or processing a new log in Log Processing page.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Event ID</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Event Type</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Source IP</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Parser</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {events.map((ev) => (
              <tr
                key={ev.event_id}
                onClick={() => onSelectEvent(ev)}
                className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3 font-semibold text-blue-400 group-hover:text-blue-300 whitespace-nowrap">
                  {ev.event_id}
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-sans text-[11px]">
                  {ev.timestamp ? ev.timestamp.replace('T', ' ').replace('Z', '') : '-'}
                </td>
                <td className="px-4 py-3 font-sans whitespace-nowrap">
                  <StatusBadge status={ev.source} type="source" />
                </td>
                <td className="px-4 py-3 text-slate-200 font-sans font-medium whitespace-nowrap">
                  {ev.event_type}
                </td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                  {ev.user || '-'}
                </td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                  {ev.source_ip || '-'}
                </td>
                <td className="px-4 py-3 font-sans whitespace-nowrap">
                  <StatusBadge status={ev.severity} type="severity" />
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-sans text-[11px]">
                  {ev.parser_id}
                </td>
                <td className="px-4 py-3 text-right font-sans whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(ev);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium text-slate-300 bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors border border-slate-700"
                  >
                    Details
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

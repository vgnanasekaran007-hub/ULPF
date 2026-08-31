import React from 'react';
import StatusBadge from './StatusBadge';

export default function ParserCard({ parser }) {
  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-sm transition-all hover:border-slate-700 hover:bg-slate-900 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
            {parser.parser_id}
          </span>
          <StatusBadge status={parser.status} />
        </div>

        <h4 className="text-base font-bold text-white mt-3">{parser.name}</h4>
        <p className="text-xs text-slate-400 mt-1">{parser.supported_format}</p>
      </div>

      <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Engine Version</span>
          <span className="font-mono text-slate-200 font-semibold">{parser.version}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Events Normalized</span>
          <span className="font-mono text-emerald-400 font-bold">
            {parser.events_processed ? parser.events_processed.toLocaleString() : 0}
          </span>
        </div>
      </div>
    </div>
  );
}

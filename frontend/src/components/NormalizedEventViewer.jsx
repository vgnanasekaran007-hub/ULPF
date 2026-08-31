import React, { useState } from 'react';
import { Copy, Check, Code2, Sparkles, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function NormalizedEventViewer({ eventData }) {
  const [copied, setCopied] = useState(false);

  const formattedJson = eventData
    ? JSON.stringify(
        {
          event_id: eventData.event_id,
          timestamp: eventData.timestamp,
          event_type: eventData.event_type,
          source: eventData.source,
          user: eventData.user,
          source_ip: eventData.source_ip,
          severity: eventData.severity,
          parser_id: eventData.parser_id,
          raw_log_hash: eventData.raw_log_hash,
        },
        null,
        2
      )
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-full shadow-xs">
      {/* Header */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Normalized Event JSON</span>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> ULPF Standard Schema
          </span>
        </div>

        <button
          onClick={handleCopy}
          disabled={!eventData}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy JSON'}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 flex-1 overflow-auto font-mono text-xs text-emerald-300 leading-relaxed bg-slate-900 selection:bg-emerald-900 selection:text-white">
        {formattedJson ? (
          <pre className="whitespace-pre-wrap break-all">{formattedJson}</pre>
        ) : (
          <div className="text-slate-500 italic flex items-center justify-center h-48">
            No normalized event available. Process a log to see result.
          </div>
        )}
      </div>
    </div>
  );
}

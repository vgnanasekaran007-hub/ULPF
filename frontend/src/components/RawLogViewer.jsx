import React, { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';

export default function RawLogViewer({ rawLog }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-full shadow-xs">
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-200">Original Raw Log</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            {rawLog ? `${rawLog.length} bytes` : 'Empty'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          disabled={!rawLog}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="p-4 flex-1 overflow-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-900 selection:bg-blue-900 selection:text-white">
        {rawLog ? (
          <pre className="whitespace-pre-wrap break-all">{rawLog}</pre>
        ) : (
          <div className="text-slate-500 italic flex items-center justify-center h-48">
            No raw log available. Ingest a log above to process.
          </div>
        )}
      </div>
    </div>
  );
}

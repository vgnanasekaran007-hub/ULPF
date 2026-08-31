import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ShieldCheck, Hash, Terminal, Code2, Download } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { apiService } from '../services/api';
import { exportEventsToCSV } from '../utils/csvExporter';

export default function EventDetailsDrawer({ event, isOpen, onClose }) {
  const [eventDetail, setEventDetail] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (event?.event_id) {
      apiService.getEventDetail(event.event_id).then(res => {
        setEventDetail(res);
      });
    } else {
      setEventDetail(null);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleCopyHash = () => {
    if (eventDetail?.raw_log_hash) {
      navigator.clipboard.writeText(eventDetail.raw_log_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleExportSingleCSV = () => {
    exportEventsToCSV([eventDetail || event], `ulpf_event_${event.event_id}.csv`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-4xl bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-200 text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-mono tracking-tight text-white">{event.event_id}</h2>
                <StatusBadge status={event.severity} type="severity" />
                <StatusBadge status={event.source} type="source" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{event.event_type} • Normalized Event Record</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSingleCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] uppercase font-semibold text-slate-400">User Account</p>
              <p className="text-sm font-semibold text-slate-100 font-mono mt-0.5">{event.user || 'N/A'}</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Source IP Address</p>
              <p className="text-sm font-semibold text-slate-100 font-mono mt-0.5">{event.source_ip || 'N/A'}</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Parser ID</p>
              <p className="text-xs font-semibold text-slate-100 font-mono mt-0.5">{event.parser_id}</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Processing Time</p>
              <p className="text-xs font-semibold text-emerald-400 font-mono mt-0.5">{event.processing_time_ms} ms</p>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash Card */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-purple-400" />
                Raw Log SHA-256 Fingerprint (Preservation Link)
              </span>
              <button
                onClick={handleCopyHash}
                className="text-[11px] font-medium text-slate-400 hover:text-blue-400 flex items-center gap-1"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedHash ? 'Copied' : 'Copy Hash'}
              </button>
            </div>
            <div className="bg-slate-950 text-emerald-400 font-mono text-xs p-2.5 rounded-lg border border-slate-800 break-all select-all">
              {eventDetail?.raw_log_hash || event.raw_log_hash || 'Calculating...'}
            </div>
          </div>

          {/* Side-by-side Raw vs Normalized Panels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Log Comparison (Raw vs Normalized)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-80">
              {/* Raw Log Panel */}
              <div className="bg-slate-950 rounded-xl p-3 text-slate-200 font-mono text-xs overflow-auto border border-slate-800">
                <div className="text-[11px] text-slate-400 font-sans border-b border-slate-800 pb-1.5 mb-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" /> Original Raw Log Input
                </div>
                <pre className="whitespace-pre-wrap break-all">{eventDetail?.raw_log || 'Loading raw log content...'}</pre>
              </div>

              {/* Normalized JSON Panel */}
              <div className="bg-slate-950 rounded-xl p-3 text-emerald-300 font-mono text-xs overflow-auto border border-slate-800">
                <div className="text-[11px] text-slate-400 font-sans border-b border-slate-800 pb-1.5 mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Normalized Event Object
                </div>
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(eventDetail || event, null, 2)}</pre>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

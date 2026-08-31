import React, { useState } from 'react';
import { 
  Cpu, 
  Hash, 
  ShieldCheck, 
  ArrowRight,
  Copy,
  Check,
  Download
} from 'lucide-react';
import LogUploader from '../components/LogUploader';
import Pipeline from '../components/Pipeline';
import RawLogViewer from '../components/RawLogViewer';
import NormalizedEventViewer from '../components/NormalizedEventViewer';
import StatusBadge from '../components/StatusBadge';
import { SAMPLE_LOGS } from '../sampleData';
import { apiService } from '../services/api';
import { exportEventsToCSV } from '../utils/csvExporter';

export default function LogProcessing({ onSelectEvent }) {
  const [rawLog, setRawLog] = useState(SAMPLE_LOGS.linux.content);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleProcessLog = async (logText) => {
    if (!logText || !logText.trim()) return;

    setIsProcessing(true);
    setProcessResult(null);

    try {
      const result = await apiService.processLog(logText);
      setProcessResult(result);
    } catch (err) {
      console.error("Processing failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyHash = () => {
    if (processResult?.raw_log_hash) {
      navigator.clipboard.writeText(processResult.raw_log_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleExportProcessedCSV = () => {
    if (processResult) {
      exportEventsToCSV([processResult], `ulpf_processed_${processResult.event_id}.csv`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          Log Processing Engine (Prototype Centerpiece)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Demonstrates raw log format detection, parsing, normalization into ULPF schema, and SHA-256 raw log preservation.
        </p>
      </div>

      {/* Log Ingest & Upload Box */}
      <LogUploader
        rawLog={rawLog}
        setRawLog={setRawLog}
        onProcess={handleProcessLog}
        isProcessing={isProcessing}
      />

      {/* Live Pipeline Status */}
      <Pipeline
        isProcessing={isProcessing}
        stages={processResult?.pipeline_stages || []}
        activeStageIndex={processResult ? 6 : 0}
      />

      {/* Main Results Showcase: Side by Side Raw vs Normalized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[380px]">
        {/* Left Panel: Original Raw Log */}
        <RawLogViewer rawLog={processResult?.raw_log || rawLog} />

        {/* Right Panel: Normalized Event JSON */}
        <NormalizedEventViewer eventData={processResult} />
      </div>

      {/* Bottom Metadata Summary Panel */}
      {processResult && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Normalisation Verification & Hash Digest</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportProcessedCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>

              <button
                onClick={() => onSelectEvent(processResult)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                View Detailed Record
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Key Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Event ID</span>
              <span className="text-xs font-mono font-bold text-blue-400 mt-0.5 block">{processResult.event_id}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Detected Source</span>
              <div className="mt-0.5">
                <StatusBadge status={processResult.source} type="source" />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Event Type</span>
              <span className="text-xs font-medium text-slate-200 mt-0.5 block truncate">{processResult.event_type}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Parser ID</span>
              <span className="text-xs font-mono font-medium text-slate-300 mt-0.5 block">{processResult.parser_id}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Processing Time</span>
              <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">{processResult.processing_time_ms} ms</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Confidence Score</span>
              <span className="text-xs font-mono font-bold text-purple-400 mt-0.5 block">{(processResult.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Preservation Line */}
          <div className="bg-slate-950 rounded-lg p-3 text-slate-200 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Hash className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="font-semibold text-slate-400 shrink-0">SHA-256 Raw Log Hash:</span>
              <span className="font-mono text-emerald-400 truncate select-all">{processResult.raw_log_hash}</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 font-medium shrink-0 self-start sm:self-auto"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedHash ? 'Copied' : 'Copy Hash'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

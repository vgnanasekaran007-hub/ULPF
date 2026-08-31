import React, { useState } from 'react';
import { UploadCloud, Terminal, Play, RefreshCw, Download } from 'lucide-react';
import { SAMPLE_LOGS } from '../sampleData';

export default function LogUploader({ onProcess, isProcessing, rawLog, setRawLog }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      readFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]);
    }
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawLog(event.target.result);
      setSelectedSample(null);
    };
    reader.readAsText(file);
  };

  const loadSample = (key) => {
    const sample = SAMPLE_LOGS[key];
    if (sample) {
      setRawLog(sample.content);
      setSelectedSample(key);
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            Log Ingestion & Upload
          </h3>
          <p className="text-xs text-slate-400">Paste raw log text, drag & drop a log file, or load a prototype sample log</p>
        </div>

        {/* Quick Sample Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1">Sample Logs:</span>
          {Object.keys(SAMPLE_LOGS).map((key) => {
            const isSelected = selectedSample === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => loadSample(key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {key.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-950/40'
            : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
        }`}
      >
        <input
          type="file"
          id="log-file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept=".log,.txt,.json"
        />
        <label htmlFor="log-file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
          <UploadCloud className="w-7 h-7 text-blue-400" />
          <p className="text-xs font-medium text-slate-300">
            <span className="text-blue-400 hover:underline">Click to upload</span> or drag and drop raw log file
          </p>
          <p className="text-[11px] text-slate-500">Supports .log, .txt, .json formats</p>
        </label>
      </div>

      {/* Raw Log Input Textarea */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Raw Log Payload Input
        </label>
        <textarea
          rows={5}
          value={rawLog}
          onChange={(e) => {
            setRawLog(e.target.value);
            setSelectedSample(null);
          }}
          placeholder="Paste raw log output here (e.g., Linux sshd syslog, Windows Event ID 4625, Firewall KV, or App JSON)..."
          className="w-full rounded-lg border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setRawLog('')}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2 py-1"
        >
          Clear Input
        </button>

        <button
          type="button"
          disabled={!rawLog.trim() || isProcessing}
          onClick={() => onProcess(rawLog)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all ${
            !rawLog.trim() || isProcessing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-blue-600 hover:bg-blue-500 active:scale-98 shadow-blue-600/30'
          }`}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Executing ULPF Engine...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Process Log
            </>
          )}
        </button>
      </div>
    </div>
  );
}

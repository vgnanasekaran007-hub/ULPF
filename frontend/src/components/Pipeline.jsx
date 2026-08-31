import React from 'react';
import { 
  FileText, 
  Search, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Database,
  ArrowRight
} from 'lucide-react';

const PIPELINE_STAGES = [
  { key: 'Ingest', label: 'Ingest', icon: FileText, desc: 'Log payload received' },
  { key: 'Detect Format', label: 'Detect', icon: Search, desc: 'Format identified' },
  { key: 'Parse', label: 'Parse', icon: Cpu, desc: 'Fields extracted' },
  { key: 'Normalize', label: 'Normalize', icon: Layers, desc: 'Common schema' },
  { key: 'Validate', label: 'Validate', icon: CheckCircle2, desc: 'Schema verified' },
  { key: 'Preserve Raw Log', label: 'Preserve', icon: ShieldCheck, desc: 'SHA-256 Hashed' },
  { key: 'Output', label: 'Output', icon: Database, desc: 'Universal Event' }
];

export default function Pipeline({ activeStageIndex = 6, stages = [], isProcessing = false }) {
  const getStageStatus = (index, stageKey) => {
    if (stages.length > 0) {
      const match = stages.find(s => s.stage === stageKey);
      if (match) return match.status;
    }
    return index <= activeStageIndex ? 'success' : 'pending';
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">ULPF Processing Pipeline</h3>
          <p className="text-xs text-slate-400">Heterogeneous Logs → Format Detection → Normalized Schema → Cryptographic Preservation</p>
        </div>
        {isProcessing && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-950 text-blue-400 border border-blue-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            Processing Engine Active...
          </span>
        )}
      </div>

      {/* Desktop Horizontal View */}
      <div className="hidden lg:flex items-center justify-between gap-1 py-2 overflow-x-auto">
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const status = getStageStatus(idx, stage.key);
          const isCompleted = status === 'success';
          const isCurrent = isProcessing && idx === activeStageIndex;

          return (
            <React.Fragment key={stage.key}>
              <div className={`flex-1 flex flex-col items-center text-center p-3 rounded-lg border transition-all ${
                isCompleted 
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' 
                  : isCurrent 
                  ? 'bg-blue-950 border-blue-700 text-blue-300 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : isCurrent 
                    ? 'bg-blue-600 text-white animate-bounce'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">{stage.label}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{stage.desc}</span>
              </div>

              {idx < PIPELINE_STAGES.length - 1 && (
                <ArrowRight className={`w-4 h-4 shrink-0 ${
                  idx < activeStageIndex ? 'text-emerald-500' : 'text-slate-700'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile & Tablet Vertical View */}
      <div className="flex lg:hidden flex-col gap-2.5">
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const status = getStageStatus(idx, stage.key);
          const isCompleted = status === 'success';

          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div className={`flex items-center justify-center p-3 rounded-lg border w-full ${
                isCompleted 
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3 ${
                  isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-200">{stage.label}</p>
                    {isCompleted && (
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{stage.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

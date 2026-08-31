import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Sparkles, X } from 'lucide-react';
import ParserCard from '../components/ParserCard';
import { apiService } from '../services/api';

export default function ParserRegistry() {
  const [parsers, setParsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Parser Form State
  const [newParser, setNewParser] = useState({
    parser_id: '',
    name: '',
    version: '1.0.0',
    supported_format: '',
    pattern_regex: ''
  });

  const fetchParsers = async () => {
    setLoading(true);
    const data = await apiService.getParsers();
    setParsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchParsers();
  }, []);

  const handleCreateParser = async (e) => {
    e.preventDefault();
    if (!newParser.parser_id || !newParser.name) return;

    await apiService.createParser(newParser);
    setIsModalOpen(false);
    setNewParser({
      parser_id: '',
      name: '',
      version: '1.0.0',
      supported_format: '',
      pattern_regex: ''
    });
    fetchParsers();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            Parser Engine Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Modular log parsers configured in ULPF. Supports instant engine reuse for new raw log sources.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Parser Configuration
        </button>
      </div>

      {/* Workflow Banner */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-950/80 text-purple-400 border border-purple-800 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white">Modular Engine Architecture</span>
            <p className="text-xs text-slate-400">
              <span className="font-mono text-purple-400 font-semibold">NEW SOURCE</span> → <span className="font-mono text-blue-400 font-semibold">ADD CONFIGURATION</span> → <span className="font-mono text-emerald-400 font-semibold">REUSE ENGINE</span>
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-300 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
          {parsers.length} Active Parser Engines Loaded
        </span>
      </div>

      {/* Parser Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {parsers.map((parser) => (
          <ParserCard key={parser.id || parser.parser_id} parser={parser} />
        ))}
      </div>

      {/* Add Parser Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-800 space-y-4 animate-in zoom-in-95 duration-150 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                Register New Log Parser
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateParser} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Parser Unique ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cloudtrail_json_v1"
                  value={newParser.parser_id}
                  onChange={(e) => setNewParser({ ...newParser, parser_id: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-800 rounded-lg font-mono bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Parser Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS CloudTrail Audit Parser"
                  value={newParser.name}
                  onChange={(e) => setNewParser({ ...newParser, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Supported Log Format Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS CloudTrail Event Record JSON"
                  value={newParser.supported_format}
                  onChange={(e) => setNewParser({ ...newParser, supported_format: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-800 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Regex Pattern / Format Matcher (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. eventSource|awsRegion|eventName"
                  value={newParser.pattern_regex}
                  onChange={(e) => setNewParser({ ...newParser, pattern_regex: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-800 rounded-lg font-mono bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save & Register Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

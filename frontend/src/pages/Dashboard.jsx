import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Pipeline from '../components/Pipeline';
import EventTable from '../components/EventTable';
import { apiService } from '../services/api';

export default function Dashboard({ onNavigate, onSelectEvent }) {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const statsRes = await apiService.getDashboardStats();
      const eventsRes = await apiService.getEvents();
      setStats(statsRes);
      setRecentEvents(eventsRes.events ? eventsRes.events.slice(0, 8) : []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Logs Ingested"
          value={stats?.total_logs ?? 0}
          icon={FileText}
          color="blue"
          description="Cumulative raw logs"
        />
        <StatsCard
          title="Processed & Normalized"
          value={stats?.processed ?? 0}
          icon={CheckCircle2}
          color="green"
          description="Successfully parsed"
        />
        <StatsCard
          title="Processing Failures"
          value={stats?.failed ?? 0}
          icon={XCircle}
          color="red"
          description="Parsing errors"
        />
        <StatsCard
          title="Unknown Formats"
          value={stats?.unknown ?? 0}
          icon={HelpCircle}
          color="amber"
          description="Fallback parsers used"
        />
      </div>

      {/* Pipeline Visualization */}
      <Pipeline activeStageIndex={6} />

      {/* Recent Normalized Events Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Normalized Events Stream</h3>
            <p className="text-xs text-slate-400">Real-time normalized log stream normalized into ULPF common schema</p>
          </div>
          <button
            onClick={() => onNavigate('/events')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View All Events ({recentEvents.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <EventTable events={recentEvents} onSelectEvent={onSelectEvent} />
      </div>

    </div>
  );
}

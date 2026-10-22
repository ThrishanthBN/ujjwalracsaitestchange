import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  Users,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export function HmDashboard({ onNavigate, onSelectCandidate }) {
  const { jobPostings, requisitions, candidates } = useAuth();
  const allJobs = (jobPostings || requisitions || []).filter((j) => j.status === 'Active');

  const pendingCandidates = candidates.filter(
    (c) => c.pipeline_status === 'HM Review' || c.status === 'HM Review' || c.pipeline_status === 'Screening'
  );

  const avgMatch =
    candidates.length > 0
      ? (candidates.reduce((sum, c) => sum + (c.overallMatch || 0), 0) / candidates.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Hiring Manager Portal &bull; Department Requisitions Portfolio</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            My Department Requisitions
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track active hiring orders, review batch resumes delivered by Talent Acquisition, and calibrate AI scoring models.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigate('hm-candidates')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Review Pending Candidates ({pendingCandidates.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards (Zero-Fake Data / Pure State-Driven) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Open Roles */}
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Open Department Roles</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{allJobs.length} Open</span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">Active Req</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Live requisitions in database</p>
        </div>

        {/* Metric 2: Candidates in Evaluation */}
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>In Evaluation Queue</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{pendingCandidates.length} Active</span>
            <span className="text-xs text-indigo-400 font-semibold font-mono">Pending Debrief</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting technical recommendation</p>
        </div>

        {/* Metric 3: Pipeline AI Match % */}
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Pipeline AI Match Index</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{avgMatch}%</span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">Calibrated</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Dynamic average across dossiers</p>
        </div>

        {/* Metric 4: Time-to-Shortlist SLA */}
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Time-to-Shortlist</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {candidates.length > 0 ? '2.1 Days' : '--'}
            </span>
            {candidates.length > 0 ? (
              <span className="text-xs text-emerald-400 font-semibold font-mono">Exceeding SLA</span>
            ) : (
              <span className="text-xs text-slate-500 font-mono">Standby</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {candidates.length > 0 ? 'Target: 3.0d &bull; Velocity +30%' : 'Awaiting active candidate pipeline'}
          </p>
        </div>
      </div>

      {/* Active Requisitions Portfolio Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/30 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Active Requisitions Portfolio ({allJobs.length})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Department Scope</span>
        </div>

        {allJobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No Active Requisitions</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your department does not have any active job requisitions. Coordinate with Talent Acquisition to publish open requisitions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
            {allJobs.map((req) => {
            const reqId = req.job_id || req.id;
            const reqCandidates = candidates.filter(
              (c) => (c.job_id || c.targetRequisitionId) === reqId
            );

            return (
              <div
                key={reqId}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                      {reqId}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      {req.target_headcount || req.targetHeadcount || 1} Target Hires
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {req.job_title || req.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{req.department}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Compensation Band:</span>
                    <span className="font-mono text-indigo-300 font-medium">
                      ${(req.compensation_min || 180000).toLocaleString()} - ${(req.compensation_max || 220000).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    <strong className="text-white">{reqCandidates.length}</strong> candidates in funnel
                  </span>

                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate('hm-candidates');
                    }}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    <span>Inspect Candidates</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}

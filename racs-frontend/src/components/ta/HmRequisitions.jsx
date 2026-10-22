import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Users,
  DollarSign,
  Cpu,
  Layers,
  ArrowRight,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Link,
  ChevronRight,
  TrendingDown,
  X,
  Building,
} from 'lucide-react';

export function HmRequisitions({ onNavigate }) {
  const { jobPostings, requisitions, candidates, createJobPosting, addToast, recordAuditLog } = useAuth();
  const allReqs = (jobPostings || requisitions || []).filter((r) => r.status === 'Active');

  const [stageFilter, setStageFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Requisition Form state (POST /api/jobs)
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Engineering - Frontend Platform');
  const [newCompMin, setNewCompMin] = useState(180000);
  const [newCompMax, setNewCompMax] = useState(220000);
  const [newHeadcount, setNewHeadcount] = useState(1);

  const filteredRevs = allReqs.filter((r) => {
    if (stageFilter === 'ALL') return true;
    return (r.status || '').toLowerCase().includes(stageFilter.toLowerCase());
  });

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createJobPosting({
      job_title: newTitle.trim(),
      department: newDept.trim(),
      compensation_min: Number(newCompMin),
      compensation_max: Number(newCompMax),
      target_headcount: Number(newHeadcount),
    });

    setShowCreateModal(false);
    setNewTitle('');
  };

  const handleHandoff = (req) => {
    const reqId = req.job_id || req.id;
    const reqTitle = req.job_title || req.title;
    recordAuditLog(
      `Candidate Batch Handed off to HM Review`,
      `Requisition: ${reqTitle} (${reqId}) - Directed to ${req.requestingHiringManager || 'Hiring Lead'}`,
      'HM_ROUTED_VERIFIED'
    );
    addToast(
      'Handoff Dispatched to Hiring Manager',
      `Candidate shortlist for ${reqTitle} successfully pushed to ${req.requestingHiringManager || 'Hiring Lead'}'s review queue.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Talent Acquisition &bull; Hiring Manager Requisitions</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Hiring Manager Requisitions & SLA Calibration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage hiring requests initiated by department leads, review target headcount allocations, and route candidate batches.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Requisition</span>
          </button>
        </div>
      </div>

      {/* Quick-filter Tabs */}
      <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
        {[
          { id: 'ALL', label: 'All Requisitions', count: allReqs.length },
          { id: 'Active', label: 'Active Sourcing', count: allReqs.length },
        ].map((tab) => {
          const isActive = stageFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStageFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Requisition Cards */}
      <div className="space-y-4">
        {filteredRevs.map((req) => {
          const reqId = req.job_id || req.id;
          const reqTitle = req.job_title || req.title;
          const reqCandidates = candidates.filter(
            (c) => (c.job_id || c.targetRequisitionId) === reqId
          );
          const screenedCount = reqCandidates.filter(
            (c) => (c.overallMatch || 0) >= 75
          ).length;

          return (
            <div
              key={reqId}
              className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-xl shadow-black/30"
            >
              {/* Top Row: Requisition Metadata & Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                      {reqId}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{req.department}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                      {req.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight mt-1">{reqTitle}</h3>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => onNavigate('ta-intake')}
                    className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    Attach Resume Batch
                  </button>
                  <button
                    onClick={() => handleHandoff(req)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Handoff to HM Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Middle Row: Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px] tracking-wider">
                    Requesting Lead
                  </span>
                  <span className="font-bold text-slate-200 mt-0.5 block">
                    {req.requestingHiringManager || 'Engineering Lead'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px] tracking-wider">
                    Target Headcount
                  </span>
                  <span className="font-bold text-slate-200 mt-0.5 block">
                    {req.target_headcount || req.targetHeadcount || 1} Hires Needed
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px] tracking-wider">
                    Compensation Band
                  </span>
                  <span className="font-bold font-mono text-indigo-400 mt-0.5 block">
                    ${(req.compensation_min || 180000).toLocaleString()} - ${(req.compensation_max || 220000).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block uppercase text-[10px] tracking-wider">
                    Ingestion Funnel
                  </span>
                  <span className="font-bold text-indigo-400 mt-0.5 block">
                    {reqCandidates.length} Ingested &bull; {screenedCount} Qualified
                  </span>
                </div>
              </div>

              {/* Bottom Row: Active AI Scoring Profile */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-medium text-slate-400">Active AI Scoring Profile:</span>
                  <span className="font-mono text-[11px] text-indigo-300 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {req.activeAiProfile || 'Autonomous Profile v2.4'}
                  </span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">SLA Target: {req.slaTargetDays || 3.5} Days</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Requisition Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Publish New Job Requisition</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Staff Distributed Systems Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="e.g. AI Research - Core ML"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Comp ($)</label>
                  <input
                    type="number"
                    value={newCompMin}
                    onChange={(e) => setNewCompMin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Comp ($)</label>
                  <input
                    type="number"
                    value={newCompMax}
                    onChange={(e) => setNewCompMax(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Headcount</label>
                <input
                  type="number"
                  min="1"
                  value={newHeadcount}
                  onChange={(e) => setNewHeadcount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Publish Requisition (job_postings)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

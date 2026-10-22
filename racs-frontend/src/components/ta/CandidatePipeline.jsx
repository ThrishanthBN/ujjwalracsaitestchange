import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';

export function CandidatePipeline({ onNavigate, onSelectCandidate }) {
  const { candidates, jobPostings, requisitions } = useAuth();
  const allReqs = jobPostings || requisitions || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedReqFilter, setSelectedReqFilter] = useState('ALL');

  const getStatus = (c) => c.pipeline_status || c.status || 'Screening';

  const stages = [
    { id: 'ALL', label: 'All Candidates', count: candidates.length },
    { id: 'Screening', label: 'Screening', count: candidates.filter((c) => getStatus(c) === 'Screening').length },
    { id: 'HM Review', label: 'HM Review', count: candidates.filter((c) => getStatus(c) === 'HM Review').length },
    { id: 'Interview Completed', label: 'Interview Completed', count: candidates.filter((c) => getStatus(c) === 'Interview Completed').length },
    { id: 'Ready for Offer Authorization', label: 'Offer Ready', count: candidates.filter((c) => getStatus(c) === 'Ready for Offer Authorization').length },
    { id: 'Offer Dispatched & Awaiting Signature', label: 'Offer Dispatched', count: candidates.filter((c) => getStatus(c) === 'Offer Dispatched & Awaiting Signature').length },
  ];

  const filteredCandidates = candidates.filter((c) => {
    const cStatus = getStatus(c);
    const req = allReqs.find((r) => (r.job_id || r.id) === (c.job_id || c.targetRequisitionId));
    const reqTitle = req?.job_title || req?.title || c.requisitionTitle || '';
    const candName = c.candidate_name || c.name || '';
    const candTitle = c.currentTitle || '';

    const matchesSearch =
      candName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reqTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = selectedStage === 'ALL' || cStatus === selectedStage;
    const reqId = c.job_id || c.targetRequisitionId;
    const matchesReq = selectedReqFilter === 'ALL' || reqId === selectedReqFilter;

    return matchesSearch && matchesStage && matchesReq;
  });

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Candidate ID,Name,Requisition,Match %,Status,Experience,Location']
        .concat(
          filteredCandidates.map((c) => {
            const req = allReqs.find((r) => (r.job_id || r.id) === (c.job_id || c.targetRequisitionId));
            const rTitle = req?.job_title || req?.title || c.requisitionTitle || 'Engineering';
            return `"${c.candidate_id || c.id}","${c.candidate_name || c.name}","${rTitle}",${c.overallMatch}%,"${getStatus(c)}","${c.experienceYears}y","${c.location}"`;
          })
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RACS_AI_Pipeline_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Talent Pipeline Ledger &bull; Real-time AI Tracking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Candidate Pipeline & Match Ranking
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Filter by recruitment stage, inspect explainable match scores, and export compliant CSV records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {stages.map((stage) => {
          const isActive = selectedStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>{stage.label}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}
              >
                {stage.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Requisition Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, title, or skills..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedReqFilter}
            onChange={(e) => setSelectedReqFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="ALL">All Requisitions ({allReqs.length})</option>
            {allReqs.map((req) => {
              const reqId = req.job_id || req.id;
              return (
                <option key={reqId} value={reqId}>
                  {req.job_title || req.title} ({reqId})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Candidates List / Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/30 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Candidates In Pipeline ({filteredCandidates.length})
          </span>
          <span className="text-[11px] font-mono text-slate-500">Live Backend State</span>
        </div>

        <div className="overflow-x-auto">
          {filteredCandidates.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No Candidates in Pipeline</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {candidates.length === 0
                  ? 'No candidate dossiers have been ingested yet. Navigate to "Resume Batch Intake" to upload PDF/DOCX resumes.'
                  : 'No candidates match the selected stage or search filters.'}
              </p>
              {candidates.length === 0 && (
                <button
                  onClick={() => onNavigate && onNavigate('ta-intake')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Go to Batch Resume Intake</span>
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Requisition Target</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Pipeline Stage</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCandidates.map((c) => {
                const candId = c.candidate_id || c.id;
                const candName = c.candidate_name || c.name;
                const req = allReqs.find((r) => (r.job_id || r.id) === (c.job_id || c.targetRequisitionId));
                const reqTitle = req?.job_title || req?.title || c.requisitionTitle || 'Engineering Requisition';
                const currentStatus = getStatus(c);

                return (
                  <tr key={candId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={c.avatar}
                          alt={candName}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-white">{candName}</div>
                          <div className="text-[11px] text-slate-400">{c.currentTitle}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-200">
                      <div>{reqTitle}</div>
                      <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{c.job_id || c.targetRequisitionId}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.overallMatch >= 85 ? 'bg-emerald-400' : c.overallMatch >= 75 ? 'bg-cyan-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${c.overallMatch}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-white text-[11px]">{c.overallMatch}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                        {currentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {c.experienceYears} Years
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (onSelectCandidate) onSelectCandidate(candId);
                          if (onNavigate) onNavigate('hm-candidates');
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        <span>Inspect AI</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}

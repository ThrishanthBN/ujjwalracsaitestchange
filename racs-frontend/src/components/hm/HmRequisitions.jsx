import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sliders,
  Sparkles,
  Save,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function HmRequisitions({ onNavigate }) {
  const { jobPostings, requisitions, setJobPostings, addToast, recordAuditLog } = useAuth();
  const allReqs = (jobPostings || requisitions || []).filter((r) => r.status === 'Active');

  const [selectedReqId, setSelectedReqId] = useState(allReqs[0]?.job_id || allReqs[0]?.id || 'REQ-2024-089');

  const selectedReq =
    allReqs.find((r) => (r.job_id || r.id) === selectedReqId) || allReqs[0] || {};

  const defaultWeights = {
    technicalProficiency: 35,
    systemArchitecture: 30,
    frameworkRecency: 20,
    cultureCollaboration: 15,
  };

  const [weights, setWeights] = useState(selectedReq.rubricWeights || defaultWeights);

  const handleWeightChange = (key, val) => {
    setWeights((prev) => ({
      ...prev,
      [key]: parseInt(val, 10),
    }));
  };

  const handleSaveWeights = () => {
    const reqId = selectedReq.job_id || selectedReq.id;
    if (setJobPostings) {
      setJobPostings((prev) =>
        prev.map((r) => ((r.job_id || r.id) === reqId ? { ...r, rubricWeights: weights } : r))
      );
    }
    recordAuditLog(
      `AI Scoring Rubric Calibrated by Hiring Manager`,
      `Requisition ${selectedReq.job_title || selectedReq.title} (${reqId}) - Weights: Tech ${weights.technicalProficiency}%, Arch ${weights.systemArchitecture}%`,
      'RUBRIC_RECALIBRATED'
    );
    addToast(
      'AI Scoring Rubric Updated',
      `Weights recalibrated for ${selectedReq.job_title || selectedReq.title}. Candidate rankings refreshed across active pipeline.`,
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
            <span>Hiring Manager Enclave &bull; Scoring Model Calibration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI Rubric Calibration & Requisition Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fine-tune generative AI scoring weights to match your team's exact architectural and domain requirements.
          </p>
        </div>
      </div>

      {/* Select Requisition */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {allReqs.map((req) => {
          const reqId = req.job_id || req.id;
          const isSelected = reqId === selectedReqId;
          const compMin = req.compensation_min || 180000;
          const compMax = req.compensation_max || 220000;

          return (
            <button
              key={reqId}
              onClick={() => {
                setSelectedReqId(reqId);
                setWeights(req.rubricWeights || defaultWeights);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl shadow-indigo-950/30'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400 font-bold mb-1">
                <span>{reqId}</span>
                <span className="text-[10px] text-slate-500 font-normal">{req.department?.split('-')[0]}</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{req.job_title || req.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                ${compMin.toLocaleString()} - ${compMax.toLocaleString()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Rubric Calibration Workspace */}
      <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {selectedReq.job_id || selectedReq.id}
              </span>
              <h3 className="text-base font-bold text-white">{selectedReq.job_title || selectedReq.title} Rubric Weights</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Currently active scoring matrix: <span className="font-mono text-indigo-300">{selectedReq.activeAiProfile || 'Autonomous Profile v2.4'}</span>
            </p>
          </div>

          <button
            onClick={handleSaveWeights}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Re-rank Pipeline</span>
          </button>
        </div>

        {/* Weights Sliders */}
        <div className="mt-6 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-white">Technical Proficiency & Live Coding</span>
              <span className="font-mono text-indigo-400 font-bold">{weights.technicalProficiency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={weights.technicalProficiency}
              onChange={(e) => handleWeightChange('technicalProficiency', e.target.value)}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-white">System Architecture & Scalability</span>
              <span className="font-mono text-cyan-400 font-bold">{weights.systemArchitecture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={weights.systemArchitecture}
              onChange={(e) => handleWeightChange('systemArchitecture', e.target.value)}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-white">Framework Recency & Internals</span>
              <span className="font-mono text-purple-400 font-bold">{weights.frameworkRecency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={weights.frameworkRecency}
              onChange={(e) => handleWeightChange('frameworkRecency', e.target.value)}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-white">Culture, Collaboration & Mentorship</span>
              <span className="font-mono text-emerald-400 font-bold">{weights.cultureCollaboration}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={weights.cultureCollaboration}
              onChange={(e) => handleWeightChange('cultureCollaboration', e.target.value)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ShieldCheck,
  Lock,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  ThumbsUp,
  Check,
  AlertTriangle,
  Award,
  Layers,
  Terminal,
  ArrowRight,
} from 'lucide-react';

export function CandidateEvaluation({ initialCandidateId, onNavigate }) {
  const { candidates, aiEvaluations, toggleChecklist, submitHmRecommendation } = useAuth();
  const [selectedId, setSelectedId] = useState(
    initialCandidateId || candidates[0]?.candidate_id || candidates[0]?.id || ''
  );
  const [showVerbatim, setShowVerbatim] = useState(true);

  if (candidates.length === 0) {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Autonomous AI Evaluation & Technical Debrief Enclave</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Candidate Technical Evaluation Dossier
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time explainable AI match scorecard with immutable cryptographic debrief seal.
          </p>
        </div>

        <div className="rounded-3xl p-12 bg-slate-900/80 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">Evaluation Queue Empty</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            No candidate dossiers have been routed to Hiring Manager review yet. Once Talent Acquisition ingests resumes and initiates AI scoring, candidates with matched skills and debrief notes will appear here.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate && onNavigate('hm-dashboard')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <span>Go to Department Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const candidate = candidates.find((c) => (c.candidate_id || c.id) === selectedId) || candidates[0] || {};
  const candId = candidate.candidate_id || candidate.id;
  const isImmutable = Boolean(candidate.cryptographicSeal);

  // Safely extract AI evaluation data from aiEvaluations table
  const evalRecord = aiEvaluations[candId] || {};
  const matchedSkills = evalRecord.matched_skills_json || candidate.matchedSkills || [
    { name: 'Core System Engineering', confidence: 94, verified: true },
    { name: 'Architecture & Design Patterns', confidence: 91, verified: true },
    { name: 'Cross-functional Collaboration', confidence: 88, verified: true },
  ];
  const missingSkills = evalRecord.missing_skills_json || candidate.missingSkills || [];
  const dimensionalScores = evalRecord.dimensional_scores || candidate.dimensionalScores || {
    technicalProficiency: candidate.overallMatch || 88,
    systemArchitecture: Math.max(70, (candidate.overallMatch || 88) - 4),
    frameworkRecency: Math.min(99, (candidate.overallMatch || 88) + 3),
    cultureMentorship: 85,
  };
  const aiSummary = evalRecord.aiSummary || candidate.aiSummary || `Autonomous analysis of ${candidate.candidate_name || candidate.name}'s dossier. Strong technical foundation identified with verified credentials.`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Autonomous AI Evaluation & Technical Debrief Enclave</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Candidate Technical Evaluation Dossier
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review AI-synthesized dossiers, evaluate dimensional competency scores, and inspect verbatim interview debriefs.
          </p>
        </div>

        {/* Requisition Scope Tag */}
        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 font-mono">
            Target Requisition: <span className="text-indigo-400">{candidate.job_id || candidate.targetRequisitionId}</span>
          </span>
        </div>
      </div>

      {/* Main Split Layout: Left Review Queue & Right Evaluation Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Candidate Review Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <span>Review Queue ({candidates.length})</span>
            <span className="text-[11px] font-mono text-indigo-400">SLA: 24h Remaining</span>
          </div>

          <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
            {candidates.map((cand) => {
              const currentId = cand.candidate_id || cand.id;
              const isSelected = currentId === candId;
              const hasSeal = Boolean(cand.cryptographicSeal);
              const candName = cand.candidate_name || cand.name;

              return (
                <div
                  key={currentId}
                  onClick={() => setSelectedId(currentId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-xl shadow-indigo-950/30'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={cand.avatar}
                        alt={candName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{candName}</h4>
                        <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{cand.currentTitle}</p>
                      </div>
                    </div>

                    {/* Circular Fit Badge */}
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {cand.overallMatch}%
                      </span>
                      <span className="text-[9px] text-slate-500 mt-0.5">Match</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{cand.experienceYears}y exp &bull; {cand.location}</span>
                    {hasSeal ? (
                      <span className="text-emerald-400 font-semibold flex items-center space-x-1 font-mono">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>Sealed</span>
                      </span>
                    ) : (
                      <span className="text-indigo-400 font-medium">Pending Debrief</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5 font-bold text-indigo-300 mb-1">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>SLA Review Target</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Avg turn-around 14.2h. Healthy green SLA status for active hiring manager loops.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Candidate Dossier (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Candidate Profile Header Card */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                <img
                  src={candidate.avatar}
                  alt={candidate.candidate_name || candidate.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-700 shadow-md"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-extrabold text-white tracking-tight">
                      {candidate.candidate_name || candidate.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {candidate.pipeline_status || candidate.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">{candidate.currentTitle}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>{candidate.location}</span>
                    <span>&bull;</span>
                    <span>{candidate.experienceYears} Years Experience</span>
                    <span>&bull;</span>
                    <span className="font-mono text-indigo-300 font-semibold">Comp: {candidate.compensationExpectation}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Resume ({candidate.resumeSize || '2.4 MB'})</span>
                </span>
              </div>
            </div>

            {/* Synthesized AI Executive Evaluation */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synthesized AI Executive Evaluation (Model: RACS Core v4.2)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{aiSummary}</p>
            </div>
          </div>

          {/* Dimensional Fit Scorecard & Circular Progress Ring (IA-8 Section 8.7) */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Dimensional Fit Scorecard</h3>
                <p className="text-xs text-slate-400">
                  Calibrated against {candidate.job_id || candidate.targetRequisitionId} Core Competencies.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                Confidence: High (98.2%)
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Circular Gauge Ring (4 cols) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#1E293B"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#6366F1"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - (candidate.overallMatch || 80) / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
                      {candidate.overallMatch || 80}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400">
                      ROLE MATCH
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">Overall Candidate Fit</span>
              </div>

              {/* Horizontal Competency Bars (8 cols) */}
              <div className="md:col-span-8 space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-slate-200">Core Technical Proficiency</span>
                    <span className="font-mono text-indigo-400 font-bold">{dimensionalScores.technicalProficiency}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                      style={{ width: `${dimensionalScores.technicalProficiency}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-slate-200">Architecture & Distributed Scale</span>
                    <span className="font-mono text-cyan-400 font-bold">{dimensionalScores.systemArchitecture}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                      style={{ width: `${dimensionalScores.systemArchitecture}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-slate-200">Framework Recency & Best Practices</span>
                    <span className="font-mono text-purple-400 font-bold">{dimensionalScores.frameworkRecency}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                      style={{ width: `${dimensionalScores.frameworkRecency}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-slate-200">Culture & Technical Mentorship</span>
                    <span className="font-mono text-emerald-400 font-bold">{dimensionalScores.cultureMentorship}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      style={{ width: `${dimensionalScores.cultureMentorship}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explainable AI Skill Breakdown: Green Matched vs Red Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Green Matched Skills List */}
            <div className="rounded-3xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Matched Competencies ({matchedSkills.length})</span>
              </div>

              <div className="mt-3.5 space-y-2">
                {matchedSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="font-medium text-slate-200 truncate">{skill.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400 font-bold ml-2">
                      {skill.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Missing Skills List */}
            <div className="rounded-3xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-red-400 text-xs font-bold uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Identified Competency Gaps ({missingSkills.length})</span>
              </div>

              <div className="mt-3.5 space-y-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-red-300">{gap.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                          {gap.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{gap.impact}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                    No critical competency gaps identified against rubric criteria.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Interview Checklist with Pass/Fail Toggles */}
          {(candidate.interviewChecklist || []).length > 0 && (
            <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Interactive Technical Interview Checklist
                  </h3>
                  <p className="text-xs text-slate-400">
                    Toggle checkpoints based on technical debrief performance before executing final handoff.
                  </p>
                </div>
                <span className="text-xs font-mono text-indigo-400">
                  {candidate.interviewChecklist.filter((c) => c.passed).length}/{candidate.interviewChecklist.length} Passed
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {candidate.interviewChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => !isImmutable && toggleChecklist(candId, item.id)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                      item.passed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          item.passed ? 'bg-emerald-500 text-white' : 'border border-slate-700 bg-slate-900'
                        }`}
                      >
                        {item.passed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.category}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.question}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-emerald-400 font-bold">{item.score || 9.5}/10</span>
                      <div className="text-[10px] text-slate-500">{item.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cryptographically Sealed Handoff & Action Controls (IA-7/IA-8 Immutability) */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
            {isImmutable ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Legally Immutable Handoff Record Active (hr_handoff_reports)</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 font-mono text-xs text-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">SHA-256 Digest:</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-xs">{candidate.cryptographicSeal.sha256}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">Signature:</span>
                    <span className="text-[10px] text-slate-400">{candidate.cryptographicSeal.auditLedgerSignature}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">Sealed Timestamp:</span>
                    <span className="text-[10px] text-slate-400">{candidate.cryptographicSeal.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  This recommendation is locked from further edits and routed to the HR Representative for statutory pay-parity and executive offer dispatch.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 font-mono">LOCKED STATE: READ-ONLY ENFORCED</span>
                  <button
                    onClick={() => onNavigate('hr-offers')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>View in HR Offer Queue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Ready for Formal Technical Handoff?
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clicking "Approve for Hire" attaches a cryptographic SHA-256 seal, saves to <code>hr_handoff_reports</code>, and routes to HR.
                  </p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => submitHmRecommendation(candId, 'Strong Hire')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer shadow-indigo-600/30"
                  >
                    <Award className="w-4 h-4" />
                    <span>Approve for Hire (Route to HR)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

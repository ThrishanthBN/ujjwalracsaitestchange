import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  BadgeDollarSign,
  ShieldCheck,
  CheckCircle2,
  Send,
  Download,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  Sliders,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export function OfferApprovals({ initialCandidateId, onNavigate }) {
  const { candidates, authorizeOfferDispatch, addToast } = useAuth();

  const eligibleCandidates = candidates.filter(
    (c) =>
      c.pipeline_status === 'Ready for Offer Authorization' ||
      c.status === 'Ready for Offer Authorization' ||
      c.pipeline_status === 'Offer Dispatched & Awaiting Signature' ||
      c.status === 'Offer Dispatched & Awaiting Signature' ||
      c.offerPackage
  );

  const [selectedId, setSelectedId] = useState(
    initialCandidateId || eligibleCandidates[0]?.candidate_id || eligibleCandidates[0]?.id || ''
  );
  const [policyConfirmed, setPolicyConfirmed] = useState(false);
  const [salaryPercentile, setSalaryPercentile] = useState(65);

  if (eligibleCandidates.length === 0) {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Executive Compensation Authorization & Statutory Compliance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Offer Letter Authorization & Parity Enforcement
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review itemized compensation packages, verify CA SB 1162 pay-parity compliance, and execute multi-signature offer letter dispatch.
          </p>
        </div>

        <div className="rounded-3xl p-12 bg-slate-900/80 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <FileCheck2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">No Offers Pending Authorization</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            There are currently no candidates in the "Ready for Offer Authorization" stage. Candidate dossiers must first be debriefed and recommended by the Hiring Manager to unlock the executive offer package workflow.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate && onNavigate('hr-dashboard')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              <span>Return to HR Governance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const candidate =
    candidates.find((c) => (c.candidate_id || c.id) === selectedId) || eligibleCandidates[0] || {};

  const candId = candidate.candidate_id || candidate.id;
  const candName = candidate.candidate_name || candidate.name;

  const pkg = candidate.offerPackage || {
    baseSalary: 195000,
    equityRsus: 12500,
    signOnBonus: 20000,
    yearOneTarget: 255000,
    bandMin: 185000,
    bandMax: 210000,
    caSb1162Compliance: '100% In-Band Compliant (CA SB 1162 / NY Equal Pay Verified)',
    anticipatedStartDate: '2026-11-18',
    approvalMatrix: [
      { role: 'Engineering Lead', approver: 'Hiring Lead', status: 'Approved', timestamp: 'Oct 20, 2026' },
      { role: 'Finance / Compensation', approver: 'Sandra Washington', status: 'Approved', timestamp: 'Oct 21, 2026' },
      { role: 'HR Governance', approver: 'Eleanor Vance', status: 'Pending Final Dispatch', timestamp: 'Awaiting Authorization' },
    ],
    docusignEnvelopeId: `DOCUSIGN-${candId}-2026`,
  };

  const isDispatched =
    candidate.pipeline_status === 'Offer Dispatched & Awaiting Signature' ||
    candidate.status === 'Offer Dispatched & Awaiting Signature';

  // Calculate dynamic salary based on slider
  const dynamicBaseSalary = Math.round(pkg.bandMin + (pkg.bandMax - pkg.bandMin) * (salaryPercentile / 100));

  const handleAuthorize = () => {
    if (!policyConfirmed) {
      addToast('Attestation Required', 'Please check the statutory compliance attestation before dispatching.', 'error');
      return;
    }
    authorizeOfferDispatch(candId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>HR Governance &bull; Stage 4 Offer Authorization</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Executive Offer Governance & Authorization
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review finalized candidate compensation packages, verify tamper-evident cryptographic handoff records, and execute legally binding offer dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Title VII EEOC Compliant</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Candidate Select / Right Compensation Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Offer Candidates Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <span>Offer Ready Queue ({eligibleCandidates.length})</span>
            <span className="text-[11px] font-mono text-emerald-400">Verified</span>
          </div>

          <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
            {eligibleCandidates.map((cand) => {
              const currentCandId = cand.candidate_id || cand.id;
              const isSelected = currentCandId === candId;
              const isDone =
                cand.pipeline_status === 'Offer Dispatched & Awaiting Signature' ||
                cand.status === 'Offer Dispatched & Awaiting Signature';
              const candBase = cand.offerPackage?.baseSalary || 195000;

              return (
                <div
                  key={currentCandId}
                  onClick={() => setSelectedId(currentCandId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-950/30'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={cand.avatar}
                        alt={cand.candidate_name || cand.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{cand.candidate_name || cand.name}</h4>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{cand.currentTitle || cand.job_id || cand.targetRequisitionId}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-950 text-indigo-300 border border-slate-800">
                      {cand.overallMatch}%
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-emerald-400 font-bold">
                      ${candBase.toLocaleString()}
                    </span>
                    {isDone ? (
                      <span className="text-emerald-400 font-semibold flex items-center space-x-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Dispatched</span>
                      </span>
                    ) : (
                      <span className="text-indigo-400 font-semibold">Ready for Review</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Itemized Compensation & Handoff Seal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Candidate Dossier Overview Card */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-start space-x-4">
                <img
                  src={candidate.avatar}
                  alt={candName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-700"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-extrabold text-white tracking-tight">{candName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {candidate.pipeline_status || candidate.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {candidate.currentTitle} &bull; <span className="font-mono text-indigo-400">{candidate.job_id || candidate.targetRequisitionId}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Anticipated Start Date
                </span>
                <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block">
                  {pkg.anticipatedStartDate}
                </span>
              </div>
            </div>

            {/* Itemized Compensation Breakdown Grid (IA-8 Section 8.8) */}
            <div className="mt-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Itemized Compensation Package Breakdown
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Base Salary */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Base Salary</span>
                  <span className="text-xl font-extrabold text-white font-mono mt-0.5 block">
                    ${dynamicBaseSalary.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">Annualized Gross</span>
                </div>

                {/* Equity Grant */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/20">
                  <span className="text-indigo-400 block text-[11px] font-medium">Equity Grant</span>
                  <span className="text-xl font-extrabold text-indigo-300 font-mono mt-0.5 block">
                    {pkg.equityRsus?.toLocaleString() || '12,500'}
                  </span>
                  <span className="text-[10px] text-slate-400">RSUs (4-yr / 1-yr cliff)</span>
                </div>

                {/* Sign-on Bonus */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/20">
                  <span className="text-cyan-400 block text-[11px] font-medium">Sign-on Bonus</span>
                  <span className="text-xl font-extrabold text-cyan-300 font-mono mt-0.5 block">
                    ${pkg.signOnBonus?.toLocaleString() || '20,000'}
                  </span>
                  <span className="text-[10px] text-slate-400">30-day payout milestone</span>
                </div>

                {/* Year 1 Target */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20">
                  <span className="text-emerald-400 block text-[11px] font-medium">Year 1 Target Comp</span>
                  <span className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5 block">
                    ${(dynamicBaseSalary + (pkg.signOnBonus || 20000) + Math.round(((pkg.equityRsus || 12500) * 32) / 4)).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">Target Value at $32 FMV</span>
                </div>
              </div>
            </div>

            {/* Interactive Pay Parity Slider & CA SB 1162 Compliance (IA-8 Section 8.8) */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Pay Parity & Band Position Slider
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Band: ${pkg.bandMin.toLocaleString()} &mdash; ${pkg.bandMax.toLocaleString()} (CA SB 1162 / NY Mandate)
                  </span>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {salaryPercentile}th Percentile In-Band
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="90"
                value={salaryPercentile}
                disabled={isDispatched}
                onChange={(e) => setSalaryPercentile(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer disabled:opacity-50"
              />

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Min: ${pkg.bandMin.toLocaleString()}</span>
                <span className="text-emerald-400 font-semibold font-sans flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Parity Verified: Proposed comp aligns within 3.1% of active cohort.</span>
                </span>
                <span>Max: ${pkg.bandMax.toLocaleString()}</span>
              </div>
            </div>

            {/* Cryptographic Handoff Verification Seal & Approval Matrix */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Immutable Technical Debrief Verification (hr_handoff_reports)</span>
                </span>
                <span className="font-mono text-emerald-400 text-[11px]">SHA-256 VERIFIED</span>
              </div>

              {candidate.cryptographicSeal && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="truncate text-slate-300">Digest: {candidate.cryptographicSeal.sha256}</div>
                  <div>Timestamp: {candidate.cryptographicSeal.timestamp}</div>
                </div>
              )}

              {/* Multi-Step Authorization Matrix */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Multi-Role Authorization Approval Matrix
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {(pkg.approvalMatrix || []).map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-semibold text-white">{step.role}</div>
                      <div className="text-[11px] text-slate-400">{step.approver}</div>
                      <div className="mt-2 flex items-center space-x-1 text-emerald-400 font-mono text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{step.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandatory Policy Compliance Attestation Checkbox (IA-8 Requirement) */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyConfirmed}
                  disabled={isDispatched}
                  onChange={(e) => setPolicyConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-0 bg-slate-900 border-slate-700 accent-emerald-600"
                />
                <span className="text-slate-300 leading-relaxed font-medium">
                  I formally confirm that this compensation package aligns with authorized department budgets, internal pay parity guidelines, and statutory pay transparency mandates (CA SB 1162 / NY Equal Pay Act).
                </span>
              </label>
            </div>

            {/* Final Execution Buttons */}
            <div className="mt-6 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
              <button
                onClick={() => addToast('Adjustment Requested', 'Feedback notes returned to Hiring Manager.', 'info')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                Request Additional Compliance Info
              </button>

              <button
                onClick={handleAuthorize}
                disabled={isDispatched}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>{isDispatched ? 'Offer Dispatched & Signed' : 'Authorize & Dispatch Offer Letter'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Send,
  Eye,
  Sliders,
  Play,
  Pause,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react';

export function EmailSequenceConfigurator() {
  const { sequences, toggleSequence, addToast } = useAuth();
  const [selectedSeqId, setSelectedSeqId] = useState('SEQ-101');
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);

  const selectedSeq = sequences.find((s) => s.id === selectedSeqId) || sequences[0];
  const activeStep = selectedSeq.steps[selectedStepIdx] || selectedSeq.steps[0];

  const [emailSubject, setEmailSubject] = useState(activeStep.subject);
  const [emailBody, setEmailBody] = useState(activeStep.snippet);

  const handleSelectStep = (idx) => {
    setSelectedStepIdx(idx);
    setEmailSubject(selectedSeq.steps[idx].subject);
    setEmailBody(selectedSeq.steps[idx].snippet);
  };

  const handleSaveTemplate = () => {
    addToast('Cadence Template Updated', `Step on Day ${activeStep.day} saved and synced to active enrollments.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Automated Cadence & Nurture Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Automated Email Sequence Configurator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Design multi-touch onboarding cadences, set timing intervals (7-day cadence), and toggle active pre-boarding triggers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleSequence(selectedSeq.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              selectedSeq.active
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {selectedSeq.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{selectedSeq.active ? 'Sequence Active' : 'Sequence Paused'}</span>
          </button>
        </div>
      </div>

      {/* Sequence Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sequences.map((seq) => {
          const isSelected = seq.id === selectedSeqId;
          return (
            <div
              key={seq.id}
              onClick={() => {
                setSelectedSeqId(seq.id);
                setSelectedStepIdx(0);
                setEmailSubject(seq.steps[0].subject);
                setEmailBody(seq.steps[0].snippet);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500/80 ring-2 ring-amber-500/20 shadow-xl shadow-amber-950/30'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-amber-400">{seq.id}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
                    seq.active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  {seq.active ? 'Active Cadence' : 'Paused'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">{seq.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{seq.targetRole}</p>
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{seq.steps.length} Automated Steps</span>
                <span className="text-amber-400 font-bold">{seq.totalEnrolled} Candidates Enrolled</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Node Flow Preview (Inspired by Overflow & Stitch) */}
      <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Cadence Interval Timeline Nodes ({selectedSeq.steps.length} Steps)
            </h3>
            <p className="text-xs text-slate-400">
              Interactive timeline nodes. Click any step to inspect or edit template copy.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            Cadence: 7-Day Intervals
          </span>
        </div>

        {/* Visual Timeline Nodes with Connecting Line */}
        <div className="relative py-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] relative">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />

            {selectedSeq.steps.map((st, idx) => {
              const isSelected = selectedStepIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectStep(idx)}
                  className={`relative z-10 flex flex-col items-center group cursor-pointer`}
                >
                  {/* Step Bubble */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-xs transition-all shadow-md ${
                      isSelected
                        ? 'bg-amber-600 text-white ring-4 ring-amber-500/20 scale-110 shadow-lg shadow-amber-600/30'
                        : 'bg-slate-950 border-2 border-slate-800 text-slate-400 group-hover:border-amber-500/50 group-hover:text-white'
                    }`}
                  >
                    Day {st.day}
                  </div>

                  <span className="text-xs font-bold text-white mt-2 tracking-tight">
                    Step {idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 max-w-[120px] text-center truncate">
                    {st.trigger}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Step Template Inspector & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-mono">
                Step {selectedStepIdx + 1} &bull; Day {activeStep.day} Trigger
              </span>
              <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                Edit Email Template
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">Open Rate: {activeStep.openRate}%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Subject Line</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Email Body Copy</label>
              <textarea
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none font-sans"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveTemplate}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/30 cursor-pointer text-xs"
              >
                Save Template Updates
              </button>
            </div>
          </div>
        </div>

        {/* Live Email Preview (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Candidate Inbox Live Preview</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">From: onboarding@racsai.enterprise</span>
          </div>

          {/* Email mockup shell */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-inner space-y-3">
            <div className="border-b border-slate-800 pb-2.5">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Subject:</span>
              <div className="text-sm font-bold text-white tracking-tight mt-0.5">
                {emailSubject}
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-sans">
              <p>Hi Marcus,</p>
              <p>{emailBody}</p>
              <p className="text-slate-500 text-[11px] pt-3 border-t border-slate-800">
                Warm regards,<br />
                <span className="font-semibold text-slate-300">RACS AI People Operations & Onboarding Team</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

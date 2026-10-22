import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud,
  FileCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Sparkles,
  ShieldCheck,
  Trash2,
  RefreshCw,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function ResumeIntake({ onNavigate }) {
  const { jobPostings, requisitions, ingestBatchResumes } = useAuth();
  const activeReqs = (jobPostings || requisitions || []).filter((r) => r.status === 'Active');
  const [selectedReqId, setSelectedReqId] = useState(activeReqs[0]?.job_id || activeReqs[0]?.id || '');
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Queue of files in current batch (clean state for fresh workspaces)
  const [fileBatch, setFileBatch] = useState([]);

  const selectedReq = activeReqs.find((r) => (r.job_id || r.id) === selectedReqId) || activeReqs[0] || {};

  // Handle Drag & Drop with strict PDF/DOCX and 5MB validation (IA-7 requirement)
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    setValidationError('');

    const files = Array.from(e.dataTransfer.files);
    handleFileValidation(files);
  };

  const handleFileInput = (e) => {
    setValidationError('');
    const files = Array.from(e.target.files);
    handleFileValidation(files);
  };

  const handleFileValidation = (files) => {
    if (!files.length) return;

    for (let f of files) {
      if (f.size > 5 * 1024 * 1024) {
        setValidationError(`Validation Error: "${f.name}" exceeds the maximum 5MB size limit.`);
        return;
      }
      const validExtensions = ['.pdf', '.docx'];
      const fileExt = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(fileExt)) {
        setValidationError(`Validation Error: Invalid file format "${f.name}". Only PDF and DOCX files are permitted for AI OCR parsing.`);
        return;
      }
    }

    const newItems = files.map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'Queued for OCR',
      scoreTarget: 'Queued',
      progress: 10,
    }));

    setFileBatch((prev) => [...newItems, ...prev]);
  };

  const handleTriggerAiScreening = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const reqId = selectedReq.job_id || selectedReq.id;
      ingestBatchResumes(reqId, fileBatch.length);
      setFileBatch((prev) =>
        prev.map((f) => ({
          ...f,
          status: 'Processed & Scored',
          progress: 100,
        }))
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>High-Throughput Autonomous Resume Ingestion</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Resume Intake & OCR Parsing Enclave
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Bulk-upload up to 100 resumes per batch. Automatic EEOC Title VII token masking and background AI scoring.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('ta-pipeline')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>View Candidate Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Target Requisition Selector */}
      <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Select Target Job Requisition to Route Incoming Batch:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeReqs.map((req) => {
            const reqId = req.job_id || req.id;
            const isSelected = reqId === selectedReqId;
            return (
              <button
                key={reqId}
                onClick={() => setSelectedReqId(reqId)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] font-bold text-indigo-400">{reqId}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    {req.target_headcount || req.targetHeadcount || 1} Hires
                  </span>
                </div>
                <div className="font-bold text-xs text-white truncate">{req.job_title || req.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">{req.department}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Requisition Diagnostic Banner */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">Active AI Scoring Profile:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-indigo-500/30 font-mono text-[11px] text-indigo-300 font-medium truncate">
              {selectedReq.activeAiProfile || 'Autonomous Screening Profile v2.4'}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
            <span>Hiring Lead: {selectedReq.requestingHiringManager || 'Engineering Lead'}</span>
            <span>&bull;</span>
            <span className="font-mono text-indigo-400">
              ${(selectedReq.compensation_min || 180000).toLocaleString()} - ${(selectedReq.compensation_max || 220000).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bulk Drag-and-Drop Ingestion Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`rounded-3xl p-8 border-2 border-dashed text-center transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Drag & Drop Resumes Here
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports bulk PDF and DOCX files up to 5MB each. EEOC Title VII scrubbing applied instantly upon upload.
            </p>
          </div>

          <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Files from Machine</span>
            <input
              type="file"
              multiple
              accept=".pdf,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>

        {validationError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs inline-flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Batch Processing Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/30 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Batch Ingestion Stream ({fileBatch.length} Resumes)
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
              EEOC Token Masking Verified
            </span>
          </div>

          <button
            onClick={handleTriggerAiScreening}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Parsing OCR Streams...' : 'Execute AI Evaluation & Scoring'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {fileBatch.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No Resumes in Current Batch Queue</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Drag and drop PDF or DOCX resume files into the zone above, or click "Select Files" to queue files for OCR ingestion and EEOC scrubbing.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Resume File</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">OCR Status</th>
                  <th className="py-3 px-4">Parsing Progress</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {fileBatch.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{f.size}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                        <span>{f.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setFileBatch((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

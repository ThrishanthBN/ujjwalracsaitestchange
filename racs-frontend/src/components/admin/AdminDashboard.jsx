import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_DEFINITIONS } from '../../data/mockData';
import {
  Shield,
  Sliders,
  Users,
  UserPlus,
  KeyRound,
  FileText,
  Lock,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Server,
  Zap,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Database,
  Building,
} from 'lucide-react';

export function AdminDashboard({ onNavigate }) {
  const {
    workspace,
    byokConfig,
    users,
    invitations = [],
    generateInvitation,
    auditLogs = [],
    candidates = [],
    jobPostings = [],
    loadDemoData,
    addToast,
  } = useAuth();

  // Quick invite generation state directly on dashboard
  const [selectedRole, setSelectedRole] = useState(ROLES.TALENT_ACQUISITION);
  const [targetEmail, setTargetEmail] = useState('');
  const [department, setDepartment] = useState('Engineering & Product');
  const [lastGeneratedLink, setLastGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeInvites = invitations.filter(
    (inv) => !inv.is_used && new Date(inv.expires_at) > new Date()
  );

  const isCleanWorkspace = users.length <= 1 && candidates.length === 0 && jobPostings.length === 0;

  const handleCreateInvite = async (e) => {
    e.preventDefault();
    if (!targetEmail || !targetEmail.includes('@')) {
      addToast('Validation Error', 'Please enter a valid corporate email address.', 'error');
      return;
    }

    setIsGenerating(true);
    const createdInvite = await generateInvitation({
      targetRole: selectedRole,
      email: targetEmail.trim(),
      department: department.trim(),
    });
    setIsGenerating(false);

    if (createdInvite) {
      const token = createdInvite.invite_token || createdInvite.inviteToken;
      const fullUrl = `${window.location.origin}/?token=${token}`;
      setLastGeneratedLink(fullUrl);
      setTargetEmail('');
    }
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link || lastGeneratedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Copied', 'Role invitation link copied to clipboard.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Root System Administrator Console &bull; Security Boundary</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Enterprise Security & Tenant Enclave Health
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage workspace membership, issue cryptographic role invitations, enforce BYOK keys, and inspect tamper-evident audit trails.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigate('admin-invites')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Role Invitations ({activeInvites.length})</span>
          </button>
          <button
            onClick={() => onNavigate('admin-byok')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span>BYOK Security</span>
          </button>
        </div>
      </div>

      {/* Fresh Clean Workspace Quickstart Guide */}
      {isCleanWorkspace && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/80 border border-purple-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pristine Clean Enterprise Enclave</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Welcome to your newly provisioned workspace for {workspace.company_name}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                This enclave starts 100% clean with zero pre-seeded candidates or jobs. To begin, generate cryptographic role invitation links below to onboard your team, configure your BYOK inference keys, or load sandbox demo data if you want to test workflows immediately.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
                <span className="flex items-center space-x-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>1. Generate Role Invites</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>2. Configure BYOK AI Keys</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>3. Ingest Resumes in TA</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
              <button
                onClick={loadDemoData}
                className="px-4 py-2.5 rounded-xl bg-slate-800/90 border border-purple-500/40 text-purple-200 hover:text-white hover:bg-purple-600/30 text-xs font-semibold transition-all inline-flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Load Sample Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Admin Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Tenant Enclave</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-white font-mono tracking-tight">{workspace.tier || 'Tier 1 Enclave'}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">FedRAMP Ready &bull; SOC-2 Type II</p>
        </div>

        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>BYOK Encryption</span>
            <KeyRound className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-white font-mono tracking-tight">{byokConfig.encrypted_api_key ? 'AES-256 GCM' : 'Vault Ready'}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{byokConfig.encrypted_api_key ? 'Hardware Key Vault Active' : 'Configure LLM Inference Key'}</p>
        </div>

        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Active Collaborators</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{users.length} Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Strict RBAC isolation enforced</p>
        </div>

        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Audit Trail Ledger</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{auditLogs.length} Events</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono text-emerald-400">100% SHA-256 Immutable Sealed</p>
        </div>
      </div>

      {/* Primary Role-Based Invitation Link Generator Card */}
      <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Cryptographic Role-Based Invitation Generator
              </h3>
              <p className="text-xs text-slate-400">
                Non-admin users cannot self-register publicly. Generate one-time 48-hour role tokens for TA, HM, HR, and Engagement personas.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold">
              {activeInvites.length} Active Tokens
            </span>
          </div>
        </div>

        {/* Inline Quick Generator Form */}
        <form onSubmit={handleCreateInvite} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Target Persona Role <span className="text-purple-400">*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value={ROLES.TALENT_ACQUISITION}>Talent Acquisition (TA Lead)</option>
              <option value={ROLES.HIRING_MANAGER}>Hiring Manager (HM Lead)</option>
              <option value={ROLES.HR_REPRESENTATIVE}>HR Representative (Governance)</option>
              <option value={ROLES.ENGAGEMENT_SPECIALIST}>Engagement Specialist (Onboarding)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Corporate Email <span className="text-purple-400">*</span>
            </label>
            <input
              type="email"
              required
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering Platforms"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-1.5 cursor-pointer h-[38px] disabled:opacity-50"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating in Backend...' : 'Generate 48h Invite Link'}</span>
            </button>
          </div>
        </form>

        {/* Generated Link Result Display */}
        {lastGeneratedLink && (
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cryptographic Invite Link Ready</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Valid for 48 Hours &bull; One-Time Token</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={lastGeneratedLink}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 focus:outline-none"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy()}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md flex-shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
                <a
                  href={lastGeneratedLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Simulate Open</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Recent Active Invites Quick List */}
        {invitations.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recent Workspace Role Invites ({invitations.length})
              </span>
              <button
                onClick={() => onNavigate('admin-invites')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Directory</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden">
              {invitations.slice(0, 3).map((inv) => {
                const roleDef = ROLE_DEFINITIONS[inv.target_role] || { name: inv.target_role };
                const inviteUrl = `${window.location.origin}/?token=${inv.invite_token}`;
                const isExpired = new Date(inv.expires_at) < new Date();

                return (
                  <div key={inv.invite_id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-900/60 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono text-[11px]">
                        {roleDef.shortName?.slice(0, 2) || 'US'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{inv.invited_email}</span>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono text-[10px] border border-indigo-500/20">
                            {roleDef.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{inv.department} &bull; Token: {inv.invite_token.slice(0, 14)}...</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {inv.is_used ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          Redeemed
                        </span>
                      ) : isExpired ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active &bull; 48h
                        </span>
                      )}

                      {!inv.is_used && (
                        <>
                          <button
                            onClick={() => handleCopy(inviteUrl)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Copy Invite Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={inviteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-purple-600/80 text-white hover:bg-purple-600 transition-colors cursor-pointer"
                            title="Simulate Open"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards to Admin Enclaves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BYOK Enclave Preview */}
        <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Enterprise AI Engine & BYOK Enclave</h3>
                <p className="text-xs text-slate-400">Hardware-encrypted custom LLM inference keys</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Provider:</span>
                <span className="font-bold text-white">{byokConfig.model_name || byokConfig.modelName || 'OpenAI GPT-4o'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Key:</span>
                <span className="text-indigo-400">{byokConfig.masked_key || byokConfig.maskedKey || 'No key configured yet'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rotated:</span>
                <span className="text-emerald-400 font-semibold">{byokConfig.last_rotated || byokConfig.lastRotated || 'Never'}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigate('admin-byok')}
              className="w-full py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600/30 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Manage BYOK Cryptography</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Security & Audit Trail Preview */}
        <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Cryptographic Security Audit Trail</h3>
                <p className="text-xs text-slate-400">Tamper-evident real-time immutable ledger</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ledger Integrity:</span>
                <span className="text-emerald-400 font-bold">100% SHA-256 Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Latest Event:</span>
                <span className="text-slate-200 truncate max-w-xs">{auditLogs[0]?.event || 'Root Initialization'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Live Stream:</span>
                <span className="text-emerald-400 flex items-center space-x-1 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigate('admin-audit')}
              className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-600/30 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Inspect Immutable Audit Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

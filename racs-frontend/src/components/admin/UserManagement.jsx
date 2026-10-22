import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_DEFINITIONS } from '../../data/mockData';
import {
  Users,
  UserPlus,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  Copy,
  Check,
  AlertTriangle,
  X,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

export function UserManagement({ initialTab = 'users', onNavigate }) {
  const { users, invitations = [], generateInvitation, revokeUserAccess, addToast } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState(initialTab);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [revokeUserTarget, setRevokeUserTarget] = useState(null);

  // Sync if initialTab changes
  React.useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState(ROLES.TALENT_ACQUISITION);
  const [inviteDept, setInviteDept] = useState('Engineering & Product');
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      addToast('Validation Error', 'Please enter a valid corporate email.', 'error');
      return;
    }

    setIsGenerating(true);
    const createdInvite = await generateInvitation({
      targetRole: inviteRole,
      email: inviteEmail.trim(),
      department: inviteDept.trim(),
    });
    setIsGenerating(false);

    if (createdInvite) {
      const token = createdInvite.invite_token || createdInvite.inviteToken;
      const fullUrl = `${window.location.origin}/?token=${token}`;
      setGeneratedInviteLink(fullUrl);
      setInviteEmail('');
    }
  };

  const handleCopyLink = (linkToCopy) => {
    navigator.clipboard.writeText(linkToCopy || generatedInviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Copied to Clipboard', 'Cryptographic invite URL copied.', 'info');
  };

  const confirmRevoke = () => {
    if (!revokeUserTarget) return;
    revokeUserAccess(revokeUserTarget.user_id || revokeUserTarget.id);
    setRevokeUserTarget(null);
  };

  const activeInvitesCount = invitations.filter((inv) => !inv.is_used && new Date(inv.expires_at) > new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Identity & Access Management (IAM) &bull; Spring Boot Controller Aligned</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            User Management & Cryptographic Role Invitations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-admin personas cannot self-register publicly. Generate 48-hour role invite tokens, monitor active workspace collaborators, and enforce revocation boundaries.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setActiveSubTab('invitations');
              setGeneratedInviteLink('');
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Generate Role Invite</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Workspace Team Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invitations')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'invitations'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Role Invitations & Tokens ({activeInvitesCount} Active / {invitations.length})</span>
        </button>
      </div>

      {/* INLINE ROLE INVITATION GENERATOR (Prominently shown on Invitations Tab) */}
      {activeSubTab === 'invitations' && (
        <div className="rounded-3xl p-6 bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Generate Role-Based Cryptographic Invite Link</h3>
                <p className="text-xs text-slate-400">Issues a signed one-time registration link valid for 48 hours for the chosen role.</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              48-Hour TTL Enforced
            </span>
          </div>

          <form onSubmit={handleGenerateInvite} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Persona Role <span className="text-purple-400">*</span>
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value={ROLES.TALENT_ACQUISITION}>Talent Acquisition (TA Lead)</option>
                <option value={ROLES.HIRING_MANAGER}>Hiring Manager (HM Lead)</option>
                <option value={ROLES.HR_REPRESENTATIVE}>HR Representative (Governance)</option>
                <option value={ROLES.ENGAGEMENT_SPECIALIST}>Engagement Specialist (Pre-Boarding)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Recipient Corporate Email <span className="text-purple-400">*</span>
              </label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="collaborator@enterprise.internal"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={inviteDept}
                onChange={(e) => setInviteDept(e.target.value)}
                placeholder="e.g. Engineering Platforms"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-1.5 cursor-pointer h-[38px]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Generate Token Link</span>
              </button>
            </div>
          </form>

          {/* Generated Link Display */}
          {generatedInviteLink && (
            <div className="pt-3 border-t border-slate-800 space-y-2 animate-fadeIn">
              <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Invite Link Created Successfully</span>
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedInviteLink}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 focus:outline-none"
                />
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleCopyLink()}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                  <a
                    href={generatedInviteLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Simulate Open</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collaborator Directory Table (Shown on 'users' tab) */}
      {activeSubTab === 'users' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/30 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Workspace Team Directory ({users.length})
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                Database: users
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Strict RBAC Isolation Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Collaborator</th>
                  <th className="py-3 px-4">Role & Persona</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">FIDO2 / MFA</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {users.map((u) => {
                  const roleDef = ROLE_DEFINITIONS[u.role] || { name: u.role, shortName: u.role };
                  const isRevoked = u.access_status === 'Revoked';

                  return (
                    <tr key={u.user_id || u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={u.full_legal_name || u.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-white">{u.full_legal_name || u.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {roleDef.name}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {u.department || 'Operations'}
                      </td>

                      <td className="py-3 px-4">
                        {isRevoked ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            <X className="w-3 h-3" />
                            <span>Revoked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400">
                          <Lock className="w-3 h-3 text-cyan-400" />
                          <span>FIDO2 Enforced</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {u.role !== ROLES.SYSTEM_ADMIN && !isRevoked ? (
                          <button
                            onClick={() => setRevokeUserTarget(u)}
                            className="text-xs text-red-400 hover:text-red-300 font-medium hover:underline cursor-pointer"
                          >
                            Revoke Access
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-600 font-mono">
                            {isRevoked ? 'Deprovisioned' : 'Root Immutable'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cryptographic Invitations Table (Shown on 'invitations' tab) */}
      {activeSubTab === 'invitations' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/30 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Cryptographic Role Invitations ({invitations.length})
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                Database: invitations
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">48-Hour One-Time Cryptographic Tokens</span>
          </div>

          <div className="overflow-x-auto">
            {invitations.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">No Invitations Generated Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Use the form above to issue your first role-specific invite token for Talent Acquisition, Hiring Managers, or HR.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Invited Email</th>
                    <th className="py-3 px-4">Target Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Token</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {invitations.map((inv) => {
                    const roleDef = ROLE_DEFINITIONS[inv.target_role] || { name: inv.target_role };
                    const isExpired = new Date(inv.expires_at) < new Date();
                    const inviteUrl = `${window.location.origin}/?token=${inv.invite_token}`;

                    return (
                      <tr key={inv.invite_id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">{inv.invited_email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {roleDef.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{inv.department}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-cyan-400">
                          {inv.invite_token.slice(0, 16)}...
                        </td>
                        <td className="py-3 px-4">
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
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {!inv.is_used && (
                            <>
                              <button
                                onClick={() => handleCopyLink(inviteUrl)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer text-[11px]"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Link</span>
                              </button>
                              <a
                                href={inviteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-600/80 text-white hover:bg-purple-600 transition-all cursor-pointer text-[11px]"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Simulate Open</span>
                              </a>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Revocation Confirmation Modal */}
      {revokeUserTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0F17] border border-red-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <ShieldAlert className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Revoke User Access</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to revoke access for{' '}
              <strong className="text-white">{revokeUserTarget.full_legal_name || revokeUserTarget.name}</strong> (
              {revokeUserTarget.email})?
            </p>
            <p className="text-[11px] text-slate-500">
              In accordance with Query 13, user status will be marked <code>Revoked</code>. Historical jobs and uploaded candidate dossiers will remain strictly intact in the database.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setRevokeUserTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRevoke}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

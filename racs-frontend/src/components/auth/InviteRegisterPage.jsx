import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DEFINITIONS } from '../../data/mockData';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  KeyRound,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export function InviteRegisterPage({ token, onCancel }) {
  const { validateInviteToken, registerWithInvite, currentUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [validationState, setValidationState] = useState({
    isValidating: true,
    valid: false,
    invitation: null,
    workspace: null,
    error: '',
  });

  useEffect(() => {
    let isMounted = true;
    async function checkToken() {
      if (!token) {
        if (isMounted) {
          setValidationState({ isValidating: false, valid: false, invitation: null, workspace: null, error: 'No invite token provided.' });
        }
        return;
      }
      try {
        const res = await validateInviteToken(token);
        if (isMounted) {
          if (res.valid) {
            setValidationState({
              isValidating: false,
              valid: true,
              invitation: res.invitation,
              workspace: res.workspace,
              error: '',
            });
            setEmail(res.invitation.invited_email || res.invitation.invitedEmail || '');
          } else {
            setValidationState({
              isValidating: false,
              valid: false,
              invitation: null,
              workspace: null,
              error: res.error || 'Token validation failed.',
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setValidationState({
            isValidating: false,
            valid: false,
            invitation: null,
            workspace: null,
            error: err.message || 'Error validating token.',
          });
        }
      }
    }
    checkToken();
    return () => { isMounted = false; };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full legal name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid enterprise work email is required.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await registerWithInvite({
      token,
      fullName: fullName.trim(),
      email: email.trim(),
      password,
    });

    setLoading(false);
    if (!result || !result.success) {
      setError(result?.error || 'Failed to complete registration.');
    } else {
      window.history.replaceState({}, '', window.location.pathname);
      if (onCancel) onCancel();
    }
  };

  if (validationState.isValidating) {
    return (
      <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col items-center justify-center p-6 bg-grid-pattern relative">
        <div className="max-w-md w-full bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto animate-spin">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Validating Cryptographic Token</h2>
          <p className="text-xs text-slate-400">Verifying role invitation parameters with Spring Boot MySQL backend...</p>
        </div>
      </div>
    );
  }

  if (!validationState.valid) {
    return (
      <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col items-center justify-center p-6 bg-grid-pattern relative">
        <div className="max-w-md w-full bg-slate-900/90 border border-red-500/30 rounded-3xl p-8 shadow-2xl shadow-red-950/20 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Invalid or Expired Invite Link</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {validationState.error || 'This cryptographic token is invalid, expired (exceeding 48 hours), or has already been redeemed.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (onCancel) onCancel();
                else window.location.href = window.location.origin;
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 transition-all cursor-pointer inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Landing</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const invite = validationState.invitation;
  const workspace = validationState.workspace;
  const roleName = invite?.target_role || invite?.invitedRole;
  const roleDef = ROLE_DEFINITIONS[roleName] || {
    name: roleName || 'Enterprise Member',
    shortName: roleName || 'Member',
    description: 'Enterprise workspace member',
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative bg-grid-pattern overflow-y-auto">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between backdrop-blur-xl bg-[#080B11]/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">RACS AI</span>
          <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-md">
            INVITATION ENCLAVE
          </span>
        </div>

        <button
          onClick={() => {
            if (onCancel) onCancel();
            else window.location.href = window.location.origin;
          }}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing</span>
        </button>
      </header>

      {/* Main Registration Container */}
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="max-w-lg w-full bg-[#0B0F17]/95 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/60 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Invitation Badge */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-300 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Authorized Cryptographic Token</span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Accept Role Invitation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete your profile to join <span className="text-white font-medium">{workspace?.company_name || workspace?.companyName || 'Enterprise Workspace'}</span>.
              </p>
            </div>
          </div>

          {/* Invited Role & Organization Info Card */}
          <div className="my-5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Assigned Role:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 text-[11px]">
                {roleDef.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Department:</span>
              <span className="text-white font-medium">{invite?.department || 'Operations'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Security Boundary:</span>
              <span className="text-emerald-400 font-mono text-[11px]">RBAC Isolated Enclave</span>
            </div>
          </div>

          {currentUser && (
            <div className="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
              <span>Active session: <strong>{currentUser.full_legal_name || currentUser.name}</strong>. Completing registration will switch into the invited <strong>{roleDef.shortName}</strong> persona.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Legal Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Lin"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Enterprise Work Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Activating Profile...' : 'Complete Registration & Access Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <p className="mt-4 text-[11px] text-center text-slate-500">
            By accepting, you acknowledge adherence to company IT security policies and RBAC isolation boundaries.
          </p>
        </div>
      </div>
    </div>
  );
}

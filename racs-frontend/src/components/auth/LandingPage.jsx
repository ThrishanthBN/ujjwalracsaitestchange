import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_DEFINITIONS } from '../../data/mockData';
import {
  Cpu,
  Shield,
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck2,
  Users,
  Briefcase,
  Layers,
  Compass,
  Mail,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Sliders,
  Eye,
  EyeOff,
  Building2,
  Terminal,
  Activity,
  Globe,
  Award,
  Phone,
  FileText,
  AlertTriangle,
  User,
  ExternalLink,
} from 'lucide-react';

export function LandingPage({ onOpenInvite }) {
  const { login, loginAsDemoPersona, signupWorkspaceAdmin } = useAuth();
  const [authMode, setAuthMode] = useState('signin'); // 'signin', 'signup', or 'redeem_token'
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Manual Invite Token Redemption Form
  const [manualToken, setManualToken] = useState('');

  // System Administrator Workspace Provisioning Signup Form (All 7 mandatory backend fields)
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle standard credentials sign-in
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!signInEmail) {
      setFormError('Please enter your work email.');
      return;
    }
    setIsSubmitting(true);
    const result = await login({
      email: signInEmail,
      password: signInPassword,
    });
    setIsSubmitting(false);
    if (!result || !result.success) {
      setFormError(result?.error || 'Login failed. Check your email or select a pre-seeded persona below.');
    }
  };

  // Handle System Admin Workspace Provisioning
  const handleAdminSignUpSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!companyName.trim()) {
      setFormError('Company Legal Name is required.');
      return;
    }
    if (!companyAddress.trim()) {
      setFormError('Company Physical Address is required.');
      return;
    }
    if (!gstin.trim()) {
      setFormError('GSTIN / Tax ID is required.');
      return;
    }
    if (!companyPhone.trim()) {
      setFormError('Company Phone Number is required.');
      return;
    }
    if (!adminFullName.trim()) {
      setFormError('System Administrator Full Legal Name is required.');
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setFormError('A valid corporate work email is required.');
      return;
    }
    if (!adminPassword || adminPassword.length < 8) {
      setFormError('Master password must be at least 8 characters.');
      return;
    }
    if (adminPassword !== adminConfirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await signupWorkspaceAdmin({
      companyName: companyName.trim(),
      companyAddress: companyAddress.trim(),
      gstin: gstin.trim(),
      companyPhone: companyPhone.trim(),
      adminFullName: adminFullName.trim(),
      adminEmail: adminEmail.trim(),
      adminPassword,
    });
    setIsSubmitting(false);

    if (!result || !result.success) {
      setFormError(result?.error || 'Failed to create workspace in database.');
    }
  };

  // Quick Persona Instant Login
  const handleQuickPersonaLogin = (roleKey) => {
    loginAsDemoPersona(roleKey);
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthMode(mode);
    setFormError('');
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden bg-grid-pattern">
      {/* Ambient background glows inspired by Google Stitch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Top Stitch-Style Navigation Header */}
      <header className="sticky top-0 z-40 h-20 backdrop-blur-xl bg-[#080B11]/80 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white">RACS</span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                AI
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-medium hidden sm:inline-flex">
                ENTERPRISE v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">Autonomous Recruitment & Compliance Enclave</p>
          </div>
        </div>

        {/* Middle Certifications preview */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SOC-2 TYPE II</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>ZERO DATA RETENTION</span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => openAuthModal('redeem_token')}
            className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer"
          >
            Redeem Invite Token
          </button>
          <button
            onClick={() => openAuthModal('signin')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>Admin Provisioning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-20 flex flex-col items-center text-center">
        {/* Release Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs text-indigo-300 mb-8 backdrop-blur-md shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold">Spring Boot Backend Architecture Aligned</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-[11px] text-cyan-400">Strict RBAC Persona Isolation</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.12]">
          Precision AI Hiring with <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Cryptographic RBAC Governance
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
          Zero data retention resume ingestion, explainable AI scoring without Title VII bias, and legally immutable 
          offer approval ledgers. Designed for modern multi-role enterprise recruitment teams.
        </p>

        {/* Hero CTA & Quick Persona Selector */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => openAuthModal('signin')}
            className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer flex items-center space-x-2"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Provision System Admin Workspace</span>
          </button>
        </div>

        {/* 5 Distinct Personas Overview (Directly matching IA-7 & IA-8) */}
        <div className="mt-20 w-full text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1">
                Role-Based Access Control (RBAC)
              </div>
              <h2 className="text-2xl font-bold text-white">5 Enterprise Personas with Strict Isolation</h2>
              <p className="text-xs text-slate-400 mt-1">
                Each persona operates within strict cryptographic boundaries. Test each persona instantly:
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 mt-2 sm:mt-0">
              Zero Cross-Role Privilege Leakage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.values(ROLE_DEFINITIONS).map((def) => {
              const Icon =
                def.id === ROLES.SYSTEM_ADMIN ? Shield :
                def.id === ROLES.TALENT_ACQUISITION ? Users :
                def.id === ROLES.HIRING_MANAGER ? Layers :
                def.id === ROLES.HR_REPRESENTATIVE ? Compass : Mail;

              return (
                <div
                  key={def.id}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800/90 p-5 flex flex-col justify-between hover:border-slate-700 transition-all group hover:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                        <Icon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {def.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {def.shortName}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      {def.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleQuickPersonaLogin(def.id)}
                      className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Test Persona</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Grid Highlighting Backend Mapping */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <KeyRound className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Enterprise BYOK Enclave</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Bring Your Own Key support for OpenAI and Gemini LLMs. Keys are encrypted with AES-256 GCM in the <code className="text-purple-300">tenant_api_keys</code> table with monthly token rate-limiting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Cryptographic Invite Tokens</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Non-admin roles cannot self-register publicly. Administrators issue cryptographic 48-hour tokens via the <code className="text-cyan-300">invitations</code> table linking collaborators directly to their role.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Legally Sealed Handoff Reports</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              HM recommendations are hashed with SHA-256 and locked permanently in the <code className="text-emerald-300">hr_handoff_reports</code> table for statutory CA SB 1162 pay-parity compliance.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 lg:px-12 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <p>&copy; 2026 RACS AI Enterprise Technologies. All rights reserved.</p>
        <div className="flex items-center space-x-4 mt-3 sm:mt-0 font-mono text-[11px]">
          <span>AES-256 GCM</span>
          <span>&bull;</span>
          <span>SOC-2 TYPE II</span>
          <span>&bull;</span>
          <span>EEOC TITLE VII COMPLIANT</span>
        </div>
      </footer>

      {/* Authentication & Provisioning Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl max-w-lg w-full p-7 shadow-2xl relative my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {authMode === 'signin' && 'Sign In to Enterprise Enclave'}
                    {authMode === 'signup' && 'Provision System Admin Workspace'}
                    {authMode === 'redeem_token' && 'Redeem Cryptographic Invite Token'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {authMode === 'signin' && 'Enter your credentials or choose a pre-seeded persona'}
                    {authMode === 'signup' && 'Instantiate an enterprise workspace with Root Admin credentials'}
                    {authMode === 'redeem_token' && 'Enter your 48-hour role invitation token'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 my-4 text-xs">
              <button
                onClick={() => { setAuthMode('signin'); setFormError(''); }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  authMode === 'signin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setFormError(''); }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin Sign Up
              </button>
              <button
                onClick={() => { setAuthMode('redeem_token'); setFormError(''); }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  authMode === 'redeem_token' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Redeem Token
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {authMode === 'signin' && (
              <div className="space-y-4">
                <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Enterprise Work Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="admin.vance@racsai.enterprise.internal"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Authenticating with Backend...' : 'Authenticate Session'}
                  </button>
                </form>

                {/* Instant 1-Click Evaluation Profiles */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Or Instant Login as Seeded Persona:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickPersonaLogin(ROLES.SYSTEM_ADMIN)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      <div className="truncate">
                        <div className="font-semibold text-white truncate">Dr. Arthur Vance</div>
                        <div className="text-[10px] text-slate-400">System Admin</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaLogin(ROLES.TALENT_ACQUISITION)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <div className="truncate">
                        <div className="font-semibold text-white truncate">Mateo Morales</div>
                        <div className="text-[10px] text-slate-400">Talent Acquisition</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaLogin(ROLES.HIRING_MANAGER)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <div className="truncate">
                        <div className="font-semibold text-white truncate">Dr. David Vance</div>
                        <div className="text-[10px] text-slate-400">Hiring Manager</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaLogin(ROLES.HR_REPRESENTATIVE)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <div className="truncate">
                        <div className="font-semibold text-white truncate">Eleanor Vance</div>
                        <div className="text-[10px] text-slate-400">HR Representative</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SYSTEM ADMINISTRATOR WORKSPACE PROVISIONING SIGNUP */}
            {authMode === 'signup' && (
              <div className="space-y-3.5">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] leading-relaxed">
                  <span className="font-bold">Notice:</span> Sign-up is strictly reserved for the <strong>System Administrator</strong> to provision a corporate workspace. Other roles must be invited via cryptographic tokens.
                </div>

                <form onSubmit={handleAdminSignUpSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    1. Corporate Organization Details
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Legal Company Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Corporation Global Inc."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Company Physical Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="e.g. 548 Market St, Suite 39201, San Francisco, CA"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                        GSTIN / Tax ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        placeholder="e.g. 06AAACR1234F1Z5"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                        Company Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        placeholder="e.g. +1 (415) 890-4421"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1 pt-2">
                    2. Master System Administrator Credentials
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Admin Full Legal Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={adminFullName}
                        onChange={(e) => setAdminFullName(e.target.value)}
                        placeholder="e.g. Dr. Arthur Vance"
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Corporate Work Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@enterprise.internal"
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                        Master Password <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Min 8 chars"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                        Confirm Password <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={adminConfirmPassword}
                        onChange={(e) => setAdminConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{isSubmitting ? 'Instantiating in MySQL Database...' : 'Instantiate Enterprise Workspace & Admin Root'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: REDEEM TOKEN */}
            {authMode === 'redeem_token' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <p>
                    If you received a cryptographic invite token from your System Administrator, paste it below to complete registration and enter your workspace.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Cryptographic Invite Token
                  </label>
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value.trim())}
                    placeholder="e.g. tok_sec_77a91bf3402e88102948cda90"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (manualToken) {
                      setIsModalOpen(false);
                      if (onOpenInvite) onOpenInvite(manualToken);
                    } else {
                      setFormError('Please enter an invite token.');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Redeem Token & Register</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

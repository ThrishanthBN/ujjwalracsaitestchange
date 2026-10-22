import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_DEFINITIONS } from '../../data/mockData';
import {
  Shield,
  Sliders,
  Users,
  UserPlus,
  KeyRound,
  FileText,
  LayoutDashboard,
  UploadCloud,
  GitBranch,
  Briefcase,
  Layers,
  UserCheck,
  FileSpreadsheet,
  Compass,
  BadgeDollarSign,
  BarChart3,
  Mail,
  Clock,
  Lock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

export function Sidebar({ currentTab, onSelectTab, isCollapsed, onToggleCollapse }) {
  const { currentRole, currentUser, logout, users, invitations = [], jobPostings, candidates, auditLogs, sequences } = useAuth();
  const roleDef = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS[ROLES.TALENT_ACQUISITION];

  // Dynamic state calculations (Zero-Fake Data)
  const activeUserCount = users.filter((u) => u.access_status === 'Active').length;
  const activeInvitesCount = invitations.filter((inv) => !inv.is_used && new Date(inv.expires_at) > new Date()).length;
  const activeJobCount = jobPostings.filter((j) => j.status === 'Active').length;
  const totalCandidates = candidates.length;
  const screeningCount = candidates.filter((c) => c.pipeline_status === 'Screening' || c.status === 'Screening').length;
  const hmPendingCount = candidates.filter((c) => c.pipeline_status === 'HM Review' || c.status === 'HM Review').length;
  const offerReadyCount = candidates.filter((c) => c.pipeline_status === 'Ready for Offer Authorization' || c.status === 'Ready for Offer Authorization').length;
  const offerDispatchedCount = candidates.filter((c) => c.pipeline_status === 'Offer Dispatched & Awaiting Signature' || c.status === 'Offer Dispatched & Awaiting Signature').length;
  const totalOfferPackages = offerReadyCount + offerDispatchedCount;
  const activeSequencesCount = sequences.filter((s) => s.active).length;

  // Dynamic Navigation Configuration strictly isolated by RBAC Role with state-driven dynamic badges
  const NAVIGATION_MAP = {
    [ROLES.SYSTEM_ADMIN]: [
      { id: 'admin-dashboard', label: 'Admin Console', icon: Shield, badge: 'Root' },
      { id: 'admin-invites', label: 'Role Invitations', icon: UserPlus, badge: `${activeInvitesCount} Active` },
      { id: 'admin-users', label: 'User Directory', icon: Users, badge: `${activeUserCount} Active` },
      { id: 'admin-byok', label: 'BYOK AI Enclave', icon: KeyRound, badge: 'AES-256' },
      { id: 'admin-workspace', label: 'Workspace Settings', icon: Sliders },
      { id: 'admin-audit', label: 'Security Audit Trail', icon: FileText, badge: `${auditLogs.length} Events` },
    ],
    [ROLES.TALENT_ACQUISITION]: [
      { id: 'ta-dashboard', label: 'Pipeline Velocity', icon: LayoutDashboard, badge: `${totalCandidates} Profiles` },
      { id: 'ta-intake', label: 'Resume Batch Intake', icon: UploadCloud, badge: 'OCR Active' },
      { id: 'ta-pipeline', label: 'Candidate Pipeline', icon: GitBranch, badge: `${screeningCount} Sourced` },
      { id: 'ta-requisitions', label: 'HM Requisitions', icon: Briefcase, badge: `${activeJobCount} Open` },
    ],
    [ROLES.HIRING_MANAGER]: [
      { id: 'hm-dashboard', label: 'Department Overview', icon: Layers, badge: `${activeJobCount} Reqs` },
      { id: 'hm-candidates', label: 'AI Review & Scorecards', icon: UserCheck, badge: `${hmPendingCount || candidates.length} In Queue` },
      { id: 'hm-requisitions', label: 'My Requisitions', icon: FileSpreadsheet, badge: `${activeJobCount} Active` },
    ],
    [ROLES.HR_REPRESENTATIVE]: [
      { id: 'hr-dashboard', label: 'Executive Governance', icon: Compass, badge: `${totalOfferPackages} Packages` },
      { id: 'hr-offers', label: 'Offer Approvals & Parity', icon: BadgeDollarSign, badge: `${offerReadyCount} Pending` },
      { id: 'hr-analytics', label: 'Operations Analytics', icon: BarChart3, badge: 'SB 1162' },
    ],
    [ROLES.ENGAGEMENT_SPECIALIST]: [
      { id: 'engagement-dashboard', label: 'Onboarding Pipeline', icon: Mail, badge: `${totalOfferPackages} Enrolled` },
      { id: 'engagement-sequences', label: 'Email Cadence Config', icon: Clock, badge: `${activeSequencesCount} Cadences` },
    ],
  };

  const activeNavItems = NAVIGATION_MAP[currentRole] || [];

  return (
    <aside
      className={`bg-[#0B0F17]/95 backdrop-blur-xl text-slate-300 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800/80 transition-all duration-300 ease-in-out select-none relative z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header with Collapse Toggle */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="min-w-0 flex-1 pr-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
              <span>Persona Isolation</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
            </div>
            <div className="flex items-center space-x-2.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <img
                src={currentUser?.avatar || roleDef.avatar}
                alt={currentUser?.full_legal_name || currentUser?.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{currentUser?.full_legal_name || currentUser?.name}</h4>
                <p className="text-[10px] text-indigo-400 font-semibold truncate">{roleDef.shortName}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center py-1">
            <div className="relative">
              <img
                src={currentUser?.avatar || roleDef.avatar}
                alt={currentUser?.full_legal_name || currentUser?.name}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-indigo-500/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0F17]" />
            </div>
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80 transition-colors cursor-pointer flex-shrink-0 ${
            isCollapsed ? 'mx-auto mt-2' : ''
          }`}
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2.5 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-2 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Dedicated Workflows
          </div>
        )}

        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl transition-all duration-150 cursor-pointer text-xs group relative ${
                isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 ring-1 ring-white/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex-shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/20'
                      : 'bg-slate-800/90 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="px-2 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RBAC Session</span>
              </span>
              <span className="text-emerald-400">Active</span>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 flex items-center justify-center transition-all cursor-pointer"
            title="Sign Out Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

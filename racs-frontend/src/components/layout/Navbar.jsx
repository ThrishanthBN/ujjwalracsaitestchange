import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DEFINITIONS } from '../../data/mockData';
import {
  ShieldCheck,
  Search,
  Bell,
  Cpu,
  Lock,
  Building2,
  Command,
  LogOut,
  ChevronDown,
  UserCheck,
  Shield,
  Layers,
  KeyRound
} from 'lucide-react';

export function Navbar({ onOpenSearch }) {
  const { currentRole, currentUser, workspace, logout } = useAuth();
  const roleDef = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS.ROLE_TALENT_ACQUISITION;
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between transition-all select-none">
      {/* Left: Brand & Workspace Enclave Badge */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/10">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">RACS</span>
              <span className="font-semibold text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">Enterprise Autonomous Recruitment</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-slate-800">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-white">{workspace.company_name || workspace.companyName || workspace.name}</span>
          </div>

          <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>SOC-2 TYPE II</span>
          </div>

          <div className="hidden xl:flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold font-mono">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>FIPS 140-3 HSM</span>
          </div>
        </div>
      </div>

      {/* Center: Omni-Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates, requisitions (REQ-2024-089), or audit ledger..."
            className="w-full pl-10 pr-12 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            onClick={onOpenSearch}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-0.5 px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400 font-mono">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Security Attestation & User Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Zero Data Retention Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">ZDR</span>
          <span className="text-slate-500">:</span>
          <span>ACTIVE</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Security and pipeline notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0B0F17]" />
        </button>

        {/* User Profile Popover & Sign Out */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-800"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || roleDef.avatar}
                alt={currentUser?.full_legal_name || currentUser?.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0F17]" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white truncate max-w-[120px]">
                {currentUser?.full_legal_name || currentUser?.name}
              </p>
              <p className="text-[10px] text-indigo-400 font-semibold">{roleDef.shortName}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0E131F] border border-slate-800 shadow-2xl p-3 z-50 text-left animate-fadeIn">
              <div className="p-2 border-b border-slate-800/80 mb-2">
                <p className="text-xs font-bold text-white">
                  {currentUser?.full_legal_name || currentUser?.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                <div className="mt-2 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-mono">
                  <span>ROLE:</span>
                  <span className="font-bold">{roleDef.shortName}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="px-2 py-1.5 text-slate-400 flex items-center justify-between text-[11px] font-mono">
                  <span>Enclave ID</span>
                  <span className="text-slate-300 truncate max-w-[120px]">{workspace.workspace_id || workspace.id || 'WS-ENCLAVE'}</span>
                </div>
                <div className="px-2 py-1.5 text-slate-400 flex items-center justify-between text-[11px] font-mono">
                  <span>Session Hash</span>
                  <span className="text-emerald-400">VERIFIED</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Enclave</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, KeyRound, Lock, UserCheck, ArrowLeft } from 'lucide-react';

export function UnauthorizedScreen({ allowedRoles = [], featureName = 'Restricted Enclave' }) {
  const { currentRole, currentUser, switchRole } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-[#0E131F] rounded-3xl border border-rose-500/30 shadow-2xl shadow-rose-950/40 p-8 text-center relative overflow-hidden">
        {/* Luminous background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-6 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-semibold uppercase tracking-wider mb-3 font-mono">
          <Lock className="w-3 h-3" />
          <span>RBAC SECURITY BOUNDARY ACTIVE</span>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight mb-2">
          Access Restricted: {featureName}
        </h2>

        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          Your active persona <span className="font-semibold text-white">"{currentUser?.name}"</span> is assigned to the{' '}
          <span className="font-semibold text-indigo-400 font-mono">[{currentRole}]</span> role. Strict tenant data isolation and compliance boundaries block unauthorized access to this module.
        </p>

        {/* Permitted Roles Matrix */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-left mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span>Authorized Roles for This Enclave Module</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allowedRoles.map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className="group inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 hover:border-indigo-500/60 hover:text-white transition-all cursor-pointer"
                title={`Switch context to ${role}`}
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Simulate {role.replace('ROLE_', '').replace(/_/g, ' ')}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

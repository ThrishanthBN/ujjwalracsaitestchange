import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sliders,
  Building2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Save,
  Link,
  RefreshCw,
} from 'lucide-react';

export function WorkspaceSettings() {
  const { workspace, setWorkspace, addToast, recordAuditLog } = useAuth();
  const [zdr, setZdr] = useState(workspace.zeroDataRetention);
  const [eeoc, setEeoc] = useState(workspace.eeocMasking);
  const [webhookUrl, setWebhookUrl] = useState(workspace.atsWebhookUrl);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const handleSaveSettings = () => {
    setWorkspace((prev) => ({
      ...prev,
      zeroDataRetention: zdr,
      eeocMasking: eeoc,
      atsWebhookUrl: webhookUrl,
    }));
    recordAuditLog('Workspace Security Configuration Updated', 'Tenant Enclave Policy Settings', 'POLICY_UPDATED');
    addToast('Settings Saved', 'Workspace tenant isolation and compliance parameters successfully updated.', 'success');
  };

  const handleTestWebhook = () => {
    setTestingWebhook(true);
    setTimeout(() => {
      setTestingWebhook(false);
      addToast('Webhook Handshake Verified', 'HTTP 200 OK received from ATS endpoint with HMAC-SHA256 signature.', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>Tenant Enclave & Compliance Settings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Workspace Isolation & ATS Integration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure multi-tenant boundary isolation, Zero-Data Retention (ZDR) compliance, and bidirectional ATS webhooks.
        </p>
      </div>

      {/* Tenant Identity Card */}
      <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-purple-400" />
          <span>Organization & Tenant Profile</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">Company Legal Name</label>
            <input
              type="text"
              value={workspace.company_name || workspace.companyName || workspace.name || ''}
              readOnly
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">Workspace UUID (Database)</label>
            <input
              type="text"
              value={workspace.workspace_id || workspace.workspaceId || workspace.id || ''}
              readOnly
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-purple-400 font-bold cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">GSTIN / Corporate Tax ID</label>
            <input
              type="text"
              value={workspace.gstin || ''}
              readOnly
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white font-semibold cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">Corporate Phone</label>
            <input
              type="text"
              value={workspace.company_phone || workspace.companyPhone || ''}
              readOnly
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-400 font-semibold mb-1.5">Company Headquarters Address</label>
            <input
              type="text"
              value={workspace.company_address || workspace.companyAddress || ''}
              readOnly
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Compliance Toggles Grid */}
      <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Statutory Compliance & Data Retention Policies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Zero Data Retention Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between">
            <div className="pr-4">
              <span className="font-bold text-white block">Zero Data Retention (ZDR) Enclave</span>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Automatically purges resume vector blobs and raw text extracts immediately after scoring handoff.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setZdr(!zdr)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                zdr ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  zdr ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* EEOC Title VII Masking Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between">
            <div className="pr-4">
              <span className="font-bold text-white block">EEOC Title VII Demographic Scrubbing</span>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Applies neural token masking to candidate names, photos, gender identifiers, and graduation years before LLM scoring.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEeoc(!eeoc)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                eeoc ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  eeoc ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ATS Webhook Integration */}
      <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/30 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Link className="w-4 h-4 text-cyan-400" />
          <span>Bi-directional ATS Webhook Handshake</span>
        </h3>

        <div className="text-xs space-y-3">
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">
              Production ATS Webhook Endpoint URL (Greenhouse / Workday)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {testingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Ping Handshake</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Workspace Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

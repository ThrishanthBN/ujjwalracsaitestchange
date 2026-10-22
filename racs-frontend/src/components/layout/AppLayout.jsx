import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from '../common/ProtectedRoute';

// View Imports
import { AdminDashboard } from '../admin/AdminDashboard';
import { WorkspaceSettings } from '../admin/WorkspaceSettings';
import { UserManagement } from '../admin/UserManagement';
import { ByokConsole } from '../admin/ByokConsole';
import { SecurityAuditTrail } from '../admin/SecurityAuditTrail';

import { TaDashboard } from '../ta/TaDashboard';
import { ResumeIntake } from '../ta/ResumeIntake';
import { CandidatePipeline } from '../ta/CandidatePipeline';
import { HmRequisitions as TaHmRequisitions } from '../ta/HmRequisitions';

import { HmDashboard } from '../hm/HmDashboard';
import { CandidateEvaluation } from '../hm/CandidateEvaluation';
import { HmRequisitions } from '../hm/HmRequisitions';

import { HrDashboard } from '../hr/HrDashboard';
import { OfferApprovals } from '../hr/OfferApprovals';
import { OperationsAnalytics } from '../hr/OperationsAnalytics';

import { EngagementDashboard } from '../engagement/EngagementDashboard';
import { EmailSequenceConfigurator } from '../engagement/EmailSequenceConfigurator';

export function AppLayout() {
  const { currentRole } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mapping default initial tab when role switches
  const DEFAULT_TABS = {
    [ROLES.SYSTEM_ADMIN]: 'admin-dashboard',
    [ROLES.TALENT_ACQUISITION]: 'ta-dashboard',
    [ROLES.HIRING_MANAGER]: 'hm-dashboard',
    [ROLES.HR_REPRESENTATIVE]: 'hr-dashboard',
    [ROLES.ENGAGEMENT_SPECIALIST]: 'engagement-dashboard',
  };

  const [currentTab, setCurrentTab] = useState(DEFAULT_TABS[currentRole] || 'ta-dashboard');
  const [selectedCandidateId, setSelectedCandidateId] = useState('CAND-9041');

  // Whenever the active persona changes, route to that persona's home tab
  useEffect(() => {
    setCurrentTab(DEFAULT_TABS[currentRole] || 'ta-dashboard');
  }, [currentRole]);

  const handleNavigate = (tabId) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidateId(candidateId);
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white bg-grid-pattern">
      {/* Top Enterprise Navbar */}
      <Navbar onOpenSearch={() => handleNavigate('ta-pipeline')} />

      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic RBAC Collapsible Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-5 py-8 md:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
          {/* System Administrator Routes */}
          {currentTab === 'admin-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="Admin Console">
              <AdminDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-workspace' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="Workspace Settings">
              <WorkspaceSettings />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-invites' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="Role Invitations">
              <UserManagement initialTab="invitations" onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-users' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="User Directory">
              <UserManagement initialTab="users" onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-byok' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="BYOK Cryptographic Enclave">
              <ByokConsole />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-audit' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="Security Audit Trail">
              <SecurityAuditTrail />
            </ProtectedRoute>
          )}

          {/* Talent Acquisition Routes */}
          {currentTab === 'ta-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.TALENT_ACQUISITION]} featureName="TA Velocity Dashboard">
              <TaDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'ta-intake' && (
            <ProtectedRoute allowedRoles={[ROLES.TALENT_ACQUISITION]} featureName="Resume Batch Intake">
              <ResumeIntake onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'ta-pipeline' && (
            <ProtectedRoute allowedRoles={[ROLES.TALENT_ACQUISITION]} featureName="Candidate Pipeline Funnel">
              <CandidatePipeline onSelectCandidate={handleSelectCandidate} onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'ta-requisitions' && (
            <ProtectedRoute allowedRoles={[ROLES.TALENT_ACQUISITION]} featureName="Active Job Requisitions">
              <TaHmRequisitions onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}

          {/* Hiring Manager Routes */}
          {currentTab === 'hm-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.HIRING_MANAGER]} featureName="Department Overview">
              <HmDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'hm-candidates' && (
            <ProtectedRoute allowedRoles={[ROLES.HIRING_MANAGER]} featureName="AI Candidate Evaluation">
              <CandidateEvaluation
                selectedCandidateId={selectedCandidateId}
                onSelectCandidate={handleSelectCandidate}
              />
            </ProtectedRoute>
          )}
          {currentTab === 'hm-requisitions' && (
            <ProtectedRoute allowedRoles={[ROLES.HIRING_MANAGER]} featureName="Manager Requisitions">
              <HmRequisitions />
            </ProtectedRoute>
          )}

          {/* HR Representative Routes */}
          {currentTab === 'hr-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.HR_REPRESENTATIVE]} featureName="HR Executive Governance">
              <HrDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'hr-offers' && (
            <ProtectedRoute allowedRoles={[ROLES.HR_REPRESENTATIVE]} featureName="Executive Offer Approvals">
              <OfferApprovals
                selectedCandidateId={selectedCandidateId}
                onSelectCandidate={handleSelectCandidate}
              />
            </ProtectedRoute>
          )}
          {currentTab === 'hr-analytics' && (
            <ProtectedRoute allowedRoles={[ROLES.HR_REPRESENTATIVE]} featureName="Operations Analytics">
              <OperationsAnalytics />
            </ProtectedRoute>
          )}

          {/* Engagement Specialist Routes */}
          {currentTab === 'engagement-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.ENGAGEMENT_SPECIALIST]} featureName="Pre-Boarding Enrollment">
              <EngagementDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'engagement-sequences' && (
            <ProtectedRoute allowedRoles={[ROLES.ENGAGEMENT_SPECIALIST]} featureName="Email Cadence Configurator">
              <EmailSequenceConfigurator />
            </ProtectedRoute>
          )}
        </main>
      </div>
    </div>
  );
}

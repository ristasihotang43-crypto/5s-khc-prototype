/**
 * 5S Monitoring System — Plant Operations Platform
 * PT Indo Manufacturing Tbk
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MonitoringProvider, useMonitoring } from './context/MonitoringContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { AreaView } from './components/AreaView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { MonitoringFormModal } from './components/MonitoringFormModal';
import { PositionDetailModal } from './components/PositionDetailModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { Area, Line, Position, MonitoringRecord } from './types';
import { CheckCircle2, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { selectedDate, getMonitoringForPosition } = useMonitoring();

  // Navigation tab: 'dashboard' | 'monitoring' | 'history' | 'profile'
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('depallitizer');

  // Modals state
  const [activeFormTarget, setActiveFormTarget] = useState<{
    position: Position;
    area: Area;
    line?: Line;
  } | null>(null);

  const [activeDetailTarget, setActiveDetailTarget] = useState<{
    position: Position;
    area: Area;
    line?: Line;
    record: MonitoringRecord;
  } | null>(null);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // If user is not logged in, display industrial login screen
  if (!currentUser) {
    return <LoginView />;
  }

  // Open inspection form when an uncontrolled position is tapped
  const handleOpenMonitoringForm = (position: Position, area: Area, line?: Line) => {
    setActiveFormTarget({ position, area, line });
  };

  // Open read-only detail modal when a completed position is tapped
  const handleOpenCompletedDetail = (position: Position, area: Area, line?: Line) => {
    const record = getMonitoringForPosition(selectedDate, area.id, line?.id, position.id);
    if (record) {
      setActiveDetailTarget({ position, area, line, record });
    }
  };

  // Jump from Dashboard to Area
  const handleSelectAreaFromDashboard = (areaId: string) => {
    setSelectedAreaId(areaId);
    setCurrentTab('monitoring');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-20 md:pb-10">
        {currentTab === 'dashboard' && (
          <DashboardView
            onSelectArea={handleSelectAreaFromDashboard}
            onNavigateToHistory={() => setCurrentTab('history')}
          />
        )}

        {currentTab === 'monitoring' && (
          <AreaView
            initialAreaId={selectedAreaId}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onOpenMonitoringForm={handleOpenMonitoringForm}
            onOpenCompletedDetail={handleOpenCompletedDetail}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        )}

        {currentTab === 'history' && <HistoryView />}

        {currentTab === 'profile' && (
          <ProfileView onOpenAdminModal={() => setIsAdminModalOpen(true)} />
        )}
      </main>

      {/* Mobile Touch Navigation Anchor */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* MODAL 1: MONITORING INSPECTION FORM */}
      {activeFormTarget && (
        <MonitoringFormModal
          position={activeFormTarget.position}
          area={activeFormTarget.area}
          line={activeFormTarget.line}
          onClose={() => setActiveFormTarget(null)}
          onSuccess={() => {
            const posName = activeFormTarget.position.name;
            setActiveFormTarget(null);
            triggerToast(`Audit 5S posisi "${posName}" berhasil diselesaikan dan terkunci!`);
          }}
        />
      )}

      {/* MODAL 2: READ-ONLY COMPLETED AUDIT DETAIL */}
      {activeDetailTarget && (
        <PositionDetailModal
          position={activeDetailTarget.position}
          area={activeDetailTarget.area}
          line={activeDetailTarget.line}
          record={activeDetailTarget.record}
          onClose={() => setActiveDetailTarget(null)}
        />
      )}

      {/* MODAL 3: SUPERVISOR MASTER DATA PANEL */}
      {isAdminModalOpen && (
        <AdminPanelModal onClose={() => setIsAdminModalOpen(false)} />
      )}

      {/* Global Success Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-18 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 bg-slate-900 text-white border border-emerald-500/50 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold leading-relaxed">
              {toastMessage}
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MonitoringProvider>
        <AppContent />
      </MonitoringProvider>
    </AuthProvider>
  );
}

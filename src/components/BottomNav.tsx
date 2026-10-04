import React from 'react';
import { LayoutDashboard, CheckSquare, History, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAdminModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAdminModal,
}) => {
  const { currentUser } = useAuth();
  const isSupervisor = currentUser?.role === 'supervisor';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#123C6E] border-t border-[#0e2e54] pb-safe shadow-lg">
      <div className={`grid ${isSupervisor ? 'grid-cols-5' : 'grid-cols-4'} items-center h-14`}>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            currentTab === 'dashboard' ? 'text-[#FFB800] font-semibold' : 'text-white/70'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentTab('monitoring')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            currentTab === 'monitoring' ? 'text-[#FFB800] font-semibold' : 'text-white/70'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Monitoring</span>
        </button>

        <button
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            currentTab === 'history' ? 'text-[#FFB800] font-semibold' : 'text-white/70'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Riwayat</span>
        </button>

        {isSupervisor && (
          <button
            onClick={onOpenAdminModal}
            className="flex flex-col items-center justify-center h-full transition-colors text-white/70 hover:text-[#FFB800]"
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Master</span>
          </button>
        )}

        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            currentTab === 'profile' ? 'text-[#FFB800] font-semibold' : 'text-white/70'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Profil</span>
        </button>
      </div>
    </nav>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMonitoring, formatIndonesianDate, formatDateISO } from '../context/MonitoringContext';
import {
  Factory,
  LogOut,
  Calendar,
  Clock,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ShiftType } from '../types';
import { KraftHeinzLogo } from './KraftHeinzLogo';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAdminModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAdminModal,
}) => {
  const { currentUser, logout, switchUser, allUsers } = useAuth();
  const {
    selectedDate,
    setSelectedDate,
    selectedShift,
    setSelectedShift,
    jumpToDate,
  } = useMonitoring();

  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const shifts: ShiftType[] = ['SHIFT 1', 'SHIFT 2', 'SHIFT 3'];

  // Indonesian date presentation
  const dateFormatted = formatIndonesianDate(selectedDate);
  const isToday = selectedDate === formatDateISO(new Date());

  return (
    <header className="sticky top-0 z-30 bg-[#123C6E] border-b border-[#0e2e54] text-white shadow-md">
      {/* Simulation / Date Bar Notice if not real today */}
      {!isToday && (
        <div className="bg-[#FFB800]/20 border-b border-[#FFB800]/30 px-4 py-1 text-xs text-[#FFB800] flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Mode Simulasi Tanggal: <strong>{dateFormatted}</strong> (Status 5S dihitung berdasarkan tanggal ini)</span>
          </div>
          <button
            onClick={() => setSelectedDate(formatDateISO(new Date()))}
            className="text-white hover:underline text-[11px] font-semibold transition-colors"
          >
            Kembali ke Hari Ini
          </button>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Wordmark Element with Kraft Heinz ABC Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="bg-white p-1 rounded-xl shadow-xs border border-white/20 flex items-center justify-center shrink-0">
            <KraftHeinzLogo size="sm" />
          </div>
          <div className="leading-tight">
            <span className="font-bold tracking-tight text-sm sm:text-base block text-white">
              5S MONITORING
            </span>
            <span className="text-[10px] tracking-wider text-[#FFB800] font-mono font-bold block uppercase">
              PT HEINZ ABC INDONESIA
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('monitoring')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'monitoring'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Area Monitoring
          </button>
          <button
            onClick={() => setCurrentTab('history')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'history'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Riwayat / History
          </button>
          {currentUser?.role === 'supervisor' && (
            <button
              onClick={onOpenAdminModal}
              className="px-3.5 py-2 text-sm font-medium rounded-lg text-[#FFB800] hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Settings className="w-4 h-4" />
              <span>Kelola Data Master</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Status controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Shift Picker Segment */}
          <div className="hidden sm:flex items-center bg-[#0d2a4d] p-0.5 rounded-lg border border-white/10">
            {shifts.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedShift(s)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  selectedShift === s
                    ? 'bg-[#E32128] text-white shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {s.replace('SHIFT ', 'S')}
              </button>
            ))}
          </div>

          {/* Date Selector / Simulation Tool */}
          <div className="relative">
            <button
              onClick={() => setShowDateMenu(!showDateMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0d2a4d] hover:bg-[#1a4a84] border border-white/15 rounded-lg text-xs font-mono text-white transition-colors"
              title="Ubah Tanggal Kerja / Uji Reset Harian"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FFB800]" />
              <span className="hidden sm:inline">{dateFormatted}</span>
              <span className="sm:hidden">{selectedDate}</span>
            </button>

            {showDateMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-3 z-50 text-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Pengaturan Tanggal Kerja
                </div>
                <div className="space-y-2 mb-3">
                  <label className="text-xs block text-slate-300">Pilih Tanggal Kalender:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(e.target.value);
                        setShowDateMenu(false);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div className="border-t border-slate-800 pt-2 space-y-1">
                  <div className="text-[11px] text-slate-400 mb-1">Simulasi Reset Harian:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        jumpToDate(-1);
                        setShowDateMenu(false);
                      }}
                      className="px-2 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-medium text-left"
                    >
                      ← Kemarin (-1 Hari)
                    </button>
                    <button
                      onClick={() => {
                        jumpToDate(1);
                        setShowDateMenu(false);
                      }}
                      className="px-2 py-1.5 text-xs bg-blue-900/60 hover:bg-blue-800/80 border border-blue-700/50 rounded text-blue-200 font-medium text-left"
                    >
                      Besok (+1 Hari) →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Role Badge */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-md bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block leading-none text-left">
                <div className="text-xs font-semibold text-white truncate max-w-[100px]">
                  {currentUser?.name || 'Operator'}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  NIP: {currentUser?.employee_id || '-'}
                </div>
              </div>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-3 z-50 text-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/40 border border-blue-500/50 flex items-center justify-center text-blue-300 font-bold">
                    {currentUser?.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{currentUser?.name}</div>
                    <div className="text-xs font-mono text-slate-400">NIP: {currentUser?.employee_id}</div>
                    <span className="inline-block mt-0.5 text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.2 bg-blue-950 text-blue-300 border border-blue-800 rounded">
                      {currentUser?.role === 'supervisor' ? 'Supervisor / Admin' : 'Operator 5S'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                  Ganti Akun Demo:
                </div>
                <div className="space-y-1 mb-3">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded transition-colors text-left ${
                        currentUser?.id === u.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <span>{u.name}</span>
                        <span className="text-[10px] opacity-75 font-mono ml-1.5">({u.role})</span>
                      </div>
                      {currentUser?.id === u.id && <ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT KELUAR</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useMonitoring, formatIndonesianDate } from '../context/MonitoringContext';
import {
  User,
  Shield,
  Briefcase,
  Mail,
  Calendar,
  Clock,
  LogOut,
  CheckCircle2,
  Settings,
  Sparkles,
  Award,
} from 'lucide-react';

import { KraftHeinzLogo } from './KraftHeinzLogo';

interface ProfileViewProps {
  onOpenAdminModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenAdminModal }) => {
  const { currentUser, logout, switchUser, allUsers } = useAuth();
  const { records, selectedDate, selectedShift } = useMonitoring();

  // Personal statistics
  const userRecordsToday = records.filter(
    (r) => r.user_id === currentUser?.id && r.date === selectedDate
  );
  const userTotalRecords = records.filter((r) => r.user_id === currentUser?.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs text-center relative overflow-hidden">
        <div className="flex justify-center mb-4">
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-2xl">
            <KraftHeinzLogo size="md" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          {currentUser?.name}
        </h1>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 bg-slate-100 text-slate-700 rounded-md font-mono text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentUser?.role === 'supervisor' ? 'SUPERVISOR / ADMIN' : 'OPERATOR 5S'}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-100 text-left text-xs font-mono">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase text-slate-400 block font-sans font-semibold">
              Nomor Induk Pekerja (NIP)
            </span>
            <strong className="text-slate-900 text-sm block mt-0.5">
              {currentUser?.employee_id}
            </strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase text-slate-400 block font-sans font-semibold">
              Departemen Plant
            </span>
            <strong className="text-slate-900 text-sm block mt-0.5 truncate">
              {currentUser?.department}
            </strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 sm:col-span-2">
            <span className="text-[10px] uppercase text-slate-400 block font-sans font-semibold">
              Email Resmi
            </span>
            <strong className="text-slate-900 text-sm block mt-0.5 truncate">
              {currentUser?.email}
            </strong>
          </div>
        </div>
      </div>

      {/* Operator Personal Audit Achievements */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-blue-600" />
          <span>Ringkasan Kontribusi 5S Anda</span>
        </h2>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700">
              {userRecordsToday.length}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              Audit Selesai Hari Ini
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {formatIndonesianDate(selectedDate)}
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700">
              {userTotalRecords.length}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              Total Seluruh Riwayat
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              Pemeriksaan Terverifikasi
            </div>
          </div>
        </div>
      </div>

      {/* Quick Demo Switcher */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Ganti Akun Demo Pengujian:
        </div>

        <div className="space-y-2">
          {allUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => switchUser(u.id)}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                currentUser?.id === u.id
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <div>
                <div className="font-bold text-sm">{u.name}</div>
                <div className="text-xs opacity-75 font-mono">
                  NIP {u.employee_id} · <span className="capitalize">{u.role}</span>
                </div>
              </div>

              {currentUser?.id === u.id ? (
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              ) : (
                <span className="text-xs text-blue-600 font-semibold">Ganti ke Akun Ini</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Panel button if supervisor */}
      {currentUser?.role === 'supervisor' && (
        <button
          onClick={onOpenAdminModal}
          className="w-full py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-2xl border border-blue-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>BUKA PENGATURAN MASTER DATA PABRIK</span>
        </button>
      )}

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-2xl border border-red-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>LOGOUT DARI SISTEM</span>
      </button>
    </div>
  );
};

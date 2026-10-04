import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useMonitoring, formatIndonesianDate } from '../context/MonitoringContext';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ChevronRight,
  TrendingUp,
  User,
  Calendar,
  Shield,
  Sparkles,
  ClipboardList,
  Award,
  Zap,
} from 'lucide-react';
import { ShiftType } from '../types';

interface DashboardViewProps {
  onSelectArea: (areaId: string) => void;
  onNavigateToHistory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectArea,
  onNavigateToHistory,
}) => {
  const { currentUser } = useAuth();
  const {
    selectedDate,
    selectedShift,
    setSelectedShift,
    getOverallStats,
    areas,
  } = useMonitoring();

  const stats = getOverallStats(selectedDate);
  const formattedDate = formatIndonesianDate(selectedDate);
  const shifts: ShiftType[] = ['SHIFT 1', 'SHIFT 2', 'SHIFT 3'];

  // Icons and visual accents for the 3 main areas
  const areaVisuals: Record<
    string,
    { badge: string; desc: string; icon: string }
  > = {
    depallitizer: {
      badge: 'AREA 01',
      desc: 'Infeed Pallet, Robot Arm, Magazine, HMI Panel, Safety Floor & Pagar',
      icon: '🏗️',
    },
    filling: {
      badge: 'AREA 02',
      desc: 'Line A sampai Line G — Mesin Filling, Nozel, Konveyor, Material, Sensor',
      icon: '⚙️',
    },
    assembling: {
      badge: 'AREA 03',
      desc: 'Line A sampai Line G — Stasiun Rakit Karton, Shadow Board Tools, Case Sealer',
      icon: '🔧',
    },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner & Operator Identity with Total Points */}
      <div className="bg-gradient-to-r from-[#123C6E] via-[#0d2c52] to-[#091f3a] border border-white/15 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Subtle grid accent */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-type-caption font-mono font-bold tracking-wider text-[#FFB800] uppercase mb-1">
              <span>PT HEINZ ABC INDONESIA</span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span className="text-white">MONITORING 5S</span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span className="text-white/80">{formattedDate}</span>
            </div>
            <h1 className="text-type-h1 text-white">
              Halo, {currentUser?.name || 'Operator'}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-type-body-sm text-white/80 font-mono">
              <span>NIP: {currentUser?.employee_id}</span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span>{currentUser?.department || 'Departemen Produksi'}</span>
            </div>
          </div>

          {/* Shift Segmented Controller */}
          <div className="bg-[#091f3a]/80 p-1.5 rounded-2xl border border-white/15 inline-flex items-center gap-1 self-start md:self-auto">
            <span className="text-[11px] font-mono uppercase text-white/70 px-2 font-semibold">
              Shift Aktif:
            </span>
            {shifts.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedShift(s)}
                className={`min-h-[44px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedShift === s
                    ? 'bg-[#E32128] text-white shadow-md shadow-[#E32128]/30'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Daily Monitoring Progress Bar & Quick Stats */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div className="text-type-caption font-bold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#FFB800]" />
              <span>Progress Monitoring 5S Harian</span>
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
              <span className="text-[#FFB800]">{stats.completed_positions}</span>
              <span className="text-white/80 font-normal">/ {stats.total_positions} Indikator Terkontrol</span>
              <span className="text-white/40">·</span>
              <span className="text-[#FFB800] font-extrabold flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{stats.earned_points} / {stats.total_points} Poin</span>
              </span>
              <span className="text-white ml-1 font-extrabold">({stats.points_percentage}%)</span>
            </div>
          </div>

          {/* Large Visual Progress Bar */}
          <div className="w-full h-4 sm:h-5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-[#FFB800] to-[#E32128] rounded-full transition-all duration-500 ease-out shadow-inner"
              style={{ width: `${Math.min(100, Math.max(0, stats.points_percentage))}%` }}
            />
          </div>

          {/* Quick Counter Grid with TOTAL POIN Focus */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-center">
            {/* Belum Dikontrol */}
            <div className="bg-black/25 border border-white/10 rounded-2xl py-3 px-3">
              <div className="text-[11px] uppercase tracking-wider text-white/70 font-mono font-medium">
                Belum Dikontrol
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#FFB800] mt-0.5">
                {stats.remaining_positions}
              </div>
              <div className="text-[10px] text-white/50 font-mono mt-0.5">Indikator</div>
            </div>

            {/* Sudah Dikontrol */}
            <div className="bg-black/25 border border-white/10 rounded-2xl py-3 px-3">
              <div className="text-[11px] uppercase tracking-wider text-white/70 font-mono font-medium">
                Sudah Dikontrol
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                {stats.completed_positions}
              </div>
              <div className="text-[10px] text-white/50 font-mono mt-0.5">Indikator</div>
            </div>

            {/* TOTAL POIN TERKUMPUL (NEW HIGHLIGHT) */}
            <div className="bg-[#FFB800]/20 border border-[#FFB800]/40 rounded-2xl py-3 px-3">
              <div className="text-[11px] uppercase tracking-wider text-amber-200 font-mono font-bold flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Total Poin 5S</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#FFB800] mt-0.5">
                {stats.earned_points}
                <span className="text-sm font-normal text-white/70"> / {stats.total_points}</span>
              </div>
              <div className="text-[10px] text-amber-200/80 font-mono mt-0.5">Poin Akumulasi</div>
            </div>

            {/* Skor Persentase 5S */}
            <div className="bg-black/25 border border-white/10 rounded-2xl py-3 px-3">
              <div className="text-[11px] uppercase tracking-wider text-white/70 font-mono font-medium">
                Kepatuhan 5S
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
                {stats.points_percentage}%
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Target: 100%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Area Breakdown Visual Progress Cards with Total Points */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-type-h2 text-slate-900">
              Progress & Total Poin Per Area Produksi
            </h2>
            <p className="text-type-caption text-slate-500">
              Akumulasi poin audit indikator 5S pada masing-masing zona pabrik
            </p>
          </div>
          <button
            onClick={onNavigateToHistory}
            className="text-type-caption text-[#123C6E] hover:text-[#E32128] font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Lihat Log Riwayat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {stats.area_stats.map((area) => (
            <div key={area.area_id} className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-type-body-sm">
                <span className="font-bold text-slate-800 tracking-wide text-base">
                  {area.area_name}
                </span>
                <div className="flex items-center gap-3 font-mono text-type-caption">
                  <span className="text-slate-600">
                    <strong className="text-slate-900">{area.completed}</strong>/{area.total} Indikator
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-[#123C6E] bg-white px-2 py-0.5 rounded border border-slate-200">
                    <span className="text-[#E32128]">{area.earned_points}</span> / {area.total_points} Poin ({area.points_percentage}%)
                  </span>
                </div>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    area.points_percentage >= 80
                      ? 'bg-emerald-500'
                      : area.points_percentage >= 50
                      ? 'bg-[#123C6E]'
                      : 'bg-[#FFB800]'
                  }`}
                  style={{ width: `${area.points_percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Touchscreen-Optimized Main Area Buttons with Points Overview */}
      <div>
        <div className="mb-3">
          <h2 className="text-type-h2 text-slate-900">
            Pilih Area Monitoring
          </h2>
          <p className="text-type-caption text-slate-500">
            Tekan kartu area di bawah untuk membuka dan memeriksa indikator 5S
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {areas.map((area, idx) => {
            const visual = areaVisuals[area.id] || {
              badge: `AREA 0${idx + 1}`,
              desc: area.description,
              icon: '📋',
            };
            const areaStat = stats.area_stats.find((a) => a.area_id === area.id);

            return (
              <button
                key={area.id}
                onClick={() => onSelectArea(area.id)}
                className="group relative text-left bg-white hover:bg-slate-50/80 active:bg-slate-100 border-2 border-slate-200 hover:border-[#123C6E] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all touch-card flex flex-col justify-between min-h-[185px] cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-type-caption font-mono font-bold text-[#123C6E] tracking-wider">
                      {visual.badge}
                    </span>
                    <span className="text-2xl">{visual.icon}</span>
                  </div>

                  <h3 className="text-type-h3 text-slate-900 group-hover:text-[#123C6E] transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-type-caption text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {visual.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-type-caption font-mono">
                    <div className="text-xs text-slate-500">
                      {areaStat?.completed || 0}/{areaStat?.total || 0} Selesai
                    </div>
                    <div className="font-extrabold text-sm text-[#123C6E]">
                      <span className="text-[#E32128]">{areaStat?.earned_points || 0}</span>
                      <span className="text-slate-400 font-normal"> / {areaStat?.total_points || 0} Poin</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-[#E32128] group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

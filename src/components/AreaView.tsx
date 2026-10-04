import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMonitoring, formatIndonesianDate } from '../context/MonitoringContext';
import { Area, Line, Position } from '../types';
import {
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Plus,
  ArrowRight,
  ShieldCheck,
  Check,
  Layers,
  Settings,
  ClipboardList,
  AlertTriangle,
  Info,
  Award,
  Zap,
} from 'lucide-react';

interface AreaViewProps {
  initialAreaId?: string;
  onBackToDashboard: () => void;
  onOpenMonitoringForm: (position: Position, area: Area, line?: Line) => void;
  onOpenCompletedDetail: (position: Position, area: Area, line?: Line) => void;
  onOpenAdminModal: () => void;
}

// 5S Step badge color mapper
const getStepBadge = (step?: string) => {
  switch (step) {
    case 'SORT':
      return {
        bg: 'bg-rose-50 text-[#E32128] border-rose-200',
        label: '1S · SORT (Ringkas)',
      };
    case 'SET IN ORDER':
      return {
        bg: 'bg-blue-50 text-[#123C6E] border-blue-200',
        label: '2S · SET IN ORDER (Rapi)',
      };
    case 'SHINE':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        label: '3S · SHINE (Resik)',
      };
    case 'STANDARDIZE':
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        label: '4S · STANDARDIZE (Rawat)',
      };
    case 'SUSTAIN':
      return {
        bg: 'bg-amber-50 text-[#946200] border-amber-200',
        label: '5S · SUSTAIN (Rajin)',
      };
    case 'SAFETY':
      return {
        bg: 'bg-red-50 text-red-800 border-red-200',
        label: 'SAFETY · K3 & APD',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        label: step || '5S AUDIT',
      };
  }
};

export const AreaView: React.FC<AreaViewProps> = ({
  initialAreaId = 'depallitizer',
  onBackToDashboard,
  onOpenMonitoringForm,
  onOpenCompletedDetail,
  onOpenAdminModal,
}) => {
  const { currentUser } = useAuth();
  const {
    areas,
    lines,
    positions,
    selectedDate,
    getMonitoringForPosition,
    getLineStats,
    getAreaStats,
  } = useMonitoring();

  // Active Area state
  const [selectedAreaId, setSelectedAreaId] = useState<string>(initialAreaId);
  // Active Line state (for Filling / Assembling)
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  const currentArea = areas.find((a) => a.id === selectedAreaId) || areas[0];
  const areaLines = lines.filter((l) => l.area_id === selectedAreaId && l.active);
  const currentLine = selectedLineId ? lines.find((l) => l.id === selectedLineId) : null;

  // Active positions to display (now 5S Indicators):
  const displayedPositions = currentArea.has_lines
    ? selectedLineId
      ? positions.filter((p) => p.area_id === currentArea.id && p.line_id === selectedLineId && p.active)
      : []
    : positions.filter((p) => p.area_id === currentArea.id && p.active);

  // Active stats for current view
  const currentViewStats = currentArea.has_lines && selectedLineId
    ? getLineStats(selectedDate, currentArea.id, selectedLineId)
    : getAreaStats(selectedDate, currentArea.id);

  // Rating grade helper
  const getGrade = (ptsPercentage: number) => {
    if (ptsPercentage >= 90) return { label: 'GRADE A · SANGAT BAIK', color: 'bg-emerald-600 text-white' };
    if (ptsPercentage >= 80) return { label: 'GRADE B · BAIK', color: 'bg-[#123C6E] text-white' };
    if (ptsPercentage >= 70) return { label: 'GRADE C · CUKUP', color: 'bg-[#FFB800] text-slate-900' };
    return { label: 'PERLU PENINGKATAN', color: 'bg-[#E32128] text-white' };
  };

  const gradeInfo = getGrade(currentViewStats.points_percentage);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <button
            onClick={() => {
              if (selectedLineId) {
                setSelectedLineId(null);
              } else {
                onBackToDashboard();
              }
            }}
            className="flex items-center gap-1 font-semibold text-[#123C6E] hover:text-[#E32128] transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{selectedLineId ? 'Kembali ke Pilihan Line' : 'Dashboard'}</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-800">{currentArea.name}</span>
          {currentLine && (
            <>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-[#E32128] font-mono">{currentLine.name}</span>
            </>
          )}
        </div>

        {/* Date indicator */}
        <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
          {formatIndonesianDate(selectedDate)}
        </div>
      </div>

      {/* Area Selector Tabs (Large Touch Buttons with Total Points) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {areas.map((area) => {
          const isSelected = area.id === selectedAreaId;
          const stat = getAreaStats(selectedDate, area.id);

          return (
            <button
              key={area.id}
              onClick={() => {
                setSelectedAreaId(area.id);
                setSelectedLineId(null);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#123C6E] border-[#123C6E] text-white shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider opacity-80">
                {area.code}
              </div>
              <div className="text-type-h3 truncate mt-0.5 font-bold">
                {area.name}
              </div>
              <div className="text-type-caption font-mono mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-1.5 opacity-90">
                <span>{stat.completed}/{stat.total} Check</span>
                <span className="opacity-70 hidden sm:inline">·</span>
                <span className="font-bold text-amber-300">
                  {stat.earned_points}/{stat.total_points} Poin ({stat.points_percentage}%)
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SCENARIO A: AREA HAS LINES AND NO LINE SELECTED YET (e.g. Filling or Assembling) */}
      {currentArea.has_lines && !selectedLineId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-type-h2 text-slate-900">
                PILIHAN LINE PRODUKSI — {currentArea.name}
              </h2>
              <p className="text-type-caption text-slate-500">
                Pilih salah satu line produksi untuk melihat akumulasi total poin dan mengisi indikator 5S
              </p>
            </div>
            {currentUser?.role === 'supervisor' && (
              <button
                onClick={onOpenAdminModal}
                className="text-xs font-semibold text-[#123C6E] hover:text-[#E32128] flex items-center gap-1 bg-[#123C6E]/5 px-3 py-1.5 rounded-lg border border-[#123C6E]/20 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Kelola Line</span>
              </button>
            )}
          </div>

          {/* Grid of Lines A through G with Points Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {areaLines.map((line) => {
              const lineStat = getLineStats(selectedDate, currentArea.id, line.id);
              const isAllDone = lineStat.total > 0 && lineStat.completed === lineStat.total;

              return (
                <button
                  key={line.id}
                  onClick={() => setSelectedLineId(line.id)}
                  className={`group relative text-left rounded-3xl p-5 border-2 transition-all touch-card flex flex-col justify-between min-h-[175px] cursor-pointer ${
                    isAllDone
                      ? 'bg-emerald-50/70 border-emerald-400 hover:border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-[#123C6E] hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">
                        STASIUN LINE
                      </span>
                      {isAllDone ? (
                        <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                          100% LENGKAP
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-[#946200] border border-amber-300 px-2 py-0.5 rounded-md">
                          DALAM PROSES
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 group-hover:text-[#123C6E] transition-colors">
                      {line.name}
                    </div>

                    {/* Total Points Callout Badge */}
                    <div className="mt-3 flex items-center justify-between bg-slate-50 border border-slate-200 group-hover:border-blue-200 rounded-xl px-3 py-2">
                      <div className="text-[11px] text-slate-500 uppercase font-mono font-semibold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#FFB800]" />
                        <span>Total Poin:</span>
                      </div>
                      <div className="text-sm font-extrabold font-mono text-[#123C6E]">
                        <span className="text-[#E32128]">{lineStat.earned_points}</span>
                        <span className="text-slate-400 font-normal"> / {lineStat.total_points} Poin</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Check status */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-xs font-mono font-bold text-slate-700 flex items-center justify-between">
                      <span>{lineStat.completed}/{lineStat.total} CHECK</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {lineStat.points_percentage}% Skor
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isAllDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#FFB800] to-[#123C6E]'
                        }`}
                        style={{ width: `${lineStat.points_percentage}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SCENARIO B: DISPLAY 5S INDICATORS (Depallitizer or Inside a Line) */}
      {(!currentArea.has_lines || selectedLineId) && (
        <div className="space-y-5">
          {/* PROMINENT TOTAL POINTS SCORECARD BANNER */}
          <div className="bg-gradient-to-r from-[#123C6E] via-[#0d2e54] to-[#081d38] border-2 border-[#123C6E] rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FFB800] text-slate-900 text-[11px] font-mono font-extrabold">
                    {currentArea.code} {currentLine ? `· ${currentLine.name}` : ''}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${gradeInfo.color}`}>
                    {gradeInfo.label}
                  </span>
                </div>
                <h2 className="text-type-h2 text-white font-bold">
                  AKUMULASI TOTAL POIN 5S
                </h2>
                <p className="text-type-caption text-white/80 mt-0.5">
                  Setiap indikator memiliki bobot poin standar. Selesaikan kontrol dan foto Before & After untuk mendapatkan poin maksimal.
                </p>
              </div>

              {/* Large Total Points Display */}
              <div className="bg-black/30 border border-white/20 rounded-2xl p-4 sm:px-6 flex items-center gap-4 self-start md:self-auto">
                <div className="w-12 h-12 rounded-xl bg-[#FFB800]/20 border border-[#FFB800]/40 flex items-center justify-center text-[#FFB800] shrink-0">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/70 font-mono font-semibold">
                    Total Poin Terkumpul
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white flex items-baseline gap-1">
                    <span className="text-[#FFB800]">{currentViewStats.earned_points}</span>
                    <span className="text-white/60 text-lg font-normal">/ {currentViewStats.total_points} Poin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="mt-5 pt-4 border-t border-white/15">
              <div className="flex items-center justify-between text-xs font-mono text-white/90 mb-2">
                <span>Pencapaian Poin: {currentViewStats.points_percentage}%</span>
                <span>{currentViewStats.completed} dari {currentViewStats.total} Indikator Terkontrol</span>
              </div>
              <div className="w-full h-3.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-[#FFB800] to-[#E32128] rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${currentViewStats.points_percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Header Controls for Indicators */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-type-h3 text-slate-900 font-bold">
                DAFTAR INDIKATOR MONITORING 5S
              </h3>
              <p className="text-type-caption text-slate-500">
                Tekan kartu indikator untuk melihat panduan detail apa yang harus dikontrol dan mengunggah foto Before-After.
              </p>
            </div>

            {currentUser?.role === 'supervisor' && (
              <button
                onClick={onOpenAdminModal}
                className="self-start sm:self-auto text-type-caption font-bold text-[#123C6E] hover:text-[#E32128] flex items-center gap-1 bg-[#123C6E]/10 px-3 py-1.5 rounded-xl border border-[#123C6E]/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah / Edit Indikator</span>
              </button>
            )}
          </div>

          {/* List of 5S Indicator Cards with Individual Point Value and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedPositions.map((pos) => {
              const record = getMonitoringForPosition(
                selectedDate,
                currentArea.id,
                currentLine?.id,
                pos.id
              );
              const isControlled = !!record;
              const stepBadge = getStepBadge(pos.step);

              if (isControlled) {
                // SUDAH DIKONTROL
                return (
                  <button
                    key={pos.id}
                    onClick={() => onOpenCompletedDetail(pos, currentArea, currentLine || undefined)}
                    className="relative text-left bg-slate-100/90 border-2 border-slate-300 rounded-3xl p-5 shadow-2xs hover:bg-slate-200/70 transition-all flex flex-col justify-between min-h-[220px] cursor-pointer group"
                  >
                    <div>
                      {/* Top Header: Indicator Code, Step, and Earned Points Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-type-caption font-mono font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">
                            {pos.code}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md border bg-slate-200 text-slate-700 border-slate-300">
                            {stepBadge.label}
                          </span>
                        </div>

                        {/* Points Earned Tag */}
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg font-mono">
                          <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                          <span>+{pos.std_score || 0} POIN DIPEROLEH</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-800 group-hover:text-slate-900 leading-snug">
                        {pos.name}
                      </h3>

                      {/* Penjelasan Apa yang Harus Dikontrol Box */}
                      <div className="mt-3 bg-white/70 border border-slate-200 rounded-xl p-3 text-xs">
                        <div className="font-bold text-slate-600 mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                          <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
                          <span>Yang Harus Dikontrol:</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {pos.explanation}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Metadata: Operator, Time, and Preview button */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-type-caption text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-semibold text-slate-700">{record.operator_name}</span>
                        <span>·</span>
                        <span>{record.time}</span>
                        <span>·</span>
                        <span className="text-slate-600">{record.shift}</span>
                      </div>
                      <span className="font-sans font-bold text-[#123C6E] group-hover:text-[#E32128] transition-colors ml-2 shrink-0 flex items-center gap-1">
                        Lihat Foto & Detail
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              }

              // BELUM DIKONTROL
              return (
                <button
                  key={pos.id}
                  onClick={() => onOpenMonitoringForm(pos, currentArea, currentLine || undefined)}
                  className="relative text-left bg-white hover:bg-slate-50 active:bg-slate-100 border-2 border-[#123C6E] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all touch-card flex flex-col justify-between min-h-[220px] cursor-pointer group"
                >
                  <div>
                    {/* Top Header: Indicator Code, Step, and Available Points Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-type-caption font-mono font-bold text-[#123C6E] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {pos.code}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${stepBadge.bg}`}>
                          {stepBadge.label}
                        </span>
                      </div>

                      {/* Potential Point Value Pill */}
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#123C6E] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg font-mono">
                        <Zap className="w-3.5 h-3.5 text-[#FFB800] fill-[#FFB800]" />
                        <span>+{pos.std_score || 0} POIN</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#123C6E] transition-colors leading-snug">
                      {pos.name}
                    </h3>

                    {/* Penjelasan Apa yang Harus Dikontrol (Prominent Box) */}
                    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs group-hover:border-blue-200 transition-colors">
                      <div className="font-bold text-[#123C6E] mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <ClipboardList className="w-3.5 h-3.5 text-[#E32128]" />
                        <span>Apa yang Harus Dikontrol:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {pos.explanation}
                      </p>

                      {pos.control_items && pos.control_items.length > 0 && (
                        <ul className="mt-2 space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                          {pos.control_items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#E32128] font-bold shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Bottom Footer: Potential Points & Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-type-caption font-mono text-slate-600 font-medium">
                      Status: <strong className="text-[#E32128]">Belum Terkontrol</strong>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#E32128] hover:bg-[#c9181f] px-3.5 py-1.5 rounded-xl shadow-xs group-hover:translate-x-0.5 transition-all">
                      <span>Mulai Kontrol (+{pos.std_score || 0} Poin)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {displayedPositions.length === 0 && (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <div className="font-bold text-slate-700 text-sm">Belum Ada Indikator Dikonfigurasi</div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Silakan hubungi Supervisor atau buka panel master data untuk menambahkan indikator audit 5S pada line ini.
              </p>
              {currentUser?.role === 'supervisor' && (
                <button
                  onClick={onOpenAdminModal}
                  className="mt-3 px-4 py-2 bg-[#123C6E] text-white rounded-lg text-xs font-semibold hover:bg-[#0d2a4d] cursor-pointer"
                >
                  Tambah Indikator Sekarang
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
